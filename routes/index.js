var express = require('express');
var pg = require('pg');

var router = express.Router();

// Get HomePage
router.get('/', function(req, res, next) {
  res.render('index');
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

module.exports = router;
