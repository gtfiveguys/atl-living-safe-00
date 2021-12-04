/*global google */
import React, { useState, useEffect } from "react";
import readCSV from "../../readCSV";

const radius = [
  50, 66.55, 86.4, 109.85, 137.2, 230, 400, 680, 900, 900, 900, 900, 900,
];
const gradient = [
  "rgba(255, 255, 204, 0)",
  "rgba(255, 255, 153, 1)",
  "rgba(255, 230, 153, 1)",
  "rgba(255, 204, 153, 1)",
  "rgba(255, 179, 153, 1)",
  "rgba(255, 153, 153, 1)",
];
function Heatmap(props) {
  const [data, setData] = useState(null);
  const [heatmap, setHeatmap] = useState(null);

  // When component is mounted, read data
  useEffect(() => {
    readCSV("/data/pred_result.csv").then((data) => {
      setData(
        data.map((d) => {
          if (d[2] > 0) {
            return {
              location: new google.maps.LatLng(+d[0], +d[1]),
              weight: +d[2],
            };
          } else {
            return null;
          }
        })
      );
    });
  }, []);

  // When map and data are ready, create heatmap
  useEffect(() => {
    if (props.map && data && !heatmap) {
      const heatmap = new google.maps.visualization.HeatmapLayer({
        data: data,
        map: props.map,
        gradient: gradient,
        radius: radius[props.zoom - 10],
      });
      setHeatmap(heatmap);
    }
  }, [props.map, data]);

  // When zoom is changed, update heatmap's radius
  useEffect(() => {
    if (heatmap) {
      heatmap.setOptions({
        radius: radius[props.zoom - 10],
      });
    }
  }, [props.zoom]);

  return <div id="heatmap"></div>;
}

export default Heatmap;
