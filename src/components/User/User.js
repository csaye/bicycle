import './User.css';
import { Link } from 'react-router-dom';

// User component
function User(props) {
  const { username } = props.data;

  return (
    <div className="User">
      <Link to={`/${username}`} className="link">{username}</Link>
    </div>
  );
}

export default User;
