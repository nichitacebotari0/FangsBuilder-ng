import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of, shareReplay, Subject, switchMap } from 'rxjs';
import { Active } from '../Models/Active';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class ActiveService {
  constructor(private config: ConfigService, private http: HttpClient) {
    this.apiPath = config.apiBaseUrl + "Actives";
  }

  apiPath: string;
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    withCredentials: true
  };

  private cache$: Observable<Active[]> | undefined;
  private trigger = new Subject<void>();

  private fetch(): Observable<Active[]> {
    return this.http.get<Active[]>(this.apiPath, {
      observe: "body" as const,
      responseType: "json" as const
    });
  }

  refetch() {
    this.trigger.next();
  }

  get(): Observable<Active[]> {
    if (!this.cache$) {
      this.cache$ = this.trigger.pipe(
        switchMap(x => this.fetch()),
        shareReplay(1)
      );
    }
    return this.cache$;
  }

  add(abilityType: Active): Observable<Active> {
    return this.http.post<Active>(this.apiPath, abilityType, this.httpOptions).pipe(
      catchError(this.handleError<Active>('addActive'))
    );
  }

  update(id: number, abilityType: Active): Observable<Active> {
    const url = `${this.apiPath}/${id}`;
    return this.http.put<Active>(url, abilityType, this.httpOptions)
      .pipe(
        catchError(this.handleError<Active>('updateActive'))
      );
  }

  delete(id: number): Observable<Active> {
    const url = `${this.apiPath}/${id}`;
    return this.http.delete<Active>(url, this.httpOptions).pipe(
      catchError(this.handleError<Active>('deleteActive'))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      return of(result as T);
    };
  }
}
