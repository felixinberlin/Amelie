"""Testfälle aus dem Anhang des Beschlusses selbst.

Der Anhang von LAG VSW 21/01 (aktualisiert 2023) rechnet elf reale Gebäude durch.
Diese Beispiele sind die Abnahme: Wer das Schema programmiert, muss sie treffen.

Aufgefallen beim Nachrechnen — beides steht in eigenen Tests:
  * Berlin, Forschungszentrum: der Anhang notiert die Gebäudefaktoren 3 und 3 und
    darunter "Summe 7". 3 + 3 sind 6, der Gesamtwert wäre 12 statt 13. Die
    Risikostufe ändert sich dadurch nicht.
  * Garmisch-Partenkirchen: der Anhang lässt den Gehölzabstand offen (1–4) und
    kommt auf "7–10", greift dann aber die Vorrangregel Lochfassade ≤ 1,5 m²
    und stuft "gering" ein. Genau dafür ist die Vorrangregel da.
"""

from __future__ import annotations

import sys
from pathlib import Path

import pytest

sys.path.insert(0, str(Path(__file__).parent))

from ampel import (  # noqa: E402
    Kriteriumswert,
    SchemaFehler,
    als_blatt,
    bewerte,
    signifikanzschwelle,
)

# (Name, glasanteil, fassade, umgebung, gehoelz, erwartete Summe, erwartete Stufe)
ANHANG = [
    ("Augsburg, Gewerbebetrieb", 2, 4, 4, 3, 13, "hoch"),
    ("Augsburg, Verwaltungsgebäude", 2, 2, 3, 1, 8, "mittel"),
    ("Augsburg, Forschungszentrum", 1, 2, 1, 4, 8, "mittel"),
    ("Augsburg, innerstädtische Wohnbebauung", 2, 1, 1, 1, 5, "gering"),
    ("Augsburg, Gewerbegebäude", 4, 4, 4, 3, 15, "hoch"),
    ("Potsdam, Wohnblock", 2, 2, 2, 3, 9, "mittel"),
    ("Berlin, Bürogebäude (transparente Durchsicht)", 4, 4, 2, 3, 13, "hoch"),
    ("Potsdam, Kindertagesstätte", 3, 4, 3, 3, 13, "hoch"),
    ("Berlin, Bürogebäude (Vorbau, stark spiegelnd)", 4, 4, 1, 4, 13, "hoch"),
]


@pytest.mark.parametrize("name,glas,fassade,umg,gehoelz,summe,stufe", ANHANG)
def test_anhang_beispiele(name, glas, fassade, umg, gehoelz, summe, stufe):
    b = bewerte(glas, fassade, umg, gehoelz)
    assert b.summe == summe, name
    assert b.stufe == stufe, name


def test_berlin_buerogebaeude_ohne_vegetation_fussnote_2():
    """Anhang: 51–75 % Glas, Glasflächen > 6 m², voll versiegelt, Gehölze > 50 m.

    Punkte 3+4+1+1 = 9 → mittel. Der Anhang hält ausdrücklich fest, dass die
    Spiegelung hier nicht zur hohen Stufe führt, weil sich keine Vegetation
    spiegelt. Glasanteil ist hier 3, die Vorrangregel greift also ohnehin nicht.
    """
    b = bewerte(3, 4, 1, 1)
    assert b.summe == 9
    assert b.stufe == "mittel"
    assert b.vorrangregeln == []


def test_berlin_forschungszentrum_rechenfehler_im_anhang():
    """Der Anhang notiert 3 + 3 = "Summe 7" und einen Gesamtwert von 13.

    Nachgerechnet sind es 12. Die Risikostufe bleibt in beiden Fällen "hoch" —
    der Fehler ist also folgenlos, aber er zeigt, warum ein Rechner nützlich ist.
    """
    b = bewerte(3, 3, 2, 4)
    assert b.summe == 12
    assert b.stufe == "hoch"
    anhang_gesamtwert = 13
    assert b.summe != anhang_gesamtwert


def test_garmisch_vorrangregel_lochfassade():
    """Punktsumme 7–10 (mittel), aber Lochfassade ≤ 1,5 m² → immer "gering"."""
    for gehoelz in (1, 2, 3, 4):
        b = bewerte(1, 1, 4, gehoelz)
        assert b.stufe == "gering"
        assert any("immer 'gering'" in r for r in b.vorrangregeln)


def test_vorrangregel_glasanteil_hebt_niedrige_summe_an():
    """Freistehende Glaswand in dichter Innenstadt, Gehölze weit weg: 4+2+1+1 = 8.

    Punktsumme wäre "mittel". Tab. 3 sagt: Gesamtbewertung immer "hoch".
    """
    b = bewerte(4, 2, 1, 1)
    assert b.summe == 8
    assert b.stufe == "hoch"
    assert any("immer 'hoch'" in r for r in b.vorrangregeln)


def test_fussnote_2_hebt_die_vorrangregel_auf():
    b = bewerte(4, 2, 1, 1, fussnote_2_ausnahme="Straßenflucht ohne Baumbestand, keine Vegetation im Spiegelbild")
    assert b.summe == 8
    assert b.stufe == "mittel"
    assert any("nicht angewandt" in r for r in b.vorrangregeln)


def test_regelkonflikt_wird_gemeldet_nicht_still_entschieden():
    """Glasanteil 4 fordert "hoch", Fassadengestaltung 1 fordert "gering".

    Der Beschluss regelt den Fall nicht. Der Rechner darf ihn nicht still auflösen.
    """
    b = bewerte(4, 1, 1, 1)
    assert any(r.startswith("REGELKONFLIKT") for r in b.vorrangregeln)
    assert b.summe == 7
    # Rückfall auf die Punktsumme, und der Konflikt steht sichtbar im Ergebnis.
    assert b.stufe == "mittel"


def test_unbestimmt_wird_nicht_geraten():
    b = bewerte(Kriteriumswert(None, "unbestimmt"), 4, 2, 3)
    assert b.vollstaendig is False
    assert b.summe is None
    assert b.stufe is None
    assert "glasanteil" in b.handlungsbedarf


def test_herkunft_landet_im_blatt():
    b = bewerte(
        Kriteriumswert(2, "bild", "aus Fassadenfoto geschätzt"),
        Kriteriumswert(4, "eingabe"),
        Kriteriumswert(3, "geodaten"),
        Kriteriumswert(3, "geodaten"),
    )
    blatt = als_blatt(b)
    assert "(bild)" in blatt and "(geodaten)" in blatt
    assert "aus Fassadenfoto geschätzt" in blatt


@pytest.mark.parametrize("wert", [0, 5, -1, 3.5])
def test_ungueltige_punkte(wert):
    with pytest.raises(SchemaFehler):
        bewerte(wert, 1, 1, 1)


def test_summengrenzen():
    assert bewerte(1, 2, 1, 1).summe == 5
    assert bewerte(1, 2, 1, 1).stufe == "gering"
    assert bewerte(4, 4, 4, 4).summe == 16
    assert bewerte(4, 4, 4, 4).stufe == "hoch"


# --- Schwellenwerte Kategorie 2, geprüft an der Münchner Untersuchung ---------
# Wölfl & Bornemann (LBV) mit LfU Bayern 2021, Untersuchung in München 2020.


def test_muenchen_glaswaende_ueber_schwelle():
    """Drei Glaswände Walter-Gropius-Straße: 90 Kollisionen auf 217 m in 13 Wochen.

    Auf das Jahr hochgerechnet liegt das weit über fünf je 100 m.
    """
    aufs_jahr = 90 * (52 / 13)
    r = signifikanzschwelle(aufs_jahr, 217)
    assert r["signifikant_erhoeht"] is True
    assert r["je_100m_und_jahr"] > 100


def test_muenchen_fassaden_unter_schwelle_im_untersuchungszeitraum():
    """Fassaden: 35 Kollisionen auf 1.647 m in 13 Wochen → gut 8 je 100 m im Jahr.

    Auch das liegt über der Schwelle — die Studie stuft sie dennoch nur als
    Priorität 2 ein, weil eine Ganzjahresbetrachtung fehlt. Der Rechner rechnet;
    die fachliche Einordnung bleibt beim Menschen.
    """
    aufs_jahr = 35 * (52 / 13)
    r = signifikanzschwelle(aufs_jahr, 1647)
    assert r["je_100m_und_jahr"] == pytest.approx(8.5, abs=0.1)
    assert r["signifikant_erhoeht"] is True


def test_normalfall_einfamilienhaus():
    """Ein Vogel im Jahr auf 50 m Fassadenlänge = normales Risiko (2 je 100 m)."""
    r = signifikanzschwelle(1, 50)
    assert r["je_100m_und_jahr"] == 2.0
    assert r["signifikant_erhoeht"] is False


def test_fassadenlaenge_muss_positiv_sein():
    with pytest.raises(SchemaFehler):
        signifikanzschwelle(5, 0)
