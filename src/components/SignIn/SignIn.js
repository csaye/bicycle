import React, { useState } from 'react';
import firebase from 'firebase/app';

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

export default SignIn;
