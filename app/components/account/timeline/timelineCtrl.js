(function () {
    'use strict';

    var app = angular.module('campture');
    app.controller('TimelineCtrl', ['$scope', '$cookies', '$rootScope', '$routeParams', '$location', 'uiGmapIsReady', 'AccountService', 'TripService', '$timeout', controller]);
    function controller($scope, $cookies, $rootScope, $routeParams, $location, uiGmapIsReady, accountService, tripService, $timeout) {
        //====== Scope Variables==========
        //================================
        $routeParams.tripId;
        $scope.currentUserObj = Parse.User.current();
        $scope.userObj;
        $scope.tripTabIndex = 0;
        $scope.allMarkers = new Array();
        $scope.isMyProfile = false;
        $scope.pageUrl = $location.$$absUrl;
        $scope.likeId;
        if ($scope.currentUserObj) {
            $scope.myProfile = $scope.currentUserObj.get("facebook_profile");
        }
        $scope.timelineImages = new Array();

        accountService.getTripById($routeParams.tripId, function (data) {
            $scope.$apply(function () {
                $scope.userObj = data.user
                if ($scope.currentUserObj) {
                    $scope.isTripLikedByUser();
                    if ($scope.userObj.id == $scope.currentUserObj.id) {
                        $scope.isMyProfile = true;
                    }
                }
                $scope.trip = data;
                var markerId = 0;
                angular.forEach($scope.trip.visited_places, function (place, key) {
                    $scope.allMarkers.push({ latitude: place.coordinates.latitude, longitude: place.coordinates.longitude, title: place.location, id: markerId })
                    markerId++;
                });
                $scope.map = { center: { latitude: $scope.allMarkers[0].latitude, longitude: $scope.allMarkers[0].longitude }, zoom: 15 };
                $scope.polylines = [
                    {
                        id: 1,
                        path: $scope.allMarkers,
                        stroke: {
                            color: '#f56c35',
                            weight: 3
                        },
                        editable: false,
                        draggable: false,
                        geodesic: false,
                        visible: true,
                        icons: [{
                            icon: {
                                path: google.maps.SymbolPath.FORWARD_OPEN_ARROW
                            },
                            offset: '25px',
                            repeat: '50px'
                        }]
                    }
                    ];
                angular.forEach($scope.trip.visited_places, function (place, key) {
                    angular.forEach(place.images, function (image, key) {
                        $scope.timelineImages.push(image);
                    });
                });
            });
        });

        $scope.updateTripTabPos = function (pos) {
            $scope.tripTabIndex = pos;
        }

        $scope.isMyTripTimeline = function () {
            if ($scope.trip.user.id == userObj.id) {
                return true;
            }
            else {
                false;
            }
        }
        //Map
        $scope.map = { center: { latitude: 21.0000, longitude: 78.0000 }, zoom: 4 };


        //Comments and Likes
        $scope.getTripComments = function () {
            tripService.getTripComments($routeParams.tripId, function (data) {
                $scope.$apply(function () {
                    if (data) {
                        $scope.tripComments = data;
                    }
                });
            });
        }
        $scope.postComment = function () {
            var myComment = {
                trip_pointer: $routeParams.tripId,
                user_pointer: $scope.userObj.id,
                text: $scope.myCommentText
            }
            tripService.postComment(myComment, function (data) {
                $scope.$apply(function () {
                    if (data) {
                        $scope.myCommentText = undefined;
                        $scope.getTripComments();
                    }
                });
            });
        }
        $scope.isTripLikedByUser = function () {
            var likeObj = {
                trip_pointer: $routeParams.tripId,
                user_pointer: $scope.currentUserObj.id
            }
            tripService.isTripLikedByUser(likeObj, function (data) {
                if (data) {
                    $scope.likeId = data;
                    $scope.$apply();
                }
            })
        }
        $scope.likeTrip = function () {
            $scope.trip.total_likes++;
            var likeObj = {
                trip_pointer: $routeParams.tripId,
                user_pointer: $scope.currentUserObj.id
            }
            tripService.tripLike($scope.trip.total_likes, likeObj, function (data) {
                if (data) {
                    var x = data;
                    $scope.isTripLikedByUser();
                }
                else {
                    $scope.trip.total_likes--;
                }
            });
        };
        $scope.unlikeTrip = function () {
            $scope.trip.total_likes--;
            tripService.tripUnlike($scope.likeId, $routeParams.tripId, $scope.trip.total_likes, function (data) {
                if (data) {
                    var x = data;
                    $scope.likeId = undefined;
                    $scope.$apply();
                }
                else {
                    $scope.trip.total_likes++;
                }
            });
        };
        $scope.tripLikeUnlike = function () {
            if ($scope.likeId) {
                $scope.unlikeTrip();
            }
            else {
                $scope.likeTrip();
            }
        }

        $scope.modalShown = false;
        $scope.toggleModal = function (imageUrl) {
            $scope.modalShown = !$scope.modalShown;
            $scope.modalImageUrl = imageUrl;
        };

    };
})();