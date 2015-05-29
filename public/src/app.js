angular.module('ContactsApp', ['ngRoute','ngResource','ngMessages'])

	.config(function ($routeProvider, $locationProvider) { //this is where I am going to set up the different Routes 
		$routeProvider
			.when('/contacts', {
				controller : 'ListController',
				templateUrl : 'views/list.html'
			})
			.when('/contact/new', {
				controller : 'NewController',
				templateUrl : 'views/new.html'
			})
			.when('/contact/:id', {
				controller  : 'SingleController',
				templateUrl : 'views/single.html'
			})
			.otherwise({
				redirectTo: '/contacts'
			});
		$locationProvider.html5Mode(true);
	});