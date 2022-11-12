import { Injectable } from '@angular/core';
import { Augment, AugmentCategory } from '../Models/Augment';

@Injectable({
  providedIn: 'root'
})
export class AugmentService {

  constructor() {
  }

  generateMockAugments(count: number): Augment[] {
    let mockAugments: Augment[] = [];
    for (let i = 1; i <= count; i++) {
      const element = new Augment(count, "name_" + count, count + " description that is quite long , lorem ipsum dolorem etcetc ",
        "assets/Empty.png", (count - 1) % 5 as AugmentCategory)
      mockAugments.push(element);
    }
    return mockAugments;
  }



}
