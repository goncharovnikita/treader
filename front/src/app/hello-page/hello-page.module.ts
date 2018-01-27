import { RouterModule } from '@angular/router';
import { SharedModule } from './../shared.module';
import { NgModule } from '@angular/core';
import { HelloPageComponent } from './hello-page.component';
import { HelloPageGuard } from './guard';

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild([{path: '', component: HelloPageComponent}])
  ],
  declarations: [
    HelloPageComponent
  ]
})
export class HelloPageModule {}
