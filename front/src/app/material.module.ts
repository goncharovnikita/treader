import { NgModule } from '@angular/core';
import { MatIconModule, MatCheckboxModule, MatProgressSpinnerModule } from '@angular/material';

@NgModule({
  exports: [
    MatIconModule,
    MatCheckboxModule,
    MatProgressSpinnerModule
  ]
})
export class MaterialModule {}
