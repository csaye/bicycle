import './Post.css';

// Post component
function Post(props) {
  const { uid, content } = props.data;

  return (
    <div className="Post">
      <h1>{uid}</h1>
      <p>{content}</p>
    </div>
  );
}

export default Post;
