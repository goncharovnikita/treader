import { Observable } from 'rxjs/Observable';
import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-reader-renderer',
  templateUrl: './renderer.component.html',
  styleUrls: ['./renderer.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RendererComponent implements OnInit {
  // @Input() sheet: Observable<BookSheet>;
  @Input() sheet: Observable<Array<string>>;


  ngOnInit() {}
}
