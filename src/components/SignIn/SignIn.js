import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import firebase from 'firebase/app';

// SignIn component
function SignIn() {
  let [email, setEmail] = useState('');
  let [password, setPassword] = useState('');

  let [error, setError] = useState(undefined);

  async function signIn(e) {
    e.preventDefault();
    setError(undefined);
    // try to sign in and go to home page
    try {
      await firebase.auth().signInWithEmailAndPassword(email, password);
      window.location.href = '/';
    // catch error
    } catch(e) {
      if (e.code === 'auth/user-not-found') {
        setError('Unknown email. Please try again.');
      } else if (e.code === 'auth/wrong-password') {
        setError('Incorrect password. Please try again.');
      } else if (e.code === 'auth/too-many-requests') {
        setError('Too many sign in requests. Please try again later.')
      } else {
        setError(e.message);
      }
    }
  }

  return (
    <div className="SignIn Form shadowed">
      <form onSubmit={signIn} className="flex-col">
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
        {/* Button */}
        <button type="submit">Sign In</button>
        <hr />
        {/* Sign up */}
        <Link to="/signup" className="link">No account? Sign up</Link>
        {/* Error */}
        { error && <p className="text-danger text-center">{error}</p> }
      </form>
    </div>
  );
}

export default SignIn;
