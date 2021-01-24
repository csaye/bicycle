import { Link } from 'react-router-dom';
import logo from '../../img/logo.png';
import './About.css';

function About() {
  return (
    <div className="About Form hover-shadow flex-col">
      {/* Title */}
      <h1>Bicycle</h1>
      <p className="tagline">
      A minimalist social media placing its users first.
      Post thoughts, connect with friends, and keep it simple on Bicycle.
      </p>
      <div className="links">
        <Link to="/signin">Sign in</Link> | <Link to="/signup">Sign up</Link>
      </div>
      <hr />
      {/* GitHub */}
      <p className="text-center">
      Bicycle is <span className="font-weight-bold">100% open source.</span>
      <br />
      Have an issue? Want to contribute? Find our GitHub here:
      <br />
      <i className="fab fa-github icon-black"></i> <a
      href="https://github.com/csaye/bicycle"
      target="_blank"
      rel="noreferrer">
      Bicycle GitHub
      </a>
      </p>
      <hr />
      {/* Quote */}
      <h2 className="text-center font-italic font-weight-bold">
      “No one got upset when bicycles showed up.
      </h2>
      <p className="text-center font-italic">
      If something is a tool, it genuinely is just sitting there,
      waiting patiently. If something is not a tool, it’s demanding
      things from you...That’s what’s
      changed.
      <span className="font-weight-bold"> Social media isn’t a tool that’s just waiting to be used. </span>
      It has its own goals, and it has its own means of pursuing
      them by using your psychology against you.”
      </p>
      <p>
      - <a href="https://www.tristanharris.com/" target="_blank" rel="noreferrer">
      Tristan Harris
      </a> (former Google design ethicist)
      </p>
      <hr />
      <p className="text-center">
      Bicycle, founded on the principles of privacy, safety, and simplicity,
      <span className="font-weight-bold"> aims to be that tool. </span>
      We leave behind all that hinders modern social media —
      data collection, targeted advertising, and number-focused engagement —
      to provide a way for people to just share their thoughts and connect.
      </p>
      <img src={logo} alt="logo" />
      <p>Thank you for using Bicycle.</p>
    </div>
  );
}

export default About;
