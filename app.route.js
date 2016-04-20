(function () {
    'use strict';
    var app = angular.module('campture');
    app.config(function ($httpProvider, $routeProvider, $locationProvider) {
        // attach our auth interceptor to the http requests
        //$httpProvider.interceptors.push('AuthInterceptor');
        $routeProvider

    .when('/', {
        controller: 'LandingCtrl',
        templateUrl: 'app/components/landing/landing.html'
    })
    .when('/tourdetails/:param', {
        controller: 'TourDetailsCtrl',
        templateUrl: 'app/components/tourDetails/tourDetails.html'
    })
    .when('/activities/', {
            controller: 'MainCategoriesCtrl',
            templateUrl: 'app/components/mainCategories/activities.html'
        })
    .when('/travelstyles/', {
            controller: 'MainCategoriesCtrl',
            templateUrl: 'app/components/mainCategories/travelStyles.html'
        })
    .when('/states/', {
            controller: 'MainCategoriesCtrl',
            templateUrl: 'app/components/mainCategories/states.html'
        })
    .when('/availabletours/:filtercategory/:id', {
            controller: 'AvailableToursCtrl',
            templateUrl: 'app/components/mainCategories/states.html'
        })
        .when('/account/timeline/:tripId', {
            controller: 'TimelineCtrl',
            templateUrl: 'app/components/account/timeline/timeline.html'
        })
        .when('/account/postTrip/', {
            controller: 'PostTripCtrl',
            templateUrl: 'app/components/account/postTrip/postTrip.html'
        })
        .when('/account/newsFeed/', {
            controller: 'AccountCtrl',
            templateUrl: 'app/components/account/newsFeed.html'
        })
        .when('/account/profile/:userId', {
            controller: 'ProfileCtrl',
            templateUrl: 'app/components/account/profile/profile.html'
        })
        .when('/account/signIn/', {
            templateUrl: 'app/components/account/signIn.html'
        })
        .when('/account/editTrip/:tripId', {
             controller: 'EditTripCtrl',
            templateUrl: 'app/components/account/editTrip/editTrip.html'
        })
        .when('/feed/:tag?/:searchText?',{
            controller: 'FilteredFeedCtrl',
            templateUrl:'app/components/feed/filteredFeed.html'
        })
        .when('/allProfiles/',{
            controller: 'AllProfilesCtrl',
            templateUrl:'app/components/allProfiles/allProfiles.html'
        })
        .when('/explore/',{
            controller: 'ExploreCtrl',
            templateUrl:'app/components/explore/explore.html'
        })
        .when('/guidelines/',{
            templateUrl:'app/components/guidelines/guidelines.html'
        })
        .when('/privacyPolicy/',{
            templateUrl:'app/components/privacyPolicy/privacyPolicy.html'
        })
        .when('/howTo/',{
            templateUrl:'app/components/howTo/howTo.html'
        })
        .when('/termsOfUse/',{
            controller: 'ExploreCtrl',
            templateUrl:'app/components/termsOfUse/termsOfUse.html'
        })
        .when('/explorerProgram/',{
            templateUrl:'app/components/explorerProgram/explorerProgram.html'
        })
        .when('/gearChecklist/',{
            controller: 'GearChecklistCtrl',
            templateUrl:'app/components/gearChecklist/gearChecklist.html'
        })
        .when('/location/',{
            controller: 'LocationCtrl',
            templateUrl:'app/components/location/location.html'
        })
        .when('/pageNotFound/',{
            controller: 'ErrorPageCtrl',
            templateUrl:'app/components/error/errorPage.html'
        })
        .otherwise({redirectTo : '/pageNotFound/'});
    });

})();
