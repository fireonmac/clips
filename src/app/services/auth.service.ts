import { Injectable } from '@angular/core';

import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore'
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { IUser } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  isAuthenticated$: Observable<boolean>;

  constructor(
    private auth: AngularFireAuth,
    private db: AngularFirestore
  ) {
    this.isAuthenticated$ = this.auth.user.pipe(map(user => !!user));
  }

  private get usersCollection(): AngularFirestoreCollection<IUser> { 
    return this.db.collection<IUser>('users');
  }

  async createUser(userData: IUser) {
    if (!userData.password) {throw new Error('Password not provided!')}

    const userCred = await this.auth.createUserWithEmailAndPassword(userData.email, userData.password);

    if (!userCred.user) {throw new Error('User can\'t be found!')}

    await this.usersCollection.doc(userCred.user.uid).set({
      name: userData.name,
      email: userData.email,
      age: userData.age,
      phoneNumber: userData.phoneNumber,
      password: userData.password
    });

    await userCred.user.updateProfile({displayName: userData.name});
  }
}
