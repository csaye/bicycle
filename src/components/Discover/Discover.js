import firebase from 'firebase/app';
import React, { useState, useEffect } from 'react';
import { useCollectionData } from 'react-firebase-hooks/firestore';

import User from '../User/User.js';

// Discover component
function Discover() {
  // get current uid
  const uid = firebase.auth().currentUser.uid;

  const [friendsQuery, setFriendsQuery] = useState(undefined);
  const [friends] = useCollectionData(friendsQuery);
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
        // if not already in list add to duids
        if (!dUids.includes(ff)) dUids.push(ff);
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

  // if no users yet, wait
  if (!users) {
    return (
      <div className="Discover">
        <p>Retrieving users...</p>
      </div>
    )
  }

  return (
    <div className="Discover">
      {
        users.length > 0 ?
        users.map(u => <User key={u.id} data={u} />) :
        <p>No recommendations yet</p>
      }
    </div>
  );
}

export default Discover;
