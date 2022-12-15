import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StyleService {

  constructor() { }

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
