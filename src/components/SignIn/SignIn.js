import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import firebase from 'firebase/app';

// SignIn component
function SignIn() {
  let [email, setEmail] = useState('');
  let [password, setPassword] = useState('');

  let [error, setError] = useState('');

  async function signIn(e) {
    e.preventDefault();
    try {
      await firebase.auth().signInWithEmailAndPassword(email, password);
    } catch(e) {
      setError(e.message);
    }
  }

  return (
    <div className="SignIn Form">
      <form onSubmit={signIn} className="flex-col">
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
        {/* Button */}
        <button type="submit" className="hover-shadow">Sign In</button>
        {/* Sign up */}
        <Link to="/signup" className="link">No account? Sign up</Link>
        {/* Error */}
        { error && <p className="text-danger text-center">{error}</p> }
      </form>
    </div>
  );
}

export default SignIn;
