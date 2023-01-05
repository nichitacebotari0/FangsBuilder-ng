import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, combineLatestWith, debounceTime, distinctUntilChanged, map, Observable, Subject } from 'rxjs';
import { Hero } from '../Models/Hero';
import { HeroService } from '../Services/hero.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.less']
})
export class HeroesComponent implements OnInit {

  constructor(private heroService: HeroService) {
    this.filteredHeroes$ = this.searchTerm.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      combineLatestWith(this.heroService.get()),
      map(([term, heroes]) =>
        term?.length > 0
          ? heroes.filter(hero => hero.name.toUpperCase().startsWith(term.toUpperCase()))
          : heroes
      ));
  }

  ngOnInit(): void {
  }
  filteredHeroes$: Observable<Hero[]> | undefined;
  heroId: BehaviorSubject<number | undefined> = new BehaviorSubject<number | undefined>(undefined);
  private searchTerm = new BehaviorSubject<string>("");

  lookup(term: string) {
    this.searchTerm.next(term);
  }

  goToHero(id: number) {
    this.heroId.next(id);
  }
}
