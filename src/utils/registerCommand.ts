import { REST, Routes } from 'discord.js';
import fs from 'node:fs';
import path from 'node:path';

export const registerCommands = async (client: any, clientId: string, guildId: string, token: string) => {
    const commandsPath = path.join(__dirname, '..', 'commands');
    const commandFolders = fs.readdirSync(commandsPath);

    for (const folder of commandFolders) {
        const folderPath = path.join(commandsPath, folder);
        const commandFiles = fs
            .readdirSync(folderPath)
            .filter(file => file.endsWith(process.env.NODE_ENV === 'production' ? '.js' : '.ts'));

        for (const file of commandFiles) {
            const commandPath = path.join(folderPath, file);
            const command = require(commandPath);

            if ('data' in command && 'execute' in command) {
                client.comandos.set(command.data.name, command);
            } else {
                console.warn(`[AVISO] Comando em ${commandPath} não possui "data" ou "execute".`);
            }
        }
    }

    const commands = client.comandos.map((command: any) => command.data.toJSON());
    const rest = new REST({ version: '10' }).setToken(token);

    try {
        console.log(`Registrando ${commands.length} comandos de barra.`);
        await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands });
        console.log('Comandos registrados com sucesso!');
    } catch (error) {
        console.error('Erro ao registrar comandos:', error);
    }
};
