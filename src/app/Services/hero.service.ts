import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of, shareReplay, Subject, switchMap } from 'rxjs';
import { Hero } from '../Models/Hero';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class HeroService {
  constructor(private config: ConfigService, private http: HttpClient) {
    this.apiPath = config.apiBaseUrl + "Heroes";
  }

  apiPath: string;
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    withCredentials: true
  };

  private cache$: Observable<Hero[]> | undefined;
  private trigger = new Subject<void>();

  private fetch(): Observable<Hero[]> {
    return this.http.get<Hero[]>(this.apiPath, {
      observe: "body" as const,
      responseType: "json" as const
    });
  }

  refetch() {
    this.trigger.next();
  }

  get(): Observable<Hero[]> {
    if (!this.cache$) {
      this.cache$ = this.trigger.pipe(
        switchMap(x => this.fetch()),
        shareReplay(1)
      );
    }
    return this.cache$;
  }

  add(abilityType: Hero): Observable<Hero> {
    return this.http.post<Hero>(this.apiPath, abilityType, this.httpOptions).pipe(
      catchError(this.handleError<Hero>('addHero'))
    );
  }

  update(id: number, abilityType: Hero): Observable<Hero> {
    const url = `${this.apiPath}/${id}`;
    return this.http.put<Hero>(url, abilityType, this.httpOptions)
      .pipe(
        catchError(this.handleError<Hero>('updateHero'))
      );
  }

  delete(id: number): Observable<Hero> {
    const url = `${this.apiPath}/${id}`;
    return this.http.delete<Hero>(url, this.httpOptions).pipe(
      catchError(this.handleError<Hero>('deleteHero'))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      return of(result as T);
    };
  }
}
