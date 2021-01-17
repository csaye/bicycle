import React from 'react';
import './App.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';

import Navbar from '../Navbar/Navbar.js';
import SignIn from '../SignIn/SignIn.js';
import SignUp from '../SignUp/SignUp.js';

import firebase from 'firebase/app';
// import 'firebase/auth';
// import 'firebase/firestore';
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
          <p>Home</p>
        </Route>
      </Switch>
    </div>
  );
}

export default App;
