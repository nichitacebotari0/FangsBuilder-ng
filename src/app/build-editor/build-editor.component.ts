import { Component, OnInit } from '@angular/core';
import { Augment } from '../Models/Augment';
import { AugmentSlot } from '../Models/AugmentSlot';
import { Category } from '../Models/Category';
import { AugmentSlotCategory } from '../Models/Enum/AugmentSlotCategory';
import { AbilityTypeService } from '../Services/ability-type.service';
import { AugmentService } from '../Services/augment.service';

@Component({
  selector: 'app-build-editor',
  templateUrl: './build-editor.component.html',
  styleUrls: ['./build-editor.component.less']
})
export class BuildEditorComponent implements OnInit {
  readonly AugmentSlotCategoryEnum = AugmentSlotCategory;

  augmentSlots: AugmentSlot[] = [
    new AugmentSlot(AugmentSlotCategory.POSITIONAL),
    new AugmentSlot(AugmentSlotCategory.COMBAT),
    new AugmentSlot(AugmentSlotCategory.UTILITY),
    new AugmentSlot(AugmentSlotCategory.FLEX),
    new AugmentSlot(AugmentSlotCategory.ULTIMATE),
    new AugmentSlot(AugmentSlotCategory.ACTIVE),
    new AugmentSlot(AugmentSlotCategory.FLEX),
    new AugmentSlot(AugmentSlotCategory.FLEX),
  ];

  selectedSlot: number = -1;
  selectedCategory: AugmentSlotCategory = AugmentSlotCategory.FLEX;
  availableAugments: Augment[] = [];
  groupedAugments: Map<number, Augment[]> = new Map<number, Augment[]>();

  constructor(private augmentService: AugmentService, private abilityTypeService: AbilityTypeService) { }

  ngOnInit(): void {
  }

  getSelectedSlot(): AugmentSlot {
    return this.augmentSlots[this.selectedSlot];
  }

  setCategory(event: Event, id: AugmentSlotCategory) {
    event.stopPropagation();
    this.selectedCategory = id;

    this.populateAugmentList();
  }

  setSelected(event: Event, id: number) {
    event.stopPropagation();
    this.selectedSlot = id;
    this.selectedCategory = this.augmentSlots[this.selectedSlot].augmentCategory;
    if (id < 0) {
      this.groupedAugments = new Map<number, Augment[]>();
      return;
    }

    this.availableAugments = this.augmentService.getMockAugments(20);
    this.populateAugmentList();
  }

  private populateAugmentList() {
    let filteredAugments = this.getAugmentsForCategory(this.availableAugments);
    this.groupedAugments = filteredAugments.reduce((aggregate: Map<number, Augment[]>, augment: Augment) => {
      aggregate = aggregate || new Map<number, Augment[]>();
      aggregate.set(augment.abilityType, aggregate.get(augment.abilityType) || []);
      aggregate.get(augment.abilityType)!.push(augment);
      return aggregate;
    }, new Map<number, Augment[]>()); // group by ability type
  }

  getAugmentsForCategory(augments: Augment[]): Augment[] {
    if (this.selectedCategory == AugmentSlotCategory.FLEX) {
      return [];
    }
    return augments.filter(x => x.augmentCategory == this.selectedCategory);
  }

  getAbilityTypeName(id: number): Category | undefined {
    return this.abilityTypeService.getMockAbilityTypes().find(x => x.id == id);
  }
}
