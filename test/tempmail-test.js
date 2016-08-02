"use strict";
/* global describe */
/* global it */

var tempmail = require('../tempmail')
, chai = require('chai')
, chaiAsPromised = require('chai-as-promised')
, fs = require('fs');

chai.use(chaiAsPromised);
var expect = chai.expect

describe('tempmail', function() {

	beforeEach(function(done) {
		var sqlite = __dirname + '/../tempmail.sqlite';
		fs.exists(sqlite, function(exists) {
			if (!exists) { return done(); }
			fs.unlink(sqlite, done);
		});
	});

	it('should create a new email', function() {
		return tempmail.new('10minutemail.net').then(function(email) {
			expect(email).to.be.a('string');
			expect(email.indexOf('@')).to.not.equal(-1);
		});
	});

	it('should not create a new email (invalid provider)', function() {
		expect(function() {
			tempmail.new('foobar');
		}).to.throw('Invalid provider specified');
	});

	it('should get the contents of the inbox', function() {
		return tempmail.new('10minutemail.net').then(function(email) {
			return tempmail.get('10minutemail.net', email);
		}).then(function(inbox) {
			return expect(inbox).to.be.instanceof(Array);
		});
	});

	it('should fail to get the inbox of an invalid email', function() {
		return expect(tempmail.get('10minutemail.net', 'invalid@foo.bar'))
			.to.eventually.be.rejected;
	});
});
