import './PostList.css';
import firebase from 'firebase/app';
import { useCollectionData } from 'react-firebase-hooks/firestore';

import Post from '../Post/Post.js';

// PostList component
function PostList(props) {
  const postUid = props.uid;

  // get posts from post uid
  const postsRef = firebase.firestore().collection('posts');
  const postsQuery = postsRef
  .where('uid', '==', postUid)
  .orderBy('createdAt', 'desc');
  const [posts] = useCollectionData(postsQuery, {idField: 'id'});

  if (!posts) {
    return (
      <div className="PostList">
        <p className="margin-sm">Retrieving posts...</p>
      </div>
    );
  }

  return (
    <div className="PostList">
      <div className="posts">
        {
          posts?.length > 0 ?
          posts.map(p => <Post key={p.id} postData={p} />) :
          <p className="margin-sm">No posts yet</p>
        }
      </div>
    </div>
  );
}

export default PostList;
