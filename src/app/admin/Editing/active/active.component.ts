import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Active } from 'src/app/Models/Active';
import { ActiveService } from 'src/app/Services/active.service';
import { OauthService } from 'src/app/Services/oauth.service';
import { StaticAssetsService } from 'src/app/Services/static-assets.service';

@Component({
  selector: 'app-active',
  templateUrl: './active.component.html',
  styleUrls: ['./active.component.less']
})
export class ActiveComponent implements OnInit {
  constructor(private artifactService: ActiveService,
    private staticAssetService: StaticAssetsService,
    private oauthService: OauthService) {
  }

  ngOnInit(): void {
    this.boons$ = this.artifactService.get();
    this.boonAssets$ = this.staticAssetService.getBoons();

    this.form.get("imagePath")?.valueChanges.subscribe(data => {
      let str: string[] | undefined = data?.split("\\");
      if (!str)
        return;
      let fullname: string[] = str[str.length - 1].split(".")[0].split(" ");
      let id = Number(fullname[0]);
      let name = fullname.slice(1, fullname.length).join(" ");
      this.form.patchValue({ id: id, name: name });
    });
  }
  boonAssets$: Observable<string[]> | undefined;
  boons$: Observable<Active[]> | undefined;
  editId: number = -1;

  form = new FormGroup({
    id: new FormControl<number | null>(null, [
      Validators.required,
      Validators.min(0)
    ]),
    name: new FormControl('', [
      Validators.required
    ]),
    imagePath: new FormControl('', [
      Validators.required
    ]),
    description: new FormControl('', [
      Validators.required
    ])
  });

  delete(input: Active) {
    this.artifactService.delete(input.id)
      .subscribe(_ => this.artifactService.refetch()); // this http request can be avoided
  }

  submit() {
    let model = this.getModelFromForm();
    if (this.editId > -1) {
      this.artifactService.update(this.editId, model)
        .subscribe(_ => this.artifactService.refetch()); // this http request can be avoided
      this.editId = model.id;
      return;
    }
    this.artifactService.add(model)
      .subscribe(_ => this.artifactService.refetch()); // this http request can be avoided
  }

  getModelFromForm(): Active {
    return {
      id: this.form.value.id!,
      name: this.form.value.name!,
      imagePath: this.form.value.imagePath!,
      description: this.form.value.description!
    };
  }

  edit(input: Active) {
    this.editId = input.id;
    this.form.setValue({
      id: input.id,
      name: input.name,
      description: input.description,
      imagePath: input.imagePath
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
