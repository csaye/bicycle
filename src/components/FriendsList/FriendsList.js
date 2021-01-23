import './FriendsList.css';
import firebase from 'firebase/app';
import { useCollectionData } from 'react-firebase-hooks/firestore';

import User from '../User/User.js';
import PostList from '../PostList/PostList.js';

// FriendsList component
function FriendsList(props) {
  // get user doc from props
  const userDoc = props.userDoc;

  // get friends
  const usersRef = firebase.firestore().collection('users');
  const query = userDoc.friends.length > 0 ?
  usersRef.where("__name__", "in", userDoc.friends) :
  usersRef.where("__name__", "==", 'null');
  const [friends] = useCollectionData(query, {idField: 'id'});

  if (!friends) {
    return (
      <div className="FriendsList">Retrieving friends...</div>
    )
  }

  // sort friends by username
  let sortedFriends = friends.slice();
  sortedFriends.sort((a, b) => {
      if (a.usernameLower < b.usernameLower) return -1;
      if (a.usernameLower > b.usernameLower) return 1;
      return 0;
  });

  return (
    <div className="FriendsList">
      <div className="friends-users">
        {
          sortedFriends?.length > 0 ?
          sortedFriends.map(u => <User key={u.id} data={u} />) :
          <p>No friends yet. Better invite some!</p>
        }
      </div>
      <div className="friends-posts">
        {
          sortedFriends?.length > 0 &&
          sortedFriends.map(u => <PostList key={u.id} uid={u.id} displayName={u.displayName} username={u.username} />)
        }
      </div>
    </div>
  )
}

export default FriendsList;
