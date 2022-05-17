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
    this.modal.register(this.modalID);
    // This code will transfer the modal like portals in React resolving any css conflict issues of nested DOM element.
    document.body.appendChild(this.elRef.nativeElement);
  }

  ngOnDestroy() {
    this.modal.unregister(this.modalID);
    document.body.removeChild(this.elRef.nativeElement);
  }

  isOpen() {
    return this.modal.isModalOpen(this.modalID);
  }

  closeModal() {
    this.modal.toggleModal(this.modalID);
  }
}
