# Real vegetation observations

Verified 2026-10-09 against the official metadata and live WFS response:
https://daten.berlin.de/datensaetze/baumbestand-berlin-wfs-48ad3a23

The current endpoint is https://gdi.berlin.de/services/wfs/baumbestand.
Both `baumbestand:strassenbaeume` and `baumbestand:anlagenbaeume` are queried.
The catalogue lists data updated 2026-04-09, licensed dl-de-zero-2.0.
This is not a claim that every individual tree was measured on that date.

A bounded GetFeature request around 52.52, 13.405 returned HTTP 200,
GeoJSON longitude/latitude points and Access-Control-Allow-Origin: *.
EPSG:4326 WFS BBOX ordering is latitude/longitude. Returned GeoJSON is
longitude/latitude. Unit tests guard this distinction, truncation and failure.

Distances are spherical point-to-point distances from the selected coordinate,
rounded to 0.1 m; this display precision does not imply survey accuracy.
Street trees and only part of park trees are covered. Private trees, hedges,
shrubs and canopy edges are not comprehensively represented. Missing features
never prove vegetation absent. These observations do not assign LAG-VSW points.
Requests are explicit, use a 100 m radius and a 30-second timeout. There is no
silent provider fallback. Failure of either Berlin layer rejects the survey.
Assessment exports retain the provider, request URLs, retrieval time and result.

Next: select and verify the unmarked glass geometry, then measure to actual
woody-vegetation boundaries. A photographic segmentation mask alone has no
geographic scale or position. OSM land-use categories must not be treated as
measured sealed surfaces (residential land contains gardens; polygons overlap).
Criterion 2 still needs validated surface data and explicit context review.
