import './Navbar.css';
import { Link } from 'react-router-dom';
import firebase from 'firebase/app';

// Navbar component
function Navbar() {
  async function username() {
    const uid = await firebase.auth().currentUser.uid;
    return await firebase.collections('users').doc(uid).get().data().username;
  }

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
        <p>Signed in as {username()}</p>
      }
      {
        firebase.auth().currentUser &&
        <button onClick={() => firebase.auth().signOut()}>Sign Out</button>
      }
    </div>
  );
}

export default Navbar;
