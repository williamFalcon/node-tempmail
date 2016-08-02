"use strict";

var tempmail = require('../tempmail');

var provider = '10minutemail.net'; // or '10mm.net'

// Create a new temporary email
tempmail.new(provider).then(function(tempEmail) {
	console.log('new temporary email', tempEmail);
	// Retrieve emails from an email address
	return tempmail.get(provider, tempEmail);
}).done(function (inbox) {
	console.log('The inbox (empty array - no emails sent yet)');
	console.log(inbox);
});
