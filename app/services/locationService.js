var app = angular.module('campture');
app.factory('LocationService', ['$http', '$q', function ($http, $q) {
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
        getUserLocationCardList:getUserLocationCardList
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
    function getLocationCards(page, callback) {
        var paginglimit = 50;
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
    function getUserLocationCardList(userId,callback){
        var locationCardObject =  new Object()
        var userLocationCard = new UserLocationCard();
        var query = new Parse.Query(userLocationCard);
        var query2 = new Parse.Query()
        query.equalTo("user_id", userId);
        query.find({
            success: function (parseObject) {
                locationCardObject = JSON.parse(JSON.stringify(parseObject));
                callback(locationCards);
            },
            error: function (object, error) {
                // The object was not retrieved successfully.
            }
        });
        query.containedIn("place_id", ["ChIJIdjO3-1DBDkRwtUjYjYIesQ", "ChIJl1g-fgmyzIAR16qewajSiqE", "ChIJL1E4f110LocRnv14nqI0w-A"]);
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
} ]);