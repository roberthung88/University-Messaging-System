import { firestore, storage, messaging } from './service';
import { getDisplayName, getUserEmail, getUserUuid, getProfilePicUrl } from './auth';
const LOADING_IMAGE_URL = 'https://www.google.com/images/spin-32.gif?a';

// getChatroomsListener gets a listener for a particular user's chatrooms.
// The callback function should expect to be passed a snapshot when a user's chatrooms change.
// Returns the built listener so that the caller can detach later if they want to.
export function getChatroomsListener(uid, callback) {
  return firestore().collection('chatrooms').where("membersArr", "array-contains", uid).onSnapshot(callback);
}

// getMessagesListener gets a listener for a particular chatroom's messages.
// The callback should expect to be passed a firestore snapshot whenever the messages collection changes.
// Returns the built listener so that the caller can detach later if they want to.
export function getMessagesListener(chatroomId, callback) {
  return firestore().collection('chatrooms').doc(chatroomId).collection('messages').orderBy('timestamp').onSnapshot(callback);
}

export function getChatroomInfoListener(chatroomId, callback) {
  return firestore().collection('chatrooms').doc(chatroomId).onSnapshot(callback);
}

export function getMembersListHandler(chatroomId, callback) {
  return firestore().collection('chatrooms').doc(`${chatroomId}`).onSnapshot(callback);
}

export function saveUserProfileImage(file) {
  const filePath = `${getUserUuid()}/profilePicUrl/${file.name}`;
  storage().ref(filePath).put(file).then((fileSnapshot) => {
    return fileSnapshot.ref.getDownloadURL().then((url) => {
      return firestore().collection('users').doc(`${getUserUuid()}`).update({
        profilePicUrl: url,
      });
    });
  }).catch((error) => {
    console.error('There was an error uploading the profile image:', error);
  });
}

export function saveChatroomImage(chatroomId, file) {
  const filePath = getUserUuid() + '/' + chatroomId + '/' + file.name;
  storage().ref(filePath).put(file).then((fileSnapshot) => {
    return fileSnapshot.ref.getDownloadURL().then((url) => {
      return firestore().collection('chatrooms').doc(`${chatroomId}`).update({
        chatIconUrl: url,
      });
    });
  }).catch((error) => {
    console.error('There was an error uploading the chat icon:', error);
  });
}

export function saveChatroomSettings(chatroomId, chatName, isPrivate, institution) {
  if(chatName.length > 0 && institution.length > 0) {
    return firestore().collection('chatrooms').doc(chatroomId).update({
      name: chatName,
      private: isPrivate,
      institution: institution,
    });
  } else {
    console.error('Failed to update chatroom settings. Please check your chatroom name and institution.');
    return null;
  }
}

export function saveUserProfile(name, institution) {
  if(name.length > 0 && institution.length > 0) {
    return firestore().collection('users').doc(getUserUuid()).update({
      name: name,
      institution: institution,
    });
  } else {
    console.error('Failed to update chatroom settings. Please check your chatroom name and institution.');
    return null;
  }
}

export function createChatroom(ownerUid, isChatPrivate, members) {
  members.push(ownerUid);
  let adminArr = [];
  adminArr.push(ownerUid);

  return firestore().collection('chatrooms').add({
    name: "New Chat",
    private: isChatPrivate,
    isClassroom: false,
    chatIconUrl: '/chat_placeholder.png',
    institution: 'N/A',
    timestamp: Date.now(),
    adminsArr: adminArr,
    membersArr: members,
  // }).then((docRef) => {
  //   // The document's id is stored under docRef.id

  //   // Add the ownerUid to the member collection
  //   // User has elevated permissions needs to return true if there is nobody in the admins list because they are the creator
  //   firestore().collection('chatrooms').doc(`${docRef.id}`).collection('members').doc(`${ownerUid}`).set({
  //     admin: true,
  //   })
  //   .then(() => {
  //     // Add the chatroom to the user's list of chatrooms. This can eventually allow for custom settings for each user in each chatroom, such as a unique display name for the chatroom.
  //     firestore().collection('users').doc(ownerUid).collection('chatrooms').doc(`${docRef.id}`).set({
  //       admin: true,
  //     });
  //   }).then(() => {
  //     // Add the user to the members collection
  //     // Add the chatroom to each of the member's list of chatrooms
  //     members.forEach((uid, index) => {
  //       if (uid != ownerUid) {
  //         firestore().collection('chatrooms').doc(`${docRef.id}`).collection('members').doc(`${uid}`).set({
  //           admin: false,
  //         });

  //         firestore().collection('users').doc(uid).collection('chatrooms').doc(`${docRef.id}`).set({
  //           admin: false,
  //         });
  //       }
  //     });
  //   }).then(() => {
  //     // If the user clicks on the current chat, we shouldn't need to reload the page.
  //     // If the user clicks on another chat, load the proper chat.
  //     if (window.location.href.indexOf(`?c=${docRef.id}`) <= -1) {
  //       window.location.replace(`?c=${docRef.id}`);
  //     }
  //   });
  }).catch((error) => {
    console.error('Error writing new message to Firebase Database', error);
  });
}

export function createClassroom(ownerUid, isChatPrivate, members) {
  members.push(ownerUid);
  let adminArr = [];
  adminArr.push(ownerUid);

  return firestore().collection('chatrooms').add({
    name: "New Class",
    private: isChatPrivate,
    isClassroom: true,
    chatIconUrl: '/class_placeholder.png',
    institution: 'N/A',
    timestamp: Date.now(),
    adminsArr: adminArr,
    membersArr: members,
  }).catch((error) => {
    console.error('Error writing new message to Firebase Database', error);
  });
}

export function sendMessage(chatroomId, messageText) {
  // Add a new message entry to the Firebase database.
  return firestore().collection('chatrooms').doc(`${chatroomId}`).collection('messages').add({
    name: getDisplayName(),
    userId: getUserUuid(),
    text: messageText,
    profilePicUrl: getProfilePicUrl(),
    timestamp: firestore.FieldValue.serverTimestamp(),
  }).then((snapshot) => {
    firestore().collection('chatrooms').doc(`${chatroomId}`).update({
      timestamp: Date.now()
    }).catch((error) => {
      console.error('Error updating chatroom timestamp while writing new message to Database', error);
    });
  }).catch((error) => {
    console.error('Error writing new message to Firebase Database', error);
  });
}

export function sendImageMessage(chatroomId, file) {
  firestore().collection('chatrooms').doc(`${chatroomId}`).collection('messages').add({
    name: getDisplayName(),
    userId: getUserUuid(),
    imageUrl: LOADING_IMAGE_URL,
    profilePicUrl: getProfilePicUrl(),
    timestamp: firestore.FieldValue.serverTimestamp(),
  }).then((messageRef) => {
    // 2 - Upload the image to Cloud Storage.
    const filePath = getUserUuid() + '/' + messageRef.id + '/' + file.name;
    return storage().ref(filePath).put(file).then((fileSnapshot) => {
      // 3 - Generate a public URL for the file.
      return fileSnapshot.ref.getDownloadURL().then((url) => {
        // 4 - Update the chat message placeholder with the image’s URL.
        return messageRef.update({
          imageUrl: url,
          storageUri: fileSnapshot.metadata.fullPath,
        });
      });
    });
  }).catch((error) => {
    console.error('There was an error uploading a file to Cloud Storage:', error);
    // TODO: Delete the attempted message from the database.
  });
}

export function loadUserProfile(uuid, callback) {
  return firestore().collection('users').doc(`${uuid}`).get().then(callback);
}

export function checkUserData() {
  // Check if the user is in our users collection. If not, they are a new user.
  const uuid = getUserUuid();
  firestore().collection('users').doc(`${uuid}`).get().then((doc) => {
    if (!doc.exists) {
      saveNewUserProfile();
      // console.log("Saving new user profile to database");
    } else {
      // Check and see if the user has changed their google profile picture or display name and update it in our servers accordingly
      if (doc.data().profilePicUrl !== getProfilePicUrl()) {
        firestore().collection('users').doc(`${uuid}`).update({
          profilePicUrl: getProfilePicUrl(),
        });
      }
      if (doc.data().name !== getDisplayName()) {
        firestore().collection('users').doc(`${uuid}`).update({
          name: getDisplayName(),
        });
      }
    }
  }).catch((error) => {
    console.log("Error checking if user exists: ", error);
  });

  saveMessagingDeviceToken();
}

// Triggers when a new user is created in our database.
// Institution is set to N/A when user is created.
export function saveNewUserProfile() {
  // Add a new user entry to the Firebase database.
  return firestore().collection('users').doc(`${getUserUuid()}`).set({
    name: getDisplayName(),
    email: getUserEmail(),
    uuid: getUserUuid(),
    profilePicUrl: getProfilePicUrl(),
    institution: 'N/A',
  }).then((docRef) => {
    // The document's id is stored under docRef.id

    // Create an empty interests collection
    firestore().collection('users').doc(`${getUserUuid()}`).collection('interests').add({
      name: "N/A",
    });

    // Create an empty majors collection
    firestore().collection('users').doc(`${getUserUuid()}`).collection('majors').add({
      name: "Undeclared",
    });
  }).catch((error) => {
    console.error('Error writing new message to Firebase Database', error);
  });
}

// Saves the messaging device token to the datastore.
export function saveMessagingDeviceToken() {
  messaging().getToken().then((currentToken) => {
    if (currentToken) {
      // console.log('Got FCM device token:', currentToken);
      // Saving the Device Token to the datastore.
      firestore().collection('fcmTokens').doc(currentToken)
          .set({ uid: getUserUuid() });
    } else {
      // Need to request permissions to show notifications.
      requestNotificationsPermissions();
    }
  }).catch((error) => {
    console.error('Unable to get messaging token.', error);
  });
}

// Requests permissions to show notifications.
export function requestNotificationsPermissions() {
  console.log('Requesting notifications permission...');
  messaging().requestPermission().then(() => {
    // Notification permission granted.
    saveMessagingDeviceToken();
  }).catch((error) => {
    console.error('Unable to get permission to notify.', error);
  });
}

// Handler for when the Invite User button is clicked
export function onInviteUserSubmit(chatroomId, userEmail) {
  const query = firestore().collection('users').where("email", "==", `${userEmail}`);
    query.get().then((snapshot) => {
      snapshot.forEach((doc) => {
        inviteUserToChat(chatroomId, doc.id);
      });
    });
}

// Invite a user to the current chat based on their email.
// Note: This method does not check to see if the user already exists. If user exists in admins, user will be added to members anyway. However, arrayUnion does not insert duplicates.
export function inviteUserToChat(chatroomId, uid) {
  return firestore().collection('chatrooms').doc(`${chatroomId}`).update({
    membersArr: firestore.FieldValue.arrayUnion(uid),
  });
}