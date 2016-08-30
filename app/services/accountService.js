var app = angular.module('campture');
app.factory('AccountService', ['$http', '$q', function ($http, $q) {
    var User = Parse.Object.extend("User");
    var Trips = Parse.Object.extend("Trips");
    var TripLikes = Parse.Object.extend("Trip_Likes");
    var PublicCMS = Parse.Object.extend("Public_CMS");

    var user = new User();
    var trips = new Trips();
    var tripLikes = new TripLikes();
    var publicCMS = new PublicCMS();

    return {
        getTripById: getTripById,
        getMyTrips: getMyTrips,
        getAllTrips: getAllTrips,
        getAllFeaturedTrips: getAllFeaturedTrips,
        getAllLandingFeaturedTrips: getAllLandingFeaturedTrips,
        getMyProfile: getMyProfile,
        getUserById: getUserById,
        getTripByTags: getTripByTags,
        getAllUserProfiles: getAllUserProfiles,
        updateUserGallery: updateUserGallery,
        getUserGallery: getUserGallery,
        getRelatedTrips: getRelatedTrips,
        uploadImageOnCloudinary: uploadImageOnCloudinary,
        getTripCategories: getTripCategories,
        getHeaderTopTags: getHeaderTopTags,
        getLandingContent: getLandingContent
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

    function getAllFeaturedTrips(callback) {
        var allTrips = new Array();
        var query = new Parse.Query(trips);
        query.include("user_pointer");
        query.equalTo("is_featured", true);
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
    function getAllLandingFeaturedTrips(callback) {
        var allTrips = new Array();
        var query = new Parse.Query(trips);
        query.include("user_pointer");
        query.equalTo("is_featured", true);
        query.limit(8);
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
    function getUserById(userId, callback) {
        var query = new Parse.Query(user);
        query.get(userId, {
            success: function (parseObject) {
                callback(JSON.parse(JSON.stringify(parseObject)));
            },
            error: function (object, error) {
                // The object was not retrieved successfully.
                if (error.code == 101) {
                    callback(undefined);
                }
            }
        });
    }
    function getTripByTags(tag, callback) {
        var allTrips = new Array();
        var query = new Parse.Query(trips);
        query.include("user_pointer");
        query.equalTo("tags", tag);
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
    function getAllUserProfiles(callback) {
        var query = new Parse.Query(user);
        query.find({
            success: function (parseObject) {
                var allUsers = new Array();
                for (var i = 0; i < parseObject.length; i++) {
                    var userObj = {
                        id: parseObject[i].id,
                        authData: parseObject[i].get("authData"),
                        facebook_profile: parseObject[i].get("facebook_profile")
                    };
                    allUsers.push(userObj);
                }
                callback(allUsers);
            },
            error: function (object, error) {
                // The object was not retrieved successfully.
            }
        });
    }

    function updateUserGallery(userId, imageObj, callback) {
        user.id = userId;
        user.add("gallery", imageObj);
        user.save(null, {
            success: function (parseObject) {
                callback(parseObject.id);
            },
            error: function (gameScore, error) {
                alert('Failed to create new object, with error code: ' + error.message);
            }
        });
    }
    function getUserGallery(userId, callback) {
        var query = new Parse.Query(user);
        query.get(userId, {
            success: function (parseObject) {
                var gallery = parseObject.get("gallery");
                callback(gallery);
            },
            error: function (object, error) {
                // The object was not retrieved successfully.
            }
        });
    }
    function getRelatedTrips(tags, callback) {
        var allTrips = new Array();
        var query = new Parse.Query(trips);
        query.include("user_pointer");
        if (tags && tags.length > 0) {
            query.containedIn("tags", tags);
        }
        query.limit(5)
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
    function uploadImageOnCloudinary(fileUrl, fileName) {
        return $http.post("https://api.cloudinary.com/v1_1/dxhw97es3/image/upload", 'file=' + fileName + '&api_key=866125139783574&file=' + fileUrl + '&timestamp=1315060076&upload_preset=campture2', {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
        })
    }

    function getTripCategories(callback) {
        var TripCategories = Parse.Object.extend("Trip_Categories");
        var tripCategories = new TripCategories();
        var allTrips = new Array();
        var query = new Parse.Query(tripCategories);

        query.find({
            success: function (parseObject) {
                callback(JSON.parse(JSON.stringify(parseObject)));
            },
            error: function (object, error) {
                // The object was not retrieved successfully.
            }
        });
    }
    function getHeaderTopTags(callback) {
        var HeaderTags = Parse.Object.extend("Header_Tags");
        var headerTags = new HeaderTags();
        var query = new Parse.Query(headerTags);

        query.find({
            success: function (parseObject) {
                callback(JSON.parse(JSON.stringify(parseObject)));
            },
            error: function (object, error) {
                // The object was not retrieved successfully.
            }
        });
    }
    function getLandingContent(callback) {
        var query = new Parse.Query(publicCMS);

        query.find({
            success: function (parseObject) {
                callback(JSON.parse(JSON.stringify(parseObject)));
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