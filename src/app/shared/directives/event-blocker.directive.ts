import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appEventBlocker]'
})
export class EventBlockerDirective {

  @HostListener('dragover', ['$event'])
  @HostListener('drop', ['$event'])
  handleEvent($event: Event) {
    $event.preventDefault();
  }  
}
