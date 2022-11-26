import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Augment } from 'src/app/Models/Augment';
import { Category } from 'src/app/Models/Category';
import { Hero } from 'src/app/Models/Hero';
import { AbilityTypeService } from 'src/app/Services/ability-type.service';
import { AugmentCategoryService } from 'src/app/Services/augment-category.service';
import { AugmentService } from 'src/app/Services/augment.service';
import { HeroService } from 'src/app/Services/hero.service';

@Component({
  selector: 'app-augment',
  templateUrl: './augment.component.html',
  styleUrls: ['./augment.component.less']
})
export class AugmentComponent implements OnInit {

  constructor(private augmentService: AugmentService,
    private heroService: HeroService,
    private augmentCategoryService: AugmentCategoryService,
    private abilityTypeService: AbilityTypeService) { }

  ngOnInit(): void {
    this.augments$ = this.augmentService.get();
    this.heroes$ = this.heroService.get();
    this.augmentCategories$ = this.augmentCategoryService.get();
    this.abilityTypes$ = this.abilityTypeService.get();
    
  }
  augments$: Observable<Augment[]> | undefined;
  heroes$: Observable<Hero[]> | undefined;
  augmentCategories$: Observable<Category[]> | undefined;
  abilityTypes$: Observable<Category[]> | undefined;
  editId: number = -1;

  form = new FormGroup({
    id: new FormControl<number | null>(null, [
      Validators.required,
      Validators.min(1)
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
    heroId: new FormControl<number | null>(null, [
      Validators.required
    ]),
    augmentCategoryId: new FormControl<number | null>(null, [
      Validators.required
    ]),
    abilityTypeId: new FormControl<number | null>(null, [
      Validators.required
    ]),
  });

  delete(input: Augment) {
    this.augmentService.delete(input.id)
      .subscribe(_ => this.augmentService.refetch()); // this http request can be avoided
  }

  submit() {
    let model = this.getModelFromForm();
    if (this.editId > -1) {
      this.augmentService.update(this.editId, model)
        .subscribe(_ => this.augmentService.refetch()); // this http request can be avoided
      this.editId = model.id;
      return;
    }
    this.augmentService.add(model)
      .subscribe(_ => this.augmentService.refetch()); // this http request can be avoided
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
}