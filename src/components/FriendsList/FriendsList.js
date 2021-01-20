import './FriendsList.css';
import firebase from 'firebase/app';
import { useCollectionData } from 'react-firebase-hooks/firestore';

import User from '../User/User.js';

// FriendsList component
function FriendsList(props) {
  // get user doc from props
  const userDoc = props.userDoc;

  // get friends ordered by username
  const usersRef = firebase.firestore().collection('users');
  const query = userDoc.friends.length > 0 ?
  usersRef.where("__name__", "in", userDoc.friends) :
  usersRef.where("__name__", "==", 'none');
  // query.addSort("username");
  const [friends] = useCollectionData(query, {idField: 'id'});

  if (!friends) {
    return (
      <div className="FriendsList">Retrieving friends...</div>
    )
  }

  return (
    <div className="FriendsList">
      {
        friends?.length > 0 ?
        friends.map(u => <User key={u.id} data={u} />) :
        <p>No friends yet. Better invite some!</p>
      }
    </div>
  )
}

export default FriendsList;
