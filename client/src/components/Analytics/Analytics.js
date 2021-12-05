import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setActivePage } from "../../store/actions";
import "./Analytics.css";

function Analytics() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setActivePage(2));
  }, []);

  return (
    <div className="hello-background">
      <div className="banner">
        <div className="wrap">
          <h1>Analytics</h1>
        </div>
      </div>
      <div className="analytics">
        <p className="toptitle"> Atlanta Crime Rate Overview </p>
        <div className="wrap row">
          <div className="div col-12 col-lg-6">
            <div className="plot">
              <iframe
                title="Top 10 neighborhood"
                scrolling="no"
                seamless="seamless"
                src="https://kira351.github.io/analytics4/"
                height="400"
                width="100%"
              ></iframe>
            </div>
          </div>
          <div className="div col-12 col-lg-6">
            <div className="plot">
              <iframe
                title="Top 10 neighborhood"
                scrolling="no"
                seamless="seamless"
                src="https://kira351.github.io/analytics5/"
                height="400"
                width="100%"
              ></iframe>
            </div>
          </div>
          <div className="div col-12 collgd-6">
            <div className="plot">
              <iframe
                title="Top 10 neighborhood"
                scrolling="no"
                seamless="seamless"
                src="https://kira351bnu.github.io/analytics6/"
                height="400"
                width="100%"
              ></iframe>
            </div>
          </div>
          <div className="div col-12 col-lg-6">
            <div className="plot">
              <iframe
                title="Top 10 neighborhood"
                scrolling="no"
                seamless="seamless"
                src="https://kira351bnu.github.io/analytics7/"
                height="400"
                width="100%"
              ></iframe>
            </div>
          </div>
        </div>
        <div className="mybackground">
          <div className="wrap">
            <div className="list row">
              <div className="r-content col-12 col-lg-6">
                <div className="big">
                  <p className="title">
                    Which Neighborhoods are the most dangerous in Atlanta?
                  </p>
                  <p className="content">
                    Considering number of crimes happens in a certain
                    neighborhood and the population size in that neighborhood,
                    the top 10 neighborhoods with highest crime rate are:
                    Downtown, Lindbergh/Morosgo, Vine City, Lakewood Heights,
                    West End, Midtown, English Avenue, Home Park, Underwoods
                    Hills and Adamsville.
                  </p>
                </div>
              </div>
              <div className="dn col-12 col-lg-6">
                <iframe
                  title="Top 10 neighborhood"
                  scrolling="no"
                  seamless="seamless"
                  src="https://kirash351.github.io/plotly-analytics1/"
                  height="500"
                  width="100%"
                ></iframe>
                <p className="small-title">Note</p>
                <p className="small-content">
                  Crime rate: total number of crimes in a certain neighborhood
                  for the past 2 years / population size in that neighborhood
                </p>
                <p className="small-content">
                  Keep your mouse on a neighborhood's bar to see more details.
                </p>
              </div>
            </div>
            <div className="line"></div>
            <div className="list row">
              <div className="dn col-12 col-lg-6">
                <iframe
                  title="Top 10 neighborhood monthly data"
                  scrolling="no"
                  seamless="seamless"
                  src="https://kirash351.github.io/ploty-analytics2/"
                  height="500"
                  width="100%"
                ></iframe>
                <p className="small-title">Note</p>
                <p className="small-content">
                  Click the button on the top left corner to see the how montly
                  crime rate varied for the past 6 months/1 years/2 years.
                </p>
                <p className="small-content">
                  Click once on the colored legend to hide a neighborhood's
                  data. Click again to unhide.
                </p>
              </div>
              <div className="r-content col-12 col-lg-6">
                <div className="big">
                  <p className="title">
                    How the crime rate in those neighborhoods varied in the past
                    2 years?
                  </p>
                  <p className="content">
                    The crime rates in the top 10 dangerous neighborhoods have
                    been relatively stable, but there still have been small
                    fluctuations. Note that in April 2020, the crime rates in
                    each neighborhood reached their lowest point. The decline in
                    the crime rates may be related to the quarantine during the
                    outbreak of the Covid-19. Starting from June 2020 to August
                    2020, the crime rates has continued to rise. At the same
                    time, the George Floyd protests occurs in Atlanta, which is
                    likely to be one of the reasons for the increase in crime
                    rate. This year, crime rates in different neighborhood began
                    to rise slowly. One possible reason is that the pandic is
                    getting better and people are going out more frequently.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="wrap">
          <div className="listform">
            <div className="big">
              <p className="title">
                What's the crime rate in your neighborhood?
              </p>
              <p className="content">
                Feel free to select the neighborhood where your apartment is
                located to gain more insights!
              </p>
            </div>
            <div className="iframebox">
              <iframe
                title="Neighborhood daily detail"
                scrolling="no"
                seamless="seamless"
                src="https://kirash351.github.io/ploty-analytics3/"
                height="500"
                width="100%"
              ></iframe>
              <p className="small-title">Note</p>
              <p className="small-content">
                Click the neighborhood selection box to show the dropdown list
                and see crime data in all the neighborhoods in Atlanta.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Analytics;
