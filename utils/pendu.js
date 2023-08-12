const { ButtonBuilder, ActionRowBuilder } = require('discord.js');
//const { CollectorUtils } = require('discord.js-collector-utils');
const Discord = require('discord.js');

module.exports = {
	SlimeParty: class SlimeParty {
		constructor({ channel, host }) {
			this.channel = channel;
			this.host = host;
			this.players = [];
			this.currentPlaying = 0;

			this.sentence = ""

			this.joinMessage = null;
			this.threadMessage = null;
			this.thread = null;

			this.isStarted = false;
		}

		async waitForPlayers() {
			// Buttons Rejoindre et règles
			
			const join = new ButtonBuilder()
				.setCustomId('join-pendu')
				.setLabel('Rejoindre la partie')
				.setStyle('Success');
			
			const rules = new ButtonBuilder()
				.setCustomId('rules-pendu')
				.setLabel('Règles')
				.setStyle('Secondary');

			const start = new ButtonBuilder()
				.setCustomId('start-pendu')
				.setLabel('Commencer la partie')
				.setStyle('Danger');

			const row = new ActionRowBuilder()
				.addComponents(join, rules, start);

			// Get host data
			const hostData = await this.channel.guild.members.fetch(this.host);

			// Message
			const embed = {
				"id": 846937334,
				"description": "Clique sur l'un des boutons !",
				"fields": [],
				"title": `Joue au Pendu avec ${hostData.displayName}`,
				"color": 15466240
			}

			


			const message = await this.channel.send({ embeds: [embed], components: [row] })
				.then(msg => {
					this.joinMessage = msg;
				})
		}

		async start() {
			// Delete join message
			this.joinMessage.delete();

			// Get host data
			const hostData = await this.channel.guild.members.fetch(this.host);

			// Create thread
			this.thread = await this.channel.threads.create({
				name: "Pendu de " + hostData.displayName,
				autoArchiveDuration: 1440,
				reason: "Pendu"
			})
			this.isStarted = true;
			this.nextTurn(false)
		}

		

		async leaveGame(playerID) {
			// Get player data
			const playerData = await this.channel.guild.members.fetch(playerID);

			// Remove from players
			this.players = this.players.filter(player => player != playerID);

			// Send message
			this.thread.send({ content: `${playerData.displayName} a quitté la partie.`})
				.then(msg => {
					setTimeout(() => {
						msg.delete();
					}, 5000)
				})
		}

		async stopGame(userID) {
			// Check if user is host
			if (this.host != userID) {
				return;
			}

			const host = await this.channel.guild.members.fetch(this.host)
			this.isStarted = false;

			// Send message
			this.threadMessage.delete();
			this.thread.send({ content: `La partie a été arrêtée par ${host.displayName}.`})
				.then(msg => {
					setTimeout(() => {
						this.thread.delete();
					}, 5000)
				})
			}
	}	
}