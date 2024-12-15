import fs from 'node:fs';
import path from 'node:path';
import { Client } from 'discord.js';

export const registerEvents = (client: Client) => {
    const eventsPath = path.join(__dirname, '..', 'events');
    const eventFiles = fs
        .readdirSync(eventsPath)
        .filter(file => file.endsWith(process.env.NODE_ENV === 'production' ? '.js' : '.ts'));

    for (const file of eventFiles) {
        const eventPath = path.join(eventsPath, file);
        const event = require(eventPath);

        if (event.once) {
            client.once(event.name, (...args) => event.execute(...args));
        } else {
            client.on(event.name, (...args) => event.execute(...args));
        }
    }
};
