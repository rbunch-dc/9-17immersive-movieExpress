var express = require('express');
var router = express.Router();
// var mysql = require('mysql')
var config = require('../config/config');
var request = require('request');

const apiBaseUrl = 'http://api.themoviedb.org/3';
const nowPlayingUrl = apiBaseUrl + '/movie/now_playing?api_key='+config.apiKey
const imageBaseUrl = 'http://image.tmdb.org/t/p/w300';


/* GET home page. */
router.get('/', function(req, res, next) {
	request.get(nowPlayingUrl,(error,response,movieData)=>{
		var parsedData = JSON.parse(movieData);
		console.log("=======================")
		console.log(parsedData);
		console.log("=======================")
		res.render('index',{ 
			parsedData: parsedData.results,
			imageBaseUrl: imageBaseUrl 
		})
	});
  // res.render('index', { title: 'Express' });
});

// router.get('/search', (req, res)=>{
router.post('/search', (req, res)=>{
	// res.send("Search route here.");
	// ANYTHING in a form that has a name snet through post 
	// is available inside the req.body object
	// req.query
	// res.json(req.body)
	var userSearchTerm = req.body.movieSearch;
	var userSearchActor = req.body.actorSearch;
	var queryString = req.query.key;
	var searchUrl = `${apiBaseUrl}/search/movie?query=${userSearchTerm}&api_key=${config.apiKey}`; 
	request.get(searchUrl,(error,response,movieData)=>{
		var parsedData = JSON.parse(movieData);
		// res.json(parsedData);
		res.render('index',{ 
			parsedData: parsedData.results,
			imageBaseUrl: imageBaseUrl 
		})
		
	})
});

// HAS NOTHING IN COMMON WITH THIS...
router.get('/search', (req, res)=>{
	// ANYTHING in a form that has a name sent through 
	// a GET request, is availabel inside the req.query object
	// res.json(req.query)	
	var userSearchTerm = req.query.movieSearch;
	var userSearchActor = req.query.actorSearch;
	res.send("Hey, this is the get route. Nobody is listening.")
})

router.get('/test', function(req, res, next) {
	res.send("<h1>THis is a test</h1>")
	// res.json
});

router.get('/testsdfg', (req, res)=>{
	res.send("It does now.")
})

router.get('/students', (req, res)=>{
	const students = [
		'eddie',
		'valerie',
		'micahel',
		'allyson',
		'scott',
		'mikalya'
	]
	res.render('students',{students:students})
})

module.exports = router;
