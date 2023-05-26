import { VoiceState } from 'discord.js';
import { disableLimit, showEmbed } from '../voiceLocker/function/vcStateEvent';
import { logger } from '../common/logger';

export async function call(oldState: VoiceState, newState: VoiceState) {
    try {
        if (oldState.channelId === newState.channelId) {
            // run when muted.
        } else if (oldState.channelId === null && newState.channelId != null) {
            // run when connected
            await showEmbed(newState);
        } else if (oldState.channelId != null && newState.channelId === null) {
            // run when disconnected
            await disableLimit(oldState);
        } else {
            // run when moving channel
            await showEmbed(newState);
            await disableLimit(oldState);
        }
    } catch (error) {
        logger.error(error);
    }
}
