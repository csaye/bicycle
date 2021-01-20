import './Profile.css';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import firebase from 'firebase/app';
import defaultProfile from '../../img/defaultProfile.png';

import PostList from '../PostList/PostList.js';

// Profile component
function Profile() {
  // get username from url
  const { username } = useParams();

  // get user data from username
  let [displayName, setDisplayName] = useState(undefined);
  let [profileURL, setProfileURL] = useState(undefined);
  let [uid, setUid] = useState(undefined);
  async function getUserData() {
    // get snapshot
    const usersRef = firebase.firestore().collection('users');
    const snapshot = await usersRef
    .where('username', '==', username)
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
      // set display name and uid
      setDisplayName(snapshot.docs[0].data().displayName);
      setUid(uid);
    }
  }

  // get user data when auth state changed
  useEffect(() => {
    firebase.auth().onAuthStateChanged(() => {
      getUserData();
    });
  });

  // if invalid data, wait
  if (!uid || !displayName) {
    return (
      <div className="Profile">
        <p>Could not find this user</p>
      </div>
    );
  }

  // if valid data, show profile
  return (
    <div className="Profile">
      <img className="profile-picture" src={profileURL ? profileURL : defaultProfile} alt="profile pic" />
      <p className="profile-title">{displayName}</p>
      <h2 className="profile-subtitle">@{username}</h2>
      <PostList uid={uid} displayName={displayName} username={username} />
    </div>
  )
}

export default Profile;
