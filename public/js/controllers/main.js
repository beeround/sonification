'use strict';
angular.module('sonificationAPP.controllers.main', [])


    .directive('emitLastRepeaterElement', function () {
        return function (scope) {
            if (scope.$last) {
                scope.$emit('DrawCharts');
            }
        };
    })

    .controller('mainCtrl', function ($scope, $http, $location, $rootScope, $timeout, soundService) {
        $scope.playSettings = [];
        $scope.data = {};
        $scope.optionsFromSelectedSound = null;

        $scope.stopPlaying = function () {
            soundService.stopPlaying();
            console.log("stop music");
        };

        $(document).keyup(function(e) {
            if (e.keyCode == 27) { // escape key maps to keycode `27`
                if($rootScope.currentPlay){
                    soundService.stopPlaying();
                }
            }
        });
        $scope.sounds = soundService.getSounds();
        function getOptionbySound(sound){

            $scope.sounds.map(result=>{
                if (result.name == sound ){
                    $scope.optionsFromSelectedSound = result.options;
                    console.log("test");
                    let dataOption = {
                        selectedSoundOption : $scope.optionsFromSelectedSound[0].name
                    };
                    $http.post('/user/change/selectedSoundOption', dataOption);
                    $scope.data.selectedSoundOption = $scope.optionsFromSelectedSound[0].name;
                }
            })

        };
        $http.get('/user/get/selectedSoundSkin').then(result => {
            if(result.data != ""){
                $scope.data.selectedSound = result.data;
                getOptionbySound($scope.data.selectedSound);
            }
            else {
                let tmp = soundService.getSounds();
                $scope.data.selectedSound = tmp[0].name;
            }
        });
         $http.get('/user/get/selectedSoundOption').then(result => {
         if(result.data != ""){
         $scope.data.selectedSoundOption = result.data;
         }
         else {
             let tmp = soundService.getSounds();
             console.log(tmp[0].options[0].name);
         $scope.data.selectedSoundOption = tmp[0].options[0].name;
         }
         });
        $scope.changeSelectedSound = function () {
            // Datenbank anbindung einfuegen
            let data = {
                selectedSoundSkin : $scope.data.selectedSound
            };
            $http.post('/user/change/selectedSoundSkin', data);
            getOptionbySound($scope.data.selectedSound);

        };
        $scope.changeSelectedSoundOption = function () {
            // Datenbank anbindung einfuegen
            let data = {
                selectedSoundOption : $scope.data.selectedSoundOption
            };

            $http.post('/user/change/selectedSoundOption', data);
        };

        $scope.sonifyByReaction = function (reaction) {
            switch($scope.data.selectedSound) {
                case "Einfach":
                    soundService.playSoundsV1(0, 0, 0, 0, 0, reaction);
                    break;
                case "Piano mit Beat":
                    soundService.playSoundsV2(0, 0, 0, 0, 0, reaction);
                    break;
                case "Tiere":
                    soundService.playSoundsV3_1(0, 0, 0, 0, 0, reaction);
                    break;
                case "Instrumente":
                    soundService.playSoundsV4_1(0, 0, 0, 0, 0, reaction);
                    break;
                case "Menschen":
                    soundService.playSoundsV5_1(0, 0, 0, 0, 0, reaction);
                    break;
                case "Zuschauer":
                    soundService.playSoundsV6_1(0, 0, 0, 0, 0, reaction);
                    break;
                case "Sinus":
                    soundService.playSoundsV7_1(0, 0, 0, 0, 0, reaction);
                    break;
            }
        };
        $scope.sonify = function (love, haha, wow, sad, angry) {
            let reaction = null;

            if($scope.data.selectedSoundOption){
                reaction = reactionTrend(love, haha, wow, sad, angry)
            }
            switch($scope.data.selectedSound) {
                case "Einfach":
                    switch($scope.data.selectedSoundOption) {
                        case "Nur höchster Wert":
                            soundService.playSoundsV1(love, haha, wow, sad, angry, reaction);
                            break;
                    }
                    break;
                case "Piano mit Beat":
                    switch($scope.data.selectedSoundOption) {
                        case "Piano-Spezial":
                            soundService.playSoundsV2(love, haha, wow, sad, angry, null);
                            break;
                        case "Nur höchster Wert":
                            soundService.playSoundsV2(love, haha, wow, sad, angry, reaction);
                            break;
                    }
                    break;
                case "Tiere":
                    switch($scope.data.selectedSoundOption) {
                        case "Normal":
                            soundService.playSoundsV3_1(love, haha, wow, sad, angry, null);
                            break;
                        case "Absteigend":
                            soundService.playSoundsV3_2(love, haha, wow, sad, angry, null);
                            break;
                        case "Aufsteigend":
                            soundService.playSoundsV3_3(love, haha, wow, sad, angry, null);
                            break;
                        case "Nur höchster Wert":
                            soundService.playSoundsV3_1(love, haha, wow, sad, angry, reaction);
                            break;
                    }
                    break;
                case "Instrumente":
                    switch($scope.data.selectedSoundOption) {
                        case "Normal":
                            soundService.playSoundsV4_1(love, haha, wow, sad, angry, null);
                            break;
                        case "Absteigend":
                            soundService.playSoundsV4_2(love, haha, wow, sad, angry, null);
                            break;
                        case "Aufsteigend":
                            soundService.playSoundsV4_3(love, haha, wow, sad, angry, null);
                            break;
                        case "Nur höchster Wert":
                            soundService.playSoundsV4_1(love, haha, wow, sad, angry, reaction);
                            break;
                    }
                    break;
                case "Menschen":
                    switch($scope.data.selectedSoundOption) {
                        case "Normal":
                            soundService.playSoundsV5_1(love, haha, wow, sad, angry, null);
                            break;
                        case "Absteigend":
                            soundService.playSoundsV5_2(love, haha, wow, sad, angry, null);
                            break;
                        case "Aufsteigend":
                            soundService.playSoundsV5_3(love, haha, wow, sad, angry, null);
                            break;
                        case "Nur höchster Wert":
                            soundService.playSoundsV5_1(love, haha, wow, sad, angry, reaction);
                            break;
                    }
                    break;
                case "Zuschauer":
                    switch($scope.data.selectedSoundOption) {
                        case "Normal":
                            soundService.playSoundsV6_1(love, haha, wow, sad, angry, null);
                            break;
                        case "Absteigend":
                            soundService.playSoundsV6_2(love, haha, wow, sad, angry, null);
                            break;
                        case "Aufsteigend":
                            soundService.playSoundsV6_3(love, haha, wow, sad, angry, null);
                            break;
                        case "Nur höchster Wert":
                            soundService.playSoundsV6_1(love, haha, wow, sad, angry, reaction);
                            break;
                    }
                    break;
                case "Sinus":
                    switch($scope.data.selectedSoundOption) {
                        case "Normal":
                            soundService.playSoundsV7_1(love, haha, wow, sad, angry, null);
                            break;
                        case "Absteigend":
                            soundService.playSoundsV7_2(love, haha, wow, sad, angry, null);
                            break;
                        case "Aufsteigend":
                            soundService.playSoundsV7_3(love, haha, wow, sad, angry, null);
                            break;
                        case "Nur höchster Wert":
                            soundService.playSoundsV7_1(love, haha, wow, sad, angry, reaction);
                            break;
                    }
                    break;
            }
        };

        google.charts.load("current", {packages:["corechart"]});

       $scope.drawChart = function (love, haha, wow, sad, angry, id) {
            let data = google.visualization.arrayToDataTable([
                ['Reaction', ''],
                ['Love', love],
                ['haha', haha],
                ['wow', wow],
                ['sad', sad],
                ['angry', angry]
            ]);
            let options = {

                pieHole: 0.4,
                backgroundColor: 'transparent',
                legend: {position: 'none'},
                pieSliceText: 'none',
                chartArea: {
                    left: "0%",
                    top: "0%",
                    height: "100%",
                    width: "100%"
                }

            };

            let chart = new google.visualization.PieChart(document.getElementById("myChart" + id));

            $timeout(function () {
                chart.draw(data, options);

            },4000);
       };

        /*$scope.drawChart = function (love, haha, wow, sad, angry, id) {
            let ctx = document.getElementById("myChart" + id);
            console.log(love,haha,wow,sad,angry,id);
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
                            data: [love, haha, wow, sad, angry]
                        },
                    ],
                },
                options: {
                    legend: {
                        display : false
                    }
                }

            });

        };*/
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
            return value;
        }
    })

    .controller('dashboardCtrl', function ($scope, $http, $timeout, $window) {

        //TODO Reload after Fav Delete
        //GET FAV
        $http.get('/user/get/favorites').then(results => {
            let favMap = results.data.map((fav,index)=> {
                return $http.get('/api/get/fb/favorite?favID=' + fav.fbID).then(result => {
                    result.data.date = fav.date;
                    return result.data;

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

        /*$scope.drawChartDashboard = function (fav, index) {

            $timeout(function (){
                $scope.drawChart(fav.allReactions.total_love, fav.allReactions.total_haha, fav.allReactions.total_wow, fav.allReactions.total_sad, fav.allReactions.total_angry, index);
            },0);
        }*/

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
                $('#ModalRemoveFav').modal('hide');

                $http.put('/user/remove/favorite', data).then(function () {
                    $scope.isFav = false;
                    $window.location.reload();
                })
            }};



        function getAllReactions(fav, index) {
            let tempAllReactions = {
                total_love: 0,
                total_haha: 0,
                total_wow: 0,
                total_sad: 0,
                total_angry: 0
            };
            let valueAllReaction;
            let reactionProzent ={
                love: 0,
                haha: 0,
                wow: 0,
                sad: 0,
                angry: 0
            };
            fav.posts.data.map((data) => {


                tempAllReactions.total_love = tempAllReactions.total_love + data.love.summary.total_count;
                tempAllReactions.total_haha = tempAllReactions.total_haha + data.haha.summary.total_count;
                tempAllReactions.total_wow = tempAllReactions.total_wow + data.wow.summary.total_count;
                tempAllReactions.total_sad = tempAllReactions.total_sad + data.sad.summary.total_count;
                tempAllReactions.total_angry = tempAllReactions.total_angry + data.angry.summary.total_count;
                data.total_reaction = reactionTrend(data.love.summary.total_count, data.haha.summary.total_count, data.wow.summary.total_count, data.sad.summary.total_count, data.angry.summary.total_count);

            });

            valueAllReaction = tempAllReactions.total_love + tempAllReactions.total_haha +tempAllReactions.total_wow +tempAllReactions.total_sad +tempAllReactions.total_angry;
            reactionProzent.love = tempAllReactions.total_love/valueAllReaction*100;
            reactionProzent.haha = tempAllReactions.total_haha/valueAllReaction*100;
            reactionProzent.wow = tempAllReactions.total_wow/valueAllReaction*100;
            reactionProzent.sad = tempAllReactions.total_sad/valueAllReaction*100;
            reactionProzent.angry = tempAllReactions.total_angry/valueAllReaction*100;

            fav.allReactions = tempAllReactions;
            fav.reactionProzent = reactionProzent;
            fav.total_reaction = reactionTrend(tempAllReactions.total_love,tempAllReactions.total_haha,tempAllReactions.total_wow,tempAllReactions.total_sad,tempAllReactions.total_angry);
            fav.total_reactionvalue = $scope.reactionTrendValue(tempAllReactions.total_love,tempAllReactions.total_haha,tempAllReactions.total_wow,tempAllReactions.total_sad,tempAllReactions.total_angry);

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
                    let valueAllReaction;
                     let reactionProzent ={ };
                    valueAllReaction = fb.love.summary.total_count + fb.haha.summary.total_count + fb.wow.summary.total_count + fb.sad.summary.total_count + fb.angry.summary.total_count;
                    reactionProzent.love = fb.love.summary.total_count/valueAllReaction*100;
                    reactionProzent.haha = fb.haha.summary.total_count/valueAllReaction*100;
                    reactionProzent.wow = fb.wow.summary.total_count/valueAllReaction*100;
                    reactionProzent.sad = fb.sad.summary.total_count/valueAllReaction*100;
                    reactionProzent.angry = fb.angry.summary.total_count/valueAllReaction*100;
                    fb.reactionProzent = reactionProzent;
                    console.log(fb.love.summary.total_count);
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

            $http.post('/api/post/fb/posts', data).then(posts => {
                $scope.fbData = posts.data;

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

        $scope.openCollapse = function (id) {
            $('#'+id).attr('class', 'show');
            $('#'+id).removeClass('hide');
        }
        $scope.closeCollapse = function (id) {
            $timeout(function () {
                $('#'+id).removeClass('show');
                $('#'+id).attr('class', 'hide');
            },200);

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
                    $scope.dataLeft.ReactionsPerPost = getReactionsPerPost($scope.dataLeft);
                    console.log($scope.dataLeft)
                }
                else {
                    $scope.dataRight = results.data;
                    $scope.dataRight.ReactionsPerPost = getReactionsPerPost($scope.dataRight);
                    console.log($scope.dataRight)
                }


            })
        }
        function getReactionsPerPost(data){
            let ReactionValue = data.allReactions.total_love + data.allReactions.total_haha + data.allReactions.total_wow + data.allReactions.total_sad + data.allReactions.total_angry
            let PostValue = data.posts.data.length;
            let ReactionPerPost = 0;
            ReactionPerPost = ReactionValue/PostValue;
            return ReactionPerPost;


        }

        function getAllReactions(data) {
            let valueAllReaction;
            let reactionProzent ={
                love: 0,
                haha: 0,
                wow: 0,
                sad: 0,
                angry: 0
            };
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

                valueAllReaction = tempAllReactions.total_love + tempAllReactions.total_haha +tempAllReactions.total_wow +tempAllReactions.total_sad +tempAllReactions.total_angry;
                reactionProzent.love = tempAllReactions.total_love/valueAllReaction*100;
                reactionProzent.haha = tempAllReactions.total_haha/valueAllReaction*100;
                reactionProzent.wow = tempAllReactions.total_wow/valueAllReaction*100;
                reactionProzent.sad = tempAllReactions.total_sad/valueAllReaction*100;
                reactionProzent.angry = tempAllReactions.total_angry/valueAllReaction*100;



            });
            data.allReactions = tempAllReactions;
            data.reactionProzent = reactionProzent;
            data.total_reaction = reactionTrend(tempAllReactions.total_love,tempAllReactions.total_haha,tempAllReactions.total_wow,tempAllReactions.total_sad,tempAllReactions.total_angry);
            data.total_reactionvalue = $scope.reactionTrendValue(tempAllReactions.total_love,tempAllReactions.total_haha,tempAllReactions.total_wow,tempAllReactions.total_sad,tempAllReactions.total_angry);

        }

    })

    .controller('settingsCtrl', function ($scope, $http, $timeout, soundService) {

    });



