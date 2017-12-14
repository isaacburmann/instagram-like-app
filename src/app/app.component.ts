import {Component, OnInit} from '@angular/core';
import * as firebase from "firebase";
import {Router} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';

  constructor(private router: Router) {
  }

  ngOnInit() {
    // Initialize Firebase
    const config = {
      apiKey: "AIzaSyCVVjV4GTqjSBWE5qRXznq9h8_hoNRv6Z8",
      authDomain: "instagram-d24a5.firebaseapp.com",
      databaseURL: "https://instagram-d24a5.firebaseio.com",
      projectId: "instagram-d24a5",
      storageBucket: "instagram-d24a5.appspot.com",
      messagingSenderId: "928849873423"
    };
    firebase.initializeApp(config);
    this.router.navigate(['login']);
  }
}
