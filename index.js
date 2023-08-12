const fs = require('fs');
const Discord = require('discord.js');
const schedule = require('node-schedule');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const token = '';

const client = new Discord.Client({ intents: [Discord.GatewayIntentBits.GuildMembers, Discord.GatewayIntentBits.Guilds, Discord.GatewayIntentBits.GuildMessages, Discord.GatewayIntentBits.MessageContent] });

const commands = []
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));


// Data
const slimeparties = []


// Messages
let generalMessageID;
let insomnieMessageID;


for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    commands.push(command.data.toJSON());
    client.commands.set(command.data.name, command);
    console.log(command.data.name);
}

const clientId = '1139117289837428796';
const guildId = '1046416474400632963';

const rest = new REST({ version: '9' }).setToken(token);

(async () => {
	try {
		console.log('Started refreshing application (/) commands.');

		await rest.put(
			Routes.applicationGuildCommands(clientId, guildId),
			{ body: commands },
		);

		console.log('Successfully reloaded application (/) commands.');
	} catch (error) {
		console.error(error);
	}
})();
















client.once('ready', () => {
    console.log('Ready!');

    
    const general = client.channels.cache.get('1046416475054948375');
    const insomnie = client.channels.cache.get('1138625311123189790');

    const dayRule = new schedule.RecurrenceRule();
    dayRule.hour = 6;
    dayRule.minute = 0;
    dayRule.second = 0;
    const dayJob = schedule.scheduleJob(dayRule, function(){
        
        // Close the channel insomnie for everyone and every role and open the channel general for everyone and every role
        general.permissionOverwrites.edit(general.guild.roles.everyone, { SendMessages: true });
        insomnie.permissionOverwrites.edit(insomnie.guild.roles.everyone, { SendMessages: false });

        // Send a message in the channel general
        insomnie.send({
            "content": "",
            "tts": false,
            "embeds": [
            {
                "id": 846937334,
                "description": "Mais, quand quelque chose se termine quelque chose d'autre commence.\n**Les insomniaques rassemblez vous dans <#1138625311123189790> !**",
                "fields": [],
                "title": "C'est le jour ici donc ce salon est fermé jusqu'à 01h00",
                "color": 16711680
            }
            ],
            "components": [],
            "actions": {}
        }).then(msg => {
            insomnieMessageID = msg.id;
        })

        // Try to delete insomnieMessageID
        if (generalMessageID != null) {
            insomnie.messages.delete(generalMessageID);
        }

    });

    const nightRule = new schedule.RecurrenceRule();
    nightRule.hour = 1;
    nightRule.minute = 0;
    nightRule.second = 0;
    const nightJob = schedule.scheduleJob(nightRule, function(){
        // Close the channel general for everyone and every role and open the channel insomnie for everyone and every role
        general.permissionOverwrites.edit(general.guild.roles.everyone, { SendMessages: false });
        insomnie.permissionOverwrites.edit(insomnie.guild.roles.everyone, { SendMessages: true });
    
        general.send({
            "content": "",
            "tts": false,
            "embeds": [
            {
                "id": 846937334,
                "description": "Mais, quand quelque chose se termine quelque chose d'autre commence.\n**Les insomniaques rassemblez vous dans <#1046416475054948375> !**",
                "fields": [],
                "title": "C'est l'heure de dodo donc ce salon est fermé jusqu'à 6h00",
                "color": 16711680,
                "image": {
                "url": "https://media.tenor.com/2LJqv5NFZRQAAAAd/anime-sleeping.gif"
                }
            }
            ],
            "components": [],
            "actions": {}
        }).then(msg => {
            generalMessageID = msg.id;
        })

        // Try to delete insomnieMessageID
        if (insomnieMessageID != null) {
            insomnie.messages.delete(insomnieMessageID);
        }
    });

    console.log("Les règles d'ouvertures et de fermetures sont en place !")
});

// Interactions Handler with ./commands
client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'Une erreur est survenue lors de l\'exécution de cette commande !', ephemeral: true });
    }

});

// Buttons Handler with ./buttons
client.on('interactionCreate', async interaction => {
    if (!interaction.isButton()) return;

    const button = require(`./buttons/${interaction.customId}.js`);
    
    if (!button) return;

    try {
        await button.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'Une erreur est survenue lors de l\'exécution de ce bouton !', ephemeral: true });
    }
});

client.login(token);


exports.slimeparties = slimeparties;