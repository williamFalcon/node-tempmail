var url = require('url')
, request = require('request')
, cheerio = require('cheerio')
, when = require('when')
, sqlite = require('./sqlite3');

/*
Each new provider must extend this and provide their own

*/
module.exports = Provider;
function Provider(specificProvider) {
	var self = this;

	// Save a session for future use
	function save(email, website, cookies) {
		return sqlite.getDb().then(function(db) {
			var createSql = [
				'create table if not exists session',
				'(',
					'email text primary key,',
					'website text,',
					'cookiesJson text',
				')'].join('\n');

			var insertSql= [
				'insert into session values (',
				 	'$email,',
				 	'$website,',
				 	'$cookiesJson',
				')'].join('\n');

			var insertParams = {
				$email: email,
				$website: website,
				$cookiesJson: JSON.stringify(cookies)
			};

			return sqlite.run(db, createSql).then(function() {
				return sqlite.run(db, insertSql, insertParams);
			})
			.finally(function() {
				db.close();
			});
		});
	}

	// Load a session
	function load(email) {
		return sqlite.getDb().then(function(db) {

			var sql = 'select * from session where email = $email';

			return sqlite.all(db, sql, { $email: email }).then(function(rows) {
				if (rows.length === 0) {
					return when.reject(new Error('Email does not exist'));
				}

				return when.resolve({
					website : rows[0].website,
					email: rows[0].email,
					cookies: JSON.parse(rows[0].cookiesJson)
				});
			})
			.finally(function() {
				db.close();
			});
		});
	}

	self.new = function() {
		return specificProvider.new().then(function(session) {
			return save(
				session.email,
				session.website,
				session.cookies
			).then(function() {
				return session.email;
			});
		});
	};

	self.get = function(email) {
		return load(email).then(specificProvider.get);
	};

	/* */
	return self;
}
