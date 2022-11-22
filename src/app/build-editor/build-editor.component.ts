import { Component, OnInit } from '@angular/core';
import { filter, mergeAll, Observable, of, reduce, toArray } from 'rxjs';
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
    { augmentCategory: AugmentSlotCategory.POSITIONAL },
    { augmentCategory: AugmentSlotCategory.COMBAT },
    { augmentCategory: AugmentSlotCategory.UTILITY },
    { augmentCategory: AugmentSlotCategory.FLEX },
    { augmentCategory: AugmentSlotCategory.ULTIMATE },
    { augmentCategory: AugmentSlotCategory.ACTIVE },
    { augmentCategory: AugmentSlotCategory.FLEX },
    { augmentCategory: AugmentSlotCategory.FLEX },
  ];

  selectedSlot: number = -1;
  selectedCategory: AugmentSlotCategory = AugmentSlotCategory.FLEX;
  availableAugments: Observable<Augment[]> | undefined;
  groupedAugments: Observable<Map<number, Augment[]>> | undefined;

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
      this.groupedAugments = undefined;
      return;
    }

    this.availableAugments = this.augmentService.get();
    this.populateAugmentList();
  }

  private populateAugmentList() {
    let filteredAugments = this.getAugmentsForCategory(this.availableAugments);
    this.groupedAugments = filteredAugments.pipe(
      mergeAll(),
      reduce((aggregate: Map<number, Augment[]>, augment: Augment) => {
        aggregate = aggregate || new Map<number, Augment[]>();
        aggregate.set(augment.abilityType, aggregate.get(augment.abilityType) || []);
        aggregate.get(augment.abilityType)!.push(augment);
        return aggregate;
      }, new Map<number, Augment[]>()),
    ); // group by ability type
  }

  getAugmentsForCategory(augments: Observable<Augment[]> | undefined): Observable<Augment[]> {
    if (!augments || this.selectedCategory == AugmentSlotCategory.FLEX) {
      return of([]);
    }
    return augments.pipe(
      mergeAll(),
      filter(x => x.augmentCategory == this.selectedCategory),
      toArray()
    );
  }

  getAbilityTypeName(id: number): Category | undefined {
    let abilityType: Category | undefined;
    this.abilityTypeService.get()
      .subscribe(x => abilityType = x.find(z => z.id == id));
    return abilityType;
  }
}
