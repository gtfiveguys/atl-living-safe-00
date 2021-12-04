import React, { useEffect, useRef, useMemo } from "react";
import chroma from "chroma-js";

function Route(props) {
  const { map, routes, travelMode, setRoutesInfo, view } = props;

  const routeRenderers = useRef([]);
  const routeMarkers = useRef([]);
  const typeIcons = {
    university: "https://i.loli.net/2021/12/01/Zm7tC5SUejQ6inq.png",
    supermarket: "https://i.loli.net/2021/12/01/MUVCijP5XYwam1F.png",
    gas_station: "https://i.loli.net/2021/12/01/Gbqu2s5X93RnEIY.png",
    gym: "https://i.loli.net/2021/12/01/W3ACQqK2fyImpvg.png",
    subway_station: "https://i.loli.net/2021/12/01/DF5wOLldmUZ42fe.png",
    bus_station: "https://i.loli.net/2021/12/01/HqiyCle9Vcdg8FG.png",
    drugstore: "https://i.loli.net/2021/12/01/6wEg89zjq32bAkK.png",
    pharmacy: "https://i.loli.net/2021/12/01/6wEg89zjq32bAkK.png",
    convenience_store: "https://i.loli.net/2021/12/01/ZyiEn9N6UAvIPgo.png",
    restaurant: "https://i.loli.net/2021/12/01/tp3WwsluNLKYg18.png",
    police: "https://i.loli.net/2021/12/01/hDbQzmNurPU24Jd.png",
    park: "https://i.loli.net/2021/12/01/oXChls4rbPfkFp3.png",
    cafe: "https://i.loli.net/2021/12/01/Pi6marj7nSL9G1O.png",
    bank: "https://i.loli.net/2021/12/01/PANzRFkBa719JQG.png",
  };

  // const [error, setError] = useState(null);

  const usePrevious = (value) => {
    const ref = useRef(null);
    useEffect(() => {
      ref.current = value;
    }, [value]);
    return ref.current;
  };
  const prevRoutes = usePrevious(routes);

  // Create DirectionsService on first rendering
  const service = useMemo(() => new window.google.maps.DirectionsService(), []);

  // const compareOrigin = (prev, curr) => {
  //   console.log(
  //     "prev origin",
  //     prev && prev.position.lat(),
  //     prev && prev.position.lng()
  //   );
  //   console.log("curr origin", curr.position.lat(), curr.position.lng());
  //   return prev !== null && prev.position === curr.position;
  // };

  const diffDestinations = (prev, curr) => {
    // place_coordinates
    var adds = [], removes = [];
    let keepMap = new Map();
    let prevMap = new Map();
    for (var i = 0; i < prev.length; i++) {
      var pc = prev[i].place_coordinates;
      prevMap.set(pc, 1);
    }

    for (var i = 0; i < curr.length; i++) {
      var pc= curr[i].place_coordinates;
      var hasEle = prevMap.has(pc)
      console.log(hasEle)
      if (!hasEle) {
        adds.push(pc);
      } else {
        keepMap.set(pc, 1);
      }
    }

    for (var i = 0; i < prev.length; i++) {
      var pc = prev[i].place_coordinates;
      if (!keepMap.has(pc)) {
        removes.push(pc);
      }
    }

    return [adds, removes]
  }

  useEffect(() => {
    if (map && view && service && routes) {
      const { origin, destinations } = routes;

      // Initialize routes info and route renderers
      setRoutesInfo([]);
      removeRouteDisplay();
      // console.log(prevRoutes)
      // console.log(routes)

      var prevOrigin = null, prevDestination = null;
      if (prevRoutes) {
        var { origin: prevOrigin, destinations: prevDestination } = prevRoutes;
        console.log(prevOrigin)
        // prevOrigin = prevOrigin;
        // prevDestination = prevDestination1;
      }

      console.log("prevOrigin: " + prevOrigin)
      console.log("origin: " + origin)

      console.log(prevDestination)
      console.log(destinations)

      if (prevDestination != null) {
        const [adds, removes] = diffDestinations(prevDestination, destinations)

        console.log(adds)
        console.log(removes)
      }

      // Define color scale
      const color_scale = chroma
        // .scale(["green", "red"])
        .scale(["green", "yellow", "orange", "red"])
        .domain([0, 40], 40, "lab");

      // Add default marker at start position
      const originMarker = new window.google.maps.Marker({
        position: origin,
        map: map,
        icon: "https://i.loli.net/2021/12/01/VrQvHOwiFLx5Yha.png",
        // icon: "https://i.loli.net/2021/12/01/qpIkuME76GKF9Tj.png",
      });
      routeMarkers.current.push(originMarker);

      // Initialize bounds to origin position
      const bounds = new window.google.maps.LatLngBounds(origin, origin);

      // console.log("curr", destinations);
      // console.log("prev", prevDestinations);
      // console.log("origin prev=curr is", compareOrigin(prevOrigin, origin));

      // For each destination, create a new Directions Renderer and display the route from origin to destination
      destinations.forEach((destination, i) => {
        if (destination.place_coordinates === "None") {
          setRoutesInfo((current) => [
            ...current,
            {
              type: destination.place_type,
              destination: "None",
            },
          ]);
          return;
        }

        const [lat, lng] = destination.place_coordinates;
        const safty_score = destination.route_score * 100;
        service.route(
          {
            origin: origin,
            destination: new window.google.maps.LatLng(lat, lng),
            travelMode: travelMode,
          },
          (result, status) => {
            if (status === window.google.maps.DirectionsStatus.OK) {
              // Display route using DirectionsRenderer
              const directionsRenderer =
                new window.google.maps.DirectionsRenderer({
                  map: map,
                  preserveViewport: true,
                  polylineOptions: {
                    strokeColor: color_scale(safty_score).hex(),
                    strokeWeight: 5,
                    strokeOpacity: 0.5,
                  },
                  suppressMarkers: true,
                  directions: result,
                });
              routeRenderers.current.push({location: destination.place_coordinates,renderer: directionsRenderer});

              // Add type-specific marker at destination position
              const leg = result.routes[0].legs[0];
              const destinationMarker = new window.google.maps.Marker({
                position: leg.end_location,
                map: map,
                icon: typeIcons[destination.place_type],
                size: new window.google.maps.Size(12, 12),
              });
              routeMarkers.current.push(destinationMarker);

              // Store current route's info
              setRoutesInfo((current) => [
                ...current,
                {
                  type: destination.place_type,
                  destination: destination.place_name,
                  distance: leg.distance.text,
                  score: destination.route_score,
                },
              ]);

              // Add mouseover listener on route polyline
              // const polyline = new window.google.maps.Polyline({
              //   map: map,
              //   path: result.routes[0].overview_path,
              //   polylineOptions: {
              //     strokeColor: color_scale(i).hex(),
              //     strokeWeight: 5,
              //   },
              // });
              // leg.steps.forEach((step) => {
              //   const segment = step.path;
              //   const polyline = new window.google.maps.Polyline({
              //     map: map,
              //     path: segment,
              //   });

              //   polyline.addListener("click", () =>
              //     console.log("route mouse over")
              //   );
              // });

              // Update map bounds and reset center
              const routeBounds = result.routes[0].bounds;
              bounds.extend(routeBounds.getNorthEast());
              bounds.extend(routeBounds.getSouthWest());
              map.fitBounds(bounds);
            }
            // else {
            //   setError(result);
            // }
          }
        );
      });
      console.log(routeRenderers)
      if (routeRenderers.current.length === 0) {
        map.fitBounds(new window.google.maps.LatLngBounds(origin, origin));
        map.setOptions({
          center: origin,
          zoom: 13,
        });
      }
    }
  }, [routes, travelMode]);

  // If toggle back to full view, remove routes
  useEffect(() => {
    if (routeRenderers.current && !view) {
      setRoutesInfo([]);
      removeRouteDisplay();
    }
  }, [view]);

  // Remove markers
  const removeRouteMarkers = () => {
    routeMarkers.current.forEach((marker) => marker.setMap(null));
    routeMarkers.current = [];
  };

  // Remove routes
  const removeRouteRenderers = () => {
    routeRenderers.current.forEach((item) => item.renderer.setMap(null));
    routeRenderers.current = [];
  };

  const removeRouteDisplay = () => {
    removeRouteMarkers();
    removeRouteRenderers();
  };

  // if (error) {
  //   return <h1>{error}</h1>;
  // }
  return <div id="route"></div>;
}

export default Route;
