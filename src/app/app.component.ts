import { Component } from '@angular/core';
import { take } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AbilityTypeService } from './Services/ability-type.service';
import { ActiveService } from './Services/active.service';
import { ArtifactTypeService } from './Services/artifact-type.service';
import { ArtifactService } from './Services/artifact.service';
import { AugmentCategoryService } from './Services/augment-category.service';
import { AugmentService } from './Services/augment.service';
import { ConfigService } from './Services/config.service';
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

  constructor(configService: ConfigService,
    private heroTypeService: HeroTypeService,
    private heroService: HeroService,
    private abilityTypeService: AbilityTypeService,
    private augmentCategoryService: AugmentCategoryService,
    private augmentService: AugmentService,
    private artifactTypeService: ArtifactTypeService,
    private artifactService: ArtifactService,
    private oauthService: OauthService,
    private activeService: ActiveService) {
    this.AuthUrl = configService.AuthUrl;
  }

  ngOnInit(): void {
    let heroeTypes$ = this.heroTypeService.get();
    heroeTypes$.pipe(take(1)).subscribe(); // hack
    this.heroTypeService.refetch();

    let heroes$ = this.heroService.get();
    heroes$.pipe(take(1)).subscribe(); // hack
    this.heroService.refetch();

    let abilityTypes$ = this.abilityTypeService.get();
    abilityTypes$.pipe(take(1)).subscribe(); // hack
    this.abilityTypeService.refetch();

    let augmentCategories$ = this.augmentCategoryService.get();
    augmentCategories$.pipe(take(1)).subscribe(); // hack
    this.augmentCategoryService.refetch();

    let augments$ = this.augmentService.get();
    augments$.pipe(take(1)).subscribe(); // hack
    this.augmentService.refetch();

    let artifactTypes$ = this.artifactTypeService.get();
    artifactTypes$.pipe(take(1)).subscribe(); // hack
    this.artifactTypeService.refetch();

    let artifacts$ = this.artifactService.get();
    artifacts$.pipe(take(1)).subscribe(); // hack
    this.artifactService.refetch();

    let actives$ = this.activeService.get();
    actives$.pipe(take(1)).subscribe(); // hack
    this.activeService.refetch();
  }

  AuthUrl: string;
  login() {
    // if (this.oauthService.isLoggedIn())
    //   return;
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
