require('dotenv').config();

const Discord = require('discord.js');
const client = new Discord.Client();
const say = require('say');

/* TODO:
* [x] Make bot leave when audio is done playing
* [x] Implement TTS API to play the user's name
    - Use say.js to generate TTS audio file
  [] Fix when user switches voice channel
* [] Implement custom audio for each user
  [] Think of what to do when multiple users join at the same time
  [] Maybe put a sleep on the bot if the same user keeps joining and leaving
*/

var userJustJoinedName;

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
})

client.on("voiceStateUpdate", (oldState, newState) => {
    // Someone joined the call
    if(oldState.channelID === null && newState.channelID){
        var voiceChannel = newState.channel;
        if(newState.member.user.bot === false){
            if(newState.member.nickname === null){
                userJustJoined = newState.member.user.username;
            }
            else{
                userJustJoined = newState.member.nickname;
            }
            //userJustJoined = (newState.member.user.nickname || newState.member.user.username);
        }

        // We want the bot to join the call now
        voiceChannel.join()
            .then(connection => {

                say.export(`${userJustJoined} just joined ${connection.channel.name}`, 'Microsoft Zira', 1, 'alert.wav', (err) => {
                    if(err){
                        return(console.error);
                    }
                })

                console.log(`The bot joined the ${connection.channel.name} channel`);

                connection.play('alert.wav', {volume: 1}).on('speaking', (value) => {
                    // Make bot leave when the audio is done
                    if(value === 0){
                        voiceChannel.leave();
                    }
                });
            })
            .catch(console.error);
    }
})

client.login(process.env.DISCORD_BOT_TOKEN);