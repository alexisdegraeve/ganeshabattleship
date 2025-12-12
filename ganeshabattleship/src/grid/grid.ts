import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Cell } from '../services/game';

@Component({
  selector: 'app-grid',
  imports: [],
  templateUrl: './grid.html',
  styleUrl: './grid.scss',
})
export class GridComponent {
  @Input() grid: Cell[][] = [];
  @Output() cellClicked = new EventEmitter<{ row: number, col: number }>();

  onCellClick(row: number, col: number) {
    this.cellClicked.emit({ row, col });
  }

}
