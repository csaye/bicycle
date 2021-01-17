// import React, { useState } from 'react';
import './Navbar.css';
import { Link } from 'react-router-dom';
import firebase from 'firebase/app';

// function uid() {
//   return firebase.auth().currentUser?.uid;
// }

// Navbar component
function Navbar() {
  // let [username, setUsername] = useState('');
  //
  // async function getUsername() {
  //   let userData = await firebase.firestore()
  //   .collection('users')
  //   .doc(uid()).get();
  //   setUsername(userData.data().username);
  // }
  // getUsername();

  return (
    <div className="Navbar">
      <p>Bicycle</p>
      <div className="flex-fill"></div>
      <Link to="/" className="link">Home</Link>
      {
        !firebase.auth().currentUser &&
        <Link to="/signin" className="link">Sign in</Link>
      }
      {
        !firebase.auth().currentUser &&
        <Link to="/signup" className="link">Sign up</Link>
      }
      {
        firebase.auth().currentUser &&
        <p>Signed in as {firebase.auth().currentUser.displayName}</p>
      }
      {
        firebase.auth().currentUser &&
        <button onClick={() => firebase.auth().signOut()}>Sign Out</button>
      }
    </div>
  );
}

export default Navbar;
