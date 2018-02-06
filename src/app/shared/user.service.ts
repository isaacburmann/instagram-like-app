import {EventEmitter} from "@angular/core";
import * as firebase from "firebase";

export class UserService {
  statusChange: any = new EventEmitter<any>();

  constructor() {
  }

  set(userDB) {
    localStorage.setItem('user', JSON.stringify(userDB));

    const messaging = firebase.messaging();

    messaging.requestPermission()
      .then(() => {
        firebase.messaging().getToken()
          .then(token => {
            console.log('token received:', token);

            // Recebendo Mensagens
            messaging.onMessage(payload => {
              console.log(payload);
              // TODO: Display message
            });

            // Gravando token no banco
            const updates = {};
            updates['/users/' + userDB.uid + "/messageToken"] = token;
            return firebase.database().ref().update(updates);
          })
          .catch(error => {
            console.log(error);
          });
      })
      .catch(error => {
        console.log(error);
      });

    this.statusChange.emit(userDB);
  }

  destroy() {
    localStorage.removeItem('user');
    this.statusChange.emit(null);
  }

  getProfile() {
    const user = localStorage.getItem('user');
    return JSON.parse(user);
  }
}
