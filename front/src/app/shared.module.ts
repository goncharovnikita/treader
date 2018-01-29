import { BookUnitComponent } from './book/book.component';
import { AppAngularfireModule } from './angularfire/angularfire.module';
import { BooksService } from './books.service';
import { HttpService } from './http.service';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/throttleTime';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/timer';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/pairwise';
import { TranslateService } from './translate/service';
import { AuthModule } from './auth/auth.module';
import { MaterialModule } from './material.module';
import { HelloPageGuard } from './hello-page/guard';

@NgModule({
  imports: [
    MaterialModule
  ],
  declarations: [
    BookUnitComponent
  ],
  exports: [
    CommonModule,
    HttpClientModule,
    AuthModule,
    AppAngularfireModule,
    MaterialModule,
    BookUnitComponent
  ],
  providers: [
    TranslateService,
    HttpService,
    BooksService,
    HelloPageGuard
  ]
})
export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule
    };
  }
}
