

// Note: This example requires that you consent to location sharing when
  // prompted by your browser. If you see the error "The Geolocation service
  // failed.", it means you probably did not give permission for the browser to
  // locate you.    // lat: 27.951582,
      // lng: -82.458909
      var map, infoWindow;

      function initMap() {
        function getDistance(source, destination) {
          return google.maps.geometry.spherical.computeDistanceBetween(
            new google.maps.LatLng(source.lat, source.lng),
            new google.maps.LatLng(destination.lat, destination.lng)
            );
        }

        var tampaDownTown = {
          lat:  27.950767,
          lng:  -82.458866
        }

        var userPosition = {
          lat: 27.951582,
          lng: -82.458909
        }
        map = new google.maps.Map(document.getElementById('map'), {
          center: tampaDownTown,
          zoom: 9
        });
        infoWindow = new google.maps.InfoWindow;

    // Try HTML5 geolocation.
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        var pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };

        console.log(getDistance(tampaDownTown, pos));
        console.log(pos);
        console.log(tampaDownTown);
        userPosition = pos;
        infoWindow.setPosition(pos);
        infoWindow.setContent('Location found.');
        infoWindow.open(map);
        map.setCenter(pos);
        let directionsService = new google.maps.DirectionsService();
        let directionsRenderer = new google.maps.DirectionsRenderer();
        directionsRenderer.setMap(map); 



        const route = {
          origin: userPosition,
          destination: tampaDownTown,
          travelMode: 'DRIVING'
        }

        directionsService.route(route,
          function(response, status) { 

            if (status !== 'OK') {
              window.alert('Directions request failed due to ' + status);
              return;
            } else {
      directionsRenderer.setDirections(response); // Add route to the map
      var directionsData = response.routes[0].legs[0]; // Get data about the mapped route
      if (!directionsData) {
        window.alert('Directions request failed');
        return;
      }
      else {
        document.getElementById('msg').innerHTML += " Driving distance is " + directionsData.distance.text + " (" + directionsData.duration.text + ").";
      }
    }
  });
      }, function() {
        handleLocationError(true, infoWindow, map.getCenter());
      });

    } else {
      // Browser doesn't support Geolocation
      handleLocationError(false, infoWindow, map.getCenter());
    }


  }
  function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
      'Error: The Geolocation service failed.' :
      'Error: Your browser doesn\'t support geolocation.');
    infoWindow.open(map);
  }