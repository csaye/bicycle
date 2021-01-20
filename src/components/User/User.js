import './User.css';
import { Link } from 'react-router-dom';

// User component
function User(props) {
  const { username, displayName } = props.data;

  return (
    <div className="User hover-shadow">
      <h1>{displayName}</h1>
      <Link to={`/${username}`} className="link">@{username}</Link>
    </div>
  );
}

export default User;
