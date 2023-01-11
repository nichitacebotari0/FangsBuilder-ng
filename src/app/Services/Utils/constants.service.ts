import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConstantsService {

  constructor() { }

  public get discord(): any {
    return {
      SuperId: "224586010271547393"
    }
  }

}
