import React, { useEffect, useRef, useState, useMemo } from 'react';
import L from 'leaflet';
import {
  Layers,
  MapPin,
  Clock,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Maximize2,
  ShieldCheck,
  Compass,
  Bed,
  Check,
  AlertTriangle,
} from 'lucide-react';
import { Language } from '../../types';

export interface NoiseAreaFeature {
  id: string;
  nameDe: string;
  nameEn: string;
  nameEs: string;
  kiez: string;
  type: 'residential' | 'courtyard' | 'artery' | 'gastro' | 'park';
  surface: string;
  trafficType: string;
  // Center coordinate for marker / flying
  center: [number, number];
  // Polygon coordinates [lat, lng][]
  coordinates: [number, number][];
  // 24-hour diurnal noise in dB(A)
  hourlyDb: number[];
  spreadDb: number;
}

export const BERLIN_NOISE_AREAS: NoiseAreaFeature[] = [
  {
    id: 'kollwitz-cobblestone',
    nameDe: 'Kollwitzplatz & Rykestraße',
    nameEn: 'Kollwitzplatz & Rykestraße',
    nameEs: 'Kollwitzplatz y Rykestraße',
    kiez: 'Prenzlauer Berg',
    type: 'residential',
    surface: 'Historisches Kopfsteinpflaster (Großstein)',
    trafficType: 'Tempo 30 / Anliegerverkehr & Lastenräder',
    center: [52.5366, 13.4182],
    coordinates: [
      [52.5352, 13.4148],
      [52.5385, 13.4172],
      [52.5378, 13.4225],
      [52.5348, 13.4202],
      [52.5352, 13.4148],
    ],
    hourlyDb: [
      37, 36, 35, 36, 38, 45, 62, 64, 58, 52, 48, 45, 44, 46, 50, 55, 59, 60, 56, 52, 48, 44, 41, 39,
    ],
    spreadDb: 4.5,
  },
  {
    id: 'prenzlauer-courtyard',
    nameDe: 'Kollwitzkiez Altbau-Innenhof',
    nameEn: 'Kollwitzkiez Altbau Courtyard',
    nameEs: 'Patio Interior Altbau Kollwitzkiez',
    kiez: 'Prenzlauer Berg',
    type: 'courtyard',
    surface: 'Begrünter Innenhof / Kopfsteinpflaster-Remise',
    trafficType: 'Fußgänger & Fahrräder (Null Kfz)',
    center: [52.5362, 13.4198],
    coordinates: [
      [52.5357, 13.4185],
      [52.5372, 13.4195],
      [52.5368, 13.4215],
      [52.5353, 13.4205],
      [52.5357, 13.4185],
    ],
    hourlyDb: [
      32, 31, 31, 32, 35, 46, 43, 42, 40, 39, 38, 37, 36, 38, 41, 43, 44, 43, 41, 39, 36, 34, 33, 32,
    ],
    spreadDb: 3.0,
  },
  {
    id: 'danziger-artery',
    nameDe: 'Danziger Straße / Eberswalder Str',
    nameEn: 'Danziger Straße / Eberswalder Str Corridor',
    nameEs: 'Corredor Danziger Straße / Eberswalder',
    kiez: 'Pankow / Prenzlauer Berg',
    type: 'artery',
    surface: 'Schwerlast-Asphalt mit M10-Straßenbahngleisen',
    trafficType: 'Hauptverkehrsstraße (28.000 Kfz/Tag + Tram)',
    center: [52.5408, 13.4132],
    coordinates: [
      [52.5422, 13.4045],
      [52.5415, 13.4245],
      [52.5398, 13.4242],
      [52.5405, 13.4042],
      [52.5422, 13.4045],
    ],
    hourlyDb: [
      58, 56, 55, 57, 63, 71, 75, 76, 73, 72, 71, 71, 71, 72, 73, 74, 75, 75, 73, 70, 68, 66, 63, 60,
    ],
    spreadDb: 5.8,
  },
  {
    id: 'kastanien-gastro',
    nameDe: 'Kastanienallee & Oderberger Str (Gastro-Meile)',
    nameEn: 'Kastanienallee & Oderberger Str (Gastro Corridor)',
    nameEs: 'Kastanienallee y Oderberger Str (Zona Gastro)',
    kiez: 'Prenzlauer Berg',
    type: 'gastro',
    surface: 'Asphalt mit Schanigärten & Außengastronomie',
    trafficType: 'Mischverkehr: M1-Tram, Lieferverkehr, Fußgänger',
    center: [52.5385, 13.4085],
    coordinates: [
      [52.5365, 13.4065],
      [52.5412, 13.4105],
      [52.5406, 13.4128],
      [52.5360, 13.4085],
      [52.5365, 13.4065],
    ],
    hourlyDb: [
      52, 45, 41, 39, 41, 46, 54, 58, 59, 58, 59, 61, 62, 63, 65, 68, 71, 74, 74, 73, 71, 68, 63, 58,
    ],
    spreadDb: 6.2,
  },
  {
    id: 'torstrasse-corridor',
    nameDe: 'Torstraße / Rosenthaler Platz',
    nameEn: 'Torstraße / Rosenthaler Platz Arterial',
    nameEs: 'Torstraße y Rosenthaler Platz',
    kiez: 'Mitte',
    type: 'artery',
    surface: 'Mehrspuriger Asphalt, Lieferzonen, Busspuren',
    trafficType: 'Hauptverkehrsachse Ost-West (32.000 Kfz/Tag)',
    center: [52.5298, 13.4025],
    coordinates: [
      [52.5305, 13.3940],
      [52.5288, 13.4135],
      [52.5276, 13.4132],
      [52.5292, 13.3938],
      [52.5305, 13.3940],
    ],
    hourlyDb: [
      61, 58, 57, 59, 66, 73, 77, 77, 74, 73, 73, 74, 74, 75, 76, 77, 77, 76, 74, 71, 69, 67, 65, 63,
    ],
    spreadDb: 5.5,
  },
  {
    id: 'mauerpark-oasis',
    nameDe: 'Mauerpark Grüne Oase',
    nameEn: 'Mauerpark Green Acoustic Buffer',
    nameEs: 'Mauerpark Zona Verde Acústica',
    kiez: 'Prenzlauer Berg / Wedding',
    type: 'park',
    surface: 'Rasenflächen, wassergebundene Decke, Baumbestand',
    trafficType: 'Parkgelände (Kfz-frei, Fuß- & Radverkehr)',
    center: [52.5445, 13.4035],
    coordinates: [
      [52.5420, 13.4010],
      [52.5480, 13.4045],
      [52.5475, 13.4085],
      [52.5415, 13.4048],
      [52.5420, 13.4010],
    ],
    hourlyDb: [
      33, 32, 32, 33, 36, 42, 45, 47, 46, 45, 46, 48, 49, 50, 52, 54, 55, 54, 50, 46, 42, 38, 36, 34,
    ],
    spreadDb: 3.5,
  },
  {
    id: 'volkspark-fshain',
    nameDe: 'Volkspark Friedrichshain (Zentraler Ruhe-Kern)',
    nameEn: 'Volkspark Friedrichshain (Protected Core)',
    nameEs: 'Volkspark Friedrichshain (Núcleo de Calma)',
    kiez: 'Friedrichshain',
    type: 'park',
    surface: 'Dichter Baumbestand, Gewässer, Erdwälle',
    trafficType: 'Großpark (Vollständig Kfz-abgeschirmt)',
    center: [52.5285, 13.4325],
    coordinates: [
      [52.5255, 13.4245],
      [52.5315, 13.4285],
      [52.5305, 13.4415],
      [52.5245, 13.4375],
      [52.5255, 13.4245],
    ],
    hourlyDb: [
      30, 29, 29, 30, 33, 38, 41, 42, 41, 40, 40, 42, 43, 44, 45, 46, 47, 46, 43, 40, 37, 34, 32, 31,
    ],
    spreadDb: 2.8,
  },
  {
    id: 'simon-dach-nightlife',
    nameDe: 'Simon-Dach-Straße & Boxhagener Kiez',
    nameEn: 'Simon-Dach-Straße & Boxhagener Kiez',
    nameEs: 'Simon-Dach-Straße y Barrio Boxhagener',
    kiez: 'Friedrichshain',
    type: 'gastro',
    surface: 'Pflaster & Asphalt, dichte Bar- und Clubmeile',
    trafficType: 'Flaniermeile, Lieferverkehr, Party-Cluster',
    center: [52.5115, 13.4565],
    coordinates: [
      [52.5085, 13.4525],
      [52.5145, 13.4575],
      [52.5138, 13.4615],
      [52.5078, 13.4565],
      [52.5085, 13.4525],
    ],
    hourlyDb: [
      64, 59, 54, 46, 44, 47, 53, 56, 56, 55, 56, 58, 60, 62, 64, 67, 72, 75, 76, 75, 73, 71, 68, 66,
    ],
    spreadDb: 6.8,
  },
  {
    id: 'karl-marx-allee',
    nameDe: 'Karl-Marx-Allee / Strausberger Platz',
    nameEn: 'Karl-Marx-Allee Boulevard',
    nameEs: 'Bulevar Karl-Marx-Allee',
    kiez: 'Friedrichshain / Mitte',
    type: 'artery',
    surface: '8-spuriger Asphalt-Boulevard mit Grünstreifen',
    trafficType: 'Stadtautobahn-artiger Pendlerverkehr (35.000 Kfz)',
    center: [52.5202, 13.4295],
    coordinates: [
      [52.5222, 13.4185],
      [52.5175, 13.4435],
      [52.5158, 13.4425],
      [52.5205, 13.4178],
      [52.5222, 13.4185],
    ],
    hourlyDb: [
      62, 59, 58, 60, 68, 74, 78, 78, 75, 74, 73, 74, 75, 76, 77, 78, 78, 77, 74, 71, 69, 67, 65, 63,
    ],
    spreadDb: 5.9,
  },
  {
    id: 'warschauer-bruecke',
    nameDe: 'Warschauer Brücke & S-Bahn Viadukt',
    nameEn: 'Warschauer Brücke Transit & Club Hub',
    nameEs: 'Warschauer Brücke y Nudo de Transporte',
    kiez: 'Friedrichshain / Kreuzberg',
    type: 'artery',
    surface: 'Stahlträgerbrücke, Gleiskörper, Kopfsteinpflaster',
    trafficType: 'S-Bahn/U-Bahn-Knoten, Clubgänger, Straßenverkehr',
    center: [52.5065, 13.4495],
    coordinates: [
      [52.5085, 13.4465],
      [52.5045, 13.4525],
      [52.5035, 13.4505],
      [52.5075, 13.4445],
      [52.5085, 13.4465],
    ],
    hourlyDb: [
      68, 65, 62, 58, 59, 65, 71, 74, 73, 72, 73, 74, 75, 76, 77, 78, 78, 78, 77, 76, 75, 74, 72, 70,
    ],
    spreadDb: 6.5,
  },
];

export function getNoiseColor(db: number): {
  fill: string;
  stroke: string;
  labelDe: string;
  labelEn: string;
  labelEs: string;
  category: string;
} {
  if (db >= 75) {
    return {
      fill: '#701a75', // Dark Magenta / Fuchsia
      stroke: '#4a044e',
      labelDe: '> 75 dB(A) Extremer Dauerlärm (Gesundheitsgefahr)',
      labelEn: '> 75 dB(A) Severe Noise (Health Risk)',
      labelEs: '> 75 dB(A) Ruido severo (Riesgo biológico)',
      category: 'critical',
    };
  } else if (db >= 70) {
    return {
      fill: '#dc2626', // Red
      stroke: '#991b1b',
      labelDe: '70–75 dB(A) Hohe Lärmbelastung (Herz-Kreislauf-Risiko)',
      labelEn: '70–75 dB(A) High Noise (Cardiovascular Stress)',
      labelEs: '70–75 dB(A) Ruido elevado (Estrés cardiovascular)',
      category: 'high',
    };
  } else if (db >= 65) {
    return {
      fill: '#ea580c', // Orange
      stroke: '#c2410c',
      labelDe: '65–70 dB(A) Erhebliche Belästigung (Kommunikationsstörung)',
      labelEn: '65–70 dB(A) Significant Disturbance',
      labelEs: '65–70 dB(A) Perturbación apreciable',
      category: 'moderate-high',
    };
  } else if (db >= 60) {
    return {
      fill: '#f59e0b', // Amber
      stroke: '#d97706',
      labelDe: '60–65 dB(A) Typischer Großstadt-Durchgangsverkehr',
      labelEn: '60–65 dB(A) Typical Urban Transit',
      labelEs: '60–65 dB(A) Tráfico urbano habitual',
      category: 'moderate',
    };
  } else if (db >= 55) {
    return {
      fill: '#eab308', // Yellow
      stroke: '#ca8a04',
      labelDe: '55–60 dB(A) Spürbarer Straßenhintergrund',
      labelEn: '55–60 dB(A) Noticeable Background Traffic',
      labelEs: '55–60 dB(A) Fondo acústico moderado',
      category: 'urban-ambient',
    };
  } else if (db >= 45) {
    return {
      fill: '#84cc16', // Lime
      stroke: '#65a30d',
      labelDe: '45–55 dB(A) Ruhige Wohnstraße (Tempo 30)',
      labelEn: '45–55 dB(A) Calm Residential (30 km/h Zone)',
      labelEs: '45–55 dB(A) Calle residencial tranquila',
      category: 'calm',
    };
  } else if (db >= 35) {
    return {
      fill: '#10b981', // Emerald
      stroke: '#059669',
      labelDe: '35–45 dB(A) 🌿 Ruhe-Fenster (WHO-Schlaftauglich)',
      labelEn: '35–45 dB(A) 🌿 Tranquility Window (WHO Compliant)',
      labelEs: '35–45 dB(A) 🌿 Ventana de tranquilidad (Apta OMS)',
      category: 'quiet-window',
    };
  } else {
    return {
      fill: '#059669', // Deep Emerald / Green
      stroke: '#047857',
      labelDe: '< 35 dB(A) 🕊️ Absolute Oase / Innenhof-Sanctuary',
      labelEn: '< 35 dB(A) 🕊️ Pristine Sanctuary / Inner Courtyard',
      labelEs: '< 35 dB(A) 🕊️ Oasis de silencio absoluto',
      category: 'sanctuary',
    };
  }
}

interface KiezNoiseMapProps {
  lang: Language;
  currentHour: number;
  selectedAreaId: string;
  tranquilityThreshold: number;
  onSelectArea: (areaId: string) => void;
  onHourChange: (hour: number) => void;
}

export const KiezNoiseMap: React.FC<KiezNoiseMapProps> = ({
  lang,
  currentHour,
  selectedAreaId,
  tranquilityThreshold,
  onSelectArea,
  onHourChange,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const polygonLayersRef = useRef<{ [key: string]: L.Polygon }>({});
  const markerLayersRef = useRef<{ [key: string]: L.Marker }>({});
  const tileLayerRef = useRef<L.TileLayer | null>(null);

  const [mapStyle, setMapStyle] = useState<'google' | 'satellite' | 'dark'>('google');
  const [filterMode, setFilterMode] = useState<'all' | 'quiet' | 'night-alarm'>('all');
  const [isPlaying, setIsPlaying] = useState(false);

  // Auto-play loop for 24h diurnal simulation
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      timer = setInterval(() => {
        onHourChange((currentHour + 1) % 24);
      }, 800);
    }
    return () => clearInterval(timer);
  }, [isPlaying, currentHour, onHourChange]);

  // Map Tile Providers
  const tileUrls = {
    // Clean Google-Maps-styled light vector tile (CartoDB Positron with crisp labels)
    google: {
      url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
      attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> (Google-Style Light)',
    },
    // Satellite Aerial imagery
    satellite: {
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{x}/{y}',
      attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP',
    },
    // Night acoustic dark contrast
    dark: {
      url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
      attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> (Night Acoustic)',
    },
  };

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [52.5320, 13.4180],
      zoom: 13,
      zoomControl: false,
      attributionControl: true,
      maxZoom: 18,
      minZoom: 11,
    });

    // Custom Top-Right Zoom Control
    L.control.zoom({ position: 'topright' }).addTo(map);

    // Add Base Tile Layer
    const activeTile = tileUrls[mapStyle];
    const tiles = L.tileLayer(activeTile.url, {
      attribution: activeTile.attribution,
      maxZoom: 19,
      subdomains: 'abcd',
    }).addTo(map);
    tileLayerRef.current = tiles;

    mapInstanceRef.current = map;

    // Draw Initial Noise Areas
    BERLIN_NOISE_AREAS.forEach((area) => {
      const db = area.hourlyDb[currentHour];
      const colorSpec = getNoiseColor(db);
      const isSelected = area.id === selectedAreaId;

      const polygon = L.polygon(area.coordinates, {
        color: isSelected ? '#1e1b4b' : colorSpec.stroke,
        weight: isSelected ? 3.5 : 2,
        fillColor: colorSpec.fill,
        fillOpacity: isSelected ? 0.8 : 0.65,
        dashArray: isSelected ? '4, 4' : undefined,
      }).addTo(map);

      // Bind rich popup
      polygon.bindTooltip(
        `<strong>${area.nameDe}</strong><br/><span style="color:${colorSpec.stroke};font-weight:bold">${db} dB(A)</span> · ${area.kiez}`,
        { sticky: true, direction: 'top' }
      );

      polygon.on('click', () => {
        onSelectArea(area.id);
      });

      polygonLayersRef.current[area.id] = polygon;

      // Add center badge marker
      const customIcon = L.divIcon({
        className: 'custom-noise-badge',
        html: `<div style="background-color:${colorSpec.fill}; border: 2px solid #ffffff; box-shadow: 0 2px 6px rgba(0,0,0,0.35); color: #ffffff; border-radius: 9999px; padding: 2px 6px; font-size: 10px; font-weight: bold; font-family: monospace; text-shadow: 0 1px 2px rgba(0,0,0,0.6); display: flex; align-items: center; justify-content: center; white-space: nowrap; transform: translate(-50%, -50%);">
          ${db} dB
        </div>`,
        iconSize: [40, 20],
      });

      const marker = L.marker(area.center, { icon: customIcon }).addTo(map);
      marker.on('click', () => {
        onSelectArea(area.id);
      });
      markerLayersRef.current[area.id] = marker;
    });

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Base Tile on Style Change
  useEffect(() => {
    if (!mapInstanceRef.current || !tileLayerRef.current) return;
    mapInstanceRef.current.removeLayer(tileLayerRef.current);

    const activeTile = tileUrls[mapStyle];
    const newTiles = L.tileLayer(activeTile.url, {
      attribution: activeTile.attribution,
      maxZoom: 19,
      subdomains: 'abcd',
    }).addTo(mapInstanceRef.current);
    tileLayerRef.current = newTiles;
  }, [mapStyle]);

  // Update Polygons & Markers when currentHour, selectedAreaId, or filterMode changes
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    BERLIN_NOISE_AREAS.forEach((area) => {
      const polygon = polygonLayersRef.current[area.id];
      const marker = markerLayersRef.current[area.id];
      if (!polygon || !marker) return;

      const db = area.hourlyDb[currentHour];
      const colorSpec = getNoiseColor(db);
      const isSelected = area.id === selectedAreaId;
      const isQuiet = db <= tranquilityThreshold;
      const isNightAlarm = (currentHour >= 22 || currentHour < 6) && db > 40;

      let isVisible = true;
      if (filterMode === 'quiet' && !isQuiet) isVisible = false;
      if (filterMode === 'night-alarm' && !isNightAlarm) isVisible = false;

      if (!isVisible) {
        polygon.setStyle({ opacity: 0.1, fillOpacity: 0.05 });
        marker.setOpacity(0.15);
      } else {
        polygon.setStyle({
          color: isSelected ? '#1e1b4b' : colorSpec.stroke,
          weight: isSelected ? 3.5 : 2,
          fillColor: colorSpec.fill,
          fillOpacity: isSelected ? 0.85 : 0.65,
          dashArray: isSelected ? '4, 4' : undefined,
          opacity: 1,
        });

        // Update badge text and color
        const updatedHtml = `<div style="background-color:${colorSpec.fill}; border: 2px solid ${isSelected ? '#1e1b4b' : '#ffffff'}; box-shadow: 0 2px 6px rgba(0,0,0,0.35); color: #ffffff; border-radius: 9999px; padding: 2px 6px; font-size: 10px; font-weight: bold; font-family: monospace; text-shadow: 0 1px 2px rgba(0,0,0,0.6); display: flex; align-items: center; justify-content: center; white-space: nowrap; transform: translate(-50%, -50%);">
          ${db} dB
        </div>`;

        marker.setIcon(
          L.divIcon({
            className: 'custom-noise-badge',
            html: updatedHtml,
            iconSize: [40, 20],
          })
        );
        marker.setOpacity(1);
      }
    });
  }, [currentHour, selectedAreaId, filterMode, tranquilityThreshold]);

  // Pan to selected area when changed from outside
  const panToArea = (areaId: string) => {
    const area = BERLIN_NOISE_AREAS.find((a) => a.id === areaId);
    if (area && mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(area.center, 14.5, { duration: 0.8 });
    }
  };

  // Quick Kiez Zoom Presets
  const jumpToKiez = (bounds: [number, number], zoomLevel: number) => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(bounds, zoomLevel, { duration: 0.8 });
    }
  };

  // Stats for the active hour
  const statsAtHour = useMemo(() => {
    const total = BERLIN_NOISE_AREAS.length;
    const quietCount = BERLIN_NOISE_AREAS.filter((a) => a.hourlyDb[currentHour] <= tranquilityThreshold).length;
    const whoNightSafeCount = BERLIN_NOISE_AREAS.filter((a) => a.hourlyDb[currentHour] <= 40).length;
    const averageDb =
      Math.round((BERLIN_NOISE_AREAS.reduce((acc, a) => acc + a.hourlyDb[currentHour], 0) / total) * 10) / 10;
    return {
      quietPercent: Math.round((quietCount / total) * 100),
      quietCount,
      total,
      whoNightSafeCount,
      averageDb,
    };
  }, [currentHour, tranquilityThreshold]);

  return (
    <div className="rounded-2xl bg-white border border-stone-200 overflow-hidden shadow-xs space-y-0">
      {/* Map Control Header */}
      <div className="p-4 bg-[#faf6ee] border-b border-[#d6c7b2] flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#8c1d40]/10 text-[#8c1d40] text-[11px] font-mono-code font-bold">
              <Compass className="w-3 h-3" />
              {lang === 'de' ? 'Berliner Kiez-Lärmkarte (Google Maps Demo)' : lang === 'es' ? 'Mapa de Ruido de Berlín' : 'Berlin Kiez Noise Map (Google Style)'}
            </span>
            <span className="text-[11px] font-mono-code text-stone-500">
              SenUMVK Open Data & NoiseCapture Schema
            </span>
          </div>
          <h4 className="text-base font-bold font-serif-title text-[#2c1d11]">
            {lang === 'de'
              ? 'Lärmzonen & 24h Ruhe-Korridore nach Berliner Straßentypologien'
              : lang === 'es'
              ? 'Zonas de ruido y ventanas de tranquilidad en Berlín'
              : 'Berlin Noise Contours & Diurnal Tranquility Corridors'}
          </h4>
        </div>

        {/* Time Control Bar */}
        <div className="flex items-center gap-2.5 bg-white p-2 rounded-xl border border-stone-200 shadow-2xs">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#8c1d40] text-white text-xs font-semibold hover:bg-[#701531] transition-colors"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isPlaying ? 'Pause' : '24h Loop'}</span>
          </button>

          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-stone-500" />
            <span className="text-sm font-bold font-mono-code text-[#8c1d40] min-w-[48px]">
              {String(currentHour).padStart(2, '0')}:00
            </span>
            <input
              type="range"
              min="0"
              max="23"
              value={currentHour}
              onChange={(e) => onHourChange(Number(e.target.value))}
              className="w-24 sm:w-32 accent-[#8c1d40] h-1.5 bg-stone-200 rounded-lg cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Map Filter & Tile Layer Selection Toolbar */}
      <div className="px-4 py-2 bg-stone-50 border-b border-stone-200 flex flex-wrap items-center justify-between gap-2 text-xs">
        {/* Quick Kiez Jump Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
          <span className="text-[10px] font-mono-code text-stone-500 font-bold shrink-0">Kiez-Fokus:</span>
          <button
            onClick={() => {
              onSelectArea('kollwitz-cobblestone');
              jumpToKiez([52.5366, 13.4182], 14.5);
            }}
            className="px-2 py-0.5 rounded-md bg-white hover:bg-stone-100 border border-stone-200 font-medium text-stone-700 whitespace-nowrap shadow-2xs"
          >
            📍 Kollwitzplatz (Pankow)
          </button>
          <button
            onClick={() => {
              onSelectArea('torstrasse-corridor');
              jumpToKiez([52.5298, 13.4025], 14.5);
            }}
            className="px-2 py-0.5 rounded-md bg-white hover:bg-stone-100 border border-stone-200 font-medium text-stone-700 whitespace-nowrap shadow-2xs"
          >
            📍 Torstraße (Mitte)
          </button>
          <button
            onClick={() => {
              onSelectArea('simon-dach-nightlife');
              jumpToKiez([52.5115, 13.4565], 14.5);
            }}
            className="px-2 py-0.5 rounded-md bg-white hover:bg-stone-100 border border-stone-200 font-medium text-stone-700 whitespace-nowrap shadow-2xs"
          >
            📍 Simon-Dach (F'hain)
          </button>
          <button
            onClick={() => {
              onSelectArea('mauerpark-oasis');
              jumpToKiez([52.5445, 13.4035], 14.5);
            }}
            className="px-2 py-0.5 rounded-md bg-white hover:bg-stone-100 border border-stone-200 font-medium text-stone-700 whitespace-nowrap shadow-2xs"
          >
            🌿 Mauerpark Oase
          </button>
          <button
            onClick={() => jumpToKiez([52.5320, 13.4180], 13)}
            className="px-2 py-0.5 rounded-md bg-stone-200/80 hover:bg-stone-300 text-stone-800 font-medium whitespace-nowrap"
          >
            🗺️ Berlin Gesamt
          </button>
        </div>

        {/* Style & Filter Selectors */}
        <div className="flex items-center gap-2">
          {/* Map Base Layer Picker */}
          <div className="inline-flex rounded-lg border border-stone-200 bg-white p-0.5 shadow-2xs">
            <button
              onClick={() => setMapStyle('google')}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-all ${
                mapStyle === 'google'
                  ? 'bg-[#8c1d40] text-white shadow-2xs font-bold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
              title="Google-Style Light Vector Map"
            >
              🗺️ Google Light
            </button>
            <button
              onClick={() => setMapStyle('satellite')}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-all ${
                mapStyle === 'satellite'
                  ? 'bg-[#8c1d40] text-white shadow-2xs font-bold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
              title="Satellite Aerial Imagery"
            >
              🛰️ Satellit
            </button>
            <button
              onClick={() => setMapStyle('dark')}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-all ${
                mapStyle === 'dark'
                  ? 'bg-[#8c1d40] text-white shadow-2xs font-bold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
              title="Acoustic Contrast Dark Map"
            >
              🌙 Nachtkarte
            </button>
          </div>

          {/* Filter Mode */}
          <select
            value={filterMode}
            onChange={(e) => setFilterMode(e.target.value as any)}
            className="px-2 py-0.5 rounded-md border border-stone-200 bg-white text-stone-700 text-[11px] font-medium shadow-2xs"
          >
            <option value="all">Alle Pegelzonen</option>
            <option value="quiet">Nur Ruhe-Fenster (&lt; 45 dB)</option>
            <option value="night-alarm">Nacht-Lärm (&gt; 40 dB WHO)</option>
          </select>
        </div>
      </div>

      {/* Map Canvas Container */}
      <div className="relative w-full h-[460px] sm:h-[500px]">
        <div ref={mapContainerRef} className="w-full h-full z-0" />

        {/* Live Kiez Acoustic Pulse Overlay (Top-Left) */}
        <div className="absolute top-3 left-3 z-[1000] bg-white/95 backdrop-blur-md rounded-xl p-3 border border-stone-200 shadow-md max-w-xs space-y-1.5 pointer-events-auto">
          <div className="flex items-center justify-between text-[11px] font-mono-code font-bold">
            <span className="text-stone-600">BERLIN-AKUSTIK {String(currentHour).padStart(2, '0')}:00 UHR</span>
            <span className="text-[#8c1d40]">Ø {statsAtHour.averageDb} dB(A)</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-center pt-1 border-t border-stone-100">
            <div className="p-1.5 rounded-lg bg-emerald-50 border border-emerald-200/60">
              <div className="text-[10px] text-emerald-800 font-medium">Ruhe-Fenster</div>
              <div className="text-sm font-bold font-mono-code text-emerald-700">
                {statsAtHour.quietPercent}% ({statsAtHour.quietCount}/{statsAtHour.total})
              </div>
            </div>

            <div className="p-1.5 rounded-lg bg-stone-50 border border-stone-200">
              <div className="text-[10px] text-stone-600 font-medium">WHO-Nacht &lt;40dB</div>
              <div className="text-sm font-bold font-mono-code text-stone-800">
                {statsAtHour.whoNightSafeCount}/{statsAtHour.total} Zonen
              </div>
            </div>
          </div>
          <p className="text-[10px] text-stone-500 italic">
            Klicken Sie auf eine Lärmzone, um das 24h-Profil & Schlaffilter zu laden.
          </p>
        </div>

        {/* Official Noise Color Scale Legend (Bottom-Left) */}
        <div className="absolute bottom-3 left-3 z-[1000] bg-white/95 backdrop-blur-md rounded-xl p-2.5 border border-stone-200 shadow-md text-[10px] font-mono-code pointer-events-auto max-w-sm hidden sm:block">
          <div className="font-bold text-stone-700 mb-1.5 flex items-center justify-between">
            <span>SenUMVK Lärmpegel-Farbskala</span>
            <span className="text-stone-400 font-normal">DIN 18005 / L_den</span>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs shrink-0 bg-[#701a75]" />
              <span className="text-stone-700">&gt; 75 dB(A) Extremer Dauerlärm (Hauptverkehr)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs shrink-0 bg-[#dc2626]" />
              <span className="text-stone-700">70–75 dB(A) Hohe Belastung (Tram / Achsen)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs shrink-0 bg-[#ea580c]" />
              <span className="text-stone-700">65–70 dB(A) Gastro & Bar-Meilen nachts</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs shrink-0 bg-[#f59e0b]" />
              <span className="text-stone-700">60–65 dB(A) Durchgangsverkehr</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs shrink-0 bg-[#84cc16]" />
              <span className="text-stone-700">45–55 dB(A) Tempo 30 Wohnstraßen</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs shrink-0 bg-[#10b981]" />
              <span className="text-emerald-800 font-bold">&lt; 45 dB(A) 🌿 Ruhe-Fenster (WHO-Schlaf)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
