const { SlashCommandBuilder } = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('pendu')
		.setDescription('Joue au Pendu avec tes amis !'),
	async execute(interaction) {
		const { SlimeParty } = require('../utils/slimeparty.js');
		const index = require('../index.js');

		const game = new SlimeParty({
			channel: interaction.channel,
			host: interaction.user.id,
			players: [interaction.user.id]
		});

		interaction.reply({ content: 'La partie a été créée !', ephemeral: true });

		game.waitForPlayers();
		index.slimeparties.push(game);
	},
};