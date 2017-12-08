import {EventEmitter} from "@angular/core";

export class UserService {
  statusChange: any = new EventEmitter<any>();

  constructor() { }

  set(userDB) {
    localStorage.setItem('user', JSON.stringify(userDB));
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
