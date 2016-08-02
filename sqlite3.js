var when = require('when')
, sqlite3 = require('sqlite3').verbose();

module.exports.run = function(db, sql, param) {
	var defer = when.defer();
	db.run(sql, param || [], function(error) {
		return error ? defer.reject(error) : defer.resolve();
	});
	return defer.promise;
};

module.exports.all = function(db, sql, param) {
	var defer = when.defer();
	db.all(sql, param || [], function(error, rows) {
	    return error ? defer.reject(error) : defer.resolve(rows);
	});
	return defer.promise;
};

module.exports.getDb = function() {
	var defer = when.defer();
	var db = new sqlite3.Database(__dirname + '/tempmail.sqlite');
	db.once('error', function(error) { if (error) { defer.reject(error); } });
	db.once('open', function() { defer.resolve(db); });
	return defer.promise;
};
