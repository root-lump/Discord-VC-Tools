import { dataSource } from '../../database/config/dataSource';
import { voiceLockerCSetting } from '../../database/entity/voiceLockerSetting';

export class vclChannelSettingService {
    static async registerChannelSettingToDB(
        guildId: string,
        channelId: string,
        channelName: string,
        isEnabled: boolean,
        defaultLimit: number,
        autoMessage: string,
        messageDeletionTime: number,
    ) {
        await dataSource.initialize();
        const vclSettingRepository = dataSource.getRepository(voiceLockerCSetting);
        const channel = new voiceLockerCSetting(guildId, channelId, channelName, isEnabled, defaultLimit, autoMessage, messageDeletionTime);
        await vclSettingRepository.save(channel);
        await dataSource.destroy();
    }

    static async getChannelSetting(guildId: string, channelId: string) {
        await dataSource.initialize();
        const vclSettingRepository = dataSource.getRepository(voiceLockerCSetting);
        const channel = await vclSettingRepository.findOneBy({
            guildId: guildId,
            channelId: channelId,
        });
        await dataSource.destroy();
        return channel;
    }

    static async getAllChannelSettings(guildId: string) {
        await dataSource.initialize();
        const vclSettingRepository = dataSource.getRepository(voiceLockerCSetting);
        const channels = await vclSettingRepository.findBy({ guildId: guildId });
        await dataSource.destroy();
        return channels;
    }

    static async deleteChannelSetting(guildId: string, channelId: string) {
        await dataSource.initialize();
        const channel = await this.getChannelSetting(guildId, channelId);
        const vclSettingRepository = dataSource.getRepository(voiceLockerCSetting);
        if (channel !== null) {
            vclSettingRepository.remove(channel);
        }
        await dataSource.destroy();
    }

    static async updateChannelSetting(vclChannelSetting: voiceLockerCSetting) {
        await dataSource.initialize();
        const vclSettingRepository = dataSource.getRepository(voiceLockerCSetting);
        await vclSettingRepository.save(vclChannelSetting);
        await dataSource.destroy();
    }

    static async deleteAllChannelSettings(guildId: string) {
        await dataSource.initialize();
        const channels = await this.getAllChannelSettings(guildId);
        const vclSettingRepository = dataSource.getRepository(voiceLockerCSetting);
        vclSettingRepository.remove(channels);
        await dataSource.destroy();
    }
}
