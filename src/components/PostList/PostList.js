import React, { useState } from 'react';
import './PostList.css';
import firebase from 'firebase/app';
import { useCollectionData, useDocumentData } from 'react-firebase-hooks/firestore';

import Post from '../Post/Post.js';

const maxPostLength = 64;
const maxPosts = 64;

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
  const userDocRef = firebase.firestore().collection('users').doc(currentUid);
  const [userDoc] = useDocumentData(userDocRef);

  // makes post with current content
  const [content, setContent] = useState('');
  async function makePost(e) {
    e.preventDefault();
    // check content length
    if (content.length > 64) {
      alert('Content cannot be longer than 64 characters.');
      return;
    }
    if (posts.length >= maxPosts) {
      alert('Too many posts.');
      return;
    }
    // add post to collection
    await firebase.firestore().collection('posts').add({
      uid: firebase.auth().currentUser.uid,
      content: content,
      createdAt: new Date()
    });
    // reset content field
    setContent('');
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

    // slice and update new friends list
    const newFriendsList = friendsList.slice();
    if (addingFriend) {
      newFriendsList.push(postUid);
    } else {
      newFriendsList.splice(newFriendsList.indexOf(postUid), 1);
    }

    // update friends list
    await docRef.update({
      friends: newFriendsList
    });
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
            <input
            value={content}
            type="text"
            placeholder="content"
            onChange={e => setContent(e.target.value)}
            maxLength={maxPostLength}
            required
            />
            {/* Button */}
            <button type="submit" className="post-button">Post</button>
            <p className="post-length">{content.length}/{maxPostLength} chars | {posts ? posts.length : 0}/{maxPosts} posts</p>
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
