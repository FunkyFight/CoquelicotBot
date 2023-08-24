const { SlashCommandBuilder, ButtonStyle } = require("discord.js");
let { colinReminder } = require('../index.js');
const schedule = require('node-schedule');
const { ButtonBuilder, ActionRowBuilder } = require('discord.js');

const colinID = "874005960098713600"

module.exports = {
	data: new SlashCommandBuilder()
		.setName('colin')
		.setDescription('Commande réservée à Colin'),
	async execute(interaction) {
		// Check if the user is Colin
		if (interaction.user.id != colinID) {
			interaction.reply({ content: 'Tu n\'es pas Colin !', ephemeral: true });
			return;
		}

		// Stop last reminder
		if (colinReminder != null) {
			colinReminder.cancel();
		}

		// Créer un nouveau reminder tous les 4h pour que Colin prenne ses médicaments
		colinReminder = schedule.scheduleJob('0 */4 * * *', function() {
			const embed = {
				"id": 782905887,
				"description": "S'il te plaît, prend soin de ta santé, les gens tiennent à toi 🙏",
				"fields": [],
				"title": "Il est l'heure de prendre tes médicaments !",
				"color": 16712965,
				"image": {
				  "url": "https://media.tenor.com/YM3fW1y6f8MAAAAC/crying-cute.gif"
				}
			};

			// Add a button with id "colinTookMedecine" to the embed
			const tookButton = new ButtonBuilder()
				.setCustomId('colinTookMedecine')
				.setLabel('J\'ai pris soin de moi !')
				.setStyle(ButtonStyle.Success);

			const row = new ActionRowBuilder()
				.addComponents(tookButton);
			
			interaction.user.send({ embeds: [embed], components: [row] });
		});

		// Get next reminder date
		const nextReminder = colinReminder.nextInvocation();

		// convert to string locale format : "dd mm à hh:mm"
		nextReminder.setHours(nextReminder.getHours() - 2);
		const day = nextReminder.toLocaleString('fr-FR', { day: 'numeric' });
		const month = nextReminder.toLocaleString('fr-FR', { month: 'long' });
		const hours = nextReminder.getHours();
		const minutes = nextReminder.getMinutes();
		
		interaction.user.send({ content: `Je te préviendrais la prochaine fois à ${hours}h${minutes} !` });

		interaction.reply({ content: 'Je t\'ai envoyé un message privé !', ephemeral: true })
	},
};