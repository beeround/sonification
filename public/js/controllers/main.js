'use strict';
angular.module('sonificationAPP.controllers.main', [])


    .directive('emitLastRepeaterElement', function () {
        return function (scope) {
            if (scope.$last) {
                scope.$emit('DrawCharts');
            }
        };
    })

    .controller('mainCtrl', function ($scope, $http, $location, $rootScope, $timeout) {
        $scope.goToCompare = function () {
            $location.path('/app/compare');
        };
        let music = false;
        $scope.sonify = function (love, haha, wow, sad, angry) {

            console.log(music);

            if (music == false){
                music = true;
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
                }}
            $timeout(function () {
                sonifyLove1.dispose();
                sonifyHaha1.dispose();
                sonifyWow1.dispose();
                sonifySad1.dispose();
                sonifyAngry.dispose();
                music = false;
            }, 5000)
        };

        $scope.drawChart = function (love, haha, wow, sad, angry, id) {
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

        };

        $scope.reactionTrendValue = function (love, wow, haha, sad, angry) {
            let value;

            function reactionInProcent(reaction, total) {
                const reactioninProcent = reaction / total;
                return reactioninProcent;
            }

            const total = love + wow + haha + sad + angry;
            love = reactionInProcent(love, total);
            wow = reactionInProcent(wow, total);
            haha = reactionInProcent(haha, total);
            sad = reactionInProcent(sad, total);
            angry = reactionInProcent(angry, total);

            if (love > wow && love > haha && love > sad && love > angry) {
                value = love - (0.9 * sad) - (0.9 * angry) + (0.1 * haha) + (0.1 * wow);
            } else if (wow > love && wow > haha && wow > sad && wow > angry) {
                value = wow - (0.9 * love) - (0.9 * haha) + (0.1 * angry) + (0.1 * sad);
            } else if (haha > love && haha > wow && haha > sad && haha > angry) {
                value = haha - (0.9 * sad) - (0.9 * angry) + (0.1 * love) + (0.1 * wow);
            } else if (sad > love && sad > haha && sad > wow && sad > angry) {
                value = sad - (0.9 * angry) + (0.1 * love) + (0.1 * haha) + (0.1 * wow);
            } else if (angry > love && angry > haha && angry > wow && angry > sad) {
                value = angry - (0.9 * sad) + (0.1 * haha) + (0.1 * sad) + (0.1 * wow);
            }
            console.log(value);
            return value;
        }
    })

    .controller('dashboardCtrl', function ($scope, $http, $timeout) {

        //GET FAV
        $http.get('/user/get/favorites').then(results => {
            let favMap = results.data.map((fav,index)=> {
                return $http.get('/api/get/fb/favorite?favID=' + fav.fbID).then(results => {
                    return results.data;

                })
            });

                // Save to var and give back, if function has ended
        Promise.all(favMap).then(function (data2) {
            $timeout(function (){
               $scope.favData = data2;
            },0);
            data2.map((fav,index)=> {
                getAllReactions(fav, index);
            });



        });

        });

        $scope.removeFav = "hallo";
        $scope.tempdIndex = null;

        $scope.openModal = function (tempFav, index) {
            $('#ModalRemoveFav').modal('show');
            $scope.removeFav = tempFav;
            $scope.tempdIndex = index;
        };


        $scope.removeFavorite = function () {

            if ($scope.removeFav != null){
                let data = {
                    fbID: $scope.removeFav.id,

                };
                $scope.removeFav.index = $scope.tempdIndex;
                $('#ModalRemoveFav').modal('hide');

                $http.put('/user/remove/favorite', data).then(function () {
                    $scope.isFav = false;
                })
            }}

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
            fav.total_reaction = reactionTrend(tempAllReactions.total_love,tempAllReactions.total_haha,tempAllReactions.total_wow,tempAllReactions.total_sad,tempAllReactions.total_angry);
            fav.total_reactionvalue = $scope.reactionTrendValue(tempAllReactions.total_love,tempAllReactions.total_haha,tempAllReactions.total_wow,tempAllReactions.total_sad,tempAllReactions.total_angry);
            $timeout(function (){
                $scope.drawChart(fav.allReactions.total_love, fav.allReactions.total_haha, fav.allReactions.total_wow, fav.allReactions.total_sad, fav.allReactions.total_angry, index);
            },0);
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

    })

    .controller('compareCtrl', function ($scope, $http, $timeout) {

        //LEFT
        $scope.searchUserOne = function () {
            $scope.currentWindowOne = "SearchList";
            $scope.dataLeft = null;

            $scope.searchResultsOne = undefined;

            let data = {
                query: $scope.queryOne.name,
            };

            $http.post('/api/post/fb/search', data).then(results => {
                $scope.searchResultsOne = results.data;
            });
        };

        $scope.changeFeed = function (fbID, side) {

            getFeed(fbID, side)
        };


        //RIGHT
        $scope.searchUserTwo = function () {
            $scope.currentWindowTwo = "SearchList";
            $scope.dataRight = null;


            $scope.searchResultsTwo = undefined;

            let data = {
                query: $scope.queryTwo.name,
            };

            $http.post('/api/post/fb/search', data).then(results => {
                $scope.searchResultsTwo = results.data;
            });
        };




        function getFeed(fbID, side) {
            $http.get('/api/get/fb/favorite?favID=' + fbID).then(results => {
                console.log(results.data);
                getAllReactions(results.data);

                if(side == 'left'){
                    $scope.dataLeft = results.data;

                }
                else {
                    $scope.dataRight = results.data;

                }


            })
        }

        function getAllReactions(data) {
            let tempAllReactions = {
                total_love: 0,
                total_haha: 0,
                total_wow: 0,
                total_sad: 0,
                total_angry: 0
            };
            data.posts.data.map((result) => {


                tempAllReactions.total_love = tempAllReactions.total_love + result.love.summary.total_count;
                tempAllReactions.total_haha = tempAllReactions.total_haha + result.haha.summary.total_count;
                tempAllReactions.total_wow = tempAllReactions.total_wow + result.wow.summary.total_count;
                tempAllReactions.total_sad = tempAllReactions.total_sad + result.sad.summary.total_count;
                tempAllReactions.total_angry = tempAllReactions.total_angry + result.angry.summary.total_count;
                result.total_reaction = reactionTrend(result.love.summary.total_count, result.haha.summary.total_count, result.wow.summary.total_count, result.sad.summary.total_count, result.angry.summary.total_count);

            });
            data.allReactions = tempAllReactions;
            data.total_reaction = reactionTrend(tempAllReactions.total_love,tempAllReactions.total_haha,tempAllReactions.total_wow,tempAllReactions.total_sad,tempAllReactions.total_angry);
            data.total_reactionvalue = $scope.reactionTrendValue(tempAllReactions.total_love,tempAllReactions.total_haha,tempAllReactions.total_wow,tempAllReactions.total_sad,tempAllReactions.total_angry);

        }

    })

    .controller('settingsCtrl', function ($scope, $http, $timeout, soundService) {
        soundService.getFirstVersion();
    });



