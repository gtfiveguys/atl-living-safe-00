import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setActivePage } from "../../store/actions";
import "./Hello.css";

function Hello(props) {
  const { user } = props;
  const dispatch = useDispatch();

  const [isLogin, setIsLogin] = useState(false);
  const [imageFirst, setImageFirst] = useState(window.innerWidth < 992);

  useEffect(() => {
    window.addEventListener("resize", () => {
      setImageFirst(window.innerWidth < 992);
    });
  }, []);

  useEffect(() => {
    dispatch(setActivePage(0));

    // console.log("Hello, user " +  user)
    if (user) {
      // console.log("set isLogin to true");
      setIsLogin(true);
    } else {
      // console.log("set isLogin to false");
      setIsLogin(false);
    }
  }, [user]);

  const renderPic = () => {
    return (
      <div className="hellopic col-lg-7 col-md-12">
        <img
          src="https://i.loli.net/2021/12/01/Fkjict2uOhbe6dT.png"
          alt="home-bg-img"
        />
      </div>
    );
  };

  const renderOverview = () => {
    return (
      <div className="overview col-lg-5 col-md-12">
        <h1 className="atltitle">
          Live safer,
          <br /> Live smarter.
        </h1>
        <h1 className="slogan">
          Looking for an apartment where you can relax after a day of intense
          study? ATLivingSafe uses machine learning to identify safe options for
          you.
        </h1>
        {!isLogin && (
          <form
            className="sign-in-container"
            onSubmit={(e) => e.preventDefault()}
          >
            <a
              className="sign-in-button google"
              href="http://localhost:5000/auth/google"
            >
              <i className="fab fa-google"></i> Sign In with Google
            </a>
            <a
              className="sign-in-button guest"
              href="http://localhost:3000/map"
            >
              Continue as Guest
            </a>
          </form>
        )}
        {isLogin && (
          <a className="sign-in-button start" href="http://localhost:3000/map">
            Get Started
          </a>
        )}
      </div>
    );
  };

  return imageFirst ? (
    <div className="hello-container row">
      {renderPic()}
      {renderOverview()}
    </div>
  ) : (
    <div className="hello-container row">
      {renderOverview()}
      {renderPic()}
    </div>
  );
}

export default Hello;
