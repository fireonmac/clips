import { Component, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { last, switchMap } from 'rxjs/operators';

import { v4 as uuid } from 'uuid';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/compat/storage'
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import { ClipService } from 'src/app/services/clip.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnDestroy {

  isDragover = false;
  file: File | null = null;
  nextStep = false;

  title = new FormControl('', [Validators.required, Validators.minLength(3)]);
  uploadForm = new FormGroup({
    title: this.title
  });

  showAlert = false;
  alertMsg = 'Please wait! Your clip is being uploaded.';
  alertColor = 'blue';
  inSubmission = false;
  showPercentage = false;
  percentage = 0;

  user: firebase.User | null = null;

  task?: AngularFireUploadTask;
  
  constructor(
    private storage: AngularFireStorage,
    private auth: AngularFireAuth,
    private clipService: ClipService,
    private router: Router
  ) {
    this.auth.user.subscribe(user => this.user = user);
  }

  ngOnDestroy(): void {
    this.task?.cancel();
  }

  storeFile($event: Event) {

    console.log($event);

    this.isDragover = false;

    this.file = ($event as DragEvent).dataTransfer ? 
      ($event as DragEvent).dataTransfer?.files.item(0) ?? null :
      ($event.target as HTMLInputElement).files?.item(0) ?? null;

    if (!this.file || this.file.type !== 'video/mp4')  {
      return;
    }

    this.title.setValue(this.file.name.replace(/\.[^.]+$/, ''));
    this.nextStep = true;
  }

  uploadFile() {
    this.uploadForm.disable();

    this.showAlert = true;
    this.alertMsg = 'Please wait! Your clip is being uploaded.';
    this.alertColor = 'blue';
    this.inSubmission = true;
    this.showPercentage = true;

    const clipFileName = uuid();
    const clipPath = `clips/${clipFileName}.mp4`;
    const clipRef = this.storage.ref(clipPath);

    this.task = this.storage.upload(clipPath, this.file);

    this.task.percentageChanges().subscribe(progress => {
      this.percentage = (progress as number) / 100;
    });

    this.task.snapshotChanges().pipe(
      last(),
      switchMap(() => clipRef.getDownloadURL())
    ).subscribe({
      next: async url => {
        const clip = {
          uid: this.user?.uid as string,
          displayName: this.user?.displayName as string,
          title: this.title.value,
          fileName: `${clipFileName}.mp4`,
          url,
          timestamp: firebase.firestore.FieldValue.serverTimestamp()
        };

        const clipDocRef = await this.clipService.createClip(clip);

        this.alertMsg = 'Success! Your clip is now ready to share with the world.';
        this.alertColor = 'green';
        this.showPercentage = false;

        setTimeout(() => {
          this.router.navigate([
            'clip', clipDocRef.id
          ]);
        }, 1000);
      },
      error: e => {
        this.uploadForm.enable();
        this.alertMsg = 'An unexpected error occured. Please try again later.';
        this.alertColor = 'red';
        this.inSubmission = true;
        this.showPercentage = false;
        console.error(e);
      },
    });
  }
}
