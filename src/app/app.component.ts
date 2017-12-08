import {Component, OnInit} from '@angular/core';
import * as firebase from "firebase";
import {Router} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'app';

  constructor(private router: Router) { }

  ngOnInit() {

    // ADD YOUR FIREBASE CONNECTION CONFIGURATION HERE
    
    this.router.navigate(['login']);
  }
}
