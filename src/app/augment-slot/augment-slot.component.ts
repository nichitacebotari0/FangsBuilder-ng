import { Component, OnInit, Input } from '@angular/core';
import { AugmentSlot } from '../Models/AugmentSlot';
import { AugmentSlotCategory } from '../Models/Enum/AugmentSlotCategory';
import { StyleService } from '../Services/Utils/style.service';

@Component({
  selector: 'app-augment-slot',
  templateUrl: './augment-slot.component.html',
  styleUrls: ['./augment-slot.component.less']
})
export class AugmentSlotComponent implements OnInit {

  @Input() item?: AugmentSlot;
  @Input() isSelected: boolean = false;
  constructor(private styleService: StyleService) { }

  ngOnInit(): void {
  }

  public get colorClass(): string {
    return "bg-"+this.styleService.getColorForAugment(this?.item?.currentlySlottedCategory)
  }

  position_tooltip(event: Event, name: string) {
    this.styleService.position_tooltip(event, name);
    event.stopPropagation();
  }
}
