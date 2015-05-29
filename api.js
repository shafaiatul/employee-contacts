var express = require('express'),
	Bourne = require('bourne'),
	bodyParser = require('body-parser'),
	db = new Bourne('data.json'),
	router = express.Router();

//lets add a piece of middleware thats only going to be Temporary.
router
	//using bodyParser middleware to parse the different request body
	.use(bodyParser.json())
	
	.route('/contact')
		.get(function (req, res) {
			db.find({ userId : parseInt(req.user.id, 10)}, function(err, data) {
				res.json(data); //send data to the browser
			});
		})
		.post(function (req, res) { //user is trying to make new contact request 
			var contact  = req.body;
			contact.userId = req.user.id;

			db.insert(contact, function (err, data) {
				res.json(data);
			});
		})

router
	.param('id', function(req, res, next) { //this 'id' refers to id of this ('/contacts/:id')
		req.dbQuery = {id : parseInt(req.params.id, 10)} //this Query will continuously be passed down to the routes below
		next();
	})
	.route('/contact/:id') //any of the function goes on this route that .param middleware will be executed first
		.get(function (req, res) {
			db.findOne(req.dbQuery, function (err, data) {
				res.json(data); //sending the response as Json to the browser
			});
		})
		.put(function (req, res) { //when user wants to update individual record
			//I am gonna get the contact info (which is being updated) by doing
			var contact = req.body;
			delete contact.$promise;
			delete contact.$resolved;
			db.update(req.dbQuery, contact, function (err, data) { //sending dbQuery request and (contact)-> as the data I wanna updated with.
				res.json(data[0]); //we wanna update single item 
			});
		})
		.delete(function (req, res) {
			db.delete(req.dbQuery, function () {
				res.json(null); //'null' bcos there is nothing else to send back to browser
			});
		});

//make sure export the router module and lets go back to server.js file and require this 'api'
module.exports = router;