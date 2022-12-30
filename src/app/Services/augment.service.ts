import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, filter, Observable, of, shareReplay, Subject, switchMap, take } from 'rxjs';
import { Augment } from '../Models/Augment';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class AugmentService {
  constructor(config: ConfigService, private http: HttpClient) {
    this.apiPath = config.apiBaseUrl + "Augments";
  }

  apiPath: string;
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    withCredentials: true
  };

  private cache: Map<number, Observable<Augment[]> | undefined> = new Map<number, Observable<Augment[]> | undefined>();
  private trigger = new Subject<number>();

  private fetch(heroId: number): Observable<Augment[]> {
    return this.http.get<Augment[]>(this.apiPath, {
      observe: "body" as const,
      responseType: "json" as const,
      params: { heroId: heroId }
    });
  }

  refetch(heroId: number) {
    this.trigger.next(heroId);
  }

  get(heroId: number): Observable<Augment[]> {
    let heroCache = this.cache.get(heroId)
    if (!heroCache) {
      heroCache = this.trigger.pipe(
        filter(x => x == heroId),
        switchMap(x => this.fetch(x)),
        shareReplay(1)
      );
      heroCache.pipe(take(1)).subscribe(); // initial subscribtion to populate cache
      this.refetch(heroId);
      this.cache.set(heroId,heroCache);
    }
    return heroCache;
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
