import './Profile.css';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import firebase from 'firebase/app';

import PostList from '../PostList/PostList.js';

// Profile component
function Profile() {
  // get username from url
  const { username } = useParams();

  // get user data from username
  let [displayName, setDisplayName] = useState(undefined);
  let [uid, setUid] = useState(undefined);
  async function getUserData() {
    // get snapshot
    const usersRef = firebase.firestore().collection('users');
    const snapshot = await usersRef
    .where('username', '==', username)
    .limit(1)
    .get();
    // set data
    if (snapshot.docs.length > 0) {
      setDisplayName(snapshot.docs[0].data().displayName);
      setUid(snapshot.docs[0].id);
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
      <h1 className="profile-title">{displayName}</h1>
      <h2 className="profile-subtitle">@{username}</h2>
      <PostList uid={uid} displayName={displayName} username={username} />
    </div>
  )
}

export default Profile;
