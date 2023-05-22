import { ChatInputCommandInteraction } from 'discord.js';
import { assertExistCheck, exists, notExists } from '../../common/exists';
import { sleep } from '../../common/sleep';
import { vclChannelSettingService } from '../../dbServices/vclChannelSettingService';
import { vclGlobalSettingService } from '../../dbServices/vclGlobalSettingService';
import { searchMemberById } from '../../manager/memberManager';
import { createButtons, createEmbed, getVoiceChannelState } from './components';

/*
 * behavior when a slash command is typed
 */
export async function voiceLockerCommand(interaction: ChatInputCommandInteraction) {
    if (!interaction.inGuild()) return;

    const vclSetting = await vclGlobalSettingService.getSetting(interaction.guildId);
    if (notExists(vclSetting) || !vclSetting.isEnabled) {
        return await interaction.reply('機能が有効化されていません。\nサーバー管理者にお問い合わせください。');
    }

    assertExistCheck(interaction.guild, 'interaction.guild');
    assertExistCheck(interaction.channel, 'interaction.channel');

    const guild = await interaction.guild.fetch();
    const channel = interaction.channel;

    const member = await searchMemberById(guild, interaction.member.user.id);

    assertExistCheck(member, 'member');

    const availableChannels = await vclChannelSettingService.getAllChannelSettings(guild.id);

    const lockChannel = availableChannels.find((c) => c.channelId === channel.id);

    if (!channel.isVoiceBased() || (exists(lockChannel) && !lockChannel.isEnabled)) {
        await interaction.reply({
            content: 'このチャンネルでは利用できません。',
            ephemeral: true,
        });
        return;
    }

    // Return message if member is not in vc or connected to different vc.
    if (member.voice.channel === null || member.voice.channel.id !== channel.id) {
        await interaction.reply({
            content: '接続中のボイスチャンネルでコマンドを打ってください。',
            ephemeral: true,
        });
        return;
    }

    let channelState;
    const limitNum = interaction.options.getInteger('人数');

    // check option
    if (limitNum !== null) {
        if (limitNum < 0 || limitNum > 99) {
            await interaction.reply({
                content: '制限人数は0～99の間で指定してください。',
                ephemeral: true,
            });
            return;
        }

        channelState = {
            channelId: channel.id,
            limit: limitNum,
            isLock: limitNum == 0 ? false : true,
        };

        await channel.setUserLimit(limitNum);
    } else {
        channelState = await getVoiceChannelState(channel);
    }

    const embed = createEmbed(channelState);
    const button = createButtons(channelState);

    await interaction
        .reply({
            embeds: [embed],
            components: [button],
            fetchReply: true,
        })
        .catch((error) => {
            console.error(error);
        });

    // "channelSetting.messageDeletionTime" === null or -1(use Global) -> use "GlobalSetting.messageDeletionTime"
    if (notExists(lockChannel) || notExists(lockChannel.messageDeletionTime) || lockChannel.messageDeletionTime === -1) {
        await sleep(vclSetting.messageDeletionTime);
    } else {
        await sleep(lockChannel.messageDeletionTime);
    }

    // delete message after messageDeletionTime
    await interaction.deleteReply();
}
