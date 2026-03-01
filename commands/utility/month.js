const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const getMonthPerformance = require('../../api/month.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rank')
        .setDescription('Monstra informações sobre os rankings mensais da roleta!')
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
    async execute(interaction) {

        // Get params if given
        const month = interaction.options.getString('mês')
        const year = interaction.options.getString('ano')

        const edition = null

        if (month && year) {
            edition = month.join('/', year)
        }

        await interaction.deferReply()

        // Get data from API
        const data = await getMonthPerformance(edition)

        // Data not found for especified month return
        if(!data || data.length == 0) {
            await interaction.editReply({ content: "Não foram encontrados dados para o mês especificado!" })
            return
        }

        let rankFieldValues = ``

        rankings = data.rankings

        rankings.forEach(info => {
            rankFieldValues += `**${info.participant.name}** \u2014 *${info.score}*\n`
        })

        const rankEmbed = new EmbedBuilder()
            .setColor(0xff0000)
            .setTitle(`Ranking (${data.edition})`)
            .setAuthor({ 
                name: 'Donleta', 
                iconURL: 'https://static-cdn.jtvnw.net/jtv_user_pictures/52b34c20-8c4c-45a5-ac4b-0f027610d330-profile_image-70x70.png', 
                url: 'https://twitch.com/don_nobru' 
            })
            .addFields(
                { name: '\u200B', value: rankFieldValues}
            )
            .setTimestamp()
            .setFooter({ 
                text: 'Donleta', 
                iconURL: 'https://static-cdn.jtvnw.net/jtv_user_pictures/52b34c20-8c4c-45a5-ac4b-0f027610d330-profile_image-70x70.png' 
            });

        await interaction.editReply({ embeds: [rankEmbed]})
    }

}