import { AppMainModule } from './main/main.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { MaterialModule } from './material.module';
import { AppService } from './app.service';
import { SharedModule } from './shared.module';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { environment } from '../environments/environment';
import { AppRouterModule } from './router/router.module';
import { HelloPageModule } from './hello-page/hello-page.module';
import { AuthModule } from './auth/auth.module';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    SharedModule.forRoot(),
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    AppRouterModule
  ],
  providers: [
    AppService,
    { provide: 'BASE_URL', useValue: environment.baseURL }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
