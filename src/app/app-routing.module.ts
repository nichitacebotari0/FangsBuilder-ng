import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AbilityTypeComponent } from './Editing/ability-type/ability-type.component';
import { AdminComponent } from './admin/admin.component';
import { HeroClassComponent } from './Editing/hero-class/hero-class.component';
import { HeroComponent } from './Editing/hero/hero.component';
import { AugmentCategoryComponent } from './Editing/augment-category/augment-category.component';
import { AugmentComponent } from './Editing/augment/augment.component';
import { HeroesComponent } from './heroes/heroes.component';
import { DiscordRedirectComponent } from './discord-redirect/discord-redirect.component';
import { ArtifactTypeComponent } from './Editing/artifact-type/artifact-type.component';
import { ArtifactComponent } from './Editing/artifact/artifact.component';
import { ActiveComponent } from './Editing/active/active.component';
import { HeroBuildComponent } from './hero-build/hero-build.component';
import { MyBuildsComponent } from './my-builds/my-builds.component';
import { HeroBuildsComponent } from './hero-builds/hero-builds.component';

const routes: Routes = [
  { path: '', redirectTo: "/heroes", pathMatch: 'full' },
  { path: 'heroes', component: HeroesComponent },
  { path: 'hero/:id', component: HeroBuildsComponent },
  { path: 'hero/:id/build', component: HeroBuildComponent },
  { path: 'mybuilds', component: MyBuildsComponent },
  { path: 'discord-redirect', component: DiscordRedirectComponent },
  { path: 'admin', component: AdminComponent },
  { path: 'admin/abilityType', component: AbilityTypeComponent },
  { path: 'admin/heroClass', component: HeroClassComponent },
  { path: 'admin/hero', component: HeroComponent },
  { path: 'admin/augmentCategory', component: AugmentCategoryComponent },
  { path: 'admin/augment', component: AugmentComponent },
  { path: 'admin/artifactType', component: ArtifactTypeComponent },
  { path: 'admin/artifact', component: ArtifactComponent },
  { path: 'admin/boon', component: ActiveComponent },
  { path: '**', redirectTo: "/heroes", pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
