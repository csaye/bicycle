import './Message.css';
import React, { useState } from 'react';
import firebase from 'firebase/app';

function Message(props) {
  const { id, content, senderUid, createdAt } = props.data;

  // get uid
  const uid = firebase.auth().currentUser.uid;

  const [deleting, setDeleting] = useState(false);

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
      <h6>{createdAt.toDate().toDateString()} {createdAt.toDate().toLocaleTimeString()}</h6>
      <p>{content}</p>
      {
        // if own message, show delete button
        uid === senderUid &&
        <button onClick={() => setDeleting(!deleting)} className="x-button">✖</button>
      }
      {
        deleting &&
        <div>
          <p className="font-weight-bold">Really delete this message?</p>
          <button onClick={() => setDeleting(false)}>No</button>
          <button onClick={deleteMessage} className="delete-button">Yes</button>
        </div>
      }
    </div>
  );
}

export default Message;
