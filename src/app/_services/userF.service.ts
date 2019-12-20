import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';

import { User } from '../_models';
import { error } from 'util';
import { first } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class UserFService {
  private dbPath = 'users';
  usersRef: AngularFirestoreCollection<User> = null;

  constructor(private http: HttpClient, private db: AngularFirestore) {
    this.usersRef = db.collection(this.dbPath);
  }

  getAll() {
    return this.http.get<User[]>(`/users`);
  }

  getById(id: number) {
    return this.http.get(`/users/` + id);
  }

  authenticate(username: string, password: string) {
    // var docRef = this.db.collection('users').doc(username);
    // docRef.get().subscribe(doc => {
    //   console.log(doc);

    //   if (doc.exists) {
    //     console.log("Document data:", doc.data());
    //   } else {
    //     // doc.data() will be undefined in this case
    //     console.log("No such document!");
    //   }
    // }, error => {
    //   console.log("Error getting document:", error);
    // });

    // let docRef = this.db.collection('users', ref => ref.where('username', '==', username).where('password', '==', password));
    let docRef = this.usersRef.ref.where('username', '==', username).where('password', '==', password);

    let query = docRef.get()
      .then(snapshot => {
        if (snapshot.empty) {
          console.log('No matching documents.');
          return;
        }

        snapshot.forEach(doc => {
          console.log(doc.id, '=>', doc.data());
        });
      })
      .catch(err => {
        console.log('Error getting documents', err);
      });

    // let userRef = this.db.collection<UserF>('users', ref => ref.where('username', '==', username));
    // userRef.get().subscribe(querySnapshot => {
    //   console.log(querySnapshot.docs);
    // });


    // return new Promise<any>((resolve, reject) => {
    //   return this.usersRef.snapshotChanges()
    //     .then(res => resolve(res))
    //     .catch(err => reject(err));
    // });
  }

  register(data: User) {
    return new Promise<any>((resolve, reject) => {
      this.usersRef
        .doc(data.username).set(data)
        .then(res => resolve(res))
        .catch(err => reject(err));
    });
  }

  update(user: User) {
    return this.http.put(`/users/` + user.id, user);
  }

  delete(id: number) {
    return this.http.delete(`/users/` + id);
  }
}