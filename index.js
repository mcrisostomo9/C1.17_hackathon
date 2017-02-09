/**
 * Created by jorgecruz on 2/8/17.
 */

/**
 * document load
 */
//TODO  click handlers


// Variables
var bars_listed = [];
var bars_added = [];


/**
 * We need a search function that when licked, the search function will load all necessary functions for Page 2
 * to start
 */

function bar_search() {
    console.log('search has been clicked');

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

