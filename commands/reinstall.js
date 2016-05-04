var Ducky = require('../Ducky.js');

function downloadFile(url, dest, cb, name) {
	var httpreq = require('httpreq');
	if(!name) {
		var nm = url.split("/");
		var name = nm[nm.length - 1];
	}
	httpreq.download(
	    url,
	    dest + name
	, function (err, progress){
	    if (err) return console.log(err);
	    cb(name);
	}, function (err, res){
	    if (err) return console.log(err);
	    cb(name);
	});
}

Ducky.registerCommand("reinstall from %arg%", function(bot, message, msg) {
	if(Ducky.isMaster(message.author.id)) {
		var url = message.content.split(" ")[2];
		//var name = message.content.split(" ")[4];
		bot.sendMessage(message, "Reinstalling from `" + url + "`");
		var file;
		downloadFile(url, "/root/ducky/data/", function(data, err) {
			if(err) {
				bot.sendMessage(message, "Something went wrong trying to download the instruction file! " + data);
				return;
			} else {
				var file = "/root/ducky/data/" + data;
				var lineReader = require('readline').createInterface({
					input: require('fs').createReadStream(file)
				});


				// file path | file url
				var c = 0;
				lineReader.on('line', function (line) {
					++c;
					var inComments = false;
					if(line.startsWith("#") || line.startsWith("//") || inComments == true) { return; }
					if(line.startsWith("/*")) { inComments = true; return; }
					if(line.startsWith("*/")) { inComments = false; return; }
					if(line == "" || !line) { return; }

					var split = line.split(" | ");
					if(split.length == 1) {
						bot.sendMessage(message, "Incorrect args on line: " + c + ". Missing download URL! " + line);
					} else if(split.length == 2) {
						var path = split[0];
						var durl = split[1];

						downloadFile(durl, path, function(data, err) {
							if(err) {
								bot.sendMessage(message, "An error occoured while trying to download: " + err);
							}
						});
					}
				});

				var sys = require('util')
				var exec = require('child_process').exec;
				var child;
				child = exec("forever restartall", function (error, stdout, stderr) {
					console.log('[info] ' + stdout);
					if (error !== null) {
						console.log('exec error: ' + error);
					}
				});
				bot.sendMessage(message, "Restarted!");
			}
		}, name);
	} else {
		bot.sendMessage(message, "You're not my master...");
	}
}, true);