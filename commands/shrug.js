var Ducky = require('../Ducky.js');
var Discord = require('discord.js');

Ducky.registerCommand("shrug %mention%", function(bot, message, msg) {
	if(message.mentions[0]) {
		bot.sendMessage(message, "¯\_(ツ)_/¯ " + message.mentions[0]);
	} else {
		bot.sendMessage(message, "¯\_(ツ)_/¯");
	}
}, false, ["shrug ducky"]);
