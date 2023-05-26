import { VoiceState } from 'discord.js';
import { searchChannelById } from '../../manager/channelManager';
import { vclChannelSettingService } from '../../dbServices/vclChannelSettingService';
import { assertExistCheck, exists, notExists } from '../../common/exists';
import { vclGlobalSettingService } from '../../dbServices/vclGlobalSettingService';
import { createButtons, createEmbed, getVoiceChannelState } from './components';
import { sleep } from '../../common/sleep';
import { searchMessageById } from '../../manager/messageManager';

export async function disableLimit(voiceState: VoiceState) {
    const vclSetting = await vclGlobalSettingService.getSetting(voiceState.guild.id);
    if (notExists(vclSetting) || !vclSetting.isEnabled) {
        return;
    }

    assertExistCheck(voiceState.channelId, 'voiceState.channelId');

    const channelId = voiceState.channelId;

    const lockChannel = await vclChannelSettingService.getChannelSetting(voiceState.guild.id, channelId);

    const channel = await searchChannelById(voiceState.guild, channelId);

    if (notExists(channel) || !channel.isVoiceBased()) {
        return;
    }

    if (channel.members.size === 0) {
        // "channelSetting.defaultLimit" === null or -1(use Global) -> use "GlobalSetting.defaultLimit"
        if (notExists(lockChannel) || notExists(lockChannel.defaultLimit) || lockChannel.defaultLimit === -1) {
            channel.setUserLimit(vclSetting.defaultLimit);
        } else {
            channel.setUserLimit(lockChannel.defaultLimit);
        }
    }
}

export async function showEmbed(voiceState: VoiceState) {
    try {
        const vclSetting = await vclGlobalSettingService.getSetting(voiceState.guild.id);
        if (notExists(vclSetting) || !vclSetting.isEnabled) {
            return;
        }

        assertExistCheck(voiceState.channelId, 'voiceState.channelId');

        const channelId = voiceState.channelId;

        const lockChannel = await vclChannelSettingService.getChannelSetting(voiceState.guild.id, channelId);

        // "channelSetting.autoMessage" === null or global(use Global) -> use "GlobalSetting.autoMessage"
        if (notExists(lockChannel) || notExists(lockChannel.autoMessage) || lockChannel.autoMessage === 'global') {
            if (vclSetting.autoMessage === 'off') return;
        } else {
            if (lockChannel.autoMessage === 'off') return;
        }

        const channel = await searchChannelById(voiceState.guild, channelId);

        if (notExists(channel) || !channel.isVoiceBased()) {
            return;
        }

        const channelState = await getVoiceChannelState(channel);

        const embed = createEmbed(channelState);
        const button = createButtons(channelState);

        const panelMessage = await channel.send({
            embeds: [embed],
            components: [button],
        });

        // "channelSetting.messageDeletionTime" === null or -1(use Global) -> use "GlobalSetting.messageDeletionTime"
        if (notExists(lockChannel) || notExists(lockChannel.messageDeletionTime) || lockChannel.messageDeletionTime === -1) {
            if (vclSetting.messageDeletionTime === 0) {
                return;
            } else {
                await sleep(vclSetting.messageDeletionTime);
            }
        } else {
            if (lockChannel.messageDeletionTime === 0) {
                return;
            } else {
                await sleep(lockChannel.messageDeletionTime);
            }
        }

        const checkPanelMessage = await searchMessageById(voiceState.guild, channel.id, panelMessage.id);
        if (exists(checkPanelMessage)) {
            await checkPanelMessage.delete();
        }
    } catch (error) {
        console.error(error);
    }
}
