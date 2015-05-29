//single parameter instead of both the app name and injected dependences => means Angular will 
// assume this 'ContactsApp' module was created elsewhere and I am just trying to get a refenrene to it. 
angular.module('ContactsApp')
	.controller('ListController', function ($scope, $rootScope, Contact, $location) {

		$rootScope.PAGE = "all";

		$scope.contacts = Contact.query(); //this will query the server and get all of the available contacts.
		//on the server site I am only returning the contacts who is currently loggin in. 
		$scope.fields = ['firstName', 'lastName'];


		//sort the table based on the different columns
		//this function will be called when the user will click on the headings of the table
		$scope.sort = function(field) {
			$scope.sort.field = field; //whatever field is passed in
			$scope.sort.order = !$scope.sort.order;
		};
		$scope.sort.field = 'firstName'; //whatever field user clicks on. By defalut its on 'firstName'
		$scope.sort.order = false;

		//lets create a click function to go to the individual's page by clicking the individual's contact
		$scope.show = function(id) {
			$location.url('/contact/' + id);
		};	
	})

	.controller('NewController', function ($scope, $rootScope, Contact, $location) {
		
		$rootScope.PAGE = "new";

		$scope.contact = new Contact ({
			'firstName' : ['','text'],
			'lastName' : ['','text'],
			'email' : ['','email'],
			'homePhone' : ['','tel'],
			'cellPhone' : ['','tel'],
			'birthday' : ['','date'],
			'website' : ['','url'],
			'address' : ['','text']
		});

		$scope.save = function () {
			if($scope.newContact.$invalid) {
				$scope.$broadcast('record:invalid')
			} else {
				$scope.contact.$save();
				$location.url('/contacts');
			}
		};
	})

	.controller('SingleController', function ($scope, $rootScope, $location, Contact, $routeParams) {
		
		$rootScope.PAGE = "single";

		$scope.contact = Contact.get({id : parseInt($routeParams.id, 10)});
		$scope.delete = function () {
			$scope.contact.$delete();
			$location.url('/contacts'); //then send them back to the contacts list. 
		}
	});