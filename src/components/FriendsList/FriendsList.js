import './FriendsList.css';
import firebase from 'firebase/app';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { Link } from 'react-router-dom';

import User from '../User/User.js';
import FriendsPosts from '../FriendsPosts/FriendsPosts.js';

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
      <div className="FriendsList">
        <p className="margin-sm">Retrieving friends...</p>
      </div>
    )
  }

  // sort friends by username
  const sortedFriends = friends.slice();
  sortedFriends.sort((a, b) => {
      if (a.usernameLower < b.usernameLower) return -1;
      if (a.usernameLower > b.usernameLower) return 1;
      return 0;
  });

  // get friend uids
  const friendUids = friends.map(f => f.id);

  return (
    <div className="FriendsList">
      <div className="friends-users">
        { sortedFriends?.length > 0 && <p className="friends-title text-center">Friends</p> }
        <hr className="friends-hr" />
        {
          sortedFriends?.length > 0 ?
          sortedFriends.map(u => <User key={u.id} data={u} />) :
          <div className="margin-sm">
            No friends yet.
            <br />
            Friend <Link to="/bicycle">@bicycle</Link> for a starting point.
          </div>
        }
      </div>
      <FriendsPosts friendUids={friendUids} />
    </div>
  )
}

export default FriendsList;
