import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-warning-disclaimer',
  templateUrl: './warning-disclaimer.component.html',
  styleUrls: ['./warning-disclaimer.component.less']
})
export class WarningDisclaimerComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  @Input() disclaimerTitle: string | undefined;
  wasClosed: boolean = false;

}
