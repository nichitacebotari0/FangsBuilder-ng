import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Patch } from '../Models/Patch';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class PatchService {
  constructor(config: ConfigService, private http: HttpClient) {
    this.apiPath = config.apiBaseUrl + "Patch";
  }

  apiPath: string;
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    withCredentials: true
  };

  get(): Observable<Patch[]> {
    return this.http.get<Patch[]>(this.apiPath);
  }

  getLatestActive(): Observable<Patch> {
    return this.http.get<Patch[]>(this.apiPath).pipe(
      map(x => x.sort((a, b) => {
        if (a.websiteTimeUtc && b.websiteTimeUtc)
          return a.websiteTimeUtc < b.websiteTimeUtc ? -1 : 1;
        return a.gameDate < b.gameDate ? -1 : 1;
      })),
      map(x => x[x.length - 1])
    );
  }

  add(patch: Patch): Observable<Patch> {
    return this.http.post<Patch>(this.apiPath, patch);
  }

  update(id: number, patch: Patch): Observable<void> {
    const url = `${this.apiPath}/${id}`;
    return this.http.put<void>(url, patch, this.httpOptions);;
  }

  delete(id: number): Observable<void> {
    const url = `${this.apiPath}/${id}`;
    return this.http.delete<void>(url);
  }
}
