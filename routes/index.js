
var express = require('express');
var pg = require('pg');
var router = express.Router();

// Get HomePage
router.get('/', function(req, res, next) {
  res.render('index');
});

// GET RSVP Page
router.get('/rsvp', function(req, res, next) {
	pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    	client.query('SELECT * FROM rsvp', function(err, result) {
    		done();
    		if (err) {
    			console.error(err);
    		}
	      	res.render('rsvp', { results: result.rows });
	    });
 	});
});

router.post('/rsvp', function(req, res, next) {
	pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    	client.query('insert into rsvp values ($1,$2)',[req.body.guestName, req.body.guestCount]);
    	done();
    	res.redirect('/');
 	});
});

// GET Directions Page
router.get('/directions', function(req, res, next) {
	res.render('directions');
});

// GET Registry Page
router.get('/registry', function(req, res, next) {
	res.render('registry');
});

module.exports = router;
