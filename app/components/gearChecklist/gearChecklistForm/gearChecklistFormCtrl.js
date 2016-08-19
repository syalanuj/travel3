(function () {
    'use strict';

    var app = angular.module('campture');
    app.controller('GearChecklistFormCtrl', ['$scope', '$cookies', '$rootScope', 'uiGmapIsReady', '$location', 'GearService', controller]);
    function controller($scope, $cookies, $rootScope, uiGmapIsReady, $location, gearService) {
        //====== Scope Variables==========
        //================================
        //$scope.submitted = false;
        $scope.coordinates = new Object();
        $scope.map = { center: { latitude: 28.6139, longitude: 77.2090 }, zoom: 4 };
        $scope.marker = { id: 0, bounds: {} };
        $scope.frameSrc = 'http://forecast.io/embed/#lat=28.6139&lon=77.2090';
        $scope.location;
        $scope.options;
        $scope.date;
        $scope.duration;
        $scope.status = {
            opened: false
        };
        $scope.gearList;
        var temperatureGrade;
        var durationGrade;
        $scope.isResultsShown = false;
        $scope.profileTabPos = 0;
        $scope.minDate = new Date();
        $scope.isFullChecklistLoaded = false

        $scope.details = function (details) {
            $scope.location = new Object();
            $scope.coordinates = { latitude: details.geometry.location.lat(), longitude: details.geometry.location.lng() };
            $scope.location.locationDetails = details;
            $scope.locationDetails = details
            $scope.location.formatted_address = details.formatted_address;
            $scope.marker = {
                id: 1,
                coords: $scope.coordinates
            }
            $scope.map = { center: { latitude: $scope.coordinates.latitude, longitude: $scope.coordinates.longitude }, zoom: 12 }
        };


        $scope.open = function ($event) {
            $scope.status.opened = true;
        };
        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
        };
        $scope.getCheckList = function (isValid) {
            $scope.submitted = true;
            if ($scope.coordinates && $scope.coordinates.latitude && $scope.coordinates.longitude) {
                if (isValid && $scope.location && $scope.date && $scope.duration) {
                    gearService.postGearlistEntries($scope.locationDetails, function (data) { })
                    var dateString = $scope.date.toISOString();
                    var dateString = dateString.substr(0, dateString.indexOf('T')) + 'T12:00:00-0400';
                    $location.path('/gearChecklistResults/' + $scope.coordinates.latitude + '/' + $scope.coordinates.longitude + '/' + $scope.location + '/' + $scope.duration + '/' + dateString);
                }
            }
        }
        $scope.updateTabPos = function (pos) {
            $scope.profileTabPos = pos;
        }

        $scope.getFullGearList = function () {
            gearService.getFullGearList(function (data) {
                if (data) {
                    $scope.gearList = data;
                    $scope.isFullChecklistLoaded = true
                    $scope.$apply();
                }
            })
        }
        $scope.getFullGearList()
    };
})();