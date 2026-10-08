#!/usr/bin/env python3
"""Aggregate-only ORDS feasibility audit. No legal scope inferred from age.

Download URL pinned in SOURCE_URL. Run: python3 audit.py input.csv > result.json
Upstream CSV is CC BY-SA 4.0; do not relabel or commit raw rows as CC0.
"""
import collections
import csv
import hashlib
import json
import sys
from pathlib import Path

REVISION = "90eba80740506b4fa283288780d34e9e7e01deef"
SOURCE_URL = f"https://raw.githubusercontent.com/openrepair/data/{REVISION}/aggregated/202507/OpenRepairData_v0.3_aggregate_202507.csv"
path = Path(sys.argv[1])
counts = collections.Counter()
categories = collections.Counter()
barriers = collections.Counter()
dates = []
fields_of_interest = ["model", "model_identifier", "event_date", "repair_barrier_if_end_of_life", "order_date", "delivery_date", "placed_on_market_date", "last_unit_placed_on_market_date", "specific_part", "requester_class", "year_of_manufacture", "product_age", "brand"]
with path.open(encoding="utf-8-sig", newline="") as handle:
    reader = csv.DictReader(handle)
    columns = reader.fieldnames
    for row in reader:
        counts["rows"] += 1
        for field in fields_of_interest:
            if row.get(field, "").strip():
                counts[field] += 1
        category = row["product_category"]
        categories[category] += 1
        barrier = row["repair_barrier_if_end_of_life"].strip()
        if barrier:
            barriers[barrier] += 1
        if row["event_date"]:
            dates.append(row["event_date"])
        if row["country"] == "DEU":
            counts["DEU_rows"] += 1
            if "Spare parts" in barrier:
                counts["DEU_spare_parts_barrier"] += 1
        if "Spare parts" in barrier:
            counts["spare_parts_barrier"] += 1
            if row["year_of_manufacture"].strip() or row["product_age"].strip():
                counts["spare_parts_barrier_with_age_or_year"] += 1
        if category in {"Mobile", "Tablet", "Flat screen", "Large home electrical"} and "Spare parts" in barrier:
            counts["broad_potentially_regulated_category_spares"] += 1
print(json.dumps({
    "source_url": SOURCE_URL,
    "revision": REVISION,
    "upstream_license": "CC BY-SA 4.0",
    "sha256": hashlib.sha256(path.read_bytes()).hexdigest(),
    "columns": columns,
    "total_rows": counts["rows"],
    "event_date_range": [min(dates), max(dates)],
    "field_completeness": {field: {"column_present": field in columns, "nonempty": counts[field], "total": counts["rows"]} for field in fields_of_interest},
    "counts": dict(counts),
    "categories": dict(sorted(categories.items())),
    "barriers": dict(sorted(barriers.items())),
    "limitations": ["No legal scope or violation inferred from age, category or barrier.", "Broad categories do not map reliably to regulated product groups.", "Blank field does not prove underlying fact absent.", "No individual records or free-text problems retained in this output."],
}, indent=2, ensure_ascii=False))
