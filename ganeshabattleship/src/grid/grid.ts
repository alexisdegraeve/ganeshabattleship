import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Cell } from '../services/game';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-grid',
  imports: [CommonModule],
  templateUrl: './grid.html',
  styleUrl: './grid.scss',
})
export class GridComponent {
  @Input() grid: Cell[][] = [];
   @Input() hits: boolean[][] = [];
  @Output() cellClicked = new EventEmitter<{ row: number, col: number }>();
  @Input() clickable = false;

  handleClick(row: number, col: number) {
    if (!this.clickable) return;
    this.cellClicked.emit({ row, col });
  }

}
