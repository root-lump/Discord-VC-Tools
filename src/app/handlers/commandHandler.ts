import { CacheType, ChatInputCommandInteraction } from 'discord.js';
import { commandNames } from '../../commandNames';
import { voiceLockerCommand } from '../voiceLocker/function/commandEvent';
import { vclSettingHandler } from '../voiceLocker/settings/commandEvent';
import { logger } from '../common/logger';

export async function call(interaction: ChatInputCommandInteraction<CacheType>) {
    const { commandName } = interaction;
    if (interaction.replied || interaction.deferred) {
        logger.warn('interaction has been already replied');
        return;
    }

    if (commandName === commandNames.vcTools) {
        await voiceLockerCommand(interaction);
    } else if (commandName === commandNames.voiceLockerSettings) {
        await vclSettingHandler(interaction);
    }
    return;
}
