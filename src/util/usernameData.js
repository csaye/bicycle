import firebase from 'firebase/app';

const reservedUsernames = [
  'signin', 'signup', 'users', 'settings', 'about', 'friends', 'messages', 'discover', 'resetpassword'
];

// returns whether username is taken
export async function usernameTaken(username) {
  // get lowercase username
  const usernameLower = username.toLowerCase();
  // if username reserved, return true
  if (reservedUsernames.includes(usernameLower)) return true;
  // return whether username taken by other user
  const snapshot = await firebase.firestore().collection('users').get();
  const users = snapshot.docs.map(d => d.data());
  return users.some((user) => user.usernameLower === usernameLower);
}
