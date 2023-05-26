import { Guild } from 'discord.js';
import { searchChannelById } from './channelManager';
import { exists } from '../common/exists';
import { logger } from '../common/logger';

/**
 * Search message by ID. If message is not exist, return null.
 * @param {Guild} guild Guild Object
 * @param {string} messageId Message ID
 * @returns GuildMember Object or null
 */
export async function searchMessageById(guild: Guild, channelId: string, messageId: string) {
    const channel = await searchChannelById(guild, channelId);
    let message = null;
    if (exists(channel) && channel.isTextBased()) {
        try {
            // fetch(channelId): fetch if not in cache
            message = await channel.messages.fetch(messageId);
        } catch (error) {
            message = null;
            logger.warn('message missing');
        }
    }
    return message;
}
