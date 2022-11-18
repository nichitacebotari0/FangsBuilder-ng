import { Injectable } from '@angular/core';
import { Category } from '../Models/Category';

@Injectable({
  providedIn: 'root'
})
export class AbilityTypeService {

  constructor() { }

  mockAbilityTypes: Category[] = [
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

  getMockAbilityTypes(): Category[] {
    return this.mockAbilityTypes;
  }

  addMockAbilityType(input: Category) {
    this.mockAbilityTypes.push(input);
  }

  editMockAbilityType(id: number, input: Category) {
    let element = this.mockAbilityTypes.find(x => x.id == id);
    if (element) {
      element.id = input.id;
      element.name = input.name;
    }
  }
}
