import { Component, Input, OnInit } from '@angular/core';
import { GenericAugmentData } from '../Models/AugmentSlot';

@Component({
  selector: 'app-augment-clickable',
  templateUrl: './augment-clickable.component.html',
  styleUrls: ['./augment-clickable.component.less']
})
export class AugmentClickableComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  @Input() element: GenericAugmentData | undefined = undefined;
}
