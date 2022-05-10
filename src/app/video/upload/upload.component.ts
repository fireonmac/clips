import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnInit {

  isDragover = false;
  file: File | null = null;

  constructor() { }

  ngOnInit(): void {
  }

  storeFile($event: DragEvent) {
    this.isDragover = false;

    this.file = $event.dataTransfer?.files.item(0) ?? null;

    if (!this.file || this.file.type !== 'video/mp4')  {
      return;
    }

    console.log(this.file);
  }

}
