import { Injectable } from '@angular/core';
import { AugmentSlotCategory } from 'src/app/Models/Enum/AugmentSlotCategory';

@Injectable({
  providedIn: 'root'
})
export class StyleService {

  constructor() { }


  getColorForAugment(augmentType: AugmentSlotCategory | undefined | null) {
    switch (augmentType) {
      case AugmentSlotCategory.POSITIONAL:
        return "sky-600";
      case AugmentSlotCategory.COMBAT:
        return "red-600";
      case AugmentSlotCategory.UTILITY:
        return "yellow-500";
      case AugmentSlotCategory.ACTIVE:
        return "yellow-800";
      case AugmentSlotCategory.ULTIMATE:
        return "purple-600";
      default:
        return "stone-500";
    }
  }


  position_tooltip(event: Event, name: string) {
    if (!(event?.currentTarget instanceof Element))
      return;
    var tooltips = event.currentTarget?.querySelectorAll<HTMLElement>(name);
    tooltips.forEach(tooltip => {
      if (!window.visualViewport)
        return;
      tooltip.style.left = "0px";
      var tooltip_rect = tooltip.getBoundingClientRect();

      if (tooltip_rect.x < 0)
        tooltip.style.left = -tooltip_rect.x + "px";

      let rightOverflow = tooltip_rect.x + tooltip_rect.width - window.visualViewport.width;
      if (rightOverflow > 0)
        tooltip.style.left = -rightOverflow + "px";
    });
  }
}
