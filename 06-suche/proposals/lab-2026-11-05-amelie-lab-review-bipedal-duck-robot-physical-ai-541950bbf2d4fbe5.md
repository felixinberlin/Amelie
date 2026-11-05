# Proposals from plan lab-2026-11-05-amelie-lab-review-bipedal-duck-robot-physical-ai-541950bbf2d4fbe5

Packet: amelie-lab-review-bipedal-duck-robot-physical-ai-541950bbf2d4fbe5 · Candidate: amelie-lab-review-bipedal-duck-robot-physical-ai-541950bbf2d4fbe5
Not applied. A human decides.

- [06-suche/amelie-lab-protokoll.md] review: amelie-lab-review-bipedal-duck-robot-physical-ai-541950bbf2d4fbe5. Absicht: How do miniature bipedal duck robots (Microduck, Open Duck Mini) and the open-source LeRobot ecosystem perform across technical architecture, contrarian failure modes, and commercial venture viability?. Modell: not recorded. Existenzprüfung: nein. Alle Ideen ungeprüft. Die folgenden Angaben sind gespeicherte Modellausgaben, keine bestätigten Tatsachen. Nur grounded=true ist Evidenz; Score-Änderungen benötigen zusätzlich quote_status=verified. Quellen, fact_checks und fehlende Felder bleiben wie im Original; keine neuen Prüfungen durchgeführt.
- [06-suche/amelie-lab-protokoll.md] Originalfeld findings, Teil 1 (laut gespeicherter Datei):
[
  {
    "claim": "Pollen Robotics and Hugging Face developed Microduck, a 25 cm, ~800g bipedal robot with 15 motors, wide-angle camera, 8x8 ToF depth sensor, dual IMUs, and an articulated grasping beak retailing at 399 USD.",
    "grounded": true,
    "id": "F1",
    "quote": "Microduck is a 25 cm tall bipedal robot weighing around 800g with 15 degrees of freedom, an articulated beak, and integrated AI acceleration.",
    "quote_status": "unchecked",
    "resolved_url": "https://pollen-robotics.com/microduck/",
    "retrieved_at": "2026-10-25T20:07:06+01:00",
    "reused_from_amelie": false,
    "seen_in_runs": [
      1
    ],
    "source": "https://pollen-robotics.com/microduck/",
    "source_type": "official product documentation"
  },
  {
    "claim": "Open Duck Mini V2 uses 14 Feetech STS3215 serial bus smart servos, a Raspberry Pi Zero 2 W, and a BNO055 IMU in a 3D-printed body (PLA with TPU feet) for under 400 USD total BOM.",
    "grounded": true,
    "id": "F2",
    "quote": "Open Duck Mini V2 is an open-source bipedal robot powered by 14 STS3215 serial bus servos and a Raspberry Pi Zero 2 W.",
    "quote_status": "unchecked",
    "resolved_url": "https://github.com/apirrone/Open_Duck_Mini",
    "retrieved_at": "2026-10-25T20:07:16+01:00",
    "reused_from_amelie": false,
    "seen_in_runs": [
      1
    ],
    "source": "https://github.com/apirrone/Open_Duck_Mini",
    "source_type": "open-source hardware repository"
  },
  {
    "claim": "Feetech STS3215 smart servos provide 19.5 kg.cm stall torque at 7.4V (up to 30 kg.cm at 12V), 12-bit magnetic absolute position encoding, and half-duplex daisy-chained TTL serial communication with feedback for temperature, load, and voltage.",
    "grounded": true,
    "id": "F3",
    "quote": "Feetech STS3215 smart servo features high torque up to 19.5-30 kg.cm, 12-bit magnetic encoder, and TTL serial bus communication.",
    "quote_status": "unchecked",
    "resolved_url": "https://feetechrc.com/product/sts3215-smart-servo/",
    "retrieved_at": "2026-10-25T20:08:23+01:00",
    "reused_from_amelie": false,
    "seen_in_runs": [
      1
    ],
    "source": "https://feetechrc.com/product/sts3215-smart-servo/",
    "source_type": "manufacturer datasheet"
  },
  {
    "claim": "Hugging Face LeRobot standardizes imitation learning (Action Chunking with Transformers - ACT, Diffusion Policy) and policy deployment for low-cost hardware like SO-ARM100 and bipedal agents.",
    "grounded": true,
    "id": "F4",
    "quote": "LeRobot provides state-of-the-art approaches for real-world robotics with imitation learning algorithms like ACT and Diffusion Policy.",
    "quote_status": "unchecked",
    "resolved_url": "https://huggingface.co/docs/lerobot/index",
    "retrieved_at": "2026-10-25T20:07:25+01:00",
    "reused_from_amelie": false,
    "seen_in_runs": [
      1
    ],
    "source": "https://huggingface.co/docs/lerobot/index",
    "source_type": "developer documentation"
  },
  {
    "claim": "Inference runtimes for bipedal locomotion policies run directly on micro-SBCs like the Raspberry Pi Zero 2 W using quantized ONNX neural network weights at 50 Hz control loops.",
    "grounded": true,
    "id": "F5",
    "quote": "The runtime executes trained neural network locomotion policies on embedded platforms like Raspberry Pi Zero 2 W.",
    "quote_status": "unchecked",
    "resolved_url": "https://github.com/apirrone/Open_Duck_Mini_Runtime",
    "retrieved_at": "2026-10-25T20:07:16+01:00",
    "reused_from_amelie": false,
    "seen_in_runs": [
      1
    ],
    "source": "https://github.com/apirrone/Open_Duck_Mini_Runtime",
    "source_type": "open-source software repository"
  }
]
- [06-suche/amelie-lab-protokoll.md] Originalfeld packet_id, Teil 1 (laut gespeicherter Datei):
"bipedal-duck-robot-physical-ai"
- [06-suche/amelie-lab-protokoll.md] Originalfeld question, Teil 1 (laut gespeicherter Datei):
"How do miniature bipedal duck robots (Microduck, Open Duck Mini) and the open-source LeRobot ecosystem perform across technical architecture, contrarian failure modes, and commercial venture viability?"
- [06-suche/amelie-lab-protokoll.md] Originalfeld runs_executed, Teil 1 (laut gespeicherter Datei):
1
- [06-suche/amelie-lab-protokoll.md] Originalfeld theme, Teil 1 (laut gespeicherter Datei):
"bipedal-duck-robot-physical-ai"
