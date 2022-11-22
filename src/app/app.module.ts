import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { /*FormsModule,*/ ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AugmentSlotComponent } from './augment-slot/augment-slot.component';
import { BuildEditorComponent } from './build-editor/build-editor.component';
import { AdminComponent } from './admin/admin.component';
import { AbilityTypeComponent } from './Editing/ability-type/ability-type.component';
import { HeroClassComponent } from './Editing/hero-class/hero-class.component';
import { HeroComponent } from './Editing/hero/hero.component';
import { AugmentCategoryComponent } from './Editing/augment-category/augment-category.component';

@NgModule({
  declarations: [
    AppComponent,
    AugmentSlotComponent,
    BuildEditorComponent,
    AdminComponent,
    AbilityTypeComponent,
    HeroClassComponent,
    HeroComponent,
    AugmentCategoryComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    // FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
