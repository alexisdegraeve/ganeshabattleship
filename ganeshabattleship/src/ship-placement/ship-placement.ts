import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Ship } from '../models/batteship';


type Cell = 0 | 1;


@Component({
  selector: 'app-ship-placement',
  imports: [CommonModule],
  templateUrl: './ship-placement.html',
  styleUrl: './ship-placement.scss',
})
export class ShipPlacementComponent {
  gridSize = 10;

  grid: Cell[][] = Array.from({ length: this.gridSize },
    () => Array(this.gridSize).fill(0)
  );

  ships: Ship[] = [
    { name: 'Carrier (5)', size: 5 },
    { name: 'Battleship (4)', size: 4 },
    { name: 'Cruiser (3)', size: 3 },
    { name: 'Submarine (3)', size: 3 },
    { name: 'Destroyer (2)', size: 2 }
  ];

  currentShipIndex = 0;
  horizontal = true; // orientation: true = horizontal, false = vertical
  message = '';

  constructor(private router: Router) {}

  /** Toggle orientation */
  toggleOrientation() {
    this.horizontal = !this.horizontal;
  }

  /** User clicks on cell to place ship */
  onCellClick(row: number, col: number) {
    const ship = this.ships[this.currentShipIndex];

    if (!this.canPlaceShip(row, col, ship.size, this.horizontal)) {
      this.message = 'Invalid placement!';
      return;
    }

    ship.positions = [];
    // Place ship
    for (let k = 0; k < ship.size; k++) {
      if (this.horizontal) {
        this.grid[row][col + k] = 1;
        ship.positions.push({ row, col: col + k });
      } else {
        this.grid[row + k][col] = 1;
        ship.positions.push({ row: row + k, col });
      }
    }

    this.currentShipIndex++;
    this.message = '';

    // If all ships placed → allow start game
    if (this.currentShipIndex >= this.ships.length) {
      this.message = 'All ships placed!';
    }
  }

  /** Check if ship fits + no overlap */
  canPlaceShip(row: number, col: number, size: number, horizontal: boolean): boolean {
    if (horizontal) {
      if (col + size > this.gridSize) return false;
      for (let i = 0; i < size; i++) {
        if (this.grid[row][col + i] !== 0) return false;
      }
    } else {
      if (row + size > this.gridSize) return false;
      for (let i = 0; i < size; i++) {
        if (this.grid[row + i][col] !== 0) return false;
      }
    }
    return true;
  }

  /** Start game with placed grid */
  startGame() {
    if (this.currentShipIndex < this.ships.length) {
      this.message = 'Place all ships first!';
      return;
    }


    // Send the player's grid to the GameComponent
    this.router.navigate(['/game'], {
      state: { playerGrid: this.grid,  playerShips: this.ships }
    });
  }

  /** Reset placement */
  resetGrid() {
    this.grid = Array.from({ length: this.gridSize },
      () => Array(this.gridSize).fill(0)
    );
    this.currentShipIndex = 0;
    this.message = '';
  }
}
