import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { ModalService } from '../services/modal.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {
  
  constructor(
    public modal: ModalService,
    public auth: AuthService,
  ) { }

  ngOnInit(): void {
  }

  openAuthModal($event: Event) {
    $event.preventDefault();
    
    this.modal.toggleModal('auth');
  }

  async logout($event: Event) {
    $event.preventDefault();
    await this.auth.logout();
  }
}
