import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import firebase from 'firebase/app';

import { usernameTaken } from '../../util/usernameData.js';

// SignUp component
function SignUp() {
  let [email, setEmail] = useState('');
  let [password, setPassword] = useState('');
  let [displayName, setDisplayName] = useState('');
  let [username, setUsername] = useState('');

  let [error, setError] = useState('');

  // select email field on start
  useEffect(() => {
    document.getElementById('emailInput').focus();
  }, []);

  async function signUp(e) {
    e.preventDefault();
    setError('');
    // verify display name length
    if (displayName.length < 1 || displayName.length > 32) {
      setError("Display name must be between 1 and 32 characters.");
      return;
    }
    // verify username chars
    if (!/^([A-Za-z0-9_]{0,})$/.test(username)) {
      setError("Username can only contain alphanumeric characters and underscore.");
      return;
    }
    // verify username length
    if (username.length < 3 || username.length > 16) {
      setError("Username must be between 3 and 16 characters.");
      return;
    }
    // if username taken, return
    if (await usernameTaken(username)) {
      setError("Username taken. Please try another.");
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
      usernameLower: username.toLowerCase(),
      displayName: displayName,
      registered: new Date(),
      friends: ['b7rWEEyhUOSCFDbQPBqoCTVmFIA3'],
      status: ''
    });
    // go to home page
    window.location.href = '/';
  }

  return (
    <div className="SignUp Form hover-shadow">
      <form onSubmit={signUp} className="flex-col">
        {/* Title */}
        <h1>Bicycle</h1>
        <p className="tagline">A minimalist social media placing its users first.</p>
        <hr />
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
        placeholder="Display Name"
        onChange={e => setDisplayName(e.target.value)}
        required
        />
        {/* Username */}
        <label htmlFor="usernameInput">Username</label>
        <input
        value={username}
        type="text"
        id="usernameInput"
        placeholder="username"
        onChange={e => setUsername(e.target.value)}
        required
        />
        {/* Button */}
        <button type="submit">Sign Up</button>
        {/* Error */}
        { error && <p className="text-danger text-center">{error}</p> }
        <hr />
        {/* Sign in */}
        <Link to="/signin" className="link">Already have an account? Sign in</Link>
      </form>
    </div>
  );
}

export default SignUp;
