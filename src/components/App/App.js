import React from 'react';
import './App.css';
import { useAuthState } from 'react-firebase-hooks/auth';

import SignIn from '../SignIn/SignIn.js';
// import ChooseUsername from '../SignIn/ChooseUsername.js';

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
      <header>
        <Navbar />
        {/* Show SignOut if user signed in*/}
        { firebase.auth().currentUser && <SignOut /> }
      </header>
      <section>
        {/* Show Homescreen if user signed in and SignIn otherwise */}
        { firebase.auth().currentUser ? <Homescreen /> : <SignIn /> }
      </section>
    </div>
  );
}

// Homescreen component
function Homescreen() {
  // console.log(auth.currentUser);
  return (
    <div className="Homescreen">
      <p>Homescreen</p>
    </div>
  );
}

// Navbar component
function Navbar() {
  return (
    <div className="Navbar">
      <p>Navbar</p>
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
