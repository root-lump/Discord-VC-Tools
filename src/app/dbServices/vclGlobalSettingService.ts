import { voiceLockerGSetting } from '../../database/entity/voiceLockerSetting';
import { dataSource } from '../../database/config/dataSource';

export class vclGlobalSettingService {
    static async registerSettingToDB(
        guildId: string,
        isEnabled: boolean,
        defaultLimit: number,
        autoMessage: string,
        messageDeletionTime: number,
    ) {
        await dataSource.initialize();
        const vclSettingRepository = dataSource.getRepository(voiceLockerGSetting);
        const vclSetting = new voiceLockerGSetting(guildId, isEnabled, defaultLimit, autoMessage, messageDeletionTime);
        await vclSettingRepository.save(vclSetting);
        await dataSource.destroy();
    }

    static async getSetting(guildId: string) {
        await dataSource.initialize();
        const vclSettingRepository = dataSource.getRepository(voiceLockerGSetting);
        const vclSetting = await vclSettingRepository.findOneBy({ guildId: guildId });
        await dataSource.destroy();
        return vclSetting;
    }

    static async updateSetting(vclSetting: voiceLockerGSetting) {
        await dataSource.initialize();
        const vclSettingRepository = dataSource.getRepository(voiceLockerGSetting);
        await vclSettingRepository.save(vclSetting);
        await dataSource.destroy();
    }

    static async deleteSetting(guildId: string) {
        await dataSource.initialize();
        const vclSetting = await this.getSetting(guildId);
        const vclSettingRepository = dataSource.getRepository(voiceLockerGSetting);
        if (vclSetting !== null) {
            vclSettingRepository.remove(vclSetting);
        }
        await dataSource.destroy();
    }
}
