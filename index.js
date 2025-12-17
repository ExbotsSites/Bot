const { Client, GatewayIntentBits, Collection, Partials } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');
const express = require('express');
require('dotenv').config();

// --- SERVER PER RENDER ---
const app = express();
app.get('/', (req, res) => res.send('Bot Status: Online ✅'));
app.listen(process.env.PORT || 3000);

// --- CONFIGURAZIONE CLIENT ---
const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.DirectMessages, 
        GatewayIntentBits.GuildMembers
    ],
    partials: [Partials.Channel] 
});

client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');

// Legge i file nella cartella 'commands'
if (fs.existsSync(commandsPath)) {
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
        }
    }
}

// --- GESTIONE COMANDI (SOLO QUELLI NEI FILE) ---
client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({ content: 'Error executing command!', ephemeral: true });
        } else {
            await interaction.reply({ content: 'Error executing command!', ephemeral: true });
        }
    }
});

client.login(process.env.TOKEN);
