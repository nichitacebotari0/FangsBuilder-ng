import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AbilityTypeComponent } from './Editing/ability-type/ability-type.component';
import { AdminComponent } from './admin/admin.component';
import { BuildEditorComponent } from './build-editor/build-editor.component';
import { HeroClassComponent } from './Editing/hero-class/hero-class.component';
import { HeroComponent } from './Editing/hero/hero.component';
import { AugmentCategoryComponent } from './Editing/augment-category/augment-category.component';

const routes: Routes = [
  { path: 'build/editor', component: BuildEditorComponent },
  { path: 'admin', component: AdminComponent },
  { path: 'admin/abilityTypes', component: AbilityTypeComponent },
  { path: 'admin/heroClasses', component: HeroClassComponent },
  { path: 'admin/heroes', component: HeroComponent },
  { path: 'admin/augmentCategory', component: AugmentCategoryComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
