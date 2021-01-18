import firebase from 'firebase/app';

import { useCollectionData } from 'react-firebase-hooks/firestore'

import Post from '../Post/Post.js';

function PostList() {
  const postsRef = firebase.firestore().collection('posts');
  const query = postsRef.where('uid', '==', firebase.auth().currentUser.uid);
  const [posts] = useCollectionData(query, {idField: 'id'});

  return (
    <div className="PostList">
      {
        posts?.length > 0 ?
        posts.map(p => <Post key={p.id} data={p} />) :
        <p>No posts yet</p>
      }
    </div>
  );
}

export default PostList;
