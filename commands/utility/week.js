const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const getWeekPerformance = require('../../api/week.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("semana")
        .setDescription("Mostra informações das runs de uma semana específica da roleta!")
        .addStringOption(option => 
            option.setName("semana")
                .setDescription("semana do mês")
                .addChoices(
                    {name: "Semana 1", value: "1"},
                    {name: "Semana 2", value: "2"},
                    {name: "Semana 3", value: "3"},
                    {name: "Semana 4", value: "4"}
                )
        )
        .addStringOption(option => 
            option.setName("mês")
                .setDescription("mês da roleta")
                .addChoices(
                    {name: "Janeiro", value: "janeiro"},
                    {name: "Fevereiro", value: "fevereiro"},
                    {name: "Março", value: "março"},
                    {name: "Abril", value: "abril"},
                    {name: "Maio", value: "maio"},
                    {name: "Junho", value: "junho"},
                    {name: "Julho", value: "julho"},
                    {name: "Agosto", value: "agosto"},
                    {name: "Setembro", value: "setembro"},
                    {name: "Outubro", value: "outubro"},
                    {name: "Novembro", value: "novembro"},
                    {name: "Dezembro", value: "dezembro"},
                )
        )
        .addStringOption(option => 
            option.setName("ano")
                .setDescription("ano da roleta (Ex: 2026)")
        ),
    async execute(interaction){

        // Get params if given
        const week = interaction.options.getString("semana")
        const month = interaction.options.getString("mês")
        const year = interaction.options.getString("ano")

        const edition = null

        if (month && year) {
            edition = month.join('/', year)
        }

        await interaction.deferReply()

        // Get data from API
        const data = await getWeekPerformance(week, edition)

        // Data not found for especified input return
        if (!data || data.length == 0) {
            await interaction.editReply({ content: "Não foram encontrados dados para a semana e mês especificados!" })
            return
        }

        let weekFieldValues = ``

        data.forEach(info => {
            weekFieldValues += `**${info.participant.name}** \u2014 *${info.scores.join('; ')}*\n`
        })

        const weekEmbed = new EmbedBuilder()
            .setColor(0xff0000)
            .setTitle('Resultados Semanais')
            .setAuthor({ 
                name: 'Donleta', 
                iconURL: 'https://static-cdn.jtvnw.net/jtv_user_pictures/52b34c20-8c4c-45a5-ac4b-0f027610d330-profile_image-70x70.png', 
                url: 'https://twitch.com/don_nobru' 
            })
            .addFields(
                { name: '\u200B', value: weekFieldValues}
            )
            .setTimestamp()
            .setFooter({ 
                text: 'Donleta', 
                iconURL: 'https://static-cdn.jtvnw.net/jtv_user_pictures/52b34c20-8c4c-45a5-ac4b-0f027610d330-profile_image-70x70.png' 
            });

        await interaction.editReply({ embeds: [weekEmbed] })
    }
}