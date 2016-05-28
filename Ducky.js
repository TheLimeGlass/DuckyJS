
var Discord = require("discord.js");
var bot = new Discord.Client();
var masters = ["91356983042539520", "128194687801622528"];
var myself = "171294847033016320";

delete exports.triggers;
delete exports.callbacks;
delete exports.script2trigger;
delete exports.mastercmd;
delete exports.notifyusers;
delete exports.messagelog;
delete exports.helpmenu;
exports.triggers = [];
exports.callbacks = [];
exports.script2trigger = [];
exports.mastercmd = [];
exports.notifyusers = [];
exports.messagelog = [];


exports.contains = function(base, input) {
	return contains(base, input);
}
exports.isMaster = function(master) {
	return isMaster(master);
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

function isMaster(master) {
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
function registerCommand(trigger, callback, isMaster) {
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
		// Is there any need to reset the trigger? Doesn't change
		//exports.triggers[key] = trigger;
		exports.callbacks[key] = callback;
		// No point adding extra args for the command script. It's already set and won't/can't change
		//exports.script2trigger[key] = currentCommandScript;
		exports.mastercmd[key] = isMaster;
	} else {
		exports.triggers.push(trigger);
		exports.callbacks.push(callback);
		exports.script2trigger.push(currentCommandScript);
		exports.mastercmd.push(isMaster);
	}
}

exports.registerCommand = function(trigger, callback, isMaster, aliases) {
	isMaster = isMaster || false;
	registerCommand(trigger, callback, isMaster);
	if(aliases != null && aliases instanceof Array) {
		for(var i in aliases) {
			var alias = aliases[i];
			registerCommand(alias, callback, isMaster);
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

/*exports.unloadScript = function(path, full) {
	delete require.cache[path];
}*/

//var commands = require("./loader/commands.js");
var fs = require('fs');
var files = fs.readdirSync('./commands/');
for (var i in files) {
	currentCommandScript = files[i];
  	//var definition = require('./commands/' + files[i]);
  	exports.loadScript('./commands/' + files[i]);
  	console.log('[info] Command script loaded: ' + files[i]);
}

files = fs.readdirSync('./modules/');
for (var i in files) {
	currentCommandScript = files[i];
  	//var definition = require('./commands/' + files[i]);
  	exports.loadScript('./modules/' + files[i]);
  	console.log('[info] Command script loaded: ' + files[i]);
}

fs.readFile('./data/notify.json', handleFile)

// Write the callback function
function handleFile(err, data) {
    if (err) throw err
    obj = JSON.parse(data)
	exports.notifyusers.push(obj.id);
    console.log('[info][notify] Watching for: ' + obj.id);
}


bot.on("message", function(message) {
	exports.messagelog.push(message);
	if(stopMyself(message.author.id)) {
		return;
	}
	/*if(!isMaster(message.author.id)) {
		return;
	}*/
	// TODO: Notify logger (need to figure out how to not spam users...)
	/*if(message.mentions.length > 0) {
		for(var i = 0; i < message.mentions.length; i++) {
			for(var ii = 0; ii < exports.notifyusers.length; ii++) {
				if(message.mentions[i].id == exports.notifyusers[ii]) {
					bot.sendMessage(message.mentions[i], message.content);
					return;
				}
			}
		}
	}*/
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
	main_loop:
	for (var i in exports.triggers) {
		var trigger = exports.triggers[i];
		var args = [];
		var ts = trigger.split(" ");
		var ms = msg.split(" ");
		for (var msk in ms) {
			if(ms[msk] == "" || ms[msk] == " ") {
				ms.splice(msk, 1);
			}
		}
		var inMentions = false;
		var inOptional = false;
		var skipUntil = false;
		var nm = [];
		for (var t in ts) {

			if (skipUntil != false) {
				skipUntil = skipUntil - 1;
			} else if(ts[t] == ms[t]) {
				if(inMentions) {
					/*if(!message.mentions.indexOf(ms[t]) > 0) {
						nm.push(ts[t]);
					}*/
					continue;
				} else {
					nm.push(ts[t]);
				}
			} else if (inOptional) {
				if(ts[t].endsWith("]")) {
					/*var nosquare = ts[t].replace("]", "");
					nm.push("]");*/
					nm.push(ts[t]);
					inOptional = false;
				} else {
					nm.push(ts[t]);
				}
			} else if (ts[t] == "%arg%") {
				nm.push(ts[t]);
				args.push(ms[t]);
			} else if (ts[t] == "%args%") {
				nm.push(ts[t]);
				if(ms.length > t) {
					for(var msss in ms) {
						args.push(ms[t++]);
					}
				}
				args.push(ms[t]);
				break;
			} else if (ts[t] == "%mention%") {
				/*if(message.mentions.indexOf(ms[t]) > 0) {
					nm.push(ts[t]);
				}*/
				// Just going to push it straight up
				nm.push(ts[t]);
				args.push(ms[t]);
			} else if (ts[t] == "%mentions%") {
				/*if(message.mentions.indexOf(ms[t]) > 0) {
					nm.push(ts[t]);
				}*/
				inMentions = true;
				// Just going to push it straight up
				nm.push(ts[t]);
				args.push(ms[t]);
			} else if (ts[t] == "%integer%") {
				if (isInt(ms[t])) {
				    nm.push(ts[t]);
				    args.push(ms[t]);
				}
			} else if (ts[t].startsWith("[")) {
				// hello [ducky dear]
				if(ts[t].endsWith("]")) {
					/*var nosquare = ts[t].replace("[", "");
					var nosquare = ts[t].replace("]", "");
					nm.push(nosquare);*/
					nm.push(ts[t]);
				} else {
					/*var nosquare = ts[t].replace("[", "");
					nm.push(nosquare);*/
					nm.push(ts[t]);
					inOptional = true;
				}
			} else if (ts[t].endsWith("]")) {
				inOptional = false;
				nm.push(ts[t]);
				/*var nosquare = ts[t].replace("]", "");
				nm.push(nosquare);*/
			} else if (ts[t].startsWith("(")) {
				var nobracket = ts[t].replace("(", "");
				if(ts[t].endsWith(")")) {
					nobracket = ts[t].replace(")", "");
					if(contains(ts[t], "|")) {
						var pipesplit = ts[t].split("|");
						for (var pslit in pipesplit) {
							console.log(ms[t] + " -> " + pipesplit[pslit])
							if(ms[t] == pipesplit[pslit]) {
								nm.push(ts[t]);
								args.push(pipesplit[pslit]);
								break;
							}
						}
					} else if (ms[t] == nobracket) {
						nm.push(ts[t]);
					}
				} else {
					// hello (ducky|my dear)
					// hello
					// * (ducky|my
					// dear)

					// * ducky|my
					if(contains(nobracket, "|")) {
						var fnb = nobracket.split("|");
						// ducky
						// my
						var poss = fnb[0];
						if(ms[t] == poss) {
							nm.push(ts[t]);
							continue;
						}
					} else {
						nm.push(ts[t]);
					}
					var fsplit = [];
					var fcccc = 0;
					for (var fslit in ts) {
						var fccc = fcccc + t;
						if(fccc > ts.length || !ts[fccc]) {
							return;
						}
						var fc = fccc;
						if(ts[fc].endsWith(")")) {
							fsplit.push(ts[fc]);
							break;
						} else {
							fsplit.push(ts[fc]);
						}
					}
					if(fsplit.length == 0) {
						var fspi = fsplit.join(" ");
						var ufspi = fspi;
						// (ducky|my dear|duck)
						fspi = fspi.replace("(", "");
						fspi = fspi.replace(")", "");
						var fspiltt = fspi.split("|");
						var someMatch = false;
						for(var fspillt in fspiltt) {
							if(fspiltt[fspillt] == ms[t]) {
								someMatch = true;
							}
						}
						if(someMatch == true) {
							nm.push(ufspi);
						}
					} else {
						return;
					}
				}
			}
		}
		var newmsg = nm.join(" ");
		if(trigger == newmsg) {
			if(isMasterCMD(i, message.author.id)) {
				var callback_function = exports.callbacks[i];
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
