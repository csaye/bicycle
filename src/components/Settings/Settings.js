import './Settings.css';
import React, { useState, useEffect } from 'react';
import firebase from 'firebase/app';
import { usernameTaken } from '../../util/usernameData.js';

function Settings() {
  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [profilePicture, setProfilePicture] = useState(undefined);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [password, setPassword] = useState('');

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

  function resetInfo() {
    setError('');
    setSuccess('');
    setDeleting(false);
  }

  async function changeDisplayName(e) {
    e.preventDefault();
    resetInfo();
    // verify display name length
    if (displayName.length < 1 || displayName.length > 32) {
      setError("Display name must be between 1 and 32 characters.");
    // if display name valid
    } else {
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
    resetInfo();
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
    resetInfo();
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

  async function resetPassword() {
    resetInfo();
    const currentEmail = firebase.auth().currentUser.email;
    try {
      await firebase.auth().sendPasswordResetEmail(currentEmail);
      setSuccess(`Email successfully sent to ${currentEmail}`);
    } catch(e) {
      setError(e.message);
    }
  }

  function startDelete() {
    setSuccess('');
    setError(deleting ? '' : "Re-enter password to permanently delete account and all posts.");
    setDeleting(!deleting);
  }

  // deletes a user and all of their posts
  async function deleteAccount(e) {
    e.preventDefault();
    resetInfo();

    // sign in user again
    const email = firebase.auth().currentUser.email;
    try {
      await firebase.auth().signInWithEmailAndPassword(email, password);
    // set error and return on catch
    } catch (e) {
      if (e.code === 'auth/wrong-password') {
        setError('Incorrect password. Please try again.');
      } else if (e.code === 'auth/too-many-requests') {
        setError('Too many sign in requests. Please try again later.')
      } else {
        setError(e.message);
      }
      return;
    }

    // delete user reference
    const uid = firebase.auth().currentUser.uid;
    await firebase.firestore().collection('users').doc(uid).delete();

    // delete user as friend
    // await firebase.firestore().collection('users')
    // .where('friends', 'array-contains', uid).get()
    // .then((snapshot) => {
    //   // remove friend for all docs
    //   snapshot.forEach((doc) => {
    //     doc.ref.update({
    //       friends: firebase.firestore.FieldValue.arrayRemove(uid)
    //     })
    //   });
    // });

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

    // delete user messages
    await firebase.firestore().collection('messages').where('uids', 'array-contains', uid).get()
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

    // if profile pic exists
    const listResult = await firebase.storage().ref(uid + '/profilePicture').listAll();
    if (listResult.items.length > 0) {
      // delete profile pic
      const storageRef = firebase.storage().ref(uid + '/profilePicture/profilePicture');
      await storageRef.delete().catch(e => console.log(e));
    }

    // delete account
    await firebase.auth().currentUser.delete()
    .catch((e) => {
      setError(e.message);
    });
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
      <div>
        {/* reset password */}
        <button onClick={resetPassword}>Reset password</button>
        {/* delete account */}
        <button onClick={startDelete} className="delete-account">Delete account</button>
      </div>
      {/* error */}
      { error && <p className="text-danger text-center">{error}</p> }
      {/* success */}
      { success && <p className="text-success text-center">{success}</p> }
      {/* delete button */}
      {
        deleting &&
        <div className="flex-col">
          <form onSubmit={deleteAccount}>
            {/* password */}
            <label htmlFor="passwordInput">Password</label>
            <input
            value={password}
            type="password"
            id="passwordInput"
            placeholder="password"
            onChange={e => setPassword(e.target.value)}
            required
            />
            <button type="submit">Yes, delete my account</button>
          </form>
          <button onClick={resetInfo} className="cancel-button">No, do not delete my account</button>
        </div>
      }
    </div>
  );
}

export default Settings;
