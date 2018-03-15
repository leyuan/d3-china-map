var map;
var service;
var places = {};
var markers = [];
var infowindow;
var currentLocation;

google.maps.Map.prototype.clearMarkers = function() {
    for(var i=0; i < this.markers.length; i++){
        this.markers[i].setMap(null);
    }
    this.markers = new Array();
};

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(initMap);
    } else {
        x.innerHTML = "Geolocation is not supported by this browser.";
    }
}

function addMarker(marker) {
    var googleMarker = new google.maps.Marker(marker);
    markers.push(googleMarker);
}

function removeMarker(marker) {
    if(!marker) { // => remove all
        markers.map(marker => {
            marker.setMap(null);
        });
    }
}

function showPlaces(node)
{
  removeMarker();
  if (node.name === 'all')
  {
    Object.keys(places).map(cate => {
            places[cate].map(place => {
                addMarker(place.marker)
            });
        });
    } else if (places.hasOwnProperty(node.name)) { // => node is category
        var cate = node.name;

        places[cate].map(place => {
            addMarker(place.marker)
        });
    } else if (places.hasOwnProperty(node.parentNode.name)) { // => node is rating
        var rate = parseFloat(node.name);
        var cateName = node.parentNode.name;
        var infowindow = new google.maps.InfoWindow();

        places[cateName].map(place => {
            if (place.rating === rate) {
                service.getDetails({
                    placeId: place.place_id
                }, function (place, status) {
                    if (status === google.maps.places.PlacesServiceStatus.OK) {
                        var marker = new google.maps.Marker({
                            map: map,
                            position: place.geometry.location
                        });
                      console.log(place.geometry.location);
                        google.maps.event.addListener(marker, 'click', function () {
                            infowindow.setContent('<div><strong>' + place.name + '</strong><br><br>' +
                                //'Place ID: ' + place.place_id + '<br>' +
                                '<img src=' + place.icon + '>' + '<br>' +
                                'Opening Now:&nbsp' + place.opening_hours.open_now + '<br>' +
                                'Phone Number:&nbsp' + place.formatted_phone_number + '<br>' +
                                'Address:&nbsp' + place.formatted_address + '<br>' +
                                //'Website:&nbsp' + place.website +
                                                  '</div>');
                            infowindow.open(map, this);
                        });

                      google.maps.event.addListener(marker, "dblclick", function (e) {

                        getDirection(place.geometry.location);
                        console.log("Double Clicked??");
            });
                    }
                });
            }
        });
    }
}

function callback(cate, results, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
        var names = [];
        var ratings = [];
        var photos = [];

        // save markers and places
        results.map(place => {
            names.push(place.name);
            ratings.push(place.rating);
            place.marker = {
                position: place.geometry.location,
                map: map
            };

            if (Array.isArray(places[cate])) {
                places[cate].push(place);
            } else {
                places[cate] = [place];
            }
        });

        // render charts
        data[0].children.map(child => {
            if (child.name == cate) {
                for (var j = 0; j < maxRestaurantsToDisplay; j++) {
                    var item = {
                        name:  String(ratings[j]).concat(""),
                        children: [{name: names[j]}],
                    };
                    child.children.push(item);
                }
            }
        });

        if (option && typeof option === "object") {
            updateChartData(data);
            updateColor();
            myChart.setOption(option, true);
        }
    }
}

function initMap(position) {
    var location = {
        lat: 53.5232189,
        lng: -113.5285073
    }; // u of a
    if (position) {
        location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
        };
    }
    currentLocation = location; // Initialize current location for direction service.

    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 15,
        center: location
    });
    var marker = new google.maps.Marker({
        position: location,
        map: map
    });

    // Send search request for each restaurant category.
    for (var i = 0; i < categories.length; i++) {
        var textSearchReq = {
            location: new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
            radius: '200',
            query: categories[i],
            type: ['restaurant'],
        };

        service = new google.maps.places.PlacesService(map);
        service.textSearch(textSearchReq, callback.bind(this, categories[i]));
    }
}

function updateChartData(newData) {
    option.series.data = newData;
}
function getDirection(destination)
{
  var directionsService = new google.maps.DirectionsService();
  var directionsDisplay = new google.maps.DirectionsRenderer();

  //directionDisplay.setMap(null);
  directionsDisplay.setMap(map);
  directionsDisplay.setPanel(document.getElementById('panel'));

  var request = {
    origin: currentLocation,
    destination: destination,
    travelMode: google.maps.DirectionsTravelMode.DRIVING};

  directionsService.route(request, function(response, status) {
    if (status == google.maps.DirectionsStatus.OK) {
      directionsDisplay.setDirections(response);}});
}

