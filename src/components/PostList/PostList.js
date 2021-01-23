import React, { useState } from 'react';
import './PostList.css';
import firebase from 'firebase/app';
import { useCollectionData, useDocumentData } from 'react-firebase-hooks/firestore';

import Post from '../Post/Post.js';

const maxPostLength = 128;
const maxPosts = 128;

// PostList component
function PostList(props) {
  const postUid = props.uid;
  const username = props.username;
  const displayName = props.displayName;

  const currentUid = firebase.auth().currentUser?.uid;

  // get posts from post uid
  const postsRef = firebase.firestore().collection('posts');
  const postsQuery = postsRef
  .where('uid', '==', postUid)
  .orderBy('createdAt', 'desc');
  const [posts] = useCollectionData(postsQuery, {idField: 'id'});

  // get user doc from current uid for friends
  const userDocRef = currentUid ?
  firebase.firestore().collection('users').doc(currentUid) :
  undefined;
  const [userDoc] = useDocumentData(userDocRef);

  // makes post with current content
  const [content, setContent] = useState('');
  async function makePost(e) {
    e.preventDefault();
    setContent('');
    // check content length
    if (content.length > maxPostLength) {
      alert(`Content cannot be longer than ${maxPostLength} characters.`);
      return;
    }
    // check post count
    if (posts.length >= maxPosts) {
      alert('Too many posts. Please delete some.');
      return;
    }
    // add post to collection
    await firebase.firestore().collection('posts').add({
      uid: firebase.auth().currentUser.uid,
      content: content,
      createdAt: new Date()
    });
  }

  async function updateFriend(addingFriend) {
    // return if current uid null or self
    if (!currentUid) return;
    if (currentUid === postUid) return;

    // get friends list
    const docRef = firebase.firestore().collection('users').doc(currentUid);
    const userData = await docRef.get();
    const friendsList = userData.data().friends;

    // return if adding friend and friends includes poster
    if (addingFriend && friendsList.includes(postUid)) return;
    // return if removing friend and friends does not includes poster
    if (!addingFriend && !friendsList.includes(postUid)) return;

    // add post uid
    if (addingFriend) {
      await docRef.update({
        friends: firebase.firestore.FieldValue.arrayUnion(postUid)
      });
    // remove post uid
    } else {
      await docRef.update({
        friends: firebase.firestore.FieldValue.arrayRemove(postUid)
      });
    }
  }

  if (!posts) {
    return (
      <div className="PostList">
        <p>Retrieving posts...</p>
      </div>
    );
  }

  return (
    <div className="PostList">
      {
        // if own page, show post form
        firebase.auth().currentUser?.uid === postUid &&
        <div>
          <form onSubmit={makePost}>
            {/* Content */}
            <textarea
            value={content}
            type="text"
            placeholder="content"
            onChange={e => setContent(e.target.value)}
            maxLength={maxPostLength}
            rows="4"
            required
            />
            {/* Post button and post length */}
            <div>
              <button type="submit" className="post-button">Post</button>
              <p className="post-length">{content.length}/{maxPostLength} chars</p>
            </div>
          </form>
        </div>
      }
      {
        // if logged in, not own page, and friends ready, show friend button
        (firebase.auth().currentUser && firebase.auth().currentUser?.uid !== postUid && userDoc?.friends) &&
        <div>
          {
            !userDoc.friends.includes(postUid) ?
            <button onClick={() => updateFriend(true)} className="friend-button">Friend {displayName}</button> :
            <button onClick={() => updateFriend(false)} className="friend-button">Unfriend {displayName}</button>
          }
        </div>
      }
      <div className="posts">
        {
          posts?.length > 0 ?
          posts.map(p => <Post
                          key={p.id}
                          postData={p}
                          username={username}
                          displayName={displayName}
                          />) :
          <p className="no-posts-yet">No posts yet</p>
        }
      </div>
    </div>
  );
}

export default PostList;
