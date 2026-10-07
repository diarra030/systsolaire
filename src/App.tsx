import { useCallback, useEffect, useRef, useState } from 'react';
import Planet3D from './components/Planet3D';
import { planets, sunData } from './data/planets';
import type { Planet } from './data/planets';

function useScale(containerSize: number) {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const updateScale = () => {
      const availableWidth = window.innerWidth - 32;
      const availableHeight = window.innerHeight - 280;
      const maxDim = Math.min(availableWidth, availableHeight);
      setScale(Math.min(1, maxDim / containerSize));
    };

    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, [containerSize]);

  return scale;
}

type SelectedBody = Planet | null;

type Position = { x: number; y: number };

function App() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState(1);
  const [selectedPlanet, setSelectedPlanet] = useState<SelectedBody>(null);
  const [hoveredPlanet, setHoveredPlanet] = useState<string | null>(null);
  const [showSunInfo, setShowSunInfo] = useState(false);
  const [showPlanet3D, setShowPlanet3D] = useState<Planet | null>(null);
  const [orbitsVisible, setOrbitsVisible] = useState(true);
  const [labelsVisible, setLabelsVisible] = useState(true);
  const animationRef = useRef<number>(0);
  const timeRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const scale = useScale(960);
  const [positions, setPositions] = useState<Record<string, Position>>({});

  const updatePositions = useCallback((time: number) => {
    const newPositions: Record<string, Position> = {};
    planets.forEach((planet) => {
      const angle = (time / planet.animationDuration) * Math.PI * 2;
      newPositions[planet.id] = {
        x: Math.cos(angle) * planet.orbitRadius,
        y: Math.sin(angle) * planet.orbitRadius,
      };
    });
    setPositions(newPositions);
  }, []);

  useEffect(() => {
    const animate = (timestamp: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp;
      const delta = (timestamp - lastTimeRef.current) / 1000;
      lastTimeRef.current = timestamp;

      if (isPlaying) {
        timeRef.current += delta * speed;
        updatePositions(timeRef.current);
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationRef.current);
  }, [isPlaying, speed, updatePositions]);

  const handlePlanetClick = (planet: Planet) => {
    setSelectedPlanet(planet);
    setShowSunInfo(false);
  };

  const handleSunClick = () => {
    setShowSunInfo(true);
    setSelectedPlanet(null);
  };

  const handleCloseInfo = () => {
    setSelectedPlanet(null);
    setShowSunInfo(false);
  };

  const speedOptions = [0.25, 0.5, 1, 2, 4, 8];

  return (
    <div className="min-h-screen bg-gray-950 text-white overflow-hidden relative">
      <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
        {Array.from({ length: 200 }, (_, index) => {
          const x = (index * 137.5) % 100;
          const y = (index * 83.7) % 100;
          const opacity = 0.2 + ((index * 17) % 80) / 100;
          const duration = 2 + ((index * 11) % 300) / 100;
          const delay = ((index * 7) % 200) / 100;

          return (
            <div
              key={index}
              className="absolute rounded-full bg-white animate-pulse"
              style={{
                width: 1 + ((index * 3) % 2) + 'px',
                height: 1 + ((index * 3) % 2) + 'px',
                top: y + '%',
                left: x + '%',
                opacity,
                animationDuration: duration + 's',
                animationDelay: delay + 's',
              }}
            />
          );
        })}
      </div>

      <header className="relative z-10 p-4 text-center">
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-yellow-300 via-orange-400 to-purple-500 bg-clip-text text-transparent">
          🌌 Système Solaire Interactif
        </h1>
        <p className="text-gray-400 mt-1 text-sm md:text-base">
          Cliquez sur une planète pour en savoir plus
        </p>
      </header>

      <main className="relative flex items-center justify-center" style={{ height: 'calc(100vh - 200px)' }}>
        <div
          className="relative"
          style={{
            width: '960px',
            height: '960px',
            transform: `scale(${scale})`,
            transformOrigin: 'center center',
          }}
        >
          <button
            type="button"
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20"
            onClick={handleSunClick}
            aria-label="Afficher les informations sur le Soleil"
          >
            <span className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-300 via-orange-400 to-red-500 shadow-[0_0_60px_rgba(255,165,0,0.6),0_0_120px_rgba(255,100,0,0.3)] animate-pulse flex items-center justify-center text-xs font-bold text-yellow-900">
              ☀️
            </span>
          </button>

          {orbitsVisible && planets.map((planet) => (
            <div
              key={`orbit-${planet.id}`}
              className="absolute top-1/2 left-1/2 rounded-full border border-gray-700/40"
              style={{
                width: planet.orbitRadius * 2 + 'px',
                height: planet.orbitRadius * 2 + 'px',
                transform: 'translate(-50%, -50%)',
              }}
            />
          ))}

          {planets.map((planet) => {
            const position = positions[planet.id] || { x: planet.orbitRadius, y: 0 };
            const isHovered = hoveredPlanet === planet.id;
            const isSelected = selectedPlanet?.id === planet.id;

            return (
              <button
                key={planet.id}
                type="button"
                className="absolute top-1/2 left-1/2 cursor-pointer transition-transform duration-200 z-10"
                style={{
                  transform: `translate(calc(-50% + ${position.x}px), calc(-50% + ${position.y}px))`,
                }}
                onClick={(event) => {
                  event.stopPropagation();
                  handlePlanetClick(planet);
                }}
                onMouseEnter={() => setHoveredPlanet(planet.id)}
                onMouseLeave={() => setHoveredPlanet(null)}
                aria-label={`Afficher les informations sur ${planet.name}`}
              >
                <span
                  className={`block rounded-full transition-all duration-200 ${isHovered || isSelected ? 'scale-150' : 'scale-100'}`}
                  style={{
                    width: planet.size + 'px',
                    height: planet.size + 'px',
                    backgroundColor: planet.color,
                    boxShadow: isHovered || isSelected
                      ? `0 0 20px ${planet.color}, 0 0 40px ${planet.color}60`
                      : `0 0 10px ${planet.color}80`,
                  }}
                />

                {planet.id === 'saturn' && (
                  <span
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-yellow-200/50 pointer-events-none"
                    style={{
                      width: planet.size * 2 + 'px',
                      height: planet.size * 0.6 + 'px',
                      transform: 'translate(-50%, -50%) rotateX(70deg)',
                    }}
                  />
                )}

                {labelsVisible && (
                  <span className={`absolute left-1/2 -translate-x-1/2 whitespace-nowrap text-xs transition-opacity duration-200 ${isHovered || isSelected ? 'opacity-100' : 'opacity-60'}`} style={{ top: planet.size + 4 + 'px' }}>
                    <span className="bg-gray-900/80 px-1.5 py-0.5 rounded text-gray-200 font-medium">
                      {planet.nameFr}
                    </span>
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-sm border-t border-gray-700 p-4 z-30">
        <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full hover:from-blue-500 hover:to-purple-500 transition-all font-medium shadow-lg"
          >
            {isPlaying ? 'Ⅱ Pause' : '▶ Lecture'}
          </button>

          <div className="flex items-center gap-2">
            <span className="text-gray-400 text-sm">Vitesse:</span>
            <div className="flex gap-1">
              {speedOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setSpeed(option)}
                  className={`px-2.5 py-1.5 rounded text-xs font-medium transition-all ${speed === option ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                >
                  {option}x
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <button type="button" onClick={() => setOrbitsVisible(!orbitsVisible)} className={`px-3 py-1.5 rounded text-xs font-medium ${orbitsVisible ? 'bg-green-600 text-white' : 'bg-gray-700 text-gray-300'}`}>
              Orbites
            </button>
            <button type="button" onClick={() => setLabelsVisible(!labelsVisible)} className={`px-3 py-1.5 rounded text-xs font-medium ${labelsVisible ? 'bg-green-600 text-white' : 'bg-gray-700 text-gray-300'}`}>
              Noms
            </button>
          </div>
        </div>
      </div>

      {(selectedPlanet || showSunInfo) && (
        <aside className="fixed top-24 right-4 z-30 w-80 max-w-[calc(100vw-2rem)] max-h-[calc(100vh-7rem)] overflow-y-auto rounded-2xl border border-gray-700 bg-gray-900/95 p-5 shadow-2xl backdrop-blur-md animate-slide-in">
          <button type="button" onClick={handleCloseInfo} className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-gray-700 hover:bg-gray-600" aria-label="Fermer les informations">
            ✕
          </button>

          {showSunInfo ? (
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-300 via-orange-400 to-red-500 shadow-[0_0_20px_rgba(255,165,0,0.5)]" />
                <h2 className="text-2xl font-bold text-yellow-400">{sunData.name}</h2>
              </div>
              <p className="text-gray-300 text-sm mb-4 leading-relaxed">{sunData.description}</p>
              <div className="space-y-2">
                <InfoRow label="Diamètre" value={`${sunData.diameter.toLocaleString()} km`} />
                <InfoRow label="Température" value={sunData.temperature} />
                <InfoRow label="Âge" value={sunData.age} />
                <InfoRow label="Type" value={sunData.type} />
              </div>
            </div>
          ) : selectedPlanet ? (
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="rounded-full shadow-lg" style={{ width: '48px', height: '48px', backgroundColor: selectedPlanet.color, boxShadow: `0 0 20px ${selectedPlanet.color}80` }} />
                <div>
                  <h2 className="text-2xl font-bold" style={{ color: selectedPlanet.color }}>{selectedPlanet.nameFr}</h2>
                  <p className="text-gray-500 text-xs">{selectedPlanet.name}</p>
                </div>
              </div>
              <p className="text-gray-300 text-sm mb-4 leading-relaxed">{selectedPlanet.description}</p>
              <div className="space-y-2">
                <InfoRow label="Diamètre" value={`${selectedPlanet.diameter.toLocaleString()} km`} />
                <InfoRow label="Distance au Soleil" value={`${selectedPlanet.distanceFromSun} M km`} />
                <InfoRow label="Période orbitale" value={`${selectedPlanet.orbitalPeriod.toLocaleString()} jours`} />
                <InfoRow label="Température" value={selectedPlanet.temperature} />
                <InfoRow label="Nombre de lunes" value={`${selectedPlanet.moons}`} />
              </div>
              <button type="button" onClick={() => setShowPlanet3D(selectedPlanet)} className="mt-5 w-full rounded-xl bg-cyan-500 px-4 py-3 font-bold text-slate-950 transition hover:bg-cyan-400">
                🔍 Visualiser en 3D
              </button>
            </div>
          ) : null}
        </aside>
      )}

      {showPlanet3D && <Planet3D planet={showPlanet3D} onClose={() => setShowPlanet3D(null)} />}

      <div className="fixed top-16 left-1/2 -translate-x-1/2 z-20">
        <div className="flex gap-1 bg-gray-900/80 backdrop-blur-sm rounded-full px-3 py-1.5 border border-gray-700/50">
          <button type="button" onClick={handleSunClick} className={`w-6 h-6 rounded-full bg-gradient-to-br from-yellow-300 to-orange-500 transition-transform hover:scale-125 ${showSunInfo ? 'scale-125 ring-2 ring-yellow-400' : ''}`} title="Soleil" aria-label="Afficher le Soleil" />
          {planets.map((planet) => (
            <button
              key={planet.id}
              type="button"
              onClick={() => handlePlanetClick(planet)}
              className={`w-5 h-5 rounded-full transition-transform hover:scale-125 ${selectedPlanet?.id === planet.id ? 'scale-125 ring-2 ring-white' : ''}`}
              style={{ backgroundColor: planet.color }}
              title={planet.nameFr}
              aria-label={planet.nameFr}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center py-1.5 border-b border-gray-800 last:border-0">
      <span className="text-gray-400 text-sm">{label}</span>
      <span className="text-white text-sm font-medium">{value}</span>
    </div>
  );
}

export default App;
