import './Settings.css';
import React, { useState, useEffect } from 'react';
import firebase from 'firebase/app';
// import FieldValue from 'firebase/app';
import { usernameTaken } from '../../util/usernameData.js';

function Settings() {
  let [displayName, setDisplayName] = useState('');
  let [username, setUsername] = useState('');
  let [profilePicture, setProfilePicture] = useState(undefined);

  let [error, setError] = useState('');
  let [deleting, setDeleting] = useState(false);
  let [password, setPassword] = useState('');

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
    setDeleting(false);
    // verify display name length
    if (displayName.length < 1 || displayName.length > 32) {
      setError("Display name must be between 1 and 32 characters.");
    // if display name valid
    } else {
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
    setError('');
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
      // set user doc
      const uid = firebase.auth().currentUser.uid;
      await firebase.firestore().collection('users').doc(uid).update({
        username: username
      });
      window.location.href = "/";
    }
  }

  async function changeProfilePicture(e) {
    e.preventDefault();
    setError('');
    setDeleting(false);
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

  function startDelete() {
    setError("Re-enter password to permanently delete account and all posts.");
    setDeleting(true);
  }
  function cancelDelete() {
    setError('');
    setDeleting(false);
  }

  // deletes a user and all of their posts
  async function deleteAccount(e) {
    e.preventDefault();
    setError('');

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

    // // delete user as friend
    // await firebase.firestore().collection('users')
    // .where(uid, 'in', 'friends').get()
    // .then((snapshot) => {
    //   // remove friend for all docs
    //   snapshot.forEach((doc) => {
    //     doc.ref.update({
    //       friends: FieldValue.arrayRemove(uid)
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
      {/* Title */}
      <h1>Settings</h1>
      <hr />
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
        <button type="submit">Change username</button>
      </form>
      {/* Profile Picture */}
      <form onSubmit={changeProfilePicture}>
        <input
        type="file"
        accept="image/*"
        className="file-input"
        onChange={e => setProfilePicture(e.target.files[0])}
        />
        <button type="submit">Change profile picture</button>
      </form>
      {/* Delete Account */}
      <button onClick={startDelete}>Delete account</button>
      {/* Error */}
      { error && <p className="text-danger text-center">{error}</p> }
      {/* Delete Button */}
      {
        deleting &&
        <div className="flex-col">
          <form onSubmit={deleteAccount}>
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
            <button type="submit">Yes, delete my account</button>
          </form>
          <button onClick={cancelDelete} className="cancel-button">No, do not delete my account</button>
        </div>
      }
    </div>
  );
}

export default Settings;
