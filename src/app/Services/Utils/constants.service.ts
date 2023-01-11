import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConstantsService {

  constructor() { }

  public get discord() {
    return {
      SuperId: "224586010271547393"
    }
  }

}
