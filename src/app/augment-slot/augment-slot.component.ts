import { Component, OnInit, Input } from '@angular/core';
import { AugmentSlot } from '../Models/AugmentSlot';
import { StyleService } from '../Services/Utils/style.service';

@Component({
  selector: 'app-augment-slot',
  templateUrl: './augment-slot.component.html',
  styleUrls: ['./augment-slot.component.less']
})
export class AugmentSlotComponent implements OnInit {

  @Input() item?: AugmentSlot;
  @Input() isSelected: boolean = false;
  colorClass: string = "bg-stone-500";

  constructor(private styleService: StyleService) { }

  ngOnInit(): void {
  }

  position_tooltip(event: Event, name: string) {
    this.styleService.position_tooltip(event, name);
    event.stopPropagation();
  }
}
