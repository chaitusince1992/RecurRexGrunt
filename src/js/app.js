var app = angular.module('recurrex', ['ngRoute']);

app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider
        .when('/home', {
            templateUrl: "templates/home.template.html"
        })
        .when('/login', {
            templateUrl: "templates/login.template.html",
            controller: 'loginController'
        })
        .when('/dashboard', {
            templateUrl: "templates/dashboard.template.html"
        })
        .otherwise("/login", {
            templateUrl: "templates/login.template.html",
            controller: 'loginController'
        })
}]);

app.controller('loginController', ['$scope', function ($scope) {
    $scope.submitLogin = function (validFlag) {
        if (validFlag) {
            console.log($scope.passwordLogin);
            console.log($scope.emailLogin)
        }
    };
}]);
