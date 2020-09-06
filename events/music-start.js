//Events
module.exports ={
    trigger: "voiceStateUpdate", // discord.js client events
    name : "Musik",
    run : async function(client, args){ // args ist ein Array aus allen variablen die du durch das event bekommen würdest
      let fs = require("fs");
      let decode = require("unescape");
      let newVoice = args[1].channel;
      let oldVoice = args[0].channel;
      let channel = client.baseconfig.music;
      
      if (oldVoice != newVoice) {
        if (oldVoice == null) {

          if(newVoice.members.size > 2) { //If more than 2 users are in the Voice, just skip this event.
            return;
          }
          if(args[1].member.id == client.user.id) return; //Check if the joined user is this bot.

          if(newVoice === null) { // User left the channel, we dont wanna handle that here.
            return;
          }

          if(newVoice.id != channel) { // Test if the channel is the one for random music playback
            return ;
          }
          let server = newVoice.guild; // Getting the current server from the user

          const connection = await newVoice.join(); // Joining the users channel

          var files = fs.readdirSync('videos').filter(file => file.endsWith(".mp3"));

          function playsong(){
            let chosenFile = files[Math.floor(Math.random() * files.length)]
            // Create a dispatcher
            const dispatcher = connection.play('videos/'+chosenFile);

            dispatcher.on('start', () => {
              console.log(chosenFile+' is now playing!');
              var content = fs.readFileSync("videos/index.json");
              const videoNames = JSON.parse(content);
              chosenFile = chosenFile.replace(".mp3", "");
              var name = videoNames[chosenFile];
              name = decode(name);
              client.user.setActivity(name);
            });

            dispatcher.on('finish', () => {
              console.log(chosenFile+' has finished playing!');
              playsong(); // Loop, restart function 
            });

            // Handle errors:
            dispatcher.on('error', console.error);
          }

          playsong();

        } else if (newVoice == null) {
        } else {
        }
      }

    }
}
