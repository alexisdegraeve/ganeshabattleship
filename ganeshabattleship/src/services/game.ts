import { Injectable } from '@angular/core';
import { Ship } from '../ship-placement/ship-placement';


export type Orientation = 'horizontal' | 'vertical';
export type Cell = 0 | 1 | 2 ; // 0 = empty, 1 = ship ; 2 = hit


@Injectable({
  providedIn: 'root',
})
export class GameService {
GRID_SIZE = 10;

  ships: Ship[] = [
    { name: 'Aircraft Carrier', size: 5 },
    { name: 'Battleship', size: 4 },
    { name: 'Cruiser', size: 3 },
    { name: 'Submarine', size: 3 },
    { name: 'Destroyer', size: 2 },
  ];

  createEmptyGrid(): Cell[][] {
    return Array.from({ length: this.GRID_SIZE }, () => Array(this.GRID_SIZE).fill(0));
  }

  canPlaceShip(grid: Cell[][], row: number, col: number, ship: Ship, orientation: Orientation): boolean {
    if (orientation === 'horizontal') {
      if (col + ship.size > this.GRID_SIZE) return false;
      for (let i = 0; i < ship.size; i++) if (grid[row][col + i] === 1) return false;
    } else {
      if (row + ship.size > this.GRID_SIZE) return false;
      for (let i = 0; i < ship.size; i++) if (grid[row + i][col] === 1) return false;
    }
    return true;
  }

  placeShip(grid: Cell[][], row: number, col: number, ship: Ship, orientation: Orientation) {
    if (orientation === 'horizontal') {
      for (let i = 0; i < ship.size; i++) grid[row][col + i] = 1;
    } else {
      for (let i = 0; i < ship.size; i++) grid[row + i][col] = 1;
    }
  }


generateComputerGrid(): { grid: Cell[][], ships: Ship[] } {
  const grid = this.createEmptyGrid();

  // IMPORTANT : créer une copie indépendante des navires
  const ships: Ship[] = this.ships.map(s => ({
    name: s.name,
    size: s.size,
    positions: [],
    horizontal: true
  }));

  for (const ship of ships) {
    let placed = false;
    let attempts = 0;

    while (!placed && attempts < 100) {
      attempts++;

      const orientation: Orientation = Math.random() < 0.5 ? 'horizontal' : 'vertical';
      ship.horizontal = orientation === 'horizontal';

      const row = Math.floor(Math.random() * this.GRID_SIZE);
      const col = Math.floor(Math.random() * this.GRID_SIZE);

      if (this.canPlaceShip(grid, row, col, ship, orientation)) {

        ship.positions = []; // reset safe

        for (let k = 0; k < ship.size; k++) {
          if (orientation === 'horizontal') {
            grid[row][col + k] = 1;
            ship.positions.push({ row, col: col + k });
          } else {
            grid[row + k][col] = 1;
            ship.positions.push({ row: row + k, col });
          }
        }

        placed = true;
      }
    }

    if (!placed) {
      console.warn("Retry generation (ship could not be placed)");
      return this.generateComputerGrid();
    }
  }

  return { grid, ships };
}


}
