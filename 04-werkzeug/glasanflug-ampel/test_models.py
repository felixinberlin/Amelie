"""Tests für die Modelle der Gebäude- und Fassadenbewertung (unittest)."""

import json
from datetime import datetime, timezone
import unittest
from models import (
    GebaeudeBewertung,
    LAGVSWEinstufung,
    FassadenAbschnitt,
    UmfeldErfassung,
    Adresse,
    Geokoordinaten,
    Risikostufe,
    ErfasserTyp,
)


class TestGebaeudeModelle(unittest.TestCase):
    def test_gebaeude_bewertung_serialisierung(self):
        bewertung = GebaeudeBewertung(
            gebaeude_id="bld-jena-01",
            erfasst_am=datetime(2026, 10, 12, 14, 0, tzinfo=timezone.utc),
            erfasser_typ=ErfasserTyp.ehrenamtlich,
            adresse=Adresse(text="Löbdergraben 24, 07743 Jena", stadt="Jena"),
            geokoordinaten=Geokoordinaten(latitude=50.928, longitude=11.589),
            fassaden=[
                FassadenAbschnitt(
                    id="f1",
                    bezeichnung="Westfassade",
                    ausrichtung="W",
                    glasanteil_stufe=3,
                    fassadengestaltung_stufe=2,
                )
            ],
            umfeld=UmfeldErfassung(
                umgebung_stufe=2,
                gehoelzabstand_stufe=3,
                gehoelz_quelle="osm",
            ),
            lag_vsw_bewertung=LAGVSWEinstufung(
                vollstaendig=True,
                summe=10,
                stufe=Risikostufe.mittel,
                vorrangregel=None,
                regelkonflikt=False,
                unbestimmte_kriterien=[],
            ),
        )

        # Dictionary / JSON Konvertierung
        data = bewertung.to_dict()
        self.assertEqual(data["gebaeude_id"], "bld-jena-01")
        self.assertEqual(data["adresse"]["stadt"], "Jena")
        self.assertEqual(data["lag_vsw_bewertung"]["stufe"], "mittel")
        self.assertEqual(data["lag_vsw_bewertung"]["summe"], 10)
        self.assertEqual(len(data["fassaden"]), 1)

        # GeoJSON Feature Konvertierung
        feature = bewertung.to_geojson_feature()
        self.assertEqual(feature["type"], "Feature")
        self.assertEqual(feature["id"], "bld-jena-01")
        self.assertEqual(feature["geometry"]["coordinates"], [11.589, 50.928])
        self.assertEqual(feature["properties"]["risikostufe"], "mittel")
        self.assertEqual(feature["properties"]["adresse"], "Löbdergraben 24, 07743 Jena")

    def test_unvollstaendige_bewertung(self):
        bewertung = GebaeudeBewertung(
            gebaeude_id="bld-incomplete-01",
            lag_vsw_bewertung=LAGVSWEinstufung(
                vollstaendig=False,
                summe=None,
                stufe=None,
                unbestimmte_kriterien=["glasanteil", "fassadengestaltung"],
            ),
        )

        feature = bewertung.to_geojson_feature()
        self.assertFalse(feature["properties"]["vollstaendig"])
        self.assertIsNone(feature["properties"]["risikostufe"])
        self.assertIsNone(feature["properties"]["punkte_summe"])


if __name__ == "__main__":
    unittest.main()
