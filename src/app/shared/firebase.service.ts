import {Injectable} from "@angular/core";
import * as firebase from "firebase";
import {UserService} from "./user.service";

@Injectable()
export class FirebaseService {

  constructor(private userService: UserService) {}

  getUserFromDatabase(uid) {

    const ref = firebase.database().ref('users/' + uid);
    return ref.once('value')
      .then(snapshot => snapshot.val());

  }

  generateRandomName() {
    let text = '';
    const possible = 'ABCDEFGHIJLMNOPQRSTUVWXYZabcdefghijlmnopqrstuvwxys0123456789';

    for (let i = 0; i < 5; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }

  uploadFile(file: File) {
    const fileName = this.generateRandomName();
    const fileRef = firebase.storage().ref().child('image/' + fileName);
    const uploadTask = fileRef.put(file);

    return new Promise((resolve, reject) => {
      uploadTask.on('state_changed',
        snapshot => {
        },
        error => {
          reject(error);
        },
        () => {
          const fileURL = uploadTask.snapshot.downloadURL;
          resolve({fileName, fileURL});
        });
    });
  }

  handleImageUpload(data) {
    const user = this.userService.getProfile();

    const myPostKey = firebase.database().ref().child('myposts').push().key;
    const myPostDetails = {
      fileURL: data.fileURL,
      name: data.fileName,
      creationDate: new Date().toString()
    };

    const allPostKey = firebase.database().ref().child('allposts').push().key;
    const allPostDetails = {
      fileURL: data.fileURL,
      name: data.fileName,
      creationDate: new Date().toString(),
      uploadedBy: user
    };

    const imageDetails = {
      fileURL: data.fileURL,
      name: data.fileName,
      creationDate: new Date().toString(),
      uploadedBy: user,
      favoriteCount: 0
    };

    const updates = {};
    updates['/myposts/' + user.uid + '/' + myPostKey] = myPostDetails;
    updates['/allposts/' + allPostKey] = allPostDetails;
    updates['/images/' + data.fileName] = imageDetails;

    return firebase.database().ref().update(updates);
  }

  getUserMyPostsRef(uid) {
    return firebase.database().ref('myposts').child(uid);
  }

  handleFavoriteClicked(imageData) {
    const uid = firebase.auth().currentUser.uid;
    const updates = {};

    updates['/images/' + imageData.name + '/oldFavoriteCount/'] = imageData.favoriteCount;
    updates['/images/' + imageData.name + '/favoriteCount/'] = imageData.favoriteCount + 1;
    updates['/favorites/' + uid + '/' + imageData.name] = imageData;

    return firebase.database().ref().update(updates);
  }

  handleFollowClicked(uploadedBy) {
    const uid = firebase.auth().currentUser.uid;
    const updates = {};

    updates['/follow/' + uid + '/' + uploadedBy.uid] = true;

    return firebase.database().ref().update(updates);
  }

}
