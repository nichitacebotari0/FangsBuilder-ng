import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AugmentArrangement } from '../Models/AugmentArrangement';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class AugmentArrangementService {

  constructor(private config: ConfigService, private http: HttpClient) {
    this.apiPath = config.apiBaseUrl + "AugmentArrangement";
  }
  apiPath: string;
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    withCredentials: true
  };
  
  get(): Observable<AugmentArrangement[]> {
    return this.http.get<AugmentArrangement[]>(this.apiPath);
  }

  add(augmentarrangement: AugmentArrangement): Observable<AugmentArrangement> {
    return this.http.post<AugmentArrangement>(this.apiPath, augmentarrangement);
  }

  update(id: number, augmentarrangement: AugmentArrangement): Observable<void> {
    const url = `${this.apiPath}/${id}`;
    return this.http.put<void>(url, augmentarrangement, this.httpOptions);;
  }

  delete(id: number): Observable<void> {
    const url = `${this.apiPath}/${id}`;
    return this.http.delete<void>(url);
  }
}
