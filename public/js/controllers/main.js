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
                type: 'polarArea',
                data: {
                    labels: ["LOVE", "HAHA", "WOW", "ANGRY", "SAD"],
                    datasets: [
                        {
                            label: "Post1",
                            backgroundColor:[
                                "#ffa3d3",
                                "#fffd00",
                                "#38dacd",
                                "#9a0400",
                                "#949494"
                            ],
                            borderColor: "rgba(179,181,198,1)",
                            pointBackgroundColor: "rgba(179,181,198,1)",
                            pointBorderColor: "#fff",
                            pointHoverBackgroundColor: "#fff",
                            pointHoverBorderColor: "rgba(179,181,198,1)",
                            data: [1, 14, 2, 80, 2]
                        },


                    ]
                },
                options: {
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero: true
                            }
                        }]
                    }
                }
            });
        }
    });

