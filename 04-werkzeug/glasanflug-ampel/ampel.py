"""Glasanflug-Ampel — Bewertung des Vogelschlagrisikos an Glas.

Rechnet das Bewertungsschema der Länderarbeitsgemeinschaft der Vogelschutzwarten
(LAG VSW Beschluss 21/01, aktualisiert 2023, Tab. 3 und Tab. 4) aus, und nichts sonst.

Kein Bild, kein Modell, keine Schätzung: Die vier Kriterien werden als Punktwerte
1–4 übergeben. Die Funktion addiert, wendet die beiden Vorrangregeln an und gibt
eine Risikostufe mit Begründung zurück — inklusive der Angabe, welche Regel gegriffen
hat und welche Eingabe woher stammt.

Das Schema selbst steht in schema-lagvsw-21-01.yaml. Diese Datei legt es nicht aus.

CC0 / Public Domain — Félix, Berlin. Verwendbar auch in GPL-Projekten.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from pathlib import Path
from typing import Any, Literal

import yaml

SCHEMA_PATH = Path(__file__).with_name("schema-lagvsw-21-01.yaml")

KRITERIEN = ("glasanteil", "fassadengestaltung", "umgebung", "gehoelzabstand")

Herkunft = Literal["eingabe", "bild", "geodaten", "unbestimmt"]


class SchemaFehler(ValueError):
    """Die Eingabe passt nicht zum Schema."""


@dataclass(frozen=True)
class Kriteriumswert:
    """Ein Punktwert plus die Angabe, woher er stammt.

    `herkunft="unbestimmt"` ist ausdrücklich erlaubt: Was nicht bestimmt werden
    konnte, wird nicht geraten. Die Bewertung wird dann als unvollständig markiert.
    """

    punkte: int | None
    herkunft: Herkunft = "eingabe"
    bemerkung: str = ""

    def __post_init__(self) -> None:
        if self.punkte is None:
            if self.herkunft != "unbestimmt":
                raise SchemaFehler("Ohne Punktwert muss die Herkunft 'unbestimmt' sein.")
            return
        if self.punkte not in (1, 2, 3, 4):
            raise SchemaFehler(f"Punkte müssen 1–4 sein, nicht {self.punkte!r}.")


@dataclass
class Bewertung:
    punkte: dict[str, int | None]
    herkunft: dict[str, str]
    summe: int | None
    stufe: str | None
    bewertungstext: str | None
    handlungsbedarf: str | None
    vorrangregeln: list[str] = field(default_factory=list)
    hinweise: list[str] = field(default_factory=list)
    vollstaendig: bool = True
    schema_version: str = ""

    def als_dict(self) -> dict[str, Any]:
        return {
            "punkte": self.punkte,
            "herkunft": self.herkunft,
            "summe": self.summe,
            "stufe": self.stufe,
            "bewertung": self.bewertungstext,
            "handlungsbedarf": self.handlungsbedarf,
            "vorrangregeln": self.vorrangregeln,
            "hinweise": self.hinweise,
            "vollstaendig": self.vollstaendig,
            "schema": self.schema_version,
        }


def lade_schema(pfad: Path = SCHEMA_PATH) -> dict[str, Any]:
    with pfad.open(encoding="utf-8") as fh:
        return yaml.safe_load(fh)


def _stufe_fuer_summe(schema: dict[str, Any], summe: int) -> dict[str, Any]:
    for eintrag in schema["risikostufen"]:
        unten, oben = eintrag["punkte"]
        if unten <= summe <= oben:
            return eintrag
    raise SchemaFehler(f"Summe {summe} liegt außerhalb von 4–16.")


def _normiere(wert: Kriteriumswert | int | None) -> Kriteriumswert:
    if isinstance(wert, Kriteriumswert):
        return wert
    if wert is None:
        return Kriteriumswert(None, "unbestimmt")
    if isinstance(wert, bool) or not isinstance(wert, int):
        # Kein int() auf Gleitkommazahlen: 3.5 würde still zu 3 und damit zu einer
        # erfundenen Einstufung. Das Schema kennt nur die Stufen 1 bis 4.
        raise SchemaFehler(f"Punkte müssen ganze Zahlen 1–4 sein, nicht {wert!r}.")
    return Kriteriumswert(wert)


def bewerte(
    glasanteil: Kriteriumswert | int | None,
    fassadengestaltung: Kriteriumswert | int | None,
    umgebung: Kriteriumswert | int | None,
    gehoelzabstand: Kriteriumswert | int | None,
    *,
    fussnote_2_ausnahme: str | None = None,
    schema: dict[str, Any] | None = None,
) -> Bewertung:
    """Bewertet eine Fassade oder einen Fassadenabschnitt.

    Die vier Argumente sind Punktwerte 1–4 (oder `Kriteriumswert`, oder None für
    'unbestimmt'). `fussnote_2_ausnahme` ist die schriftliche Begründung, wenn die
    Vorrangregel "immer hoch" nach Fußnote 2 der Tab. 3 nicht greifen soll — etwa
    wenn sich in einer Spiegelfassade nachweislich keine Vegetation spiegelt. Ohne
    Begründungstext greift die Regel.
    """
    schema = schema or lade_schema()
    roh = {
        "glasanteil": _normiere(glasanteil),
        "fassadengestaltung": _normiere(fassadengestaltung),
        "umgebung": _normiere(umgebung),
        "gehoelzabstand": _normiere(gehoelzabstand),
    }

    punkte = {k: v.punkte for k, v in roh.items()}
    herkunft = {k: v.herkunft for k, v in roh.items()}
    hinweise = [v.bemerkung for v in roh.values() if v.bemerkung]
    vorrang: list[str] = []

    unbestimmt = [k for k, v in punkte.items() if v is None]
    if unbestimmt:
        return Bewertung(
            punkte=punkte,
            herkunft=herkunft,
            summe=None,
            stufe=None,
            bewertungstext=None,
            handlungsbedarf=(
                "Keine Einstufung möglich: "
                + ", ".join(unbestimmt)
                + " unbestimmt. Fehlende Kriterien vor Ort oder aus den Unterlagen ergänzen."
            ),
            hinweise=hinweise,
            vollstaendig=False,
            schema_version=schema["schema"]["quelle"],
        )

    summe = sum(punkte.values())  # type: ignore[arg-type]
    eintrag = _stufe_fuer_summe(schema, summe)
    stufe = eintrag["stufe"]

    glas_vorrang = punkte["glasanteil"] == 4
    fassade_vorrang = punkte["fassadengestaltung"] == 1

    if glas_vorrang and fussnote_2_ausnahme:
        vorrang.append(
            "Vorrangregel 'Gesamtbewertung immer hoch' (Glasanteil = 4) nach Fußnote 2 "
            f"nicht angewandt. Begründung: {fussnote_2_ausnahme}"
        )
        glas_vorrang = False

    if glas_vorrang and fassade_vorrang:
        # Der Beschluss regelt diesen Fall nicht. Nicht still entscheiden.
        vorrang.append(
            "REGELKONFLIKT: Glasanteil = 4 fordert 'immer hoch', Fassadengestaltung = 1 "
            "fordert 'immer gering'. Der Beschluss regelt den Fall nicht. "
            "Eingestuft wird nach Punktsumme; fachliche Entscheidung erforderlich."
        )
    elif glas_vorrang:
        stufe = "hoch"
        eintrag = next(e for e in schema["risikostufen"] if e["stufe"] == "hoch")
        vorrang.append(
            "Vorrangregel Tab. 3: Glasanteil = 4 (> 75 %, freistehende Glaswand, "
            "transparente Durchsicht oder Reflexionsgrad > 30 %) → Gesamtbewertung immer 'hoch'."
        )
    elif fassade_vorrang:
        stufe = "gering"
        eintrag = next(e for e in schema["risikostufen"] if e["stufe"] == "gering")
        vorrang.append(
            "Vorrangregel Tab. 3: Fassadengestaltung = 1 (Lochfassade bis 1,5 m², "
            "Bandfassade unter 1 m oder wirksam markiertes/strukturiertes Glas) "
            "→ Gesamtbewertung immer 'gering'."
        )

    return Bewertung(
        punkte=punkte,
        herkunft=herkunft,
        summe=summe,
        stufe=stufe,
        bewertungstext=eintrag["bewertung"],
        handlungsbedarf=eintrag["handlungsbedarf"],
        vorrangregeln=vorrang,
        hinweise=hinweise,
        vollstaendig=True,
        schema_version=schema["schema"]["quelle"],
    )


def signifikanzschwelle(
    kollisionen_pro_jahr: float,
    fassadenlaenge_m: float,
    *,
    schema: dict[str, Any] | None = None,
) -> dict[str, Any]:
    """Kategorie 2: rechnet ein Monitoringergebnis auf 100 m Fassadenlänge um.

    Gilt nur für Bestandsbauten MIT Vogelschlagmonitoring (Kap. 3.1.2), nicht als
    Ersatz für das Punkteschema und nicht als Prognose.
    """
    if fassadenlaenge_m <= 0:
        raise SchemaFehler("Fassadenlänge muss größer als 0 sein.")
    schema = schema or lade_schema()
    k2 = schema["schwellenwerte"]["kategorie_2"]
    je_100m = kollisionen_pro_jahr * 100.0 / fassadenlaenge_m
    return {
        "je_100m_und_jahr": round(je_100m, 2),
        "normal": k2["normal"],
        "signifikant_erhoeht_ab": k2["signifikant_erhoeht_ab"],
        "signifikant_erhoeht": je_100m >= k2["signifikant_erhoeht_ab"],
        "hinweis": (
            "Nur für Bestandsbauten mit Monitoring. Fundraten sind nach Kap. 2.2 zu "
            "korrigieren (Abräumung durch Prädatoren, Sucheffizienz, Intervalle)."
        ),
    }


def als_blatt(bewertung: Bewertung, schema: dict[str, Any] | None = None) -> str:
    """Gibt die Bewertung als nachvollziehbares Blatt aus — Punkt für Punkt."""
    schema = schema or lade_schema()
    zeilen = [
        "Bewertung des Vogelschlagrisikos an Glas",
        f"Schema: {bewertung.schema_version}",
        "",
    ]
    for key in KRITERIEN:
        name = schema["kriterien"][key]["name"]
        p = bewertung.punkte[key]
        if p is None:
            zeilen.append(f"  {name}: unbestimmt")
            continue
        wortlaut = schema["kriterien"][key]["stufen"][p]["wortlaut"].strip()
        zeilen.append(f"  {name}: {p} ({bewertung.herkunft[key]})")
        zeilen.append(f"      {wortlaut}")
    zeilen.append("")
    if not bewertung.vollstaendig:
        zeilen.append(f"  Ergebnis: keine Einstufung. {bewertung.handlungsbedarf}")
        return "\n".join(zeilen)
    zeilen.append(f"  Summe: {bewertung.summe} von 16  →  Risikostufe: {bewertung.stufe}")
    zeilen.append(f"  {bewertung.bewertungstext}")
    zeilen.append(f"  Handlungsbedarf: {bewertung.handlungsbedarf}")
    for regel in bewertung.vorrangregeln:
        zeilen.append(f"  ! {regel}")
    for h in bewertung.hinweise:
        zeilen.append(f"  - {h}")
    return "\n".join(zeilen)


if __name__ == "__main__":  # kleine Selbstdemonstration
    b = bewerte(
        Kriteriumswert(2, "bild", "Glasanteil aus Fassadenfoto geschätzt"),
        Kriteriumswert(4, "bild"),
        Kriteriumswert(4, "geodaten", "Versiegelung aus OSM-Landnutzung"),
        Kriteriumswert(3, "geodaten", "Baumkataster, nächstes Gehölz 22 m"),
    )
    print(als_blatt(b))
