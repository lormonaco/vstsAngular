import { Component, OnInit } from '@angular/core';
import { commons, EffortCriticity } from '../shared/commons';

@Component({
  selector: 'app-headermenu-component',
  templateUrl: './headermenu-component.component.html',
  styleUrls: ['./headermenu-component.component.css']
})
export class HeadermenuComponentComponent implements OnInit {

  selectedCritical: string;
  criticalValues;
  constructor() { }

  ngOnInit() {
    
  }

  onChange(newValue) {
    console.log(newValue);
    this.selectedCritical = newValue;
  }
}


