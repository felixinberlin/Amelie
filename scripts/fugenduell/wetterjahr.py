#!/usr/bin/env python3
"""Fugenduell: real weather year of a city -> 12 monthly rounds (prototype, conversion v1 draft).

Source: NASA POWER daily API (MERRA-2 grid, about 0.5° x 0.625°; no urban heat island).
Day length is computed astronomically from latitude (no data source needed).

Usage: python3 scripts/fugenduell/wetterjahr.py <lat> <lon> <year> [name]
Prints one JSON line per month to stdout.
"""
import json
import math
import sys
import urllib.request
from collections import defaultdict
from datetime import date

PARAMS = "T2M,T2M_MAX,T2M_MIN,PRECTOTCORR"


def fetch(lat: float, lon: float, year: int) -> dict:
    url = (
        "https://power.larc.nasa.gov/api/temporal/daily/point"
        f"?parameters={PARAMS}&community=AG&longitude={lon}&latitude={lat}"
        f"&start={year}0101&end={year}1231&format=JSON"
    )
    with urllib.request.urlopen(url, timeout=60) as response:
        return json.load(response)["properties"]["parameter"]


def day_length(lat: float, day: date) -> float:
    """Hours between sunrise and sunset (CBM model, Forsythe et al. 1995, p = 0.8333)."""
    j = day.timetuple().tm_yday
    theta = 0.2163108 + 2 * math.atan(0.9671396 * math.tan(0.00860 * (j - 186)))
    phi = math.asin(0.39795 * math.cos(theta))
    p, lat_r = 0.8333, math.radians(lat)
    x = (math.sin(math.radians(p)) + math.sin(lat_r) * math.sin(phi)) / (math.cos(lat_r) * math.cos(phi))
    return 24 - (24 / math.pi) * math.acos(max(-1.0, min(1.0, x)))


def months(lat: float, lon: float, year: int) -> list[dict]:
    raw = fetch(lat, lon, year)
    by_month: dict[int, list[dict]] = defaultdict(list)
    for key in raw["T2M"]:
        d = date(int(key[:4]), int(key[4:6]), int(key[6:]))
        values = {p: raw[p][key] for p in raw}
        if any(v == -999.0 for v in values.values()):
            continue  # fill value = missing, never zero
        by_month[d.month].append({"date": d, **values})
    out = []
    for m in range(1, 13):
        days = by_month[m]
        if not days:
            out.append({"month": m, "missing": True})
            continue
        dry_run = longest = 0
        for day in days:
            dry_run = dry_run + 1 if day["PRECTOTCORR"] < 1.0 else 0
            longest = max(longest, dry_run)
        mid = date(year, m, 15)
        out.append({
            "month": m,
            "days": len(days),
            "t_mean": round(sum(d["T2M"] for d in days) / len(days), 1),
            "frost_days": sum(d["T2M_MIN"] < 0 for d in days),
            "hot_days": sum(d["T2M_MAX"] >= 30 for d in days),
            "precip_mm": round(sum(d["PRECTOTCORR"] for d in days)),
            "longest_dry_run": longest,
            "day_length_h": round(day_length(lat, mid), 1),
        })
    return out


if __name__ == "__main__":
    lat, lon, year = float(sys.argv[1]), float(sys.argv[2]), int(sys.argv[3])
    for row in months(lat, lon, year):
        print(json.dumps(row))
