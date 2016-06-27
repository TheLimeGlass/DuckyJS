var Ducky = require('../Ducky.js');

Ducky.registerCommand("introduce %mention% to the server ducky", function(bot, message, msg, args) {
	var out = [];
	var mention = args[0]
	out.push("Hi there, " + mention + "! And welcome to the skUnity Discord Chat!\n");
	out.push("I'm Ducky! Your friendly, neighbourhood bot! Now, the reason you've been sent this message is because it appears you've just joined the chat and that's great! It's lovely to see new members! " +
		"I'm going to help you out a bit here with a bit of how the chat works including some rules and other things! Anyways, lets get started!\n");
	out.push("Have you read the #rules channel? It contains the global rules for the chat! I'll be covering those in detail a bit more below");
	out.push("Rules and ranks are as follows:");
	out.push(" - Super Sexy, The Super Baes and The Baes, are all given by @BaeFell");
	out.push(" - Wrongy Poo, is a rank only for @Wrong");
	out.push(" - Supporter and Addon Dev, are earnt for doing something in relation to the skUnity forums (take a guess)");
	out.push(" - Bot, Super Bot and Bot Commander, are all in regards to bots which are tightly controlled");
	out.push(" - White is boring, this is the default and main rank! Everyone is given this because as the name suggests, white is boring!");
	out.push("");
	out.push("Please don't do anything stupid and always have fun! We're not strict on swearing, just no racism (unless it's funny...), no homopobia (at all) and no sexism! This is just because no one wants " +
		"hear anything like that, thanks. Please also keep to the suggested channels in #rules! Breaking multiple rules will result in removal from the chat.");
	out.push("");
	out.push("While we are the 'official' skUnity Discord Chat, we currently have a policy of not following punishments between the site and this chat. However, in certain circumstances we may punish accounts " +
		"based on behaviour from either the site or chat. We'll in general not do this, but if we believe you're becoming a threat to the community, we'll have to control the damages");
	out.push("");
	out.push("Thanks for reading! If you've got any questions just ask in the #general chat room! Have a good time, " + mention);
	bot.sendMessage(message, out.join("\n"));
});