# tempmail

Easily create temporary emails and fetch their inbox.

## Usage & Installation

```
npm install tempmail
```

to use the CLI interface, install globally with `-g`


### From the command line

```bash
./tempmail <provider> [emailAddress]
```

- Specifying only a provider will create a new temporary email address.
- Specifying a provider + email will return the inbox (in JSON format).

e.g.

```javascript
[
    {
        "from": "John Smith<john@example.com>",
        "to": "zqm46662@ssoia.com",
        "subject": "sample subject",
        "date": "just now",
        "content": "\n\t <p>3434234</p>\n\t"
    },
	{ /* another email message ... */ }
]
```

### As a Node.js module

It follows the same concept, and returns the inbox array vs. a JSON representation of it.

```javascript
var tempmail = require('tempmail');

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
```

## Providers

Providers are services that provide temporary emails.

 - [10minutemail.net](http://10minutemail.net/)
 - That's it for now.
