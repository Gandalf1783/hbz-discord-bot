const downloadPage = require("../modules/yt.js");
module.exports = {
    name : "updatevideosall",
    alias : [],
    description : "Fetches ALL YOUTUBE VIDEOS for a channel",
    run: async function (client, msg) {
      if(!msg.member.hasPermission("MANAGE_CHANNELS")){
        return;
      }
      const config = {
        youtubeChannel: client.baseconfig.youtubechannel,
        youtubeAPIKey: client.baseconfig.youtubeapitoken
      }
      var nextPageToken = await downloadPage(config, msg.channel, "").then(token => nextPageToken = token);
      let i = 0;
      while(nextPageToken) {
        nextPageToken = await downloadPage(config, msg.channel, nextPageToken).then(token => nextPageToken = token);
        msg.channel.send("Downloaded Page | Page"+i);
        i++;
      }
    }
}
/* 
const axios = require('axios').default
const ytdl = require('ytdl-core')
const fs = require('fs')

async function downloadPage(config, channel, page) {

  channel.send('Updating the local video folder. Please wait.');

  const url =
  `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${config.youtubeChannel}&maxResults=10&order=date&type=video&key=${config.youtubeAPIKey}&pageToken=${page}`

  console.log(`Fetching ${url}`)
  const fetch = await axios.get(url)
  fetch.
  Object.keys(fetch.data.items).map(video => {
    const videoInfo = {
      "id": fetch.data.items[video].id.videoId,
      "title": fetch.data.items[video].snippet.title,
      "live": fetch.data.items[video].snippet.liveBroadcastContent
    }

    channel.send(`Downloading ${videoInfo.title}, id: ${videoInfo.id}`);
    if(videoInfo.live == "none") {
      if(!fs.existsSync(`videos/${videoInfo.id}.flv`)) {
        ytdl(`https://www.youtube.com/watch?v=${videoInfo.id}`)
        .pipe(fs.createWriteStream(`videos/${videoInfo.id}.flv`))
      }
    }
  })

  return fetch.data.nextPageToken;
}
 */