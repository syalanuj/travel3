(function () {
    'use strict';

    var app = angular.module('campture');
    app.controller('InspirationAdminCtrl', ['$scope', '$cookies', '$rootScope', 'FlickrApiService', 'LocationService', 'AccountService', controller]);
    function controller($scope, $cookies, $rootScope, flickrApiService, locationService, accountService) {
        $scope.locationCard = new Object();
        $scope.photoNotFound = false;
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
            $scope.locationCard.coordinates = $scope.coordinates;
            $scope.locationCard.placeId = details.place_id;
            $scope.locationCard.name = details.name;
            flickrApiService.findPlacesByLatLon($scope.coordinates).then(
                function (res) {
                    if (res && res.data && res.data.places && res.data.places.place) {
                        $scope.locationCard.flickrPlaceId = res.data.places.place[0].place_id;
                        flickrApiService.searchPhotosByPlaceId(res.data.places.place[0].place_id, $scope.location.locationDetails.name).then(
                        function (res) {
                            if (res && res.data.photos.photo[0]) {
                                var image = res.data.photos.photo[0]
                                $scope.locationCard.imageUrl = getImageUrl(image.farm, image.server, image.id, image.secret, 'n');
                                flickrApiService.getPhotoInfoByPhotoId(image.id).then(
                        function (res) {
                            if (res) {
                                $scope.locationCard.flickrOwner = res.data.photo.owner;
                                $scope.locationCard.flickrUrl = res.data.photo.urls.url[0]._content;
                                $scope.locationCard.tags = res.data.photo.tags.tag;
                                locationService.saveLocationCard($scope.locationCard, function (data) {
                                    if (data) {
                                        var x = data;
                                    }
                                })
                            }
                        }, function (status) {
                            $scope.apiError = true;
                            $scope.apiStatus = status;
                        });
                            }
                            else {
                                $scope.photoNotFound = true;
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
        };
        function getImageUrl(farmId, serverId, id, secret, sizeSuffix) {
            return 'https://farm' + farmId + '.staticflickr.com/' + serverId + '/' + id + '_' + secret + '_' + sizeSuffix + '.jpg';
        }

    };
})();