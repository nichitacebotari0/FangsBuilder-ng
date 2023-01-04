import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { BuildWithAugments, DetailedBuild } from '../hero-builds.component';
import { BuildVote } from '../../Models/BuildVote';
import { CategorisedGenericAugmentData } from '../../Services/Utils/build-serializer.service';
import { StyleService } from '../../Services/Utils/style.service';

@Component({
  selector: 'app-hero-build-detail',
  templateUrl: './hero-build-detail.component.html',
  styleUrls: ['./hero-build-detail.component.less']
})
export class HeroBuildDetailComponent implements OnInit {

  constructor(private styleService: StyleService) { }

  ngOnInit(): void {
  }
  @Input() details: DetailedBuild | undefined;
  showDescription: boolean = false;

  colorClass(aug: CategorisedGenericAugmentData | null | undefined): string {
    return "bg-" + this.styleService.getColorForAugment(aug?.category)
  }

  position_tooltip(event: Event, name: string) {
    this.styleService.position_tooltip(event, name);
    event.stopPropagation();
  }

  toggleDescription(event: Event) {
    this.showDescription = !this.showDescription;
  }
}
