import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Build } from '../Models/Build';
import { BuildVote } from '../Models/BuildVote';
import { ConfigService } from './config.service';
import { OauthService } from './oauth.service';

@Injectable({
  providedIn: 'root'
})
export class BuildService {

  constructor(config: ConfigService,
    private http: HttpClient,
    private oauthService: OauthService) {
    this.userBuildPath = config.apiBaseUrl + "UserBuild";
    this.buildPath = config.apiBaseUrl + "Build";
  }

  userBuildPath: string;
  buildPath: string;
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    withCredentials: true
  };

  getBuild(id: number): Observable<Build> {
    const url = `${this.buildPath}/${id}`;
    return this.http.get<Build>(url, this.httpOptions);
  }

  getHeroBuilds(heroId: number, previousVote: number | undefined, previousId: number | undefined): Observable<Build[]> {
    const url = `${this.buildPath}/hero/${heroId}`;
    const options = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }), params: {} };
    if (previousVote !== undefined && previousId !== undefined) {
      options.params = {
        previousVote: previousVote,
        previousId: previousId
      }
    }
    return this.http.get<Build[]>(url, options);
  }

  getMyBuilds(): Observable<Build[]> {
    if (!this.oauthService.isLoggedIn())
      return of([]);
    const id = this.oauthService.getId()
    const queryParams = {
      userId: id as string
    }
    return this.http.get<Build[]>(this.userBuildPath, { headers: new HttpHeaders({ 'Content-Type': 'application/json' }), params: queryParams });
  }

  add(build: Build): Observable<Build> {
    return this.http.post<Build>(this.userBuildPath, build, this.httpOptions);
  }

  update(id: number, build: Build): Observable<Build> {
    const url = `${this.userBuildPath}/${id}`;
    return this.http.put<Build>(url, build, this.httpOptions);
  }

  remove(id: number): Observable<object> {
    const url = `${this.userBuildPath}/${id}`;
    return this.http.delete(url, this.httpOptions);
  }

  getMyVotes(buildIds: number[]): Observable<BuildVote[]> {
    if (!this.oauthService.isLoggedIn())
      return of([]);
    const url = `${this.buildPath}/myvotes`;
    const queryParams = {
      builds: buildIds.join(',')
    }
    return this.http.get<BuildVote[]>(url, { headers: new HttpHeaders({ 'Content-Type': 'application/json' }), withCredentials: true, params: queryParams });
  }

  addVote(vote: BuildVote): Observable<BuildVote> {
    const url = `${this.buildPath}/vote`;
    return this.http.post<BuildVote>(url, vote, this.httpOptions);
  }

  changeVote(id: number, vote: BuildVote): Observable<object> {
    const url = `${this.buildPath}/vote/${id}`;
    return this.http.put(url, vote, this.httpOptions);
  }

  removeVote(id: number): Observable<object> {
    const url = `${this.buildPath}/vote/${id}`;
    return this.http.delete(url, this.httpOptions);
  }
}
