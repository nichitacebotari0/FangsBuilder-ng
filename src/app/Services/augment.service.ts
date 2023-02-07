import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, filter, Observable, of, shareReplay, Subject, switchMap, take } from 'rxjs';
import { Augment } from '../Models/Augment';
import { ConfigService } from './config.service';
import { PatchService } from './patch.service';

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
  private cache: Map<string, Observable<Augment[]> | undefined> = new Map<string, Observable<Augment[]> | undefined>();
  private trigger = new Subject<{ heroId: number, patchId: number }>();


  private fetch(heroId: number, patchId: number): Observable<Augment[]> {
    return this.http.get<Augment[]>(this.apiPath, {
      observe: "body" as const,
      responseType: "json" as const,
      params: { heroId: heroId, patchId: patchId }
    });
  }

  refetch(heroId: number, patchId: number) {
    // note that we do not refetch patches after this one at the moment, low value
    this.trigger.next({ heroId, patchId });
  }

  get(heroId: number, patchId: number): Observable<Augment[]> {
    let key = heroId + "_" + patchId;
    let cacheValue = this.cache.get(key)
    if (!cacheValue) {
      cacheValue = this.trigger.pipe(
        filter(x => x.heroId == heroId && x.patchId == patchId), 
        switchMap(x => this.fetch(x.heroId, x.patchId)),
        shareReplay(1)
      );
      cacheValue.pipe(take(1)).subscribe(); // initial subscribtion to populate cache
      this.refetch(heroId, patchId);
      this.cache.set(key, cacheValue);
    }
    return cacheValue;
  }

  add(abilityType: Augment): Observable<Augment> {
    return this.http.post<Augment>(this.apiPath, abilityType, this.httpOptions).pipe(
      catchError(this.handleError<Augment>('addAugment'))
    );
  }

  update(abilityType: Augment): Observable<void> {
    return this.http.put<void>(this.apiPath, abilityType, this.httpOptions)
      .pipe<void>(
        catchError(this.handleError<void>('updateAugment'))
      );
  }

  delete(id: number, heroId: number, patchId: number): Observable<Augment> {
    const url = `${this.apiPath}/${id}`;
    return this.http.delete<Augment>(url, {
      observe: "body" as const,
      responseType: "json" as const,
      params: { heroId: heroId, patchId: patchId }
    }).pipe(
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
