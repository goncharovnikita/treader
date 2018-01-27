import { Injectable, Inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class MainService {
  menuExpanded = new BehaviorSubject(false);
}
