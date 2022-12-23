import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { Build } from '../Models/Build';
import { ConfigService } from './config.service';
import { OauthService } from './oauth.service';

@Injectable({
  providedIn: 'root'
})
export class BuildService {

  constructor(private config: ConfigService,
    private http: HttpClient,
    private oauthService: OauthService) {
    this.apiPath = config.apiBaseUrl + "UserBuild";
  }

  apiPath: string;
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    withCredentials: true
  };

  getMyBuilds(): Observable<Build[]> {
    const id = this.oauthService.getId()
    const queryParams = {
      userId: id as string
    }
    return this.http.get<Build[]>(this.apiPath, { headers: new HttpHeaders({ 'Content-Type': 'application/json' }), params: queryParams });
  }

  add(build: Build): Observable<Build> {
    return this.http.post<Build>(this.apiPath, build, this.httpOptions);
  }

  update(id: number, build: Build): Observable<Build> {
    const url = `${this.apiPath}/${id}`;
    return this.http.put<Build>(url, build, this.httpOptions);
  }
}
