import { Injectable } from '@angular/core';
import { AngularFirestore, CollectionReference } from '@angular/fire/firestore';

import { FirebaseService } from './firebase.service';
import { IMember } from '../_models/imember';

@Injectable({
  providedIn: 'root'
})
export class MemberService extends FirebaseService {
  private dbPath = 'members';
  public collectionRef: CollectionReference = null;

  constructor(public db: AngularFirestore) {
    super(db);
    this.collectionRef = this.getRef(this.dbPath);
  }

  getMember(dataKey: string) {
    return this.get(this.dbPath, dataKey);
  }

  getMembers() {
    return this.getAll(this.dbPath);
  }

  createMember(data: IMember) {
    return this.create(this.dbPath, data);
  }

  updateMember(data: IMember) {
    return this.update(this.dbPath, data.id, data);
  }

  deleteMember(dataKey: string) {
    return this.delete(this.dbPath, dataKey);
  }
}
