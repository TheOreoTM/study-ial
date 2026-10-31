import type { SeedFlashcard } from "../types";

// Original Physics flashcards for every WPH11–WPH16 topic (written for this app, not taken from Pearson material).
// Each card is grounded in a specPoint from ../physics.ts. Constants follow the IAL data sheet, as in
// ../questions/physics.ts. Seed keys are generated from position: phy-<unit>-<topic>-fc-01, -02, ... so append new
// cards to the end of a topic's list rather than inserting them, or existing keys will shift.

// String.raw keeps LaTeX backslashes intact (e.g. \text, \times) inside template literals.
const r = String.raw;

function deck(unitCode: string, topicSlug: string, cards: [front: string, back: string][]): SeedFlashcard[] {
    return cards.map(([front, back], i) => ({
        seedKey: `phy-${unitCode.toLowerCase()}-${topicSlug}-fc-${String(i + 1).padStart(2, "0")}`,
        unitCode,
        topicSlug,
        front,
        back,
    }));
}

// ---------------------------------------------------------------------------------------------------------------
// WPH11 — Mechanics and Materials
// ---------------------------------------------------------------------------------------------------------------

// --- WPH11 motion ---
const motion = deck("WPH11", "motion", [
    [
        r`Write the four equations of uniformly accelerated motion (suvat).`,
        r`- $v = u + at$
- $s = \dfrac{(u + v)t}{2}$
- $s = ut + \tfrac{1}{2}at^2$
- $v^2 = u^2 + 2as$

Valid only when acceleration is **constant**.`,
    ],
    [
        r`What do the **gradient** and the **area under** a velocity–time graph represent?`,
        r`- Gradient = **acceleration**
- Area under the graph = **displacement**

For a curved graph, draw a tangent for the gradient at a point and estimate the area by counting squares.`,
    ],
    [
        r`What is the difference between a scalar and a vector? Give two examples of each.`,
        r`- **Scalar**: magnitude only — e.g. speed, distance, mass, energy, time.
- **Vector**: magnitude **and direction** — e.g. velocity, displacement, force, acceleration, momentum.`,
    ],
    [
        r`A vector $F$ acts at angle $\theta$ to the horizontal. Write its horizontal and vertical components.`,
        r`- Horizontal: $F\cos\theta$
- Vertical: $F\sin\theta$

Two perpendicular vectors combine to a resultant of magnitude $\sqrt{F_x^2 + F_y^2}$ at angle $\tan^{-1}(F_y/F_x)$.`,
    ],
    [
        r`Projectile motion: what stays constant horizontally and vertically (no air resistance)? What sets the time of flight?`,
        r`- Horizontal: **velocity constant** ($a = 0$).
- Vertical: **acceleration constant** at $g = 9.81\,\text{m s}^{-2}$ downwards.
- The two are independent; the **vertical** motion decides the time of flight.`,
    ],
    [
        r`Core Practical 1 (acceleration of free fall): what do you measure and what graph gives $g$?`,
        r`Measure drop height $h$ (metre rule) and fall time $t$ (light gates or electromagnet + timer), released from rest.

Since $h = \tfrac{1}{2}gt^2$, plot $h$ against $t^2$: a straight line through the origin with **gradient** $= g/2$, so $g = 2 \times$ gradient.`,
    ],
]);

// --- WPH11 forces ---
const forces = deck("WPH11", "forces", [
    [
        r`State Newton's first and second laws of motion.`,
        r`- **First**: a body stays at rest or at constant velocity unless a resultant force acts on it.
- **Second**: resultant force = mass × acceleration, $\Sigma F = ma$ (for constant mass).`,
    ],
    [
        r`State Newton's third law and the properties of the force pair.`,
        r`If body A exerts a force on body B, then B exerts a force on A that is:
- equal in magnitude, opposite in direction
- of the **same type** (e.g. both gravitational)
- acting on **different bodies**, along the same line.`,
    ],
    [
        r`Define the **moment** of a force and state the principle of moments.`,
        r`Moment $= Fx$, where $x$ is the **perpendicular** distance from the pivot to the line of action of the force (unit N m).

Principle of moments: for a body in equilibrium, the sum of clockwise moments about any point equals the sum of anticlockwise moments about that point.`,
    ],
    [
        r`What is the **centre of gravity** of a body?`,
        r`The single point through which the whole weight of the body can be considered to act.`,
    ],
    [
        r`Define gravitational field strength $g$ and give the equation for weight.`,
        r`$g = \dfrac{F}{m}$ — the gravitational force per unit mass ($\text{N kg}^{-1}$).

Weight $W = mg$, with $g = 9.81\,\text{N kg}^{-1}$ at the Earth's surface.`,
    ],
    [
        r`What is **terminal velocity** and why does an object reach it?`,
        r`The constant maximum velocity of a falling object. As speed increases, drag (and upthrust) grow until they balance the weight; the resultant force becomes zero, so acceleration is zero (Newton's first law).`,
    ],
]);

// --- WPH11 momentum ---
const momentum = deck("WPH11", "momentum", [
    [
        r`Define momentum. Give its unit and whether it is a scalar or vector.`,
        r`$p = mv$ (mass × velocity). Unit $\text{kg m s}^{-1}$ (equivalently N s). It is a **vector** — direction matters, so pick a positive direction.`,
    ],
    [
        r`State the principle of conservation of linear momentum.`,
        r`The total momentum of a system of interacting bodies stays constant, provided **no resultant external force** acts on the system.`,
    ],
    [
        r`How does conservation of momentum follow from Newton's laws?`,
        r`In a collision, by Newton's **third** law A and B exert equal and opposite forces on each other for the same time. By the **second** law ($F = \Delta p/\Delta t$) their momentum changes are equal and opposite, so the total momentum is unchanged.`,
    ],
    [
        r`Two bodies are at rest, then push apart (an "explosion"). What is their total momentum afterwards?`,
        r`**Zero.** They move off in opposite directions with equal-sized momenta: $m_1v_1 = -m_2v_2$. Kinetic energy is not conserved — it comes from stored energy.`,
    ],
]);

// --- WPH11 work-energy-power ---
const workEnergyPower = deck("WPH11", "work-energy-power", [
    [
        r`Write the equation for work done by a force $F$ acting at angle $\theta$ to the displacement $\Delta s$.`,
        r`$\Delta W = F\Delta s\cos\theta$

Only the component of force along the direction of motion does work. Unit: joule (1 J = 1 N m).`,
    ],
    [
        r`Write the equations for kinetic energy and change in gravitational potential energy.`,
        r`- $E_k = \tfrac{1}{2}mv^2$
- $\Delta E_{grav} = mg\Delta h$ (near the Earth's surface, where $g$ is constant)`,
    ],
    [
        r`State the principle of conservation of energy.`,
        r`Energy cannot be created or destroyed; it can only be transferred from one store to another. The total energy of a closed system stays constant.`,
    ],
    [
        r`Define **power** and give two forms of the equation.`,
        r`Power is the rate of doing work / transferring energy.

$P = \dfrac{E}{t} = \dfrac{W}{t}$, unit watt ($1\,\text{W} = 1\,\text{J s}^{-1}$). For a constant force at constant speed, $P = Fv$.`,
    ],
    [
        r`Write the equation for efficiency.`,
        r`$\text{efficiency} = \dfrac{\text{useful energy output}}{\text{total energy input}} = \dfrac{\text{useful power output}}{\text{total power input}}$

A ratio (no unit) or × 100 for a percentage; always less than 1 in practice.`,
    ],
]);

// --- WPH11 fluids ---
const fluids = deck("WPH11", "fluids", [
    [
        r`Define density and give its SI unit.`,
        r`$\rho = \dfrac{m}{V}$ — mass per unit volume, unit $\text{kg m}^{-3}$.`,
    ],
    [
        r`What is **upthrust** equal to (Archimedes' principle)?`,
        r`Upthrust = **weight of fluid displaced** $= \rho_{fluid} V_{displaced}\, g$.

A floating object displaces its own weight of fluid.`,
    ],
    [
        r`Write Stokes' law and define each symbol.`,
        r`$F = 6\pi\eta rv$
- $F$ viscous drag (N)
- $\eta$ viscosity of the fluid (Pa s)
- $r$ radius of the sphere (m)
- $v$ speed of the sphere relative to the fluid ($\text{m s}^{-1}$)`,
    ],
    [
        r`What conditions must hold for Stokes' law to apply? How does viscosity depend on temperature?`,
        r`Small, **spherical** object moving at **low speed** with **laminar** (non-turbulent) flow.

Viscosity of a liquid **decreases** as its temperature increases, so temperature must be controlled.`,
    ],
    [
        r`Core Practical 2 (falling-ball viscosity): what do you measure, and what force balance gives $\eta$?`,
        r`Measure ball diameter (micrometer), ball and liquid densities, and the time to fall between two marks **after** terminal velocity is reached (marks well below the surface).

At terminal velocity: weight = upthrust + drag, so $mg = U + 6\pi\eta rv$; rearrange for $\eta$.`,
    ],
]);

// --- WPH11 solid-materials ---
const solidMaterials = deck("WPH11", "solid-materials", [
    [
        r`State Hooke's law and give its equation.`,
        r`The extension of an object is directly proportional to the force applied, up to the limit of proportionality.

$\Delta F = k\Delta x$, where $k$ is the stiffness ($\text{N m}^{-1}$).`,
    ],
    [
        r`Define tensile stress, tensile strain and the Young modulus (with units).`,
        r`- Stress $= \dfrac{F}{A}$ (Pa)
- Strain $= \dfrac{\Delta x}{x}$ (no unit)
- Young modulus $E = \dfrac{\text{stress}}{\text{strain}}$ (Pa)

$E$ is the gradient of the linear part of a stress–strain graph.`,
    ],
    [
        r`Distinguish **elastic** and **plastic** deformation, and the **elastic limit** and **yield point**.`,
        r`- Elastic: material returns to original shape when the force is removed.
- Plastic: permanent deformation remains.
- Elastic limit: maximum stress for which deformation is still elastic.
- Yield point: where the material suddenly extends a lot with little or no extra force.`,
    ],
    [
        r`How do you find the elastic strain energy stored in a stretched sample?`,
        r`Area under the force–extension graph. For the linear (Hooke's law) region:

$\Delta E_{el} = \tfrac{1}{2}F\Delta x$

For a non-linear graph, estimate the area by counting squares.`,
    ],
    [
        r`Define **breaking stress**.`,
        r`The maximum stress a material can withstand before it breaks (also called ultimate tensile strength when it is the peak of the stress–strain curve).`,
    ],
    [
        r`Core Practical 3 (Young modulus of a wire): what do you measure and which graph gives $E$?`,
        r`Long wire (~2 m) over a pulley with a marker against a scale. Measure original length (metre rule), diameter at several points (micrometer) for $A$, and extension for each added load.

Plot stress against strain: **gradient** of the linear region $= E$.`,
    ],
]);

// ---------------------------------------------------------------------------------------------------------------
// WPH12 — Waves and Electricity
// ---------------------------------------------------------------------------------------------------------------

// --- WPH12 progressive-waves ---
const progressiveWaves = deck("WPH12", "progressive-waves", [
    [
        r`Define the **amplitude**, **wavelength**, **frequency** and **period** of a wave.`,
        r`- Amplitude: maximum displacement from the equilibrium position.
- Wavelength $\lambda$: distance between two adjacent points in phase (e.g. crest to crest).
- Frequency $f$: number of complete oscillations per second (Hz).
- Period $T$: time for one complete oscillation, $T = 1/f$.`,
    ],
    [
        r`Write the wave equation and define its symbols.`,
        r`$v = f\lambda$
- $v$ wave speed ($\text{m s}^{-1}$)
- $f$ frequency (Hz)
- $\lambda$ wavelength (m)`,
    ],
    [
        r`Distinguish **transverse** and **longitudinal** waves, with an example of each.`,
        r`- Transverse: oscillations **perpendicular** to the direction of energy transfer (e.g. light, waves on a string).
- Longitudinal: oscillations **parallel** to the direction of energy transfer, forming compressions (high pressure) and rarefactions (low pressure) (e.g. sound).`,
    ],
    [
        r`Write the equation for the intensity of radiation.`,
        r`$I = \dfrac{P}{A}$ — power per unit area perpendicular to the direction of travel, unit $\text{W m}^{-2}$.`,
    ],
    [
        r`Core Practical 4 (speed of sound): how is a 2-beam oscilloscope used to find $v$?`,
        r`A signal generator drives a speaker; one trace shows the speaker signal and the other a microphone. Move the microphone until the traces are in phase, then move it until they are next in phase: the distance moved is one wavelength $\lambda$.

$v = f\lambda$, with $f$ from the signal generator (or the trace's time-base).`,
    ],
]);

// --- WPH12 superposition-stationary-waves ---
const superposition = deck("WPH12", "superposition-stationary-waves", [
    [
        r`State the principle of superposition.`,
        r`When two or more waves meet at a point, the resultant displacement is the **vector sum** of the individual displacements at that point.`,
    ],
    [
        r`What does it mean for two sources to be **coherent**?`,
        r`They have the **same frequency** and a **constant phase difference**. Coherence is needed for a stable interference pattern.`,
    ],
    [
        r`Give the conditions on path difference for constructive and destructive interference (sources in phase).`,
        r`- Constructive: path difference $= n\lambda$ (phase difference 0, $2\pi$, ...)
- Destructive: path difference $= (n + \tfrac{1}{2})\lambda$ (phase difference $\pi$, $3\pi$, ...)

Phase difference $= \dfrac{2\pi \times \text{path difference}}{\lambda}$.`,
    ],
    [
        r`How is a stationary wave formed, and what are nodes and antinodes?`,
        r`Two waves of the same frequency and amplitude travelling in **opposite directions** superpose (e.g. a wave reflected back on itself).
- Node: point of zero amplitude (permanent destructive interference).
- Antinode: point of maximum amplitude.
Adjacent nodes are $\lambda/2$ apart.`,
    ],
    [
        r`Write the equation for the speed of a transverse wave on a string.`,
        r`$v = \sqrt{\dfrac{T}{\mu}}$
- $T$ tension (N)
- $\mu$ mass per unit length ($\text{kg m}^{-1}$)

For the fundamental mode, $\lambda = 2l$, so $f = \dfrac{1}{2l}\sqrt{\dfrac{T}{\mu}}$.`,
    ],
    [
        r`Core Practical 5 (vibrating string): what do you vary and measure, and what graph confirms $f \propto 1/l$?`,
        r`A vibration generator or sonometer drives a string over a pulley with hanging masses (tension $T = mg$). Vary length $l$, tension or $\mu$ one at a time; adjust the frequency until the fundamental (one loop) is seen and record $f$.

Plot $f$ against $1/l$: a straight line through the origin.`,
    ],
]);

// --- WPH12 refraction-optics ---
const refraction = deck("WPH12", "refraction-optics", [
    [
        r`Write Snell's law and the definition of refractive index.`,
        r`$n_1\sin\theta_1 = n_2\sin\theta_2$

$n = \dfrac{c}{v}$ — the speed of light in a vacuum divided by the speed in the material (no unit).`,
    ],
    [
        r`Define the **critical angle** and give its equation.`,
        r`The angle of incidence in the denser medium for which the angle of refraction is $90^\circ$.

For a material–air boundary: $\sin C = \dfrac{1}{n}$.`,
    ],
    [
        r`State the two conditions for total internal reflection.`,
        r`1. Light travels from a medium of **higher** refractive index towards one of **lower** refractive index.
2. The angle of incidence is **greater than the critical angle**.`,
    ],
    [
        r`What is **plane polarisation**, and which type of wave can be polarised?`,
        r`Oscillations of the wave are confined to a **single plane** containing the direction of travel. Only **transverse** waves can be polarised — so polarisation shows light is transverse.`,
    ],
    [
        r`How does a pulse-echo technique locate an object, and what limits the detail obtained?`,
        r`A pulse is sent out and the time $t$ for the reflection to return is measured: distance $= \dfrac{vt}{2}$.

Detail is limited by **wavelength** (objects smaller than about $\lambda$ are not resolved) and by **pulse duration** (long pulses overlap echoes from close boundaries).`,
    ],
]);

// --- WPH12 diffraction-interference ---
const diffraction = deck("WPH12", "diffraction-interference", [
    [
        r`What is **diffraction**, and when is it most noticeable?`,
        r`The spreading of a wave as it passes through a gap or around an obstacle. It is greatest when the gap width is about equal to the **wavelength**.`,
    ],
    [
        r`Describe Huygens' construction.`,
        r`Every point on a wavefront acts as a source of secondary wavelets. The new wavefront is the surface tangent to all the wavelets a short time later. At a narrow slit, few points act as sources, so the wavefront spreads out (diffraction).`,
    ],
    [
        r`Write the diffraction grating equation and define each symbol.`,
        r`$n\lambda = d\sin\theta$
- $n$ order of the maximum (0, 1, 2, ...)
- $d$ slit spacing $= 1/(\text{lines per metre})$
- $\theta$ angle from the central (zero-order) maximum`,
    ],
    [
        r`What evidence shows that electrons behave as waves?`,
        r`**Electron diffraction**: a beam of electrons through a thin polycrystalline graphite film forms concentric rings on a screen — a diffraction pattern only waves can produce. Higher accelerating voltage gives smaller rings (shorter $\lambda$).`,
    ],
    [
        r`Core Practical 6 (wavelength using a grating): what do you measure?`,
        r`Shine a laser normally through a grating of known lines per mm onto a screen. Measure the distance $D$ to the screen and the distance $x$ from the central maximum to the $n$th order (measure across both sides and halve).

$\tan\theta = x/D$, then $\lambda = \dfrac{d\sin\theta}{n}$.`,
    ],
]);

// --- WPH12 quantum-physics ---
const quantum = deck("WPH12", "quantum-physics", [
    [
        r`Write the de Broglie equation.`,
        r`$\lambda = \dfrac{h}{p} = \dfrac{h}{mv}$

$h = 6.63 \times 10^{-34}\,\text{J s}$ (Planck constant). Applies to any particle with momentum $p$.`,
    ],
    [
        r`Write the equation for photon energy and define the **electronvolt**.`,
        r`$E = hf = \dfrac{hc}{\lambda}$

1 eV is the energy transferred when an electron moves through a p.d. of 1 V: $1\,\text{eV} = 1.60 \times 10^{-19}\,\text{J}$.`,
    ],
    [
        r`Define **work function** and **threshold frequency**.`,
        r`- Work function $\phi$: the minimum energy needed to release an electron from the surface of a metal.
- Threshold frequency $f_0$: the minimum frequency of radiation that releases electrons, $f_0 = \phi/h$.`,
    ],
    [
        r`Write Einstein's photoelectric equation.`,
        r`$hf = \phi + \tfrac{1}{2}mv_{max}^2$

One photon gives all its energy to one electron; any energy above the work function becomes the electron's maximum kinetic energy.`,
    ],
    [
        r`Why does the photoelectric effect support the **photon** (particle) model of light?`,
        r`- No electrons are emitted below $f_0$, however intense the light.
- Maximum KE depends on frequency, not intensity.
- Emission is instantaneous.

A wave model predicts energy builds up with intensity and time; one-photon-one-electron explains all three.`,
    ],
    [
        r`How do atomic **line spectra** arise? Give the equation for the emitted frequency.`,
        r`Electrons in atoms occupy discrete energy levels. When one drops from level $E_1$ to a lower level $E_2$ it emits a single photon:

$hf = E_1 - E_2$

Only certain energy differences exist, so only certain frequencies (lines) appear. Absorption works in reverse.`,
    ],
]);

// --- WPH12 current-charge ---
const currentCharge = deck("WPH12", "current-charge", [
    [
        r`Define electric current and give its equation.`,
        r`The rate of flow of charge: $I = \dfrac{\Delta Q}{\Delta t}$. Unit: ampere ($1\,\text{A} = 1\,\text{C s}^{-1}$).`,
    ],
    [
        r`Define **potential difference**.`,
        r`The work done (energy transferred) per unit charge between two points: $V = \dfrac{W}{Q}$. Unit: volt ($1\,\text{V} = 1\,\text{J C}^{-1}$).`,
    ],
    [
        r`Write the transport equation $I = nqvA$ and define each symbol.`,
        r`- $n$ number density of charge carriers ($\text{m}^{-3}$)
- $q$ charge on each carrier (C)
- $v$ drift velocity ($\text{m s}^{-1}$)
- $A$ cross-sectional area ($\text{m}^2$)

Metals have huge $n$; semiconductors much smaller $n$ — explaining their very different resistivities.`,
    ],
    [
        r`Which conservation laws explain current and p.d. rules in circuits?`,
        r`- **Charge conservation**: current into a junction = current out; same current everywhere in a series loop.
- **Energy conservation**: around any closed loop, sum of e.m.f.s = sum of p.d.s; parallel branches have the same p.d.`,
    ],
]);

// --- WPH12 resistance-circuits ---
const resistance = deck("WPH12", "resistance-circuits", [
    [
        r`Define resistance and state Ohm's law.`,
        r`Resistance $R = \dfrac{V}{I}$ (unit ohm, $\Omega$).

Ohm's law: for a conductor at constant temperature, current is directly proportional to p.d. ($I \propto V$). It is a special case — not every component obeys it.`,
    ],
    [
        r`Write the equations for combining resistors in series and in parallel.`,
        r`- Series: $R = R_1 + R_2 + \dots$
- Parallel: $\dfrac{1}{R} = \dfrac{1}{R_1} + \dfrac{1}{R_2} + \dots$`,
    ],
    [
        r`Write the equations for electrical power and energy.`,
        r`- $P = VI = I^2R = \dfrac{V^2}{R}$
- $W = VIt$`,
    ],
    [
        r`Write the resistivity equation and define each symbol.`,
        r`$R = \dfrac{\rho l}{A}$
- $\rho$ resistivity ($\Omega\,\text{m}$)
- $l$ length (m)
- $A$ cross-sectional area ($\text{m}^2$)`,
    ],
    [
        r`Describe the $I$–$V$ graphs of a filament bulb and a diode.`,
        r`- **Filament bulb**: S-shaped curve through the origin, gradient decreasing — resistance rises as the filament heats up.
- **Diode**: almost no current in reverse; in forward bias, current rises steeply only above about 0.6 V.`,
    ],
    [
        r`Explain why a metal's resistance rises with temperature but an NTC thermistor's falls.`,
        r`- **Metal**: $n$ is fixed; hotter lattice ions vibrate more, so electrons collide more often — resistance rises.
- **NTC thermistor**: heating releases many more conduction electrons ($n$ rises); this outweighs the extra vibration — resistance falls.`,
    ],
    [
        r`How does an LDR's resistance change with light intensity, and why?`,
        r`Resistance **decreases** as light intensity increases: absorbed photons release more conduction electrons, increasing $n$.`,
    ],
    [
        r`Core Practical 7 (resistivity of a wire): what do you measure and which graph gives $\rho$?`,
        r`Measure diameter at several places with a micrometer (for $A$), then resistance $R$ (ammeter–voltmeter or ohmmeter) for several lengths $l$ using a flying lead. Keep current low to avoid heating.

Plot $R$ against $l$: **gradient** $= \rho/A$, so $\rho = \text{gradient} \times A$.`,
    ],
]);

// --- WPH12 emf-internal-resistance ---
const emf = deck("WPH12", "emf-internal-resistance", [
    [
        r`Define **electromotive force** (e.m.f.).`,
        r`The energy transferred **to** electrical energy per unit charge by a source as charge passes through it: $\varepsilon = \dfrac{W}{Q}$ (unit V).`,
    ],
    [
        r`What is internal resistance, and how is terminal p.d. related to e.m.f.?`,
        r`Resistance inside the source itself, $r$, which wastes energy as the current flows through it ("lost volts" $= Ir$).

$\varepsilon = V + Ir$, so terminal p.d. $V = \varepsilon - Ir$, which is less than $\varepsilon$ whenever current flows.`,
    ],
    [
        r`Write the potential divider equation.`,
        r`$V_{out} = \dfrac{R_2}{R_1 + R_2}\,V_{in}$

where $V_{out}$ is across $R_2$. The p.d. divides in the ratio of the resistances.`,
    ],
    [
        r`A thermistor is in a potential divider. As temperature rises, what happens to the p.d. across it?`,
        r`An NTC thermistor's resistance **falls**, so its share of the supply p.d. **falls**, and the p.d. across the fixed resistor rises. (An LDR behaves the same way as light intensity increases.)`,
    ],
    [
        r`How does the potential vary along a uniform current-carrying wire?`,
        r`It changes **uniformly (linearly)** with distance — p.d. between two points is proportional to the length of wire between them.`,
    ],
    [
        r`Core Practical 8 (e.m.f. and internal resistance): which graph, and how do you read $\varepsilon$ and $r$?`,
        r`Vary an external resistor and record terminal p.d. $V$ and current $I$. Since $V = -rI + \varepsilon$, plot $V$ against $I$:
- $y$-intercept $= \varepsilon$
- gradient $= -r$

Open the switch between readings to stop the cell heating.`,
    ],
]);

// ---------------------------------------------------------------------------------------------------------------
// WPH13 — Practical Skills in Physics I
// ---------------------------------------------------------------------------------------------------------------

// --- WPH13 measurement-uncertainty ---
const measurement = deck("WPH13", "measurement-uncertainty", [
    [
        r`What is the resolution of a Vernier caliper and of a micrometer screw gauge?`,
        r`- Vernier caliper: **0.1 mm**
- Micrometer screw gauge: **0.01 mm**

A metre rule has resolution 1 mm.`,
    ],
    [
        r`How do you estimate the uncertainty in a **single** reading and in **repeated** readings?`,
        r`- Single reading: **half the resolution** of the instrument.
- Repeated readings: **half the range** $= \dfrac{\text{max} - \text{min}}{2}$.`,
    ],
    [
        r`How do you calculate a percentage uncertainty?`,
        r`$\%\ \text{uncertainty} = \dfrac{\text{uncertainty}}{\text{measured value}} \times 100\%$

Use the mean value when readings are repeated.`,
    ],
    [
        r`What is a **zero error**, and how do you deal with it?`,
        r`An instrument gives a non-zero reading when the true value is zero (e.g. a micrometer that does not read 0.00 mm when closed). Check the zero before measuring and subtract the zero reading from every measurement. It is a systematic error.`,
    ],
    [
        r`How many significant figures should a micrometer reading of a wire's diameter have?`,
        r`Recorded to the instrument's resolution, 0.01 mm — e.g. **0.38 mm**, not 0.4 mm or 0.380 mm. Calculated results should use the same number of s.f. as the least precise data (or one more).`,
    ],
]);

// --- WPH13 experimental-design ---
const experimentalDesign = deck("WPH13", "experimental-design", [
    [
        r`Define the **independent**, **dependent** and **control** variables.`,
        r`- Independent: the variable you deliberately change.
- Dependent: the variable you measure.
- Control: variables kept constant so the test is fair.`,
    ],
    [
        r`Distinguish **random** and **systematic** errors, and how each is reduced.`,
        r`- Random: unpredictable scatter about the true value. Reduce by repeating and averaging, and by increasing the measured quantity.
- Systematic: every reading shifted by the same amount or proportion (e.g. zero error). Repeating does not help; recalibrate or correct the readings.`,
    ],
    [
        r`Why take repeat readings, and why use a wide range of values?`,
        r`- Repeats: identify anomalies and reduce the effect of random error by averaging.
- Wide range (at least 6 values, evenly spread): gives a reliable trend and a more accurate gradient.`,
    ],
    [
        r`Give a way to reduce the percentage uncertainty in a timing measurement.`,
        r`Time many oscillations or a longer event (e.g. 20 swings, then divide), or use light gates / a data logger instead of a hand-held stopwatch to remove reaction time.`,
    ],
    [
        r`What should a plan say about health and safety?`,
        r`Name a **specific** hazard of this experiment and a matching precaution — e.g. falling masses: use a sand tray and keep feet clear; heated wire: do not touch, low current; laser: never look into the beam.`,
    ],
]);

// --- WPH13 data-analysis-graphs ---
const dataAnalysis = deck("WPH13", "data-analysis-graphs", [
    [
        r`What makes a good graph scale?`,
        r`- Points cover **at least half** the grid in each direction.
- Easy-to-read scale (1, 2, 5 per division — not 3).
- Axes labelled with quantity and unit, e.g. $t\,/\,\text{s}$.`,
    ],
    [
        r`How should you find the gradient of a best-fit line?`,
        r`Use a **large triangle** — covering more than half the line — and read the coordinates from points on the line (not data points unless they lie on it). Include the unit of the gradient.`,
    ],
    [
        r`What two features show that $y$ is **directly proportional** to $x$?`,
        r`The graph of $y$ against $x$ is a **straight line** that passes **through the origin**.`,
    ],
    [
        r`What should you do with an anomalous point?`,
        r`Identify it (it lies well off the line of best fit), repeat the measurement if possible, and ignore it when drawing the best-fit line.`,
    ],
    [
        r`How do you linearise $y = kx^2$ to find $k$?`,
        r`Plot $y$ against $x^2$. The graph is a straight line through the origin with **gradient** $= k$.

General rule: rearrange into $y = mx + c$ form and identify what goes on each axis.`,
    ],
]);

// ---------------------------------------------------------------------------------------------------------------
// WPH14 — Further Mechanics, Fields and Particles
// ---------------------------------------------------------------------------------------------------------------

// --- WPH14 further-momentum ---
const furtherMomentum = deck("WPH14", "further-momentum", [
    [
        r`Define **impulse** and relate it to momentum.`,
        r`Impulse $= F\Delta t = \Delta p$ (unit N s).

Newton's second law: resultant force = rate of change of momentum, $F = \dfrac{\Delta p}{\Delta t}$. The area under a force–time graph is the impulse.`,
    ],
    [
        r`How do you tell whether a collision is **elastic** or **inelastic**?`,
        r`Compare total kinetic energy before and after.
- Elastic: total KE conserved.
- Inelastic: total KE decreases (transferred to heat, sound, deformation).

Momentum is conserved in **both**.`,
    ],
    [
        r`Write the equation linking kinetic energy and momentum.`,
        r`$E_k = \dfrac{p^2}{2m}$

From $E_k = \tfrac{1}{2}mv^2$ with $v = p/m$.`,
    ],
    [
        r`How is conservation of momentum applied in **two dimensions**?`,
        r`Resolve every momentum into two perpendicular components (e.g. $x$ and $y$). Momentum is conserved **separately** in each direction: $\Sigma p_x$ before = after and $\Sigma p_y$ before = after.`,
    ],
    [
        r`Core Practicals 9 and 10: what is measured in each?`,
        r`- **CP9**: a force sensor/data logger gives a force–time graph; the area (impulse) is compared with $m\Delta v$ from light gates.
- **CP10**: a video of colliding spheres is analysed frame by frame (ICT) to find velocities; check momentum is conserved in $x$ and $y$.`,
    ],
]);

// --- WPH14 circular-motion ---
const circularMotion = deck("WPH14", "circular-motion", [
    [
        r`Define the **radian** and convert $360^\circ$ to radians.`,
        r`One radian is the angle subtended at the centre of a circle by an arc equal in length to the radius ($\theta = s/r$).

$360^\circ = 2\pi\,\text{rad}$, so $1\,\text{rad} \approx 57.3^\circ$.`,
    ],
    [
        r`Define **angular velocity** and give the equations linking it to $v$ and $T$.`,
        r`The rate of change of angular displacement, $\omega = \dfrac{\Delta\theta}{\Delta t}$ ($\text{rad s}^{-1}$).
- $v = \omega r$
- $T = \dfrac{2\pi}{\omega}$, and $\omega = 2\pi f$`,
    ],
    [
        r`Write the equations for centripetal acceleration and centripetal force.`,
        r`- $a = \dfrac{v^2}{r} = r\omega^2$
- $F = \dfrac{mv^2}{r} = mr\omega^2$

Both are directed **towards the centre** of the circle.`,
    ],
    [
        r`An object moves in a circle at constant speed. Why is it accelerating, and what provides the force?`,
        r`Its **direction** keeps changing, so its velocity changes — it accelerates towards the centre. A **resultant** force towards the centre is needed (e.g. tension, friction, gravity, normal contact). Centripetal force is not an extra force.`,
    ],
]);

// --- WPH14 electric-fields ---
const electricFields = deck("WPH14", "electric-fields", [
    [
        r`Define an electric field and electric field strength.`,
        r`An electric field is a region where a charged particle experiences a force.

Field strength $E = \dfrac{F}{Q}$ — force per unit positive charge ($\text{N C}^{-1}$, equivalent to $\text{V m}^{-1}$).`,
    ],
    [
        r`Write Coulomb's law for the force between two point charges.`,
        r`$F = \dfrac{Q_1Q_2}{4\pi\varepsilon_0 r^2}$

$\dfrac{1}{4\pi\varepsilon_0} = 8.99 \times 10^9\,\text{N m}^2\,\text{C}^{-2}$. Inverse-square law; like charges repel.`,
    ],
    [
        r`Give the field strength and potential at distance $r$ from a point charge $Q$.`,
        r`- $E = \dfrac{Q}{4\pi\varepsilon_0 r^2}$ (inverse square)
- $V = \dfrac{Q}{4\pi\varepsilon_0 r}$ (inverse)`,
    ],
    [
        r`Give the field strength between parallel plates and describe the field.`,
        r`$E = \dfrac{V}{d}$ — p.d. divided by plate separation.

The field is **uniform** between the plates: parallel, equally spaced field lines from + to −, with equally spaced equipotentials parallel to the plates.`,
    ],
    [
        r`What are **equipotentials**, and how do they relate to field lines?`,
        r`Lines/surfaces joining points of equal potential. They are always **perpendicular** to field lines, and no work is done moving a charge along one. Field strength = potential gradient: $E = -\dfrac{dV}{dr}$ (closer equipotentials mean stronger field).`,
    ],
]);

// --- WPH14 capacitors ---
const capacitors = deck("WPH14", "capacitors", [
    [
        r`Define capacitance and the farad.`,
        r`$C = \dfrac{Q}{V}$ — charge stored per unit p.d.

1 farad = 1 coulomb per volt.`,
    ],
    [
        r`Write three equations for the energy stored in a capacitor.`,
        r`$W = \tfrac{1}{2}QV = \tfrac{1}{2}CV^2 = \dfrac{Q^2}{2C}$

It is the area under a $V$–$Q$ graph.`,
    ],
    [
        r`What is the **time constant** of an RC circuit and its significance?`,
        r`$\tau = RC$ (seconds). In one time constant a discharging capacitor's charge, current and p.d. fall to $1/e \approx 37\%$ of the starting value. After about $5RC$ it is effectively fully discharged.`,
    ],
    [
        r`Write the discharge equation and its log form.`,
        r`$Q = Q_0e^{-t/RC}$ (same form for $I$ and $V$).

$\ln Q = \ln Q_0 - \dfrac{t}{RC}$ — plot $\ln Q$ (or $\ln V$) against $t$: straight line with gradient $-\dfrac{1}{RC}$.`,
    ],
    [
        r`Core Practical 11 (capacitor discharge): what do you record and plot?`,
        r`Charge the capacitor, then discharge through a known resistor while a data logger or oscilloscope records p.d. $V$ against time $t$.

Plot $\ln V$ against $t$: gradient $= -1/RC$, giving $C$ (or $R$). Alternatively read the time for $V$ to fall to $0.37V_0$.`,
    ],
]);

// --- WPH14 magnetic-fields ---
const magneticFields = deck("WPH14", "magnetic-fields", [
    [
        r`Define magnetic flux and flux linkage.`,
        r`- Flux $\Phi = BA$ (with $B$ perpendicular to area $A$), unit weber (Wb).
- Flux linkage $= N\Phi$ for a coil of $N$ turns (Wb-turns).`,
    ],
    [
        r`Define **magnetic flux density** $B$ and the tesla.`,
        r`$B$ is the force per unit current per unit length on a conductor at right angles to the field: $B = \dfrac{F}{Il}$.

1 T is the flux density giving a force of 1 N on 1 m of wire carrying 1 A perpendicular to the field ($1\,\text{T} = 1\,\text{Wb m}^{-2}$).`,
    ],
    [
        r`Write the force on a current-carrying conductor and on a moving charge in a magnetic field.`,
        r`- Conductor: $F = BIl\sin\theta$
- Moving charge: $F = Bqv\sin\theta$

$\theta$ is the angle between the field and the current / velocity.`,
    ],
    [
        r`State Fleming's left-hand rule.`,
        r`With thumb, first and second fingers of the **left** hand at right angles:
- First finger: **F**ield (N to S)
- seCond finger: **C**urrent (conventional; for an electron, point it opposite to its motion)
- thuMb: **M**otion / force`,
    ],
    [
        r`Why does a charged particle move in a circle in a uniform magnetic field?`,
        r`The force $Bqv$ is always **perpendicular** to the velocity, so it does no work: speed is constant and the force acts as a centripetal force.`,
    ],
]);

// --- WPH14 electromagnetic-induction ---
const induction = deck("WPH14", "electromagnetic-induction", [
    [
        r`State Faraday's law of electromagnetic induction.`,
        r`The magnitude of the induced e.m.f. is directly proportional to the **rate of change of flux linkage**.`,
    ],
    [
        r`State Lenz's law.`,
        r`The direction of the induced e.m.f. (and current) is such that it **opposes the change** that produces it. A consequence of conservation of energy.`,
    ],
    [
        r`Write the equation combining Faraday's and Lenz's laws.`,
        r`$\varepsilon = -\dfrac{d(N\Phi)}{dt}$

The minus sign represents Lenz's law (opposition to the change).`,
    ],
    [
        r`List factors that increase the e.m.f. induced when a magnet moves relative to a coil.`,
        r`- Faster relative motion
- Stronger magnet (greater $B$)
- More turns on the coil
- Larger coil area (or adding an iron core)

All increase the rate of change of flux linkage.`,
    ],
    [
        r`Two coils are linked. When is an e.m.f. induced in the secondary?`,
        r`Only while the current in the primary is **changing** (switching on/off or a.c.), because that changes the flux linking the secondary. A steady d.c. induces no e.m.f.; faster changes induce larger e.m.f.s.`,
    ],
]);

// --- WPH14 particle-physics ---
const particlePhysics = deck("WPH14", "particle-physics", [
    [
        r`What did alpha particle scattering (Rutherford/Geiger–Marsden) show about the atom?`,
        r`- Most alphas pass straight through: atom is mostly **empty space**.
- A few deflect through large angles: the positive charge and most of the mass are concentrated in a tiny, dense **nucleus**.`,
    ],
    [
        r`Derive the radius of a charged particle's path in a magnetic field.`,
        r`$Bqv = \dfrac{mv^2}{r}$, so

$r = \dfrac{mv}{BQ} = \dfrac{p}{BQ}$

Greater momentum gives a larger radius; tracks curving the opposite way show opposite charge.`,
    ],
    [
        r`How do a linac and a cyclotron accelerate particles?`,
        r`- **Linac**: drift tubes on an alternating p.d.; particles accelerate across each gap, and tubes get longer as speed increases.
- **Cyclotron**: an electric field accelerates particles across the gap between two "dees"; a perpendicular magnetic field bends them in growing semicircles.`,
    ],
    [
        r`Why are very high energies needed to probe the structure of nucleons?`,
        r`Probe particles need a de Broglie wavelength smaller than the nucleon ($\sim 10^{-15}\,\text{m}$), requiring very high momentum. High energy is also needed to create new massive particles ($\Delta E = c^2\Delta m$).`,
    ],
    [
        r`Classify baryons, mesons and leptons in the quark–lepton model.`,
        r`- **Baryons**: three quarks (e.g. proton uud, neutron udd).
- **Mesons**: a quark and an antiquark (e.g. pions).
- **Leptons**: fundamental, not made of quarks (e.g. electron, neutrino, muon).`,
    ],
    [
        r`What is always conserved in a particle interaction?`,
        r`**Charge**, **baryon number**, **lepton number**, and energy (including mass-energy) and momentum. If any of charge, baryon number or lepton number is not conserved, the interaction cannot happen.`,
    ],
    [
        r`Convert 1 MeV to joules and 1 MeV/$c^2$ to kilograms.`,
        r`$1\,\text{MeV} = 1.60 \times 10^{-13}\,\text{J}$

$1\,\text{MeV}/c^2 = \dfrac{1.60 \times 10^{-13}}{(3.00 \times 10^8)^2} = 1.78 \times 10^{-30}\,\text{kg}$`,
    ],
    [
        r`How does an antiparticle compare with its particle? What happens when they meet?`,
        r`Same mass; **opposite** charge, baryon number and lepton number.

They annihilate: the mass is converted to energy (usually two photons) by $\Delta E = c^2\Delta m$. Pair production is the reverse.`,
    ],
]);

// ---------------------------------------------------------------------------------------------------------------
// WPH15 — Thermodynamics, Radiation, Oscillations and Cosmology
// ---------------------------------------------------------------------------------------------------------------

// --- WPH15 thermodynamics ---
const thermodynamics = deck("WPH15", "thermodynamics", [
    [
        r`Define **specific heat capacity** and give the equation.`,
        r`The energy needed to raise the temperature of 1 kg of a substance by 1 K.

$\Delta E = mc\Delta\theta$, with $c$ in $\text{J kg}^{-1}\,\text{K}^{-1}$.`,
    ],
    [
        r`Define **specific latent heat** and give the equation.`,
        r`The energy needed to change the state of 1 kg of a substance **without changing its temperature**.

$\Delta E = L\Delta m$, with $L$ in $\text{J kg}^{-1}$ (fusion for melting, vaporisation for boiling).`,
    ],
    [
        r`What is **internal energy**?`,
        r`The sum of the randomly distributed **kinetic** and **potential** energies of the molecules in a system. During a change of state the potential energy changes but mean KE (temperature) does not.`,
    ],
    [
        r`Core Practical 13 (specific latent heat): how is heat loss/gain from the surroundings allowed for?`,
        r`E.g. melting ice with an immersion heater in a funnel: run an identical **control** funnel without the heater, and subtract the mass melted by the surroundings. Then $L = \dfrac{VIt}{\Delta m}$ (or use a joulemeter).`,
    ],
    [
        r`Core Practical 12 (thermistor thermostat): what is calibrated?`,
        r`Put the thermistor in a potential divider in a water bath, record the output p.d. at a range of temperatures (thermometer), and plot output p.d. against temperature. Read off the p.d. corresponding to the switching temperature to set the thermostat.`,
    ],
]);

// --- WPH15 ideal-gases ---
const idealGases = deck("WPH15", "ideal-gases", [
    [
        r`What is **absolute zero**, and how do you convert °C to kelvin?`,
        r`The lowest possible temperature ($0\,\text{K} = -273\,^\circ\text{C}$), where molecules have minimum internal energy (their KE is minimal).

$T/\text{K} = \theta/^\circ\text{C} + 273$`,
    ],
    [
        r`Write the ideal gas equation in terms of the number of molecules.`,
        r`$pV = NkT$
- $N$ number of molecules
- $k = 1.38 \times 10^{-23}\,\text{J K}^{-1}$ (Boltzmann constant)
- $T$ in **kelvin**

Equivalent form: $pV = nRT$ with $n$ moles.`,
    ],
    [
        r`Write the equation linking mean molecular kinetic energy to temperature.`,
        r`$\tfrac{1}{2}m\langle c^2\rangle = \tfrac{3}{2}kT$

The average KE of a molecule is proportional to the absolute temperature. $\langle c^2\rangle$ is the mean square speed.`,
    ],
    [
        r`State Boyle's law.`,
        r`For a fixed mass of gas at constant temperature, pressure is inversely proportional to volume: $pV = \text{constant}$.`,
    ],
    [
        r`Core Practical 14 (Boyle's law): what do you measure and which graph confirms it?`,
        r`Trap air in a sealed tube with a pressure gauge; change pressure with a pump and read the volume (length of air column × area). Wait between readings so the temperature returns to room temperature.

Plot $p$ against $1/V$: straight line through the origin.`,
    ],
]);

// --- WPH15 nuclear-decay ---
const nuclearDecay = deck("WPH15", "nuclear-decay", [
    [
        r`Compare alpha, beta and gamma radiation: nature, ionising ability and what stops them.`,
        r`- **α**: helium nucleus; strongly ionising; stopped by paper / a few cm of air.
- **β⁻**: fast electron; moderately ionising; stopped by a few mm of aluminium.
- **γ**: EM radiation; weakly ionising; reduced by several cm of lead.`,
    ],
    [
        r`What is background radiation, and how is it handled in measurements?`,
        r`Radiation always present from natural and artificial sources (rocks, radon, cosmic rays, medical). Measure the background count rate without the source and **subtract** it from every reading.`,
    ],
    [
        r`What do "**random**" and "**spontaneous**" mean for radioactive decay?`,
        r`- Random: it is impossible to predict which nucleus will decay or when; each has a constant probability per unit time.
- Spontaneous: decay is not affected by external conditions such as temperature or pressure.`,
    ],
    [
        r`Write the radioactive decay equations including activity and half-life.`,
        r`- $A = \lambda N$, $\dfrac{dN}{dt} = -\lambda N$
- $N = N_0e^{-\lambda t}$, $A = A_0e^{-\lambda t}$
- $\lambda = \dfrac{\ln 2}{t_{1/2}}$

Log form: $\ln A = \ln A_0 - \lambda t$ (gradient $-\lambda$).`,
    ],
    [
        r`Write nuclear equations for alpha and beta-minus decay of a nucleus $^A_ZX$.`,
        r`- α: $^A_ZX \to {}^{A-4}_{Z-2}Y + {}^4_2\alpha$
- β⁻: $^A_ZX \to {}^{A}_{Z+1}Y + {}^{\ 0}_{-1}\beta + \bar{\nu}_e$

Nucleon number and proton number balance on both sides.`,
    ],
    [
        r`Core Practical 15 (gamma absorption by lead): what do you measure and plot?`,
        r`Use a GM tube and counter. Measure background count, then count rate for increasing lead thickness $x$ (micrometer), keeping source–tube distance fixed; subtract background.

$C = C_0e^{-\mu x}$, so plot $\ln C$ against $x$: gradient $= -\mu$. Handle the source with tongs.`,
    ],
]);

// --- WPH15 binding-energy ---
const bindingEnergy = deck("WPH15", "binding-energy", [
    [
        r`Define **mass deficit** and **binding energy** of a nucleus.`,
        r`- Mass deficit: total mass of the separate nucleons minus the mass of the nucleus.
- Binding energy: the energy needed to separate a nucleus into its individual nucleons; equals $c^2 \times$ mass deficit.`,
    ],
    [
        r`What is the atomic mass unit, and how much energy is 1 u equivalent to?`,
        r`$1\,\text{u} = 1.66 \times 10^{-27}\,\text{kg}$ (one-twelfth of the mass of a carbon-12 atom).

$E = c^2\Delta m$: 1 u is equivalent to about 931 MeV ($1.49 \times 10^{-10}\,\text{J}$).`,
    ],
    [
        r`Use the binding energy per nucleon curve to explain why fission and fusion release energy.`,
        r`The curve peaks near iron-56 (most stable).
- **Fusion** of light nuclei and **fission** of heavy nuclei both form products with **higher** binding energy per nucleon.
- The increase in total binding energy is released (products have less total mass).`,
    ],
    [
        r`Why does fusion need very high temperature **and** very high density?`,
        r`- High temperature: nuclei need very high kinetic energy to overcome electrostatic repulsion and get close enough for the strong force to act.
- High density: enough collisions per second for a sustained, useful rate of fusion.`,
    ],
]);

// --- WPH15 oscillations ---
const oscillations = deck("WPH15", "oscillations", [
    [
        r`State the condition for simple harmonic motion.`,
        r`The resultant force (acceleration) is **proportional to the displacement** from equilibrium and **directed towards** the equilibrium position:

$F = -kx$, i.e. $a = -\omega^2x$`,
    ],
    [
        r`Write the SHM equations for displacement, velocity and acceleration (starting at maximum displacement).`,
        r`- $x = A\cos\omega t$
- $v = -A\omega\sin\omega t$
- $a = -A\omega^2\cos\omega t$

$\omega = 2\pi f = \dfrac{2\pi}{T}$. Max speed $A\omega$ at equilibrium; max acceleration $A\omega^2$ at the extremes.`,
    ],
    [
        r`Write the period of a mass–spring system and of a simple pendulum.`,
        r`- Mass–spring: $T = 2\pi\sqrt{\dfrac{m}{k}}$
- Simple pendulum: $T = 2\pi\sqrt{\dfrac{l}{g}}$ (small angles)

Both are independent of amplitude.`,
    ],
    [
        r`Distinguish free and forced oscillations, and define **resonance**.`,
        r`- Free: oscillates at its **natural frequency** with no periodic driving force.
- Forced: a periodic driving force makes it oscillate at the **driving** frequency.
- Resonance: amplitude becomes maximum when the driving frequency equals the natural frequency.`,
    ],
    [
        r`How does damping affect a resonance curve (amplitude vs driving frequency)?`,
        r`More damping:
- **lowers** the peak amplitude
- **broadens** the peak
- shifts the peak slightly to a **lower** frequency

Damping (and plastic deformation of ductile materials) removes energy from the oscillator.`,
    ],
    [
        r`Describe the energy changes in an undamped SHM oscillator.`,
        r`Energy continually transfers between kinetic (max at equilibrium) and potential (max at the extremes); the **total** stays constant. With damping, total energy and amplitude decrease over time.`,
    ],
    [
        r`Core Practical 16 (unknown mass from resonance): what is measured and plotted?`,
        r`Masses on a spring (or loaded beam) are driven by a vibration generator; find the resonant frequency for several known masses $m$.

Since $f = \dfrac{1}{2\pi}\sqrt{\dfrac{k}{m}}$, plot $1/f^2$ against $m$ (a straight line), then read off the unknown mass from its measured resonant frequency.`,
    ],
]);

// --- WPH15 gravitational-fields ---
const gravitationalFields = deck("WPH15", "gravitational-fields", [
    [
        r`Define a gravitational field and gravitational field strength.`,
        r`A region where a **mass** experiences a force.

$g = \dfrac{F}{m}$ — force per unit mass ($\text{N kg}^{-1}$).`,
    ],
    [
        r`State Newton's law of universal gravitation.`,
        r`$F = \dfrac{Gm_1m_2}{r^2}$

The attractive force between two point masses is proportional to the product of their masses and inversely proportional to the square of their separation. $G = 6.67 \times 10^{-11}\,\text{N m}^2\,\text{kg}^{-2}$.`,
    ],
    [
        r`Give $g$ and gravitational potential $V_{grav}$ at distance $r$ from a point mass $M$.`,
        r`- $g = \dfrac{GM}{r^2}$
- $V_{grav} = -\dfrac{GM}{r}$

Potential is negative: zero at infinity, and work must be done to move a mass away.`,
    ],
    [
        r`Derive the orbital period of a satellite in a circular orbit of radius $r$.`,
        r`Gravity provides the centripetal force: $\dfrac{GMm}{r^2} = \dfrac{mv^2}{r}$, with $v = \dfrac{2\pi r}{T}$.

$T^2 = \dfrac{4\pi^2}{GM}r^3$ — independent of the satellite's mass. A geostationary orbit has $T = 24\,\text{h}$.`,
    ],
    [
        r`Compare gravitational and electric fields.`,
        r`- **Similar**: both inverse-square ($F \propto 1/r^2$), potential $\propto 1/r$, radial field lines around a point source.
- **Different**: gravity acts on mass and is **always attractive**; electric forces act on charge and can attract or repel. Gravity is far weaker.`,
    ],
]);

// --- WPH15 astrophysics-cosmology ---
const astrophysics = deck("WPH15", "astrophysics-cosmology", [
    [
        r`What is a **black body**? State Wien's law.`,
        r`An ideal object that absorbs all radiation falling on it and emits a continuous spectrum depending only on its temperature.

$\lambda_{max}T = 2.898 \times 10^{-3}\,\text{m K}$ — hotter bodies peak at shorter wavelengths.`,
    ],
    [
        r`Write the Stefan–Boltzmann law and the intensity–luminosity equation.`,
        r`- $L = \sigma AT^4$, with $A = 4\pi r^2$ for a star and $\sigma = 5.67 \times 10^{-8}\,\text{W m}^{-2}\,\text{K}^{-4}$
- $I = \dfrac{L}{4\pi d^2}$ — intensity at distance $d$`,
    ],
    [
        r`How does trigonometric parallax measure a star's distance?`,
        r`Observe the star against distant background stars six months apart (baseline = diameter of Earth's orbit). Measure the parallax angle $\theta$ (half the apparent shift): $d = \dfrac{r}{\tan\theta}$, with $r = 1\,\text{AU}$. Only works for relatively near stars.`,
    ],
    [
        r`What is a **standard candle**, and how is it used to find distance?`,
        r`An object of known luminosity $L$ (e.g. Cepheid variable, type Ia supernova). Measure intensity $I$ received, then $d = \sqrt{\dfrac{L}{4\pi I}}$.`,
    ],
    [
        r`Describe the axes and main regions of a Hertzsprung–Russell diagram.`,
        r`Luminosity (vertical, log scale) against surface temperature (horizontal, **decreasing** to the right).
- Main sequence: diagonal band top-left to bottom-right (hydrogen fusion).
- Red giants / supergiants: top right.
- White dwarfs: bottom left.`,
    ],
    [
        r`Write the redshift equations and Hubble's law.`,
        r`$z = \dfrac{\Delta\lambda}{\lambda} \approx \dfrac{\Delta f}{f} \approx \dfrac{v}{c}$ (for $v \ll c$)

Hubble's law: $v = H_0d$. Age of the universe $\approx 1/H_0$.`,
    ],
    [
        r`Why are the age and fate of the universe uncertain?`,
        r`- $H_0$ is hard to measure accurately (distances to far galaxies are uncertain), so the age $\approx 1/H_0$ is uncertain.
- The fate depends on the universe's mean density compared with a critical density, and **dark matter** (detected only by its gravity) makes the density hard to determine.`,
    ],
]);

// ---------------------------------------------------------------------------------------------------------------
// WPH16 — Practical Skills in Physics II
// ---------------------------------------------------------------------------------------------------------------

// --- WPH16 advanced-uncertainty ---
const advancedUncertainty = deck("WPH16", "advanced-uncertainty", [
    [
        r`Define **precision**, **accuracy** and **sensitivity**.`,
        r`- Precision: how close repeated readings are to each other (little spread).
- Accuracy: how close a result is to the true value.
- Sensitivity: change in instrument output per unit change in the input quantity.`,
    ],
    [
        r`How do percentage uncertainties combine when quantities are **multiplied or divided**?`,
        r`**Add** the percentage uncertainties.

E.g. $\rho = RA/l$: $\%\rho = \%R + \%A + \%l$.`,
    ],
    [
        r`How does a percentage uncertainty combine when a quantity is **raised to a power**?`,
        r`**Multiply** the percentage uncertainty by the power.

E.g. $A = \pi d^2/4$: $\%A = 2 \times \%d$. A square root halves it.`,
    ],
    [
        r`How do uncertainties combine when quantities are **added or subtracted**?`,
        r`**Add the absolute uncertainties** (not the percentages).

E.g. extension $= (52.0 \pm 0.1) - (50.0 \pm 0.1)\,\text{cm} = 2.0 \pm 0.2\,\text{cm}$ — a 10% uncertainty.`,
    ],
    [
        r`How do you decide whether an experimental value agrees with an accepted value?`,
        r`Calculate the range given by the value ± its uncertainty. If the accepted value lies inside the range, they agree. Alternatively, find the percentage difference and compare it with the percentage uncertainty.`,
    ],
]);

// --- WPH16 logarithmic-graphs ---
const logGraphs = deck("WPH16", "logarithmic-graphs", [
    [
        r`How do you test $y = Ae^{kx}$ with a graph, and read $A$ and $k$?`,
        r`Take logs: $\ln y = kx + \ln A$.

Plot $\ln y$ against $x$: a straight line shows the relationship is exponential.
- Gradient $= k$
- $y$-intercept $= \ln A$, so $A = e^{\text{intercept}}$`,
    ],
    [
        r`How do you test $y = Ax^n$ with a graph, and read $A$ and $n$?`,
        r`Take logs: $\ln y = n\ln x + \ln A$.

Plot $\ln y$ against $\ln x$: a straight line shows a power law.
- Gradient $= n$
- $y$-intercept $= \ln A$`,
    ],
    [
        r`What unit does $\ln y$ have when plotted on an axis?`,
        r`None — logarithms have no unit. Label the axis like $\ln(V/\text{V})$ to show the unit of the quantity inside the log.`,
    ],
    [
        r`How many significant figures should you give for $\ln$ values in a table?`,
        r`The same number of **decimal places** as the significant figures in the raw data — e.g. $V = 3.45\,\text{V}$ (3 s.f.) gives $\ln V = 1.238$ (3 d.p.).`,
    ],
    [
        r`Why is linearising data with logs useful when testing a relationship?`,
        r`A straight line is easy to recognise and test, unlike a curve. Its gradient and intercept give the constants directly, and a best-fit line averages out random error across all points.`,
    ],
]);

// --- WPH16 core-practicals ---
const corePracticals = deck("WPH16", "core-practicals", [
    [
        r`CP9 (force and change of momentum): how is impulse found from the data?`,
        r`A force sensor and data logger record force against time during the impact. The **area under the $F$–$t$ graph** gives the impulse, which is compared with $m(v - u)$ measured using light gates.`,
    ],
    [
        r`CP11: why is $\ln V$ against $t$ plotted for a discharging capacitor, and what is the gradient?`,
        r`$V = V_0e^{-t/RC}$ gives $\ln V = \ln V_0 - t/RC$, a straight line.

Gradient $= -\dfrac{1}{RC}$, so $C = -\dfrac{1}{R \times \text{gradient}}$.`,
    ],
    [
        r`CP14: why must you wait between readings when compressing a gas to test Boyle's law?`,
        r`Compressing the gas does work on it and warms it. Waiting lets it return to room temperature, keeping temperature **constant** — a condition of Boyle's law.`,
    ],
    [
        r`CP15: give two safety precautions when using a radioactive source.`,
        r`- Handle with long tongs; never point at people.
- Minimise exposure time; keep a large distance; return the source to its lead-lined box straight after use.`,
    ],
    [
        r`CP13: how can the uncertainty in the measured specific latent heat be reduced?`,
        r`Use a control to account for energy from/to the surroundings, insulate the apparatus, use a joulemeter (or measure $V$, $I$, $t$ carefully), and melt/boil a larger mass so its percentage uncertainty is smaller.`,
    ],
    [
        r`CP16: why plot $1/f^2$ against $m$ rather than $f$ against $m$?`,
        r`$f = \dfrac{1}{2\pi}\sqrt{\dfrac{k}{m}}$ gives $\dfrac{1}{f^2} = \dfrac{4\pi^2}{k}m$, a straight line through the origin. The unknown mass can then be read from the line, and $k = 4\pi^2/\text{gradient}$.`,
    ],
]);

export const physicsFlashcards: SeedFlashcard[] = [
    ...motion,
    ...forces,
    ...momentum,
    ...workEnergyPower,
    ...fluids,
    ...solidMaterials,
    ...progressiveWaves,
    ...superposition,
    ...refraction,
    ...diffraction,
    ...quantum,
    ...currentCharge,
    ...resistance,
    ...emf,
    ...measurement,
    ...experimentalDesign,
    ...dataAnalysis,
    ...furtherMomentum,
    ...circularMotion,
    ...electricFields,
    ...capacitors,
    ...magneticFields,
    ...induction,
    ...particlePhysics,
    ...thermodynamics,
    ...idealGases,
    ...nuclearDecay,
    ...bindingEnergy,
    ...oscillations,
    ...gravitationalFields,
    ...astrophysics,
    ...advancedUncertainty,
    ...logGraphs,
    ...corePracticals,
];
