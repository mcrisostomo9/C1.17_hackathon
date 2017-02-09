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
        update_bars();
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



// Variables
var bars_listed = [];
var bars_added = [];
var geocoder = new google.maps.Geocoder();
var coordinates;


/**
 * We need a search function that when licked, the search function will load all necessary functions for Page 2
 * to start
 */


function get_coordinates() {
    var input_address = $('.search_bar').val();
    var address = {
        address: input_address
    };

    geocoder.geocode(address, function(result, status){
        if (status === 'OK') {
            coordinates = result[0].geometry.location;
            latitude = coordinates.lat();
            longitude = coordinates.lng();
            zoom = 13;
            initMap();
        }
        else {
            console.log('geocoding not working')
        }
    });
}

//create DOM elements for page 2
function bars_to_dom(addBarObj) {


    // TODO this is being called twice for some reason
    console.log('bars to dom init');

    var bar_container = $('<div>').addClass('media');
    var bar_image_container = $('<div>').addClass('media-left media-middle');
    var bar_image = $('<img>').addClass('media-object');

    var bar_info_container = $('<div>').addClass('media-body');
    var bar_name = $('<h4>').text(addBarObj.name).addClass('media-heading');

    var bar_info_list = $('<div>').addClass('col-md-8 pull-left');
    var address = $('<h5>').text('Address: ' + addBarObj.vicinity);//TODO need span with in hv?
    var hours = $('<h5>').text('Hours: ');//TODO need span with in hv?
    if (addBarObj.price_level === undefined){

    }
    var price = $('<h5>').text('Price Level: ' + addBarObj.price_level);//TODO need span with in hv?
    var reviews = $('<h5>').text('Reviews: ' + addBarObj.rating);//TODO need span with in hv?

    var add_button = $('<button>').text('Add').addClass('btn btn-success navbar-btn');

    bar_info_list.append(address, hours, price, reviews);
    bar_info_container.append(bar_name, bar_info_list, add_button);
    bar_image_container.append(bar_image);

    bar_container.append(bar_image_container, bar_info_container);

    $('.bar-main-container').append(bar_container);
}


/**
 * function will loop through a list and will show up on the (left or right) of the screen with all nearby bars.
 */

function show_bar_list() {
    var bl = bars_listed[i];
    var image  =  bl.image;
    var bar_name = bl.name;
    var hours = bl.hours;
    var address = bl.address;
    var phone_number = bl.phone;
    var rating = bl.rating;
    var pricing = bl.pricing;
    for (i = 0; i < bars_listed.length; i++){

    }

}

/**
 * function will update bars that will be posted on page 2 when loaded, bar removed from list, or added to list.
 */
function update_bars() {
    console.log('update_bars has been loaded. ');
    $('.bar-main-container').html('');
    for (var i =0; i < bar_array.length; i++){
        bars_to_dom(bar_array[i])
    }
}

/**
 * function will remove any bars that have been added to the users to-do list once the (RED) button is clicked
 */

function remove_a_bar() {
    console.log('remoce_a_bar has been loaded')
}


/**
 *  function will add any bars that have been added to the users to-do list once the (BLUE) button is clicked.
 */
function add_bar_to_list() {

}




