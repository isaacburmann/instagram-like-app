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

  // Coloque suas credenciais do firebase aqui
  ngOnInit() {
    // Initialize Firebase
    const config = {
      apiKey: "",
      authDomain: "",
      databaseURL: "",
      projectId: "",
      storageBucket: "",
      messagingSenderId: ""
    };
    firebase.initializeApp(config);
    this.router.navigate(['login']);
  }
}
