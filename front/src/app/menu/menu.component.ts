import {AuthService} from './../auth/auth.service';
import {Router} from '@angular/router';
import {MainService} from './../main/main.service';
import {BooksService} from './../books.service';
import {ChangeDetectorRef, Component, ElementRef, Input, OnInit, Renderer2, ViewChild} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.sass']
})
export class MenuComponent implements OnInit {
  @Input() expanded: BehaviorSubject<boolean>;
  @ViewChild('triggererEl') triggererElRef: ElementRef;
  @ViewChild('menuEl') menuElRef: ElementRef;
  addNewViewed = false;
  bookLoaded = false;
  menuExpPercent = 0;


  constructor(private $s: MainService,
              private $b: BooksService,
              private $cdr: ChangeDetectorRef,
              private $router: Router,
              private $renderer: Renderer2,
              private $auth: AuthService) {
  }

  ngOnInit() {
    Observable.fromEvent(this.triggererElRef.nativeElement, 'touchmove').subscribe((v: Event) => {
      if (!this.expanded.getValue() && this.menuExpPercent < 100) {
        const winWidth = window.screen.width;
        const touchWidth = v['changedTouches'][0].clientX;
        const percent = (touchWidth / winWidth) * 100;
        this.menuExpPercent = percent;
        this.$renderer.removeClass(this.menuElRef.nativeElement, 'smooth');
        this.menuElRef.nativeElement.style.transform = `translateX(-${100 - percent}%)`;
      }
    });

    Observable.fromEvent(this.menuElRef.nativeElement, 'touchmove').pairwise().subscribe((v: Array<Event>) => {
      const v1 = v[0]['changedTouches'][0].clientX;
      const v2 = v[1]['changedTouches'][0].clientX;
      if (this.expanded.getValue() && this.menuExpPercent <= 100 && v2 - v1 < 10) {
        const winWidth = this.menuElRef.nativeElement.clientWidth;
        const percent = this.menuExpPercent + (((v2 - v1) / winWidth) * 100);
        this.menuExpPercent = percent;
        this.$renderer.removeClass(this.menuElRef.nativeElement, 'smooth');
        this.menuElRef.nativeElement.style.transform = `translateX(-${100 - percent}%)`;
        // console.log(this.menuExpPercent);
      }
    });

    Observable.fromEvent(this.menuElRef.nativeElement, 'touchend').subscribe((v: Event) => {
      if (this.menuExpPercent > 50) {
        this.$renderer.addClass(this.menuElRef.nativeElement, 'smooth');
        this.$renderer.removeClass(this.menuElRef.nativeElement, 'hidden');
        this.menuElRef.nativeElement.style.transform = 'none';
        this.expanded.next(true);
        this.menuExpPercent = 100;
      } else {
        this.$renderer.addClass(this.menuElRef.nativeElement, 'smooth');
        this.$renderer.addClass(this.menuElRef.nativeElement, 'hidden');
        this.menuElRef.nativeElement.style.transform = 'translateX(-100%)';
        this.expanded.next(false);
        this.menuExpPercent = 0;

      }
    });

    Observable.fromEvent(this.triggererElRef.nativeElement, 'touchend').subscribe(v => {
      if (this.menuExpPercent > 50) {
        this.$renderer.addClass(this.menuElRef.nativeElement, 'smooth');
        this.$renderer.removeClass(this.menuElRef.nativeElement, 'hidden');
        this.menuElRef.nativeElement.style.transform = 'none';
        this.expanded.next(true);
        this.menuExpPercent = 100;
      } else {
        this.$renderer.addClass(this.menuElRef.nativeElement, 'smooth');
        this.$renderer.addClass(this.menuElRef.nativeElement, 'hidden');
        this.menuElRef.nativeElement.style.transform = 'translateX(-100%)';
        this.expanded.next(false);
        this.menuExpPercent = 0;

      }
    });
  }

  addBook() {
    this.addNewViewed = true;
  }

  killSelf() {
    this.$s.menuExpanded.next(false);
  }

  killAddBook(v: boolean) {
    this.addNewViewed = false;
    if (this.bookLoaded) {
      this.killSelf();
    }
  }

  loadBook(e: boolean) {
    this.bookLoaded = e;
  }

  logout() {
    this.$auth.logout();
  }

  toLib() {
    this.$router.navigate(['/library']);
  }

}
