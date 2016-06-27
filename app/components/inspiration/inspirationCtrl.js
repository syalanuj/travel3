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
    app.controller('InspirationCtrl', ['$scope', '$routeParams', '$uibModal', 'LocationService', controller]);
    function controller($scope, $routeParams, $uibModal, locationService) {
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
            locationService.searchLocationCardByText($scope.searchText, page, function (data) {
                if (data) {
                    $scope.locationCards = data;
                    $scope.$apply();
                    setTimeout(masonaryCall, 2000)
                }
            })
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

        $scope.items = ['item1', 'item2', 'item3'];
        $scope.open = function () {
            var locationModalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'locationContentModal.html',
                controller: 'LocationlInstanceModalCtrl',
                size: 'lg',
                resolve: {
                    items: function () {
                        return $scope.items;
                    }
                }
            });
            modalInstance.result.then(function (selectedItem) {
                $scope.selected = selectedItem;
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        }
    };

    app.controller('LocationlInstanceModalCtrl', function ($scope, $uibModalInstance, items) {

        $scope.items = items;
        $scope.selected = {
            item: $scope.items[0]
        };

        $scope.ok = function () {
            $uibModalInstance.close($scope.selected.item);
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });
})();