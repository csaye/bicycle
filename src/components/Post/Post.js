import './Post.css';
import firebase from 'firebase/app';

// Post component
function Post(props) {
  const { id, uid, displayName, content, createdAt } = props.data;

  async function deletePost() {
    await firebase.firestore().collection('posts').doc(id).delete();
  }

  return (
    <div className="Post">
      <h1>{displayName}</h1>
      <h2>{createdAt.toDate().toDateString()} {createdAt.toDate().toLocaleTimeString()}</h2>
      <p>{content}</p>
      {
        uid === firebase.auth().currentUser.uid &&
        <button onClick={deletePost}>Delete</button>
      }
    </div>
  );
}

export default Post;
