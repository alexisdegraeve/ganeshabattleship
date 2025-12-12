import { Routes } from '@angular/router';
import { GameComponent } from '../game/game';
import { ShipPlacementComponent } from '../ship-placement/ship-placement';

export const routes: Routes = [
  { path: '', redirectTo: 'ship-placement', pathMatch: 'full' }, // redirection vers l'accueil
  { path: 'ship-placement', component: ShipPlacementComponent },
  { path: 'game', component: GameComponent },
  { path: '**', redirectTo: 'home' } // fallback pour les routes inconnues
];
