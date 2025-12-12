import { Component } from '@angular/core';
import { GridComponent } from "../grid/grid";
import { Cell, GameService } from '../services/game';

@Component({
  selector: 'app-game',
  imports: [GridComponent],
  templateUrl: './game.html',
  styleUrl: './game.scss',
})
export class GameComponent {
  playerGrid: Cell[][] = [];
  computerGrid: Cell[][] = [];

  constructor(private gameService: GameService) { }

  ngOnInit(): void {
    // Génère la grille du joueur et de l'ordinateur
    this.playerGrid = this.gameService.createEmptyGrid();
    this.computerGrid = this.gameService.generateComputerGrid();
  }

  onCellClick(row: number, col: number) {
    console.log('Player clicked cell:', row, col);
    // Ici tu peux gérer le hit/miss et le tour de l'ordinateur
  }
}
