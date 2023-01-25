import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AbilityTypeComponent } from './admin/Editing/ability-type/ability-type.component';
import { AdminComponent } from './admin/admin.component';
import { HeroClassComponent } from './admin/Editing/hero-class/hero-class.component';
import { HeroComponent } from './admin/Editing/hero/hero.component';
import { AugmentCategoryComponent } from './admin/Editing/augment-category/augment-category.component';
import { AugmentComponent } from './admin/Editing/augment/augment.component';
import { HeroesComponent } from './heroes/heroes.component';
import { DiscordRedirectComponent } from './discord-redirect/discord-redirect.component';
import { ArtifactTypeComponent } from './admin/Editing/artifact-type/artifact-type.component';
import { ArtifactComponent } from './admin/Editing/artifact/artifact.component';
import { ActiveComponent } from './admin/Editing/active/active.component';
import { MyBuildsComponent } from './my-builds/my-builds.component';
import { BuildEditorComponent } from './build-editor/build-editor.component';
import { MapPickerComponent } from './map-picker/map-picker.component';
import { BuildPageComponent } from './build-page/build-page.component';
import { PatchComponent } from './admin/Editing/patch/patch.component';
import { AugmentArrangementComponent } from './admin/Editing/augment-arrangement/augment-arrangement.component';

const routes: Routes = [
  { path: '', redirectTo: "/heroes", pathMatch: 'full' },
  { path: 'heroes', component: HeroesComponent },
  { path: 'hero/:id/build', component: BuildEditorComponent },
  { path: 'mybuilds', component: MyBuildsComponent },
  { path: 'builds/:id', component: BuildPageComponent },
  { path: 'discord-redirect', component: DiscordRedirectComponent },
  { path: "mapplanner", component: MapPickerComponent },
  { path: 'admin', component: AdminComponent },
  { path: 'admin/abilityType', component: AbilityTypeComponent },
  { path: 'admin/heroClass', component: HeroClassComponent },
  { path: 'admin/hero', component: HeroComponent },
  { path: 'admin/augmentCategory', component: AugmentCategoryComponent },
  { path: 'admin/augment', component: AugmentComponent },
  { path: 'admin/artifactType', component: ArtifactTypeComponent },
  { path: 'admin/artifact', component: ArtifactComponent },
  { path: 'admin/boon', component: ActiveComponent },
  { path: 'admin/patch', component: PatchComponent },
  { path: 'admin/augmentArrangement', component: AugmentArrangementComponent },
  { path: '**', redirectTo: "/heroes", pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
