var app = angular.module('campture');
app.factory('GearService', ['$http', '$q', function ($http, $q) {
    var Gear = Parse.Object.extend("Gears");

    var gear = new Gear();

    return {
        getGearList: getGearList,
        getWeatherData: getWeatherData
    };

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
} ]);