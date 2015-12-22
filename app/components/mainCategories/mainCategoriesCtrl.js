(function () {
    'use strict';

    var app = angular.module('campture');
    app.controller('MainCategoriesCtrl', ['$scope', '$cookies', '$rootScope', 'TourService', '$route', controller]);
    function controller($scope, $cookies, $rootScope, tourService, $route) {
        //====== Scope Variables==========
        //================================
        $rootScope.activities;  
        $rootScope.travelStyles; 
        $rootScope.topStates;
    }
})();