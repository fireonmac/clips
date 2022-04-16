import { Component, ElementRef, Input, OnDestroy, OnInit } from '@angular/core';
import { ModalService } from 'src/app/services/modal.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit, OnDestroy {

  @Input() modalID = '';

  constructor(
    public modal: ModalService, 
    public elRef: ElementRef
  ) { }

  ngOnInit(): void {
    document.body.appendChild(this.elRef.nativeElement);
  }

  ngOnDestroy() {
    this.modal.destroy(this.modalID);
  }

  isOpen() {
    return this.modal.isModalOpen(this.modalID);
  }

  closeModal() {
    this.modal.toggleModal(this.modalID);
  }
}
