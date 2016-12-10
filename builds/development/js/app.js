var app = angular.module('recurrex', ['ngRoute']);

app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider
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
    $scope.loadSpinner = false;
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
            $scope.loadSpinner = true;
            services.registerOrLogin(constants.api.authenticate, {
                email: $scope.emailLogin,
                password: $scope.passwordLogin
            }, function (data) {
                console.log(data);
                localStorage.setItem('accessToken', data.access_token);
                $location.path("products");
                $scope.loadSpinner = false;
            }, function (data) {
                console.log(data);
            });
        }
    };
    $scope.submitSignup = function (validFlag) {
        if (validFlag) {
            console.log($scope.firstname);
            console.log($scope.lastname);
            console.log($scope.emailSignup);
            console.log($scope.passwordSignup);
            console.log($scope.phonenumber);
            $scope.loadSpinner = true;
            services.registerOrLogin(constants.api.register, {
                first_name: $scope.firstname,
                last_name: $scope.lastname,
                email: $scope.emailSignup,
                password: $scope.passwordSignup,
                phone: $scope.phonenumber
            }, function (data) {
                console.log(data);
                localStorage.setItem('accessToken', data.access_token);
                $location.path("products");
                $scope.loadSpinner = false;
            }, function (data) {
                console.log(data);
                if (data.status != 405) {
                    $scope.errorMessageLogin = "*" + data.data.message;
                    $scope.emailLogin = '';
                    $scope.passwordLogin = '';
                    $scope.loadSpinner = false;
                }
            });
        }
    };
}]);
app.controller('subscriptionsController', ['$scope', 'services', 'constants', '$location', function ($scope, services, constants, $location) {
    $scope.loadSpinner = false;
    $scope.init = function () {
        $scope.loadSpinner = true;
        services.callService(constants.api.subscription, 'POST', '', function (res) {
            console.log(res);
            if (res.data == null)
                $scope.errorMessageSubscription = true;
            else
                $scope.subscriptions = res.data;
            $scope.loadSpinner = false;
        }, function (data) {
            console.log(data);
            $scope.loadSpinner = false;
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
    $scope.loadSpinner = false;
    $scope.disablePaymentFlag = true;
    $scope.init = function () {
        $scope.loadSpinner = true;
        services.callService(constants.api.productList, 'POST', '', function (res) {
            console.log(res.data);
            $scope.productList = res.data;
            $scope.loadSpinner = false;
        }, function () {
            $scope.loadSpinner = false;
        });
    }
    $scope.productimage = function (prodData) {
        return {
            'background-image': 'url(' + prodData.coverPictureThumb + ')'
        }
    }
    $scope.clickedOnProduct = function (product) {
        console.log(product.recurrence);
        $scope.subscriptionPopup = true;
        $scope.recur = product.recurrence;
        $scope.productCode = product.code;
    };
    $scope.selectedRecur = function (selectedOne) {
        console.log(selectedOne);
        $scope.payments = selectedOne.payment_type_formatted;
        $scope.paymentListVisibility = true;
        $scope.recurType = selectedOne.code;
    };
    $scope.test = function () {
        console.log($scope.subscribe)
    }
    $scope.selectedPayment = function (selectedOne) {
        console.log(selectedOne);
        //        $scope.disablePaymentFlag = false;
        $scope.paymentMode = selectedOne;
    };
    $scope.subscribeToProduct = function () {
        var dateValue = new Date($scope.startingDate);
        var dateString = (dateValue.getDate() + "0").substr(0, 2) + '-' + (dateValue.getMonth() + 1) + '-' + dateValue.getFullYear();
        var subscriptionObject = {
            recurrence_code: $scope.recurType,
            payment_type: $scope.paymentMode,
            payment_method: 'sms2_pay_and_email',
            products: [{
                qty: $scope.noOfProducts,
                code: $scope.productCode
            }],
            start_date: dateString
        };
        var subscriptions = [subscriptionObject];
        console.log(subscriptions);
        $scope.loadSpinner = true;
        services.callService(constants.api.subscribe, 'POST', {
            subscriptions: subscriptions
        }, function (res) {
            console.log(res);
            $scope.subscriptionPopup = false;
            $scope.recur = [];
            alert("Successfully subscribed..!!");
            $scope.loadSpinner = false;
        }, function (res) {
            alert(res.data.message);
            $scope.loadSpinner = false;
        });
    };
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
    $scope.closePopUp = function () {
        $scope.subscriptionPopup = false;
    }
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

app.directive('footerDir', function () {
    return {
        template: '<div class="page-footer"> \
                    <div class="copy-rights">&copy; NPM Technologies</div> \
                    <div class="social-links-contaner">Social Network \
                    <a class="social-links" href="https://www.facebook.com/NPMTechnologies" name="Facebook"> \
                    <img src="img/FB-fLogo-Blue-broadcast-2.png" /> \
                    </a><a class="social-links" href="https://twitter.com/npmtechnologies"> \
                    <img src="img/Twitter_Logo_Blue.png" /></a></div> </div>',
        replace: true
    }
});
