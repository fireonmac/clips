import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { IClip } from 'src/app/models/clip.model';
import { ClipService } from 'src/app/services/clip.service';
import { ModalService } from 'src/app/services/modal.service';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit {

  _sortOrder = new BehaviorSubject('1');
  sortOrder$ = this._sortOrder.asObservable();
  set sortOrder(order: string) {this._sortOrder.next(order)}
  get sortOrder() {return this._sortOrder.value}

  clips: IClip[] = [];

  activeClip: IClip | null = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private clipService: ClipService,
    private modal: ModalService
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params: Params) => {
      this.sortOrder = params.sort === '2' ? params.sort : '1'
    });

    this.clipService.getUserClips(this.sortOrder$).subscribe(docs => {
      this.clips = [];

      docs.forEach(doc => {
        this.clips.push({
          docID: doc.id,
          ...doc.data()
        })
      })
    });
  }

  sort($event: Event) {
    const { value } = ($event.target as HTMLSelectElement);
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        sort: value
      }
    });
  }

  openEditModal($event: Event, clip: IClip) {
    $event.preventDefault();

    this.activeClip = clip;

    this.modal.toggleModal('editClip');
  }

  update($event: IClip) {
    const target = this.clips.find(clip => $event.docID === clip.docID);

    if (target) {
      target.title = $event.title;
    }
  }

  async delete($event: Event, clip: IClip) {
    $event.preventDefault();

    await this.clipService.deleteClip(clip);

    this.clips = this.clips.filter(c => c.docID !== clip.docID);
  }
}
