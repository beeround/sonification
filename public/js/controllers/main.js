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
                type: 'radar',
                data: {
                    labels: ["LIKE", "WOW", "SAD", "HAPPY", "LOVE", "ANGRY"],
                    datasets: [
                        {
                            label: "LIKE",
                            backgroundColor: "rgba(179,181,198,0.2)",
                            borderColor: "rgba(179,181,198,1)",
                            pointBackgroundColor: "rgba(179,181,198,1)",
                            pointBorderColor: "#fff",
                            pointHoverBackgroundColor: "#fff",
                            pointHoverBorderColor: "rgba(179,181,198,1)",
                            data: [65, 59, 90, 81, 56, 55, 40]
                        },
                        {
                            label: "WOW",
                            backgroundColor: "rgba(255,99,132,0.2)",
                            borderColor: "rgba(255,99,132,1)",
                            pointBackgroundColor: "rgba(255,99,132,1)",
                            pointBorderColor: "#fff",
                            pointHoverBackgroundColor: "#fff",
                            pointHoverBorderColor: "rgba(255,99,132,1)",
                            data: [28, 48, 40, 19, 96, 27, 100]
                        },
                        {
                            label: "SAD",
                            backgroundColor: "rgba(255,99,132,0.2)",
                            borderColor: "rgba(255,99,132,1)",
                            pointBackgroundColor: "rgba(255,99,132,1)",
                            pointBorderColor: "#fff",
                            pointHoverBackgroundColor: "#fff",
                            pointHoverBorderColor: "rgba(255,99,132,1)",
                            data: [100, 40, 30, 10, 60, 40, 10,]
                        },
                        {
                            label: "HAPPY",
                            backgroundColor: "rgba(255,99,132,0.2)",
                            borderColor: "rgba(255,99,132,1)",
                            pointBackgroundColor: "rgba(255,99,132,1)",
                            pointBorderColor: "#fff",
                            pointHoverBackgroundColor: "#fff",
                            pointHoverBorderColor: "rgba(255,99,132,1)",
                            data: [10, 20, 40, 60, 70, 80, 90]
                        },
                        {
                            label: "LOVE",
                            backgroundColor: "rgba(255,99,132,0.2)",
                            borderColor: "rgba(255,99,132,1)",
                            pointBackgroundColor: "rgba(255,99,132,1)",
                            pointBorderColor: "#fff",
                            pointHoverBackgroundColor: "#fff",
                            pointHoverBorderColor: "rgba(255,99,132,1)",
                            data: [80, 50, 40, 20, 50, 60, 70]
                        },
                        {
                            label: "ANGRY",
                            backgroundColor: "rgba(255,99,132,0.2)",
                            borderColor: "rgba(255,99,132,1)",
                            pointBackgroundColor: "rgba(255,99,132,1)",
                            pointBorderColor: "#fff",
                            pointHoverBackgroundColor: "#fff",
                            pointHoverBorderColor: "rgba(255,99,132,1)",
                            data: [10, 20, 40, 60, 70, 80, 50]
                        }
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

