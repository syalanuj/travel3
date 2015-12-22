var app = angular.module('campture');
app.factory('TripService', ['$http', function ($http) {
    var User = Parse.Object.extend("User");
    var Trips = Parse.Object.extend("Trips");
    var Comments = Parse.Object.extend("Comments");
    var Likes = Parse.Object.extend("Likes");
    var Tag = Parse.Object.extend("Tag");

    var user = new User();
    var trips = new Trips();
    var comments = new Comments();
    var likes = new Likes();
    var tag = new Tag();
    return {
        postComment: postComment,
        getTripComments: getTripComments,
        tripLike: tripLike,
        tripUnlike: tripUnlike,
        isTripLikedByUser: isTripLikedByUser
    };

    function postComment(myComment, callback) {
        comments.set("text", myComment.text);
        comments.set("trip_pointer", {
            __type: "Pointer",
            className: "Trips",
            objectId: myComment.trip_pointer
        });
        comments.set("user_pointer", {
            __type: "Pointer",
            className: "_User",
            objectId: myComment.user_pointer
        });
        comments.save(null, {
            success: function (parseObject) {
                callback(parseObject.id);
            },
            error: function (gameScore, error) {
                alert('Failed to create new object, with error code: ' + error.message);
            }
        });
    }

    function getTripComments(tripId, callback) {
        var tripComments = new Array();
        var query = new Parse.Query(comments);
        query.include("user_pointer");
        query.equalTo("trip_pointer", {
            __type: "Pointer",
            className: "Trips",
            objectId: tripId
        });
        query.find({
            success: function (parseObject) {
                tripComments = JSON.stringify(parseObject);
                callback(JSON.parse(tripComments));
            },
            error: function (object, error) {
                // The object was not retrieved successfully.
            }
        });
    };


    function tripLike(likesCounter, likeObj, callback) {
        var likes = new Likes();
        likes.set("trip_pointer", {
            __type: "Pointer",
            className: "Trips",
            objectId: likeObj.trip_pointer
        });
        likes.set("user_pointer", {
            __type: "Pointer",
            className: "_User",
            objectId: likeObj.user_pointer
        });
        likes.save(null, {
            success: function (parseObject) {
                trips.id = likeObj.trip_pointer;
                trips.set("total_likes", likesCounter);
                trips.save(null, {
                    success: function (parseObject) {
                        callback(parseObject.id);
                    },
                    error: function (gameScore, error) {
                        alert('Failed to create new object, with error code: ' + error.message);
                    }
                });
            },
            error: function (gameScore, error) {
                alert('Failed to create new object, with error code: ' + error.message);
            }
        });
    }

    function tripUnlike(likeId, tripId,total_likes, callback) {
        likes.id = likeId;
        likes.destroy({
            success: function (parseObject) {
                trips.id = tripId;
                trips.set("total_likes", total_likes);
                trips.save(null, {
                    success: function (parseObject) {
                        callback(parseObject.id);
                    },
                    error: function (gameScore, error) {
                        alert('Failed to create new object, with error code: ' + error.message);
                    }
                });
            },
            error: function (myObject, error) {
                alert('Failed to create new object, with error code: ' + error.message);
            }
        });
    }

    function isTripLikedByUser(likeObj, callback) {
        var query = new Parse.Query(likes);
        query.equalTo("trip_pointer", {
            __type: "Pointer",
            className: "Trips",
            objectId: likeObj.trip_pointer
        });
        query.equalTo("user_pointer", {
            __type: "Pointer",
            className: "_User",
            objectId: likeObj.user_pointer
        });
        query.find({
            success: function (parseObject) {
                if (parseObject.length > 0) {
                    callback(parseObject[0].id);
                }
                else {
                    callback(undefined);
                }
            },
            error: function (object, error) {
                // The object was not retrieved successfully.
            }
        });
    }

} ]);