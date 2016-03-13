(function () {
    'use strict';

    var app = angular.module('campture');
    app.directive('modalDialog', function () {
        return {
            restrict: 'E',
            scope: {
                show: '=',
                imageUrl: '=',
                caption:'='
            },
            replace: true, // Replace with the template below
            transclude: true, // we want to insert custom content inside the directive
            link: function (scope, element, attrs) {
                
                scope.$watch('imageUrl', function (newValue, oldValue) {
                    if (newValue) {
                        scope.imageUrl = newValue;
                        $("#modalImg").load(function(){
                             $('.ng-modal-dialog-content').innerWidth($('#modalImg').width());
                        });                    
                    }
                });
                scope.$watch('caption', function (newValue, oldValue) {
                    if (newValue) {
                        scope.caption = newValue;
                    }
                });
                scope.dialogStyle = {};
                if (attrs.width)
                    scope.dialogStyle.width = attrs.width;
                if (attrs.height)
                    scope.dialogStyle.height = attrs.height;
                scope.hideModal = function () {
                    scope.show = false;
                    scope.imageUrl = undefined;
                };
            },
            templateUrl: 'app/components/colorbox/modalDialog.html' // See below
        };
    });
})();