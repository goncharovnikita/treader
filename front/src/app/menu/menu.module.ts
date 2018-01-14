import { MenuComponent } from './menu.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared.module';
import { MaterialModule } from '../material.module';

@NgModule({
  imports: [
    SharedModule
  ],
  declarations: [MenuComponent],
  exports: [MenuComponent]
})
export class MenuModule { }
