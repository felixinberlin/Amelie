import React, { useState, useEffect, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';
import {
  Waves,
  RotateCcw,
  Volume2,
  VolumeX,
  Sparkles,
  Compass,
  Trophy,
  Award,
  Send,
  Heart,
  MousePointerClick,
} from 'lucide-react';
import { Language } from '../types';
import {
  PebbleType,
  PEBBLE_CONFIGS,
  CanalCuriosity,
  CANAL_CURIOSITIES,
  simulateStoneThrow,
  calculateAcousticSkipProfile,
  evaluateCanalCuriosityDiscovery,
  SimulationResult,
  SkipPoint,
} from '../engine/zen-games/canalStoneEngine';

interface CanalSaintMartinGameProps {
  lang: Language;
}

const pick = (lang: Language, de: string, en: string, es: string) =>
  lang === 'de' ? de : lang === 'es' ? es : en;

interface Ripple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
  hopNumber: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  size: number;
  color: string;
}

interface DragState {
  isDragging: boolean;
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
  flickForce: number;
  flickAngle: number;
}

export const CanalSaintMartinGame: React.FC<CanalSaintMartinGameProps> = ({ lang }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Throw parameters
  const [selectedPebble, setSelectedPebble] = useState<PebbleType>('slate');
  const [force, setForce] = useState<number>(0.75); // 0.1 to 1.0
  const [angle, setAngle] = useState<number>(20); // degrees, optimal ~20
  const [spin, setSpin] = useState<number>(0.8); // 0.1 to 1.0
  const [isMuted, setIsMuted] = useState(false);

  // Game state
  const [isThrowing, setIsThrowing] = useState(false);
  const [lastResult, setLastResult] = useState<SimulationResult | null>(null);
  const [bestDistance, setBestDistance] = useState<number>(0);
  const [bestHops, setBestHops] = useState<number>(0);
  const [harmonyMoment, setHarmonyMoment] = useState<boolean>(false);
  const [curiosities, setCuriosities] = useState<CanalCuriosity[]>(() =>
    CANAL_CURIOSITIES.map((c) => ({ ...c }))
  );
  const [activeCuriosity, setActiveCuriosity] = useState<CanalCuriosity | null>(null);

  // Drag-and-flick slingshot state
  const dragStateRef = useRef<DragState | null>(null);

  // Audio Context Ref
  const audioCtxRef = useRef<AudioContext | null>(null);

  const initAudio = () => {
    if (!audioCtxRef.current) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        audioCtxRef.current = new AudioCtx();
      }
    }
    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      void audioCtxRef.current.resume();
    }
  };

  const playSkipSound = useCallback(
    (hopNumber: number, pebbleType: PebbleType, energyRatio: number) => {
      if (isMuted) return;
      initAudio();
      const ctx = audioCtxRef.current;
      if (!ctx) return;

      const profile = calculateAcousticSkipProfile(hopNumber, pebbleType, energyRatio);
      const now = ctx.currentTime;

      // 1. Water drop resonant sine/triangle ping with down-sweep
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(profile.fundamentalFreq, now);
      osc.frequency.exponentialRampToValueAtTime(profile.fundamentalFreq * 0.65, now + profile.decayTime);

      oscGain.gain.setValueAtTime(profile.plopGain * 0.45, now);
      oscGain.gain.exponentialRampToValueAtTime(0.001, now + profile.decayTime);

      osc.connect(oscGain);
      oscGain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + profile.decayTime);

      // 2. High-speed fluid spray noise burst
      const bufferSize = Math.floor(ctx.sampleRate * Math.min(0.08, profile.decayTime * 0.8));
      if (bufferSize > 0) {
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = (Math.random() * 2 - 1) * profile.noiseAmount;
        }

        const noiseSource = ctx.createBufferSource();
        noiseSource.buffer = noiseBuffer;

        const noiseFilter = ctx.createBiquadFilter();
        noiseFilter.type = 'bandpass';
        noiseFilter.frequency.setValueAtTime(2400 + hopNumber * 200, now);
        noiseFilter.Q.setValueAtTime(2.0, now);

        const noiseGain = ctx.createGain();
        noiseGain.gain.setValueAtTime(profile.plopGain * 0.25, now);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, now + profile.decayTime * 0.7);

        noiseSource.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noiseGain.connect(ctx.destination);

        noiseSource.start(now);
        noiseSource.stop(now + profile.decayTime);
      }
    },
    [isMuted]
  );

  // Soft zen touch sound for casual water taps
  const playWaterChime = useCallback(() => {
    if (isMuted) return;
    initAudio();
    const ctx = audioCtxRef.current;
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    const notes = [587.33, 659.25, 783.99, 880.0, 1046.5];
    const freq = notes[Math.floor(Math.random() * notes.length)];
    osc.frequency.setValueAtTime(freq, now);
    osc.frequency.exponentialRampToValueAtTime(freq * 0.85, now + 0.35);
    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.35);
  }, [isMuted]);

  // Animation refs
  const ripplesRef = useRef<Ripple[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const animFrameRef = useRef<number | null>(null);
  const flightStateRef = useRef<{
    active: boolean;
    hops: SkipPoint[];
    currentHopIdx: number;
    hopProgress: number; // 0 to 1 between hops
    currentX: number;
    currentY: number;
    stoneColor: string;
    attackAngle: number;
  }>({
    active: false,
    hops: [],
    currentHopIdx: 0,
    hopProgress: 0,
    currentX: 40,
    currentY: 180,
    stoneColor: PEBBLE_CONFIGS[selectedPebble].color,
    attackAngle: angle,
  });

  // Spawn ripples and droplets on water impact
  const triggerWaterImpact = useCallback(
    (x: number, y: number, hopNumber: number, energyRatio: number) => {
      ripplesRef.current.push({
        x,
        y,
        radius: 2,
        maxRadius: 28 + energyRatio * 32,
        alpha: 0.85,
        hopNumber,
      });

      // Spawn spray droplets
      const dropletCount = Math.floor(6 + energyRatio * 10);
      for (let i = 0; i < dropletCount; i++) {
        const angleRad = -Math.PI / 2 + (Math.random() - 0.5) * 1.6;
        const speed = 1.5 + Math.random() * 3.5 * energyRatio;
        particlesRef.current.push({
          x,
          y,
          vx: Math.cos(angleRad) * speed,
          vy: Math.sin(angleRad) * speed,
          alpha: 0.9,
          size: 1.5 + Math.random() * 2,
          color: '#e2e8f0',
        });
      }
    },
    []
  );

  // Main canvas animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let time = 0;

    const render = () => {
      time += 0.02;
      const width = canvas.width;
      const height = canvas.height;

      // Clear Canvas
      ctx.clearRect(0, 0, width, height);

      // 1. Canal Water Gradient (Deep jade / Paris autumn twilight canal)
      const waterGrad = ctx.createLinearGradient(0, height * 0.25, 0, height);
      waterGrad.addColorStop(0, '#102526'); // Far surface in shadow
      waterGrad.addColorStop(0.35, '#173b3a'); // Mid-stream canal water
      waterGrad.addColorStop(0.75, '#1c4745'); // Reflected foliage tint
      waterGrad.addColorStop(1, '#0c1b1c'); // Deep canal basin

      ctx.fillStyle = waterGrad;
      ctx.fillRect(0, height * 0.25, width, height * 0.75);

      // 2. Far Quai & Distant Arch Bridge (Passerelle des Douanes silhouette)
      const skyGrad = ctx.createLinearGradient(0, 0, 0, height * 0.25);
      skyGrad.addColorStop(0, '#2a2d34');
      skyGrad.addColorStop(1, '#1b2028');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, width, height * 0.25);

      // Distant arched footbridge silhouette
      ctx.strokeStyle = '#38424d';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(width * 0.15, height * 0.25);
      ctx.quadraticCurveTo(width * 0.5, height * 0.06, width * 0.85, height * 0.25);
      ctx.stroke();

      // Bridge railing vertical struts
      ctx.strokeStyle = '#2d3748';
      ctx.lineWidth = 1;
      for (let bx = width * 0.2; bx < width * 0.8; bx += 16) {
        const bridgeY =
          height * 0.25 -
          Math.sin(((bx - width * 0.15) / (width * 0.7)) * Math.PI) * (height * 0.18);
        ctx.beginPath();
        ctx.moveTo(bx, bridgeY);
        ctx.lineTo(bx, bridgeY + 8);
        ctx.stroke();
      }

      // Quai stone coping edge
      ctx.fillStyle = '#334155';
      ctx.fillRect(0, height * 0.24, width, 5);
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(0, height * 0.25, width, 3);

      // 3. Subtle Animated Water Light Shimmers (Sinusoidal wavelets)
      ctx.lineWidth = 1.2;
      for (let wy = height * 0.3; wy < height * 0.95; wy += 22) {
        const perspectiveScale = (wy - height * 0.25) / (height * 0.75);
        const waveSpeed = 1.2 + perspectiveScale * 0.8;
        const waveAlpha = 0.08 + perspectiveScale * 0.12;

        ctx.strokeStyle = `rgba(180, 220, 215, ${waveAlpha})`;
        ctx.beginPath();
        for (let wx = 0; wx < width; wx += 24) {
          const waveOffset =
            Math.sin(wx * 0.02 + time * waveSpeed + wy * 0.05) * (1.8 * perspectiveScale);
          if (wx === 0) ctx.moveTo(wx, wy + waveOffset);
          else ctx.lineTo(wx, wy + waveOffset);
        }
        ctx.stroke();
      }

      // 4. Update and Draw Water Ripples
      for (let i = ripplesRef.current.length - 1; i >= 0; i--) {
        const r = ripplesRef.current[i];
        r.radius += 0.85;
        r.alpha -= 0.012;

        if (r.alpha <= 0 || r.radius >= r.maxRadius) {
          ripplesRef.current.splice(i, 1);
          continue;
        }

        // Concentric elliptical ripples (perspective flattened on Y)
        ctx.save();
        ctx.beginPath();
        ctx.ellipse(r.x, r.y, r.radius, r.radius * 0.38, 0, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(204, 251, 241, ${r.alpha * 0.75})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Inner secondary echo wave
        if (r.radius > 8) {
          ctx.beginPath();
          ctx.ellipse(r.x, r.y, r.radius * 0.6, r.radius * 0.23, 0, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(153, 246, 228, ${r.alpha * 0.45})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
        ctx.restore();
      }

      // 5. Update and Draw Droplet Particles
      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const p = particlesRef.current[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.14; // Gravity
        p.alpha -= 0.025;

        if (p.alpha <= 0 || p.y > height) {
          particlesRef.current.splice(i, 1);
          continue;
        }

        ctx.fillStyle = `rgba(241, 245, 249, ${p.alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      // 6. Interactive Drag-and-Flick Cord & Trajectory Preview
      const drag = dragStateRef.current;
      const launchX = 40;
      const launchY = height * 0.55;

      if (drag && drag.isDragging && !flightStateRef.current.active) {
        // Elastic pull tension line
        ctx.save();
        ctx.strokeStyle = 'rgba(251, 191, 36, 0.75)';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(launchX, launchY);
        ctx.lineTo(drag.currentX, drag.currentY);
        ctx.stroke();

        // Aiming trajectory guide arc (dotted forward line)
        const aimDist = drag.flickForce * 220;
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.55)';
        ctx.setLineDash([5, 5]);
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(launchX, launchY);
        ctx.quadraticCurveTo(
          launchX + aimDist * 0.5,
          launchY - 35 * drag.flickForce,
          launchX + aimDist,
          launchY + 10
        );
        ctx.stroke();
        ctx.setLineDash([]);

        // Drawn pebble following mouse drag
        ctx.save();
        ctx.translate(drag.currentX, drag.currentY);
        ctx.rotate((drag.flickAngle * Math.PI) / 180);
        ctx.fillStyle = PEBBLE_CONFIGS[selectedPebble].color;
        ctx.beginPath();
        ctx.ellipse(0, 0, 13, 5, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.restore();

        // Floating tactile indicator badge
        ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
        ctx.roundRect?.(drag.currentX - 55, drag.currentY - 32, 110, 22, 6);
        ctx.fill();
        ctx.fillStyle = '#fef08a';
        ctx.font = '10px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(
          `${Math.round(drag.flickForce * 100)}% · ${drag.flickAngle}°`,
          drag.currentX,
          drag.currentY - 18
        );
        ctx.restore();
      }

      // 7. Flight Animation & Stone Physics Render
      const flight = flightStateRef.current;
      if (flight.active && flight.hops.length > 0) {
        flight.hopProgress += 0.06;

        const currentHop = flight.hops[flight.currentHopIdx];
        const prevWaterX =
          flight.currentHopIdx === 0
            ? launchX
            : (flight.hops[flight.currentHopIdx - 1].waterXPercent / 100) * width;
        const prevWaterY =
          flight.currentHopIdx === 0
            ? launchY
            : (flight.hops[flight.currentHopIdx - 1].waterYPercent / 100) * height;

        const targetWaterX = (currentHop.waterXPercent / 100) * width;
        const targetWaterY = (currentHop.waterYPercent / 100) * height;

        if (flight.hopProgress >= 1.0) {
          // Stone hit the water!
          flight.currentHopIdx++;
          flight.hopProgress = 0;

          // Sound and ripples at contact point
          triggerWaterImpact(
            targetWaterX,
            targetWaterY,
            currentHop.hopNumber,
            currentHop.energyRatio
          );
          playSkipSound(currentHop.hopNumber, selectedPebble, currentHop.energyRatio);

          if (flight.currentHopIdx >= flight.hops.length) {
            // Flight finished!
            flight.active = false;
            setIsThrowing(false);
          }
        } else {
          // In mid-air between hops: parabolic trajectory
          const t = flight.hopProgress;
          const arcHeight = Math.max(12, 45 * currentHop.energyRatio);

          flight.currentX = prevWaterX + (targetWaterX - prevWaterX) * t;
          // Parabola: 4 * h * t * (1 - t)
          const baselineY = prevWaterY + (targetWaterY - prevWaterY) * t;
          flight.currentY = baselineY - 4 * arcHeight * t * (1 - t);

          // Draw Stone Trajectory Trail
          ctx.strokeStyle = 'rgba(253, 224, 71, 0.45)';
          ctx.setLineDash([4, 4]);
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(prevWaterX, prevWaterY);
          ctx.quadraticCurveTo(
            (prevWaterX + targetWaterX) / 2,
            baselineY - arcHeight * 1.5,
            flight.currentX,
            flight.currentY
          );
          ctx.stroke();
          ctx.setLineDash([]);

          // Draw Stone in flight (elliptical disc tilted at attack angle)
          ctx.save();
          ctx.translate(flight.currentX, flight.currentY);
          ctx.rotate((flight.attackAngle * Math.PI) / 180);

          // Pebble drop shadow
          ctx.fillStyle = 'rgba(15, 23, 42, 0.3)';
          ctx.beginPath();
          ctx.ellipse(0, 5, 11, 4.5, 0, 0, Math.PI * 2);
          ctx.fill();

          // Pebble body
          ctx.fillStyle = flight.stoneColor;
          ctx.beginPath();
          ctx.ellipse(0, 0, 10, 4, 0, 0, Math.PI * 2);
          ctx.fill();

          // Specular gleam along upper rim
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.ellipse(-1, -1, 8, 2.5, 0, Math.PI, Math.PI * 2);
          ctx.stroke();
          ctx.restore();
        }
      } else if (!flight.active && (!drag || !drag.isDragging)) {
        // Ready state: Stone resting at the launch point on the left quai
        const glowPulse = 0.5 + Math.sin(time * 3) * 0.2;
        ctx.fillStyle = `rgba(251, 191, 36, ${glowPulse * 0.4})`;
        ctx.beginPath();
        ctx.arc(launchX, launchY, 18, 0, Math.PI * 2);
        ctx.fill();

        // Pebble ready to be thrown
        ctx.save();
        ctx.translate(launchX, launchY);
        ctx.rotate((angle * Math.PI) / 180);
        ctx.fillStyle = PEBBLE_CONFIGS[selectedPebble].color;
        ctx.beginPath();
        ctx.ellipse(0, 0, 12, 4.5, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.lineWidth = 1.2;
        ctx.stroke();
        ctx.restore();
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [selectedPebble, angle, triggerWaterImpact, playSkipSound]);

  // Execute a throw with custom or current parameters
  const executeThrow = (overrideForce?: number, overrideAngle?: number) => {
    if (isThrowing) return;
    initAudio();

    const throwForce = overrideForce ?? force;
    const throwAngle = overrideAngle ?? angle;

    const result = simulateStoneThrow(throwForce, throwAngle, spin, selectedPebble);
    setLastResult(result);
    setIsThrowing(true);

    if (result.totalDistance > bestDistance) setBestDistance(result.totalDistance);
    if (result.hops.length > bestHops) setBestHops(result.hops.length);

    // Amélie harmony moment
    const bocquetScore = Math.max(0, 1 - Math.pow(Math.abs(throwAngle - 20) / 22, 2));
    if (result.hops.length >= 5 || bocquetScore >= 0.9) {
      setHarmonyMoment(true);
    } else {
      setHarmonyMoment(false);
    }

    // Evaluate discovery of canal curiosities
    const { newlyDiscovered, updatedCuriosities } = evaluateCanalCuriosityDiscovery(
      curiosities,
      result.totalDistance,
      result.hops.length
    );

    if (newlyDiscovered) {
      setCuriosities(updatedCuriosities);
      setActiveCuriosity(newlyDiscovered);
      try {
        void confetti({
          particleCount: 55,
          spread: 60,
          origin: { y: 0.65 },
          colors: ['#38bdf8', '#34d399', '#f59e0b', '#f43f5e'],
        });
      } catch {
        // Confetti fallback
      }
    }

    // Initialize flight state
    flightStateRef.current = {
      active: true,
      hops: result.hops,
      currentHopIdx: 0,
      hopProgress: 0,
      currentX: 40,
      currentY: (canvasRef.current?.height ?? 320) * 0.55,
      stoneColor: PEBBLE_CONFIGS[selectedPebble].color,
      attackAngle: throwAngle,
    };
  };

  // Canvas Mouse & Touch Interaction Helpers
  const getCanvasCoords = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  };

  const handlePointerDown = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    if (isThrowing) return;
    initAudio();
    const coords = getCanvasCoords(e);
    const launchX = 40;
    const launchY = (canvasRef.current?.height ?? 320) * 0.55;
    const distToStone = Math.hypot(coords.x - launchX, coords.y - launchY);

    if (distToStone <= 55 || coords.x < 90) {
      // Start slingshot pull
      dragStateRef.current = {
        isDragging: true,
        startX: launchX,
        startY: launchY,
        currentX: coords.x,
        currentY: coords.y,
        flickForce: force,
        flickAngle: angle,
      };
    } else {
      // Casual water tap: ripples and soft chime
      triggerWaterImpact(coords.x, coords.y, 1, 0.35);
      playWaterChime();
    }
  };

  const handlePointerMove = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    if (!dragStateRef.current?.isDragging || isThrowing) return;
    const coords = getCanvasCoords(e);
    const launchX = 40;
    const launchY = (canvasRef.current?.height ?? 320) * 0.55;

    const dx = launchX - coords.x;
    const dy = coords.y - launchY;
    const pullDist = Math.hypot(dx, dy);

    // Compute interactive force and attack angle from pull vector
    const nextForce = Math.min(1.0, Math.max(0.25, pullDist / 120));
    const nextAngle = Math.min(38, Math.max(12, Math.round(20 + (dy / Math.max(20, pullDist)) * 24)));

    dragStateRef.current.currentX = coords.x;
    dragStateRef.current.currentY = coords.y;
    dragStateRef.current.flickForce = nextForce;
    dragStateRef.current.flickAngle = nextAngle;

    setForce(nextForce);
    setAngle(nextAngle);
  };

  const handlePointerUp = () => {
    if (!dragStateRef.current?.isDragging) return;
    const drag = dragStateRef.current;
    dragStateRef.current = null;

    const launchX = 40;
    const launchY = (canvasRef.current?.height ?? 320) * 0.55;
    const pullDist = Math.hypot(launchX - drag.currentX, launchY - drag.currentY);

    if (pullDist >= 25 && !isThrowing) {
      executeThrow(drag.flickForce, drag.flickAngle);
    }
  };

  const pebbleConfig = PEBBLE_CONFIGS[selectedPebble];
  const bocquetEfficiency = Math.round(
    Math.max(0, 1 - Math.pow(Math.abs(angle - 20) / 22, 2)) * 100
  );

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-emerald-950 via-slate-900 to-teal-950 text-white rounded-2xl p-6 sm:p-8 border border-teal-800/40 shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-teal-900/80 text-teal-200 border border-teal-700/60">
              <Waves className="w-3.5 h-3.5 text-teal-300" />
              <span>
                {pick(
                  lang,
                  'Amélies Lieblingsvergnügen № 6',
                  "Amélie's Favorite Pleasure № 6",
                  'El placer favorito de Amélie № 6'
                )}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight text-teal-50">
              {pick(
                lang,
                'Steinehüpfen auf dem Canal Saint-Martin',
                'Stone Skipping on the Canal Saint-Martin',
                'Rebotar piedras en el Canal Saint-Martin'
              )}
            </h2>
            <p className="text-sm text-teal-200/90 max-w-2xl leading-relaxed">
              {pick(
                lang,
                '„Amélie liebt es, flache Steine auf dem Canal Saint-Martin hüpfen zu lassen.“ Ziehen Sie den Stein auf dem Quai zurück oder justieren Sie den 20°-Bocquet-Winkel – und lauschen Sie dem ASMR-Klang des Wassers.',
                '"Amélie loves skipping flat stones across the Canal Saint-Martin." Pull back the stone on the quay or dial in the 20° Bocquet angle — and listen to the ASMR sound of water.',
                '«A Amélie le encanta hacer rebotar piedras planas en el Canal Saint-Martin». Tira de la piedra hacia atrás en el muelle o ajusta el ángulo de 20° — y escucha el sonido ASMR del agua.'
              )}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-teal-300 hover:text-teal-100 transition-colors"
              title={isMuted ? 'Ton an' : 'Ton aus'}
            >
              {isMuted ? <VolumeX className="w-5 h-5 text-rose-400" /> : <Volume2 className="w-5 h-5" />}
            </button>
            <div className="flex gap-2">
              <div className="px-3 py-2 rounded-xl bg-slate-800/70 border border-slate-700/80 text-center">
                <span className="block text-[10px] text-teal-300 uppercase tracking-wider font-mono">
                  {pick(lang, 'Rekord Weite', 'Best Dist.', 'Mejor dist.')}
                </span>
                <span className="text-base font-bold text-amber-300 font-mono">
                  {bestDistance} m
                </span>
              </div>
              <div className="px-3 py-2 rounded-xl bg-slate-800/70 border border-slate-700/80 text-center">
                <span className="block text-[10px] text-teal-300 uppercase tracking-wider font-mono">
                  {pick(lang, 'Max Sprünge', 'Max Skips', 'Máx saltos')}
                </span>
                <span className="text-base font-bold text-teal-300 font-mono">{bestHops}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Interactive Canvas Viewport */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-300 bg-slate-900 shadow-inner group">
        <canvas
          ref={canvasRef}
          width={800}
          height={320}
          onMouseDown={handlePointerDown}
          onMouseMove={handlePointerMove}
          onMouseUp={handlePointerUp}
          onTouchStart={handlePointerDown}
          onTouchMove={handlePointerMove}
          onTouchEnd={handlePointerUp}
          className="w-full h-auto block select-none cursor-crosshair active:cursor-grabbing touch-none"
        />

        {/* Tactile interaction hint pill */}
        <div className="absolute bottom-3 left-4 px-3 py-1.5 rounded-full bg-slate-950/70 backdrop-blur-xs border border-white/10 text-[11px] text-slate-300 flex items-center gap-1.5 pointer-events-none transition-opacity">
          <MousePointerClick className="w-3.5 h-3.5 text-amber-400" />
          <span>
            {pick(
              lang,
              'Kiesel ziehen & schnipsen, oder ins Wasser tippen',
              'Pull & flick pebble, or tap water for ripples',
              'Arrastra y suelta la piedra, o toca el agua'
            )}
          </span>
        </div>

        {/* Amélie Harmony Toast Banner */}
        {harmonyMoment && (
          <div className="absolute bottom-3 right-4 bg-amber-950/85 backdrop-blur-md border border-amber-400/60 text-amber-100 rounded-xl px-4 py-2 text-xs flex items-center gap-2 shadow-lg animate-fade-in pointer-events-none">
            <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
            <span>
              {pick(
                lang,
                '„Amélie empfindet eine vollkommene Harmonie…“',
                '"Amélie feels a sense of perfect harmony with the world…"',
                '«Amélie siente una armonía perfecta con el mundo…»'
              )}
            </span>
          </div>
        )}

        {/* Discovery Overlay Banner */}
        {activeCuriosity && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 max-w-md w-11/12 bg-slate-900/95 backdrop-blur-md border border-amber-400/80 text-amber-50 rounded-xl p-4 shadow-2xl flex items-start gap-3 z-20 animate-fade-in">
            <span className="text-3xl shrink-0">{activeCuriosity.icon}</span>
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-300 tracking-wide uppercase">
                <Trophy className="w-3.5 h-3.5 text-amber-400" />
                <span>
                  {pick(
                    lang,
                    'Kanal-Geheimnis entdeckt!',
                    'Canal Curiosity Unlocked!',
                    '¡Secreto del canal desbloqueado!'
                  )}
                </span>
              </div>
              <h4 className="font-serif font-bold text-base text-white">
                {pick(
                  lang,
                  activeCuriosity.titleDe,
                  activeCuriosity.titleEn,
                  activeCuriosity.titleEs
                )}
              </h4>
              <p className="text-xs text-stone-300 leading-relaxed">
                {pick(lang, activeCuriosity.loreDe, activeCuriosity.loreEn, activeCuriosity.loreEs)}
              </p>
            </div>
            <button
              onClick={() => setActiveCuriosity(null)}
              className="text-stone-400 hover:text-white p-1 ml-auto text-sm"
            >
              ✕
            </button>
          </div>
        )}
      </div>

      {/* Controls Deck */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-stone-50 border border-stone-200 rounded-2xl p-6 shadow-xs">
        {/* 1. Pebble Selection */}
        <div className="space-y-3">
          <label className="text-xs font-semibold text-stone-600 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>{pick(lang, '1. Kieselstein wählen', '1. Choose Pebble', '1. Elegir piedra')}</span>
          </label>
          <div className="grid grid-cols-2 gap-2">
            {(Object.keys(PEBBLE_CONFIGS) as PebbleType[]).map((type) => {
              const cfg = PEBBLE_CONFIGS[type];
              const isSelected = selectedPebble === type;
              return (
                <button
                  key={type}
                  onClick={() => setSelectedPebble(type)}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'bg-amber-100/80 border-amber-500 shadow-xs'
                      : 'bg-white border-stone-200 hover:border-stone-300 hover:bg-stone-50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full border border-black/20"
                      style={{ backgroundColor: cfg.color }}
                    />
                    <span className="text-xs font-bold text-stone-800">
                      {pick(
                        lang,
                        cfg.nameDe.split(' ')[0],
                        cfg.nameEn.split(' ')[0],
                        cfg.nameEs.split(' ')[0]
                      )}
                    </span>
                  </div>
                  <div className="mt-1 flex items-center justify-between text-[10px] text-stone-500 font-mono">
                    <span>{cfg.mass}g</span>
                    <span>{Math.round(cfg.flatness * 100)}% flat</span>
                  </div>
                </button>
              );
            })}
          </div>
          <p className="text-xs text-stone-600 italic bg-amber-50/60 p-2.5 rounded-lg border border-amber-200/50">
            {pick(
              lang,
              pebbleConfig.descriptionDe,
              pebbleConfig.descriptionEn,
              pebbleConfig.descriptionEs
            )}
          </p>
        </div>

        {/* 2. Angle and Bocquet Hydrodynamics */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-stone-600 uppercase tracking-wider flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-teal-600" />
              <span>{pick(lang, '2. Anstellwinkel', '2. Attack Angle', '2. Ángulo de ataque')}</span>
            </label>
            <span
              className={`text-xs font-mono font-bold px-2 py-0.5 rounded-md ${
                Math.abs(angle - 20) <= 2
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : 'bg-stone-200 text-stone-700'
              }`}
            >
              {angle}° {Math.abs(angle - 20) <= 2 && '★ Optimal (20°)'}
            </span>
          </div>

          <input
            type="range"
            min={10}
            max={40}
            step={1}
            value={angle}
            disabled={isThrowing}
            onChange={(e) => setAngle(Number(e.target.value))}
            className="w-full accent-teal-600 cursor-pointer"
          />

          <div className="flex justify-between text-[10px] text-stone-400 font-mono">
            <span>10° (Zu flach)</span>
            <span className="text-emerald-700 font-bold">20° Bocquet</span>
            <span>40° (Zu steil)</span>
          </div>

          <div className="bg-stone-100/90 rounded-lg p-2.5 border border-stone-200/80 text-xs space-y-1">
            <div className="flex justify-between items-center text-stone-600 font-medium">
              <span>{pick(lang, 'Bocquet-Effizienz:', 'Bocquet Efficiency:', 'Eficiencia Bocquet:')}</span>
              <span className="font-mono font-bold text-teal-700">{bocquetEfficiency}%</span>
            </div>
            <div className="w-full bg-stone-200 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-teal-600 h-full transition-all duration-300"
                style={{ width: `${bocquetEfficiency}%` }}
              />
            </div>
          </div>
        </div>

        {/* 3. Force, Spin & Action */}
        <div className="space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-semibold text-stone-600 uppercase tracking-wider">
                  {pick(lang, 'Wurfkraft', 'Flick Power', 'Fuerza')}
                </span>
                <span className="text-xs font-mono font-bold text-stone-700">
                  {Math.round(force * 100)}%
                </span>
              </div>
              <input
                type="range"
                min={0.2}
                max={1.0}
                step={0.05}
                value={force}
                disabled={isThrowing}
                onChange={(e) => setForce(Number(e.target.value))}
                className="w-full accent-amber-600 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-semibold text-stone-600 uppercase tracking-wider">
                  {pick(lang, 'Gyroskop-Drall (Spin)', 'Gyroscopic Spin', 'Giro giroscópico')}
                </span>
                <span className="text-xs font-mono font-bold text-stone-700">
                  {Math.round(spin * 100)}%
                </span>
              </div>
              <input
                type="range"
                min={0.2}
                max={1.0}
                step={0.05}
                value={spin}
                disabled={isThrowing}
                onChange={(e) => setSpin(Number(e.target.value))}
                className="w-full accent-amber-600 cursor-pointer"
              />
            </div>
          </div>

          <button
            onClick={() => executeThrow()}
            disabled={isThrowing}
            className={`w-full py-3.5 px-4 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 shadow-md transition-all ${
              isThrowing
                ? 'bg-stone-300 text-stone-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-teal-700 to-emerald-700 hover:from-teal-800 hover:to-emerald-800 text-white active:scale-[0.98]'
            }`}
          >
            <Send className="w-4 h-4" />
            <span>
              {isThrowing
                ? pick(lang, 'Kiesel fliegt...', 'Pebble skipping...', 'La piedra rebota...')
                : pick(lang, 'Kiesel werfen', 'Flick Pebble', 'Lanzar piedra')}
            </span>
          </button>
        </div>
      </div>

      {/* Throw Summary Card */}
      {lastResult && (
        <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-teal-100 text-teal-800">
                {lastResult.hops.length} {pick(lang, 'Sprünge', 'Skips', 'Saltos')}
              </span>
              <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                {lastResult.totalDistance} m
              </span>
            </div>
            <p className="text-sm text-stone-700 font-medium">
              {pick(lang, lastResult.sinkReasonDe, lastResult.sinkReasonEn, lastResult.sinkReasonEs)}
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => {
                setAngle(20);
                setForce(0.85);
                setSpin(0.9);
                setSelectedPebble('slate');
              }}
              className="text-xs font-semibold px-3 py-2 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-300 transition-colors flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{pick(lang, 'Optimale Parameter laden', 'Load Optimal Setup', 'Ajuste óptimo')}</span>
            </button>
          </div>
        </div>
      )}

      {/* Canal Curiosities Tray */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-serif font-bold text-stone-800 flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-600" />
            <span>
              {pick(
                lang,
                'Geheimnisse des Canal Saint-Martin',
                'Curiosities of Canal Saint-Martin',
                'Misterios del Canal Saint-Martin'
              )}
            </span>
          </h3>
          <span className="text-xs text-stone-500 font-mono">
            {curiosities.filter((c) => c.discovered).length} / {curiosities.length}{' '}
            {pick(lang, 'entdeckt', 'discovered', 'descubiertos')}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {curiosities.map((c) => {
            const isUnlocked = c.discovered;
            return (
              <div
                key={c.id}
                onClick={() => isUnlocked && setActiveCuriosity(c)}
                className={`p-3.5 rounded-xl border transition-all ${
                  isUnlocked
                    ? 'bg-white border-amber-200 hover:border-amber-400 cursor-pointer shadow-xs'
                    : 'bg-stone-100/60 border-stone-200/80 opacity-60'
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className={`text-2xl ${isUnlocked ? '' : 'filter grayscale'}`}>{c.icon}</span>
                  <div className="space-y-0.5">
                    <h4 className="text-xs font-bold text-stone-800">
                      {isUnlocked
                        ? pick(lang, c.titleDe, c.titleEn, c.titleEs)
                        : pick(lang, 'Verstecktes Geheimnis', 'Hidden Curiosity', 'Secreto oculto')}
                    </h4>
                    <p className="text-[11px] text-stone-500">
                      {isUnlocked
                        ? pick(
                            lang,
                            c.loreDe.slice(0, 75) + '...',
                            c.loreEn.slice(0, 75) + '...',
                            c.loreEs.slice(0, 75) + '...'
                          )
                        : `${pick(lang, 'Benötigt', 'Requires', 'Requiere')} ≥ ${c.distanceThreshold}m & ${c.hopsThreshold} ${pick(lang, 'Sprünge', 'skips', 'saltos')}`}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
