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
import { AugmentComponent } from './Editing/augment/augment.component';
import { HeroesComponent } from './heroes/heroes.component';
import { DiscordRedirectComponent } from './discord-redirect/discord-redirect.component';
import { CookieModule } from 'ngx-cookie';
import { ArtifactTypeComponent } from './Editing/artifact-type/artifact-type.component';
import { ArtifactComponent } from './Editing/artifact/artifact.component';
import { ActiveComponent } from './Editing/active/active.component';
import { AugmentClickableComponent } from './augment-clickable/augment-clickable.component';
import { BuildFormComponent } from './build-form/build-form.component';
import { MyBuildsComponent } from './my-builds/my-builds.component';
import { HeroBuildsComponent } from './hero-builds/hero-builds.component';
import { HeroBuildDetailComponent } from './hero-build-detail/hero-build-detail.component';
import { BuildVoteComponent } from './build-vote/build-vote.component';

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
    AugmentComponent,
    HeroesComponent,
    DiscordRedirectComponent,
    ArtifactTypeComponent,
    ArtifactComponent,
    ActiveComponent,
    AugmentClickableComponent,
    BuildFormComponent,
    MyBuildsComponent,
    HeroBuildsComponent,
    HeroBuildDetailComponent,
    BuildVoteComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    // FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    CookieModule.withOptions()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
