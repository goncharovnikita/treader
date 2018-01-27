import { AppMainModule } from './../main/main.module';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HelloPageModule } from '../hello-page/hello-page.module';
import { AuthGuard } from '../auth/auth.guard';
import { HelloPageGuard } from '../hello-page/guard';
import { SharedModule } from '../shared.module';

const routes: Routes = [
  {
    path: 'hello',
    loadChildren: '../hello-page/hello-page.module#HelloPageModule',
    canActivate: [HelloPageGuard]
  },
  {
    path: '',
    loadChildren: '../main/main.module#AppMainModule',
    canActivate: [AuthGuard]
  },
  {
    path: '**',
    redirectTo: ''
  }
];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forRoot(routes, {
      useHash: true,
      enableTracing: false
    })
  ],
  exports: [
    RouterModule
  ]
})
export class AppRouterModule {}
