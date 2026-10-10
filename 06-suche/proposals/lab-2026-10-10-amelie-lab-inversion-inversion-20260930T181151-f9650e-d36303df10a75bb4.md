# Proposals from plan lab-2026-10-10-amelie-lab-inversion-inversion-20260930T181151-f9650e-d36303df10a75bb4

Packet: amelie-lab-inversion-inversion-20260930T181151-f9650e-d36303df10a75bb4 · Candidate: amelie-lab-inversion-inversion-20260930T181151-f9650e-d36303df10a75bb4
Not applied. A human decides.

- [06-suche/amelie-lab-protokoll.md] inversion: amelie-lab-inversion-inversion-20260930T181151-f9650e-d36303df10a75bb4. Absicht: timber, PTR (rectangular/square steel tubing), corrugated sheets, and steel coils. spain based. Modell: gemini-2.5-flash. Existenzprüfung: nein. Alle Ideen ungeprüft. Die folgenden Angaben sind gespeicherte Modellausgaben, keine bestätigten Tatsachen. Nur grounded=true ist Evidenz; Score-Änderungen benötigen zusätzlich quote_status=verified. Quellen, fact_checks und fehlende Felder bleiben wie im Original; keine neuen Prüfungen durchgeführt.
- [06-suche/amelie-lab-protokoll.md] Originalfeld run_id, Teil 1 (laut gespeicherter Datei):
"inversion-20260930T181151-f9650e"
- [06-suche/amelie-lab-protokoll.md] Originalfeld intent, Teil 1 (laut gespeicherter Datei):
"timber, PTR (rectangular/square steel tubing), corrugated sheets, and steel coils. spain based"
- [06-suche/amelie-lab-protokoll.md] Originalfeld model, Teil 1 (laut gespeicherter Datei):
"gemini-2.5-flash"
- [06-suche/amelie-lab-protokoll.md] Originalfeld created_at, Teil 1 (laut gespeicherter Datei):
"2026-09-30T18:26:01Z"
- [06-suche/amelie-lab-protokoll.md] Originalfeld state_missing, Teil 1 (laut gespeicherter Datei):
[]
- [06-suche/amelie-lab-protokoll.md] Originalfeld plan, Teil 1 (laut gespeicherter Datei):
{
  "area": "timber, PTR (rectangular/square steel tubing), corrugated sheets, and steel coils. spain based",
  "mode_list": [
    "Automated visual inspection of timber for defects (knots, cracks, rot).",
    "Smartphone app for timber species identification using AI.",
    "Non-destructive testing (NDT) for internal defects in timber using acoustics/vibrations.",
    "Real-time tracking of timber origin for EUDR compliance in Spain.",
    "Automated measurement of dimensions and volume for timber logs/beams.",
    "AI-powered corrosion detection on steel surfaces (corrugated sheets, coils, PTR).",
    "Automated quality control of steel coils for surface defects (scratches, dents).",
    "Smartphone app for identifying steel types/alloys based on visual cues or simple tests.",
    "Inventory management system for steel products (PTR, corrugated sheets, coils) using computer vision.",
    "Structural health monitoring of PTR structures using embedded sensors and AI.",
    "Optimizing cutting plans for timber or steel to minimize waste using AI.",
    "Detecting counterfeit or substandard materials (timber, steel) in construction supply chains."
  ],
  "target_queries": [
    "Spanish technical building code steel structural elements quality verification",
    "Regulación española trazabilidad madera construcción",
    "Inspección de calidad de materiales de construcción España normativa"
  ],
  "class_hint": "A"
}
- [06-suche/amelie-lab-protokoll.md] Originalfeld target, Teil 1 (laut gespeicherter Datei):
{
  "target": {
    "name": "Certificación y Trazabilidad de Materiales de Construcción en España (CTE, CPR, CE Marking, DoP)",
    "source_url": "https://www.ochoalacar.com/certificacion-trazabilidad-materiales/",
    "source_label": "Regulación Española: Certificación y Trazabilidad de Materiales",
    "anchor_class": "A",
    "who_pays": "Large manufacturers and suppliers profit from selling certified materials, often at a premium. Large construction companies pay for these materials to meet regulatory requirements and avoid liability, passing costs to clients.",
    "who_carries_burden": "Small construction companies, self-builders, individual homeowners, and construction workers bear the burden of verifying material compliance on-site, understanding complex Declarations of Performance (DoPs), or dealing with the consequences of non-compliant materials, often lacking easy access to information or verification tools.",
    "where_data_stops": "Critical data, such as Declarations of Performance (DoPs), technical specifications, and compliance certificates, is typically locked in lengthy PDF documents, proprietary manufacturer portals, or complex consultant reports, making it difficult for non-experts to access and interpret efficiently.",
    "blind_spot": "The practical, rapid, and accessible on-site verification needs of non-expert users (e.g., small builders, homeowners, site workers) are overlooked because they do not represent a market for expensive compliance software subscriptions or specialized consulting services."
  },
  "operator": "OP-2",
  "thesis": "The complex, technical compliance documentation for construction materials in Spain, intended for expert verification, can be inverted into an accessible, commodity-sensor-driven tool for on-site verification by non-expert users.",
  "candidates": [
    {
      "id": "C1",
      "idea": "An app that uses image recognition (knots, grain, defects) and acoustic analysis (tap test) to provide a preliminary, on-site indication of whether a timber piece matches a declared structural grade (e.g., C24), helping non-experts verify incoming materials.",
      "why_now": "On-device multimodal AI (image + audio) for structural defect detection and classification, capable of comparing against large datasets of timber grades and defects with high accuracy, making real-time, local assessment possible.",
      "recipient": "AITIM (Asociación de Investigación Técnica de las Industrias de la Madera) or a university consortium specializing in wood science.",
      "recipient_kind": "association",
      "check_queries": [
        "AI timber structural grade verification app",
        "smartphone wood quality assessment Spain"
      ]
    },
    {
      "id": "C2",
      "idea": "A mobile application that scans CE markings, QR codes, or product codes on steel products (PTR, corrugated sheets, coils) to instantly retrieve and simplify relevant Declaration of Performance (DoP) information, highlighting key structural properties for non-technical users.",
      "why_now": "Advanced OCR and QR/barcode scanning combined with Large Language Models (LLMs) capable of real-time extraction, summarization, and simplification of complex technical documents (DoPs) from varied digital formats into digestible language.",
      "recipient": "Instituto Español del Acero Estructural (IEAE) or a consumer protection agency for construction materials.",
      "recipient_kind": "association",
      "check_queries": [
        "Steel product CE mark scanner app Spain",
        "AI DoP simplification tool construction materials"
      ]
    },
    {
      "id": "C3",
      "idea": "An app that uses smartphone photogrammetry or LiDAR to analyze the 3D profile of corrugated steel sheets on-site, providing a preliminary assessment of deformation or damage by comparing it against a library of standard profiles.",
      "why_now": "On-device 3D reconstruction and precise measurement capabilities from smartphone LiDAR/photogrammetry APIs, coupled with AI for automated anomaly detection and comparison against stored digital models of standard profiles.",
      "recipient": "A municipal building authority or a public research institute focused on construction material quality.",
      "recipient_kind": "agency",
      "check_queries": [
        "Smartphone corrugated sheet damage detection app",
        "LiDAR roofing inspection Spain"
      ]
    },
    {
      "id": "C4",
      "idea": "An app using computer vision to analyze images of steel surfaces (coils, PTR) and provide an initial indication of rust extent and type, or coating integrity, against relevant quality standards (e.g., ISO 8501-1 for rust grades), for quick field assessment.",
      "why_now": "Deep learning models for image segmentation and classification, trained on extensive datasets of corroded and coated steel surfaces, enabling robust, on-device inference for immediate condition assessment without cloud dependency.",
      "recipient": "Centro Nacional de Investigaciones Metalúrgicas (CENIM) or a public works department.",
      "recipient_kind": "institution",
      "check_queries": [
        "AI rust detection steel app",
        "smartphone coating integrity check steel standards"
      ]
    },
    {
      "id": "C5",
      "idea": "An app that assists users in identifying visible signs of specific timber treatments (e.g., pressure treatment coloration, incising patterns) through image analysis, linking findings to their corresponding durability classes as per UNE-EN 335 and providing guidance for further checks.",
      "why_now": "Advanced computer vision for subtle pattern recognition and classification, leveraging a comprehensive database of timber treatment visual characteristics and associated standards, enhanced by AI to guide users through visual assessment protocols.",
      "recipient": "Forestry research institute (e.g., INIA-CIFOR in Spain) or a public forest management agency.",
      "recipient_kind": "institution",
      "check_queries": [
        "AI timber treatment identification app Spain",
        "smartphone wood preservative recognition UNE-EN 335"
      ]
    },
    {
      "id": "C6",
      "idea": "A decentralized app that helps users aggregate and organize material passport information (CE marking, DoP, specific certifications) for their construction projects. Users can scan products or manually input references, and the app retrieves publicly available data or stores user-uploaded documents locally.",
      "why_now": "Federated learning approaches for secure data aggregation and robust APIs for interacting with emerging public material databases, combined with local-first data storage strategies to empower users with self-managed material compliance documentation.",
      "recipient": "Spanish Ministry of Transport, Mobility and Urban Agenda (MITMA) or a public building information modeling (BIM) initiative.",
      "recipient_kind": "agency",
      "check_queries": [
        "Digital material passport app Spain",
        "construction product data aggregator CE"
      ]
    }
  ],
  "shortlist": [
    "C1",
    "C2",
    "C3",
    "C4"
  ]
}
- [06-suche/amelie-lab-protokoll.md] Originalfeld result, Teil 1 (laut gespeicherter Datei):
{
  "survivors": [
    {
      "candidate_id": "C1",
      "rank": 1,
      "idea": "An app that uses image recognition (knots, grain, defects) and acoustic analysis (tap test) to provide a preliminary, on-site indication of whether a timber piece matches a declared structural grade (e.g., C24), helping non-experts verify incoming materials.",
      "gap": "Non-experts lack an accessible, on-site tool to preliminarily verify the structural grade of timber pieces.",
      "gap_stands_alone": true,
      "who_has_problem": "Small construction companies, self-builders, individual homeowners, and construction workers struggle to verify incoming timber materials for compliance and quality.",
      "why_now": "On-device multimodal AI (image + audio) for structural defect detection and classification, capable of comparing against large datasets of timber grades and defects with high accuracy, making real-time, local assessment possible.",
      "buildable": "Yes, 'Smart Thumper' demonstrates the acoustic analysis component, and industrial AI vision systems are already used for visual defect detection, making a combined smartphone app buildable.",
      "recipient": "AITIM (Asociación de Investigación Técnica de las Industrias de la Madera)",
      "recipient_kind": "association",
      "evidence_urls": [
        "https://www.hansenpolebuildings.com/2019/03/smartphone-app-to-test-lumber-strength/",
        "https://ifactoryapp.com/ai-vision-camera/ai-vision-lumber-wood-grading-inspection",
        "https://aitim.infomadera.net/normativa/",
        "https://www.ochoalacar.com/certificacion-trazabilidad-materiales/"
      ]
    },
    {
      "candidate_id": "C2",
      "rank": 2,
      "idea": "A mobile application that scans CE markings, QR codes, or product codes on steel products (PTR, corrugated sheets, coils) to instantly retrieve and simplify relevant Declaration of Performance (DoP) information, highlighting key structural properties for non-technical users.",
      "gap": "Non-technical users struggle to instantly retrieve and simplify complex Declaration of Performance (DoP) information from steel product markings on-site.",
      "gap_stands_alone": true,
      "who_has_problem": "Small construction companies, self-builders, individual homeowners, and construction workers who need to understand complex DoPs for steel materials for on-site verification.",
      "why_now": "Advanced OCR and QR/barcode scanning combined with Large Language Models (LLMs) capable of real-time extraction, summarization, and simplification of complex technical documents (DoPs) from varied digital formats into digestible language.",
      "buildable": "Yes, OCR/scanning is mature, and LLMs are effective for summarization; existing apps like CertiScan perform photo-based compliance checks, making integration for DoP simplification buildable.",
      "recipient": "Instituto Español del Acero Estructural (IEAE)",
      "recipient_kind": "association",
      "evidence_urls": [
        "https://play.google.com/store/apps/details?id=com.finestfor.certiscan",
        "https://play.google.com/store/apps/details?id=es.coaat.conmat&hl=en_GB",
        "https://www.ochoalacar.com/certificacion-trazabilidad-materiales/",
        "https://www.transportes.gob.es/recursos_mfom/comodin/recursos/guia_para_las_especificaciones_tecnicas_del_acero_estructural.pdf"
      ]
    }
  ],
  "kills": [
    {
      "candidate_id": "C3",
      "reason": "The idea of detecting damage or deformation on roofs/sheets using AI from photos is a crowded field with multiple existing apps offering similar functionality, even if not explicitly mentioning 3D profile comparison with LiDAR.",
      "failed_checks": [
        "in_mode_or_dense"
      ]
    },
    {
      "candidate_id": "C4",
      "reason": "This idea directly matches an entry in the banned mode list: 'AI-powered corrosion detection on steel surfaces (corrugated sheets, coils, PTR).'",
      "failed_checks": [
        "in_mode_or_dense"
      ]
    }
  ],
  "log_row": {
    "target": "Certificación y Trazabilidad de Materiales de Construcción en España (CTE, CPR, CE Marking, DoP)",
    "anchor_class": "A",
    "operator": "OP-2",
    "candidates": 6,
    "survivors": 2,
    "best_gap": "Non-experts lack an accessible, on-site tool to preliminarily verify the structural grade of timber pieces."
  },
  "retro": {
    "learned": "I learned to be very strict with the 'in_mode_or_dense' check, particularly against the explicit banned mode list, and to assess whether a candidate's core functionality is covered by existing crowded fields.",
    "mistake": "I initially overlooked the direct match of C4 with a banned mode entry and almost let C3 pass despite its core problem being addressed by existing 'roof damage detection' apps.",
    "next_time": "Next time, I will perform the 'in_mode_or_dense' and 'banned mode' checks more rigorously as the very first step for each candidate, right after checking 'problem_evidence'."
  }
}
- [06-suche/amelie-lab-protokoll.md] Originalfeld tool_calls, Teil 1 (laut gespeicherter Datei):
[
  {
    "call_id": "inversion-20260930T181151-f9650e-t01",
    "tool": "bib_find",
    "status": "ok",
    "summary": "corrugat"
  },
  {
    "call_id": "inversion-20260930T181151-f9650e-t02",
    "tool": "bib_find",
    "status": "ok",
    "summary": "sheets"
  },
  {
    "call_id": "inversion-20260930T181151-f9650e-t03",
    "tool": "bib_find",
    "status": "ok",
    "summary": "square"
  },
  {
    "call_id": "inversion-20260930T181151-f9650e-t04",
    "tool": "search",
    "status": "ok",
    "summary": "Spanish regulations for quality control and traceability of construction materials: timber, steel (PTR, corrugated sheets, coils)"
  },
  {
    "call_id": "inversion-20260930T181151-f9650e-t05",
    "tool": "bib_find",
    "status": "ok",
    "summary": "acoustic, analysis"
  },
  {
    "call_id": "inversion-20260930T181151-f9650e-t06",
    "tool": "bib_find",
    "status": "ok",
    "summary": "acoustic"
  },
  {
    "call_id": "inversion-20260930T181151-f9650e-t07",
    "tool": "bib_find",
    "status": "ok",
    "summary": "corrugat, instantl"
  },
  {
    "call_id": "inversion-20260930T181151-f9650e-t08",
    "tool": "bib_find",
    "status": "ok",
    "summary": "corrugat"
  },
  {
    "call_id": "inversion-20260930T181151-f9650e-t09",
    "tool": "bib_find",
    "status": "ok",
    "summary": "assessme, comparin"
  },
  {
    "call_id": "inversion-20260930T181151-f9650e-t10",
    "tool": "bib_find",
    "status": "ok",
    "summary": "assessme"
  },
  {
    "call_id": "inversion-20260930T181151-f9650e-t11",
    "tool": "bib_find",
    "status": "ok",
    "summary": "assessme, computer"
  },
  {
    "call_id": "inversion-20260930T181151-f9650e-t12",
    "tool": "bib_find",
    "status": "ok",
    "summary": "assessme"
  },
  {
    "call_id": "inversion-20260930T181151-f9650e-t13",
    "tool": "search",
    "status": "ok",
    "summary": "AI timber structural grade verification app"
  },
  {
    "call_id": "inversion-20260930T181151-f9650e-t14",
    "tool": "search",
    "status": "ok",
    "summary": "Steel product CE mark scanner app Spain"
  },
  {
    "call_id": "inversion-20260930T181151-f9650e-t15",
    "tool": "search",
    "status": "ok",
    "summary": "Smartphone corrugated sheet damage detection app"
  }
]
- [06-suche/amelie-lab-protokoll.md] Originalfeld accounting, Teil 1 (laut gespeicherter Datei):
{
  "model_calls": 6,
  "search_calls": 4,
  "search_queries": 13,
  "cost_usd": 0.059247
}
- [06-suche/amelie-lab-protokoll.md] Originalfeld log_entry, Teil 1 (laut gespeicherter Datei):
"<!-- proposed by the Lab's Inversion agent, run inversion-20260930T181151-f9650e; nothing was written to Amélie -->\n| 2026-09-30 | Lab | Certificación y Trazabilidad de Materiales de Construcción en España (CTE, CPR, CE Marking, DoP) (Klasse A) | OP-2 | 6 | 2 (ungeprüft): 1. An app that uses image recognition (knots, grain, defects) and acoustic analysis (tap test) to provide a preliminary, on-site indication of whether a timber piece matches a declared structural grade (e.g., C24), helping non-experts verify incoming materials. (→ AITIM (Asociación de Investigación Técnica de las Industrias de la Madera)); 2. A mobile application that scans CE markings, QR codes, or product codes on steel products (PTR, corrugated sheets, coils) to instantly retrieve and simplify relevant Declaration of Performance (DoP) information, highlighting key structural properties for non-technical users. (→ Instituto Español del Acero Estructural (IEAE)) | Non-experts lack an accessible, on-site tool to preliminarily verify the structural grade of timber pieces. |\n\n### Inversion run inversion-20260930T181151-f9650e — 2026-09-30 (intent: timber, PTR (rectangular/square steel tubing), corrugated sheets, and steel coils. spain based)\n- **Learned:** I learned to be very strict with the 'in_mode_or_dense' check, particularly against the explicit banned mode list, and to assess whether a candidate's core functionality is covered by existing crowded fields.\n- **Mistake:** I initially overlooked the direct match of C4 with a banned mode entry and almost let C3 pass despite its core problem being addressed by existing 'roof damage detection' apps.\n- **Next time:** Next time, I will perform the 'in_mode_or_dense' and 'banned mode' checks more rigorously as the very first step for each candidate, right after checking 'problem_evidence'.\n- **Prior-art leads (automatic search, for the existence check; not a verdict):**\n  - C1 (ok): AI timber structural grade verification app -> https://www.hansenpolebuildings.com/2019/03/smartphone-app-to-test-lumber-strength/, https://ifactoryapp.com/ai-vision-camera/ai-vision-lumber-wood-grading-inspection, https://ai-innovate.com/wood-defect-detection-using-ai/, https://jmlogmarket.io/ai-log-grader\n  - C2 (ok): Steel product CE mark scanner app Spain -> https://play.google.com/store/apps/details?id=com.finestfor.certiscan, https://play.google.com/store/apps/details?id=com.finestfor.certiscan&hl=en, https://play.google.com/store/apps/details?id=es.coaat.conmat&hl=en_GB, https://www.ibf-solutions.com/en/ce-marking-software-safexpert\n  - C3 (ok): Smartphone corrugated sheet damage detection app -> https://roofhawk.ai/, https://useproline.com/five-drone-hail-damage-software/, https://www.lovelandinnovations.com/roofing/, https://www.lovelandinnovations.com/news/handheld-inspections/\n"
- [06-suche/amelie-lab-protokoll.md] Originalfeld prior_art, Teil 1 (laut gespeicherter Datei):
[
  {
    "candidate_id": "C1",
    "question": "AI timber structural grade verification app",
    "status": "ok",
    "answer": "Several AI-powered applications and systems exist for various aspects of timber analysis, including structural grade verification, defect detection, and species identification.\n\n**Apps for Structural Grade Verification and Stiffness Assessment:**\n\n*   **Smart Thumper** is a smartphone app developed by scientists at Mississippi State University's Forest and Wildlife Research Center. This app uses sound waves or vibrations to determine the stiffness of individual pieces of lumber, a quality directly related to strength. The co-developer, Frederico Franca, envisioned the app to provide a more affordable and accessible non-destructive testing method compared to expensive traditional equipment. It can help in selecting stiffer pieces of lumber for situations requiring higher performance, potentially optimizing the longevity and cost-efficiency of wood structures.\n\n**AI Systems for Industrial Lumber Grading and Defect Detection:**\n\n*   **iFactory's Vision Classification platform** is an industrial AI vision system designed to automate lumber grading. It replaces manual inspection with deep learning models trained on millions of board images. This system can detect over 20 defect categories, including knots, splits, wane, checks, stain, and dimensional deviations, in real-time at speeds exceeding 400 feet per minute on grading chains and planer mills. It adapts to different wood species and aims to eliminate variability in grading caused by human factors.\n*   **AI-innovate** also offers AI inspection solutions for wood manufacturers. Their systems, such as AIxEye, focus on real-time defect detection and process optimization on production lines, identifying flaws like knots, cracks, resin pockets, discoloration, and other surface defects.\n\n**Apps for Log Grading and Value Estimation:**\n\n*   The **JMLogMarket AI Log Grader** is a free tool that uses AI vision to analyze photos of hardwood logs. It examines photos for surface defects (knots, sweep, bumps, holes, conks, cankers) and end-grain defects (ring shake, heart checks, rot, wetwood). It then applies USDA Forest Service grading rules (such as NE-1 for log grades and AgH 678 for defect scoring) to provide a grade (veneer, F1, F2, F3, construction, or local-use) and an estimated dollar value based on current Appalachian timber prices. This tool is intended as a pricing decision-support tool rather than a replacement for professional log scalers.\n\n**Apps for Wood Species Identification and General Analysis:**\n\n* ",
    "pages": [
      "https://www.hansenpolebuildings.com/2019/03/smartphone-app-to-test-lumber-strength/",
      "https://ifactoryapp.com/ai-vision-camera/ai-vision-lumber-wood-grading-inspection",
      "https://ai-innovate.com/wood-defect-detection-using-ai/",
      "https://jmlogmarket.io/ai-log-grader",
      "https://play.google.com/store/apps/details?id=com.xylorixinspectorreact",
      "https://www.youtube.com/watch?v=auf0ktr_83g",
      "https://apps.apple.com/ca/app/xylorix-inspector/id1380163985",
      "https://www.xylorix.com/products/apps/inspector/",
      "https://www.woodidentifier.com/",
      "https://play.google.com/store/apps/details?id=com.artmvstd.woodIdentifier",
      "https://www.timberpolis.com/wood-volume-with-ai",
      "https://medium.com/@abbirami.vnr/how-to-build-an-ai-powered-wood-defect-analyzer-with-n8n-eae96b749d08"
    ]
  },
  {
    "candidate_id": "C2",
    "question": "Steel product CE mark scanner app Spain",
    "status": "ok",
    "answer": "While there isn't a specific \"Steel product CE mark scanner app\" exclusively for Spain that directly scans a CE mark on a steel product to verify its authenticity in a database, there are applications that assist with CE compliance for construction materials, including steel, and general CE marking verification.\n\nOne relevant application is **CertiScan: GPSR/CE Compliance**. This app allows users to take a photo of a product label or package to perform a CE compliance check. It assesses various aspects, including responsible person details, manufacturer identification, importer information, CE mark size and placement, safety warnings, and product identifiers. CertiScan is designed as a pre-audit tool to identify potential issues early and is available in multiple languages, including Spanish.\n\nAnother application, \"Control de materiales\" (Materials Control), developed by COAAT-Málaga in Spain, serves as a database for construction materials. It helps users identify materials that require CE marking and provides information on harmonized standards, application dates, and evaluation systems according to the Construction Products Regulation 305/2011. This app is a search tool for information rather than a scanner for physical CE marks.\n\nOther tools and software exist for managing the CE marking process for manufacturers, such as **Safexpert**, which guides through risk assessment and documentation for CE marking. Additionally, **Steel Manager Mobile** is a production control and monitoring system for metal constructions that uses barcode scanning for internal production tracking, not for CE mark verification. **ArcelorMittal EU Steel Advisor** is a product selection guide for steel, not a CE mark scanner.\n\nThe CE marking itself indicates that a product complies with EU health, safety, and environmental protection requirements, and for steel products, this often involves the Construction Products Regulation (CPR) and adherence to harmonized standards like EN 1090-1 for structural components. Importers and distributors are responsible for ensuring that products bear the correct CE mark and are supported by the necessary documentation, such as the Declaration of Performance (DoP) and test reports.",
    "pages": [
      "https://play.google.com/store/apps/details?id=com.finestfor.certiscan",
      "https://play.google.com/store/apps/details?id=com.finestfor.certiscan&hl=en",
      "https://play.google.com/store/apps/details?id=es.coaat.conmat&hl=en_GB",
      "https://www.ibf-solutions.com/en/ce-marking-software-safexpert",
      "https://steel-manager.be/en/mobile-app.php",
      "https://play.google.com/store/apps/details?id=com.arcelormittal.steeladvisor&hl=en_GB",
      "https://www.appluslaboratories.com/global/en/what-we-do/service-sheet/ce-marking-of-steel-structures-and-aluminum-structures",
      "https://globallsteel.com/2025/08/09/steel-certification-procedures-ce/",
      "https://ecochain.com/blog/ce-marking-for-construction-products/",
      "https://www.compliancegate.com/how-to-check-ce-marking/"
    ]
  },
  {
    "candidate_id": "C3",
    "question": "Smartphone corrugated sheet damage detection app",
    "status": "ok",
    "answer": "Several smartphone applications are available that assist in detecting damage to roofs, including features that would be applicable to corrugated sheets, often leveraging artificial intelligence (AI) for analysis. These apps generally allow users to capture images with their smartphone cameras, or integrate with drone imagery, to identify and report various types of damage.\n\nSpecific examples of such applications and platforms include:\n\n*   **Roof Hawk AI** provides a mobile app for both Android and Apple devices. It uses an AI engine to detect multiple types of roof damage, such as hail, wind, and missing shingles, from uploaded photos and then generates custom reports.\n*   **Loveland Innovations** offers the **IMGING** platform, which includes a mobile app that incorporates AI damage detection capabilities. This allows users to perform inspections using just their mobile device or in conjunction with drones, and to create inspection reports and instant roof estimates.\n*   **Damage Spotter**, available on Google Play, is designed to simplify technical inspections of buildings and structures. It automatically identifies and classifies constructive damages like cracks, fissures, moisture, and detachments by analyzing uploaded photos.\n*   **SpaceCapture** provides roofing inspection software that utilizes mobile devices or drones to capture images of roof conditions. Its AI then scans these images for damage patterns, missing materials, and structural issues.\n*   **RoofEye** offers a free AI-powered roof inspection service. Users can upload photos from their phone to receive a comprehensive report detailing issues such as missing shingles, water damage, hail impact, and structural problems.\n*   **AI Roof Inspector: Pro Report** for Apple devices uses AI to analyze satellite and drone photos, identifying issues and generating repair reports that cover material identification, structural integrity, and potential damage.\n*   **Fulcrum's Roof Inspection app** enables users to evaluate roof conditions, including damage, and attach photos to records. The app is customizable and can generate PDF reports.\n*   **iRoofing** offers a phone app for Android and iPhone that includes an Inspection Report Tool. This tool allows roofing contractors to capture images of roof damage with their phone's camera and integrate them into a comprehensive report.\n*   **Snappii's Roof Inspection mobile app** facilitates various roof inspections, allowing users to take pictures of damag",
    "pages": [
      "https://roofhawk.ai/",
      "https://useproline.com/five-drone-hail-damage-software/",
      "https://www.lovelandinnovations.com/roofing/",
      "https://www.lovelandinnovations.com/news/handheld-inspections/",
      "https://play.google.com/store/apps/details?id=com.mycompany.codalyb",
      "https://play.google.com/store/apps/details?id=com.mycompany.codalyb&hl=en_US",
      "https://spacecapture.ai/roofing-inspection-software",
      "https://roofeye.cloud/",
      "https://apps.apple.com/us/app/ai-roof-inspector-pro-report/id6756862603",
      "https://www.fulcrumapp.com/apps/roof-inspection-app/",
      "https://iroofing.org/phone-app-has-arrived/",
      "https://www.snappii.com/app/roof-inspection/"
    ]
  }
]
- [06-suche/amelie-lab-protokoll.md] Originalfeld topic_check, Teil 1 (laut gespeicherter Datei):
[
  {
    "term": "corrugat",
    "hits": []
  },
  {
    "term": "sheets",
    "hits": [
      "[protokoll, score 0.6] **Phänologischer Knospen-Countdown** — Beobachter werden vor dem erwarteten Eintritt einer Phase benachrichtigt, damit keine Datenlücke entsteht (Gemini) — verengt",
      "[protokoll, score 0.6] Doppelte Ausgabe „Norm-Ergebnis vs. realer Verbrauch\" (Prebound sichtbar machen) — None",
      "[dose, score 1] ChemGefahr-Stopp / MischStop (ChemHazard Stop)",
      "[kandidat, score 0.6] Sheet Metal Bend Allowance & K-Factor Flat Pattern Unfolder",
      "[kandidat, score 0.6] Custom Cursive & Print Handwriting Worksheet Generator"
    ]
  },
  {
    "term": "square",
    "hits": [
      "[protokoll, score 1] Wet Ink — frei",
      "[dose, score 1] Wet Ink",
      "[log, score 1] amelie-suchplaybook.md"
    ]
  }
]
- [06-suche/amelie-lab-protokoll.md] Originalfeld contract_version, Teil 1 (laut gespeicherter Datei):
"1.0.0"
