(function () {
    'use strict';
    var app = angular.module('campture');
    app.controller('ProfileCtrl', ['$scope', '$route', '$cookies', '$rootScope', 'AccountService', 'uiGmapIsReady', '$routeParams', '$timeout', '$location', controller]);
    function controller($scope, $route, $cookies, $rootScope, accountService, uiGmapIsReady, $routeParams, $timeout, $location) {
        //====== Scope Variables==========
        //================================
        $scope.isSiteLoaded = false;
        $scope.isPageLoading = false;
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
        $scope.allTripImages = new Array();
        var bounds = new google.maps.LatLngBounds();
        accountService.getUserById($routeParams.userId, function (data) {
            if (data) {
                $scope.userObj = data;
                if ($scope.myUserObj) {
                    if ($scope.userObj.id == $scope.myUserObj.id) {
                        $scope.isMyProfile = true;
                    }
                }
                $scope.$apply();
            }
            else {
                $location.path('/pageNotFound/');
            }
        });
        getMyTrips();
        function getMyTrips() {
            accountService.getMyTrips($routeParams.userId, function (data) {
                try {
                    $scope.$apply(function () {
                        if (data.length > 0) {
                            var markerId = 0;
                            $scope.myTrips = data;
                            $scope.isPageLoading = true;
                            angular.forEach($scope.myTrips, function (trip, key) {
                                var initUrl = trip.main_image ? trip.main_image.image_url : trip.visited_places[0].images[0].image_url;
                                trip.cropped_image_url = $rootScope.getCroppedTripImageUrl(initUrl);
                                angular.forEach(trip.visited_places, function (place, key) {
                                    try {
                                        $scope.allMarkers.push({ latitude: place.coordinates.latitude, longitude: place.coordinates.longitude, title: place.location, id: markerId })
                                        var latlng = new google.maps.LatLng(place.coordinates.latitude, place.coordinates.longitude);
                                        bounds.extend(latlng);
                                    }
                                    catch (e) {
                                        console.log(e);
                                    }
                                    angular.forEach(place.images, function (image, key) {
                                        $scope.allTripImages.push(image);
                                    });
                                    markerId++;
                                });
                            });
                        });
                        $scope.isSiteLoaded = true;
                    }
                    else {
                        $scope.isSiteLoaded = true;
                    }
                    $scope.isPageLoading = true;
                });
            }
            catch (e) {
                console.log(e);
            }
        });
        $scope.deleteTrip = function (tripId) {
            accountService.deleteTrip(tripId, function (data) {
                console.log(data);
                            $scope.isSiteLoaded = true;
                        }
                        else {
                            $scope.isSiteLoaded = true;
                        }
                        $scope.isPageLoading = true;
                    });
                }
                catch (e) {
                    console.log(e);
                }
            });
        }
        $scope.deleteTrip = function (tripId) {
            accountService.deleteTrip(tripId, function (data) {
                if (data) {
                    console.log(data);
                    $route.reload();
                }
            })
        }
        $scope.$on('mapInitialized', function (event, map) {
            map.setCenter(bounds.getCenter());
            map.fitBounds(bounds);
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