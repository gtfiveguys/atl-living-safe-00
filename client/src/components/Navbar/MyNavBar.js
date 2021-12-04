import React, { useState, useEffect, useRef } from "react";
import NavBar from "react-bootstrap/Navbar";
import { useDispatch, useSelector } from "react-redux";
import { openPopUp } from "../../store/actions";
import axios from "axios";
import "./NavBar.css";

const navItems = {
  Home: "/",
  Map: "/map",
  Analytics: "/analytics",
  About: "/about",
};

function MyNavBar(props) {
  const dispatch = useDispatch();
  const navBar = useRef(null);
  const [avatar, setAvatar] = useState(null);
  const [profileDropdown, setProfileDropdown] = useState(null);
  const [showProfileImg, setShowProfileImg] = useState(window.innerWidth > 768);
  const [toggleNavBar, setToggleNavBar] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const activePages = useSelector((state) => state.activePages);

  // When component is mounted, get user profile
  useEffect(() => {
    window.addEventListener("resize", () => {
      const width = window.innerWidth;
      if (width < 768) {
        setShowProfileImg(false);
      } else {
        setShowProfileImg(true);
        setToggleNavBar(false);
      }
    });
    axios
      .get("/auth/user", { withCredentials: true })
      .then((res) => props.setUser(res.data))
      .catch((err) => console.error(err));
  }, []);

  // Allow user to click anywhere on page outside of navbar to close navbar collapse
  useEffect(() => {
    if (navBar) {
      const handleClickOnPage = (e) => {
        if (!navBar.current.contains(e.target)) {
          setToggleNavBar(false);
        }
      };
      document.addEventListener("click", handleClickOnPage);
      return () => document.removeEventListener("click", handleClickOnPage);
    }
  }, [navBar]);

  // Allow user to click anywhere on page to close profile dropdown
  useEffect(() => {
    if (avatar) {
      const handleMouseOver = (e) => {
        if (
          avatar.contains(e.target) ||
          (profileDropdown && profileDropdown.contains(e.target))
        ) {
          setIsExpanded(true);
        } else if (!profileDropdown || !profileDropdown.contains(e.target)) {
          setIsExpanded(false);
        }
      };
      document.addEventListener("mouseover", handleMouseOver);
      return () => document.removeEventListener("mouseover", handleMouseOver);
    }
  }, [avatar, profileDropdown]);

  // Event handler for log out account
  const handleLogout = () => {
    axios.get("/auth/logout").then(() => {
      props.setUser(null);
      window.location.reload();
    });
  };

  // Helper function to render profile image
  const renderProfileImg = () => {
    if (props.user) {
      return (
        <div className="user">
          <div>
            <img
              ref={(ref) => setAvatar(ref)}
              className="avatar"
              src={props.user.image}
              alt="profile-img"
            />
            {isExpanded && renderProfileDropdown()}
          </div>
        </div>
      );
    } else {
      return (
        <div className="user">
          <div className="avatar guest" onClick={() => dispatch(openPopUp())}>
            ?
          </div>
        </div>
      );
    }
  };

  // Helper function to render profile dropdown
  const renderProfileDropdown = () => {
    return (
      <div
        ref={(ref) => setProfileDropdown(ref)}
        className="drop-down-container"
      >
        <div className="drop-down bg-light">
          <div className="header">
            <img className="avatar" src={props.user.image} alt="profile-img" />
            <div className="content">
              <h4 className="user-name">{props.user.displayName}</h4>
              <p className="user-email">{props.user.email}</p>
            </div>
          </div>
          <div className="line"></div>
          <div className="body">
            <a href="/dashboard">
              <p>Dashboard</p>
            </a>
            <p onClick={handleLogout}>Log out</p>
          </div>
        </div>
      </div>
    );
  };

  // Helper function to render profile-related items in navbar collapse
  const renderNavBarProfile = () => {
    if (props.user) {
      return (
        <ul className="navbar-nav">
          <li className="nav-item">
            <a
              href="/dashboard"
              className={"nav-link" + (activePages[4] ? " active" : "")}
            >
              Dashboard
            </a>
          </li>
          <li
            className="nav-item"
            onClick={handleLogout}
            style={{ cursor: "pointer" }}
          >
            <a className="nav-link">Log out</a>
          </li>
        </ul>
      );
    } else {
      return (
        <ul className="navbar-nav">
          <li
            className="nav-item"
            onClick={() => dispatch(openPopUp())}
            style={{ cursor: "pointer" }}
          >
            <a className="nav-link">Sign in</a>
          </li>
        </ul>
      );
    }
  };

  return (
    <div ref={navBar}>
      <nav className="navbar navbar-expand-md navbar-light bg-light fixed-top">
        <a className="navbar-brand" href="/">
          ATLivingSafe
        </a>
        <button
          className="navbar-toggler"
          type="button"
          onClick={() => setToggleNavBar(!toggleNavBar)}
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <NavBar.Collapse in={toggleNavBar}>
          <ul className="navbar-nav">
            {Object.entries(navItems).map(([navName, navUrl], i) => (
              <li key={i} className="nav-item">
                <a
                  href={navUrl}
                  className={"nav-link" + (activePages[i] ? " active" : "")}
                >
                  {navName}
                </a>
              </li>
            ))}
            {showProfileImg ? renderProfileImg() : renderNavBarProfile()}
          </ul>
        </NavBar.Collapse>
      </nav>
    </div>
  );
}

export default MyNavBar;
