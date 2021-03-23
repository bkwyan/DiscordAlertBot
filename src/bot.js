require('dotenv').config();

const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
})

client.on("voiceStateUpdate", (oldState, newState) => {
    // JOINED oldState.channelID = null newState.channelID = [someID]

    // console.log(newState.member);
    // console.log(oldState.channelID === null);
    //console.log(oldState.channelID === null && newState.channelID)
    // Someone joined the call
    if(oldState.channelID === null && newState.channelID){
        console.log(newState.member);
        // We want the bot to join the call now
        newState.channel.join()
            .then(connection => console.log(`The bot joined the ${newState.channel.name} channel`))
            .catch(console.error);
        //console.log(newState.channel);
    }
})

client.login(process.env.DISCORD_BOT_TOKEN);