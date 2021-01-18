import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import firebase from 'firebase/app';

import PostList from '../PostList/PostList.js';

// Profile component
function Profile() {
  // get username from url
  const { username } = useParams();

  // get uid from username
  let [uid, setUid] = useState(undefined);
  async function getUid() {
    // get snapshot
    const usersRef = firebase.firestore().collection('users');
    const snapshot = await usersRef
    .where('username', '==', username)
    .limit(1)
    .get();
    // set uid
    if (snapshot.docs.length > 0) {
      setUid(snapshot.docs[0].id);
    }
  }
  // getUid();

  // get uid when auth state changed
  useEffect(() => {
    firebase.auth().onAuthStateChanged(() => {
      getUid();
    });
  });

  const [content, setContent] = useState('');

  // makes post with current content
  async function makePost(e) {
    e.preventDefault();
    // check content length
    if (content.length > 64) {
      alert('Content cannot be longer than 64 characters.');
      return;
    }
    // add post to collection
    await firebase.firestore().collection('posts').add({
      uid: firebase.auth().currentUser.uid,
      displayName: firebase.auth().currentUser.displayName,
      content: content,
      createdAt: new Date()
    });
    // reset content field
    setContent('');
  }

  // if no uid yet, wait
  if (!uid) {
    return (
      <div className="Profile">
        <p>Could not find this user</p>
      </div>
    );
  }

  // if valid uid, show profile
  return (
    <div className="Profile">
      {
        // if own page, show post form
        firebase.auth().currentUser?.uid === uid &&
        <form onSubmit={makePost}>
          {/* Content */}
          <label htmlFor="contentInput">Content</label>
          <input
          value={content}
          type="text"
          id="contentInput"
          onChange={e => setContent(e.target.value)}
          required
          />
          {/* Button */}
          <button type="submit">Post</button>
        </form>
      }
      <PostList uid={uid} />
    </div>
  )
}

export default Profile;
