'use strict';
angular.module('sonificationAPP',['ngRoute', 'sonificationAPP.controllers.main', 'sonificationAPP.controllers.header']).

config(function ($routeProvider, $locationProvider ) {

    $routeProvider.
    when('/app', {
        templateUrl: '/app/partials/dashboard'
    }).
    when('/app/compare', {
        templateUrl: '/app/partials/compare'

    });

    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });

});