import './Settings.css';
import React, { useState } from 'react';
import firebase from 'firebase/app';
import { usernameTaken } from '../../util/usernameData.js';

function Settings() {
  let [displayName, setDisplayName] = useState('');
  let [username, setUsername] = useState('');

  let [error, setError] = useState('');
  let [deleting, setDeleting] = useState(false);

  async function changeDisplayName(e) {
    e.preventDefault();
    setDeleting(false);
    // verify display name length
    if (displayName.length < 1 || displayName.length > 32) {
      setError("Display name must be between 1 and 32 characters.");
    // if display name valid
    } else {
      setError('');
      // set user doc
      const uid = firebase.auth().currentUser.uid;
      await firebase.firestore().collection('users').doc(uid).update({
        displayName: displayName
      });
      window.location.href = "/";
    }
  }

  async function changeUsername(e) {
    e.preventDefault();
    setDeleting(false);
    // verify username chars
    if (!/^([A-Za-z0-9_]{0,})$/.test(username)) {
      setError("Username can only contain alphanumeric characters and underscore.");
    // verify username length
    } else if (username.length < 3 || username.length > 16) {
      setError("Username must be between 3 and 16 characters.");
    // if username taken
    } else if (await usernameTaken(username)) {
      setError("Username taken. Please try another.");
    // if username valid
    } else {
      setError('');
      // set user doc
      const uid = firebase.auth().currentUser.uid;
      await firebase.firestore().collection('users').doc(uid).update({
        username: username
      });
      window.location.href = "/";
    }
  }

  function startDelete() {
    setError("Are you sure you want to permanently delete your account? All your posts will be deleted.");
    setDeleting(true);
  }
  function cancelDelete() {
    setError('');
    setDeleting(false);
  }

  // deletes a user and all of their posts
  async function deleteAccount() {
    // delete user reference
    const uid = firebase.auth().currentUser.uid;
    await firebase.firestore().collection('users').doc(uid).delete();

    // delete user posts
    await firebase.firestore().collection('posts').where('uid', '==', uid).get()
    .then((snapshot) => {
      // create batch
      const batch = firebase.firestore().batch();
      // batch all deletions
      snapshot.forEach((doc) => {
        batch.delete(doc.ref);
      });
      // commit batch
      batch.commit();
    });

    // delete account
    await firebase.auth().currentUser.delete()
    .catch((e) => setError(e.message));
  }

  return (
    <div className="Settings Form flex-col">
      <h1>Settings</h1>
      {/* Display Name */}
      <form onSubmit={changeDisplayName}>
        <label htmlFor="displayNameInput">Display Name</label>
        <input
        value={displayName}
        type="text"
        id="displayNameInput"
        placeholder="Display Name"
        onChange={e => setDisplayName(e.target.value)}
        required
        />
        {/* Button */}
        <button type="submit">Change display name</button>
      </form>
      {/* Username */}
      <form onSubmit={changeUsername}>
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
        <button type="submit">Change username</button>
      </form>
      <p>Change profile picture</p>
      <button onClick={startDelete}>Delete account</button>
      {/* Error */}
      { error && <p className="text-danger text-center">{error}</p> }
      {/* Delete Button */}
      {
        deleting &&
        <div>
          <button onClick={deleteAccount}>Yes, delete my account permanently</button>
          <button onClick={cancelDelete} className="cancel-button">Cancel</button>
        </div>
      }
    </div>
  );
}

export default Settings;
