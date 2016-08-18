var app = angular.module('campture');
app.factory('TourService', ['$http', '$q', function ($http, $q) {
    var TourPrice = Parse.Object.extend("Tour_Price");
    //var tourPrice = TourPrice();    

    return {
        getTourPriceDetails: getTourPriceDetails,
        sendUserTourQuery: sendUserTourQuery,
        sendUserTourQueryRest: sendUserTourQueryRest,
        getAllTours: getAllTours 
    };

    function getTourPriceDetails(tourPriceId, callback) {
        var tourPrice = new TourPrice();
        var query = new Parse.Query(tourPrice);
        query.get(tourPriceId, {
            success: function (parseObject) {
                callback(JSON.parse(JSON.stringify(parseObject)));
            },
            error: function (object, error) {
                // The object was not retrieved successfully.
            }
        });
    }

    function sendUserTourQuery(userQuery, callback) {
        var data = {
            userQuery: userQuery
        }
        Parse.Cloud.run("sendTourUserQuery", data, {
            success: function (object) {
                callback(object);
            },

            error: function (object, error) {
                console.log(object + ' ' + error);
            }
        });
    }

    function sendUserTourQueryRest(userQuery, callback) {
        var data = {
            userQuery: userQuery
        }
        Parse.Cloud.run("sendTourUserQueryRest", data, {
            success: function (object) {
                callback(object);
            },

            error: function (object, error) {
                console.log(object + ' ' + error);
            }
        });
    }

    function  getAllTours(callback){
        var tourPrice = new TourPrice();
        var query = new Parse.Query(tourPrice);
        query.find({
            success: function (parseObject) {
                callback(JSON.parse(JSON.stringify(parseObject)));
            },
            error: function (object, error) {
                // The object was not retrieved successfully.
            }
        });
    }
} ]);