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
        $scope.isLikeDisabled = false;
        $scope.myInterval = 2000;
        var bounds = new google.maps.LatLngBounds();
        if ($scope.currentUserObj) {
            $scope.myProfile = $scope.currentUserObj.get("facebook_profile");
        }
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
                accountService.getRelatedTrips($scope.trip.tags, function (data) {
                    if (data) {
                        $scope.$apply(function () {
                            $scope.relatedTrips = data;
                            angular.forEach($scope.relatedTrips, function (trip) {
                                try {
                                    var initUrl = trip.main_image ? trip.main_image.image_url : trip.visited_places[0].images[0].image_url;
                                    trip.cropped_image_url = $rootScope.getCroppedTripImageUrl(initUrl);
                                } catch (e) {
                                    console.log(e);
                                }

                            });
                        });
                    }
                });
                var markerId = 0;
                angular.forEach($scope.trip.visited_places, function (place, key) {
                    $scope.allMarkers.push({ latitude: place.coordinates.latitude, longitude: place.coordinates.longitude, title: place.location, id: markerId })
                    var latlng = new google.maps.LatLng(place.coordinates.latitude, place.coordinates.longitude);
                    bounds.extend(latlng);
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
                        //image.src = image.image_url;
                        //image.desc = "";
                    });
                });
            });
        });
        //---RelatedTrips----        

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
                    $scope.isLikeDisabled = false;
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
                    $scope.isLikeDisabled = false
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

        //----Modal-----//
        $scope.modalShown = false;
        $scope.toggleModal = function (imageUrl) {
            $scope.modalShown = !$scope.modalShown;
            $scope.modalImageUrl = imageUrl;
        };

        $scope.prod = {imagePaths: []};
	$scope.prod.imagePaths = [
      	{ custom: 'http://flexslider.woothemes.com/images/kitchen_adventurer_cheesecake_brownie.jpg', thumbnail: 'http://flexslider.woothemes.com/images/kitchen_adventurer_cheesecake_brownie.jpg' },
      	{ custom: 'http://flexslider.woothemes.com/images/kitchen_adventurer_lemon.jpg', thumbnail: 'http://flexslider.woothemes.com/images/kitchen_adventurer_lemon.jpg' },
      	{ custom: 'http://flexslider.woothemes.com/images/kitchen_adventurer_donut.jpg', thumbnail: 'http://flexslider.woothemes.com/images/kitchen_adventurer_donut.jpg' },
      	{ custom: 'http://flexslider.woothemes.com/images/kitchen_adventurer_caramel.jpg', thumbnail: 'http://flexslider.woothemes.com/images/kitchen_adventurer_caramel.jpg' },
      	{ custom: 'http://flexslider.woothemes.com/images/kitchen_adventurer_cheesecake_brownie.jpg', thumbnail: 'http://flexslider.woothemes.com/images/kitchen_adventurer_cheesecake_brownie.jpg' },
      	{ custom: 'http://flexslider.woothemes.com/images/kitchen_adventurer_lemon.jpg', thumbnail: 'http://flexslider.woothemes.com/images/kitchen_adventurer_lemon.jpg' },
      	{ custom: 'http://flexslider.woothemes.com/images/kitchen_adventurer_donut.jpg', thumbnail: 'http://flexslider.woothemes.com/images/kitchen_adventurer_donut.jpg' },
      	{ custom: 'http://flexslider.woothemes.com/images/kitchen_adventurer_caramel.jpg', thumbnail: 'http://flexslider.woothemes.com/images/kitchen_adventurer_caramel.jpg' },
      	{ custom: 'http://flexslider.woothemes.com/images/kitchen_adventurer_cheesecake_brownie.jpg', thumbnail: 'http://flexslider.woothemes.com/images/kitchen_adventurer_cheesecake_brownie.jpg' },
      	{ custom: 'http://flexslider.woothemes.com/images/kitchen_adventurer_lemon.jpg', thumbnail: 'http://flexslider.woothemes.com/images/kitchen_adventurer_lemon.jpg' },
      	{ custom: 'http://flexslider.woothemes.com/images/kitchen_adventurer_donut.jpg', thumbnail: 'http://flexslider.woothemes.com/images/kitchen_adventurer_donut.jpg' },
      	{ custom: 'http://flexslider.woothemes.com/images/kitchen_adventurer_caramel.jpg', thumbnail: 'http://flexslider.woothemes.com/images/kitchen_adventurer_caramel.jpg'}
      ];
      $scope.items = [{img: 'http://flexslider.woothemes.com/images/kitchen_adventurer_caramel.jpg', thumb: 'http://flexslider.woothemes.com/images/kitchen_adventurer_caramel.jpg', full: 'http://flexslider.woothemes.com/images/kitchen_adventurer_caramel.jpg'}];
   //     //--------Photo Slider--------//
   //     // Set of Photos			
        $scope.photos = [
				{ src: 'http://farm9.staticflickr.com/8042/7918423710_e6dd168d7c_b.jpg', desc: 'Image 01' },
				{ src: 'http://farm9.staticflickr.com/8449/7918424278_4835c85e7a_b.jpg', desc: 'Image 02' },
				{ src: 'http://farm9.staticflickr.com/8457/7918424412_bb641455c7_b.jpg', desc: 'Image 03' },
				{ src: 'http://farm9.staticflickr.com/8179/7918424842_c79f7e345c_b.jpg', desc: 'Image 04' },
				{ src: 'http://farm9.staticflickr.com/8315/7918425138_b739f0df53_b.jpg', desc: 'Image 05' },
				{ src: 'http://farm9.staticflickr.com/8461/7918425364_fe6753aa75_b.jpg', desc: 'Image 06' }
			];
        // initial image index			
        $scope._Index = 0;
        // if a current image is the same as requested image			
        $scope.isActive = function (index) {
            return $scope._Index === index;
        };
        // show prev image			
        $scope.showPrev = function (allImages) {
            $scope._Index = ($scope._Index > 0) ? --$scope._Index : allImages.length - 1;
        };
        // show next image
        $scope.showNext = function (allImages) {
            $scope._Index = ($scope._Index < allImages.length - 1) ? ++$scope._Index : 0;
        };
        // show a certain image
        $scope.showPhoto = function (index) {
            $scope._Index = index;
        };

        $scope.searchFilteredFeed = function (searchText){
            $location.path('/feed?');
        }

    };
})();