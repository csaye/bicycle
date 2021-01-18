import './SignUp.css';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

// SignUp component
function SignUp() {
  let [email, setEmail] = useState('');
  let [password, setPassword] = useState('');
  let [displayName, setDisplayName] = useState('');
  let [username, setUsername] = useState('');

  // returns whether username is taken
  async function usernameTaken() {
    const snapshot = await firebase.firestore().collection('users').get();
    const users = snapshot.docs.map(d => d.data());
    return users.some((user) => user.username === username);
  }

  async function signUp(e) {
    e.preventDefault();
    // if username taken, return
    if (await usernameTaken()) {
      alert("That username is taken. Please try another.");
      return;
    }
    // create user
    try {
      await firebase.auth().createUserWithEmailAndPassword(email, password);
    } catch(e) {
      alert(e.message);
      return;
    };
    // set display name
    await firebase.auth().currentUser.updateProfile({
      displayName: displayName
    });
    // set user doc
    const uid = firebase.auth().currentUser.uid;
    await firebase.firestore().collection('users').doc(uid).set({
      username: username,
      displayName: displayName,
      registered: new Date()
    });
    // go to home page
    window.location.href = '/';
  }

  return (
    <div className="SignUp">
      <form onSubmit={signUp}>
        {/* Title */}
        <h1>Bicycle</h1>
        <div>
          {/* Email */}
          <input
          value={email}
          type="email"
          placeholder="email"
          onChange={e => setEmail(e.target.value)}
          required
          />
          {/* Password */}
          <input
          value={password}
          type="password"
          placeholder="password"
          onChange={e => setPassword(e.target.value)}
          required
          />
        </div>
        <div>
          {/* Display Name */}
          <input
          value={displayName}
          type="text"
          placeholder="display name"
          onChange={e => setDisplayName(e.target.value)}
          pattern="[A-Za-z ]{1,32}"
          required
          />
          {/* Username */}
          <input
          value={username}
          type="text"
          placeholder="username"
          onChange={e => setUsername(e.target.value)}
          pattern="[A-Za-z0-9_]{3,16}"
          required
          />
        </div>
        {/* Button */}
        <button type="submit" className="hover-shadow">Sign Up</button>
        {/* Sign in */}
        <Link to="/signin" className="link">Already have an account? Sign in</Link>
      </form>
    </div>
  );
}

export default SignUp;
