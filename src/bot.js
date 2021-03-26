require('dotenv').config();

const Discord = require('discord.js');
const client = new Discord.Client();
const say = require('say');
const fs = require('fs');
const path = require('path');
const https = require('https');

/* TODO:
* [x] Make bot leave when audio is done playing
* [x] Implement TTS API to play the user's name
    - Use say.js to generate TTS audio file
  [x] Fix when user switches voice channel
  [x] Fix mute bug
  [] Fix sleep channel
* [] Implement custom audio for each user
  [] Think of what to do when multiple users join at the same time
  [] Maybe put a sleep on the bot if the same user keeps joining and leaving
*/

var userJustJoined;
var voiceChannelName;

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
})

client.on("voiceStateUpdate", (oldState, newState) => {

    // Someone joined the call
    if(newState.member.user.bot === false && newState.channel !== null){
        // Remove mute event
        if(oldState.selfMute === newState.selfMute && oldState.selfDeaf === newState.selfDeaf){
            var voiceChannel = newState.channel;
            voiceChannelName = newState.channel.name;
    
            userJustJoined = (newState.member.nickname ? newState.member.nickname : newState.member.user.username);
    
            // We want the bot to join the call now
            voiceChannel.join()
                .then(connection => {
                    
                    // Special case for Jeffrey
                    if(userJustJoined === "Jeffrey Cao"){
                        connection.play('jeff_sus.mp3', {volume: 1}).on('speaking', (value) => {
                            // Make bot leave when the audio is done
                            if(value === 0){
                                voiceChannel.leave();
                            }
                        });
                    } else{
                        say.export(`${userJustJoined} just joined ${voiceChannelName}`, 'Microsoft Zira', 1, 'alert.wav', () => {
    
                            console.log(`${userJustJoined} just joined ${voiceChannelName}`);
                            console.log(`The bot joined the ${connection.channel.name} channel \n`);
        
                            connection.play('alert.wav', {volume: 1}).on('speaking', (value) => {
                                // Make bot leave when the audio is done
                                if(value === 0){
                                    voiceChannel.leave();
                                }
                            });
                        })
                    }
                })
                .catch(console.error);
        }
    }
})

// Custom audio command
client.on('message', (message) => {

    if ( !fs.existsSync( path.join( __dirname, "downloadedAudio")))
        fs.mkdirSync( path.join( __dirname, "downloadedAudio"));

    console.log(message);
    //message.author.username;
    console.log(message.author.username);
    if(message.content === "!customAudio" && message.attachments.size === 1){
        var messageAttachment = message.attachments.get(message.attachments.keys().next().value);
        var file = fs.createWriteStream(path.join(__dirname, "downloadedAudio", messageAttachment.name));
        https.get(messageAttachment.attachment, (response) => {
            response.pipe(file);
        })
    }
})

client.login(process.env.DISCORD_BOT_TOKEN);