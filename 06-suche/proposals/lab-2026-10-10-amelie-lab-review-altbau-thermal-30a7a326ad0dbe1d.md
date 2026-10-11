# Proposals from plan lab-2026-10-10-amelie-lab-review-altbau-thermal-30a7a326ad0dbe1d

Packet: amelie-lab-review-altbau-thermal-30a7a326ad0dbe1d · Candidate: amelie-lab-review-altbau-thermal-30a7a326ad0dbe1d
Not applied. A human decides.

- [06-suche/amelie-lab-protokoll.md] review: amelie-lab-review-altbau-thermal-30a7a326ad0dbe1d. Absicht: What existing open-source or commercial tools provide user-friendly, validated 2D thermal simulations for individual apartment layouts, including surface temperature, moisture limits, and comparative analysis (A/B testing), adhering to standards like DIN EN ISO 10211 or VDI 6007, and how do they handle input from non-expert users?. Modell: not recorded. Existenzprüfung: nein. Alle Ideen ungeprüft. Die folgenden Angaben sind gespeicherte Modellausgaben, keine bestätigten Tatsachen. Nur grounded=true ist Evidenz; Score-Änderungen benötigen zusätzlich quote_status=verified. Quellen, fact_checks und fehlende Felder bleiben wie im Original; keine neuen Prüfungen durchgeführt.
- [06-suche/amelie-lab-protokoll.md] Originalfeld packet_id, Teil 1 (laut gespeicherter Datei):
"altbau-thermal"
- [06-suche/amelie-lab-protokoll.md] Originalfeld question, Teil 1 (laut gespeicherter Datei):
"What existing open-source or commercial tools provide user-friendly, validated 2D thermal simulations for individual apartment layouts, including surface temperature, moisture limits, and comparative analysis (A/B testing), adhering to standards like DIN EN ISO 10211 or VDI 6007, and how do they handle input from non-expert users?"
- [06-suche/amelie-lab-protokoll.md] Originalfeld findings, Teil 1 (laut gespeicherter Datei):
[
  {
    "claim": "Several commercial software tools, such as WINISO®, TerMus BRIDGE, CYPETHERM BRIDGES, HTflux, and Mold Simulator (Dartwin), offer 2D thermal simulations primarily for thermal bridges and building components, adhering to standards like EN ISO 10211 and EN ISO 13788.",
    "source": "https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQFNWDTSgYjzu-ne3sl2Mczvc-DIA8P3vOLyx6ToHagizLFPwTQgKGQohbrbkos2_7x7HVCJLaEtCYYQB50fvcpM5G5SbawDiWPTieWXIFKgxXtHSvDgr9gTEMRXSVJlRq_bzccKHNi6e0k3fOrlpazlsCDEcBVmGbSF8iz_yZ-R93A21lE3d60QKw==",
    "source_type": "commercial_product",
    "retrieved_at": "2026-09-29T14:44:16Z",
    "quote": "WINISO® is professional thermal bridge calculation software for windows, façades, glazing systems and construction details. It enables accurate calculation of Uf values, Psi values, Ug values, U-values, isotherms, surface temperatures and temperature factors, while supporting major standards such as EN ISO 10077-2, EN ISO 10211, EN 673, EN ISO 6946 and DIN 4108-2/-3.\nTerMus BRIDGE is the Thermal Bridge software that uses finite element analysis, fully compliant with the EN ISO 10211:2017, EN ISO 14683:2008 and EN ISO 13788:2013 technical standards.\nCYPETHERM BRIDGES is a user-friendly program for calculating thermal transmittance in linear thermal bridges. To calculate the linear thermal transmittance, CYPETHERM BRIDGES uses a numerical finite element analysis based on the two-dimensional heat transfer calculation reflected in EN ISO 10211.\nHTflux is an innovative software to for two-dimensional simulation of heat and water vapor transport. ... HTflux is validated in accordance with the relevant standards EN ISO 10077-2:2007 and EN ISO 10211-2:2012.\nMold Simulator combines the accuracy of an advanced 2D modelling software with many valuable functions that greatly simplify the thermal analysis process through few simple steps. ... Analysis is performed according to ISO 13788:2013 norm."
  },
  {
    "claim": "These commercial tools typically provide calculations for Psi-values, U-values, isotherms, surface temperatures, and assess mold risk by evaluating the fRsi temperature factor or surface moisture limits according to EN ISO 13788.",
    "source": "https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQGGkC6EeMZdZerBDOFP8RJti0uYYoqj8vr80K1-OP0xn7HXqYMEvz6yXdu9hp8X26KjzWWxalTLkPLUFki0cw3jNXOMhjwOno9gPMNtGd9GYULvPrkhpXa0fGncpYxKd1VGJaaOAG26KqaCMhtpbnrpmg==",
    "source_type": "commercial_product",
    "retrieved_at": "2026-09-29T14:44:16Z",
    "quote": "TerMus BRIDGE allows you to: calculate the (Ψ Psi-value) linear thermal transmittance of thermal bridges. ... evaluate the risk of mould formation according to the EN ISO 13788 technical standard. evaluate the fRsi temperature factor. the minimum temperature risk for mould growth.\nHTflux is a unique tool for two-dimensional thermal analysis and the evaluation of thermal bridges. A variety of measurement and reporting tools are available (Heat flow, U-value, Ψ-value fRsi value, temperature extreme values,…).\nMold Simulator automatically detects and calculates air cavities according to ISO6946 (building) or ISO10077-2 (frames). ... Our software automatically calculates the linear transmittance PSI even in the presence of adjacent unheated rooms, according to ISO10211."
  },
  {
    "claim": "Input for these tools often involves importing CAD files (DXF/DWG) or drawing geometries, which may require some level of expertise, though some offer features like automated geometry preparation or direct mapping to simplify the process.",
    "source": "https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQFNWDTSgYjzu-ne3sl2Mczvc-DIA8P3vOLyx6ToHagizLFPwTQgKGQohbrbkos2_7x7HVCJLaEtCYYQB50fvcpM5G5SbawDiWPTieWXIFKgxXtHSvDgr9gTEMRXSVJlRq_bzccKHNi6e0k3fOrlpazlsCDEcBVmGbSF8iz_yZ-R93A21lE3d60QKw==",
    "source_type": "commercial_product",
    "retrieved_at": "2026-09-29T14:44:16Z",
    "quote": "Highly automated geometry preparation of CAD data (.dxf & .dwg); Detailed transfer of CAD data including radii and bevels.\nTerMus BRIDGE allows you to define structures with great precision reproducing true physical conditions to get highly professional results. Define endless combinations of thermal bridges using direct visual input.\nFast and comfortable CAD-import functionality in combination with the DIRECT-MAPPING approach accelerates the simulation process considerable.\nLoad your dxf file and start working immediately. Textures can be automatically replaced with materials."
  },
  {
    "claim": "Open-source tools like THERM (LBNL) and HEAT2 also provide 2D heat transfer analysis, including surface temperatures and condensation risk, and are validated against EN ISO 10211.",
    "source": "https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQGjVeOFN6LGPdUnQxICxL2whkGXM3IANHUmzKVZ_O-xn5GgUsFb-aSZkgN99AtxweMpa3dweQ_j3gHo4LI-LvhbgWcHTHEelUyj2VO_OwKr4xKYztpOB6hb6_zUmZzo36Z9kzuH7HtuUIgyRE6shRDaMvc==",
    "source_type": "academic_project",
    "retrieved_at": "2026-09-29T14:44:16Z",
    "quote": "Using THERM, you can model two-dimensional heat-transfer effects in building components... THERM's heat-transfer analysis allows you to evaluate a product's energy efficiency and local temperature patterns, which may relate directly to problems with condensation, moisture damage, and structural integrity.\nHEAT2 is a PC-program for two-dimensional transient and steady-state heat transfer. ... The program is validated against the standard EN ISO 10211 and EN ISO 10077-2. ... Estimation of surface temperatures (condensation risks)."
  },
  {
    "claim": "Energy2D is a free, interactive, NSF-funded software that models 2D heat transfer (conduction, convection, radiation) and is designed to be user-friendly for 'computational experiments' without complex mathematics, though its convection and radiation accuracy is not 100%.",
    "source": "https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQHT4JnFayIaPBV9ObV3mYE0JzaNb1o-NtW7id3yZCe5sTFKCcCv_UckgfA84vF2dj0SPq6NSyec-Ho7-G46Cy4A_7dRvohLdyckzKB_P1Y6Z5MLVSM5H9IV-2URS9W5",
    "source_type": "academic_project",
    "retrieved_at": "2026-09-29T14:44:16Z",
    "quote": "Energy2D - Interactive Heat Transfer Simulations for Everyone. NSF-Funded Free Software. ... Based on computational physics, Energy2D is an interactive multiphysics simulation program that models all three modes of heat transfer—conduction, convection, and radiation, and their coupling with particle dynamics. ... The conduction part of Energy2D is highly accurate, but the convection and radiation parts are not 100% accurate."
  },
  {
    "claim": "Simpler online mold risk calculators exist that estimate mold growth favorability based on indoor air temperature, relative humidity, and surface temperature, providing a practical screening tool for non-experts.",
    "source": "https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQEC4wI_UEING9qcJbPezqBcdpULhGP8k52AeYA33nekiiEU6k5PMzfbcgnOZEo8avUUnzU41gq37oVO74kk22yj9HmtzH-uwZq0FcH3s4nli0AXVcX1K14uASyT9PGNjQJQU0xA9WmTjBVU43nr",
    "source_type": "commercial_product",
    "retrieved_at": "2026-09-29T14:44:16Z",
    "quote": "The Mold Risk Calculator estimates whether indoor conditions are favorable for mold growth by evaluating moisture conditions at the coldest interior surface. ... This calculator is a practical HVAC and building-science screening tool.\nThe air-Q mold risk calculator calculates the mold risk for a room. It takes into account the temperature, humidity, insulation value and thermal resistance of the wall."
  },
  {
    "claim": "More comprehensive building energy modeling (BEM) tools like IES VE, SimScale, and EnergyPlus (used by GenSim and SimStock) can perform thermal analysis and scenario comparisons, but are often 3D, for whole buildings, and typically require more expert input.",
    "source": "https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQGRLQoI4lFZIhv28Wi8ZkYfDQkDmu1aMcfmbpJU42vcsJkuwDo6XeT3KJrtKrq_oyd7kPChPgI95Lzmzc2VH5CeuLC07cuj6KTz9bzn-XeD0Qj7yfpaMFy3SggUiE7gmWPK17bvPK5_uwZekcpQ4MwD6jRmKGQ4rmz5",
    "source_type": "commercial_product",
    "retrieved_at": "2026-09-29T14:44:16Z",
    "quote": "IES VE is a sophisticated building energy performance software that generates mature statistics about the HVAC loads. ... IES VE is recognized for its comprehensive energy modeling capabilities which allows architects and engineers to evaluate a variety of energy optimization solutions and simulate HVAC loads.\nSimScale is a cloud-based web application that plays a key part in simulation software for many kinds of industries.\nEnergyPlus™ is an advanced whole-building energy simulation engine for analyzing HVAC, lighting, and building envelope performance. Engineers, architects, and ESCOs use it to model both energy consumption — heating, cooling, ventilation, lighting, plug, and process loads — and water use."
  },
  {
    "claim": "The VDI 6007 guideline focuses on the calculation of transient thermal response of rooms and buildings, with validation cases available in open-source Modelica libraries, but these are typically for more advanced modeling and not direct 2D thermal conduction for apartment layouts.",
    "source": "https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQFeWJ2QWfuSfFcjayxSbvWhH5ayWAy78pqgTUd4JLHw3eu0sIjmYZ6rfi2KJaP2Np-kPvbOF3kloDS5YFO3frB1-0TDcWYJEP6x_WyRZYuz-IYEqd67ZsVBT3k3E5p6kf5gDQ6IH6Q_XEDzgktwesv4HwFMBROBA2FlFNDVuYM_4jJRjMnkWK0s3YrYS1KUWRukolBo1Mmw90sSInMea_Y_KxY_mkiLi3wA-1zWQCNqqF5zEzA==",
    "source_type": "academic_literature",
    "retrieved_at": "2026-09-29T14:44:16Z",
    "quote": "This package contains validation cases for Reduced Order Models according to Guideline VDI 6007 Part 1 (VDI, 2012). The guideline defines twelve test cases that consecutively test different aspects of building pyhsics behaviour.\nVDI 6007 Blatt 1 Calculation of transient thermal response of rooms and buildings - Modelling of rooms."
  },
  {
    "claim": "Some tools, like RAUCAD, offer assistant-guided building managers for drawing geometries and calculating heating loads according to DIN EN 12831, indicating efforts towards more user-friendly input for building-specific analysis.",
    "source": "https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQGal3L3SHU45tXQ_Pte97NOm1Wjp6czv7COTQCWdOOkPP89cHJbfVOCM_X9T_q_Sci-r_AteFtGGUv1tGIxOG0IlNenebrTFGlFVp_nR80ApRBfobep8DfpbvPkelGjQ==",
    "source_type": "commercial_product",
    "retrieved_at": "2026-09-29T14:44:16Z",
    "quote": "RAUWIN: Heating load calculation according to DIN TS for EN 12831-1 (2019). ... With the new assistant-guided building manager, you can enter the complete building directly in the CAD system in just a few steps. Functions include the drawing of walls, windows and doors as well as the direct generation of the 3D building model."
  },
  {
    "claim": "The concept of 'A/B testing' or comparative analysis for different scenarios is a common feature in broader building performance simulation tools, allowing evaluation of design decisions or retrofit measures.",
    "source": "https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQGRLQoI4lFZIhv28Wi8ZkYfDQkDmu1aMcfmbpJU42vcsJkuwDo6XeT3KJrtKrq_oyd7kPChPgI95Lzmzc2VH5CeuLC07cuj6KTz9bzn-XeD0Qj7yfpaMFy3SggUiE7gmWPK17bvPK5_uwZekcpQ4MwD6jRmKGQ4rmz5",
    "source_type": "academic_literature",
    "retrieved_at": "2026-09-29T14:44:16Z",
    "quote": "IES VE is recognized for its comprehensive energy modeling capabilities which allows architects and engineers to evaluate a variety of energy optimization solutions and simulate HVAC loads.\nSimStock allows the automatic creation of dynamic thermal simulation models of all buildings within an area of analysis; allowing a wide range of scenario analyses to be performed. These include: Analysis of the efficacy of various retrofit measures applied to the building stock."
  }
]
- [06-suche/amelie-lab-protokoll.md] Originalfeld contradictions, Teil 1 (laut gespeicherter Datei):
[]
- [06-suche/amelie-lab-protokoll.md] Originalfeld gaps, Teil 1 (laut gespeicherter Datei):
[
  "While many tools perform 2D thermal simulations for building components (thermal bridges), there is a lack of explicitly identified user-friendly tools designed for non-expert users to perform detailed 2D thermal simulations of *entire individual apartment layouts* (beyond specific details like corners or window reveals) with surface temperature and moisture limits.",
  "The premise that complex 2D thermal conduction simulations can be performed efficiently within a web browser environment for non-expert users is not fully supported by the current state of specialized thermal bridge analysis software, which are predominantly desktop applications. Cloud-based general FEA/CFD platforms exist, but are not tailored for this specific non-expert building physics use case.",
  "Automated, user-friendly floor plan input from photos or PDFs for non-expert users, directly translating into a 2D thermal simulation model for an apartment, is not a widely advertised or robust feature among the identified tools. While some tools import CAD (DXF/DWG), this still implies a need for initial CAD creation or conversion.",
  "Explicit features for 'A/B testing' or comparative analysis of different renovation scenarios specifically for individual apartment 2D thermal performance, presented in a user-friendly manner with consumption/cost ranges for non-experts, are not a prominent offering in the specialized 2D thermal simulation tools.",
  "Integration with specific regional building data sources like 'EnergyMap Berlin' for pre-populating building age, geometry, or renovation status is not a general feature of the identified tools, representing a potential localized integration gap."
]
- [06-suche/amelie-lab-protokoll.md] Originalfeld terminology, Teil 1 (laut gespeicherter Datei):
[
  "Thermal bridge calculation/analysis",
  "Psi-value (Ψ-value)",
  "U-value",
  "Isotherms",
  "Surface temperature factor (fRsi)",
  "Mold risk / Condensation risk / Hygrothermal assessment",
  "Finite Element Method (FEM)",
  "Computational Fluid Dynamics (CFD)",
  "Building Energy Modeling (BEM) / Building Performance Simulation (BPS)",
  "Heating load calculation",
  "Glaser method (for condensation)",
  "DIN EN ISO 10211",
  "EN ISO 13788",
  "VDI 6007",
  "DIN EN 12831"
]
- [06-suche/amelie-lab-protokoll.md] Originalfeld confidence, Teil 1 (laut gespeicherter Datei):
0.9
- [06-suche/amelie-lab-protokoll.md] Originalfeld quellen_used, Teil 1 (laut gespeicherter Datei):
[
  "https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQFNWDTSgYjzu-ne3sl2Mczvc-DIA8P3vOLyx6ToHagizLFPwTQgKGQohbrbkos2_7x7HVCJLaEtCYYQB50fvcpM5G5SbawDiWPTieWXIFKgxXtHSvDgr9gTEMRXSVJlRq_bzccKHNi6e0k3d60QKw==",
  "https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQGGkC6EeMZdZerBDOFP8RJti0uYYoqj8vr80K1-OP0xn7HXqYMEvz6yXdu9hp8X26KjzWWxalTLkPLUFki0cw3jNXOMhjwOno9gPMNtGd9GYULvPrkhpXa0fGncpYxKd1VGJaaOAG26KqaCMhtpbnrpmg==",
  "https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQFMNFcElsX1qH05gidUtr0I69SEhv9GrQO42x5NUTDP0ojoU7NwFn_Of5fywaSZZ3LJSQDYV1y0dWJS_Rtbaa_-HYtwd9Wk1P4OX--K6Zf8z9xTqJYTZBsECRCivVmWHaBiOtsdU3zDeto0AE=",
  "https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQGN5lACDizlqscwyXxOGwKGTSo62RN9sB3XfQ8aRxH4LyhORPR5mQYL4RC-ny8xZ8XmRhqsw_fDvGV_m-PgYmg58vbhIV-OG8eX-4mv7sM65WI8zsCvWDjGmKGz515EgzKVKJtQ8Ubgg04RLMejVR25nbtr",
  "https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQGRLQoI4lFZIhv28Wi8ZkYfDQkDmu1aMcfmbpJU42vcsJkuwDo6XeT3KJrtKrq_oyd7kPChPgI95Lzmzc2VH5CeuLC07cuj6KTz9bzn-XeD0Qj7yfpaMFy3SggUiE7gmWPK17bvPK5_uwZekcpQ4MwD6jRmKGQ4rmz5",
  "https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQEkIFdS6NuOoLwTpYpb8GwmaheNvAUXQgHE2UuPMKhoR5sb2hOJ4zTkNRgwsLxxc-bsppNyY39FduELZXY16QFpzGlEUXbTV65_BUyQIdXSpuSag1SHvOZ8vuQ0akcOmOn7pBKJCNu2pA19-G-QYQ=",
  "https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQGal3L3SHU45tXQ_Pte97NOm1Wjp6czv7COTQCWdOOkPP89cHJbfVOCM_X9T_q_Sci-r_AteFtGGUv1tGIxOG0IlNenebrTFGlFVp_nR80ApRBfobep8DfpbvPkelGjQ==",
  "https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQELDZ9NMrguQV9gzJPsxgiw0lFCacMfpnNPZXAC4O8-r9QGYluW645VNqFjW8VTJ_JGK47xX0JK_lLkZYVb7jEAl1zjsPXUFxqY8Nd8DGUNji_3jIPhWEcV8m6WP6i5-8MiLTF_eVJzYO1=",
  "https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQHrf7cURBrWfsVRybvyVQAFqjkjs4CkNSQhe0JtNnVTLLHC5XDgvd2t_A9pS4WLbb61b7ZA_NJedJkev75pmbHktnc_ITcZ68rVADGx8blhFQFJsAZvEPTpknArkCfJziDhgAibMmjaOqSFOgO0TEV0LS76ahGaUtPRecfm3MQE4CKJA83Adg==",
  "https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQG7OQvlc2Spl6tmF0bpoTjSlfWyrOaKiIqGXmiO4FfW0xiO2HVa_y90ktWF9oIbaXHwGJ4fFB7btvpx_9cTz3yWAtqQBswrFQc9jVqUXiaHZZbdXJZi1Vsc5-TP8xaKR0tnMPlyBTvWBD-u7Na0-RydYpgg3jxmgqPuKTK4mQ0cEzhvXK2aPAMoPEDLtOt_6TH75W-ytw==",
  "https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQHGpqgoqCwx6NP7CLZYjKHmKBFecY6mUAjS0PI3k6VvWlTwNhjMnMnC-VV4gY_9s5s6hLqCoJAGIht4LlnZ2TpXCP4-xNeZ9hZF3__tkcveIzDfc2TjUS6bvTgEjC5qpFGiG_xg1rWv1lSq1KrcoNXlwiMENt67Rz7JsAwIZmYZExCgW98JJvMNnx5m-vcXosFDGf4=",
  "https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQG2vncftR-mV97a41aQJFOq7IGvJ0Lj61XYdksT9zdL8bN1F3knZIporInyRir2_LXW8QUEl13_jpR5rW7Oa-jZ8B8lOTs30_blhxm2PvA4BCa5WMVTPhGJZmSfwOih",
  "https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQFkAgNpVHVGKzZoNb7Ou_qbvhgN5OsVF3Dma6PxhlSkiWK4cYStejSlUwDsqiibvS5w9SvqVzi2ys-NoP3qgxeEmKkelNwnoKW_04OgGYuxqo9WouBle3MG7yXpnef-3B83El1d3ianZWMwYZTwPbwl2ztOA9pwTv6hkR81IP6zdG3zF-zn74-ewyOnGxLsUqrBawSt85l6GKBhGvU47xNfKTYNPd2StI-fTw==",
  "https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQEC4wI_UEING9qcJbPezqBcdpULhGP8k52AeYA33nekiiEU6k5PMzfbcgnOZEo8avUUnzU41gq37oVO74kk22yj9HmtzH-uwZq0FcH3s4nli0AXVcX1K14uASyT9PGNjQJQU0xA9WmTjBVU43nr",
  "https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQGXXEyOob7VCdh6RKK_Vb2mgyWa_Ua19DqqwSf0Y3Z164MEm6ys9sXeS8wiwjnIN4tHjcEuh1Jqly_2J6nLuyAsS2CMrk2Omg6VzrsPqzOqbp4QQyIrWpvM4IdRVULHUPg8Rj4=",
  "https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQH1v_ik_vJjypAWQaUyy508SVFvH2LbBM1yIDeyjghwBDgP2vaVN4vEjnsThvYqxsuCess6UM4pPBwxmaGlRX-w96b8e9tEU15aLPFuF69yBYrdi_DxkTtQAxTaA3BeN-ymVO7k-A9Y-CvbGTfq3s26ZZIOjsyVnIUgJrWYuLTZvvTiR9fUg7s=",
  "https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQGMRorCFJnkoMlKpXYRnoEfgMXi30VmgBC8v6BGYoBriwt78Boh8D9Lmi6MeQVb7PPKw7BGWEnoU9hLbmclU3IXKY6a_jk2deY8GLyv7HgIXNOEmPeZ0q9mXr862A4vDlVWjZzKz9Z0EkHbhJcAIe-2FTwHN2C54YJOjeg0=",
  "https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQHcfwiGqU-pychiGZhfqOY6hYWBv_RIR-EhAUdFjdKfpnqthl5wftDs661JBfrI_q8GO22oZrRCUDTeIc-iKOETa7ai5XV7ifaN087X47zxzbTPLkDCunj-6PRy5JET8wVLhal9LwwOc5AcA9FbkkM3uc-OiOsZKPyeHFkd9sNdJtsVPzjPEl4GNdTIu3eX",
  "https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQETOebJhk7zD71kHK3kxuAmt33vgdXbxMtGwFyKJYg8kzRH0DMhwAOy9YuMV9dR6_NznaKeDefyOsTRMIecLu9SfWNIC8aVdwU7fytUdiDSNtB8_sQ=",
  "https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQGjVeOFN6LGPdUnQxICxL2whkGXM3IANHUmzKVZ_O-xn5GgUsFb-aSZkgN99AtxweMpa3dweQ_j3gHo4LI-LvhbgWcHTHEelUyj2VO_OwKr4xKYztpOB6hb6_zUmZzo36Z9kzuH7HtuUIgyRE6shRDaMvc=",
  "https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQH4ujDzO8dhleM6JggpAn30j6I30PVM7sW86AotRxqQ_UsLo1NIPCy00Y0hSSE9JLTlF7IBOnqqPw_2juDb0A8HGPKTMjUoY7cbiQOrt9e9iKN1BHLNGYHLvV0nArcb",
  "https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQHYaz9jzEXF-1VFyqCUPOlfHsy8XF2cKxba-Vv4gfK5LeybRxmgJbePqCngfInfLGOkNCXsy68l1Jn0n04Bic7gkWsred3dojS6byGMwpUjLLkVeYBhcobEwViaCom8HO5REGCBlG0WWw2GP4Be7Y9ftU8CuF-kpACH-me69R14TRstX46qGQPj3Etyv-6WnqNRX7L6sS7yJKOj_wa9fQ_mYQ==",
  "https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQExddMoWn48nQz6SRrmgUfXAK7qqZFzI_Jjam2qGqs9ENeRNCrodxODyyTmUR_kFcAlN-IMFsDwxDZOMjfYu0MK2IAWoi3qKaJRh2h-YABF6PoYx7Bo2usHsMc=",
  "https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQF52f1gjw_cFyxC5W2DaME2GIr9TDtcbqwurO9uWDGfvOYT0VD1EpAj7LAOZL0zeda2_NZ_Uq6ldYf70tTJTyfBX3tDBwrOJReY0K3EeXpWxPbtajKiHYjj0Mabj7Yu4bt5u0gBZA==",
  "https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQFMWQx8Oxqp4P0uypfpcDF_5aNM0pieUjbdIVEAhI_TPnFE6arPCNDKPoEQAFc3L1Y-RSPTGsfc5cC_qghUxXQgoYmVSc4zffLjKgazN83wkPwBON60MlrCuo85fw2H3vHdlpdv9beSnue4",
  "https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQHT4JnFayIaPBV9ObV3mYE0JzaNb1o-NtW7id3yZCe5sTFKCcCv_UckgfA84vF2dj0SPq6NSyec-Ho7-G46Cy4A_7dRvohLdyckzKB_P1Y6Z5MLVSM5H9IV-2URS9W5",
  "https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQE6JTV8UY9NzPhNf843Ivn0babxrL5FH1xqV41p3rkH6o0dGBZJdsyXNYPAOj3VUkmtx3_eNRFQw-QdeeDmoZMM2IMkddVJ6Ij5eJ9W5Ox-5rUPcX5Yem71mhI=",
  "https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQFeWJ2QWfuSfFcjayxSbvWhH5ayWAy78pqgTUd4JLHw3eu0sIjmYZ6rfi2KJaP2Np-kPvbOF3kloDS5YFO3frB1-0TDcWYJEP6x_WyRZYuz-IYEqd67ZsVBT3k3E5p6kf5gDQ6IH6Q_XEDzgktwesv4HwFMBROBA2FlFNDVuYM_4jJRjMnkWK0s3YrYS1KUWRukolBo1Mmw90sSInMea_Y_KxY_mkiLi3wA-1zWQCNqqF5zEzA=",
  "https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQFuMQDrHx9LRz5r2Wyry5LY-HVup3TVzBei8ofN1n879jx9w9kVyyLLNimKkzgPoLGcUwOegqpKQOgWUeGEdpuv8aa7FtBObx2AHeqIb40fClTPBJq6Rs-CUzdVYFu6wZDPvUI3SOvWIEirwLNeewROPmNZnXD_KTLufJAVyZsBr9XJSPfkMLis5SZpev4xEKRllXBSxkgoajnV9czkRwU2BNQGqzhH8n4kG1tgMwTIt3UJXupC8WzPM5mqk7UhRSNblxrvtCz3Sr4_mm8oDN1FCbA=",
  "https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQHpEnsaEV_nzN-jOusSQFGfFlEy-lTbYfyqbt0MmvuZrtJwPf_ofse0c19lc6Kk3gQXlZdXPs6vVgh9o5hmatkBzI8vK6IdxZ5Xh733VZ2q_PJsqXiiXZqWx1gYqA2LON08w9oZcCfU5N7FVWjOZbymkTpdTrwl_D9r96sbUx4w1218bpM=",
  "https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQGjVeOFN6LGPdUnQxICxL2whkGXM3IANHUmzKVZ_O-xn5GgUsFb-aSZkgN99AtxweMpa3dweQ_j3gHo4LI-LvhbgWcHTHEelUyj2VO_OwKr4xKYztpOB6hb6_zUmZzo36Z9kzuH7HtuUIgyRE6shRDaMvc==",
  "https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQHu7V0U2Hg3REiIaiogikKAwa5L9kC0e_d_-qmSXE8G7uOyOPVVfjRC0rTkVnfPHN8KmuUHJ1HbiEzboD8m6VoUBVGogaJ-ZpzPPjOOjhgoobyTPX-cYI6pFyXotuVGwRY=",
  "https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQEuhkp7YxLcySaOuBJVbSaMy3JqI5Bffurr4hjgqaU7IyTKMY4PysG2QrQCcUVFFihbMBMGlkDfCWz27UufMSAqrMZ1PejV5n9i-KW2QXq15FNIlYuLTI0QgHKV5TLUdGKK0rXhbN0RcUtuAELPpAjx0RANdZ_OroKM_qK6E6al1aNn5PK85G3fRCtXMGvT1Gz_",
  "https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQF9CR9M47fmNJV-_qRXkJrRQnexyVaEAOdhAxrnaAxlldxVnQHxEEFx7IRHJ0MiN9RJUnVRHYpqlAcG46R5zJ42q6hRDZEbg4g9z1WBs5hYQ3AagzcBRNI=",
  "https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQENyabAiGbmJfO_DhFkSX30i4zO6iCQ_QgkJfbQSIvVQBZwFnHmYY3a1QmUh66SXgIamPZdjj4Az16uhRF0fr_8lkH8rlkoQl-dtfZsJI7Yq6arfFYozpfaEtAxGWjwv9tUn1h9n9REbL8Tx-E-yRdtLqZ410S5S_tAUetK05LCOuVtBv21jt5wksWZ1kXaiehT",
  "https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQEcC8qSx0n4SrLgQTGL2obYmvdDqic4UVZb_aD0ba1OfHRWlnOHeOQr6ZhGZmdFRnnqeeZhAd87XxJNc2UEu-_yogYb4nuAfZsdPupmq1b3W7jjqvPJfSY2piE9rtITNEy3zhu_1FASm6g3TBkwtfJTYfXb82SKRsAajqXJ",
  "https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQFUJ1P6vcoM1MKRm1MTbRqa5G48rWjpj7CCbUXVWCjQm4XzwTNIN9WdDNaFfMTfjaWdNC781feWs4I7hvVFE7i94jerBv46kWLeggY-oZRi07JSc_0VJ5Uq5efZY3svvo50R8AtwwsXaLT50b4soITizwMvzt7d69I6dTD6NCt6AzrLFg==",
  "https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQE263-NanZLRSARGN_dPiPoQb7uMb96zLQugJ9IdDDSqJInTxoYOqSEgGMVY8vMyZKh2ARN12ZEDbNv1ZC4eTFVDJ4cSipWLI5vd4_66xK6Ey5qxx05-pDLQsGrWZi7PHO6GCByQQURA4I88Q==",
  "https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQETpebVsuh70pZGpraqc4u6NC-cHvmOquxO1m7jCv5wyIkw_XrF32yGnWelAUZPHoSUWgPqf7oQaKE7cIjduow6Og9fuRwhErruoMtelHImlUIZxC2Mrp9KX-Q2kq5cmMYtMR6_Tlc=",
  "https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQGJIi6pSWmnJenee-rWkdoF3YgreMwhjPQzO_O5-wfDDPJtcXCrCHD9c4q_5LqAmrBTjB90AGPaedGWlv8ffC0Sy3E5fymaEYjh92NKToLVpOcnIGi9FKeTwdO08a-fvpSPUpC4uuACoZXdAq25RaQcqjuAh3uGQPLtc0nAYz9YuA2EIrbxgv_5nBp42RgG-7C933YqdfjPKPl6FMqAIbjmVTUVB5kUeE4mp8Qv6lHNJqhhVH4IQJkj7yzGSmvMb960YF-u2BRYlfU9eYLvaYBWaBMvMZMap5zzjTU=",
  "https://vertexaisearch.cloud.google.google.com/grounding-api-redirect/AUZIYQFLTNJKpvaJJuULjclkG1w0vdRx5q3WHugG5USMTH7CrpCG1xTC2-VU6U5Tyb2_q5Zyh1Cvs3bcR7qxdpz0eM93lutyxXYH5-tJnod0WS3WOzg_lnbJyTy4UnVdp3nG_HWI1WRZWvg9eH-jXWHa5g0_vMnG6AM=",
  "https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQELTNJKpvaJJuULjclkG1w0vdRx5q3WHugG5USMTH7CrpCG1xTC2-VU6U5Tyb2_q5Zyh1Cvs3bcR7qxdpz0eM93lutyxXYH5-tJnod0WS3WOzg_lnbJyTy4UnVdp3nG_HWI1WRZWvg9eH-jXWHa5g0_vMnG6AM=",
  "https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQFVNmGXY-fbTiRAOk8vUs1VaLDyxlkTnE6HqCg6V2wvDqKkpFJwGdjuuVVLXiWogTIyzcnCrRawHUA3r6ueZPFcXzhtixZWHA-BNP8c8xlu5z-i2Lp8CaYgU-mOI4lG8a6mofmRz5clPu8Z1jxzVfTPqq71DmWlqLmMP9Ob2Dn7GPFsmgNc",
  "https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQEi1TXwDtkBdBujWID355teoFkmiu6TVPHQWMIpzqF9kuvSed21JNW36DIUiJ15Sipe6FQ8m8tpAJzQbqII8PyQR6yc0WdtfbqGWXPqwg-tCEzeBfPb1JuzraXznjkGOdf8DIjjYWjNTm8MwqtCnAibtkBBz6CE0M1q9vqobmqvFfFNOXwj",
  "https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQE_2h4-jyKWProfhGuGzOQYe8D0KSFjt7I7ECJiLQ6G2G0ETaPIa1Hau0iFsse0tMZKGWsLGIwtjv2x_lQYdp7sZHCZ6N_x_5Ij5lKiFp5masrtRHChweBkVngNKh6JY08nDQDKUMrMJeSnKV6IQwJHkm2v0hKiuBvTh_M3wBmwH1fUVhBrvispg_yrHg==",
  "https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQE5NQRZHPslTerOqlbflbvOg4FAga9tA3-2NiYTWXJhI6lWnEJ3Cw-HoZrck7i66-nyuiYwRdFoamnao5nYOCHmujDnlFUV-FbqhWtTdmNGUhAI6RyZYlAAVpA1BCytRE9uulKI1wYFeQoK2us90ModjKPFoZ9pMAzJjQ==",
  "https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQHyjVplSEmaNOazIhWxA6bUBAcdJGjnCqFXja0m8VwA39Ti4cMx93VKtH7M-COtkRTeXWati2eepPKR_IDYOcgBqiKFrC1qL_KdtMyVTO5ey6GrWfAqw5u9FgqBJy5N7GB1koGMOM3MyZpJqb6il2UGfGMw-I2ovA=="
]
- [06-suche/amelie-lab-protokoll.md] Originalfeld search_accounting, Teil 1 (laut gespeicherter Datei):
{
  "month": "2026-09",
  "queries_in_run": 10,
  "month_total_queries": 25,
  "free_allowance_remaining": 4975,
  "overage_queries": 0,
  "overage_cost_usd": 0.0,
  "is_within_free_allowance": true
}
