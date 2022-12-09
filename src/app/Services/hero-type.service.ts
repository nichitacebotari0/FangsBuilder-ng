import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of, shareReplay, Subject, switchMap } from 'rxjs';
import { Category } from '../Models/Category';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class HeroTypeService {
  constructor(private config: ConfigService, private http: HttpClient) {
    this.apiPath = config.apiBaseUrl + "HeroClasses";    
  }

  apiPath: string;
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    withCredentials: true
  };

  private cache$: Observable<Category[]> | undefined;
  private trigger = new Subject<void>();

  private fetch(): Observable<Category[]> {
    return this.http.get<Category[]>(this.apiPath, {
      observe: "body" as const,
      responseType: "json" as const
    });
  }

  refetch() {
    this.trigger.next();
  }

  get(): Observable<Category[]> {
    if (!this.cache$) {
      this.cache$ = this.trigger.pipe(
        switchMap(x => this.fetch()),
        shareReplay(1)
      );
    }
    return this.cache$;
  }

  add(abilityType: Category): Observable<Category> {
    return this.http.post<Category>(this.apiPath, abilityType, this.httpOptions).pipe(
      catchError(this.handleError<Category>('addHero'))
    );
  }

  update(id: number, abilityType: Category): Observable<Category> {
    const url = `${this.apiPath}/${id}`;
    return this.http.put<Category>(url, abilityType, this.httpOptions)
      .pipe(
        catchError(this.handleError<Category>('updateHero'))
      );
  }

  delete(id: number): Observable<Category> {
    const url = `${this.apiPath}/${id}`;
    return this.http.delete<Category>(url, this.httpOptions).pipe(
      catchError(this.handleError<Category>('deleteHero'))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      return of(result as T);
    };
  }
}
