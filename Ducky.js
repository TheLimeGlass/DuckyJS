
var Discord = require("discord.js");
var bot = new Discord.Client();
var masters = ["91356983042539520", "128194687801622528"];
var baemasters = ["128194687801622528"];
var myself = "171294847033016320";

// 0 = running
// 1 = updating
// 2 = maintance
// 3 = fatal error
exports.modes = ["running", "updating", "maintance", "fatal error"];
exports.mode = 0;

exports.picturebae = [];
exports.picturebae.push("155112606661607425");
exports.autokick = ["100382580146196480", "138441986314207232"];
exports.triggers = [];
exports.callbacks = [];
exports.script2trigger = [];
exports.mastercmd = [];
exports.notifyusers = [];
exports.messagelog = [];
exports.includes = [];


exports.contains = function(base, input) {
	return contains(base, input);
}
exports.isMaster = function(master) {
	return isMaster(master);
}

exports.isBaeMaster = function(master){
	return isMaster(master, true);
}

function contains(base, input) {
	if(base == null || input == null) {
		return false;
	}
	if(input instanceof Array) {
		for(tocheck in input) {
			if(base.indexOf(base[tocheck]) > -1) {
				return true;
			}
		}
		return false;
	} else {
		if(base.indexOf(input) > -1) {
			return true;
		} else {
			return false;
		}
	}
}

function isMaster(master, baemaster) {
	if(baemaster) {
		return contains(baemasters, master);
	}
	return contains(masters, master)
}

function isMasterCMD(id, master) {
	if(exports.mastercmd[id] == true) {
		return isMaster(master);
	} else {
		return true;
	}
}

function stopMyself(id) {
	if(id == myself) {
		return true;
	}
}


var currentCommandScript;
function registerCommand(trigger, callback, isMaster, includes) {
	if(contains(exports.triggers, trigger)) {
		var key = -1;
		for(var t in exports.triggers) {
			if(exports.triggers[t] == trigger) {
				key = t;
				break;
			}
		}
		if(key < 0) {
			return;
		}
		exports.callbacks[key] = callback;
		exports.mastercmd[key] = isMaster;
		exports.includes.push(includes);
	} else {
		exports.triggers.push(trigger);
		exports.callbacks.push(callback);
		exports.script2trigger.push(currentCommandScript);
		exports.mastercmd.push(isMaster);
		exports.includes.push(includes);
	}
}

exports.registerCommand = function(trigger, callback, isMaster, aliases, includes) {
	isMaster = isMaster || false;
	includes = includes || false;
	if(trigger instanceof Array) {
		for(var t in trigger) {
			var trig = trigger[t];
			registerCommand(trig, callback, isMaster, includes)
		}
	} else {
		registerCommand(trigger, callback, isMaster);
	}
	if(aliases != null && aliases instanceof Array) {
		for(var i in aliases) {
			var alias = aliases[i];
			registerCommand(alias, callback, isMaster, includes);
		}
	}
}



exports.loadScript = function(path, reload) {
	var def = require(path);
	if(reload) {
		var f = path.split("/");
		var file = f[f.length - 1];
		console.log('[info] Command script reloaded: ' + file);
	}
}

function isInt(value) {
  if (isNaN(value)) {
    return false;
  }
  var x = parseFloat(value);
  return (x | 0) === x;
}

var fs = require('fs');
var files = fs.readdirSync('./commands/');
for (var i in files) {
	currentCommandScript = files[i];
  	exports.loadScript('./commands/' + files[i]);
  	console.log('[info] Command script loaded: ' + files[i]);
}

files = fs.readdirSync('./modules/');
for (var i in files) {
	currentCommandScript = files[i];
  	exports.loadScript('./modules/' + files[i]);
  	console.log('[info] Command script loaded: ' + files[i]);
}

fs.readFile('./data/notify.json', handleFile)

function handleFile(err, data) {
    if (err) throw err
    obj = JSON.parse(data)
	exports.notifyusers.push(obj.id);
    console.log('[info][notify] Watching for: ' + obj.id);
}


function autoKickUser(server, user) {
	if(contains(exports.autokick, user.id)) {
		bot.sendMessage(user, "Sorry, " + user + ", but you're not allow into " + server.name);
		setTimeout(function() { bot.kickMember(server, user); }, 1000);
	}
}

bot.on("serverNewMember", function(server, user) {
	if(server.id == "135877399391764480") {
		autoKickUser(server, user);
	}
});

bot.on("ready", function() {
	if(exports.mode == 0) {
		bot.setStatus("online", "in the pond");
	} else if(exports.mode == 1) {
		bot.setStatus("away", "updating...");
	} else if(exports.mode == 2) {
		bot.setStatus("away", "maintance mode...");
	} else if(exports.mode == 3) {
		bot.setStatus("away", "fatal error!");
	}
});

function notOnline(message) {
	if(exports.mode == 1 || exports.mode == 2 || exports.mode == 3) {
		var msg;
		if(exports.mode == 1) {
			msg = "Sorry, " + message.author + "; I'm currently being upgraded! I'll be back shortly with new awesome features!";
		} else if (exports.mode == 2) {
			msg = "Sorry, " + message.author + "; I'm currently under maintance! Some changes are being made to fix me up!"
		} else if (exports.mode == 3) {
			msg = "Oopsy! A fatal error has occoured somewhere! To keep my data safe, I'm no longer running any commands and have entered a lock state.";
		}
		if(message.channel instanceof Discord.PMChannel) {
			bot.sendMessage(message, msg);
		} else if (contains(message.mentions, bot.user)) {
			bot.sendMessage(message, msg);
		}
	}
	if(isMaster(message.author.id)) {
		if(exports.mode != 3) {
			return false;
		}
	}
	return true;
}

function processMentions(users, user) {
	for(var u in users) {
		var id = "<@" + users[u].id + ">";
		if(id == user) {
			return true;
		}
	}
	return false;
}

bot.on("message", function(message) {
	exports.messagelog.push(message);
	if(stopMyself(message.author.id)) {
		return;
	}
	if(notOnline(message)) {
		return;
	}
	
	var msg = message.content.toLowerCase();
	for (var i in exports.triggers) {
		var trigger = exports.triggers[i];
		if(trigger == msg) {
			if(isMasterCMD(i, message.author.id)) {
				var callback_function = exports.callbacks[i];
 				callback_function(bot, message, msg);
 				return;
			} else {
				bot.sendMessage(message, "Sorry " + message.author + ", but that's a Master Command");
			}
		}
	}

	var msg 	= message.content.toLowerCase();
	var mst 	= msg.split(" ");
	var ms 		= [];
	for(var m in mst) {
		if(mst[m] == "" || mst[m] == " ") {
			continue;
		}
		ms.push(mst[m]);
	}
	if(!ms || ms.length == 0) {
		return;
	}
	for(var tr in exports.triggers) {
		var trigger    = exports.triggers[tr];
		var ts     	   = trigger.split(" ");

		var cmd    	   = [];
		var args   	   = [];

		var inArgs 	   = false;	
		var inMentions = false;

		for(var t in ts) {
			if(inArgs == true) {
				args.push(ms[t]);
			} else if(inMentions == true) {
				if(message.isMentioned(ms[t])) {
					args.push(ms[t]);
					continue;
				} else {
					inMentions = false;
				}
			}
			if(ts[t] == ms[t]) {
				cmd.push(ts[t]);
			} else if(ts[t] == "%arg%") {
				cmd.push(ts[t]);
				args.push(ms[t]);
			} else if(ts[t] == "%args%") {
				cmd.push(ts[t]);
				args.push(ms[t]);
				inArgs = true;
			} else if(ts[t] == "%mention%") {
				if(processMentions(message.mentions, ms[t])) {
					cmd.push(ts[t]);
					args.push(ms[t]);
				}
			} else if(ts[t] == "%mentions%") {
				inMentions = true;
				if(processMentions(message.mentions, ms[t])) {
					cmd.push(ts[t]);
					args.push(ms[t]);
				}
			} else if(ts[t] == "%integer%" || ts[t] == "%int%") {
				if(isInt(ms[t])) {
					cmd.push(ts[t]);
					args.push(ms[t]);
				} else {
					cmd.push(ts[t]);
				}
			} else if(ts[t].startsWith("[")) {
				if(ts[t].endsWith("]")) {
					var swb = ts[t];
					swb = swb.replace("[" , "");
					swb = swb.replace("]" , "");

					if(swb == ms[t]) {
						cmd.push(ts[t]);
					}
				}
			}
		}
		var command = cmd.join(" ");
		if(trigger == command) {
			if(isMasterCMD(tr, message.author.id)) {
				var callback_function = exports.callbacks[tr];
 				callback_function(bot, message, msg, args);
 				return;
			} else {
				bot.sendMessage(message, "Sorry " + message.author + ", but that's a Master Command");
			}
 		}
	}
	return;
});

var auth = require("./auth.json");
bot.login(auth.email, auth.password);
