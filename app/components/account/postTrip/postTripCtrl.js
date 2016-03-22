(function () {
    'use strict';

    var app = angular.module('campture');
    app.controller('PostTripCtrl', ['$scope', '$cookies', '$rootScope', '$location', '$sessionStorage', '$interval', 'AccountService', controller]);
    function controller($scope, $cookies, $rootScope, $location, $sessionStorage, $interval, accountService) {
        //====== Scope Variables==========
        //================================
        $(document).ready(function () {
            $('.remove-location-placeholder').removeAttr('placeholder');
        });
        $scope.userObj = JSON.parse(JSON.stringify(Parse.User.current()));
        if (!$scope.userObj) {
            $location.path("/");
            return;
        }
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
        $scope.currentPlaceIndex = 0;
        $scope.currentImageIndex = 0;
        $scope.openStatus = true;
        //Date functions
        $scope.status = {
            opened: false
        };

        //form session save
        $scope.form = {
            postTripForm: {},
            data: {}
        };
        $scope.saveForm = function () {
            console.log('data:', $scope.form.data);
        };

        getFormSession();
        $scope.saveFormSession = function () {
            $sessionStorage.newTripSession = $scope.newTrip;
            $sessionStorage.placesSession = $scope.places;
        }
        $scope.deleteFormSession = function () {
            $scope.newTrip = new Object();
            $scope.newTrip.tags = new Array();
            $scope.places = new Array();
            $scope.newplaces = [0];
            $scope.places[$scope.newplaces.length - 1] = { images: new Array() };
            $sessionStorage.newTripSession = $scope.newTrip;
            $sessionStorage.placesSession = $scope.places;
        }
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
        $scope.deleteImage = function (placindex, imageindex) {
            $scope.places[placindex].images.splice(imageindex, 1);
        }
        $scope.postTrip = function () {
            $scope.isPublishedClicked = true;
            if ($scope.postTripForm.$invalid) {
                $scope.collapseStatus = true;
                $scope.$apply();
            }
            if (!$scope.postTripForm.$invalid && $scope.mainImageUploaded) {
                $scope.newTrip.visited_places = $scope.places;
                $scope.newTrip.user = {
                    id: $scope.userObj.objectId,
                    name: $scope.userObj.facebook_profile.name
                }
                $scope.newTrip.posted_on = new Date();
                if (validateImageCount($scope.newTrip)) {
                    $scope.isTripUploading = true;
                    accountService.postTrip($scope.newTrip, function (data) {
                        $scope.$apply(function () {
                            if (data) {
                                $scope.newplaces = [1];
                                $scope.newTrip = undefined;
                                $scope.places = undefined;
                                $scope.deleteFormSession();
                                $scope.isTripUploading = false;
                                $location.path('/account/timeline/' + data);
                            }
                        });
                    });
                }
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
                    if (file.imageIndex == 0) {
                        getImageGeotagLocation(file, function (data) {
                            if (data) {
                                if (data.locationName)
                                    $scope.places[file.placeIndex].location = data.locationName;
                                if (data.uploadDate)
                                    $scope.places[file.placeIndex].date = data.uploadDate;
                                if (data.coordinates) {
                                    $scope.places[file.placeIndex].coordinates = new Object();
                                    $scope.places[file.placeIndex].coordinates.latitude = data.coordinates.lat;
                                    $scope.places[file.placeIndex].coordinates.longitude = data.coordinates.lng;
                                }
                                $scope.$apply();
                            }
                        });
                    }
                    $scope.currentImageIndex++;
                },
                'success': function (file, response) {
                    $scope.places[file.placeIndex].images.push({ image_url: response.url });
                    $scope.saveFormSession();
                    $scope.$apply();
                },
                'removedfile': function (file, response) {
                    $scope.places[file.placeIndex].images.splice(file.imageIndex, 1);
                    if ($scope.places[file.placeIndex].images.length < 1) {
                        $scope.imageUploadDone = false;
                    }
                },
                'queuecomplete': function (file, response) {
                    $scope.queuecomplete++;
                    if ($scope.newplaces.length == $scope.queuecomplete) {
                        $scope.imageUploadDone = true;
                        $scope.$apply();
                    }
                },
                'drop': function (file, response) {

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
            $scope.newplaces.pop();
        }

        $scope.focusTagsInput = function () {
            $('#tagInput').focus();
        }
        $scope.myFunct = function (keyEvent) {
            if (keyEvent.which === 13)
                $scope.formatTags();
        }
        //GeoTagging
        function getGPSDegreeToDecimal(degree, minutes, seconds, direction) {
            direction.toUpperCase();
            var dd = degree + minutes / 60 + seconds / (60 * 60);
            //alert(dd);
            if (direction == "S" || direction == "W") {
                dd = dd * -1;
            } // Don't do anything for N or E
            return dd;
        }
        function getLocationFromLatLng(latLng, callback) {
            var latlng = new google.maps.LatLng(latLng);
            var geocoder = new google.maps.Geocoder;
            geocoder.geocode({ 'location': latlng }, function (results, status) {
                if (status === google.maps.GeocoderStatus.OK) {
                    if (results[1]) {
                        callback(results[1].formatted_address);
                    } else {
                        callback(undefined);
                    }
                } else {
                    callback(undefined);
                    console.log('Geocoder failed due to: ' + status);
                }
            });
        }

        function getImageGeotagLocation(file, callback) {
            try {
                EXIF.getData(file, function () {
                    var allTags = EXIF.getAllTags(this);
                    if (allTags.DateTimeOriginal) {
                        var tagDateTime = allTags.DateTimeOriginal.replace(":", "/");
                        tagDateTime = tagDateTime.replace(":", "/");
                        var uploadDate = new Date(tagDateTime);
                    }
                    if (allTags.GPSLatitude && allTags.GPSLongitude)
                        var latLng = {
                            lat: getGPSDegreeToDecimal(allTags.GPSLatitude[0], allTags.GPSLatitude[1], allTags.GPSLatitude[2], allTags.GPSLatitudeRef),  //(degree, minutes, seconds, direction)
                            lng: getGPSDegreeToDecimal(allTags.GPSLongitude[0], allTags.GPSLongitude[1], allTags.GPSLongitude[2], allTags.GPSLongitudeRef)
                        };
                    getLocationFromLatLng(latLng, function (data) {
                        callback({ locationName: data, uploadDate: uploadDate, coordinates: latLng });
                    });
                });
            }
            catch (e) {
                console.log(e);
            }
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
        function getFormSession() {
            if ($sessionStorage.newTripSession) {
                $scope.newTrip = $sessionStorage.newTripSession;
                if ($scope.newTrip.posted_on) {
                    $scope.newTrip.posted_on = new Date($scope.newTrip.posted_on);
                }
                if ($scope.newTrip.createdAt) {
                    $scope.newTrip.createdAt = new Date($scope.newTrip.createdAt);
                }
                if ($scope.newTrip.updatedAt) {
                    $scope.newTrip.updatedAt = new Date($scope.newTrip.updatedAt);
                }
                if ($scope.newTrip.visited_places) {
                    for (var i = 0; i < $scope.newTrip.visited_places.length; i++) {
                        if ($scope.newTrip.visited_places[i].date) {
                            $scope.newTrip.visited_places[i].date = new Date($scope.newTrip.visited_places[i].date);
                        }
                    }
                }
                if ($scope.newTrip.main_image && $scope.newTrip.main_image.image_url) {
                    $scope.mainImageUploaded = true;
                }
            }
            if ($sessionStorage.placesSession) {
                if ($sessionStorage.placesSession.length > 1) {
                    $scope.openStatus = false;
                }
                $scope.places = $sessionStorage.placesSession;
                if ($scope.places) {
                    for (var i = 0; i < $scope.places.length; i++) {
                        if ($scope.places[i].date) {
                            $scope.places[i].date = new Date($scope.places[i].date);
                        }
                    }
                }
                $scope.newplaces = new Array();
                for (var i = 0; i < $scope.places.length; i++) {
                    $scope.newplaces.push(i);
                }
            }
        }
    };
})();