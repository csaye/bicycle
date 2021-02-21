import React, { useEffect, useState } from 'react'
import './Message.css';
import firebase from 'firebase/app';
import $ from 'jquery';

function Message(props) {
  const { id, content, senderUid, receiverUid, createdAt, read } = props.data;

  // get uid
  const uid = firebase.auth().currentUser.uid;

  const [readMessage, setReadMessage] = useState(true);

  useEffect(() => {
    // initialize tooltips on start
    $('[data-toggle="tooltip"]').tooltip({ trigger: "hover" })

    // if not read and current uid receiver uid, set as read
    if (uid === receiverUid && !read) {
      setReadMessage(false);
      firebase.firestore().collection('messages').doc(id).update({
        read: true
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // deletes message from firebase by id
  async function deleteMessage() {
    await firebase.firestore().collection('messages').doc(id).delete();
  }

  return (
    <div className={
      uid === senderUid ?
      "Message hover-shadow sent-message" :
      "Message hover-shadow received-message"
    }>
      <h6>{createdAt.toDate().toDateString()} {createdAt.toDate().toLocaleTimeString()}
      {
        !readMessage &&
        <span className="new-text"> (new)</span>
      }
      </h6>
      <p>{content}</p>
      {
        // if own message, show delete button
        uid === senderUid &&
        <span data-toggle="tooltip" title="Delete message">
          <button
          data-toggle="collapse"
          data-target={`#messageCollapse-${id}`}
          className="x-button">
          ✖
          </button>
        </span>
      }
      <div className="collapse" id={`messageCollapse-${id}`}>
        <p className="font-weight-bold">Really delete this message?</p>
        <button data-toggle="collapse" data-target={`#messageCollapse-${id}`}>No</button>
        <button onClick={deleteMessage} className="delete-button">Yes</button>
      </div>
    </div>
  );
}

export default Message;
