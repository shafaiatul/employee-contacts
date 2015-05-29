angular.module('ContactsApp')
	.value('FieldTypes', {
		text : ['Text','should be text'],
		email : ['Email','should be an email address'],
		number : ['Number','should be a number'],
		date : ['Date','should be a date'],
		datetime : ['Datetime','should be a datetime'],
		time : ['Time','should be a time'],
		month : ['Month','should be a month'],
		week : ['Week','should be a week'],
		url : ['Url','should be a URL'],
		tel : ['Phone Number','should be a Phone Number'],
		color : ['Color','should be a color']
	})

	.directive('formField', function($timeout, FieldTypes) {
		return {
			restrict: 'EA', //element and attribute
			templateUrl: 'views/form-field.html',
			replace: true,
			scope: {
				record: '=', //(contact values)two ways binding, i need to save back to the contact objects
				field: '@', // we dont need to be able to send back to them
				live: '@', // we dont need to be able to send back to them
				required: '@' // we dont need to be able to send back to them
			},
			link: function ($scope, element, attr) { //it allows us to modify what goes on when the directive is created, replaces the content in the form-field directive in form-field.html
				$scope.$on('record:invalid', function () {
					$scope[$scope.field].$setDirty();
				});

				$scope.types = FieldTypes;

				$scope.remove = function (field) {
					delete $scope.record[field];
					$scope.blurUpdate(); //update is as u finished deleting it. 
				};
				//'ng-blur' method from form-field template
				$scope.blurUpdate = function () {
					if ($scope.live !== 'false') {// value of 'live' is string not boolean
						$scope.record.$update(function(updatedRecord) { //send the contact back to the server, update it and then I ge the updated value
							$scope.record = updatedRecord;
						});
					}
				};
				//'ng-change' method from form-field template (whenever the input element is changed)
				var saveTimeout;
				$scope.update = function () {
					$timeout.cancel(saveTimeout);
					saveTimeout = $timeout($scope.blurUpdate, 1000); //this function will be called every times the user tyes a character into the field.
				};
			}
		};
	})
	
	.directive('newField', function ($filter, FieldTypes) {
		return{
			restrict : 'EA',
			templateUrl : 'views/new-field.html',
			replace : true,
			scope : {
				record : '=',
				live: '@'
			},	

			require: '^form', //parent form (form element from new.html)

			link : function ($scope, element, attr, form) {
				$scope.types = FieldTypes;
				$scope.field = {};

				$scope.show = function (type) {
					$scope.field.type = type;
					$scope.display = true;
				};

				$scope.remove = function () {
					$scope.field = {};
					$scope.display = false;
				};

				$scope.add = function () {
					if(form.newField.$valid) {
						$scope.record[$filter('camelCase')($scope.field.name)] = [$scope.field.value, $scope.field.type];
						$scope.remove(); //to reset the directive
						//last step is to update with the server using the blurUpdate function
							if ($scope.live !== 'false') {// value of 'live' is string not boolean
							$scope.record.$update(function(updatedRecord) { //send the contact back to the server, update it and then I ge the updated value
								$scope.record = updatedRecord;
							});
						}
					}
				};

			}
		};
	});


