import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of, shareReplay, Subject, switchMap } from 'rxjs';
import { Artifact } from '../Models/Artifact';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class ArtifactService {
  constructor(private config: ConfigService, private http: HttpClient) {
    this.apiPath = config.apiBaseUrl + "Artifacts";
  }

  apiPath: string;
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  private cache$: Observable<Artifact[]> | undefined;
  private trigger = new Subject<void>();

  private fetch(): Observable<Artifact[]> {
    return this.http.get<Artifact[]>(this.apiPath, {
      observe: "body" as const,
      responseType: "json" as const
    });
  }

  refetch() {
    this.trigger.next();
  }

  get(): Observable<Artifact[]> {
    if (!this.cache$) {
      this.cache$ = this.trigger.pipe(
        switchMap(x => this.fetch()),
        shareReplay(1)
      );
    }
    return this.cache$;
  }

  add(abilityType: Artifact): Observable<Artifact> {
    return this.http.post<Artifact>(this.apiPath, abilityType, this.httpOptions).pipe(
      catchError(this.handleError<Artifact>('addArtifact'))
    );
  }

  update(id: number, abilityType: Artifact): Observable<Artifact> {
    const url = `${this.apiPath}/${id}`;
    return this.http.put<Artifact>(url, abilityType, this.httpOptions)
      .pipe(
        catchError(this.handleError<Artifact>('updateArtifact'))
      );
  }

  delete(id: number): Observable<Artifact> {
    const url = `${this.apiPath}/${id}`;
    return this.http.delete<Artifact>(url, this.httpOptions).pipe(
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
