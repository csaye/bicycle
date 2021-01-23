import './Messages.css';
import React, { useState } from 'react';
import firebase from 'firebase/app';
import { useCollectionData } from 'react-firebase-hooks/firestore';

import Message from '../Message/Message.js';

function Messages() {
  // get uid
  const uid = firebase.auth().currentUser.uid;
  const [friendUid, setFriendUid] = useState('friend-uid');

  const uids = [uid, friendUid];

  // get messages from uid
  const messagesRef = firebase.firestore().collection('messages');
  const messagesQuery = messagesRef
  .where('uids', '==', uids)
  .orderBy('createdAt', 'desc');
  const [messages] = useCollectionData(messagesQuery, {idField: 'id'});

  const [content, setContent] = useState('');

  async function sendMessage(e) {
    e.preventDefault();
    setContent('');
    // send new message to firestore
    await firebase.firestore().collection('messages').add({
      uids: uids,
      senderUid: uid,
      receiverUid: friendUid,
      content: content,
      createdAt: new Date()
    });
  }

  if (!messages) {
    return (
      <div className="Messages">
        <p>Retrieving messages...</p>
      </div>
    );
  }

  return (
    <div className="Messages">
      {/* friends list */}
      <div className="friends-list">
      {
        // friends.map(f => )
      }
      </div>
      {/* message list */}
      <div className="message-list">
      {
        messages.length > 0 ?
        messages.map(m => <Message key={m.id} data={m} />) :
        <p>No messages yet</p>
      }
      </div>
      {/* send message */}
      <form onSubmit={sendMessage}>
        {/* Content */}
        <textarea
        value={content}
        type="text"
        placeholder="content"
        onChange={e => setContent(e.target.value)}
        maxLength="1024"
        rows="4"
        required
        />
        {/* send button */}
        <button type="submit" className="send-button">Send</button>
      </form>
    </div>
  );
}

export default Messages;
