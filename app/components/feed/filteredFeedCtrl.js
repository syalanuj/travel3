(function () {
    'use strict';

    var app = angular.module('campture');
    app.controller('FilteredFeedCtrl', ['$scope', '$cookies', '$rootScope', '$routeParams', 'AccountService', controller]);
    function controller($scope, $cookies, $rootScope, $routeParams, accountService) {
        //====== Scope Variables==========
        //================================
        $scope.myTrips;
        $scope.allTrips;
        $scope.newsFeedTrips;
        $scope.newTrip;
        $scope.userObj = Parse.User.current();
        $scope.isPostSuccessful = false;
        $scope.isPageLoaded = false;
        //$scope.query = {};
        //$scope.queryBy = '$';
        if ($routeParams.tag) {
            accountService.getTripByTags($routeParams.tag, function (data) {
                $scope.$apply(function () {
                    if (data) {                    
                        $scope.allTrips = data;
                        $scope.isPageLoaded = true;                        
                        angular.forEach($scope.allTrips, function (trip) {
                            try {
                                var initUrl = trip.main_image ? trip.main_image.image_url : trip.visited_places[0].images[0].image_url;
                                trip.cropped_image_url = $rootScope.getCroppedTripImageUrl(initUrl);
                            } catch (e) {
                                console.log(e);
                            }
                        });                    
                    }
                    $scope.isPageLoaded = true;
                });
            });
        }
        else {
            accountService.getAllTrips(function (data) {
                $scope.$apply(function () {
                    if (data) {                    
                        $scope.allTrips = data;
                        $scope.isPageLoaded = true;
                        angular.forEach($scope.allTrips, function (trip) {
                            try {
                                var initUrl = trip.main_image ? trip.main_image.image_url : trip.visited_places[0].images[0].image_url;
                                trip.cropped_image_url = $rootScope.getCroppedTripImageUrl(initUrl);
                            } catch (e) {
                                console.log(e);
                            }

                        });
                        $scope.isPageLoaded = true;
                    }
                 });
            });
        }
    };
})();