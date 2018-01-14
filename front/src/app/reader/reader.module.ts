import { ReaderComponent } from './reader.component';
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared.module';

@NgModule({
  imports: [
    SharedModule
  ],
  declarations: [
    ReaderComponent
  ],
  exports: [
    ReaderComponent
  ]
})
export class ReaderModule {}
