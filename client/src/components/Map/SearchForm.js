import React, { useState } from "react";
import Select from "react-select";
import "./SearchForm.css";

// All available types of place
const placeTypes = [
  { value: "university", label: "University" },
  { value: "supermarket", label: "Supermarket" },
  { value: "gas_station", label: "Gas station" },
  { value: "gym", label: "Gym" },
  { value: "subway_station", label: "Subway station" },
  { value: "bus_station", label: "Bus station" },
  { value: "drugstore", label: "Drugstore" },
  { value: "pharmacy", label: "Pharmacy" },
  { value: "convenience_store", label: "Convenience store" },
  { value: "restaurant", label: "Restaurant" },
  { value: "police", label: "Police" },
  { value: "park", label: "Park" },
  { value: "cafe", label: "Cafe" },
  { value: "bank", label: "Bank" },
];

// All available travel modes
const travelModes = [
  { value: "DRIVING", label: <span className="driving">🚘</span> },
  { value: "WALKING", label: <span className="walking">🚶</span> },
  { value: "BICYCLING", label: <span className="bicycling">🚲</span> },
  { value: "TRANSIT", label: <span className="transit">🚊</span> },
];

function SearchForm(props) {
  const { selectedPlaceTypes, setSelectedPlaceTypes, setTravelMode } = props;

  // Controlled components: initialize DRIVING as checked by default
  const [travelModeChecked, setTravelModeChecked] = useState(
    travelModes.map((mode, i) => i === 0)
  );

  // Event handler for checking a travel mode
  const handleTravelModeClick = (index) => {
    setTravelModeChecked(travelModeChecked.map((_, i) => i === index));
    setTravelMode(travelModes[index].value);
  };

  // Event handler for selecting/unselecting a type of place
  const handleSelectType = (selectedTypes) => {
    setSelectedPlaceTypes(selectedTypes);
  };

  return (
    <div id="search-form" className="search-container">
      <div className="first-line">
        <h5 className="heading">
          <span>➡️</span> Where do you go everyday?
        </h5>
        <div className="travel-mode-container">
          {travelModes.map((mode, i) => (
            <div
              key={i}
              className="travel-mode"
              onClick={() => handleTravelModeClick(i)}
            >
              <input
                className="radio"
                type="radio"
                name="travel-mode"
                value={mode.value}
                checked={travelModeChecked[i]}
                readOnly
              />
              <label htmlFor={mode.value}>
                <div
                  className={
                    "circle" + (travelModeChecked[i] ? " checked" : "")
                  }
                >
                  {mode.label}
                </div>
              </label>
            </div>
          ))}
        </div>
      </div>
      <Select
        className="place-type-select"
        options={placeTypes}
        value={selectedPlaceTypes}
        onChange={handleSelectType}
        isMulti
        isSearchable
        autoFocus
        closeMenuOnSelect={false}
        placeHolder="hahah"
      ></Select>
    </div>
  );
}

export default SearchForm;
