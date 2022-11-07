import { Component, OnInit, Input } from '@angular/core';
import { Augment, AugmentCategory } from '../Models/Augment';

@Component({
  selector: 'app-augment-slot',
  templateUrl: './augment-slot.component.html',
  styleUrls: ['./augment-slot.component.less']
})
export class AugmentSlotComponent implements OnInit {

  @Input() item?: Augment;
  @Input() isSelected: boolean = false;
  colorClass: string = "bg-stone-500";

  constructor() { }

  ngOnInit(): void {
  }

}
