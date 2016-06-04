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
    app.controller('InspirationCtrl', ['$scope', 'LocationService', controller]);
    function controller($scope, locationService) {
        $scope.locationCards;
        $scope.searchText;
        var page = 0;
        function getLocationCards(page) {
            locationService.getLocationCards(page, function (data) {
                $scope.locationCards = data;
                $scope.$apply();
                setTimeout(masonaryCall, 2000)
            });
        }
        getLocationCards(page);
        function masonaryCall() {
            $(document).ready(function () {
                $('.dynamic').masonry();
            })
        }
        $scope.searchLocationCard = function () {

        }
        $scope.searchLocationByTags = function (tags) {
            locationService.searchLocationByTag([tags], page, function (data) {
                if (data) {
                    $scope.locationCards = data;
                    $scope.$apply();
                    setTimeout(masonaryCall, 2000)
                }
            });
        }
    };
})();