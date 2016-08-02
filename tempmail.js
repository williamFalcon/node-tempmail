#!/usr/bin/env node
"use strict";

var Provider = require('./Provider')
, _10minutemailnet = require('./providers/10minutemailnet');

function getProvider(provider) {
	switch(provider.toLowerCase()) {
		case '10minutemail.net':
		case '10mm.net':
			return new Provider(_10minutemailnet);
	}

	throw new Error('Invalid provider specified');
}

exports.new = function(provider) {
	return getProvider(provider).new();
};

exports.get = function(provider, email) {
	return getProvider(provider).get(email);
};

require('main').run(module, __dirname + '/man/tempmail.1.md', function($) {
	$.assert($.pos.length > 0 && $.pos.length < 3, 'Invalid # of args');

	// new email
	if ($.pos.length === 1) {
		return exports.new($(0)).done(console.log);
	}

	// get email inbox
	return exports.get($(0), $(1)).done(function(inbox) {
		console.log(JSON.stringify(inbox, null, 4));
	});
});
