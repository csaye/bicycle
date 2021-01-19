import React, { useState } from 'react';
import './PostList.css';
import firebase from 'firebase/app';
import { useCollectionData } from 'react-firebase-hooks/firestore';

import Post from '../Post/Post.js';

const maxPostLength = 64;
const maxPosts = 64;

// PostList component
function PostList(props) {
  const uid = props.uid;
  const username = props.username;
  const displayName = props.displayName;

  // get posts from corresponding uid
  const postsRef = firebase.firestore().collection('posts');
  const query = postsRef
  .where('uid', '==', uid)
  .orderBy('createdAt', 'desc');
  const [posts] = useCollectionData(query, {idField: 'id'});

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
      displayName: firebase.auth().currentUser.displayName,
      content: content,
      createdAt: new Date()
    });
    // reset content field
    setContent('');
  }

  return (
    <div className="PostList">
      {
        // if own page, show post form
        firebase.auth().currentUser?.uid === uid &&
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
            <p className="post-length">{content.length}/{maxPostLength}</p>
          </form>
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
