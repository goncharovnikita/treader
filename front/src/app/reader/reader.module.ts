import { ReaderService } from './reader.service';
import { ReaderComponent } from './reader.component';
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared.module';
import { MaterialModule } from '../material.module';

@NgModule({
  imports: [
    SharedModule,
    MaterialModule
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
