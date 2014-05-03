// Copyright (c) 2011 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

var maps_key = "ABQIAAAATfHumDbW3OmRByfquHd3SRTRERdeAiwZ9EeJWta3L_JZVS0bOBRQeZgr4K0xyVKzUdnnuFl8X9PX0w";

function gclient_geocode(address) {
  var url = 'https://maps.googleapis.com/maps/api/geocode/json?address=' +
            encodeURIComponent(address) + '&sensor=false';
  var request = new XMLHttpRequest();

  request.open('GET', url, true);
  console.log(url);
  request.onreadystatechange = function (e) {
    console.log(request, e);
    if (request.readyState == 4) {
      if (request.status == 200) {
        var json = JSON.parse(request.responseText);
        var latlng = json.results[0].geometry.location;
        latlng = latlng.lat + ',' + latlng.lng;

        var address_components = json.results[0].address_components
        var street_number = null;
        var street_name = null;
		for(var i=0; i<address_components.length; i++) {
			if (address_components[i].types[0] == "street_number") {
				street_number = address_components[i].short_name;
			}
			if (address_components[i].types[0] == "route") {
				street_name = address_components[i].short_name;
			}
		}

        var url2 = "https://api.urbanraisin.com/properties?num=" + street_number + "&st=" + encodeURIComponent(street_name);

        console.log("Formed new url " + url2);
        var request2 = new XMLHttpRequest();
        request2.open('GET', url2, true);
        request2.onreadystatechange = function (e2) {
            
            console.log(request2, e2);
            if (request2.readyState == 4) {
                if (request2.status == 200) {
                    console.log("request2 succeeded");
                    var json2 = JSON.parse(request2.responseText);
                    
                    var text = document.getElementById("text");
					text.innerText = json2;
					
                    console.log(request2.responseText);
                } else {
                    console.log("request2 status not 200");
                }
            } else {
				console.log("request2 readyState not 4");
            }
        };
		request2.send(null);
                
        
        map.addEventListener('click', function () {
          window.close();
        });
      } else {
        console.log('Unable to resolve address into lat/lng');
      }
    }
  };
  request.send(null);
}

function map() {
  var address = chrome.extension.getBackgroundPage().selectedAddress;
  if (address) {
    gclient_geocode(address);
  }
}

window.onload = map;
