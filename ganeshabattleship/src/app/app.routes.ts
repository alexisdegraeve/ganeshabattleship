import { Routes } from '@angular/router';
import { GameComponent } from '../game/game';
import { ShipPlacementComponent } from '../ship-placement/ship-placement';
import { WelcomeComponent } from '../welcome/welcome';
import { InstructionComponent } from '../instruction/instruction';

export const routes: Routes = [
  { path: '', redirectTo: 'welcome', pathMatch: 'full' }, // redirection vers l'accueil
  { path: 'welcome', component: WelcomeComponent },
  { path: 'instruction', component: InstructionComponent },
  { path: 'ship-placement', component: ShipPlacementComponent },
  { path: 'game', component: GameComponent },
  { path: '**', redirectTo: 'home' } // fallback pour les routes inconnues
];
