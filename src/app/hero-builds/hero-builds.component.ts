import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, map, mergeMap, Observable, of } from 'rxjs';
import { Build } from '../Models/Build';
import { Hero } from '../Models/Hero';
import { BuildService } from '../Services/build.service';
import { HeroService } from '../Services/hero.service';
import { BuildSerializerService, CategorisedGenericAugmentData } from '../Services/Utils/build-serializer.service';
import { StyleService } from '../Services/Utils/style.service';

export interface BuildWithAugments {
  build: Build,
  augments: Observable<CategorisedGenericAugmentData | undefined>[],
}
@Component({
  selector: 'app-hero-builds',
  templateUrl: './hero-builds.component.html',
  styleUrls: ['./hero-builds.component.less']
})
export class HeroBuildsComponent implements OnInit {
  constructor(activatedRoute: ActivatedRoute,
    heroesService: HeroService,
    buildService: BuildService,
    buildSerializer: BuildSerializerService) {
    this.heroDetails$ =
      combineLatest([
        activatedRoute.paramMap,
        heroesService.get()])
        .pipe(
          map(([paramMap, heroes]) => {
            let id = paramMap.get("id");
            if (!id)
              return undefined;
            return heroes?.find(hero => hero.id == Number(id));
          }));
    this.topHeroBuilds$ = this.heroDetails$.pipe(
      mergeMap(x => {
        if (!x?.id)
          return of([])
        return buildService.getHeroBuilds(x?.id);
      }),
      map(builds => {
        console.log("builds", builds);
        return builds.map(
          build => ({
            build: build,
            augments: buildSerializer.Deserialize(build.augments),
          } as BuildWithAugments)
        )
      })
    );
  }
  heroDetails$: Observable<Hero | undefined>;
  topHeroBuilds$: Observable<BuildWithAugments[]>;

  ngOnInit(): void {
  }

}
