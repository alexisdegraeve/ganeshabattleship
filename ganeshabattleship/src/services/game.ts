import { Injectable } from '@angular/core';


export type Orientation = 'horizontal' | 'vertical';
export type Cell = 0 | 1; // 0 = empty, 1 = ship

export interface Ship {
  name: string;
  size: number;
}

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

  generateComputerGrid(): Cell[][] {
    const grid = this.createEmptyGrid();
    for (const ship of this.ships) {
      let placed = false;
      let attempts = 0;
      while (!placed && attempts < 100) {
        attempts++;
        const orientation: Orientation = Math.random() < 0.5 ? 'horizontal' : 'vertical';
        const row = Math.floor(Math.random() * this.GRID_SIZE);
        const col = Math.floor(Math.random() * this.GRID_SIZE);
        if (this.canPlaceShip(grid, row, col, ship, orientation)) {
          this.placeShip(grid, row, col, ship, orientation);
          placed = true;
        }
      }
      if (!placed) return this.generateComputerGrid();
    }
    return grid;
  }
}
