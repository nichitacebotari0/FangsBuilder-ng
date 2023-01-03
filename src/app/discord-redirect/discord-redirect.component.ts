import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, concatMap, Observer, of } from 'rxjs';
import { OauthService } from '../Services/oauth.service';

enum AuthState {
  RequestInFlight = 0,
  Success,
  Fail,
}

@Component({
  selector: 'app-discord-redirect',
  templateUrl: './discord-redirect.component.html',
  styleUrls: ['./discord-redirect.component.less']
})
export class DiscordRedirectComponent implements OnInit {

  constructor(private activeRoute: ActivatedRoute, private auth: OauthService, private router: Router) { }
  readonly AuthStateEnum = AuthState;
  currentState: AuthState = AuthState.RequestInFlight;
  ngOnInit() {
    let observer = {
      next: () => {
        this.currentState = AuthState.Success;
        this.router.navigate(['/']);
      },
      error: (err: any) => {
        this.currentState = AuthState.Fail
      }
    }

    this.activeRoute.queryParamMap
      .pipe(
        concatMap(x => this.auth.getAcessToken(x.get('code')!)),
      )
      .subscribe(observer);
  }

}
