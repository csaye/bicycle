import React from 'react';
import './App.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';

import Navbar from '../Navbar/Navbar.js';
import SignIn from '../SignIn/SignIn.js';
import SignUp from '../SignUp/SignUp.js';

import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
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
          {/* Show SignOut if user signed in*/}
          { firebase.auth().currentUser && <SignOut /> }
        </header>
        <section>
          {/* Show Homescreen if user signed in and SignIn otherwise */}
          {/*firebase.auth().currentUser ? <Homescreen /> : <SignIn />*/}
          <Homescreen />
        </section>
      </Router>
    </div>
  );
}

// Homescreen component
function Homescreen() {
  return (
    <div className="Homescreen">
      <Switch>
        <Route path="/signin">
          <SignIn />
        </Route>
        <Route path="/signup">
          <SignUp />
        </Route>
        <Route path="/">
          <p>Bicycle Home</p>
        </Route>
      </Switch>
    </div>
  );
}

// SignOut component
function SignOut() {
  return (
    <div className="SignOut">
      <p>Signed in as {firebase.auth().currentUser.displayName}</p>
      <button onClick={() => firebase.auth().signOut()}>Sign Out</button>
    </div>
  );
}

export default App;
