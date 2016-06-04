var app = angular.module('campture');
app.factory('LocationService', ['$http', '$q', function ($http, $q) {
    var paginglimit = 50;
    var LocationReviews = Parse.Object.extend("Location_Reviews");
    var LocationTips = Parse.Object.extend("Location_Tips");
    var LocationCard = Parse.Object.extend("Location_Card");
    var UserLocationCard = Parse.Object.extend("User_Location_Card")

    var locationReview = new LocationReviews();
    var locationTips = new LocationTips();
    var locationCard = new LocationCard();
    return {
        getReviewsForLocation: getReviewsForLocation,
        getReviewsOfUser: getReviewsOfUser,
        postReview: postReview,
        updateReview: updateReview,
        VoteReview: VoteReview,
        getTipsForLocation: getTipsForLocation,
        saveLocationCard: saveLocationCard,
        getLocationCards: getLocationCards,
        getUserLocationCardList: getUserLocationCardList,
        addUserLocationCard: addUserLocationCard,
        searchLocationCardByText: searchLocationCardByText,
        searchLocationByTag: searchLocationByTag 
    };
    function getReviewsForLocation(placeId, callback) {
        var locationReviews = new Array();
        var locationReview = new LocationReviews();
        var query = new Parse.Query(locationReview);
        query.include("user_pointer");
        query.equalTo("place_id", placeId);

        query.find({
            success: function (parseObject) {
                locationReviews = JSON.parse(JSON.stringify(parseObject));
                callback(locationReviews);
            },
            error: function (object, error) {
                // The object was not retrieved successfully.
            }
        });
    }
    function getReviewsOfUser(userId, callback) {
        var userReviews = new Array();
        var locationReview = new LocationReviews();
        var query = new Parse.Query(locationReview);
        query.include("user_pointer");
        query.equalTo("user_pointer", {
            __type: "Pointer",
            className: "_User",
            objectId: userId
        });
        query.find({
            success: function (parseObject) {
                userReviews = JSON.parse(JSON.stringify(parseObject));
                callback(userReviews);
            },
            error: function (object, error) {
                // The object was not retrieved successfully.
            }
        });
    }
    function postReview(reviewObject, callback) {
        var locationReview = new LocationReviews();
        locationReview.set("place_id", reviewObject.placeId);
        locationReview.set("rating", reviewObject.rating);
        locationReview.set("review_text", reviewObject.reviewText);
        locationReview.set("is_food_available", reviewObject.isFoodAvailable);
        locationReview.set("is_accommodation_available", reviewObject.isAccommodationAvailable);
        locationReview.set("difficulty_grade", reviewObject.difficultyGrade);
        locationReview.set("upvote_count", 0);
        locationReview.set("downvote_count", 0);
        locationReview.set("user_pointer", {
            __type: "Pointer",
            className: "_User",
            objectId: reviewObject.userId
        });
        locationReview.save(null, {
            success: function (parseObject) {
                callback(parseObject.id);
            },
            error: function (gameScore, error) {
                console.log('Failed to create new object, with error code: ' + error.message);
            }
        });
    }
    function updateReview(reviewObject, callback) {

    }
    function VoteReview(type, reviewObject, userObjId) {

    }
    function getTipsForLocation(placeId, callback) {
        var locationTips = new Array();
        var locationTip = new LocationTips();
        var query = new Parse.Query(locationTip);
        query.include("user_pointer");
        query.equalTo("place_id", placeId);

        query.find({
            success: function (parseObject) {
                locationTips = JSON.parse(JSON.stringify(parseObject));
                callback(locationTips);
            },
            error: function (object, error) {
                // The object was not retrieved successfully.
            }
        });
    }
    function getGearList(temperatureGrade, durationGrade, callback) {
        var query = new Parse.Query(gear);
        query.equalTo("temperature_grade", temperatureGrade);
        query.equalTo("duration_grade", durationGrade);
        query.find({
            success: function (parseObject) {
                callback(JSON.parse(JSON.stringify(parseObject)));
            },
            error: function (object, error) {
                // The object was not retrieved successfully.
                console.log(error);
            }
        });
    };
    function getWeatherData(coordinates, dateTime) {
        //https://api.forecast.io/forecast/APIKEY/LATITUDE,LONGITUDE,TIME--2015-04-13T12:00:00-0400
        var url = 'https://api.forecast.io/forecast/e11381bd591807eb53abc80fd55e40da/' + coordinates.latitude + ',' + coordinates.longitude + ',' + dateTime;
        return $http({ method: 'JSONP', url: url, params: {
            format: 'jsonp',
            callback: 'JSON_CALLBACK'
        }
        });
    }
    function saveLocationCard(locationCardObj, callback) {
        var locationCard = new LocationCard();
        var query = new Parse.Query(locationCard);
        query.equalTo("place_id", locationCardObj.placeId);
        query.find({
            success: function (parseObject) {
                if (parseObject && parseObject.length < 1) {
                    locationCard.set("coordinates", locationCardObj.coordinates);
                    locationCard.set("flickr_place_id", locationCardObj.flickrPlaceId);
                    locationCard.set("name", locationCardObj.name);
                    locationCard.set("place_id", locationCardObj.placeId);
                    locationCard.set("tags", locationCardObj.tags);
                    locationCard.set("panoramio_image", locationCardObj.panoramioImage);
                    locationCard.save(null, {
                        success: function (parseObject) {
                            callback(parseObject.id);
                        },
                        error: function (gameScore, error) {
                            console.log('Failed to create new object, with error code: ' + error.message);
                        }
                    });
                }
                else {
                    callback(false);
                }
            },
            error: function (object, error) {
                // The object was not retrieved successfully.
                console.log(error);
            }
        });

    }
    function getLocationCards(page, callback) {
        var locationCard = new LocationCard();
        var query = new Parse.Query(locationCard);
        query.limit(paginglimit);
        query.skip(page * paginglimit);
        query.find({
            success: function (parseObject) {
                locationCards = JSON.parse(JSON.stringify(parseObject));
                callback(locationCards);
            },
            error: function (object, error) {
                // The object was not retrieved successfully.
            }
        });
    }
    function getUserLocationCardList(userId, callback) {
        var userLocationCardList = new Array();
        var locationCardObject = new Object();
        var userLocationCard = new UserLocationCard();
        var locationCard = new LocationCard();
        var query = new Parse.Query(userLocationCard);
        var query2 = new Parse.Query(locationCard);
        var combinedLocationCard = Array();

        query.equalTo("user_pointer", {
            __type: "Pointer",
            className: "_User",
            objectId: userId
        });
        query.find({
            success: function (parseObject) {
                var userCards = JSON.parse(JSON.stringify(parseObject));
                angular.forEach(userCards, function (userCard, key) {
                    userLocationCardList.push(userCard.place_id);
                });
                query2.containedIn("place_id", userLocationCardList); //["ChIJIdjO3-1DBDkRwtUjYjYIesQ", "ChIJl1g-fgmyzIAR16qewajSiqE", "ChIJL1E4f110LocRnv14nqI0w-A"]
                query2.find({
                    success: function (parseObject) {
                        locationCards = JSON.parse(JSON.stringify(parseObject));
                        angular.forEach(locationCards, function (locationCard, key) {
                            angular.forEach(userCards, function (userCard, key) {
                                if (locationCard.place_id == userCard.place_id) {
                                    locationCard.is_explored = userCard.is_explored
                                    combinedLocationCard.push(locationCard);
                                }
                            });
                        });
                        callback(combinedLocationCard);
                    },
                    error: function (object, error) {
                        console.log(object)
                    }
                });
            },
            error: function (object, error) {
                console.log(object)
            }
        });
    }
    function addUserLocationCard(userId, placeId, isExplored, callback) {
        var userLocationCard = new UserLocationCard();
        var query = new Parse.Query(userLocationCard);
        query.equalTo("place_id", placeId);
        query.equalTo("user_pointer", {
            __type: "Pointer",
            className: "_User",
            objectId: userId
        });
        query.find({
            success: function (parseObject) {
                var pObject = JSON.parse(JSON.stringify(parseObject));
                if (parseObject && parseObject.length < 1) {
                    userLocationCard.set("place_id", placeId);
                    userLocationCard.set("is_explored", isExplored);
                    userLocationCard.set("user_pointer", {
                        __type: "Pointer",
                        className: "_User",
                        objectId: userId
                    });
                    userLocationCard.save(null, {
                        success: function (parseObject) {
                            callback(parseObject.id);
                        },
                        error: function (gameScore, error) {
                            console.log('Failed to create new object, with error code: ' + error.message);
                        }
                    });
                }
                else if (pObject[0].is_explored != isExplored) {
                    userLocationCard = new UserLocationCard();
                    userLocationCard.id = pObject[0].objectId
                    userLocationCard.set("is_explored", isExplored);
                    userLocationCard.save(null, {
                        success: function (parseObject) {
                            callback(parseObject.id);
                        },
                        error: function (gameScore, error) {
                            console.log('Failed to create new object, with error code: ' + error.message);
                        }
                    });
                }
                else {
                    callback(false);
                }

            },
            error: function (object, error) {
                // The object was not retrieved successfully.
                console.log(error);
            }
        });

    }
    function searchLocationCardByText(searchText, page, callback) {
        var locationCard = new LocationCard();
        var searchLocationName = new Parse.Query(locationCard);
        searchLocationName.startsWith("name", searchText);
        var searchLocationTags = new Parse.Query(locationCard);
        searchLocationTags.equalTo("tags", searchText);

        var mainQuery = Parse.Query.or(searchLocationName, searchLocationTags);
        mainQuery.limit(paginglimit);
        mainQuery.skip(page * paginglimit);
        mainQuery.find({
            success: function(parseObject) {
            if(parseObject){
                callback(JSON.parse(JSON.stringify(parseObject)))
            }
            },
            error: function(error) {
            // There was an error.
            } 
        });
    }
    function searchLocationByTag(tags, page, callback){
        var locationCard = new LocationCard();
        var query = new Parse.Query(locationCard);
        query.limit(paginglimit);
        query.skip(page * paginglimit);
        query.containsAll("tags", tags);
        query.find({
            success: function (parseObject) {
                locations = JSON.parse(JSON.stringify(parseObject));
                callback(locations);
            },
            error: function (object, error) {
                // The object was not retrieved successfully.
            }
        });
    }
} ]);