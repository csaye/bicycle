import React, { useState } from 'react';
import firebase from 'firebase/app';

import PostList from '../PostList/PostList.js';

// Home component
function Home() {
  const [content, setContent] = useState('');

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
      content: content
    });
    setContent('');
  }

  return (
    <div className="Home">
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
      <PostList />
    </div>
  )
}

export default Home;
