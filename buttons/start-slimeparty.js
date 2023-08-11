module.exports = {
	async execute(interaction) {
		// Get game
		const index = require('../index.js');
		const game = index.slimeparties.filter(game => game.joinMessage.id === interaction.message.id)[0];

		// Check if user is host
		if (interaction.user.id !== game.host) {
			interaction.reply({ content: "Vous n'êtes pas l'hôte de cette partie", ephemeral: true });
			return;
		}

		game.start()
	}
}