import { Entity, Column, PrimaryColumn } from 'typeorm';

// define table of 'VCLocker Global Setting'
@Entity()
export class voiceLockerGSetting {
    @PrimaryColumn()
    readonly guildId: string;

    @Column()
    isEnabled: boolean;

    @Column()
    defaultLimit: number;

    @Column()
    autoMessage: string;

    @Column()
    messageDeletionTime: number;

    constructor(guildId: string, isEnabled: boolean, defaultLimit: number, autoMessage: string, messageDeletionTime: number) {
        this.guildId = guildId;
        this.isEnabled = isEnabled;
        this.defaultLimit = defaultLimit;
        this.autoMessage = autoMessage;
        this.messageDeletionTime = messageDeletionTime;
    }
}

// define table of 'VCLocker Channel Setting'
@Entity()
export class voiceLockerCSetting {
    @PrimaryColumn()
    readonly guildId: string;

    @PrimaryColumn()
    readonly channelId: string;

    @Column()
    channelName: string;

    @Column()
    isEnabled: boolean;

    @Column()
    defaultLimit: number;

    @Column()
    autoMessage: string;

    @Column()
    messageDeletionTime: number;

    constructor(
        guildId: string,
        channelId: string,
        channelName: string,
        isEnabled: boolean,
        defaultLimit: number,
        autoMessage: string,
        messageDeletionTime: number,
    ) {
        this.guildId = guildId;
        this.channelId = channelId;
        this.channelName = channelName;
        this.isEnabled = isEnabled;
        this.defaultLimit = defaultLimit;
        this.autoMessage = autoMessage;
        this.messageDeletionTime = messageDeletionTime;
    }
}
