Real Botanical Data for RPG Elements: A Comprehensive Resource List
Version: 1.0
Status: Data Source Reference
Purpose: To compile all real scientific and natural science data sources that can be used to extract plant stats and skills for Crack Flora Watcher / Fugenduell.

This document is organized by RPG element. Each section lists the botanical trait, the databases and literature sources that measure it, and how it maps to game mechanics.

1. General Plant Trait Databases (Foundational)
These are the mega-databases that cover hundreds of traits and thousands of species. They are the primary sources for stat generation.

1.1 TRY Plant Trait Database
What it is: The world's largest plant trait database, coordinated by the Max Planck Institute for Biogeochemistry in Jena, Germany. It integrates data from hundreds of contributed datasets into one consistent format.

Contents:

Version 6 (2022): 15 million trait records for 305,000 plant taxa

2,661 distinct traits

6.24 million individual plants represented

Open access data policy

Relevance to Crack Flora: TRY is the master database. It contains data for almost every trait needed for stat generation: plant height, seed mass, leaf traits, root traits, photosynthetic pathway, and more.

Links:

Official website: https://www.try-db.org

Data portal: https://www.try-db.org/TryWeb/dp.php

MPI-BGC page: https://www.bgc-jena.mpg.de

RPG Mapping: Source for all 6 core stats. TRY provides the raw trait values that are normalized into the 0–10 scale.

1.2 LEDA Traitbase
What it is: A database of life-history traits of the Northwest European flora. Freely available online.

Contents:

26 plant traits describing three key features: persistence, regeneration, and dispersal

Data for the Northwest European flora (ca. 3,000 species)

Traits include: age of first flowering, branching, bud bank seasonality, buoyancy, canopy height, dispersal, leaf distribution, leaf dry matter content, leaf mass, leaf size, dispersal morphology, seedbank longevity

Relevance to Crack Flora: LEDA is specifically focused on European flora, which matches Crack Flora's initial species roster. It provides life-history data that directly maps to TEMPO, SAAT, and WURZEL.

Links:

Official website: http://www.leda-traitbase.org

R package access: https://search.r-project.org

RPG Mapping:

TEMPO: Age of first flowering, life span

SAAT: Dispersal morphology, seedbank longevity

WURZEL: Bud bank seasonality, branching

1.3 BIEN (Botanical Information and Ecology Network)
What it is: An integrated data ecosystem for plant occurrence, vegetation-plot, and standardized trait data, covering North and South America.

Contents:

98,829 curated species range maps

289,743 species in the associated open-access range database

~81 million occurrence records

Integrates herbarium specimens, citizen-science records, vegetation plots

Relevance to Crack Flora: BIEN provides occurrence data that can inform species distribution and rarity. It is more focused on Americas, but its methodology and standards are a model for Crack Flora's own data infrastructure.

Links:

Official website: https://bien.nceas.ucsb.edu

RPG Mapping: Species distribution data can inform "regional availability" of seeds in the market.

1.4 AusTraits
What it is: A curated plant trait database for the Australian flora.

Contents:

448 traits across 28,640 taxa

Synthesises data from field campaigns, published literature, taxonomic monographs, and individual taxon descriptions

Relevance to Crack Flora: While focused on Australia, AusTraits demonstrates the methodology of harmonizing trait data across sources. Its structure is a model for how Crack Flora could build its own trait database.

Links:

Official website: https://austraits.org

RPG Mapping: Methodological model for trait harmonization.

1.5 NordicTraits
What it is: An imputed species-level functional trait dataset for vascular plants of Denmark, Finland, Iceland, Norway, and Sweden.

Contents:

44 selected key functional traits with no missing values

Covers all native vascular plants in the Nordic region

Published 2026

Relevance to Crack Flora: NordicTraits is directly relevant for Northern European urban flora. Its 44 traits include plant height, seed mass, and other functional traits needed for stat generation.

Links:

Access via Europe PMC: https://dev.europepmc.org

RPG Mapping: Direct source for all 6 stats for Nordic species.

2. Root Traits (WURZEL)
2.1 UNDERPLOT Database
What it is: A global dataset of key traits for plant belowground functioning.

Contents:

10,453 vascular plant species

19 belowground plant traits

Traits include: maximum rooting depth (RDepth), lateral rooting extent (LRExtent), fine root traits, clonal organs, bud banks

Relevance to Crack Flora: UNDERPLOT is the primary source for WURZEL stat. Rooting depth and lateral extent are the core measurements.

Links:

Published in New Phytologist: https://nph.onlinelibrary.wiley.com

HAL archive: https://hal.science

RPG Mapping:

WURZEL: Maximum rooting depth + lateral rooting extent + bud bank size + resprouting capacity

2.2 GRooT (Global Root Trait) Database
What it is: A global database of root traits.

Contents:

38 root traits

38,276 species-by-site mean values

114,222 trait records

Traits include: root mycorrhizal colonization intensity, mean root diameter, root tissue density, specific root length, maximum rooting depth

Relevance to Crack Flora: GRooT provides complementary root trait data, especially fine root traits that affect nutrient uptake and drought resilience.

Links:

Official website: https://groot-database.github.io

RPG Mapping:

WURZEL: Root tissue density, specific root length

DÜRRE: Mycorrhizal colonization (indirect drought resilience)

2.3 RSIP (Root Systems of Individual Plants) Database
What it is: The primary global resource for rooting depth.

Contents:

5,647 observations

Largest database describing maximum rooting depth and lateral spread

More than doubled since 2005

Relevance to Crack Flora: RSIP provides individual-level root data, which aligns with Crack Flora's Individuum-level claim model.

Links:

Harvard Forest: https://harvardforest1.fas.harvard.edu

RPG Mapping:

WURZEL: Maximum rooting depth (the single most important root measurement)

3. Seed Traits (SAAT)
3.1 Seed Information Database (SID)
What it is: A compilation of seed biological trait data, hosted by the Society for Ecological Restoration (SER) in collaboration with Royal Botanic Gardens Kew.

Contents:

Dispersal agents: 5,366 records

Seed mass, seed bank longevity, germination requirements

Covers thousands of species globally

Relevance to Crack Flora: SID is the primary source for SAAT stat. It provides seed production numbers, dispersal mechanisms, and seed bank persistence.

Links:

Official website: https://ser-sid.org

RPG Mapping:

SAAT: Seed production, dispersal distance, seed bank persistence

3.2 D3 (Dispersal and Diaspore Database)
What it is: A database for seed dispersal analysis.

Contents:

Integrates empirical studies on seed dispersal

Baseline data and statistics on seed dispersal

Available at www.seed-dispersal.info

Relevance to Crack Flora: D3 provides detailed dispersal data, which maps to the SAAT stat and the dispersal-related skills.

Links:

Official website: http://www.seed-dispersal.info

RPG Mapping:

SAAT: Dispersal distance, dispersal mechanism (wind, animal, ballistic)

3.3 Chinese Seed Trait Database (CSTD)
What it is: A comprehensive seed trait database built by the Wuhan Botanical Garden, Chinese Academy of Sciences.

Contents:

Key aspects of seed dispersal, establishment, and persistence

Published in New Phytologist (2025)

Bridges global gaps in plant trait data

Relevance to Crack Flora: CSTD provides Asian species data, useful for expanding beyond European flora.

Links:

Wuhan Botanical Garden: https://english.wbg.cas.cn

RPG Mapping:

SAAT: Seed dispersal, establishment, persistence traits

4. Chemical Defense (CHEMIE)
4.1 Dr. Duke's Phytochemical and Ethnobotanical Databases
What it is: A comprehensive database of phytochemical compounds and their biological activities.

Contents:

Allelopathic compounds

Bioactive compounds from plants

Phytochemical Dictionary references

Data on 5-HT inhibitors, 5-lipoxygenase inhibitors, and other biological activities

Relevance to Crack Flora: Dr. Duke's database is the primary source for CHEMIE stat. It identifies which plants produce allelopathic compounds and what those compounds do.

Links:

USDA Phytochemical Database: https://phytochem.nal.usda.gov

RPG Mapping:

CHEMIE: Allelopathy index, toxin class, salt pump presence

4.2 Allelopathy Literature (Primary Sources)
What it is: Peer-reviewed studies quantifying allelopathic effects.

Key data:

Benzoxazinoids (cyclic hydroxamic acids) — natural herbicides, insecticides, fungicides

Triterpene lamtidines — defense against mammals, insects, nematodes, fungi, bacteria

Allelopathic effects on invasive weeds (B. pilosa, G. parviflora, L. multiflorum, P. minor)

Relevance to Crack Flora: These studies provide the quantitative data for allelopathy indices (RI values) used in the CHEMIE stat.

Links:

PMC article on allelochemicals: https://pmc.ncbi.nlm.nih.gov

RPG Mapping:

CHEMIE: Allelopathy index (RI), toxin class (none/mild/moderate/strong)

5. Drought and Stress Tolerance (DÜRRE)
5.1 Xylem Functional Traits Database
What it is: A global database of xylem hydraulic traits related to drought resistance.

Contents:

Stem xylem-specific hydraulic conductivity (Ks)

Leaf water potential at turgor loss point (TP0)

Water potential at 50% loss of hydraulic conductivity (P50)

Hydraulic safety margin (HSM)

Relevance to Crack Flora: Xylem traits are the physiological basis of drought tolerance. TP0 and P50 are the key measurements for DÜRRE stat.

Links:

Official website: https://xylemfunctionaltraits.org

RPG Mapping:

DÜRRE: Leaf turgor loss point (TP0), hydraulic safety margin

5.2 "Drying without Dying" Database
What it is: A genome database for desiccation-tolerant plants.

Contents:

16 vegetative desiccation tolerance (VDT) plant genomes

10 mosses included

10 closely related genomes

Access at http://desiccation.novogene.com

Relevance to Crack Flora: Desiccation tolerance is the extreme form of drought tolerance. This database supports the Silber-Birnmoos (Bryum argenteum) and Mauerraute (Asplenium ruta-muraria) skills.

Links:

Database: http://desiccation.novogene.com

RPG Mapping:

DÜRRE: Desiccation tolerance (for mosses and ferns)

Skill: Trockenstarre (never drops below 5% coverage)

5.3 C4/CAM Photosynthesis Literature
What it is: Peer-reviewed data on photosynthetic pathways.

Key data:

C3, C4, CAM, C3–C4 intermediate, C4+CAM classifications

Species-level pathway assignments

Water-use efficiency data

Relevance to Crack Flora: Photosynthetic pathway is the single most important predictor of drought tolerance. Portulaca oleracea (C4 + CAM) is the model species.

RPG Mapping:

DÜRRE: Photosynthetic pathway (C3=2, C3–C4=5, C4=8, CAM=10, C4+CAM=10)

6. Trampling Resistance (TRITT)
6.1 Trampling Tolerance Database (Cole & Bayfield Protocols)
What it is: A comprehensive database of experimental trampling studies.

Contents:

400+ citations on foot and vehicle traffic impacts

1,444 individual observations involving 737 species

Resistance index (0–100)

Recovery index (0–100)

Relevance to Crack Flora: This is the primary source for TRITT stat. Plantago major and Poa annua are well-documented trampling-tolerant species.

Links:

Literature review available through environmental science journals

RPG Mapping:

TRITT: Resistance index + recovery index + growth form

6.2 Grassland Utilization Indicator Values
What it is: Indicator values for grassland species tolerance against trampling, mowing, grazing.

Contents:

Comparable to Ellenberg's indicator values

Tolerance values coded: intolerant (1) to tolerant (5)

Foraging value for cattle and deer

Relevance to Crack Flora: Provides categorical trampling tolerance data that can be normalized into the TRITT stat.

Links:

UFZ database: https://www.ufz.de

RPG Mapping:

TRITT: Trampling tolerance indicator values

6.3 Plantago asiatica and Eleusine indica Data
What it is: Specific trampling-tolerant species studies.

Key data:

Plantago asiatica and Eleusine indica are documented as trampling-tolerant species

Dauciform roots in Carex filispica related to trampling resistance

Relevance to Crack Flora: These species are direct models for the TRITT stat and the Trittplatte skill.

RPG Mapping:

TRITT: Species-specific trampling resistance values

Skill: Trittplatte (TRITT counts double in high-disturbance arenas)

7. Growth Rate and Life Cycle (TEMPO)
7.1 RGRP Database
What it is: A database and software for computing relative growth rate (RGR) of plants.

Contents:

Integrated RGR analysis

Seasonal variation of leaf area

Complex growth calculations

Relevance to Crack Flora: RGR is the core measurement for TEMPO stat. High RGR = fast generation time = Ruderal strategy.

Links:

AGRIS: https://agris.fao.org

RPG Mapping:

TEMPO: Relative growth rate (RGR)

7.2 iES_GRdb (Intraspecific Economic Spectrum and Growth Rate Database)
What it is: A database providing comprehensive evidence on the relationship between plant economic traits and individual growth rate.

Contents:

Literature survey of studies measuring leaf economic traits and growth rate

Intraspecific variation data

Published 2026

Relevance to Crack Flora: Provides intraspecific growth rate variation, which supports the seed stat variation (95–105% of parent stats).

Links:

CONICET: https://ri.conicet.gov.ar

RPG Mapping:

TEMPO: Intraspecific RGR variation

Seed System: Stat variation in harvested seeds

7.3 Grime & Hunt RGR Data
What it is: Classic dataset of relative growth rates for 130 herbaceous species.

Contents:

RGR values in g/g/day

Range: 0.03–0.40 g/g/day

Standard reference for plant growth rates

Relevance to Crack Flora: This is the foundational dataset for TEMPO stat normalization.

RPG Mapping:

TEMPO: RGR normalization (0.03–0.40 g/g/day → 0–10)

8. CSR Strategy (Grime's Theory)
8.1 StrateFy Tool
What it is: A globally-calibrated tool for estimating CSR strategies using specific leaf area (SLA), leaf dry matter content (LDMC), and leaf area (LA).

Contents:

CSR strategy estimation from leaf traits

Globally calibrated

Data for thousands of species

Relevance to Crack Flora: StrateFy provides the CSR classification that drives the rock-paper-scissors dynamics in Fugenduell.

Links:

Zenodo data: https://zenodo.org

Dryad data: https://datadryad.org

RPG Mapping:

CSR Class: C, S, R, CR, SR, CS classifications

Battle System: Rock-paper-scissors dynamics

8.2 Pladias Database
What it is: A database containing CSR scores for plant species.

Contents:

Score values for C, S, R categories

Categorized life strategies (C, CS, CR, CSR, S, SR, R)

Transitions between strategies

Relevance to Crack Flora: Direct source for CSR classification of European species.

Links:

Pladias: https://www.pladias.cz

RPG Mapping:

CSR Class: Direct classification for each species

9. Urban Plant Ecology
9.1 Sheffield Pavement Flora Survey
What it is: A systematic florula of a disturbed urban habitat (pavements of Sheffield, England).

Contents:

Occupancy study of vascular plants of 16 500 × 500 m (0.25 km²) urban grid cells

862 records of 183 taxa

Published 2016

Relevance to Crack Flora: This is the closest scientific analogue to Crack Flora's data collection. It documents exactly what plants grow in urban pavement cracks.

Links:

Biodiversity Data Journal: https://nora.nerc.ac.uk

Zenodo: https://zenodo.org

RPG Mapping:

Species Roster: Validated species list for urban cracks

Arena Validation: Confirms that pavement cracks are a legitimate ecological habitat

9.2 Paris Pavement Flora Comparison (1884–2021)
What it is: A 136-year comparison of plant communities on Paris pavements.

Contents:

Inventory from 1884 ("Essay on the flora of the Paris pavement")

Modern comparison (2021)

Documents changes in urban plant communities over time

Relevance to Crack Flora: This is the longest time-series of urban pavement flora. It demonstrates the scientific value of longitudinal observation.

Links:

Zenodo: https://zenodo.org

RPG Mapping:

Scientific Value: Demonstrates the importance of long-term observation

Level 5 (Full Year): Justifies the 12-month documentation requirement

10. Ellenberg Indicator Values
What it is: Indicator values for plant species across Europe, describing their ecological preferences.

Contents:

Light (L), Temperature (T), Moisture (F), Reaction (R), Nitrogen (N), Salinity (S)

Values 1–9 (or 1–12 for moisture)

Covers thousands of European species

Relevance to Crack Flora: Ellenberg values provide environmental preference data that can inform arena weighting and species suitability.

Links:

Ecoflora (British Isles): http://www.ecoflora.co.uk

RPG Mapping:

Arena Weighting: Ellenberg values inform which species thrive in which arenas

Boden-pH: Ellenberg R value (reaction) maps to pH preference

11. Ecoflora
What it is: A database of British Isles flora traits.

Contents:

Canopy height, leaf traits, life form, flowering phenology, pollination, seed weight

British-calibrated Ellenberg values

18 _uk columns

Relevance to Crack Flora: Ecoflora provides a comprehensive trait set for British species, which overlaps significantly with Crack Flora's target flora.

Links:

Official website: http://www.ecoflora.co.uk

Natural History Museum dataset: https://data.nhm.ac.uk

RPG Mapping:

All 6 Stats: Height, leaf traits, life form, phenology, seed weight

Ellenberg Values: Environmental preferences

12. Summary: RPG Element to Data Source Mapping
RPG Element	Primary Data Sources
WURZEL	UNDERPLOT, GRooT, RSIP
TRITT	Cole & Bayfield trampling database, Grassland utilization indicators
DÜRRE	Xylem Functional Traits Database, "Drying without Dying", C4/CAM literature
SAAT	Seed Information Database (SID), D3 Dispersal Database, CSTD
TEMPO	RGRP, iES_GRdb, Grime & Hunt RGR data
CHEMIE	Dr. Duke's Phytochemical Database, Allelopathy literature
CSR Class	StrateFy, Pladias
Arena Weighting	Ellenberg Indicator Values, Ecoflora
Species Roster	Sheffield Pavement Survey, Paris Pavement Comparison
General Traits	TRY, LEDA, BIEN, AusTraits, NordicTraits
13. Complete Link Index
Database	URL
TRY Plant Trait Database	https://www.try-db.org
LEDA Traitbase	http://www.leda-traitbase.org
BIEN	https://bien.nceas.ucsb.edu
AusTraits	https://austraits.org
UNDERPLOT	https://hal.science
GRooT	https://groot-database.github.io
RSIP	https://harvardforest1.fas.harvard.edu
Seed Information Database (SID)	https://ser-sid.org
D3 Dispersal Database	http://www.seed-dispersal.info
CSTD	https://english.wbg.cas.cn
Dr. Duke's Phytochemical DB	https://phytochem.nal.usda.gov
Xylem Functional Traits	https://xylemfunctionaltraits.org
Drying without Dying	http://desiccation.novogene.com
StrateFy	https://zenodo.org
Pladias	https://www.pladias.cz
Ecoflora	http://www.ecoflora.co.uk
NordicTraits	https://dev.europepmc.org
Sheffield Pavement Survey	https://nora.nerc.ac.uk
Paris Pavement Comparison	https://zenodo.org