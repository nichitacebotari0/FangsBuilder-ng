import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, tap } from 'rxjs';
import { Category } from 'src/app/Models/Category';
import { Hero } from 'src/app/Models/Hero';
import { HeroImages } from 'src/app/Models/Static';
import { HeroTypeService } from 'src/app/Services/hero-type.service';
import { HeroService } from 'src/app/Services/hero.service';
import { OauthService } from 'src/app/Services/oauth.service';
import { StaticAssetsService } from 'src/app/Services/static-assets.service';

@Component({
  selector: 'app-hero',
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.less']
})
export class HeroComponent implements OnInit {
  constructor(private heroService: HeroService,
    private heroTypeService: HeroTypeService,
    private staticAssetService: StaticAssetsService,
    private oauthService: OauthService) {
  }

  ngOnInit(): void {
    this.heroes$ = this.heroService.get();
    this.heroTypes$ = this.heroTypeService.get();
    this.heroAssets$ = this.staticAssetService.getHeroes();
    this.heroForm.get("imagePath")?.valueChanges.subscribe(data => {
      let str: string[] | undefined = data?.split("\\");
      if (!str)
        return;
      let name: string = str[str.length - 1].split(".")[0];
      this.heroForm.patchValue({ name: name });
    });
  }
  heroAssets$: Observable<HeroImages[]> | undefined;
  heroes$: Observable<Hero[]> | undefined;
  heroTypes$: Observable<Category[]> | undefined;
  editId: number = -1;

  heroForm = new FormGroup({
    id: new FormControl<number | null>(null, [
      Validators.required,
      Validators.min(1)
    ]),
    name: new FormControl('', [
      Validators.required
    ]),
    imagePath: new FormControl('', [
      Validators.required
    ]),
    heroClass: new FormControl<number | null>(null, [
      Validators.required
    ])
  });

  delete(input: Hero) {
    this.heroService.delete(input.id)
      .subscribe(_ => this.heroService.refetch()); // this http request can be avoided
  }

  submit() {
    let model = this.getModelFromForm();
    if (this.editId > -1) {
      this.heroService.update(this.editId, model)
        .subscribe(_ => this.heroService.refetch()); // this http request can be avoided
      this.editId = model.id;
      return;
    }
    this.heroService.add(model)
      .subscribe(_ => this.heroService.refetch()); // this http request can be avoided
  }

  getModelFromForm(): Hero {
    return {
      id: this.heroForm.value.id!,
      name: this.heroForm.value.name!,
      imagePath: this.heroForm.value.imagePath!,
      heroClassId: this.heroForm.value.heroClass!
    };
  }

  edit(input: Hero) {
    this.editId = input.id;
    this.heroForm.setValue({
      id: input.id,
      name: input.name,
      imagePath: input.imagePath,
      heroClass: input.heroClassId
    });
  }

  stopEditing() {
    this.editId = -1;
    this.heroForm.reset();
  }

  public get isSuper(): boolean {
    return this.oauthService.issuper();
  }
}
