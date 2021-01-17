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
  const [user] = useAuthState(auth);

  return (
    <div className="App">
      <header>
        <h1>Bicycle</h1>
        { auth.currentUser && <SignOut /> }
      </header>
      <section>
        { user ? <Homescreen /> : <SignIn /> }
      </section>
    </div>
  );
}

// Homescreen component
function Homescreen() {
  return (
    <div className="Homescreen">
      <p>Homescreen</p>
    </div>
  );
}

// SignIn component
function SignIn() {
  let [email, setEmail] = useState('');
  let [password, setPassword] = useState('');

  function onKeyPress(event) {
    if (event.key === 'Enter') signIn();
  }

  async function signIn() {
    try {
      await firebase.auth().signInWithEmailAndPassword(email, password);
    } catch {
      alert('Incorrect email or password.');
    }
  }

  return (
    <div className="SignIn">
      {/* Email */}
      <label htmlFor="emailInput">Email</label>
      <input
      value={email}
      type="email"
      onChange={e => setEmail(e.target.value)}
      onKeyPress={onKeyPress}
      />
      {/* Password */}
      <label htmlFor="passwordInput">Password</label>
      <input
      value={password}
      type="password"
      onChange={e => setPassword(e.target.value)}
      onKeyPress={onKeyPress}
      />
      {/* Button */}
      <button onClick={signIn}>Sign In</button>
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
