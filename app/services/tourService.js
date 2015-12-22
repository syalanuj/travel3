var app = angular.module('campture');
app.factory('TourService', ['$http', function ($http, $scope) {

    //Parse Scema Initialzation
    var Tours = Parse.Object.extend("Tours");
    var Activities = Parse.Object.extend("Activities");
    var Cities = Parse.Object.extend("Cities");
    var Countries = Parse.Object.extend("Countries");
    var Featured = Parse.Object.extend("Featured");
    var Gears = Parse.Object.extend("Gears");
    var Grade = Parse.Object.extend("Grade");
    var Images = Parse.Object.extend("Images");
    var Pattern = Parse.Object.extend("Pattern");
    var Places = Parse.Object.extend("Places");
    var Resources = Parse.Object.extend("Resources");
    var States = Parse.Object.extend("States");
    var Travel_Styles = Parse.Object.extend("Travel_Styles");
    var Tour_Occurrences = Parse.Object.extend("Tour_Occurrences");

    var tours = new Tours();
    var activities = new Activities();
    var cities = new Cities();
    var countries = new Countries();
    var featured = new Featured();
    var gears = new Gears();
    var grade = new Grade();
    var images = new Images();
    var pattern = new Pattern();
    var places = new Places();
    var resources = new Resources();
    var states = new States();
    var travel_Styles = new Travel_Styles();
    var tour_Occurrences = new Tour_Occurrences();

    return {
        getTour: getTour,
        getUserTours: getUserTours,
        getTravelStyles: getTravelStyles,
        getTopStates: getTopStates,
        getTourOccurrences: getTourOccurrences,
        getActivities: getActivities,
        getAllTours: getAllTours,
        getToursByActivity: getToursByActivity,
        getToursByTravelStyle: getToursByTravelStyle,
        getToursByState: getToursByState
    };




    function getTour(tourId, callback) {
        var query = new Parse.Query(tours);
        query.include("place_pointer");
        query.include("state_pointer");
        query.include("country_pointer");

        query.get("ex2rP3Dbew", {
            success: function (tourObject) {
                var tour = getTourFromParse(tourObject);
                callback(tour);
            },
            error: function (object, error) {
                // The object was not retrieved successfully.
            }
        });
    };
    function getUserTours() { }
    function getTravelStyles(callback) {
        var travelStyles = new Array();
        var query = new Parse.Query(travel_Styles);
        query.find({
            success: function (results) {
                for (var i = 0; i < results.length; i++) {
                    travelStyles[i] = {
                        travel_style_id: results[i].get("travel_style_id"),
                        travel_style: results[i].get("travel_style")
                    }
                }
                callback(travelStyles);
            },
            error: function (error) {
                //alert("Error: " + error.code + " " + error.message);
                return null;
            }
        });
    };
    function getTopStates(callback) {
        var topStates = new Array();
        var query = new Parse.Query(states);
        query.find({
            success: function (results) {
                for (var i = 0; i < results.length; i++) {
                    topStates[i] = {
                        id: results[i].id,
                        name: results[i].get("name"),
                        state_id: results[i].get("state_id")
                    }
                }
                callback(topStates);
            },
            error: function (error) {
                //alert("Error: " + error.code + " " + error.message);
                return null;
            }
        });
    };

    function getTourOccurrences(tourId, callback) {
        tourId = 'ex2rP3Dbew';
        tours.id = tourId;
        var tourOccurrences = new Array();
        var query = new Parse.Query(tour_Occurrences);
        query.equalTo("tour_pointer", tours);
        query.find({
            success: function (results) {
                for (var i = 0; i < results.length; i++) {
                    tourOccurrences[i] = {
                        id: results[i].id,
                        tour_pointer: results[i].get("tour_pointer"),
                        start_date: results[i].get("start_date"),
                        end_date: results[i].get("end_date")
                    }
                }
                callback(tourOccurrences);
            },
            error: function (object, error) {
                //
            }
        });
    };

    function getActivities(callback) {
        var topActivities = new Array();
        var query = new Parse.Query(activities);
        query.find({
            success: function (results) {
                for (var i = 0; i < results.length; i++) {
                    topActivities[i] = {
                        id: results[i].id,
                        name: results[i].get("name"),
                        activity_id: results[i].get("activity_id"),
                        images: results[i].get("images")
                    }
                }
                callback(topActivities);
            },
            error: function (error) {
                //alert("Error: " + error.code + " " + error.message);
                return null;
            }
        });
    };

    function getAllTours(callback) {
        var allTours = new Array();
        var query = new Parse.Query(tours);
        query.include("place_pointer");
        query.include("state_pointer");
        query.include("country_pointer");

        query.get({
            success: function (parseObject) {
                for (var i = 0; i < parseObject.length; i++) {
                    allTours[i] = getTourFromParse(parseObject[i]);
                }
                callback(allTours);
            },
            error: function (object, error) {
                // The object was not retrieved successfully.
            }
        });
    }
    function getToursByActivity(activityId, callback) {
        var filteredTours = new Array();
        var query = new Parse.Query(tours);
        query.include("place_pointer");
        query.include("state_pointer");
        query.include("country_pointer");
        query.equalTo("activity", parseInt(activityId));
        query.find({
            success: function (parseObject) {
                for (var i = 0; i < parseObject.length; i++) {
                    filteredTours[i] = getTourFromParse(parseObject[i]);
                }
                callback(filteredTours);
            },
            error: function (object, error) {
                // The object was not retrieved successfully.
            }
        });
    }
    function getToursByTravelStyle(travelStyleId, callback) {
        var filteredTours = new Array();
        var query = new Parse.Query(tours);
        query.include("place_pointer");
        query.include("state_pointer");
        query.include("country_pointer");
        query.equalTo("travel_styles", travelStyleId);
        query.find({
            success: function (parseObject) {
                for (var i = 0; i < parseObject.length; i++) {
                    filteredTours[i] = getTourFromParse(parseObject[i]);
                }
                callback(filteredTours);
            },
            error: function (object, error) {
                // The object was not retrieved successfully.
            }
        });
    }
    function getToursByState(stateId, callback) {
        var filteredTours = new Array();
        var query = new Parse.Query(tours);
        query.include("place_pointer");
        query.include("state_pointer");
        query.include("country_pointer");
        query.equalTo("state.state_id", stateId);
        query.find({
            success: function (parseObject) {
                for (var i = 0; i < parseObject.length; i++) {
                    filteredTours[i] = getTourFromParse(parseObject[i]);
                }
                callback(filteredTours);
            },
            error: function (object, error) {
                // The object was not retrieved successfully.
            }
        });
    }


    //Internal Methods
    function getTourFromParse(parseObject) {
        var tour = {
            id: parseObject.id,
            name: parseObject.get("name"),
            createdAt: parseObject.get("createdAt"),
            updatedAt: parseObject.get("updatedAt"),
            introduction: parseObject.get("introduction"),
            highlights: parseObject.get("highlights"),
            number_of_days: parseObject.get("number_of_days"),
            altitude: parseObject.get("altitude"),
            grade: parseObject.get("grade"),
            distance: parseObject.get("distance"),
            location: parseObject.get("location"),
            our_tour: parseObject.get("our_tour"),
            highlighted: parseObject.get("highlighted"),
            gears: parseObject.get("gears"),
            resources: parseObject.get("resources"),
            itenary: parseObject.get("itenary"),
            activity: parseObject.get("activity"),
            recommended_months: parseObject.get("recommended_months"),
            images: parseObject.get("images"),
            distance_chart: parseObject.get("distance_chart"),
            other_details: parseObject.get("other_details"),
            transport: parseObject.get("transport"),
            place: {
                id: parseObject.get("place_pointer").id,
                name: parseObject.get("place_pointer").get("name"),
                location: parseObject.get("place_pointer").get("location"),
                country_pointer: parseObject.get("place_pointer").get("country_pointer"),
                nearest_city_pointer: parseObject.get("place_pointer").get("nearest_city_pointer"),
                state_pointer: parseObject.get("place_pointer").get("state_pointer"),
                images: parseObject.get("place_pointer").get("images")
            },
            state: {
                id: parseObject.get("state_pointer").id,
                name: parseObject.get("state_pointer").get("name"),
                country_pointer: parseObject.get("state_pointer").get("country_pointer"),
                nearest_city_pointer: parseObject.get("state_pointer").get("state_id"),
                state_pointer: parseObject.get("state_pointer").get("state_pointer"),
                images: parseObject.get("state_pointer").get("images")
            },
            country: {
                id: parseObject.get("country_pointer").id,
                name: parseObject.get("country_pointer").get("name"),
                images: parseObject.get("country_pointer").get("images")
            }
        }
        return tour;
    };

} ]);