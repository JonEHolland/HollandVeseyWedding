var express = require('express');
var router = express.Router();

// Get HomePage
router.get('/', function(req, res, next) {
  res.render('index');
});

// GET RSVP Page
router.get('/rsvp', function(req, res, next) {
  res.render('rsvp');
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
