# paranoiapoodle

intelligent, alert, and active (the stupid irc bot)

Forwards UDP messages to IRC

## Installation

	npm install -g paranoiapoodle
	$EDITOR /opt/local/etc/paranoiapoodle.json # see configuration for an example
	svccfg import /opt/local/lib/node_modules/paranoiapoodle/manifest.xml

## Configuration

Example:

	{
		"server": "irc.xchannel.org",
		"nick": "paranoiapoodle",
		"channel": "#xchannel",
		"listen": "::1",
		"port": "42424"
	}

## Send munin alerts to irc via paranoiapoodle

Create `/opt/local/etc/munin/munin-conf.d/paranoiapoodle.conf`:

	contact.paranoiapoodle.command nc -u -w 1 ::1 42424
	contact.paranoiapoodle.always_send warning critical
	contact.paranoiapoodle.text \
	${loop< >:wfields [WARN] ${var:host} ${var:graph_title} ${var:label} (${var:value}/${var:wrange}) }\n\
	${loop< >:cfields [CRIT] ${var:host} ${var:graph_title} ${var:label} (${var:value}/${var:crange}) }\n
