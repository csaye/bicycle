import firebase from 'firebase/app';
import { useCollectionData } from 'react-firebase-hooks/firestore';

import User from '../User/User.js';

// UserList component
function UserList() {
  // get users ordered by username
  const usersRef = firebase.firestore().collection('users');
  const query = usersRef.orderBy('username');
  const [users] = useCollectionData(query, {idField: 'id'});

  return (
    <div className="UserList">
      {
        users?.length > 0 ?
        users.map(u => <User key={u.id} data={u} />) :
        <p>No users yet</p>
      }
    </div>
  );
}

export default UserList;
