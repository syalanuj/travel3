var app = angular.module('campture');
app.factory('FlickrApiService', ['$http', '$q', function ($http, $q) {

    return {
        findPlacesByLatLon: findPlacesByLatLon,
        searchPhotosByPlaceId: searchPhotosByPlaceId,
        getOwnerProfileByPhotoId: getOwnerProfileByPhotoId,
        getPhotoInfoByPhotoId: getPhotoInfoByPhotoId
    };


    function findPlacesByLatLon(coordinates) {
        var url = 'https://api.flickr.com/services/rest/?method=flickr.places.findByLatLon&api_key=3d89687c598045a83210e3feb7335fb8&lat=' + coordinates.latitude + '&lon=' + coordinates.longitude + '&accuracy=16&nojsoncallback=1';//&format=json&nojsoncallback=1
        return $http({ method: 'GET', url: url, params: {
            format: 'json',
            callback: 'JSON_CALLBACK'
        }
        });
    }
    function searchPhotosByPlaceId(placeId,locationName) {
        var url = ' https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=3d89687c598045a83210e3feb7335fb8&place_id=' + placeId + '&nojsoncallback=1&tags='+locationName;// + '&format=json';
        return $http({ method: 'GET', url: url, params: {
            format: 'json',
            callback: 'JSON_CALLBACK'
        }
        });
    }
    function getOwnerProfileByPhotoId(photoId) {
        var url = ' https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=3d89687c598045a83210e3feb7335fb8&place_id=' + placeId + '&nojsoncallback=1'; //+ '&format=json';
        return $http({ method: 'GET', url: url, params: {
            format: 'json',
            callback: 'JSON_CALLBACK'
        }
        });
    }
    function getPhotoInfoByPhotoId(photoId) {
        var url = 'https://api.flickr.com/services/rest/?method=flickr.photos.getInfo&api_key=8af7e33d26d47d79ecf67469f66003f6&photo_id=' + photoId;// + '&format=json';
        return $http({ method: 'JSONP', url: url, params: {
            format: 'jsonp',
            callback: 'JSON_CALLBACK'
        }
        });
    }
} ]);