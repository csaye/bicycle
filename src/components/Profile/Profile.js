import './Profile.css';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import firebase from 'firebase/app';
import defaultProfile from '../../img/defaultProfile.png';

import ProfileExtras from '../ProfileExtras/ProfileExtras.js';
import PostList from '../PostList/PostList.js';

// Profile component
function Profile() {
  // get username from url
  const { urlUsername } = useParams();

  let [displayName, setDisplayName] = useState(undefined);
  let [profileURL, setProfileURL] = useState(undefined);
  let [status, setStatus] = useState('');
  let [uid, setUid] = useState(undefined);
  let [username, setUsername] = useState(undefined);

  let [loading, setLoading] = useState(true);

  // get user data from username
  async function getUserData() {
    // get snapshot
    const usersRef = firebase.firestore().collection('users');
    const snapshot = await usersRef
    .where('usernameLower', '==', urlUsername.toLowerCase())
    .limit(1)
    .get();
    // if user found, set data
    if (snapshot.docs.length > 0) {
      // get uid
      const uid = snapshot.docs[0].id;
      // if profile pic exists
      const listResult = await firebase.storage().ref(uid + '/profilePicture').listAll();
      if (listResult.items.length > 0) {
        // get profile pic url
        const storageRef = firebase.storage().ref(uid + '/profilePicture/profilePicture');
        await storageRef.getDownloadURL()
        .then(pURL => setProfileURL(pURL))
        .catch(e => console.log(e));
      }
      // set status, username, display name, and uid
      const data = snapshot.docs[0].data();
      setStatus(data.status);
      setUsername(data.username);
      setDisplayName(data.displayName);
      setUid(uid);
    }
    // stop loading
    setLoading(false);
  }

  // get user data on start
  useEffect(() => {
    getUserData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  let [statusUpdated, setStatusUpdated] = useState(false);

  async function updateStatus() {
    setStatusUpdated(false);
    await firebase.firestore().collection('users').doc(uid).update({
      status: status
    });
    // set status updated
    setStatusUpdated(true);
  }

  // if loading, wait
  if (loading) {
    return (
      <div className="Profile">
        <p className="margin-sm">Retrieving profile...</p>
      </div>
    );
  }

  // if invalid data, could not find user
  if (!uid || !displayName || !username) {
    return (
      <div className="Profile">
        <p>Could not find this user. Make sure the username is correct.</p>
      </div>
    );
  }

  // if valid data, show profile
  return (
    <div className="Profile">
      <div className="sidebar">
        <img
        className="profile-picture"
        src={profileURL ? profileURL : defaultProfile}
        alt="profile pic"
        />
        <p className="profile-title">{displayName}</p>
        <Link to={`/${username}`} className="profile-subtitle">@{username}</Link>
        {
            // status input if own user page
            firebase.auth().currentUser?.uid === uid ?
            <div>
              <input
              value={status}
              type="text"
              className="status-input"
              placeholder="status"
              onChange={e => setStatus(e.target.value)}
              maxLength="64"
              />
              <button onClick={updateStatus}>
              Update status
              </button>
              {
                statusUpdated &&
                <p className="status-updated text-success font-weight-bold">Status updated successfully</p>
              }
            </div> :
            // status text if not own user page
            <div>
              {
                status &&
                <h5 className="status-text font-italic">{status}</h5>
              }
            </div>
        }
        <ProfileExtras uid={uid} displayName={displayName} />
      </div>
      <PostList uid={uid} displayName={displayName} username={username} />
    </div>
  )
}

export default Profile;
