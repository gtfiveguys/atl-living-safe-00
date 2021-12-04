/* global google */
import React, { useState, useEffect, useRef, useCallback } from "react";
import MapStyles from "./MapStyles";
import readCSV from "../../readCSV";

const ATLANTA_BOUNDS = {
  west: -84.71926794161986,
  east: -84.11722814669799,
  north: 33.98288268017652,
  south: 33.54391209266396,
};

function Map(props) {
  const {
    map,
    zoom,
    setZoom,
    defaultZoom,
    center,
    setCenter,
    defaultCenter,
    bounds,
    view,
    toggleView,
    setMap,
    apartments,
    handleSelectApartment,
    setSelectedApt,
    markerMap,
    setMarkerMap,
  } = props;

  const ref = useRef(null);

  /* ----------------------------------
              Initial Setup
  ------------------------------------*/

  useEffect(() => {
    // 1. Create map

    const map = new window.google.maps.Map(ref.current, {
      center: center,
      zoom: zoom,
      options: {
        disableDefaultUI: true,
        zoomControl: true,
        minZoom: 10,
        maxZoom: 22,
      },
      restriction: {
        latLngBounds: ATLANTA_BOUNDS,
      },
    });
    map.mapTypes.set("styled_map", MapStyles);
    map.setMapTypeId("styled_map");

    // Add event listener for zoom change
    map.addListener("zoom_changed", () => setZoom(map.getZoom()));

    // Add custom control for reseting the map to full view
    const controlDiv = document.createElement("div");
    const controlUI = document.createElement("div");
    controlUI.classList.add("custom-control");
    controlDiv.appendChild(controlUI);
    const controlText = document.createElement("div");
    controlText.classList.add("custom-control-text");
    controlText.innerHTML = "Back to Full View";
    controlUI.appendChild(controlText);
    controlUI.addEventListener("click", () => {
      map.fitBounds(
        new window.google.maps.LatLngBounds(defaultCenter, defaultCenter)
      );
      setCenter(defaultCenter);
      setZoom(defaultZoom);
      toggleView(true);
      setSelectedApt(null);
    });

    map.controls[google.maps.ControlPosition.TOP_RIGHT].push(controlDiv);

    setMap(map);

    // 2. Read data and create markers

    const placeItems = [
      "apt",
      "university",
      "supermarket",
      "gas_station",
      "gym",
      "subway_station",
      "bus_station",
      "drugstore",
      "pharmacy",
      "convenience_store",
      "restaurant",
      "police",
      "park",
      "cafe",
      "bank",
    ];

    readCSV("/data/apartments.csv", true).then((csv) => {
      const apartmentList = [];

      // Reformat data

      csv.forEach((d) => {
        placeItems.forEach((item) => {
          d[item + "_score"] = +d[item + "_score"];
          if (d[item + "_coordinates"] !== "None") {
            d[item + "_coordinates"] = d[item + "_coordinates"]
              .toString()
              .replace(/^\(|\)$/g, "")
              .split(",")
              .map((coord) => +coord);
          }
        });
      });

      // Create markers

      csv.forEach((d) => {
        // Filter out apartments that are out of bounds
        const [lat, lng] = d.apt_coordinates;
        if (
          lat < bounds.lat.min ||
          lat > bounds.lat.max ||
          lng < bounds.lng.min ||
          lng > bounds.lng.max
        ) {
          return;
        }

        // Create new marker
        const marker = new window.google.maps.Marker({
          position: new window.google.maps.LatLng(lat, lng),
          map: map,
          icon: "https://i.loli.net/2021/12/01/VrQvHOwiFLx5Yha.png",
        });

        const apartment = { ...d, marker };
        apartmentList.push(apartment);

        // Add event listener
        marker.addListener("click", () => handleSelectApartment(apartment));
      });

      apartments.current = apartmentList;
      setMarkerMap(map);
    });
  }, []);

  /* ----------------------------------
               Miscellaneous
  ------------------------------------ */

  // Whenever markerMap is changed, reset marker's map
  useEffect(() => {
    if (apartments.current) {
      apartments.current.forEach((apt) => {
        apt.marker.setMap(markerMap);
      });
    }
  }, [markerMap]);

  // When zoom is changed, update map's zoom
  useEffect(() => {
    if (map) {
      map.setZoom(zoom);
      //console.log(map.getBounds());
    }
  }, [zoom]);

  // When center is changed, update map's center
  useEffect(() => {
    if (map) {
      map.setCenter(center);
    }
  }, [center]);

  // When view is toggled back to full-view, bring markers back to map
  useEffect(() => {
    if (apartments.current && view) {
      setMarkerMap(map);
    }
  }, [view, apartments, map]);

  return (
    <>
      <div ref={ref} id="map" />
      {React.Children.map(props.children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { map });
        }
      })}
    </>
  );
}

export default Map;
