var map; // map object
var info_window; // info displayed when marker is clicked
var bar_array = []; // results are stored from search
var radius = 8047; // initial radius
var zoom  = 4; // initial zoom
var latitude = 39; // initial latitude displayed when page loads
var longitude = -97; // initial longitude displayed when page loads
var current_place = {}; // used to store the place object you clicked on when viewing an info_window. current_place will be stored in our array if we click add
var geocoder = new google.maps.Geocoder(); //  creates geocoder object, used to convert locations to lat/lng
var coordinates; // stores location information for address that was input into search bar
var bars_listed = [];
var bars_added = [];
var input;
var directions_renderer;


google.maps.event.addDomListener(window, 'load', initMap); //loads map after window has been loaded

$(document).ready(function() {
    event_handlers();
    $('.bar-main-container').on('click', '.btn-success', function(){
        console.log(this);
        current_place = bar_array.businesses[this.id];
        add_bar_to_array();
        update_add_to_list_button(this);


        $('.delete-btn').click(remove_a_bar);

    });


    $('#lnkPrint').click(function() {
        window.print();
    });

    input = document.getElementById('location_search');
    var autocomplete = new google.maps.places.Autocomplete(input);

});


function event_handlers() {
    $('#map_canvas').on('click', '.place_add_button', function() {
        info_window.close();
        add_bar_to_array();
        $('.delete-btn').click(remove_a_bar);
    });

    // click handler for add button on info_window
    $('.search_button').click(get_coordinates);
    $('#clear_list').click(clear_list);
    $('#location_search').on('keypress', function(e) {
        if (e.which === 13) {
            get_coordinates();
        }
    })

}


// takes info input into search field and returns lat/lng. info is then sent to initialize the map.
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
            zoom = 12;
            pull_data_from_yelp($('.search_bar').val());
            setTimeout(function() {
                process_businesses(bar_array);
                update_bars()
            }, 1500)


        }
        else {
            console.log('geocoding not working')

        }
    });
}

// adds bar to bars_added array when "add" is clicked on info_window.
function add_bar_to_array() {
    // if statement blocks ability to add same bar twice in a row
    if (current_place == bars_added[bars_added.length - 1]) {
        return;
    }
    bars_added.push(current_place);

    update_modal(current_place);

    //  if statement used to plot route between last two items in route_path array
    if (bars_added.length > 1) {
        if (bars_added.length > 2) {
            directions_renderer.setMap(null);
        }
        create_route(bars_added)
    }
}

// generates map using center, radius, lat, lng
function initMap() {
    var center = {lat: latitude, lng: longitude};
    map = new google.maps.Map(document.getElementById('map_canvas'), {
        center: center,
        zoom: zoom,
        radius: radius
    });

    info_window = new google.maps.InfoWindow(); // info_window displays popup company info when clicking on marker. specific info is defined below


}


// function called to create HTML for bar_info_window
function bar_info_window(place) {
    current_place = place;
    var content =
        '<div class="place_title">' + place.name + '</div>' +
        '<div class="place_address">' + place.location.address + '</div>' +
        '<div class="place_phone">' + place.display_phone + '</div>' +
        '<div class="place_rating">Rating: ' + place.rating + '</div>' +
        '<div class="place_review">' + place.review_count + ' Reviews</div>' +
        '<div class="place_button_div"><button class="place_add_button btn btn-success">Add</button></div>';
    return content;
}


// TODO add multiple travel modes = walking, driving, etc
// function used to create route and render it on the map
function create_route(bars_added) {
    console.log('create route called');
    var directions_service = new google.maps.DirectionsService();
    directions_renderer = new google.maps.DirectionsRenderer({
        //preserveViewport : true, // disables zoom in when creating route
        map: map,
        suppressMarkers: true // removes markers that are created on top of current markers when plotting route.
    });


    var start_lat = bars_added[0].location.coordinate.latitude;
    var start_lng = bars_added[0].location.coordinate.longitude;
    var start_coordinates = new google.maps.LatLng(start_lat, start_lng);

    var end_lat = bars_added[bars_added.length-1].location.coordinate.latitude;
    var end_lng = bars_added[bars_added.length-1].location.coordinate.longitude;
    var end_coordinates = new google.maps.LatLng(end_lat, end_lng);

    if (bars_added.length > 2) {
        for (var i=1; i < bars_added.length-1; i++) {
            var waypoint_lat = bars_added[i].location.coordinate.latitude;
            var waypoint_lng = bars_added[i].location.coordinate.longitude;
            var waypoint_latlng = new google.maps.LatLng(waypoint_lat, waypoint_lng);
            var waypoint_coordinates = [];
            waypoint_coordinates.push({
                location: waypoint_latlng
            });
        }
    }


    var request = {
        origin: start_coordinates,
        destination: end_coordinates,
        waypoints: waypoint_coordinates,
        travelMode: 'DRIVING'
    };

    directions_service.route(request, function (response, status) {
        if (status == 'OK') {
            directions_renderer.setDirections(response);
        }
    })

}



function pull_data_from_yelp(near) {
    var auth = {
        consumerKey : "azhNPdiWoW26hRe13Pk_nw",
        consumerSecret : "Ms0KV6fWvMKC67c6dd0vx1Tyxdk",
        accessToken : "k9M1RIB8lN5IkCImbjr_5zZruIhKJVat",
        accessTokenSecret : "gaj-OJVo9JIRN3uozMtn20fq32w",
        serviceProvider : {
            signatureMethod : "HMAC-SHA1"
        }
    };

    var accessor = {
        consumerSecret : auth.consumerSecret,
        tokenSecret : auth.accessTokenSecret
    };

    var parameters = [];
    parameters.push(['term', 'bar']);
    parameters.push(['location',near]);
    parameters.push(['callback', 'cb']);
    parameters.push(['oauth_consumer_key', auth.consumerKey]);
    parameters.push(['oauth_consumer_secret', auth.consumerSecret]);
    parameters.push(['oauth_token', auth.accessToken]);
    parameters.push(['oauth_signature_method', 'HMAC-SHA1']);

    var message = {
        'action' : 'https://api.yelp.com/v2/search',
        'method' : 'GET',
        'parameters' : parameters
    };

    OAuth.setTimestampAndNonce(message);
    OAuth.SignatureMethod.sign(message, accessor);

    var parameterMap = OAuth.getParameterMap(message.parameters);

    $.ajax({
        'url' : message.action,
        'data' : parameterMap,
        'dataType' : 'jsonp',
        'jsonpCallback' : 'cb',
        'cache': true,
        'success': function(results) {
            console.log('yelp data pulled');
            bar_array = results;

        }
    })
}

function process_businesses(results) {
    //results are stored into bar_array and plotted on map using createMarker function
    initMap();
    for (var i=0; i < results.businesses.length; i++) {
        createMarker(results.businesses[i]);
    }

    function createMarker(place) {
        var current_coordinates = { // stores lat and lng for current bar
            lat: place.location.coordinate.latitude,
            lng: place.location.coordinate.longitude
        };
        var marker = new google.maps.Marker({ // markers created and placed onto map using placeLoc
            map: map,
            position: current_coordinates,
            icon: 'http://maps.google.com/mapfiles/kml/pal2/icon19.png'
            // icon: 'https://www.myfootballforum.com/uploads/monthly_2016_02/xbeer-icon.png.7b43d87e5544057447230087' +
            // '630ea393.png.pagespeed.ic.8zZOESf-Wk.png'
        });

        google.maps.event.addListener(marker, 'click', function() { // click handlers added to each marker to display info_window
            info_window.setContent(bar_info_window(place));
            info_window.open(map, this);
        })
    }

}


/** bars_to_dom()
 * Creates DOM elements to be appended to div.bar-main-container to generate bar list items
 * @param addBarObj
 * @param index
 */
function bars_to_dom(addBarObj, index) {
    var bar_container = $('<div>').addClass('barListItem media');
    var bar_image_container = $('<div>').addClass('media-left media-middle');
    var bar_image = $('<img>').attr('src', addBarObj.image_url).addClass('media-object');
    var bar_info_container = $('<div>').addClass('media-body');
    var bar_name = $('<h4>').text(addBarObj.name).addClass('media-heading');
    var bar_info_list = $('<div>').addClass('col-md-8 pull-left');
    var address = $('<h5>').text('Address: ' + addBarObj.location.display_address[0] + ', ' + addBarObj.location
            .display_address[1]);
    if (addBarObj.is_closed === true){
        var hours = $('<h5>').text('Hours: Open Now');
    } else {
        var hours = $('<h5>').text('Hours: CLOSED');
    }
    var phone = $('<h5>').text('Phone: ' + addBarObj.phone);

    // var price = $('<img>').attr('src',addBarObj.rating_img_url);//
    // var rating = $('<h5>').text('Rating: ' + addBarObj.rating + ' Reviews: ' + addBarObj.review_count);//
    // var beerIconCount = null;
    // for (var i = 0; i < addBarObj.rating; i++){
    //     beerIconCount++;
    // }
    // var totalBeerIcons =
    var rating = $('<h5>').text('Rating: ' + addBarObj.rating);
    var reviews = $('<h5>').text(addBarObj.review_count + ' Reviews');
    var add_button = $('<button>', {
        text: 'Add To List',
        class: 'btn btn-success navbar-btn pull-right',
        id: index
    });

    bar_info_list.append(address, phone, hours, rating, reviews);
    bar_info_container.append(bar_name, bar_info_list, add_button);
    bar_image_container.append(bar_image);
    bar_container.append(bar_image_container, bar_info_container);
    bar_container.appendTo('.bar-main-container');
}

/** update_bars()
 * function will update bars that will be loaded on AJAX call
 */
function update_bars() {
    console.log('update_bars has been loaded. ');
    $('.bar-main-container').html('');
    for (var i =0; i < bar_array.businesses.length; i++){
        bars_to_dom(bar_array.businesses[i], i);
    }
}

/** remove_a_bar()
 * function will remove any bars that have been added to the users to-do list once the (RED) button is clicked
 */
function remove_a_bar() {
    console.log('bar has been deleted');
    var selection = $(event.target).parent().parent();
    var delete_button = $(this).attr('id');
    for(i = 0; i < bars_added.length; i++){
        if(bars_added[i].name == delete_button){
            bars_added.splice(i, 1);
        }
    }
    selection.remove();
    create_route(bars_added);

}

// //////////////////////////////////////This code is for the FB share button.
// window.fbAsyncInit = function() {
//     FB.init({
//         appId      : 'your-app-id',
//         xfbml      : true,
//         version    : 'v2.8'
//     });
//     FB.AppEvents.logPageView();
// };
//
// (function(d, s, id){
//     var js, fjs = d.getElementsByTagName(s)[0];
//     if (d.getElementById(id)) {return;}
//     js = d.createElement(s); js.id = id;
//     js.src = "//connect.facebook.net/en_US/sdk.js";
//     fjs.parentNode.insertBefore(js, fjs);
// }(document, 'script', 'facebook-jssdk'));

/////////////////////////////////////////////////

var printList = $("#barList").printElement();

$('#lnkPrint').append(printList);

function clear_list() {
    console.log('clear list called');
    bars_added = [];
    //initMap();
    directions_renderer.setMap(null);
    $('.modal-body').empty();
    $('.btn-default').removeClass('btn-default').addClass('btn-success').text('Add To List');

}

/** update_modal function
 * Takes in current_place parameter to create DOM elements to be placed into Check Bar List Modal
 * @param current_place
 */
function update_modal(current_place) {
    var bar_container = $('<div>').addClass('barListItem media');
    var bar_image_container = $('<div>').addClass('media-left media-middle');
    var bar_image = $('<img>').attr('src', current_place.image_url).addClass('media-object');
    var bar_info_container = $('<div>').addClass('media-body');
    var bar_name = $('<h4>').text(current_place.name).addClass('media-heading');
    var bar_info_list = $('<div>').addClass('col-md-8 pull-left');
    var address = $('<h5>').text('Address: ' + current_place.location.display_address[0] + ', ' + current_place.location
            .display_address[1]);
    if (current_place.is_closed === true){
        var hours = $('<h5>').text('Hours: Open Now');
    } else {
        var hours = $('<h5>').text('Hours: CLOSED');
    }
    var phone = $('<h5>').text('Phone: ' + current_place.phone);
    var rating = $('<h5>').text('Rating: ' + current_place.rating);
    var reviews = $('<h5>').text(current_place.review_count + ' Reviews');
    var delete_button = $('<button>', {
        text: 'Delete Bar',
        class: 'btn btn-danger navbar-btn delete-btn',
        id: current_place.name
    });

    bar_info_list.append(address, phone, hours, rating, reviews);
    bar_info_container.append(bar_name, bar_info_list, delete_button);
    bar_image_container.append(bar_image);
    bar_container.append(bar_image_container, bar_info_container);
    bar_container.appendTo('.modal-body');
}


function update_add_to_list_button(button_element) {
    $(button_element).removeClass('btn-success');
    $(button_element).addClass('btn-default');
    $(button_element).text('Selected');
}

//TODO update radius level to work with radio buttons ***REMOVED***
//TODO remove sample data from check bar list ***DONE***

//TODO fix print screen
//JSDOC commenting
//TODO price level undefined ***FIXED***

//TODO change add to list to say selected ***DONE***





