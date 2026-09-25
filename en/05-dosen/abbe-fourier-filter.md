---
status: Available
delivery_method: E-Mail
target_maker: Ernst Abbe University of Applied Sciences Jena
review_score: 32/35
architecture_tier: Tier 1
source_type: Type D
---
# Abbe's Bench: The Fourier Filter

**One sentence:** An optical physics puzzle game that brings the 2D Fourier transform off the blackboard onto an interactive 4f bench — carve apertures into the diffraction plane to erase wire fences, reveal transparent phase objects without staining, and strip halftone screens from archives, in real time at the speed of light.

**As of:** 25. September 2026 · **Recheck by:** September 2027  
**Recipient:** **Ernst-Abbe-Hochschule Jena** (Department of SciTec / Laser & Optical Technologies, Carl-Zeiss-Promenade 2, 07745 Jena; Prof. Dr. Jens Bliedtner / Photonics Education) · secondary: **DPG Physics Didactics Division** (Prof. Dr. Holger Cartarius), Introductory Physics Lab courses at LMU Munich and TU Berlin (Experiment "Abbe Theory / Spatial Filtering")  
**Verdict:** 🎁 **gift** — University at the birthplace of modern optics with a mandate for education in photonics and microscopy; bridges the chasm between abstract wave mechanics and frustrating lab alignment  
**Review:** 32/35 · Tier 1 · Type D (Details: [Classification Log](../../06-suche/amelie-classification-log.md))

---

## The problem

In higher education physics, electrical engineering, and microscopy curricula, the two-dimensional Fourier transform ($\mathcal{F}\{f(x,y)\}$) is among the hardest concepts to convey. In lecture halls, it is derived as an abstract double integral on chalkboards: students memorize equations without developing spatial intuition for what spatial frequencies ($k_x, k_y$) mean in an optical wavefield — why high frequencies at the perimeter form crisp edges, low frequencies carry the ambient illumination field, and periodic patterns appear as sharp, discrete diffraction spikes orthogonal to their real-space orientation.

In student wet labs (e.g. using the Thorlabs EDU-FOP2 kit), understanding collapses under mechanical friction:

- **The 5-hour alignment bottleneck:** Students spend four to five hours in a darkened room battling micrometer adjustment screws, spatial filters, and laser alignment. 90% of laboratory time is burned troubleshooting beam aberrations, dust diffraction rings, and astigmatism. For the actual experiment — exploring spatial masks in the Fourier plane — barely ten minutes remain, during which students hurriedly insert a single pre-made slit or cross-grid.
- **Absence of exploration:** Because manual placement of apertures requires sub-millimeter precision, nobody experiments with unconventional spatial manipulations (Schlieren knife-edges, Zernike phase plates, structured notch filters, or optical convolution). The profound realization that an optical lens calculates a continuous 2D Fourier transform *at the speed of light with zero electrical power* (analog optical computing) remains a dead formula.
- **Microscopy blindness:** Biology and medical students operate phase-contrast and darkfield microscopes daily without understanding why a central annulus or phase plate makes an invisible, unstained living cell emerge with distinct topographical relief and high contrast.

**Who suffers:** STEM undergraduates in physics, microscopy, and photonics practicals, university physics educators, and cytological laboratory trainees who operate sophisticated optical contrast instruments without grasping the underlying wave mechanics.

## Why now

1. **Sub-2ms 2D-FFT in the browser:** WebGL2 and standardized WebAssembly with SIMD compute complex 2D Cooley-Tukey FFTs on $256 \times 256$ to $512 \times 512$ pixel grids in under 1.5 milliseconds. This unlocks full 60 FPS real-time responsiveness on any commodity laptop or tablet with zero installation.
2. **Tactile interaction in frequency space:** HTML5 Canvas enables learners to directly carve, stamp, and adjust diffraction masks in the Fourier domain using touch or mouse gestures (punching pinholes, rotating slits, applying Zernike phase coatings, sliding knife-edges) while the reconstructed output image updates synchronously in real time.
3. **Didactic gamification of historical breakthroughs:** The history of physics provides an intuitive puzzle progression: Ernst Abbe's image formation theory (1873), A. B. Porter's grating filtering (1906), Frits Zernike's phase contrast (Nobel Prize 1953), and August Toepler's Schlieren optics map directly into compelling physical gameplay levels.

## Sketch

- **The experimental bench:** Virtual 4f optical bench on screen: Collimated laser beam ($\lambda = 532\text{ nm}$) $\to$ Object slide $\to$ Fourier lens $L_1$ ($f = 200\text{ mm}$) $\to$ **Fourier filter plane** $\to$ Reconstruction lens $L_2$ ($f = 200\text{ mm}$) $\to$ Camera sensor.
- **Dual-plane display:** Left: input object; Center: Fourier plane displaying logarithmic amplitude spectrum $\log(1 + |F(k_x, k_y)|)$ and phase map $\arg(F)$; Right: live reconstructed output image.
- **The optical toolkit (spatial filter masks):**
  - *Pinhole aperture (Low-pass filter):* Transmits only low frequencies $\to$ smooths and blurs; strips high-frequency granular noise.
  - *Central stop / Darkfield (High-pass filter):* Blocks undiffracted DC light $\to$ luminous boundaries and transparent edges glow against deep black.
  - *Slit aperture (Directional filter):* Isolates orthogonal orientations; erases vertical bars from cross-hatched mesh.
  - *Notch punch (Diffraction peak filter):* Excises specific spatial frequencies $\to$ erases periodic fences, Moiré interference, or halftone screen dots without degrading background features.
  - *Schlieren knife-edge (Toepler blade):* Intercepts half of the zero-frequency spot $\to$ converts transparent phase gradients (convection currents, glass thickness variations) into dramatic pseudo-3D relief shadows.
  - *Zernike phase plate ($\lambda/4$ or $\pi/2$ retarder):* Phase-contrast microscopy for transparent phase specimens.
- **Puzzle campaign:**
  1. *Level 1 (The Zoo Fence):* A cheetah behind a chain-link fence. Goal: Locate the discrete diffraction spikes of the wire grid in the Fourier plane and block them — the fence vanishes entirely, leaving the cheetah sharp.
  2. *Level 2 (The Secret Amoeba):* A transparent phase specimen in water ($I \approx \text{const}$, phase $\Delta \phi(x,y)$ varies). Goal: Apply a Zernike phase-contrast filter to render subcellular organelles clearly visible.
  3. *Level 3 (The 1914 Telegram):* A historic printed scan degraded by a coarse 60-lpi halftone screen. Goal: Strip the periodic printing grid to reveal a faded handwritten signature underneath.
  4. *Level 4 (Hot Air Rising):* Visualize invisible thermal air currents above a flame using a Toepler Schlieren knife-edge.
  5. *Level 5 (VanderLugt Finder):* Analog optical pattern recognition locating a target within an aerial reconnaissance photo using a holographic matched filter.

**What is not included:** No 3D mechanical screw-alignment simulator (that is what wet labs do); no geometric ray-tracing puzzles (covered by Chromatron); no symbolic algebraic equation entry.

## First step

**Ticket: One grid, one fence, one pinhole, one reversible 2D-FFT canvas.**

A 2D Cooley-Tukey FFT pass on a 256x256 grayscale image containing an object obstructed by a regular periodic mesh; the Fourier plane displays the 2D amplitude spectrum with centered DC term; an interactive notch filter (two circular stops) blocks the mesh's diffraction peaks; the inverse FFT reconstructs the filtered image in under 16 ms in the browser.

**Done when:** three physics students or optics instructors immediately grasp why blocking just two discrete spots in the frequency plane completely erases the entire mesh from the image while preserving the object — and an automated test suite proves that Parseval's theorem ($\sum |f|^2 = \frac{1}{N} \sum |F|^2$) is numerically preserved to within 0.1% accuracy.

## Where it breaks

**1. Confusion with digital Photoshop filters:** If players perceive the game as a cosmetic photo editor (like an Instagram blur or edge filter), its didactic value evaporates.  
*Remedy:* The user interface must explicitly depict the physical 4f optical raypath (laser, lenses, conjugate Fourier plane) calibrated with physical units (nm, lines/mm, phase angle $\Delta \phi$). Every puzzle level directly references seminal historical experiments (Abbe 1873, Porter 1906, Zernike 1934).

**2. Discrete FFT boundary aliasing:** A discrete 2D FFT on a $256 \times 256$ grid generates spurious boundary cross-artifacts that do not exist in continuous laser beams.  
*Remedy:* Integrated Hanning or Tukey windowing at the image borders dampens boundary discontinuities, ensuring clean optical diffraction spectra.

## Who has already tried this

**Research 25 September 2026, English and German.** Detailed in `06-suche/amelie-pruefprotokoll.md`, Round 13 / Bisociation Run 8.

- **Geometric optics games occupy the wrong niche:** *Laser Maze*, *Chromatron*, *Optika*, and *Aargon* model geometric ray reflection and refraction per Snell's law (17th century) using mirrors and prisms — zero wave mechanics, zero diffraction, zero Fourier optics.
- **Didactic math explainers lack game mechanics:** Jezzamon (*An Interactive Guide to the Fourier Transform*), 3Blue1Brown, and Wolfram Demonstrations provide passive or interactive diagrams — but no puzzle progression, no challenge constraints, and no 4f optical raypath.
- **University laboratory practicals lose didactic momentum:** Lab courses (LMU, TU Berlin, RWTH Aachen, Thorlabs EDU-FOP2) operate real 4f benches but lose 90% of course time to alignment frustration; students test at most two standard slits.
- **Scientific image software lacks pedagogy:** ImageJ/Fiji provides FFT bandpass filtering as an isolated utility for researchers — without pedagogical scaffolding or physical beam path visualization.

**The residual gap:** A wave-optics serious puzzle game that makes Ernst Abbe's 2D spatial frequency filtering playable with authentic diffraction masks, cultivating genuine physical intuition for analog optical computing.

## Prior art

- **Ernst Abbe (1873):** *Beiträge zur Theorie des Mikroskops und der mikroskopischen Wahrnehmung*, Archiv für mikroskopische Anatomie 9, pp. 413–468.
- **Joseph W. Goodman (2005):** *Introduction to Fourier Optics*, 3rd/4th Edition, McGraw-Hill.
- **Frits Zernike (1934):** *Phase contrast, a new method for the microscopic observation of transparent objects*, Nobel Prize in Physics 1953.
- **Thorlabs EDU-FOP2:** *Educational Fourier Optics Kit*, student manual and experimental templates.
- **DIN ISO 10934:** *Optics and optical instruments — Microscopy*.

---

This idea belongs to no one. Take it, build it, sell it — you owe me nothing, not even a reply. If you ever have an idea you won't build, give it to someone who will.  
CC0 / Public Domain. — Félix, Berlin · github.com/felixinberlin
