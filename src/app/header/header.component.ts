import {Component, OnInit} from '@angular/core';
import * as firebase from "firebase";
import {UserService} from "../shared/user.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  isLoggedIn = false;
  uid: string;
  name: string;
  email: string;

  constructor(private userService: UserService, private router: Router) {
  }

  ngOnInit() {
    this.userService.statusChange.subscribe(userData => {
      if (userData) {
        this.name = userData.fullname;
        this.email = userData.email;
        this.uid = userData.uid;
      } else {
        this.name = null;
        this.email = null;
        this.uid = null;
      }
    });

    firebase.auth().onAuthStateChanged(userData => {
      if (userData && userData.emailVerified) {
        this.isLoggedIn = true;
        const user = this.userService.getProfile();
        if (user && user.fullname) {
          this.name = user.fullname;
          this.email = user.email;
          this.uid = user.uid;
        }
        this.router.navigate(['allposts']);
      } else {
        this.isLoggedIn = false;
      }
    });
  }

  logout() {
    firebase.auth().signOut()
      .then(() => {
        this.router.navigate(['login']);
        this.userService.destroy();
        this.isLoggedIn = false;
      });
  }

}
