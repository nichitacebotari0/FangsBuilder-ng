import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { mergeMap, Observable } from 'rxjs';
import { Active } from 'src/app/Models/Active';
import { Patch } from 'src/app/Models/Patch';
import { ActiveService } from 'src/app/Services/active.service';
import { OauthService } from 'src/app/Services/oauth.service';
import { PatchService } from 'src/app/Services/patch.service';
import { StaticAssetsService } from 'src/app/Services/static-assets.service';

@Component({
  selector: 'app-active',
  templateUrl: './active.component.html',
  styleUrls: ['./active.component.less']
})
export class ActiveComponent implements OnInit {
  constructor(private activeService: ActiveService,
    private patchService: PatchService,
    private staticAssetService: StaticAssetsService,
    private oauthService: OauthService) {
  }

  ngOnInit(): void {
    this.boons$ = this.form.get("patchId")!.valueChanges.pipe(
      mergeMap(patchId => {
        if (patchId == null)
          return [];
        return this.activeService.get(patchId);
      })
    );
    this.patches$ = this.patchService.get();
    this.boonAssets$ = this.staticAssetService.getBoons();

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
  boonAssets$: Observable<string[]> | undefined;
  boons$: Observable<Active[]> | undefined;
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
    ])
  });

  delete(input: Active) {
    this.activeService.delete(input.id, this.form.value.patchId!)
      .subscribe(_ => this.activeService.refetch(this.form.value.patchId!));
  }

  submit() {
    let model = this.getModelFromForm();
    if (this.editId > -1) {
      this.activeService.update(model)
        .subscribe(_ => this.activeService.refetch(this.form.value.patchId!));
      this.editId = model.id;
      return;
    }
    this.activeService.add(model)
      .subscribe(_ => this.activeService.refetch(this.form.value.patchId!));
  }

  getModelFromForm(): Active {
    return {
      id: this.form.value.id!,
      name: this.form.value.name!,
      imagePath: this.form.value.imagePath!,
      description: this.form.value.description!,
      patchId: this.form.value.patchId!
    };
  }

  edit(input: Active) {
    this.editId = input.id;
    this.form.setValue({
      id: input.id,
      name: input.name,
      description: input.description,
      imagePath: input.imagePath,
      patchId: this.form.value.patchId ?? input.patchId
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
