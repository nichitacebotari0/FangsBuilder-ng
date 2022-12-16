import { Component, Input, OnInit } from '@angular/core';
import { GenericAugmentData } from '../Models/AugmentSlot';
import { AugmentSlotCategory } from '../Models/Enum/AugmentSlotCategory';
import { StyleService } from '../Services/Utils/style.service';

@Component({
  selector: 'app-augment-clickable',
  templateUrl: './augment-clickable.component.html',
  styleUrls: ['./augment-clickable.component.less']
})
export class AugmentClickableComponent implements OnInit {

  constructor(private styleService: StyleService) { }

  ngOnInit(): void {
  }
  @Input() element: GenericAugmentData | undefined;
  @Input() augmentCategory: AugmentSlotCategory | null = null;

  public get colorClass(): string {
    return "border-"+this.styleService.getColorForAugment(this.augmentCategory)
  }

  position_tooltip(event: Event, name: string) {
    this.styleService.position_tooltip(event, name);
    event.stopPropagation();
  }
}
