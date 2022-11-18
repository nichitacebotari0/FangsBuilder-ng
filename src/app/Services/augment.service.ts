import { Injectable } from '@angular/core';
import { Augment } from '../Models/Augment';
import { Category } from '../Models/Category';

@Injectable({
  providedIn: 'root'
})
export class AugmentService {

  constructor() {
  }

  getMockAugments(count: number): Augment[] {
    let mockAugments: Augment[] = [];
    for (let i = 1; i <= count; i++) {
      const element = new Augment(i, "name_" + i, i + " description that is quite long, lorem ipsum dolorem etcetc ",
        "assets/Empty.png", (i - 1) % 5, (i - 1) % 6);
      mockAugments.push(element);
    }
    return mockAugments;
  }
  
}
