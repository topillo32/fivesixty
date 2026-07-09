export type Fase = "grupos" | "eliminacion";

export interface Integrante {
  id: string;
  nombre: string;
  createdAt: number;
}

export interface IntegrantePhoto {
  id: string;
  nombre: string;
  url: string;
}

export interface Duelo {
  id: string;
  liga: string;
  fase: Fase;
  jugadorAId: string;
  jugadorBId: string;
  ganadorId: string;
  createdAt: number;
}

export interface Standing {
  integranteId: string;
  nombre: string;
  puntos: number;
  duelosJugados: number;
  victorias: number;
  derrotas: number;
}
