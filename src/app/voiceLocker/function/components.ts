import { ActionRowBuilder, BaseGuildVoiceChannel, ButtonBuilder, ButtonStyle, EmbedBuilder } from 'discord.js';

export interface ChannelLockState {
    channelId: string;
    limit: number;
    isLock: boolean;
}

/**
 * Create a channel info object from an interaction.
 * @param {BaseGuildVoiceChannel} voiceChannel VoiceChannel
 * @returns channelState
 */
export async function getVoiceChannelState(voiceChannel: BaseGuildVoiceChannel) {
    const channelState: ChannelLockState = {
        channelId: voiceChannel.id,
        limit: voiceChannel.userLimit,
        isLock: voiceChannel.userLimit == 0 ? false : true,
    };

    return channelState;
}

/**
 * create voice state embed.
 * @param {ChannelLockState} channelState ChannelLockState Object
 * @returns created embed
 */
export function createEmbed(channelState: ChannelLockState) {
    let limit;
    if (channelState.limit === 0) {
        limit = '∞';
    } else {
        limit = channelState.limit;
    }
    const embed = new EmbedBuilder()
        .setTitle('ボイスチャンネル情報')
        .addFields([{ name: '対象のチャンネル', value: '<#' + channelState.channelId + '>' }]);
    if (channelState.isLock) {
        embed.addFields([
            {
                name: '状態',
                value: '制限中',
            },
        ]),
            embed.setColor('#d83c3e');
    } else {
        embed.addFields([
            {
                name: '状態',
                value: '制限なし',
            },
        ]),
            embed.setColor('#2d7d46');
    }
    embed.addFields([{ name: '人数制限', value: String(limit) }]);
    return embed;
}

/**
 * create buttons
 * @param {ChannelLockState} channelLockState ChannelLockState Object
 * @returns created buttons
 */
export function createButtons(channelLockState: ChannelLockState) {
    const button = new ActionRowBuilder<ButtonBuilder>();
    const limit = channelLockState.limit;
    if (channelLockState.isLock) {
        // if limit number is 1, disable '-' button.
        if (limit == 1) {
            button.addComponents([
                new ButtonBuilder().setCustomId('voiceLock_dec').setLabel('－').setStyle(ButtonStyle.Primary).setDisabled(true),
            ]);
        } else {
            button.addComponents([
                new ButtonBuilder().setCustomId('voiceLock_dec').setLabel('－').setStyle(ButtonStyle.Primary).setDisabled(false),
            ]);
        }

        button.addComponents([
            new ButtonBuilder().setCustomId('voiceLock_change').setLabel('UNLOCK').setStyle(ButtonStyle.Success).setEmoji('🔓'),
        ]);

        // if limit number is 99, disable '+' button.
        if (limit == 99) {
            button.addComponents([
                new ButtonBuilder().setCustomId('voiceLock_inc').setLabel('＋').setStyle(ButtonStyle.Primary).setDisabled(true),
            ]);
        } else {
            button.addComponents([
                new ButtonBuilder().setCustomId('voiceLock_inc').setLabel('＋').setStyle(ButtonStyle.Primary).setDisabled(false),
            ]);
        }
    } else {
        button.addComponents([
            new ButtonBuilder().setCustomId('voiceLock_dec').setLabel('－').setStyle(ButtonStyle.Primary).setDisabled(true),
            new ButtonBuilder().setCustomId('voiceLock_change').setLabel('LOCK').setStyle(ButtonStyle.Danger).setEmoji('🔒'),
            new ButtonBuilder().setCustomId('voiceLock_inc').setLabel('＋').setStyle(ButtonStyle.Primary).setDisabled(true),
        ]);
    }
    return button;
}
