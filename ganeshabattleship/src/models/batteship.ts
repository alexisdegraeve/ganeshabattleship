export interface ShipStatus {
  name: string;
  size: number;
  hits: number;
  sunk: boolean;
  positions?: { row: number, col: number }[];
}

export interface Ship {
  name: string;
  size: number;
  positions?: { row: number; col: number }[]; // cases occupées
  hits?: number;    // nombre de fois touché
  sunk?: boolean;   // si le navire est coulé
  horizontal?: boolean; // orientation
}
