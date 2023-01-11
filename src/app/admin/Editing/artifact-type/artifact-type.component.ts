import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Category } from 'src/app/Models/Category';
import { ArtifactTypeService } from 'src/app/Services/artifact-type.service';

@Component({
  selector: 'app-artifact-type',
  templateUrl: './artifact-type.component.html',
  styleUrls: ['./artifact-type.component.less']
})
export class ArtifactTypeComponent implements OnInit {

  constructor(private artifactTypeService: ArtifactTypeService) { }

  ngOnInit(): void {
    this.artifactTypes$ = this.artifactTypeService.get();
  }
  artifactTypes$: Observable<Category[]> | undefined;
  editId: number = -1;


  artifactTypeForm = new FormGroup({
    id: new FormControl<number | null>(null, [
      Validators.required,
      Validators.min(1)
    ]),
    name: new FormControl('', [
      Validators.required
    ])
  });

  deleteArtifactType(artifactType: Category) {
    this.artifactTypeService.delete(artifactType.id)
      .subscribe(_ => this.artifactTypeService.refetch()); // this http request can be avoided

  }

  submitArtifactType() {
    let model = this.getModelFromForm();
    if (this.editId > -1) {
      this.artifactTypeService.update(this.editId, model)
        .subscribe(_ => this.artifactTypeService.refetch()); // this http request can be avoided
      this.editId = model.id;
      return;
    }
    this.artifactTypeService.add(model)
      .subscribe(_ => this.artifactTypeService.refetch()); // this http request can be avoided
  }

  getModelFromForm(): Category {
    return {
      id: this.artifactTypeForm.value.id!,
      name: this.artifactTypeForm.value.name!
    };
  }

  editArtifact(input: Category) {
    this.editId = input.id;
    this.artifactTypeForm.setValue({
      id: input.id,
      name: input.name
    });
  }

  stopEditing() {
    this.editId = -1;
    this.artifactTypeForm.reset();
  }
}
