/**
 * Created by jorgecruz on 2/8/17.
 */

/**
 * document load
 */
$(document).ready(initialize);

function initialize(){
    $('.search_button').click(bar_search);

}

// Variables
var bars_listed = [];
var bars_added = [];
var geocoder = new google.maps.Geocoder();
var coordinates;


/**
 * We need a search function that when licked, the search function will load all necessary functions for Page 2
 * to start
 */

function bar_search() {
    //TODO ajax call to fill bars_listed
    bars_to_dom();
    
}

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
            zoom = 11;
            initMap();
            bars_to_dom();
        }
        else {
            console.log('geocoding not working')
        }
    });
}

//create DOM elements for page 2
function bars_to_dom() {


    // TODO this is being called twice for some reason
    console.log('bars to dom init');

    var bar_container = $('<div>').addClass('media');

    var bar_image_container = $('<div>').addClass('media-left media-middle');
    var bar_image = $('<img>').addClass('media-object');

    var bar_info_container = $('<div>').addClass('media-body');
    var bar_name = $('<h4>').addClass('media-heading');

    var bar_info_list = $('<div>').addClass('col-md-8 pull-left');
    var address = $('<h5>').text('Address: ');//TODO need span with in hv?
    var hours = $('<h5>').text('Hours: ');//TODO need span with in hv?
    var phone = $('<h5>').text('Phone: ');//TODO need span with in hv?
    var reviews = $('<h5>').text('Reviews: ');//TODO need span with in hv?

    var add_button = $('<button>').addClass('btn btn-success navbar-btn');

    bar_info_list.append(address, hours, phone, reviews);
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
    console.log('update_bars has been loaded. ')
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

