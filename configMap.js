    (function () {
    'use strict';
    var app = angular.module('campture');
    app.config(function (uiGmapGoogleMapApiProvider) {
        uiGmapGoogleMapApiProvider.configure({
            key: 'AIzaSyCRpJLhktqH2XbHlB4WLvZ169ECwqOG-BE',
            v: '3.20', //defaults to latest 3.X anyhow
            libraries: 'weather,geometry,visualization,places'
    });
    });

})();