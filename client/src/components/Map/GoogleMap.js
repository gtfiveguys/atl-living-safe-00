import React, { useState, useEffect, useRef } from "react";
import Map from "./Map";
import Heatmap from "./Heatmap";
import Route from "./Route";
import SearchForm from "./SearchForm";
import Results from "./Results";
import { useDispatch } from "react-redux";
import { setActivePage } from "../../store/actions";
import "./GoogleMap.css";

const Atlanta = new window.google.maps.LatLng(33.74855, -84.391502);
const defaultZoom = 10.5;
const bounds = {
  lat: { min: 33.605, max: 33.885 },
  lng: { min: -84.55, max: -84.29 },
};

function GoogleMap(props) {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setActivePage(1));
  });

  const [map, setMap] = useState();
  const [zoom, setZoom] = useState(defaultZoom);
  const [center, setCenter] = useState(Atlanta);
  const [view, toggleView] = useState(true); // TRUE = all apartments, FALSE = a selected apartment w/ routes
  const apartments = useRef(null);
  const [selectedApt, setSelectedApt] = useState(null);
  const [selectedPlaceTypes, setSelectedPlaceTypes] = useState([
    { value: "university", label: "University" },
  ]);
  const [routes, setRoutes] = useState(null); // an object containing { origin, destinations }
  const [travelMode, setTravelMode] = useState("DRIVING");
  const [routesInfo, setRoutesInfo] = useState([]);
  const [markerMap, setMarkerMap] = useState();

  // Event handler for selecting an apartment either on the map or in the recommendation list
  const handleSelectApartment = (apartment) => {
    toggleView(false);
    setSelectedApt(apartment);
    setMarkerMap(null);
  };

  // When user chooses a new apartment or a new place type, update destinations
  useEffect(() => {
    if (selectedApt) {
      const destinations = selectedPlaceTypes.map((type) => {
        return {
          place_type: type.value,
          place_name: selectedApt[type.value + "_name"],
          place_coordinates: selectedApt[type.value + "_coordinates"],
          route_score: selectedApt[type.value + "_score"],
        };
      });
      // console.log("finding new destinations", destinations);
      setRoutes({ origin: selectedApt.marker.position, destinations });
    }
  }, [selectedApt, selectedPlaceTypes]);

  return (
    <div style={{ height: "100%", overflowY: "hidden" }}>
      <SearchForm
        selectedPlaceTypes={selectedPlaceTypes}
        setSelectedPlaceTypes={setSelectedPlaceTypes}
        setTravelMode={setTravelMode}
      />
      <div className="map-container">
        <Map
          map={map}
          setMap={setMap}
          zoom={zoom}
          setZoom={setZoom}
          defaultZoom={defaultZoom}
          center={center}
          setCenter={setCenter}
          defaultCenter={Atlanta}
          bounds={bounds}
          view={view}
          toggleView={toggleView}
          apartments={apartments}
          handleSelectApartment={handleSelectApartment}
          setSelectedApt={setSelectedApt}
          markerMap={markerMap}
          setMarkerMap={setMarkerMap}
        >
          {[
            <Heatmap key="heatmap" map={map} zoom={zoom} />,
            <Route
              key="route"
              map={map}
              routes={routes}
              travelMode={travelMode}
              setRoutesInfo={setRoutesInfo}
              setCenter={setCenter}
              view={!view}
            />,
          ]}
        </Map>
        <Results
          user={props.user}
          apartments={apartments}
          handleSelectApartment={handleSelectApartment}
          selectedApt={selectedApt}
          selectedPlaceTypes={selectedPlaceTypes}
          routesInfo={routesInfo}
        />
      </div>
    </div>
  );
}

export default GoogleMap;
