(function () {
    'use strict';

    var app = angular.module('campture');
    app.directive('modalDialog', function () {
        return {
            restrict: 'E',
            scope: {
                show: '=',
                imageUrl: '='
            },
            replace: true, // Replace with the template below
            transclude: true, // we want to insert custom content inside the directive
            link: function (scope, element, attrs) {
                scope.$watch('imageUrl', function (newValue, oldValue) {
                    if (newValue) {
                        scope.imageUrl = newValue;
                    }
                });
                scope.dialogStyle = {};
                if (attrs.width)
                    scope.dialogStyle.width = attrs.width;
                if (attrs.height)
                    scope.dialogStyle.height = attrs.height;
                scope.hideModal = function () {
                    scope.show = false;
                };
            },
            templateUrl: 'app/components/colorbox/modalDialog.html' // See below
        };
    });
})();