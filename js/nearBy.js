function getCurrent() {
    initializeNearBy();
    var startPos;
    var marker;
    navigator.geolocation.getCurrentPosition(function (position) {

        startPos = position;
        latitude = startPos.coords.latitude;
        longitude = startPos.coords.longitude;
        lat = latitude;
        lng = latitude;
        var latLng = new google.maps.LatLng(latitude, longitude);

        geocoder.geocode({ 'location': latLng },
          function (results, status) {
              if (status == google.maps.GeocoderStatus.OK) {
                  appendNearByFindButton();
                  //                  mapNearBy.setCenter(results[0].geometry.location);

                  //                  var marker = new google.maps.Marker({
                  //                      map: mapNearBy,
                  //                      position: results[0].geometry.location,
                  //                      draggable: false
                  //                  });

                  //                  //get address from latLng
                  //                  var latlng = marker.getPosition();
                  //                  var markerLat = latlng.lat();
                  //                  var markerLng = latlng.lng();

                  //                  var url = "http://maps.googleapis.com/maps/api/geocode/json?address=" + markerLat + "," + markerLng + "&sensor=false";
                  //                  var formattedAddress;

                  //                  $.getJSON(url, function (data) {
                  //                      if (data.results.length != 0) {
                  //                          formattedAddress = data.results[0].formatted_address;

                  //                          var infowindow = new google.maps.InfoWindow(
                  //                          {
                  //                              content: formattedAddress,
                  //                              size: new google.maps.Size(50, 50)
                  //                          });

                  //                          google.maps.event.addListener(marker, 'click', function () {
                  //                              infowindow.open(map, marker);
                  //                              mapNearBy.setZoom(18);
                  //                              mapNearBy.setCenter(marker.getPosition());
                  //                          });

                  //                          google.maps.event.trigger(marker, "click");
                  //                      }
                  //                  });
                  if (results[0]) {
                      formattedAddress = results[0].formatted_address;

                      var infowindow = new google.maps.InfoWindow(
                      {
                          content: formattedAddress,
                          size: new google.maps.Size(50, 50)
                      });

                      if (marker) {
                          marker.setPosition(results[0].geometry.location);
                      } else {
                          marker = new google.maps.Marker({
                              map: mapNearBy,
                              position: results[0].geometry.location,
                              visible: false
                          });
                      }

                      google.maps.event.addListener(marker, 'click', function () {
                          infowindow.open(mapNearBy, marker);
                          mapNearBy.setZoom(18);
                          mapNearBy.setCenter(marker.getPosition());
                      });

                      google.maps.event.trigger(marker, "click");
                  }

              }
              else {
                  blackberry.ui.toast.show("No address found. Please try again.");
              }
          });
    });


}