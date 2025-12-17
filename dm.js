const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('anon')
        .setDescription('Send a fake giveaway DM')
        .addStringOption(option => 
            option.setName('user_id')
                .setDescription('Target user ID')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('messaggio')
                .setDescription('Message from host')
                .setRequired(true)),

    async execute(interaction) {
        const userId = interaction.options.getString('user_id');
        const messageText = interaction.options.getString('messaggio');

        try {
            // Cerca l'utente tramite l'ID fornito
            const user = await interaction.client.users.fetch(userId);
            
            // Dati per l'embed
            const now = Math.floor(Date.now() / 1000);
            const hostId = "1420972211988336640"; // L'ID dell'host richiesto
            const entries = Math.floor(Math.random() * 2000) + 1200;
            const extraWinners = Math.floor(Math.random() * 40) + 10;

            const embed = new EmbedBuilder()
                .setTitle(`🎉 Giveaway Ended`)
                .setDescription(
                    `Ended: <t:${now}:R> (<t:${now}:f>)\n` +
                    `Hosted by: <@${hostId}>\n` +
                    `Entries: **${entries}**\n` +
                    `Winners: <@${userId}> + **${extraWinners} more** (hidden)!\n\n` +
                    `**Message from Host:**\n${messageText}\n\n` +
                    `Use the button below to redeem your prize!`
                )
                .setColor('#2b2d31');

            // Bottone con il link di invito
            const row = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setLabel('Join To Redeem')
                    .setURL('https://discord.gg/qKrwR7hb')
                    .setStyle(ButtonStyle.Link)
            );

            // Invia il DM all'utente
            await user.send({ embeds: [embed], components: [row] });
            
            // Conferma all'autore del comando (visibile solo a lui)
            await interaction.reply({ content: '✅ Giveaway DM sent successfully!', ephemeral: true });

        } catch (error) {
            console.error(error);
            await interaction.reply({ 
                content: '❌ Failed to send DM. The user might have DMs disabled or no shared servers.', 
                ephemeral: true 
            });
        }
    },
};
