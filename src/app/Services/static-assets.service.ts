import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StaticAssetsService {
  private artifactsPath = "assets\\Artifacts.json";
  private heroesPath = "assets\\Heroes.json";

  artifacts: any;
  heroes: any;
  constructor(private http: HttpClient) {
    this.http.get(this.artifactsPath)
      .subscribe(data => this.artifacts = data);
    this.http.get(this.heroesPath)
      .subscribe(data => this.heroes = data);
  }
}
