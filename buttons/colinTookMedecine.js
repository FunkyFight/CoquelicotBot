const index = require('../index.js');

module.exports = {
	async execute(interaction) {
		// Get the bot message author
		const message = interaction.message;

		// Get date
		const date = new Date();
		// Remove 2 hours and convert to string locale format : "dd mm à hh:mm"
		date.setHours(date.getHours() - 2);
		const day = date.toLocaleString('fr-FR', { day: 'numeric' });
		const month = date.toLocaleString('fr-FR', { month: 'long' });
		const hours = date.getHours();
		const minutes = date.getMinutes();


		const editedEmbed = {
			"id": 782905887,
			"description": "Ta santé est importante n'oublie pas 🙏",
			"fields": [],
			"title": `Tu as pris tes médicaments le ${day} ${month} à ${hours}h${minutes}`,
			"color": 7143173,
			"image": {
			  "url": "https://media.tenor.com/K1ps3qaF1psAAAAi/kirby-nintendo.gif"
			}
		  };

		
		// Edit the message with the new embed
		message.edit({ embeds: [editedEmbed], components: [] });
		
		// We don't want to reply but don't want the "This interaction failed" message
		interaction.deferUpdate();
	}
}