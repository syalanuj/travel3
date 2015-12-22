(function () {
    'use strict';

    var app = angular.module('campture');
    app.controller('AvailableToursCtrl', ['$scope', '$cookies', '$rootScope', 'TourService', '$routeParams', controller]);
    function controller($scope, $cookies, $rootScope, tourService, $routeParams) {
        //====== Scope Variables==========
        //================================
        $rootScope.travelStyles;
        $rootScope.topStates;
        $rootScope.activities;
        $scope.availableTours;

        $scope.filterCategory = $routeParams.filtercategory;
        $scope.id = $routeParams.id;
        if ($scope.filterCategory.toLowerCase() == 'activity') {                     
            tourService.getToursByActivity($scope.id, function (data) {
            $scope.$apply(function () {
                $scope.availableTours = data;
                });
            });
        }
        else if ($scope.filterCategory.toLowerCase() == 'travelstyle') { 
            tourService.getToursByTravelStyle($scope.id, function (data) {
            $scope.$apply(function () {
                $scope.availableTours = data;
                });
            });
        }
        else if ($scope.filterCategory.toLowerCase() == 'state'){
            tourService.getToursByState($scope.id, function (data) {
            $scope.$apply(function () {
                $scope.availableTours = data;
                });
            });
        }
        else{
            //error someone played with URL (Handle)
        }
    }
})();