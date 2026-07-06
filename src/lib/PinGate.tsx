"use client";

import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const STORAGE_KEY = "cup560_unlocked";
const APP_PIN = process.env.NEXT_PUBLIC_APP_PIN ?? "000000";

export function PinGate({ children }: { children: ReactNode }) {
  const [unlocked, setUnlocked] = useState<boolean | null>(null);
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setUnlocked(localStorage.getItem(STORAGE_KEY) === "true");
  }, []);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    if (pin === APP_PIN) {
      localStorage.setItem(STORAGE_KEY, "true");
      setUnlocked(true);
    } else {
      setError(true);
      setIsSubmitting(false);
    }
  }

  function handleLogout() {
    localStorage.removeItem(STORAGE_KEY);
    setPin("");
    setError(false);
    setIsSubmitting(false);
    setUnlocked(false);
  }

  if (unlocked === null) return null;

  if (!unlocked) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-6">
        <Card className="w-full max-w-xs border-t-4 border-t-primary shadow-lg shadow-black/50">
          <CardHeader className="text-center">
            <Image
              src="/images/560.png"
              alt="Copa 5-60"
              width={80}
              height={80}
              className="mx-auto mb-2 rounded-full"
              priority
            />
            <CardTitle className="text-primary">5-60 Taper Team</CardTitle>
            <CardDescription>
              Ingresá el código para continuar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <Input
                type="password"
                inputMode="numeric"
                maxLength={6}
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value);
                  setError(false);
                }}
                placeholder="●●●●●●"
                className="text-center text-lg tracking-[0.3em]"
              />
              {error && (
                <p className="text-center text-sm text-destructive">
                  Código incorrecto
                </p>
              )}
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Verificando..." : "Entrar"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="fixed right-4 top-4 z-50">
        <Button variant="outline" size="sm" onClick={handleLogout}>
          Cerrar sesión
        </Button>
      </div>
      {children}
    </div>
  );
}
