import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Patch } from '../Models/Patch';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class PatchService {
    constructor(private config: ConfigService, private http: HttpClient) {
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
