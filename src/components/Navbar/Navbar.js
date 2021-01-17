import './Navbar.css';
import { Link } from 'react-router-dom';

// Navbar component
function Navbar() {
  return (
    <div className="Navbar">
      <p>Navbar</p>
      <Link to="/">Home</Link>
      <Link to="/signup">Sign up</Link>
      <Link to="/signin">Sign in</Link>
    </div>
  );
}

export default Navbar;
