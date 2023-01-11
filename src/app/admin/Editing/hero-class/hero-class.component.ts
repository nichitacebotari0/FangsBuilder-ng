import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Category } from 'src/app/Models/Category';
import { HeroTypeService } from 'src/app/Services/hero-type.service';
import { OauthService } from 'src/app/Services/oauth.service';

@Component({
  selector: 'app-hero-class',
  templateUrl: './hero-class.component.html',
  styleUrls: ['./hero-class.component.less']
})
export class HeroClassComponent implements OnInit {

  constructor(private abilityTypeService: HeroTypeService,
    private oauthService: OauthService) { }

  ngOnInit(): void {
    this.heroClasses$ = this.abilityTypeService.get();
  }
  heroClasses$: Observable<Category[]> | undefined;
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
    this.abilityTypeService.delete(abilityType.id)
      .subscribe(_ => this.abilityTypeService.refetch()); // this http request can be avoided
  }

  submit() {
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

  public get isSuper(): boolean {
    return this.oauthService.issuper();
  }
}
