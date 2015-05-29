var express = require('express'),
	bodyParser = require('body-parser'),
	session = require('express-session'),
	Bourne = require('bourne'),
	crypto = require('crypto'); 		//to encript the password

var router = express.Router(), 			//creating router
	db = new Bourne('users.json');       // creating our database

function hash(password) {
	return crypto.createHash('sha256').update(password).digest('hex');
}

	//Lets start with the router using bodyParser middleware
router
	.use(bodyParser.urlencoded()) 		//one form of body I need to parse
	.use(bodyParser.json()) 			//parseing json body

	.use(session({secret: 'asdfghjklj34k5lfjfflkdsflk453ljldfsdf'}))  //random keys for session middle secret
	//Now I am ready to create the login and logout routes
	//There are couple of different routes I will need :-
	//When users first come to the website if they are not logged in, I will redirect them to the login page 
	//and there will a get request to '/login'
	.get('/login', function (req, res) {
		res.sendfile('public/login.html');
	})
	//when users actually type username, password and click login, there will be a post request to the very same route.
	//this route will be called, when the user attempted to login with the username and password. This means I need to
	//know what the username and password are. so I have a create variable 'user'
	.post('/login', function (req, res) {
		var user = {
			username : req.body.username,
			password : hash(req.body.password) //in the database I will store the password as hashed password(not in plain text)
		}
		db.findOne(user, function(err, data) {
			if(data) { //if the request  'user' data was returned, its possible no data would be returned
				req.session.userId = data.id //Id of the user object found in database.
				res.redirect('/'); //take the user to the homepage.
			} else {
				res.redirect('/login'); //take/keep the user to login page
			}
		});
	})
	//on that (.get '/login') route there is going to be a sign up form, just in case the user is first time visitor to the site
	//and they wanna create a new account. When they click on the 'create new account' button, instead of posting to 
	//login that will post to '/register'. (*When user post their register user form, I will get the username and password
	//same way I did when I post a login*)
	.post('/register', function (req, res) {
		var user = {
			username : req.body.username,
			password : hash(req.body.password), //in the database I will store the password as hashed password(not in plain text)
			options : {} // (I will use it later) allowing the users to choose some option in the applcation 
		}
		//now that I have user object here, ** I have to make sure no other users with this username exist **
		db.find({username: user.username}, function (err, data) {
			if(!data.length) { //after quering database if identical username isn't found (data.length = 0) 
				db.insert(user, function (err, data) {
					//after inserting the user in database
					req.session.userId = data.id //Id of the user object found in database.
					res.redirect('/'); //take the  new user to the homepage.
				});
			} else {
				res.redirect('/login')
			}
		});
	})
	//Finally I will send a get request to '/logout', when the user is ready to logout. 
	.get('/logout', function (req, res) {
		req.session.userId = null;
		res.redirect('/');
	})

	//every route or piece of middleware is checked whenever resquests come to the server. when I add this router object 
	//to the main server.js file, this piece of middleware will be checked against every single request coming in.
	//Lets say if req.session.userId is just logged-in OR logged-in in a previous request, then I use (req.user) as 
	//shortcut way for me to access user. 

	.use(function (req, res, next) {
		if(req.session.userId) {
			db.findOne ({id: req.session.userId}, function (err, data) {
				req.user = data; //which will be the single user record. not only the id but also all the other info about the user
			});
		}
		next(); //so the request moves on.
	})

	//----Now I finished user authentication--------I can do
	module.exports = router;