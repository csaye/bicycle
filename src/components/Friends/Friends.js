import firebase from 'firebase/app';
import { useDocumentData } from 'react-firebase-hooks/firestore';

import FriendsList from '../FriendsList/FriendsList.js';

// Friends component
function Friends() {
  // get user doc from current uid for friends
  const uid = firebase.auth().currentUser.uid;
  const userDocRef = firebase.firestore().collection('users').doc(uid);
  const [userDoc] = useDocumentData(userDocRef);

  if (!userDoc) {
    return (
      <div className="Friends">
        <p className="margin-sm">Retrieving friends...</p>
      </div>
    )
  }

  return (
    <div className="Friends">
      <FriendsList userDoc={userDoc} />
    </div>
  )
}

export default Friends;
