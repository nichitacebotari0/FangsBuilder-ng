import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Category } from 'src/app/Models/Category';
import { AugmentCategoryService } from 'src/app/Services/augment-category.service';

@Component({
  selector: 'app-augment-category',
  templateUrl: './augment-category.component.html',
  styleUrls: ['./augment-category.component.less']
})
export class AugmentCategoryComponent implements OnInit {

  constructor(private augmentCategoryService: AugmentCategoryService) { }

  ngOnInit(): void {
    this.augmentCategories$ = this.augmentCategoryService.get();
  }
  augmentCategories$: Observable<Category[]> | undefined;
  editId: number = -1;

  heroClassForm = new FormGroup({
    id: new FormControl<number | null>(null, [
      Validators.required,
      Validators.min(1)
    ]),
    name: new FormControl('', [
      Validators.required
    ])
  });

  delete(abilityType: Category) {
    this.augmentCategoryService.delete(abilityType.id)
      .subscribe(_ => this.augmentCategoryService.refetch()); // this http request can be avoided
  }

  submit() {
    let model = this.getModelFromForm();
    if (this.editId > -1) {
      this.augmentCategoryService.update(this.editId, model)
        .subscribe(_ => this.augmentCategoryService.refetch()); // this http request can be avoided
      this.editId = model.id;
      return;
    }
    this.augmentCategoryService.add(model)
      .subscribe(_ => this.augmentCategoryService.refetch()); // this http request can be avoided
  }

  getModelFromForm(): Category {
    return {
      id: this.heroClassForm.value.id!,
      name: this.heroClassForm.value.name!
    };
  }

  edit(input: Category) {
    this.editId = input.id;
    this.heroClassForm.setValue({
      id: input.id,
      name: input.name
    });
  }

  stopEditing() {
    this.editId = -1;
    this.heroClassForm.reset();
  }
}
