import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setActivePage } from "../../store/actions";
import people from "./people";
import "./About.css";

function About() {
  const dispatch = useDispatch();
  console.log(window.location.href);

  useEffect(() => {
    dispatch(setActivePage(3));
  }, []);

  return (
    <div id="about-us">
      <section className="overview">
        <h1 className="heading">About</h1>
        <p className="text">
          Our team is a group of master's students studying Computer Science and
          Data Science at Georgia Tech. We came together to complete a school
          project, but in the process became a team with a passion and devotion
          to building a product that helps{" "}
          <span className="atlanta">Atlanta</span> students, us included, to
          live safer and smarter.
        </p>
        <p className="text">
          This website is built with <span className="code">React.js</span> for
          frontend and <span className="code">Node.js</span> for backend. We
          adopted multiple machine learning models to extract insights from{" "}
          <a
            className="link"
            href="https://www.atlantapd.org/community/community-policing-programs/youth-programs"
          >
            Atlanta Crime Database
          </a>{" "}
          collected by Atlanta Police Department. For more details, see{" "}
          <a
            className="link"
            href="https://github.com/gtfiveguys/atl-living-safe"
          >
            github
          </a>
          .
        </p>
        <p className="text">
          Lastly, if you have a minute, please share with us your experience via
          this{" "}
          <a
            className="survey"
            href="https://docs.google.com/forms/d/e/1FAIpQLScbqJcXlhDY4OxyJeCFToyrL57edFNE-qiiyRcbMJEs9Zwu3Q/viewform"
          >
            form
          </a>{" "}
          to help us improve this website!
        </p>
      </section>
      <section className="team">
        <h1 className="heading">Meet the Team</h1>
        <div className="people row">
          {people.map((person, i) => (
            <div key={i} className="person col-12 col-md-6 col-lg-4">
              <img src={person.image} alt="profile-img" className="image" />
              <p className="name">{person.name}</p>
              {/* <p className="description">{person.description}</p> */}
              <p className="description">
                arcu cursus euismod quis viverra nibh cras pulvinar mattis nunc
                sed blandit libero volutpat sed cras ornare arcu dui vivamus
              </p>
              <div className="contact">
                <a href={person.contact.LinkedIn} className="linked-in">
                  Linkedin
                </a>
                |
                <a href={person.contact.Email} className="email">
                  Email
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default About;
