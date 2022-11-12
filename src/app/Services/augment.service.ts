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

  getMockAbilityTypes(): Category[] {
    let mockAbilityTypes: Category[] = [
      { id: 1, name: "Passive" },
      { id: 2, name: "LMB" },
      { id: 3, name: "E" },
      { id: 4, name: "Shift" },
      { id: 5, name: "Space" },
      { id: 6, name: "RMB" },
      { id: 101, name: "Captain Hunter" },
      { id: 102, name: "Shard Runner" },
      { id: 103, name: "Aspect Warrior" },
      { id: 104, name: "Captain Guardian" },
      { id: 105, name: "Aspect Guide" },
      { id: 106, name: "Shard Enchanter" }
    ];
    return mockAbilityTypes;
  }
}
