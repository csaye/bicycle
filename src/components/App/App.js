import React, { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';

import Navbar from '../Navbar/Navbar.js';
import SignIn from '../SignIn/SignIn.js';
import SignUp from '../SignUp/SignUp.js';
import Profile from '../Profile/Profile.js';
import UserList from '../UserList/UserList.js';
import Settings from '../Settings/Settings.js';
import About from '../About/About.js';
import Friends from '../Friends/Friends.js';

import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';
import { firebaseConfig } from '../../util/firebaseConfig.js';

// initialize firebase
firebase.initializeApp(firebaseConfig);

// App component
function App() {
  useAuthState(firebase.auth());

  return (
    <div className="App">
      <Router>
        <header>
          <Navbar />
        </header>
        <section>
          <Page />
        </section>
      </Router>
    </div>
  );
}

// Page component
function Page() {
  // get username
  let [username, setUsername] = useState(undefined);
  async function getUsername() {
    // if not signed in, return
    if (!firebase.auth().currentUser) return;
    // get username with uid
    const uid = firebase.auth().currentUser.uid;
    const userData = await firebase.firestore().collection('users').doc(uid).get();
    setUsername(userData.data()?.username);
  }

  // get username when auth state changed
  useEffect(() => {
    firebase.auth().onAuthStateChanged(() => {
      getUsername();
    });
  });

  // if signed in but no username, wait
  if (firebase.auth().currentUser && !username) {
    return (
      <div className="Page"></div>
    );
  }

  // if not signed in or signed in with username
  return (
    <div className="Page">
      <Switch>
        {/* signin page */}
        <Route path="/signin">
        {
          firebase.auth().currentUser ?
          <Redirect to={`/${username}`} /> :
          <SignIn />
        }
        </Route>
        {/* signup page */}
        <Route path="/signup">
        {
          firebase.auth().currentUser ?
          <Redirect to={`/${username}`} /> :
          <SignUp />
        }
        </Route>
        {/* users page */}
        <Route path="/users">
        {
          firebase.auth().currentUser ?
          <UserList /> :
          <Redirect to="/signin" />
        }
        </Route>
        {/* friends page */}
        <Route path="/friends">
        {
          firebase.auth().currentUser ?
          <Friends /> :
          <Redirect to="/signin" />
        }
        </Route>
        {/* settings page */}
        <Route path="/settings">
        {
          firebase.auth().currentUser ?
          <Settings /> :
          <Redirect to="/signin" />
        }
        </Route>
        {/* about page */}
        <Route path="/about">
          <About />
        </Route>
        {/* username page */}
        <Route path="/:username">
          <Profile />
        </Route>
        {/* no page */}
        <Route path="/">
        {
          firebase.auth().currentUser ?
          <Redirect to={`/${username}`} /> :
          <Redirect to="/signin" />
        }
        </Route>
      </Switch>
    </div>
  );
}

export default App;
