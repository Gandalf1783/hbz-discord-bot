// Events
module.exports = {
	trigger: 'voiceStateUpdate', // discord.js client events
	name: 'StopMusik',
	run: async (client, args) => {
		// args ist ein Array aus allen variablen die du durch das event bekommen würdest
		const newUserChannel = args[1].channel
		const oldUserChannel = args[0].channel
		const channel = client.baseconfig.music

		if (args[1].member.id === client.user.id) return // Check if the joined user is this bot.

		if (newUserChannel === null && oldUserChannel.id === channel)
			if (
				oldUserChannel.members.size === 1 &&
				oldUserChannel.members.first().user.bot
			)
				oldUserChannel.leave()
	},
}
