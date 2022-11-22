import { Component } from '@angular/core';
import { AbilityTypeService } from './Services/ability-type.service';
import { AugmentCategoryService } from './Services/augment-category.service';
import { AugmentService } from './Services/augment.service';
import { HeroTypeService } from './Services/hero-type.service';
import { HeroService } from './Services/hero.service';

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
    private augmentService: AugmentService,) { }

  ngOnInit(): void {
    let heroeTypes$ = this.heroTypeService.get();
    heroeTypes$.subscribe(); // hack
    this.heroTypeService.refetch(); // hack

    let heroes$ = this.heroService.get();
    heroes$.subscribe(); // hack
    this.heroService.refetch(); // hack

    let abilityTypes$ = this.abilityTypeService.get();
    abilityTypes$.subscribe(); // hack
    this.abilityTypeService.refetch(); // hack

    let augmentCategories$ = this.augmentCategoryService.get();
    augmentCategories$.subscribe(); // hack
    this.augmentCategoryService.refetch(); // hack

    let augments$ = this.augmentService.get();
    augments$.subscribe(); // hack
    this.augmentService.refetch(); // hack
  }
}
