import './Post.css';
import { Link } from 'react-router-dom';
import firebase from 'firebase/app';

// Post component
function Post(props) {
  const { id, uid, content, createdAt } = props.postData;
  const username = props.username;
  const displayName = props.displayName;

  // deletes message from firebase by id
  async function deletePost() {
    await firebase.firestore().collection('posts').doc(id).delete();
  }

  return (
    <div className="Post hover-shadow">
      <h1>{displayName}</h1>
      <Link to={`/${username}`} className="link">@{username}</Link>
      <h2>{createdAt.toDate().toDateString()} {createdAt.toDate().toLocaleTimeString()}</h2>
      <p>{content}</p>
      {
        firebase.auth().currentUser?.uid === uid &&
        <button
        data-toggle="collapse"
        data-target={`#postCollapse-${id}`}
        className="x-button">
        ✖
        </button>
      }
      <div className="collapse" id={`postCollapse-${id}`}>
        <p className="text-danger">Really delete this post?</p>
        <button data-toggle="collapse" data-target={`#postCollapse-${id}`}>No</button>
        <button onClick={deletePost} className="delete-button">Yes</button>
      </div>
    </div>
  );
}

export default Post;
