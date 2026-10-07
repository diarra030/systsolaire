export interface Planet {
  id: string;
  name: string;
  nameFr: string;
  color: string;
  size: number;
  orbitRadius: number;
  orbitalPeriod: number;
  distanceFromSun: number;
  diameter: number;
  description: string;
  moons: number;
  temperature: string;
  animationDuration: number;
}

export const planets: Planet[] = [
  {
    id: 'mercury',
    name: 'Mercury',
    nameFr: 'Mercure',
    color: '#b5b5b5',
    size: 8,
    orbitRadius: 80,
    orbitalPeriod: 88,
    distanceFromSun: 57.9,
    diameter: 4879,
    description: 'La plus petite planète et la plus proche du Soleil. Sa surface est criblée de cratères, semblable à notre Lune.',
    moons: 0,
    temperature: '-180°C à 430°C',
    animationDuration: 8,
  },
  {
    id: 'venus',
    name: 'Venus',
    nameFr: 'Vénus',
    color: '#e8cda0',
    size: 12,
    orbitRadius: 120,
    orbitalPeriod: 225,
    distanceFromSun: 108.2,
    diameter: 12104,
    description: 'Souvent appelée la "jumelle de la Terre" en raison de sa taille similaire. Son atmosphère dense crée un effet de serre extrême.',
    moons: 0,
    temperature: '462°C (moyenne)',
    animationDuration: 12,
  },
  {
    id: 'earth',
    name: 'Earth',
    nameFr: 'Terre',
    color: '#4da6ff',
    size: 13,
    orbitRadius: 165,
    orbitalPeriod: 365,
    distanceFromSun: 149.6,
    diameter: 12756,
    description: 'Notre planète ! La seule connue pour abriter la vie. Elle possède de l\'eau liquide en abondance à sa surface.',
    moons: 1,
    temperature: '15°C (moyenne)',
    animationDuration: 16,
  },
  {
    id: 'mars',
    name: 'Mars',
    nameFr: 'Mars',
    color: '#e07050',
    size: 10,
    orbitRadius: 210,
    orbitalPeriod: 687,
    distanceFromSun: 227.9,
    diameter: 6792,
    description: 'La "planète rouge" en raison de l\'oxyde de fer à sa surface. Elle possède le plus grand volcan du système solaire : Olympus Mons.',
    moons: 2,
    temperature: '-63°C (moyenne)',
    animationDuration: 22,
  },
  {
    id: 'jupiter',
    name: 'Jupiter',
    nameFr: 'Jupiter',
    color: '#c8a060',
    size: 28,
    orbitRadius: 280,
    orbitalPeriod: 4333,
    distanceFromSun: 778.5,
    diameter: 142984,
    description: 'La plus grande planète du système solaire. Sa Grande Tache Rouge est une tempête qui dure depuis plus de 400 ans.',
    moons: 95,
    temperature: '-110°C (nuages)',
    animationDuration: 36,
  },
  {
    id: 'saturn',
    name: 'Saturn',
    nameFr: 'Saturne',
    color: '#e8d088',
    size: 24,
    orbitRadius: 350,
    orbitalPeriod: 10759,
    distanceFromSun: 1434,
    diameter: 120536,
    description: 'Célèbre pour ses magnifiques anneaux composés de glace et de roche. C\'est la planète la moins dense du système solaire.',
    moons: 146,
    temperature: '-140°C (nuages)',
    animationDuration: 48,
  },
  {
    id: 'uranus',
    name: 'Uranus',
    nameFr: 'Uranus',
    color: '#7de8e8',
    size: 18,
    orbitRadius: 410,
    orbitalPeriod: 30687,
    distanceFromSun: 2871,
    diameter: 51118,
    description: 'Une géante de glace qui tourne sur le côté ! Son axe de rotation est incliné à 98°, ce qui est unique dans le système solaire.',
    moons: 28,
    temperature: '-195°C (nuages)',
    animationDuration: 60,
  },
  {
    id: 'neptune',
    name: 'Neptune',
    nameFr: 'Neptune',
    color: '#4060e8',
    size: 17,
    orbitRadius: 460,
    orbitalPeriod: 60190,
    distanceFromSun: 4495,
    diameter: 49528,
    description: 'La planète la plus éloignée du Soleil. Elle possède les vents les plus rapides du système solaire, atteignant 2100 km/h.',
    moons: 16,
    temperature: '-200°C (nuages)',
    animationDuration: 72,
  },
];

export const sunData = {
  id: 'sun',
  name: 'Le Soleil',
  diameter: 1392700,
  temperature: '5500°C (surface)',
  description: 'Notre étoile ! Une boule de gaz chaud (principalement hydrogène et hélium) qui fournit lumière et chaleur à tout le système solaire.',
  age: '4,6 milliards d\'années',
  type: 'Étoile naine jaune (G2V)',
};
