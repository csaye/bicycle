import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import firebase from 'firebase/app';

// ResetPassword component
function ResetPassword() {
  let [email, setEmail] = useState('');

  let [success, setSuccess] = useState(undefined);
  let [error, setError] = useState(undefined);

  // select email field on start
  useEffect(() => {
    document.getElementById('emailInput').focus();
  }, []);

  async function resetPassword(e) {
    e.preventDefault();
    setSuccess(undefined);
    setError(undefined);
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
        {/* Title */}
        <h1>Reset Password</h1>
        <p className="tagline">Please enter your account email.</p>
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
        {/* Button */}
        <button type="submit">Send Reset Email</button>
        {/* Success */}
        { success && <p className="text-success text-center">{success}</p> }
        {/* Error */}
        { error && <p className="text-danger text-center">{error}</p> }
        <hr />
        {/* Sign in */}
        <Link to="/signin" className="link">Back to sign in page</Link>
      </form>
    </div>
  );
}

export default ResetPassword;
