import { Component, OnInit } from '@angular/core';
import { NgForm} from "@angular/forms";
import * as firebase from "firebase";
import {NotificationService} from "../../shared/notification.service";

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {

  constructor(private ntService: NotificationService) { }

  ngOnInit() {
  }

  onSubmit(form: NgForm) {
    const fullname = form.value.fullname;
    const email = form.value.email;
    const password = form.value.password;

    firebase.auth().createUserWithEmailAndPassword(email, password)
      .then(userData => {
        userData.sendEmailVerification();
        console.log('enviou email de verificacao');

        const message = `Enviamos um email de verificação para o endereço ${email}. Por favor verifique`;
        this.ntService.display('success', message);

        firebase.database().ref('users/' + userData.uid).set({
          email: email,
          uid: userData.uid,
          fullname: fullname,
          registrationDate: new Date().toString()
        })
          .then(() => {
            firebase.auth().signOut();
          });
      })
      .catch(err => {
        this.ntService.display('error', err.message)
        console.log(err);
      });
  }

}
