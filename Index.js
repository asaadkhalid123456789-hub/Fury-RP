const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMembers
    ] 
});

// ⚡ Replace with your channel IDs
const WAITING_CHANNEL_ID = '1480131803976171611'; // string
const ASSIST_CHANNELS = [
    '1480131755770908733',
    '1480131759151775779',
    '1480131763266260992',
    '1480131768131522590',
    '1480131772112175164',
    '1480131776004489237',
    '1480131780773285889',
    '1480131785223573646',
    '1480131790160007218',
    '1480131794538860604'
];

// ⚡ Replace with the role ID of management staff
const MANAGEMENT_ROLE_ID = '1480130517109047326'; // string

client.on('voiceStateUpdate', async (oldState, newState) => {
    // Only trigger when a user joins the Waiting channel
    if (newState.channelId === WAITING_CHANNEL_ID) {
        const guild = newState.guild;
        let moved = false;

        // Go through all assist channels
        for (const assistId of ASSIST_CHANNELS) {
            if (!channel || !channel.isVoiceBased()) continue;
            if (!channel) continue;

            const members = channel.members;
            const hasManagement = members.some(member => member.roles.cache.has(MANAGEMENT_ROLE_ID));

            // Move user only if a management user is present and channel has space
            if (hasManagement && members.size < 2) {
                if (!newState.member) return;
                moved = true;
                break; // stop after moving to first available channel
            }
        }

        // If no available Assist channel, user stays in Waiting
        if (!moved) {
            console.log(`${newState.member.user.tag} is waiting for a free management channel.`);
        }
    }
});

// ⚡ Bot login – replace with your bot token
client.login('MTQ4NzA3NzI3MTcyOTczNzc2OA.GZwnGl.79IdD46ZumhHtIq_JtHJ1gDrlbsevXtF5Ki-Ko');