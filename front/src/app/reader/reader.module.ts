import { ReaderService } from './reader.service';
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
  ],
  providers: [
    ReaderService
  ]
})
export class ReaderModule {}
