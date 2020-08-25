//Events
module.exports ={
    trigger: "voiceStateUpdate", // discord.js client events
    name : "StopMusik",
    run : async function(client, args){ // args ist ein Array aus allen variablen die du durch das event bekommen würdest
      let fs = require("fs");
      let newUserChannel = args[1].channel;
      let oldUserChannel = args[0].channel;
      let channel = client.baseconfig.music;

	    if(args[1].member.id == client.user.id) return; //Check if the joined user is this bot.

      if(newUserChannel === null && oldUserChannel.id == channel) { // User left the channel
        if(oldUserChannel.members.size == 1){
        const connection = await oldUserChannel.join();
        const dispatcher = connection.dispatcher.destroy();
        oldUserChannel.leave();
        return;
        }
      }
    }
}
