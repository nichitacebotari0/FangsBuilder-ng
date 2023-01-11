import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, RequiredValidator, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Category } from 'src/app/Models/Category';
import { AbilityTypeService } from 'src/app/Services/ability-type.service';

@Component({
  selector: 'app-ability-type',
  templateUrl: './ability-type.component.html',
  styleUrls: ['./ability-type.component.less']
})
export class AbilityTypeComponent implements OnInit {

  constructor(private abilityTypeService: AbilityTypeService) { }

  ngOnInit(): void {
    this.abilityTypes$ = this.abilityTypeService.get();
  }
  abilityTypes$: Observable<Category[]> | undefined;
  editId: number = -1;


  abilityTypeForm = new FormGroup({
    id: new FormControl<number | null>(null, [
      Validators.required,
      Validators.min(1)
    ]),
    name: new FormControl('', [
      Validators.required
    ])
  });

  deleteAbilityType(abilityType: Category) {
    this.abilityTypeService.delete(abilityType.id)
      .subscribe(_ => this.abilityTypeService.refetch()); // this http request can be avoided

  }

  submitAbilityType() {
    let model = this.getModelFromForm();
    if (this.editId > -1) {
      this.abilityTypeService.update(this.editId, model)
        .subscribe(_ => this.abilityTypeService.refetch()); // this http request can be avoided
      this.editId = model.id;
      return;
    }
    this.abilityTypeService.add(model)
      .subscribe(_ => this.abilityTypeService.refetch()); // this http request can be avoided
  }

  getModelFromForm(): Category {
    return {
      id: this.abilityTypeForm.value.id!,
      name: this.abilityTypeForm.value.name!
    };
  }

  editAbility(input: Category) {
    this.editId = input.id;
    this.abilityTypeForm.setValue({
      id: input.id,
      name: input.name
    });
  }

  stopEditing() {
    this.editId = -1;
    this.abilityTypeForm.reset();
  }
}
