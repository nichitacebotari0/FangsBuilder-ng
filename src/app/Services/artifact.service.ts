import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, filter, Observable, of, shareReplay, Subject, switchMap, take } from 'rxjs';
import { Artifact } from '../Models/Artifact';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class ArtifactService {
  constructor(config: ConfigService, private http: HttpClient) {
    this.apiPath = config.apiBaseUrl + "Artifacts";
  }

  apiPath: string;
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    withCredentials: true
  };

  private cache: Map<number, Observable<Artifact[]> | undefined> = new Map<number, Observable<Artifact[]> | undefined>;
  private trigger = new Subject<number>();

  private fetch(patchId: number): Observable<Artifact[]> {
    return this.http.get<Artifact[]>(this.apiPath, {
      observe: "body" as const,
      responseType: "json" as const,
      params: { patchId: patchId }
    });
  }

  refetch(patchId: number): void {
    // note that we do not refetch patches after this one at the moment, low value
    this.trigger.next(patchId);
  }

  get(patchId: number): Observable<Artifact[]> {
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

  add(artifact: Artifact): Observable<Artifact> {
    return this.http.post<Artifact>(this.apiPath, artifact, this.httpOptions).pipe(
      catchError(this.handleError<Artifact>('addArtifact'))
    );
  }

  update(artifact: Artifact): Observable<void> {
    return this.http.put<void>(this.apiPath, artifact, this.httpOptions)
      .pipe(
        catchError(this.handleError<void>('updateArtifact'))
      );
  }

  delete(id: number, patchId: number): Observable<Artifact> {
    const url = `${this.apiPath}/${id}`;
    return this.http.delete<Artifact>(url, {
      observe: "body" as const,
      responseType: "json" as const,
      params: { patchId: patchId }
    }).pipe(
      catchError(this.handleError<Artifact>('deleteArtifact'))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      return of(result as T);
    };
  }
}
