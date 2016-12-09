var app = angular.module('recurrex', ['ngRoute']);

app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider
        .when('/home', {
            templateUrl: "templates/home.template.html"
        })
        .when('/login', {
            templateUrl: "templates/login.template.html"
        })
        .when('/dashboard', {
            templateUrl: "templates/dashboard.template.html"
        })
        .otherwise("/home", {
            templateUrl: "templates/home.template.html"
        })
}]);
