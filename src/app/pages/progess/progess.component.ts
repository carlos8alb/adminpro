import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-progess',
  templateUrl: './progess.component.html',
  styles: []
})
export class ProgessComponent implements OnInit {

  progresoBlue: number = 20;
  progresoGreen: number = 70;

  constructor() { }

  ngOnInit() {
  }
}
