import { Injectable } from '@angular/core';
import { AngularFirestore, CollectionReference } from '@angular/fire/firestore';

import { FirebaseService } from './firebase.service';
import { User } from '../_models';

@Injectable({
  providedIn: 'root'
})
export class UserService extends FirebaseService {
  private dbPath = 'users';
  private usersRef: CollectionReference = null;

  constructor(public db: AngularFirestore) {
    super(db);
    this.usersRef = this.getRef(this.dbPath);
  }

  getUser(dataKey: string) {
    return this.get(this.dbPath, dataKey);
  }

  getUsers() {
    return this.getAll(this.dbPath);
  }

  createUser(data: User) {
    return this.create(this.dbPath, data);
  }

  updateUser(data: User) {
    return this.update(this.dbPath, data.id, data);
  }

  deleteUser(dataKey: string) {
    return this.delete(this.dbPath, dataKey);
  }

  authenticate(username: string, password: string) {
    let query = this.usersRef
      .where('username', '==', username)
      .where('password', '==', password)
      .limit(1)
      .get();

    return new Promise<User>((resolve, reject) => {
      query.then((snapshot) => {
        let user: User = null;
        if (!snapshot.empty) {
          snapshot.forEach(q => {
            let doc = q.data();
            user = {
              id: q.id,
              username: doc.username,
              firstName: doc.firstName,
              lastName: doc.lastName,
              token: 'fake-jwt-token'
            };
          });
        }

        resolve(user);
      }).catch(err => reject(err));
    });
  }
}
