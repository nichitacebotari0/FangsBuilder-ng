import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { BehaviorSubject, combineLatest, combineLatestWith, forkJoin, map, mergeAll, mergeMap, Observable, of, shareReplay, take, tap, } from 'rxjs';
import { Active } from '../Models/Active';
import { Artifact } from '../Models/Artifact';
import { Augment } from '../Models/Augment';
import { AugmentSlot, GenericAugmentData } from '../Models/AugmentSlot';
import { Category } from '../Models/Category';
import { AugmentSlotCategory } from '../Models/Enum/AugmentSlotCategory';
import { Hero } from '../Models/Hero';
import { Patch } from '../Models/Patch';
import { AbilityTypeService } from '../Services/ability-type.service';
import { ActiveService } from '../Services/active.service';
import { ArtifactTypeService } from '../Services/artifact-type.service';
import { ArtifactService } from '../Services/artifact.service';
import { AugmentService } from '../Services/augment.service';
import { HeroService } from '../Services/hero.service';
import { OauthService } from '../Services/oauth.service';
import { PatchService } from '../Services/patch.service';
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
  hero$: Observable<Hero | undefined> = of(undefined);
  selectedSlot = new BehaviorSubject<number>(0);
  selectedCategory = new BehaviorSubject<AugmentSlotCategory>(AugmentSlotCategory.NONE);
  slotCategory$ = new BehaviorSubject<AugmentSlotCategory>(AugmentSlotCategory.NONE);
  heroAugments$: Observable<Augment[]> | undefined;
  skillAugments$: Observable<Augment[]> | undefined;
  groupedAugments$: Observable<Map<number, Augment[]>> | undefined;
  boons$: Observable<Active[]>;
  latestActivePatch$: Observable<Patch>;
  groupedArtifacts$: Observable<Map<number, Artifact[]>>;
  showForm: Boolean = false;
  hasCopied: Boolean = false;
  editId: number = -1;

  constructor(private augmentService: AugmentService,
    private abilityTypeService: AbilityTypeService,
    private artifactService: ArtifactService,
    private artifactTypeService: ArtifactTypeService,
    private heroesService: HeroService,
    boonService: ActiveService,
    patchService: PatchService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private buildSerializerService: BuildSerializerService,
    private oauthService: OauthService) {
    this.latestActivePatch$ = patchService.getLatestActive();
    this.boons$ = this.latestActivePatch$.pipe(
      mergeMap(x => boonService.get(x.id))
    );

    this.hero$ =
      combineLatest([
        this.activatedRoute.paramMap,
        this.heroesService.get()])
        .pipe(
          map(([paramMap, heroes]) => {
            let id = paramMap.get("id");
            if (!id)
              return undefined;
            return heroes?.find(hero => hero.id == Number(id));
          }));

    this.groupedArtifacts$ = this.latestActivePatch$.pipe(
      mergeMap(x => this.artifactService.get(x.id)),
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
    const url: URL = new URL(window.location.href);
    const params: URLSearchParams = url.searchParams;
    const editParam = Number(params.get('editId') ?? -1);
    if (editParam > 0)
      this.setEditId(editParam);

    this.decodeBuild();

    this.heroAugments$ = combineLatest([
      this.hero$,
      this.latestActivePatch$
    ]).pipe(
      map(([hero, patch]) => {
        if (hero?.id === null)
          return [];
        return this.augmentService.get(hero!.id, patch.id);
      }),
      mergeAll(),
      shareReplay(1),
    );

    this.selectedSlot.subscribe(slot => {
      this.selectedCategory.next(slot > -1 ? this.augmentSlots[slot]?.slotAugmentCategory : AugmentSlotCategory.NONE);
      this.slotCategory$?.next(slot > -1 ? this.augmentSlots[slot]?.slotAugmentCategory : AugmentSlotCategory.NONE)
    });

    this.skillAugments$ = this.selectedCategory.pipe(
      combineLatestWith(this.heroAugments$),
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
      const decoded = combineLatest([
        this.hero$,
        this.latestActivePatch$
      ]).pipe(
        tap(() => {
        }),
        map(([hero, patch]) => {
          if (hero?.id === null)
            return [];
          return forkJoin(this.buildSerializerService.Deserialize(hero!.id, patch.id, build).map(x => x.pipe(take(1))))
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

  async shareBuild() {
    const url: URL = new URL(window.location.href);
    const params: URLSearchParams = url.searchParams;
    const build = params.get('build');
    const data = {
      url: url.origin + url.pathname + "?build=" + build
    }
    if (navigator.canShare && navigator?.canShare(data)) {
      await navigator.share(data);
    }
    else {
      await navigator.clipboard.writeText(data.url);
      this.hasCopied = true;
      setTimeout(() => { this.hasCopied = false }, 1000)
    }
  }

  openForm() {
    this.showForm = true;
    setTimeout(() =>
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth"
      }), 200);
  }

  setEditId(id: number) {
    this.editId = id;
    if (this.editId > 0) {
      this.openForm()
    }
  }

  ngOnDestroy() {
    this.selectedSlot.unsubscribe();
  }
}