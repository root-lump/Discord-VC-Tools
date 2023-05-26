import { CacheType, Client, Events, GatewayIntentBits, Interaction, Partials, VoiceState } from 'discord.js';
import * as buttonHandler from './app/handlers/buttonHandler';
import * as commandHandler from './app/handlers/commandHandler';
import * as vcStateUpdateHandler from './app/handlers/vcStateUpdateHandler';
import { registerSlashCommands } from './register';
import { logger } from './app/common/logger';

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildModeration,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.MessageContent,
    ],
    partials: [Partials.User, Partials.GuildMember, Partials.Message, Partials.Reaction],
});

client.login(process.env.DISCORD_BOT_TOKEN);

client.on('ready', async () => {
    try {
        logger.info(`Logged in as ${client.user?.tag}.`);
        await registerSlashCommands();
    } catch (error) {
        logger.error(error);
    }
});

client.on('interactionCreate', (interaction: Interaction<CacheType>) => {
    try {
        if (interaction.isButton()) {
            // Button Action
            buttonHandler.call(interaction);
        } else if (interaction.isModalSubmit()) {
            // Modal Submit Action
        } else if (interaction.isMessageContextMenuCommand()) {
            // Message Context Menu Command Action
        } else if (interaction.isUserContextMenuCommand()) {
            // User Context Menu Command Action
        } else if (interaction.isCommand()) {
            // Slash Command Action
            commandHandler.call(interaction);
        }
    } catch (error) {
        logger.error(error);
    }
});

client.on('voiceStateUpdate', (oldState: VoiceState, newState: VoiceState) => {
    vcStateUpdateHandler.call(oldState, newState);
});

client.on(Events.ShardError, (error: Error) => {
    logger.error('A websocket connection encountered an error:', error);
});

process.on('unhandledRejection', (error: Error) => {
    logger.error('Unhandled promise rejection:', error);
});
