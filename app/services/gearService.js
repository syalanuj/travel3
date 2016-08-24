var app = angular.module('campture');
app.factory('GearService', ['$http', '$q', function ($http, $q) {

    return {
        getWeatherDataFromCloud: getWeatherDataFromCloud,
        gearBuyPoll: gearBuyPoll,
        postGearlistEntries: postGearlistEntries,
        getFullGearList: getFullGearList
    };

    function getWeatherDataFromCloud(coordinates, dateTime, duration, callback) {
        var data = {
            coordinates: coordinates,
            dateTime: dateTime,
            duration: duration
        }
        Parse.Cloud.run("getGearData", data, {
            success: function (object) {
                callback(object);
            },

            error: function (object, error) {
                console.log(object + ' ' + error);
            }
        });
    }

    function gearBuyPoll(decision,callback) {
        var BuyGearPoll = Parse.Object.extend("Buy_Gear_Poll");
        var buyGearPoll = new BuyGearPoll();
        buyGearPoll.id = '93dN6sUy2T';
        if (decision == 0) {
            buyGearPoll.increment("no_count");
        }
        else{
            buyGearPoll.increment("yes_count");
        }
        buyGearPoll.save(null, {
            success: function (parseObject) {
                callback(parseObject)
            },
            error: function (gameScore, error) {
                console.log(error.message);
            }
        });
    }

    function  postGearlistEntries (gearlistEntryData,callback){
        var GearlistEntries = Parse.Object.extend("Gearlist_Entries");
        var gearlistEntry = new GearlistEntries();
        gearlistEntry.set("place_id", gearlistEntryData.place_id);
        gearlistEntry.set("place_details", gearlistEntryData);
        gearlistEntry.save(null, {
            success: function (parseObject) {
                callback(parseObject.id);
            },
            error: function (gameScore, error) {
                alert('Failed to create new object, with error code: ' + error.message);
            }
        });
    }

    function getFullGearList (callback){
        var Gears = Parse.Object.extend("Gears");
        var gears = new Gears();
        var query = new Parse.Query(gears);

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