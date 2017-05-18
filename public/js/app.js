'use strict';
angular.module('sonificationAPP',['ngRoute', 'sonificationAPP.controllers.main', 'sonificationAPP.controllers.header', 'chart.js'])

    .config(function ($routeProvider, $locationProvider ) {

    $routeProvider.
    when('/app', {
        templateUrl: '/app/partials/dashboard'
    }).
    when('/app/search', {
        templateUrl: '/app/partials/search'

    });

    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });

});