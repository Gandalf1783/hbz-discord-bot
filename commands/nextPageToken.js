module.exports = {
    name : "nextpagetoken",
    alias : [],
    description : "Gets the nextPageToken",
    run: async function (client, msg) {
        if(!msg.member.hasPermission("MANAGE_CHANNELS")){
            return;
          }
        const config = {
            youtubeChannel: client.baseconfig.youtubechannel,
            youtubeAPIKey: client.baseconfig.youtubeapitoken
          }

        const axios = require('axios').default
        const ytdl = require('ytdl-core')
        const fs = require('fs')

        const url =
        `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${config.youtubeChannel}&maxResults=10&order=date&type=video&key=${config.youtubeAPIKey}`
      
        console.log(`Fetching ${url}`)
        const fetch = await axios.get(url)

        console.log(fetch.data.nextPageToken);

    }
}
