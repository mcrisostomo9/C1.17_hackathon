var map;
var info_window;



function initMap() {
    var center = {lat: 33.877742, lng: -117.380979};
    map = new google.maps.Map(document.getElementById('map_canvas'), {
        center: center,
        zoom: 11
    });

    var request = {
        location: center,
        radius: 16047,
        types: ['bar']
    };

    info_window = new google.maps.InfoWindow();

    var service = new google.maps.places.PlacesService(map);

    service.nearbySearch(request, callback);

    function callback(results, status) {
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
            position: place.geometry.location
        });

        google.maps.event.addListener(marker, 'click', function() {
            info_window.setContent(place.name);
            info_window.open(map, this);
        })
    }

}

google.maps.event.addDomListener(window, 'load', initMap);



