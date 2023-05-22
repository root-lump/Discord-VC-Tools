import { ChatInputCommandInteraction } from 'discord.js';
import { changeVclGlobalSetting } from './changeGlobalSetting';
import { changeVclChannelSetting } from './changeChannelSetting';

/*
 * behavior when a slash command is typed
 */
export async function vclSettingHandler(interaction: ChatInputCommandInteraction) {
    const subcommandGroup = interaction.options.getSubcommandGroup();
    const subcommand = interaction.options.getSubcommand();

    if (subcommandGroup === 'global') {
        if (subcommand === 'setting') {
            await changeVclGlobalSetting(interaction);
        }
    } else if (subcommandGroup === 'channel') {
        if (subcommand === 'setting') {
            await changeVclChannelSetting(interaction);
        }
    }
}
