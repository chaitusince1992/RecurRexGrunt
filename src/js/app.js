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
        .when('/products', {
            templateUrl: "templates/products.template.html",
            controller: 'productsController'

        })
        .when('/subscriptions', {
            templateUrl: "templates/subscriptions.template.html",
            controller: 'subscriptionsController'

        })
        .otherwise("/login", {
            templateUrl: "templates/login.template.html",
            controller: 'loginController'
        })
}]);

app.controller('loginController', ['$scope', 'services', 'constants', '$location', function ($scope, services, constants, $location) {
    $scope.init = function () {
        console.log(localStorage.getItem('accessToken'));
        if (localStorage.getItem('accessToken') == 'null' || localStorage.getItem('accessToken') == null) {

        } else {
            $location.path("products");
        }
    }
    $scope.submitLogin = function (validFlag) {
        if (validFlag) {
            console.log($scope.passwordLogin);
            console.log($scope.emailLogin);
            services.registerOrLogin(constants.api.authenticate, {
                email: $scope.emailLogin,
                password: $scope.passwordLogin
            }, function (data) {
                console.log(data);
                localStorage.setItem('accessToken', data.access_token);
                $location.path("products");
            }, function (data) {
                console.log(data);
                if (data.status != 405) {
                    $scope.errorMessageLogin = "*" + data.data.message;
                    $scope.emailLogin = '';
                    $scope.passwordLogin = '';
                }
            });
        }
    };
}]);
app.controller('subscriptionsController', ['$scope', 'services', 'constants', '$location', function ($scope, services, constants, $location) {
    $scope.init = function () {
        services.callService(constants.api.subscription, 'POST', '', function (res) {
            console.log(res);
            $scope.subscriptions = res.data;
        }, function (data) {
            console.log(data);
        });
    };
    $scope.dateFormat = function (date) {
        console.log(new Date(date));
        return new Date(date).toDateString();
    };
    $scope.procesState = function (code) {
        return {
            'background-color': 'orange'
        }
    };
    $scope.orderByDate = function (data) {
//        console.log(data);
        console.log(new Date(data.delivery_date).getTime());
        return -new Date(data.delivery_date).getTime();
    }
}]);

app.controller('productsController', ['$scope', 'services', 'constants', '$location', function ($scope, services, constants, $location) {
    $scope.init = function () {
        services.callService(constants.api.productList, 'POST', '', function (res) {
            console.log(res.data);
            $scope.productList = res.data;
        }, function () {

        });
    }
    $scope.productimage = function (prodData) {
        return {
            'background-image': 'url(' + prodData.coverPictureThumb + ')'
        }
    }
    $scope.clickedOnProduct = function (product) {
        console.log(product);
        console.log(product.code);
        console.log(product.recurrence);
        console.log($scope);
    };
    $scope.selectedRecur = function (selectedOne) {
        return JSON.parse(selectedOne);
    }
    $scope.changePlan = function () {
        console.log($scope);
    };
    $scope.clickOnRecur = function (recur) {
        console.log(recur);
    };
    $scope.signout = function (validFlag) {
        localStorage.removeItem('accessToken');
        $location.path("login");
    };
}]);

app.constant("constants", {
    api: {
        register: 'http://demo2.recurrex.com/api/v1/user/register',
        authenticate: 'http://demo2.recurrex.com/api/v1/user/authenticate',
        productList: 'http://demo2.recurrex.com/api/v1/product/public/list',
        subscribe: 'http://demo2.recurrex.com/api/v1/subscribe/multiple',
        subscription: 'http://demo2.recurrex.com/api/v1/user/subscription',
    },
    apiDetails: {
        app_key: "9271837387576961055085871",
        app_secret: "ra5bkuA5NSpr0oG4HIJ73FMwgWFjh9tlLMJRaeRuGWMl44yUiQ",
    }

});
app.service('services', ['$http', 'constants', function ($http, commonConstants) {
    var self = this;
    self.callService = function (url, methodType, data, callbackSuccess, callbackError) {
        if (typeof data == 'object') {} else {
            data = {};
        }
        data["app_key"] = commonConstants.apiDetails.app_key;
        data["app_secret"] = commonConstants.apiDetails.app_secret;
        data["access_token"] = localStorage.getItem('accessToken');
        $http({
            url: url,
            method: methodType,
            data: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
            }
        }).then(function (response) {
            callbackSuccess(response.data);
        }, function (response) {
            callbackError(response);
        });
    };
    self.registerOrLogin = function (url, data, callbackSuccess, callbackError) {
        data["app_key"] = commonConstants.apiDetails.app_key;
        data["app_secret"] = commonConstants.apiDetails.app_secret;
        console.log(data);
        $http({
            url: url,
            method: 'POST',
            data: JSON.stringify(data),
        }).then(function (response) {
            callbackSuccess(response.data);
        }, function (response) {
            callbackError(response);
        });
    }
}]);
