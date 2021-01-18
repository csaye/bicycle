import './Navbar.css';
import { Link } from 'react-router-dom';
import firebase from 'firebase/app';

// Navbar component
function Navbar() {
  function signOut() {
    firebase.auth().signOut();
    window.location.href = '/signin';
  }

  return (
    <div className="Navbar">
      <Link to="/" className="link">Bicycle</Link>
      <div className="flex-fill"></div>
      {
        firebase.auth().currentUser &&
        <Link to="/" className="link">Home</Link>
      }
      {
        firebase.auth().currentUser &&
        <Link to="/users" className="link">Users</Link>
      }
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
        <button onClick={signOut}>Sign Out</button>
      }
    </div>
  );
}

export default Navbar;
