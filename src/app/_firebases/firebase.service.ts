import { Injectable } from '@angular/core';
import { AngularFirestore, CollectionReference } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(public db: AngularFirestore) { }

  getRef(collectionName: string): CollectionReference {
    return this.db.collection(collectionName).ref;
  }

  get(collectionName: string, dataKey: string) {
    return this.db.collection(collectionName).doc(dataKey).snapshotChanges();
  }

  getAll(collectionName: string) {
    return this.db.collection(collectionName).snapshotChanges();
  }

  create<T>(collectionName: string, data: T) {
    return this.db.collection(collectionName).add(data);
  }

  update<T>(collectionName: string, dataKey: string, data: T) {
    return this.db.collection(collectionName).doc(dataKey).set(data);
  }

  delete(collectionName: string, dataKey: string) {
    return this.db.collection(collectionName).doc(dataKey).delete();
  }
}
