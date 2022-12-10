import { Component } from '@angular/core';
import { AbilityTypeService } from './Services/ability-type.service';
import { ArtifactTypeService } from './Services/artifact-type.service';
import { ArtifactService } from './Services/artifact.service';
import { AugmentCategoryService } from './Services/augment-category.service';
import { AugmentService } from './Services/augment.service';
import { HeroTypeService } from './Services/hero-type.service';
import { HeroService } from './Services/hero.service';
import { OauthService } from './Services/oauth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  title = 'FangsBuilder-ng';

  constructor(
    private heroTypeService: HeroTypeService,
    private heroService: HeroService,
    private abilityTypeService: AbilityTypeService,
    private augmentCategoryService: AugmentCategoryService,
    private augmentService: AugmentService,
    private artifactTypeService: ArtifactTypeService,
    private artifactService: ArtifactService,
    private oauthService: OauthService) {
  }

  ngOnInit(): void {
    let heroeTypes$ = this.heroTypeService.get();
    heroeTypes$.subscribe(); // hack
    this.heroTypeService.refetch();

    let heroes$ = this.heroService.get();
    heroes$.subscribe(); // hack
    this.heroService.refetch();

    let abilityTypes$ = this.abilityTypeService.get();
    abilityTypes$.subscribe(); // hack
    this.abilityTypeService.refetch();

    let augmentCategories$ = this.augmentCategoryService.get();
    augmentCategories$.subscribe(); // hack
    this.augmentCategoryService.refetch();

    let augments$ = this.augmentService.get();
    augments$.subscribe(); // hack
    this.augmentService.refetch();

    let artifactTypes$ = this.artifactTypeService.get();
    artifactTypes$.subscribe(); // hack
    this.artifactTypeService.refetch();

    let artifacts$ = this.artifactService.get();
    artifacts$.subscribe(); // hack
    this.artifactService.refetch();
  }

  AuthUrl: string = "https://discord.com/api/oauth2/authorize?client_id=1049648726664282183&redirect_uri=https%3A%2F%2Flocalhost%3A4200%2Fdiscord-redirect&response_type=code&scope=identify%20guilds.members.read";
  login() {
    if (this.oauthService.isLoggedIn())
      return;
    window.location.href = this.AuthUrl;
  }

  get isLoggedIn(): boolean {
    return this.oauthService.isLoggedIn();
  }

  get isAdmin(): boolean {
    return this.oauthService.isadmin();
  }

  get username(): string | undefined {
    return this.oauthService.getusername();
  }
}
