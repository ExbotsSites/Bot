const { REST, Routes, SlashCommandBuilder } = require('discord.js');
require('dotenv').config();

// Definiamo il comando con SOLO l'opzione user_id
const commands = [
    new SlashCommandBuilder()
        .setName('anon')
        .setDescription('Send a fake giveaway DM')
        .addStringOption(option => 
            option.setName('user_id')
                .setDescription('The ID of the user')
                .setRequired(true)),
].map(command => command.toJSON());

// Usiamo il tuo TOKEN dal file .env
const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
    try {
        console.log('Inizio aggiornamento comandi slash...');

        // Inserisco il tuo ID direttamente qui per evitare "undefined"
        await rest.put(
            Routes.applicationCommands("1450839906736803981"), 
            { body: commands },
        );

        console.log('✅ Comandi aggiornati con successo! Ora /anon non chiederà più il messaggio.');
    } catch (error) {
        console.error('❌ Errore durante il deploy:', error);
    }
})();
