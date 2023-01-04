import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { NextObserver, Observable, of, Subscription } from 'rxjs';
import { AugmentSlot } from '../../Models/AugmentSlot';
import { Build } from '../../Models/Build';
import { Hero } from '../../Models/Hero';
import { BuildService } from '../../Services/build.service';
import { BuildSerializerService } from '../../Services/Utils/build-serializer.service';

@Component({
  selector: 'app-build-form',
  templateUrl: './build-form.component.html',
  styleUrls: ['./build-form.component.less']
})
export class BuildFormComponent implements OnInit, OnDestroy {

  @Input() hero$: Observable<Hero | undefined> = of(undefined);
  @Input() augments: AugmentSlot[] | undefined;
  heroSubscription: Subscription | undefined;
  heroId: number = 0;
  successMsg: string | undefined;
  errorMsg: string | undefined;
  editId: number = -1;
  @Output() editIdEvent = new EventEmitter<number>();
  constructor(private buildService: BuildService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private buildSerializerService: BuildSerializerService) { }

  ngOnInit(): void {
    this.heroSubscription = this.hero$.subscribe(x => {
      if (x)
        this.heroId = x.id
    });

    const url: URL = new URL(window.location.href);
    const params: URLSearchParams = url.searchParams;
    this.setEditId(Number(params.get('editId') ?? -1));
    if (this.editId > -1) {
      this.errorMsg = "Loading build details for editing..."
      this.form.disable();
      this.buildService.getMyBuilds()
        .subscribe(x => {
          let build = x.find(build => build.id == this.editId);
          this.form.setValue({
            title: build?.title ?? "",
            description: build?.description ?? "",
          });
          this.form.enable();
          this.errorMsg = "";
        })
    }
  }

  form = new FormGroup({
    title: new FormControl('', [
      Validators.required
    ]),
    description: new FormControl('', [])
  })

  setEditId(id: number) {
    this.editId = id;
    this.editIdEvent.emit(this.editId);
  }


  submit() {
    this.successMsg = "";
    this.errorMsg = "";

    const encoded = this.buildSerializerService.Serialize(this.augments!);
    if (!this.augments || this.augments.filter(x => x.augmentData).length < 5) {
      this.errorMsg = "need to have at least 5 augments defined in the build to save";
      return;
    }

    var build: Build = {
      id: 0,
      heroId: this.heroId,
      title: this.form.value.title!,
      description: this.form.value.description,
      augments: encoded,
      // stuff we do not fill
      createdAt: new Date(),
      modifiedAt: new Date(),
      userId: '',
      upvotes: 0,
      downvotes: 0,
    }

    const resultObserver: NextObserver<Build> = {
      next: x => {
        this.successMsg = "Success";
        if (this.editId > 0)
          return;
        // redirect to editing
        const queryParams: Params = { ...this.activatedRoute.snapshot.queryParams, editId: x.id };
        this.setEditId(x.id);
        this.router.navigate(
          [],
          {
            relativeTo: this.activatedRoute,
            queryParams: queryParams,
            queryParamsHandling: 'merge'
          }
        )
      },
      error: err => { this.errorMsg = "Something went wrong:" + err.errors.join(' ; ') ?? err }
    }
    if (this.editId > -1) {
      build.id = this.editId;
      this.buildService.update(this.editId, build)
        .subscribe(resultObserver)
      return;
    }
    this.buildService.add(build)
      .subscribe(resultObserver)
  }

  ngOnDestroy(): void {
    this.heroSubscription?.unsubscribe();
  }
}
