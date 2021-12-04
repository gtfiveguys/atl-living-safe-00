import React, { useState, useEffect, useRef } from "react";
import Collapse from "react-bootstrap/Collapse";
import { useDispatch } from "react-redux";
import { setActivePage, openPopUp } from "../../store/actions";
import axios from "axios";
import "./Dashboard.css";

/* ----------------------------------
                Icons
------------------------------------*/

// Arrow icons
const arrowIcons = {
  up: <i className="fas fa-long-arrow-alt-up" />,
  down: <i className="fas fa-long-arrow-alt-down" />,
};

// Collase toggle icons
const collapseIcons = {
  true: <i className="fas fa-caret-down collapse-toggle" />,
  false: <i className="fas fa-caret-right collapse-toggle" />,
};

// Plus/minus icons
const plusMinusIcons = {
  plus: <i className="fas fa-plus" />,
  minus: <i className="fas fa-minus" />,
  slash: <i className="fas fa-slash" />,
};

/* ----------------------------------------
            Rank keys and orders
------------------------------------------*/

// Field and ranking order (default = 0, i.e. from most recent to oldest)
const orders = { apt_name: 0, apt_address: 0, apt_score: 0 };

// All available place types
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

function Dashboard() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setActivePage(4));
  }, []);

  const dashboard = useRef(null);
  const [user, setUser] = useState(null);
  const [savedApartments, setSavedApartments] = useState([]);
  const [rankOrders, setRankOrders] = useState(orders);
  const [collapseToggles, setCollapseToggles] = useState([]);
  const [toggleTypes, setToggleTypes] = useState([]);
  const [macroToggleTypes, setMacroToggleTypes] = useState(
    Array(placeTypes.length).fill(false)
  );
  const [toggleControlPanel, setToggleControlPanel] = useState(false);

  // When component is mounted, get user profile and user's saved apartments
  useEffect(() => {
    axios
      .get("/auth/user", { withCredentials: true })
      .then((res) => {
        if (!res.data) {
          dispatch(openPopUp());
        } else {
          getSavedApartments(res.data._id);
          setUser(res.data);
        }
      })
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    console.log("here");
    if (dashboard) {
      setTimeout(() => {
        setToggleControlPanel(true);
      }, 750);
    }
  }, [dashboard]);

  // Get saved apartments by userId
  const getSavedApartments = (userId) => {
    axios
      .get(`/saved/user/${userId}`)
      .then((res) => {
        let rankKey = "createdAt",
          rankOrder = 0;
        Object.entries(rankOrders).forEach(([key, value]) => {
          if (value !== 0) {
            rankKey = key;
            rankOrder = value;
          }
        });
        const savedApartments = rankBy(res.data, rankKey, rankOrder);
        setCollapseToggles(Array(savedApartments.length).fill(false));
        setToggleTypes(
          savedApartments.map(() => Array(placeTypes.length).fill(false))
        );
        setSavedApartments(savedApartments);
      })
      .catch((err) => console.error(err));
  };

  // Rank saved apartments by field and order
  // Toggle between "ascending", "descending", and "by date created"
  const rankBy = (apartments, key, order) => {
    // Rank order sequence:
    // 1 (ascending) -> -1 (descending) -> 0 (by date created)
    Object.keys(rankOrders).forEach((key) => (rankOrders[key] = 0));
    rankOrders[key] = order;
    setRankOrders(rankOrders);

    if (order === 0 || key === "createdAt") {
      apartments.sort(
        (a, b) => new Date(b["createdAt"]) - new Date(a["createdAt"])
      );
    } else if (key === "apt_score") {
      apartments.sort((a, b) => {
        return order === 1 ? a[key] - b[key] : b[key] - a[key];
      });
    } else {
      apartments.sort((a, b) => {
        return order === 1
          ? a[key].localeCompare(b[key])
          : b[key].localeCompare(a[key]);
      });
    }

    return apartments;
  };

  /* ----------------------------------
              Event Handlers
  ------------------------------------*/

  // Event handler to delete saved apartment by apartment's id
  const handleDeleteApt = async (apt, aptId) => {
    if (window.confirm(`Remove ${apt.apt_name} from your saved list?`)) {
      await axios.delete(`/saved/${apt._id}`);
      savedApartments.splice(aptId, 1);
      setSavedApartments([...savedApartments]);
      collapseToggles.splice(aptId, 1);
      setCollapseToggles([...collapseToggles]);
      toggleTypes.splice(aptId, 1);
      setToggleTypes([...toggleTypes]);
    }
  };

  // Event handler to sort saved apartments
  const handleRank = (field) => {
    const order = rankOrders[field] + 1 <= 1 ? rankOrders[field] + 1 : -1;
    const sorted = rankBy(savedApartments, field, order);
    setSavedApartments([...sorted]);
  };

  // Event handler for collapse/uncollapse an apartment
  const handleCollapseToggle = (i) => {
    collapseToggles[i] = !collapseToggles[i];
    setCollapseToggles([...collapseToggles]);
  };

  // Event handler for showing/collapsing all apartments
  const handleCollapseAll = (show) => {
    setCollapseToggles(Array(savedApartments.length).fill(show));
  };

  // Event handler for adding/removing a type of place
  const toggleSingleType = (aptId, typeId) => {
    const added = toggleTypes[aptId][typeId];
    toggleTypes[aptId][typeId] = !added;
    setToggleTypes([...toggleTypes]);
  };

  // Event handler for adding/removing all types of place
  const toggleAllTypes = (apt, aptId, action) => {
    toggleTypes[aptId] = placeTypes.map(
      (type) => action === "plus" && apt[`${type.value}_name`] !== "None"
    );
    setToggleTypes([...toggleTypes]);
  };

  // Event handler for adding/removing a single type for all apartments
  const toggleSingleTypeOfAllApartments = (typeId) => {
    const added = macroToggleTypes[typeId];
    macroToggleTypes[typeId] = !added;
    toggleTypes.forEach((aptTypes, aptId) => {
      if (
        savedApartments[aptId][`${placeTypes[typeId].value}_name`] !== "None"
      ) {
        aptTypes[typeId] = !added;
      }
    });
    setMacroToggleTypes([...macroToggleTypes]);
    setToggleTypes([...toggleTypes]);
  };

  /* ---------------------------------
            Helper functions
  -----------------------------------*/

  // Calculate the total score of an apartment
  const calculateTotalScore = (apt, aptId) => {
    const totalScore = placeTypes.reduce(
      (prev, type, typeId) =>
        prev + (toggleTypes[aptId][typeId] && apt[`${type.value}_score`]),
      apt.apt_score
    );
    return totalScore;
  };

  // Helper function for rendering body container's header
  const renderBodyHeader = () => {
    return (
      <div className="header">
        <h2>Saved apartments</h2>
        <span>
          <i
            className="fas fa-sync-alt"
            onClick={() => getSavedApartments(user._id)}
          ></i>
        </span>
        <button onClick={() => handleCollapseAll(true)}>Expand All</button>
        <button onClick={() => handleCollapseAll(false)}>Collapse All</button>
        <p>
          Showing {savedApartments.length}
          {savedApartments.length > 1 ? " results" : " result"}
        </p>
      </div>
    );
  };

  // Helper function for rendering apartment header
  const renderAptHeader = () => {
    const renderArrow = (key) => {
      if (rankOrders[key] === 1) {
        return <span>{arrowIcons.up}</span>;
      } else if (rankOrders[key] === -1) {
        return <span>{arrowIcons.down}</span>;
      }
    };

    return (
      <div className="apartment apartment-header">
        <p onClick={() => handleRank("apt_name")} className="apt-name">
          Name {renderArrow("apt_name")}
        </p>
        <p onClick={() => handleRank("apt_address")} className="apt-address">
          Address {renderArrow("apt_address")}
        </p>
        <p onClick={() => handleRank("apt_score")} className="apt-score">
          Safety Score {renderArrow("apt_score")}
        </p>
      </div>
    );
  };

  // Helper function for rendering an apartment
  const renderApt = (apt, aptId) => {
    return (
      <div
        className="apartment apartment-row"
        onClick={() => handleCollapseToggle(aptId)}
      >
        <span>{collapseIcons[collapseToggles[aptId]]}</span>
        <p className="apt-name">{apt.apt_name}</p>
        <p className="apt-address">{apt.apt_address.slice(0, -17)}</p>
        {/* <p className="apt-score">{calculateTotalScore(apt, aptId)}</p> */}
        <p
          className={
            (1 - calculateTotalScore(apt, aptId)) * 10 > 5
              ? "apt-score-high"
              : "apt-score-low"
          }
        >
          {((1 - calculateTotalScore(apt, aptId)) * 10).toFixed(2)}
        </p>

        <i
          className="fas fa-trash apt-delete"
          onClick={(e) => {
            e.stopPropagation();
            handleDeleteApt(apt, aptId);
          }}
        ></i>
      </div>
    );
  };

  // Helper function for rendering collapse list header
  const renderCollapseHeader = (apt, aptId) => {
    return (
      <div>
        <div className="type-container ">
          <h6 className="place-type">Nearby facilities</h6>
        </div>

        <div className="type-container title">
          <div className="macro-toggles">
            <span
              onClick={() => toggleAllTypes(apt, aptId, "plus")}
              className="all-types"
            >
              {plusMinusIcons.plus}
            </span>
            <span
              onClick={() => toggleAllTypes(apt, aptId, "minus")}
              className="all-types"
            >
              {plusMinusIcons.minus}
            </span>
          </div>
          <p className="place-type">Type of Place</p>
          <p className="place-name">Name of Place</p>
          <p className="place-score">Safety Score</p>
        </div>
      </div>
    );
  };

  // Helper function for rendering collapse list
  const renderCollapseList = (apt, aptId) => {
    const renderCollapseItem = (apt, aptId, type, typeId) => {
      const exists = apt[`${type.value}_name`] !== "None";
      const added = toggleTypes[aptId][typeId];
      const handleClick = () => exists && toggleSingleType(aptId, typeId);
      const toggleIcon = () => {
        if (!exists) {
          return (
            <span className="single-type no-result">
              {plusMinusIcons.slash}
            </span>
          );
        } else {
          return (
            <span className={"single-type" + (added ? " added-icon" : "")}>
              {added ? plusMinusIcons.minus : plusMinusIcons.plus}
            </span>
          );
        }
      };
      return (
        <div>
          <div
            className={`type-container ${exists ? "" : "no-result"} ${
              added && "added-text"
            }`}
            onClick={handleClick}
          >
            {toggleIcon()}
            <p className="place-type">{type.label}</p>
            <p className="place-name">
              {exists ? apt[`${type.value}_name`] : "(No result)"}
            </p>
            <p className="place-score">
              {exists
                ? ((1 - apt[`${type.value}_score`]) * 10).toFixed(2)
                : "(0.00)"}
            </p>
          </div>
        </div>
      );
    };

    return placeTypes.map((type, j) => (
      <div key={j}>{renderCollapseItem(apt, aptId, type, j)}</div>
    ));
  };

  // Helper function for rendering control panel
  const renderControlPanel = () => {
    return (
      <div>
        <div className={"control-panel" + (!toggleControlPanel ? " show" : "")}>
          <span onClick={() => setToggleControlPanel(false)}>
            <i className="fas fa-times" />
          </span>
          <p className="heading">Control Panel</p>
          {placeTypes.map((type, i) => (
            <div
              key={i}
              className="type"
              onClick={() => toggleSingleTypeOfAllApartments(i)}
            >
              <span
                className={
                  "single-type" + (macroToggleTypes[i] ? " added-icon" : "")
                }
              >
                {plusMinusIcons[macroToggleTypes[i] ? "minus" : "plus"]}
              </span>
              <p
                className={
                  "type-name" + (macroToggleTypes[i] ? " added-text" : "")
                }
              >
                {type.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderControlPanelCollapseButton = () => {
    if (!toggleControlPanel) {
      return (
        <div
          className="control-panel-collapse-btn"
          onClick={() => setToggleControlPanel(true)}
        >
          <span>
            <i className="fas fa-bars"></i>
          </span>
        </div>
      );
    }
  };

  /* ----------------------------------
                Rendering
  ------------------------------------*/

  // TODO: If user is not logged in, redirect to sign in page
  if (!user) {
    return <div></div>;
  }

  return (
    <div className="dashboard" ref={dashboard}>
      {renderControlPanel()}
      {renderControlPanelCollapseButton()}
      <div className="header-container">
        <h2 className="title">🏠Dashboard</h2>
        <h1 className="greeting">WELCOME {user.firstName.toUpperCase()}</h1>
      </div>
      <div className={"body-container" + (toggleControlPanel ? " shrink" : "")}>
        {renderBodyHeader()}
        <div className="apartment-container">
          {renderAptHeader()}
          {savedApartments.map((apt, i) => (
            <div key={i}>
              {renderApt(apt, i)}
              <Collapse in={collapseToggles[i]}>
                <div className="collapse-container">
                  {renderCollapseHeader(apt, i)}
                  {renderCollapseList(apt, i)}
                </div>
              </Collapse>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
