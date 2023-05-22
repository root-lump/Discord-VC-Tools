import { Guild } from 'discord.js';

/**
 * Search member by ID. If channel is not exist, return null.
 * @param {Guild} guild Guild Object
 * @param {string} userId User ID
 * @returns GuildMember Object or null
 */
export async function searchMemberById(guild: Guild, userId: string) {
    try {
        // fetch(userId): fetch if not in cache
        return await guild.members.fetch(userId);
    } catch (error) {
        console.warn('member missing');
        return null;
    }
}
