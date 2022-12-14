import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfigService } from './config.service';
import { CookieService } from 'ngx-cookie';
import { ConstantsService } from './Utils/constants.service';

@Injectable({
  providedIn: 'root'
})
export class OauthService {

  constructor(
    private http: HttpClient,
    private config: ConfigService,
    private cookieService: CookieService,
    private constants: ConstantsService) { }

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
    if (this.cookieService.get("discordDev")?.toLowerCase() == "true" || this.cookieService.get("discordMod")?.toLowerCase() == "true")
      return true;
    return false;
  }

  issuper(): boolean {
    return this.cookieService.get("discordId") == this.constants.discord.SuperId;
  }
}
