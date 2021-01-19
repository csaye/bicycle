import firebase from 'firebase/app';

const reservedUsernames = [
  'signin', 'signup', 'users', 'settings'
];

// returns whether username is taken
export async function usernameTaken(username) {
  // if username reserved, return true
  if (reservedUsernames.includes(username)) return true;
  // return whether username taken by other user
  const snapshot = await firebase.firestore().collection('users').get();
  const users = snapshot.docs.map(d => d.data());
  return users.some((user) => user.username === username);
}
