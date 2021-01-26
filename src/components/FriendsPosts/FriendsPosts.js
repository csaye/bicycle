import './FriendsPosts.css';
import firebase from 'firebase/app';
import { useCollectionData } from 'react-firebase-hooks/firestore';

import Post from '../Post/Post.js';

function FriendsPosts(props) {
  const friendUids = props.friendUids;

  // get friends' posts
  const postsRef = firebase.firestore().collection('posts');
  const query = friendUids.length > 0 ?
  postsRef
  .where('uid', 'in', friendUids)
  .orderBy('createdAt', 'desc')
  .limit(32) :
  postsRef.where('__name__', '==', 'null');
  const [posts] = useCollectionData(query, {idField: 'id'});

  // if no posts yet, wait
  if (!posts) {
    return (
      <div className="FriendsPosts">
        <p className="margin-sm">Retrieving posts...</p>
      </div>
    );
  }

  return (
    <div className="FriendsPosts">
      {
        posts.length > 0 ?
        posts.map(p => <Post key={p.id} postData={p} />) :
        <p className="margin-sm">No posts yet</p>
      }
    </div>
  )
}

export default FriendsPosts;
