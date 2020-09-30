'use.strict'

const Discord = require('discord.js');
const ytdl = require('ytdl-core');
const fs = require('fs');
const client = new Discord.Client();
const collection = new Discord.Collection();
const date = new Date();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
const replyFiles = fs.readdirSync('./reply').filter(file => file.endsWith('.js'));
const {
	prefix,
	token
} = require("./config.json");

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	collection.set(command.name, command);
}

for (const file of replyFiles) {
	const reply = require(`./reply/${file}`);
	collection.set(reply.name, reply);
}

client
	.on('ready', () => {
		client.user.setPresence({
			game: {
				name: 'des chansons binaires',
				type: 'LISTENING'
			},
			status: 'dnd'
		})
			.catch(console.error)
	})
	.on('guildMemberAdd', member => {
		member.createDM().then(channel => {
			console.log('new member')
			return channel.send(`Jeune padawan ${member.displayName}, bienvenue à toi.`)
		}).catch(console.error);
	})
	.on('message', async message => {

		if (message.author.bot) return

		const args = message.content.slice(prefix.length).trim().split(/ +/)
		const command = args.shift().toLowerCase()
		const msg = message.content.toLowerCase()
		const autmsg = message.author.username
		let replydate = `${date.getHours()}:${date.getMinutes()} - ${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`

		if (!message.content.startsWith(prefix)) {

			if (!collection.has(msg)) return;

			try {
				collection.get(msg).execute(message);
				console.log(`[${replydate}] REPLY ${msg} FROM ${autmsg}`)
			} catch (error) {
				console.error(error);
			}
		} else {

			if (!collection.has(command)) return;

			try {
				if (command === 'prune') {
					console.log(`[${replydate}] REPLY ${command} FROM ${autmsg} WITH ${args} ERASED LINES`)
					collection.get(command).execute(message, args);
				} else if (command === 'status') {
					message.delete().catch(O_o => { })
					console.log(`[${replydate}] ATTEMPT ${command} FROM ${autmsg}`)
					message.reply('commande inutilisable pour le momment')
				} else {
					collection.get(command).execute(message, args);
					console.log(`[${replydate}] REPLY ${command} FROM ${autmsg}`)
				}
			} catch (error) {
				console.error(error);
			}
		}
	})
	.on('error', console.log);

client.login(token)
	.then(() => console.log(`${client.user.username} logged`))