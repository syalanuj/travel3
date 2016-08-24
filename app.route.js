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
        title: 'Explore Adventure & Offbeat Travel | Campture ',
        controller: 'LandingCtrl',
        templateUrl: 'app/components/landing/landing.html'
    })
    .when('/tourdetails/:param', {
        title: 'Campture Tour Details | Campture',
        controller: 'TourDetailsCtrl',
        templateUrl: 'app/components/tourDetails/tourDetails.html'
    })
    .when('/activities/', {
            title: 'Discover Activities | Campture',
            controller: 'MainCategoriesCtrl',
            templateUrl: 'app/components/mainCategories/activities.html'
        })
    .when('/travelstyles/', {
            title: 'Explore Travel Styles | Campture',
            controller: 'MainCategoriesCtrl',
            templateUrl: 'app/components/mainCategories/travelStyles.html'
        })
    .when('/states/', {
            controller: 'MainCategoriesCtrl',
            templateUrl: 'app/components/mainCategories/states.html'
        })
    .when('/availabletours/:filtercategory/:id', {
            title: 'Categories | Campture',
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
            title: 'Newsfeed | Campture',
            controller: 'AccountCtrl',
            templateUrl: 'app/components/account/newsFeed.html'
        })
        .when('/account/signIn/', {
            title: 'Sign In & Discover | Campture',
            templateUrl: 'app/components/account/signIn.html'
        })
        .when('/feed/:tag?/:searchText?',{
            title: 'Edit Your Trip | Campture',
            controller: 'FilteredFeedCtrl',
            templateUrl:'app/components/feed/filteredFeed.html'
        })
        .when('/allProfiles/',{
            title: 'Profiles | Campture',
            controller: 'AllProfilesCtrl',
            templateUrl:'app/components/allProfiles/allProfiles.html'
        })
        .when('/explore/',{
            title: 'Explore Itineraries, Travelogues, Photologues | Campture',
            controller: 'ExploreCtrl',
            templateUrl:'app/components/explore/explore.html'
        })
        .when('/guidelines/',{
             title: 'Campture Guidelines | Campture',
            templateUrl:'app/components/guidelines/guidelines.html'
        })
        .when('/privacyPolicy/',{
            title: 'Campture Privacy Policy | Campture',
            templateUrl:'app/components/privacyPolicy/privacyPolicy.html'
        })
        .when('/howTo/',{
            title: 'How To Use Campture | Campture',
            templateUrl:'app/components/howTo/howTo.html'
        })
        .when('/termsOfUse/',{
            title: 'Campture terms of use | Campture',
            controller: 'ExploreCtrl',
            templateUrl:'app/components/termsOfUse/termsOfUse.html'
        })
        .when('/explorerProgram/',{
            title: 'Explorer Program | Campture',
            templateUrl:'app/components/explorerProgram/explorerProgram.html'
        })
        .when('/gearChecklistForm/',{
            title: 'Camping & Hiking Checklist | Campture',
            controller: 'GearChecklistFormCtrl',
            templateUrl:'app/components/gearChecklist/gearChecklistForm/gearChecklistForm.html'
        })
        .when('/gearChecklistResults/:lat/:lon/:formattedAddress/:numberOfDays/:dateString',{
            title: 'Camping & Hiking Checklist | Campture',
            controller: 'GearChecklistCtrl',
            templateUrl:'app/components/gearChecklist/gearChecklist.html'
        })
        .when('/location/:placeId',{
            title: 'Location  | Campture',
            controller: 'LocationCtrl',
            templateUrl:'app/components/location/location.html'
        })
        .when('/inspiration/:tag?/',{
            title: 'Inspiration Board | Campture',
            controller: 'InspirationCtrl',
            templateUrl:'app/components/inspiration/inspiration.html'
        })
        .when('/inspirationAdmin/',{
            title: 'Inspiration Admin | Campture',
            controller: 'InspirationAdminCtrl',
            templateUrl:'app/components/inspirationAdmin/inspirationAdmin.html'
        })
        .when('/account/timeline/:tripId', {
            title: 'Timeline | Campture',
            controller: 'TimelineCtrl',
            templateUrl: 'app/components/account/timeline/timelineLatest.html'
        })
        .when('/tours/markhaTrek', {
            title: 'Marka Valley Trek | Campture',
            templateUrl: 'app/components/tours/markhaValleyTrek.html'
        })
        .when('/tours/',{
            title: 'Tours | Campture',
            controller: 'ToursCtrl',	
            templateUrl:'app/components/tours/tours.html'
        })
         .when('/tours/leh', {
             title: 'Leh Tour| Campture',
             controller: 'LehCtrl',
            templateUrl: 'app/components/tours/leh/leh.html'
        })
         .when('/tours/leh/markhavalleytrek', {
             title: 'Marka Valley Trek | Campture',
             controller: 'MarkhaValleyTrekCtrl',
            templateUrl: 'app/components/tours/markhaTrek/markhaValleyTrek.html'
        })
        .when('/tours/leh/lehtourwithrafting', {
            title: 'Leh tour with rafting | Campture',
            controller: 'LehTourAlternateCtrl',
            templateUrl: 'app/components/tours/lehTour/lehTour.html'
        })
        .when('/tours/leh/stoklatrek', {
            title: 'Stokla Trek | Campture',
             controller: 'StokTrekCtrl',
            templateUrl: 'app/components/tours/stokTrek/stokTrek.html'
        })
        .when('/tours/leh/lehtour', {
            title: 'Leh  Tour | Campture',
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
