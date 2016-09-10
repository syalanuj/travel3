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
        $scope.locationCards;
        $scope.searchText;
        var page = 0;

      
            getLocationCards(page);
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
              
                }
            });
            modalInstance.result.then(function (selectedItem) {
                $scope.selected = selectedItem;
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        }
    };

    
})();