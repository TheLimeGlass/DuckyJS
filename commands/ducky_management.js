var Ducky = require('../Ducky.js');
var Discord = require('discord.js');

Ducky.registerCommand("join server %arg%", function(bot, message, msg) {
	msg = message.content;
	var m = msg.split(" ");
	if(m.length > 3) {
		bot.sendMessage(message, "Oopsy! Your message exceeds the length limit for the join server phrase");
	} else {
		var link = m[2];
		bot.joinServer(link, function(error, server) {
			if(error != null) {
				bot.sendMessage(message, "Oh no! There was an error :(. " + error);
			} else if (server == null) {
				bot.sendMessage(message, "Oh no! There was an error :(. Server is null");
			} else {
				bot.sendMessage(message, "Yay! Joined a new server! " + server.name);
			}
		});
	}
});

Ducky.registerCommand("download image from %arg% named %args%", function(bot, message, msg) {
	if(Ducky.isMaster(message.author.id)) {
		var filemanager = require('../modules/filemanager.js');
		var ms = message.content.split(" ");
		var arg = ms[3];
		if(ms.length == 5) {
			var name = ms[5];
		} else if (ms.length > 5) {
			var na = [];
			for(var i = 5; i < ms.length; i++) {
				na.push(ms[i]);
			}
			var name = na.join(" ");
		}
		filemanager.saveImage(arg, name, bot, message);
	} else {
		bot.sendMessage(message, "You're not my master...");
	}
});

Ducky.registerCommand("share %args%", function(bot, message, msg) {
	var filemanager = require('../modules/filemanager.js');
	var ms = message.content.split(" ");
	if(ms.length == 1) {
		var name = ms[1];
	} else if (ms.length > 1) {
		var na = [];
		for(var i = 1; i < ms.length; i++) {
			na.push(ms[i]);
		}
		var name = na.join(" ");
	}
	filemanager.sendImage(name, bot, message);
	bot.deleteMessage(message);
});

Ducky.registerCommand("leave server", function(bot, message, msg) {
	if(Ducky.isMaster(message.author.id)) {
		bot.sendMessage(message, "Goodbye guys :(" +
								 "\n...Ducky has left the server...");
		setTimeout(function(){bot.leaveServer(message);}, 1000); 
	} else {
		bot.sendMessage(message, "You're not my master...");
	}
});

Ducky.registerCommand("die ducky", function(bot, message, msg) {
	if(Ducky.isMaster(message.author.id)) {
		bot.sendMessage(message, "rip ducky 2016-2016")
		if(bot.internal.voiceConnection) {
			bot.internal.voiceConnection.destroy();
		}
		setTimeout(function(){process.exit();}, 1000); 
	}
});

Ducky.registerCommand("restart ducky", function(bot, message, msg) {
	if(Ducky.isMaster(message.author.id)) {
		bot.sendMessage(message, "Ending Ducky...")
		process.restart();
	}
});

Ducky.registerCommand("find command %args%", function(bot, message, msg) {
	var command = message.content;
	command = command.replace("find command ", "");
	command = command.toLowerCase();
	for(var i = 0; i < Ducky.triggers.length; i++) {
		//if(Ducky.triggers[i] == command) {
		if(Ducky.contains(Ducky.triggers[i], command)) {
			//bot.sendMessage(message, command);
			bot.sendMessage(message, "Found: " + command + ", in the script: " + Ducky.script2trigger[i]);
		}
	}
//	bot.sendMessage(message, command);
}, false, ["/find %args%", "/find command %args%"]);

Ducky.registerCommand("about you", function(bot, message, msg) {
	var duckyinfo = [];
	duckyinfo.push("Hi there, " + message.author + "! I am Ducky! A Discord bot written in JavaScript, utilising discord.js, node.js and a few other Node.js projects.")
	duckyinfo.push("Some stats about me: ");
	duckyinfo.push("Servers connected to: " + bot.servers.length);
	duckyinfo.push("Channels monitoring: " + bot.channels.length);
	duckyinfo.push("Users found: " + bot.users.length);
	duckyinfo.push("Private chats: " + bot.privateChannels.length);
	var date1 = new Date(bot.uptime);
	var date2 = new Date();
	var timeDiff = Math.abs(date2.getTime() - date1.getTime());
	var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)); 
	//duckyinfo.push("Uptime: " + duckydate.getDay() + " days, " + duckydate.getHours() + " hours, " + duckydate.getMinutes() + " minutes and " + duckydate.getSeconds() + " seconds");
	duckyinfo.push("Uptime: " + diffDays);
	duckyinfo.push("ID: " + bot.user.id);
	duckyinfo.push("Github: http://github.com/TheDuckyProject/DuckyJS");
	var duckyout = duckyinfo.join("\n");
	bot.sendMessage(message, duckyout);
});

/*Ducky.registerCommand("/unload %args%", function(bot, message, msg){
	if(Ducky.isMaster(message.author.id)) {
		var script = message.content.replace("/unload ", "");
		var deletedSomething = false;
		for(var i = 0; i < Ducky.triggers.length; i++) {
			if(Ducky.contains(Ducky.script2trigger[i], script)) {
				Ducky.triggers[i] = "Ducky.ignoreable";
				Ducky.script2trigger[i] = "Ducky.ignoreable";
				deletedSomething = true;
			}
		}
		try {
			Ducky.unloadScript(script);
			if(deletedSomething) {
				bot.sendMessage(message, "Unloaded command unit: " + script);
			} else {
				bot.sendMessage(message, "Invalid command unit: " + script);
			}
		} catch (err) {
			bot.sendMessage(message, "Failed to unload command unit: " + script);
		}
	}

});
*/

Ducky.registerCommand("/load %args%", function(bot, message, msg){
	if(Ducky.isMaster(message.author.id)) {
		var ms = message.content.split(" ");
		if(ms.length == 2) {
			var script = ms[1];
		} else {
			var sc = [];
			for(var i = 1; i < ms.length; i++) {
				sc.push(ms[i]);
			}
			var script = sc.join(" ");
		}
		script = script.replace(".js", "");
		try {
			Ducky.loadScript('./commands/' + script + ".js", true);
			bot.sendMessage(message, "Successfully loaded command unit: " + script + ".js");
		} catch (err) {
			bot.sendMessage(message, "Failed to load command unit: " + script + ".js");
			console.log(err.stack)
		}
	}
}, false, ["reload %args%"]);