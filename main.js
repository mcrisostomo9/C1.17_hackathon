var map;
var info_window;
var bar_array = [];
var input = $('#location_input');
var radius = 8047;
var zoom  = 4;
var latitude = 39;
var longitude = -97;
var current_place;

$(document).ready(function() {
    event_handlers();
});


function event_handlers() {
    $('#map_canvas').on('click', '.place_add_button', function() {
        console.log('current place', current_place);
        bars_added.push(current_place);
        console.log('current bar array', bars_added);
    });
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
    console.log(place);
    current_place = place;
    var content =
        '<div class="place_title">' + place.name + '</div>' +
        '<div class="place_address">' + place.vicinity + '</div>' +
        '<div class="place_review">Rating: ' + place.rating + '</div>' +
        '<div class="place_button_div"><button class="place_add_button">Add</button></div>';
    return content;
}



google.maps.event.addDomListener(window, 'load', initMap);





