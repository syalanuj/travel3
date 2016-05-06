(function () {
    'use strict';

    var app = angular.module('campture');
    app.service('Map', function ($q) {

        this.init = function () {
            var options = {
                center: new google.maps.LatLng(28.6139, 77.2090),
                zoom: 13,
                disableDefaultUI: true
            }
            this.map = new google.maps.Map(
            document.getElementById("map"), options
        );
            this.places = new google.maps.places.PlacesService(this.map);
        }

        this.search = function (str) {
            var d = $q.defer();
            this.places.textSearch({ query: str }, function (results, status) {
                if (status == 'OK') {
                    d.resolve(results[0]);
                }
                else d.reject(status);
            });
            return d.promise;
        }
        this.getPlaceByPlaceId = function (str) {
            var d = $q.defer();
            this.places.getDetails({
                placeId: str
            }, function (place, status) {
                if (status === google.maps.places.PlacesServiceStatus.OK) {
                    d.resolve(place);
                }
                else {
                    d.reject(status);
                }
            });
            return d.promise;
        }

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
    app.controller('LocationCtrl', ['$scope', '$cookies', '$rootScope', '$routeParams', 'Map', 'FlickrApiService', 'LocationService', controller]);
    function controller($scope, $cookies, $rootScope, $routeParams, Map, flickrApiService, locationService) {
        //====== Scope Variables==========
        //================================
        //$routeParams
        $scope.readonly = true;
        $scope.userObj = JSON.parse(JSON.stringify(Parse.User.current()));
        $scope.location;
        $routeParams.placeId = 'ChIJZ25d4-N4BTkRt1Sf__Z_fh8';
        //initialize review object
        $scope.review = new Object();
        $scope.review.rating = 1;
        $scope.review.userId = $scope.userObj.objectId;
        $scope.review.placeId = $routeParams.placeId;
        $scope.locationReviews;

        $scope.searchFlickr = function () {
            $scope.apiError = false;
            Map.getPlaceByPlaceId($routeParams.placeId)
        .then(
            function (res) { // success
                //Map.addMarker(res);
                $scope.location = res
                $scope.location.lat = res.geometry.location.lat();
                $scope.location.lng = res.geometry.location.lng();
                var coordinates = { latitude: res.geometry.location.lat(), longitude: res.geometry.location.lng() }
                flickrApiService.findPlacesByLatLon(coordinates).then(
                function (res) {
                    if (res && res.data && res.data.places && res.data.places.place) {
                        flickrApiService.searchPhotosByPlaceId(res.data.places.place[0].place_id, $scope.location.name).then(
                        function (res) {
                            if (res) {
                                $scope.locationImages = res.data.photos.photo;
                            }
                        }, function (status) {
                            $scope.apiError = true;
                            $scope.apiStatus = status;
                        });
                    }
                },
                function (status) {
                    $scope.apiError = true;
                    $scope.apiStatus = status;
                }
                );
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
                    Parse.Cloud.run('getServerTime').then(function (time) {
                        $scope.serverTime = time;
                        for (var i = 0; i < $scope.locationReviews.length; i++) {
                            $scope.locationReviews[i].timeSincePostUpdated = getTimeSincePostUpdated(new Date($scope.locationReviews[i].updatedAt));
                        }
                    });
                }
            });
        }
        $scope.getTipsForLocation = function () {
            locationService.getTipsForLocation($routeParams.placeId, function (data) {
                if (data) {
                    $scope.locationTips = data;
                    Parse.Cloud.run('getServerTime').then(function (time) {
                        $scope.serverTime = time;
                        for (var i = 0; i < $scope.locationTips.length; i++) {
                            $scope.locationTips[i].timeSincePostUpdated = getTimeSincePostUpdated(new Date($scope.locationTips[i].updatedAt));
                        }
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
                $scope.$apply(function () {
                    if (data) {
                        var x = data;
                    }
                });
            });
        }


        Map.init();
        var st = new Object();

        $scope.getReviewsForLocation();
        $scope.getTipsForLocation();
        $scope.searchFlickr();
    };
})();