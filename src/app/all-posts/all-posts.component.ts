import {Component, OnDestroy, OnInit} from '@angular/core';
import * as firebase from "firebase";
import _ from 'lodash';
import {FirebaseService} from "../shared/firebase.service";
import {NotificationService} from "../shared/notification.service";

@Component({
  selector: 'app-all-posts',
  templateUrl: './all-posts.component.html',
  styleUrls: ['./all-posts.component.css']
})
export class AllPostsComponent implements OnInit, OnDestroy {

  all: any = [];
  allRef: any;
  loadMoreRef: any;

  constructor(private fbService: FirebaseService, private ntService: NotificationService) { }

  ngOnInit() {
    this.allRef = firebase.database().ref('allposts').limitToFirst(2);
    this.allRef.on('child_added', data => {
      this.all.push({
        key: data.key,
        data: data.val()
      });
    });
  }

  ngOnDestroy(): void {
    this.allRef.off();
    if (this.loadMoreRef) {
      this.loadMoreRef.off();
    }
  }

  onLoadMore() {
    if (this.all.length > 0) {
      const lastLoadedPost = _.last(this.all);
      const lastLoadedPostKey = lastLoadedPost.key;

      this.loadMoreRef = firebase.database().ref('allposts').startAt(null, lastLoadedPostKey).limitToFirst(2 + 1);
      this.loadMoreRef.on('child_added', data => {
        if (data.key === lastLoadedPostKey) {
          return;
        } else {
          this.all.push({
            key: data.key,
            data: data.val()
          });
        }
      });
    }
  }

  onFavoritesClicked(imageData) {
    this.fbService.handleFavoriteClicked(imageData)
      .then(data => {
        this.ntService.display('success', 'Imagem adicionada ao favoritos');
      })
      .catch(error => {
        this.ntService.display('error', error.message);
      });
  }

  onFollowClicked(imageData) {
    this.fbService.handleFollowClicked(imageData.uploadedBy)
      .then(data => {
        this.ntService.display('success', 'Seguindo ' + imageData.uploadedBy.fullname + '!!!');
      })
      .catch(error => {
        this.ntService.display('error', error.message);
      });
  }

}
