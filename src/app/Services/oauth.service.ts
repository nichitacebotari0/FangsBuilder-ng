import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfigService } from './config.service';
import { CookieService } from 'ngx-cookie';

@Injectable({
  providedIn: 'root'
})
export class OauthService {

  constructor(
    private http: HttpClient,
    private config: ConfigService,
    private cookieService: CookieService) { }

  getAcessToken(auth_code: string) {
    var queryParams = {
      code: auth_code
    }
    return this.http.get(this.config.apiBaseUrl + 'Login/GetToken', { params: queryParams, responseType: "text", withCredentials: true });
  }

  isLoggedIn(): boolean {
    if (this.cookieService.get("discordId"))
      return true;
    return false;
  }

  getId(): string | undefined {
    return this.cookieService.get("discordId");
  }

  getusername(): string | undefined {
    return this.cookieService.get("discordNick");
  }

  getregions(): string | undefined {
    return this.cookieService.get("regionRoleId");
  }

  isadmin(): boolean {
    if (this.cookieService.get("discordDev") || this.cookieService.get("discordMod"))
      return true;
    return false;
  }
  
  // getUserDetails() {
  //   return this.http.get(environment.baseUrl + '/getUserDetails');
  // }
  // logout() {
  //   return this.http.get(environment.baseUrl + '/logout');
  // }
}
