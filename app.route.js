(function () {
    'use strict';
    var app = angular.module('campture');
    app.run(['$rootScope', '$route', function($rootScope, $route) {
        $rootScope.$on('$routeChangeSuccess', function() {
            document.title = $route.current.title;
        });
    }]);
    
    app.config(function ($httpProvider, $routeProvider, $locationProvider) {
        // attach our auth interceptor to the http requests
        //$httpProvider.interceptors.push('AuthInterceptor');
        $routeProvider
    .when('/', {
        title: 'Landing',
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
        //.when('/account/timeline/:tripId', {
        //    controller: 'TimelineCtrl',
        //    templateUrl: 'app/components/account/timeline/timeline.html'
        //})
        //.when('/account/postTrip/', {
        //    controller: 'PostTripCtrl',
        //    templateUrl: 'app/components/account/postTrip/postTrip.html'
        //})
        .when('/account/newsFeed/', {
            controller: 'AccountCtrl',
            templateUrl: 'app/components/account/newsFeed.html'
        })
        .when('/account/signIn/', {
            templateUrl: 'app/components/account/signIn.html'
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
        .when('/gearChecklistForm/',{
            controller: 'GearChecklistFormCtrl',
            templateUrl:'app/components/gearChecklist/gearChecklistForm/gearChecklistForm.html'
        })
        .when('/gearChecklistResults/:lat/:lon/:formattedAddress/:numberOfDays/:dateString',{
            controller: 'GearChecklistCtrl',
            templateUrl:'app/components/gearChecklist/gearChecklist.html'
        })
        .when('/location/:placeId',{
            controller: 'LocationCtrl',
            templateUrl:'app/components/location/location.html'
        })
        .when('/inspiration/:tag?/',{
            controller: 'InspirationCtrl',
            templateUrl:'app/components/inspiration/inspiration.html'
        })
        .when('/inspirationAdmin/',{
            controller: 'InspirationAdminCtrl',
            templateUrl:'app/components/inspirationAdmin/inspirationAdmin.html'
        })
        .when('/account/timeline/:tripId', {
            controller: 'TimelineCtrl',
            templateUrl: 'app/components/account/timeline/timelineLatest.html'
        })
        .when('/tours/markhaTrek', {
            templateUrl: 'app/components/tours/markhaValleyTrek.html'
        })
        .when('/tours/',{
            controller: 'ToursCtrl',	
            templateUrl:'app/components/tours/tours.html'
        })
         .when('/tours/leh', {
             controller: 'LehCtrl',
            templateUrl: 'app/components/tours/leh/leh.html'
        })
         .when('/tours/leh/markhavalleytrek', {
             controller: 'MarkhaValleyTrekCtrl',
            templateUrl: 'app/components/tours/markhaTrek/markhaValleyTrek.html'
        })
        .when('/tours/leh/lehtourwithrafting', {
             controller: 'LehTourAlternateCtrl',
            templateUrl: 'app/components/tours/lehTour/lehTour.html'
        })
        .when('/tours/leh/stoklatrek', {
             controller: 'StokTrekCtrl',
            templateUrl: 'app/components/tours/stokTrek/stokTrek.html'
        })
        .when('/tours/leh/lehtour', {
             controller: 'LehTourCtrl',
            templateUrl: 'app/components/tours/lehTourAlternate/lehTourAlternate.html'
        })
        .when('/pageNotFound/',{
            controller: 'ErrorPageCtrl',
            templateUrl:'app/components/error/errorPage.html'
        })
        .otherwise({redirectTo : '/pageNotFound/'});
        $locationProvider.html5Mode(true);
    });
    

})();
