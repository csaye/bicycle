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

  const [loadingMessages, setLoadingMessages] = useState(false);

  // sort uids for easier lookup
  const uids = [uid, friendUid].sort();

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
  // sort friends by username if friends
  let sortedFriends = friends?.slice();
  if (sortedFriends) {
    sortedFriends.sort((a, b) => {
      if (a.usernameLower < b.usernameLower) return -1;
      if (a.usernameLower > b.usernameLower) return 1;
      return 0;
    });
  }

  useEffect(() => {
    getFriendsQuery();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // get messages from uid
  const messagesRef = firebase.firestore().collection('messages');
  const messagesQuery = messagesRef
  .where('uids', '==', uids)
  .orderBy('createdAt', 'desc')
  .limit(messageLimit);
  const [messages] = useCollectionData(messagesQuery, {idField: 'id'});

  // stop loading messages after undefined registers
  useEffect(() => {
    if (!messages) setLoadingMessages(false);
  }, [messages]);

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
        sortedFriends ?
        <div className="friends-list">
          {
            sortedFriends.length > 0 &&
            <p className="text-center">Mutual friends</p>
          }
          {
            sortedFriends.length > 0 ?
            sortedFriends.map(f =>
              <button key={f.id} onClick={() => {
                // start loading messages
                setLoadingMessages(true);
                // update friend uid and name
                setFriendUid(f.id);
                setFriendName(f.username);
              }}>
                {f.username}
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
        // if messages and not loading messages
        (messages && !loadingMessages) ?
        <div>
          {
            // if friend uid valid
            friendUid ?
            <div className="message-list">
              {/* send message */}
              <form onSubmit={sendMessage}>
                <p className="messaging-with">Messaging with {friendName}</p>
                {/* content */}
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
            // if friend uid not valid
            <p className="pick-text">Pick a mutual friend to message with.</p>
          }
        </div> :
        // if not messages or loading messages
        <p className="pick-text">Retrieving messages...</p>
      }
    </div>
  );
}

export default Messages;
