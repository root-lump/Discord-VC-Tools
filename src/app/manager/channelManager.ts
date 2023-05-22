import { Guild } from 'discord.js';

/**
 * Search channel by ID. If channel is not exist, return null.
 * @param {Guild} guild Guild Object
 * @param {string} channelId Channel ID
 * @returns Channel Object or null
 */
export async function searchChannelById(guild: Guild, channelId: string) {
    try {
        // fetch(channelId): fetch if not in cache
        return await guild.channels.fetch(channelId);
    } catch (error) {
        console.warn('channel missing');
        return null;
    }
}
