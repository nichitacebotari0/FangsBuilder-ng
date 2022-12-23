import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Hero } from '../Models/Hero';
import { HeroService } from '../Services/hero.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.less']
})
export class HeroesComponent implements OnInit {

  constructor(private heroService: HeroService,
    private router: Router,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.heroes$ = this.heroService.get();
  }

  heroes$: Observable<Hero[]> | undefined;

  goToHero(id: number) {
    this.router.navigate(["/hero", id])
  }

}
