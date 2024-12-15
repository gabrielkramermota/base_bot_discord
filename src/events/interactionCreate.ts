import { Events } from "discord.js";

const { MessageFlags } = require('discord.js');

module.exports = {
    name: Events.InteractionCreate,
    execute(interaction: any) {
        if (!interaction.isChatInputCommand()) return;

        const command = interaction.client.commands.get(interaction.commandName);

        if (!command) {
            console.error(`Comando não encontrado: ${interaction.commandName}`);
            return;
        }

        try {
            command.execute(interaction);
        } catch (error) {
            console.error('Erro ao executar o comando:', error);
            if (interaction.replied || interaction.deferred) {
                interaction.followUp({ content: 'Houve um erro ao executar este comando!', flags: MessageFlags.Ephemeral });
            } else {
                interaction.reply({ content: 'Houve um erro ao executar este comando!', flags: MessageFlags.Ephemeral });
            }
        }
    },
};
