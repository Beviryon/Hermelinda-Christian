# Wedding Platform V2

Plateforme web privee et immersive pour le mariage de **Hermelinda & Christian**.

## Stack

- Next.js (App Router)
- React + TypeScript
- Tailwind CSS
- Firebase Firestore + Storage
- Framer Motion

## Pages

- `/login` (auth par code)
- `/home`
- `/timeline`
- `/gallery`
- `/video`
- `/music`
- `/guestbook`
- `/admin`

Toutes les routes sont protegees sauf `/login`.

## Configuration Firebase

1. Copier `.env.local.example` en `.env.local`
2. Renseigner les variables Firebase
3. Creer les collections Firestore:
   - `access_codes`
   - `messages`
   - `photos`

Exemple de document `access_codes` (id = code):

```json
{
  "code": "ABC123",
  "name": "Invite",
  "isActive": true,
  "sessionId": null,
  "lastLoginAt": null
}
```

## Lancer le projet

```bash
npm install
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000).

## Tester sans Firebase (mode demo)

Si les variables Firebase ne sont pas configurees, l'application passe
automatiquement en mode demo avec stockage local navigateur.

- code de connexion demo: `DEMO2026`
- `/admin` et `/guestbook` fonctionnent en localStorage

Vous pouvez aussi forcer ce mode avec:

```bash
NEXT_PUBLIC_DEMO_MODE=true
```

## Auth custom (session unique)

- Connexion via code
- Generation de `sessionId` UUID
- Stockage en Firestore (`sessionId`, `lastLoginAt`)
- Stockage local (`localStorage`)
- Verification de session au chargement et regulierement
- Nouvelle connexion invalide automatiquement l'ancienne
# Hermelinda-Christian
Plateforme web privée et immersive pour revivre le mariage de Hermelinda &amp; Christian, développée avec Next.js, Tailwind CSS et Firebase.
