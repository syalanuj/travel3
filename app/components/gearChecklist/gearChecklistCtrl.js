(function () {
    'use strict';

    var app = angular.module('campture');
    app.controller('GearChecklistCtrl', ['$scope', '$cookies', '$rootScope', 'uiGmapIsReady', '$routeParams', 'GearService', controller]);
    function controller($scope, $cookies, $rootScope, uiGmapIsReady, $routeParams, gearService) {
        //====== Scope Variables==========
        //================================
        $scope.coordinates = { latitude: $routeParams.lat, longitude: $routeParams.lon };
        $scope.map = { center: $scope.coordinates, zoom: 12 };
        $scope.marker = { id: 0, bounds: {}, coords: $scope.coordinates };
        $scope.frameSrc = 'http://forecast.io/embed/#lat=28.6139&lon=77.2090';
        $scope.location = $routeParams.formattedAddress;
        $scope.dateValue = $routeParams.dateString;
        $scope.duration = $routeParams.numberOfDays;
        $scope.options;
        $scope.date;
        $scope.status = {
            opened: false
        };
        $scope.gearList;
        var temperatureGrade;
        var durationGrade;
        $scope.isResultsShown = false;
        $scope.profileTabPos = 0;
        $scope.pollDone = false;
        $scope.gearChecklistFeedback = new Object();
        $scope.submitted = false;
        $scope.feedbackSubmitted = false;

        $scope.details = function (details) {
            $scope.location = new Object();
            $scope.coordinates = { latitude: details.geometry.location.lat(), longitude: details.geometry.location.lng() };
            $scope.location.locationDetails = details;
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
        $scope.getGearCheckList = function () {
            if ($scope.coordinates && $scope.coordinates.latitude && $scope.coordinates.longitude) {
                gearService.getWeatherDataFromCloud($scope.coordinates, $scope.dateValue, $scope.duration, function (data) {
                    if (data) {
                        $scope.gearList = data.gearList;
                        $scope.minTemp = data.minTemp;
                        $scope.maxTemp = data.maxTemp;
                        $scope.isResultsShown = true;
                        $scope.$apply();
                    }
                });
            }

        }
        $scope.getGearCheckList();
        $scope.updateTabPos = function (pos) {
            $scope.profileTabPos = pos;
        }
        $scope.buyGearPoll = function (decision) {
            gearService.gearBuyPoll(decision, function (data) {
                if (data) {
                    $scope.pollDone = true;
                    $scope.$apply();
                }
            });
        }

        $scope.postGearChecklistFeedback = function (isValid) {
            $scope.submitted = true;
            if (isValid) {
                var data = {
                    name: $scope.gearChecklistFeedback.name,
                    email: $scope.gearChecklistFeedback.email,
                    location: $scope.gearChecklistFeedback.location,
                    date: $scope.gearChecklistFeedback.date.toDateString(),
                    comments: $scope.gearChecklistFeedback.comments
                }
                Parse.Cloud.run("sendGearChecklistFeedback", data, {
                    success: function (object) {
                        $scope.submitted = false;
                        $('#checklistFeedback').modal('hide');
                        $scope.gearChecklistFeedback = undefined;
                        $('#response').html('Email sent!').addClass('success').fadeIn('fast');
                        $scope.feedbackSubmitted = true;
                        $scope.$apply();
                    },

                    error: function (object, error) {
                        $scope.submitted = false;
                        $('#checklistFeedback').modal('hide');
                        $scope.gearChecklistFeedback = undefined;
                        console.log(error);
                        $('#response').html('Error! Email not sent!').addClass('error').fadeIn('fast');
                    }
                });
            }
        }

    };
})();