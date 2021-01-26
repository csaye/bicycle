import './Post.css';
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import firebase from 'firebase/app';
import $ from 'jquery';

// Post component
function Post(props) {
  const { id, uid, content, username, displayName, createdAt } = props.postData;

  // initialize tooltips on start
  useEffect(() => {
    $('[data-toggle="tooltip"]').tooltip({ trigger: "hover" })
  }, []);

  // deletes message from firebase by id
  async function deletePost() {
    await firebase.firestore().collection('posts').doc(id).delete();
  }

  return (
    <div className="Post hover-shadow">
      <h1>{displayName}</h1>
      <Link to={`/${username}`} className="link">@{username}</Link>
      <h2>{createdAt.toDate().toDateString()} {createdAt.toDate().toLocaleTimeString()}</h2>
      <p className="post-content">{content}</p>

      {
        firebase.auth().currentUser?.uid === uid &&
        <span data-toggle="tooltip" title="Delete post">
          <button
          data-toggle="collapse"
          data-target={`#postCollapse-${id}`}
          className="x-button">
          ✖
          </button>
        </span>
      }
      <div className="collapse" id={`postCollapse-${id}`}>
        <p className="text-danger really-delete">Really delete this post?</p>
        <button data-toggle="collapse" data-target={`#postCollapse-${id}`}>No</button>
        <button onClick={deletePost} className="delete-button">Yes</button>
      </div>
    </div>
  );
}

export default Post;
