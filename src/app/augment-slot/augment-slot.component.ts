import { Component, OnInit, Input } from '@angular/core';
import { Augment } from '../Models/Augment';

@Component({
  selector: 'app-augment-slot',
  templateUrl: './augment-slot.component.html',
  styleUrls: ['./augment-slot.component.less']
})
export class AugmentSlotComponent implements OnInit {

  @Input() item? : Augment;
  colorClass : string = "bg-stone-500";

  constructor() { }

  ngOnInit(): void {
  }

}
