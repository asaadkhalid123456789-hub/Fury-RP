require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const axios = require('axios');

const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMembers
    ] 
});

// Environment variables
const TOKEN = process.env.TOKEN;
const WAITING_CHANNEL_ID = process.env.WAITING_CHANNEL_ID;
const MANAGEMENT_ROLE_ID = process.env.MANAGEMENT_ROLE_ID;
const ASSIST_CHANNELS = process.env.ASSIST_CHANNELS.split(',');
const API_URL = process.env.API_URL; // optional API

// Optional: Example axios request (can be removed if not used)
async function checkServerStatus() {
    if (!API_URL) return;
    try {
        const response = await axios.get(API_URL);
        console.log('Server status:', response.data);
    } catch (err) {
        console.error('Failed to fetch server status:', err.message);
    }
}

// Voice state update for assist bot
client.on('voiceStateUpdate', async (oldState, newState) => {
    if (newState.channelId !== WAITING_CHANNEL_ID) return;

    const member = newState.member;
    const guild = newState.guild;
    let moved = false;

    for (const assistId of ASSIST_CHANNELS) {
        const channel = guild.channels.cache.get(assistId);
        if (!channel || !channel.isVoiceBased()) continue;

        const members = channel.members;
        const hasManagement = members.some(m => m.roles.cache.has(MANAGEMENT_ROLE_ID));

        if (hasManagement && members.size < 2) {
            try {
                await member.voice.setChannel(channel);
                console.log(`Moved ${member.user.tag} to ${channel.name}`);
                moved = true;
                break; // stop after first successful move
            } catch (err) {
                console.error('Failed to move user:', err);
            }
        }
    }

    if (!moved) {
        console.log(`${member.user.tag} is waiting for a free management channel.`);
    }
});

client.once('ready', () => {
    console.log(`${client.user.tag} is online!`);
    // Optional: check API every 5 minutes
    setInterval(checkServerStatus, 5 * 60 * 1000);
});

client.login(TOKEN);