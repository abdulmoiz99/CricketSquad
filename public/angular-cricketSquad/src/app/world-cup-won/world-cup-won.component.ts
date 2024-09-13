import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'world-cup-won',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './world-cup-won.component.html',
  styleUrl: './world-cup-won.component.css'
})
export class WorldCupWonComponent {

  worldCups: Number[] = [];

  @Input()
  set worldCupWon(worldCupWon: Number) {
    this.worldCups = new Array<Number>(worldCupWon);
  }
}
