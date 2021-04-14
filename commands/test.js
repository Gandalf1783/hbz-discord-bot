module.exports = {
    name : "test",
    alias : [],
    description : "",
    run : async function(client, msg){   
        const ytdl = require('ytdl-core')
        const { spawn, exec }  = require('child_process');
        const fs = require('fs')

        const voice = msg.member.voice.channel
        const connection = await voice.join()

        console.log("Test Command Executed")
        console.log("Creating Child Process...");

        const proc = spawn("./stream.sh");
        
        console.log("Created.");



        const dispatcher = connection.play('myvideo.mp4');
        
        console.log(dispatcher);
        dispatcher.on('start', () => {

            console.log("Playing....")

        });

    }
}