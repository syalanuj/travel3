(function () {
    'use strict';

    var app = angular.module('campture');
    app.directive("modalShow", function () {
        return {
            restrict: "A",
            scope: {
                modalVisible: "="
            },
            link: function (scope, element, attrs) {

                //Hide or show the modal
                scope.showModal = function (visible) {
                    if (visible) {
                        element.modal("show");
                    }
                    else {
                        element.modal("hide");
                    }
                }

                //Check to see if the modal-visible attribute exists
                if (!attrs.modalVisible) {

                    //The attribute isn't defined, show the modal by default
                    scope.showModal(true);

                }
                else {

                    //Watch for changes to the modal-visible attribute
                    scope.$watch("modalVisible", function (newValue, oldValue) {
                        scope.showModal(newValue);
                    });

                    //Update the visible value when the dialog is closed through UI actions (Ok, cancel, etc.)
                    element.bind("hide.bs.modal", function () {
                        scope.modalVisible = false;
                        if (!scope.$$phase && !scope.$root.$$phase)
                            scope.$apply();
                    });

                }

            }
        };

    });
    app.controller('PostTripCtrl', ['$scope', '$route', '$cookies', '$rootScope', '$location', '$sessionStorage', '$interval', '$routeParams', 'AccountService', 'FlickrApiService', controller]);
    function controller($scope, $route, $cookies, $rootScope, $location, $sessionStorage, $interval, $routeParams, accountService, flickrApiService) {
        //====== Scope Variables==========
        //================================

        $(document).ready(function () {
            $('.remove-location-placeholder').removeAttr('placeholder');
        });
        $scope.userObj = JSON.parse(JSON.stringify(Parse.User.current()));
        $scope.userObj.id = $scope.userObj.objectId;
        $scope.details;
        //New trip init
        $scope.newTrip = new Object();
        $scope.newTrip.tags = new Array();
        $scope.newTrip.main_image = { image_url: "http://res.cloudinary.com/dsykpguat/image/upload/v1467832376/tumblr_ngszunWryH1qfirfao1_1280_copy_bpizu5.jpg" };

        $scope.userId = "IT41eYwjem";
        $scope.places = new Array();
        $scope.newplaces = [0];

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
        $scope.placeCount = 0;
        $scope.suggestedImagesWindowVisible = false
        $scope.uploadedImagesWindow = false
        $scope.postStep = 1;
        $scope.myTrip = new Object();
        $scope.isEditForm = false
        $scope.allMarkers = new Array();
        $scope.timelineImages = new Array();
        $scope.map = { center: { latitude: 21.0000, longitude: 78.0000 }, zoom: 4 };
        $scope.tripTabIndex = 0

        if ($routeParams.tripId) {
            $scope.postStep = 4
            getExistingTrip()
        }

        $scope.isMyTripTimeline = function () {
            if ($scope.newTrip.user.id == userObj.id) {
                return true;
            }
            else {
                false;
            }
        }
        $scope.updateTripTabPos = function (pos) {
            $scope.tripTabIndex = pos;
        }
        function getExistingTrip() {
            accountService.getTripById($routeParams.tripId, function (data) {
                $scope.$apply(function () {
                    $scope.tripUserObj = data.user
                    if ($scope.userObj) {
                        //$scope.isTripLikedByUser();
                        if ($scope.userObj.id == $scope.tripUserObj.id) {
                            $scope.isMyProfile = true;
                        }
                    }
                    $scope.newTrip = data;
                    if ($scope.newTrip.visited_places && $scope.newTrip.visited_places.length > 0) {
                        $scope.places = $scope.newTrip.visited_places
                        $scope.postStep = 4
                        $scope.placeCount = $scope.newTrip.visited_places.length + 1
                        $('html, body').animate({
                            scrollTop: $("#addCardButton").offset().top
                        }, 500);
                        $('#addcardModal').modal('show')
                    }
                    else {
                        $scope.postStep = 2
                    }
                    accountService.getRelatedTrips($scope.newTrip.tags, function (data) {
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
                                $scope.linkifyText();
                            });
                        }
                    });
                    var markerId = 0;
                    angular.forEach($scope.newTrip.visited_places, function (place, key) {
                        try {
                            $scope.allMarkers.push({ latitude: place.coordinates.latitude, longitude: place.coordinates.longitude, title: place.location, id: markerId })
                            var latlng = new google.maps.LatLng(place.coordinates.latitude, place.coordinates.longitude);
                            bounds.extend(latlng);
                            markerId++;
                        }
                        catch (e) {
                            console.log(e);
                        }
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
                    angular.forEach($scope.newTrip.visited_places, function (place, key) {
                        angular.forEach(place.images, function (image, key) {
                            $scope.timelineImages.push(image);
                        });
                    });
                });
            });
        }
        $scope.details = function (details) {
            $scope.suggestedImagesWindowVisible = true
            $scope.places[$scope.placeCount - 1].coordinates = { latitude: details.geometry.location.lat(), longitude: details.geometry.location.lng() };
            $scope.places[$scope.placeCount - 1].locationDetails = details
            getSuggestedImagesFromPanaramio($scope.places[$scope.placeCount - 1].coordinates, $scope.places[$scope.placeCount - 1].locationDetails.name, function (images) {
                if (images) {
                    angular.forEach(images, function (image, key) {
                        image.isSelected = false;
                    });
                    $scope.suggestedImages = images
                }
            })
        };
        $scope.getPlaceIndex = function (pindex) {
            $scope.pIndex = pindex;
        }
        $scope.status = {
            opened: false
        };
        if (!$scope.userObj) {
            $location.path("/");
            return;
        }
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
            $('#resetTripModal').modal('hide');
            $('.modal-backdrop').hide();
            $route.reload();
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
                'url': 'https://api.cloudinary.com/v1_1/dsykpguat/image/upload', //dzseog4g3
                'uploadMultiple': false,
                'parallelUploads': 10,
                'addRemoveLinks': true
            },
            'eventHandlers': {
                'sending': function (file, xhr, formData) {
                    formData.append('api_key', '383751488485679'); //374998139757779
                    formData.append('timestamp', Date.now() / 1000 | 0);
                    formData.append('upload_preset', 'campture2');
                    file.placeIndex = $scope.placeCount - 1 //$scope.currentPlaceIndex;
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
                'error': function (file, response) {
                    //$scope.places[file.placeIndex].images.push({ image_url: response.url });
                    //$scope.saveFormSession();
                    //$scope.$apply();
                },
                'success': function (file, response) {
                    $scope.uploadedImagesWindow = true
                    $scope.suggestedImagesWindowVisible = false

                    if (!$scope.places[file.placeIndex].images) {
                        $scope.places[file.placeIndex].images = new Array();
                    }
                    $scope.places[file.placeIndex].images.push({ image_url: response.url });
                    //$scope.saveFormSession();
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

                    $scope.uploadedImagesWindow = true
                    $scope.suggestedImagesWindowVisible = false

                    angular.forEach($scope.suggestedImages, function (image, key) {
                        if (image.isSelected == true) {
                            accountService.uploadImageOnCloudinary(image.photoPixelsUrls[3].url, "FileName").then(function (responseData) {
                                $scope.places[$scope.placeCount - 1].images.push({ image_url: responseData.data.url });
                            })
                            image.isSelected = false
                        }
                    });

                },
                'drop': function (file, response) {

                }
            }
        };
        $scope.mainImageDropzoneConfig = {
            'options': { // passed into the Dropzone constructor
                'acceptedFiles': '.jpg,.png,.jpeg,.gif',
                'url': 'https://api.cloudinary.com/v1_1/dsykpguat/image/upload', //dzseog4g3
                'uploadMultiple': false,
                'parallelUploads': 1,
                'maxFiles': 1
            },
            'eventHandlers': {
                'sending': function (file, xhr, formData) {
                    $scope.mainImageUploading = true;
                    $scope.$apply();
                    formData.append('api_key', '383751488485679'); //374998139757779
                    formData.append('timestamp', Date.now() / 1000 | 0);
                    formData.append('upload_preset', 'campture2');

                },
                'success': function (file, response) {
                    $scope.newTrip.main_image = { image_url: response.url };
                    $scope.myTrip.main_image = { image_url: response.url };
                    $scope.mainImageUploading = false;
                    $scope.mainImageUploaded = true;
                    //$scope.saveFormSession();
                    $scope.$apply();
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

        $scope.removeCoverImage = function () {
            $scope.mainImageUploaded = false;
            $scope.mainImageUploading = false;
            if ($scope.newTrip.main_image) {
                $scope.newTrip.main_image = undefined;
            }
            //$scope.saveFormSession();
            $route.reload();
        }
        $scope.saveTripCover = function () {
            if ($scope.newTrip.title) {
                $scope.newTrip.user = {
                    id: $scope.userObj.objectId,
                    name: $scope.userObj.facebook_profile.name
                }
                accountService.postTrip($scope.newTrip, function (data) {
                    $scope.$apply(function () {
                        if (data) {
                            $scope.newTrip = data
                            $scope.postStep = 2
                            $('#addcoverModal').modal('hide')
                        }
                    });
                });
            }
        }
        $scope.closeAddCardModal = function () {
            $scope.placeCount--
            $('#addcardModal').modal('hide')
        }
        $scope.saveVisitedPlace = function () {
            //step 3 click of + button
            if ($scope.places[$scope.placeCount - 1].location && $scope.places[$scope.placeCount - 1].coordinates) {
                var selectedImageCount = 0;
                var pushedImageCount = 0
                if ($scope.suggestedImagesWindowVisible == true) {
                    angular.forEach($scope.suggestedImages, function (image, key) {
                        if (image.isSelected == true) {
                            accountService.uploadImageOnCloudinary(image.photoPixelsUrls[3].url, "FileName").then(function (responseData) {
                                pushedImageCount++
                                if (!$scope.places[$scope.placeCount - 1].images) {
                                    $scope.places[$scope.placeCount - 1].images = new Array();
                                }
                                $scope.places[$scope.placeCount - 1].images.push({ image_url: responseData.data.url });
                                if (selectedImageCount == pushedImageCount) {
                                    $scope.newTrip.visited_places = $scope.places
                                    accountService.updateTrip($scope.newTrip, function (data) {
                                        $scope.$apply(function () {
                                            if (data) {
                                                $scope.newTrip = data
                                                $scope.postStep = 4
                                                $scope.suggestedImages = undefined
                                                $scope.uploadedImagesWindow = false
                                                $scope.suggestedImagesWindowVisible = false
                                                $('#addcardModal').modal('hide')
                                            }
                                        });
                                    });
                                }
                                
                            })
                            image.isSelected = false
                            selectedImageCount++
                        }

                    });
                }
                else {
                    $scope.newTrip.visited_places = $scope.places
                    accountService.updateTrip($scope.newTrip, function (data) {
                        $scope.$apply(function () {
                            if (data) {
                                $scope.newTrip = data
                                $scope.postStep = 4
                                $scope.suggestedImages = undefined
                                $scope.uploadedImagesWindow = false
                                $scope.suggestedImagesWindowVisible = false
                                $('#addcardModal').modal('hide')
                            }
                        });
                    });
                }
            }
        }

        $scope.linkifyText = function () {
            $('.description').linkify();
            $('.linkify').linkify();
        }

        $scope.uploadImageOnCloudinary = function () {
            accountService.uploadImageOnCloudinary().then(function (responseData) {
                console.log(responseData)
            })
        }
        function getSuggestedImagesFromPanaramio(locationCoordinates, locationName, callback) {
            flickrApiService.getPhotosOfLocation(locationCoordinates, locationName).then(
                    function (res) {
                        if (res) {
                            callback(res.data.photos)
                        }
                    })
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