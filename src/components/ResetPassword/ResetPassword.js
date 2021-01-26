import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import firebase from 'firebase/app';

// ResetPassword component
function ResetPassword() {
  let [email, setEmail] = useState('');

  let [success, setSuccess] = useState('');
  let [error, setError] = useState('');

  // select email field on start
  useEffect(() => {
    document.getElementById('emailInput').focus();
  }, []);

  async function resetPassword(e) {
    e.preventDefault();
    setSuccess('');
    setError('');
    // send password reset email
    const currentEmail = email;
    try {
      await firebase.auth().sendPasswordResetEmail(currentEmail);
      setSuccess(`Email successfully sent to ${currentEmail}`);
    } catch (e) {
      if (e.code === 'auth/invalid-email') {
        setError('Invalid email address.')
      } else if (e.code === 'auth/user-not-found') {
        setError('Unknown email address.');
      } else {
        setError(e.message);
      }
    }
  }

  return (
    <div className="ResetPassword Form hover-shadow">
      <form onSubmit={resetPassword} className="flex-col">
        {/* title */}
        <h1>Reset Password</h1>
        <p className="tagline">Please enter your account email.</p>
        <hr />
        {/* email */}
        <label htmlFor="emailInput">Email</label>
        <input
        value={email}
        type="email"
        id="emailInput"
        placeholder="email@example.com"
        onChange={e => setEmail(e.target.value)}
        required
        />
        {/* button */}
        <button type="submit">Send Reset Email</button>
        {/* success */}
        { success && <p className="text-success text-center">{success}</p> }
        {/* error */}
        { error && <p className="text-danger text-center">{error}</p> }
        <hr />
        {/* sign in */}
        <Link to="/signin" className="link">Back to sign in page</Link>
      </form>
    </div>
  );
}

export default ResetPassword;
