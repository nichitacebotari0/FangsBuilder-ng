import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, filter, Observable, of, shareReplay, Subject, switchMap, take } from 'rxjs';
import { Active } from '../Models/Active';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class ActiveService {
  constructor(config: ConfigService, private http: HttpClient) {
    this.apiPath = config.apiBaseUrl + "Actives";
  }

  apiPath: string;
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    withCredentials: true
  };

  private cache: Map<number, Observable<Active[]> | undefined> = new Map<number, Observable<Active[]> | undefined>;
  private trigger = new Subject<number>();

  private fetch(patchId: number): Observable<Active[]> {
    return this.http.get<Active[]>(this.apiPath, {
      observe: "body" as const,
      responseType: "json" as const,
      params: { patchId: patchId }
    });
  }

  refetch(patchId: number) {
    // note that we do not refetch patches after this one at the moment, low value
    this.trigger.next(patchId);
  }

  get(patchId: number): Observable<Active[]> {
    let cacheValue = this.cache.get(patchId);
    if (!cacheValue) {
      cacheValue = this.trigger.pipe(
        filter(x => x == patchId),
        switchMap(x => this.fetch(patchId)),
        shareReplay(1)
      );
      cacheValue.pipe(take(1)).subscribe(); // initial subscribtion to populate cache
      this.refetch(patchId);
      this.cache.set(patchId, cacheValue);
    }
    return cacheValue;
  }

  add(active: Active): Observable<Active> {
    return this.http.post<Active>(this.apiPath, active, this.httpOptions).pipe(
      catchError(this.handleError<Active>('addActive'))
    );
  }

  update(active: Active): Observable<void> {
    return this.http.put<void>(this.apiPath, active, this.httpOptions)
      .pipe(
        catchError(this.handleError<void>('updateActive'))
      );
  }

  delete(id: number, patchId: number): Observable<Active> {
    const url = `${this.apiPath}/${id}`;
    return this.http.delete<Active>(url, {
      observe: "body" as const,
      responseType: "json" as const,
      params: { patchId: patchId }
    }).pipe(
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
