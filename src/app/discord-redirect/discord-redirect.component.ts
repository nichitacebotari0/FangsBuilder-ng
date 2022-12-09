import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, concatMap, of } from 'rxjs';
import { OauthService } from '../Services/oauth.service';

@Component({
  selector: 'app-discord-redirect',
  templateUrl: './discord-redirect.component.html',
  styleUrls: ['./discord-redirect.component.less']
})
export class DiscordRedirectComponent implements OnInit {

  constructor(private activeRoute: ActivatedRoute, private auth: OauthService, private router: Router) { }

  ngOnInit() {
    this.activeRoute.queryParamMap
      .pipe(
        concatMap(x => this.auth.getAcessToken(x.get('code')!)),
        catchError(err => of(console.error(err)))
      )
      .subscribe(
        data => { 
          console.log(data);
          // console.log(" " + window.atob(data!)[1] );
          this.router.navigate(['/']); 
        },
      );
  }

}
