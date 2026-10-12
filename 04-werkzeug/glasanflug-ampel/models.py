"""Gebäude- und Fassaden-Bewertungsschema (Vogelschlag an Glas).

Stand-alone dataclasses mit optionaler Pydantic-Kompatibilität für
NABU Vogelschlagmelder (codeberg.org/nabu-jena/Vogelschlagmelder).

CC0 / Public Domain — Félix, Berlin.
"""

from __future__ import annotations

from dataclasses import asdict, dataclass, field
from datetime import datetime, timezone
from enum import Enum
from typing import Any, List, Literal, Optional

# Falls Pydantic v2 verfügbar ist (z.B. in FastAPI-Umgebungen), bieten wir
# Pydantic BaseModel Integration an. Standardmäßig funktioniert das Modul
# mit reiner Standardbibliothek (dataclasses).
try:
    from pydantic import BaseModel, Field

    HAS_PYDANTIC = True
except ImportError:
    HAS_PYDANTIC = False


class Himmelsrichtung(str, Enum):
    N = "N"
    NO = "NO"
    O = "O"
    SO = "SO"
    S = "S"
    SW = "SW"
    W = "W"
    NW = "NW"


class ErfasserTyp(str, Enum):
    ehrenamtlich = "ehrenamtlich"
    sachverstaendig = "sachverstaendig"
    buergerin = "buergerin"


class Risikostufe(str, Enum):
    gering = "gering"
    mittel = "mittel"
    hoch = "hoch"


@dataclass
class Geokoordinaten:
    latitude: float
    longitude: float

    def __post_init__(self) -> None:
        if not (-90.0 <= self.latitude <= 90.0):
            raise ValueError(f"Ungültige Latitude: {self.latitude}")
        if not (-180.0 <= self.longitude <= 180.0):
            raise ValueError(f"Ungültige Longitude: {self.longitude}")


@dataclass
class Adresse:
    text: str
    strasse: Optional[str] = None
    hausnummer: Optional[str] = None
    postleitzahl: Optional[str] = None
    stadt: Optional[str] = None


@dataclass
class FassadenAbschnitt:
    id: str = "f1"
    bezeichnung: Optional[str] = None
    ausrichtung: Optional[str] = None
    flaeche_m2: Optional[float] = None
    hoehe_m: Optional[float] = None
    breite_m: Optional[float] = None
    glasanteil_prozent: Optional[float] = None
    glasanteil_stufe: Optional[int] = None
    fassadengestaltung_stufe: Optional[int] = None
    maximale_scheibengroesse_m2: Optional[float] = None
    markierung_vorhanden: bool = False
    markierungs_muster_nr: Optional[str] = None
    markierungs_kategorie: Optional[str] = None
    fotos: List[str] = field(default_factory=list)


@dataclass
class NaechsteBeobachtung:
    distanz_m: float
    art: str


@dataclass
class UmfeldErfassung:
    umgebung_stufe: Optional[int] = None
    gehoelzabstand_stufe: Optional[int] = None
    gehoelzabstand_m: Optional[float] = None
    gehoelz_quelle: Optional[str] = "unbestimmt"
    vegetation_observations_count: int = 0
    naechste_beobachtung: Optional[NaechsteBeobachtung] = None


@dataclass
class LAGVSWEinstufung:
    vollstaendig: bool
    summe: Optional[int] = None
    stufe: Optional[Risikostufe] = None
    vorrangregel: Optional[str] = None
    regelkonflikt: bool = False
    unbestimmte_kriterien: List[str] = field(default_factory=list)


@dataclass
class MonitoringErgebnis:
    funde_pro_jahr: Optional[float] = None
    fassadenlaenge_m: Optional[float] = None
    signifikant_erhoeht: Optional[bool] = None


@dataclass
class GebaeudeBewertung:
    gebaeude_id: str
    lag_vsw_bewertung: LAGVSWEinstufung
    schema_version: str = "1.0.0"
    erfasst_am: datetime = field(default_factory=lambda: datetime.now(timezone.utc))
    erfasser_typ: ErfasserTyp = ErfasserTyp.ehrenamtlich
    erfasser_notiz: Optional[str] = None
    adresse: Optional[Adresse] = None
    geokoordinaten: Optional[Geokoordinaten] = None
    fassaden: List[FassadenAbschnitt] = field(default_factory=list)
    umfeld: UmfeldErfassung = field(default_factory=UmfeldErfassung)
    monitoring: Optional[MonitoringErgebnis] = None
    disclaimer: str = (
        "LAG-VSW 21/01 Schätzung (Amélie). Nicht rechtsverbindlich; Entscheidungshilfe für die Vor-Ort-Ansprache und Dokumentation."
    )

    def to_dict(self) -> dict[str, Any]:
        """Konvertiert die Datenstruktur in ein serialisierbares Dictionary."""
        d = asdict(self)
        d["erfasst_am"] = self.erfasst_am.isoformat()
        if self.erfasser_typ:
            d["erfasser_typ"] = self.erfasser_typ.value
        if self.lag_vsw_bewertung and self.lag_vsw_bewertung.stufe:
            d["lag_vsw_bewertung"]["stufe"] = self.lag_vsw_bewertung.stufe.value
        return d

    def to_geojson_feature(self) -> dict[str, Any]:
        """Konvertiert die Bewertung in ein RFC 7946 GeoJSON Feature."""
        coords = [self.geokoordinaten.longitude, self.geokoordinaten.latitude] if self.geokoordinaten else [0.0, 0.0]
        return {
            "type": "Feature",
            "id": self.gebaeude_id,
            "geometry": {
                "type": "Point",
                "coordinates": coords,
            },
            "properties": {
                "schema_version": self.schema_version,
                "gebaeude_id": self.gebaeude_id,
                "erfasst_am": self.erfasst_am.isoformat(),
                "erfasser_typ": self.erfasser_typ.value,
                "adresse": self.adresse.text if self.adresse else None,
                "risikostufe": self.lag_vsw_bewertung.stufe.value if self.lag_vsw_bewertung.stufe else None,
                "punkte_summe": self.lag_vsw_bewertung.summe,
                "vollstaendig": self.lag_vsw_bewertung.vollstaendig,
                "regelkonflikt": self.lag_vsw_bewertung.regelkonflikt,
                "vorrangregel": self.lag_vsw_bewertung.vorrangregel,
                "gehoelz_quelle": self.umfeld.gehoelz_quelle,
                "naechstes_gehoelz_distanz_m": (
                    self.umfeld.naechste_beobachtung.distanz_m if self.umfeld.naechste_beobachtung else None
                ),
                "monitoring_signifikant": self.monitoring.signifikant_erhoeht if self.monitoring else None,
                "disclaimer": self.disclaimer,
            },
        }
