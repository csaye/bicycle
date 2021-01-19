import firebase from 'firebase/app';
import { useCollectionData } from 'react-firebase-hooks/firestore';

import Post from '../Post/Post.js';

// PostList component
function PostList(props) {
  const uid = props.uid;

  // get posts from corresponding uid
  const postsRef = firebase.firestore().collection('posts');
  const query = postsRef
  .where('uid', '==', uid)
  .orderBy('createdAt', 'desc');
  const [posts] = useCollectionData(query, {idField: 'id'});

  return (
    <div className="PostList">
      {
        posts?.length > 0 ?
        posts.map(p => <Post key={p.id} data={p} />) :
        <p className="no-posts-yet">No posts yet</p>
      }
    </div>
  );
}

export default PostList;
