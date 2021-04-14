/* eslint-disable max-depth */
const fs = require('fs')
const Discord = require('discord.js')
const baseconfig = require('./config.json')
const yt = require('./modules/yt.js')

// Some usefull Functions
const sleep = (ms) =>
	new Promise((resolve) => {
		setTimeout(resolve, ms)
	})

// Init from Client.
const client = new Discord.Client({
	fetchAllMembers: false,
	partials: ['CHANNEL', 'MESSAGE', 'REACTION'],
	presence: {
		activity: {
			name: 'sich seine Datein an! (Starte...)',
			type: 'WATCHING',
		},
		status: 'dnd',
	},
	retryLimit: 3,
})

global.client = client
client.baseconfig = baseconfig
client.sleep = sleep
client.emotes = {}
client.cache = {
	write(type, data) {
		const lowtype = type.toLowerCase()
		if (typeof this[lowtype] !== 'object')
			if (fs.existsSync(`./cache/${lowtype}.json`)) {
				this.init()

				return
			} else {
				this[lowtype] = []
				this[lowtype].push(data)
				fs.writeFileSync(
					`./cache/${lowtype}.json`,
					JSON.stringify(this[lowtype], null, 4),
				)

				return
			}

		this[lowtype].push(data)
		fs.writeFileSync(
			`./cache/${lowtype}.json`,
			JSON.stringify(this[lowtype], null, 4),
		)
	},
	init() {
		fs.readdirSync('./cache')
			.filter((item) => item.endsWith('.json'))
			.forEach((type) => {
				this[type.split('.')[0]] = JSON.parse(
					fs.readFileSync(`./cache/${type}`, { encoding: 'UTF-8' }),
				)
			})
		console.log('cache Loaded!')
	},
	remove(type, querry = { key: '', search: '' }) {
		const lowtype = type.toLowerCase()
		if (typeof this[lowtype] !== 'object') {
			console.log(`Dieser Cache Type existiert nicht:\n${lowtype}`)

			return
		}
		const index = this[lowtype].findIndex(
			(item) => item[querry.key] === querry.search,
		)
		this[lowtype].splice(index, 1)
		fs.writeFileSync(
			`./cache/${lowtype}.json`,
			JSON.stringify(this[lowtype], null, 4),
		)
	},
}

// Init from Presence stuff;
client.once('ready', (_) => {
	console.log(`Im ready as ${client.user.username}`)
	const setPressence = () => {
		client.user.setPresence({
			status: 'online',
			activity: {
				type: 'WATCHING',
				name: `auf ${baseconfig.prefix}hilfe`,
			},
		})
	}

	setPressence()
	client.setInterval(() => {
		if (!client.voice.connections.first()) setPressence()
	}, 60000)
	client.cache.init()
	const config = {
		youtubeChannel: baseconfig.youtubechannel,
		youtubeAPIKey: baseconfig.youtubeapitoken,
	}
	yt(config, client.channels.cache.get(baseconfig['dl-log']))
	client.setInterval((_) => {
		yt(config, client.channels.cache.get(baseconfig['dl-log']))
	}, 86400000) // Checke jeden Tag einmal :)
})

// Autorestart on socket dc
client.on('error', (error) => {
	if (error.message === 'Unexpected server response: 520')
		console.log('Cant connect to Discords API, Retrying...')
	else if (error.message === 'read ECONNRESET')
		console.log('Connection Reset! Reconnecting...')
	else console.error(error)
})

// Initialisation of Commands and Events.
// |- Commands
// -| commandname.js
// ------------------
// |- Events
// -| irgendwas.js

const init = () => {
	['commands', 'events'].forEach((type) => {
		const modules = fs
			.readdirSync(`./${type}`)
			.filter((item) => item.endsWith('.js'))
		client[type] = {}
		modules.forEach((name) => {
			const module = require(`./${type}/${name}`)
			if (type === 'events') {
				// register events
				if (typeof client[type][module.trigger] === 'undefined') {
					client[type][module.trigger] = []
					client.on(module.trigger, (...args) => {
						client[type][module.trigger].forEach((evt) => {
							try {
								evt.run(client, args)
							} catch (error) {
								console.log(`Problem mit dem Event '${evt.name}'!\nError:`)
								console.log(error)
							}
						})
					})
				}
				client[type][module.trigger].push(module)
			} else {
				client[type][module.name] = module
			}
		})
	})
}

init()

// Eval Handler + Comand-Manager
client.on('message', (msg) => {
	if (!msg.author.bot && msg.channel.type !== 'dm') {
		const command = msg.content.split(' ')[0]
		if (command.startsWith(client.baseconfig.prefix)) {
			const querry = command.slice(client.baseconfig.prefix.length)
			const search = Object.keys(client.commands).filter((item) => {
				if (
					client.commands[item].name === querry ||
					client.commands[item].alias.includes(querry)
				)
					return true
			})[0]
			const cmd = client.commands[search]
			if (typeof cmd === 'object')
				try {
					cmd.run(client, msg)
				} catch (error) {
					console.log(`Error with Command '${cmd.name}'Error:\n`)
					console.log(error)
				}
		}
	}
})

// Login Client and set Bot Online.
client.login(baseconfig.token)
