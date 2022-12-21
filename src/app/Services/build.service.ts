import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { Build } from '../Models/Build';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class BuildService {

  constructor(private config: ConfigService, private http: HttpClient) {
    this.apiPath = config.apiBaseUrl + "UserBuild";
  }

  apiPath: string;
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    withCredentials: true
  };

  getMyBuilds(): Observable<Build[]> {
    return this.http.get<Build[]>(this.apiPath, this.httpOptions);
  }

  add(build: Build): Observable<Build> {
    return this.http.post<Build>(this.apiPath, build, this.httpOptions);
  }


}
