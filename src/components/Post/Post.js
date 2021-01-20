import './Post.css';
import { Link } from 'react-router-dom';
import firebase from 'firebase/app';

// Post component
function Post(props) {
  const { id, uid, content, createdAt } = props.postData;
  const username = props.username;
  const displayName = props.displayName;

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
        <button onClick={deletePost}>Delete post</button>
      }
    </div>
  );
}

export default Post;
