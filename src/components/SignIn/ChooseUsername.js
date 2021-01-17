import React, { useState } from 'react';
import firebase from 'firebase/app';
import { useCollectionData } from 'react-firebase-hooks/firestore';

function uid() {
  return firebase.auth().currentUser?.uid;
}

// ChooseUsername component
function ChooseUsername() {
  let [username, setUsername] = useState('');

  const usersRef = firebase.firestore().collection('users');
  const [users] = useCollectionData(usersRef);

  // returns whether username is taken
  function usernameTaken() {
    return users.some((user) => user.username === username);
  }

  // attempts to assign username to user
  async function chooseUsername(e) {
    e.preventDefault();
    // if username taken
    if (usernameTaken()) {
      alert("That username is taken. Please try another.");
    // if username available
    } else {
      await firebase.firestore().collection('users').doc(uid()).set({
        username: username
      });
    }
  }

  return (
    <div className="ChooseUsername">
      <form onSubmit={chooseUsername}>
        {/* Username */}
        <label htmlFor="usernameInput">Username</label>
        <input
        value={username}
        type="text"
        id="usernameInput"
        onChange={e => setUsername(e.target.value)}
        pattern="[A-Za-z0-9_]{3,16}"
        required
        />
        {/* Button */}
        <button type="submit">Choose Username</button>
      </form>
    </div>
  );
}

export default ChooseUsername;
