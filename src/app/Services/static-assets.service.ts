import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HeroImages } from '../Models/Static';

@Injectable({
  providedIn: 'root'
})
export class StaticAssetsService {
  private artifactsPath = "assets\\Artifacts.json";
  private boonsPath = "assets\\Boons.json";
  private heroesPath = "assets\\Heroes.json";

  constructor(private http: HttpClient) {
  }

  getArtifacts(): Observable<string[]> {
    return this.http.get<string[]>(this.artifactsPath);
  }

  getBoons(): Observable<string[]> {
    return this.http.get<string[]>(this.boonsPath);
  }

  getHeroes(): Observable<HeroImages[]> {
    return this.http.get<HeroImages[]>(this.heroesPath);
  }
}