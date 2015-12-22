(function () {
    'use strict';

    var app = angular.module('campture');
    app.controller('AccountCtrl', ['$scope', '$cookies', '$rootScope', 'AccountService', controller]);
    function controller($scope, $cookies, $rootScope, accountService) {
        //====== Scope Variables==========
        //================================
        $scope.myTrips;
        $scope.allTrips;
        $scope.newsFeedTrips;
        $scope.newTrip;
        $scope.userId = "IT41eYwjem";
        $scope.isPostSuccessful = false;

        accountService.getAllTrips(function (data) {
            $scope.$apply(function () {
                $scope.allTrips = data;
            });
        });        
    };
})();