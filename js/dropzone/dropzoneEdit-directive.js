angular.module('dropzone', []).directive('dropzoneEdit', function () {
    return {
        scope: {
            images: '=',
            config: '='
        },
        link: function (scope, element, attrs) {          
            var config, dropzone, images;

            config = scope.config;
            images = scope.images;

            // create a Dropzone for the element with the given options
            dropzone = new Dropzone(element[0], config.options);
            //dropzone.options.addedfile.call(dropzone, { name: "banner2.jpg", size: 12345 });
            
            //angular.forEach(images, function(value, key){
            //    dropzone.options.addedfile.call(dropzone, {});
            //    dropzone.options.thumbnail.call(dropzone, {}, value.image_url);    
            //});
            // bind the given event handlers
            angular.forEach(config.eventHandlers, function (handler, event) {
                dropzone.on(event, handler);
            });
        }
    };
});