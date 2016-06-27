var Ducky = require('../Ducky.js');
var Discord = require('discord.js');

Ducky.registerCommand("omg hi", function(bot, message, msg) {
	bot.sendMessage(message, "omgggg! Hiya " + message.author);
});