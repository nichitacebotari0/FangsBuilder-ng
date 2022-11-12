import { Component, OnInit } from '@angular/core';
import { Augment, AugmentCategory } from '../Models/Augment';
import { AugmentService } from '../Services/augment.service';

@Component({
  selector: 'app-build-editor',
  templateUrl: './build-editor.component.html',
  styleUrls: ['./build-editor.component.less']
})
export class BuildEditorComponent implements OnInit {

  augmentSlots: Augment[] = [
    new Augment(-1, "", "", "", AugmentCategory.POSITIONAL),
    new Augment(-1, "", "", "", AugmentCategory.COMBAT),
    new Augment(-1, "", "", "", AugmentCategory.UTILITY),
    new Augment(-1, "", "", "", AugmentCategory.FLEX),
    new Augment(-1, "", "", "", AugmentCategory.ULTIMATE),
    new Augment(-1, "", "", "", AugmentCategory.ACTIVE),
    new Augment(-1, "", "", "", AugmentCategory.FLEX),
    new Augment(-1, "", "", "", AugmentCategory.FLEX),
  ];

  selectedSlot: number = 0;
  availableAugments: Augment[] = [];

  constructor(private augmentService: AugmentService) { }

  ngOnInit(): void {
  }

  setSelected(event: Event, id: number) {
    event.stopPropagation();
    this.selectedSlot = id;
    this.availableAugments = this.augmentService.generateMockAugments(id);
  }

}
