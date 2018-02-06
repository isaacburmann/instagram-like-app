import { Component, OnInit } from '@angular/core';
import {NgForm} from "@angular/forms";
import {NotificationService} from "../../shared/notification.service";
import * as firebase from "firebase";
import {FirebaseService} from "../../shared/firebase.service";
import {UserService} from "../../shared/user.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private ntService: NotificationService,
              private fbService: FirebaseService,
              private userService: UserService,
              private router: Router) { }

  ngOnInit() {
  }

  onSubmit(form: NgForm) {
    const email = form.value.email;
    const password = form.value.password;

    firebase.auth().signInWithEmailAndPassword(email, password)
      .then(userData => {
        if (userData.emailVerified) {
          console.log('logado');
          return this.fbService.getUserFromDatabase(userData.uid);
        } else {
          const message = "Seu email ainda não foi verificado.";
          this.ntService.display('error', message);
          firebase.auth().signOut();
        }
      })
      .then(userDB => {
        if (userDB) {
          this.userService.set(userDB);
          this.router.navigate(['allposts']);
        }
      })
      .catch(err => {
        this.ntService.display('error', err.message);
      });
  }

}
