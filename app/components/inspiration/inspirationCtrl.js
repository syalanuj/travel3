(function () {
    'use strict';

    var app = angular.module('campture');
    app.directive('masonaryDirective', function () {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                $(document).ready(function () {
                    $('.dynamic').masonry();
                })
            }
        };
    });
    app.controller('InspirationCtrl', ['$routeParams', '$uibModal', 'LocationService', controller]);
    function controller($scope, $routeParams, $uibModal, locationService) {
      

    
})();