import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { mergeMap, Observable } from 'rxjs';
import { Artifact } from 'src/app/Models/Artifact';
import { Category } from 'src/app/Models/Category';
import { Patch } from 'src/app/Models/Patch';
import { ArtifactTypeService } from 'src/app/Services/artifact-type.service';
import { ArtifactService } from 'src/app/Services/artifact.service';
import { OauthService } from 'src/app/Services/oauth.service';
import { PatchService } from 'src/app/Services/patch.service';
import { StaticAssetsService } from 'src/app/Services/static-assets.service';

@Component({
  selector: 'app-artifact',
  templateUrl: './artifact.component.html',
  styleUrls: ['./artifact.component.less']
})
export class ArtifactComponent implements OnInit {
  constructor(private artifactService: ArtifactService,
    private patchService: PatchService,
    private artifactTypeService: ArtifactTypeService,
    private staticAssetService: StaticAssetsService,
    private oauthService: OauthService) {
  }

  ngOnInit(): void {
    this.artifacts$ = this.form.get("patchId")!.valueChanges.pipe(
      mergeMap(patchId => {
        if (patchId == null)
          return [];
        return this.artifactService.get(patchId);
      }),
    );
    this.patches$ = this.patchService.get();
    this.artifactTypes$ = this.artifactTypeService.get();
    this.artifactAssets$ = this.staticAssetService.getArtifacts();

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
  patches$: Observable<Patch[]> | undefined;
  artifactAssets$: Observable<string[]> | undefined;
  artifacts$: Observable<Artifact[]> | undefined;
  artifactTypes$: Observable<Category[]> | undefined;
  editId: number = -1;

  form = new FormGroup({
    id: new FormControl<number | null>(0, [
      Validators.required,
      Validators.min(0)
    ]),
    patchId: new FormControl<number | null>(null, [
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
    artifactType: new FormControl<number | null>(null, [
      Validators.required
    ])
  });

  delete(input: Artifact) {
    this.artifactService.delete(input.id, this.form.value.patchId!)
      .subscribe(_ => this.artifactService.refetch(this.form.value.patchId!));
  }

  submit() {
    let model = this.getModelFromForm();
    if (this.editId > -1) {
      this.artifactService.update(model)
        .subscribe(_ => this.artifactService.refetch(this.form.value.patchId!));
      this.editId = model.id;
      return;
    }
    this.artifactService.add(model)
      .subscribe(_ => this.artifactService.refetch(this.form.value.patchId!));
  }

  getModelFromForm(): Artifact {
    return {
      id: this.form.value.id!,
      patchId: this.form.value.patchId!,
      name: this.form.value.name!,
      imagePath: this.form.value.imagePath!,
      artifactTypeId: this.form.value.artifactType!,
      description: this.form.value.description!
    };
  }

  edit(input: Artifact) {
    this.editId = input.id;
    this.form.setValue({
      id: input.id,
      name: input.name,
      imagePath: input.imagePath,
      artifactType: input.artifactTypeId,
      description: input.description,
      patchId: this.form.value.patchId ?? input.patchId,
    });
  }

  stopEditing() {
    this.editId = -1;
    this.form.reset();
  }

  public get isSuper(): boolean {
    return this.oauthService.issuper();
  }
}
