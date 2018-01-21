import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { MaterialModule } from './material.module';
import { AppService } from './app.service';
import { MenuModule } from './menu/menu.module';
import { SharedModule } from './shared.module';
import { ReaderModule } from './reader/reader.module';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { environment } from '../environments/environment';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    SharedModule.forRoot(),
    ReaderModule,
    MenuModule,
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule
  ],
  providers: [
    AppService,
    { provide: 'BASE_URL', useValue: environment.baseURL }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
