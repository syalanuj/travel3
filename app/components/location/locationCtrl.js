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
    app.controller('LocationCtrl', ['$scope', '$cookies', '$rootScope', '$routeParams', 'Map', 'FlickrApiService', 'AccountService', controller]);
    function controller($scope, $cookies, $rootScope, $routeParams, Map, flickrApiService, accountService) {
        //====== Scope Variables==========
        //================================
        //$routeParams
        $scope.location;
        $routeParams.placeId;
        $scope.search = function () {
            $scope.apiError = false;
            Map.getPlaceByPlaceId('ChIJZ25d4-N4BTkRt1Sf__Z_fh8')
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
                        flickrApiService.searchPhotosByPlaceId(res.data.places.place[0].place_id,$scope.location.name).then(
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

        $scope.getImageUrl = function(farmId, serverId, id, secret, sizeSuffix) {
            return 'https://farm' + farmId + '.staticflickr.com/' + serverId + '/' + id + '_' + secret + '_' + sizeSuffix + '.jpg';
        }
        Map.init();
        $scope.search();
    };
})();