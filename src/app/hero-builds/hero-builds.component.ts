import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, map, mergeMap, Observable, of } from 'rxjs';
import { Build } from '../Models/Build';
import { BuildVote } from '../Models/BuildVote';
import { Hero } from '../Models/Hero';
import { BuildService } from '../Services/build.service';
import { HeroService } from '../Services/hero.service';
import { BuildSerializerService, CategorisedGenericAugmentData } from '../Services/Utils/build-serializer.service';

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
    private router: Router,
    buildService: BuildService,
    heroesService: HeroService,
    buildSerializer: BuildSerializerService) {
    this.heroDetails$ = combineLatest([
      activatedRoute.paramMap,
      heroesService.get()])
      .pipe(
        map(([paramMap, heroes]) => {
          let id = paramMap.get("id");
          if (!id)
            return undefined;
          this.heroId = Number(id);
          return heroes?.find(hero => hero.id == Number(id));
        }));
    this.topHeroBuilds$ = this.heroDetails$.pipe(
      mergeMap(x => {
        if (!x?.id)
          return of([])
        return buildService.getHeroBuilds(x?.id);
      }),
      map(builds => {
        let myVotes = buildService.getMyVotes(builds.map(build => build.id));
        return builds.map(
          build => ({
            build: build,
            augments: buildSerializer.Deserialize(build.augments),
            myVote: myVotes.pipe(map(x => x.find(vote => vote.buildId == build.id)))
          } as BuildWithAugments & { myVote: Observable<BuildVote | undefined> })
        )
      })
    );
  }

  ngOnInit(): void {
  }
  heroDetails$: Observable<Hero | undefined>;
  topHeroBuilds$: Observable<(BuildWithAugments & { myVote: Observable<BuildVote | undefined> })[]>;
  heroId: number | undefined;

  create() {
    if (!this.heroId)
      return;

    console.log("asd");
    this.router.navigate([
      'hero',
      this.heroId,
      'build'
    ])
  }

}
