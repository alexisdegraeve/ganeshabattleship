import { Component } from '@angular/core';
import { GridComponent } from "../grid/grid";
import { Cell, GameService } from '../services/game';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Ship, ShipStatus } from '../models/batteship';


@Component({
  selector: 'app-game',
  imports: [GridComponent, CommonModule],
  templateUrl: './game.html',
  styleUrl: './game.scss',
})
export class GameComponent {

  playerGrid: Cell[][] = [];
  computerGrid: Cell[][] = [];
  playerHits: boolean[][] = [];    // grille pour marquer hits/misses joueur
  computerHits: boolean[][] = [];  // grille pour marquer hits/misses ordinateur
  computerHitsQueue: { row: number, col: number }[] = []; // cases à viser
  lastHit: { row: number, col: number } | null = null;
  playerShips: ShipStatus[] = [];
  computerShips: ShipStatus[] = [];
  computerWin = false;

  playerTurn = true;
  gameOver = false; 
  message = '';

  constructor(private gameService: GameService, private router: Router) { }

  ngOnInit(): void {
    this.playerShips = [
      { name: 'Aircraft Carrier', size: 5, hits: 0, sunk: false },
      { name: 'Battleship', size: 4, hits: 0, sunk: false },
      { name: 'Cruiser', size: 3, hits: 0, sunk: false },
      { name: 'Submarine', size: 3, hits: 0, sunk: false },
      { name: 'Destroyer', size: 2, hits: 0, sunk: false }
    ];

    //this.computerShips = JSON.parse(JSON.stringify(this.playerShips));
    //Récupère la grille
    const state = history.state;

    if (!state.playerGrid) {
      // Si le joueur n'a pas placé ses navires → retour obligatoire
      this.router.navigate(['/ship-placement']);
      return;
    }

    // Génère les grilles
    this.playerGrid = state.playerGrid;
      this.playerShips = state.playerShips.map((ship: Ship) => ({
    ...ship,
    hits: 0,
    sunk: false
  }));
      // this.playerShips.forEach(ship => {
      //   ship.positions = [];
      //   for (let row = 0; row < this.playerGrid.length; row++) {
      //     for (let col = 0; col < this.playerGrid[row].length; col++) {
      //       // Si la cellule correspond à ce navire (1 = navire)
      //       if (this.playerGrid[row][col] === 1) {
      //         // Tu peux associer par ordre : le premier navire trouvé = Carrier, etc.
      //         if (ship.positions!.length < ship.size) {
      //           ship.positions!.push({ row, col });
      //         }
      //       }
      //     }
      //   }
      // });


    const computerSetup = this.gameService.generateComputerGrid();
    this.computerGrid = computerSetup.grid;
    this.computerShips = computerSetup.ships.map(ship => ({
      name: ship.name,
      size: ship.size,
      hits: 0,
      sunk: false,
      positions: ship.positions
    }));


    // Initialiser les grilles de hits/misses
    this.playerHits = this.playerGrid.map(row => row.map(_ => false));
    this.computerHits = this.computerGrid.map(row => row.map(_ => false));
  }



  onCellClick(row: number, col: number) {
    if (this.gameOver) return;
    if (!this.playerTurn) return;

    // Vérifie si déjà cliqué
    if (this.computerHits[row][col]) return;

    // Marque le hit ou miss
    this.computerHits[row][col] = true;

    if (this.computerGrid[row][col] === 1) {
      this.message = 'Hit!';
      this.computerGrid[row][col] = 2; // 2 = touché

      const ship = this.gameService.findShipByPosition(this.computerShips, row, col);
      if (ship) {
        ship.hits++;
        if (ship.hits >= ship.size) ship.sunk = true;
      }
    } else {
      this.message = 'Miss!';
    }



    // Vérifie si tous les navires sont coulés

    if (this.checkWin(this.computerGrid)) {
      this.computerWin = false;
      // this.message = '<i class="bi bi-trophy-fill me-2"></i> You win!';
      this.gameOver = true;
      return;
    }

    this.playerTurn = false;
    this.computerTurn();

    // Tour de l'ordinateur après un petit délai
    //setTimeout(() => { this.computerTurn(); }, 500);
  }


computerTurn() {
  if (this.gameOver) return;

  let row: number;
  let col: number;

  // Si on a une case à viser (hits voisins), on prend la première
  if (this.computerHitsQueue.length > 0) {
    const next = this.computerHitsQueue.shift()!;
    row = next.row;
    col = next.col;
  } else {
    // Tir aléatoire
    do {
      row = Math.floor(Math.random() * this.playerGrid.length);
      col = Math.floor(Math.random() * this.playerGrid[0].length);
    } while (this.playerHits[row][col]);
  }

  this.playerHits[row][col] = true;

  if (this.playerGrid[row][col] === 1) {
    this.message = `Computer hits at (${row}, ${col})!`;
    this.playerGrid[row][col] = 2;

    const ship = this.gameService.findShipByPosition(this.playerShips, row, col);
    if (ship) {
      ship.hits++;
      if (ship.hits >= ship.size) ship.sunk = true;
    }

    // Ajoute les cases adjacentes à viser si elles ne sont pas déjà touchées
    const directions = [
      { r: row-1, c: col }, { r: row+1, c: col },
      { r: row, c: col-1 }, { r: row, c: col+1 }
    ];

    directions.forEach(d => {
      if (d.r >= 0 && d.r < this.playerGrid.length &&
          d.c >= 0 && d.c < this.playerGrid[0].length &&
          !this.playerHits[d.r][d.c]) {
        this.computerHitsQueue.push({ row: d.r, col: d.c });
      }
    });

  } else {
    this.message = `Computer misses at (${row}, ${col}).`;
  }

  this.playerGrid = this.playerGrid.map(r => [...r]);
  this.playerHits = this.playerHits.map(r => [...r]);

  if (this.checkWin(this.playerGrid)) {
    this.computerWin = true;
    // this.message = '<i class="bi bi-emoji-frown-fill me-2"></i> You loose!';
    this.gameOver = true;
    return;
  }

  this.playerTurn = true;
}
  checkWin(grid: Cell[][]): boolean {
    return !grid.some(row => row.some(cell => cell === 1));
  }

  restartGame() {
    //this.ngOnInit();
      this.router.navigate(['/welcome']);
    // this.playerTurn = true;
    // this.gameOver = false;
    // this.message = '';
  }
}
