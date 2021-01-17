import React, { useState } from 'react';
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
// import { useCollectionData } from 'react-firebase-hooks/firestore';

// SignUp component
function SignUp() {
  let [email, setEmail] = useState('');
  let [password, setPassword] = useState('');
  let [displayName, setDisplayName] = useState('');
  let [username, setUsername] = useState('');

  // const usersRef = firebase.firestore().collection('users').get();
  // const [users] = useCollectionData(usersRef);

  // returns whether username is taken
  async function usernameTaken() {
    let snapshot = await firebase.firestore().collection('users').get();
    let users = snapshot.docs.map(d => d.data());
    return users.some((user) => user.username === username);
  }

  async function signUp(e) {
    e.preventDefault();
    // if username taken, return
    if (await usernameTaken()) {
      alert("That username is taken. Please try another.");
      return;
    }
    // create user
    try {
      await firebase.auth().createUserWithEmailAndPassword(email, password);
    } catch(e) {
      alert(e.message);
      return;
    };

    // set display name
    await firebase.auth().currentUser.updateProfile({
      displayName: displayName
    });
    // set username
    const uid = firebase.auth().currentUser.uid;
    await firebase.firestore().collection('users').doc(uid).set({
      username: username
    });
  }

  return (
    <div className="SignUp">
      <form onSubmit={signUp}>
        {/* Email */}
        <label htmlFor="emailInput">Email</label>
        <input
        value={email}
        type="email"
        id="emailInput"
        onChange={e => setEmail(e.target.value)}
        required
        />
        {/* Password */}
        <label htmlFor="passwordInput">Password</label>
        <input
        value={password}
        type="password"
        id="passwordInput"
        onChange={e => setPassword(e.target.value)}
        required
        />
        {/* Display Name */}
        <label htmlFor="displayNameInput">Display Name</label>
        <input
        value={displayName}
        type="text"
        id="displayNameInput"
        onChange={e => setDisplayName(e.target.value)}
        pattern="[A-Za-z ]{1,32}"
        required
        />
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
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
}

export default SignUp;
