import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { mergeMap, Observable, ReplaySubject, tap } from 'rxjs';
import { AugmentArrangement, AugmentArrangementSlot } from 'src/app/Models/AugmentArrangement';
import { Patch } from 'src/app/Models/Patch';
import { Category } from 'src/app/Models/Category';
import { AugmentArrangementService } from 'src/app/Services/augment-arrangement.service';
import { AugmentCategoryService } from 'src/app/Services/augment-category.service';
import { OauthService } from 'src/app/Services/oauth.service';
import { PatchService } from 'src/app/Services/patch.service';

@Component({
  selector: 'app-augment-arrangement',
  templateUrl: './augment-arrangement.component.html',
  styleUrls: ['./augment-arrangement.component.less']
})
export class AugmentArrangementComponent implements OnInit {
  constructor(private arrangementService: AugmentArrangementService,
    patchService: PatchService,
    augmentCategoryService: AugmentCategoryService,
    private oauthService: OauthService) {
    this.arrangements$ = this.fetchSignal.pipe(
      mergeMap(_ => arrangementService.get()),
      tap(x => x.forEach(arr => arr.augmentSlots.sort(slot => slot.sortOrder))),
    );
    this.patches$ = patchService.get();
    augmentCategoryService.get().subscribe(x => this.categories = x);
  }

  ngOnInit(): void {
    this.fetchSignal.next();
  }
  fetchSignal: ReplaySubject<void> = new ReplaySubject();
  arrangements$: Observable<AugmentArrangement[]>;
  patches$: Observable<Patch[]>;
  categories: Category[] | undefined;
  editId: number = -1;
  activate: boolean = false;

  websiteActivationTime: FormControl = new FormControl<Date | undefined>(undefined, []);
  form = new FormGroup({
    patchId: new FormControl<number | null>(null, [
      Validators.required,
      Validators.min(0)
    ])
  });
  arrangementSlots: AugmentArrangementSlot[] = [];

  removeLastSlot() {
    this.arrangementSlots.pop();
  }

  addSlot() {
    this.arrangementSlots.push({
      id: 0,
      sortOrder: 0,
      augmentCategoryId: 1,
      augmentArrangementId: 0,
    });
  }

  editSlot(index: number, category: string) {
    var categoryId = Number(category);
    this.arrangementSlots[index].augmentCategoryId = categoryId;
  }

  delete(input: AugmentArrangement) {
    this.arrangementService.delete(input.id)
      .subscribe(_ => this.fetchSignal.next());
  }

  getCategoryName(id: number): string | undefined {
    return this.categories?.find(x => x.id == id)?.name;
  }

  submit() {
    let model = this.getModel();
    if (this.editId > -1) {
      this.arrangementService.update(this.editId, model)
        .subscribe(_ => this.fetchSignal.next());
      this.editId = model.id;
      return;
    }
    this.arrangementService.add(model)
      .subscribe(_ => this.fetchSignal.next());
  }

  getModel(): AugmentArrangement {
    return {
      id: this.editId > -1 ? this.editId : 0,
      patchId: this.form.value.patchId!,
      augmentSlots: this.arrangementSlots.slice()
    };
  }

  edit(input: AugmentArrangement) {
    this.editId = input.id;
    this.form.setValue({
      patchId: input.patchId
    });
    this.arrangementSlots = input.augmentSlots.slice();
  }

  stopEditing() {
    this.editId = -1;
    this.form.reset();
    this.arrangementSlots = [];
  }

  public get isSuper(): boolean {
    return this.oauthService.issuper();
  }
}
