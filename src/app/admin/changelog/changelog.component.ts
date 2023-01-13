import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { map, mergeMap, Subject, Subscription, tap } from 'rxjs';
import { ChangeLog } from 'src/app/Models/ChangeLog';
import { ConfigService } from 'src/app/Services/config.service';

interface PageRequest {
  pageDirection: number;
  previousId: number;
}

@Component({
  selector: 'app-changelog',
  templateUrl: './changelog.component.html',
  styleUrls: ['./changelog.component.less']
})
export class ChangelogComponent implements OnInit, OnDestroy {



  constructor(config: ConfigService, private http: HttpClient) {
    this.apiPath = config.apiBaseUrl + "Changes";
  }

  ngOnInit(): void {
    this.http.get<ChangeLog[]>(this.apiPath, this.httpOptions)
      .subscribe(logs => this.page = logs);


    this.pageSubscription = this.pageRequest.pipe(
      tap(request => this.httpOptions.params = { previousId: request.previousId, pageDirection: request.pageDirection }),
      mergeMap(request => this.http.get<ChangeLog[]>(this.apiPath, this.httpOptions))
    ).subscribe(logs => this.page = logs);
  }
  apiPath: string;
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    withCredentials: true,
    params: {}
  };
  pageRequest: Subject<PageRequest> = new Subject<PageRequest>();
  private pageSubscription: Subscription | undefined;
  page: ChangeLog[] | undefined;

  loadPage(direction: number) {
    if (!this.page)
      return;
    const previousChange = direction > 0 ? this.page[this.page?.length - 1] : this.page[0];
    this.pageRequest.next({ pageDirection: direction, previousId: previousChange.id });
  }

  ngOnDestroy() {
    this.pageSubscription?.unsubscribe();
  }
}
