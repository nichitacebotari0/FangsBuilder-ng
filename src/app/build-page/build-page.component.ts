import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, filter, forkJoin, map, mergeAll, mergeMap, Observable, of, shareReplay, take, tap } from 'rxjs';
import { Build } from '../Models/Build';
import { BuildVote } from '../Models/BuildVote';
import { Hero } from '../Models/Hero';
import { BuildService } from '../Services/build.service';
import { HeroService } from '../Services/hero.service';
import { BuildSerializerService, CategorisedGenericAugmentData } from '../Services/Utils/build-serializer.service';

@Component({
  selector: 'app-build-page',
  templateUrl: './build-page.component.html',
  styleUrls: ['./build-page.component.less']
})
export class BuildPageComponent implements OnInit {

  constructor(activatedRoute: ActivatedRoute,
    buildService: BuildService,
    buildSerializer: BuildSerializerService,
    heroService: HeroService) {
    this.build$ = activatedRoute.paramMap.pipe(
      map(x => {
        let id = Number(x.get("id"));
        if (!id)
          return of(undefined);
        return buildService.getBuild(id);
      }),
      mergeAll(),
      filter(x => x != undefined),
      map(x => x! as Build),
      shareReplay(1),
    );

    this.augments$ = this.build$.pipe(
      filter(build => build != undefined),
      map(build => {
        const augments = buildSerializer.Deserialize(build!.heroId, build!.augments)
          .map(x => x.pipe(take(1)));
        return forkJoin(augments);
      }),
      mergeAll(),
      shareReplay(1),
    );

    this.myVote$ = this.build$.pipe(
      mergeMap(build => {
        const votes = buildService.getMyVotes([build!.id]);
        return votes;
      }),
      map(x => x.length > 0 ? x[0] : undefined),
      shareReplay(1),
    );

    this.hero$ = combineLatest([
      this.build$,
      heroService.get()
    ]).pipe(
      map(([build, heroes]) => heroes.find(hero => hero.id == build.heroId)),
      filter(x => x != undefined),
      map(x => x! as Hero),
      shareReplay(1)
    );
  }

  ngOnInit(): void {
  }
  build$: Observable<Build>;
  augments$: Observable<(CategorisedGenericAugmentData | undefined)[]>;
  myVote$: Observable<BuildVote | undefined>;
  hero$: Observable<Hero>;
}