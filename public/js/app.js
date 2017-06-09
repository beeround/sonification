'use strict';
angular.module('sonificationAPP',['googlechart','angular.filter','daterangepicker','ngRoute', 'sonificationAPP.controllers.main', 'sonificationAPP.controllers.header','sonificationAPP.services.sounds'])

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

    }).
    when('/app/settings', {
        templateUrl: '/app/partials/settings'

    });

    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });

});