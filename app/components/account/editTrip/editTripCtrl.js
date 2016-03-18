(function () {
    'use strict';

    var app = angular.module('campture');
    app.controller('EditTripCtrl', ['$scope', '$cookies', '$rootScope', 'AccountService', '$routeParams', '$location', '$sessionStorage', controller]);
    function controller($scope, $cookies, $rootScope, accountService, $routeParams, $location, $sessionStorage) {
        //====== Scope Variables==========
        //================================
        $routeParams.tripId;
        $scope.userObj = Parse.User.current();
        $routeParams.tripId;
        $scope.mainImageUploaded = true;
        $scope.mainImageUploading = false;
        $scope.queuecomplete = 0;
        $scope.imageUploadDone = true;
        $scope.isPublishedClicked = false;
        $scope.rawTags;
        $scope.isAddTag = false;
        $scope.isTripUploading = false;
        $scope.collapseStatus = true;
        $scope.initPlaces = new Object();
        $scope.allCoordinatesUploaded = false;

        accountService.getTripById($routeParams.tripId, function (data) {
            $scope.newTrip = data;
            $scope.places = $scope.newTrip.visited_places;
            $scope.initPlaces = data.visited_places;
            $scope.queuecomplete = $scope.initPlaces.length;

            $scope.newplaces = new Array();
            for (var i = 0; i < $scope.places.length; i++) {
                $scope.newplaces.push(i);
            }
            getFormSession(data);            
            $scope.$apply();
        });

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
        $scope.validatePlaceHeading = function () {

        };
        $scope.addPlace = function () {
            $scope.newplaces.push($scope.newplaces.length);
            $scope.places[$scope.newplaces.length - 1] = { images: new Array() };
        };
        $scope.removePlace = function () {
            $scope.newplaces.pop();
        };
        $scope.dropzoneConfig = {
            'options': { // passed into the Dropzone constructor
                'acceptedFiles': '.jpg,.png,.jpeg,.gif',
                'url': 'https://api.cloudinary.com/v1_1/dzseog4g3/image/upload',
                'uploadMultiple': false,
                'parallelUploads': 10,
                'addRemoveLinks': true,
                'init': function () {

                }
            },
            'eventHandlers': {
                'sending': function (file, xhr, formData) {
                    formData.append('api_key', '374998139757779');
                    formData.append('timestamp', Date.now() / 1000 | 0);
                    formData.append('upload_preset', 'campture');
                    file.placeIndex = $scope.currentPlaceIndex;
                    file.imageIndex = $scope.currentImageIndex;
                    $scope.currentImageIndex++;
                    $scope.imageUploadDone = false;
                },
                'success': function (file, response) {
                    $scope.places[file.placeIndex].images.push({ image_url: response.url });
                    $scope.saveFormSession();
                    //$scope.initPlaces[file.placeIndex].images.pop();
                },
                'removedfile': function (file, response) {
                    $scope.places[file.placeIndex].images.splice(file.imageIndex, 1);
                    if ($scope.places[file.placeIndex].images.length < 1) {
                        $scope.imageUploadDone = false;
                    }
                },
                'queuecomplete': function (file, response) {
                    $scope.queuecomplete++;
                    if ($scope.newplaces.length <= $scope.queuecomplete) {
                        $scope.imageUploadDone = true;
                        $scope.$apply();
                    }
                    //if ($scope.places[file.placeIndex].images.length < 1) {
                    //    $scope.imageUploadDone = false;
                    //}
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
                    formData.append('api_key', '374998139757779');
                    formData.append('timestamp', Date.now() / 1000 | 0);
                    formData.append('upload_preset', 'campture');
                },
                'success': function (file, response) {
                    $scope.newTrip.main_image = { image_url: response.url };
                    $scope.mainImageUploading = false;
                    $scope.mainImageUploaded = true;
                    $scope.saveFormSession();
                }
            }
        };
        $scope.setUploadPlaceIndex = function (pIndex) {
            $scope.currentPlaceIndex = pIndex;
            $scope.currentImageIndex = 0;
        };
        $scope.setUploadPlaceIndexForHover = function (pIndex) {
            if ($scope.currentPlaceIndex != pIndex) {
                $scope.currentImageIndex = 0;
            }
            $scope.currentPlaceIndex = pIndex;
        };
        $scope.closeAlert = function (index) {
            $scope.alerts.splice(index, 1);
        };

        $scope.details = function (details) {
            $scope.places[$scope.pIndex].coordinates = { latitude: details.geometry.location.lat(), longitude: details.geometry.location.lng() };
            $scope.places[$scope.pIndex].locationDetails = details
        };
        $scope.getPlaceIndex = function (pindex) {
            $scope.pIndex = pindex;
        };

        $scope.updateTrip = function () {
            $scope.isPublishedClicked = true;
            if (!$scope.postTripForm.$invalid && $scope.mainImageUploaded) {
                $scope.newTrip.visited_places = $scope.places;
                if (validateImageCount($scope.newTrip)) {//&& validatePlaceCoordinates($scope.newTrip)
                    accountService.updateTrip($scope.newTrip, function (data) {
                        $scope.$apply(function () {
                            if (data) {
                                $scope.newplaces = [1];
                                $scope.newTrip = undefined;
                                $scope.isPostSuccessful = true;
                                $scope.deleteFormSession();
                                $location.path('/account/timeline/' + $routeParams.tripId);
                            }
                        });
                    });
                }
            }
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
            $scope.newplaces.pop();
        }

        $scope.focusTagsInput = function () {
            $('#tagInput').focus();
        }
        $scope.deleteImage = function (placindex, imageindex) {
            $scope.places[placindex].images.splice(imageindex, 1);
        }
        $scope.isEmptyArray = function (objectArray) {
            if (objectArray) { }
        }

        //session

        $scope.saveFormSession = function () {
            $sessionStorage.newTripSession = $scope.newTrip;
            $sessionStorage.placesSession = $scope.places;
        }
        $scope.deleteFormSession = function () {
            $sessionStorage.newTripSession = undefined;
            $sessionStorage.placesSession = undefined;
        }


        function validateImageCount(trip) {
            for (var index = 0; index < trip.visited_places.length; index++) {
                if (trip.visited_places[index].images.length < 1) {
                    $scope.imageUploadDone = false;
                    return false;
                }
            }
            $scope.imageUploadDone = true;
            return true;
        }
        function validatePlaceCoordinates(trip) {
            for (var index = 0; index < trip.visited_places.length; index++) {
                if (trip.visited_places[index].coordinates) {
                    $scope.allCoordinatesUploaded = false;
                    return false;
                }
            }
            $scope.allCoordinatesUploaded = true;
            return true;
        }
        function getFormSession(data){
            if ($sessionStorage.newTripSession && $sessionStorage.newTripSession.id == data.id) {
                $scope.newTrip = $sessionStorage.newTripSession;
                $scope.newTrip.posted_on = new Date($scope.newTrip.posted_on);
                $scope.newTrip.createdAt = new Date($scope.newTrip.createdAt);
                $scope.newTrip.updatedAt = new Date($scope.newTrip.updatedAt);
                for (var i = 0; i < $scope.newTrip.visited_places.length; i++) {
                    $scope.newTrip.visited_places[i].date = new Date($scope.newTrip.visited_places[i].date);
                }
                if ($scope.newTrip.main_image && $scope.newTrip.main_image.image_url) {
                    $scope.mainImageUploaded = true;
                }
            }
            if ($sessionStorage.placesSession && $sessionStorage.newTripSession.id == data.id) {
                if ($sessionStorage.placesSession.length > 1) {
                    $scope.openStatus = false;
                }
                $scope.places = $sessionStorage.placesSession;
                for (var i = 0; i < $scope.places.length; i++) {
                    $scope.places[i].date = new Date($scope.places[i].date);
                }
                $scope.newplaces = new Array();
                for (var i = 0; i < $scope.places.length; i++) {
                    $scope.newplaces.push(i);
                }
            }
        }
    };
})();