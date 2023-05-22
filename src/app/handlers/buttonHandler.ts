import { ButtonInteraction, CacheType } from 'discord.js';
import { voiceLockerUpdate } from '../voiceLocker/function/buttonEvent';

export async function call(interaction: ButtonInteraction<CacheType>) {
    const voiceLockerIds = ['voiceLock_inc', 'voiceLock_dec', 'voiceLock_change'];
    if (voiceLockerIds.includes(interaction.customId)) {
        await voiceLockerUpdate(interaction);
    }
    return;
}
