var webclient = {
  players : new PlayerHolder(),
  channels : new ChannelHolder(),

	onConnected: function() {
        webclientUI.printHtml("<timestamp/> Connected to server!");

        var loginInfo = {version:1, idle: true};

        loginInfo.name = poStorage.get("user");

        // var data = {version: 1};
        // data.default = utils.queryField("channel");
        // data.autojoin = poStorage("auto-join-"+webclient.serverIp(), "array");

        // data.ladder = poStorage.get('player.ladder', 'boolean');
        // if (data.ladder == null) {
        //     data.ladder = true;
        // }

        // data.idle = poStorage.get('player.idle', 'boolean');
        // if (data.idle == null) {
        //     data.idle = false;
        // }

        // data.color = poStorage.get('player.color');
        webclient.connectedToServer = true;

        if (loginInfo.name) {
            network.command('login', loginInfo);
        } else {
            vex.dialog.open({
                message: 'Enter your username:',
                input: '<input name="username" type="text" placeholder="Username"/>',
                buttons: [
                    $.extend({}, vex.dialog.buttons.YES, {text: 'Login'}),
                    $.extend({}, vex.dialog.buttons.NO, {text: 'Login as Guest'})
                ],
                callback: function (res) {
                    if (res && res.username) {
                        loginInfo.name = res.username;
                        poStorage.set("user", res.username);
                    } else {
                        delete loginInfo.name;
                    }

                    network.command('login', loginInfo);
                }
            });
        }
	},

	onChat: function(params) {
		webclientUI.printMessage(params.message, params.html);
		// var chan = webclient.channels.channel(params.channel);

  //       if ((params.channel == -1 && params.message.charAt(0) != "~") || !chan) {
  //           webclient.print(params.message, params.html);
  //       } else {
  //           chan.print(params.message, params.html);
  //       }
	},

	print: function(msg) {
		console.log(msg);
	},

	sendMessage: function (message, id) {
		network.command('chat', {channel: 0, message: message});
	    // if (!network.isOpen()) {
	    //     webclient.printRaw("ERROR: Connect to the relay station before sending a message.");
	    //     return;
	    // }

	    // if (/^send-channel-/.test(id)) {
	    //     webclient.channels.channel(+id.replace('send-channel-', '')).sendMessage(message);
	    // } else if (/^send-pm-/.test(id)) {
	    //     webclient.pms.pm(+id.replace('send-pm-', '')).sendMessage(message);
	    // } else if(/^send-battle-/.test(id)) {
	    //     battles.battles[(+id.replace('send-battle-', ''))].sendMessage(message);
	    // }
	},

    joinChannel: function(id) {
        network.command('joinchannel', {channel: id});
    }
};

$(function() {
    var userGiven = utils.queryField('user');
    var relayGiven = utils.queryField('relay');
    var portGiven = utils.queryField('port');

    if (userGiven) {
        poStorage.set("user", userGiven);
    }
    if (relayGiven){
        poStorage.set("relay", relayGiven);
    }
    if (portGiven) {
        poStorage.set("port", portGiven);
    }

    webclient.channels.joinChannel(0);

	serverConnect();
});