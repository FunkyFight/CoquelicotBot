const index = require('../index.js');

module.exports = {
	async execute(interaction) {
		// Get the bot message author
		const message = interaction.message;

		const embed = {
			"id": 846937334,
			"description": "Le premier joueur pose une question ou dit simplement une phrase et les autres doivent compléter la question en rajoutant des détails. \nPar exemple :\nA : \"Que faisais-tu hier soir ?\"\nB : \"Que faisais-tu hier soir dans ce bar à minuit ?\"\nC : \"Que faisais-tu hier soir dans ce bar à minuit près de la ville de San Diego ?\"\nA : \"Que faisais-tu hier soir dans ce bar à minuit près de la ville de San Diego et qui sert d'incroyables cocktails goût fraise ?\"",
			"fields": [],
			"title": "Règlement de SlimeParty",
			"color": 15466240
		}

		interaction.reply({ embeds: [embed], ephemeral: true });
	}
}