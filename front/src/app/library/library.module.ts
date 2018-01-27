import { LibraryComponent } from './library.component';
import { SharedModule } from './../shared.module';
import { NgModule } from '@angular/core';

@NgModule({
  imports: [
    SharedModule
  ],
  declarations: [
    LibraryComponent
  ],
  exports: [
    LibraryComponent
  ]
})
export class LibraryModule {}
