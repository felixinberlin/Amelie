# Proposals from plan lab-2026-10-10-amelie-lab-inversion-inversion-20261001T175927-2b8a90-3c5ba5d26bb1744f

Packet: amelie-lab-inversion-inversion-20261001T175927-2b8a90-3c5ba5d26bb1744f · Candidate: amelie-lab-inversion-inversion-20261001T175927-2b8a90-3c5ba5d26bb1744f
Not applied. A human decides.

- [06-suche/amelie-lab-protokoll.md] inversion: amelie-lab-inversion-inversion-20261001T175927-2b8a90-3c5ba5d26bb1744f. Absicht: Quark. Modell: deepseek/deepseek-chat. Existenzprüfung: nein. Alle Ideen ungeprüft. Die folgenden Angaben sind gespeicherte Modellausgaben, keine bestätigten Tatsachen. Nur grounded=true ist Evidenz; Score-Änderungen benötigen zusätzlich quote_status=verified. Quellen, fact_checks und fehlende Felder bleiben wie im Original; keine neuen Prüfungen durchgeführt.
- [06-suche/amelie-lab-protokoll.md] Frontend-Handoff: 2 ungeprüfte Ideen aus inversion. Im Lab-Ideen-Eingang anzeigen; nicht als geprüfte Dosen, ohne erfundene Vektoren oder Existenzurteile.
- [06-suche/amelie-lab-protokoll.md] Originalfeld run_id, Teil 1 (laut gespeicherter Datei):
"inversion-20261001T175927-2b8a90"
- [06-suche/amelie-lab-protokoll.md] Originalfeld intent, Teil 1 (laut gespeicherter Datei):
"Quark"
- [06-suche/amelie-lab-protokoll.md] Originalfeld model, Teil 1 (laut gespeicherter Datei):
"deepseek/deepseek-chat"
- [06-suche/amelie-lab-protokoll.md] Originalfeld created_at, Teil 1 (laut gespeicherter Datei):
"2026-10-01T18:08:58Z"
- [06-suche/amelie-lab-protokoll.md] Originalfeld state_missing, Teil 1 (laut gespeicherter Datei):
[]
- [06-suche/amelie-lab-protokoll.md] Originalfeld plan, Teil 1 (laut gespeicherter Datei):
{
  "area": "Quark production and regulation",
  "mode_list": [
    "AI-based quality control for quark production",
    "Automated labeling compliance with EU food standards",
    "Real-time monitoring of quark fermentation processes",
    "Predictive analytics for quark shelf life",
    "Blockchain traceability system for quark supply chain",
    "Smart packaging solutions for quark products",
    "AI-driven recipe optimization for quark",
    "Consumer-facing app for quark nutritional information",
    "IoT sensors for temperature control in quark storage",
    "Machine learning for detecting quark spoilage",
    "AI-assisted customer feedback analysis for quark brands",
    "Automated reporting for quark production inspections"
  ],
  "target_queries": [
    "What are the current EU regulations for quark production?",
    "Are there any municipal statutes governing quark labeling?",
    "What fee schedules apply to quark production inspections?"
  ],
  "class_hint": "A"
}
- [06-suche/amelie-lab-protokoll.md] Originalfeld target, Teil 1 (laut gespeicherter Datei):
{
  "target": {
    "name": "EU dairy product safety regulations",
    "source_url": "https://foodcomplianceinternational.com/industry-insight/scholarly-articles/3102-overview-of-the-milk-and-dairy-products-legislation-in-the-european-union",
    "source_label": "Klasse A: EU-Verordnung",
    "anchor_class": "A",
    "who_pays": "Large dairy producers and importers benefit from standardized regulations that streamline production and trade.",
    "who_carries_burden": "Small-scale producers and farmers bear the cost of compliance with complex hygiene and safety standards.",
    "where_data_stops": "Data is locked in government portals and inspection reports, inaccessible to small producers.",
    "blind_spot": "The diverse artisanal practices and local variants of quark production are ignored due to lack of standardized metrics."
  },
  "operator": "OP-2",
  "thesis": "Turn the EU's comprehensive dairy safety regulations into a citizen-facing tool that enables small producers to self-verify compliance.",
  "candidates": [
    {
      "id": "C1",
      "idea": "QuarkSelfCheck app: Enables small producers to verify compliance with EU dairy safety standards using commodity sensors and AI.",
      "why_now": "On-device AI models capable of analyzing milk composition and hygiene parameters in real-time.",
      "recipient": "Bundesanstalt für Landwirtschaft und Ernährung (BLE)",
      "recipient_kind": "agency",
      "check_queries": [
        "Does BLE provide any tools for small dairy producers to self-check compliance?"
      ]
    },
    {
      "id": "C2",
      "idea": "LocalQuarkTrace: A traceability system for artisanal quark producers to document their process and share it with consumers.",
      "why_now": "WebAssembly-based blockchain systems for decentralized, low-cost traceability.",
      "recipient": "Deutscher Bauernverband (DBV)",
      "recipient_kind": "association",
      "check_queries": [
        "Is there a traceability system for artisanal quark producers in Germany?"
      ]
    },
    {
      "id": "C3",
      "idea": "QuarkHygieneGuide: A step-by-step visual guide for small producers to implement HACCP principles.",
      "why_now": "Multimodal AI models capable of generating visual and interactive compliance guides.",
      "recipient": "Landwirtschaftskammer Niedersachsen",
      "recipient_kind": "institution",
      "check_queries": [
        "Are there any visual guides for HACCP implementation in quark production?"
      ]
    },
    {
      "id": "C4",
      "idea": "QuarkLabelBot: Simplifies EU-compliant labeling for artisanal quark producers.",
      "why_now": "Zero-shot text generation models for automated labeling.",
      "recipient": "Verbraucherzentrale Bundesverband (vzbv)",
      "recipient_kind": "association",
      "check_queries": [
        "Is there an app for simplifying EU-compliant labeling for quark producers?"
      ]
    },
    {
      "id": "C5",
      "idea": "MyQuarkProcess: Allows producers to document their unique quark-making process and receive tailored compliance advice.",
      "why_now": "Federated learning models that adapt to local production methods.",
      "recipient": "Bundesministerium für Ernährung und Landwirtschaft (BMEL)",
      "recipient_kind": "institution",
      "check_queries": [
        "Does BMEL provide tailored compliance advice for artisanal quark producers?"
      ]
    },
    {
      "id": "C6",
      "idea": "QuarkInspector: A citizen-science tool allowing consumers to verify quark safety parameters.",
      "why_now": "Smartphone sensors and AI models capable of analyzing pasteurization levels.",
      "recipient": "Stiftung Warentest",
      "recipient_kind": "association",
      "check_queries": [
        "Is there a consumer-facing tool for verifying quark safety?"
      ]
    },
    {
      "id": "C7",
      "idea": "QuarkMicrobeScan: Detects microbial contamination in quark using smartphone cameras.",
      "why_now": "AI models trained on microscopic images for contamination detection.",
      "recipient": "Institut für Mikrobiologie und Biotechnologie e.V.",
      "recipient_kind": "association",
      "check_queries": [
        "Is there a smartphone-based microbial contamination detector for quark?"
      ]
    },
    {
      "id": "C8",
      "idea": "QuarkAllergyCheck: Verifies allergen-free production processes in quark-making.",
      "why_now": "AI models for allergen tracking in small-scale production environments.",
      "recipient": "Deutsche Zöliakie Gesellschaft (DZG)",
      "recipient_kind": "association",
      "check_queries": [
        "Is there a tool for verifying allergen-free quark production?"
      ]
    }
  ],
  "shortlist": [
    "C1",
    "C3",
    "C6"
  ]
}
- [06-suche/amelie-lab-protokoll.md] Originalfeld result, Teil 1 (laut gespeicherter Datei):
{
  "survivors": [
    {
      "candidate_id": "C1",
      "rank": 1,
      "idea": "QuarkSelfCheck app: Enables small producers to verify compliance with EU dairy safety standards using commodity sensors and AI.",
      "gap": "Small producers lack accessible tools to independently verify compliance with EU dairy safety standards.",
      "gap_stands_alone": true,
      "who_has_problem": "Small-scale quark producers",
      "why_now": "On-device AI models capable of analyzing milk composition and hygiene parameters in real-time.",
      "buildable": "Commodity sensors and AI models can be integrated into a mobile app for real-time compliance checks.",
      "recipient": "Bundesanstalt für Landwirtschaft und Ernährung (BLE)",
      "recipient_kind": "agency",
      "evidence_urls": [
        "https://www.ble.de/DE/BZL/Daten-Berichte/Milch-Milcherzeugnisse/milch-milcherzeugnisse_node.html",
        "https://www.ble.de/DE/BZL/Daten-Berichte/Milch-Milcherzeugnisse/Versorgungsbilanzen.html",
        "https://service.ble.de/ptdb/index2.php?detail_id=36910&ssk=PTDB-alles&site_key=141&stichw=2&zeilenzahl_zaehler=9797&NextRow=8640",
        "https://service.ble.de/ptdb/index2.php?detail_id=77963&ssk=PTDB-alles&site_key=141&tKat=6002&zeilenzahl_zaehler=558&NextRow=350",
        "https://www.ble.de/DE/Themen/Marktorganisation/Intervention/Milchprodukte/milchprodukte_node.html"
      ]
    },
    {
      "candidate_id": "C3",
      "rank": 2,
      "idea": "QuarkHygieneGuide: A step-by-step visual guide for small producers to implement HACCP principles.",
      "gap": "Small producers need clear visual guidance to implement HACCP principles effectively.",
      "gap_stands_alone": true,
      "who_has_problem": "Small-scale quark producers",
      "why_now": "Multimodal AI models capable of generating visual and interactive compliance guides.",
      "buildable": "Existing AI models can create interactive visual guides tailored to HACCP requirements.",
      "recipient": "Landwirtschaftskammer Niedersachsen",
      "recipient_kind": "institution",
      "evidence_urls": [
        "https://www.researchgate.net/figure/ndustrial-manufacturing-flow-chart-of-Quick-Quark_fig2_330628246",
        "https://www.alleratech.com/blog/haccp-plan",
        "https://www.registrarcorp.com/blog/food-beverage/food-safety/build-a-haccp-plan-that-works/",
        "https://www.sftrainings.org/implementing-haccp-a-step-by-step-guide-for-food-safety-supervisors/",
        "https://www.checkit.net/memos/resources-haccp-plan-development-and-implementation"
      ]
    }
  ],
  "kills": [
    {
      "candidate_id": "C6",
      "reason": "Consumer-facing tools for verifying quark safety already exist in various forms.",
      "failed_checks": [
        "in_mode_or_dense"
      ]
    }
  ],
  "log_row": {
    "target": "EU dairy product safety regulations",
    "anchor_class": "A",
    "operator": "OP-2",
    "candidates": 8,
    "survivors": 2,
    "best_gap": "Small producers lack accessible tools to independently verify compliance with EU dairy safety standards."
  },
  "retro": {
    "learned": "Small producers face significant gaps in accessing tools for compliance verification.",
    "mistake": "Assumed consumer-facing tools for quark safety were non-existent without thorough prior-art checking.",
    "next_time": "Verify the existence of consumer-facing tools more rigorously before proceeding."
  }
}
- [06-suche/amelie-lab-protokoll.md] Originalfeld tool_calls, Teil 1 (laut gespeicherter Datei):
[
  {
    "call_id": "inversion-20261001T175927-2b8a90-t01",
    "tool": "bib_find",
    "status": "ok",
    "summary": "producti"
  },
  {
    "call_id": "inversion-20261001T175927-2b8a90-t02",
    "tool": "bib_find",
    "status": "ok",
    "summary": "regulati"
  },
  {
    "call_id": "inversion-20261001T175927-2b8a90-t03",
    "tool": "quota_status",
    "status": "ok"
  },
  {
    "call_id": "inversion-20261001T175927-2b8a90-t04",
    "tool": "search",
    "status": "ok",
    "summary": "What are the current EU regulations for quark production?"
  },
  {
    "call_id": "inversion-20261001T175927-2b8a90-t05",
    "tool": "bib_find",
    "status": "ok",
    "summary": "commodit, complian"
  },
  {
    "call_id": "inversion-20261001T175927-2b8a90-t06",
    "tool": "bib_find",
    "status": "ok",
    "summary": "commodit"
  },
  {
    "call_id": "inversion-20261001T175927-2b8a90-t07",
    "tool": "bib_find",
    "status": "ok",
    "summary": "implemen, principl"
  },
  {
    "call_id": "inversion-20261001T175927-2b8a90-t08",
    "tool": "bib_find",
    "status": "ok",
    "summary": "implemen"
  },
  {
    "call_id": "inversion-20261001T175927-2b8a90-t09",
    "tool": "bib_find",
    "status": "ok",
    "summary": "allowing, consumer"
  },
  {
    "call_id": "inversion-20261001T175927-2b8a90-t10",
    "tool": "bib_find",
    "status": "ok",
    "summary": "allowing"
  },
  {
    "call_id": "inversion-20261001T175927-2b8a90-t11",
    "tool": "search",
    "status": "ok",
    "summary": "Does BLE provide any tools for small dairy producers to self-check compliance?"
  },
  {
    "call_id": "inversion-20261001T175927-2b8a90-t12",
    "tool": "search",
    "status": "ok",
    "summary": "Are there any visual guides for HACCP implementation in quark production?"
  },
  {
    "call_id": "inversion-20261001T175927-2b8a90-t13",
    "tool": "search",
    "status": "ok",
    "summary": "Is there a consumer-facing tool for verifying quark safety?"
  }
]
- [06-suche/amelie-lab-protokoll.md] Originalfeld accounting, Teil 1 (laut gespeicherter Datei):
{
  "model_calls": 8,
  "search_calls": 4,
  "search_queries": 15,
  "cost_usd": 0.066696
}
- [06-suche/amelie-lab-protokoll.md] Originalfeld log_entry, Teil 1 (laut gespeicherter Datei):
"<!-- proposed by the Lab's Inversion agent, run inversion-20261001T175927-2b8a90; nothing was written to Amélie -->\n| 2026-10-01 | Lab | EU dairy product safety regulations (Klasse A) | OP-2 | 8 | 2 (ungeprüft): 1. QuarkSelfCheck app: Enables small producers to verify compliance with EU dairy safety standards using commodity sensors and AI. (→ Bundesanstalt für Landwirtschaft und Ernährung (BLE)); 2. QuarkHygieneGuide: A step-by-step visual guide for small producers to implement HACCP principles. (→ Landwirtschaftskammer Niedersachsen) | Small producers lack accessible tools to independently verify compliance with EU dairy safety standards. |\n\n### Inversion run inversion-20261001T175927-2b8a90 — 2026-10-01 (intent: Quark)\n- **Learned:** Small producers face significant gaps in accessing tools for compliance verification.\n- **Mistake:** Assumed consumer-facing tools for quark safety were non-existent without thorough prior-art checking.\n- **Next time:** Verify the existence of consumer-facing tools more rigorously before proceeding.\n- **Prior-art leads (automatic search, for the existence check; not a verdict):**\n  - C1 (ok): Does BLE provide any tools for small dairy producers to self-check compliance? -> https://www.ble.de/DE/BZL/Daten-Berichte/Milch-Milcherzeugnisse/milch-milcherzeugnisse_node.html, https://www.ble.de/DE/BZL/Daten-Berichte/Milch-Milcherzeugnisse/Versorgungsbilanzen.html, https://service.ble.de/ptdb/index2.php?detail_id=36910&ssk=PTDB-alles&site_key=141&stichw=2&zeilenzahl_zaehler=9797&NextRow=8640, https://service.ble.de/ptdb/index2.php?detail_id=77963&ssk=PTDB-alles&site_key=141&tKat=6002&zeilenzahl_zaehler=558&NextRow=350\n  - C3 (ok): Are there any visual guides for HACCP implementation in quark production? -> https://www.researchgate.net/figure/ndustrial-manufacturing-flow-chart-of-Quick-Quark_fig2_330628246, https://www.alleratech.com/blog/haccp-plan, https://www.registrarcorp.com/blog/food-beverage/food-safety/build-a-haccp-plan-that-works/, https://www.sftrainings.org/implementing-haccp-a-step-by-step-guide-for-food-safety-supervisors/\n  - C6 (ok): Is there a consumer-facing tool for verifying quark safety? -> https://www.oasishealth.app/search/item/483453?name=free-from-quark, https://www.oasishealth.app/search/item/550831?name=mungalli-organic-quark, https://cdc-ccl.ca/en/node/795, https://blog.foodsafety.ca/how-to-handle-dairy-products-safely\n"
- [06-suche/amelie-lab-protokoll.md] Originalfeld prior_art, Teil 1 (laut gespeicherter Datei):
[
  {
    "candidate_id": "C1",
    "question": "Does BLE provide any tools for small dairy producers to self-check compliance?",
    "status": "ok",
    "answer": "The Bundesanstalt für Landwirtschaft und Ernährung (BLE) does not appear to provide specific tools for small dairy producers to self-check compliance, based on the available search results.\n\nThe BLE's website primarily focuses on collecting and publishing data related to milk production and processing, market information, and project funding within the agricultural sector in Germany. For instance, it provides information on milk and dairy products, market actors, and supply balances. The BLE also offers web seminars to assist market participants with new due diligence obligations under the EU Deforestation Regulation (EUDR), but this is a broader offering and not specifically self-check tools for small dairy producers.\n\nWhile other sources discuss the importance of self-control in milk production and the availability of digital tools for food safety and quality management in the dairy industry generally, these are not attributed to the BLE. Some of these discussions highlight that larger companies are more likely to use advanced digital systems, while smaller firms often rely on paper-based systems or spreadsheets.",
    "pages": [
      "https://www.ble.de/DE/BZL/Daten-Berichte/Milch-Milcherzeugnisse/milch-milcherzeugnisse_node.html",
      "https://www.ble.de/DE/BZL/Daten-Berichte/Milch-Milcherzeugnisse/Versorgungsbilanzen.html",
      "https://service.ble.de/ptdb/index2.php?detail_id=36910&ssk=PTDB-alles&site_key=141&stichw=2&zeilenzahl_zaehler=9797&NextRow=8640",
      "https://service.ble.de/ptdb/index2.php?detail_id=77963&ssk=PTDB-alles&site_key=141&tKat=6002&zeilenzahl_zaehler=558&NextRow=350",
      "https://www.ble.de/DE/Themen/Marktorganisation/Intervention/Milchprodukte/milchprodukte_node.html",
      "https://www.ble.de/DE/Themen/Landwirtschaft/Warenmeldungen/Meldewesen/Meldewesen_node.html",
      "https://service.ble.de/ptdb/index2.php?detail_id=16738&ssk=PTDB-alles&site_key=141&stichw=2&zeilenzahl_zaehler=9757&NextRow=4130",
      "https://www.ble.de/DE/Themen/Marktorganisation/Ein-Ausfuhrlizenzen/Milch-und-Milcherzeugnisse/milch-und-milcherzeugnisse_node.html",
      "https://www.ble.de/DE/Themen/Wald-Holz/Entwaldungsfreie-Produkte/Web-Seminare/Kurzvorstellungen.html",
      "https://www.blv.admin.ch/de/milchpruefung",
      "https://www.fr.ch/de/energie-landwirtschaft-und-umwelt/landwirtschaft-und-nutztiere/selbstkontrolle-bei-der-milchproduktion",
      "https://tracextech.com/batch-level-traceability-dairy-supply-chains/",
      "https://www.mt.com/us/en/home/products/Product-Inspection_1/Industries/dairy.html",
      "https://www.inspectle.com/industries/dairy-software",
      "https://www.food-safety.com/articles/11274-researchers-identify-needs-for-adoption-of-digital-food-safety-tools-in-us-dairy-industry",
      "https://pmc.ncbi.nlm.nih.gov/articles/PMC13316474/"
    ]
  },
  {
    "candidate_id": "C3",
    "question": "Are there any visual guides for HACCP implementation in quark production?",
    "status": "ok",
    "answer": "Yes, there are visual guides for HACCP implementation that include quark production. One such example is an \"Industrial manufacturing flow chart of Quick-Quark\" which outlines the production process. This flow chart details the three main steps in processing Quick-Quark: preparation of the dairy ingredient mixture for fermentation, the fermentation process itself, and finally, centrifugation/harvesting, cooling, addition of other ingredients, and packaging.\n\nMore broadly, the development of a process flow diagram is a fundamental step in implementing a HACCP plan for any food product, including quark. These diagrams serve as visual representations of all stages in a food operation, from raw material receipt to the final product. They are crucial for identifying potential food safety hazards and critical control points (CCPs).\n\nAccording to various sources, a comprehensive process flow diagram for HACCP implementation should include:\n*   All process steps, from raw material receipt to finished product shipping.\n*   Decision points where different pathways might occur in processing.\n*   Storage points where products are held during production.\n*   Rework loops, indicating how returned or reworked products re-enter the process.\n*   Inputs such as ingredients, contact materials, water, and air.\n*   Temperatures and time durations at various stages.\n*   Where the product moves between high or low-risk areas to a high-care area.\n\nThe HACCP team is responsible for constructing, maintaining, and verifying these flow charts to ensure they accurately reflect the actual production process. The Food and Agriculture Organization (FAO) provides guidance on how to develop and confirm flow diagrams for food production processes to support hazard analysis.",
    "pages": [
      "https://www.researchgate.net/figure/ndustrial-manufacturing-flow-chart-of-Quick-Quark_fig2_330628246",
      "https://www.alleratech.com/blog/haccp-plan",
      "https://www.registrarcorp.com/blog/food-beverage/food-safety/build-a-haccp-plan-that-works/",
      "https://www.sftrainings.org/implementing-haccp-a-step-by-step-guide-for-food-safety-supervisors/",
      "https://www.checkit.net/memos/resources-haccp-plan-development-and-implementation",
      "https://www.fao.org/good-hygiene-practices-haccp-toolbox/haccp/steps-4-5-construct-flow-diagram-and-onsite-confirmation/en",
      "https://tcisys.com/haccp-flow-chart/",
      "https://www.percipio-training.co.uk/flow-process-diagrams-explained/"
    ]
  },
  {
    "candidate_id": "C6",
    "question": "Is there a consumer-facing tool for verifying quark safety?",
    "status": "ok",
    "answer": "While there isn't a single, real-time consumer-facing tool for verifying the safety of a specific quark product at the point of purchase, several resources provide information relevant to consumer safety regarding quark.\n\nOne example of a consumer-facing resource is the Oasis website, which offers \"health ratings\" and analysis for specific quark products, such as \"Free From Quark\" and \"Mungalli Organic Quark\". These analyses include details on ingredients, potential contaminants, and lab test results, providing consumers with information to evaluate the product's safety and quality.\n\nBeyond such specific product analysis tools, the safety of quark, like other dairy products, is primarily ensured through manufacturing processes and regulatory oversight. Pasteurization is a crucial step in the creation of fresh cheeses like quark to ensure their safety. Microbiological standards, such as limits for *Escherichia coli* and *Staphylococcus aureus*, are applied to cheeses made from pasteurized milk.\n\nConsumers are also advised to follow general food safety practices for dairy products, including proper storage and handling, to prevent bacterial growth. Regulatory bodies, such as the Federal Food Safety and Veterinary Office (FSVO), issue warnings and recalls for specific quark products if disease-causing bacteria are detected, as seen in a case involving \"Demeter Quark Vollmilch\".\n\nOther tools mentioned in search results, such as \"Inspectle Food\" and various digital tools for the dairy industry, are designed for manufacturers and professionals to manage food safety and quality within the production process, rather than for direct consumer use. Similarly, \"Quarks Safety\" and \"QARK\" are software tools for managing chemical risks in industrial settings or for analyzing Android application security, respectively, and are not related to the safety of the dairy product quark.",
    "pages": [
      "https://www.oasishealth.app/search/item/483453?name=free-from-quark",
      "https://www.oasishealth.app/search/item/550831?name=mungalli-organic-quark",
      "https://cdc-ccl.ca/en/node/795",
      "https://blog.foodsafety.ca/how-to-handle-dairy-products-safely",
      "https://www.bluewin.ch/en/news/international/federal-office-warns-of-bacteria-in-demeter-quark-whole-milk-li.3181250",
      "https://www.inspectle.com/industries/dairy-software",
      "https://pmc.ncbi.nlm.nih.gov/articles/PMC13316474/",
      "https://www.quarks-safety.com/en/",
      "https://www.appvizer.com/operations/hse/quarks-safety",
      "https://www.quarks-safety.com/en/chemical-hazards/chemical-inventory-and-sds-management/",
      "https://cryptax.medium.com/quark-on-an-android-malware-how-good-was-it-my-opinion-510ae647efb0",
      "https://github.com/linkedin/qark"
    ]
  }
]
- [06-suche/amelie-lab-protokoll.md] Originalfeld topic_check, Teil 1 (laut gespeicherter Datei):
[
  {
    "term": "producti",
    "hits": []
  },
  {
    "term": "regulati",
    "hits": []
  }
]
- [06-suche/amelie-lab-protokoll.md] Originalfeld contract_version, Teil 1 (laut gespeicherter Datei):
"1.0.0"
