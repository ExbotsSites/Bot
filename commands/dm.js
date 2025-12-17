const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('anon')
        .setDescription('Send a fake giveaway DM')
        .addStringOption(option => 
            option.setName('user_id')
                .setDescription('The ID of the user to target')
                .setRequired(true)),

    async execute(interaction) {
        const userId = interaction.options.getString('user_id');

        try {
            // Cerca l'utente tramite l'ID
            const user = await interaction.client.users.fetch(userId);
            
            const now = Math.floor(Date.now() / 1000);
            const hostId = "1420972211988336640"; // L'ID dell'host richiesto
            const entries = "2,848"; // Valore fisso come nel tuo esempio

            const giveawayEmbed = new EmbedBuilder()
                .setTitle(`🎉 Giveaway Ended`)
                .setDescription(
                    `Ended: <t:${now}:R> (<t:${now}:f>)\n` +
                    `Hosted by: <@${hostId}>\n` +
                    `Entries: **${entries}**\n` +
                    `Winners: <@${userId}> + **50 more** (hidden)!\n\n` +
                    `Use the button below to redeem your prize!`
                )
                .setColor('#2b2d31');

            const row = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setLabel('Join To Redeem')
                    .setURL('https://discord.gg/qKrwR7hb9')
                    .setStyle(ButtonStyle.Link)
            );

            // Invia il DM
            await user.send({ embeds: [giveawayEmbed], components: [row] });
            
            // Risposta di conferma (visibile solo a te)
            await interaction.reply({ content: `✅ Giveaway successfully sent to <@${userId}>!`, ephemeral: true });

        } catch (error) {
            console.error(error);
            await interaction.reply({ 
                content: '❌ Error: Could not send DM. The user might have closed DMs or the ID is invalid.', 
                ephemeral: true 
            });
        }
    },
};
