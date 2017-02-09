var map;
var info_window;
var bar_array = [];
var input = $('#location_input');
var radius = 8047;
var zoom  = 4;
var latitude = 39;
var longitude = -97;
var current_place = {};
var route_path = [];

$(document).ready(function() {
    event_handlers();
});


function event_handlers() {
    $('#map_canvas').on('click', '.place_add_button', add_bar_to_array);
}

function add_bar_to_array() {
    // if statement blocks ability to add same bar twice in a row
    if (current_place == bars_added[bars_added.length - 1]) {
        return;
    }
    bars_added.push(current_place);
    var current_lat = current_place.geometry.location.lat();
    var current_lng = current_place.geometry.location.lng();
    var current_place_coordinates = new google.maps.LatLng(current_lat, current_lng);
    route_path.push(current_place_coordinates);
    console.log(route_path);
    if (route_path.length > 1) {
        for (var i = route_path.length-1; i < route_path.length; i++) {
            create_route(route_path[i-1], route_path[i])
        }
    }
}


function initMap() {
    var center = {lat: latitude, lng: longitude};
    map = new google.maps.Map(document.getElementById('map_canvas'), {
        center: center,
        zoom: zoom
    });

    var request = {
        location: center,
        radius: radius,
        types: ['bar']
    };

    info_window = new google.maps.InfoWindow();

    var service = new google.maps.places.PlacesService(map);

    service.nearbySearch(request, callback);

    function callback(results, status) {
        bar_array = results;
        if (status == google.maps.places.PlacesServiceStatus.OK) {
            for (var i=0; i < results.length; i++) {
                createMarker(results[i]);
            }
        }
    }

    function createMarker(place) {
        var placeLoc = place.geometry.location;
        var marker = new google.maps.Marker({
            map: map,
            position: placeLoc,
            icon: 'http://maps.google.com/mapfiles/kml/pal2/icon19.png'
        });

        google.maps.event.addListener(marker, 'click', function() {
            info_window.setContent(bar_info_window(place));
            info_window.open(map, this);
        })
    }
}

function bar_info_window(place) {
    current_place = place;
    var content =
        '<div class="place_title">' + place.name + '</div>' +
        '<div class="place_address">' + place.vicinity + '</div>' +
        '<div class="place_review">Rating: ' + place.rating + '</div>' +
        '<div class="place_button_div"><button class="place_add_button">Add</button></div>';
    return content;
}


// TODO add multiple travel modes = walking, driving, etc
function create_route(origin, destination) {
    console.log('create route called');
    var directions_service = new google.maps.DirectionsService();
    var directions_renderer = new google.maps.DirectionsRenderer({
        preserveViewport : true,
        map: map,
        suppressMarkers: true

    });
    var request = {
        origin: origin,
        destination: destination,
        travelMode: 'DRIVING'
    };
    directions_service.route(request, function(response, status) {
        if (status == 'OK') {
            directions_renderer.setDirections(response);
        }
    })
}



google.maps.event.addDomListener(window, 'load', initMap);

//////////////////////////////////////This code is for the FB share button.
window.fbAsyncInit = function() {
    FB.init({
        appId      : 'your-app-id',
        xfbml      : true,
        version    : 'v2.8'
    });
    FB.AppEvents.logPageView();
};

(function(d, s, id){
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {return;}
    js = d.createElement(s); js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

/////////////////////////////////////////////////





