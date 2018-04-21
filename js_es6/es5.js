function initialize() {
    // Creating map object

    storage = new Storage(APP_ID);
    positionData = storage.getData();

    var map = new google.maps.Map(document.getElementById('google_map'), {
        zoom: 6,
        center: new google.maps.LatLng(positionData.saved_lat, positionData.saved_lng),
        mapTypeId: google.maps.MapTypeId.ROADMAP
    });

    // creates a draggable marker to the given coords
    var vMarker = new google.maps.Marker({
        position: new google.maps.LatLng(positionData.saved_lat, positionData.saved_lng),
        draggable: true,
        title: 'Uluru (Ayers Rock)'
    });

    var infowindow = new google.maps.InfoWindow({
        content: 'drag somewhere<br>to check weather'
    });

    infowindow.open(map, vMarker);

    weatherComponent = new WeatherComponent(storage);
    weatherComponent.getDefaultData();

    google.maps.event.addListener(vMarker, 'mousedown', function (evt) {
        infowindow.close();
    });

    // adds a listener to the marker
    // gets the coords when drag event ends
    // then updates the input with the new coords
    var timer;
    google.maps.event.addListener(vMarker, 'dragend', function (evt) {
        txtLat = evt.latLng.lat().toFixed(6);
        txtLng = evt.latLng.lng().toFixed(6);

        console.log('txtLat, txtLng:');
        console.log(txtLat, txtLng);
        weatherComponent.getBaloonBasedData(txtLat, txtLng);

        if (typeof timer !== 'undefined') {
            console.log('delete timer');
            clearTimeout(timer);
        }

        timer = window.setTimeout(function () {

            document.getElementById('component_screen').style.display = 'block';
        }, 1500);

        map.panTo(evt.latLng);
    });

    // centers the map on markers coords
    map.setCenter(vMarker.position);

    // adds the marker on the City Namep
    vMarker.setMap(map);
}
