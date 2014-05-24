function showDetail(id) {
    $.getJSON('resource/greenPParking.json', function (data) {
        for (var i = 0; i < data.carparks.length; i++) {
            if (id == data.carparks[i].id) {

                showLot(data.carparks[i].streetview_lat, data.carparks[i].streetview_long, data.carparks[i].streetview_yaw,
                    data.carparks[i].streetview_pitch, data.carparks[i].streetview_zoom);

                $("#detailOtherInfo").append("<table><tr><td style='width:718px;'>" + data.carparks[i].address + "(<font color='#AAAAAA' style='font-size:20pt;'><i>" + distance(lat, lng, data.carparks[i].lat, data.carparks[i].lng) + "M</i></font>)</td>" +
                                        "<td><img id='detailStar' src='images/star_gray.png' onclick=\"addFavorite(" + currentIndex + ",'"+data.carparks[i].address+"');this.src='images/star_yellow.png';\" /></td></tr></table>");

                var maxHeight = data.carparks[i].max_height == null ? "2.00" : data.carparks[i].max_height;
                $("#detailOtherInfo").append(
                    "<table border='1' bgcolor=\"#DDDDDD\" bordercolor=\"#FFFFFF\">" +
                    "<tr><td><div style=\" margin-left:10px;margin-right:10px;font-size:20pt\">Rate Half Hour:</div></td>" +
                    "<td><div style=\"margin-left:10px;margin-right:15px;font-size:18pt\"><i>$" + data.carparks[i].rate_half_hour + "</i></div></td>" +
                    "<td><div style=\" margin-left:10px;margin-right:10px;font-size:20pt\">Car Park Type:</div></td>" +
                    "<td><div style=\"margin-left:10px;font-size:18pt\"><i>" + data.carparks[i].carpark_type_str + "</i></div></td></tr>" +
                    "<tr><td><div style=\"margin-left:10px;margin-right:10px;font-size:20pt\">Capacity:</div></td>" +
                    "<td><div style=\"margin-left:10px;margin-right:15px;font-size:18pt\"><i>" + data.carparks[i].capacity + "</i></div></td>" +
                    "<td><div style=\"margin-left:10px;margin-right:10px;font-size:20pt\">Max Height:</div></td>" +
                    "<td><div style=\"margin-left:10px;font-size:18pt\"><i>" + maxHeight + "</i></div></td></tr>" +
                    "<tr><td><div style=\"margin-left:10px;margin-right:10px;font-size:20pt\">Day Max:</div></td>" +
                    "<td><div style=\"margin-left:10px;margin-right:15px;font-size:18pt\"><i>" + data.carparks[i].rate_details.periods[0].rates[0].when + "</i></div></td>" +
                    "<td><div style=\"margin-left:10px;margin-right:10px;font-size:20pt\">Night Max:</div></td>" +
                    "<td><div style=\"margin-left:10px;font-size:18pt\"><i>" + data.carparks[i].rate_details.periods[0].rates[1].when + "</i></div></td></tr>" +
                     "<tr><td><div style=\"margin-left:10px;margin-right:10px;font-size:20pt\">Day Max Rate:</div></td>" +
                    "<td><div style=\"margin-left:10px;margin-right:15px;font-size:18pt\"><i>" + data.carparks[i].rate_details.periods[0].rates[0].rate + "</i></div></td>" +
                    "<td><div style=\"margin-left:10px;margin-right:10px;font-size:20pt\">Night Max Rate:</div></td>" +
                    "<td><div style=\"margin-left:10px;font-size:18pt\"><i>" + data.carparks[i].rate_details.periods[0].rates[1].rate + "</i></div></td></tr>" +
                     "<tr><td><div style=\"margin-left:10px;margin-right:10px;font-size:20pt\">Payment Methods:</div></td>" +
                    "<td colspan=3><div style=\"margin-left:10px;margin-right:15px;font-size:18pt\"><i>" + data.carparks[i].payment_methods + "</i></div></td></tr>" +
                    "</table>"
                );
                break;
            }
        }

    });
}

var currentIndex;
function changeCurrentIndex(i) {
    currentIndex = i;
    bb.pushScreen('detail.htm', 'detail');
}


function showLot(sv_lat, sv_lon, sv_yaw, sv_pitch, sv_zoom) {
    var result;
    var latLng = new google.maps.LatLng(sv_lat, sv_lon);

    geocoder.geocode({ 'location': latLng },
        function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                map.setCenter(results[0].geometry.location);

                var marker = new google.maps.Marker({
                    map: map,
                    position: results[0].geometry.location,
                    visible: false
                });

                var streetview_url = "http://maps.googleapis.com/maps/api/streetview?size=400x400&location=" + sv_lat + ",%20" + sv_lon + "&fov=90&heading=" + sv_yaw + "&pitch=" + sv_pitch + "&sensor=false";
                var contentString = "<div style='height:400px;width:400px;'><img src = '" + streetview_url + "' /></div>";

                var infowindow = new google.maps.InfoWindow(
                          {
                              content: contentString,
                              size: new google.maps.Size(50, 50)
                          });

                google.maps.event.addListener(marker, 'click', function () {
                    infowindow.open(map, marker);
                    map.setZoom(18);
                    map.setCenter(marker.getPosition());
                });

                google.maps.event.trigger(marker, "click");

            }
            else {
                //alert("Geocode was not successful for the following reason: " + status);
            }
        }
    );

}
