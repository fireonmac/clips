import { Component, AfterContentInit, ContentChildren, QueryList } from '@angular/core';
import { TabComponent } from '../tab/tab.component';

@Component({
  selector: 'app-tabs-container',
  templateUrl: './tabs-container.component.html',
  styleUrls: ['./tabs-container.component.scss']
})
export class TabsContainerComponent implements AfterContentInit {

  @ContentChildren(TabComponent) tabs?: QueryList<TabComponent>;

  constructor() { }

  ngAfterContentInit(): void {
    this.selectTab(this.tabs!.first);
  }

  selectTab(tab: TabComponent) {
    // loop through all tabs turning off active proprty of each
    this.tabs?.forEach(tab => tab.active = false);
    
    // turn on the selected tab
    tab.active = true;
   
    // prevent default browser behavior
    return false;
  }
}
