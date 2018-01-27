import { AuthGuard } from './auth.guard';
import { SharedModule } from './../shared.module';
import { AuthService } from './auth.service';
import { NgModule, ModuleWithProviders } from '@angular/core';

@NgModule({
  providers: [
    AuthService,
    AuthGuard
  ]
})
export class AuthModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: AuthModule
    };
  }
}
