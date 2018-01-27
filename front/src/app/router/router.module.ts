import { AppMainModule } from './../main/main.module';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HelloPageModule } from '../hello-page/hello-page.module';
import { AuthGuard } from '../auth/auth.guard';
import { HelloPageGuard } from '../hello-page/guard';

const routes: Routes = [
  {
    path: 'hello',
    loadChildren: '../hello-page/hello-page.module#HelloPageModule',
    canActivate: [HelloPageGuard]
  },
  {
    path: 'home',
    loadChildren: '../main/main.module#AppMainModule',
    canActivate: [AuthGuard]
  },
  {
    path: '**',
    redirectTo: 'home'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      useHash: true
    })
  ],
  exports: [
    RouterModule
  ]
})
export class AppRouterModule {}
