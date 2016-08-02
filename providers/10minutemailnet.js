var request = require('request')
, cheerio = require('cheerio')
, when = require('when')
, url = require('url');

var website = 'http://10minutemail.net';

exports.new = function() {

	var reqOptions = {
		url: url.parse(website + '/en/'),
		jar: true // enable cookies for this request
	};

	return when.promise(function(resolve, reject) {
		return request(reqOptions, function(error, response, body) {

			if (error) { return reject(error); }

			var cookies = response.headers['set-cookie'];
			var $ = cheerio.load(response.body);
			var email = $('#fe_text').val();

			if (!email) {
				return reject(new Error('CAPTCHA'));
			}

			return resolve({
				website: website,
				email: email,
				cookies: cookies
			});
		});
	});
};

exports.get = function(session) {

	var jar = request.jar();

	session.cookies.forEach(function(cookie) {
		jar.setCookie(cookie, website);
	});

	var reqOptions = {
		url: url.parse(website + '/en/mailbox.ajax.php'),
		jar: jar
	};

	return when.promise(function(resolve, reject) {
		return request(reqOptions, function(error, response, body) {
			var $ = cheerio.load(body);

			return resolve($('a').map(function(index, element) {
				return $(element).attr('href');
			}).toArray());
		});
	}).then(function(emailLinks) {
		return when.map(emailLinks, function(link) {
			return getEmailInbox({
				url: website + '/en/' + link,
				jar: jar
			});
		});
	});
};

function getEmailInbox(reqOptions) {
	return when.promise(function(resolve, reject) {
		return request(reqOptions, function(error, response, body) {

			var $ = cheerio.load(body);

			var content = $('#tabs-1').html();
			var headerInfo = $('#message tr td').map(function(index, element) {
				return $(element).text();
			});

			return resolve({
				from: headerInfo[1],
				to: headerInfo[3],
				subject: headerInfo[5],
				date: headerInfo[7],
				content: content
			});
		});
	});
}
