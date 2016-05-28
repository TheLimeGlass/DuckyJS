var Ducky = require('../Ducky.js');
var Discord = require('discord.js');

Ducky.registerCommand("thanks ducky", function(bot, message, msg) {
	bot.sendMessage(message, "No problem!");
});

Ducky.registerCommand("best addon?", function(bot, message, msg) {
	bot.sendMessage(message, "**Uhh is that even a question?** " + "https://www.skunity.com/Umbaska");
});

Ducky.registerCommand("what time is it?", function(bot, message, msg) {
	var d = new Date();
	var h = d.getHours();
	var m = d.getMinutes();
	var s = d.getSeconds();
	bot.sendMessage(message, "It's currently: " + h + ":" + m + ":" + s + " (BST)");
});

Ducky.registerCommand("sia dory", function(bot, message, msg) {
	var filemanager = require('../modules/filemanager.js');
	filemanager.sendImage("sia dory", bot, message);
});

Ducky.registerCommand("whats a duck look like?", function(bot, message, msg) {
	var filemanager = require('../modules/filemanager.js');
	filemanager.sendImage("duck", bot, message);
});

Ducky.registerCommand("say goodbye", function(bot, message, msg) {
	bot.sendMessage(message, "Goodbye everyone! See you all later :)");
});

Ducky.registerCommand("/help", function(bot, message, msg) {
	bot.sendMessage(message, "I'll PM you my trigger phrases in a second " + message.author);
	var help = Ducky.triggers.join("\n- ");
	help = "- " + help;
	bot.sendMessage(message.author, help);
}, false, ["help me ducky", "help ducky", "ducky pls help"]);

Ducky.registerCommand("penis length of %mention%", function(bot, message, msg) {
	var readYaml = require('read-yaml');
	var yaml = require('write-yaml');
	readYaml('/root/ducky/data/penis_lengths.yml', function(err, data) {
		if(err) {
			bot.sendMessage(message, "Oh wow... " + message.mentions[0] + " must have a tiny penis. It's that small an error occoured.");
		}
		if(!message.mentions[0] || !message.mentions[0].id) {
			bot.sendMessage(message, "Sorry! I need " + message.mentions[0] + " to be online :(");
			return;
		}
		if(message.mentions[0].id == message.author.id) {
			var filemanager = require('../modules/filemanager.js');
			bot.reply(message, "not sure what your penis length is? Here you go...");
			setTimeout(function(){filemanager.sendImage("ruler", bot, message);}, 500);
		} else if(data[message.mentions[0].id]) {
			if(data[message.mentions[0].id] == 'female' || data[message.mentions[0].id] == "female" || String(data[message.mentions[0].id]) == "female") {
				bot.sendMessage(message, message.mentions[0] + " is a lady! And ladies don't have penises");
				var filemanager = require('../modules/filemanager.js');
				setTimeout(function(){filemanager.sendImage("emily howard", bot, message);}, 500);
				return;
			}
			var full = data[message.mentions[0].id];
	    	var penis = [];
	    	penis.push("8")
	    	for(var i = 0; i < full; i++) {
	    		penis.push("=");
	    	}
	    	penis.push("D");
	    	var pout = penis.join("");
			bot.sendMessage(message, "Penis length of " + message.mentions[0] + " is " + pout + " :open_mouth: ");
		} else {
			var full = ((Math.random() * 15) + 1);
	    	var penis = [];
	    	penis.push("8")
	    	for(var i = 0; i < full; i++) {
	    		penis.push("=");
	    	}
	    	penis.push("D");
	    	var pout = penis.join("");
	    	bot.sendMessage(message, "Penis length of " + message.mentions[0] + " is " + pout + " :open_mouth: ");
	    	data[message.mentions[0].id] = full;
			yaml('/root/ducky/data/penis_lengths.yml', data, function(err) {
		  		if (err) console.log(err);
			});
		}
	});
}, false, ["dick length of %mention%"]);

Ducky.registerCommand("remeasure my penis", function(bot, message, msg) {
<<<<<<< HEAD
	var readYaml = require('read-yaml');
	var yaml = require('write-yaml');
	readYaml('/root/ducky/data/penis_lengths.yml', function(err, data) {
		var full = ((Math.random() * 15) + 1);
		var penis = [];
		penis.push("8")
		for(var i = 0; i < full; i++) {
			penis.push("=");
		}
		penis.push("D");
		var pout = penis.join("");
		bot.sendMessage(message, "Penis length of " + message.author + " is now " + pout + " :open_mouth: ");
		data[message.author] = full;
		yaml('/root/ducky/data/penis_lengths.yml', data, function(err) {
	  		if (err) console.log(err);
		});
	});

	
}, false, ["remeasure my dick"]);

Ducky.registerCommand("testing args %integer% %mention% %args%", function(bot, message, msg, args) {
	bot.reply(message, args.join("\n"));
});

=======
	var full = ((Math.random() * 15) + 1);
	var penis = [];
	penis.push("8")
	for(var i = 0; i < full; i++) {
		penis.push("=");
	}
	penis.push("D");
	var pout = penis.join("");
	bot.sendMessage(message, "Penis length of " + message.author + " is now " + pout + " :open_mouth: ");
	data[message.author] = full;
	yaml('/root/ducky/data/penis_lengths.yml', data, function(err) {
  		if (err) console.log(err);
	});
}, false, ["remeasure my dick"]);

>>>>>>> origin/master
Ducky.registerCommand("monitor me", function(bot, message, msg) {
	bot.sendMessage(message, "Sorry " + message.author + ", but this command is currently locked");
	return;
	var data = require("../util/notify_writer.js");
	data.addNotifyUser(message.author)
	Ducky.notifyusers.push(message.author);
	bot.sendMessage(message, "Congrats " + message.author + "! I've added your to my notify list! You'll get a message from me when I see you're notified somewhere");
});

Ducky.registerCommand("attempt user", function(bot, message, msg) {
	var userjs = require('../util/user.js');
	var u = userjs.resolveUser(message, message.author.id);
	bot.sendMessage(u, "Testing123");
});

Ducky.registerCommand("find user %mention%", function(bot, message, msg) {
	if(message.mentions && message.mentions[0] && message.mentions.length < 0) {
		bot.sendMessage(message, "Oopsy! You must specifiy a user please");
		return;
	}
	if(!message.mentions[0] || !message.mentions[0].id) {
		return;
	}
	var id = message.mentions[0].id;
	var nm = [];
	nm.push("Attempting to find the user: " + message.mentions[0]);
	var atleastfound1 = false;
	for(var i = 0; i < bot.servers.length; i++) {
		for(var m = 0; m < bot.servers[i].members.length; m++) {
			if(bot.servers[i].members[m].id == id) {
				nuser = bot.servers[i].members[m];
				nm.push("Found in " + bot.servers[i].name);
				atleastfound1 = true;
			}				
		}
	}
	if(!atleastfound1) {
		nm.push("Sorry! I can't seem to find that user anywhere...");
	}
	bot.sendMessage(message, nm.join("\n"));
	
});


Ducky.registerCommand("add %integer% to %integer%", function(bot, message, msg) {
	var ms = message.content.split(" ");
	var int1 = parseInt(ms[1]);
	var int2 = parseInt(ms[3]);
	var int3 = int1 + int2;
	bot.sendMessage(message, "= " + int3);
});

Ducky.registerCommand("do maths %args%", function(bot, message, msg) {
	if(message.content == "do maths me + you") {
		bot.sendMessage(message, "Answer: I love you, " + message.author);
		return;
	} else if(message.content == "do maths sia + dory" || message.content == "do maths dory + sia") {
		var filemanager = require('../modules/filemanager.js');
		filemanager.sendImage("sia dory", bot, message);
		return;
	}
	var ms = message.content.split(" ");
	var sc = [];
	for(var i = 2; i < ms.length; i++) {
		sc.push(ms[i]);
	}
	var eq = sc.join(" ");
	var maths = require('mathjs');
	try {
		var answer = maths.eval(eq);
		bot.sendMessage(message, "Answer: " + answer);
	} catch(err) {
		return;
	}
})
