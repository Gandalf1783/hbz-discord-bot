// Events
module.exports = {
	trigger: 'voiceStateUpdate', // discord.js client events
	name: 'Musik',
	run: async (client, args) => {
		// args ist ein Array aus allen variablen die du durch das event bekommen würdest
		const fs = require('fs')
		const decode = require('unescape')

		const newVoice = args[1].channel
		const oldVoice = args[0].channel
		const channel = client.baseconfig.music

		if (oldVoice === newVoice) return
		if (oldVoice !== null) return
		if (newVoice.members.size > 2) return // If more than 2 users are in the Voice, just skip this event.

		if (args[1].member.id === client.user.id) return // Check if the joined user is this bot.

		if (newVoice === null) return // User left the channel, we dont wanna handle that here.

		if (newVoice.id !== channel) return // Test if the channel is the one for random music playback

		const connection = await newVoice.join() // Joining the users channel

		var files = fs.readdirSync('videos').filter((file) => file.endsWith('.mp3'))

		const playsong = () => {
			let chosenFile = files[Math.floor(Math.random() * files.length)]
			// Create a dispatcher
			const dispatcher = connection.play(`videos/${chosenFile}`)

			dispatcher.on('start', () => {
				console.log(`${chosenFile} is now playing!`)
				const content = fs.readFileSync('videos/index.json')
				const videoNames = JSON.parse(content)
				chosenFile = chosenFile.replace('.mp3', '')
				const name = decode(videoNames[chosenFile])
				client.user.setActivity(name)
			})

			dispatcher.on('finish', () => {
				console.log(`${chosenFile} has finished playing!`)
				playsong() // Loop, restart function
			})

			// Handle errors:
			dispatcher.on('error', console.error)
		}

		playsong()
	},
}
