import { CacheType, ChatInputCommandInteraction } from 'discord.js';
import { commandNames } from '../../commandNames';
import { voiceLockerCommand } from '../voiceLocker/function/commandEvent';
import { vclSettingHandler } from '../voiceLocker/settings/commandEvent';

export async function call(interaction: ChatInputCommandInteraction<CacheType>) {
    const { commandName } = interaction;
    if (interaction.replied || interaction.deferred) {
        console.warn('interaction has been already replied');
        return;
    }

    if (commandName === commandNames.vcTools) {
        await voiceLockerCommand(interaction);
    } else if (commandName === commandNames.voiceLockerSettings) {
        await vclSettingHandler(interaction);
    }
    return;
}
