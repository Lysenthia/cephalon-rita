//Initialise required libraries and fetch data
const Discord = require('discord.js');
const client = new Discord.Client();
const Items = require('warframe-items');
const items = new Items(['Primary', 'Secondary', 'Melee', 'Warframes', 'Archwing']);
const fs = require('fs');
const clientid = fs.readFileSync('key').toString('ascii');

//Finds item
function lookup_item(data, itemname) {
	var result = new Array();
	data.forEach(category => {
		result = result.concat(items.filter(item => 
			item.name.trim().toLowerCase() == itemname.trim().toLowerCase() && 
			item.category == items.options[category]
			));
	});
	return result;
}

function finditem(itemtype, itemname) {
	var item;
	switch(itemtype) {
		case '!weapon':
			item = lookup_item(['0', '1', '2'], itemname);
			break;
		case '!warframe':
			item = lookup_item(['3'], itemname);
			break;
		case '!archwing':
			item = lookup_item(['4'], itemname); 
			break;
		default:
			throw 'Invalid command passed, tried to find '.concat(itemtype);
	}
	if (item.length == 0) {
		return -1;
	} else {
		return item[0];
	}
	return item;
}

function internal_error(msg, error) {
	msg.reply("Sorry, an internal error was encountered");
	//Replace the number with your debug channel
	client.channels.get('601007428904943616').send('Error: '.concat(error));
}

function format_weapon(result) {
	var text = ` 
Weapon name: ${result.name}
Base damage: ${result.damage}
Crit chance: ${Math.round(result.criticalChance * 100)}%
Crit damage: ${result.criticalMultiplier}x
Status chance: ${Math.round(result.procChance * 100)}%
Riven disposition ${'\u25CF'.repeat(result.disposition).concat('\u25CB'.repeat(5 - result.disposition))}
`
}

//On bot startup
client.on('ready', () => {
 console.log(`Logged in as ${client.user.tag}!`);
 });

//On message sent
client.on('message', msg => {
	try {
		var args;
		var results;
		if (msg.author.bot) return;
		if (msg.content.startsWith('!weapon')) {
				itemname = msg.content.slice('!weapon'.length).toLowerCase();
				result = finditem('!weapon', itemname);
		} else if (msg.content.startsWith('!warframe')) {
				itemname = msg.content.slice('!weapon'.length).toLowerCase();
				result = finditem('!weapon', itemname);
		} else if (msg.content.startsWith(itemtype == '!archwing')) {
				itemname = msg.content.slice('!archwing'.length).toLowerCase();
				result = finditem('!archwing', itemname);
		} else {
				msg.reply("Invalid command");
				return;
		}
		if (result == -1) {
			msg.reply("Could not find the requested item");
		} else {
			msg.reply();
		}
	} catch(e) {
		console.log(e);
		internal_error(msg, e);
	}
 });

client.login(clientid);
