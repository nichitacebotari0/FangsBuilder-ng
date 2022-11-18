import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { /*FormsModule,*/ ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AugmentSlotComponent } from './augment-slot/augment-slot.component';
import { BuildEditorComponent } from './build-editor/build-editor.component';
import { AdminComponent } from './admin/admin.component';
import { AbilityTypeComponent } from './Editing/ability-type/ability-type.component';

@NgModule({
  declarations: [
    AppComponent,
    AugmentSlotComponent,
    BuildEditorComponent,
    AdminComponent,
    AbilityTypeComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    // FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
