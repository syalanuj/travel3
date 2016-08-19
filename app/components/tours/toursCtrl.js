(function () {
    'use strict';

    var app = angular.module('campture');
    app.controller('ToursCtrl', ['$scope', '$cookies', '$rootScope', 'TourService', controller]);
    function controller($scope, $cookies, $rootScope, tourService) {
        //====== Scope Variables==========
        //================================
        $scope.tourList = new Array();

        function getAllTours() {
            tourService.getAllTours(function (data) {
                if (data) {
                    $scope.tourList = data;
                    $scope.$apply();
                }
            })
        }
        getAllTours();
    };
})();