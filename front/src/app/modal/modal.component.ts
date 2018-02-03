import { Component, OnInit, Output } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.sass']
})
export class ModalComponent implements OnInit {
  @Output() killClicked = new Subject<boolean>();

  hide() { this.killClicked.next(true); }
  ngOnInit() {}
}
