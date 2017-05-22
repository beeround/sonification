'use strict';
angular.module('sonificationAPP.controllers.main', [])


  .directive('emitLastRepeaterElement', function() {
    return function(scope) {
      if (scope.$last) {
        scope.$emit('DrawCharts');
      }
    };
  })

  .controller('mainCtrl', function($scope, $http, $location) {
    $scope.goToCompare = function() {
      $location.path('/app/compare');
    }
  })

  .controller('dashboardCtrl', function($scope, $http, $timeout) {
    $http.get('/api/get/fb/favorite').then(results => {
      $scope.favData = results;
      $scope.allReactions = {
        total_love: 0,
        total_haha: 0,
        total_wow: 0,
        total_sad: 0,
        total_angry: 0
      };

      function getAllReactions(posts) {
        posts.data.map(data => {
          $scope.allReactions.total_love = $scope.allReactions.total_love + data.love.summary.total_count;
          $scope.allReactions.total_haha = $scope.allReactions.total_haha + data.haha.summary.total_count;
          $scope.allReactions.total_wow = $scope.allReactions.total_wow + data.wow.summary.total_count;
          $scope.allReactions.total_sad = $scope.allReactions.total_sad + data.sad.summary.total_count;
          $scope.allReactions.total_angry = $scope.allReactions.total_angry + data.angry.summary.total_count;
        })
      }
      getAllReactions($scope.favData.data.posts);
    });

  })

  .controller('fbCtrl', function($scope, $http, $timeout) {

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
        'apply.daterangepicker': function(ev, picker) {
          $scope.changeFeed($scope.currentFBId);
        }
      }
    };

    $scope.$on('DrawCharts', function() {
      $timeout(function() {
        $scope.fbData.map((fb, index) => {
          $scope.drawChart(fb.love.summary.total_count, fb.haha.summary.total_count, fb.wow.summary.total_count, fb.sad.summary.total_count, fb.angry.summary.total_count, index)
        })
      }, 0)

    });


    $scope.drawChart = function(love, haha, wow, sad, angry, id) {

      let ctx = document.getElementById("myChart" + id);
      let myChart = new Chart(ctx, {
        type: 'polarArea',
        data: {
          labels: ["LOVE", "HAHA", "WOW", "SAD", "ANGRY"],
          datasets: [{
              label: "Post1",
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

    $scope.sonify = function(love, haha, wow, sad, angry) {
      var velocity = reactionsInPercent(love, haha, wow, sad, angry);
      console.log(reactionTrend(love, haha, wow, sad, angry))
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
      $timeout(function() {
        sonifyLove1.dispose();
        sonifyHaha1.dispose();
        sonifyWow1.dispose();
        sonifySad1.dispose();
        sonifyAngry.dispose();
      }, 5000)
    }

    $scope.searchUser = function() {
      $scope.currentWindow = "SearchList";

      $scope.searchResult = undefined;

      let data = {
        query: $scope.query.name,
      };

      $http.post('/api/post/fb/search', data).then(results => {
        $scope.searchResults = results.data;
      });

    };

    $scope.changeFeed = function(fbID) {
      $scope.currentFBId = fbID;

      $scope.currentDate = {
        start: moment($scope.datePicker.date.startDate).format("DD.MM.YYYY"),
        end: moment($scope.datePicker.date.endDate).format("DD.MM.YYYY")
      };

      $scope.currentWindow = "Feed";
      $scope.fbData = undefined;

      let data = {
        id: fbID,
        start: $scope.currentDate.start,
        end: $scope.currentDate.end,
        limit: $scope.limit
      };

      $http.post('/api/post/fb/posts', data).then(posts => {
        $scope.fbData = posts.data;
      });
    };

    $scope.setLimit = function(limit) {
      $scope.limit = limit;
      $scope.changeFeed($scope.currentFBId);

    };

    $scope.showWindow = function(window) {
      $scope.currentWindow = window;
    }


  });
