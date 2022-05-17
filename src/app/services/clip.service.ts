import { Injectable } from '@angular/core';
import { combineLatest, Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreCollection, DocumentReference, QueryDocumentSnapshot, QuerySnapshot } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage'

import { IClip } from '../models/clip.model';

@Injectable({
  providedIn: 'root'
})
export class ClipService {

  clipsCollection: AngularFirestoreCollection<IClip>;

  constructor(
    private db: AngularFirestore,
    private auth: AngularFireAuth,
    private storage: AngularFireStorage
  ) {
    this.clipsCollection = this.db.collection<IClip>('clips');
  }

  createClip(data: IClip): Promise<DocumentReference<IClip>> {
    return this.clipsCollection.add(data);
  }

  getUserClips(sortOrder$: Observable<string>) {
    return combineLatest([this.auth.user, sortOrder$]).pipe(
      switchMap(([user, sortOrder]) => {
        if (!user) {
          return of([]);
        }
        
        const query = this.clipsCollection.ref
          .where('uid', '==', user.uid)
          .orderBy('timestamp', sortOrder === '1' ? 'desc' : 'asc')
  
        return query.get();
      }),
      map((snapshot) => (snapshot as QuerySnapshot<IClip>).docs)
    )
  }

  updateClip(id: string, title: string) {
    return this.clipsCollection.doc(id).update({
      title
    });
  }

  async deleteClip(clip: IClip) {
    const clipRef = this.storage.ref(`clips/${clip.fileName}`);

    await clipRef.delete().toPromise();
    await this.clipsCollection.doc(clip.docID).delete();
  }
}
