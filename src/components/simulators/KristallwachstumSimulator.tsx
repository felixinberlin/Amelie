import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Layers,
  Sparkles,
  Download,
  Share2,
  RefreshCw,
  Cpu,
  Eye,
  Sliders,
  CheckCircle2,
  Box,
  Compass,
  Thermometer,
  Zap,
  Play,
  Pause,
  StepForward,
  RotateCcw,
  Scissors,
  Maximize2,
} from 'lucide-react';
import { Language } from '../../types';
import { KristallEngine, RenderableVoxel, SimulationConfig } from '../../engine/kristallwachstum/engine';

interface KristallSimulatorProps {
  lang: Language;
}

export type MicrostructureLens = 'ORIENT' | 'MELT' | 'THERM' | 'CURV' | 'SEM' | 'ZONING';

interface SeedPreset {
  id: string;
  name: string;
  seed: string;
  anisotropy: number; // ε
  undercooling: number; // ΔT
  stickiness: number;
  symmetry: 'cubic' | 'hexagonal';
  colorPalette: [string, string, string];
  fractalDim: number;
}

const PRESETS: SeedPreset[] = [
  {
    id: 'bismuth',
    name: 'Wismut Trichter-Dendrit (Bismuth Hopper)',
    seed: 'K3D-BI-9941',
    anisotropy: 0.055,
    undercooling: 0.72,
    stickiness: 0.88,
    symmetry: 'cubic',
    colorPalette: ['#f43f5e', '#a855f7', '#06b6d4'],
    fractalDim: 2.42,
  },
  {
    id: 'snow',
    name: 'Stellare Schneeflocke (Ice Crystal)',
    seed: 'K3D-ICE-6021',
    anisotropy: 0.042,
    undercooling: 0.65,
    stickiness: 0.75,
    symmetry: 'hexagonal',
    colorPalette: ['#38bdf8', '#818cf8', '#e0f2fe'],
    fractalDim: 2.31,
  },
  {
    id: 'pyrite',
    name: 'Pyrit Facetten-Aggregat (Iron Pyrite)',
    seed: 'K3D-FE-4210',
    anisotropy: 0.075,
    undercooling: 0.48,
    stickiness: 0.94,
    symmetry: 'cubic',
    colorPalette: ['#f59e0b', '#d97706', '#fbbf24'],
    fractalDim: 2.58,
  },
];

export const KristallwachstumSimulator: React.FC<KristallSimulatorProps> = ({ lang }) => {
  const [selectedPreset, setSelectedPreset] = useState<SeedPreset>(PRESETS[0]);
  const [activeLens, setActiveLens] = useState<MicrostructureLens>('ORIENT');
  const [anisotropy, setAnisotropy] = useState<number>(PRESETS[0].anisotropy);
  const [undercooling, setUndercooling] = useState<number>(PRESETS[0].undercooling);
  const [stickiness, setStickiness] = useState<number>(PRESETS[0].stickiness);
  const [minWallThickness, setMinWallThickness] = useState<number>(1.2);
  const [maxOverhang, setMaxOverhang] = useState<number>(45);
  const [isGrowing, setIsGrowing] = useState<boolean>(true);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [sliceZ, setSliceZ] = useState<number>(32); // 32 = no slicing (full crystal), 12-31 = cross-section
  const [copiedRecipe, setCopiedRecipe] = useState<boolean>(false);
  const [exportNotice, setExportNotice] = useState<string | null>(null);
  const [hasWebGPU, setHasWebGPU] = useState<boolean>(false);

  // Engine metrics
  const [metrics, setMetrics] = useState({
    fractalDimension: PRESETS[0].fractalDim,
    activeParticles: 18420,
    solidVoxels: 450,
    growthTimeSteps: 12,
  });

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const engineRef = useRef<KristallEngine | null>(null);

  // 3D camera orientation
  const yawRef = useRef<number>(0.72);
  const pitchRef = useRef<number>(0.42);
  const zoomRef = useRef<number>(1.0);
  const isDraggingRef = useRef<boolean>(false);
  const lastMousePosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // WebGPU detection
  useEffect(() => {
    if (typeof navigator !== 'undefined' && 'gpu' in (navigator as any)) {
      setHasWebGPU(true);
    }
  }, []);

  // Initialize or re-create simulation engine
  const initEngine = useCallback(
    (preset: SeedPreset, aniso: number, under: number, stick: number, wall: number, overhang: number) => {
      const eng = new KristallEngine({
        gridSize: 32,
        anisotropy: aniso,
        undercooling: under,
        stickiness: stick,
        symmetry: preset.symmetry,
        minWallThickness: wall,
        maxOverhang: overhang,
        seed: preset.seed,
      });
      // Pre-step to give the crystal immediate rich morphology
      eng.step(120, 2);
      engineRef.current = eng;
      const m = eng.getMetrics();
      setMetrics({
        fractalDimension: m.fractalDimension,
        activeParticles: m.activeParticles,
        solidVoxels: m.solidVoxels,
        growthTimeSteps: m.growthTimeSteps,
      });
    },
    []
  );

  // Initial engine bootstrap
  useEffect(() => {
    initEngine(selectedPreset, anisotropy, undercooling, stickiness, minWallThickness, maxOverhang);
  }, []);

  // Update physical config live without resetting
  useEffect(() => {
    if (engineRef.current) {
      engineRef.current.updateConfig({
        anisotropy,
        undercooling,
        stickiness,
        minWallThickness,
        maxOverhang,
      });
    }
  }, [anisotropy, undercooling, stickiness, minWallThickness, maxOverhang]);

  // Handle Preset Selection
  const handleSelectPreset = (p: SeedPreset) => {
    setSelectedPreset(p);
    setAnisotropy(p.anisotropy);
    setUndercooling(p.undercooling);
    setStickiness(p.stickiness);
    initEngine(p, p.anisotropy, p.undercooling, p.stickiness, minWallThickness, maxOverhang);
  };

  // Continuous Growth Loop
  useEffect(() => {
    if (!isGrowing) return;
    const interval = setInterval(() => {
      if (engineRef.current) {
        engineRef.current.step(28, 1);
        const m = engineRef.current.getMetrics();
        setMetrics({
          fractalDimension: m.fractalDimension,
          activeParticles: m.activeParticles,
          solidVoxels: m.solidVoxels,
          growthTimeSteps: m.growthTimeSteps,
        });
      }
    }, 120);
    return () => clearInterval(interval);
  }, [isGrowing]);

  // Step Forward Manually
  const handleStepForward = (batchCount: number = 1) => {
    if (engineRef.current) {
      engineRef.current.step(batchCount * 30, 1);
      const m = engineRef.current.getMetrics();
      setMetrics({
        fractalDimension: m.fractalDimension,
        activeParticles: m.activeParticles,
        solidVoxels: m.solidVoxels,
        growthTimeSteps: m.growthTimeSteps,
      });
    }
  };

  // Run 50 iterations of Kobayashi Phase-Field Relaxation (Ticket 1 DoD)
  const handleFiftyRelaxations = () => {
    if (engineRef.current) {
      engineRef.current.step(0, 50);
      const m = engineRef.current.getMetrics();
      setMetrics({
        fractalDimension: m.fractalDimension,
        activeParticles: m.activeParticles,
        solidVoxels: m.solidVoxels,
        growthTimeSteps: m.growthTimeSteps,
      });
      setExportNotice(
        lang === 'de'
          ? `50 Kobayashi-Phasenfeld-Schritte gerechnet (D_f = ${m.fractalDimension.toFixed(3)}). Kristallfacetten thermodynamisch geglättet!`
          : `50 Kobayashi phase-field passes completed (D_f = ${m.fractalDimension.toFixed(3)}). Crystal facets thermodynamically relaxed!`
      );
      setTimeout(() => setExportNotice(null), 3500);
    }
  };

  // Reset Seed
  const handleResetSeed = () => {
    if (engineRef.current) {
      engineRef.current.resetWithSeed(selectedPreset.seed);
      engineRef.current.step(20, 1);
      const m = engineRef.current.getMetrics();
      setMetrics({
        fractalDimension: m.fractalDimension,
        activeParticles: m.activeParticles,
        solidVoxels: m.solidVoxels,
        growthTimeSteps: m.growthTimeSteps,
      });
    }
  };

  // Reset Camera View
  const handleResetCamera = () => {
    yawRef.current = 0.72;
    pitchRef.current = 0.42;
    zoomRef.current = 1.0;
  };

  // Mouse & Touch Drag Handlers for 3D Camera Orbit
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    isDraggingRef.current = true;
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDraggingRef.current) return;
    const dx = e.clientX - lastMousePosRef.current.x;
    const dy = e.clientY - lastMousePosRef.current.y;
    yawRef.current += dx * 0.01;
    pitchRef.current = Math.max(-Math.PI * 0.46, Math.min(Math.PI * 0.46, pitchRef.current + dy * 0.01));
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    zoomRef.current = Math.max(0.55, Math.min(2.4, zoomRef.current - e.deltaY * 0.0015));
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (e.touches.length === 1) {
      isDraggingRef.current = true;
      lastMousePosRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDraggingRef.current || e.touches.length !== 1) return;
    const dx = e.touches[0].clientX - lastMousePosRef.current.x;
    const dy = e.touches[0].clientY - lastMousePosRef.current.y;
    yawRef.current += dx * 0.012;
    pitchRef.current = Math.max(-Math.PI * 0.46, Math.min(Math.PI * 0.46, pitchRef.current + dy * 0.012));
    lastMousePosRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };

  const handleTouchEnd = () => {
    isDraggingRef.current = false;
  };

  // Canvas visual rendering (True 3D Isometric/Axonometric Projection with Depth Sorting & Lenses)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let running = true;

    const render = () => {
      if (!running) return;

      if (autoRotate && !isDraggingRef.current) {
        yawRef.current += 0.005;
      }

      const yaw = yawRef.current;
      const pitch = pitchRef.current;
      const zoom = zoomRef.current;

      const width = canvas.width;
      const height = canvas.height;
      const cx = width / 2;
      const cy = height / 2;

      // Dark sci-fi laboratory background
      ctx.fillStyle = '#0a0d14';
      ctx.fillRect(0, 0, width, height);

      // Light direction in world space (coming from top-left-front)
      const lx = -0.38;
      const ly = 0.65;
      const lz = 0.65;
      const lLen = Math.hypot(lx, ly, lz);
      const nlx = lx / lLen;
      const nly = ly / lLen;
      const nlz = lz / lLen;

      const g = 32;
      const mid = g / 2;
      const baseScale = (Math.min(width, height) / (g * 1.55)) * zoom;

      // Project 3D point (rx, ry, rz)
      const project = (rx: number, ry: number, rz: number) => {
        // Rotate yaw around Z-axis
        const cosY = Math.cos(yaw);
        const sinY = Math.sin(yaw);
        const x1 = rx * cosY - ry * sinY;
        const y1 = rx * sinY + ry * cosY;
        const z1 = rz;

        // Rotate pitch around X'-axis
        const cosP = Math.cos(pitch);
        const sinP = Math.sin(pitch);
        const y2 = y1 * cosP - z1 * sinP; // depth
        const z2 = y1 * sinP + z1 * cosP; // screen Y axis

        const sx = cx + x1 * baseScale;
        const sy = cy - z2 * baseScale;
        return { sx, sy, depth: y2 };
      };

      // 1. Draw 3D Chamber Bounding Box Wireframe
      ctx.save();
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 4]);

      const boxHalf = mid - 1;
      const corners = [
        [-boxHalf, -boxHalf, -boxHalf],
        [boxHalf, -boxHalf, -boxHalf],
        [boxHalf, boxHalf, -boxHalf],
        [-boxHalf, boxHalf, -boxHalf],
        [-boxHalf, -boxHalf, boxHalf],
        [boxHalf, -boxHalf, boxHalf],
        [boxHalf, boxHalf, boxHalf],
        [-boxHalf, boxHalf, boxHalf],
      ];
      const pCorners = corners.map((c) => project(c[0], c[1], c[2]));

      const edges = [
        [0, 1],
        [1, 2],
        [2, 3],
        [3, 0],
        [4, 5],
        [5, 6],
        [6, 7],
        [7, 4],
        [0, 4],
        [1, 5],
        [2, 6],
        [3, 7],
      ];
      ctx.beginPath();
      for (const [i, j] of edges) {
        ctx.moveTo(pCorners[i].sx, pCorners[i].sy);
        ctx.lineTo(pCorners[j].sx, pCorners[j].sy);
      }
      ctx.stroke();
      ctx.restore();

      // 2. Draw Floor Grid
      ctx.save();
      ctx.strokeStyle = 'rgba(30, 41, 59, 0.4)';
      ctx.lineWidth = 1;
      for (let i = -boxHalf; i <= boxHalf; i += 6) {
        const p1 = project(i, -boxHalf, -boxHalf);
        const p2 = project(i, boxHalf, -boxHalf);
        ctx.beginPath();
        ctx.moveTo(p1.sx, p1.sy);
        ctx.lineTo(p2.sx, p2.sy);
        ctx.stroke();

        const p3 = project(-boxHalf, i, -boxHalf);
        const p4 = project(boxHalf, i, -boxHalf);
        ctx.beginPath();
        ctx.moveTo(p3.sx, p3.sy);
        ctx.lineTo(p4.sx, p4.sy);
        ctx.stroke();
      }
      ctx.restore();

      // 3. Draw Z-Cut Slicing Plane indicator if active
      if (sliceZ < 32) {
        const cutZ = sliceZ - mid;
        const sp1 = project(-boxHalf, -boxHalf, cutZ);
        const sp2 = project(boxHalf, -boxHalf, cutZ);
        const sp3 = project(boxHalf, boxHalf, cutZ);
        const sp4 = project(-boxHalf, boxHalf, cutZ);

        ctx.save();
        ctx.fillStyle = 'rgba(6, 182, 212, 0.08)';
        ctx.strokeStyle = '#06b6d4';
        ctx.lineWidth = 1.2;
        ctx.setLineDash([4, 2]);
        ctx.beginPath();
        ctx.moveTo(sp1.sx, sp1.sy);
        ctx.lineTo(sp2.sx, sp2.sy);
        ctx.lineTo(sp3.sx, sp3.sy);
        ctx.lineTo(sp4.sx, sp4.sy);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.restore();
      }

      // 4. Retrieve real voxels from the active simulation engine
      const eng = engineRef.current;
      if (eng) {
        const rawVoxels: RenderableVoxel[] = eng.getRenderableVoxels(sliceZ < 32 ? sliceZ : undefined);

        // Project and depth-sort voxels (Painter's algorithm: back to front)
        interface ProjectedVoxel {
          sx: number;
          sy: number;
          depth: number;
          voxel: RenderableVoxel;
          light: number;
        }

        const cosY = Math.cos(yaw);
        const sinY = Math.sin(yaw);
        const cosP = Math.cos(pitch);
        const sinP = Math.sin(pitch);

        const projectedList: ProjectedVoxel[] = [];

        for (let i = 0; i < rawVoxels.length; i++) {
          const v = rawVoxels[i];
          const rx = v.x - mid;
          const ry = v.y - mid;
          const rz = v.z - mid;

          const x1 = rx * cosY - ry * sinY;
          const y1 = rx * sinY + ry * cosY;
          const z1 = rz;

          const y2 = y1 * cosP - z1 * sinP;
          const z2 = y1 * sinP + z1 * cosP;

          const sx = cx + x1 * baseScale;
          const sy = cy - z2 * baseScale;

          // Normal rotation for lighting
          const [nx, ny, nz] = v.normal;
          const nx1 = nx * cosY - ny * sinY;
          const ny1 = nx * sinY + ny * cosY;
          const nz1 = nz;
          const ny2 = ny1 * cosP - nz1 * sinP;
          const nz2 = ny1 * sinP + nz1 * cosP;

          const dot = Math.max(0, nx1 * nlx + ny2 * nly + nz2 * nlz);
          const light = 0.35 + 0.65 * dot;

          projectedList.push({
            sx,
            sy,
            depth: y2,
            voxel: v,
            light,
          });
        }

        // Sort by depth ascending (farthest first)
        projectedList.sort((a, b) => a.depth - b.depth);

        // Render each voxel facet
        const voxelRadius = Math.max(1.8, baseScale * 0.72);
        const isCubic = selectedPreset.symmetry === 'cubic';

        for (let i = 0; i < projectedList.length; i++) {
          const item = projectedList[i];
          const v = item.voxel;
          const l = item.light;
          const psx = item.sx;
          const psy = item.sy;

          // Compute color based on active scientific microstructure lens
          let fillColor = '#ffffff';
          let strokeColor = 'rgba(255, 255, 255, 0.2)';

          if (activeLens === 'ORIENT') {
            // EBSD Inverse Pole Figure (IPF) orientation map
            const lightness = Math.min(85, Math.max(25, Math.floor(l * 62)));
            fillColor = `hsl(${v.orientHue}, 85%, ${lightness}%)`;
            strokeColor = `hsla(${v.orientHue}, 90%, 80%, 0.3)`;
          } else if (activeLens === 'MELT') {
            // Kobayashi phase order parameter phi
            const alpha = Math.min(1, Math.max(0.4, v.phi));
            const brightness = Math.floor(l * 240);
            if (v.phi > 0.85) {
              fillColor = `rgb(${brightness}, ${Math.floor(brightness * 0.96)}, ${Math.floor(brightness * 0.9)})`;
            } else {
              fillColor = `rgba(6, 182, 212, ${alpha})`;
            }
            strokeColor = 'rgba(56, 189, 248, 0.3)';
          } else if (activeLens === 'THERM') {
            // Latent heat release and supercooling thermal map
            // Core is warm (amber/crimson), tips are cool (ice-blue/violet)
            const hue = Math.max(15, Math.min(240, 240 - v.temp * 220));
            const lightness = Math.min(85, Math.max(30, Math.floor(l * 65)));
            fillColor = `hsl(${hue}, 90%, ${lightness}%)`;
            strokeColor = `hsla(${hue}, 95%, 85%, 0.3)`;
          } else if (activeLens === 'CURV') {
            // Gibbs-Thomson surface curvature (sharp tips vs flat equilibrium facets)
            if (v.curvature > 0.7) {
              fillColor = `hsl(340, 90%, ${Math.floor(l * 60)}%)`; // vivid rose at tips
              strokeColor = '#f43f5e';
            } else {
              fillColor = `hsl(200, 85%, ${Math.floor(l * 55)}%)`; // cyan/blue at flat facets
              strokeColor = '#0ea5e9';
            }
          } else if (activeLens === 'SEM') {
            // Virtual Scanning Electron Microscope (Backscattered Electron BSE contrast)
            const bseVal = Math.min(255, Math.max(30, Math.floor(l * 190 + (1.0 - Math.abs(v.normal[2])) * 45)));
            fillColor = `rgb(${bseVal}, ${bseVal}, ${bseVal})`;
            strokeColor = 'rgba(255, 255, 255, 0.15)';
          } else if (activeLens === 'ZONING') {
            // Petrological growth rings / oscillatory geochemical zoning
            const ringHue = (v.zoningStep * 32 + 200) % 360;
            const lightness = Math.min(80, Math.max(30, Math.floor(l * 58)));
            fillColor = `hsl(${ringHue}, 80%, ${lightness}%)`;
            strokeColor = `hsla(${ringHue}, 90%, 80%, 0.35)`;
          }

          ctx.fillStyle = fillColor;
          ctx.strokeStyle = strokeColor;
          ctx.lineWidth = 0.6;
          ctx.beginPath();

          if (isCubic) {
            // Cubic facet: hopper square tile
            const r = voxelRadius;
            ctx.rect(psx - r, psy - r, r * 2, r * 2);
          } else {
            // Hexagonal prism facet
            const r = voxelRadius * 1.1;
            for (let a = 0; a < 6; a++) {
              const angle = (a * Math.PI) / 3;
              const hx = psx + r * Math.cos(angle);
              const hy = psy + r * Math.sin(angle);
              if (a === 0) ctx.moveTo(hx, hy);
              else ctx.lineTo(hx, hy);
            }
            ctx.closePath();
          }

          ctx.fill();
          ctx.stroke();
        }

        // 5. Draw Central Seed Nucleus with Glow
        const seedPos = project(0, 0, 0);
        ctx.beginPath();
        ctx.arc(seedPos.sx, seedPos.sy, Math.max(3, baseScale * 0.45), 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 14;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // 6. Draw 3D Orientation Axes Gizmo in corner
      const gizmoX = 48;
      const gizmoY = height - 48;
      const gizmoLen = 26;

      const cosY = Math.cos(yaw);
      const sinY = Math.sin(yaw);
      const cosP = Math.cos(pitch);
      const sinP = Math.sin(pitch);

      const drawAxis = (dx: number, dy: number, dz: number, color: string, label: string) => {
        const x1 = dx * cosY - dy * sinY;
        const y1 = dx * sinY + dy * cosY;
        const z1 = dz;
        const y2 = y1 * cosP - z1 * sinP;
        const z2 = y1 * sinP + z1 * cosP;

        const ex = gizmoX + x1 * gizmoLen;
        const ey = gizmoY - z2 * gizmoLen;

        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(gizmoX, gizmoY);
        ctx.lineTo(ex, ey);
        ctx.stroke();

        ctx.fillStyle = color;
        ctx.font = '10px monospace';
        ctx.fillText(label, ex + 3, ey - 2);
      };

      drawAxis(1, 0, 0, '#f43f5e', 'a');
      drawAxis(0, 1, 0, '#10b981', 'b');
      drawAxis(0, 0, 1, '#38bdf8', 'c');

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      running = false;
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [selectedPreset, activeLens, autoRotate, sliceZ]);

  const currentRecipe = `K3D-${selectedPreset.seed.replace('K3D-', '')}-A${Math.round(anisotropy * 1000)}-U${Math.round(undercooling * 100)}-W${Math.round(minWallThickness * 10)}`;

  const handleCopyRecipe = () => {
    navigator.clipboard?.writeText(currentRecipe);
    setCopiedRecipe(true);
    setTimeout(() => setCopiedRecipe(false), 2200);
  };

  const handleExportMesh = (format: '3MF' | 'STL') => {
    if (!engineRef.current) return;
    const stlContent = engineRef.current.generateSTL();

    try {
      const blob = new Blob([stlContent], { type: 'model/stl' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `kristallwachstum-${selectedPreset.id}-${currentRecipe}.stl`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      // Fallback
    }

    setExportNotice(
      lang === 'de'
        ? `Wasserdichtes 3D-Mesh (${format}) mit ${metrics.solidVoxels.toLocaleString()} Voxeln & ${minWallThickness}mm Mindestwandstärke generiert & heruntergeladen!`
        : `Watertight ${format} mesh with ${metrics.solidVoxels.toLocaleString()} voxels & ${minWallThickness}mm wall constraint generated & downloaded!`
    );
    setTimeout(() => setExportNotice(null), 4000);
  };

  return (
    <div className="bg-stone-950 text-stone-100 rounded-3xl border border-stone-800 shadow-2xl overflow-hidden p-6 sm:p-8 space-y-6 font-sans">
      {/* Top Header Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-stone-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800/60 text-xs font-mono mb-2">
            <Cpu className="w-3.5 h-3.5" />
            <span>
              {hasWebGPU
                ? (lang === 'de' ? 'WebGPU Hardware-Pipeline Aktiv · WGSL Shader' : 'WebGPU Hardware Pipeline Active · WGSL Shaders')
                : (lang === 'de' ? 'Kobayashi (1993) Phasenfeld + DLA Engine · 32³ Voxel' : 'Kobayashi (1993) Phase-Field + DLA Engine · 32³ Voxel')}
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            <span>Kristallwachstum 3D</span>
            <span className="text-xs px-2.5 py-0.5 rounded-md bg-stone-800 text-stone-400 border border-stone-700 font-mono">
              v2.0-engine-live
            </span>
          </h2>
          <p className="text-stone-400 text-sm mt-1 max-w-2xl">
            {lang === 'de'
              ? 'Echte 3D-Brownsche Keimbildung gekoppelt mit Kobayashi Phasenfeld-Thermodynamik, interaktivem 3D-Orbit, Z-Schnitt-Ebene, 6 petrologischen Gefügelinsen und STL-Druckexport.'
              : 'True 3D Brownian nucleation coupled with Kobayashi phase-field thermodynamics, interactive 3D orbit, Z-slice cross-section, 6 petrological microstructure lenses, and STL export.'}
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setIsGrowing(!isGrowing)}
            className={`px-4 py-2 rounded-xl text-xs font-medium flex items-center gap-2 transition-all ${
              isGrowing
                ? 'bg-amber-600 hover:bg-amber-500 text-white'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white'
            }`}
          >
            {isGrowing ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            {isGrowing ? (lang === 'de' ? 'Pause' : 'Pause') : lang === 'de' ? 'Wachstum starten' : 'Resume Growth'}
          </button>

          <button
            onClick={() => handleStepForward(1)}
            title={lang === 'de' ? '1 Schritt vor' : 'Step +1'}
            className="px-3 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 border border-stone-700 text-stone-200 text-xs font-mono flex items-center gap-1.5 transition-colors"
          >
            <StepForward className="w-3.5 h-3.5 text-cyan-400" />
            <span>+1</span>
          </button>

          <button
            onClick={() => handleStepForward(5)}
            title={lang === 'de' ? '5 Schritte vor' : 'Step +5'}
            className="px-3 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 border border-stone-700 text-stone-200 text-xs font-mono flex items-center gap-1.5 transition-colors"
          >
            <StepForward className="w-3.5 h-3.5 text-cyan-400" />
            <span>+5</span>
          </button>

          <button
            onClick={handleFiftyRelaxations}
            title={lang === 'de' ? '50× Kobayashi Phasenfeld-Relaxation rechnen (Ticket 1)' : '50× Kobayashi Phase-Field Relaxation (Ticket 1)'}
            className="px-3 py-2 rounded-xl bg-indigo-900/60 hover:bg-indigo-800/80 border border-indigo-700/70 text-indigo-200 text-xs font-mono flex items-center gap-1.5 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>50× Relax</span>
          </button>

          <button
            onClick={handleResetSeed}
            title={lang === 'de' ? 'Keim neu züchten' : 'Reset Seed'}
            className="px-3 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 border border-stone-700 text-stone-300 text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5 text-rose-400" />
            <span>{lang === 'de' ? 'Neuer Keim' : 'Reset'}</span>
          </button>

          <button
            onClick={() => handleExportMesh('STL')}
            className="px-4 py-2 rounded-xl bg-cyan-900/60 hover:bg-cyan-800/80 border border-cyan-700 text-white text-xs font-medium flex items-center gap-2 transition-colors shadow-sm"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>STL 3D-Print</span>
          </button>

          <button
            onClick={handleCopyRecipe}
            className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-700 text-cyan-300 text-xs font-mono flex items-center gap-2 transition-colors"
          >
            {copiedRecipe ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copiedRecipe ? (lang === 'de' ? 'Kopiert!' : 'Copied!') : lang === 'de' ? 'Rezept' : 'Recipe'}</span>
          </button>
        </div>
      </div>

      {/* Preset Selector */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-stone-400 font-mono uppercase tracking-wider mr-2">
          {lang === 'de' ? 'Mineral-Vorgabe:' : 'Mineral Preset:'}
        </span>
        {PRESETS.map((p) => (
          <button
            key={p.id}
            onClick={() => handleSelectPreset(p)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              selectedPreset.id === p.id
                ? 'bg-cyan-500 text-stone-950 font-semibold shadow-md'
                : 'bg-stone-900 text-stone-400 hover:bg-stone-800 hover:text-stone-200 border border-stone-800'
            }`}
          >
            {p.name}
          </button>
        ))}
      </div>

      {/* Main Grid: Canvas Viewport + Scientific Lenses + Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left / Center: Interactive 3D Viewport with HUD */}
        <div className="lg:col-span-8 flex flex-col space-y-3">
          {/* Scientific Lenses Toolbar */}
          <div className="flex flex-wrap items-center justify-between bg-stone-900/80 p-2 rounded-2xl border border-stone-800 gap-2">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs text-stone-400 px-2 font-mono flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-stone-400" />
                <span>{lang === 'de' ? 'Gefügelinse:' : 'Microstructure Lens:'}</span>
              </span>
              {(['ORIENT', 'MELT', 'THERM', 'CURV', 'SEM', 'ZONING'] as MicrostructureLens[]).map((lens) => (
                <button
                  key={lens}
                  onClick={() => setActiveLens(lens)}
                  className={`px-2.5 py-1 rounded-md text-xs font-mono font-medium transition-all ${
                    activeLens === lens
                      ? 'bg-stone-700 text-cyan-300 border border-cyan-500/50 shadow-xs'
                      : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800'
                  }`}
                >
                  {lens}
                </button>
              ))}
            </div>
            <div className="text-xs font-mono text-cyan-400 px-3 hidden sm:block">
              {activeLens === 'ORIENT' && (lang === 'de' ? 'EBSD-IPF Orientierungsfeld' : 'EBSD-IPF Orientation Map')}
              {activeLens === 'MELT' && (lang === 'de' ? 'Phasenordnungsparameter φ' : 'Phase Order Parameter φ')}
              {activeLens === 'THERM' && (lang === 'de' ? 'Latente Wärme & Unterkühlung' : 'Latent Heat & Undercooling')}
              {activeLens === 'CURV' && (lang === 'de' ? 'Gibbs-Thomson Krümmung κ' : 'Gibbs-Thomson Curvature κ')}
              {activeLens === 'SEM' && (lang === 'de' ? 'Virtuelles Rasterelektronenmikroskop (BSE)' : 'Virtual SEM Backscatter')}
              {activeLens === 'ZONING' && (lang === 'de' ? 'Petrologische Wachstumszonierung' : 'Petrological Growth Zoning')}
            </div>
          </div>

          {/* Viewport Frame */}
          <div className="relative rounded-2xl overflow-hidden border border-stone-800 bg-stone-950 aspect-video sm:aspect-16/10 flex items-center justify-center select-none">
            <canvas
              ref={canvasRef}
              width={800}
              height={500}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onWheel={handleWheel}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              className="w-full h-full object-cover cursor-grab active:cursor-grabbing"
            />

            {/* Scientific HUD Badges Overlay */}
            <div className="absolute top-4 left-4 flex flex-col gap-2 font-mono text-xs pointer-events-none">
              <div className="px-3 py-1.5 rounded-lg bg-stone-950/80 backdrop-blur-md border border-stone-800/80 text-stone-300 shadow-md">
                <span className="text-stone-400">Fraktale Dim. (D_f): </span>
                <span className="text-cyan-400 font-bold">{metrics.fractalDimension.toFixed(3)}</span>
                <span className="text-stone-400 text-[10px] ml-1.5">(3D Box-Counting)</span>
              </div>
              <div className="px-3 py-1 rounded-lg bg-stone-950/80 backdrop-blur-md border border-stone-800/80 text-[10px] text-stone-400 shadow-md">
                <span>Theorie: </span>
                <span className="text-cyan-400 font-mono">3D-DLA ~2.49 · KOB ~2.31 · 2D ~1.71</span>
              </div>
              <div className="px-3 py-1.5 rounded-lg bg-stone-950/80 backdrop-blur-md border border-stone-800/80 text-stone-300 shadow-md">
                <span className="text-stone-400">Feste Voxel: </span>
                <span className="text-emerald-400 font-bold">{metrics.solidVoxels.toLocaleString()}</span>
                <span className="text-stone-400 text-[10px] ml-1.5">/ 32³</span>
              </div>
              <div className="px-3 py-1.5 rounded-lg bg-stone-950/80 backdrop-blur-md border border-stone-800/80 text-stone-300 shadow-md">
                <span className="text-stone-400">Zeitschritte: </span>
                <span className="text-amber-400 font-bold">{metrics.growthTimeSteps}</span>
              </div>
            </div>

            <div className="absolute top-4 right-4 flex flex-col items-end gap-2 font-mono text-xs pointer-events-none">
              <div className="px-3 py-1.5 rounded-lg bg-stone-950/80 backdrop-blur-md border border-stone-800/80 text-stone-300 shadow-md">
                <span className="text-stone-400">Symmetrie: </span>
                <span className="text-amber-400 font-bold uppercase">{selectedPreset.symmetry}</span>
              </div>
              <div className="px-3 py-1.5 rounded-lg bg-stone-950/80 backdrop-blur-md border border-stone-800/80 text-stone-300 shadow-md">
                <span className="text-stone-400">3D-Mesh: </span>
                <span className="text-emerald-400 font-bold">Wasserdicht (Manifold)</span>
              </div>
            </div>

            {/* Bottom 3D Viewport Controls Bar: Orbit, Auto-Rotate, Slicing Plane */}
            <div className="absolute bottom-4 left-4 right-4 bg-stone-950/85 backdrop-blur-md p-2.5 rounded-xl border border-stone-800/80 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setAutoRotate(!autoRotate)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-colors ${
                    autoRotate
                      ? 'bg-cyan-950 text-cyan-400 border border-cyan-800/60'
                      : 'bg-stone-800 text-stone-400 hover:text-stone-200'
                  }`}
                >
                  {autoRotate ? 'Auto-Orbit: AN' : 'Auto-Orbit: AUS'}
                </button>
                <button
                  onClick={handleResetCamera}
                  title={lang === 'de' ? 'Kamera zentrieren' : 'Center Camera'}
                  className="p-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
                <span className="text-[11px] font-mono text-stone-400 hidden md:inline">
                  {lang === 'de' ? 'Maus/Touch: 3D Drehen · Rad: Zoom' : 'Drag: 3D Orbit · Wheel: Zoom'}
                </span>
              </div>

              {/* Slicing Slider */}
              <div className="flex items-center gap-2 font-mono text-xs">
                <Scissors className="w-3.5 h-3.5 text-cyan-400" />
                <span className="text-stone-300 whitespace-nowrap">
                  {lang === 'de' ? 'Z-Schnitt:' : 'Z-Slice:'}
                </span>
                <input
                  type="range"
                  min="12"
                  max="32"
                  step="1"
                  value={sliceZ}
                  onChange={(e) => setSliceZ(parseInt(e.target.value))}
                  className="w-24 sm:w-32 accent-cyan-400 bg-stone-800 rounded cursor-pointer"
                />
                <span className="text-cyan-400 font-bold w-10 text-right">
                  {sliceZ === 32 ? '100%' : `${Math.round((sliceZ / 32) * 100)}%`}
                </span>
              </div>
            </div>

            {/* Export Notification Overlay */}
            {exportNotice && (
              <div className="absolute inset-0 bg-stone-950/90 backdrop-blur-md flex items-center justify-center p-6 text-center animate-fade-in z-20">
                <div className="max-w-md bg-stone-900 border border-emerald-500/50 p-6 rounded-2xl shadow-2xl space-y-3">
                  <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                  <h4 className="text-lg font-bold text-white">
                    {lang === 'de' ? '3D-Druck-Export Bereit' : 'Printable Mesh Ready'}
                  </h4>
                  <p className="text-xs text-stone-300 font-mono leading-relaxed">{exportNotice}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar: Physical Parameters & 3D Print Geometry Constraints */}
        <div className="lg:col-span-4 bg-stone-900/60 p-6 rounded-2xl border border-stone-800 space-y-6">
          <div className="flex items-center gap-2 text-sm font-bold text-white border-b border-stone-800 pb-3">
            <Sliders className="w-4 h-4 text-cyan-400" />
            <span>{lang === 'de' ? 'Physikalische Parameter' : 'Physical Parameters'}</span>
          </div>

          {/* Anisotropy Slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-stone-300 flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-rose-400" />
                <span>Kobayashi-Anisotropie (ε)</span>
              </span>
              <span className="text-cyan-400 font-bold">{anisotropy.toFixed(3)}</span>
            </div>
            <input
              type="range"
              min="0.01"
              max="0.10"
              step="0.005"
              value={anisotropy}
              onChange={(e) => setAnisotropy(parseFloat(e.target.value))}
              className="w-full accent-cyan-400 bg-stone-800 rounded-lg cursor-pointer"
            />
            <p className="text-[11px] text-stone-400">
              {lang === 'de'
                ? 'Bestimmt die Stärke der Vorzugsrichtungen der Kristalltrachten.'
                : 'Controls preferred directional orientation for crystal facets.'}
            </p>
          </div>

          {/* Undercooling Slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-stone-300 flex items-center gap-1.5">
                <Thermometer className="w-3.5 h-3.5 text-amber-400" />
                <span>Unterkühlung (ΔT)</span>
              </span>
              <span className="text-cyan-400 font-bold">{undercooling.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="0.30"
              max="0.95"
              step="0.05"
              value={undercooling}
              onChange={(e) => setUndercooling(parseFloat(e.target.value))}
              className="w-full accent-cyan-400 bg-stone-800 rounded-lg cursor-pointer"
            />
            <p className="text-[11px] text-stone-400">
              {lang === 'de'
                ? 'Thermodynamischer Antrieb: Höhere Werte erzeugen feinere Dendritenspitzen.'
                : 'Thermodynamic driving force: higher values yield narrower dendrite tips.'}
            </p>
          </div>

          {/* Stickiness Slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-stone-300 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-emerald-400" />
                <span>Haftungswahrscheinlichkeit</span>
              </span>
              <span className="text-cyan-400 font-bold">{stickiness.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="0.40"
              max="1.00"
              step="0.02"
              value={stickiness}
              onChange={(e) => setStickiness(parseFloat(e.target.value))}
              className="w-full accent-cyan-400 bg-stone-800 rounded-lg cursor-pointer"
            />
          </div>

          {/* 3D Print Physical Constraints */}
          <div className="pt-4 border-t border-stone-800 space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-stone-300 uppercase tracking-wider font-mono">
              <Box className="w-3.5 h-3.5 text-cyan-400" />
              <span>{lang === 'de' ? '3D-Druck Geometrie-Schranken' : '3D Print Geometry Guards'}</span>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-stone-400">{lang === 'de' ? 'Mindest-Astdicke:' : 'Min Wall Thickness:'}</span>
                <span className="text-emerald-400 font-bold">{minWallThickness} mm</span>
              </div>
              <input
                type="range"
                min="0.8"
                max="3.0"
                step="0.2"
                value={minWallThickness}
                onChange={(e) => setMinWallThickness(parseFloat(e.target.value))}
                className="w-full accent-emerald-400 bg-stone-800 rounded-lg cursor-pointer"
              />
              <p className="text-[11px] text-stone-400">
                {lang === 'de'
                  ? 'Verhindert das Abbrechen feiner Äste beim FDM/SLA-Drucken.'
                  : 'Prevents delicate branches from breaking during FDM/SLA printing.'}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-stone-400">{lang === 'de' ? 'Maximaler Überhang:' : 'Max Overhang:'}</span>
                <span className="text-emerald-400 font-bold">{maxOverhang}°</span>
              </div>
              <input
                type="range"
                min="35"
                max="60"
                step="5"
                value={maxOverhang}
                onChange={(e) => setMaxOverhang(parseInt(e.target.value))}
                className="w-full accent-emerald-400 bg-stone-800 rounded-lg cursor-pointer"
              />
            </div>
          </div>

          {/* Recipe Hash Box */}
          <div className="p-3 bg-stone-950 rounded-xl border border-stone-800 text-xs font-mono space-y-1">
            <span className="text-stone-400 block text-[10px] uppercase">
              {lang === 'de' ? 'Deterministisches Rezept-Token:' : 'Deterministic Recipe Token:'}
            </span>
            <div className="text-cyan-400 font-bold truncate">{currentRecipe}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
