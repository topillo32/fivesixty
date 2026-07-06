import type { Duelo, Integrante, Standing } from "@/types";

const PUNTOS_VICTORIA = 3;
const PUNTOS_DERROTA = 1;

export function computeStandings(integrantes: Integrante[], duelos: Duelo[]): Standing[] {
  const standings = new Map<string, Standing>();

  for (const integrante of integrantes) {
    standings.set(integrante.id, {
      integranteId: integrante.id,
      nombre: integrante.nombre,
      puntos: 0,
      duelosJugados: 0,
      victorias: 0,
      derrotas: 0,
    });
  }

  for (const duelo of duelos) {
    for (const participanteId of [duelo.jugadorAId, duelo.jugadorBId]) {
      const standing = standings.get(participanteId);
      if (!standing) continue;

      const gano = duelo.ganadorId === participanteId;
      standing.puntos += gano ? PUNTOS_VICTORIA : PUNTOS_DERROTA;
      standing.duelosJugados += 1;
      if (gano) standing.victorias += 1;
      else standing.derrotas += 1;
    }
  }

  return Array.from(standings.values()).sort((a, b) => b.puntos - a.puntos);
}
