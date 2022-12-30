import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, combineLatestWith, forkJoin, map, mergeMap, Observable, of, shareReplay, take } from 'rxjs';
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

export interface DetailedBuild extends Build {
  build: Build
  augmentsData?: (CategorisedGenericAugmentData | undefined)[]
  myVote?: BuildVote
}

@Component({
  selector: 'app-hero-builds',
  templateUrl: './hero-builds.component.html',
  styleUrls: ['./hero-builds.component.less']
})
export class HeroBuildsComponent implements OnInit {
  constructor(activatedRoute: ActivatedRoute,
    heroesService: HeroService,
    private router: Router,
    private buildService: BuildService,
    private buildSerializer: BuildSerializerService) {
    this.heroDetails$ = combineLatest([
      activatedRoute.paramMap.pipe(take(1)),
      heroesService.get()])
      .pipe(
        map(([paramMap, heroes]) => {
          let id: string | null = paramMap.get("id");
          if (!id)
            return undefined;
          this.heroId = Number(id);
          return heroes?.find(hero => hero.id == Number(id));
        }));

    this.loadChunkDetailedBuilds()
  }

  ngOnInit(): void {
  }
  heroDetails$: Observable<Hero | undefined>;
  detailedBuilds: DetailedBuild[] = [];
  heroId: number | undefined;

  private _lastVoteTotal: number | undefined;
  public get lastVoteTotal(): number | undefined {
    return this._lastVoteTotal;
  }

  private _lastBuildId: number | undefined;
  public get lastBuildId(): number | undefined {
    return this._lastBuildId;
  }

  loadChunkDetailedBuilds(): void {
    const builds$ = this.heroDetails$.pipe(
      mergeMap(hero => {
        if (!hero?.id)
          return of([])
        return this.buildService.getHeroBuilds(hero?.id, this.lastVoteTotal, this.lastBuildId);
      }),
      shareReplay(1)
    );

    const myVotes$ = builds$.pipe(
      mergeMap(builds => this.buildService.getMyVotes(builds.map(build => build.id))),
    );

    const buildsPage = builds$.pipe(
      map(builds => builds.map(build => this.getAugmentsForBuild(build, this.buildSerializer))),
      mergeMap(x => forkJoin(x)),
      combineLatestWith(myVotes$),
      map(([builds, myVotes]) => {
        builds.forEach(b => b.myVote = myVotes.find(vote => vote.buildId == b.build.id))
        return builds;
      })
    );
    buildsPage
      .pipe(take(1))
      .subscribe(x => {
        this.detailedBuilds.push(...x);
        if (x.length < 20) {
          this._lastBuildId = undefined;
          return;
        }
        const last = x[x.length - 1];
        this._lastVoteTotal = last.build.upvotes - last.build.downvotes;
        this._lastBuildId = x[x.length - 1].build.id;
      });
  }

  getAugmentsForBuild(build: Build, buildSerializer: BuildSerializerService): Observable<DetailedBuild> {
    let augs = forkJoin(buildSerializer.Deserialize(build.heroId, build.augments).map(x => x.pipe(take(1))))
    return augs.pipe(
      map(augmentsData => ({ build, augmentsData } as DetailedBuild))
    );
  }

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

  trackByFn(index: number, build: DetailedBuild): number {
    return build.id;
  }
}