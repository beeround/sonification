'use strict';
angular.module('sonificationAPP',['angular.filter','daterangepicker','ngRoute', 'sonificationAPP.controllers.main', 'sonificationAPP.controllers.header'])

    .config(function ($routeProvider, $locationProvider ) {

    $routeProvider.
    when('/app', {
        templateUrl: '/app/partials/dashboard'
    }).
    when('/app/search', {
        templateUrl: '/app/partials/search'

    }).
    when('/app/search/:id', {
        templateUrl: '/app/partials/search'

    }).
    when('/app/compare', {
        templateUrl: '/app/partials/compare'

    });

    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });

});