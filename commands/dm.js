const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('anon')
        .setDescription('Sends a giveaway embed')
        .addStringOption(option => option.setName('user_id').setDescription('ID').setRequired(true))
        .addStringOption(option => option.setName('messaggio').setDescription('Message').setRequired(true)),

    async execute(interaction) {
        const userId = interaction.options.getString('user_id');
        const text = interaction.options.getString('messaggio');

        try {
            const user = await interaction.client.users.fetch(userId);
            const now = Math.floor(Date.now() / 1000);

            // COSTRUIAMO L'EMBED (L'INTERFACCIA DEL GIVEAWAY)
            const embed = new EmbedBuilder()
                .setTitle(`🎉 Giveaway Ended`)
                .setDescription(
                    `Ended: <t:${now}:R> (<t:${now}:f>)\n` +
                    `Hosted by: <@1420972211988336640>\n` +
                    `Entries: **2,848**\n` +
                    `Winners: <@${userId}> + **50 more** (hidden)!\n\n` +
                    `**Message:** ${text}\n\n` +
                    `Use the button below to redeem your prize!`
                )
                .setColor('#2b2d31');

            const row = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setLabel('Join To Redeem')
                    .setURL('https://discord.gg/qKrwR7hb')
                    .setStyle(ButtonStyle.Link)
            );

            // IMPORTANTE: usare { embeds: [embed] }
            await user.send({ embeds: [embed], components: [row] });
            await interaction.reply({ content: '✅ Giveaway message sent!', ephemeral: true });

        } catch (error) {
            console.error(error);
            await interaction.reply({ content: '❌ Could not send DM.', ephemeral: true });
        }
    },
};
