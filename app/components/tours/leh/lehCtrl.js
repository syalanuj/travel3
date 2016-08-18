(function () {
    'use strict';

    var app = angular.module('campture');
    app.controller('LehCtrl', ['$scope', '$cookies', '$rootScope', 'TourService', controller]);
    function controller($scope, $cookies, $rootScope, tourService) {
        //====== Scope Variables==========
        //================================
        $scope.tourList = new Array();
        $scope.isSiteLoaded = false;
        function getAllTours() {
            tourService.getAllTours(function (data) {
                if (data) {
                    $scope.tourList = data;
                    $scope.isSiteLoaded = true;
                    $scope.$apply();
                }
            })
        }
        getAllTours();
    };
})();