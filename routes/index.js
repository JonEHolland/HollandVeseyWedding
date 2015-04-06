var express = require('express');
var pg = require('pg');
var http = require('follow-redirects').http;
var cheerio = require('cheerio');
var router = express.Router();

// Get HomePage
router.get('/', function(req, res, next) {
  res.render('index');
});

// Macys API Proxy Hack
router.get('/macys', function(req, res, next) {
    getPage({
        host: 'www.theknot.com',
        port: 80,
        method: 'GET',
        path : '/us/amy-vesey-and-jonathan-holland-jun-2015/registry/content'
    }, function(statusCode, response) {
        
        var registryItems = [];
        var $ = cheerio.load(response);
        var items = $('.registry-item');

        for (var i = 0; i < items.length; i++) {
            registryItems.push({
                title : $('p', items[i]).text(),
                price : $('.registry-price', items[i]).text(),
                quantity : $('.registry-quantity', items[i]).text().replace('Wants','Would Love').replace('Needs','Still Needs'),
                imageUrl : unescape($('.registry-image', items[i]).attr('style').replace('background-image: url(https://qa-beta.theknot.com/registry/proxy?url=','').slice(0, - 1))
            });
        }

        res.json({ items : registryItems });
    });
});

// GET RSVP Report Page
router.get('/rsvpreport', function(req, res, next) {
	pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    	client.query('SELECT * FROM rsvp', function(err, result) {
    		done();
    		if (err) {
    			console.error(err);
    		}
	      	res.render('rsvpReport', { results: result.rows });
	    });
 	});
});

router.post('/rsvp', function(req, res, next) {
    
    req.checkBody('guestName', 'Guest name is required').notEmpty();
    req.checkBody('guestTotal', 'Guest count is required').notEmpty();
    req.checkBody('guestEmail', 'Email is required').notEmpty();
    req.checkBody('guestEmail', 'Email does not appear to be valid').isEmail();

    var errors = req.validationErrors();

    console.log(errors);  

    if (errors) {
        res.render('rsvpSubmitErrors', { errors : errors });
        return;
    }
    
    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    	client.query('insert into rsvp values ($1,$2,$3)', [
            req.body.guestName, 
            req.body.guestEmail, 
            req.body.guestTotal]);
    	done();
    	res.render('rsvpSubmit');
 	});
});

var getPage = function(options, onResult)
{
    var req = http.request(options, function(res)
    {
        var output = '';
        console.log(options.host + ':' + res.statusCode);
        res.setEncoding('utf8');

        res.on('data', function (chunk) {
            output += chunk;
        });

        res.on('end', function() {
            onResult(res.statusCode, output);
        });
    });

    req.on('error', function(err) {
        console.log(err);
    });

    req.end();
};

module.exports = router;
