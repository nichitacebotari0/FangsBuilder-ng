import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, combineLatest, combineLatestWith, distinctUntilChanged, forkJoin, map, mergeMap, Observable, of, shareReplay, take } from 'rxjs';
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
  constructor(private heroesService: HeroService,
    private router: Router,
    private buildService: BuildService,
    private buildSerializer: BuildSerializerService) { }

  ngOnInit(): void {

    this.heroDetails$ = combineLatest([
      this.heroId,
      this.heroesService.get()])
      .pipe(
        map(([id, heroes]) => {
          if (!id)
            return undefined;
          return heroes?.find(hero => hero.id == Number(id));
        }),
        distinctUntilChanged((previous, current) => previous?.id == current?.id),
        shareReplay(1),
      );

    this.heroDetails$.subscribe(() => {
      this.detailedBuilds = [];
      this.loadChunkDetailedBuilds();
    });

  }
  @Input() heroId: BehaviorSubject<number | undefined> = new BehaviorSubject<number | undefined>(undefined);
  heroDetails$: Observable<Hero | undefined> = of(undefined);
  detailedBuilds: DetailedBuild[] = [];

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
      mergeMap(builds => builds.length > 0
        ? this.buildService.getMyVotes(builds.map(build => build.id))
        : of([])),
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
    this.router.navigate([
      'hero',
      this.heroId?.value,
      'build'
    ])
  }
}