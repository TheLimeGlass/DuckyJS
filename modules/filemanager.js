var Ducky = require('../Ducky.js');

console.log("Loading file manager...");

function downloadFile(url, dest, cb) {
	exports.downloadFile(url, dest, cb);
}

exports.downloadFile = function(url, dest, cb) {
	var Downloader = require('mt-files-downloader');
	var downloader = new Downloader();
	var name = makeid(10);
	var us = url.split(".");
	if(us.length == 0) {
		cb("FATAL ERROR");
		return;
	}
	var ext = us[us.length - 1];
	var dl = downloader.download(url, '/root/ducky/data/images/' + name + "." + ext);
	dl.start();
	dl.on('end', function(dl) { 
		cb(name);
	});
}

function makeid(times) {
	if(times) {
		times = 5;
	}
    var text = [];
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for(var i=0; i < times; i++) {
        text.push(possible.charAt(Math.floor(Math.random() * possible.length)));
    }

    return text.join("");
}

exports.saveImage = function(url, name, bot, message) {
	var yaml = require('write-yaml'); 
	var readYaml = require('read-yaml');
	readYaml('/root/ducky/data/imagedata.yml', function(err, data) {
		if(err) {
			console.log(err);
			return;
		}
		downloadFile(url, "/root/ducky/data/images/", function(id) {
			if(id == "FATAL ERROR") {
				bot.sendMessage(message, "Failed to downloaded the image from: `" + url + "`");
			} else if (id) {
				data[id] = name;
				yaml('/root/ducky/data/imagedata.yml', data, function(err) {
		  			if (err) {
	  					console.log(err);
	  				} else {
		  				bot.sendMessage(message, "Successfully downloaded the image from: `" + url + "` and saved it as: " + id);
	  				}
	  			});
	  		} else {
	  			bot.sendMessage(message, "Failed to downloaded the image from: `" + url + "`");
	  			return;
	  		}
		});
	});
}

exports.sendImage = function(image, bot, message) {
	var readYaml = require('read-yaml');
	var fs = require('fs');
	readYaml('/root/ducky/data/imagedata.yml', function(err, data) {
		if(err) {
			console.log(err);
		} else {
			for(var key in data) {
				if(data[key] == image) {
					var files = fs.readdirSync('/root/ducky/data/images/');
					for (var i in files) {
						currentImage = files[i];
						if(Ducky.contains(currentImage, key)) {
							bot.sendFile(message, "/root/ducky/data/images/" + currentImage);
							return;
						}
					}
				}
			}
		}
	});
}