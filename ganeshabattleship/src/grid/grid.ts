import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Cell, GameService } from '../services/game';
import { CommonModule } from '@angular/common';
import { ShipStatus } from '../models/batteship';

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
  @Input() ships: ShipStatus[] = [];

    constructor(private gameService: GameService) { }

  handleClick(row: number, col: number) {
    if (!this.clickable) return;
    this.cellClicked.emit({ row, col });
  }

  isShipStart(row: number, col: number) {
  const ship = this.gameService.findShipByPosition(this.ships, row, col);
  if (!ship) return false;
  return ship.positions![0].row === row && ship.positions![0].col === col;
}

isShipEnd(row: number, col: number) {
  const ship = this.gameService.findShipByPosition(this.ships, row, col);
  if (!ship) return false;
  const last = ship.positions![ship.positions!.length - 1];
  return last.row === row && last.col === col;
}

isShipMiddle(row: number, col: number) {
  const ship = this.gameService.findShipByPosition(this.ships, row, col);
  if (!ship) return false;

  return ship.positions!.some(
    (p, i) => i > 0 && i < ship.positions!.length - 1 && p.row === row && p.col === col
  );
}

isShipHorizontal(row: number, col: number) {
  const ship = this.gameService.findShipByPosition(this.ships, row, col);
  if (!ship) return false;
  return ship.positions![0].row === ship.positions![1]?.row;
}

isShipVertical(row: number, col: number) {
  const ship = this.gameService.findShipByPosition(this.ships, row, col);
  if (!ship) return false;
  return ship.positions![0].col === ship.positions![1]?.col;
}

getShipSizeAt(row: number, col: number): number {
  const ship = this.gameService.findShipByPosition(this.ships, row, col);
  return ship ? ship.positions!.length : 1;
}


}
