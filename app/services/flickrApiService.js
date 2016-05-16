var app = angular.module('campture');
app.factory('FlickrApiService', ['$http', '$q', function ($http, $q) {

    return {
        findPlacesByLatLon: findPlacesByLatLon,
        searchPhotosByPlaceId: searchPhotosByPlaceId,
        getSinglePhotoByPlaceId: getSinglePhotoByPlaceId,
        getOwnerProfileByPhotoId: getOwnerProfileByPhotoId,
        getPhotoInfoByPhotoId: getPhotoInfoByPhotoId,
        //panaromio
        getPhotosOfLocation: getPhotosOfLocation
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
    function getSinglePhotoByPlaceId(placeId,locationName) {
        var url = ' https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=3d89687c598045a83210e3feb7335fb8&place_id=' + placeId + '&per_page=1&nojsoncallback=1&tags='+locationName;// + '&format=json';
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
        var url = 'https://api.flickr.com/services/rest/?method=flickr.photos.getInfo&api_key=3d89687c598045a83210e3feb7335fb8&photo_id=' + photoId + '&nojsoncallback=1';// + '&format=json';
        return $http({ method: 'GET', url: url, params: {
            format: 'json',
            callback: 'JSON_CALLBACK'
        }
        });
    }
    function getPhotosOfLocation(coordinates, locationName){
        var url ='http://www.panoramio.com/wapi/data/get_photos?v=1&key=dummykey&minx=' + coordinates.latitude +'&miny='  + coordinates.longitude + '&tag=' + locationName +'&size=medium&offset=0&length=17'
        return $http({ method: 'jsonp', url: url, params: {
            format: 'jsonp',
            callback: 'JSON_CALLBACK'
        }
        });
      // return $http.jsonp(url);
    }
} ]);