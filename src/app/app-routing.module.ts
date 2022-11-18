import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AbilityTypeComponent } from './Editing/ability-type/ability-type.component';
import { AdminComponent } from './admin/admin.component';
import { BuildEditorComponent } from './build-editor/build-editor.component';

const routes: Routes = [
  { path: 'build/editor', component: BuildEditorComponent },
  { path: 'admin', component: AdminComponent },
  { path: 'admin/abilityTypes', component: AbilityTypeComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
