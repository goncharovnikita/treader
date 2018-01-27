import { SelectedBookResolver } from './selected-book.resolver';
import { ReaderNavbarComponent } from './navbar/navbar.component';
import { RendererComponent } from './renderer/renderer.component';
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
    ReaderComponent,
    RendererComponent,
    ReaderNavbarComponent
  ],
  exports: [
    ReaderComponent
  ],
  providers: [
    ReaderService,
    SelectedBookResolver
  ]
})
export class ReaderModule {}
