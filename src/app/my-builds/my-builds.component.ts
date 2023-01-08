import { Component, OnInit } from '@angular/core';
import { Params, Router } from '@angular/router';
import { combineLatest, filter, flatMap, map, mergeMap, Observable } from 'rxjs';
import { Build } from '../Models/Build';
import { Hero } from '../Models/Hero';
import { BuildService } from '../Services/build.service';
import { HeroService } from '../Services/hero.service';
import { BuildSerializerService, CategorisedGenericAugmentData } from '../Services/Utils/build-serializer.service';
import { StyleService } from '../Services/Utils/style.service';

interface BuildWithAugments {
  build: Build,
  augments: Observable<CategorisedGenericAugmentData | undefined>[],
}

@Component({
  selector: 'app-my-builds',
  templateUrl: './my-builds.component.html',
  styleUrls: ['./my-builds.component.less']
})
export class MyBuildsComponent implements OnInit {

  constructor(private buildService: BuildService,
    private buildSerializer: BuildSerializerService,
    private heroService: HeroService,
    private router: Router,
    private styleService: StyleService) { }

  ngOnInit(): void {
    this.heroBuilds$ = combineLatest([
      this.buildService.getMyBuilds(),
      this.heroService.get()
    ]).pipe(
      map(([builds, heroes]) => {
        builds.sort(x => x.heroId);
        return builds.map(build => {
          return {
            build: build,
            augments: this.buildSerializer.Deserialize(build.heroId, build.augments),
          } as BuildWithAugments
        }).reduce((aggregate: Map<Hero | undefined, BuildWithAugments[]>, buildWithAug: BuildWithAugments) => {
          const hero = heroes.find(x => x.id == buildWithAug.build.heroId);
          aggregate.set(hero, aggregate.get(hero) || []);
          aggregate.get(hero)!.push(buildWithAug);

          return aggregate;
        }, new Map<Hero | undefined, BuildWithAugments[]>())
      })
    );
  }
  heroBuilds$: Observable<Map<Hero | undefined, BuildWithAugments[]>> | undefined;

  edit(build: Build) {
    const encoded: string = build.augments;
    const queryParams: Params = { build: encoded, editId: build.id }
    this.router.navigate(
      ["/hero", build.heroId, "build"],
      {
        queryParams: queryParams,
        queryParamsHandling: 'merge'
      }
    )
  }

  remove(id: number) {
    this.buildService.remove(id).subscribe(x => location.reload());
  }

  colorClass(aug: CategorisedGenericAugmentData | null | undefined): string {
    return "bg-" + this.styleService.getColorForAugment(aug?.category)
  }

  position_tooltip(event: Event, name: string) {
    this.styleService.position_tooltip(event, name);
    event.stopPropagation();
  }
}
