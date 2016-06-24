(function () {
    'use strict';

    var app = angular.module('campture');
    app.controller('InspirationAdminCtrl', ['$scope', '$cookies', '$rootScope', '$http', 'FlickrApiService', 'LocationService', 'AccountService', controller]);
    function controller($scope, $cookies, $rootScope, $http, flickrApiService, locationService, accountService) {
        $scope.locationCard = new Object();
        $scope.photoNotFound = false;
        $scope.details = function (details) {
            $scope.location = new Object();
            $scope.coordinates = { latitude: details.geometry.location.lat(), longitude: details.geometry.location.lng() };
            $scope.location.locationDetails = details;
            $scope.location.formatted_address = details.formatted_address;
            $scope.marker = {
                id: 1,
                coords: $scope.coordinates
            }
            $scope.map = { center: { latitude: $scope.coordinates.latitude, longitude: $scope.coordinates.longitude }, zoom: 12 }
            $scope.locationCard.coordinates = $scope.coordinates;
            $scope.locationCard.placeId = details.place_id;
            $scope.locationCard.name = details.name;
            flickrApiService.getPhotosOfLocation($scope.locationCard.coordinates, $scope.locationCard.name).then(
                    function (res) {
                        if (res) {
                            // if(res.data.photos.length){}
                            $scope.newImages = res.data.photos;
                            $scope.locationCard.panoramioImage = {
                                imageUrl: res.data.photos[0].photoPixelsUrls[0].url,
                                ownerName: res.data.photos[0].ownerName,
                                ownerUrl: res.data.photos[0].ownerUrl,
                                photoTitle: res.data.photos[0].photoTitle,
                                panoramioUrl: res.data.photos[0].photoUrl
                            };
                            flickrApiService.findPlacesByLatLon($scope.coordinates).then(
                    function (res) {
                        if (res && res.data && res.data.places && res.data.places.place) {
                            $scope.locationCard.flickrPlaceId = res.data.places.place[0].place_id;
                            flickrApiService.getTagsForPlace(res.data.places.place[0].place_id).then(
                            function (res) {
                                if (res) {
                                    $scope.locationCard.tags = new Array();
                                    var tagsCount = new Object();
                                    if (res.data.tags.total > 9) {
                                        tagsCount = 10
                                    }
                                    else {
                                        tagsCount = res.data.tags.total
                                    }
                                    for (var count = 0; count < tagsCount; count++) {
                                        try {
                                            var tag = res.data.tags.tag[count]._content.toLowerCase().replace(/ /g, '')
                                            $scope.locationCard.tags[count] = tag;
                                        }
                                        catch (ex) {
                                            var tag = res.data.tags.tag[count]._content.replace(/ /g, '')
                                            $scope.locationCard.tags[count] = tag;
                                        }
                                    }
                                }
                                else {
                                    $scope.photoNotFound = true;
                                }
                            }, function (status) {
                                $scope.apiError = true;
                                $scope.apiStatus = status;
                            });
                        }
                    },
                    function (status) {
                        $scope.apiError = true;
                        $scope.apiStatus = status;
                    }
                    );

                        }
                    },
                    function (status) {
                        $scope.apiError = true;
                        $scope.apiStatus = status;
                    }
                );
        };

        $scope.saveLocation = function () {
            locationService.saveLocationCard($scope.locationCard, function (data) {
                if (data) {
                    $scope.locationCard = undefined;
                    $scope.$apply();
                }
                else {
                    $scope.locationCard = undefined;
                    $scope.placeExists = true
                    $scope.$apply();
                }
            })
        }
        $scope.selectImage = function (paranamioImage) {
            $scope.locationCard.panoramioImage = {
                imageUrl: paranamioImage.photoPixelsUrls[0].url,
                ownerName: paranamioImage.ownerName,
                ownerUrl: paranamioImage.ownerUrl,
                photoTitle: paranamioImage.photoTitle,
                panoramioUrl: paranamioImage.photoUrl
            };
        }
        $scope.addNewTag = function () {
            if ($scope.newTag) {
                var tag = {
                    _content: $scope.newTag,
                    count: 0
                }
                if ($scope.locationCard.tags) {
                    $scope.locationCard.tags.push(tag)
                    $scope.newTag = undefined
                }
            }
        }
        function getImageUrl(farmId, serverId, id, secret, sizeSuffix) {
            return 'https://farm' + farmId + '.staticflickr.com/' + serverId + '/' + id + '_' + secret + '_' + sizeSuffix + '.jpg';
        }
        function getdatafromMongo() {
            return $http.get('localhost:3000/users/vap');
        }
        $scope.vap = function () {
            $http.get('http://localhost:3000/users/vap').success(function (result) {
                var ViatorProducts = Parse.Object.extend("ViatorProducts");
                var products = result.vap; //[0].Products.Product
                var count = 0
                for (var index = 0; index < products.length; index++) {
                    var viatorProducts = new ViatorProducts();
                    viatorProducts.set("BookingType", products[index].BookingType);
                    viatorProducts.set("Commences", products[index].Commences);
                    viatorProducts.set("Destination", products[index].Destination);
                    viatorProducts.set("Duration", products[index].Duration);
                    viatorProducts.set("Introduction", products[index].Introduction);
                    viatorProducts.set("Pricing", products[index].Pricing);
                    viatorProducts.set("ProductCategories", products[index].ProductCategories);
                    viatorProducts.set("ProductCode", products[index].ProductCode);
                    viatorProducts.set("ProductImage", products[index].ProductImage);
                    viatorProducts.set("ProductName", products[index].ProductName);
                    viatorProducts.set("ProductText", products[index].ProductText);
                    viatorProducts.set("ProductType", products[index].ProductType);
                    viatorProducts.set("ProductURLs", products[index].ProductURLs);
                    viatorProducts.set("Rank", products[index].Rank);
                    viatorProducts.set("Special", products[index].Special);
                    viatorProducts.set("SpecialDescription", products[index].SpecialDescription);
                    viatorProducts.set("VoucherOption", products[index].VoucherOption);



                    viatorProducts.save(null, {
                        success: function (parseObject) {
                            count++
                            //callback(parseObject.id);
                        },
                        error: function (gameScore, error) {
                            console.log('Failed to create new object, with error code: ' + error.message);
                        }
                    });
                }
            })
        }

        $scope.getallVapProducts = function () {
            var ViatorProducts = Parse.Object.extend("ViatorProducts");
            var viatorProducts = new ViatorProducts();
            var query = new Parse.Query(viatorProducts);
            var vapArray = new Array()
            query.find({
                success: function (parseObject) {
                    vapArray = JSON.parse(JSON.stringify(parseObject));
                    callback(locationCards);
                },
                error: function (object, error) {
                    // The object was not retrieved successfully.
                }
            });
        }
        $scope.geolocateAllLocation = function () {
            var i = 0;                     //  set your counter to 1

            function myLoop() {           //  create a loop function
                setTimeout(function () {    //  call a 3s setTimeout when the loop is called
                    $scope.geocodeLocation(allLocations[i].property1 , allLocations[i].property2)         //  your code here
                    i++;                     //  increment the counter
                    if (i < allLocations.length) {            //  if the counter < 10, call the loop function
                        myLoop();             //  ..  again which will trigger another 
                    }                        //  ..  setTimeout()
                }, 3000)
            }

            myLoop();

        }

        function doSetTimeOut(i) {
            try {
                setTimeout(function () { $scope.geocodeLocation(allLocations[i].property1 + ", " + allLocations[i].property2) }, 6000)
            } catch (ex) {
                console.log(ex)
            }
        }

        $scope.geocodeLocation = function (locationName, locationArea) {
            var uploadCount = 0;
            var locationCardNew = new Object()
            var geocoder = new google.maps.Geocoder();
            geocoder.geocode({ 'address': locationName + ", " + locationArea}, function (results, status) {
                if (status === google.maps.GeocoderStatus.OK) {
                    var location = results[0]
                    //check duplicate place_id

                    locationService.getLocationCardByPlaceId(location.place_id, function (data) {
                        if (!data) {
                            locationCardNew.coordinates = { latitude: location.geometry.location.lat(), longitude: location.geometry.location.lng() };
                            locationCardNew.placeId = location.place_id;
                            locationCardNew.name = locationName;
                            flickrApiService.getPhotosOfLocation(locationCardNew.coordinates, locationCardNew.name).then(
                    function (res) {
                        if (res) {
                            if (res.data.photos.length) {
                                locationCardNew.panoramioImage = {
                                    imageUrl: res.data.photos[0].photoPixelsUrls[0].url,
                                    ownerName: res.data.photos[0].ownerName,
                                    ownerUrl: res.data.photos[0].ownerUrl,
                                    photoTitle: res.data.photos[0].photoTitle,
                                    panoramioUrl: res.data.photos[0].photoUrl
                                };
                                flickrApiService.findPlacesByLatLon(locationCardNew.coordinates).then(
                    function (res) {
                        if (res && res.data && res.data.places && res.data.places.place) {
                            locationCardNew.flickrPlaceId = res.data.places.place[0].place_id;
                            flickrApiService.getTagsForPlace(res.data.places.place[0].place_id).then(
                            function (res) {
                                if (res) {
                                    locationCardNew.tags = new Array();
                                    var tagsCount = new Object();
                                    if (res.data.tags.total > 9) {
                                        tagsCount = 10
                                    }
                                    else {
                                        tagsCount = res.data.tags.total
                                    }
                                    for (var count = 0; count < tagsCount; count++) {
                                        try {
                                            var tag = res.data.tags.tag[count]._content.toLowerCase().replace(/ /g, '')
                                            locationCardNew.tags[count] = tag;
                                            
                                        }
                                        catch (ex) {
                                            var tag = res.data.tags.tag[count]._content.replace(/ /g, '')
                                            locationCardNew.tags[count] = tag;
                                        }
                                    }
                                    locationService.saveLocationCard(locationCardNew, function (data) {
                                                console.log(uploadCount++)
                                            })
                                }
                                else {
                                    $scope.photoNotFound = true;
                                }
                            }, function (status) {
                                $scope.apiError = true;
                                $scope.apiStatus = status;
                            });
                        }
                    },
                    function (status) {
                        $scope.apiError = true;
                        $scope.apiStatus = status;
                    }
                    );

                            }
                            else {
                                console.log("No photos available for, location: " + locationName + " ,place_id: " + locationCardNew.placeId)
                            }
                        }
                    },
                    function (status) {
                        $scope.apiError = true;
                        $scope.apiStatus = status;
                    }
                );
                        }
                        else {
                            console.log("duplicate location, locationName: " + locationName + " place_id: " + location.place_id)
                        }
                    })


                } else {
                    alert('Geocode was not successful for the following reason: ' + status);
                }
            });
        }
        var allLocations = [
  {
      "property1": "Paulls Valley",
      "property2": "Western Australia",
      "property3": "Australia",
      "": 0
  },
  {
      "property1": "Hunters Hill",
      "property2": "New South Wales",
      "property3": "Australia",
      "": 0
  },
  {
      "property1": "Newcastle",
      "property2": "New South Wales",
      "property3": "Australia",
      "": 0
  },
  {
      "property1": "Patonga",
      "property2": "New South Wales",
      "property3": "Australia",
      "": 0
  },
  {
      "property1": "Jarrahdale",
      "property2": "Western Australia",
      "property3": "Australia",
      "": 0
  },
  {
      "property1": "Yallingup",
      "property2": "Western Australia",
      "property3": "Australia",
      "": 0
  },
  {
      "property1": "Sydney",
      "property2": "New South Wales",
      "property3": "Australia",
      "": 0
  },
  {
      "property1": "Berowra Waters",
      "property2": "New South Wales",
      "property3": "Australia",
      "": 0
  },
  {
      "property1": "West Pymble",
      "property2": "New South Wales",
      "property3": "Australia",
      "": 0
  },
  {
      "property1": "Kalbarri National Park",
      "property2": "Western Australia",
      "property3": "Australia",
      "": 0
  },
  {
      "property1": "Greenmount",
      "property2": "Western Australia",
      "property3": "Australia",
      "": 0
  },
  {
      "property1": "Dardanup",
      "property2": "Western Australia",
      "property3": "Australia",
      "": 0
  },
  {
      "property1": "Sydney",
      "property2": "New South Wales",
      "property3": "Australia",
      "": 0
  },
  {
      "property1": "Wellington Forest",
      "property2": "Western Australia",
      "property3": "Australia",
      "": 0
  },
  {
      "property1": "Dwellingup",
      "property2": "Western Australia",
      "property3": "Australia",
      "": 0
  },
  {
      "property1": "Hillarys",
      "property2": "Western Australia",
      "property3": "Australia",
      "": 0
  },
  {
      "property1": "Cervantes",
      "property2": "Western Australia",
      "property3": "Australia",
      "": 0
  },
  {
      "property1": "Yanchep",
      "property2": "Western Australia",
      "property3": "Australia",
      "": 0
  },
  {
      "property1": "Charlestown",
      "property2": "New South Wales",
      "property3": "Australia",
      "": 0
  },
  {
      "property1": "Augusta",
      "property2": "Western Australia",
      "property3": "Australia",
      "": 0
  },
  {
      "property1": "Sydney",
      "property2": "New South Wales",
      "property3": "Australia",
      "": 0
  },
  {
      "property1": "Perth",
      "property2": "Western Australia",
      "property3": "Australia",
      "": 0
  },
  {
      "property1": "Coolgardie",
      "property2": "Western Australia",
      "property3": "Australia",
      "": 0
  },
  {
      "property1": "Kariong",
      "property2": "New South Wales",
      "property3": "Australia",
      "": 0
  },
  {
      "property1": "Tom Price",
      "property2": "Western Australia",
      "property3": "Australia",
      "": 0
  },
  {
      "property1": "Newcastle",
      "property2": "New South Wales",
      "property3": "Australia",
      "": 0
  },
  {
      "property1": "Kariong",
      "property2": "New South Wales",
      "property3": "Australia",
      "": 0
  },
  {
      "property1": "Teralba",
      "property2": "New South Wales",
      "property3": "Australia",
      "": 0
  },
  {
      "property1": "Somersby",
      "property2": "New South Wales",
      "property3": "Australia",
      "": 0
  },
  {
      "property1": "Wakefield",
      "property2": "New South Wales",
      "property3": "Australia",
      "": 0
  },
  {
      "property1": "Hornsby",
      "property2": "New South Wales",
      "property3": "Australia",
      "": 0
  },
  {
      "property1": "Dwellingup",
      "property2": "Western Australia",
      "property3": "Australia",
      "": 0
  },
  {
      "property1": "Purnululu",
      "property2": "Western Australia",
      "property3": "Australia",
      "": 0
  },
  {
      "property1": "Cedar Brush Creek",
      "property2": "New South Wales",
      "property3": "Australia",
      "": 0
  },
  {
      "property1": "Sydney",
      "property2": "New South Wales",
      "property3": "Australia",
      "": 0
  },
  {
      "property1": "Pemberton",
      "property2": "Western Australia",
      "property3": "Australia",
      "": 0
  },
  {
      "property1": "Milsons Point",
      "property2": "New South Wales",
      "property3": "Australia",
      "": 0
  },
  {
      "property1": "Watagan",
      "property2": "NSW",
      "property3": "Australia",
      "": 0
  },
  {
      "property1": "Wellington Mills",
      "property2": "Western Australia",
      "property3": "Australia",
      "": 0
  },
  {
      "property1": "Porongurup",
      "property2": "Western Australia",
      "property3": "Australia",
      "": 0
  },
  {
      "property1": "Crawley",
      "property2": "South Perth and Attadale",
      "property3": "Western Australia",
      "": "Australia"
  },
  {
      "property1": "Millfield",
      "property2": "New South Wales",
      "property3": "Australia",
      "": 0
  },
  {
      "property1": "Congewai",
      "property2": "New South Wales",
      "property3": "Australia",
      "": 0
  },
  {
      "property1": "Cape Le Grand",
      "property2": "Western Australia",
      "property3": "Australia",
      "": 0
  },
  {
      "property1": "Peats Ridge",
      "property2": "New South Wales",
      "property3": "Australia",
      "": 0
  },
  {
      "property1": "Perth",
      "property2": "WA",
      "property3": "Australia",
      "": 0
  },
  {
      "property1": "Millfield",
      "property2": "New South Wales",
      "property3": "Australia",
      "": 0
  },
  {
      "property1": "Stirling Range National Park",
      "property2": "Western Australia",
      "property3": "Australia",
      "": 0
  },
  {
      "property1": "Sawyers Valley",
      "property2": "Western Australia",
      "property3": "Australia",
      "": 0
  },
  {
      "property1": "Rockingham",
      "property2": "Western Australia",
      "property3": "Australia",
      "": 0
  },
  {
      "property1": "Coogee",
      "property2": "Western Australia",
      "property3": "Australia",
      "": 0
  },
  {
      "property1": "South Kalamunda",
      "property2": "Western Australia",
      "property3": "Australia",
      "": 0
  },
  {
      "property1": "Sydney",
      "property2": "New South Wales",
      "property3": "Australia",
      "": 0
  },
  {
      "property1": "Torndirrup",
      "property2": "Western Australia",
      "property3": "Australia",
      "": 0
  },
  {
      "property1": "Melbourne",
      "property2": "Victoria",
      "property3": "Australia",
      "": 0
  },
  {
      "property1": "Exmouth and Coral Bay",
      "property2": "Western Australia",
      "property3": "Australia",
      "": 0
  },
  {
      "property1": "Sydney",
      "property2": "New South Wales",
      "property3": "Australia",
      "": 0
  },
  {
      "property1": "Newcastle",
      "property2": "New South Wales",
      "property3": "Australia",
      "": 0
  },
  {
      "property1": "Melbourne",
      "property2": "Victoria",
      "property3": "Australia",
      "": 0
  },
  {
      "property1": "Rottnest Island",
      "property2": "Western Australia",
      "property3": "Australia",
      "": 0
  },
  {
      "property1": "Denham",
      "property2": "Western Australia",
      "property3": "Australia",
      "": 0
  },
  {
      "property1": "Cape Range National Park",
      "property2": "Western Australia",
      "property3": "Australia",
      "": 0
  },
  {
      "property1": "Sydney",
      "property2": "New South Wales",
      "property3": "Australia",
      "": 0
  },
  {
      "property1": "Jarrahdale",
      "property2": "Western Australia",
      "property3": "Australia",
      "": 0
  },
  {
      "property1": "Sydney",
      "property2": "New South Wales",
      "property3": "Australia",
      "": 0
  },
  {
      "property1": "Neranie",
      "property2": "NSW",
      "property3": "Australia",
      "": 0
  },
  {
      "property1": "Joondalup",
      "property2": "Western Australia",
      "property3": "Australia",
      "": 0
  },
  {
      "property1": "Coolup",
      "property2": "Western Australia",
      "property3": "Australia",
      "": 0
  },
  {
      "property1": "Bardon",
      "property2": "Queensland",
      "property3": "Australia",
      "": 0
  },
  {
      "property1": "Kariong",
      "property2": "New South Wales",
      "property3": "Australia",
      "": 0
  },
  {
      "property1": "Ningaloo Marine Park",
      "property2": "Western Australia",
      "property3": "Australia",
      "": 0
  },
  {
      "property1": "Kronkup",
      "property2": "Western Australia",
      "property3": "Australia",
      "": 0
  },
  {
      "property1": "Cape Range National Park",
      "property2": "Western Australia",
      "property3": "Australia",
      "": 0
  },
  {
      "property1": "Melbourne",
      "property2": "Victoria",
      "property3": "Australia",
      "": 0
  },
  {
      "property1": "Nerong",
      "property2": "New South Wales",
      "property3": "Australia",
      "": 0
  },
  {
      "property1": "Albany",
      "property2": "Western Australia",
      "property3": "Australia",
      "": 0
  },
  {
      "property1": "Rockingham",
      "property2": "Western Australia",
      "property3": "Australia",
      "": 0
  },
  {
      "property1": "Fitzroy Crossing",
      "property2": "Western Australia",
      "property3": "Australia",
      "": 0
  },
  {
      "property1": "Wollombi",
      "property2": "New South Wales",
      "property3": "Australia",
      "": 0
  },
  {
      "property1": "Rottnest Island",
      "property2": "Western Australia",
      "property3": "Australia",
      "": 0
  },
  {
      "property1": "Melbourne",
      "property2": "Victoria",
      "property3": "Australia",
      "": 0
  },
  {
      "property1": "Roebourne",
      "property2": "Western Australia",
      "property3": "Australia",
      "": 0
  },
  {
      "property1": "Cairns",
      "property2": "Queensland",
      "property3": "Australia",
      "": 0
  },
  {
      "property1": "Coomalbidgup",
      "property2": "Western Australia",
      "property3": "Australia",
      "": 0
  },
  {
      "property1": "Violet Hill",
      "property2": "NSW",
      "property3": "Australia",
      "": 0
  },
  {
      "property1": "Stretton",
      "property2": "Queensland",
      "property3": "Australia",
      "": 0
  },
  {
      "property1": "Sydney",
      "property2": "NSW",
      "property3": "Australia",
      "": 0
  },
  {
      "property1": "Walpole",
      "property2": "Western Australia",
      "property3": "Australia",
      "": 0
  },
  {
      "property1": "Johanna",
      "property2": "Victoria",
      "property3": "Australia",
      "": 0
  },
  {
      "property1": "Dirk Hartog Island",
      "property2": "Western Australia",
      "property3": "Australia",
      "": 0
  },
  {
      "property1": "Melbourne",
      "property2": "Victoria",
      "property3": "Australia",
      "": 0
  },
  {
      "property1": "The Gap",
      "property2": "Queensland",
      "property3": "Australia",
      "": 0
  },
  {
      "property1": "Wodonga",
      "property2": "Victoria",
      "property3": "Australia",
      "": 0
  },
  {
      "property1": "Coober Pedy",
      "property2": "South Australia",
      "property3": "Australia",
      "": 0
  },
  {
      "property1": "Western Australia",
      "property2": "Australia",
      "property3": 0,
      "": 0
  },
  {
      "property1": "Myall Lakes",
      "property2": "NSW",
      "property3": "Australia",
      "": 0
  },
  {
      "property1": "Mount Cotton",
      "property2": "Queensland",
      "property3": "Australia",
      "": 0
  },
  {
      "property1": "North West Cape",
      "property2": "Western Australia",
      "property3": "Australia",
      "": 0
  },
  {
      "property1": "Margaret River",
      "property2": "Western Australia",
      "property3": "Australia",
      "": 0
  },
  {
      "property1": "Urangan",
      "property2": "Queensland",
      "property3": "Australia",
      "": 0
  },
  {
      "property1": "Hamilton Island",
      "property2": "Queensland",
      "property3": "Australia",
      "": 0
  },
  {
      "property1": "Pemberton",
      "property2": "Western Australia",
      "property3": "Australia",
      "": 0
  },
  {
      "property1": "Karratha",
      "property2": "Western Australia",
      "property3": "Australia",
      "": 0
  },
  {
      "property1": "Wanneroo",
      "property2": "WA",
      "property3": "Australia",
      "": 0
  },
  {
      "property1": "Allanson",
      "property2": "Western Australia",
      "property3": "Australia",
      "": 0
  },
  {
      "property1": "Nornalup",
      "property2": "Western Australia",
      "property3": "Australia",
      "": 0
  },
  {
      "property1": "Sandpatch",
      "property2": "Western Australia",
      "property3": "Australia",
      "": 0
  },
  {
      "property1": "Western Australia",
      "property2": "Australia",
      "property3": 0,
      "": 0
  },
  {
      "property1": "Nornalup",
      "property2": "Western Australia",
      "property3": "Australia",
      "": 0
  },
  {
      "property1": "Sydney",
      "property2": "Australia",
      "property3": 0,
      "": 0
  },
  {
      "property1": "Tingledale",
      "property2": "Western Australia",
      "property3": "Australia",
      "": 0
  },
  {
      "property1": "Sorrento",
      "property2": "Australia",
      "property3": 0,
      "": 0
  },
  {
      "property1": "Derby",
      "property2": "Western Australia",
      "property3": "Australia",
      "": 0
  },
  {
      "property1": "Huskisson",
      "property2": "Australia",
      "property3": 0,
      "": 0
  },
  {
      "property1": "Palm Beach",
      "property2": "New South Wales",
      "property3": "Australia",
      "": 0
  },
  {
      "property1": "Daydream Island",
      "property2": "Queensland",
      "property3": "Australia",
      "": 0
  },
  {
      "property1": "Byron Bay",
      "property2": "New South Wales",
      "property3": "Australia",
      "": 0
  },
  {
      "property1": "Victoria",
      "property2": "Australia",
      "property3": 0,
      "": 0
  },
  {
      "property1": "Dwellingup",
      "property2": "Western Australia",
      "property3": "Australia",
      "": 0
  },
  {
      "property1": "Pemberton",
      "property2": "WA",
      "property3": "Australia",
      "": 0
  },
  {
      "property1": "Enoggera Reservoir",
      "property2": "Queensland",
      "property3": "Australia",
      "": 0
  },
  {
      "property1": "Wattleup",
      "property2": "Western Australia",
      "property3": "Australia",
      "": 0
  },
  {
      "property1": "Walpole",
      "property2": "Western Australia",
      "property3": "Australia",
      "": 0
  },
  {
      "property1": "Jamieson",
      "property2": "Victoria",
      "property3": "Australia",
      "": 0
  },
  {
      "property1": "Collaroy",
      "property2": "New South Wales",
      "property3": "Australia",
      "": 0
  },
  {
      "property1": "Cronulla",
      "property2": "New South Wales",
      "property3": "Australia",
      "": 0
  },
  {
      "property1": "Merredin",
      "property2": "Western Australia",
      "property3": "Australia",
      "": 0
  },
  {
      "property1": "Gilgai",
      "property2": "Western Australia",
      "property3": "Australia",
      "": 0
  },
  {
      "property1": "Ghooli",
      "property2": "Western Australia",
      "property3": "Australia",
      "": 0
  },
  {
      "property1": "Ulva",
      "property2": "Western Australia",
      "property3": "Australia",
      "": 0
  },
  {
      "property1": "Sydney",
      "property2": "New South Wales",
      "property3": "Australia",
      "": 0
  },
  {
      "property1": "Mount Nebo",
      "property2": "Queensland",
      "property3": "Australia",
      "": 0
  },
  {
      "property1": "Pokolbin",
      "property2": "NSW",
      "property3": "Australia",
      "": 0
  },
  {
      "property1": "Ashgrove",
      "property2": "Queensland",
      "property3": "Australia",
      "": 0
  },
  {
      "property1": "Hacketts Gully",
      "property2": "Western Australia",
      "property3": "Australia",
      "": 0
  },
  {
      "property1": "Denmark",
      "property2": "Western Australia",
      "property3": "Australia",
      "": 0
  },
  {
      "property1": "Conondale Range",
      "property2": "Queensland",
      "property3": "Australia",
      "": 0
  },
  {
      "property1": "Walpole Nornalup National Park",
      "property2": "WA",
      "property3": "Australia",
      "": 0
  },
  {
      "property1": "property1",
      "property2": 0,
      "property3": 0,
      "": 0
  },
  {
      "property1": "Bertrix",
      "property2": "Walloon Region",
      "property3": "Belgium",
      "": 0
  },
  {
      "property1": "Bruges",
      "property2": "Flanders",
      "property3": "Belgium",
      "": 0
  },
  {
      "property1": "Antwerp",
      "property2": "Belgium",
      "property3": 0,
      "": 0
  },
  {
      "property1": "Menen",
      "property2": "Belgium",
      "property3": 0,
      "": 0
  },
  {
      "property1": "Brussels",
      "property2": "Brussels Capital Region",
      "property3": "Belgium",
      "": 0
  },
  {
      "property1": "Brussels",
      "property2": "Belgium",
      "property3": 0,
      "": 0
  },
  {
      "property1": "Brussels",
      "property2": "Brussels Capital Region",
      "property3": "Belgium",
      "": 0
  },
  {
      "property1": "Brussels",
      "property2": "Brussels Capital Region",
      "property3": "Belgium",
      "": 0
  },
  {
      "property1": "Ixelles",
      "property2": "Brussels",
      "property3": "Belgium",
      "": 0
  },
  {
      "property1": "Brussels",
      "property2": "Walloon Region",
      "property3": "Belgium",
      "": 0
  },
  {
      "property1": "Brussels",
      "property2": "Brussels Capital Region",
      "property3": "Belgium",
      "": 0
  },
  {
      "property1": "Ghent",
      "property2": "Belgium",
      "property3": 0,
      "": 0
  },
  {
      "property1": "property1",
      "property2": 0,
      "property3": 0,
      "": 0
  },
  {
      "property1": "Berlin",
      "property2": "Berlin",
      "property3": "Germany",
      "": 0
  },
  {
      "property1": "Berlin",
      "property2": "Berlin",
      "property3": "Germany",
      "": 0
  },
  {
      "property1": "Berlin",
      "property2": "Berlin",
      "property3": "Germany",
      "": 0
  },
  {
      "property1": "Berlin",
      "property2": "Berlin",
      "property3": "Germany",
      "": 0
  },
  {
      "property1": "Berlin",
      "property2": "Berlin",
      "property3": "Germany",
      "": 0
  },
  {
      "property1": "Berlin",
      "property2": "Berlin",
      "property3": "Germany",
      "": 0
  },
  {
      "property1": "Berlin",
      "property2": "Germany",
      "property3": 0,
      "": 0
  },
  {
      "property1": "Ettal",
      "property2": "Bavaria",
      "property3": "Germany",
      "": 0
  },
  {
      "property1": "Hammersbach",
      "property2": "Bavaria",
      "property3": "Germany",
      "": 0
  },
  {
      "property1": "Garmisch Partenkirchen",
      "property2": "Bavaria",
      "property3": "Germany",
      "": 0
  },
  {
      "property1": "Berlin",
      "property2": "Germany",
      "property3": 0,
      "": 0
  },
  {
      "property1": "Munich",
      "property2": "Bavaria",
      "property3": "Germany",
      "": 0
  },
  {
      "property1": "Munich",
      "property2": "Bayern",
      "property3": "Germany",
      "": 0
  },
  {
      "property1": "Berlin",
      "property2": "Berlin",
      "property3": "Germany",
      "": 0
  },
  {
      "property1": "Berlin",
      "property2": "Berlin",
      "property3": "Germany",
      "": 0
  },
  {
      "property1": "Berlin",
      "property2": "Berlin",
      "property3": "Germany",
      "": 0
  },
  {
      "property1": "Frankfurt",
      "property2": "Hessen",
      "property3": "Germany",
      "": 0
  },
  {
      "property1": "Munich",
      "property2": "Bavaria",
      "property3": "Germany",
      "": 0
  },
  {
      "property1": "Munich",
      "property2": "Bavaria",
      "property3": "Germany",
      "": 0
  },
  {
      "property1": "Frankfurt",
      "property2": "Hessen",
      "property3": "Germany",
      "": 0
  },
  {
      "property1": "Frankfurt",
      "property2": "Hessen",
      "property3": "Germany",
      "": 0
  },
  {
      "property1": "Munich",
      "property2": "Bayern",
      "property3": "Germany",
      "": 0
  },
  {
      "property1": "Frankfurt",
      "property2": "Hessen",
      "property3": "Germany",
      "": 0
  },
  {
      "property1": "Berlin",
      "property2": "Germany",
      "property3": 0,
      "": 0
  },
  {
      "property1": "Lübbenau",
      "property2": "Brandenburg",
      "property3": "Germany",
      "": 0
  },
  {
      "property1": "Neuhausen",
      "property2": "Bavaria",
      "property3": "Germany",
      "": 0
  },
  {
      "property1": "Frankfurt",
      "property2": "Hesse",
      "property3": "Germany",
      "": 0
  },
  {
      "property1": "Munich",
      "property2": "Bavaria",
      "property3": "Germany",
      "": 0
  },
  {
      "property1": "Oberschleissheim",
      "property2": "Munich",
      "property3": "Germany",
      "": 0
  },
  {
      "property1": "Rothenburg",
      "property2": "Bavaria",
      "property3": "Germany",
      "": 0
  },
  {
      "property1": "Trier",
      "property2": "Germany",
      "property3": 0,
      "": 0
  },
  {
      "property1": "Munich",
      "property2": "Bavaria",
      "property3": "Germany",
      "": 0
  },
  {
      "property1": "Jachenau",
      "property2": "Bavaria",
      "property3": "Germany",
      "": 0
  },
  {
      "property1": "Mittenwald",
      "property2": "Bavaria",
      "property3": "Germany",
      "": 0
  },
  {
      "property1": "Prien",
      "property2": "Bayern",
      "property3": "Germany",
      "": 0
  },
  {
      "property1": "Rottach",
      "property2": "Bavaria",
      "property3": "Germany",
      "": 0
  },
  {
      "property1": "Unter den Linden",
      "property2": "Berlin",
      "property3": "Germany",
      "": 0
  },
  {
      "property1": "Berlin",
      "property2": "Berlin",
      "property3": "Germany",
      "": 0
  },
  {
      "property1": "Potsdam",
      "property2": "Brandenburg",
      "property3": "Germany",
      "": 0
  },
  {
      "property1": "Potsdam",
      "property2": "Brandenburg",
      "property3": "Germany",
      "": 0
  },
  {
      "property1": "Garmisch-Partenkirchen",
      "property2": "Bavaria",
      "property3": "Germany",
      "": 0
  },
  {
      "property1": "property1",
      "property2": 0,
      "property3": 0,
      "": 0
  },
  {
      "property1": "Hong Kong",
      "property2": "Hong Kong",
      "property3": 0,
      "": 0
  },
  {
      "property1": "Hong Kong",
      "property2": 0,
      "property3": 0,
      "": 0
  },
  {
      "property1": "Lamma Island",
      "property2": "Hong Kong",
      "property3": 0,
      "": 0
  },
  {
      "property1": "Pun Shan Tsuen",
      "property2": "Hong Kong",
      "property3": 0,
      "": 0
  },
  {
      "property1": "Hong Kong",
      "property2": "Hong Kong",
      "property3": 0,
      "": 0
  },
  {
      "property1": "Hong Kong",
      "property2": "Hong Kong",
      "property3": 0,
      "": 0
  },
  {
      "property1": "Tai Shui Hang",
      "property2": "Shatin",
      "property3": "Hong Kong",
      "": 0
  },
  {
      "property1": "Wan Chai",
      "property2": "Hong Kong",
      "property3": 0,
      "": 0
  },
  {
      "property1": "Central",
      "property2": "Hong Kong",
      "property3": 0,
      "": 0
  },
  {
      "property1": "Hong Kong",
      "property2": "Hong Kong",
      "property3": 0,
      "": 0
  },
  {
      "property1": "Hong Kong",
      "property2": "Hong Kong",
      "property3": 0,
      "": 0
  },
  {
      "property1": "Sha Tin",
      "property2": "Hong Kong",
      "property3": 0,
      "": 0
  },
  {
      "property1": "Discovery Bay",
      "property2": "Hong Kong",
      "property3": 0,
      "": 0
  },
  {
      "property1": "Sheung Miu Tin",
      "property2": "Hong Kong",
      "property3": 0,
      "": 0
  },
  {
      "property1": "property1",
      "property2": 0,
      "property3": 0,
      "": 0
  },
  {
      "property1": "Amsterdam",
      "property2": "Noord-Holland",
      "property3": "Netherlands",
      "": 0
  },
  {
      "property1": "Driebergen",
      "property2": "Utrecht",
      "property3": "Netherlands",
      "": 0
  },
  {
      "property1": "Amsterdam",
      "property2": "North Holland",
      "property3": "Netherlands",
      "": 0
  },
  {
      "property1": "Amsterdam",
      "property2": "Noord-Holland",
      "property3": "Netherlands",
      "": 0
  },
  {
      "property1": "Amsterdam",
      "property2": "Noord-Holland",
      "property3": "Netherlands",
      "": 0
  },
  {
      "property1": "Amerongen",
      "property2": "Utrecht",
      "property3": "Netherlands",
      "": 0
  },
  {
      "property1": "Amsterdam",
      "property2": "Noord-Holland",
      "property3": "Netherlands",
      "": 0
  },
  {
      "property1": "Amsterdam",
      "property2": "North Holland",
      "property3": "Netherlands",
      "": 0
  },
  {
      "property1": "Amerongen",
      "property2": "Utrecht",
      "property3": "Netherlands",
      "": 0
  },
  {
      "property1": "Amsterdam",
      "property2": "Noord-Holland",
      "property3": "Netherlands",
      "": 0
  },
  {
      "property1": "Amsterdam",
      "property2": "Netherlands",
      "property3": 0,
      "": 0
  },
  {
      "property1": "Amsterdam",
      "property2": "Noord-Holland",
      "property3": "Netherlands",
      "": 0
  },
  {
      "property1": "Hilversum",
      "property2": "North Holland",
      "property3": "Netherlands",
      "": 0
  },
  {
      "property1": "Hilversum",
      "property2": "North Holland",
      "property3": "Netherlands",
      "": 0
  },
  {
      "property1": "Hilversum",
      "property2": "North Holland",
      "property3": "Netherlands",
      "": 0
  },
  {
      "property1": "Weesp",
      "property2": "Noord-Holland",
      "property3": "Netherlands",
      "": 0
  },
  {
      "property1": "Naarden",
      "property2": "North Holland",
      "property3": "Netherlands",
      "": 0
  },
  {
      "property1": "Driebergen",
      "property2": "Utrecht",
      "property3": "Netherlands",
      "": 0
  },
  {
      "property1": "property2",
      "property2": 0,
      "property3": 0,
      "": 0
  },
  {
      "property1": "Granada",
      "property2": "Andalusia",
      "property3": "Spain",
      "": 0
  },
  {
      "property1": "Barcelona",
      "property2": "Catalunya",
      "property3": "Spain",
      "": 0
  },
  {
      "property1": "Barcelona",
      "property2": "Catalonia",
      "property3": "Spain",
      "": 0
  },
  {
      "property1": "Barcelona",
      "property2": "Catalonia",
      "property3": "Spain",
      "": 0
  },
  {
      "property1": "Barcelona",
      "property2": "Catalunya",
      "property3": "Spain",
      "": 0
  },
  {
      "property1": "Barcelona",
      "property2": "Spain",
      "property3": 0,
      "": 0
  },
  {
      "property1": "Espierba",
      "property2": "Aragon",
      "property3": "Spain",
      "": 0
  },
  {
      "property1": "Barcelona",
      "property2": "Catalunya",
      "property3": "Spain",
      "": 0
  },
  {
      "property1": "Madrid",
      "property2": "Region of Madrid",
      "property3": "Spain",
      "": 0
  },
  {
      "property1": "O Carballiño",
      "property2": "Galicia",
      "property3": "Spain",
      "": 0
  },
  {
      "property1": "Ciutat Vella",
      "property2": "Barcelona",
      "property3": "Catalunya",
      "": "Spain"
  },
  {
      "property1": "Vallromanes",
      "property2": "Cataluña",
      "property3": "Spain",
      "": 0
  },
  {
      "property1": "Aiguafreda",
      "property2": "Catalonia",
      "property3": "Spain",
      "": 0
  },
  {
      "property1": "Sella",
      "property2": "Valencia",
      "property3": "Spain",
      "": 0
  },
  {
      "property1": "Logrono",
      "property2": "Spain",
      "property3": 0,
      "": 0
  },
  {
      "property1": "Barcelona",
      "property2": "Catalonia",
      "property3": "Spain",
      "": 0
  },
  {
      "property1": "The Raval",
      "property2": "Catalonia",
      "property3": "Spain",
      "": 0
  },
  {
      "property1": "Lasarte-Oria",
      "property2": "Basque Country",
      "property3": "Spain",
      "": 0
  },
  {
      "property1": "Gistaín",
      "property2": "Aragon",
      "property3": "Spain",
      "": 0
  },
  {
      "property1": "Madrid",
      "property2": "Region of Madrid",
      "property3": "Spain",
      "": 0
  },
  {
      "property1": "Madrid",
      "property2": "Region of Madrid",
      "property3": "Spain",
      "": 0
  },
  {
      "property1": "Coirós",
      "property2": "Galicia",
      "property3": "Spain",
      "": 0
  },
  {
      "property1": "Madrid",
      "property2": "Spain",
      "property3": 0,
      "": 0
  },
  {
      "property1": "Pazos de Bordén",
      "property2": "Galicia",
      "property3": "Spain",
      "": 0
  },
  {
      "property1": "A Capela",
      "property2": "Galicia",
      "property3": "Spain",
      "": 0
  },
  {
      "property1": "Zestoa",
      "property2": "Basque Country",
      "property3": "Spain",
      "": 0
  },
  {
      "property1": "El Arrabal Torrelletas",
      "property2": "Catalonia",
      "property3": "Spain",
      "": 0
  },
  {
      "property1": "San Sebastián",
      "property2": "Spain",
      "property3": 0,
      "": 0
  },
  {
      "property1": "Seville",
      "property2": "Andalusia",
      "property3": "Spain",
      "": 0
  },
  {
      "property1": "Seville",
      "property2": "Andalusia",
      "property3": "Spain",
      "": 0
  },
  {
      "property1": "Seville",
      "property2": "Andalusia",
      "property3": "Spain",
      "": 0
  },
  {
      "property1": "Barcelona",
      "property2": "Cataluña",
      "property3": "Spain",
      "": 0
  },
  {
      "property1": "Sabadell",
      "property2": "Cataluña",
      "property3": "Spain",
      "": 0
  },
  {
      "property1": "Sella",
      "property2": "Valencia",
      "property3": "Spain",
      "": 0
  },
  {
      "property1": "Zestoa",
      "property2": "Basque Country",
      "property3": "Spain",
      "": 0
  },
  {
      "property1": "Seville",
      "property2": "Andalusia",
      "property3": "Spain",
      "": 0
  },
  {
      "property1": "Barcelona",
      "property2": "Spain",
      "property3": 0,
      "": 0
  },
  {
      "property1": "Seville",
      "property2": "Andalusia",
      "property3": "Spain",
      "": 0
  },
  {
      "property1": "Granada",
      "property2": "Andalusia",
      "property3": "Spain",
      "": 0
  },
  {
      "property1": "Madrid",
      "property2": "Spain",
      "property3": 0,
      "": 0
  },
  {
      "property1": "Madrid",
      "property2": "Spain",
      "property3": 0,
      "": 0
  },
  {
      "property1": "Noia",
      "property2": "Galicia",
      "property3": "Spain",
      "": 0
  },
  {
      "property1": "A Coruña",
      "property2": "Galicia",
      "property3": "Spain",
      "": 0
  },
  {
      "property1": "Viveiro",
      "property2": "Galicia",
      "property3": "Spain",
      "": 0
  },
  {
      "property1": "Muxia",
      "property2": "Galicia",
      "property3": "Spain",
      "": 0
  },
  {
      "property1": "Barcelona",
      "property2": "Catalunya",
      "property3": "Spain",
      "": 0
  },
  {
      "property1": "Meis",
      "property2": "Galicia",
      "property3": "Spain",
      "": 0
  },
  {
      "property1": "Gandia",
      "property2": "Valencia",
      "property3": "Spain",
      "": 0
  },
  {
      "property1": "Barcelona",
      "property2": "Catalonia",
      "property3": "Spain",
      "": 0
  },
  {
      "property1": "Sella",
      "property2": "Valencia",
      "property3": "Spain",
      "": 0
  },
  {
      "property1": "Santiago del Teide",
      "property2": "Canarias",
      "property3": "Spain",
      "": 0
  },
  {
      "property1": "Navarre",
      "property2": "Spain",
      "property3": 0,
      "": 0
  },
  {
      "property1": "property1",
      "property2": 0,
      "property3": 0,
      "": 0
  },
  {
      "property1": "Crans-Sur-Sierre",
      "property2": "Valais",
      "property3": "Switzerland",
      "": 0
  },
  {
      "property1": "Realp",
      "property2": "Uri",
      "property3": "Switzerland",
      "": 0
  },
  {
      "property1": "Champex",
      "property2": "Valais",
      "property3": "Switzerland",
      "": 0
  },
  {
      "property1": "Anniviers",
      "property2": "Valais",
      "property3": "Switzerland",
      "": 0
  },
  {
      "property1": "Grimentz",
      "property2": "Valais",
      "property3": "Switzerland",
      "": 0
  },
  {
      "property1": "Champex",
      "property2": "Valais",
      "property3": "Switzerland",
      "": 0
  },
  {
      "property1": "La Fouly",
      "property2": "Valais",
      "property3": "Switzerland",
      "": 0
  },
  {
      "property1": "Ferret",
      "property2": "Valais",
      "property3": "Switzerland",
      "": 0
  },
  {
      "property1": "Orsières",
      "property2": "Valais",
      "property3": "Switzerland",
      "": 0
  },
  {
      "property1": "Chalais",
      "property2": "Valais",
      "property3": "Switzerland",
      "": 0
  },
  {
      "property1": "Zinal",
      "property2": "Valais",
      "property3": "Switzerland",
      "": 0
  },
  {
      "property1": "Anniviers",
      "property2": "Valais",
      "property3": "Switzerland",
      "": 0
  },
  {
      "property1": "Orsières",
      "property2": "Valais",
      "property3": "Switzerland",
      "": 0
  },
  {
      "property1": "Chandolin",
      "property2": "Valais",
      "property3": "Switzerland",
      "": 0
  },
  {
      "property1": "Val des Dix",
      "property2": "Valais",
      "property3": "Switzerland",
      "": 0
  },
  {
      "property1": "Lauterbrunnen",
      "property2": "Bern",
      "property3": "Switzerland",
      "": 0
  },
  {
      "property1": "Chandolin",
      "property2": "Valais",
      "property3": "Switzerland",
      "": 0
  },
  {
      "property1": "Grindelwald",
      "property2": "Switzerland",
      "property3": 0,
      "": 0
  },
  {
      "property1": "Saas Almagel",
      "property2": "Wallis",
      "property3": "Valais",
      "": "Switzerland"
  },
  {
      "property1": "Grand Saint Bernard",
      "property2": "Valais",
      "property3": "Switzerland",
      "": 0
  },
  {
      "property1": "Chandolin",
      "property2": "Valais",
      "property3": "Switzerland",
      "": 0
  },
  {
      "property1": "Campo Blenio",
      "property2": "Ticino",
      "property3": "Switzerland",
      "": 0
  },
  {
      "property1": "property1",
      "property2": 0,
      "property3": 0,
      "": 0
  },
  {
      "property1": "Faversham",
      "property2": "England",
      "property3": "United Kingdom",
      "": 0
  },
  {
      "property1": "Appledore",
      "property2": "England",
      "property3": "United Kingdom",
      "": 0
  },
  {
      "property1": "Pluckley",
      "property2": "England",
      "property3": "United Kingdom",
      "": 0
  },
  {
      "property1": "Otford",
      "property2": "Kent",
      "property3": "United Kingdom",
      "": 0
  },
  {
      "property1": "Shipbourne",
      "property2": "Kent",
      "property3": "United Kingdom",
      "": 0
  },
  {
      "property1": "Harrietsham",
      "property2": "England",
      "property3": "United Kingdom",
      "": 0
  },
  {
      "property1": "Dover",
      "property2": "England",
      "property3": "United Kingdom",
      "": 0
  },
  {
      "property1": "Cumbria",
      "property2": "England",
      "property3": "United Kingdom",
      "": 0
  },
  {
      "property1": "Horsmonden",
      "property2": "England",
      "property3": "United Kingdom",
      "": 0
  },
  {
      "property1": "Chartham",
      "property2": "England",
      "property3": "United Kingdom",
      "": 0
  },
  {
      "property1": "Edenbridge",
      "property2": "Kent",
      "property3": "United Kingdom",
      "": 0
  },
  {
      "property1": "Sutton Valence",
      "property2": "England",
      "property3": "United Kingdom",
      "": 0
  },
  {
      "property1": "Leybourne",
      "property2": "Kent",
      "property3": "United Kingdom",
      "": 0
  },
  {
      "property1": "Meopham",
      "property2": "Kent",
      "property3": "United Kingdom",
      "": 0
  },
  {
      "property1": "Reculver",
      "property2": "England",
      "property3": "United Kingdom",
      "": 0
  },
  {
      "property1": "Wye",
      "property2": "England",
      "property3": "United Kingdom",
      "": 0
  },
  {
      "property1": "Lower Higham",
      "property2": "England",
      "property3": "United Kingdom",
      "": 0
  },
  {
      "property1": "Cranbrook",
      "property2": "England",
      "property3": "United Kingdom",
      "": 0
  },
  {
      "property1": "Ide Hill",
      "property2": "Kent",
      "property3": "United Kingdom",
      "": 0
  },
  {
      "property1": "Goodnestone",
      "property2": "England",
      "property3": "United Kingdom",
      "": 0
  },
  {
      "property1": "Dover",
      "property2": "England",
      "property3": "United Kingdom",
      "": 0
  },
  {
      "property1": "Elham",
      "property2": "England",
      "property3": "United Kingdom",
      "": 0
  },
  {
      "property1": "Tonbridge",
      "property2": "England",
      "property3": "United Kingdom",
      "": 0
  },
  {
      "property1": "Canterbury",
      "property2": "England",
      "property3": "United Kingdom",
      "": 0
  },
  {
      "property1": "London",
      "property2": "United Kingdom",
      "property3": 0,
      "": 0
  },
  {
      "property1": "London",
      "property2": "England",
      "property3": "United Kingdom",
      "": 0
  },
  {
      "property1": "East Malling",
      "property2": "England",
      "property3": "United Kingdom",
      "": 0
  },
  {
      "property1": "Bath",
      "property2": "England",
      "property3": "United Kingdom",
      "": 0
  },
  {
      "property1": "Boughton-under-Blean",
      "property2": "Kent",
      "property3": "United Kingdom",
      "": 0
  },
  {
      "property1": "Sevenoaks",
      "property2": "England",
      "property3": "United Kingdom",
      "": 0
  },
  {
      "property1": "Thrapston and Stanwick",
      "property2": "England",
      "property3": "United Kingdom",
      "": 0
  },
  {
      "property1": "London",
      "property2": "England",
      "property3": "United Kingdom",
      "": 0
  },
  {
      "property1": "Windermere",
      "property2": "England",
      "property3": "United Kingdom",
      "": 0
  },
  {
      "property1": "Marsden",
      "property2": "West Yorkshire",
      "property3": "United Kingdom",
      "": 0
  },
  {
      "property1": "Marsh Green",
      "property2": "Kent",
      "property3": "United Kingdom",
      "": 0
  },
  {
      "property1": "Patterdale",
      "property2": "England",
      "property3": "United Kingdom",
      "": 0
  },
  {
      "property1": "Hawkshead",
      "property2": "England",
      "property3": "United Kingdom",
      "": 0
  },
  {
      "property1": "Shoreditch",
      "property2": "England",
      "property3": "United Kingdom",
      "": 0
  },
  {
      "property1": "Claife",
      "property2": "England",
      "property3": "United Kingdom",
      "": 0
  },
  {
      "property1": "Bowness-on-Windermere",
      "property2": "England",
      "property3": "United Kingdom",
      "": 0
  },
  {
      "property1": "Central London",
      "property2": "England",
      "property3": "United Kingdom",
      "": 0
  },
  {
      "property1": "Cranbrook",
      "property2": "Kent",
      "property3": "United Kingdom",
      "": 0
  },
  {
      "property1": "Manchester City Centre",
      "property2": "England",
      "property3": "United Kingdom",
      "": 0
  },
  {
      "property1": "West Kent",
      "property2": "England",
      "property3": "United Kingdom",
      "": 0
  },
  {
      "property1": "Shipbourne",
      "property2": "Kent",
      "property3": "United Kingdom",
      "": 0
  },
  {
      "property1": "Ambleside",
      "property2": "England",
      "property3": "United Kingdom",
      "": 0
  },
  {
      "property1": "Cartmel",
      "property2": "England",
      "property3": "United Kingdom",
      "": 0
  },
  {
      "property1": "Islington and Hackney",
      "property2": "England",
      "property3": "United Kingdom",
      "": 0
  },
  {
      "property1": "Ambleside",
      "property2": "England",
      "property3": "United Kingdom",
      "": 0
  },
  {
      "property1": "Camden Town",
      "property2": "England",
      "property3": "United Kingdom",
      "": 0
  },
  {
      "property1": "Central London",
      "property2": "England",
      "property3": "United Kingdom",
      "": 0
  },
  {
      "property1": "London",
      "property2": "England",
      "property3": "United Kingdom",
      "": 0
  },
  {
      "property1": "London",
      "property2": "England",
      "property3": "United Kingdom",
      "": 0
  },
  {
      "property1": "Manchester",
      "property2": "United Kingdom",
      "property3": 0,
      "": 0
  },
  {
      "property1": "London",
      "property2": "England",
      "property3": "United Kingdom",
      "": 0
  },
  {
      "property1": "Guildford",
      "property2": "Surrey",
      "property3": "United Kingdom",
      "": 0
  },
  {
      "property1": "Hackney",
      "property2": "England",
      "property3": "United Kingdom",
      "": 0
  },
  {
      "property1": "Cofton Hackett",
      "property2": "England",
      "property3": "United Kingdom",
      "": 0
  },
  {
      "property1": "Buttermere",
      "property2": "Cumbria",
      "property3": "United Kingdom",
      "": 0
  },
  {
      "property1": "London",
      "property2": "England",
      "property3": "United Kingdom",
      "": 0
  },
  {
      "property1": "Manchester",
      "property2": "United Kingdom",
      "property3": 0,
      "": 0
  },
  {
      "property1": "Manchester",
      "property2": "England",
      "property3": "United Kingdom",
      "": 0
  },
  {
      "property1": "London",
      "property2": "England",
      "property3": "United Kingdom",
      "": 0
  },
  {
      "property1": "London",
      "property2": "England",
      "property3": "United Kingdom",
      "": 0
  },
  {
      "property1": "Cranbrook",
      "property2": "England",
      "property3": "United Kingdom",
      "": 0
  },
  {
      "property1": "Northern Ireland",
      "property2": "United Kingdom",
      "property3": 0,
      "": 0
  },
  {
      "property1": "Annalong",
      "property2": "United Kingdom",
      "property3": 0,
      "": 0
  },
  {
      "property1": "Farringdon",
      "property2": "England",
      "property3": "United Kingdom",
      "": 0
  },
  {
      "property1": "Edinburgh",
      "property2": "Scotland",
      "property3": "United Kingdom",
      "": 0
  },
  {
      "property1": "Salford",
      "property2": "United Kingdom",
      "property3": 0,
      "": 0
  },
  {
      "property1": "St Austell",
      "property2": "Cornwall",
      "property3": "United Kingdom",
      "": 0
  },
  {
      "property1": "London",
      "property2": "England",
      "property3": "United Kingdom",
      "": 0
  },
  {
      "property1": "Higher Broughton",
      "property2": "England",
      "property3": "United Kingdom",
      "": 0
  },
  {
      "property1": "Edinburgh",
      "property2": "Scotland",
      "property3": "United Kingdom",
      "": 0
  },
  {
      "property1": "Birmingham",
      "property2": "England",
      "property3": "United Kingdom",
      "": 0
  },
  {
      "property1": "Birmingham",
      "property2": "England",
      "property3": "United Kingdom",
      "": 0
  },
  {
      "property1": "Shoeburyness",
      "property2": "England",
      "property3": "United Kingdom",
      "": 0
  },
  {
      "property1": "Freshwater",
      "property2": "Isle of Wight",
      "property3": "United Kingdom",
      "": 0
  },
  {
      "property1": "England",
      "property2": "United Kingdom",
      "property3": 0,
      "": 0
  },
  {
      "property1": "Nottingham",
      "property2": "England",
      "property3": "United Kingdom",
      "": 0
  },
  {
      "property1": "Horton Kirby",
      "property2": "England",
      "property3": "United Kingdom",
      "": 0
  },
  {
      "property1": "Plymouth",
      "property2": "England",
      "property3": "United Kingdom",
      "": 0
  },
  {
      "property1": "Ennerdale",
      "property2": "England",
      "property3": "United Kingdom",
      "": 0
  },
  {
      "property1": "Belstone",
      "property2": "England",
      "property3": "United Kingdom",
      "": 0
  },
  {
      "property1": "Crundale",
      "property2": "England",
      "property3": "United Kingdom",
      "": 0
  },
  {
      "property1": "Fowey",
      "property2": "England",
      "property3": "United Kingdom",
      "": 0
  },
  {
      "property1": "Fowey",
      "property2": "England",
      "property3": "United Kingdom",
      "": 0
  },
  {
      "property1": "Mevagissey",
      "property2": "Cornwall",
      "property3": "United Kingdom",
      "": 0
  },
  {
      "property1": "Grasmere",
      "property2": "England",
      "property3": "United Kingdom",
      "": 0
  },
  {
      "property1": "Canterbury",
      "property2": "England",
      "property3": "United Kingdom",
      "": 0
  },
  {
      "property1": "Ambleside",
      "property2": "England",
      "property3": "United Kingdom",
      "": 0
  },
  {
      "property1": "Kent",
      "property2": "East Sussex Coast",
      "property3": "South East",
      "": "United Kingdom"
  },
  {
      "property1": "Isle of Wight",
      "property2": "England",
      "property3": "United Kingdom",
      "": 0
  },
  {
      "property1": "Selling",
      "property2": "Kent",
      "property3": "United Kingdom",
      "": 0
  },
  {
      "property1": "Shorne",
      "property2": "England",
      "property3": "United Kingdom",
      "": 0
  },
  {
      "property1": "England",
      "property2": "United Kingdom",
      "property3": 0,
      "": 0
  },
  {
      "property1": "Rochester",
      "property2": "England",
      "property3": "United Kingdom",
      "": 0
  },
  {
      "property1": "Sheerness",
      "property2": "Kent",
      "property3": "United Kingdom",
      "": 0
  },
  {
      "property1": "Meopham",
      "property2": "Kent",
      "property3": "United Kingdom",
      "": 0
  },
  {
      "property1": "Fordwich",
      "property2": "Kent",
      "property3": "United Kingdom",
      "": 0
  },
  {
      "property1": "Leysdown-on-Sea",
      "property2": "England",
      "property3": "United Kingdom",
      "": 0
  },
  {
      "property1": "Sevenoaks",
      "property2": "England",
      "property3": "United Kingdom",
      "": 0
  },
  {
      "property1": "Uxbridge",
      "property2": "England",
      "property3": "United Kingdom",
      "": 0
  },
  {
      "property1": "Oare",
      "property2": "England",
      "property3": "United Kingdom",
      "": 0
  },
  {
      "property1": "Yarmouth",
      "property2": "Isle of Wight",
      "property3": "United Kingdom",
      "": 0
  },
  {
      "property1": "Arnside",
      "property2": "Lancashire/Cumbria",
      "property3": "United Kingdom",
      "": 0
  },
  {
      "property1": "Keswick",
      "property2": "Cumbria",
      "property3": "United Kingdom",
      "": 0
  },
  {
      "property1": "Grasmere",
      "property2": "Cumbria",
      "property3": "United Kingdom",
      "": 0
  },
  {
      "property1": "Chorley",
      "property2": "United Kingdom",
      "property3": 0,
      "": 0
  },
  {
      "property1": "Great Langdale",
      "property2": "Cumbria",
      "property3": "United Kingdom",
      "": 0
  },
  {
      "property1": "Faversham",
      "property2": "Kent",
      "property3": "United Kingdom",
      "": 0
  },
  {
      "property1": "Royal Tunbridge Wells",
      "property2": "Kent",
      "property3": "United Kingdom",
      "": 0
  },
  {
      "property1": "Hamstreet",
      "property2": "United Kingdom",
      "property3": 0,
      "": 0
  },
  {
      "property1": "Sandwich",
      "property2": "Kent",
      "property3": "United Kingdom",
      "": 0
  },
  {
      "property1": "Maidstone",
      "property2": "Kent",
      "property3": "United Kingdom",
      "": 0
  },
  {
      "property1": "Higham",
      "property2": "Kent",
      "property3": "United Kingdom",
      "": 0
  },
  {
      "property1": "Truro",
      "property2": "England",
      "property3": "United Kingdom",
      "": 0
  },
  {
      "property1": "Par",
      "property2": "United Kingdom",
      "property3": 0,
      "": 0
  },
  {
      "property1": "Rochester",
      "property2": "Medway",
      "property3": "United Kingdom",
      "": 0
  },
  {
      "property1": "Mottistone",
      "property2": "Isle of Wight",
      "property3": "United Kingdom",
      "": 0
  },
  {
      "property1": "Shorwell",
      "property2": "Isle of Wight",
      "property3": "United Kingdom",
      "": 0
  },
  {
      "property1": "Newtown",
      "property2": "Isle of Wight",
      "property3": "United Kingdom",
      "": 0
  },
  {
      "property1": "Buttermere",
      "property2": "England",
      "property3": "United Kingdom",
      "": 0
  },
  {
      "property1": "Calbourne",
      "property2": "Isle of Wight",
      "property3": "United Kingdom",
      "": 0
  },
  {
      "property1": "Yarmouth",
      "property2": "Isle of Wight",
      "property3": "United Kingdom",
      "": 0
  },
  {
      "property1": "Rock",
      "property2": "Cornwall",
      "property3": "United Kingdom",
      "": 0
  },
  {
      "property1": "Brook",
      "property2": "Isle of Wight",
      "property3": "United Kingdom",
      "": 0
  },
  {
      "property1": "Newbridge",
      "property2": "England",
      "property3": "United Kingdom",
      "": 0
  },
  {
      "property1": "Edinburgh",
      "property2": "Scotland",
      "property3": "United Kingdom",
      "": 0
  },
  {
      "property1": "Westerham",
      "property2": "England",
      "property3": "United Kingdom",
      "": 0
  },
  {
      "property1": "Cumbria",
      "property2": "England",
      "property3": "United Kingdom",
      "": 0
  },
  {
      "property1": "Egerton",
      "property2": "Kent",
      "property3": "United Kingdom",
      "": 0
  },
  {
      "property1": "Linton",
      "property2": "Kent",
      "property3": "United Kingdom",
      "": 0
  },
  {
      "property1": "Tonbridge",
      "property2": "England",
      "property3": "United Kingdom",
      "": 0
  },
  {
      "property1": "Kent",
      "property2": "Kent",
      "property3": "United Kingdom",
      "": 0
  },
  {
      "property1": "Eynsford",
      "property2": "Kent",
      "property3": "United Kingdom",
      "": 0
  },
  {
      "property1": "Eynsford",
      "property2": "England",
      "property3": "United Kingdom",
      "": 0
  },
  {
      "property1": "Ballycastle",
      "property2": "N Ireland",
      "property3": "United Kingdom",
      "": 0
  },
  {
      "property1": "Maidstone",
      "property2": "England",
      "property3": "United Kingdom",
      "": 0
  },
  {
      "property1": "Yalding",
      "property2": "Kent",
      "property3": "United Kingdom",
      "": 0
  },
  {
      "property1": "Birmingham",
      "property2": "England",
      "property3": "United Kingdom",
      "": 0
  },
  {
      "property1": "Ilkley",
      "property2": "England",
      "property3": "United Kingdom",
      "": 0
  },
  {
      "property1": "Reculver / Swalecliffe",
      "property2": "Kent",
      "property3": "United Kingdom",
      "": 0
  },
  {
      "property1": "Trottiscliffe",
      "property2": "Kent",
      "property3": "United Kingdom",
      "": 0
  },
  {
      "property1": "Trottiscliffe",
      "property2": "Kent",
      "property3": "United Kingdom",
      "": 0
  },
  {
      "property1": "Paddock Wood",
      "property2": "Kent",
      "property3": "United Kingdom",
      "": 0
  },
  {
      "property1": "Wateringbury",
      "property2": "Kent",
      "property3": "United Kingdom",
      "": 0
  },
  {
      "property1": "Strood",
      "property2": "Kent",
      "property3": "United Kingdom",
      "": 0
  },
  {
      "property1": "Keswick",
      "property2": "England",
      "property3": "United Kingdom",
      "": 0
  },
  {
      "property1": "Princetown",
      "property2": "England",
      "property3": "United Kingdom",
      "": 0
  },
  {
      "property1": "Aylesford",
      "property2": "England",
      "property3": "United Kingdom",
      "": 0
  },
  {
      "property1": "Halling",
      "property2": "England",
      "property3": "United Kingdom",
      "": 0
  },
  {
      "property1": "Beltring",
      "property2": "England",
      "property3": "United Kingdom",
      "": 0
  },
  {
      "property1": "New Hythe",
      "property2": "England",
      "property3": "United Kingdom",
      "": 0
  },
  {
      "property1": "Cuxton",
      "property2": "England",
      "property3": "United Kingdom",
      "": 0
  },
  {
      "property1": "Snodland",
      "property2": "Kent",
      "property3": "United Kingdom",
      "": 0
  },
  {
      "property1": "Hythe",
      "property2": "England",
      "property3": "United Kingdom",
      "": 0
  },
  {
      "property1": "Cranbrook",
      "property2": "England",
      "property3": "United Kingdom",
      "": 0
  },
  {
      "property1": "Cranbrook",
      "property2": "England",
      "property3": "United Kingdom",
      "": 0
  },
  {
      "property1": "Cranbrook",
      "property2": "England",
      "property3": "United Kingdom",
      "": 0
  },
  {
      "property1": "Cranbrook",
      "property2": "Kent",
      "property3": "United Kingdom",
      "": 0
  },
  {
      "property1": "Sheldwich Lees",
      "property2": "Kent",
      "property3": "United Kingdom",
      "": 0
  },
  {
      "property1": "Faversham",
      "property2": "Kent",
      "property3": "United Kingdom",
      "": 0
  },
  {
      "property1": "Faversham",
      "property2": "England",
      "property3": "United Kingdom",
      "": 0
  },
  {
      "property1": "Teynham",
      "property2": "England",
      "property3": "United Kingdom",
      "": 0
  },
  {
      "property1": "Newnham",
      "property2": "England",
      "property3": "United Kingdom",
      "": 0
  },
  {
      "property1": "Faversham",
      "property2": "Kent",
      "property3": "United Kingdom",
      "": 0
  },
  {
      "property1": "Stone-in-Oxney",
      "property2": "Kent",
      "property3": "United Kingdom",
      "": 0
  },
  {
      "property1": "Saint Margaret's at Cliffe",
      "property2": "England",
      "property3": "United Kingdom",
      "": 0
  },
  {
      "property1": "Lympne",
      "property2": "England",
      "property3": "United Kingdom",
      "": 0
  },
  {
      "property1": "Grove Ferry",
      "property2": "England",
      "property3": "United Kingdom",
      "": 0
  },
  {
      "property1": "Ashford to Tunbridge Wells",
      "property2": "England",
      "property3": "United Kingdom",
      "": 0
  },
  {
      "property1": "Otford",
      "property2": "England",
      "property3": "United Kingdom",
      "": 0
  },
  {
      "property1": "White Horse Woods",
      "property2": "England",
      "property3": "United Kingdom",
      "": 0
  },
  {
      "property1": "Minnis Bay to Reculver Country Park",
      "property2": "England",
      "property3": "United Kingdom",
      "": 0
  },
  {
      "property1": "Lydd",
      "property2": "England",
      "property3": "United Kingdom",
      "": 0
  },
  {
      "property1": "Samphire Hoe Country Park",
      "property2": "Kent",
      "property3": "United Kingdom",
      "": 0
  },
  {
      "property1": "Chartham",
      "property2": "England",
      "property3": "United Kingdom",
      "": 0
  },
  {
      "property1": "Ramsgate",
      "property2": "Kent",
      "property3": "United Kingdom",
      "": 0
  },
  {
      "property1": "Ramsgate",
      "property2": "England",
      "property3": "United Kingdom",
      "": 0
  },
  {
      "property1": "Ramsgate",
      "property2": "England",
      "property3": "United Kingdom",
      "": 0
  },
  {
      "property1": "Hadlow",
      "property2": "England",
      "property3": "United Kingdom",
      "": 0
  },
  {
      "property1": "Teston",
      "property2": "Kent",
      "property3": "United Kingdom",
      "": 0
  },
  {
      "property1": "Yalding",
      "property2": "Kent",
      "property3": "United Kingdom",
      "": 0
  },
  {
      "property1": "Pembury",
      "property2": "Kent",
      "property3": "United Kingdom",
      "": 0
  },
  {
      "property1": "Tunbridge Wells",
      "property2": "Kent",
      "property3": "United Kingdom",
      "": 0
  },
  {
      "property1": "Royal Tunbridge Wells",
      "property2": "Kent",
      "property3": "United Kingdom",
      "": 0
  }
]

    };
})();