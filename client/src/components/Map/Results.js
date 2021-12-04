import React, { useEffect, useRef, useState } from "react";
import Recommendations from "./Recommendations";
import { useDispatch } from "react-redux";
import { openPopUp } from "../../store/actions";
import axios from "axios";
import { FixedSizeList as List } from "react-window";
import "./Results.css";

// Mapping of types
const placeTypes = {
  university: "University",
  supermarket: "Supermarket",
  gas_station: "Gas station",
  gym: "Gym",
  subway_station: "Subway station",
  bus_station: "Bus station",
  drugstore: "Drugstore",
  pharmacy: "Pharmacy",
  convenience_store: "Convenience store",
  restaurant: "Restaurant",
  police: "Police",
  park: "Park",
  cafe: "Cafe",
  bank: "Bank",
};
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
function Results(props) {
  const {
    user,
    apartments,
    handleSelectApartment,
    selectedApt,
    selectedPlaceTypes,
    routesInfo,
  } = props;

  const dispatch = useDispatch();

  const savedApartments = useRef(null);
  const [isSaved, setIsSaved] = useState(false);

  // Get a list of saved apartments
  const getSavedApartments = async () => {
    if (user) {
      const res = await axios.get(`/saved/user/${user._id}`);
      savedApartments.current = res.data;
    }
  };

  // When a user is logged in, get user's saved apartments
  useEffect(() => {
    if (user) {
      getSavedApartments();
    }
  }, [user]);

  // When user logs in/out or when user selects a different apartment, update "isSaved" state
  useEffect(() => {
    if (savedApartments.current && selectedApt) {
      if (!user) {
        setIsSaved(false);
      } else {
        const savedApt = savedApartments.current.filter(
          (apt) => apt.name === selectedApt.apt_name
        );
        setIsSaved(savedApt.length > 0);
      }
    }
  }, [user, selectedApt]);

  // Helper function to render a single row in the scrollable list
  const Row = ({ index, style }) => {
    const { destination, type, distance, score } = routesInfo[index];
    if (destination === "None") {
      return (
        <div
          key={index}
          className={index % 2 ? "ListItemOdd" : "ListItemEven"}
          style={style}
        >
          <p className="place-type">{placeTypes[type]}</p>
          <p className="not-found">No result within 2 miles</p>
        </div>
      );
    } else {
      return (
        <div
          key={index}
          className={index % 2 ? "ListItemOdd" : "ListItemEven"}
          style={style}
        >
          <p className="place-type">
            <img src={typeIcons[type]} height="25" width="25" />
            {placeTypes[type]}
          </p>
          <p className="place-name">{destination}</p>
          <p className="place-distance">{distance}</p>
          <p className="place-score score">{((1 - score) * 10).toFixed(2)}</p>
        </div>
      );
    }
  };

  /* -----------------------------------------------
          Display info on selected apartment
  ------------------------------------------------- */

  if (selectedApt) {
    const { apt_name, apt_address, apt_score } = selectedApt;

    // Event handler to save/unsave an apartment
    const toggleSave = async () => {
      if (!user) {
        dispatch(openPopUp());
      } else {
        if (!isSaved) {
          const marker = selectedApt.marker;
          delete selectedApt.marker;
          await axios.post("/saved", {
            data: {
              ...selectedApt,
              userId: user._id,
            },
          });
          selectedApt.marker = marker;
          await getSavedApartments();
          setIsSaved(true);
        } else {
          const savedApt = savedApartments.current.filter(
            (apt) => apt.apt_name === apt_name
          )[0];
          await axios.delete(`/saved/${savedApt._id}`);
          await getSavedApartments();
          setIsSaved(false);
        }
      }
    };

    const calculateTotalScore = () => {
      return routesInfo
        .reduce(
          (prev, { destination, score }) =>
            prev + (destination !== "None" && score),
          apt_score
        )
        .toFixed(10);
    };

    console.log(routesInfo.length);

    return (
      <div id="results" className="results-container routes">
        {/* <div className="apt-info"> */}
        <div className="top-info-apt">
          <h3>{apt_name}</h3>
          <p className="address">📍 {apt_address}</p>
          <p className="score">
            📊 {((1 - calculateTotalScore()) * 10).toFixed(2)}
          </p>
          <span className="like-icon">
            <i
              className={(isSaved ? "fas" : "far") + " fa-heart fa-2x"}
              onClick={toggleSave}
            ></i>
          </span>
        </div>
        {/* </div> */}
        {routesInfo && (
          <List
            className="List"
            height={400}
            itemCount={routesInfo.length}
            itemSize={120}
          >
            {Row}
          </List>
        )}
      </div>
    );
  } else {
    /* ------------------------------------------
            Display apartment ranking
  -------------------------------------------- */

    return (
      <div id="results" className="results-container">
        <h6 className="title">Top 50 Safest Apartments</h6>
        <Recommendations
          apartments={apartments}
          handleSelectApartment={handleSelectApartment}
          selectedPlaceTypes={selectedPlaceTypes}
        />
      </div>
    );
  }
}

export default Results;
