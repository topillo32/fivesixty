"use client";

import { useEffect, useState, type FormEvent } from "react";
import Image from "next/image";
import {
  addIntegrante,
  subscribeIntegrantes,
} from "@/services/integranteService";
import { addDuelo, subscribeDuelos } from "@/services/dueloService";
import { subscribeIntegrantePhotos } from "@/services/integrantePhotoService";
import { computeStandings } from "@/services/standingsService";
import type { Duelo, Fase, Integrante, IntegrantePhoto } from "@/types";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Crown } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function Home() {
  const [integrantes, setIntegrantes] = useState<Integrante[]>([]);
  const [duelos, setDuelos] = useState<Duelo[]>([]);
  const [fotos, setFotos] = useState<IntegrantePhoto[]>([]);

  const [nombreNuevo, setNombreNuevo] = useState("");

  const [liga, setLiga] = useState("");
  const [fase, setFase] = useState<Fase>("grupos");
  const [jugadorAId, setJugadorAId] = useState("");
  const [jugadorBId, setJugadorBId] = useState("");
  const [ganadorId, setGanadorId] = useState("");

  useEffect(() => {
    const unsubIntegrantes = subscribeIntegrantes(setIntegrantes);
    const unsubDuelos = subscribeDuelos(setDuelos);
    const unsubFotos = subscribeIntegrantePhotos(setFotos);
    return () => {
      unsubIntegrantes();
      unsubDuelos();
      unsubFotos();
    };
  }, []);

  const standings = computeStandings(integrantes, duelos);

  function nombreDe(id: string) {
    return integrantes.find((i) => i.id === id)?.nombre ?? "?";
  }

  function fotoDe(nombre: string) {
    return fotos.find((f) => f.nombre === nombre)?.url;
  }

  async function handleAddIntegrante(e: FormEvent) {
    e.preventDefault();
    if (!nombreNuevo.trim()) return;
    await addIntegrante(nombreNuevo);
    setNombreNuevo("");
  }

  async function handleAddDuelo(e: FormEvent) {
    e.preventDefault();
    if (!liga.trim() || !jugadorAId || !jugadorBId || !ganadorId) return;
    if (jugadorAId === jugadorBId) return;

    await addDuelo({
      liga: liga.trim(),
      fase,
      jugadorAId,
      jugadorBId,
      ganadorId,
    });
    setLiga("");
    setJugadorAId("");
    setJugadorBId("");
    setGanadorId("");
  }

  const king = standings[0];
  const fotoKing = king ? fotoDe(king.nombre) : undefined;

  const rankVariant = (i: number) => {
    if (i === 0) return "default";
    if (i === 1) return "secondary";
    return "outline";
  };

  return (
    <main className="container mx-auto flex flex-col gap-8 p-4 sm:p-6 md:p-8 pb-16">
      <header className="relative overflow-hidden rounded-2xl border border-l-4 border-l-primary bg-card text-card-foreground p-6 shadow-lg shadow-black/40">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-transparent" />
        <div className="relative flex flex-wrap items-center gap-3">
          <Image
            src="/images/560.png"
            alt="Copa 5-60"
            width={48}
            height={48}
            className="rounded-full"
          />
          <span className="rounded-full bg-primary px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider text-primary-foreground">
            Copa
          </span>
          <h1 className="text-2xl font-bold tracking-tight">
            Copa 5-60 Taper McDonalds Coca Cola Zero
          </h1>
        </div>
        <div className="relative mt-3 flex gap-2">
          <Badge variant="secondary" className="font-normal">
            Victoria <span className="ml-1 font-bold text-primary">3 pts</span>
          </Badge>
          <Badge variant="secondary" className="font-normal">
            Derrota <span className="ml-1 font-bold text-primary">1 pt</span>
          </Badge>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        <Card className="order-2 md:order-none md:col-span-2 md:row-span-3">
          <CardHeader>
            <CardTitle>Tabla de posiciones</CardTitle>
          </CardHeader>
          <CardContent>
            <TooltipProvider delayDuration={150}>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[40px]">#</TableHead>
                    <TableHead>Integrante</TableHead>
                    <TableHead className="text-right">Puntos</TableHead>
                    <TableHead className="text-right">PJ</TableHead>
                    <TableHead className="text-right">V</TableHead>
                    <TableHead className="text-right">D</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {standings.map((s, i) => {
                    const foto = fotoDe(s.nombre);
                    return (
                      <TableRow key={s.integranteId}>
                        <TableCell>
                          <Badge
                            variant={rankVariant(i)}
                            className="w-6 h-6 justify-center"
                          >
                            {i + 1}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium">
                          {foto ? (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span className="cursor-default underline decoration-dotted underline-offset-4">
                                  {s.nombre}
                                </span>
                              </TooltipTrigger>
                              <TooltipContent>
                                <Image
                                  src={foto}
                                  alt={s.nombre}
                                  width={96}
                                  height={96}
                                  className="rounded-md object-cover"
                                />
                              </TooltipContent>
                            </Tooltip>
                          ) : (
                            s.nombre
                          )}
                        </TableCell>
                        <TableCell className="text-right font-semibold">
                          {s.puntos}
                        </TableCell>
                        <TableCell className="text-right text-muted-foreground">
                          {s.duelosJugados}
                        </TableCell>
                        <TableCell className="text-right text-emerald-400">
                          {s.victorias}
                        </TableCell>
                        <TableCell className="text-right text-muted-foreground">
                          {s.derrotas}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {standings.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="py-6 text-center text-muted-foreground"
                      >
                        Sin integrantes todavía
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TooltipProvider>
          </CardContent>
        </Card>

        {king && (
          <Card className="order-2 relative flex h-36 items-stretch overflow-hidden border-2 border-amber-400/70 bg-card shadow-lg shadow-amber-500/20 md:order-none">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-amber-500/10 via-transparent to-transparent" />
            <div className="relative z-10 flex flex-1 flex-col justify-center gap-2 pl-5 pr-2">
              <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-amber-400">
                <Crown className="h-4 w-4 fill-amber-400" />
                El King del Equipo
              </span>
              <span className="truncate text-2xl font-extrabold tracking-tight">
                {king.nombre}
              </span>
              <div className="flex gap-3 text-sm">
                <span className="font-bold text-amber-400">{king.puntos} pts</span>
                <span className="text-muted-foreground">{king.victorias}V · {king.derrotas}D</span>
              </div>
            </div>
            <div className="relative flex w-20 flex-none items-center justify-center sm:w-24">
              {fotoKing ? (
                <div className="relative h-20 w-16 overflow-hidden rounded-lg sm:h-24 sm:w-20">
                  <Image
                    src={fotoKing}
                    alt={king.nombre}
                    fill
                    sizes="80px"
                    className="object-cover object-top"
                  />
                </div>
              ) : (
                <div className="flex h-20 w-16 items-center justify-center rounded-lg bg-muted text-3xl font-bold text-muted-foreground">
                  {king.nombre.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
          </Card>
        )}

        <Card className="order-1 md:order-none">
          <CardHeader>
            <CardTitle>Registrar duelo</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddDuelo} className="flex flex-col gap-3">
              <Input
                value={liga}
                onChange={(e) => setLiga(e.target.value)}
                placeholder="Nombre de la liga / torneo"
              />
              <Select value={fase} onValueChange={(v) => setFase(v as Fase)}>
                <SelectTrigger>
                  <SelectValue placeholder="Fase" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="grupos">Fase de grupos</SelectItem>
                  <SelectItem value="eliminacion">Eliminación</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex gap-2">
                <Select value={jugadorAId} onValueChange={setJugadorAId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Jugador A" />
                  </SelectTrigger>
                  <SelectContent>
                    {integrantes.map((i) => (
                      <SelectItem key={i.id} value={i.id}>
                        {i.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={jugadorBId} onValueChange={setJugadorBId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Jugador B" />
                  </SelectTrigger>
                  <SelectContent>
                    {integrantes.map((i) => (
                      <SelectItem key={i.id} value={i.id}>
                        {i.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Select value={ganadorId} onValueChange={setGanadorId}>
                <SelectTrigger>
                  <SelectValue placeholder="¿Quién ganó?" />
                </SelectTrigger>
                <SelectContent>
                  {jugadorAId && (
                    <SelectItem value={jugadorAId}>
                      {nombreDe(jugadorAId)}
                    </SelectItem>
                  )}
                  {jugadorBId && (
                    <SelectItem value={jugadorBId}>
                      {nombreDe(jugadorBId)}
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
              <Button type="submit">Guardar duelo</Button>
            </form>
          </CardContent>
        </Card>

        <Card className="order-3 md:order-none">
          <CardHeader>
            <CardTitle>Agregar integrante</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddIntegrante} className="flex gap-2">
              <Input
                value={nombreNuevo}
                onChange={(e) => setNombreNuevo(e.target.value)}
                placeholder="Nombre"
              />
              <Button type="submit">Agregar</Button>
            </form>
          </CardContent>
        </Card>

        <Card className="order-4 md:order-none md:col-span-3">
          <CardHeader>
            <CardTitle>Duelos registrados</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="flex flex-col gap-2 text-sm">
              {duelos.map((d) => (
                <li
                  key={d.id}
                  className="flex flex-col gap-1 rounded-lg border px-3 py-2 sm:flex-row sm:items-center sm:justify-between"
                >
                  <span className="text-muted-foreground">
                    {d.liga} · {d.fase === "grupos" ? "Grupos" : "Eliminación"}{" "}
                    · {nombreDe(d.jugadorAId)} vs {nombreDe(d.jugadorBId)}
                  </span>
                  <span className="font-semibold">
                    Ganó {nombreDe(d.ganadorId)}
                  </span>
                </li>
              ))}
              {duelos.length === 0 && (
                <li className="text-center text-muted-foreground py-4">
                  Sin duelos registrados todavía
                </li>
              )}
            </ul>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
