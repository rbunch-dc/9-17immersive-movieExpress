var express = require('express');
var router = express.Router();
// var mysql = require('mysql')
var config = require('../config/config');
var request = require('request');
var mysql = require('mysql');
// include bcrypt so we can protect user's passwords
var bcrypt = require('bcrypt-nodejs');


var connection = mysql.createConnection(config.db);
connection.connect((error)=>{
	console.log(error);
});

const apiBaseUrl = 'http://api.themoviedb.org/3';
const nowPlayingUrl = apiBaseUrl + '/movie/now_playing?api_key='+config.apiKey
const imageBaseUrl = 'http://image.tmdb.org/t/p/w300';


// router.get('/', function(req, res, next) {
// 	res.send("HA HA! I cut you off!!")
// 	next();
// })

/* GET home page. */
router.post('/', function(req, res, next) {
	res.send("Hello")
})

router.get('/', function(req, res, next) {
	var message = req.query.msg;
	if(message == "registered"){
		message = "Congratulations! You are regsitered! Enjoy the site."
	}else if(message == "fail"){
		message = "That user/password combination is not recognzed. please try again"
	}
	request.get(nowPlayingUrl,(error,response,movieData)=>{
		var parsedData = JSON.parse(movieData);
		// var query = "SELECT * FROM users";
		// conneciton.query((query, error, data)=>{

		// })
		// res.json(parsedData)
		// console.log("=======================")
		// console.log(parsedData);
		// console.log("=======================")
		// parsedData = undefined;
		if(parsedData !== undefined){
			// stuffToRender = callViewEngine(data);
			// res.send(stuffToRender)
			res.render('index',{ 
				parsedData: parsedData.results,
				imageBaseUrl: imageBaseUrl,
				message: message
			});	

			// var body = buildBody(safeDataFromDB);
			// res.writeHead(200,{});
			// res.send(buildBody)

		}else{
			res.json("There was an error.");
		}
	});
	// res.render('index', { title: 'Express' });
});

router.get('/register', (req, res, next)=>{
	res.render('register', {
	});
});

router.get('/login',(req, res)=>{
	res.render('login',{})
})

router.post('/loginProcess', (req, res, next)=>{
	var email = req.body.email;
	var password = req.body.password;
	// Check to see if the user is in the database...
	var selectQuery = "SELECT * FROM users WHERE email = ?";
	connection.query(selectQuery, [email], (error,results)=>{
		if(results.length == 0){
			// these aren't the droids we're looking for.
			res.redirect('/login?msg=badUser');
		}else{
			// this email is in the database! Check to see if pass matches
			// compareSync takes 2 args:
			// 1. the english password
			// 2. the hashed password in the DB we want to check against
			var doTheyMatch = bcrypt.compareSync(password,results[0].password)
			// compareSync retuns a bool
			// if(1==2) = if (false)
			// if(false){}
			if(doTheyMatch === true){
				// this is teh droid we're looking for. 
				// We checked the English pass through bcrypt against the db hash
				// and they matched.
				res.redirect('/?msg=loggedIn')
			}else{
				// you dont want to sell me deathsticks.
				// you want to go home and rethink life.
				res.redirect('/login?msg=badpass')
			}
		}
	})
});

router.post('/registerProcess', (req, res, next)=>{
	// res.json(req.body);
	var name = req.body.name;
	var email = req.body.email;
	var password = req.body.password;
	// Convert the english password, to a bcrypt hash
	var hash = bcrypt.hashSync(password);
	// first of all, check to see if this user is registered...
	// we need a select statement...
	const selectQuery = "SELECT * FROM users WHERE email = ?;";
	connection.query(selectQuery,[email],(error, results)=>{
	// if the email already exists, stop, send them an error
		if(results.length == 0){
			// this user is not in the DB! Insert them...
			var insertQuery = "INSERT INTO users (name, email, password) VALUES (?,?,?);";
			connection.query(insertQuery,[name, email, hash],(error, results)=>{
				if (error){
					throw error;
				}else{
					res.redirect("/?msg=registered");
				}
			});
		}else{
			res.redirect("/?msg=fail");
		}
	});
	
	// if the email doesn't exist, insert it into the database

});

// function with () means run it NOW.
// function without () means pass it so it can run later
// somewhere inside of request...
// function Request(){
// 	// constructor...
// }
// Request.prototype.get = function(url,callBack){
// 	var xhr = new XMLHttpRequest();
// 	xhr.open('GET', url);
// 	xhr.onload = function() {
// 	    if (xhr.status === 200) {
// 	        alert('User\'s name is ' + xhr.responseText);
// 	    }
// 	    else {
// 	        alert('Request failed.  Returned status of ' + xhr.status);
// 	    }
// 	};
// 	var data = xhr.send();	
// 	callBack(error, response, data);
// }

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
		// console.log(parsedData);
		res.render(
			'index',
			{
				parsedData: parsedData.results,
				imageBaseUrl: imageBaseUrl 
			}
		);
	})
});

// if you have /: that part of the path is WILD!
// in this case, /movie/:movieId will trigger on /movie/ANYTHING
// to access the ANYTHING, you go to req.params.ANYTHING
router.get('/movie/:movieId',(req, res)=>{
	// res.json(req.params);
	// somewhere, in the movieAPI backend, they made some JSON then did...
	// jsonToSend = JSON.stringify(jsonData);
	var movieId = req.params.movieId;
	var thisMovieUrl = `${apiBaseUrl}/movie/${movieId}?api_key=${config.apiKey}`;
	request.get(thisMovieUrl,(error, response, movieData)=>{
		var parsedData = JSON.parse(movieData);
		// res.writeHead(200,{contentType:'txt/html'})
		// res.json(parsedData);
		res.render('single-movie',{
			movieData: parsedData,
			imageBaseUrl:imageBaseUrl
		})
	})
})

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
	res.render(
		'students',
		{
			students:students
		}
	)
})

module.exports = router;
