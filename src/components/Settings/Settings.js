import './Settings.css';
import React, { useState, useEffect } from 'react';
import firebase from 'firebase/app';
import { usernameTaken } from '../../util/usernameData.js';

import SettingsExtras from '../SettingsExtras/SettingsExtras.js';

function Settings() {
  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [profilePicture, setProfilePicture] = useState(undefined);

  const [error, setError] = useState('');

  async function getUserData() {
    // set username and display name
    const uid = firebase.auth().currentUser.uid;
    const userData = await firebase.firestore().collection('users').doc(uid).get();
    setUsername(userData.data()?.username);
    setDisplayName(userData.data()?.displayName);
  }

  // get user data on start
  useEffect(() => {
    getUserData();
  }, []);

  async function changeDisplayName(e) {
    e.preventDefault();
    setError('');
    // verify display name length
    if (displayName.length < 1 || displayName.length > 32) {
      setError("Display name must be between 1 and 32 characters.");
    // if display name valid
    } else {
      // update profile
      firebase.auth().currentUser.updateProfile({
        displayName: displayName
      });
      // update user doc
      const uid = firebase.auth().currentUser.uid;
      await firebase.firestore().collection('users').doc(uid).update({
        displayName: displayName
      });
      // update posts
      const newDisplayName = { displayName: displayName }
      await firebase.firestore().collection('posts').where('uid', '==', uid).get()
      .then((snapshot) => {
        // create batch
        const batch = firebase.firestore().batch();
        // batch all display name updates
        snapshot.forEach((doc) => {
          batch.update(doc.ref, newDisplayName);
        });
        // commit batch
        batch.commit();
      });
      // go to home page
      window.location.href = "/";
    }
  }

  async function changeUsername(e) {
    e.preventDefault();
    setError('');
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
      // update user doc
      const uid = firebase.auth().currentUser.uid;
      await firebase.firestore().collection('users').doc(uid).update({
        username: username,
        usernameLower: username.toLowerCase()
      });
      // update posts
      const newUsername = { username: username }
      await firebase.firestore().collection('posts').where('uid', '==', uid).get()
      .then((snapshot) => {
        // create batch
        const batch = firebase.firestore().batch();
        // batch all username updates
        snapshot.forEach((doc) => {
          batch.update(doc.ref, newUsername);
        });
        // commit batch
        batch.commit();
      });
      // go to home page
      window.location.href = "/";
    }
  }

  async function changeProfilePicture(e) {
    e.preventDefault();
    setError('');
    // return if no profile picture
    if (!profilePicture) {
      setError("Please upload a profile picture.");
    // upload profile picture to storage
    } else {
      const uid = firebase.auth().currentUser.uid;
      const storageRef = firebase.storage().ref(uid + '/profilePicture/profilePicture');
      await storageRef.put(profilePicture)
      .then(() => window.location.href = "/")
      .catch(e => setError("Upload failed. Please use an image file with size under 3MB."));
    }
  }

  return (
    <div className="Settings Form hover-shadow flex-col">
      {/* title */}
      <h1>Settings</h1>
      <hr />
      {/* display name */}
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
        <button type="submit">Change display name</button>
      </form>
      {/* username */}
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
        <button type="submit">Change username</button>
      </form>
      {/* profile picture */}
      <form onSubmit={changeProfilePicture}>
        <input
        type="file"
        accept="image/*"
        className="file-input"
        onChange={e => setProfilePicture(e.target.files[0])}
        />
        <button type="submit">Change profile picture</button>
      </form>
      {/* error */}
      { error && <p className="text-danger text-center">{error}</p> }
      <hr />
      <SettingsExtras />
    </div>
  );
}

export default Settings;
