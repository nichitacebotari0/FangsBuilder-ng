import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { combineLatest, map, mergeAll, Observable, take, tap } from 'rxjs';
import { Augment } from 'src/app/Models/Augment';
import { Category } from 'src/app/Models/Category';
import { Hero } from 'src/app/Models/Hero';
import { Patch } from 'src/app/Models/Patch';
import { AbilityTypeService } from 'src/app/Services/ability-type.service';
import { AugmentCategoryService } from 'src/app/Services/augment-category.service';
import { AugmentService } from 'src/app/Services/augment.service';
import { HeroService } from 'src/app/Services/hero.service';
import { OauthService } from 'src/app/Services/oauth.service';
import { PatchService } from 'src/app/Services/patch.service';
import { StaticAssetsService } from 'src/app/Services/static-assets.service';
import { StyleService } from 'src/app/Services/Utils/style.service';

@Component({
  selector: 'app-augment',
  templateUrl: './augment.component.html',
  styleUrls: ['./augment.component.less']
})
export class AugmentComponent implements OnInit {

  constructor(private augmentService: AugmentService,
    private heroService: HeroService,
    private augmentCategoryService: AugmentCategoryService,
    private abilityTypeService: AbilityTypeService,
    private patchService: PatchService,
    private staticAssetService: StaticAssetsService,
    private styleService: StyleService,
    private oauthService: OauthService) {
  }

  ngOnInit(): void {
    this.heroes$ = this.heroService.get();
    this.augmentCategories$ = this.augmentCategoryService.get();
    this.abilityTypes$ = this.abilityTypeService.get();
    this.patches$ = this.patchService.get();

    this.heroImages$ = combineLatest([
      this.form.get("heroId")!.valueChanges,
      this.heroes$,
      this.staticAssetService.getHeroes()
    ]).pipe(
      map(([heroId, heroList, heroImages]) => {
        let hero = heroList.find(x => x.id == heroId);
        this.currentHeroImage = hero?.imagePath;
        let name = hero?.name;
        return heroImages?.find(x => x.Name == name)?.Augments;
      })
    );

    this.augments$ = combineLatest([
      this.form.get("heroId")!.valueChanges,
      this.form.get("patchId")!.valueChanges
    ]).pipe(
      map(([heroId, patchId]) => {
        if (heroId === null || patchId === null)
          return [];
        return this.augmentService.get(heroId, patchId);
      }),
      mergeAll()
    );

    this.form.get("imagePath")?.valueChanges.subscribe(data => {
      let str: string[] | undefined = data?.split("\\");
      if (!str)
        return;
      let fullname: string[] = str[str.length - 1].split(".")[0].split(" ");
      let id = this.editId > -1 ? this.editId : 0;
      let name = fullname.slice(1, fullname.length).join(" ");
      this.form.patchValue({ id: id, name: name });
    });
  }
  heroImages$: Observable<string[] | undefined> | undefined;
  augments$: Observable<Augment[]> | undefined;
  heroes$: Observable<Hero[]> | undefined;
  patches$: Observable<Patch[]> | undefined;
  augmentCategories$: Observable<Category[]> | undefined;
  abilityTypes$: Observable<Category[]> | undefined;
  currentHeroImage: string | undefined;
  editId: number = -1;

  form = new FormGroup({
    id: new FormControl<number | null>(0, [
      Validators.required,
      Validators.min(0)
    ]),
    heroId: new FormControl<number | null>(null, [
      Validators.required
    ]),
    patchId: new FormControl<number | null>(null, [
      Validators.required
    ]),
    augmentCategoryId: new FormControl<number | null>(null, [
      Validators.required
    ]),
    abilityTypeId: new FormControl<number | null>(null, [
      Validators.required
    ]),
    name: new FormControl('', [
      Validators.required
    ]),
    imagePath: new FormControl('', [
      Validators.required
    ]),
    description: new FormControl('', [
      Validators.required
    ]),
  });

  delete(input: Augment) {
    this.augmentService.delete(input.id, input.heroId, this.form.value.patchId!)
      .subscribe(_ => this.augmentService.refetch(this.form.value.heroId!, this.form.value.patchId!));
  }

  submit() {
    let model = this.getModelFromForm();
    if (this.editId > -1) {
      this.augmentService.update(model)
        .subscribe(_ => this.augmentService.refetch(this.form.value.heroId!, this.form.value.patchId!));
      this.editId = model.id;
      return;
    }
    this.augmentService.add(model)
      .subscribe(_ => this.augmentService.refetch(this.form.value.heroId!, this.form.value.patchId!));
  }

  getModelFromForm(): Augment {
    return {
      id: this.form.value.id!,
      name: this.form.value.name!,
      imagePath: this.form.value.imagePath!,
      description: this.form.value.description!,
      heroId: this.form.value.heroId!,
      augmentCategoryId: this.form.value.augmentCategoryId!,
      abilityTypeId: this.form.value.abilityTypeId!,
      patchId: this.form.value.patchId!
    };
  }

  edit(input: Augment) {
    this.editId = input.id;
    this.form.setValue({
      id: input.id,
      name: input.name,
      imagePath: input.imagePath,
      description: input.description,
      heroId: input.heroId,
      augmentCategoryId: input.augmentCategoryId,
      abilityTypeId: input.abilityTypeId,
      patchId: this.form.value.patchId ?? input.patchId,
    });
  }

  stopEditing() {
    this.editId = -1;
    this.form.reset();
  }

  getFormValidationErrors(form: FormGroup) {
    let result = Object.keys(form.controls).map(key => {
      const controlErrors: ValidationErrors | null | undefined = form.get(key)?.errors;
      if (controlErrors != null) {
        return Object.keys(controlErrors).map(keyError => {
          return ';Key control: ' + key + ', keyError: ' + keyError + ', err value: ' + controlErrors[keyError];
        });
      }
      return [];
    });
    return result;
  }

  getColorClass(augmentCategory: number): string {
    return "text-" + this.styleService.getColorForAugment(augmentCategory)
  }

  public get isSuper(): boolean {
    return this.oauthService.issuper();
  }
}