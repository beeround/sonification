'use strict';
angular.module('sonificationAPP.controllers.main', [])

    .controller('mainCtrl', function ($scope, $http, $location) {
        $scope.goToCompare = function () {
            $location.path('/app/compare');
        }
    })

    .controller('chartCtrl', function ($scope) {
        $scope.chartTitle = 'Test';

        getChart();

        function getChart() {
            var ctx = document.getElementById("myChart");
            var myChart = new Chart(ctx, {

            });
        }
    });

