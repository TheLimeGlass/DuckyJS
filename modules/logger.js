var Ducky = require("../Ducky.js");

console.log("[Ducky] Loading Logger...");

exports.messagelog = [];

exports.getDuckyLog = function(countback) {

}

function isInt(value) {
  var x;
  if (isNaN(value)) {
    return false;
  }
  x = parseFloat(value);
  return (x | 0) === x;
}

Ducky.registerCommand("get log for last %arg% messages", function(bot, message, msg) {
	var msg = [];
	msg.push("I think I can do that...");
	var sm = message.content.split(" ");
	var count = sm[4];
	var loc;
	if(isInt(count)) {
		bot.sendMessage(message, msg.join("\n"));
		var lastMsgs = bot.getChannelLogs(message, count);
		var data = [];
		bot.getChannelLogs(message.channel, count, function(err, logs) {
			if (!err) {
				data.push("[channel]" + message.channel.name);
				for(var i = 0; i < logs.length; i++) {
					data.push("[message]");
					var nm      = logs[i];
					var content = nm.content;
					var author  = nm.author.name;
					var aimage  = nm.author.avatarURL;
					var auserid = nm.author.id;
					var time    = nm.timestamp;
					data.push("[content]" + content);
					data.push("[author]" + author);
					data.push("[aimage]" + aimage);
					data.push("[auserid]" + auserid);
					data.push("[time]" + time);
					if(nm.attachments && nm.attachments.length > 0) {
						var attachments = nm.attachments;
						data.push("[attachments]" + attachments);
					}
				}
				var dataoutput = data.join("\n");
				var unirest = require('unirest');
				unirest.post('http://paste.ubuntu.com/')
					.followRedirect(true)
					.encoding('utf-8')
					.send({ "poster": "UmbaskaDets", "syntax": "text", "content": dataoutput })
					.end(function (response) {
						bot.sendMessage(message, "http://paste.ubuntu.com" + response.client['_httpMessage']['path']);
				  	}
				);
			} else {
				console.log("Error getting logs: ", err)
			}
		});		
		
		/*var requestify = require('requestify'); 
		requestify.post('http://paste.ubuntu.com/', {
	        poster: 'UmbaskaDets',
	        syntax: 'text',
	        content: 'random testing'
		    })
		    .then(function(response) {
		        bot.sendMessage(message, response.getHeader('Location'));
	    });*/
	} else {
		msg.push("Oopsy! You need to provide an integer please");
		bot.sendMessage(message, msg.join("\n"));
	}
	
});

