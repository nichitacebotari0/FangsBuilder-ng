import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, RequiredValidator, Validators } from '@angular/forms';
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
    this.abilityTypes = this.abilityTypeService.getMockAbilityTypes();
  }
  abilityTypes: Category[] = [];
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

  submitAbilityType() {
    let model = this.getModelFromForm();
    if (this.editId > -1)
    {
      this.abilityTypeService.editMockAbilityType(this.editId, model);
      this.editId = model.id;
      return;
    }
    this.abilityTypeService.addMockAbilityType(model);
  }

  getModelFromForm(): Category {
    return new Category(
      this.abilityTypeForm.value.id!,
      this.abilityTypeForm.value.name!
    );
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
