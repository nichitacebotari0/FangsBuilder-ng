import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NextObserver, Observable, Observer, of, Subscription } from 'rxjs';
import { AugmentSlot } from '../Models/AugmentSlot';
import { Build } from '../Models/Build';
import { Hero } from '../Models/Hero';
import { BuildService } from '../Services/build.service';
import { BuildSerializerService } from '../Services/Utils/build-serializer.service';

@Component({
  selector: 'app-build-form',
  templateUrl: './build-form.component.html',
  styleUrls: ['./build-form.component.less']
})
export class BuildFormComponent implements OnInit, OnDestroy {

  @Input() hero$: Observable<Hero | undefined> = of(undefined);
  @Input() augments: AugmentSlot[] | undefined;
  constructor(private buildService: BuildService,
    private buildSerializerService: BuildSerializerService,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.heroSubscription = this.hero$.subscribe(x => {
      if (x)
        this.heroId = x.id
    });
  }
  heroSubscription: Subscription | undefined;
  heroId: number = 0;
  successMsg: string | undefined;
  errorMsg: string | undefined;
  form = new FormGroup({
    title: new FormControl('', [
      Validators.required
    ]),
    description: new FormControl('', []),
    heroId: new FormControl<number>(0, [
      Validators.required
    ])
  })


  submit() {
    this.successMsg = "";
    this.errorMsg = "";

    const encoded = this.buildSerializerService.Serialize(this.augments!);
    if (!this.augments || this.augments.filter(x => x.augmentData).length < 5)
    {
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
      next: x => { this.successMsg = "Success" },
      error: err => { this.errorMsg = "Something went wrong:"+ err.errors.join(' ; ') ?? err }
    }
    this.buildService.add(build)
      .subscribe(resultObserver)
  }

  ngOnDestroy(): void {
    this.heroSubscription?.unsubscribe();
  }
}
