var Ducky = require('../Ducky.js');
var Discord = require('discord.js');

Ducky.registerCommand("/coin", function(bot, message, msg) {
	var choice = Math.floor(Math.random() * 2);
	if(choice == 0) {
		bot.reply(message, "Flipped a coin and got **Tails**");
	} else {
		bot.reply(message, "Flipped a coin and got **Heads**");
	}
});