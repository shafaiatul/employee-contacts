var express = require('express'),
	api 	= require('./api'),
	users 	= require('./accounts'),
	app 	= express();

app
	.use(express.static('./public'))
//now I have applied this 'users authentication' into the application
	.use(users)
//now I have applied this 'api' into the application
	.use('/api', api) //'/api' prefixes all the routes into the'api' object by '/api'
//now the browser has make request through (/api/conact), (/api/contact/:id)
//now that I have backend created, I have to attach the frontend with the backend
	.get('*', function (req, res) {
		//I dont want someone comes to the website and load this ['public/main.html'] angular application unless they are logged in
		if (!req.user) { // user is logged not in.(making use of my last piece of middleware from account.js)
			res.redirect('/login')
		} else {
		res.sendfile('public/main.html');
		}
	})
	.listen(3000);