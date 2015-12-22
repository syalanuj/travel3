var app = angular.module('campture');
app.factory('AccountService', ['$http', '$q', function ($http, $q) {
    var User = Parse.Object.extend("User");
    var Trips = Parse.Object.extend("Trips");

    var user = new User();
    var trips = new Trips();
    return {
        getTripById: getTripById,
        postTrip: postTrip,
        updateTrip: updateTrip,
        getMyTrips: getMyTrips,
        getAllTrips: getAllTrips,
        getMyProfile: getMyProfile,
        updateUserFacebookProfile: updateUserFacebookProfile,
        getUserById: getUserById
    };

    function getTripById(tripId, callback) {
        var query = new Parse.Query(trips);
        query.include("user_pointer");
        query.get(tripId, {
            success: function (parseObject) {
                var trip = getTripFromParse(parseObject);
                callback(trip);
            },
            error: function (object, error) {
                // The object was not retrieved successfully.
            }
        });
    };

    function postTrip(tripDetails, callback) {
        trips.set("title", tripDetails.title);
        trips.set("introduction", tripDetails.introduction);
        trips.set("main_image", tripDetails.main_image);
        trips.set("posted_on", tripDetails.posted_on);
        trips.set("visited_places", tripDetails.visited_places);
        trips.set("total_likes", 0);
        trips.set("username", tripDetails.user.name);
        trips.set("tags", tripDetails.tags)
        trips.set("user_pointer", {
            __type: "Pointer",
            className: "_User",
            objectId: tripDetails.user.id
        });


        trips.save(null, {
            success: function (parseObject) {
                callback(parseObject.id);
            },
            error: function (gameScore, error) {
                alert('Failed to create new object, with error code: ' + error.message);
            }
        });
    };

    function updateTrip(tripDetails, callback) {
        trips.id = tripDetails.id;
        trips.set("title", tripDetails.title);
        trips.set("introduction", tripDetails.introduction);
        trips.set("main_image", tripDetails.main_image);
        trips.set("visited_places", tripDetails.visited_places);
        trips.set("tags", tripDetails.tags);
        trips.set("user_pointer", {
            __type: "Pointer",
            className: "_User",
            objectId: tripDetails.user.id
        });

        trips.save(null, {
            success: function (parseObject) {
                callback(parseObject.id);
            },
            error: function (gameScore, error) {
                alert('Failed to create new object, with error code: ' + error.message);
            }
        });

    };
    function getMyTrips(myId, callback) {
        var myTrips = new Array();
        var query = new Parse.Query(trips);
        query.include("user_pointer");
        query.equalTo("user_pointer", {
            __type: "Pointer",
            className: "_User",
            objectId: myId
        });
        query.find({
            success: function (parseObject) {
                for (var i = 0; i < parseObject.length; i++) {
                    myTrips[i] = getTripFromParse(parseObject[i]);
                }
                callback(myTrips);
            },
            error: function (object, error) {
                // The object was not retrieved successfully.
            }
        });
    };
    function getAllTrips(callback) {
        var allTrips = new Array();
        var query = new Parse.Query(trips);
        query.include("user_pointer");

        query.find({
            success: function (parseObject) {
                for (var i = 0; i < parseObject.length; i++) {
                    allTrips[i] = getTripFromParse(parseObject[i]);
                }
                callback(allTrips);
            },
            error: function (object, error) {
                // The object was not retrieved successfully.
            }
        });
    };
    function getMyProfile() {
        var deferred = $q.defer();
        FB.api('/me', {
            fields: 'id,name,picture'
        }, function (response) {
            if (!response || response.error) {
                deferred.reject('Error occured');
            } else {
                deferred.resolve(response);
            }
        });
        return deferred.promise;

    };
    function updateUserFacebookProfile(profile, userId, callback) {
        user.id = userId;
        user.set("facebook_profile", profile);
        user.save(null, {
            success: function (parseObject) {
                callback(parseObject.id);
            },
            error: function (gameScore, error) {
                alert('Failed to create new object, with error code: ' + error.message);
            }
        });

    }
    function getUserById(userId, callback) {
        var query = new Parse.Query(user);
        query.get(userId, {
            success: function (parseObject) {
                var userObj = {
                    id: parseObject.id,
                    authData: parseObject.get("authData"),
                    facebook_profile: parseObject.get("facebook_profile")
                };

                callback(userObj);
            },
            error: function (object, error) {
                // The object was not retrieved successfully.
            }
        });
    }


    //Internal
    function getTripFromParse(parseObject) {
        var trip = {
            id: parseObject.id,
            title: parseObject.get("title"),
            createdAt: parseObject.get("createdAt"),
            updatedAt: parseObject.get("updatedAt"),
            introduction: parseObject.get("introduction"),
            main_image: parseObject.get("main_image"),
            posted_on: parseObject.get("posted_on"),
            visited_places: parseObject.get("visited_places"),
            total_likes: parseObject.get("total_likes"),
            user: {
                id: parseObject.get("user_pointer").id,
                authData: parseObject.get("user_pointer").get("authData"),
                facebook_profile: parseObject.get("user_pointer").get("facebook_profile")
            },
            username: parseObject.get("username"),
            tags: parseObject.get("tags")
        }
        return trip;
    };
} ]);