require('dotenv').config();

const Discord = require('discord.js');
const client = new Discord.Client();

/* TODO:
* [x] Make bot leave when audio is done playing
* [] Implement TTS API to play the user's name
* [] Implement custom audio for each user
    - Use say.js to generate TTS audio file
  [] Think of what to do when multiple users join at the same time
  [] Maybe put a sleep on the bot if the same user keeps joining and leaving
  [] 
*/

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
        var voiceChannel = newState.channel;
        // We want the bot to join the call now
        voiceChannel.join()
            .then(connection => {
                console.log(`The bot joined the ${connection.channel.name} channel`);
                //console.log(connection);
                connection.play('johncenaintro.mp3', {volume: 0.5}).on('speaking', (value) => {
                    // Make bot leave when the audio is done
                    if(value === 0){
                        voiceChannel.leave();
                    }
                });
            })
            .catch(console.error);
        //console.log(newState.channel);
    }
})

client.login(process.env.DISCORD_BOT_TOKEN);