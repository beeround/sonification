'use strict';
angular.module('sonificationAPP.controllers.main', [])


    .directive('emitLastRepeaterElement', function () {
        return function (scope) {
            if (scope.$last) {
                scope.$emit('DrawCharts');
            }
        };
    })

    .controller('mainCtrl', function ($scope, $http, $location, $rootScope) {
        $scope.goToCompare = function () {
            $location.path('/app/compare');
        };

        $scope.drawChart = function (love, haha, wow, sad, angry, id) {
            console.log(love, haha, wow, sad, angry, id);
            let ctx = document.getElementById("myChart" + id);

            let myChart = new Chart(ctx, {
                type: 'polarArea',
                data: {
                    labels: ["LOVE", "HAHA", "WOW", "SAD", "ANGRY"],
                    datasets: [
                        {
                            label: "Post "+(id+1),
                            backgroundColor: [
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
    })

    .controller('dashboardCtrl', function ($scope, $http, $timeout) {





        //GET FAV
        $http.get('/user/get/favorites').then(results => {
            let favMap = results.data.map((fav,index)=> {
                return $http.get('/api/get/fb/favorite?favID=' + fav.fbID).then(results => {
                    console.log(results.data);
                    return results.data;

                })
            });

                // Save to var and give back, if function has ended
        Promise.all(favMap).then(function (data2) {
            $timeout(function (){
               $scope.favData = data2;
            },0);
            console.log($scope.favData);
            data2.map((fav,index)=> {
                getAllReactions(fav, index);
            });



        });

        });

        function getAllReactions(fav, index) {
            let tempAllReactions = {
                total_love: 0,
                total_haha: 0,
                total_wow: 0,
                total_sad: 0,
                total_angry: 0
            };
            fav.posts.data.map((data) => {


                tempAllReactions.total_love = tempAllReactions.total_love + data.love.summary.total_count;
                tempAllReactions.total_haha = tempAllReactions.total_haha + data.haha.summary.total_count;
                tempAllReactions.total_wow = tempAllReactions.total_wow + data.wow.summary.total_count;
                tempAllReactions.total_sad = tempAllReactions.total_sad + data.sad.summary.total_count;
                tempAllReactions.total_angry = tempAllReactions.total_angry + data.angry.summary.total_count;
                data.total_reaction = reactionTrend(data.love.summary.total_count, data.haha.summary.total_count, data.wow.summary.total_count, data.sad.summary.total_count, data.angry.summary.total_count);

            });
            fav.allReactions = tempAllReactions;
            console.log(fav.allReactions);
            console.log(fav.name);
            console.log("ich habe noch nicht male gemacht");
            $timeout(function (){
                $scope.drawChart(fav.allReactions.total_love, fav.allReactions.total_haha, fav.allReactions.total_wow, fav.allReactions.total_sad, fav.allReactions.total_angry, index);
            },0);
            console.log("ich habe male gemacht");
            console.log(index)
        }
    })

    .controller('fbCtrl', function ($scope, $http, $timeout, $routeParams) {


        // GET Last activites
        $http.get('/user/activity').then(results => {
            $scope.lastSearchActivity = results.data;
        });

        $scope.limit = 10;

        $scope.datePicker = [];

        $scope.datePicker.date = {
            startDate: moment().subtract(6, 'days'),
            endDate: moment()
        };

        $scope.currentDate = {
            start: moment().format("DD.MM.YYYY"),
            end: ""
        };

        // Load Feed, if a parameter isset
        if ($routeParams.id) {
            getFeed($routeParams.id);
        }

        $scope.opts = {
            applyClass: 'btn-green',
            locale: {
                applyLabel: "Apply",
                fromLabel: "From",
                format: "DD-MMM-YY", //will give you 2017-01-06
                toLabel: "To",
                cancelLabel: 'Cancel',
                customRangeLabel: 'Custom range'
            },
            ranges: {
                'Last 7 Days': [moment().subtract(6, 'days'), moment()],
                'Last 30 Days': [moment().subtract(29, 'days'), moment()]
            },
            eventHandlers: {
                'apply.daterangepicker': function (ev, picker) {
                    updateFeed($scope.currentFB.id);
                }
            }
        };


        $scope.$on('DrawCharts', function () {
            $timeout(function () {
                $scope.fbData.map((fb, index) => {
                    $scope.drawChart(fb.love.summary.total_count, fb.haha.summary.total_count, fb.wow.summary.total_count, fb.sad.summary.total_count, fb.angry.summary.total_count, index)
                })
            }, 0)

        });


        $scope.sonify = function (love, haha, wow, sad, angry) {
            var velocity = reactionsInPercent(love, haha, wow, sad, angry);
            var sonifyLove1 = new Tone.PolySynth(6, Tone.Synth).toMaster();
            var sonifyHaha1 = new Tone.PolySynth(6, Tone.Synth).toMaster();
            var sonifyWow1 = new Tone.PolySynth(6, Tone.Synth).toMaster();
            var sonifySad1 = new Tone.PolySynth(6, Tone.Synth).toMaster();
            var sonifyAngry = new Tone.PolySynth(6, Tone.Synth).toMaster();
            switch (reactionTrend(love, haha, wow, sad, angry)) {
                case "love":
                    sonifyLove1.triggerAttackRelease("D4", "2n", "+0", velocity.love);
                    sonifyLove1.triggerAttackRelease("E4", "2n", "+0.1", velocity.love);
                    sonifyLove1.triggerAttackRelease("G4", "2n", "+0.2", velocity.love);
                    sonifyLove1.triggerAttackRelease("B4", "2n", "+0.3", velocity.love);
                    sonifyLove1.releaseAll();
                    break;
                case "haha":
                    sonifyHaha1.triggerAttackRelease('A5', '8n', '+0', velocity.haha);
                    sonifyHaha1.triggerAttackRelease('GB5', '8n', '+0.1', velocity.haha);
                    sonifyHaha1.triggerAttackRelease('D5', '8n', '+0.2', velocity.haha);
                    sonifyHaha1.triggerAttackRelease('D4', '8n', '+0.3', velocity.haha);
                    sonifyHaha1.releaseAll();
                    break;
                case "wow":
                    sonifyWow1.triggerAttackRelease('C4', '1n', '+0', velocity.wow);
                    sonifyWow1.triggerAttackRelease('E4', '1n', '+0', velocity.wow);
                    sonifyWow1.triggerAttackRelease('AB4', '1n', '+0', velocity.wow);
                    sonifyWow1.releaseAll();
                    break;
                case "sad":
                    sonifySad1.triggerAttackRelease('A3', '1n', '+0', velocity.sad);
                    sonifySad1.triggerAttackRelease('D4', '1n', '+0', velocity.sad);
                    sonifySad1.triggerAttackRelease('F4', '1n', '+0', velocity.sad);
                    sonifySad1.triggerAttackRelease('G3', '1n', '+2', velocity.sad);
                    sonifySad1.triggerAttackRelease('BB3', '1n', '+2', velocity.sad);
                    sonifySad1.triggerAttackRelease('D4', '1n', '+2', velocity.sad);
                    sonifySad1.triggerAttackRelease('E4', '1n', '+2', velocity.sad);
                    sonifySad1.releaseAll();
                    break;
                case "angry":
                    sonifyAngry.triggerAttackRelease('A4', '1n', '+0', velocity.angry);
                    sonifyAngry.triggerAttackRelease('C5', '1n', '+0', velocity.angry);
                    sonifyAngry.triggerAttackRelease('EB5', '1n', '+0', velocity.angry);
                    sonifyAngry.triggerAttackRelease('GB5', '1n', '+0', velocity.angry);
                    sonifyAngry.releaseAll();
                    break;
                default:
            }
            $timeout(function () {
                sonifyLove1.dispose();
                sonifyHaha1.dispose();
                sonifyWow1.dispose();
                sonifySad1.dispose();
                sonifyAngry.dispose();
            }, 5000)
        }


        $scope.searchUser = function () {
            $scope.currentWindow = "SearchList";

            $scope.searchResult = undefined;

            let data = {
                query: $scope.query.name,
            };

            $http.post('/api/post/fb/search', data).then(results => {
                $scope.searchResults = results.data;
            });

        };

        $scope.changeFeed = function (fbID) {

            getFeed(fbID)
        };

        $scope.setLimit = function (limit) {
            $scope.limit = limit;
            updateFeed($scope.currentFB.id);

        };

        $scope.showWindow = function (window) {
            $scope.currentWindow = window;
        };

        $scope.addToFavorites = function () {
            let data = {
                fbID: $scope.currentFB.id,
                name: $scope.currentFB.name

            };

            $http.post('/user/add/favorite', data).then(function () {
                $scope.isFav = true;
            })
        };

        $scope.removeFavorite = function () {
            let data = {
                fbID: $scope.currentFB.id,

            };

            $http.put('/user/remove/favorite', data).then(function () {
                $scope.isFav = false;
            })
        }


        function updateFeed(fbID){
            $scope.fbData = undefined;

            $scope.currentDate = {
                start: moment($scope.datePicker.date.startDate).format("DD.MM.YYYY"),
                end: moment($scope.datePicker.date.endDate).format("DD.MM.YYYY")
            };

            $scope.currentWindow = "Feed";

            let data = {
                id: fbID,
                start: $scope.currentDate.start,
                end: $scope.currentDate.end,
                limit: $scope.limit
            };
            console.log(data);

            $http.post('/api/post/fb/posts', data).then(posts => {
                $scope.fbData = posts.data;
                console.log($scope.fbData);

                // IF No DATA is available
                if (posts.data.length == 0) {
                    alert("No DATA")
                }
                else {

                    //Alle Reactions im Zeitraum
                    $scope.allReactions = {
                        total_love: 0,
                        total_haha: 0,
                        total_wow: 0,
                        total_sad: 0,
                        total_angry: 0
                    };

                    // Get Reactions
                    getAllReactions($scope.fbData);
                }

            });
        };

        function getFeed(fbID) {
            $scope.fbData = undefined;

            $scope.currentFB = {
                id: fbID
            };

            $scope.currentDate = {
                start: moment($scope.datePicker.date.startDate).format("DD.MM.YYYY"),
                end: moment($scope.datePicker.date.endDate).format("DD.MM.YYYY")
            };

            $scope.currentWindow = "Feed";


            let data = {
                id: fbID,
                start: $scope.currentDate.start,
                end: $scope.currentDate.end,
                limit: $scope.limit
            };

            $http.post('/api/post/fb/posts', data).then(posts => {
                $scope.fbData = posts.data;
                console.log($scope.fbData);

                // IF No DATA is available
                if ($scope.fbData.length == 0) {
                    alert("No DATA");
                }
                else {
                    $scope.currentFB = {
                        id: fbID,
                        name: $scope.fbData[0].from.name
                    };

                    //Alle Reactions im Zeitraum
                    $scope.allReactions = {
                        total_love: 0,
                        total_haha: 0,
                        total_wow: 0,
                        total_sad: 0,
                        total_angry: 0
                    };


                    // Get Reactions
                    getAllReactions($scope.fbData);


                    // Add activity, if no param
                    if ($routeParams.id) {
                        // POST Activity
                        let activity = {
                            search: {
                                fbID: $scope.currentFB.id,
                                name: $scope.currentFB.name,
                            },

                        };

                        $http.post('/user/activity', activity).then(results => {
                            $http.get('/user/activity').then(results => {
                                $scope.lastSearchActivity = results.data;
                            })
                        });
                    }

                };

                //GET FAV
                $http.get('/user/get/favorites').then(results => {
                    $scope.isFav = false;

                    // check, if element is fav
                    results.data.map(result => {
                        if (result.fbID == $scope.currentFB.id) {
                            $scope.isFav = true;
                        }
                    });
                });


            });

        }

        function getAllReactions(posts) {
            posts.map((data, index) => {

                $scope.allReactions.total_love = $scope.allReactions.total_love + data.love.summary.total_count;
                $scope.allReactions.total_haha = $scope.allReactions.total_haha + data.haha.summary.total_count;
                $scope.allReactions.total_wow = $scope.allReactions.total_wow + data.wow.summary.total_count;
                $scope.allReactions.total_sad = $scope.allReactions.total_sad + data.sad.summary.total_count;
                $scope.allReactions.total_angry = $scope.allReactions.total_angry + data.angry.summary.total_count;
            })
        }

    });