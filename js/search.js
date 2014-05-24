/*
* Copyright 2010-2011 Research In Motion Limited.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

function showTab(id) {
    if (id == 'search') {
        document.getElementById('search').style.display = 'inline';
        document.getElementById('near').style.display = 'none';
        document.getElementById('favorite').style.display = 'none';
        document.getElementById('setting').style.display = 'none';
    } else if (id == 'near') {
        document.getElementById('search').style.display = 'none';
        document.getElementById('near').style.display = 'inline';
        document.getElementById('favorite').style.display = 'none';
        document.getElementById('setting').style.display = 'none';
        
    } else if (id == "favorite") {
        document.getElementById('search').style.display = 'none';
        document.getElementById('near').style.display = 'none';
        document.getElementById('favorite').style.display = 'inline';
        document.getElementById('setting').style.display = 'none';
      
    } else if (id == "setting") {
        document.getElementById('search').style.display = 'none';
        document.getElementById('near').style.display = 'none';
        document.getElementById('favorite').style.display = 'none';
        document.getElementById('setting').style.display = 'inline';

    }
}

var map = null;
var mapNearBy = null;
var geocoder = null;

function initialize() {
    geocoder = new google.maps.Geocoder();

    var mapOptions = {
        center: new google.maps.LatLng(43.65609420, -79.38148430),
        zoom: 10,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    map = new google.maps.Map(document.getElementById("map_canvas"),
            mapOptions);
}

function initializeNearBy() {
    geocoder = new google.maps.Geocoder();

    var mapOptions = {
        center: new google.maps.LatLng(43.65609420, -79.38148430),
        zoom: 10,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    mapNearBy = new google.maps.Map(document.getElementById("map_canvas_near_by"),
            mapOptions);
}


var lat;
var lng;
function getLatlng(address) {
    if (address.indexOf("Toronto") == -1) {
        address = address + " Toronto";
    }
    var url = "http://maps.googleapis.com/maps/api/geocode/json?address=" +address+ "&sensor=false";

    $.getJSON(url, function (data) {
        if (data.results.length != 0) {
            lat = data.results[0].geometry.location.lat;
            lng = data.results[0].geometry.location.lng;
        }

    });
}

function showAddress(address) {
    var marker;
    var formattedAddress;
    if (address.indexOf("Toronto") == -1) {
        address = address + " Toronto";
    }
    geocoder.geocode({ 'address': address },
          function (results, status) {
              if (status == google.maps.GeocoderStatus.OK) {
                  appendFindButton();

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
                              map: map,
                              position: results[0].geometry.location,
                              visible: false
                          });
                      }

                      google.maps.event.addListener(marker, 'click', function () {
                          infowindow.open(map, marker);
                          map.setZoom(18);
                          map.setCenter(marker.getPosition());
                      });

                      google.maps.event.trigger(marker, "click");
                  }


              }
              else {
                  //alert("Geocode was not successful for the following reason: " + status);
              }
          });
}


  function distance(lat1,lon1,lat2,lon2) {
		var R = 6371; // km (change this constant to get miles)
		var dLat = (lat2-lat1) * Math.PI / 180;
		var dLon = (lon2-lon1) * Math.PI / 180;
		var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
			Math.cos(lat1 * Math.PI / 180 ) * Math.cos(lat2 * Math.PI / 180 ) *
			Math.sin(dLon/2) * Math.sin(dLon/2);
		var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
		var d = R * c;
		if (d>1) return Math.round(d) * 1000;
		else if (d<=1) return Math.round(d*1000);
		return d;
	}

	var detailId;
	function findParkingLot(lat, lon){
	    $.getJSON('resource/greenPParking.json', function (data) {
	        var items = [], item;
	        for (var i = 0; i < data.carparks.length; i++) {

	            if (distance(lat, lon, data.carparks[i].lat, data.carparks[i].lng) <= 1000) {
	                var distanceCurrent = distance(lat, lon, data.carparks[i].lat, data.carparks[i].lng);
	                distanceCurrent = distanceCurrent + " M";
	                var streetId = data.carparks[i].id;
	                item = document.createElement('div');
	                item.setAttribute('data-bb-type', 'item');
	                item.setAttribute('data-bb-title', data.carparks[i].address);
	                item.innerHTML = distanceCurrent;

	                item.setAttribute("onclick", "changeCurrentIndex(" + streetId + ")");
	                items.push(item);
	            }
	        }
	        if (items.length == 0) {
	            blackberry.ui.toast.show("No Address Near By.");
	        }
	        items.sort(function (a, b) {
	            return a.innerHTML.substring(0, a.innerHTML.length - 1) - b.innerHTML.substring(0, b.innerHTML.length - 1)
	        });
	        document.getElementById('parkingList').refresh(items);

	    });
//	    bb.pushScreen('targetList.htm', 'targetList');
	}


//  function getAddress(latLng) {
//      geocoder.geocode({ 'latLng': latLng },
//      function (results, status) {
//          if (status == google.maps.GeocoderStatus.OK) {
//              if (results[0]) {
//                  document.getElementById("address").value = results[0].formatted_address;
//              }
//              else {
//                  document.getElementById("address").value = "No results";
//              }
//          }
//          else {
//              document.getElementById("address").value = status;
//          }
//      });
//  }

function appendFindButton() {
	$("#search_page_main").empty();
    var item = document.createElement('div');
	item.setAttribute('data-bb-type', 'item');
	item.setAttribute('data-bb-style', 'stretch');
	item.setAttribute('data-bb-accent-text', 'Strength');
	item.setAttribute("onclick", "bb.pushScreen('targetList.htm', 'targetList');");
	item.innerHTML = "Find Lot";

	item = bb.button.style(item);
	
	document.getElementById('search_page_main').appendChild(item);
	bb.refresh();
}

function appendNearByFindButton() {
    $("#search_page_near_by").empty();
    var item = document.createElement('div');
    item.setAttribute('data-bb-type', 'item');
    item.setAttribute('data-bb-style', 'stretch');
    item.setAttribute('data-bb-accent-text', 'Strength');
    item.setAttribute("onclick", "bb.pushScreen('targetList.htm', 'targetList');");
    item.innerHTML = "Find Lot";

    item = bb.button.style(item);

    document.getElementById('search_page_near_by').appendChild(item);
    bb.refresh();
}

function targetSearch() {
    
    var address = document.getElementById('address').value;
    showAddress(address);

    getLatlng(address);
}

function autosuggestion(input) {
    
    var suggestions = document.getElementById("suggestions");
    suggestions.innerHTML = "";
    if (window.event.keyCode == 13) {
        suggestions.innerHTML = "";
        targetSearch();
    } else {

        var url = "https://maps.googleapis.com/maps/api/place/autocomplete/json?input=" + input + "&components=country:ca&location=43.653342,-79.383087&radius=10000&sensor=true&key=AIzaSyDN4crB90axK72zzZfRMbztAmx3iIWGX7s";
        $.getJSON(url, function (data) {
            //alert(url);
            if (data.predictions.length != 0) {
                for (i = 0; i < data.predictions.length; i++) {
                    suggestions.innerHTML += '<div ontouchstart = "onAddress(this);" ontouchend = "selectAddress(this);">' + data.predictions[i].description + '</div>';
                }
            }
        });
    }
}
function onAddress(address) {
    address.style.backgroundColor = 'grey';
}
function selectAddress(address) {
    var textBox = document.getElementById("address");
    textBox.value = address.innerHTML;
    suggestions.innerHTML = ""
    targetSearch();
}
function selectText(text) {
    if (text.value == "Please enter the address") {
        text.value = "";
    } else {
        text.select();
    }
}