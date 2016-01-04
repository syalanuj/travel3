(function () {
    'use strict';

    var app = angular.module('campture');
    app.controller('AllProfilesCtrl', ['$scope', '$cookies', '$rootScope', '$routeParams', 'AccountService', controller]);
    function controller($scope, $cookies, $rootScope, $routeParams, accountService) {
        //====== Scope Variables==========
        //================================
        $scope.allProfiles;
        accountService.getAllUserProfiles(function (data) {
            if (data) {
                $scope.$apply(function () {
                    $scope.allProfiles = data;
                });
            }
        })
    };
})();