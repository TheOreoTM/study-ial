import type { SeedQuestion } from "../types";

// Original IAL-style Physics practice questions (written for this app, not taken from Pearson papers).
// Constants follow the IAL data sheet: g = 9.81 m s^-2, e = 1.60e-19 C, m_e = 9.11e-31 kg, h = 6.63e-34 J s,
// c = 3.00e8 m s^-1, k = 1.38e-23 J K^-1, R = 8.31 J K^-1 mol^-1, N_A = 6.02e23, G = 6.67e-11, sigma = 5.67e-8,
// u = 1.66e-27 kg, 1/(4 pi eps0) = 8.99e9.

// String.raw keeps LaTeX backslashes intact (e.g. \text, \times) inside template literals.
const r = String.raw;

type Label = "A" | "B" | "C" | "D";
function opts(a: string, b: string, c: string, d: string, correct: Label): NonNullable<SeedQuestion["options"]> {
    return (
        [
            ["A", a],
            ["B", b],
            ["C", c],
            ["D", d],
        ] as const
    ).map(([label, text]) => ({ label, text, isCorrect: label === correct }));
}

// ---------------------------------------------------------------------------------------------------------------
// WPH11 — Mechanics and Materials
// ---------------------------------------------------------------------------------------------------------------
const wph11: SeedQuestion[] = [
    // --- motion ---
    {
        seedKey: "phy-wph11-motion-001",
        unitCode: "WPH11",
        topicSlug: "motion",
        type: "MCQ",
        difficulty: "EASY",
        marks: 1,
        stem: r`Which quantity is represented by the **gradient** of a velocity–time graph?`,
        options: opts("displacement", "acceleration", "resultant force", "speed", "B"),
        markScheme: r`- **B** (1) — gradient = change in velocity ÷ time = acceleration.`,
        explanation: r`The gradient of a $v$–$t$ graph is $\Delta v/\Delta t$, which is acceleration. The **area** under the graph gives displacement — a common mix-up.`,
    },
    {
        seedKey: "phy-wph11-motion-002",
        unitCode: "WPH11",
        topicSlug: "motion",
        type: "CALCULATION",
        difficulty: "MEDIUM",
        marks: 3,
        stem: r`A stone is thrown vertically **upwards** at $14.0\,\text{m s}^{-1}$ from the edge of a cliff. The point of release is $25.0\,\text{m}$ above the sea. Air resistance is negligible.

Calculate the time taken for the stone to reach the sea. Give your answer to 2 significant figures.`,
        markScheme: r`- Uses $s = ut + \tfrac{1}{2}at^2$ with a consistent sign convention, e.g. $-25.0 = 14.0t - 4.905t^2$ (1)
- Rearranges to $4.905t^2 - 14.0t - 25.0 = 0$ and solves the quadratic (1)
- $t = 4.1\,\text{s}$ (1)`,
        explanation: r`Treat the whole flight as one uniformly accelerated motion: up is positive, so the displacement to the sea is $-25.0\,\text{m}$ and $a = -9.81\,\text{m s}^{-2}$. Splitting into "up" and "down" stages also works but takes longer.`,
    },
    {
        seedKey: "phy-wph11-motion-003",
        unitCode: "WPH11",
        topicSlug: "motion",
        type: "CALCULATION",
        difficulty: "HARD",
        marks: 5,
        stem: r`A football is kicked from level ground with a velocity of $18.0\,\text{m s}^{-1}$ at $35^\circ$ above the horizontal. Air resistance is negligible.

(a) Calculate the maximum height reached by the ball.

(b) Calculate the horizontal distance travelled by the ball before it lands.`,
        markScheme: r`- Vertical component $u_v = 18.0\sin 35^\circ = 10.3\,\text{m s}^{-1}$ and horizontal component $u_h = 18.0\cos 35^\circ = 14.7\,\text{m s}^{-1}$ (1)
- Uses $v^2 = u^2 + 2as$ with $v = 0$ at the top: $h = \dfrac{10.3^2}{2 \times 9.81}$ (1)
- $h = 5.4\,\text{m}$ (1)
- Time of flight $t = \dfrac{2 \times 10.3}{9.81} = 2.10\,\text{s}$ (1)
- Range $= 14.7 \times 2.10 = 31\,\text{m}$ (1)`,
        explanation: r`Horizontal and vertical motions are independent: the vertical motion decides the time of flight, and the horizontal velocity stays constant throughout.`,
    },
    {
        seedKey: "phy-wph11-motion-004",
        unitCode: "WPH11",
        topicSlug: "motion",
        type: "SHORT",
        difficulty: "EASY",
        marks: 3,
        stem: r`(a) State the difference between a scalar quantity and a vector quantity.

(b) A runner completes exactly one lap of a 400 m circular track in 80 s. State the runner's average speed and average velocity for the lap, and explain why they differ.`,
        markScheme: r`- A scalar has magnitude only; a vector has magnitude and direction (1)
- Average speed $= 400/80 = 5.0\,\text{m s}^{-1}$ (1)
- Average velocity $= 0$ because the displacement after one full lap is zero (1)`,
        explanation: r`Average speed uses total distance; average velocity uses displacement. Finishing where you started means zero displacement, so zero average velocity.`,
    },

    // --- forces ---
    {
        seedKey: "phy-wph11-forces-001",
        unitCode: "WPH11",
        topicSlug: "forces",
        type: "MCQ",
        difficulty: "MEDIUM",
        marks: 1,
        stem: r`A book rests on a horizontal table. According to Newton's third law, which force forms a pair with the **weight of the book**?`,
        options: opts(
            "the normal contact force of the table on the book",
            "the normal contact force of the book on the table",
            "the gravitational force of the book on the Earth",
            "the weight of the table",
            "C",
        ),
        markScheme: r`- **C** (1) — the weight is the Earth pulling the book, so its pair is the book pulling the Earth (same type of force, opposite objects).`,
        explanation: r`Newton's third-law pairs act on **different** objects and are the **same type** of force. The table's push on the book is equal and opposite to the weight only because the book is in equilibrium (Newton's first law) — it is not a third-law pair.`,
    },
    {
        seedKey: "phy-wph11-forces-002",
        unitCode: "WPH11",
        topicSlug: "forces",
        type: "CALCULATION",
        difficulty: "HARD",
        marks: 4,
        stem: r`A uniform plank AC is $3.0\,\text{m}$ long and has a weight of $120\,\text{N}$. It rests horizontally on two supports: one at end A and one at point B, which is $2.0\,\text{m}$ from A. A load of weight $200\,\text{N}$ is placed at end C.

(a) Calculate the force exerted on the plank by the support at B.

(b) Determine the force exerted on the plank by the support at A, and comment on its direction.`,
        markScheme: r`- Takes moments about A: $120 \times 1.5 + 200 \times 3.0 = F_B \times 2.0$ (1)
- $F_B = 390\,\text{N}$ (upwards) (1)
- Resolves vertically: $F_A + 390 = 120 + 200$, so $F_A = -70\,\text{N}$ (1)
- The force at A is $70\,\text{N}$ **downwards**, i.e. the plank must be held/pinned down at A or it would tip about B (1)`,
        explanation: r`Taking moments about one support removes that unknown force. A negative answer means the force acts in the opposite direction to the one assumed — here the plank would tip about B unless A holds it down.`,
    },
    {
        seedKey: "phy-wph11-forces-003",
        unitCode: "WPH11",
        topicSlug: "forces",
        type: "CALCULATION",
        difficulty: "MEDIUM",
        marks: 3,
        stem: r`A box of mass $5.0\,\text{kg}$ is released on a ramp inclined at $30^\circ$ to the horizontal. A constant frictional force of $12\,\text{N}$ acts up the slope.

Calculate the acceleration of the box down the slope.`,
        markScheme: r`- Component of weight down the slope $= 5.0 \times 9.81 \times \sin 30^\circ = 24.5\,\text{N}$ (1)
- Resultant force $= 24.5 - 12 = 12.5\,\text{N}$ (1)
- $a = F/m = 12.5/5.0 = 2.5\,\text{m s}^{-2}$ (1)`,
        explanation: r`Only the component of weight parallel to the slope ($mg\sin\theta$) drives the motion; the perpendicular component is balanced by the normal contact force.`,
    },
    {
        seedKey: "phy-wph11-forces-004",
        unitCode: "WPH11",
        topicSlug: "forces",
        type: "LONG",
        difficulty: "HARD",
        marks: 6,
        stem: r`A skydiver jumps from a hovering helicopter. Some time later she opens her parachute and eventually lands.

Describe and explain how the forces on the skydiver, and hence her velocity, change from the moment she jumps until just before she lands. You may refer to a velocity–time sketch in words.`,
        markScheme: r`Indicative content:
- At the start air resistance is zero, so the resultant force equals her weight and acceleration is $g$ (1)
- As speed increases, air resistance (drag) increases, so the resultant force and acceleration decrease (1)
- When drag equals weight the resultant force is zero and she travels at (first) terminal velocity (1)
- Opening the parachute greatly increases the surface area, so drag becomes greater than weight (1)
- The resultant force is upwards, so she decelerates; as speed falls, drag falls (1)
- Drag again equals weight at a new, lower terminal velocity, which is maintained until landing (1)

Award 1 mark per relevant point, max 6.`,
        explanation: r`The key idea is that drag depends on speed: the resultant force (weight − drag) shrinks to zero as speed rises, giving terminal velocity. Opening the parachute does not make her move upwards — it makes her decelerate.`,
    },

    // --- momentum ---
    {
        seedKey: "phy-wph11-momentum-001",
        unitCode: "WPH11",
        topicSlug: "momentum",
        type: "MCQ",
        difficulty: "EASY",
        marks: 1,
        stem: r`Which of the following is a correct unit for momentum?`,
        options: opts(r`$\text{kg m s}^{-2}$`, r`$\text{N s}$`, r`$\text{J s}$`, r`$\text{N s}^{-1}$`, "B"),
        markScheme: r`- **B** (1) — $\text{kg m s}^{-1} = (\text{kg m s}^{-2})\,\text{s} = \text{N s}$.`,
        explanation: r`Momentum is $mv$ with unit $\text{kg m s}^{-1}$. Since $1\,\text{N} = 1\,\text{kg m s}^{-2}$, this equals $\text{N s}$ — the same unit as impulse ($F\Delta t$).`,
    },
    {
        seedKey: "phy-wph11-momentum-002",
        unitCode: "WPH11",
        topicSlug: "momentum",
        type: "CALCULATION",
        difficulty: "MEDIUM",
        marks: 4,
        stem: r`A trolley of mass $0.80\,\text{kg}$ moving at $1.5\,\text{m s}^{-1}$ collides with a stationary trolley of mass $1.2\,\text{kg}$. The trolleys stick together.

(a) Calculate the velocity of the trolleys immediately after the collision.

(b) Calculate the kinetic energy lost in the collision.`,
        markScheme: r`- Momentum before $= 0.80 \times 1.5 = 1.2\,\text{kg m s}^{-1}$ (1)
- $v = 1.2/2.0 = 0.60\,\text{m s}^{-1}$ (1)
- KE before $= \tfrac{1}{2}(0.80)(1.5)^2 = 0.90\,\text{J}$ and KE after $= \tfrac{1}{2}(2.0)(0.60)^2 = 0.36\,\text{J}$ (1)
- KE lost $= 0.54\,\text{J}$ (1)`,
        explanation: r`Momentum is always conserved in a collision with no external forces, but kinetic energy is not when the objects stick together — the "lost" energy becomes thermal energy and sound.`,
    },
    {
        seedKey: "phy-wph11-momentum-003",
        unitCode: "WPH11",
        topicSlug: "momentum",
        type: "CALCULATION",
        difficulty: "MEDIUM",
        marks: 3,
        stem: r`A tennis ball of mass $0.057\,\text{kg}$ hits a wall horizontally at $22\,\text{m s}^{-1}$ and rebounds along the same line at $18\,\text{m s}^{-1}$. The ball is in contact with the wall for $0.015\,\text{s}$.

Calculate the average force exerted on the ball by the wall.`,
        markScheme: r`- Change in velocity $= 18 - (-22) = 40\,\text{m s}^{-1}$ (direction reverses) (1)
- Change in momentum $= 0.057 \times 40 = 2.28\,\text{kg m s}^{-1}$ (1)
- $F = \Delta p/\Delta t = 2.28/0.015 = 150\,\text{N}$ (152 N) (1)`,
        explanation: r`Velocity is a vector, so a rebound reverses the sign: the change in velocity is $18 + 22$, not $22 - 18$. Forgetting this is the most common error.`,
    },

    // --- work-energy-power ---
    {
        seedKey: "phy-wph11-work-energy-power-001",
        unitCode: "WPH11",
        topicSlug: "work-energy-power",
        type: "MCQ",
        difficulty: "MEDIUM",
        marks: 1,
        stem: r`An electric motor lifts a $50\,\text{kg}$ load vertically through $6.0\,\text{m}$ at constant speed in $12\,\text{s}$. The electrical power input to the motor is $400\,\text{W}$.

What is the efficiency of the motor?`,
        options: opts("6%", "61%", "75%", "163%", "B"),
        markScheme: r`- **B** (1) — useful power $= mgh/t = 50 \times 9.81 \times 6.0/12 = 245\,\text{W}$; $245/400 = 0.61$.`,
        explanation: r`Efficiency = useful power out ÷ total power in. Option A comes from forgetting $g$ (using mass instead of weight); D is the ratio upside down — an efficiency can never exceed 100%.`,
    },
    {
        seedKey: "phy-wph11-work-energy-power-002",
        unitCode: "WPH11",
        topicSlug: "work-energy-power",
        type: "CALCULATION",
        difficulty: "MEDIUM",
        marks: 4,
        stem: r`A child on a sledge (total mass $15\,\text{kg}$) starts from rest and slides down a snowy slope. The bottom of the slope is $8.0\,\text{m}$ vertically below the start, and the length of the slope is $24\,\text{m}$. At the bottom the speed is $9.5\,\text{m s}^{-1}$.

(a) Calculate the energy dissipated by resistive forces during the descent.

(b) Calculate the average resistive force acting on the sledge.`,
        markScheme: r`- Loss of GPE $= mgh = 15 \times 9.81 \times 8.0 = 1180\,\text{J}$ (1177 J) (1)
- Gain in KE $= \tfrac{1}{2} \times 15 \times 9.5^2 = 677\,\text{J}$ (1)
- Energy dissipated $= 1177 - 677 = 500\,\text{J}$ (1)
- Average resistive force $= 500/24 = 21\,\text{N}$ (1)`,
        explanation: r`Work done against resistive forces = force × distance moved **along the slope** (24 m), not the vertical drop.`,
    },
    {
        seedKey: "phy-wph11-work-energy-power-003",
        unitCode: "WPH11",
        topicSlug: "work-energy-power",
        type: "CALCULATION",
        difficulty: "EASY",
        marks: 2,
        stem: r`A car travels along a level road at a constant speed of $25\,\text{m s}^{-1}$. The total resistive force on the car is $650\,\text{N}$.

Calculate the useful power output of the car's engine.`,
        markScheme: r`- At constant speed, driving force = resistive force $= 650\,\text{N}$, and uses $P = Fv$ (1)
- $P = 650 \times 25 = 16\,000\,\text{W}$ ($16\,\text{kW}$) (1)`,
        explanation: r`At constant velocity the resultant force is zero, so the engine's driving force exactly balances the resistive forces. Power is then $P = Fv$.`,
    },

    // --- fluids ---
    {
        seedKey: "phy-wph11-fluids-001",
        unitCode: "WPH11",
        topicSlug: "fluids",
        type: "MCQ",
        difficulty: "EASY",
        marks: 1,
        stem: r`Stokes' law, $F = 6\pi\eta r v$, can be used to calculate the viscous drag on an object only if the object is`,
        options: opts(
            "a small sphere moving slowly with laminar flow around it",
            "a small sphere moving at high speed with turbulent flow around it",
            "any shape moving at terminal velocity",
            "a large sphere floating at the surface of the fluid",
            "A",
        ),
        markScheme: r`- **A** (1) — Stokes' law applies to small spheres at low speed with laminar (streamline) flow.`,
        explanation: r`Stokes' law assumes a sphere and laminar flow. At high speeds the flow becomes turbulent and the drag is much larger than the formula predicts.`,
    },
    {
        seedKey: "phy-wph11-fluids-002",
        unitCode: "WPH11",
        topicSlug: "fluids",
        type: "CALCULATION",
        difficulty: "HARD",
        marks: 5,
        stem: r`A steel ball bearing of radius $1.5\,\text{mm}$ falls through glycerol and reaches terminal velocity.

| Quantity | Value |
| --- | --- |
| density of steel | $7800\,\text{kg m}^{-3}$ |
| density of glycerol | $1260\,\text{kg m}^{-3}$ |
| viscosity of glycerol | $1.4\,\text{Pa s}$ |

Calculate the terminal velocity of the ball bearing.`,
        markScheme: r`- Volume $V = \tfrac{4}{3}\pi r^3 = 1.41 \times 10^{-8}\,\text{m}^3$ (1)
- Weight $= \rho_\text{steel} V g = 1.08 \times 10^{-3}\,\text{N}$ and upthrust $= \rho_\text{glycerol} V g = 1.75 \times 10^{-4}\,\text{N}$ (1)
- At terminal velocity: weight = upthrust + viscous drag (1)
- $6\pi\eta r v = 1.08 \times 10^{-3} - 1.75 \times 10^{-4}$, so $v = \dfrac{9.07 \times 10^{-4}}{6\pi \times 1.4 \times 1.5 \times 10^{-3}}$ (1)
- $v = 0.023\,\text{m s}^{-1}$ (1)`,
        explanation: r`At terminal velocity the resultant force is zero, so $W = U + F_\text{drag}$. Forgetting upthrust gives an answer about 20% too large here.`,
    },
    {
        seedKey: "phy-wph11-fluids-003",
        unitCode: "WPH11",
        topicSlug: "fluids",
        type: "SHORT",
        difficulty: "MEDIUM",
        marks: 3,
        stem: r`(a) Describe the difference between **laminar** flow and **turbulent** flow.

(b) Engine oil is much easier to pour when it is hot. State how the viscosity of a liquid changes with temperature.`,
        markScheme: r`- Laminar flow: layers of fluid move smoothly past each other with no mixing; the velocity at any point is constant (1)
- Turbulent flow: the fluid mixes, forming eddies; velocity at a point changes in magnitude and direction (1)
- The viscosity of a liquid decreases as its temperature increases (1)`,
        explanation: r`In laminar flow, streamlines never cross. Most liquids become less viscous when heated because the molecules have more energy to overcome intermolecular attractions.`,
    },
    {
        seedKey: "phy-wph11-fluids-004",
        unitCode: "WPH11",
        topicSlug: "fluids",
        type: "MCQ",
        difficulty: "EASY",
        marks: 1,
        stem: r`An object of volume $0.020\,\text{m}^3$ is fully submerged in sea water of density $1030\,\text{kg m}^{-3}$.

What is the upthrust on the object?`,
        options: opts(r`$20.6\,\text{N}$`, r`$202\,\text{N}$`, r`$515\,\text{N}$`, r`$5.05 \times 10^{5}\,\text{N}$`, "B"),
        markScheme: r`- **B** (1) — upthrust = weight of fluid displaced $= V\rho g = 0.020 \times 1030 \times 9.81 = 202\,\text{N}$.`,
        explanation: r`Archimedes' principle: upthrust equals the weight of fluid displaced. Option A forgets $g$; D divides by the volume instead of multiplying.`,
    },

    // --- solid-materials ---
    {
        seedKey: "phy-wph11-solid-materials-001",
        unitCode: "WPH11",
        topicSlug: "solid-materials",
        type: "MCQ",
        difficulty: "MEDIUM",
        marks: 1,
        stem: r`Wires X and Y are made of the same metal. Wire Y is twice as long as wire X and has twice the diameter. The same tension is applied to each wire (both below the limit of proportionality).

What is $\dfrac{\text{extension of Y}}{\text{extension of X}}$?`,
        options: opts("0.5", "1", "2", "4", "A"),
        markScheme: r`- **A** (1) — $\Delta x = FL/(AE)$; $L$ doubles and $A$ quadruples, so $\Delta x$ halves.`,
        explanation: r`Doubling the diameter multiplies the cross-sectional area by 4, not 2. Combining with doubled length gives $2/4 = 0.5$.`,
    },
    {
        seedKey: "phy-wph11-solid-materials-002",
        unitCode: "WPH11",
        topicSlug: "solid-materials",
        type: "CALCULATION",
        difficulty: "MEDIUM",
        marks: 4,
        stem: r`A steel wire of original length $2.50\,\text{m}$ and diameter $0.50\,\text{mm}$ hangs vertically. When a load of $40\,\text{N}$ is attached, the wire extends by $2.4\,\text{mm}$.

Calculate the Young modulus of the steel.`,
        markScheme: r`- Cross-sectional area $A = \pi (0.25 \times 10^{-3})^2 = 1.96 \times 10^{-7}\,\text{m}^2$ (1)
- Stress $= 40/1.96 \times 10^{-7} = 2.04 \times 10^{8}\,\text{Pa}$ (1)
- Strain $= 2.4 \times 10^{-3}/2.50 = 9.6 \times 10^{-4}$ (1)
- $E = \text{stress}/\text{strain} = 2.1 \times 10^{11}\,\text{Pa}$ (1)`,
        explanation: r`Use the **radius** ($0.25\,\text{mm}$) in $\pi r^2$ and convert mm to m before calculating. Strain has no unit, so $E$ has the same unit as stress.`,
    },
    {
        seedKey: "phy-wph11-solid-materials-003",
        unitCode: "WPH11",
        topicSlug: "solid-materials",
        type: "MCQ",
        difficulty: "EASY",
        marks: 1,
        stem: r`A spring obeys Hooke's law. A force of $18\,\text{N}$ extends it by $6.0\,\text{cm}$.

How much elastic strain energy is stored in the spring?`,
        options: opts(r`$0.54\,\text{J}$`, r`$1.08\,\text{J}$`, r`$54\,\text{J}$`, r`$108\,\text{J}$`, "A"),
        markScheme: r`- **A** (1) — $E = \tfrac{1}{2}F\Delta x = \tfrac{1}{2} \times 18 \times 0.060 = 0.54\,\text{J}$.`,
        explanation: r`The energy stored is the **area** under the force–extension graph, a triangle, so the factor of ½ is needed (B omits it). C and D come from leaving the extension in cm.`,
    },
    {
        seedKey: "phy-wph11-solid-materials-004",
        unitCode: "WPH11",
        topicSlug: "solid-materials",
        type: "SHORT",
        difficulty: "EASY",
        marks: 3,
        stem: r`Explain what is meant by each of the following terms for a material under tension.

(a) elastic deformation

(b) plastic deformation

(c) brittle`,
        markScheme: r`- Elastic deformation: the material returns to its original shape/length when the force is removed (1)
- Plastic deformation: the material does not return to its original shape; it is permanently deformed when the force is removed (1)
- Brittle: the material breaks with little or no plastic deformation (1)`,
        explanation: r`The elastic limit separates elastic from plastic behaviour. Brittle materials such as glass fracture suddenly, whereas ductile materials such as copper can be drawn into wires.`,
    },
];

// ---------------------------------------------------------------------------------------------------------------
// WPH12 — Waves and Electricity
// ---------------------------------------------------------------------------------------------------------------
const wph12: SeedQuestion[] = [
    // --- progressive-waves ---
    {
        seedKey: "phy-wph12-progressive-waves-001",
        unitCode: "WPH12",
        topicSlug: "progressive-waves",
        type: "MCQ",
        difficulty: "EASY",
        marks: 1,
        stem: r`Which type of wave **cannot** be polarised?`,
        options: opts("microwaves", "sound waves in air", "waves on a stretched string", "visible light", "B"),
        markScheme: r`- **B** (1) — sound in air is longitudinal, and only transverse waves can be polarised.`,
        explanation: r`Polarisation restricts oscillations to one plane perpendicular to the direction of travel. Longitudinal waves oscillate parallel to the direction of travel, so there is nothing to restrict.`,
    },
    {
        seedKey: "phy-wph12-progressive-waves-002",
        unitCode: "WPH12",
        topicSlug: "progressive-waves",
        type: "CALCULATION",
        difficulty: "MEDIUM",
        marks: 3,
        stem: r`A microphone connected to an oscilloscope detects a sound wave. One complete cycle of the trace occupies 4.0 horizontal divisions, and the time-base is set to $0.50\,\text{ms div}^{-1}$. The speed of sound in air is $340\,\text{m s}^{-1}$.

Calculate the wavelength of the sound.`,
        markScheme: r`- Period $T = 4.0 \times 0.50\,\text{ms} = 2.0 \times 10^{-3}\,\text{s}$ (1)
- $f = 1/T = 500\,\text{Hz}$ (1)
- $\lambda = v/f = 340/500 = 0.68\,\text{m}$ (1)`,
        explanation: r`The time-base gives time per division, so the period is (divisions per cycle) × (time per division). Remember to convert ms to s.`,
    },
    {
        seedKey: "phy-wph12-progressive-waves-003",
        unitCode: "WPH12",
        topicSlug: "progressive-waves",
        type: "MCQ",
        difficulty: "MEDIUM",
        marks: 1,
        stem: r`A progressive wave has wavelength $0.60\,\text{m}$. What is the phase difference between two points on the wave that are $0.15\,\text{m}$ apart along the direction of travel?`,
        options: opts(r`$45^\circ$`, r`$90^\circ$`, r`$180^\circ$`, r`$360^\circ$`, "B"),
        markScheme: r`- **B** (1) — $0.15/0.60 = \tfrac{1}{4}$ of a wavelength, and $\tfrac{1}{4} \times 360^\circ = 90^\circ$ ($\pi/2$ rad).`,
        explanation: r`Phase difference = (separation ÷ wavelength) × 360°. Points half a wavelength apart are in antiphase (180°).`,
    },
    {
        seedKey: "phy-wph12-progressive-waves-004",
        unitCode: "WPH12",
        topicSlug: "progressive-waves",
        type: "SHORT",
        difficulty: "EASY",
        marks: 2,
        stem: r`Explain the difference between a **transverse** wave and a **longitudinal** wave. Give one example of each.`,
        markScheme: r`- Transverse: oscillations perpendicular to the direction of energy transfer; longitudinal: oscillations parallel to the direction of energy transfer (1)
- Valid examples, e.g. transverse — light/any EM wave/water ripples; longitudinal — sound/P-waves (1)`,
        explanation: r`Always compare the direction of the oscillation with the direction of energy transfer (wave travel).`,
    },

    // --- superposition-stationary-waves ---
    {
        seedKey: "phy-wph12-superposition-stationary-waves-001",
        unitCode: "WPH12",
        topicSlug: "superposition-stationary-waves",
        type: "MCQ",
        difficulty: "EASY",
        marks: 1,
        stem: r`On a stationary wave of wavelength $\lambda$, what is the distance between two **adjacent nodes**?`,
        options: opts(r`$\lambda/4$`, r`$\lambda/2$`, r`$\lambda$`, r`$2\lambda$`, "B"),
        markScheme: r`- **B** (1) — adjacent nodes (and adjacent antinodes) are half a wavelength apart.`,
        explanation: r`A node and the next antinode are $\lambda/4$ apart, so node to node is $\lambda/2$. The fundamental on a string fixed at both ends is therefore $L = \lambda/2$.`,
    },
    {
        seedKey: "phy-wph12-superposition-stationary-waves-002",
        unitCode: "WPH12",
        topicSlug: "superposition-stationary-waves",
        type: "CALCULATION",
        difficulty: "HARD",
        marks: 4,
        stem: r`A string of vibrating length $0.80\,\text{m}$ is fixed at both ends. Its fundamental (first harmonic) frequency is $120\,\text{Hz}$. The mass per unit length of the string is $4.0 \times 10^{-3}\,\text{kg m}^{-1}$.

(a) Calculate the speed of waves on the string.

(b) Calculate the tension in the string.

(c) State the frequency of the third harmonic.`,
        markScheme: r`- Fundamental: $\lambda = 2L = 1.60\,\text{m}$ (1)
- $v = f\lambda = 120 \times 1.60 = 192\,\text{m s}^{-1}$ (1)
- $T = \mu v^2 = 4.0 \times 10^{-3} \times 192^2 = 150\,\text{N}$ (147 N) (1)
- Third harmonic $= 3 \times 120 = 360\,\text{Hz}$ (1)`,
        explanation: r`For the fundamental, the string length is half a wavelength. The wave speed $v = \sqrt{T/\mu}$ depends only on the string, so harmonics have the same $v$ and frequencies that are whole-number multiples of the fundamental.`,
    },
    {
        seedKey: "phy-wph12-superposition-stationary-waves-003",
        unitCode: "WPH12",
        topicSlug: "superposition-stationary-waves",
        type: "LONG",
        difficulty: "HARD",
        marks: 6,
        stem: r`A string is stretched between a vibration generator and a fixed pulley. When the frequency of the generator is adjusted, a stationary wave with three loops is seen on the string.

Explain how the stationary wave is formed, and describe how it differs from a progressive wave.`,
        markScheme: r`Indicative content:
- Waves travel along the string and are reflected at the fixed end (pulley) (1)
- The incident and reflected waves have the same frequency and (similar) amplitude and travel in opposite directions (1)
- They superpose / interfere (1)
- Nodes form where the waves are always in antiphase (destructive interference), giving zero amplitude; antinodes form where they are in phase, giving maximum amplitude (1)
- A stationary wave does not transfer energy along the string, whereas a progressive wave does (1)
- In a stationary wave all points between adjacent nodes oscillate in phase with different amplitudes; in a progressive wave all points have the same amplitude but phase varies continuously with position (1)

Award 1 mark per relevant point, max 6.`,
        explanation: r`A stationary wave is the superposition of two identical waves travelling in opposite directions. Only particular frequencies fit a whole number of half-wavelengths between the fixed ends.`,
    },

    // --- refraction-optics ---
    {
        seedKey: "phy-wph12-refraction-optics-001",
        unitCode: "WPH12",
        topicSlug: "refraction-optics",
        type: "MCQ",
        difficulty: "MEDIUM",
        marks: 1,
        stem: r`A glass block has refractive index $1.52$. What is the critical angle for light travelling from the glass towards an air boundary?`,
        options: opts(r`$33^\circ$`, r`$41^\circ$`, r`$49^\circ$`, r`$90^\circ$`, "B"),
        markScheme: r`- **B** (1) — $\sin C = 1/n = 1/1.52 = 0.658$, so $C = 41^\circ$.`,
        explanation: r`At the critical angle the refracted ray travels along the boundary ($r = 90^\circ$), giving $\sin C = 1/n$. Option C is $90^\circ - 41^\circ$, measured from the surface rather than the normal.`,
    },
    {
        seedKey: "phy-wph12-refraction-optics-002",
        unitCode: "WPH12",
        topicSlug: "refraction-optics",
        type: "CALCULATION",
        difficulty: "MEDIUM",
        marks: 3,
        stem: r`A ray of light in air strikes the surface of water at an angle of incidence of $40^\circ$. The refractive index of water is $1.33$.

(a) Calculate the angle of refraction.

(b) Calculate the speed of light in water.`,
        markScheme: r`- $\sin r = \sin 40^\circ/1.33 = 0.483$ (1)
- $r = 29^\circ$ (1)
- $v = c/n = 3.00 \times 10^8/1.33 = 2.26 \times 10^8\,\text{m s}^{-1}$ (1)`,
        explanation: r`Light bends towards the normal on entering a denser medium because it slows down. Angles are always measured from the normal.`,
    },
    {
        seedKey: "phy-wph12-refraction-optics-003",
        unitCode: "WPH12",
        topicSlug: "refraction-optics",
        type: "CALCULATION",
        difficulty: "MEDIUM",
        marks: 4,
        stem: r`An object is placed $25\,\text{cm}$ from a thin converging lens of focal length $15\,\text{cm}$. Use the real-is-positive convention.

(a) Calculate the power of the lens.

(b) Calculate the image distance and state whether the image is real or virtual.

(c) Calculate the linear magnification.`,
        markScheme: r`- $P = 1/f = 1/0.15 = 6.7\,\text{D}$ (1)
- $\dfrac{1}{v} = \dfrac{1}{15} - \dfrac{1}{25}$ (1)
- $v = 37.5\,\text{cm}$; positive, so the image is real (1)
- $m = v/u = 37.5/25 = 1.5$ (1)`,
        explanation: r`Lens power uses the focal length in **metres** (unit dioptre, D). With the object beyond $f$, a converging lens forms a real, inverted image.`,
    },
    {
        seedKey: "phy-wph12-refraction-optics-004",
        unitCode: "WPH12",
        topicSlug: "refraction-optics",
        type: "MCQ",
        difficulty: "MEDIUM",
        marks: 1,
        stem: r`Unpolarised light passes through two Polaroid filters. The first filter is fixed and the second is slowly rotated through $360^\circ$.

How many times does the transmitted intensity fall to (nearly) zero during the full rotation?`,
        options: opts("0", "1", "2", "4", "C"),
        markScheme: r`- **C** (1) — minimum transmission occurs when the transmission axes are perpendicular, at $90^\circ$ and $270^\circ$.`,
        explanation: r`The first filter plane-polarises the light. The second blocks it when its axis is at right angles to the first — which happens twice per full turn.`,
    },

    // --- diffraction-interference ---
    {
        seedKey: "phy-wph12-diffraction-interference-001",
        unitCode: "WPH12",
        topicSlug: "diffraction-interference",
        type: "MCQ",
        difficulty: "HARD",
        marks: 1,
        stem: r`Monochromatic light of wavelength $589\,\text{nm}$ is incident normally on a diffraction grating with $300$ lines per millimetre.

What is the **highest order** of maximum that can be observed?`,
        options: opts("3", "5", "6", "11", "B"),
        markScheme: r`- **B** (1) — $d = 1/300\,\text{mm} = 3.33 \times 10^{-6}\,\text{m}$; $n_\text{max} < d/\lambda = 5.66$, so $n = 5$.`,
        explanation: r`Since $\sin\theta \le 1$, $n \le d/\lambda$. You must round **down** — the sixth order would need $\sin\theta > 1$. D comes from counting maxima on both sides plus the centre.`,
    },
    {
        seedKey: "phy-wph12-diffraction-interference-002",
        unitCode: "WPH12",
        topicSlug: "diffraction-interference",
        type: "CALCULATION",
        difficulty: "MEDIUM",
        marks: 3,
        stem: r`Laser light of wavelength $633\,\text{nm}$ is incident normally on a diffraction grating that has $500$ lines per millimetre.

Calculate the angle between the central (zero-order) maximum and the **second-order** maximum.`,
        markScheme: r`- $d = 1/(500 \times 10^{3}) = 2.0 \times 10^{-6}\,\text{m}$ (1)
- $\sin\theta = n\lambda/d = 2 \times 633 \times 10^{-9}/2.0 \times 10^{-6} = 0.633$ (1)
- $\theta = 39^\circ$ (1)`,
        explanation: r`Convert "lines per mm" to slit spacing in metres first: $d = 1/N$. A grating gives sharp, widely spaced maxima, which is why it is used to measure wavelengths accurately.`,
    },
    {
        seedKey: "phy-wph12-diffraction-interference-003",
        unitCode: "WPH12",
        topicSlug: "diffraction-interference",
        type: "SHORT",
        difficulty: "MEDIUM",
        marks: 3,
        stem: r`Two loudspeakers are connected to the same signal generator and placed a short distance apart. A student walking along a line in front of them hears regions of loud and quiet sound.

(a) Explain why the two sources are **coherent**.

(b) Explain why a loud region is heard at a point where the path difference from the two speakers is one whole wavelength.`,
        markScheme: r`- The speakers are driven by the same generator, so they have the same frequency and a constant phase difference (1)
- A path difference of $\lambda$ means the waves arrive in phase (1)
- They superpose constructively, giving maximum amplitude/loud sound (1)`,
        explanation: r`Coherence (constant phase difference) is needed for a stable interference pattern. Path difference $n\lambda$ gives constructive interference; $(n + \tfrac{1}{2})\lambda$ gives destructive interference.`,
    },
    {
        seedKey: "phy-wph12-diffraction-interference-004",
        unitCode: "WPH12",
        topicSlug: "diffraction-interference",
        type: "MCQ",
        difficulty: "EASY",
        marks: 1,
        stem: r`Two coherent sources emit waves in phase with wavelength $\lambda$. At which path difference will the waves interfere **destructively**?`,
        options: opts(r`$0$`, r`$\lambda$`, r`$1.5\lambda$`, r`$2\lambda$`, "C"),
        markScheme: r`- **C** (1) — a path difference of $(n + \tfrac{1}{2})\lambda$ puts the waves in antiphase.`,
        explanation: r`Whole numbers of wavelengths give constructive interference; an odd number of half-wavelengths gives destructive interference (for sources in phase).`,
    },

    // --- quantum-physics ---
    {
        seedKey: "phy-wph12-quantum-physics-001",
        unitCode: "WPH12",
        topicSlug: "quantum-physics",
        type: "MCQ",
        difficulty: "MEDIUM",
        marks: 1,
        stem: r`Light of a fixed frequency causes photoelectric emission from a metal surface. The **intensity** of the light is doubled. What happens?`,
        options: opts(
            "The maximum kinetic energy of the photoelectrons doubles.",
            "The number of photoelectrons emitted per second doubles.",
            "The work function of the metal halves.",
            "The threshold frequency decreases.",
            "B",
        ),
        markScheme: r`- **B** (1) — doubling intensity doubles the number of photons per second, so twice as many electrons are emitted; each photon still has energy $hf$.`,
        explanation: r`Maximum KE depends only on frequency ($KE_\text{max} = hf - \phi$). Intensity changes the photon arrival rate, not the energy of each photon — evidence for the particle nature of light.`,
    },
    {
        seedKey: "phy-wph12-quantum-physics-002",
        unitCode: "WPH12",
        topicSlug: "quantum-physics",
        type: "CALCULATION",
        difficulty: "MEDIUM",
        marks: 4,
        stem: r`Light of wavelength $400\,\text{nm}$ falls on a sodium surface. The work function of sodium is $2.28\,\text{eV}$.

(a) Calculate the energy of one photon in eV.

(b) Calculate the maximum kinetic energy of the emitted electrons in joules.`,
        markScheme: r`- $E = hc/\lambda = 6.63 \times 10^{-34} \times 3.00 \times 10^{8}/400 \times 10^{-9} = 4.97 \times 10^{-19}\,\text{J}$ (1)
- $E = 4.97 \times 10^{-19}/1.60 \times 10^{-19} = 3.11\,\text{eV}$ (1)
- $KE_\text{max} = 3.11 - 2.28 = 0.83\,\text{eV}$ (1)
- $KE_\text{max} = 0.83 \times 1.60 \times 10^{-19} = 1.3 \times 10^{-19}\,\text{J}$ (1)`,
        explanation: r`Einstein's equation $hf = \phi + KE_\text{max}$ is energy conservation for one photon and one electron. Work in one unit (eV or J) throughout.`,
    },
    {
        seedKey: "phy-wph12-quantum-physics-003",
        unitCode: "WPH12",
        topicSlug: "quantum-physics",
        type: "CALCULATION",
        difficulty: "HARD",
        marks: 4,
        stem: r`Electrons are accelerated from rest through a potential difference of $150\,\text{V}$ and then directed at a thin graphite film.

(a) Calculate the de Broglie wavelength of the electrons.

(b) Explain why the electrons produce a diffraction pattern with graphite.`,
        markScheme: r`- $KE = eV = 1.60 \times 10^{-19} \times 150 = 2.4 \times 10^{-17}\,\text{J}$ (1)
- $p = \sqrt{2mE_k} = \sqrt{2 \times 9.11 \times 10^{-31} \times 2.4 \times 10^{-17}} = 6.6 \times 10^{-24}\,\text{kg m s}^{-1}$ (1)
- $\lambda = h/p = 1.0 \times 10^{-10}\,\text{m}$ (1)
- This wavelength is similar to the spacing between atoms in graphite, so significant diffraction occurs (1)`,
        explanation: r`Electron diffraction is evidence that particles have wave properties. Diffraction is only noticeable when the gap (here the atomic spacing) is comparable to the wavelength.`,
    },
    {
        seedKey: "phy-wph12-quantum-physics-004",
        unitCode: "WPH12",
        topicSlug: "quantum-physics",
        type: "CALCULATION",
        difficulty: "MEDIUM",
        marks: 3,
        stem: r`In a hydrogen atom, an electron moves from the energy level at $-3.40\,\text{eV}$ to the ground state at $-13.6\,\text{eV}$.

Calculate the wavelength of the photon emitted.`,
        markScheme: r`- Energy difference $= 13.6 - 3.40 = 10.2\,\text{eV}$ (1)
- $E = 10.2 \times 1.60 \times 10^{-19} = 1.63 \times 10^{-18}\,\text{J}$ (1)
- $\lambda = hc/E = 1.22 \times 10^{-7}\,\text{m}$ (1)`,
        explanation: r`Each photon carries exactly the energy difference between two levels, so atoms emit line spectra. This wavelength is in the ultraviolet.`,
    },

    // --- current-charge ---
    {
        seedKey: "phy-wph12-current-charge-001",
        unitCode: "WPH12",
        topicSlug: "current-charge",
        type: "MCQ",
        difficulty: "MEDIUM",
        marks: 1,
        stem: r`Two copper wires P and Q are connected in series in a circuit. The diameter of Q is half the diameter of P.

What is $\dfrac{\text{drift velocity of electrons in Q}}{\text{drift velocity of electrons in P}}$?`,
        options: opts("0.25", "0.5", "2", "4", "D"),
        markScheme: r`- **D** (1) — same current and same $n$; $v = I/(nAq)$ and $A_Q = A_P/4$, so $v_Q = 4v_P$.`,
        explanation: r`In series the current is the same. Halving the diameter quarters the area, so electrons must drift four times faster to carry the same charge per second.`,
    },
    {
        seedKey: "phy-wph12-current-charge-002",
        unitCode: "WPH12",
        topicSlug: "current-charge",
        type: "CALCULATION",
        difficulty: "EASY",
        marks: 3,
        stem: r`A current of $0.25\,\text{A}$ flows in a lamp for $3.0$ minutes.

(a) Calculate the charge that flows through the lamp.

(b) Calculate the number of electrons that pass through the lamp in this time.`,
        markScheme: r`- Converts time: $t = 180\,\text{s}$ (1)
- $Q = It = 0.25 \times 180 = 45\,\text{C}$ (1)
- $N = 45/1.60 \times 10^{-19} = 2.8 \times 10^{20}$ (1)`,
        explanation: r`Current is the rate of flow of charge, $I = \Delta Q/\Delta t$. Each electron carries $1.60 \times 10^{-19}\,\text{C}$, so divide the total charge by $e$.`,
    },
    {
        seedKey: "phy-wph12-current-charge-003",
        unitCode: "WPH12",
        topicSlug: "current-charge",
        type: "CALCULATION",
        difficulty: "MEDIUM",
        marks: 3,
        stem: r`A copper wire has a cross-sectional area of $1.0\,\text{mm}^2$ and carries a current of $2.0\,\text{A}$. Copper has $8.5 \times 10^{28}$ free electrons per cubic metre.

Calculate the drift velocity of the electrons.`,
        markScheme: r`- Converts area: $A = 1.0 \times 10^{-6}\,\text{m}^2$ (1)
- Uses $I = nqvA$: $v = \dfrac{2.0}{8.5 \times 10^{28} \times 1.60 \times 10^{-19} \times 1.0 \times 10^{-6}}$ (1)
- $v = 1.5 \times 10^{-4}\,\text{m s}^{-1}$ (1)`,
        explanation: r`$1\,\text{mm}^2 = 10^{-6}\,\text{m}^2$ (not $10^{-3}$). The drift velocity is tiny — the lamp lights almost instantly because the electric field travels through the circuit at near light speed.`,
    },
    {
        seedKey: "phy-wph12-current-charge-004",
        unitCode: "WPH12",
        topicSlug: "current-charge",
        type: "MCQ",
        difficulty: "EASY",
        marks: 1,
        stem: r`Which of the following is equivalent to one volt?`,
        options: opts(r`$\text{J s}^{-1}$`, r`$\text{C s}^{-1}$`, r`$\text{J C}^{-1}$`, r`$\text{A}\,\Omega^{-1}$`, "C"),
        markScheme: r`- **C** (1) — potential difference is energy transferred per unit charge, $V = W/Q$.`,
        explanation: r`A is the watt and B is the ampere. One volt means one joule of energy is transferred for each coulomb of charge.`,
    },

    // --- resistance-circuits ---
    {
        seedKey: "phy-wph12-resistance-circuits-001",
        unitCode: "WPH12",
        topicSlug: "resistance-circuits",
        type: "MCQ",
        difficulty: "HARD",
        marks: 1,
        stem: r`A metal wire has resistance $R$. It is stretched uniformly until its length is doubled. Its volume and resistivity do not change.

What is its new resistance?`,
        options: opts(r`$R/2$`, r`$R$`, r`$2R$`, r`$4R$`, "D"),
        markScheme: r`- **D** (1) — length doubles and (constant volume) area halves, so $R = \rho L/A$ increases by $2 \times 2 = 4$.`,
        explanation: r`Students often only double $R$ for doubled length, forgetting that stretching also thins the wire. Constant volume means $A \propto 1/L$, so $R \propto L^2$.`,
    },
    {
        seedKey: "phy-wph12-resistance-circuits-002",
        unitCode: "WPH12",
        topicSlug: "resistance-circuits",
        type: "CALCULATION",
        difficulty: "MEDIUM",
        marks: 4,
        stem: r`A $6.0\,\Omega$ resistor is connected in series with a parallel combination of a $4.0\,\Omega$ resistor and a $12\,\Omega$ resistor. The combination is connected to a $12\,\text{V}$ supply of negligible internal resistance.

Calculate:

(a) the total resistance of the circuit

(b) the current in the $12\,\Omega$ resistor.`,
        markScheme: r`- Parallel combination: $\left(\tfrac{1}{4.0} + \tfrac{1}{12}\right)^{-1} = 3.0\,\Omega$ (1)
- Total $R = 6.0 + 3.0 = 9.0\,\Omega$ (1)
- Supply current $= 12/9.0 = 1.33\,\text{A}$, so pd across parallel section $= 1.33 \times 3.0 = 4.0\,\text{V}$ (1)
- Current in $12\,\Omega$ resistor $= 4.0/12 = 0.33\,\text{A}$ (1)`,
        explanation: r`Components in parallel share the same pd. Find the pd across the parallel section first, then use $I = V/R$ for each branch.`,
    },
    {
        seedKey: "phy-wph12-resistance-circuits-003",
        unitCode: "WPH12",
        topicSlug: "resistance-circuits",
        type: "CALCULATION",
        difficulty: "MEDIUM",
        marks: 3,
        stem: r`A nichrome wire has length $0.75\,\text{m}$ and diameter $0.28\,\text{mm}$. The resistivity of nichrome is $1.10 \times 10^{-6}\,\Omega\,\text{m}$.

Calculate the resistance of the wire.`,
        markScheme: r`- $A = \pi (0.14 \times 10^{-3})^2 = 6.16 \times 10^{-8}\,\text{m}^2$ (1)
- $R = \rho L/A = 1.10 \times 10^{-6} \times 0.75/6.16 \times 10^{-8}$ (1)
- $R = 13\,\Omega$ (13.4 Ω) (1)`,
        explanation: r`Halve the diameter to get the radius before using $\pi r^2$. Using the diameter makes the area 4× too big and the resistance 4× too small.`,
    },
    {
        seedKey: "phy-wph12-resistance-circuits-004",
        unitCode: "WPH12",
        topicSlug: "resistance-circuits",
        type: "SHORT",
        difficulty: "MEDIUM",
        marks: 3,
        stem: r`The current–potential difference ($I$–$V$) graph for a filament lamp is a curve whose gradient decreases as $V$ increases.

Explain why the resistance of the filament increases as the current through it increases.`,
        markScheme: r`- As current increases, the filament's temperature increases (1)
- The metal ions/lattice vibrate with greater amplitude (1)
- So conduction electrons collide with the ions more frequently, increasing resistance (and the drift velocity per volt is lower) (1)`,
        explanation: r`For a metal the number density of charge carriers stays (almost) constant, so heating increases resistance. In a thermistor (semiconductor), heating releases more charge carriers, so resistance falls instead.`,
    },

    // --- emf-internal-resistance ---
    {
        seedKey: "phy-wph12-emf-internal-resistance-001",
        unitCode: "WPH12",
        topicSlug: "emf-internal-resistance",
        type: "MCQ",
        difficulty: "EASY",
        marks: 1,
        stem: r`When a battery supplies a current, the terminal potential difference is less than the e.m.f. This is because`,
        options: opts(
            "some energy is transferred in the internal resistance of the battery",
            "the battery's chemical energy is used up",
            "charge is lost inside the battery",
            "the external resistance is larger than the internal resistance",
            "A",
        ),
        markScheme: r`- **A** (1) — there are "lost volts" $Ir$ across the internal resistance, so $V = \varepsilon - Ir$.`,
        explanation: r`Charge is conserved (C is wrong). Each coulomb gains $\varepsilon$ joules from the chemical reaction but transfers $Ir$ joules inside the battery itself, so less is available to the external circuit.`,
    },
    {
        seedKey: "phy-wph12-emf-internal-resistance-002",
        unitCode: "WPH12",
        topicSlug: "emf-internal-resistance",
        type: "CALCULATION",
        difficulty: "MEDIUM",
        marks: 4,
        stem: r`A cell of e.m.f. $1.5\,\text{V}$ and internal resistance $0.50\,\Omega$ is connected to a $2.5\,\Omega$ resistor.

Calculate:

(a) the current in the circuit

(b) the terminal potential difference of the cell

(c) the power dissipated inside the cell.`,
        markScheme: r`- $I = \varepsilon/(R + r) = 1.5/3.0$ (1)
- $I = 0.50\,\text{A}$ (1)
- $V = IR = 0.50 \times 2.5 = 1.25\,\text{V}$ (1)
- $P = I^2 r = 0.50^2 \times 0.50 = 0.13\,\text{W}$ (0.125 W) (1)`,
        explanation: r`The e.m.f. drives current through the total resistance $R + r$. The terminal pd equals $\varepsilon - Ir = 1.5 - 0.25 = 1.25\,\text{V}$, a useful check.`,
    },
    {
        seedKey: "phy-wph12-emf-internal-resistance-003",
        unitCode: "WPH12",
        topicSlug: "emf-internal-resistance",
        type: "SHORT",
        difficulty: "MEDIUM",
        marks: 3,
        stem: r`A potential divider consists of a fixed $2.2\,\text{k}\Omega$ resistor in series with a light-dependent resistor (LDR), connected to a $9.0\,\text{V}$ supply of negligible internal resistance. The output voltage is taken across the LDR. In the dark, the LDR has resistance $6.8\,\text{k}\Omega$.

(a) Calculate the output voltage in the dark.

(b) Explain what happens to the output voltage when light shines on the LDR.`,
        markScheme: r`- $V_\text{out} = 9.0 \times \dfrac{6.8}{6.8 + 2.2} = 6.8\,\text{V}$ (1)
- In light the resistance of the LDR decreases (1)
- The LDR takes a smaller share of the supply pd, so $V_\text{out}$ decreases (1)`,
        explanation: r`In a potential divider the supply pd is shared in proportion to the resistances. The current changes too, but the ratio argument is the quickest explanation.`,
    },
    {
        seedKey: "phy-wph12-emf-internal-resistance-004",
        unitCode: "WPH12",
        topicSlug: "emf-internal-resistance",
        type: "SHORT",
        difficulty: "HARD",
        marks: 4,
        stem: r`Describe how a student could determine the e.m.f. and internal resistance of a cell using a variable resistor, an ammeter and a voltmeter. Include how the results are analysed.`,
        markScheme: r`- Connect the cell in series with the ammeter and variable resistor, with the voltmeter across the cell terminals (1)
- Vary the resistance and record pairs of terminal pd $V$ and current $I$ (1)
- Plot a graph of $V$ against $I$; since $V = \varepsilon - Ir$ this is a straight line (1)
- The $y$-intercept is the e.m.f. and the gradient is $-r$ (1)`,
        explanation: r`Comparing $V = -rI + \varepsilon$ with $y = mx + c$ shows why the graph is linear. Keep currents small and switch off between readings so the cell does not heat up and change $r$.`,
    },
];

// ---------------------------------------------------------------------------------------------------------------
// WPH13 — Practical Skills in Physics I
// ---------------------------------------------------------------------------------------------------------------
const wph13: SeedQuestion[] = [
    // --- measurement-uncertainty ---
    {
        seedKey: "phy-wph13-measurement-uncertainty-001",
        unitCode: "WPH13",
        topicSlug: "measurement-uncertainty",
        type: "MCQ",
        difficulty: "EASY",
        marks: 1,
        stem: r`A student uses a micrometer screw gauge with a resolution of $0.01\,\text{mm}$ to measure the diameter of a wire as $0.48\,\text{mm}$.

What is the percentage uncertainty in this reading, taking the uncertainty as the resolution of the instrument?`,
        options: opts("0.01%", "0.48%", "2.1%", "4.8%", "C"),
        markScheme: r`- **C** (1) — $(0.01/0.48) \times 100\% = 2.1\%$.`,
        explanation: r`Percentage uncertainty = (absolute uncertainty ÷ measured value) × 100%. Small measurements give large percentage uncertainties, which is why diameter is often the dominant uncertainty in resistivity and Young modulus experiments.`,
    },
    {
        seedKey: "phy-wph13-measurement-uncertainty-002",
        unitCode: "WPH13",
        topicSlug: "measurement-uncertainty",
        type: "SHORT",
        difficulty: "MEDIUM",
        marks: 3,
        stem: r`A student measures the length of a pendulum several times with a metre rule. She forgets to check that the zero mark of the rule is at the very end, and the rule is worn, so every reading is $2\,\text{mm}$ too long.

(a) State the type of error this causes and how it affects the readings.

(b) Explain the difference between **accuracy** and **precision**.`,
        markScheme: r`- Systematic error (zero error): every reading is shifted by the same amount, so it cannot be reduced by repeating and averaging (1)
- Accuracy: how close a measurement is to the true value (1)
- Precision: how close repeated measurements are to each other (small spread/random error) (1)`,
        explanation: r`Systematic errors affect accuracy; random errors affect precision. Her readings could be very precise yet still inaccurate because of the zero error.`,
    },

    // --- experimental-design ---
    {
        seedKey: "phy-wph13-experimental-design-001",
        unitCode: "WPH13",
        topicSlug: "experimental-design",
        type: "SHORT",
        difficulty: "MEDIUM",
        marks: 4,
        stem: r`A student plans to determine the acceleration of free fall, $g$, by dropping a steel ball from rest through different heights $h$ and timing the fall with an electronic timer triggered by light gates.

Describe how the student should carry out and analyse the experiment to obtain an accurate value of $g$.`,
        markScheme: r`- Measure the height $h$ with a metre rule, using a set square to avoid parallax error (1)
- Record the fall time $t$ for at least five different heights, repeating each and calculating a mean (1)
- Plot a graph of $h$ against $t^2$ (from $h = \tfrac{1}{2}gt^2$) (1)
- $g = 2 \times \text{gradient}$ (1)`,
        explanation: r`Linearising $h = \tfrac{1}{2}gt^2$ as $h$ vs $t^2$ gives a straight line through the origin; using the gradient of a best-fit line reduces the effect of random errors in individual readings.`,
    },
    {
        seedKey: "phy-wph13-experimental-design-002",
        unitCode: "WPH13",
        topicSlug: "experimental-design",
        type: "MCQ",
        difficulty: "EASY",
        marks: 1,
        stem: r`A student investigates how the resistance of a metal wire depends on its length by connecting different lengths of the wire into a circuit.

Which quantity must be kept **constant** (a control variable) for a fair test?`,
        options: opts(
            "the length of the wire",
            "the resistance of the wire",
            "the temperature of the wire",
            "the potential difference across the wire",
            "C",
        ),
        markScheme: r`- **C** (1) — resistance of a metal depends on temperature, so temperature must be controlled (e.g. small currents, switch off between readings).`,
        explanation: r`Length is the independent variable and resistance the dependent variable. The pd will naturally vary with length; what matters is keeping the wire at the same temperature.`,
    },

    // --- data-analysis-graphs ---
    {
        seedKey: "phy-wph13-data-analysis-graphs-001",
        unitCode: "WPH13",
        topicSlug: "data-analysis-graphs",
        type: "CALCULATION",
        difficulty: "MEDIUM",
        marks: 3,
        stem: r`A student records the extension of a spring for different loads.

| Force $F$ / N | 1.0 | 2.0 | 3.0 | 4.0 | 5.0 |
| --- | --- | --- | --- | --- | --- |
| Extension $x$ / cm | 2.1 | 4.0 | 6.1 | 7.9 | 10.0 |

Using a graph of $F$ against $x$, determine the spring constant $k$ of the spring in $\text{N m}^{-1}$.`,
        markScheme: r`- Plots $F$ against $x$ (or uses the data) and draws a best-fit straight line through the origin (1)
- Gradient calculated from a large triangle on the line, e.g. $\Delta F/\Delta x \approx 5.0/9.9\,\text{N cm}^{-1}$ (1)
- $k \approx 51\,\text{N m}^{-1}$ (accept $49$–$52\,\text{N m}^{-1}$), with conversion of cm to m (1)`,
        explanation: r`By Hooke's law $F = kx$, so $k$ is the gradient of $F$ against $x$. Use a large triangle spanning most of the line, and convert cm to m — leaving it in cm gives an answer 100× too small.`,
    },
    {
        seedKey: "phy-wph13-data-analysis-graphs-002",
        unitCode: "WPH13",
        topicSlug: "data-analysis-graphs",
        type: "MCQ",
        difficulty: "MEDIUM",
        marks: 1,
        stem: r`A trolley accelerates uniformly from rest down a ramp. A student measures its velocity $v$ after it has travelled different distances $s$.

Which graph should be plotted to give a straight line through the origin with gradient equal to $2a$?`,
        options: opts(r`$v$ against $s$`, r`$v^2$ against $s$`, r`$v$ against $s^2$`, r`$s$ against $v^2$`, "B"),
        markScheme: r`- **B** (1) — from $v^2 = u^2 + 2as$ with $u = 0$: $v^2 = 2a \times s$, so $y = v^2$, $x = s$, gradient $2a$.`,
        explanation: r`Match the equation to $y = mx$. Option D is also a straight line, but its gradient is $1/(2a)$.`,
    },
];

// ---------------------------------------------------------------------------------------------------------------
// WPH14 — Further Mechanics, Fields and Particles
// ---------------------------------------------------------------------------------------------------------------
const wph14: SeedQuestion[] = [
    // --- further-momentum ---
    {
        seedKey: "phy-wph14-further-momentum-001",
        unitCode: "WPH14",
        topicSlug: "further-momentum",
        type: "MCQ",
        difficulty: "EASY",
        marks: 1,
        stem: r`Which statement is true for **every** elastic collision between two objects (with no external forces)?`,
        options: opts(
            "Momentum is conserved but kinetic energy is not.",
            "Both momentum and kinetic energy are conserved.",
            "Kinetic energy is conserved but momentum is not.",
            "The objects stick together after the collision.",
            "B",
        ),
        markScheme: r`- **B** (1) — momentum is conserved in all collisions; an elastic collision also conserves total kinetic energy.`,
        explanation: r`Momentum is always conserved when no external force acts. What distinguishes elastic from inelastic is whether kinetic energy is conserved. Sticking together (D) is a perfectly inelastic collision.`,
    },
    {
        seedKey: "phy-wph14-further-momentum-002",
        unitCode: "WPH14",
        topicSlug: "further-momentum",
        type: "CALCULATION",
        difficulty: "HARD",
        marks: 5,
        stem: r`On a smooth horizontal table, puck A of mass $0.17\,\text{kg}$ moves at $2.0\,\text{m s}^{-1}$ and strikes an identical stationary puck B. After the collision, A moves at $1.2\,\text{m s}^{-1}$ at $30^\circ$ to its original direction.

(a) Calculate the speed of B after the collision and the angle its path makes with A's original direction.

(b) Determine whether the collision is elastic.`,
        markScheme: r`- Conserves momentum along the original direction: $2.0 = 1.2\cos 30^\circ + v_x$, so $v_x = 0.96\,\text{m s}^{-1}$ (1)
- Perpendicular: $0 = 1.2\sin 30^\circ + v_y$, so $v_y = -0.60\,\text{m s}^{-1}$ (masses cancel) (1)
- $v_B = \sqrt{0.96^2 + 0.60^2} = 1.1\,\text{m s}^{-1}$ at $32^\circ$ on the opposite side of the original direction (1)
- KE before $= \tfrac{1}{2}(0.17)(2.0)^2 = 0.34\,\text{J}$; KE after $= \tfrac{1}{2}(0.17)(1.2^2 + 1.13^2) = 0.23\,\text{J}$ (1)
- KE after is less than KE before, so the collision is inelastic (1)`,
        explanation: r`Momentum is a vector, so conserve it separately in two perpendicular directions. Before the collision there is no perpendicular momentum, so the two pucks' perpendicular components must cancel afterwards.`,
    },
    {
        seedKey: "phy-wph14-further-momentum-003",
        unitCode: "WPH14",
        topicSlug: "further-momentum",
        type: "CALCULATION",
        difficulty: "MEDIUM",
        marks: 3,
        stem: r`A stationary radium-226 nucleus decays into a radon-222 nucleus by emitting an alpha particle. The alpha particle moves off at $1.5 \times 10^{7}\,\text{m s}^{-1}$.

Calculate the recoil speed of the radon nucleus. You may use nucleon numbers in place of masses.`,
        markScheme: r`- Total momentum before $= 0$, so momentum of radon = momentum of alpha (opposite directions) (1)
- $222\,v = 4 \times 1.5 \times 10^{7}$ (1)
- $v = 2.7 \times 10^{5}\,\text{m s}^{-1}$ (1)`,
        explanation: r`Like a gun recoiling, the two fragments move in opposite directions with equal and opposite momenta. The heavier nucleus moves much more slowly, so the alpha particle carries most of the kinetic energy.`,
    },

    // --- circular-motion ---
    {
        seedKey: "phy-wph14-circular-motion-001",
        unitCode: "WPH14",
        topicSlug: "circular-motion",
        type: "MCQ",
        difficulty: "EASY",
        marks: 1,
        stem: r`What is the angular velocity of the Earth as it spins on its axis? (Take one rotation as 24 hours.)`,
        options: opts(
            r`$7.3 \times 10^{-5}\,\text{rad s}^{-1}$`,
            r`$1.2 \times 10^{-5}\,\text{rad s}^{-1}$`,
            r`$4.4 \times 10^{-3}\,\text{rad s}^{-1}$`,
            r`$0.26\,\text{rad s}^{-1}$`,
            "A",
        ),
        markScheme: r`- **A** (1) — $\omega = 2\pi/T = 2\pi/86\,400 = 7.3 \times 10^{-5}\,\text{rad s}^{-1}$.`,
        explanation: r`Use $T$ in seconds and $2\pi$ radians per revolution. B omits the $2\pi$; C uses minutes; D uses hours.`,
    },
    {
        seedKey: "phy-wph14-circular-motion-002",
        unitCode: "WPH14",
        topicSlug: "circular-motion",
        type: "CALCULATION",
        difficulty: "HARD",
        marks: 4,
        stem: r`A ball of mass $0.30\,\text{kg}$ is whirled in a **vertical** circle of radius $0.60\,\text{m}$ on the end of a light string.

(a) At the lowest point the ball's speed is $4.0\,\text{m s}^{-1}$. Calculate the tension in the string at this point.

(b) Calculate the minimum speed the ball must have at the top of the circle for the string to remain taut.`,
        markScheme: r`- At the bottom: $T - mg = \dfrac{mv^2}{r}$ (1)
- $T = 0.30 \times 9.81 + \dfrac{0.30 \times 4.0^2}{0.60} = 2.94 + 8.0 = 11\,\text{N}$ (10.9 N) (1)
- At the top with minimum speed, tension is zero so weight alone provides the centripetal force: $mg = \dfrac{mv^2}{r}$ (1)
- $v = \sqrt{gr} = \sqrt{9.81 \times 0.60} = 2.4\,\text{m s}^{-1}$ (1)`,
        explanation: r`The resultant force towards the centre must equal $mv^2/r$. At the bottom tension must exceed the weight; at the top both act downwards (towards the centre).`,
    },
    {
        seedKey: "phy-wph14-circular-motion-003",
        unitCode: "WPH14",
        topicSlug: "circular-motion",
        type: "SHORT",
        difficulty: "MEDIUM",
        marks: 3,
        stem: r`A car travels around a level roundabout at a constant speed.

Explain why the car is accelerating, and identify the force that causes this acceleration.`,
        markScheme: r`- The direction of the velocity is continuously changing, so the velocity changes (1)
- A changing velocity means the car is accelerating, towards the centre of the circle (1)
- The centripetal force is provided by friction between the tyres and the road, acting towards the centre (1)`,
        explanation: r`"Centripetal force" is not an extra force — it is the name for the resultant force towards the centre, which here is friction. If the road is icy, friction is too small and the car slides outwards along a tangent.`,
    },

    // --- electric-fields ---
    {
        seedKey: "phy-wph14-electric-fields-001",
        unitCode: "WPH14",
        topicSlug: "electric-fields",
        type: "MCQ",
        difficulty: "EASY",
        marks: 1,
        stem: r`Two parallel metal plates are $4.0\,\text{mm}$ apart and have a potential difference of $2000\,\text{V}$ between them.

What is the electric field strength between the plates?`,
        options: opts(
            r`$8.0\,\text{V m}^{-1}$`,
            r`$5.0 \times 10^{2}\,\text{V m}^{-1}$`,
            r`$5.0 \times 10^{5}\,\text{V m}^{-1}$`,
            r`$8.0 \times 10^{6}\,\text{V m}^{-1}$`,
            "C",
        ),
        markScheme: r`- **C** (1) — $E = V/d = 2000/4.0 \times 10^{-3} = 5.0 \times 10^{5}\,\text{V m}^{-1}$.`,
        explanation: r`The field between parallel plates is uniform, $E = V/d$. B leaves $d$ in mm; A and D multiply instead of divide.`,
    },
    {
        seedKey: "phy-wph14-electric-fields-002",
        unitCode: "WPH14",
        topicSlug: "electric-fields",
        type: "CALCULATION",
        difficulty: "MEDIUM",
        marks: 2,
        stem: r`In a simple model of the hydrogen atom, the electron is $5.3 \times 10^{-11}\,\text{m}$ from the proton.

Calculate the magnitude of the electrostatic force between them.`,
        markScheme: r`- Uses $F = \dfrac{kQ_1Q_2}{r^2} = \dfrac{8.99 \times 10^{9} \times (1.60 \times 10^{-19})^2}{(5.3 \times 10^{-11})^2}$ (1)
- $F = 8.2 \times 10^{-8}\,\text{N}$ (1)`,
        explanation: r`Coulomb's law is an inverse-square law. Remember to square both the charge product (here $e^2$) and the separation.`,
    },
    {
        seedKey: "phy-wph14-electric-fields-003",
        unitCode: "WPH14",
        topicSlug: "electric-fields",
        type: "CALCULATION",
        difficulty: "HARD",
        marks: 3,
        stem: r`Two positive point charges, $+4.0\,\mu\text{C}$ at point X and $+1.0\,\mu\text{C}$ at point Y, are $0.30\,\text{m}$ apart.

Calculate the distance from X of the point on the line XY where the resultant electric field strength is zero.`,
        markScheme: r`- At the null point the field strengths are equal: $\dfrac{k(4.0\,\mu\text{C})}{x^2} = \dfrac{k(1.0\,\mu\text{C})}{(0.30 - x)^2}$ (1)
- Square-rooting: $2(0.30 - x) = x$ (1)
- $x = 0.20\,\text{m}$ from X (1)`,
        explanation: r`The fields from two like charges point in opposite directions between them, so they cancel somewhere between. The null point is closer to the smaller charge.`,
    },
    {
        seedKey: "phy-wph14-electric-fields-004",
        unitCode: "WPH14",
        topicSlug: "electric-fields",
        type: "SHORT",
        difficulty: "MEDIUM",
        marks: 3,
        stem: r`An electron enters the uniform electric field between two horizontal parallel plates, travelling horizontally midway between them. The upper plate is positive.

Describe and explain the path of the electron while it is between the plates.`,
        markScheme: r`- The electron experiences a constant force towards the positive (upper) plate, perpendicular to its initial velocity (1)
- Its horizontal velocity component is unchanged, while it accelerates uniformly upwards (1)
- So the path is a parabola curving towards the positive plate (1)`,
        explanation: r`This is exactly like projectile motion, with the electric force replacing gravity. The force on a negative charge is opposite to the field direction.`,
    },

    // --- capacitors ---
    {
        seedKey: "phy-wph14-capacitors-001",
        unitCode: "WPH14",
        topicSlug: "capacitors",
        type: "MCQ",
        difficulty: "EASY",
        marks: 1,
        stem: r`A $470\,\mu\text{F}$ capacitor discharges through a $22\,\text{k}\Omega$ resistor. What is the time constant of the circuit?`,
        options: opts(r`$0.010\,\text{s}$`, r`$10\,\text{s}$`, r`$47\,\text{s}$`, r`$1.0 \times 10^{4}\,\text{s}$`, "B"),
        markScheme: r`- **B** (1) — $\tau = RC = 22 \times 10^{3} \times 470 \times 10^{-6} = 10.3\,\text{s}$.`,
        explanation: r`Convert prefixes carefully: $\mu = 10^{-6}$ and $\text{k} = 10^{3}$. After one time constant the charge has fallen to about 37% of its initial value.`,
    },
    {
        seedKey: "phy-wph14-capacitors-002",
        unitCode: "WPH14",
        topicSlug: "capacitors",
        type: "CALCULATION",
        difficulty: "HARD",
        marks: 4,
        stem: r`A $2200\,\mu\text{F}$ capacitor is charged to $12\,\text{V}$ and then discharged through a $1.5\,\text{k}\Omega$ resistor.

(a) Calculate the energy initially stored in the capacitor.

(b) Calculate the time taken for the potential difference across the capacitor to fall to $3.0\,\text{V}$.`,
        markScheme: r`- $W = \tfrac{1}{2}CV^2 = \tfrac{1}{2} \times 2200 \times 10^{-6} \times 12^2 = 0.16\,\text{J}$ (0.158 J) (1)
- $RC = 1.5 \times 10^{3} \times 2200 \times 10^{-6} = 3.3\,\text{s}$ (1)
- Uses $V = V_0 e^{-t/RC}$: $3.0 = 12e^{-t/3.3}$, so $t = 3.3\ln 4$ (1)
- $t = 4.6\,\text{s}$ (1)`,
        explanation: r`Falling to a quarter takes two half-lives, and each half-life is $RC\ln 2$. Using natural logs: $t = RC\ln(V_0/V)$.`,
    },
    {
        seedKey: "phy-wph14-capacitors-003",
        unitCode: "WPH14",
        topicSlug: "capacitors",
        type: "SHORT",
        difficulty: "MEDIUM",
        marks: 3,
        stem: r`A charged capacitor is discharged through a resistor. Explain why the current decreases **exponentially** with time.`,
        markScheme: r`- The current is proportional to the pd across the capacitor ($I = V/R$), and $V$ is proportional to the charge stored ($V = Q/C$) (1)
- As charge flows off, the pd falls, so the current (rate of loss of charge) falls (1)
- The rate of decrease of charge is proportional to the charge remaining, which gives an exponential decay (1)`,
        explanation: r`Whenever the rate of change of a quantity is proportional to the quantity itself ($dQ/dt = -Q/RC$), the result is exponential decay — the same mathematics as radioactive decay.`,
    },
    {
        seedKey: "phy-wph14-capacitors-004",
        unitCode: "WPH14",
        topicSlug: "capacitors",
        type: "MCQ",
        difficulty: "MEDIUM",
        marks: 1,
        stem: r`The charge on a capacitor is doubled. By what factor does the energy stored in the capacitor increase?`,
        options: opts("1 (no change)", "2", "4", "8", "C"),
        markScheme: r`- **C** (1) — $W = \dfrac{Q^2}{2C}$, so doubling $Q$ multiplies $W$ by 4.`,
        explanation: r`Doubling $Q$ also doubles $V$ (since $C$ is fixed), and $W = \tfrac{1}{2}QV$, so both factors double: $2 \times 2 = 4$.`,
    },

    // --- magnetic-fields ---
    {
        seedKey: "phy-wph14-magnetic-fields-001",
        unitCode: "WPH14",
        topicSlug: "magnetic-fields",
        type: "MCQ",
        difficulty: "EASY",
        marks: 1,
        stem: r`A proton moves in a uniform magnetic field. In which situation does it experience **no** magnetic force?`,
        options: opts(
            "It moves parallel to the magnetic field lines.",
            "It moves perpendicular to the magnetic field lines.",
            "It moves at 45° to the magnetic field lines.",
            "It moves very fast perpendicular to the field lines.",
            "A",
        ),
        markScheme: r`- **A** (1) — $F = Bqv\sin\theta$ and $\sin 0^\circ = 0$.`,
        explanation: r`Only the component of velocity perpendicular to the field contributes to the magnetic force. Motion along the field lines produces no force at all.`,
    },
    {
        seedKey: "phy-wph14-magnetic-fields-002",
        unitCode: "WPH14",
        topicSlug: "magnetic-fields",
        type: "MCQ",
        difficulty: "EASY",
        marks: 1,
        stem: r`A straight wire carries a current of $3.5\,\text{A}$ at right angles to a uniform magnetic field of flux density $0.12\,\text{T}$. The length of wire in the field is $5.0\,\text{cm}$.

What is the force on the wire?`,
        options: opts(r`$0.021\,\text{N}$`, r`$0.42\,\text{N}$`, r`$2.1\,\text{N}$`, r`$1.5 \times 10^{-3}\,\text{N}$`, "A"),
        markScheme: r`- **A** (1) — $F = BIl = 0.12 \times 3.5 \times 0.050 = 0.021\,\text{N}$.`,
        explanation: r`Use the length in metres. B ignores the length entirely, and C leaves it in cm.`,
    },
    {
        seedKey: "phy-wph14-magnetic-fields-003",
        unitCode: "WPH14",
        topicSlug: "magnetic-fields",
        type: "CALCULATION",
        difficulty: "MEDIUM",
        marks: 3,
        stem: r`An electron travelling at $4.0 \times 10^{6}\,\text{m s}^{-1}$ enters a uniform magnetic field of flux density $2.5\,\text{mT}$ at right angles to the field.

Calculate the radius of the electron's circular path.`,
        markScheme: r`- Magnetic force provides centripetal force: $Bqv = \dfrac{mv^2}{r}$ (1)
- $r = \dfrac{mv}{Bq} = \dfrac{9.11 \times 10^{-31} \times 4.0 \times 10^{6}}{2.5 \times 10^{-3} \times 1.60 \times 10^{-19}}$ (1)
- $r = 9.1 \times 10^{-3}\,\text{m}$ (1)`,
        explanation: r`Equating $Bqv$ with $mv^2/r$ gives $r = p/(Bq)$: faster or heavier particles curve less, which is how mass spectrometers and particle detectors identify particles.`,
    },
    {
        seedKey: "phy-wph14-magnetic-fields-004",
        unitCode: "WPH14",
        topicSlug: "magnetic-fields",
        type: "SHORT",
        difficulty: "MEDIUM",
        marks: 3,
        stem: r`A charged particle moves at right angles to a uniform magnetic field. Explain why it moves in a circle at **constant speed**.`,
        markScheme: r`- The magnetic force is always perpendicular to the particle's velocity (1)
- So no work is done on the particle and its kinetic energy/speed stays constant (1)
- A force of constant magnitude perpendicular to the velocity provides a centripetal force, so the path is a circle (1)`,
        explanation: r`Work done = force × displacement in the direction of the force. A force always at right angles to the motion changes only direction, never speed.`,
    },

    // --- electromagnetic-induction ---
    {
        seedKey: "phy-wph14-electromagnetic-induction-001",
        unitCode: "WPH14",
        topicSlug: "electromagnetic-induction",
        type: "MCQ",
        difficulty: "MEDIUM",
        marks: 1,
        stem: r`Lenz's law states that an induced current flows in a direction that opposes the change producing it. Lenz's law is a consequence of the conservation of`,
        options: opts("charge", "momentum", "energy", "magnetic flux", "C"),
        markScheme: r`- **C** (1) — if the induced current aided the change, energy would be created from nothing; work must be done against the opposing force.`,
        explanation: r`Because the induced current opposes the motion, you must do work to move a magnet into a coil — that work becomes the electrical energy in the circuit.`,
    },
    {
        seedKey: "phy-wph14-electromagnetic-induction-002",
        unitCode: "WPH14",
        topicSlug: "electromagnetic-induction",
        type: "CALCULATION",
        difficulty: "MEDIUM",
        marks: 3,
        stem: r`A coil of 200 turns and cross-sectional area $4.0 \times 10^{-4}\,\text{m}^2$ is placed with its plane perpendicular to a magnetic field of flux density $0.30\,\text{T}$. The field is reduced uniformly to zero in $0.050\,\text{s}$.

Calculate the magnitude of the e.m.f. induced in the coil.`,
        markScheme: r`- Change in flux linkage $= N\Delta(BA) = 200 \times 0.30 \times 4.0 \times 10^{-4} = 0.024\,\text{Wb}$ (1)
- Uses $\varepsilon = \dfrac{\Delta(N\Phi)}{\Delta t} = 0.024/0.050$ (1)
- $\varepsilon = 0.48\,\text{V}$ (1)`,
        explanation: r`Faraday's law: induced e.m.f. equals the rate of change of flux linkage $N\Phi$. Forgetting the number of turns $N$ is the usual slip.`,
    },
    {
        seedKey: "phy-wph14-electromagnetic-induction-003",
        unitCode: "WPH14",
        topicSlug: "electromagnetic-induction",
        type: "LONG",
        difficulty: "HARD",
        marks: 6,
        stem: r`A bar magnet is dropped, north pole first, through a vertical coil connected to a data logger, which records the induced e.m.f. against time.

Describe the shape of the e.m.f.–time graph and explain its features using the laws of electromagnetic induction.`,
        markScheme: r`Indicative content:
- As the magnet enters the coil, the flux linkage increases, so an e.m.f. is induced (Faraday's law) (1)
- When the magnet is fully inside/at the centre, the flux linkage is (momentarily) not changing, so the e.m.f. falls to zero (1)
- As the magnet leaves, the flux linkage decreases, so the e.m.f. is in the opposite direction (Lenz's law) (1)
- The second peak is larger because the magnet is moving faster as it leaves (it is accelerating under gravity) (1)
- The second pulse is shorter in duration because the magnet passes through more quickly (1)
- The areas under the two peaks are equal because the total change in flux linkage is the same on entry and exit (1)

Award 1 mark per relevant point, max 6.`,
        explanation: r`E.m.f. depends on the **rate** of change of flux linkage, so speed matters. Lenz's law fixes the sign: approaching and leaving produce opposite e.m.f.s.`,
    },

    // --- particle-physics ---
    {
        seedKey: "phy-wph14-particle-physics-001",
        unitCode: "WPH14",
        topicSlug: "particle-physics",
        type: "MCQ",
        difficulty: "EASY",
        marks: 1,
        stem: r`What is the quark composition of a **neutron**?`,
        options: opts("uud", "udd", r`$\text{u}\bar{\text{d}}$`, "ddd", "B"),
        markScheme: r`- **B** (1) — charge $= +\tfrac{2}{3} - \tfrac{1}{3} - \tfrac{1}{3} = 0$.`,
        explanation: r`Up quarks carry $+\tfrac{2}{3}e$ and down quarks $-\tfrac{1}{3}e$. uud is the proton; $\text{u}\bar{\text{d}}$ is a $\pi^+$ meson.`,
    },
    {
        seedKey: "phy-wph14-particle-physics-002",
        unitCode: "WPH14",
        topicSlug: "particle-physics",
        type: "CALCULATION",
        difficulty: "MEDIUM",
        marks: 4,
        stem: r`An electron and a positron, both effectively at rest, annihilate to produce two identical gamma-ray photons.

(a) Explain why two photons, rather than one, are produced.

(b) Calculate the wavelength of each photon.`,
        markScheme: r`- Initial momentum is zero, so two photons moving in opposite directions are needed to conserve momentum (1)
- Energy of each photon = rest energy of one electron: $E = mc^2 = 9.11 \times 10^{-31} \times (3.00 \times 10^{8})^2$ (1)
- $E = 8.2 \times 10^{-14}\,\text{J}$ (1)
- $\lambda = hc/E = 2.4 \times 10^{-12}\,\text{m}$ (1)`,
        explanation: r`The total rest energy $2m_ec^2$ is shared equally between the two photons, so each has $m_ec^2$ (0.511 MeV). A single photon would carry momentum, violating conservation.`,
    },
    {
        seedKey: "phy-wph14-particle-physics-003",
        unitCode: "WPH14",
        topicSlug: "particle-physics",
        type: "SHORT",
        difficulty: "MEDIUM",
        marks: 3,
        stem: r`In Rutherford's alpha-particle scattering experiment, alpha particles were fired at a thin gold foil.

State three observations and the conclusion drawn about the atom from each.`,
        markScheme: r`- Most alpha particles passed straight through, so most of the atom is empty space (1)
- Some were deflected through small angles, so the nucleus is charged (positive, repelling the alpha particles) (1)
- A very small number were deflected through more than $90^\circ$, so most of the mass is concentrated in a very small nucleus (1)`,
        explanation: r`Large-angle back-scattering needs a strong force from a tiny, massive, charged centre — this overturned the "plum pudding" model.`,
    },
    {
        seedKey: "phy-wph14-particle-physics-004",
        unitCode: "WPH14",
        topicSlug: "particle-physics",
        type: "MCQ",
        difficulty: "HARD",
        marks: 1,
        stem: r`Which of the following interactions is **not** possible?`,
        options: opts(
            r`$\pi^- + \text{p} \rightarrow \text{n} + \pi^0$`,
            r`$\text{p} + \text{p} \rightarrow \text{p} + \text{p} + \pi^0$`,
            r`$\text{n} \rightarrow \text{p} + \text{e}^- + \bar{\nu}_\text{e}$`,
            r`$\text{p} + \text{n} \rightarrow \text{p} + \text{p} + \text{e}^-$`,
            "D",
        ),
        markScheme: r`- **D** (1) — charge and baryon number are conserved, but lepton number changes from 0 to 1.`,
        explanation: r`Check charge, baryon number and lepton number on both sides. In D an electron (lepton number +1) is created without an antineutrino to balance it.`,
    },
];

// ---------------------------------------------------------------------------------------------------------------
// WPH15 — Thermodynamics, Radiation, Oscillations and Cosmology
// ---------------------------------------------------------------------------------------------------------------
const wph15: SeedQuestion[] = [
    // --- thermodynamics ---
    {
        seedKey: "phy-wph15-thermodynamics-001",
        unitCode: "WPH15",
        topicSlug: "thermodynamics",
        type: "MCQ",
        difficulty: "MEDIUM",
        marks: 1,
        stem: r`Ice at $0\,^\circ\text{C}$ is heated steadily. While it melts, its temperature stays at $0\,^\circ\text{C}$. What happens to the energy supplied?`,
        options: opts(
            "It increases the mean kinetic energy of the molecules.",
            "It increases the potential energy of the molecules by breaking bonds.",
            "It is all lost to the surroundings.",
            "It increases both the kinetic and potential energy of the molecules equally.",
            "B",
        ),
        markScheme: r`- **B** (1) — at constant temperature the mean molecular kinetic energy is constant; energy goes into breaking intermolecular bonds (potential energy).`,
        explanation: r`Temperature measures the mean kinetic energy of molecules. During a change of state the internal energy rises because the potential energy of the molecules increases, not their kinetic energy.`,
    },
    {
        seedKey: "phy-wph15-thermodynamics-002",
        unitCode: "WPH15",
        topicSlug: "thermodynamics",
        type: "CALCULATION",
        difficulty: "MEDIUM",
        marks: 4,
        stem: r`A $2.0\,\text{kW}$ kettle contains $0.80\,\text{kg}$ of water at $20\,^\circ\text{C}$. Assume no energy is lost to the surroundings.

| Quantity | Value |
| --- | --- |
| specific heat capacity of water | $4180\,\text{J kg}^{-1}\,\text{K}^{-1}$ |
| specific latent heat of vaporisation of water | $2.26 \times 10^{6}\,\text{J kg}^{-1}$ |

(a) Calculate the time taken to bring the water to $100\,^\circ\text{C}$.

(b) Calculate the further time needed to boil away $0.10\,\text{kg}$ of the water.`,
        markScheme: r`- $\Delta E = mc\Delta\theta = 0.80 \times 4180 \times 80 = 2.68 \times 10^{5}\,\text{J}$ (1)
- $t = 2.68 \times 10^{5}/2000 = 130\,\text{s}$ (134 s) (1)
- $\Delta E = mL = 0.10 \times 2.26 \times 10^{6} = 2.26 \times 10^{5}\,\text{J}$ (1)
- $t = 2.26 \times 10^{5}/2000 = 110\,\text{s}$ (113 s) (1)`,
        explanation: r`Heating changes temperature ($mc\Delta\theta$); boiling changes state at constant temperature ($mL$). Power is energy per second, so time = energy ÷ power.`,
    },
    {
        seedKey: "phy-wph15-thermodynamics-003",
        unitCode: "WPH15",
        topicSlug: "thermodynamics",
        type: "CALCULATION",
        difficulty: "HARD",
        marks: 4,
        stem: r`A $0.20\,\text{kg}$ copper block at $95\,^\circ\text{C}$ is dropped into $0.30\,\text{kg}$ of water at $20\,^\circ\text{C}$ in an insulated container of negligible heat capacity.

Specific heat capacity of copper $= 385\,\text{J kg}^{-1}\,\text{K}^{-1}$; of water $= 4180\,\text{J kg}^{-1}\,\text{K}^{-1}$.

Calculate the final temperature of the water. Give your answer to 3 significant figures.`,
        markScheme: r`- Energy lost by copper = energy gained by water (1)
- $0.20 \times 385 \times (95 - \theta) = 0.30 \times 4180 \times (\theta - 20)$ (1)
- $77(95 - \theta) = 1254(\theta - 20)$, so $1331\theta = 32\,395$ (1)
- $\theta = 24.3\,^\circ\text{C}$ (1)`,
        explanation: r`Water has a much higher specific heat capacity than copper, so the final temperature ends up close to the water's starting temperature.`,
    },

    // --- ideal-gases ---
    {
        seedKey: "phy-wph15-ideal-gases-001",
        unitCode: "WPH15",
        topicSlug: "ideal-gases",
        type: "MCQ",
        difficulty: "MEDIUM",
        marks: 1,
        stem: r`The temperature of an ideal gas is raised from $27\,^\circ\text{C}$ to $327\,^\circ\text{C}$. By what factor does the root-mean-square speed of its molecules increase?`,
        options: opts(r`$\sqrt{2}$`, "2", r`$\sqrt{12.1}$`, "12.1", "A"),
        markScheme: r`- **A** (1) — $T$ rises from $300\,\text{K}$ to $600\,\text{K}$ (doubles); $c_\text{rms} \propto \sqrt{T}$, so it increases by $\sqrt{2}$.`,
        explanation: r`Always convert to kelvin. Mean kinetic energy $\tfrac{1}{2}m\langle c^2\rangle = \tfrac{3}{2}kT$, so doubling $T$ doubles $\langle c^2\rangle$ but multiplies the rms speed by only $\sqrt{2}$. C and D use Celsius.`,
    },
    {
        seedKey: "phy-wph15-ideal-gases-002",
        unitCode: "WPH15",
        topicSlug: "ideal-gases",
        type: "CALCULATION",
        difficulty: "EASY",
        marks: 3,
        stem: r`A gas cylinder of volume $0.050\,\text{m}^3$ contains an ideal gas at a pressure of $2.0 \times 10^{5}\,\text{Pa}$ and a temperature of $20\,^\circ\text{C}$.

Calculate the number of molecules in the cylinder.`,
        markScheme: r`- Converts temperature: $T = 293\,\text{K}$ (1)
- $n = \dfrac{pV}{RT} = \dfrac{2.0 \times 10^{5} \times 0.050}{8.31 \times 293} = 4.1\,\text{mol}$ (1)
- $N = 4.1 \times 6.02 \times 10^{23} = 2.5 \times 10^{24}$ (1)`,
        explanation: r`Alternatively use $pV = NkT$ directly to get $N$. Using $20$ instead of $293$ for the temperature is the most common error.`,
    },
    {
        seedKey: "phy-wph15-ideal-gases-003",
        unitCode: "WPH15",
        topicSlug: "ideal-gases",
        type: "CALCULATION",
        difficulty: "MEDIUM",
        marks: 3,
        stem: r`Calculate the root-mean-square speed of nitrogen molecules at $300\,\text{K}$. The mass of a nitrogen molecule is $28\,\text{u}$.`,
        markScheme: r`- $m = 28 \times 1.66 \times 10^{-27} = 4.65 \times 10^{-26}\,\text{kg}$ (1)
- $\tfrac{1}{2}m\langle c^2\rangle = \tfrac{3}{2}kT$, so $\langle c^2\rangle = \dfrac{3 \times 1.38 \times 10^{-23} \times 300}{4.65 \times 10^{-26}}$ (1)
- $c_\text{rms} = 520\,\text{m s}^{-1}$ (517 m s⁻¹) (1)`,
        explanation: r`The mean kinetic energy of a molecule depends only on temperature, so lighter molecules move faster at the same temperature.`,
    },
    {
        seedKey: "phy-wph15-ideal-gases-004",
        unitCode: "WPH15",
        topicSlug: "ideal-gases",
        type: "LONG",
        difficulty: "HARD",
        marks: 6,
        stem: r`A sealed rigid container holds a fixed mass of gas. The gas is heated.

Use the kinetic theory of gases to explain why the pressure of the gas increases.`,
        markScheme: r`Indicative content:
- Molecules collide with the container walls and rebound, undergoing a change in momentum (1)
- By Newton's second law, a force is exerted on the molecules, equal to the rate of change of momentum; by Newton's third law, the molecules exert an equal and opposite force on the wall (1)
- Pressure is the total force per unit area on the walls (1)
- Heating increases the temperature, so the mean kinetic energy and mean speed of the molecules increase (1)
- The change in momentum per collision is greater (1)
- Collisions with the walls are more frequent, as the volume is constant; so the rate of change of momentum, and hence the pressure, increases (1)

Award 1 mark per relevant point, max 6.`,
        explanation: r`Both effects of a higher speed — bigger momentum change per collision and more collisions per second — increase the force on the walls. This gives $p \propto T$ at constant volume.`,
    },

    // --- nuclear-decay ---
    {
        seedKey: "phy-wph15-nuclear-decay-001",
        unitCode: "WPH15",
        topicSlug: "nuclear-decay",
        type: "MCQ",
        difficulty: "EASY",
        marks: 1,
        stem: r`A radioactive isotope has a half-life of $6.0\,\text{hours}$. What is its decay constant?`,
        options: opts(
            r`$3.2 \times 10^{-5}\,\text{s}^{-1}$`,
            r`$4.6 \times 10^{-5}\,\text{s}^{-1}$`,
            r`$0.12\,\text{s}^{-1}$`,
            r`$3.1 \times 10^{4}\,\text{s}^{-1}$`,
            "A",
        ),
        markScheme: r`- **A** (1) — $\lambda = \ln 2/t_{1/2} = 0.693/(6.0 \times 3600) = 3.2 \times 10^{-5}\,\text{s}^{-1}$.`,
        explanation: r`$\lambda = \ln 2 / t_{1/2}$ with the half-life in seconds. B uses $1/t_{1/2}$ without $\ln 2$; C uses hours ($\text{h}^{-1}$); D inverts the relationship.`,
    },
    {
        seedKey: "phy-wph15-nuclear-decay-002",
        unitCode: "WPH15",
        topicSlug: "nuclear-decay",
        type: "CALCULATION",
        difficulty: "MEDIUM",
        marks: 4,
        stem: r`A sample of iodine-131 has an initial activity of $4.0 \times 10^{6}\,\text{Bq}$. The half-life of iodine-131 is $8.0\,\text{days}$.

(a) Calculate the number of iodine-131 nuclei initially present.

(b) Calculate the activity of the sample after $20$ days.`,
        markScheme: r`- $\lambda = \dfrac{\ln 2}{8.0 \times 86\,400} = 1.0 \times 10^{-6}\,\text{s}^{-1}$ (1)
- $N = A/\lambda = 4.0 \times 10^{6}/1.0 \times 10^{-6} = 4.0 \times 10^{12}$ (1)
- $A = A_0e^{-\lambda t}$ or $A = A_0(\tfrac{1}{2})^{20/8.0} = 4.0 \times 10^{6} \times 2^{-2.5}$ (1)
- $A = 7.1 \times 10^{5}\,\text{Bq}$ (1)`,
        explanation: r`Activity $A = \lambda N$ needs $\lambda$ in $\text{s}^{-1}$ because the becquerel is decays per second. 20 days is 2.5 half-lives, so the activity is between a quarter and an eighth of the original.`,
    },
    {
        seedKey: "phy-wph15-nuclear-decay-003",
        unitCode: "WPH15",
        topicSlug: "nuclear-decay",
        type: "SHORT",
        difficulty: "MEDIUM",
        marks: 3,
        stem: r`(a) Radioactive decay is described as both **random** and **spontaneous**. Explain what each term means.

(b) When measuring the count rate from a source, a student first records the count rate with no source present. Explain why.`,
        markScheme: r`- Random: it is impossible to predict which nucleus will decay next or when a particular nucleus will decay (only a probability is known) (1)
- Spontaneous: the decay is not affected by external factors such as temperature or pressure (1)
- To measure the background count rate, which is subtracted from each reading to give the count rate due to the source alone (1)`,
        explanation: r`Randomness is why count rates fluctuate and repeat readings are needed. Background radiation comes from rocks, cosmic rays, etc., and is always present.`,
    },

    // --- binding-energy ---
    {
        seedKey: "phy-wph15-binding-energy-001",
        unitCode: "WPH15",
        topicSlug: "binding-energy",
        type: "MCQ",
        difficulty: "MEDIUM",
        marks: 1,
        stem: r`Both the fission of uranium-235 and the fusion of hydrogen isotopes release energy. This is because in both processes`,
        options: opts(
            "the total number of nucleons decreases",
            "the binding energy per nucleon of the products is greater than that of the reactants",
            "the products have more mass than the reactants",
            "the binding energy per nucleon of the products is less than that of the reactants",
            "B",
        ),
        markScheme: r`- **B** (1) — both processes move towards the peak of the binding-energy-per-nucleon curve (near iron-56), so the products are more tightly bound.`,
        explanation: r`Greater binding energy per nucleon means lower mass per nucleon; the mass lost appears as released energy ($\Delta E = c^2\Delta m$). Nucleon number is conserved (A is wrong).`,
    },
    {
        seedKey: "phy-wph15-binding-energy-002",
        unitCode: "WPH15",
        topicSlug: "binding-energy",
        type: "CALCULATION",
        difficulty: "MEDIUM",
        marks: 4,
        stem: r`Use the data to calculate the binding energy per nucleon of a helium-4 nucleus, in MeV.

| Particle | Mass / u |
| --- | --- |
| proton | 1.007 276 |
| neutron | 1.008 665 |
| helium-4 nucleus | 4.001 506 |

$1\,\text{u}$ is equivalent to $931.5\,\text{MeV}$.`,
        markScheme: r`- Mass of separate nucleons $= 2(1.007\,276) + 2(1.008\,665) = 4.031\,882\,\text{u}$ (1)
- Mass defect $= 4.031\,882 - 4.001\,506 = 0.030\,376\,\text{u}$ (1)
- Binding energy $= 0.030\,376 \times 931.5 = 28.3\,\text{MeV}$ (1)
- Binding energy per nucleon $= 28.3/4 = 7.07\,\text{MeV}$ (1)`,
        explanation: r`The mass defect is the difference between the mass of the separate nucleons and the mass of the nucleus. Keep all the decimal places until the end — the defect is a small difference between large numbers.`,
    },
    {
        seedKey: "phy-wph15-binding-energy-003",
        unitCode: "WPH15",
        topicSlug: "binding-energy",
        type: "SHORT",
        difficulty: "MEDIUM",
        marks: 3,
        stem: r`Explain why nuclear fusion only occurs at very high temperatures and densities, such as in the core of a star.`,
        markScheme: r`- Nuclei are positively charged and repel each other electrostatically (1)
- A very high temperature gives nuclei enough kinetic energy to overcome the repulsion and get close enough for the strong force to act (1)
- A high density makes collisions frequent enough for a significant fusion rate (1)`,
        explanation: r`The strong nuclear force only acts over about $10^{-15}\,\text{m}$, so nuclei must be forced extremely close together against Coulomb repulsion.`,
    },

    // --- oscillations ---
    {
        seedKey: "phy-wph15-oscillations-001",
        unitCode: "WPH15",
        topicSlug: "oscillations",
        type: "MCQ",
        difficulty: "EASY",
        marks: 1,
        stem: r`An object is moving with simple harmonic motion. At the point of **maximum displacement**, which statement is correct?`,
        options: opts(
            "Velocity is maximum and acceleration is zero.",
            "Velocity is zero and acceleration is zero.",
            "Velocity is zero and acceleration is maximum.",
            "Velocity is maximum and acceleration is maximum.",
            "C",
        ),
        markScheme: r`- **C** (1) — $a = -\omega^2 x$ is greatest when $|x|$ is greatest, and the object momentarily stops as it turns round.`,
        explanation: r`In SHM acceleration is proportional to displacement and directed towards equilibrium. Speed is maximum at the equilibrium position, where acceleration is zero.`,
    },
    {
        seedKey: "phy-wph15-oscillations-002",
        unitCode: "WPH15",
        topicSlug: "oscillations",
        type: "CALCULATION",
        difficulty: "MEDIUM",
        marks: 4,
        stem: r`A mass of $0.40\,\text{kg}$ hangs from a spring of stiffness $25\,\text{N m}^{-1}$. It is pulled down $5.0\,\text{cm}$ from equilibrium and released, so it oscillates with simple harmonic motion.

(a) Calculate the period of oscillation.

(b) Calculate the maximum speed of the mass.`,
        markScheme: r`- $T = 2\pi\sqrt{m/k} = 2\pi\sqrt{0.40/25}$ (1)
- $T = 0.79\,\text{s}$ (1)
- $\omega = 2\pi/T = 7.9\,\text{rad s}^{-1}$ (1)
- $v_\text{max} = \omega A = 7.9 \times 0.050 = 0.40\,\text{m s}^{-1}$ (1)`,
        explanation: r`The amplitude is the initial displacement, $0.050\,\text{m}$. Maximum speed occurs at equilibrium, where $v = \omega A$.`,
    },
    {
        seedKey: "phy-wph15-oscillations-003",
        unitCode: "WPH15",
        topicSlug: "oscillations",
        type: "MCQ",
        difficulty: "EASY",
        marks: 1,
        stem: r`What length of simple pendulum has a period of $2.0\,\text{s}$?`,
        options: opts(r`$0.10\,\text{m}$`, r`$0.50\,\text{m}$`, r`$0.99\,\text{m}$`, r`$3.1\,\text{m}$`, "C"),
        markScheme: r`- **C** (1) — $T = 2\pi\sqrt{l/g}$ gives $l = gT^2/4\pi^2 = 9.81 \times 4.0/39.5 = 0.99\,\text{m}$.`,
        explanation: r`Rearrange carefully: square both sides first. B forgets to square $T$ and A leaves out $g$; the period does not depend on the mass of the bob.`,
    },
    {
        seedKey: "phy-wph15-oscillations-004",
        unitCode: "WPH15",
        topicSlug: "oscillations",
        type: "LONG",
        difficulty: "HARD",
        marks: 6,
        stem: r`Tall buildings can sway when the wind or an earthquake makes them oscillate. Engineers fit large dampers to reduce this.

Explain what is meant by resonance, why it can be dangerous for a building, and how damping reduces the danger.`,
        markScheme: r`Indicative content:
- Resonance occurs when a system is forced to oscillate at (or near) its natural frequency (1)
- Energy is transferred to the system most efficiently, so the amplitude becomes very large (1)
- A building has a natural frequency; if the driving frequency (e.g. from earthquake waves or wind) matches it, it resonates (1)
- Large amplitude oscillations produce large stresses that can damage or collapse the structure (1)
- Damping removes energy from the oscillating system (e.g. by doing work against friction/viscous forces, transferring it to thermal energy) (1)
- Damping reduces the maximum amplitude at resonance and broadens the resonance peak (and lowers the resonant frequency slightly) (1)

Award 1 mark per relevant point, max 6.`,
        explanation: r`At resonance the driver's energy input each cycle is greatest. Damping cannot change the building's natural frequency much, but it limits how big the oscillations can grow.`,
    },

    // --- gravitational-fields ---
    {
        seedKey: "phy-wph15-gravitational-fields-001",
        unitCode: "WPH15",
        topicSlug: "gravitational-fields",
        type: "MCQ",
        difficulty: "MEDIUM",
        marks: 1,
        stem: r`The gravitational field strength at the Earth's surface is $g$. What is the gravitational field strength at a height above the surface equal to the Earth's radius?`,
        options: opts(r`$g/2$`, r`$g/4$`, r`$g/8$`, r`$g$`, "B"),
        markScheme: r`- **B** (1) — the distance from the Earth's centre doubles, and $g \propto 1/r^2$.`,
        explanation: r`Distances in Newton's law of gravitation are measured from the **centre** of the planet. A height of one radius means $r = 2R$, so $g$ falls to $1/2^2 = 1/4$.`,
    },
    {
        seedKey: "phy-wph15-gravitational-fields-002",
        unitCode: "WPH15",
        topicSlug: "gravitational-fields",
        type: "CALCULATION",
        difficulty: "HARD",
        marks: 4,
        stem: r`A geostationary satellite orbits the Earth with a period of $24\,\text{hours}$. The mass of the Earth is $5.97 \times 10^{24}\,\text{kg}$.

Show that the radius of a geostationary orbit is about $4 \times 10^{7}\,\text{m}$.`,
        markScheme: r`- Gravitational force provides centripetal force: $\dfrac{GMm}{r^2} = m\omega^2 r$ (1)
- $\omega = 2\pi/T$ with $T = 86\,400\,\text{s}$, giving $r^3 = \dfrac{GMT^2}{4\pi^2}$ (1)
- $r^3 = \dfrac{6.67 \times 10^{-11} \times 5.97 \times 10^{24} \times 86\,400^2}{4\pi^2} = 7.5 \times 10^{22}\,\text{m}^3$ (1)
- $r = 4.2 \times 10^{7}\,\text{m}$ (1)`,
        explanation: r`The satellite's mass cancels, so every geostationary satellite has the same orbital radius. In a "show that" question give your answer to one more significant figure than the value stated.`,
    },
    {
        seedKey: "phy-wph15-gravitational-fields-003",
        unitCode: "WPH15",
        topicSlug: "gravitational-fields",
        type: "SHORT",
        difficulty: "MEDIUM",
        marks: 3,
        stem: r`Compare the gravitational field of a point mass with the electric field of a point charge. Give one similarity and two differences.`,
        markScheme: r`- Similarity: both are radial fields obeying an inverse-square law ($g \propto 1/r^2$, $E \propto 1/r^2$) (1)
- Difference: gravitational forces are always attractive, whereas electric forces can be attractive or repulsive (1)
- Difference: gravity acts on mass and electric fields act on charge, or the gravitational force is far weaker for comparable particles (1)`,
        explanation: r`The equations $F = Gm_1m_2/r^2$ and $F = kQ_1Q_2/r^2$ have identical forms. Because there is no "negative mass", gravity can never repel.`,
    },

    // --- astrophysics-cosmology ---
    {
        seedKey: "phy-wph15-astrophysics-cosmology-001",
        unitCode: "WPH15",
        topicSlug: "astrophysics-cosmology",
        type: "MCQ",
        difficulty: "EASY",
        marks: 1,
        stem: r`The spectrum of a star has its peak intensity at a wavelength of $500\,\text{nm}$. Wien's law constant is $2.898 \times 10^{-3}\,\text{m K}$.

What is the surface temperature of the star?`,
        options: opts(r`$1.4\,\text{K}$`, r`$580\,\text{K}$`, r`$5800\,\text{K}$`, r`$1.7 \times 10^{5}\,\text{K}$`, "C"),
        markScheme: r`- **C** (1) — $T = 2.898 \times 10^{-3}/500 \times 10^{-9} = 5800\,\text{K}$.`,
        explanation: r`Wien's law $\lambda_\text{max}T = 2.898 \times 10^{-3}\,\text{m K}$: hotter stars peak at shorter wavelengths. Our Sun has a surface temperature of about 5800 K.`,
    },
    {
        seedKey: "phy-wph15-astrophysics-cosmology-002",
        unitCode: "WPH15",
        topicSlug: "astrophysics-cosmology",
        type: "CALCULATION",
        difficulty: "MEDIUM",
        marks: 3,
        stem: r`A star has a luminosity of $5.0 \times 10^{28}\,\text{W}$ and a surface temperature of $9000\,\text{K}$.

Calculate the radius of the star.`,
        markScheme: r`- Uses Stefan–Boltzmann law $L = 4\pi r^2\sigma T^4$ (1)
- $r^2 = \dfrac{5.0 \times 10^{28}}{4\pi \times 5.67 \times 10^{-8} \times 9000^4}$ (1)
- $r = 3.3 \times 10^{9}\,\text{m}$ (1)`,
        explanation: r`Luminosity depends very strongly on temperature ($T^4$) and on surface area ($4\pi r^2$). Remember to take the square root at the end.`,
    },
    {
        seedKey: "phy-wph15-astrophysics-cosmology-003",
        unitCode: "WPH15",
        topicSlug: "astrophysics-cosmology",
        type: "CALCULATION",
        difficulty: "HARD",
        marks: 4,
        stem: r`The hydrogen-alpha line has a wavelength of $656.3\,\text{nm}$ in the laboratory. In the spectrum of a distant galaxy it is observed at $669.4\,\text{nm}$. Take the Hubble constant $H_0 = 2.3 \times 10^{-18}\,\text{s}^{-1}$.

(a) Calculate the recession velocity of the galaxy.

(b) Calculate the distance to the galaxy.

(c) Use $H_0$ to estimate the age of the universe in years. ($1\,\text{year} = 3.15 \times 10^{7}\,\text{s}$)`,
        markScheme: r`- $z = \Delta\lambda/\lambda = 13.1/656.3 = 0.020$ (1)
- $v = zc = 0.020 \times 3.00 \times 10^{8} = 6.0 \times 10^{6}\,\text{m s}^{-1}$ (1)
- $d = v/H_0 = 6.0 \times 10^{6}/2.3 \times 10^{-18} = 2.6 \times 10^{24}\,\text{m}$ (1)
- Age $\approx 1/H_0 = 4.3 \times 10^{17}\,\text{s} = 1.4 \times 10^{10}\,\text{years}$ (1)`,
        explanation: r`Red shift ($\lambda$ increases) shows the galaxy is receding. Hubble's law $v = H_0d$ means $1/H_0$ is the time for galaxies to reach their current separation at constant speed — an estimate of the age of the universe.`,
    },
    {
        seedKey: "phy-wph15-astrophysics-cosmology-004",
        unitCode: "WPH15",
        topicSlug: "astrophysics-cosmology",
        type: "LONG",
        difficulty: "HARD",
        marks: 6,
        stem: r`Astronomers use trigonometric parallax for nearby stars and standard candles for more distant objects.

Explain how each method is used to determine the distance to a star or galaxy, and why standard candles are needed for very distant objects.`,
        markScheme: r`Indicative content:
- Parallax: the apparent position of a nearby star is measured against distant background stars at two times six months apart (1)
- The parallax angle and the radius of the Earth's orbit (1 AU) give the distance using trigonometry, $d = r/\tan\theta$ (or $d \approx r/\theta$) (1)
- For very distant stars the parallax angle is too small to measure accurately, so parallax only works to a limited distance (1)
- A standard candle is an object of known luminosity (e.g. a Cepheid variable or a type Ia supernova) (1)
- Its radiation flux (intensity) $F$ is measured at the Earth (1)
- The distance is calculated from the inverse-square law $F = \dfrac{L}{4\pi d^2}$ (1)

Award 1 mark per relevant point, max 6.`,
        explanation: r`Parallax is a direct geometric measurement but limited by the smallest angle we can measure. Standard candles extend the distance ladder because brightness can be measured however far away the source is, provided we know its luminosity.`,
    },
];

// ---------------------------------------------------------------------------------------------------------------
// WPH16 — Practical Skills in Physics II
// ---------------------------------------------------------------------------------------------------------------
const wph16: SeedQuestion[] = [
    // --- advanced-uncertainty ---
    {
        seedKey: "phy-wph16-advanced-uncertainty-001",
        unitCode: "WPH16",
        topicSlug: "advanced-uncertainty",
        type: "CALCULATION",
        difficulty: "HARD",
        marks: 4,
        stem: r`A student determines the density of a metal cylinder using these measurements:

| Quantity | Measurement |
| --- | --- |
| mass $m$ | $45.2 \pm 0.1\,\text{g}$ |
| diameter $d$ | $2.00 \pm 0.01\,\text{cm}$ |
| length $L$ | $5.00 \pm 0.05\,\text{cm}$ |

Calculate the density in $\text{kg m}^{-3}$ and its absolute uncertainty.`,
        markScheme: r`- $\rho = \dfrac{m}{\pi (d/2)^2 L} = \dfrac{45.2}{\pi \times 1.00^2 \times 5.00} = 2.88\,\text{g cm}^{-3} = 2880\,\text{kg m}^{-3}$ (1)
- Percentage uncertainties: $m$ 0.2%, $d$ 0.5%, $L$ 1.0% (1)
- Total $= 0.2 + 2 \times 0.5 + 1.0 = 2.2\%$ (diameter doubled because it is squared) (1)
- Absolute uncertainty $= 0.022 \times 2880 = 60\,\text{kg m}^{-3}$, so $\rho = (2880 \pm 60)\,\text{kg m}^{-3}$ (1)`,
        explanation: r`When quantities are multiplied or divided, add percentage uncertainties; a quantity raised to a power $n$ contributes $n$ times its percentage uncertainty.`,
    },
    {
        seedKey: "phy-wph16-advanced-uncertainty-002",
        unitCode: "WPH16",
        topicSlug: "advanced-uncertainty",
        type: "MCQ",
        difficulty: "MEDIUM",
        marks: 1,
        stem: r`A student times 20 complete oscillations of a pendulum as $32.4 \pm 0.2\,\text{s}$.

What is the period of the pendulum with its uncertainty?`,
        options: opts(
            r`$1.62 \pm 0.01\,\text{s}$`,
            r`$1.62 \pm 0.2\,\text{s}$`,
            r`$1.62 \pm 0.10\,\text{s}$`,
            r`$1.6 \pm 4\,\text{s}$`,
            "A",
        ),
        markScheme: r`- **A** (1) — dividing by an exact number divides the absolute uncertainty too: $0.2/20 = 0.01\,\text{s}$.`,
        explanation: r`The percentage uncertainty (0.6%) stays the same. Timing many oscillations is a standard way of reducing the uncertainty in a single period.`,
    },

    // --- logarithmic-graphs ---
    {
        seedKey: "phy-wph16-logarithmic-graphs-001",
        unitCode: "WPH16",
        topicSlug: "logarithmic-graphs",
        type: "CALCULATION",
        difficulty: "HARD",
        marks: 4,
        stem: r`A capacitor discharges through a $100\,\text{k}\Omega$ resistor. The potential difference $V$ across it is given by $V = V_0e^{-t/RC}$.

(a) Explain why a graph of $\ln V$ against $t$ is a straight line.

(b) The gradient of this graph is $-0.045\,\text{s}^{-1}$. Calculate the capacitance.`,
        markScheme: r`- Taking natural logs: $\ln V = \ln V_0 - \dfrac{t}{RC}$ (1)
- This has the form $y = mx + c$ with $y = \ln V$, $x = t$, gradient $-1/RC$ and intercept $\ln V_0$ (1)
- $RC = 1/0.045 = 22\,\text{s}$ (1)
- $C = 22/(100 \times 10^{3}) = 2.2 \times 10^{-4}\,\text{F}$ ($220\,\mu\text{F}$) (1)`,
        explanation: r`Logarithms turn an exponential into a straight line, making it easy to check the relationship and find the time constant from the gradient.`,
    },
    {
        seedKey: "phy-wph16-logarithmic-graphs-002",
        unitCode: "WPH16",
        topicSlug: "logarithmic-graphs",
        type: "MCQ",
        difficulty: "MEDIUM",
        marks: 1,
        stem: r`Two variables are thought to be related by $T = kl^n$, where $k$ and $n$ are constants.

Which graph would give a straight line with gradient $n$?`,
        options: opts(r`$T$ against $l$`, r`$\lg T$ against $l$`, r`$\lg T$ against $\lg l$`, r`$T$ against $\lg l$`, "C"),
        markScheme: r`- **C** (1) — $\lg T = n\lg l + \lg k$, so the gradient is $n$ and the intercept is $\lg k$.`,
        explanation: r`For a power law take logs of both variables (log–log graph). For an exponential such as $y = Ae^{-kx}$ you would plot $\ln y$ against $x$ instead.`,
    },

    // --- core-practicals ---
    {
        seedKey: "phy-wph16-core-practicals-001",
        unitCode: "WPH16",
        topicSlug: "core-practicals",
        type: "SHORT",
        difficulty: "MEDIUM",
        marks: 3,
        stem: r`In the core practical to determine the viscosity of a liquid, small ball bearings are dropped into a tall tube of the liquid and timed between two marks.

(a) Explain why the upper mark is placed well below the surface of the liquid.

(b) Describe how the student could check that the ball has reached terminal velocity before the timed section.`,
        markScheme: r`- The ball accelerates at first, so the upper mark must be below the point where it reaches terminal velocity (1)
- Use several equally spaced marks (or a series of rubber bands) down the tube and time the ball between successive marks (1)
- If the times between successive marks are equal, the ball is moving at constant (terminal) velocity (1)`,
        explanation: r`Stokes' law calculations assume the drag balances (weight − upthrust), which only happens at terminal velocity. Equal times for equal distances confirm constant speed.`,
    },
    {
        seedKey: "phy-wph16-core-practicals-002",
        unitCode: "WPH16",
        topicSlug: "core-practicals",
        type: "SHORT",
        difficulty: "MEDIUM",
        marks: 3,
        stem: r`In the core practical to determine the Young modulus of a metal, a long thin wire is loaded with masses and its extension is measured.

(a) Explain why a **long, thin** wire is used.

(b) Explain why the diameter of the wire is measured at several points along its length and in different orientations.`,
        markScheme: r`- A long, thin wire gives a larger extension for a given load (1)
- So the percentage uncertainty in the extension is smaller (1)
- The wire may not be uniform or perfectly circular, so a mean diameter is calculated to reduce the effect of random variation (1)`,
        explanation: r`Extension is $\Delta x = FL/(AE)$, so increasing $L$ and decreasing $A$ both increase it. The diameter is squared in the calculation, so measuring it carefully matters a lot.`,
    },
];

export const physicsQuestions: SeedQuestion[] = [...wph11, ...wph12, ...wph13, ...wph14, ...wph15, ...wph16];
