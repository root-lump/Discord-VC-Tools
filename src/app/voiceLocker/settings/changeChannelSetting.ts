import { ChatInputCommandInteraction } from 'discord.js';
import { assertExistCheck, exists, notExists } from '../../common/exists';
import { vclChannelSettingService } from '../../dbServices/vclChannelSettingService';
import { searchChannelById } from '../../manager/channelManager';
import { vclGlobalSettingService } from '../../dbServices/vclGlobalSettingService';
import { logger } from '../../common/logger';

export async function changeVclChannelSetting(interaction: ChatInputCommandInteraction) {
    try {
        if (!interaction.inGuild()) return;

        await interaction.deferReply({ ephemeral: true });

        assertExistCheck(interaction.guild, 'interaction.guild');
        assertExistCheck(interaction.channel, 'interaction.channel');

        let vclSetting = await vclGlobalSettingService.getSetting(interaction.guildId);
        if (notExists(vclSetting)) {
            // register default global setting
            await vclGlobalSettingService.registerSettingToDB(interaction.guildId, false, 0, 'off', 60);
            vclSetting = await vclGlobalSettingService.getSetting(interaction.guildId);
        }

        assertExistCheck(vclSetting, 'vclSetting');

        const guild = await interaction.guild.fetch();
        const isEnabled = interaction.options.getBoolean('vcロックを使用する');
        const targetChannelInput = interaction.options.getChannel('設定チャンネル');
        const limitNum = interaction.options.getInteger('退出時の制限人数');
        const autoMessageInput = interaction.options.getString('入室時操作パネル表示');
        const messageDeletionTime = interaction.options.getInteger('操作パネル表示秒数');

        let targetChannel;
        if (targetChannelInput === null) {
            // when vc is not specified
            if (!interaction.channel.isVoiceBased()) {
                // if the channel using the command is not vc
                return await interaction.editReply('ボイスチャンネルでのみ設定できます。');
            }
            targetChannel = await searchChannelById(guild, interaction.channel.id);
        } else {
            // when vc is specified
            targetChannel = await searchChannelById(guild, targetChannelInput.id);
        }

        assertExistCheck(targetChannel, 'targetChannel');

        const lockChannelCheck = await vclChannelSettingService.getChannelSetting(guild.id, targetChannel.id);

        try {
            if (notExists(lockChannelCheck)) {
                // register channel setting
                await vclChannelSettingService.registerChannelSettingToDB(
                    guild.id,
                    targetChannel.id,
                    targetChannel.name,
                    isEnabled ?? vclSetting.isEnabled,
                    -1,
                    'global',
                    -1,
                );
            }

            const lockChannel = await vclChannelSettingService.getChannelSetting(guild.id, targetChannel.id);
            assertExistCheck(lockChannel);

            // update channel Setting
            if (exists(isEnabled)) {
                lockChannel.isEnabled = isEnabled;
            }
            if (exists(limitNum)) {
                lockChannel.defaultLimit = limitNum;
            }
            if (exists(autoMessageInput)) {
                lockChannel.autoMessage = autoMessageInput;
            }
            if (exists(messageDeletionTime)) {
                lockChannel.messageDeletionTime = messageDeletionTime;
            }
            await vclChannelSettingService.updateChannelSetting(lockChannel);
        } catch (error) {
            interaction.channel.send('設定変更中にエラーが発生しました。');
            logger.error(error);
        }

        await interaction.editReply('設定を変更しました。');
    } catch (error) {
        logger.error(error);
    }
}
