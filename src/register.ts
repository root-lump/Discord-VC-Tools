import { SlashCommandBuilder } from '@discordjs/builders';
import { assertExistCheck } from './app/common/exists';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v10';
import { commandNames } from './commandNames';
import {
    ChannelType,
    SlashCommandBooleanOption,
    SlashCommandChannelOption,
    SlashCommandIntegerOption,
    SlashCommandStringOption,
    SlashCommandSubcommandBuilder,
    SlashCommandSubcommandGroupBuilder,
} from 'discord.js';

const vcTools = new SlashCommandBuilder()
    .setName(commandNames.vcTools)
    .setDescription('ボイスチャンネルで使用できるツールです。')
    .addSubcommandGroup((subcommandGroup: SlashCommandSubcommandGroupBuilder) =>
        subcommandGroup
            .setName('vc')
            .setDescription('ボイスチャンネルで使用できるツールです。')
            .addSubcommand((subcommand: SlashCommandSubcommandBuilder) =>
                subcommand
                    .setName('lock')
                    .setDescription('このボイスチャンネルに人数制限をかけます。')
                    .addIntegerOption((option: SlashCommandIntegerOption) =>
                        option.setName('人数').setDescription('制限人数を指定する場合は1～99で指定してください。').setRequired(false),
                    ),
            ),
    )
    .setDMPermission(false);

const vclSetting = new SlashCommandBuilder()
    .setName(commandNames.voiceLockerSettings)
    .setDescription('VCロックの設定ができます。')
    .setDMPermission(false)
    .setDefaultMemberPermissions(0);
vclSetting.addSubcommandGroup((subcommandGroup: SlashCommandSubcommandGroupBuilder) =>
    subcommandGroup
        .setName('global')
        .setDescription('VCロックの全般設定を表示・変更できます。')
        .addSubcommand((subcommand: SlashCommandSubcommandBuilder) =>
            subcommand
                .setName('setting')
                .setDescription('VCロックの全般設定ができます。')
                .addBooleanOption((option: SlashCommandBooleanOption) =>
                    option.setName('機能を有効にする').setDescription('有効にするにはTrueを選択').setRequired(false),
                )
                .addIntegerOption((option: SlashCommandIntegerOption) =>
                    option.setName('退出時の制限人数').setDescription('【0 = 制限なし】').setRequired(false).setMinValue(0).setMaxValue(99),
                )
                .addStringOption((option: SlashCommandStringOption) =>
                    option
                        .setName('入室時操作パネル表示')
                        .setDescription('入室時に操作パネルを自動表示するかどうかを選択')
                        .addChoices({ name: '表示する', value: 'on' }, { name: '表示しない', value: 'off' })
                        .setRequired(false),
                )
                .addIntegerOption((option: SlashCommandIntegerOption) =>
                    option
                        .setName('操作パネル表示秒数')
                        .setDescription('【0 = 非表示にしない】')
                        .setRequired(false)
                        .setMinValue(0)
                        .setMaxValue(600),
                ),
        ),
);
vclSetting.addSubcommandGroup((subcommandGroup: SlashCommandSubcommandGroupBuilder) =>
    subcommandGroup
        .setName('channel')
        .setDescription('VCロックのチャンネル設定を表示・変更できます。')
        .addSubcommand((subcommand: SlashCommandSubcommandBuilder) =>
            subcommand
                .setName('setting')
                .setDescription('VCロックのチャンネル設定ができます。')
                .addBooleanOption((option: SlashCommandBooleanOption) =>
                    option.setName('vcロックを使用する').setDescription('使用する場合はTrueを選択').setRequired(false),
                )
                .addChannelOption((option: SlashCommandChannelOption) =>
                    option
                        .setName('設定チャンネル')
                        .setDescription('設定を行うチャンネルを指定 【指定しなければ現在のチャンネル】')
                        .addChannelTypes(ChannelType.GuildVoice)
                        .addChannelTypes(ChannelType.GuildStageVoice)
                        .setRequired(false),
                )
                .addIntegerOption((option: SlashCommandIntegerOption) =>
                    option
                        .setName('退出時の制限人数')
                        .setDescription('【-1 = グローバル設定に従う, 0 = 制限なし】')
                        .setRequired(false)
                        .setMinValue(-1)
                        .setMaxValue(99),
                )
                .addStringOption((option: SlashCommandStringOption) =>
                    option
                        .setName('入室時操作パネル表示')
                        .setDescription('入室時に操作パネルを自動表示するかどうかを選択')
                        .addChoices(
                            { name: 'グローバル設定に従う', value: 'global' },
                            { name: '表示する', value: 'on' },
                            { name: '表示しない', value: 'off' },
                        )
                        .setRequired(false),
                )
                .addIntegerOption((option: SlashCommandIntegerOption) =>
                    option
                        .setName('操作パネル表示秒数')
                        .setDescription('【-1 = グローバル設定に従う, 0 = 非表示にしない】')
                        .setRequired(false)
                        .setMinValue(-1)
                        .setMaxValue(600),
                ),
        ),
);

const commands = [vcTools, vclSetting];

// register slash commands
export async function registerSlashCommands() {
    const botToken = process.env.DISCORD_BOT_TOKEN;
    const botId = process.env.DISCORD_BOT_ID;

    assertExistCheck(botToken, 'DISCORD_BOT_TOKEN');
    assertExistCheck(botId, 'DISCORD_BOT_ID');

    const rest = new REST({ version: '10' }).setToken(botToken);

    await rest
        .put(Routes.applicationCommands(botId), {
            body: commands,
        })
        .then(() => console.info('Slash commands registered.'))
        .catch((error) => {
            console.error(error);
        });
}
