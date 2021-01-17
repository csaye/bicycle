import React, { useState } from 'react';
import './App.css';
import { useAuthState } from 'react-firebase-hooks/auth';

import firebase from 'firebase/app';
import 'firebase/auth';
// import 'firebase/firestore';
import { firebaseConfig } from './private/firebaseConfig.js';

// initialize firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
// const firestore = firebase.firestore();

// App component
function App() {
  useAuthState(auth);

  function username() {
    // get current user username
    return false;
  }

  return (
    <div className="App">
      <header>
        <Navbar />
        { auth.currentUser && <SignOut /> }
      </header>
      <section>
        {/* User not signed in */}
        { !auth.currentUser && <SignIn /> }
        {/* User signed in without username */}
        { auth.currentUser && !username() && <ChooseUsername /> }
        {/* User signed in with username */}
        { auth.currentUser && username() && <Homescreen /> }
      </section>
    </div>
  );
}

// Homescreen component
function Homescreen() {
  console.log(auth.currentUser);

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

// ChooseUsername component
function ChooseUsername() {
  let [username, setUsername] = useState('');

  async function chooseUsername(e) {
    e.preventDefault();
    // set username
  }

  return (
    <div className="ChooseUsername">
      <form onSubmit={chooseUsername}>
        {/* Username */}
        <label htmlFor="usernameInput">Username</label>
        <input
        value={username}
        type="text"
        id="usernameInput"
        onChange={e => setUsername(e.target.value)}
        pattern="[A-Za-z0-9_]{3,16}"
        required
        />
        {/* Button */}
        <button type="submit">Choose Username</button>
      </form>
    </div>
  );
}

// SignIn component
function SignIn() {
  let [email, setEmail] = useState('');
  let [password, setPassword] = useState('');

  async function signIn(e) {
    e.preventDefault();
    try {
      await firebase.auth().signInWithEmailAndPassword(email, password);
    } catch {
      alert('Incorrect email or password.');
    }
  }

  return (
    <div className="SignIn">
      <form onSubmit={signIn}>
        {/* Email */}
        <label htmlFor="emailInput">Email</label>
        <input
        value={email}
        type="email"
        id="emailInput"
        onChange={e => setEmail(e.target.value)}
        required
        />
        {/* Password */}
        <label htmlFor="passwordInput">Password</label>
        <input
        value={password}
        type="password"
        id="passwordInput"
        onChange={e => setPassword(e.target.value)}
        required
        />
        {/* Button */}
        <button type="submit">Sign In</button>
      </form>
    </div>
  );
}

// SignOut component
function SignOut() {
  return (
    <div className="SignOut">
      <p>Signed in as {auth.currentUser.displayName}</p>
      <button onClick={() => auth.signOut()}>Sign Out</button>
    </div>
  );
}

export default App;
