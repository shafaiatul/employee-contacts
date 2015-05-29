angular.module('ContactsApp')
	.filter('labelCase', function() {
		return function (input) {
			input = input.replace(/([A-Z])/g, ' $1');
			return input[0].toUpperCase() + input.slice(1);
			//lets add this file to main.html and add this filter to field/firstName
		};
	})

	.filter('camelCase', function () {
        return function (input) {
            return input.toLowerCase().replace(/ (\w)/g, function (match, letter) {
                return letter.toUpperCase();
            });
        };
    })	

	.filter('keyFilter',function() {
		return function (obj, query) { //firstName , lastName are "query", contact is "obj"
			var result = {};
			angular.forEach(obj, function (val, key) {
				if(key !== query) {
					result[key] = val;
				}
			});
			return result;
		};
	});