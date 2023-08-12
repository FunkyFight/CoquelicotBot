module.exports = {
	data: new SlashCommandBuilder()
		.setName('time')
		.setDescription('Affiche l\'heure actuelle.'),
		async execute(interaction) {
			const date = new Date();
			const hours = date.getHours();
			const minutes = date.getMinutes();
			const seconds = date.getSeconds();
			interaction.reply({ content: `Il est ${hours}h${minutes}m ${seconds}s.`, ephemeral: true });
		},
};