import { auth } from './service';

const provider = new auth.GoogleAuthProvider();

export function login() {
  return auth().signInWithRedirect(provider);
}

export function logout() {
  return auth().signOut();
}

// Returns the signed-in user's profile Pic URL.
export function getProfilePicUrl() {
  return auth().currentUser.photoURL || '/profile_placeholder.png';
}

// Returns the signed-in user's display name.
export function getDisplayName() {
  return auth().currentUser.displayName;
}

// Returns the signed-in users's uuid.
export function getUserUuid() {
  return auth().currentUser.uid;
}

// Returns the signed-in user's email address.
export function getUserEmail() {
  return auth().currentUser.email;
}

// Returns true if a user is signed-in.
export function isUserSignedIn() {
  return !!auth().currentUser;
}