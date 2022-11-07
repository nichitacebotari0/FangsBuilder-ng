import { Component, OnInit } from '@angular/core';
import { Augment, AugmentCategory } from '../Models/Augment';

@Component({
  selector: 'app-build-editor',
  templateUrl: './build-editor.component.html',
  styleUrls: ['./build-editor.component.less']
})
export class BuildEditorComponent implements OnInit {

  augmentList: Augment[] = [
    new Augment(-1, "", "", "", AugmentCategory.POSITIONAL),
    new Augment(-1, "", "", "", AugmentCategory.RED),
    new Augment(-1, "", "", "", AugmentCategory.YELLOW),
    new Augment(-1, "", "", "", AugmentCategory.FLEX),
    new Augment(-1, "", "", "", AugmentCategory.ULT),
    new Augment(-1, "", "", "", AugmentCategory.ACTIVE),
    new Augment(-1, "", "", "", AugmentCategory.FLEX),
    new Augment(-1, "", "", "", AugmentCategory.FLEX),
  ];

  selectedSlot: number = -1;

  constructor() { }

  ngOnInit(): void {
  }

  setSelected(event :Event, id :number) {
    event.stopPropagation();
    this.selectedSlot = id;
  }

}
