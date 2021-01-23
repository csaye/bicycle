import './Messages.css';
import React, { useState, useEffect } from 'react';
import firebase from 'firebase/app';
import { useCollectionData } from 'react-firebase-hooks/firestore';

import Message from '../Message/Message.js';

const maxMessageLength = 1024;
const messageLimit = 32;

function Messages() {
  // get uid
  const uid = firebase.auth().currentUser.uid;
  const [friendUid, setFriendUid] = useState('');
  const [friendName, setFriendName] = useState('');
  const [friendsQuery, setFriendsQuery] = useState(undefined);

  const uids = [uid, friendUid];

  // get mutual friends of current user
  async function getFriendsQuery() {
    const usersRef = firebase.firestore().collection('users');
    const userData = await usersRef.doc(uid).get();
    // get query based on friends
    const query = userData.data().friends.length > 0 ?
    usersRef
    .where("__name__", "in", userData.data().friends)
    .where("friends", "array-contains", uid) :
    usersRef.where("__name__", "==", 'null');
    setFriendsQuery(query);
  }
  const [friends] = useCollectionData(friendsQuery, {idField: 'id'});

  useEffect(() => {
    getFriendsQuery();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // get messages from uid
  const messagesRef = firebase.firestore().collection('messages');
  const messagesQuery = messagesRef
  .where('uids', '==', uids.sort())
  .orderBy('createdAt', 'desc')
  .limit(messageLimit);
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

  return (
    <div className="Messages">
      {/* friends list */}
      {
        friends ?
        <div className="friends-list">
          {
            friends.length > 0 &&
            <p className="text-center">Mutual friends</p>
          }
          {
            friends.length > 0 ?
            friends.map(f =>
              <button key={f.id} onClick={() => {
                setFriendUid(f.id);
                setFriendName(f.displayName);
              }}>
                {f.displayName}
              </button>
            ) :
            <p>No mutual friends yet</p>
          }
        </div> :
        <div className="friends-list">
          <p>Retrieving friends...</p>
        </div>
      }
      {/* message list */}
      {
        messages ?
        <div>
          {
            friendUid ?
            <div className="message-list">
              {/* send message */}
              <form onSubmit={sendMessage}>
                <p className="messaging-with">Messaging with {friendName}</p>
                {/* Content */}
                <textarea
                value={content}
                type="text"
                placeholder="content"
                onChange={e => setContent(e.target.value)}
                maxLength={maxMessageLength}
                rows="4"
                required
                />
                {/* send button */}
                <button type="submit" className="send-button">Send</button>
              </form>
              {
                messages.length > 0 ?
                messages.map(m => <Message key={m.id} data={m} />) :
                <p>No messages yet</p>
              }
            </div> :
            <p className="pick-text">Pick a mutual friend to message with.</p>
          }
        </div> :
        <p className="pick-text">Retrieving messages...</p>
      }
    </div>
  );
}

export default Messages;
