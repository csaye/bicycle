import './Navbar.css';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import firebase from 'firebase/app';
import logo from '../../img/logo.png';

// Navbar component
function Navbar() {
  let [username, setUsername] = useState('');

  function signOut() {
    firebase.auth().signOut();
    window.location.href = '/signin';
  }

  function searchUser(e) {
    e.preventDefault();
    if (!username) return;
    window.location.href = `/${username}`;
  }

  return (
    <div className="Navbar">
      <nav className="navbar navbar-expand-lg navbar-light">
        <a className="navbar-brand" href="/"><img src={logo} /></a>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ml-auto">
            {
              firebase.auth().currentUser &&
              <li className="nav-item">
                <Link to="/" className="link">Home</Link>
              </li>
            }
            {
              firebase.auth().currentUser &&
              <li className="nav-item">
                <Link to="/users" className="link">Users</Link>
              </li>
            }
            {
              !firebase.auth().currentUser &&
              <li className="nav-item">
                <Link to="/signin" className="link">Sign in</Link>
              </li>
            }
            {
              !firebase.auth().currentUser &&
              <li className="nav-item">
                <Link to="/signup" className="link">Sign up</Link>
              </li>
            }
            {
              firebase.auth().currentUser &&
              <li className="nav-item">
                <button onClick={signOut}>Sign Out</button>
                <p>Signed in as {firebase.auth().currentUser.displayName}</p>
              </li>
            }
            {/* Search User */}
            {
              firebase.auth().currentUser &&
              <li className="nav-item">
                <form onSubmit={searchUser}>
                  <button type="submit">Search User</button>
                  <input
                  value={username}
                  type="text"
                  placeholder="username"
                  onChange={e => setUsername(e.target.value)}
                  pattern="[A-Za-z0-9_]{3,16}"
                  required
                  />
                </form>
              </li>
            }
            </ul>
          </div>
      </nav>
    </div>
  );
}

export default Navbar;
