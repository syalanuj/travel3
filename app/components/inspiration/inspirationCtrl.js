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
    app.controller('InspirationCtrl', ['$scope', '$routeParams', 'LocationService', controller]);
    function controller($scope, $routeParams, locationService) {
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
        if ($routeParams.tag) {
            $scope.searchLocationByTags($routeParams.tag)
        }
        else {
            getLocationCards(page);
        }
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