(function () {
    'use strict';

    var app = angular.module('campture');
    app.controller('TourDetailsCtrl', ['$scope', '$cookies', '$rootScope', 'TourService', '$route', '$routeParams','uiGmapIsReady', controller]);
    function controller($scope, $cookies, $rootScope, tourService, $route, $routeParams ,uiGmapIsReady) {
        //====== Scope Variables==========
        //================================
        $scope.tour;
        $scope.tourOccurrences;
        $scope.tab = 1;
        $scope.upperTab = 1;
        $scope.map;
        //====== Controller Flow==========
        //================================
        tourService.getTour($routeParams.param, function (data) {
            $scope.$apply(function () {
                $scope.tour = data;
                //======Map Initialization==========

                $scope.map = { center: { latitude: $scope.tour.location.latitude, longitude: $scope.tour.location.longitude }, zoom: 20 };
                $scope.marker = {
                    id: 0,
                    coords: {
                        latitude: $scope.tour.location.latitude,
                        longitude: $scope.tour.location.longitude
                    }
                }
            });
        });
        tourService.getTourOccurrences($routeParams.param, function (data) {
            $scope.$apply(function () {
                $scope.tourOccurrences = data;
            });
        });

        //====== Scope Methods==========
        //================================

        $scope.setUpperTab = function (newTab) {
            $scope.upperTab = newTab;
        };

        $scope.isUpperTabSet = function (tabNum) {
            return $scope.upperTab === tabNum;
        };
        $scope.setTab = function (newTab) {
            $scope.tab = newTab;
        };

        $scope.isSet = function (tabNum) {
            return $scope.tab === tabNum;
        };

         $scope.windowOptions = {
            visible: false
        };
         $scope.onClick = function() {
            $scope.windowOptions.visible = !$scope.windowOptions.visible;
        };
        $scope.closeClick = function() {
            $scope.windowOptions.visible = false;
        };
    }
})();