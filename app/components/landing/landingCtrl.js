(function () {
    'use strict';

    var app = angular.module('campture');
    app.controller('LandingCtrl', ['$scope', '$cookies', '$rootScope', 'AccountService', controller]);
    function controller($scope, $cookies, $rootScope, accountService) {
        //====== Scope Variables==========
        //================================
        $scope.isSiteLoaded = false;
        $scope.myTrips;
        $scope.allTrips;
        $scope.newsFeedTrips;
        $scope.newTrip;
        $scope.userObj = Parse.User.current();
        $scope.isPostSuccessful = false;
        $scope.query = {};
        $scope.queryBy = '$';
        $scope.userObj = JSON.parse(JSON.stringify(Parse.User.current()));
        //category tags
        $scope.categoryTagsRow1 = [
        { tag: 'adventure', image_url: '/img/categoryTags/category_01_adventure.jpg' },
        { tag: 'trekking', image_url: '/img/categoryTags/category_02_trekking.jpg' },
        { tag: 'hiking', image_url: '/img/categoryTags/category_03_hiking.jpg' },
        { tag: 'photography', image_url: '/img/categoryTags/category_04_photography.jpg'}
        ];
        $scope.categoryTagsRow2 = [
        { tag: 'tips', image_url: '/img/categoryTags/category_05_tips.jpg' },
        { tag: 'how to', image_url: '/img/categoryTags/category_06_how_to.jpg' },
        { tag: 'nature', image_url: '/img/categoryTags/category_07_nature.jpg' },
        { tag: 'rafting', image_url: '/img/categoryTags/category_08_rafting.jpg' }
        ];
        $scope.categoryTagsRow3 = [
        { tag: 'roadtrip', image_url: '/img/categoryTags/category_09_roadtrip.jpg' },
        { tag: 'pilgrimage', image_url: '/img/categoryTags/category_10_pilgrimage.jpg' }
        ];

        accountService.getAllFeaturedTrips(function (data) {
            $scope.$apply(function () {
                $scope.allTrips = data;
                angular.forEach($scope.allTrips, function (trip) {
                    try {
                        var initUrl = trip.main_image ? trip.main_image.image_url : trip.visited_places[0].images[0].image_url;
                        trip.cropped_image_url = $rootScope.getCroppedTripImageUrl(initUrl);
                    } catch (e) {
                        console.log(e);
                    }

                });
                $scope.isSiteLoaded = true;
            });
        });

        $scope.postTrip = function () {
            accountService.postTrip($scope.newTrip, function (data) {
                $scope.$apply(function () {
                    if (data) {
                        $scope.newTrip = undefined;
                        $scope.isPostSuccessful = true;
                    }
                });
            });
        };
    };
})();