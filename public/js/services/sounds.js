'use strict';
angular.module('sonificationAPP.services.sounds', [])
    .service('soundService', ['$http', '$q', '$timeout',
        function ($http, $q, $timeout) {

            return {
                getFirstVersion: function () {
                    alert("First Version is set")
                }
            }
        }]);

