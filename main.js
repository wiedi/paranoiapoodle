#!/usr/bin/env node
"use strict"

var dgram     = require('dgram')
var irc       = require('irc')
var ellipsize = require('ellipsize')
var http      = require('http')

function main(config) {
	var client = new irc.Client(config.server, config.nick, {channels: [config.channel]})
	var server = dgram.createSocket('udp6')
	server.bind(config.port, config.listen)
	
	client.on('error', console.log)
	server.on('error', console.log)

	client.on('join', function(channel, nick, message) {
		if(nick == config.nick) {
			client.say(channel, 'are we ok?!');
		}
	})

	server.on('message', function(msg, rinfo) {
		try {
			client.say(config.channel, ellipsize(msg.toString(), 480))
		} catch(e) {}
	})

	if(config.http_port) {
		http.createServer(function(request, response) {
			const chunks = [];
			request.on('data', chunk => chunks.push(chunk));
			request.on('end', () => {
				const data = Buffer.concat(chunks);
				const j = JSON.parse(data);
				if("msg" in j) {
					client.say(config.channel, ellipsize(j.msg, 480))
				}
				response.end()
			})
		}).listen(config.http_port, config.listen)
	}
}

main(require(process.env.CONFIG_FILE || './paranoiapoodle.json'))
