import './SettingsExtras.css';
import React, { useState } from 'react';
import firebase from 'firebase/app';

function SettingsExtras() {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [panelState, setPanelState] = useState('');

  const [password, setPassword] = useState('');

  function resetInfo() {
    setError('');
    setSuccess('');
    setPanelState('');
    setPassword('');
  }

  async function resetPassword() {
    resetInfo();
    const currentEmail = firebase.auth().currentUser.email;
    try {
      await firebase.auth().sendPasswordResetEmail(currentEmail);
      setSuccess(`Email successfully sent to ${currentEmail}`);
    } catch(e) {
      setError(e.message);
    }
  }

  function startDelete() {
    setSuccess('');
    setError(panelState !== 'delete' ? "Re-enter password to permanently delete account and all posts." : '');
    setPanelState(panelState === 'delete' ? '' : 'delete');
  }

  // deletes a user and all of their posts
  async function deleteAccount(e) {
    e.preventDefault();
    setError('');

    // sign in user again
    const currentEmail = firebase.auth().currentUser.email;
    try {
      await firebase.auth().signInWithEmailAndPassword(currentEmail, password);
    // set error and return on catch
    } catch (e) {
      if (e.code === 'auth/wrong-password') {
        setError('Incorrect password. Please try again.');
      } else if (e.code === 'auth/too-many-requests') {
        setError('Too many sign in requests. Please try again later.')
      } else {
        setError(e.message);
      }
      return;
    }

    // delete user reference
    const uid = firebase.auth().currentUser.uid;
    await firebase.firestore().collection('users').doc(uid).delete();

    // delete user as friend
    // await firebase.firestore().collection('users')
    // .where('friends', 'array-contains', uid).get()
    // .then((snapshot) => {
    //   // remove friend for all docs
    //   snapshot.forEach((doc) => {
    //     doc.ref.update({
    //       friends: firebase.firestore.FieldValue.arrayRemove(uid)
    //     })
    //   });
    // });

    // delete user posts
    await firebase.firestore().collection('posts').where('uid', '==', uid).get()
    .then((snapshot) => {
      // create batch
      const batch = firebase.firestore().batch();
      // batch all deletions
      snapshot.forEach((doc) => {
        batch.delete(doc.ref);
      });
      // commit batch
      batch.commit();
    });

    // delete user messages
    await firebase.firestore().collection('messages').where('uids', 'array-contains', uid).get()
    .then((snapshot) => {
      // create batch
      const batch = firebase.firestore().batch();
      // batch all deletions
      snapshot.forEach((doc) => {
        batch.delete(doc.ref);
      });
      // commit batch
      batch.commit();
    });

    // if profile pic exists
    const listResult = await firebase.storage().ref(uid + '/profilePicture').listAll();
    if (listResult.items.length > 0) {
      // delete profile pic
      const storageRef = firebase.storage().ref(uid + '/profilePicture/profilePicture');
      await storageRef.delete().catch(e => console.log(e));
    }

    // delete account
    await firebase.auth().currentUser.delete()
    .catch((e) => {
      setError(e.message);
    });
  }

  return (
    <div className="SettingsExtras flex-col">
      <div>
        {/* reset password */}
        <button onClick={resetPassword}>Reset password</button>
        {/* delete account */}
        <button onClick={startDelete}>Delete account</button>
      </div>
      {/* error */}
      { error && <p className="text-danger text-center">{error}</p> }
      {/* success */}
      { success && <p className="text-success text-center">{success}</p> }
      {
        panelState &&
        <div>
          {
            panelState === 'delete' &&
            <div className="flex-col">
              <form onSubmit={deleteAccount} className="flex-col">
                <div>
                  {/* password */}
                  <label htmlFor="delPwdInput">Password</label>
                  <input
                  value={password}
                  type="password"
                  id="delPwdInput"
                  placeholder="password"
                  onChange={e => setPassword(e.target.value)}
                  required
                  />
                  <button type="submit">Yes, delete my account</button>
                </div>
              </form>
              <button onClick={resetInfo} className="cancel-button">No, do not delete my account</button>
            </div>
          }
        </div>
      }
    </div>
  );
}

export default SettingsExtras;
