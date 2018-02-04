import { ProfileService } from './profile.service';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { ProfileComponent } from './profile.component';
import { SharedModule } from '../shared.module';

@NgModule({
  declarations: [
    ProfileComponent
  ],
  imports: [
    SharedModule,
    RouterModule.forChild([{path: '', component: ProfileComponent}])
  ],
  providers: [
    ProfileService
  ]
})
export class ProfileModule {

}
