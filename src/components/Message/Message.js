import React, { useEffect } from 'react'
import './Message.css';
import firebase from 'firebase/app';
import $ from 'jquery';

function Message(props) {
  const { id, content, senderUid, createdAt } = props.data;

  // get uid
  const uid = firebase.auth().currentUser.uid;

  // initialize tooltips on start
  useEffect(() => {
    $('[data-toggle="tooltip"]').tooltip({ trigger: "hover" })
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
      <h6>{createdAt.toDate().toDateString()} {createdAt.toDate().toLocaleTimeString()}</h6>
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
