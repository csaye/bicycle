import './SignIn.css';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import firebase from 'firebase/app';

// SignIn component
function SignIn() {
  let [email, setEmail] = useState('');
  let [password, setPassword] = useState('');

  async function signIn(e) {
    e.preventDefault();
    try {
      await firebase.auth().signInWithEmailAndPassword(email, password);
    } catch(e) {
      alert(e);
    }
  }

  return (
    <div className="SignIn">
      <form onSubmit={signIn}>
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
        {/* Button */}
        <button type="submit" className="hover-shadow">Sign In</button>
        {/* Sign up */}
        <Link to="/signup" className="link">No account? Sign up</Link>
      </form>
    </div>
  );
}

export default SignIn;
