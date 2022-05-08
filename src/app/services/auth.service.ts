import { Injectable } from '@angular/core';

import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore'
import { Router,  NavigationEnd, ActivatedRoute } from '@angular/router';
import { Observable, of } from 'rxjs';
import { delay, filter, map, switchMap, tap } from 'rxjs/operators';

import { IUser } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  isAuthenticated$: Observable<boolean>;
  isAuthenticatedWithDelay$: Observable<boolean>;

  shouldRedirect = false;

  constructor(
    private auth: AngularFireAuth,
    private db: AngularFirestore,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.isAuthenticated$ = this.auth.user.pipe(map(user => !!user));
    this.isAuthenticatedWithDelay$ = this.isAuthenticated$.pipe(delay(1000));

    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      map(e => this.route.firstChild),
      switchMap(route => route?.data ?? of({})),
    ).subscribe(data => this.shouldRedirect = data.authOnly ?? false);
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

  async login(email: string, password: string) {
    await this.auth.signInWithEmailAndPassword(email, password);
  }

  async logout() {
    await this.auth.signOut();

    if (this.shouldRedirect) {
      await this.router.navigateByUrl('/'); 
    }
  }
}
