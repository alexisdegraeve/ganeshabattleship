import { Component } from '@angular/core';
import { GridComponent } from "../grid/grid";
import { Cell, GameService } from '../services/game';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

interface ShipStatus {
  name: string;
  size: number;
  hits: number;
  sunk: boolean;
}

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

  playerTurn = true;
  gameOver = false;
  message = '';

  constructor(private gameService: GameService, private router: Router) { }

  ngOnInit(): void {
    //Récupère la grille
    const state = history.state;

    if (!state.playerGrid) {
      // Si le joueur n'a pas placé ses navires → retour obligatoire
      this.router.navigate(['/ship-placement']);
      return;
    }

    // Génère les grilles
    this.playerGrid = state.playerGrid;
    this.computerGrid = this.gameService.generateComputerGrid();

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
    } else {
      this.message = 'Miss!';
    }

    // Vérifie si tous les navires sont coulés
    if (this.checkWin(this.computerGrid)) {
      this.message = 'Player wins!';
      this.gameOver = true;
      return;
    }

    this.playerTurn = false;

    // Tour de l'ordinateur après un petit délai
    setTimeout(() => { this.computerTurn(); }, 500);
  }

  computerTurn() {
    if (this.gameOver) return;

    let row: number;
    let col: number;

    // Choisir une case non encore touchée
    do {
      row = Math.floor(Math.random() * this.playerGrid.length);
      col = Math.floor(Math.random() * this.playerGrid[0].length);
    } while (this.playerHits[row][col]);

    this.playerHits[row][col] = true;

    if (this.playerGrid[row][col] === 1) {
      this.message = `Computer hits at (${row}, ${col})!`;
      this.playerGrid[row][col] = 2;
    } else {
      this.message = `Computer misses at (${row}, ${col}).`;
    }

      // FORCE Angular à détecter le changement
      this.playerHits = this.playerHits.map(row => [...row]);
      this.playerGrid = this.playerGrid.map(row => [...row]);

    if (this.checkWin(this.playerGrid)) {
      this.message = 'Computer wins!';
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
     this.router.navigate(['/ship-placement']);
    // this.playerTurn = true;
    // this.gameOver = false;
    // this.message = '';
  }
}
