import { ChatInputCommandInteraction } from 'discord.js';
import { assertExistCheck, exists, notExists } from '../../common/exists';
import { vclGlobalSettingService } from '../../dbServices/vclGlobalSettingService';
import { logger } from '../../common/logger';

export async function changeVclGlobalSetting(interaction: ChatInputCommandInteraction) {
    try {
        if (!interaction.inGuild()) return;

        await interaction.deferReply({ ephemeral: true });

        assertExistCheck(interaction.guild, 'interaction.guild');
        assertExistCheck(interaction.channel, 'interaction.channel');

        const guild = await interaction.guild.fetch();
        const isEnabled = interaction.options.getBoolean('機能を有効にする');
        const limitNum = interaction.options.getInteger('退出時の制限人数');
        const autoMessageInput = interaction.options.getString('入室時操作パネル表示');
        const messageDeletionTime = interaction.options.getInteger('操作パネル表示秒数');
        const globalSettingCheck = await vclGlobalSettingService.getSetting(guild.id);

        try {
            if (notExists(globalSettingCheck)) {
                // register default global setting
                await vclGlobalSettingService.registerSettingToDB(guild.id, false, 0, 'off', 60);
            }

            const globalSetting = await vclGlobalSettingService.getSetting(guild.id);
            assertExistCheck(globalSetting);

            // update global Setting
            if (isEnabled !== null) {
                globalSetting.isEnabled = isEnabled;
            }
            if (limitNum !== null) {
                globalSetting.defaultLimit = limitNum;
            }
            if (exists(autoMessageInput)) {
                globalSetting.autoMessage = autoMessageInput;
            }
            if (exists(messageDeletionTime)) {
                globalSetting.messageDeletionTime = messageDeletionTime;
            }
            await vclGlobalSettingService.updateSetting(globalSetting);
        } catch (error) {
            interaction.channel.send('設定変更中にエラーが発生しました。');
            logger.error(error);
        }

        await interaction.editReply('設定を変更しました。');
    } catch (error) {
        logger.error(error);
    }
}
