const { ButtonBuilder, ActionRowBuilder } = require('discord.js');
//const { CollectorUtils } = require('discord.js-collector-utils');
const Discord = require('discord.js');

module.exports = {
	SlimeParty: class SlimeParty {
		constructor({ channel, host }) {
			this.channel = channel;
			this.host = host;
			this.players = [host];
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
				.setCustomId('join-slimeparty')
				.setLabel('Rejoindre la partie')
				.setStyle('Success');
			
			const rules = new ButtonBuilder()
				.setCustomId('rules-slimeparty')
				.setLabel('Règles')
				.setStyle('Secondary');

			const start = new ButtonBuilder()
				.setCustomId('start-slimeparty')
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
				"title": `Joue à SlimeParty avec ${hostData.displayName}`,
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
				name: "SlimeParty de " + hostData.displayName,
				autoArchiveDuration: 1440,
				reason: "SlimeParty"
			})
			this.isStarted = true;
			this.nextTurn(false)
		}

		async nextTurn(isRestarting) {
			// Get player data
			const playerData = await this.channel.guild.members.fetch(this.players[this.currentPlaying]);

			// Check if threadmessage exists
			if (this.threadMessage != null && !isRestarting) {
				this.threadMessage.delete();
			}

			// Send new message
			const embed = {
				"id": 846937334,
				"title": `Au tour de ${playerData.displayName} !`,
				"color": 15466240
			}

			// Buttons "Arrêter la partie" and "Partir de la partie"
			const stop = new ButtonBuilder()
				.setCustomId('stop-slimeparty')
				.setLabel('Arrêter la partie')
				.setStyle('Danger');
			
			const leave = new ButtonBuilder()
				.setCustomId('leave-slimeparty')
				.setLabel('Partir de la partie')
				.setStyle('Secondary');

			if (!isRestarting) {
				// On renvoit la phrase car ce n'est pas le même tour
				await this.thread.send({embeds: [embed], components: [new ActionRowBuilder().addComponents(stop, leave)]})
					.then(msg => {
						this.threadMessage = msg;
					})
			}

			// Await message
			let hasPassed = false;
			const filter = m => m.author.id === this.players[this.currentPlaying];
			const collector = await this.thread.awaitMessages({ filter, max: 1, time: 60000, errors: ['time'] })
				.then(collected => {
					// If message starts with sentence no case sensitive
					if (collected.first().content.toLowerCase().startsWith(this.sentence.toLowerCase()) || this.sentence == "") {
						hasPassed = true;
						this.sentence = collected.first().content;
					} else {
						// Send to user it's not valid ephemeral simple text no embed
						collected.first().channel.send({ content: `La phrase doit commencer par ${this.sentence}`})
							.then(msg => {
								setTimeout(() => {
									msg.delete();
								}, 5000)
							})
						// Delete
						collected.first().delete();
						hasPassed = false;
					}
				})
				.catch(error => {
					if(this.isStarted) {
						// Say that a player lost, delete thread 15 seconds after
						this.isStarted = false;
						this.thread.send({ content: `${playerData.displayName} a perdu ! Fin de partie.`})
						.then(msg => {
							setTimeout(() => {
								this.thread.delete();
							}, 15000)
						})
					}
				})

			if (hasPassed && this.isStarted) {
				// Next player next turn
				this.currentPlaying++;
				if (this.currentPlaying >= this.players.length) {
					this.currentPlaying = 0;
				}
				this.nextTurn(false);
			} else {
				// Restart
				this.nextTurn(true);
			}
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