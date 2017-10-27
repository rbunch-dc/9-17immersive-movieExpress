var express = require('express');
var router = express.Router();
// var passport = require('passport');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/test', function(req, res, next) {
	res.send("<h1>THis is a test for users.</h1>")
});

module.exports = router;
