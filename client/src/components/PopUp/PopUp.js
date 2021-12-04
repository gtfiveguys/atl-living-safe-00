import React from "react";
import { useDispatch } from "react-redux";
import { closePopUp } from "../../store/actions";
import "./PopUp.css";

function PopUp() {
  const dispatch = useDispatch();
  return (
    <div id="pop-up">
      <span>Sign in and save your favorite apartments!</span>
      <div className="sign-in-google">
        <a href="http://localhost:5000/auth/google">
          <i className="fab fa-google"></i> Sign In with Google
        </a>
      </div>
      <i
        className="fas fa-times close"
        onClick={() => dispatch(closePopUp())}
      ></i>
    </div>
  );
}

export default PopUp;
