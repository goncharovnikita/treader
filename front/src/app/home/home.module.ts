import { SharedModule } from './../shared.module';
import { NgModule } from '@angular/core';
import { HomeComponent } from './home.component';
import { MaterialModule } from '../material.module';

@NgModule({
  imports: [
    SharedModule
  ],
  declarations: [
    HomeComponent
  ],
  exports: [
    HomeComponent
  ]
})
export class HomeModule {}
