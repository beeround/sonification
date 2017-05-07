'use strict';
angular.module('sonificationAPP.controllers.main', [])

    .controller('mainCtrl', function ($scope, $http, $location) {
        $scope.goToCompare = function () {
            $location.path('/app/compare');
        }
    })
    
    .controller('fbCtrl', function ($scope, $http) {

        $scope.searchUser = function () {
            $scope.currentWindow = "SearchList";

            $scope.searchResult = undefined;

            let data = {
                query : $scope.query.name,
            };

            $http.post('/api/post/fb/search', data ).then(results => {
                $scope.searchResults = results.data;
            });

        };

        $scope.changeFeed = function (fbID) {

            $scope.currentWindow = "Feed";
            $scope.fbData = undefined;

            let data = {
                id : fbID
            };

            $http.post('/api/post/fb/posts', data ).then(posts => {
                $scope.fbData = posts.data;
            });

        };

        $scope.showWindow = function (window) {
            $scope.currentWindow = window;
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

