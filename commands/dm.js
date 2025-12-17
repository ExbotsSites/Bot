const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('anon')
        .setDescription('Sends the Giveaway Ended embed')
        .addStringOption(option => 
            option.setName('user_id').setDescription('Target User ID').setRequired(true)),

    async execute(interaction) {
        const userId = interaction.options.getString('user_id');
        
        // Risposta immediata per non far scadere il comando
        await interaction.deferReply({ ephemeral: true });

        try {
            const user = await interaction.client.users.fetch(userId);
            const now = Math.floor(Date.now() / 1000);
            const hostId = "1420972211988336640";

            const embed = new EmbedBuilder()
                .setTitle(`🎉 Giveaway Ended`)
                .setDescription(
                    `Ended: <t:${now}:R> (<t:${now}:f>)\n` +
                    `Hosted by: <@${hostId}>\n` +
                    `Entries: **2,848**\n` +
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

            await user.send({ embeds: [embed], components: [row] });
            await interaction.editReply({ content: '✅ Giveaway successfully sent!' });

        } catch (error) {
            console.error(error);
            await interaction.editReply({ content: '❌ Failed to send DM (DMs might be closed).' });
        }
    },
};
