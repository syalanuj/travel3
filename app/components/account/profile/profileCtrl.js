(function () {
    'use strict';

    var app = angular.module('campture');
    app.controller('ProfileCtrl', ['$scope', '$cookies', '$rootScope', 'AccountService', 'uiGmapIsReady', '$routeParams', '$timeout', controller]);
    function controller($scope, $cookies, $rootScope, accountService, uiGmapIsReady, $routeParams, $timeout) {
        //====== Scope Variables==========
        //================================      
        $scope.myTrips;
        $scope.newTrip;
        $scope.userObj;
        $scope.isPostSuccessful = false;
        $scope.allMarkers = new Array();
        $routeParams.userId;
        $scope.userObj;
        $scope.myUserObj = Parse.User.current();
        $scope.isMyProfile = false;
        //MAP
        $scope.map = { center: { latitude: 39.775230, longitude: 11.696153 }, zoom: 3 };
        $scope.profileTabPos = 0;
        $scope.profileImages = new Array();
        accountService.getUserById($routeParams.userId, function (data) {
            if (data) {
                $scope.userObj = data;
                if ($scope.myUserObj) {
                    if ($scope.userObj.id == $scope.myUserObj.id) {
                        $scope.isMyProfile = true;
                    }
                }
            }
        });
        accountService.getMyTrips($routeParams.userId, function (data) {
            if (data.length > 0) {
                $scope.$apply(function () {
                    var markerId = 0;
                    $scope.myTrips = data;
                    angular.forEach($scope.myTrips, function (trip, key) {
                        var initUrl = trip.main_image ? trip.main_image.image_url : trip.visited_places[0].images[0].image_url;
                        trip.cropped_image_url = $rootScope.getCroppedTripImageUrl(initUrl);
                        angular.forEach(trip.visited_places, function (place, key) {
                            $scope.allMarkers.push({ latitude: place.coordinates.latitude, longitude: place.coordinates.longitude, title: place.location, id: markerId })
                            markerId++;
                        });
                    });
                });
            }
        });
        $scope.updateprofileTabPos = function (pos) {
            $scope.profileTabPos = pos;
        }
        $scope.modalShown = false;
        $scope.toggleModal = function (imageUrl) {
            $scope.modalShown = !$scope.modalShown;
            $scope.modalImageUrl = imageUrl;
        };
    };
})();