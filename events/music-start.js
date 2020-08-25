//Events
module.exports ={
    trigger: "voiceStateUpdate", // discord.js client events
    name : "Musik",
    run : async function(client, args){ // args ist ein Array aus allen variablen die du durch das event bekommen würdest
      let fs = require("fs");
      let newUserChannel = args[1].channel;
      let oldUserChannel = args[0].channel;
      let channel = client.baseconfig.music;

	    if(args[1].member.id == client.user.id) return; //Check if the joined user is this bot.


      if(newUserChannel === null) { // User left the channel, we dont wanna handle that here.
        return;
      }

	    if(newUserChannel.id != channel) { // Test if the channel is the one for random music playback
	    	return ;
	    }

	    let server = newUserChannel.guild; // Getting the current server from the user

	    const connection = await newUserChannel.join(); // Joining the users channel

      var files = fs.readdirSync('videos').filter(file => file.endsWith(".mp3"));

      function playsong(){
        let chosenFile = files[Math.floor(Math.random() * files.length)]
        // Create a dispatcher
	      const dispatcher = connection.play('videos/'+chosenFile);

	      dispatcher.on('start', () => {
	      	console.log(chosenFile+' is now playing!');
	      });

	      dispatcher.on('finish', () => {
          console.log(chosenFile+' has finished playing!');
          playsong();
	      });

	      // Handle errors:
        dispatcher.on('error', console.error);
      }
      playsong();
    }
}
