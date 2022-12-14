import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of, shareReplay, Subject, switchMap } from 'rxjs';
import { Augment } from '../Models/Augment';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class AugmentService {
  constructor(private config: ConfigService, private http: HttpClient) {
    this.apiPath = config.apiBaseUrl + "Augments";
  }

  apiPath: string;
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    withCredentials: true
  };

  private cache$: Observable<Augment[]> | undefined;
  private trigger = new Subject<void>();

  private fetch(): Observable<Augment[]> {
    return this.http.get<Augment[]>(this.apiPath, {
      observe: "body" as const,
      responseType: "json" as const
    });
  }

  refetch() {
    this.trigger.next();
  }

  get(): Observable<Augment[]> {
    if (!this.cache$) {
      this.cache$ = this.trigger.pipe(
        switchMap(x => this.fetch()),
        shareReplay(1)
      );
    }
    return this.cache$;
  }

  add(abilityType: Augment): Observable<Augment> {
    return this.http.post<Augment>(this.apiPath, abilityType, this.httpOptions).pipe(
      catchError(this.handleError<Augment>('addAugment'))
    );
  }

  update(id: number, abilityType: Augment): Observable<Augment> {
    const url = `${this.apiPath}/${id}`;
    return this.http.put<Augment>(url, abilityType, this.httpOptions)
      .pipe(
        catchError(this.handleError<Augment>('updateAugment'))
      );
  }

  delete(id: number): Observable<Augment> {
    const url = `${this.apiPath}/${id}`;
    return this.http.delete<Augment>(url, this.httpOptions).pipe(
      catchError(this.handleError<Augment>('deleteAugment'))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      return of(result as T);
    };
  }
}
