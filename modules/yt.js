
const axios = require('axios').default
const ytdl = require('ytdl-core')
const fs = require('fs')

async function downloadPage(config, channel, page = "") {

  channel.send('Updating the local video folder. Please wait.');
  if(!fs.existsSync("videos/index.json")){
    fs.writeFileSync("videos/index.json", JSON.stringify({}, null, 4));
  }

  let indexfile = JSON.parse(fs.readFileSync("videos/index.json", {encoding : "utf-8"}));
  const url =
  `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${config.youtubeChannel}&maxResults=10&order=date&type=video&key=${config.youtubeAPIKey}&pageToken=${page}`

  console.log(`Fetching ${url}`)
  const fetch = await axios.get(url) //Fetching the data
  var counter = 0;
  Object.keys(fetch.data.items).map(video => { // Creating a array
    const videoInfo = {
      "id": fetch.data.items[video].id.videoId,
      "title": fetch.data.items[video].snippet.title,
      "live": fetch.data.items[video].snippet.liveBroadcastContent
    }
    if(counter % 5 == 0){
      console.log("Waiting 1 Min");
      client.sleep(6000);
    } 
    channel.send(`Downloading ${videoInfo.title}, id: ${videoInfo.id}`);
    if(videoInfo.live == "none") { // Checking if the video is NO LIVESTREAM (no upcoming one or currently streaming one)
      let videoName = videoInfo.title.toLowerCase();
      if(!fs.existsSync(`videos/${videoInfo.id}.mp3` ||  
      videoInfo.title.includes("vlog") ||  // Check if this video
      videoInfo.title.includes("vlogz") || // is NO VLog or
      videoInfo.title.includes("q&a"))) {  // a Q&A. 
        ytdl(`https://www.youtube.com/watch?v=${videoInfo.id}`) // Downloading into dir
        .pipe(fs.createWriteStream(`videos/${videoInfo.id}.mp3`))
        counter++;
        indexfile[videoInfo.id] = videoInfo.title;
      }
    }
  })
  fs.writeFileSync("videos/index.json", JSON.stringify(indexfile, null, 4));
  channel.send(`${counter} videos have been downloaded.`);
  return fetch.data.nextPageToken;
}

module.exports = downloadPage;