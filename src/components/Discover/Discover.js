import './Discover.css';
import firebase from 'firebase/app';
import React, { useState, useEffect } from 'react';
import { useCollectionData } from 'react-firebase-hooks/firestore';

import User from '../User/User.js';

// Discover component
function Discover() {
  // get current uid
  const uid = firebase.auth().currentUser.uid;

  const [friendsQuery, setFriendsQuery] = useState(undefined);
  const [friends] = useCollectionData(friendsQuery, {idField: 'id'});
  // gets query for current user friends
  async function getFriendsQuery() {
    const usersRef = firebase.firestore().collection('users');
    const userData = await usersRef.doc(uid).get();
    const fQuery = userData.data().friends.length > 0 ?
    usersRef
    .where("__name__", "in", userData.data().friends) :
    usersRef.where("__name__", "==", 'null');
    setFriendsQuery(fQuery);
  }
  // get friends of user on start
  useEffect(() => {
    getFriendsQuery();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [discoverUids, setDiscoverUids] = useState(undefined);
  // gets discover uids based on friends
  function getDiscoverQuery() {
    const dUids = [];
    // for each friend
    friends.forEach(f => {
      // for each friend of friend
      f.friends.forEach(ff => {
        // if not already in duids list or friends list or self
        if (!dUids.includes(ff) && ff !== uid && !friends.some(fr => fr.id === ff)) {
          // add to duids
          dUids.push(ff);
        }
      })
    });
    setDiscoverUids(dUids.slice());
  }
  // get discover uids on friends change
  useEffect(() => {
    if (friends) getDiscoverQuery();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [friends]);

  const [usersQuery, setUsersQuery] = useState(undefined);
  const [users] = useCollectionData(usersQuery, {idField: 'id'});
  // gets users to discover ordered by username
  function getUsersQuery() {
    const usersRef = firebase.firestore().collection('users');
    const uQuery = discoverUids.length > 0 ?
    usersRef.where('__name__', 'in', discoverUids) :
    usersRef.where('__name__', '==', 'null');
    setUsersQuery(uQuery);
  }
  // get users query on discover uids change
  useEffect(() => {
    if (discoverUids) getUsersQuery();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [discoverUids]);

  const [sortedUsers, setSortedUsers] = useState(undefined);
  // gets users sorted by username lower
  function getSortedUsers() {
    const sUsers = users.slice();
    sUsers.sort((a, b) => {
      if (a.usernameLower < b.usernameLower) return -1;
      if (a.usernameLower > b.usernameLower) return 1;
      return 0;
    });
    setSortedUsers(sUsers);
  }
  // get sorted users on users change
  useEffect(() => {
    if (users) getSortedUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [users])

  // if no users yet, wait
  if (!sortedUsers) {
    return (
      <div className="Discover">
        <p className="margin-sm">Retrieving users...</p>
      </div>
    )
  }

  return (
    <div className="Discover">
      { sortedUsers.length > 0 && <p className="may-know">Users you may know</p> }
      <div className="user-list">
        {
          sortedUsers.length > 0 ?
          sortedUsers.map(u => <User key={u.id} data={u} />) :
          <div className="margin-sm">
            No recommendations yet.
          </div>
        }
      </div>
    </div>
  );
}

export default Discover;
