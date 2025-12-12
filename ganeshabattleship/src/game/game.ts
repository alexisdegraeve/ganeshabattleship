import { Component } from '@angular/core';
import { GridComponent } from "../grid/grid";

@Component({
  selector: 'app-game',
  imports: [GridComponent],
  templateUrl: './game.html',
  styleUrl: './game.scss',
})
export class GameComponent {

}
