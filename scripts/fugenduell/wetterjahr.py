#!/usr/bin/env python3
"""Fugenduell: download the daily weather of one plant year (March -> February) for a city.

Source: NASA POWER daily API (MERRA-2 grid, about 0.5° x 0.625°; no urban heat island).
The game logic (monthly aggregation, relative thresholds, watch mode) lives in
src/engine/fugenduell/weatherYear.ts; this script only stores raw daily values as a fixture.

Usage: python3 scripts/fugenduell/wetterjahr.py <lat> <lon> <start-year> <city-id> <city-name> > fixture.json
"""
import json
import sys
import urllib.request
from datetime import date

PARAMS = ["T2M", "T2M_MAX", "T2M_MIN", "PRECTOTCORR"]


def fetch(lat: float, lon: float, start_year: int) -> dict:
    url = (
        "https://power.larc.nasa.gov/api/temporal/daily/point"
        f"?parameters={','.join(PARAMS)}&community=AG&longitude={lon}&latitude={lat}"
        f"&start={start_year}0301&end={start_year + 1}0228&format=JSON"
    )
    with urllib.request.urlopen(url, timeout=120) as response:
        return json.load(response)


def main() -> None:
    lat, lon, start_year = float(sys.argv[1]), float(sys.argv[2]), int(sys.argv[3])
    city_id, city_name = sys.argv[4], sys.argv[5]
    data = fetch(lat, lon, start_year)
    raw = data["properties"]["parameter"]
    fill = data.get("header", {}).get("fill_value", -999.0)
    days = []
    for key in sorted(raw["T2M"]):
        values = [raw[p][key] for p in PARAMS]
        # Fill values stay missing (null), never zero.
        days.append([f"{key[:4]}-{key[4:6]}-{key[6:]}"] + [None if v == fill else v for v in values])
    print(json.dumps({
        "id": city_id,
        "name": city_name,
        "lat": lat,
        "lon": lon,
        "startYear": start_year,
        "source": "NASA POWER Daily API v2 (MERRA-2), community AG",
        "fetched": date.today().isoformat(),
        "fields": ["date", "tMean", "tMax", "tMin", "precipMm"],
        "days": days,
    }, separators=(",", ":")))


if __name__ == "__main__":
    main()
