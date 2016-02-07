(function () {
    'use strict';

    var app = angular.module('campture');
    app.controller('PostTripCtrl', ['$scope', '$cookies', '$rootScope', '$location', 'AccountService', controller]);
    function controller($scope, $cookies, $rootScope, $location, accountService) {
        //====== Scope Variables==========
        //================================
        $(document).ready(function () {
            $('.remove-location-placeholder').removeAttr('placeholder');
        });
        $scope.userObj = JSON.parse(JSON.stringify(Parse.User.current()));
        $scope.userObj.id = $scope.userObj.objectId;
        $scope.details = function (details) {
            $scope.places[$scope.pIndex].coordinates = { latitude: details.geometry.location.lat(), longitude: details.geometry.location.lng() };
            $scope.places[$scope.pIndex].locationDetails = details
        };
        $scope.getPlaceIndex = function (pindex) {
            $scope.pIndex = pindex;
        }
        $scope.details;
        $scope.newTrip = new Object();
        $scope.newTrip.tags = new Array();
        $scope.userId = "IT41eYwjem";
        $scope.places = new Array();
        //$scope.place = new Object();
        $scope.newplaces = [0];
        $scope.places[$scope.newplaces.length - 1] = { images: new Array() };
        $scope.queuecomplete = 0;
        $scope.imageUploadDone = false;
        $scope.isPublishedClicked = false;
        $scope.mainImageUploaded = false;
        $scope.rawTags;
        $scope.isAddTag = false;
        $scope.isTripUploading = false;
        //Date functions
        $scope.status = {
            opened: false
        };
        $scope.open = function ($event) {
            $scope.status.opened = true;
        };
        $scope.today = function () {
            $scope.dt = new Date();
        };
        $scope.maxDate = new Date();
        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
        };
        $scope.collapseStatus = true;
        $scope.validatePlaceHeading = function () {

        };
        $scope.addPlace = function () {
            $scope.newplaces.push($scope.newplaces.length);
            $scope.places[$scope.newplaces.length - 1] = { images: new Array() };
        };
        $scope.removePlace = function () {
            $scope.newplaces.pop();
        };

        $scope.postTrip = function () {
            $scope.isPublishedClicked = true;
            if ($scope.imageUploadDone) {
                $scope.isTripUploading = true;
                $scope.newTrip.visited_places = $scope.places;
                $scope.newTrip.user = {
                    id: $scope.userObj.objectId,
                    name: $scope.userObj.facebook_profile.name
                }
                $scope.newTrip.posted_on = new Date();
                $scope.newTrip.tags = new Array();
                if ($scope.tags) {
                    var tags = $scope.tags.split(',');
                    angular.forEach(tags, function (value, key) {
                        $scope.newTrip.tags.push(value.trim());
                    });
                }
                accountService.postTrip($scope.newTrip, function (data) {
                    $scope.$apply(function () {
                        if (data) {
                            $scope.newplaces = [1];
                            $scope.newTrip = undefined;
                            $scope.places = undefined;
                            $scope.isTripUploading = false;
                            $location.path('/account/timeline/' + data);
                        }
                    });
                });
            }
        };
        $scope.dropzoneConfig = {
            'options': { // passed into the Dropzone constructor
                'acceptedFiles': '.jpg,.png,.jpeg,.gif',
                'url': 'https://api.cloudinary.com/v1_1/dzseog4g3/image/upload',
                'uploadMultiple': false,
                'parallelUploads': 10,
                'addRemoveLinks': true
            },
            'eventHandlers': {
                'sending': function (file, xhr, formData) {
                    formData.append('api_key', '374998139757779');
                    formData.append('timestamp', Date.now() / 1000 | 0);
                    formData.append('upload_preset', 'campture');
                    file.placeIndex = $scope.currentPlaceIndex;
                    file.imageIndex = $scope.currentImageIndex;
                    $scope.currentImageIndex++;
                },
                'success': function (file, response) {
                    $scope.places[file.placeIndex].images.push({ image_url: response.url });
                },
                'removedfile': function (file, response) {
                    $scope.places[file.placeIndex].images.splice(file.imageIndex, 1);
                },
                'queuecomplete': function (file, response) {
                    $scope.queuecomplete++;
                    if ($scope.newplaces.length == $scope.queuecomplete) {
                        $scope.imageUploadDone = true;
                        $scope.$apply();
                    }
                }
            }
        };
        $scope.mainImageDropzoneConfig = {
            'options': { // passed into the Dropzone constructor
                'acceptedFiles': '.jpg,.png,.jpeg,.gif',
                'url': 'https://api.cloudinary.com/v1_1/dzseog4g3/image/upload',
                'uploadMultiple': false,
                'parallelUploads': 1,
                'maxFiles': 1
            },
            'eventHandlers': {
                'sending': function (file, xhr, formData) {
                    $scope.mainImageUploading = true;
                    $scope.$apply();
                    formData.append('api_key', '374998139757779');
                    formData.append('timestamp', Date.now() / 1000 | 0);
                    formData.append('upload_preset', 'campture');

                },
                'success': function (file, response) {
                    $scope.newTrip.main_image = { image_url: response.url };
                    $scope.mainImageUploading = false;
                    $scope.mainImageUploaded = true;
                    $scope.$apply();
                }
            }
        };
        $scope.setUploadPlaceIndex = function (pIndex) {
            $scope.currentPlaceIndex = pIndex;
            $scope.currentImageIndex = 0;
        };
        $scope.closeAlert = function (index) {
            $scope.alerts.splice(index, 1);
        };

        $scope.uploadMainImage = function (file) {
            //ng-model="newTrip.main_image.image_url"
        }

        $scope.removeGroup = function (idx, e) {
            if (e) {
                e.preventDefault();
                e.stopPropagation();
            }

            $scope.newplaces.splice(idx, 1);
            $scope.places.splice(idx, 1)
        };
        $scope.formatTags = function () {
            if ($scope.rawTags) {
                var tags = $scope.rawTags.split(',');
                angular.forEach(tags, function (value, key) {
                    $scope.newTrip.tags.push(value.trim());
                });
                $scope.rawTags = undefined;
            }
        }
        $scope.removeTag = function (tagIndex) {
            $scope.newTrip.tags.splice(tagIndex, 1);
        }
        $scope.deleteItem = function (index) {
            $scope.places.splice(index, 1);
            $scope.newplaces.splice(index, 1);
        }
    };
})();