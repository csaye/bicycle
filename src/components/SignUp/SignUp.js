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

  let [error, setError] = useState('');

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
      setError(e.message);
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
    <div className="SignUp Form">
      <form onSubmit={signUp} className="flex-col">
        {/* Title */}
        <h1>Bicycle</h1>
        {/* Email */}
        <label htmlFor="emailInput">Email</label>
        <input
        value={email}
        type="email"
        id="emailInput"
        placeholder="email@example.com"
        onChange={e => setEmail(e.target.value)}
        required
        />
        {/* Password */}
        <label htmlFor="passwordInput">Password</label>
        <input
        value={password}
        type="password"
        id="passwordInput"
        placeholder="password"
        onChange={e => setPassword(e.target.value)}
        required
        />
        {/* Display Name */}
        <label htmlFor="displayNameInput">Display Name</label>
        <input
        value={displayName}
        type="text"
        id="displayNameInput"
        placeholder="John Doe"
        onChange={e => setDisplayName(e.target.value)}
        pattern="[A-Za-z ]{1,32}"
        required
        />
        {/* Username */}
        <label htmlFor="usernameInput">Username</label>
        <input
        value={username}
        type="text"
        id="usernameInput"
        placeholder="johndoe"
        onChange={e => setUsername(e.target.value)}
        pattern="[A-Za-z0-9_]{3,16}"
        required
        />
        {/* Button */}
        <button type="submit" className="hover-shadow">Sign Up</button>
        {/* Sign in */}
        <Link to="/signin" className="link">Already have an account? Sign in</Link>
        {/* Error */}
        { error && <p className="error text-center">{error}</p> }
      </form>
    </div>
  );
}

export default SignUp;
