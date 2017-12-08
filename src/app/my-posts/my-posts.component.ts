import {Component, OnDestroy, OnInit} from '@angular/core';
import {NotificationService} from "../shared/notification.service";
import {FirebaseService} from "../shared/firebase.service";
import * as firebase from "firebase";

@Component({
  selector: 'app-my-posts',
  templateUrl: './my-posts.component.html',
  styleUrls: ['./my-posts.component.css']
})
export class MyPostsComponent implements OnInit, OnDestroy {
  myPostsRef: any;
  postsList: any = [];

  constructor(private ntService: NotificationService, private fbService: FirebaseService, ) { }

  ngOnInit() {
    const uid = firebase.auth().currentUser.uid;
    this.myPostsRef = this.fbService.getUserMyPostsRef(uid);
    this.myPostsRef.on('child_added', data => {
      this.postsList.push({
        key: data.key,
        data: data.val()
      });
    });
  }

  onFileSelection(event) {
    const fileList: FileList = event.target.files;

    if (fileList.length > 0) {
      const file: File = fileList[0];
      this.fbService.uploadFile(file)
        .then(data => {
          this.ntService.display('success', 'Imagem enviada com sucesso!');
          this.fbService.handleImageUpload(data);
          console.log('Enviou a imagem');
          console.log(data['fileURL']);
        })
        .catch(err => {
          this.ntService.display('error', err.message);
        });
    }
  }

  ngOnDestroy() {
    this.myPostsRef.off();
  }

}
