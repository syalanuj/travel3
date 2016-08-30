(function () {
    'use strict';

    var app = angular.module('campture');
    app.controller('LandingCtrl', ['$scope', '$cookies', '$rootScope', 'AccountService', controller]);
    function controller($scope, $cookies, $rootScope, accountService) {
        //====== Scope Variables==========
        //================================
        $scope.isSiteLoaded = false;
        $scope.myTrips;
        $scope.allTrips;
        $scope.newsFeedTrips;
        $scope.newTrip;
        $scope.userObj = Parse.User.current();
        $scope.isPostSuccessful = false;
        $scope.query = {};
        $scope.queryBy = '$';
        $scope.userObj = JSON.parse(JSON.stringify(Parse.User.current()));

        accountService.getTripCategories(function (data) {
            if (data) {
                $scope.categoryTagRowArray = new Array()
                while (data.length > 0) {
                    $scope.categoryTagRowArray.push(data.splice(0, 4));
                }
            }
        })
        accountService.getAllLandingFeaturedTrips(function (data) {
            $scope.$apply(function () {
                $scope.allTrips = data;
                angular.forEach($scope.allTrips, function (trip) {
                    try {
                        var initUrl = trip.main_image ? trip.main_image.image_url : trip.visited_places[0].images[0].image_url;
                        trip.cropped_image_url = $rootScope.getCroppedTripImageUrl(initUrl);
                    } catch (e) {
                        console.log(e);
                    }

                });
                $scope.isSiteLoaded = true;
            });
        });
        accountService.getLandingContent(function (data) {
            if (data) {
                angular.forEach(data, function (content) {
                    if (content.place == 0) {
                        $scope.jumboContent = content;
                    }
                    if (content.place == 1) {
                        $scope.marketingContent = content;
                    }
                });
            }
        })

        $scope.postTrip = function () {
            accountService.postTrip($scope.newTrip, function (data) {
                $scope.$apply(function () {
                    if (data) {
                        $scope.newTrip = undefined;
                        $scope.isPostSuccessful = true;
                    }
                });
            });
        };
    };
})();