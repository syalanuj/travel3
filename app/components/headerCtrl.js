(function () {
    'use strict';

    var app = angular.module('campture');

    app.controller('HeaderCtrl', ['$scope', '$cookies', '$rootScope', 'TourService', '$location', 'AccountService', controller]);
    function controller($scope, $cookies, $rootScope, tourService, $location, accountService) {
        //====== Scope Variables==========
        //================================
        //$rootScope.travelStyles;
        //$rootScope.topStates;
        //$rootScope.activities;
        $scope.topTags = [
        { tag: 'water', image_url: '/img/tags/water.png' }, 
        { tag: 'trekking', image_url: '/img/tags/trekking.png' }, 
        { tag: 'air', image_url: '/img/tags/air.png'}, 
        { tag: 'air', image_url: '/img/tags/water.png'}, 
        { tag: 'air', image_url: '/img/tags/trekking.png'}, 
        { tag: 'air', image_url: '/img/tags/air.png'}, 
        { tag: 'air', image_url: '/img/tags/water.png'}, 
        { tag: 'air', image_url: '/img/tags/trekking.png'}, 
        { tag: 'air', image_url: '/img/tags/air.png'}];
        $scope.userObj = JSON.parse(JSON.stringify(Parse.User.current()));

        $rootScope.loginWithFacebook = function () {
            if(!$rootScope.fbInit) return;
            if (!$rootScope.fbInit) return;

            Parse.FacebookUtils.logIn(null, {
                success: function (user) {
                    if (!user.existed()) {
                        $scope.userObj = Parse.User.current();
                        $scope.$apply();
                    } else {
                        $scope.userObj = Parse.User.current();
                        $scope.$apply();
                    }
                    accountService.getMyProfile().then(function (response) {
                        accountService.updateUserFacebookProfile(response, $scope.userObj.id, function (data) {
                            $scope.$apply(function () {
                                if (data) {
                                    var x = data;
                                }
                            });
                        });
                    });
                        

                    $location.path("/");
                },
                error: function (user, error) {
                    console.log("Cancelled");
                }
            });
        };

        $rootScope.logout = function () {
            Parse.User.logOut();
            $scope.userObj = Parse.User.current();
            $location.path("/");
        };

        $rootScope.getCroppedTripImageUrl = function (url, transString) {
            try {
                if (!transString) {
                    transString = 'upload/c_crop,h_440,w_440/';
                }
                var arr = url.split('upload/');
                var croppedUrl = arr[0] + transString + arr[1];
            } catch (e) {
                console.log(e);
            }
            return croppedUrl;
        };

        //Main app
        //tourService.getTravelStyles(function (data) {
        //    $scope.$apply(function () {
        //        $rootScope.travelStyles = data;
        //    });
        //});
        //tourService.getTopStates(function (data) {
        //    $scope.$apply(function () {
        //        $rootScope.topStates = data;
        //    });
        //});
        //tourService.getActivities(function (data) {
        //    $scope.$apply(function () {
        //        $rootScope.activities = data;
        //    });
        //});
    };
})();