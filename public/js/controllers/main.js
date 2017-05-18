'use strict';
angular.module('sonificationAPP.controllers.main', [])


    .directive('emitLastRepeaterElement', function() {
        return function(scope) {
            if (scope.$last){
                //scope.$emit('DrawCharts');
            }
        };
    })

    .controller('mainCtrl', function ($scope, $http, $location) {
        $scope.goToCompare = function () {
            $location.path('/app/compare');
        }
    })
    
    .controller('fbCtrl', function ($scope, $http, $timeout) {

        $scope.datePicker = {
            date : {startDate: null, endDate: null}

        };

        $scope.$on('DrawCharts', function(){
            $timeout(function () {
                $scope.fbData.map((fb, index) => {
                    $scope.drawChart(fb.love.summary.total_count, fb.haha.summary.total_count, fb.wow.summary.total_count, fb.sad.summary.total_count, fb.angry.summary.total_count, index)
                })
            },0)

        });


        $scope.labels =["Love", "Haha", "Wow", "Sad", "Angry"];

        $scope.drawChart = function (love, haha, wow, sad, angry, id) {

            let ctx = document.getElementById("myChart"+id);
            let myChart = new Chart(ctx, {
                type: 'polarArea',
                data: {
                    labels: ["LOVE", "HAHA", "WOW", "SAD", "ANGRY"],
                    datasets: [
                        {
                            label: "Post1",
                            backgroundColor:[
                                "#ffa3d3",
                                "#fffd00",
                                "#38dacd",
                                "#949494",
                                "#9a0400"

                            ],
                            borderColor: "rgba(179,181,198,1)",
                            pointBackgroundColor: "rgba(179,181,198,1)",
                            pointBorderColor: "#fff",
                            pointHoverBackgroundColor: "#fff",
                            pointHoverBorderColor: "rgba(179,181,198,1)",
                            data: [love, haha, wow, sad, angry]
                        },


                    ]
                },

            });
        }

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


    });