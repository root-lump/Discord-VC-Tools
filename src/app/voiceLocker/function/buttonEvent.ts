import { ButtonInteraction } from 'discord.js';
import { searchMemberById } from '../../manager/memberManager';
import { createButtons, createEmbed, getVoiceChannelState } from './components';
import { assertExistCheck } from '../../common/exists';

/*
 * Action when button is pressed
 */
export async function voiceLockerUpdate(interaction: ButtonInteraction) {
    if (!interaction.inGuild()) return;

    assertExistCheck(interaction.guild, 'interaction.guild');
    assertExistCheck(interaction.channel, 'interaction.channel');

    const guild = await interaction.guild.fetch();

    const member = await searchMemberById(guild, interaction.member.user.id);
    const channel = interaction.channel;

    assertExistCheck(member, 'member');

    if (!channel.isVoiceBased()) {
        await interaction.reply({
            content: 'このチャンネルでは利用できません。',
            ephemeral: true,
        });
        return;
    }

    // Number of members in voice channel
    const voiceMemberNum = channel.members.size;

    // Return message if member is not in vc or connected to different vc.
    if (!channel.isVoiceBased() || member.voice.channel == null || member.voice.channel.id != channel.id) {
        await interaction.reply({
            content: '対象のボイスチャンネルに接続する必要があります。\n接続してから再度お試しください。',
            ephemeral: true,
        });
        return;
    }

    const channelLockState = await getVoiceChannelState(channel);

    let limit = Number(channelLockState.limit);

    // When you press the 'LOCK' button or 'UNLOCK' button
    if (interaction.customId == 'voiceLock_change') {
        const label = interaction.component.label; // Get the state to set from the button label
        if (label === 'LOCK') {
            await channel.setUserLimit(voiceMemberNum);
            channelLockState.isLock = true;
            channelLockState.limit = voiceMemberNum;
        } else if (label === 'UNLOCK') {
            await channel.setUserLimit(0);
            channelLockState.isLock = false;
            channelLockState.limit = 0;
        }
    }

    // Check for Embed operation
    if (channelLockState.isLock) {
        if (interaction.customId === 'voiceLock_inc') {
            // do nothing when pressed with '99'
            if (limit != 99) {
                limit += 1;
                channelLockState.limit = limit;
                await channel.setUserLimit(limit);
            }
        } else if (interaction.customId === 'voiceLock_dec') {
            // do nothing when pressed with '1'
            if (limit != 1) {
                limit -= 1;
                channelLockState.limit = limit;
                await channel.setUserLimit(limit);
            }
        }
    } else {
        // Behavior when '+'or'-' is pressed even though it is not locked
        if (interaction.customId === 'voiceLock_inc' || interaction.customId === 'voiceLock_dec') {
            await interaction
                .reply({
                    content: '現在ボイスチャンネルはロックされていません。',
                    ephemeral: true,
                    fetchReply: true,
                })
                .catch((error) => {
                    console.error(error);
                });
            return;
        }
    }

    await interaction
        .update({
            embeds: [createEmbed(channelLockState)],
            components: [createButtons(channelLockState)],
            fetchReply: true,
        })
        .catch((error) => {
            console.error(error);
        });
}
