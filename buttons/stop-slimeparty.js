const index = require('../index.js');

module.exports = {
	async execute(interaction) {
		// We stop the slimeparty. We get what is the threadMessageID and compare it with every registered game
		// If it matches, we stop the game and delete the message
		const interactionMsgId = interaction.message.id;
		const game = index.slimeparties.find(game => game.threadMessage.id == interactionMsgId);


		if (game != undefined) {
			game.stopGame(interaction.user.id);
		} else {
			interaction.reply({ content: 'Une erreur est survenue lors de l\'arrêt de la partie !', ephemeral: true });
		}
	}
}