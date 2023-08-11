const fs = require('fs');
const Discord = require('discord.js');
const schedule = require('node-schedule');
const token = require('./token.txt')
const fs = require('fs');

const client = new Discord.Client({ intents: [Discord.GatewayIntentBits.GuildMembers, Discord.GatewayIntentBits.Guilds] });

client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));


// Messages
let generalMessageID;
let insomnieMessageID;


for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.data.name, command);
}

client.once('ready', () => {
    console.log('Ready!');

    
    const general = client.channels.cache.get('1056663037995651124');
    const insomnie = client.channels.cache.get('1139253287917473903');

    const dayRule = new schedule.RecurrenceRule();
    dayRule.hour = 6;
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
                "description": "Mais, quand quelque chose se termine quelque chose d'autre commence.\n**Les insomniaques rassemblez vous dans <#1046416475054948375> !**",
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
});

client.login(fs.readFileSync('./token.txt', 'utf8'));