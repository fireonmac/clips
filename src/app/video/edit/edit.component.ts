import { Component, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IClip } from 'src/app/models/clip.model';
import { ClipService } from 'src/app/services/clip.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnChanges {

  @Input() 
  activeClip: IClip | null = null;

  @Output()
  update = new EventEmitter(); 

  clipID = new FormControl('');
  title = new FormControl('', [Validators.required, Validators.minLength(3)]);

  editForm = new FormGroup({
    id: this.clipID,
    title: this.title
  });

  inSubmission = false;
  showAlert = false;
  alertColor = 'blue';
  alertMsg = 'Please wait! Your clip is being updated.';

  constructor(
    private clipService: ClipService
  ) {}

  ngOnChanges(): void {
    if (!this.activeClip) {
      return;
    }

    this.showAlert = false;
    this.inSubmission = false;
    this.clipID.setValue(this.activeClip.docID);
    this.title.setValue(this.activeClip.title);
  }
  
  async submit() {
    if (!this.activeClip) {
      return;
    }

    this.inSubmission = true;
    this.showAlert = true;
    this.alertColor = 'blue';
    this.alertMsg = 'Please wait! Your clip is being updated.';    

    try {
      await this.clipService.updateClip(this.clipID.value, this.title.value);
    } catch (e) {
      console.error(e);

      this.inSubmission = false;
      this.alertColor = 'red';
      this.alertMsg = 'An unexpected error occured! Please try again later.';    

      return;
    }

    this.activeClip.title = this.title.value;
    this.update.emit(this.activeClip);

    this.inSubmission = false;
    this.alertColor = 'green';
    this.alertMsg = 'Success! Your clip is succesfully updated.';    
  }
}
