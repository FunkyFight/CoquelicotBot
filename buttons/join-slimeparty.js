const { ButtonBuilder, ActionRowBuilder } = require('discord.js');
const index = require('../index.js');

module.exports = {
	async execute(interaction) {
		// Get the bot message author
		const message = interaction.message;

		const game = index.slimeparties.filter(game => game.joinMessage.id === message.id)[0];

		// Check if user is already in the game
		if (game.players.includes(interaction.user.id)) {
			interaction.reply({ content: "Vous êtes déjà dans la partie " + game.host, ephemeral: true });
			return;
		}

		const hostData = await interaction.channel.guild.members.fetch(game.host);
		game.players.push(interaction.user.id);

		interaction.reply({ content: "Vous avez été ajouté à la partie " + hostData.displayName, ephemeral: true });
		
		const embed = {
			"id": 846937334,
			"description": "Clique sur l'un des boutons !",
			"fields": [],
			"title": `Joue à SlimeParty avec ${hostData.displayName} et ${game.players.length - 1} autres joueurs`,
			"color": 15466240
		}
		
		
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

		game.joinMessage.edit({ embeds: [embed], components: [row] });
	}
}