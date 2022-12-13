import { Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject, combineLatest, map, Observable, of, shareReplay, tap, withLatestFrom, } from 'rxjs';
import { Active } from '../Models/Active';
import { Artifact } from '../Models/Artifact';
import { Augment } from '../Models/Augment';
import { AugmentSlot } from '../Models/AugmentSlot';
import { Category } from '../Models/Category';
import { AugmentSlotCategory } from '../Models/Enum/AugmentSlotCategory';
import { Hero } from '../Models/Hero';
import { AbilityTypeService } from '../Services/ability-type.service';
import { ActiveService } from '../Services/active.service';
import { ArtifactService } from '../Services/artifact.service';
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
  @Input() hero$: Observable<Hero | undefined> = of(undefined);
  selectedSlot = new BehaviorSubject<number>(-1);
  selectedCategory = new BehaviorSubject<AugmentSlotCategory>(AugmentSlotCategory.NONE);
  slotCategory$ = new BehaviorSubject<AugmentSlotCategory>(AugmentSlotCategory.NONE);
  heroAugments$: Observable<Augment[]> | undefined;
  skillAugments$: Observable<Augment[]> | undefined;
  groupedAugments$: Observable<Map<number, Augment[]>> | undefined;
  boons$: Observable<Active[]>;
  groupedArtifacts$: Observable<Map<number, Artifact[]>>;

  constructor(private augmentService: AugmentService,
    private abilityTypeService: AbilityTypeService,
    private artifactService: ArtifactService,
    boonService: ActiveService) {
    this.boons$ = boonService.get();
    this.groupedArtifacts$ = this.artifactService.get().pipe(
      map(artifacts =>
        artifacts.reduce<Map<number, Artifact[]>>((aggregate: Map<number, Artifact[]>, artifact: Artifact) => {
          aggregate = aggregate || new Map<number, Artifact[]>();
          aggregate.set(artifact.artifactTypeId, aggregate.get(artifact.artifactTypeId) || []);
          aggregate.get(artifact.artifactTypeId)!.push(artifact);
          return aggregate;
        }, new Map<number, Artifact[]>()))
    )
  }

  ngOnInit(): void {
    this.heroAugments$ =
      combineLatest([
        this.augmentService.get(),
        this.hero$
      ]).pipe(
        map(([augments, hero]) => {
          return augments?.filter(augment => augment.heroId == hero?.id) ?? [];
        }),
        shareReplay(1));

    this.selectedSlot.subscribe(slot => {
      this.selectedCategory.next(slot > 0 ? this.augmentSlots[slot]?.augmentCategory : AugmentSlotCategory.NONE);
      this.slotCategory$?.next(slot > 0 ? this.augmentSlots[slot]?.augmentCategory : AugmentSlotCategory.NONE)
    });

    this.skillAugments$ = this.selectedCategory.pipe(
      tap(() => console.log("skill augs refreshed")),
      withLatestFrom(this.heroAugments$),
      map(([categoryId, heroAugments]) => {
        if (!heroAugments || !categoryId ||
          ![AugmentSlotCategory.COMBAT, AugmentSlotCategory.UTILITY, , AugmentSlotCategory.ULTIMATE].includes(categoryId!))
          return [];
        return heroAugments.filter(augment => augment.augmentCategoryId == categoryId);
      })
    );

    this.groupedAugments$ = this.skillAugments$.pipe(
      map(augments =>
        augments.reduce((aggregate: Map<number, Augment[]>, augment: Augment) => {
          aggregate = aggregate || new Map<number, Augment[]>();
          aggregate.set(augment.abilityTypeId, aggregate.get(augment.abilityTypeId) || []);
          aggregate.get(augment.abilityTypeId)!.push(augment);
          return aggregate;
        }, new Map<number, Augment[]>()))
    );
  }

  setCategory(event: Event, id: AugmentSlotCategory) {
    event.stopPropagation();
    this.selectedCategory.next(id);
  }

  setSelected(event: Event, id: number) {
    event.stopPropagation();
    this.selectedSlot.next(id);
  }

  getAbilityType(id: number): Observable<Category | undefined> {
    return this.abilityTypeService.get()
      .pipe(
        map(types => types.find(x => x.id == id))
      )
  }
}