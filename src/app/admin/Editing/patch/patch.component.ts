import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { mergeMap, Observable, ReplaySubject } from 'rxjs';
import { Patch } from 'src/app/Models/Patch';
import { OauthService } from 'src/app/Services/oauth.service';
import { PatchService } from 'src/app/Services/patch.service';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-patch',
  templateUrl: './patch.component.html',
  styleUrls: ['./patch.component.less']
})
export class PatchComponent implements OnInit {
  constructor(private patchService: PatchService,
    private changeDetectorRef: ChangeDetectorRef,
    private oauthService: OauthService) {
    this.patches$ = this.fetchSignal.pipe(
      mergeMap(_ => this.patchService.get()),
    );
  }

  ngOnInit(): void {
    this.fetchSignal.next();
  }
  fetchSignal: ReplaySubject<void> = new ReplaySubject();
  patches$: Observable<Patch[]>;
  editId: number = -1;
  activate: boolean = false;

  websiteActivationTime: FormControl = new FormControl<Date | undefined>(undefined, []);
  form = new FormGroup<{
    title: FormControl<string | null>,
    version: FormControl<string | null>,
    gameDate: FormControl<Date | null | undefined>,
    websiteTimeUtc?: FormControl<Date | null | undefined>
  }>
    ({
      title: new FormControl('', []),
      version: new FormControl('', [
        Validators.required
      ]),
      gameDate: new FormControl<Date | undefined>(undefined, [
        Validators.required
      ])
    });

  toggleWebsiteDate(event: Event) {
    if (this.form.contains('websiteTimeUtc'))
      this.form.removeControl("websiteTimeUtc")
    else
      this.form.addControl("websiteTimeUtc", new FormControl<Date | undefined>(undefined, []));

    this.form.updateValueAndValidity();
    this.changeDetectorRef.detectChanges();
  }

  delete(input: Patch) {
    this.patchService.delete(input.id)
      .subscribe(_ => this.fetchSignal.next());
  }

  submit() {
    let model = this.getModelFromForm();
    if (this.editId > -1) {
      this.patchService.update(this.editId, model)
        .subscribe(_ => this.fetchSignal.next());
      this.editId = model.id;
      return;
    }
    this.patchService.add(model)
      .subscribe(_ => this.fetchSignal.next());
  }

  getModelFromForm(): Patch {
    return {
      id: this.editId > 0 ? this.editId : 0,
      title: this.form.value.title ?? '',
      version: this.form.value.version!,
      gameDate: this.form.value.gameDate!,
      websiteTimeUtc: this.form.value.websiteTimeUtc ?? undefined
    };
  }

  edit(input: Patch) {
    this.editId = input.id;
    let val: any = {
      title: input.title,
      gameDate: new Date(input.gameDate),
      version: input.version,
    };
    if (input.websiteTimeUtc) {
      val = {
        ...val,
        websiteTimeUtc: new Date(input.websiteTimeUtc),
      };
      this.form.addControl("websiteTimeUtc", new FormControl<Date | undefined>(undefined, []));
      this.activate = true;
    }
    else {
      this.activate = false;
      this.form.removeControl("websiteTimeUtc");
    }
    this.form.setValue(val);
  }

  stopEditing() {
    this.editId = -1;
    this.form.reset();
  }

  public get isSuper(): boolean {
    return this.oauthService.issuper();
  }
}
