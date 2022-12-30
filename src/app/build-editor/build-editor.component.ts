import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Params, Router } from '@angular/router';
import { BehaviorSubject, combineLatest, forkJoin, map, mergeAll, Observable, of, shareReplay, take, tap, timeout, withLatestFrom, } from 'rxjs';
import { Active } from '../Models/Active';
import { Artifact } from '../Models/Artifact';
import { Augment } from '../Models/Augment';
import { AugmentSlot, GenericAugmentData } from '../Models/AugmentSlot';
import { Category } from '../Models/Category';
import { AugmentSlotCategory } from '../Models/Enum/AugmentSlotCategory';
import { Hero } from '../Models/Hero';
import { AbilityTypeService } from '../Services/ability-type.service';
import { ActiveService } from '../Services/active.service';
import { ArtifactTypeService } from '../Services/artifact-type.service';
import { ArtifactService } from '../Services/artifact.service';
import { AugmentService } from '../Services/augment.service';
import { OauthService } from '../Services/oauth.service';
import { BuildSerializerService } from '../Services/Utils/build-serializer.service';

@Component({
  selector: 'app-build-editor',
  templateUrl: './build-editor.component.html',
  styleUrls: ['./build-editor.component.less']
})
export class BuildEditorComponent implements OnInit {
  readonly AugmentSlotCategoryEnum = AugmentSlotCategory;
  augmentSlots: AugmentSlot[] = [
    { augmentData: undefined, currentlySlottedCategory: AugmentSlotCategory.NONE, slotAugmentCategory: AugmentSlotCategory.POSITIONAL },
    { augmentData: undefined, currentlySlottedCategory: AugmentSlotCategory.NONE, slotAugmentCategory: AugmentSlotCategory.COMBAT },
    { augmentData: undefined, currentlySlottedCategory: AugmentSlotCategory.NONE, slotAugmentCategory: AugmentSlotCategory.UTILITY },
    { augmentData: undefined, currentlySlottedCategory: AugmentSlotCategory.NONE, slotAugmentCategory: AugmentSlotCategory.FLEX },
    { augmentData: undefined, currentlySlottedCategory: AugmentSlotCategory.NONE, slotAugmentCategory: AugmentSlotCategory.ULTIMATE },
    { augmentData: undefined, currentlySlottedCategory: AugmentSlotCategory.NONE, slotAugmentCategory: AugmentSlotCategory.ACTIVE },
    { augmentData: undefined, currentlySlottedCategory: AugmentSlotCategory.NONE, slotAugmentCategory: AugmentSlotCategory.FLEX },
    { augmentData: undefined, currentlySlottedCategory: AugmentSlotCategory.NONE, slotAugmentCategory: AugmentSlotCategory.FLEX },
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
  showForm: Boolean = false;

  constructor(private augmentService: AugmentService,
    private abilityTypeService: AbilityTypeService,
    private artifactService: ArtifactService,
    private artifactTypeService: ArtifactTypeService,
    boonService: ActiveService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private buildSerializerService: BuildSerializerService,
    private oauthService: OauthService) {
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
    this.decodeBuild();

    this.heroAugments$ = this.hero$.pipe(
      map(hero => {
        if (hero?.id === null)
          return [];
        return this.augmentService.get(hero!.id);
      }),
      mergeAll(),
      shareReplay(1),
    );

    this.selectedSlot.subscribe(slot => {
      this.selectedCategory.next(slot > -1 ? this.augmentSlots[slot]?.slotAugmentCategory : AugmentSlotCategory.NONE);
      this.slotCategory$?.next(slot > -1 ? this.augmentSlots[slot]?.slotAugmentCategory : AugmentSlotCategory.NONE)
    });

    this.skillAugments$ = this.selectedCategory.pipe(
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
          aggregate.set(augment.abilityTypeId, aggregate.get(augment.abilityTypeId) || []);
          aggregate.get(augment.abilityTypeId)!.push(augment);
          return aggregate;
        }, new Map<number, Augment[]>()))
    );
  }

  get isLoggedIn(): boolean {
    return this.oauthService.isLoggedIn();
  }

  setCategory(event: Event, id: AugmentSlotCategory) {
    event.stopPropagation();
    this.selectedCategory.next(id);
  }

  setSelected(event: Event, id: number) {
    event.stopPropagation();
    this.selectedSlot.next(id);
  }

  getArtifactType(id: number): Observable<Category | undefined> {
    return this.artifactTypeService.get()
      .pipe(
        map(types => types.find(x => x.id == id))
      )
  }

  getAbilityType(id: number): Observable<Category | undefined> {
    return this.abilityTypeService.get()
      .pipe(
        map(types => types.find(x => x.id == id))
      )
  }

  selectAugment(event: Event, augmentData: GenericAugmentData, type: AugmentSlotCategory) {
    const alreadySelected = this.augmentSlots.findIndex(x => x.currentlySlottedCategory == type && x.augmentData?.id == augmentData.id);
    if (alreadySelected > -1) {
      this.setSelected(event, alreadySelected);
      return;
    }

    event.stopPropagation();
    const slot = this.augmentSlots[this.selectedSlot.value];
    if (slot) {
      slot.augmentData = augmentData;
      slot.currentlySlottedCategory = type;
      this.encodeBuild();
    }
  }

  encodeBuild() {
    const encoded: string = this.buildSerializerService.Serialize(this.augmentSlots);
    const queryParams: Params = { build: encoded }
    this.router.navigate(
      [],
      {
        relativeTo: this.activatedRoute,
        queryParams: queryParams,
        queryParamsHandling: 'merge'
      }
    )
  }

  decodeBuild() {
    const url: URL = new URL(window.location.href);
    const params: URLSearchParams = url.searchParams;
    const build = params.get('build');
    if (build) {
      const decoded =
        this.hero$.pipe(
          map(hero => {
            if (hero?.id === null)
              return [];
            return forkJoin(this.buildSerializerService.Deserialize(hero!.id, build).map(x => x.pipe(take(1))))
          }),
          mergeAll(),
        );
      decoded.subscribe(
        augments => augments.forEach((aug, i) => {
          if (!aug)
            return;
          this.augmentSlots[i].augmentData = aug.augment
          this.augmentSlots[i].currentlySlottedCategory = aug.category
        })
      );
    }
  }

  ngOnDestroy() {
    this.selectedSlot.unsubscribe();
  }
}