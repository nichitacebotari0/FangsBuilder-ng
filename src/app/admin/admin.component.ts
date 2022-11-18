import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.less']
})
export class AdminComponent implements OnInit {

  augmentForm = new FormGroup({
    id: new FormControl(''),
    name: new FormControl(''),
    imgPath: new FormControl(''),
    description: new FormControl(''),
    abilityType: new FormControl(''),
    augmentCategory: new FormControl(''),
  });
  
  augmentCategoryForm = new FormGroup({
    id: new FormControl(''),
    name: new FormControl('')
  });

  constructor() { }

  ngOnInit(): void {
  }

}
