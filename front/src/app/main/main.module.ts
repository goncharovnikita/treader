import { MainService } from './main.service';
import { MenuModule } from './../menu/menu.module';
import { ReaderModule } from './../reader/reader.module';
import { AppMainComponent } from './main.component';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared.module';
import { MaterialModule } from '../material.module';

@NgModule({
  declarations: [
    AppMainComponent
  ],
  imports: [
    RouterModule.forChild([{path: '', component: AppMainComponent}]),
    SharedModule,
    MaterialModule,
    ReaderModule,
    MenuModule
  ],
  providers: [
    MainService
  ]
})
export class AppMainModule {}
