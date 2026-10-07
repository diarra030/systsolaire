# Système Solaire Interactif

Application React et TypeScript permettant d’explorer le système solaire. Les planètes peuvent être visualisées dans une vue 2D animée ou dans une vue 3D interactive.

## Fonctionnalités

- Affichage animé des huit planètes autour du Soleil
- Contrôle de la vitesse de la simulation
- Pause et reprise de l’animation
- Affichage ou masquage des orbites et des noms
- Informations sur chaque planète et le Soleil
- Vue 3D interactive avec zoom, rotation et défilement
- Anneaux de Saturne et textures générées pour les planètes
- Interface responsive pour ordinateur et mobile

## Technologies

- React 19
- TypeScript
- Vite
- Tailwind CSS
- Three.js
- Oxlint

## Démarrage

Installez les dépendances :

```bash
npm install
```

Démarrez le serveur de développement :

```bash
npm run dev
```

Ouvrez l’adresse affichée par Vite, généralement :

```text
http://localhost:5173
```

## Commandes disponibles

```bash
npm run dev       # Démarre le serveur de développement
npm run build     # Compile TypeScript et génère le bundle de production
npm run lint      # Exécute Oxlint
npm run preview   # Affiche l’application de production en local
```

## Utilisation

1. Cliquez sur une planète pour afficher ses informations.
2. Cliquez sur **Visualiser en 3D** pour ouvrir la vue immersive.
3. Utilisez la souris pour tourner la planète.
4. Utilisez la molette pour zoomer.
5. Utilisez le bouton **Fermer ×** pour quitter la vue 3D.

## Structure du projet

```text
src/
├── App.tsx
├── components/
│   └── Planet3D.tsx
├── data/
│   └── planets.ts
├── index.css
└── main.tsx
```

Les informations sur les planètes sont définies dans [src/data/planets.ts](src/data/planets.ts). La vue 3D est gérée par [src/components/Planet3D.tsx](src/components/Planet3D.tsx).
