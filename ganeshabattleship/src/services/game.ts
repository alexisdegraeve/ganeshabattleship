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


generateComputerGrid(): { grid: Cell[][], ships: Ship[] }  {
  const grid = this.createEmptyGrid();
  const ships: Ship[] = this.ships.map(s => ({ ...s, positions: [] }));

  for (const ship of this.ships) {
    let placed = false;
    let attempts = 0;

    // Définir une orientation aléatoire pour chaque navire
    const orientation: 'horizontal' | 'vertical' = Math.random() < 0.5 ? 'horizontal' : 'vertical';
    ship.horizontal = orientation === 'horizontal'; // pour le suivi des positions

    while (!placed && attempts < 100) {
      attempts++;
      const row = Math.floor(Math.random() * this.GRID_SIZE);
      const col = Math.floor(Math.random() * this.GRID_SIZE);

      if (this.canPlaceShip(grid, row, col, ship, orientation)) {
        // Placer le navire dans la grille
        this.placeShip(grid, row, col, ship, orientation);

        // Stocker les positions exactes du navire
        ship.positions = [];
        for (let k = 0; k < ship.size; k++) {
          if (orientation === 'horizontal') {
            ship.positions.push({ row, col: col + k });
          } else {
            ship.positions.push({ row: row + k, col });
          }
        }

        placed = true;
      }
    }

    // Si placement impossible après 100 essais, recommencer tout
    if (!placed) return this.generateComputerGrid();
  }

  return {grid, ships};
}


}
