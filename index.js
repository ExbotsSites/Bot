const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config();

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once('ready', () => {
    console.log(`Bot online come ${client.user.tag}`);
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'anon') {
        const targetId = interaction.options.getString('target_id');
        const messaggio = interaction.options.getString('messaggio');

        try {
            const user = await client.users.fetch(targetId);
            const nomiAcaso = ["Viandante", "Anonimo", "Shadow", "Ghost"];
            const nomeFake = nomiAcaso[Math.floor(Math.random() * nomiAcaso.length)];

            await user.send(`**Messaggio da ${nomeFake}:**\n${messaggio}`);
            
            await interaction.reply({ content: 'Messaggio inviato correttamente!', ephemeral: true });
        } catch (error) {
            await interaction.reply({ content: 'Errore: Non ho potuto inviare il DM. L\'utente ha i messaggi chiusi o l\'ID è errato.', ephemeral: true });
        }
    }
});

client.login(process.env.TOKEN);
