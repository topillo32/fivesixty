# FiveSixtyApp

Boilerplate Next.js + Firebase, listo para arrancar.

## Setup

```bash
npm install
npm run dev
```

## Conexión a Firebase

Las credenciales están en `.env.local` / `.env.production`, apuntando al mismo proyecto Firebase (`beybladex-bb730`). La inicialización está en [src/services/firebase.ts](src/services/firebase.ts) (`db` para Firestore, `auth` para Authentication).

## Vercel

No requiere `vercel.json` (Next.js se autodetecta). Al importar el repo en Vercel, agrega las mismas variables de entorno del `.env` en el dashboard del proyecto.
