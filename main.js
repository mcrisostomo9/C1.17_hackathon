var map,
    input,
    options,
    autocomplete,
    default_bounds;

function initMap() {
    map = new google.maps.Map(document.getElementById('map_canvas'), {
        center: {lat: 38.877742, lng: -97.380979},
        zoom: 4
    });
}

google.maps.event.addDomListener(window, 'load', initialize);



