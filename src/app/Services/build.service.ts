import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Build } from '../Models/Build';
import { BuildVote } from '../Models/BuildVote';
import { ConfigService } from './config.service';
import { OauthService } from './oauth.service';

@Injectable({
  providedIn: 'root'
})
export class BuildService {

  constructor(private config: ConfigService,
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

  getHeroBuilds(heroId: number): Observable<Build[]> {
    const url = `${this.buildPath}/${heroId}`;
    return this.http.get<Build[]>(url, { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) });
  }

  getMyBuildVotes(buildIds: number[]): Observable<BuildVote[]> {
    const url = `${this.buildPath}/votes`;
    const queryParams = {
      builds: buildIds.join(',')
    }
    return this.http.get<BuildVote[]>(url, { headers: new HttpHeaders({ 'Content-Type': 'application/json' }), withCredentials: true, params: queryParams });
  }

  getMyBuilds(): Observable<Build[]> {
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
}
