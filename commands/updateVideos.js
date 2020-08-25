const downloadPage = require("../modules/yt.js");
module.exports = {
    name : "updatevideos",
    alias : [],
    description : "Fetches the latest 10 videos. Skips if already downloaded.",
    run: async function (client, msg) {
      if(!msg.member.hasPermission("MANAGE_CHANNELS")){
        return;
      }
      const config = {
        youtubeChannel: client.baseconfig.youtubechannel,
        youtubeAPIKey: client.baseconfig.youtubeapitoken
      }
      var nextPageToken = await downloadPage(config, msg.channel, "").then(token => nextPageToken = token);
    }
}
