import { BookUnitComponent } from './../book/book.component';
import { LibraryComponent } from './../library/library.component';
import { MainService } from './main.service';
import { MenuModule } from './../menu/menu.module';
import { ReaderModule } from './../reader/reader.module';
import { AppMainComponent } from './main.component';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared.module';
import { MaterialModule } from '../material.module';
import { HomeComponent } from '../home/home.component';
import { HomeModule } from '../home/home.module';
import { ReaderComponent } from '../reader/reader.component';
import { SelectedBookResolver } from '../reader/selected-book.resolver';
import { LibraryModule } from '../library/library.module';

const routes: Routes = [
  {
    path: '',
    component: AppMainComponent,
    children: [
      {
        path: 'home',
        component: HomeComponent
      },
      {
        path: 'library',
        component: LibraryComponent
      },
      {
        path: 'book/:book_id',
        component: ReaderComponent,
        resolve: {
          'selected_book': SelectedBookResolver
        }
      },
      {
        path: '**',
        redirectTo: 'home'
      }
    ]
  }
];

@NgModule({
  declarations: [
    AppMainComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    // RouterModule.forRoot(routes),
    SharedModule,
    MaterialModule,
    ReaderModule,
    MenuModule,
    HomeModule,
    LibraryModule
  ],
  providers: [
    MainService
  ]
})
export class AppMainModule {}
