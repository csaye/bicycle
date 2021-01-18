import React from 'react';
import './App.css';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';

import Navbar from '../Navbar/Navbar.js';
import SignIn from '../SignIn/SignIn.js';
import SignUp from '../SignUp/SignUp.js';
import Home from '../Home/Home.js';

import firebase from 'firebase/app';
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
  return (
    <div className="Page">
      <Switch>
        <Route path="/signin">
          { !firebase.auth().currentUser ? <SignIn /> : <Redirect to="/" /> }
        </Route>
        <Route path="/signup">
          { !firebase.auth().currentUser ? <SignUp /> : <Redirect to="/" /> }
        </Route>
        <Route path="/">
          { firebase.auth().currentUser ? <Home /> : <Redirect to="/signin" /> }
        </Route>
      </Switch>
    </div>
  );
}

export default App;
