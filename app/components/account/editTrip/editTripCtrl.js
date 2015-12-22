(function () {
    'use strict';

    var app = angular.module('campture');
    app.controller('EditTripCtrl', ['$scope', '$cookies', '$rootScope', 'AccountService', '$routeParams', '$location', controller]);
    function controller($scope, $cookies, $rootScope, accountService, $routeParams, $location) {
        //====== Scope Variables==========
        //================================
        $routeParams.tripId;
        $scope.userObj = Parse.User.current();
        $routeParams.tripId;

        accountService.getTripById($routeParams.tripId, function (data) {
            $scope.$apply(function () {
                $scope.newTrip = data;
                $scope.places = $scope.newTrip.visited_places;
                $scope.initPlaces = $scope.places;
            });
            $scope.newplaces = new Array();
            for (var i = 0; i < $scope.places.length; i++) {
                $scope.newplaces.push(i);
            }
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
                },
                'success': function (file, response) {
                    $scope.places[file.placeIndex].images.push({ image_url: response.url });
                },
                'removedfile': function (file, response) {
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
                    formData.append('api_key', '374998139757779');
                    formData.append('timestamp', Date.now() / 1000 | 0);
                    formData.append('upload_preset', 'campture');
                },
                'success': function (file, response) {
                    $scope.newTrip.main_image = { image_url: response.url };
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

        $scope.details = function (details) {
            $scope.places[$scope.pIndex].coordinates = { latitude: details.geometry.location.lat(), longitude: details.geometry.location.lng() };
            $scope.places[$scope.pIndex].locationDetails = details
        };
        $scope.getPlaceIndex = function (pindex) {
            $scope.pIndex = pindex;

        };

        $scope.updateTrip = function () {
            $scope.newTrip.visited_places = $scope.places;
            $scope.newTrip.tags = new Array();
            var tags = $scope.tags.split(',');
            angular.forEach(tags, function (value, key) {
                $scope.newTrip.tags.push(value.trim());
            });
            accountService.updateTrip($scope.newTrip, function (data) {
                $scope.$apply(function () {
                    if (data) {
                        $scope.newplaces = [1];
                        $scope.newTrip = undefined;
                        $scope.isPostSuccessful = true;
                        $location.path('/account/timeline/' + $routeParams.tripId);

                    }
                });
            });
        };
    };
})();