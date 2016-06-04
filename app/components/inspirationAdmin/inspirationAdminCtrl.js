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
            flickrApiService.getPhotosOfLocation($scope.locationCard.coordinates, $scope.locationCard.name).then(
                    function (res) {
                        if (res) {
                            $scope.newImages = res.data.photos;
                            $scope.locationCard.panoramioImage = {
                                imageUrl: res.data.photos[0].photoPixelsUrls[0].url,
                                ownerName: res.data.photos[0].ownerName,
                                ownerUrl: res.data.photos[0].ownerUrl,
                                photoTitle: res.data.photos[0].photoTitle,
                                panoramioUrl: res.data.photos[0].photoUrl
                            };
                            flickrApiService.findPlacesByLatLon($scope.coordinates).then(
                    function (res) {
                        if (res && res.data && res.data.places && res.data.places.place) {
                            $scope.locationCard.flickrPlaceId = res.data.places.place[0].place_id;
                            flickrApiService.getTagsForPlace(res.data.places.place[0].place_id).then(
                            function (res) {
                                if (res) {
                                    $scope.locationCard.tags = new Array();
                                    var tagsCount = new Object();
                                    if (res.data.tags.total > 9) {
                                        tagsCount = 10
                                    }
                                    else {
                                        tagsCount = res.data.tags.total
                                    }
                                    for (var count = 0; count < tagsCount; count++) {
                                        var tag = res.data.tags.tag[count]._content.toLowerCase().replace(/ /g,'')
                                        $scope.locationCard.tags[count] = tag;
                                    }
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

                        }
                    },
                    function (status) {
                        $scope.apiError = true;
                        $scope.apiStatus = status;
                    }
                );
        };

        $scope.saveLocation = function () {
            locationService.saveLocationCard($scope.locationCard, function (data) {
                if (data) {
                    $scope.locationCard = undefined;
                    $scope.$apply();
                }
                else{
                    $scope.locationCard = undefined;
                    $scope.placeExists = true
                    $scope.$apply();
                }
            })
        }
        $scope.selectImage = function (paranamioImage) {
            $scope.locationCard.panoramioImage = {
                imageUrl: paranamioImage.photoPixelsUrls[0].url,
                ownerName: paranamioImage.ownerName,
                ownerUrl: paranamioImage.ownerUrl,
                photoTitle: paranamioImage.photoTitle,
                panoramioUrl: paranamioImage.photoUrl
            };
        }
        $scope.addNewTag = function(){
            if($scope.newTag){
            var tag = {
                _content: $scope.newTag,
                count: 0
            }
            if($scope.locationCard.tags){
                $scope.locationCard.tags.push(tag)
                $scope.newTag = undefined
            }
            }
        }
        function getImageUrl(farmId, serverId, id, secret, sizeSuffix) {
            return 'https://farm' + farmId + '.staticflickr.com/' + serverId + '/' + id + '_' + secret + '_' + sizeSuffix + '.jpg';
        }

    };
})();