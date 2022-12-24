import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, map, Observable } from 'rxjs';
import { Hero } from '../Models/Hero';
import { HeroService } from '../Services/hero.service';

@Component({
  selector: 'app-hero-build',
  templateUrl: './hero-build.component.html',
  styleUrls: ['./hero-build.component.less']
})
export class HeroBuildComponent implements OnInit {

  constructor(activatedRoute: ActivatedRoute,
    heroesService: HeroService) {
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
  }
  heroDetails$: Observable<Hero | undefined>;

  ngOnInit(): void {
  }

}
