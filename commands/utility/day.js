const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const getDayPerformance = require('../../api/day.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("dia")
        .setDescription("Mostra informações das runs de um dia específico da roleta!")
        .addStringOption(option => 
            option.setName('data')
                .setDescription('Data da roleta (Ex: 15/02/2026)')
        ),
    async execute(interaction){

        // Get params if given
        const date = interaction.options.getString('data')

        await interaction.deferReply()

        // Get data from API
        const data = await getDayPerformance(date)

        // Data not found for especified date return
        if (!data || data.length == 0) {
            await interaction.editReply({ content: "Não foram encontrados dados para a data especificada!" })
            return
        }

        const dayEmbed = new EmbedBuilder()
            .setColor(0xff0000)
            .setAuthor({ 
                name: 'Donleta', 
                iconURL: 'https://static-cdn.jtvnw.net/jtv_user_pictures/52b34c20-8c4c-45a5-ac4b-0f027610d330-profile_image-70x70.png', 
                url: 'https://twitch.com/don_nobru' 
            })
            .setTimestamp()
            .setFooter({ 
                text: 'Donleta', 
                iconURL: 'https://static-cdn.jtvnw.net/jtv_user_pictures/52b34c20-8c4c-45a5-ac4b-0f027610d330-profile_image-70x70.png' 
            });

        dayEmbed.setTitle(`Resultados (${data.date.period})`)

        data.runs.forEach((run) => {
            dayEmbed.addFields(
                { 
                    name: `${run.participant.name}`, 
                    value: `**Time** *${run.characters[0].name}* **(${run.characters[0].score})** | *${run.characters[1].name}* **(${run.characters[1].score})**\n**Boss:** *${run.boss.name}* **(${run.boss.score})**\n**Tempo:** *${run.time.description}* **(${run.time.score})**\n\u200B\n*Pontos: ${run.score}*\n\u200B`
                },        
            )
        })

        await interaction.editReply({ embeds: [dayEmbed] })
    }
}