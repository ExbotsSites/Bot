const { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const express = require('express');
require('dotenv').config();

// --- 1. CONFIGURAZIONE WEB SERVER (Per Render) ---
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => res.send('Bot Online! Per tenerlo sveglio usa un servizio di ping.'));
app.listen(PORT, () => console.log(`Server HTTP attivo sulla porta ${PORT}`));

// --- 2. CONFIGURAZIONE BOT DISCORD ---
const client = new Client({ 
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.DirectMessages] 
});

const commands = [
    new SlashCommandBuilder()
        .setName('anon')
        .setDescription('Invia un DM anonimo a un utente')
        .addStringOption(option => 
            option.setName('user_id').setDescription('L\'ID dell\'utente destinatario').setRequired(true))
        .addStringOption(option => 
            option.setName('messaggio').setDescription('Il messaggio da inviare').setRequired(true)),
].map(command => command.toJSON());

// --- 3. REGISTRAZIONE COMANDI E AVVIO ---
client.once('ready', async () => {
    console.log(`Loggato come ${client.user.tag}`);
    
    const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);
    try {
        console.log('Sincronizzazione comandi slash...');
        await rest.put(
            Routes.applicationCommands(client.user.id),
            { body: commands },
        );
        console.log('Comandi sincronizzati!');
    } catch (error) {
        console.error('Errore nel caricamento comandi:', error);
    }
});

// --- 4. LOGICA DEL COMANDO ---
client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'anon') {
        const userId = interaction.options.getString('user_id');
        const testo = interaction.options.getString('messaggio');

        // Nomi casuali
        const nomi = ["Ombra", "Viandante", "AgenteX", "Utente77", "Fantasma"];
        const nomeScelto = nomi[Math.floor(Math.random() * nomi.length)];

        try {
            const user = await client.users.fetch(userId);
            
            const embed = new EmbedBuilder()
                .setTitle(`🤫 Hai ricevuto un messaggio anonimo`)
                .setDescription(testo)
                .setFooter({ text: `Inviato da: ${nomeScelto}` })
                .setColor('#2b2d31');

            await user.send({ embeds: [embed] });
            
            await interaction.reply({ content: '✅ Messaggio inviato in segreto!', ephemeral: true });
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: '❌ Errore: Non ho potuto inviare il DM. L\'utente potrebbe avere i messaggi chiusi.', ephemeral: true });
        }
    }
});

client.login(process.env.TOKEN);
