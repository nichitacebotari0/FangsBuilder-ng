import { Component, Input, OnInit } from '@angular/core';
import { Build } from '../Models/Build';
import { BuildVote } from '../Models/BuildVote';
import { Hero } from '../Models/Hero';
import { CategorisedGenericAugmentData } from '../Services/Utils/build-serializer.service';
import { StyleService } from '../Services/Utils/style.service';

@Component({
  selector: 'app-build',
  templateUrl: './build.component.html',
  styleUrls: ['./build.component.less']
})
export class BuildComponent implements OnInit {

  constructor(private styleService: StyleService) { }

  ngOnInit(): void {
  }
  @Input() build: Build | undefined;
  @Input() augmentsData: (CategorisedGenericAugmentData | undefined)[] = [];
  @Input() myVote: BuildVote | undefined | null;
  @Input() hero: Hero | undefined;

  position_tooltip(event: Event, name: string) {
    this.styleService.position_tooltip(event, name);
    event.stopPropagation();
  }

  colorClass(aug: CategorisedGenericAugmentData | null | undefined): string {
    return "bg-" + this.styleService.getColorForAugment(aug?.category)
  }
}
