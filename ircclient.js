var irc = require('irc');

function run(io) {
	io.on('connection', function(socket){
	    console.log('user connected');
	    var client;
	    var channel;
	    socket.on('client connect', function(data){
	    	client = new irc.Client(data.server, data.nickname, {
		    	channels: [data.channel],
			});
	    	channel = data.channel;
	    	client.addListener('message' + data.channel, function(from, message){
	    		socket.emit('message recieved', {
	    			frm: from,
	    			msg: message
	    		});
	    	});

	    	client.addListener('motd', function(motd){
	    		socket.emit('info recieved', {
	    			frm: 'motd',
	    			msg: motd
	    		});
	    	});

	    	client.addListener('join' + data.channel, function(nickname, message){
	    		socket.emit('join recieved', {
	    			nick: nickname
	    		});
	    	});

	    	client.addListener('quit', function(nickname, reason, channels, message){
	    		socket.emit('quit recieved', {
	    			nick: nickname,
	    			rs: reason
	    		});
	    	});

	    	client.addListener('topic', function(channel, topic, nick, message){
	    		socket.emit('info recieved', {
	    			frm: 'topic',
	    			msg: topic + " set by " + nick
	    		});
	    	});

	    	client.addListener('error', function(message) {
	    		socket.emit('error recieved', {
	    			frm: "ERROR",
	    			msg: message.command
	    		})
				console.log('error: ', message);
			});
	    });
	 
	    socket.on('chat message', function(msg){
	    	console.log(msg);
	        if (typeof client !== 'undefined' && client) {
	        	client.say(channel, msg);
	        	socket.emit('message recieved', {
	        		frm: 'Me',
	        		msg: msg
	        	});
	        } else {
	        	console.log("there was no client connected");
	        }
	    });
	    socket.on('disconnect', function(){
	        console.log("user disconnected");
	        if (typeof client !== 'undefined' && client) {
	        	client.disconnect();	
	        } else {
	        	console.log("there was no client connected");
	        }
	        
	    });
	});
}

exports.run = run;