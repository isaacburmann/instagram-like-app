import {Component, OnDestroy, OnInit} from '@angular/core';
import * as firebase from "firebase";
import _ from 'lodash';
import {FirebaseService} from "../shared/firebase.service";

@Component({
  selector: 'app-following',
  templateUrl: './following.component.html',
  styleUrls: ['./following.component.css']
})
export class FollowingComponent implements OnInit, OnDestroy {

  postList: any = [];
  refArray: any = [];

  constructor(private fbService: FirebaseService) {
  }

  ngOnInit() {
    const uid = firebase.auth().currentUser.uid;
    const followRef = firebase.database().ref('follow').child(uid);

    followRef.once('value', data => {
      const uidListOfOtherUsers = _.keys(data.val());
      this.getPostsFromOtherUsers(uidListOfOtherUsers);
    });
  }

  getPostsFromOtherUsers(uidList) {
    for (let count = 0; count < uidList.length; count++) {
      this.refArray[count] = this.fbService.getUserMyPostsRef(uidList[count]);
      this.refArray[count].on('child_added', data => {
        this.postList.push({
          key: data.key,
          data: data.val()
        });
      });
    }
  }

  ngOnDestroy(): void {
    _.forEach(this.refArray, ref => {
      if (ref && typeof(ref) === 'object') {
        ref.off();
      }
    });
  }

}
