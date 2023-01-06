import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-map-picker',
  templateUrl: './map-picker.component.html',
  styleUrls: ['./map-picker.component.less']
})
export class MapPickerComponent implements OnInit {

  constructor() { }

  images: string[] = [
    "\\assets\\maps\\Embersong_screenshot.png",
    "\\assets\\maps\\Crownwatch_screenshot.png",
    "\\assets\\maps\\Stormheart_screenshot.png"
  ]

  selectedIndex: number = 0;

  ngOnInit(): void {
  }

}
