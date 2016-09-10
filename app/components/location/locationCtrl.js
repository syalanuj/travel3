(function () {
    'use strict';

    var app = angular.module('campture');
    app.service('Map', function ($q) {

        this.addMarker = function (res) {
            if (this.marker) this.marker.setMap(null);
            this.marker = new google.maps.Marker({
                map: this.map,
                position: res.geometry.location,
                animation: google.maps.Animation.DROP
            });
            this.map.setCenter(res.geometry.location);
        }

    });
    app.directive('starRating', function () {
        return {
            restrict: 'EA',
            template:
        '<ul class="star-rating" ng-class="{readonly: readonly}">' +
        '  <li ng-repeat="star in stars" class="star" ng-class="{filled: star.filled}" ng-click="toggle($index)">' +
        '    <i class="fa fa-star"></i>' + // or &#9733
        '  </li>' +
        '</ul>',
            scope: {
                ratingValue: '=ngModel',
                max: '=?', // optional (default is 5)
                onRatingSelect: '&?',
                readonly: '=?'
            },
            link: function (scope, element, attributes) {
                if (scope.max == undefined) {
                    scope.max = 5;
                }
                function updateStars() {
                    scope.stars = [];
                    for (var i = 0; i < scope.max; i++) {
                        scope.stars.push({
                            filled: i < scope.ratingValue
                        });
                    }
                };
                scope.toggle = function (index) {
                    if (scope.readonly == undefined || scope.readonly === false) {
                        scope.ratingValue = index + 1;
                        scope.onRatingSelect({
                            rating: index + 1
                        });
                    }
                };
                scope.$watch('ratingValue', function (oldValue, newValue) {
                    if (newValue) {
                        updateStars();
                    }
                });
            }
        };
    });
    app.controller('LocationCtrl', ['$scope', '$cookies', '$rootScope', '$routeParams', 'Map', '$location', 'FlickrApiService', 'LocationService', controller]);
    function controller($scope, $cookies, $rootScope, $routeParams, Map, $location, flickrApiService, locationService) {
        //====== Scope Variables==========
        //================================
        //$routeParams
        $scope.readonly = true;
        $scope.userObj = JSON.parse(JSON.stringify(Parse.User.current()));
        $scope.location;
        //if(!$routeParams.placeId)
        $routeParams.placeId //= 'ChIJ6TGqdERcBDkRnZRHK-PSEvE'; // 'ChIJZ25d4-N4BTkRt1Sf__Z_fh8';
        //initialize review object
        $scope.locationCard;
        $scope.review = new Object();
        $scope.tip = new Object()
        $scope.review.rating = 1;
        if ($scope.userObj) {
            $scope.review.userId = $scope.userObj.objectId;
            $scope.tip.userId = $scope.userObj.objectId;
        }
        $scope.review.placeId = $routeParams.placeId;
        $scope.tip.placeId = $routeParams.placeId;
        $scope.locationReviews;
        $scope.isReviewPublishedByUser = false
        $scope.isTipPublishedByUser = false

        $scope.getLocationCardByPlaceId = function () {
            locationService.getLocationCardByPlaceId($routeParams.placeId, function (data) {
                if (data) {
                    $scope.locationCard = data
                }
            })
        }
        $scope.searchFlickr = function () {
            $scope.apiError = false;
            Map.getPlaceByPlaceId($routeParams.placeId)
        .then(
            function (res) { // success
                //Map.addMarker(res);
                $scope.location = res
                $scope.getRelatedVapDestination()
                $scope.getRelatedViatorProducts()
                $scope.location.lat = res.geometry.location.lat();
                $scope.location.lng = res.geometry.location.lng();
                var coordinates = { latitude: res.geometry.location.lat(), longitude: res.geometry.location.lng() }
                flickrApiService.getPhotosOfLocation(coordinates, $scope.location.name).then(
                    function (res) {
                        if (res) {
                            $scope.newImages = res.data.photos;
                        }
                    },
                    function (status) {
                        $scope.apiError = true;
                        $scope.apiStatus = status;
                    }
                );
                //flickrApiService.findPlacesByLatLon(coordinates).then(
                //function (res) {
                //    if (res && res.data && res.data.places && res.data.places.place) {
                //        flickrApiService.searchPhotosByPlaceId(res.data.places.place[0].place_id, $scope.location.name).then(
                //        function (res) {
                //            if (res) {
                //                $scope.locationImages = res.data.photos.photo;
                //            }
                //        }, function (status) {
                //            $scope.apiError = true;
                //            $scope.apiStatus = status;
                //        });
                //    }
                //},
                //function (status) {
                //    $scope.apiError = true;
                //    $scope.apiStatus = status;
                //}
                //);
            },
            function (status) { // error
                $scope.apiError = true;
                $scope.apiStatus = status;
            }
        );
        }
        $scope.getReviewsForLocation = function () {
            locationService.getReviewsForLocation($routeParams.placeId, function (data) {
                if (data) {
                    $scope.locationReviews = data;
                    for (var i = 0; i < $scope.locationReviews.length; i++) {
                        if ($scope.locationReviews[i].user_pointer.objectId == $scope.userObj.objectId)
                            $scope.isReviewPublishedByUser = true
                    }
                    Parse.Cloud.run('getServerTime').then(function (time) {
                        $scope.serverTime = time;
                        for (var i = 0; i < $scope.locationReviews.length; i++) {
                            $scope.locationReviews[i].timeSincePostUpdated = getTimeSincePostUpdated(new Date($scope.locationReviews[i].updatedAt));
                        }
                        $scope.$apply();
                    });

                }
            });
        }
        $scope.getTipsForLocation = function () {
            locationService.getTipsForLocation($routeParams.placeId, function (data) {
                if (data) {
                    $scope.locationTips = data;
                    for (var i = 0; i < $scope.locationTips.length; i++) {
                        if ($scope.locationTips[i].user_pointer.objectId == $scope.userObj.objectId)
                            $scope.isTipPublishedByUser = true
                    }
                    Parse.Cloud.run('getServerTime').then(function (time) {
                        $scope.serverTime = time;
                        for (var i = 0; i < $scope.locationTips.length; i++) {
                            $scope.locationTips[i].timeSincePostUpdated = getTimeSincePostUpdated(new Date($scope.locationTips[i].updatedAt));
                        }
                        $scope.$apply();
                    });
                }
            });
        }
        function getTimeSincePostUpdated(postUpdatedTime) {
            var difference = $scope.serverTime.getTime() - postUpdatedTime.getTime();
            return Math.round(difference / 60000);
        }

        $scope.getImageUrl = function (farmId, serverId, id, secret, sizeSuffix) {
            return 'https://farm' + farmId + '.staticflickr.com/' + serverId + '/' + id + '_' + secret + '_' + sizeSuffix + '.jpg';
        }
        $scope.rateFunction = function (rating) {
            console.log('Rating selected: ' + rating);
        };
        $scope.postReview = function () {
            locationService.postReview($scope.review, function (data) {
                if (data) {
                    $scope.getReviewsForLocation();
                }
            });
        }
        $scope.postTip = function () {
            locationService.postTip($scope.tip, function (data) {
                if (data) {
                    $scope.getTipsForLocation();
                }
            });
        }
        $scope.routeToLocation = function (location) {
            Map.geocodePlace(location)
        .then(
            function (placeId) {
                $location.path("/location/" + placeId + "/");
            },
            function (status) {
                console.log(status);
            }
        );
        }
        $scope.addUserLocationCard = function (isExplored) {
            locationService.addUserLocationCard($scope.userObj.objectId, $routeParams.placeId, isExplored, function (data) {
                if (data) {

                }
            })
        }
        $scope.searchLocationByTags = function (tags) {
            $location.path("/inspiration/" + tags);
        }

        Map.init();
        var st = new Object();

        $scope.getReviewsForLocation();
        $scope.getTipsForLocation();
        $scope.searchFlickr();
        $scope.getLocationCardByPlaceId();
        $scope.addvapDest = function () {
            locationService.addViatorDests(mydata, function (data) {

            })
        }

        $scope.getRelatedVapDestination = function () {
            var searchLocation = undefined
            for (var addressArea of $scope.location.address_components) {
                    if(addressArea.types[0] == "administrative_area_level_1"){
                        searchLocation = addressArea.long_name
                    }
            }
            if(searchLocation){
                locationService.findRelatedTourDestinationViator(searchLocation, function (data) {
                    if (data.length > 0) {
                        $scope.relatedVapDestUrl = data[0].DestinationURLs.ThingsToDoURL;
                    }
                })
            }
        }

        $scope.getRelatedViatorProducts = function () {
            locationService.findRelatedVapProducts($scope.location.name, function (data) {
                if (data) {
                    $scope.relatedVapProducts = data;
                    $scope.$apply();
                }
                console.log(data);
            })
        }


    };
})();