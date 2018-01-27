import { NgModule } from '@angular/core';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { environment } from '../../environments/environment';


@NgModule({
  imports: [
    AngularFireModule.initializeApp(environment.firebase)
  ],
  exports: [
    AngularFireAuthModule
  ]
})
export class AppAngularfireModule {}
