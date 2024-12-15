import { Client, Collection, GatewayIntentBits } from 'discord.js';
import dotenv from 'dotenv';
import { registerCommands } from './utils/registerCommand';
import { registerEvents } from './utils/registerEvents';

dotenv.config();

const token = process.env.TOKEN!;
const clientId = process.env.CLIENT_ID!;
const guildId = process.env.GUILD_ID!;

if (!token || !clientId || !guildId) {
    console.error('Token, clientId ou guildId não encontrados no arquivo .env');
    process.exit(1);
}

const client = new Client({ intents: [GatewayIntentBits.Guilds] }) as any;
client.comandos = new Collection();

(async () => {
    try {
        // Carregar comandos e eventos
        await registerCommands(client, clientId, guildId, token);
        registerEvents(client);

        // Login do bot
        await client.login(token);
        console.log('Bot iniciado com sucesso!');
    } catch (error) {
        console.error('Erro ao iniciar o bot:', error);
        process.exit(1);
    }
})();
