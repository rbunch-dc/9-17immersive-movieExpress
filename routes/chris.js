var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('This is the home page for /chris');
});

/* GET users listing. */
router.get('/isawesome', function(req, res, next) {
  res.send('Chris is awesome');
});

module.exports = router;
