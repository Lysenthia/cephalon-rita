//Initialise required libraries and fetch data
const Discord = require('discord.js');
const client = new Discord.Client();

const Items = require('warframe-items');
const items = new Items(['Primary', 'Secondary', 'Melee', 'Warframes', 'Archwing']);

const fs = require('fs');
const clientid = fs.readFileSync('key').toString('ascii').trim();

//Capatalise function because js lacks one
function capitalise(string) {
	return string.charAt(0).toUpperCase() + string.substring(1);
}
//Searchs data for item
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

//Calls lookup_item with the correct values
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

//Displays message if an exception is encountered
function internal_error(msg, error) {
	msg.reply("Sorry, an internal error was encountered");
	//Replace the number with your debug channel
	client.channels.get('601007428904943616').send('Error: '.concat(error));
}

//Returns the correctly formatted message for an item lookup
function format_item(result, command) {
	var text;
	if ((command == '!weapon' && result.category != 'Melee') || (command == '!archwing' && result.slot == '1')) {
		text = ` 
Weapon Name: ${result.name}
Base Damage: ${result.totalDamage}
${Object.keys(result.damageTypes).map(k => '\t' + capitalise(k) + ': ' + result.damageTypes[k].toString()).join('\n')}
Crit Chance: ${Math.round(result.criticalChance * 100)}%
Crit Damage: ${result.criticalMultiplier}x
Status Chance: ${Math.round(result.procChance * 100)}%
Reload Speed: ${result.reloadTime}
Mag Size: ${result.magazineSize}
Fire Rate: ${result.fireRate}
Riven Disposition ${'\u25CF'.repeat(result.disposition).concat('\u25CB'.repeat(5 - result.disposition))}`
	} else if (command == '!warframe') {
		text = ` 
Warframe Name: ${result.name}
Base Health: ${result.health} (${result.health * 3})
Base Shields: ${result.shield} (${result.shield * 3})
Base Armour: ${result.armor}
Base Energy: ${result.power} (${result.power * 1.5})
Sprint Speed: ${result.sprintSpeed}
`
	} else if ((command == '!weapon' && result.category == 'Melee') ||command == '!archwing' && result.slot == '5') {
		text = ` 
Weapon Name: ${result.name}
Base Damage: ${result.totalDamage}
${Object.keys(result.damageTypes).map(k => '\t' + capitalise(k) + ': ' + result.damageTypes[k].toString()).join('\n')}
Crit Chance: ${Math.round(result.criticalChance * 100)}%
Crit Damage: ${result.criticalMultiplier}x
Status Chance: ${Math.round(result.procChance * 100)}%
Attack Speed: ${result.fireRate}
Riven Disposition ${'\u25CF'.repeat(result.disposition).concat('\u25CB'.repeat(5 - result.disposition))}`
	} else if (command == '!archwing') {
		text = ` 
Archwing Name: ${result.name}
Base Health: ${result.health} (${result.health * 3})
Base Shields: ${result.shield} (${result.shield * 3})
Base Armour: ${result.armor}
Base Energy: ${result.power} (${result.power * 1.5})
Flight Speed: ${result.sprintSpeed}
`
	} else {
		throw 'Invalid command passed, tried to find '.concat(itemtype);
		return;
	}
	return text;
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
		var command = msg.content.substr(0, msg.content.indexOf(" ")).toLowerCase();
		var arg = msg.content.substr(msg.content.indexOf(" ")).toLowerCase();
		switch(command) {
			case '!wf':
				command = '!warframe';
			case '!weapon':
			case '!warframe':
			case '!archwing':
				result = finditem(command, arg);
				if (result == -1) {
					msg.reply("Could not find the requested item");
				} else {
					msg.reply(format_item(result, command));
				}
				break;
			default:
				msg.reply("Invalid command");
				return;
		}
	} catch(e) {
		console.log(e);
		internal_error(msg, e);
	}
 });

//Activates bot
client.login(clientid);
