const { REST, Routes, SlashCommandBuilder } = require('discord.js');
require('dotenv').config();

const commands = [
    new SlashCommandBuilder()
        .setName('anon')
        .setDescription('Invia un messaggio anonimo in DM')
        .addStringOption(option => 
            option.setName('target_id').setDescription('ID dell\'utente').setRequired(true))
        .addStringOption(option => 
            option.setName('messaggio').setDescription('Cosa vuoi scrivere').setRequired(true)),
].map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
    try {
        console.log('Registrazione comandi slash in corso...');
        await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID),
            { body: commands },
        );
        console.log('Comandi registrati con successo!');
    } catch (error) {
        console.error(error);
    }
})();
