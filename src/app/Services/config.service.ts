import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  apiBaseUrl: string = "localhost:7071/api"

  constructor() { }
}
