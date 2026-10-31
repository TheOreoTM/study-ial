import type { SeedQuestion } from "../types";

// Original IAL-style practice questions for the applied Mathematics units (WME01, WME02, WST01, WST02, WDM11),
// written for this app, not taken from Pearson papers. Every question is a DRAFT until an admin reviews it.
// Mechanics uses g = 9.8 m s^-2 (IAL convention) with answers to 2 or 3 s.f.; statistics questions quote any table
// values they need; decision maths gives networks as edge lists or distance tables because images are not supported.

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
// WME01 — Mechanics 1
// ---------------------------------------------------------------------------------------------------------------
const wme01: SeedQuestion[] = [
    // --- mathematical-models ---
    {
        seedKey: "mat-wme01-mathematical-models-001",
        unitCode: "WME01",
        topicSlug: "mathematical-models",
        type: "MCQ",
        difficulty: "EASY",
        marks: 1,
        status: "DRAFT",
        stem: r`Two particles are joined by a string that is modelled as **inextensible**. What does this modelling assumption allow you to say?`,
        options: opts(
            "The tension is the same throughout the string",
            "The particles have accelerations of equal magnitude",
            "There is no friction acting on either particle",
            "The mass of the string can be ignored",
            "B",
        ),
        markScheme: r`- **B** (1) — an inextensible string cannot stretch, so both particles move the same distance and have the same speed and acceleration.`,
        explanation: r`Equal tension throughout comes from the string being **light** (and the pulley smooth), not from it being inextensible. Students often swap these two assumptions.`,
    },
    {
        seedKey: "mat-wme01-mathematical-models-002",
        unitCode: "WME01",
        topicSlug: "mathematical-models",
        type: "SHORT",
        difficulty: "EASY",
        marks: 3,
        status: "DRAFT",
        stem: r`A crate is dragged across a horizontal floor by a rope. In a model of the motion, the crate is modelled as a **particle** and the rope is modelled as **light**.

(a) Explain what is meant by modelling the crate as a particle, and state one consequence of this for the model.

(b) Explain what is meant by modelling the rope as light.`,
        markScheme: r`- (a) The dimensions/size of the crate are negligible, so its mass is concentrated at a single point (1)
- (a) Consequence: the crate does not rotate / air resistance is ignored / all forces act at one point (1)
- (b) The rope has negligible mass, so the tension is the same at every point along the rope (1)`,
        explanation: r`When asked what an assumption means, give both the definition and its effect on the model: "light" means negligible mass **and therefore** uniform tension.`,
    },

    // --- vectors-in-mechanics ---
    {
        seedKey: "mat-wme01-vectors-in-mechanics-001",
        unitCode: "WME01",
        topicSlug: "vectors-in-mechanics",
        type: "MCQ",
        difficulty: "EASY",
        marks: 1,
        status: "DRAFT",
        stem: r`Two forces $(3\mathbf{i} - 4\mathbf{j})\,\text{N}$ and $(5\mathbf{i} + 10\mathbf{j})\,\text{N}$ act on a particle. What is the magnitude of the resultant force?`,
        options: opts(r`$10\,\text{N}$`, r`$14\,\text{N}$`, r`$16.1\,\text{N}$`, r`$16.2\,\text{N}$`, "A"),
        markScheme: r`- **A** (1) — resultant $= 8\mathbf{i} + 6\mathbf{j}$, magnitude $\sqrt{8^2 + 6^2} = 10\,\text{N}$.`,
        explanation: r`Add the vectors first, then find the magnitude. Adding the two magnitudes ($5 + 11.2 = 16.2$) or dropping the minus sign on $-4\mathbf{j}$ ($\sqrt{8^2 + 14^2} = 16.1$) are the usual slips.`,
    },
    {
        seedKey: "mat-wme01-vectors-in-mechanics-002",
        unitCode: "WME01",
        topicSlug: "vectors-in-mechanics",
        type: "CALCULATION",
        difficulty: "MEDIUM",
        marks: 5,
        status: "DRAFT",
        stem: r`[In this question $\mathbf{i}$ and $\mathbf{j}$ are unit vectors due east and due north, and distances are in km.]

At noon, ship $A$ is at the point with position vector $(2\mathbf{i} + 5\mathbf{j})$ and ship $B$ is at $(-4\mathbf{i} + 3\mathbf{j})$. Ship $A$ moves with constant velocity $(3\mathbf{i} - \mathbf{j})\,\text{km h}^{-1}$ and ship $B$ moves with constant velocity $(5\mathbf{i} + \mathbf{j})\,\text{km h}^{-1}$.

(a) Find the speed of ship $A$.

(b) Find the time at which ship $B$ is due north of ship $A$, and the distance between the ships at that time.`,
        markScheme: r`- (a) Speed $= \sqrt{3^2 + (-1)^2} = 3.16\,\text{km h}^{-1}$ (1)
- (b) **M1** Position vectors $t$ hours after noon: $\mathbf{r}_A = (2 + 3t)\mathbf{i} + (5 - t)\mathbf{j}$, $\mathbf{r}_B = (-4 + 5t)\mathbf{i} + (3 + t)\mathbf{j}$ (1)
- **M1** Due north means equal $\mathbf{i}$ components: $2 + 3t = -4 + 5t$ (1)
- **A1** $t = 3$, i.e. at 15:00 (1)
- **A1** $\mathbf{r}_A = 11\mathbf{i} + 2\mathbf{j}$, $\mathbf{r}_B = 11\mathbf{i} + 6\mathbf{j}$, so the distance is $4\,\text{km}$ (1)`,
        explanation: r`Use $\mathbf{r} = \mathbf{r}_0 + t\mathbf{v}$ for each ship. "Due north of" fixes the **east** ($\mathbf{i}$) components as equal — setting the $\mathbf{j}$ components equal is the common error.`,
    },
    {
        seedKey: "mat-wme01-vectors-in-mechanics-003",
        unitCode: "WME01",
        topicSlug: "vectors-in-mechanics",
        type: "CALCULATION",
        difficulty: "HARD",
        marks: 5,
        status: "DRAFT",
        stem: r`A particle of mass $0.5\,\text{kg}$ is acted on by two forces, $\mathbf{F}_1 = (4\mathbf{i} - 2\mathbf{j})\,\text{N}$ and $\mathbf{F}_2 = (a\mathbf{i} + b\mathbf{j})\,\text{N}$, where $a$ and $b$ are constants. No other forces act. The particle accelerates at $10\,\text{m s}^{-2}$ in the direction of the vector $(3\mathbf{i} + 4\mathbf{j})$.

Find the values of $a$ and $b$.`,
        markScheme: r`- **M1** Unit vector in direction $3\mathbf{i} + 4\mathbf{j}$ is $\tfrac{1}{5}(3\mathbf{i} + 4\mathbf{j})$ (1)
- **A1** Acceleration $= 10 \times \tfrac{1}{5}(3\mathbf{i} + 4\mathbf{j}) = (6\mathbf{i} + 8\mathbf{j})\,\text{m s}^{-2}$ (1)
- **M1** $\mathbf{F} = m\mathbf{a}$: $(4 + a)\mathbf{i} + (b - 2)\mathbf{j} = 0.5(6\mathbf{i} + 8\mathbf{j}) = 3\mathbf{i} + 4\mathbf{j}$ (1)
- **A1** $a = -1$ (1)
- **A1** $b = 6$ (1)`,
        explanation: r`The acceleration's direction is given by $3\mathbf{i} + 4\mathbf{j}$ but its size is 10, so scale the **unit** vector. Then $\mathbf{F}_1 + \mathbf{F}_2 = m\mathbf{a}$ and compare components.`,
    },

    // --- kinematics ---
    {
        seedKey: "mat-wme01-kinematics-001",
        unitCode: "WME01",
        topicSlug: "kinematics",
        type: "MCQ",
        difficulty: "EASY",
        marks: 1,
        status: "DRAFT",
        stem: r`A car travelling at $20\,\text{m s}^{-1}$ decelerates uniformly and comes to rest after travelling $50\,\text{m}$. What is the magnitude of its deceleration?`,
        options: opts(
            r`$0.4\,\text{m s}^{-2}$`,
            r`$2\,\text{m s}^{-2}$`,
            r`$4\,\text{m s}^{-2}$`,
            r`$8\,\text{m s}^{-2}$`,
            "C",
        ),
        markScheme: r`- **C** (1) — $v^2 = u^2 + 2as$: $0 = 400 + 100a$, so $a = -4\,\text{m s}^{-2}$.`,
        explanation: r`Choose the suvat equation without $t$. Dividing speed by distance ($20/50$) or forgetting the factor 2 ($400/50$) gives the distractors.`,
    },
    {
        seedKey: "mat-wme01-kinematics-002",
        unitCode: "WME01",
        topicSlug: "kinematics",
        type: "CALCULATION",
        difficulty: "MEDIUM",
        marks: 5,
        status: "DRAFT",
        stem: r`A train starts from rest at station $P$. It accelerates uniformly for $30\,\text{s}$ until it reaches a speed of $V\,\text{m s}^{-1}$. It then travels at this constant speed for $100\,\text{s}$, and finally decelerates uniformly for $20\,\text{s}$, coming to rest at station $Q$. The distance from $P$ to $Q$ is $2.5\,\text{km}$.

(a) Using a speed–time graph, or otherwise, find the value of $V$.

(b) Find the acceleration of the train during the first $30\,\text{s}$.

(c) Find the distance travelled by the train in the first $40\,\text{s}$.`,
        markScheme: r`- (a) **M1** Distance = area under speed–time graph, a trapezium with parallel sides $150$ and $100$ (1)
- **M1** $\tfrac{1}{2}(150 + 100)V = 2500$ (1)
- **A1** $V = 20$ (1)
- (b) $a = \dfrac{20}{30} = 0.667\,\text{m s}^{-2}$ (1)
- (c) $\tfrac{1}{2} \times 30 \times 20 + 10 \times 20 = 500\,\text{m}$ (1)`,
        explanation: r`The total time is $30 + 100 + 20 = 150\,\text{s}$. Using units consistently matters: $2.5\,\text{km} = 2500\,\text{m}$.`,
    },
    {
        seedKey: "mat-wme01-kinematics-003",
        unitCode: "WME01",
        topicSlug: "kinematics",
        type: "CALCULATION",
        difficulty: "HARD",
        marks: 6,
        status: "DRAFT",
        stem: r`A small ball is projected vertically upwards with speed $19.6\,\text{m s}^{-1}$ from a point $A$ which is $24.5\,\text{m}$ above horizontal ground. The ball is modelled as a particle moving freely under gravity.

(a) Find the time taken for the ball to reach the ground.

(b) Find the speed of the ball as it hits the ground.

(c) Find the total time for which the ball is at least $14.7\,\text{m}$ above $A$.`,
        markScheme: r`- (a) **M1** Taking up as positive: $-24.5 = 19.6t - 4.9t^2$ (1)
- **A1** $t^2 - 4t - 5 = 0$, so $t = 5\,\text{s}$ (1)
- (b) $v = 19.6 - 9.8 \times 5 = -29.4$, so speed $29.4\,\text{m s}^{-1}$ (1)
- (c) **M1** $14.7 = 19.6t - 4.9t^2$ (1)
- **A1** $t^2 - 4t + 3 = 0$, so $t = 1$ or $t = 3$ (1)
- **A1** Time at least $14.7\,\text{m}$ above $A$ is $3 - 1 = 2\,\text{s}$ (1)`,
        explanation: r`Treat the whole flight as one motion with $a = -9.8$: the displacement to the ground is $-24.5\,\text{m}$. In (c) the two roots are the times the ball passes the level on the way up and on the way down.`,
    },

    // --- dynamics ---
    {
        seedKey: "mat-wme01-dynamics-001",
        unitCode: "WME01",
        topicSlug: "dynamics",
        type: "MCQ",
        difficulty: "EASY",
        marks: 1,
        status: "DRAFT",
        stem: r`Particles of mass $3\,\text{kg}$ and $5\,\text{kg}$ are attached to the ends of a light inextensible string that passes over a smooth fixed pulley. The particles hang freely and are released from rest. What is the magnitude of their acceleration? ($g = 9.8\,\text{m s}^{-2}$)`,
        options: opts(
            r`$0.25\,\text{m s}^{-2}$`,
            r`$2.45\,\text{m s}^{-2}$`,
            r`$3.92\,\text{m s}^{-2}$`,
            r`$6.53\,\text{m s}^{-2}$`,
            "B",
        ),
        markScheme: r`- **B** (1) — whole system: $(5 - 3)g = (5 + 3)a$, so $a = \tfrac{2 \times 9.8}{8} = 2.45\,\text{m s}^{-2}$.`,
        explanation: r`The resultant force $2g$ accelerates **both** masses, so divide by $8\,\text{kg}$, not by $5\,\text{kg}$ ($3.92$) or $3\,\text{kg}$ ($6.53$).`,
    },
    {
        seedKey: "mat-wme01-dynamics-002",
        unitCode: "WME01",
        topicSlug: "dynamics",
        type: "CALCULATION",
        difficulty: "HARD",
        marks: 7,
        status: "DRAFT",
        stem: r`A block $A$ of mass $4\,\text{kg}$ rests on a rough horizontal table. The coefficient of friction between $A$ and the table is $0.25$. $A$ is attached to one end of a light inextensible string which passes over a small smooth pulley at the edge of the table. The other end of the string is attached to a particle $B$ of mass $2\,\text{kg}$, which hangs freely $0.5\,\text{m}$ above the floor. The system is released from rest with the string taut. $B$ hits the floor and does not rebound; $A$ does not reach the pulley.

(a) Find the acceleration of the system and the tension in the string before $B$ hits the floor.

(b) Find the further distance travelled by $A$ after $B$ hits the floor before $A$ comes to rest.`,
        markScheme: r`- (a) **B1** $R = 4g$ and friction $F = 0.25 \times 4g = 9.8\,\text{N}$ (1)
- **M1** Equations of motion, e.g. $B$: $2g - T = 2a$ and $A$: $T - 9.8 = 4a$ (1)
- **A1** $a = 1.6\,\text{m s}^{-2}$ ($1.63$) (1)
- **A1** $T = 16\,\text{N}$ ($16.3$) (1)
- (b) **M1** Speed when $B$ hits the floor: $v^2 = 2 \times 1.633 \times 0.5$, $v = 1.28\,\text{m s}^{-1}$ (1)
- **B1** Afterwards the string is slack and $A$ decelerates at $0.25g = 2.45\,\text{m s}^{-2}$ (1)
- **A1** Distance $= \dfrac{1.633}{2 \times 2.45} = 0.33\,\text{m}$ (1)`,
        explanation: r`Write a separate $F = ma$ equation for each particle. Once $B$ lands the tension drops to zero, so only friction acts on $A$ — a new deceleration must be found.`,
    },
    {
        seedKey: "mat-wme01-dynamics-003",
        unitCode: "WME01",
        topicSlug: "dynamics",
        type: "CALCULATION",
        difficulty: "MEDIUM",
        marks: 4,
        status: "DRAFT",
        stem: r`Two particles $P$ and $Q$, of masses $0.3\,\text{kg}$ and $0.2\,\text{kg}$, move towards each other along the same straight line on a smooth horizontal surface. Just before they collide, $P$ has speed $6\,\text{m s}^{-1}$ and $Q$ has speed $2\,\text{m s}^{-1}$. Immediately after the collision, $P$ continues in the same direction with speed $1\,\text{m s}^{-1}$.

(a) Find the speed of $Q$ immediately after the collision.

(b) Find the magnitude of the impulse exerted on $Q$ in the collision.`,
        markScheme: r`- (a) **M1** Conservation of momentum (direction of $P$ positive): $0.3 \times 6 - 0.2 \times 2 = 0.3 \times 1 + 0.2v$ (1)
- **A1** $v = 5.5\,\text{m s}^{-1}$ (1)
- (b) **M1** Impulse $= $ change in momentum of $Q$: $0.2(5.5 - (-2))$ (1)
- **A1** $1.5\,\text{N s}$ (1)`,
        explanation: r`Fix a positive direction and give $Q$'s initial velocity a **negative** sign. Check: the impulse on $P$ is $0.3(1 - 6) = -1.5\,\text{N s}$, equal and opposite.`,
    },

    // --- statics ---
    {
        seedKey: "mat-wme01-statics-001",
        unitCode: "WME01",
        topicSlug: "statics",
        type: "MCQ",
        difficulty: "MEDIUM",
        marks: 1,
        status: "DRAFT",
        stem: r`A particle rests on a rough plane inclined at $30^\circ$ to the horizontal. No force other than its weight, the normal reaction and friction acts. The particle is on the point of slipping down the plane. What is the coefficient of friction?`,
        options: opts("0.5", "0.577", "0.866", "1.73", "B"),
        markScheme: r`- **B** (1) — $mg\sin 30^\circ = \mu mg\cos 30^\circ$, so $\mu = \tan 30^\circ = 0.577$.`,
        explanation: r`In limiting equilibrium on a plane with no applied force, $\mu = \tan\alpha$. Using $\sin 30^\circ$ (0.5) or $\cos 30^\circ$ (0.866) alone is the trap.`,
    },
    {
        seedKey: "mat-wme01-statics-002",
        unitCode: "WME01",
        topicSlug: "statics",
        type: "CALCULATION",
        difficulty: "HARD",
        marks: 6,
        status: "DRAFT",
        stem: r`A particle of mass $2\,\text{kg}$ is held in equilibrium on a rough plane inclined at an angle $\alpha$ to the horizontal, where $\tan\alpha = \tfrac{3}{4}$. The coefficient of friction between the particle and the plane is $0.4$. The particle is held by a **horizontal** force of magnitude $P$ newtons, acting in the vertical plane containing a line of greatest slope.

Given that the particle is on the point of slipping **down** the plane, find the value of $P$.`,
        markScheme: r`- **B1** $\sin\alpha = 0.6$, $\cos\alpha = 0.8$ (1)
- **M1** Resolve perpendicular to the plane: $R = 2g\cos\alpha + P\sin\alpha = 15.68 + 0.6P$ (1)
- **B1** Friction acts up the plane with $F = 0.4R$ (1)
- **M1** Resolve parallel to the plane: $P\cos\alpha + F = 2g\sin\alpha$ (1)
- **M1** Substitute: $0.8P + 0.4(15.68 + 0.6P) = 11.76$, so $1.04P = 5.488$ (1)
- **A1** $P = 5.3$ ($5.28$) (1)`,
        explanation: r`The horizontal force has a component **into** the plane ($P\sin\alpha$), which increases $R$ — forgetting it is the most common error. Friction opposes the impending motion, so it acts up the slope here.`,
    },
    {
        seedKey: "mat-wme01-statics-003",
        unitCode: "WME01",
        topicSlug: "statics",
        type: "CALCULATION",
        difficulty: "MEDIUM",
        marks: 4,
        status: "DRAFT",
        stem: r`A particle of mass $5\,\text{kg}$ hangs in equilibrium, supported by two light inextensible strings. One string makes an angle of $30^\circ$ with the vertical and the other makes an angle of $60^\circ$ with the vertical, on the opposite side.

Find the tension in each string.`,
        markScheme: r`- **M1** Resolve horizontally: $T_1\sin 30^\circ = T_2\sin 60^\circ$ (1)
- **M1** Resolve vertically: $T_1\cos 30^\circ + T_2\cos 60^\circ = 5g = 49$ (1)
- **A1** String at $60^\circ$: $T_2 = 24.5\,\text{N}$ (1)
- **A1** String at $30^\circ$: $T_1 = 42.4\,\text{N}$ (1)`,
        explanation: r`The string closer to the vertical carries more of the weight. Since the angles add to $90^\circ$, a triangle of forces (or Lami's theorem) gives $T_1 = 49\cos 30^\circ$ and $T_2 = 49\cos 60^\circ$ as a check.`,
    },

    // --- moments ---
    {
        seedKey: "mat-wme01-moments-001",
        unitCode: "WME01",
        topicSlug: "moments",
        type: "MCQ",
        difficulty: "EASY",
        marks: 1,
        status: "DRAFT",
        stem: r`A uniform rod $AB$ of length $4\,\text{m}$ and mass $10\,\text{kg}$ rests horizontally on two supports, one at $A$ and one at $C$, where $AC = 3\,\text{m}$. What is the reaction at $C$?`,
        options: opts(r`$32.7\,\text{N}$`, r`$49\,\text{N}$`, r`$65.3\,\text{N}$`, r`$98\,\text{N}$`, "C"),
        markScheme: r`- **C** (1) — moments about $A$: $3R_C = 10g \times 2$, so $R_C = 65.3\,\text{N}$.`,
        explanation: r`The weight acts at the midpoint, $2\,\text{m}$ from $A$. $32.7\,\text{N}$ is the reaction at $A$; $49\,\text{N}$ assumes the weight is shared equally, which only happens when the supports are symmetric.`,
    },
    {
        seedKey: "mat-wme01-moments-002",
        unitCode: "WME01",
        topicSlug: "moments",
        type: "CALCULATION",
        difficulty: "MEDIUM",
        marks: 6,
        status: "DRAFT",
        stem: r`A uniform plank $AB$ has length $6\,\text{m}$ and mass $20\,\text{kg}$. It rests horizontally on two supports at $C$ and $D$, where $AC = 1\,\text{m}$ and $DB = 2\,\text{m}$. A man of mass $60\,\text{kg}$ stands on the plank. The plank is modelled as a uniform rod and the man as a particle.

(a) The man stands at the midpoint of the plank. Find the reactions at $C$ and at $D$.

(b) The man now walks slowly towards $B$. Find his distance from $A$ when the plank is about to tilt.`,
        markScheme: r`- (a) **M1** Resolve vertically: $R_C + R_D = 80g = 784$ (1)
- **M1** Moments about $C$: $3R_D = 20g \times 2 + 60g \times 2$ (1)
- **A1** $R_D = 523\,\text{N}$ (1)
- **A1** $R_C = 261\,\text{N}$ (1)
- (b) **M1** About to tilt about $D$, so $R_C = 0$; moments about $D$: $20g \times 1 = 60g(x - 4)$ (1)
- **A1** $x = 4.33\,\text{m}$ from $A$ (1)`,
        explanation: r`"About to tilt" about $D$ means the plank is just losing contact with $C$, so $R_C = 0$. Taking moments about $D$ then removes $R_D$ from the equation.`,
    },
];

// ---------------------------------------------------------------------------------------------------------------
// WME02 — Mechanics 2
// ---------------------------------------------------------------------------------------------------------------
const wme02: SeedQuestion[] = [
    // --- kinematics ---
    {
        seedKey: "mat-wme02-kinematics-001",
        unitCode: "WME02",
        topicSlug: "kinematics",
        type: "MCQ",
        difficulty: "EASY",
        marks: 1,
        status: "DRAFT",
        stem: r`A particle moves along a straight line. At time $t$ seconds its velocity is $v = (3t^2 - 12t + 5)\,\text{m s}^{-1}$. What is its acceleration when $t = 3$?`,
        options: opts(
            r`$-4\,\text{m s}^{-2}$`,
            r`$5\,\text{m s}^{-2}$`,
            r`$6\,\text{m s}^{-2}$`,
            r`$18\,\text{m s}^{-2}$`,
            "C",
        ),
        markScheme: r`- **C** (1) — $a = \dfrac{dv}{dt} = 6t - 12 = 6$ at $t = 3$.`,
        explanation: r`Differentiate velocity to get acceleration. $-4$ is the velocity at $t = 3$; $18$ comes from forgetting the $-12$.`,
    },
    {
        seedKey: "mat-wme02-kinematics-002",
        unitCode: "WME02",
        topicSlug: "kinematics",
        type: "CALCULATION",
        difficulty: "HARD",
        marks: 7,
        status: "DRAFT",
        stem: r`A ball is projected from a point $O$ on horizontal ground with speed $21\,\text{m s}^{-1}$ at an angle $\alpha$ above the horizontal, where $\tan\alpha = \tfrac{4}{3}$. The ball is modelled as a particle moving freely under gravity.

(a) Find the greatest height of the ball above the ground.

(b) Find the length of time for which the ball is at least $10\,\text{m}$ above the ground.

(c) Find the horizontal distance from $O$ to the point where the ball lands.`,
        markScheme: r`- (a) **B1** Initial components: horizontal $21 \times 0.6 = 12.6$, vertical $21 \times 0.8 = 16.8\,\text{m s}^{-1}$ (1)
- **A1** $0 = 16.8^2 - 2 \times 9.8 \times h$, so $h = 14.4\,\text{m}$ (1)
- (b) **M1** $10 = 16.8t - 4.9t^2$ (1)
- **A1** $t = 0.767$ or $t = 2.66$ (1)
- **A1** Time $= 2.66 - 0.767 = 1.9\,\text{s}$ (1)
- (c) **M1** Time of flight: $0 = 16.8t - 4.9t^2$, so $t = 3.43\,\text{s}$ (1)
- **A1** Range $= 12.6 \times 3.43 = 43.2\,\text{m}$ (1)`,
        explanation: r`With $\tan\alpha = \tfrac{4}{3}$ use $\sin\alpha = 0.8$, $\cos\alpha = 0.6$ exactly. Vertical motion decides the times; horizontal velocity is constant.`,
    },
    {
        seedKey: "mat-wme02-kinematics-003",
        unitCode: "WME02",
        topicSlug: "kinematics",
        type: "CALCULATION",
        difficulty: "MEDIUM",
        marks: 6,
        status: "DRAFT",
        stem: r`A particle $P$ moves along the $x$-axis. At time $t$ seconds ($t \ge 0$) its velocity is $v = (2t^2 - 9t + 4)\,\text{m s}^{-1}$. When $t = 0$, $P$ is at the origin.

(a) Find the values of $t$ for which $P$ is instantaneously at rest.

(b) Find the total distance travelled by $P$ between $t = 0$ and $t = 4$.`,
        markScheme: r`- (a) **M1** Solve $2t^2 - 9t + 4 = 0$, i.e. $(2t - 1)(t - 4) = 0$ (1)
- **A1** $t = 0.5$ and $t = 4$ (1)
- (b) **M1** $x = \tfrac{2}{3}t^3 - \tfrac{9}{2}t^2 + 4t$ (no constant as $x = 0$ at $t = 0$) (1)
- **A1** $x(0.5) = \tfrac{23}{24} = 0.958\,\text{m}$ (1)
- **A1** $x(4) = -\tfrac{40}{3} = -13.3\,\text{m}$ (1)
- **A1** Distance $= \tfrac{23}{24} + \left(\tfrac{23}{24} + \tfrac{40}{3}\right) = 15.25\,\text{m}$ (1)`,
        explanation: r`$P$ changes direction at $t = 0.5$, so integrating straight from 0 to 4 gives the **displacement** ($-13.3\,\text{m}$), not the distance. Split the interval at each time the particle is at rest.`,
    },

    // --- centres-of-mass ---
    {
        seedKey: "mat-wme02-centres-of-mass-001",
        unitCode: "WME02",
        topicSlug: "centres-of-mass",
        type: "MCQ",
        difficulty: "EASY",
        marks: 1,
        status: "DRAFT",
        stem: r`Particles of mass $2\,\text{kg}$, $3\,\text{kg}$ and $5\,\text{kg}$ are placed at the points $(0, 0)$, $(4, 0)$ and $(2, 6)$ respectively. What are the coordinates of their centre of mass?`,
        options: opts(r`$(2, 2)$`, r`$(2.2, 3)$`, r`$(3, 2.2)$`, r`$(2.2, 6)$`, "B"),
        markScheme: r`- **B** (1) — $\bar{x} = \dfrac{0 + 12 + 10}{10} = 2.2$, $\bar{y} = \dfrac{0 + 0 + 30}{10} = 3$.`,
        explanation: r`Each coordinate is a mass-weighted mean, $\bar{x} = \dfrac{\sum m_i x_i}{\sum m_i}$. $(2, 2)$ is the unweighted average of the points.`,
    },
    {
        seedKey: "mat-wme02-centres-of-mass-002",
        unitCode: "WME02",
        topicSlug: "centres-of-mass",
        type: "CALCULATION",
        difficulty: "HARD",
        marks: 6,
        status: "DRAFT",
        stem: r`A uniform rectangular lamina $ABCD$ has $AB = 8\,\text{cm}$ and $AD = 6\,\text{cm}$. Take $A$ as the origin, $AB$ along the $x$-axis and $AD$ along the $y$-axis. A square of side $2\,\text{cm}$, with corners at $(5, 3)$, $(7, 3)$, $(7, 5)$ and $(5, 5)$, is removed to leave a template $T$.

(a) Find the coordinates of the centre of mass of $T$.

(b) $T$ is freely suspended from $A$ and hangs in equilibrium. Find the angle between $AB$ and the vertical.`,
        markScheme: r`- (a) **B1** Areas $48$, $4$ and $44$ with centres $(4, 3)$, $(6, 4)$ and $(\bar{x}, \bar{y})$ (1)
- **M1** Moments: $44\bar{x} = 48 \times 4 - 4 \times 6$ (1)
- **A1** $\bar{x} = \tfrac{42}{11} = 3.82\,\text{cm}$ (1)
- **A1** $\bar{y} = \dfrac{48 \times 3 - 4 \times 4}{44} = \tfrac{32}{11} = 2.91\,\text{cm}$ (1)
- (b) **M1** The centre of mass lies vertically below $A$, so $\tan\theta = \dfrac{\bar{y}}{\bar{x}}$ (1)
- **A1** $\theta = 37.3^\circ$ (1)`,
        explanation: r`Treat the removed square as a **negative** mass. When a body hangs freely, the line from the suspension point to the centre of mass is vertical; draw the right-angled triangle with sides $\bar{x}$ and $\bar{y}$.`,
    },

    // --- work-energy ---
    {
        seedKey: "mat-wme02-work-energy-001",
        unitCode: "WME02",
        topicSlug: "work-energy",
        type: "MCQ",
        difficulty: "EASY",
        marks: 1,
        status: "DRAFT",
        stem: r`A car's engine works at a constant rate of $30\,\text{kW}$ while the car travels at a constant speed of $25\,\text{m s}^{-1}$ on a level road. What is the total resistance to motion?`,
        options: opts(r`$120\,\text{N}$`, r`$1200\,\text{N}$`, r`$2400\,\text{N}$`, r`$750\,\text{kN}$`, "B"),
        markScheme: r`- **B** (1) — $P = Fv$: $F = \dfrac{30\,000}{25} = 1200\,\text{N}$, and at constant speed the driving force equals the resistance.`,
        explanation: r`Convert kW to W first. Constant speed means zero resultant force, so the tractive force $P/v$ equals the resistance.`,
    },
    {
        seedKey: "mat-wme02-work-energy-002",
        unitCode: "WME02",
        topicSlug: "work-energy",
        type: "CALCULATION",
        difficulty: "HARD",
        marks: 6,
        status: "DRAFT",
        stem: r`A particle of mass $3\,\text{kg}$ is projected up a line of greatest slope of a rough plane inclined at $30^\circ$ to the horizontal. Its initial speed is $8\,\text{m s}^{-1}$ and the coefficient of friction between the particle and the plane is $0.2$.

(a) Use the work–energy principle to find the distance the particle travels up the plane before coming to rest.

(b) The particle then slides back down. Find its speed when it returns to its starting point.`,
        markScheme: r`- (a) **B1** $R = 3g\cos 30^\circ = 25.5\,\text{N}$ (1)
- **B1** $F = 0.2R = 5.09\,\text{N}$ (1)
- **M1** Work–energy: $\tfrac{1}{2}(3)(8^2) = 3g\sin 30^\circ \times d + 5.09d$ (1)
- **A1** $d = 4.85\,\text{m}$ (1)
- (b) **M1** $\tfrac{1}{2}(3)v^2 = 3g\sin 30^\circ \times 4.85 - 5.09 \times 4.85$ (1)
- **A1** $v = 5.57\,\text{m s}^{-1}$ (5.6) (1)`,
        explanation: r`Loss of KE = gain in PE + work done against friction. On the way down friction still opposes motion, so it now acts **up** the slope and reduces the KE gained. Friction does work on both legs of the journey.`,
    },
    {
        seedKey: "mat-wme02-work-energy-003",
        unitCode: "WME02",
        topicSlug: "work-energy",
        type: "CALCULATION",
        difficulty: "MEDIUM",
        marks: 5,
        status: "DRAFT",
        stem: r`A car of mass $1200\,\text{kg}$ has an engine working at a constant rate of $24\,\text{kW}$. The resistance to motion is constant and of magnitude $600\,\text{N}$.

(a) Find the acceleration of the car when it is travelling along a level road at $15\,\text{m s}^{-1}$.

(b) The car now drives up a straight road inclined at an angle $\theta$ to the horizontal, where $\sin\theta = \tfrac{1}{20}$. Find the maximum speed of the car up this road.`,
        markScheme: r`- (a) **M1** Driving force $= \dfrac{24\,000}{15} = 1600\,\text{N}$ (1)
- **M1** $F = ma$: $1600 - 600 = 1200a$ (1)
- **A1** $a = 0.833\,\text{m s}^{-2}$ (1)
- (b) **M1** At maximum speed: $\dfrac{24\,000}{v} = 600 + 1200g \times \tfrac{1}{20}$ (1)
- **A1** $v = 20.2\,\text{m s}^{-1}$ (1)`,
        explanation: r`At maximum speed the acceleration is zero, so driving force = resistance + weight component down the slope ($mg\sin\theta = 588\,\text{N}$).`,
    },

    // --- collisions ---
    {
        seedKey: "mat-wme02-collisions-001",
        unitCode: "WME02",
        topicSlug: "collisions",
        type: "MCQ",
        difficulty: "EASY",
        marks: 1,
        status: "DRAFT",
        stem: r`A ball hits a smooth horizontal floor with speed $6\,\text{m s}^{-1}$ and rebounds with speed $4\,\text{m s}^{-1}$. What is the coefficient of restitution between the ball and the floor?`,
        options: opts("0.4", "0.6", "0.667", "1.5", "C"),
        markScheme: r`- **C** (1) — $e = \dfrac{\text{speed of separation}}{\text{speed of approach}} = \dfrac{4}{6} = 0.667$.`,
        explanation: r`$0 \le e \le 1$, so 1.5 (fraction upside down) is impossible. Speed of separation goes on top.`,
    },
    {
        seedKey: "mat-wme02-collisions-002",
        unitCode: "WME02",
        topicSlug: "collisions",
        type: "CALCULATION",
        difficulty: "HARD",
        marks: 6,
        status: "DRAFT",
        stem: r`A smooth sphere $A$ of mass $2m$ moves with speed $3u$ on a smooth horizontal surface. It collides directly with a smooth sphere $B$ of mass $m$, which is at rest. The spheres have equal radii and the coefficient of restitution between them is $\tfrac{1}{2}$.

(a) Find the speeds of $A$ and $B$ immediately after the collision.

(b) Find the kinetic energy lost in the collision, in terms of $m$ and $u$.`,
        markScheme: r`- (a) **M1** Conservation of momentum: $2m(3u) = 2mv_A + mv_B$ (1)
- **M1** Restitution: $v_B - v_A = \tfrac{1}{2}(3u)$ (1)
- **A1** $v_A = 1.5u$ (1)
- **A1** $v_B = 3u$ (1)
- (b) **M1** KE before $= 9mu^2$; KE after $= \tfrac{1}{2}(2m)(1.5u)^2 + \tfrac{1}{2}m(3u)^2 = 6.75mu^2$ (1)
- **A1** Loss $= \tfrac{9}{4}mu^2$ (1)`,
        explanation: r`Write the restitution equation as separation speed $= e \times$ approach speed with a consistent sign convention. Both spheres move in the original direction afterwards, with $B$ faster than $A$.`,
    },
    {
        seedKey: "mat-wme02-collisions-003",
        unitCode: "WME02",
        topicSlug: "collisions",
        type: "CALCULATION",
        difficulty: "EASY",
        marks: 4,
        status: "DRAFT",
        stem: r`A ball of mass $0.5\,\text{kg}$ moving on a smooth horizontal surface strikes a fixed smooth vertical wall at right angles with speed $8\,\text{m s}^{-1}$. The coefficient of restitution between the ball and the wall is $0.75$.

Find (a) the rebound speed, (b) the magnitude of the impulse exerted by the wall on the ball, and (c) the kinetic energy lost in the impact.`,
        markScheme: r`- (a) Rebound speed $= 0.75 \times 8 = 6\,\text{m s}^{-1}$ (1)
- (b) **M1** Impulse $= 0.5(6 - (-8))$ (1)
- **A1** $7\,\text{N s}$ (1)
- (c) KE lost $= \tfrac{1}{2}(0.5)(8^2 - 6^2) = 7\,\text{J}$ (1)`,
        explanation: r`The velocity reverses, so the change in velocity is $6 - (-8) = 14\,\text{m s}^{-1}$, not $2\,\text{m s}^{-1}$.`,
    },

    // --- statics-rigid-bodies ---
    {
        seedKey: "mat-wme02-statics-rigid-bodies-001",
        unitCode: "WME02",
        topicSlug: "statics-rigid-bodies",
        type: "MCQ",
        difficulty: "MEDIUM",
        marks: 1,
        status: "DRAFT",
        stem: r`A uniform ladder rests in limiting equilibrium with its foot on rough horizontal ground and its top against a **smooth** vertical wall. Which statement is correct?`,
        options: opts(
            "Friction at the wall acts upwards on the ladder",
            "The normal reaction from the ground equals the weight of the ladder",
            "Friction at the ground acts away from the wall",
            "The normal reaction from the wall equals the weight of the ladder",
            "B",
        ),
        markScheme: r`- **B** (1) — a smooth wall exerts only a horizontal force, so resolving vertically gives ground reaction = weight.`,
        explanation: r`A smooth surface gives no friction. The foot tends to slide away from the wall, so ground friction acts **towards** the wall and balances the wall's normal reaction.`,
    },
    {
        seedKey: "mat-wme02-statics-rigid-bodies-002",
        unitCode: "WME02",
        topicSlug: "statics-rigid-bodies",
        type: "CALCULATION",
        difficulty: "HARD",
        marks: 6,
        status: "DRAFT",
        stem: r`A uniform ladder $AB$, of length $4\,\text{m}$ and mass $15\,\text{kg}$, rests with $A$ on rough horizontal ground and $B$ against a smooth vertical wall. The ladder makes an angle $\theta$ with the ground, where $\tan\theta = \tfrac{4}{3}$, and lies in a vertical plane perpendicular to the wall. The coefficient of friction between the ladder and the ground is $0.5$.

A man of mass $75\,\text{kg}$ climbs the ladder. Modelling the man as a particle, find how far up the ladder from $A$ he can climb before the ladder slips.`,
        markScheme: r`- **B1** Resolve vertically: $R = 90g$ (1)
- **B1** Limiting friction: $F = 0.5 \times 90g = 45g$ (1)
- **B1** Resolve horizontally: wall reaction $S = F = 45g$ (1)
- **M1** Moments about $A$ with the man $x\,\text{m}$ up: $S \times 4\sin\theta = 15g \times 2\cos\theta + 75g \times x\cos\theta$ (1)
- **M1** Substitute $\tan\theta = \tfrac{4}{3}$: $45 \times 4 \times \tfrac{4}{3} = 30 + 75x$ (1)
- **A1** $x = 2.8\,\text{m}$ (1)`,
        explanation: r`Take moments about the foot $A$ to eliminate both $R$ and $F$. Perpendicular distances: the wall reaction acts at height $4\sin\theta$; the weights act at horizontal distances $2\cos\theta$ and $x\cos\theta$.`,
    },
];

// ---------------------------------------------------------------------------------------------------------------
// WST01 — Statistics 1
// ---------------------------------------------------------------------------------------------------------------
const wst01: SeedQuestion[] = [
    // --- mathematical-models ---
    {
        seedKey: "mat-wst01-mathematical-models-001",
        unitCode: "WST01",
        topicSlug: "mathematical-models",
        type: "MCQ",
        difficulty: "EASY",
        marks: 1,
        status: "DRAFT",
        stem: r`Which of the following is an **advantage** of using a statistical model?`,
        options: opts(
            "It gives exact predictions for every future observation",
            "It removes the need to collect any data",
            "It simplifies a real-world situation so predictions can be made quickly and cheaply",
            "It takes every factor affecting the situation into account",
            "C",
        ),
        markScheme: r`- **C** (1) — a model is a simplification that lets us make predictions and improve understanding at low cost.`,
        explanation: r`Models are simplifications: they do **not** include every factor and do not give exact predictions, and they still need data to test and refine them.`,
    },
    {
        seedKey: "mat-wst01-mathematical-models-002",
        unitCode: "WST01",
        topicSlug: "mathematical-models",
        type: "SHORT",
        difficulty: "MEDIUM",
        marks: 3,
        status: "DRAFT",
        stem: r`A researcher wants a statistical model for the daily number of visitors to a museum. Describe, in order, the main stages of the process of designing and refining a statistical model.`,
        markScheme: r`- A real-world problem is observed and a model is devised, making simplifying assumptions (1)
- The model is used to make predictions, and experimental data are collected (1)
- The predictions are compared with the observed data; if they disagree the model is refined and the cycle is repeated (1)`,
        explanation: r`The key idea is a **cycle**: devise → predict → collect data → compare → refine. A list of stages without the comparison and refinement step loses the final mark.`,
    },

    // --- data-representation ---
    {
        seedKey: "mat-wst01-data-representation-001",
        unitCode: "WST01",
        topicSlug: "data-representation",
        type: "MCQ",
        difficulty: "EASY",
        marks: 1,
        status: "DRAFT",
        stem: r`On a histogram, the class $20 \le x < 35$ is drawn with a frequency density of $4$. What is the frequency of this class?`,
        options: opts("4", "8.75", "60", "140", "C"),
        markScheme: r`- **C** (1) — frequency = frequency density × class width $= 4 \times 15 = 60$.`,
        explanation: r`In a histogram, **area** is proportional to frequency. Dividing instead of multiplying gives 8.75; using the upper boundary 35 as the width gives 140.`,
    },
    {
        seedKey: "mat-wst01-data-representation-002",
        unitCode: "WST01",
        topicSlug: "data-representation",
        type: "CALCULATION",
        difficulty: "MEDIUM",
        marks: 5,
        status: "DRAFT",
        stem: r`The times, $x$ minutes, taken by 20 students to complete a puzzle are summarised by
$$\sum x = 364, \qquad \sum x^2 = 6892.$$

(a) Find the mean and the standard deviation of $x$.

(b) The data are coded using $y = \dfrac{x - 10}{2}$. Find the mean and the standard deviation of $y$.`,
        markScheme: r`- (a) Mean $\bar{x} = \dfrac{364}{20} = 18.2$ (1)
- **M1** Variance $= \dfrac{6892}{20} - 18.2^2 = 13.36$ (1)
- **A1** Standard deviation $= 3.66$ (1)
- (b) Mean of $y = \dfrac{18.2 - 10}{2} = 4.1$ (1)
- Standard deviation of $y = \dfrac{3.66}{2} = 1.83$ (1)`,
        explanation: r`Coding: subtracting a constant shifts the mean but does not change the spread; dividing by 2 halves both the mean (after the shift) and the standard deviation.`,
    },
    {
        seedKey: "mat-wst01-data-representation-003",
        unitCode: "WST01",
        topicSlug: "data-representation",
        type: "CALCULATION",
        difficulty: "MEDIUM",
        marks: 5,
        status: "DRAFT",
        stem: r`The numbers of text messages sent by 15 people on one day are:

| 3 | 5 | 7 | 8 | 8 | 9 | 10 | 11 | 12 | 12 | 13 | 14 | 15 | 17 | 31 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|

(a) Find the median and the lower and upper quartiles.

(b) An outlier is a value more than $1.5 \times$ the interquartile range above $Q_3$ or below $Q_1$. Determine whether there are any outliers.`,
        markScheme: r`- (a) $Q_1 = 8$ ($\tfrac{15}{4} = 3.75$, so the 4th value) (1)
- Median $Q_2 = 11$ (8th value) (1)
- $Q_3 = 14$ ($\tfrac{3 \times 15}{4} = 11.25$, so the 12th value) (1)
- (b) **M1** IQR $= 6$; limits $8 - 9 = -1$ and $14 + 9 = 23$ (1)
- **A1** $31 > 23$, so $31$ is an outlier (and there are no others) (1)`,
        explanation: r`For a list of $n$ values, find $\tfrac{n}{4}$: if it is not a whole number round **up** to get the position; if it is, average that value and the next.`,
    },

    // --- probability ---
    {
        seedKey: "mat-wst01-probability-001",
        unitCode: "WST01",
        topicSlug: "probability",
        type: "MCQ",
        difficulty: "MEDIUM",
        marks: 1,
        status: "DRAFT",
        stem: r`Events $A$ and $B$ satisfy $P(A) = 0.4$, $P(B) = 0.5$ and $P(A \cup B) = 0.7$. Which statement is correct?`,
        options: opts(
            r`$A$ and $B$ are mutually exclusive`,
            r`$A$ and $B$ are independent`,
            r`$P(A \mid B) = 0.5$`,
            r`$P(A \cap B) = 0.3$`,
            "B",
        ),
        markScheme: r`- **B** (1) — $P(A \cap B) = 0.4 + 0.5 - 0.7 = 0.2 = P(A)P(B)$, so $A$ and $B$ are independent.`,
        explanation: r`Find $P(A \cap B)$ from the addition rule first. It is not zero, so the events are not mutually exclusive; $P(A \mid B) = 0.2/0.5 = 0.4 = P(A)$.`,
    },
    {
        seedKey: "mat-wst01-probability-002",
        unitCode: "WST01",
        topicSlug: "probability",
        type: "CALCULATION",
        difficulty: "MEDIUM",
        marks: 6,
        status: "DRAFT",
        stem: r`A factory has two machines. Machine $X$ makes 60% of the components and machine $Y$ makes the rest. Of the components made by $X$, 3% are faulty; of those made by $Y$, 5% are faulty.

(a) A component is chosen at random. Find the probability that it is faulty.

(b) Given that a randomly chosen component is faulty, find the probability that it was made by machine $X$.

(c) Two components are chosen at random, independently. Find the probability that exactly one of them is faulty.`,
        markScheme: r`- (a) **M1** $0.6 \times 0.03 + 0.4 \times 0.05$ (1)
- **A1** $P(F) = 0.038$ (1)
- (b) **M1** $P(X \mid F) = \dfrac{P(X \cap F)}{P(F)} = \dfrac{0.018}{0.038}$ (1)
- **A1** $= 0.474$ ($\tfrac{9}{19}$) (1)
- (c) **M1** $2 \times 0.038 \times 0.962$ (1)
- **A1** $= 0.0731$ (1)`,
        explanation: r`A tree diagram organises (a) and (b). In (c) remember the factor 2: the faulty component can be the first **or** the second.`,
    },
    {
        seedKey: "mat-wst01-probability-003",
        unitCode: "WST01",
        topicSlug: "probability",
        type: "SHORT",
        difficulty: "EASY",
        marks: 4,
        status: "DRAFT",
        stem: r`In a class of 40 students, 22 study French, 15 study German and 8 study both.

(a) Find the probability that a randomly chosen student studies neither language.

(b) Given that a randomly chosen student does **not** study German, find the probability that they study French.`,
        markScheme: r`- (a) Number studying at least one language $= 22 + 15 - 8 = 29$ (1)
- $P(\text{neither}) = \tfrac{11}{40}$ (1)
- (b) Students not studying German $= 40 - 15 = 25$ (1)
- $P(F \mid G') = \tfrac{22 - 8}{25} = \tfrac{14}{25}$ (1)`,
        explanation: r`Draw a Venn diagram, filling the intersection (8) first. For the conditional probability the sample space shrinks to the 25 students outside $G$.`,
    },

    // --- correlation-regression ---
    {
        seedKey: "mat-wst01-correlation-regression-001",
        unitCode: "WST01",
        topicSlug: "correlation-regression",
        type: "MCQ",
        difficulty: "EASY",
        marks: 1,
        status: "DRAFT",
        stem: r`The product moment correlation coefficient between $x$ and $y$ is $0.84$. The data are coded using $p = 2x + 3$ and $q = \dfrac{y - 100}{5}$. What is the product moment correlation coefficient between $p$ and $q$?`,
        options: opts("0.168", "0.42", "0.84", "1.68", "C"),
        markScheme: r`- **C** (1) — linear coding with positive scale factors does not change the PMCC.`,
        explanation: r`$r$ measures how closely points lie to a straight line; stretching or shifting the axes (by positive factors) does not change that.`,
    },
    {
        seedKey: "mat-wst01-correlation-regression-002",
        unitCode: "WST01",
        topicSlug: "correlation-regression",
        type: "CALCULATION",
        difficulty: "MEDIUM",
        marks: 7,
        status: "DRAFT",
        stem: r`A teacher records the number of hours of revision, $x$, and the test score, $y$, for 8 students. The data are summarised by
$$\sum x = 56,\quad \sum y = 452,\quad \sum x^2 = 484,\quad \sum y^2 = 27\,056,\quad \sum xy = 3535.$$

(a) Find $S_{xx}$, $S_{yy}$ and $S_{xy}$.

(b) Calculate the product moment correlation coefficient between $x$ and $y$.

(c) Find the equation of the regression line of $y$ on $x$ in the form $y = a + bx$.

(d) Estimate the score of a student who revises for 7 hours.`,
        markScheme: r`- (a) $S_{xx} = 484 - \dfrac{56^2}{8} = 92$ (1)
- $S_{yy} = 27\,056 - \dfrac{452^2}{8} = 1518$ (1)
- $S_{xy} = 3535 - \dfrac{56 \times 452}{8} = 371$ (1)
- (b) $r = \dfrac{371}{\sqrt{92 \times 1518}} = 0.993$ (1)
- (c) $b = \dfrac{371}{92} = 4.03$ (1)
- $a = 56.5 - 4.03 \times 7 = 28.3$, so $y = 28.3 + 4.03x$ (1)
- (d) $y = 28.3 + 4.03 \times 7 = 56.5$ (1)`,
        explanation: r`The regression line always passes through $(\bar{x}, \bar{y}) = (7, 56.5)$ — a quick check on part (d). Use unrounded $b$ when finding $a$.`,
    },

    // --- discrete-random-variables ---
    {
        seedKey: "mat-wst01-discrete-random-variables-001",
        unitCode: "WST01",
        topicSlug: "discrete-random-variables",
        type: "MCQ",
        difficulty: "MEDIUM",
        marks: 1,
        status: "DRAFT",
        stem: r`$X$ has a discrete uniform distribution over the integers $1, 2, 3, \ldots, 10$. What is $\text{Var}(X)$?`,
        options: opts("5.5", "8.25", "8.33", "9.17", "B"),
        markScheme: r`- **B** (1) — $\text{Var}(X) = \dfrac{n^2 - 1}{12} = \dfrac{99}{12} = 8.25$.`,
        explanation: r`5.5 is the mean $\tfrac{n + 1}{2}$; 8.33 comes from $\tfrac{n^2}{12}$, forgetting the $-1$.`,
    },
    {
        seedKey: "mat-wst01-discrete-random-variables-002",
        unitCode: "WST01",
        topicSlug: "discrete-random-variables",
        type: "CALCULATION",
        difficulty: "MEDIUM",
        marks: 6,
        status: "DRAFT",
        stem: r`The discrete random variable $X$ has probability distribution

| $x$ | 1 | 2 | 3 | 4 |
|---|---|---|---|---|
| $P(X = x)$ | 0.1 | $k$ | 0.3 | $2k$ |

(a) Find the value of $k$.

(b) Find $E(X)$ and $\text{Var}(X)$.

(c) Find $E(3X - 2)$ and $\text{Var}(3X - 2)$.`,
        markScheme: r`- (a) $0.4 + 3k = 1$, so $k = 0.2$ (1)
- (b) $E(X) = 0.1 + 0.4 + 0.9 + 1.6 = 3$ (1)
- **M1** $E(X^2) = 0.1 + 0.8 + 2.7 + 6.4 = 10$ (1)
- **A1** $\text{Var}(X) = 10 - 3^2 = 1$ (1)
- (c) $E(3X - 2) = 3 \times 3 - 2 = 7$ (1)
- $\text{Var}(3X - 2) = 9 \times 1 = 9$ (1)`,
        explanation: r`$\text{Var}(aX + b) = a^2\,\text{Var}(X)$: the constant $b$ has no effect on spread, and the multiplier is **squared**.`,
    },

    // --- normal-distribution ---
    {
        seedKey: "mat-wst01-normal-distribution-001",
        unitCode: "WST01",
        topicSlug: "normal-distribution",
        type: "MCQ",
        difficulty: "EASY",
        marks: 1,
        status: "DRAFT",
        stem: r`$X \sim N(50, 16)$. Given that $\Phi(2) = 0.9772$ and $\Phi(0.5) = 0.6915$, what is $P(X > 58)$?`,
        options: opts("0.0228", "0.3085", "0.6915", "0.9772", "A"),
        markScheme: r`- **A** (1) — $\sigma = 4$, $z = \dfrac{58 - 50}{4} = 2$, $P(Z > 2) = 1 - 0.9772 = 0.0228$.`,
        explanation: r`In $N(\mu, \sigma^2)$ the second parameter is the **variance**; dividing by 16 instead of 4 gives $z = 0.5$ and the distractor 0.3085.`,
    },
    {
        seedKey: "mat-wst01-normal-distribution-002",
        unitCode: "WST01",
        topicSlug: "normal-distribution",
        type: "CALCULATION",
        difficulty: "MEDIUM",
        marks: 4,
        status: "DRAFT",
        stem: r`The lengths, $X$ cm, of leaves from a type of plant are modelled as $X \sim N(30, 5^2)$. Given $\Phi(1.4) = 0.9192$ and $\Phi(0.8) = 0.7881$, find $P(26 < X < 37)$.`,
        markScheme: r`- **M1** Standardise: $z = \dfrac{26 - 30}{5} = -0.8$ and $z = \dfrac{37 - 30}{5} = 1.4$ (1)
- **A1** Both $z$ values correct (1)
- **M1** $P = \Phi(1.4) - (1 - \Phi(0.8)) = 0.9192 - 0.2119$ (1)
- **A1** $= 0.7073$ (1)`,
        explanation: r`Use symmetry for negative $z$: $\Phi(-0.8) = 1 - \Phi(0.8)$. A sketch of the bell curve with both values marked avoids sign errors.`,
    },
    {
        seedKey: "mat-wst01-normal-distribution-003",
        unitCode: "WST01",
        topicSlug: "normal-distribution",
        type: "CALCULATION",
        difficulty: "HARD",
        marks: 6,
        status: "DRAFT",
        stem: r`The masses of bags of rice filled by a machine are normally distributed with mean $\mu$ grams and standard deviation $\sigma$ grams. 10% of bags have a mass less than $495\,\text{g}$ and 5% of bags have a mass greater than $510\,\text{g}$.

You may use $\Phi(1.2816) = 0.90$ and $\Phi(1.6449) = 0.95$.

Find the values of $\mu$ and $\sigma$.`,
        markScheme: r`- **B1** $z = -1.2816$ for the lower 10% (1)
- **B1** $z = 1.6449$ for the upper 5% (1)
- **M1** $\dfrac{495 - \mu}{\sigma} = -1.2816$ (1)
- **M1** $\dfrac{510 - \mu}{\sigma} = 1.6449$ (1)
- **A1** Solving: $2.9265\sigma = 15$, $\sigma = 5.13$ (1)
- **A1** $\mu = 502$ ($501.6$) (1)`,
        explanation: r`The value 495 is **below** the mean, so its $z$-value must be negative. Subtracting the two equations eliminates $\mu$.`,
    },
];

// ---------------------------------------------------------------------------------------------------------------
// WST02 — Statistics 2
// ---------------------------------------------------------------------------------------------------------------
const wst02: SeedQuestion[] = [
    // --- binomial-poisson ---
    {
        seedKey: "mat-wst02-binomial-poisson-001",
        unitCode: "WST02",
        topicSlug: "binomial-poisson",
        type: "MCQ",
        difficulty: "EASY",
        marks: 1,
        status: "DRAFT",
        stem: r`$X \sim B(20, 0.3)$. What is $\text{Var}(X)$?`,
        options: opts("1.8", "2.05", "4.2", "6", "C"),
        markScheme: r`- **C** (1) — $\text{Var}(X) = np(1 - p) = 20 \times 0.3 \times 0.7 = 4.2$.`,
        explanation: r`6 is the mean $np$ and 2.05 is the standard deviation. Don't confuse with the Poisson, where mean = variance.`,
    },
    {
        seedKey: "mat-wst02-binomial-poisson-002",
        unitCode: "WST02",
        topicSlug: "binomial-poisson",
        type: "CALCULATION",
        difficulty: "MEDIUM",
        marks: 5,
        status: "DRAFT",
        stem: r`Calls arrive at a help desk at random at a mean rate of 3 every 10 minutes.

(a) Find the probability that exactly 4 calls arrive in a 10-minute period.

(b) Find the probability that more than 8 calls arrive in a 30-minute period.

[You may use $P(Y \le 8) = 0.4557$ for $Y \sim \text{Po}(9)$.]`,
        markScheme: r`- (a) **M1** $P(X = 4) = \dfrac{e^{-3}3^4}{4!}$ (1)
- **A1** $= 0.168$ (1)
- (b) **B1** $Y \sim \text{Po}(9)$ for 30 minutes (1)
- **M1** $P(Y > 8) = 1 - P(Y \le 8)$ (1)
- **A1** $= 0.544$ (1)`,
        explanation: r`Scale the Poisson mean in proportion to the interval length. "More than 8" means $Y \ge 9$, so subtract $P(Y \le 8)$, not $P(Y \le 9)$.`,
    },
    {
        seedKey: "mat-wst02-binomial-poisson-003",
        unitCode: "WST02",
        topicSlug: "binomial-poisson",
        type: "CALCULATION",
        difficulty: "MEDIUM",
        marks: 5,
        status: "DRAFT",
        stem: r`2% of the light bulbs made in a factory are faulty. A box contains 200 bulbs, and faults occur independently.

(a) State the exact distribution of $X$, the number of faulty bulbs in the box.

(b) Explain why a Poisson distribution is a suitable approximation, and state its parameter.

(c) Use the approximation to find $P(X < 3)$.

[You may use $P(Y \le 2) = 0.2381$ and $P(Y \le 3) = 0.4335$ for $Y \sim \text{Po}(4)$.]`,
        markScheme: r`- (a) $X \sim B(200, 0.02)$ (1)
- (b) $n$ is large and $p$ is small (1)
- $\lambda = np = 4$ (1)
- (c) **M1** $P(X < 3) = P(Y \le 2)$ (1)
- **A1** $= 0.2381$ (1)`,
        explanation: r`"Less than 3" means 0, 1 or 2, so use $P(Y \le 2)$. Reading off $P(Y \le 3)$ is the classic inequality slip.`,
    },

    // --- continuous-random-variables ---
    {
        seedKey: "mat-wst02-continuous-random-variables-001",
        unitCode: "WST02",
        topicSlug: "continuous-random-variables",
        type: "MCQ",
        difficulty: "EASY",
        marks: 1,
        status: "DRAFT",
        stem: r`The continuous random variable $X$ has probability density function $f(x) = kx^2$ for $0 \le x \le 3$, and $f(x) = 0$ otherwise. What is the value of $k$?`,
        options: opts(r`$\tfrac{1}{3}$`, r`$\tfrac{1}{9}$`, r`$\tfrac{1}{27}$`, "3", "B"),
        markScheme: r`- **B** (1) — $\displaystyle\int_0^3 kx^2\,dx = 9k = 1$, so $k = \tfrac{1}{9}$.`,
        explanation: r`Total area under a pdf is 1. $\tfrac{1}{27}$ comes from forgetting to divide $x^3$ by 3 when integrating.`,
    },
    {
        seedKey: "mat-wst02-continuous-random-variables-002",
        unitCode: "WST02",
        topicSlug: "continuous-random-variables",
        type: "CALCULATION",
        difficulty: "MEDIUM",
        marks: 7,
        status: "DRAFT",
        stem: r`The continuous random variable $X$ has probability density function
$$f(x) = \begin{cases} \dfrac{x}{8} & 0 \le x \le 4 \\ 0 & \text{otherwise.} \end{cases}$$

(a) Find $E(X)$ and $\text{Var}(X)$.

(b) Find the cumulative distribution function $F(x)$ for $0 \le x \le 4$, and hence find the median of $X$.

(c) Write down the mode of $X$.`,
        markScheme: r`- (a) **M1** $E(X) = \displaystyle\int_0^4 \dfrac{x^2}{8}\,dx$ (1)
- **A1** $E(X) = \tfrac{8}{3}$ (1)
- **A1** $E(X^2) = \displaystyle\int_0^4 \dfrac{x^3}{8}\,dx = 8$ (1)
- **A1** $\text{Var}(X) = 8 - \left(\tfrac{8}{3}\right)^2 = \tfrac{8}{9}$ (1)
- (b) $F(x) = \dfrac{x^2}{16}$ (1)
- $\dfrac{m^2}{16} = 0.5$, so median $m = 2\sqrt{2} = 2.83$ (1)
- (c) Mode $= 4$ (1)`,
        explanation: r`The mode is where $f(x)$ is greatest — here at the end of the interval because $f$ is increasing. Mean < median < mode indicates negative skew.`,
    },
    {
        seedKey: "mat-wst02-continuous-random-variables-003",
        unitCode: "WST02",
        topicSlug: "continuous-random-variables",
        type: "SHORT",
        difficulty: "MEDIUM",
        marks: 4,
        status: "DRAFT",
        stem: r`The continuous random variable $X$ has cumulative distribution function $F(x) = \dfrac{x^2 + 2x}{15}$ for $0 \le x \le 3$, with $F(x) = 0$ for $x < 0$ and $F(x) = 1$ for $x > 3$.

(a) Find the probability density function of $X$.

(b) Find $P(1 < X < 2)$.

(c) Find the median of $X$.`,
        markScheme: r`- (a) $f(x) = F'(x) = \dfrac{2x + 2}{15}$ for $0 \le x \le 3$ (and 0 otherwise) (1)
- (b) **M1** $P(1 < X < 2) = F(2) - F(1) = \tfrac{8}{15} - \tfrac{3}{15}$ (1)
- **A1** $= \tfrac{1}{3}$ (1)
- (c) $m^2 + 2m = 7.5$ gives $m = -1 + \sqrt{8.5} = 1.92$ (1)`,
        explanation: r`Differentiate the cdf to get the pdf; use the cdf directly for probabilities. Reject the negative root of the quadratic as it lies outside $[0, 3]$.`,
    },

    // --- continuous-distributions ---
    {
        seedKey: "mat-wst02-continuous-distributions-001",
        unitCode: "WST02",
        topicSlug: "continuous-distributions",
        type: "MCQ",
        difficulty: "EASY",
        marks: 1,
        status: "DRAFT",
        stem: r`$X$ has a continuous uniform distribution on $[2, 10]$. What is $\text{Var}(X)$?`,
        options: opts("0.125", "2.31", "5.33", "6", "C"),
        markScheme: r`- **C** (1) — $\text{Var}(X) = \dfrac{(b - a)^2}{12} = \dfrac{64}{12} = 5.33$.`,
        explanation: r`0.125 is the height of the pdf, $\tfrac{1}{b - a}$; 6 is the mean and 2.31 the standard deviation.`,
    },
    {
        seedKey: "mat-wst02-continuous-distributions-002",
        unitCode: "WST02",
        topicSlug: "continuous-distributions",
        type: "CALCULATION",
        difficulty: "HARD",
        marks: 5,
        status: "DRAFT",
        stem: r`$X \sim B(80, 0.4)$. Use a suitable normal approximation to estimate $P(X \ge 36)$.

[You may use $\Phi(0.80) = 0.7881$.]`,
        markScheme: r`- **B1** Mean $= np = 32$ (1)
- **B1** Variance $= np(1 - p) = 19.2$ (1)
- **M1** Continuity correction: $P(X \ge 36) \approx P(Y > 35.5)$ (1)
- **M1** Standardise: $z = \dfrac{35.5 - 32}{\sqrt{19.2}} = 0.80$ (1)
- **A1** $1 - 0.7881 = 0.212$ (accept 0.211–0.213) (1)`,
        explanation: r`$X \ge 36$ includes 36, so the boundary moves **down** to 35.5. Using 36.5 is the most common continuity-correction error.`,
    },
    {
        seedKey: "mat-wst02-continuous-distributions-003",
        unitCode: "WST02",
        topicSlug: "continuous-distributions",
        type: "SHORT",
        difficulty: "MEDIUM",
        marks: 4,
        status: "DRAFT",
        stem: r`A stick of length $20\,\text{cm}$ is broken at a point chosen at random along its length. Find the probability that the longer piece is at least three times as long as the shorter piece.`,
        markScheme: r`- **B1** Distance $X$ of the break from one end: $X \sim U[0, 20]$ (1)
- **M1** Longer $\ge 3 \times$ shorter means the shorter piece is at most $5\,\text{cm}$ (1)
- **M1** So $X \le 5$ or $X \ge 15$ (1)
- **A1** Probability $= \tfrac{5 + 5}{20} = 0.5$ (1)`,
        explanation: r`If the shorter piece is $s$, the longer is $20 - s$; $20 - s \ge 3s$ gives $s \le 5$. Remember the break can be near **either** end.`,
    },

    // --- hypothesis-tests ---
    {
        seedKey: "mat-wst02-hypothesis-tests-001",
        unitCode: "WST02",
        topicSlug: "hypothesis-tests",
        type: "MCQ",
        difficulty: "MEDIUM",
        marks: 1,
        status: "DRAFT",
        stem: r`$X \sim B(20, p)$. A test of $H_0: p = 0.3$ against $H_1: p > 0.3$ is carried out at the 5% level. Given $P(X \le 8) = 0.8867$, $P(X \le 9) = 0.9520$ and $P(X \le 10) = 0.9829$ when $p = 0.3$, what is the critical region?`,
        options: opts(r`$X \ge 9$`, r`$X \ge 10$`, r`$X \ge 11$`, r`$X \le 2$`, "B"),
        markScheme: r`- **B** (1) — $P(X \ge 10) = 1 - 0.9520 = 0.0480 < 0.05$, but $P(X \ge 9) = 0.1133 > 0.05$.`,
        explanation: r`$P(X \ge c) = 1 - P(X \le c - 1)$. Using $1 - P(X \le 10)$ for $P(X \ge 10)$ shifts the region by one ($X \ge 11$).`,
    },
    {
        seedKey: "mat-wst02-hypothesis-tests-002",
        unitCode: "WST02",
        topicSlug: "hypothesis-tests",
        type: "CALCULATION",
        difficulty: "MEDIUM",
        marks: 5,
        status: "DRAFT",
        stem: r`Before a new road layout was introduced, accidents at a junction occurred at a mean rate of 4 per month. In the two months after the layout was introduced there were 3 accidents.

Test, at the 5% significance level, whether there is evidence that the mean rate of accidents has decreased. State your hypotheses clearly.

[You may use $P(Y \le 3) = 0.0424$ for $Y \sim \text{Po}(8)$.]`,
        markScheme: r`- **B1** $H_0: \lambda = 8$, $H_1: \lambda < 8$ (per two months; or $\lambda = 4$, $\lambda < 4$ per month) (1)
- **B1** Under $H_0$, $Y \sim \text{Po}(8)$ (1)
- **M1** $P(Y \le 3) = 0.0424$ (1)
- **M1** $0.0424 < 0.05$, so reject $H_0$ / significant (1)
- **A1** There is evidence that the mean rate of accidents has decreased (1)`,
        explanation: r`Scale the rate to the observed period (2 months gives $\lambda = 8$). Always finish with a conclusion **in context**, not just "reject $H_0$".`,
    },
    {
        seedKey: "mat-wst02-hypothesis-tests-003",
        unitCode: "WST02",
        topicSlug: "hypothesis-tests",
        type: "CALCULATION",
        difficulty: "HARD",
        marks: 6,
        status: "DRAFT",
        stem: r`A spinner is claimed to land on red with probability $0.25$. To test this claim the spinner is spun 40 times and the number of reds, $X$, is recorded. A two-tailed test is used at the 5% level, with the probability in each tail **less than** 0.025.

For $X \sim B(40, 0.25)$:

| $c$ | 4 | 5 | 15 | 16 |
|---|---|---|---|---|
| $P(X \le c)$ | 0.0160 | 0.0433 | 0.9738 | 0.9884 |

(a) Find the critical region for the test.

(b) State the actual significance level of the test.

(c) The spinner lands on red 16 times. Comment on the claim.`,
        markScheme: r`- (a) **B1** $H_0: p = 0.25$, $H_1: p \ne 0.25$ with $X \sim B(40, 0.25)$ (1)
- **B1** Lower tail: $X \le 4$ (1)
- **B1** Upper tail: $X \ge 17$, since $P(X \ge 17) = 1 - 0.9884 = 0.0116$ (1)
- (b) $0.0160 + 0.0116 = 0.0276$ (1)
- (c) **M1** 16 is not in the critical region, so do not reject $H_0$ (1)
- **A1** There is insufficient evidence to reject the claim that $P(\text{red}) = 0.25$ (1)`,
        explanation: r`$P(X \ge 16) = 1 - 0.9738 = 0.0262$ is just **above** 0.025, so 16 is not in the region. The actual significance level is the sum of both tail probabilities.`,
    },
];

// ---------------------------------------------------------------------------------------------------------------
// WDM11 — Decision Mathematics 1
// ---------------------------------------------------------------------------------------------------------------
const wdm11: SeedQuestion[] = [
    // --- algorithms ---
    {
        seedKey: "mat-wdm11-algorithms-001",
        unitCode: "WDM11",
        topicSlug: "algorithms",
        type: "MCQ",
        difficulty: "MEDIUM",
        marks: 1,
        status: "DRAFT",
        stem: r`A binary search is used to look for a name in an alphabetically ordered list of 25 names. What is the **maximum** number of iterations (comparisons with a pivot) needed?`,
        options: opts("4", "5", "12", "25", "B"),
        markScheme: r`- **B** (1) — the list shrinks $25 \to 12 \to 6 \to 3 \to 1$, so at most 5 pivots are checked.`,
        explanation: r`Each iteration roughly halves the list; the maximum number of iterations is the smallest $k$ with $2^k > n$, i.e. $2^5 = 32 > 25$. 25 is a linear search.`,
    },
    {
        seedKey: "mat-wdm11-algorithms-002",
        unitCode: "WDM11",
        topicSlug: "algorithms",
        type: "CALCULATION",
        difficulty: "MEDIUM",
        marks: 5,
        status: "DRAFT",
        stem: r`Eleven boxes, with the heights (in cm) below, are to be stacked in piles of height at most $20\,\text{cm}$.

| 8 | 7 | 14 | 9 | 6 | 9 | 5 | 15 | 6 | 7 | 8 |
|---|---|---|---|---|---|---|---|---|---|---|

(a) Calculate a lower bound for the number of piles needed.

(b) Use the first-fit decreasing algorithm to allocate the boxes to piles.

(c) Explain whether your answer to (b) is optimal.`,
        markScheme: r`- (a) $\dfrac{94}{20} = 4.7$, so the lower bound is 5 piles (1)
- (b) **M1** Sorted into decreasing order: 15, 14, 9, 9, 8, 8, 7, 7, 6, 6, 5 (1)
- **M1** First-fit applied, each item in the first pile with room (1)
- **A1** Piles: [15, 5], [14, 6], [9, 9], [8, 8], [7, 7, 6] (1)
- (c) 5 piles equals the lower bound, so the solution is optimal (1)`,
        explanation: r`The lower bound must be rounded **up**. Note that the 5 goes back into the first pile at the very end — first-fit always checks from pile 1.`,
    },
    {
        seedKey: "mat-wdm11-algorithms-003",
        unitCode: "WDM11",
        topicSlug: "algorithms",
        type: "SHORT",
        difficulty: "EASY",
        marks: 3,
        status: "DRAFT",
        stem: r`Carry out the **first pass** of a bubble sort to arrange the list below into ascending order.

| 23 | 17 | 31 | 12 | 25 | 9 |
|---|---|---|---|---|---|

Write down the list after the first pass, and state the number of comparisons and the number of swaps made.`,
        markScheme: r`- List after pass 1: 17, 23, 12, 25, 9, 31 (1)
- 5 comparisons (1)
- 4 swaps (1)`,
        explanation: r`In each pass, compare adjacent pairs from left to right and swap if out of order. After the first pass the largest value (31) is guaranteed to be at the end.`,
    },

    // --- graphs-networks ---
    {
        seedKey: "mat-wdm11-graphs-networks-001",
        unitCode: "WDM11",
        topicSlug: "graphs-networks",
        type: "MCQ",
        difficulty: "EASY",
        marks: 1,
        status: "DRAFT",
        stem: r`A connected network has 9 vertices and 15 arcs. How many arcs are there in a minimum spanning tree of the network?`,
        options: opts("7", "8", "9", "15", "B"),
        markScheme: r`- **B** (1) — every spanning tree on $n$ vertices has $n - 1 = 8$ arcs.`,
        explanation: r`A tree connects all vertices with no cycles, which always needs exactly $n - 1$ arcs regardless of how many arcs the original network has.`,
    },
    {
        seedKey: "mat-wdm11-graphs-networks-002",
        unitCode: "WDM11",
        topicSlug: "graphs-networks",
        type: "CALCULATION",
        difficulty: "MEDIUM",
        marks: 5,
        status: "DRAFT",
        stem: r`The table lists the arcs of a network and their weights.

| Arc | AB | AC | AD | BC | BE | CD | CE | CF | DF | DG | EF | EG | FG |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Weight | 8 | 5 | 12 | 4 | 7 | 6 | 11 | 10 | 3 | 17 | 12 | 14 | 13 |

Use Kruskal's algorithm to find a minimum spanning tree. List the arcs in the order you consider them, stating whether each is accepted or rejected, and give the total weight of the tree.`,
        markScheme: r`- **M1** Arcs considered in increasing order of weight, starting DF, BC, AC (1)
- **A1** Accept DF, BC, AC, CD, BE (1)
- **A1** Reject AB, CF, CE (they would form cycles) (1)
- **A1** Reject AD and EF, then accept FG (1)
- **A1** Total weight $= 3 + 4 + 5 + 6 + 7 + 13 = 38$ (1)`,
        explanation: r`Kruskal: sort arcs by weight and add each one unless it creates a cycle. Stop once you have $n - 1 = 6$ arcs. AD and EF both have weight 12 — either order is fine since both are rejected.`,
    },
    {
        seedKey: "mat-wdm11-graphs-networks-003",
        unitCode: "WDM11",
        topicSlug: "graphs-networks",
        type: "CALCULATION",
        difficulty: "HARD",
        marks: 5,
        status: "DRAFT",
        stem: r`The table lists the arcs of a network and their weights. Use Dijkstra's algorithm to find the shortest route from $A$ to $G$. State the order in which vertices are given permanent labels, the final value at each vertex, and the shortest route and its length.

| Arc | AB | AC | AD | BC | BE | CD | CE | CF | DF | DG | EF | EG | FG |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Weight | 8 | 5 | 12 | 4 | 7 | 6 | 11 | 10 | 3 | 17 | 12 | 14 | 13 |`,
        markScheme: r`- **M1** Correct use of Dijkstra: working values updated and the smallest made permanent each time (1)
- **A1** Order of labelling: A, C, B, D, F, E, G (1)
- **A1** Final values: A 0, C 5, B 8, D 11, F 14, E 15, G 27 (1)
- **A1** Shortest route $A \to C \to D \to F \to G$ (1)
- **A1** Length 27 (1)`,
        explanation: r`Trace back from $G$: an arc is on the route if the difference in final values equals its weight, e.g. $27 - 14 = 13$ = FG. The direct arc AD (12) is longer than $A \to C \to D$ (11).`,
    },

    // --- graphs-networks-2 ---
    {
        seedKey: "mat-wdm11-graphs-networks-2-001",
        unitCode: "WDM11",
        topicSlug: "graphs-networks-2",
        type: "MCQ",
        difficulty: "EASY",
        marks: 1,
        status: "DRAFT",
        stem: r`A network has exactly four vertices of odd degree. In the route inspection algorithm, how many different ways of pairing these odd vertices must be considered?`,
        options: opts("2", "3", "4", "6", "B"),
        markScheme: r`- **B** (1) — with odd vertices $P, Q, R, S$: $PQ/RS$, $PR/QS$, $PS/QR$.`,
        explanation: r`Fix one vertex; it can be paired with any of the other 3, and the remaining two are forced. 6 counts the individual pairs, not the pairings.`,
    },
    {
        seedKey: "mat-wdm11-graphs-networks-2-002",
        unitCode: "WDM11",
        topicSlug: "graphs-networks-2",
        type: "CALCULATION",
        difficulty: "MEDIUM",
        marks: 6,
        status: "DRAFT",
        stem: r`A road inspector must travel along every road in the network below at least once, starting and finishing at $A$. Road lengths are in km.

| Road | AB | AC | AD | BC | BE | CD | CE | CF | DF |
|---|---|---|---|---|---|---|---|---|---|
| Length | 6 | 9 | 7 | 5 | 8 | 4 | 3 | 10 | 6 |

Use the route inspection algorithm to find the length of the shortest inspection route. State which roads must be travelled twice.`,
        markScheme: r`- **B1** Total length of roads $= 58\,\text{km}$ (1)
- **B1** Odd vertices: $A$ (3), $B$ (3), $C$ (5), $D$ (3) (1)
- **M1** All three pairings considered: $AB + CD = 6 + 4 = 10$ (1)
- **A1** $AC + BD = 9 + 9 = 18$ and $AD + BC = 7 + 5 = 12$ (1)
- **A1** Repeat roads $AB$ and $CD$ (1)
- **A1** Shortest route $= 58 + 10 = 68\,\text{km}$ (1)`,
        explanation: r`Only odd vertices need pairing; $E$ and $F$ are even. The shortest $B$–$D$ path is $B \to C \to D = 9$, not a direct road.`,
    },
    {
        seedKey: "mat-wdm11-graphs-networks-2-003",
        unitCode: "WDM11",
        topicSlug: "graphs-networks-2",
        type: "CALCULATION",
        difficulty: "HARD",
        marks: 6,
        status: "DRAFT",
        stem: r`The table shows the travel times, in minutes, between five towns.

|   | A | B | C | D | E |
|---|---|---|---|---|---|
| **A** | – | 27 | 23 | 26 | 22 |
| **B** | 27 | – | 10 | 28 | 16 |
| **C** | 23 | 10 | – | 29 | 19 |
| **D** | 26 | 28 | 29 | – | 18 |
| **E** | 22 | 16 | 19 | 18 | – |

(a) Use the nearest neighbour algorithm, starting at $A$, to find an upper bound for the travelling salesperson problem.

(b) By deleting $A$ and finding a minimum spanning tree for the remaining towns, find a lower bound.

(c) Write down an interval within which the optimal tour length must lie.`,
        markScheme: r`- (a) **M1** Route $A \to E \to B \to C \to D \to A$ (1)
- **A1** Upper bound $= 22 + 16 + 10 + 29 + 26 = 103$ minutes (1)
- (b) **M1** MST on $B, C, D, E$: $BC$ (10), $BE$ (16), $ED$ (18), weight 44 (1)
- **M1** Add the two shortest arcs from $A$: $AE$ (22) and $AC$ (23) (1)
- **A1** Lower bound $= 44 + 22 + 23 = 89$ minutes (1)
- (c) $89 \le \text{optimal} \le 103$ (1)`,
        explanation: r`The nearest neighbour tour must return to the start, here using DA (26). For the lower bound, the deleted vertex is reconnected by its **two** shortest arcs. (The optimal tour, $A \to C \to B \to E \to D \to A$, has length 93.)`,
    },

    // --- critical-path-analysis ---
    {
        seedKey: "mat-wdm11-critical-path-analysis-001",
        unitCode: "WDM11",
        topicSlug: "critical-path-analysis",
        type: "MCQ",
        difficulty: "EASY",
        marks: 1,
        status: "DRAFT",
        stem: r`Activity $K$ has duration 4 days. The early event time at its start is 6 and the late event time at its end is 15. What is the total float on $K$?`,
        options: opts("4", "5", "9", "11", "B"),
        markScheme: r`- **B** (1) — total float $=$ late end time $-$ early start time $-$ duration $= 15 - 6 - 4 = 5$.`,
        explanation: r`Forgetting to subtract the duration gives 9. A critical activity has total float 0.`,
    },
    {
        seedKey: "mat-wdm11-critical-path-analysis-002",
        unitCode: "WDM11",
        topicSlug: "critical-path-analysis",
        type: "CALCULATION",
        difficulty: "HARD",
        marks: 7,
        status: "DRAFT",
        stem: r`A project consists of the activities in the precedence table. Durations are in days.

| Activity | Duration | Immediately preceded by |
|---|---|---|
| A | 4 | – |
| B | 6 | – |
| C | 3 | A |
| D | 5 | A |
| E | 7 | B, C |
| F | 4 | B, C |
| G | 6 | D, E |
| H | 3 | F |
| I | 2 | D |

(a) Find the earliest start time and latest finish time of each activity.

(b) State the critical path and the minimum project duration.

(c) Find the total float on activities $B$ and $D$.

(d) Calculate a lower bound for the number of workers needed to complete the project in the minimum time.`,
        markScheme: r`- (a) **M1** Forward pass: earliest starts A 0, B 0, C 4, D 4, E 7, F 7, G 14, H 11, I 9 (1)
- **M1** Backward pass from 20 (1)
- **A1** Latest finishes A 4, B 7, C 7, D 14, E 14, F 17, G 20, H 20, I 20 (1)
- (b) Critical path $A$–$C$–$E$–$G$ (1)
- Minimum duration 20 days (1)
- (c) Float on $B = 7 - 0 - 6 = 1$ and on $D = 14 - 4 - 5 = 5$ (1)
- (d) $\dfrac{40}{20} = 2$ workers (1)`,
        explanation: r`E can't start until both B (finishes day 6) and C (finishes day 7) are done, so its earliest start is the **larger**, 7. For D the latest finish is the smaller of the latest starts of G (14) and I (18).`,
    },

    // --- linear-programming ---
    {
        seedKey: "mat-wdm11-linear-programming-001",
        unitCode: "WDM11",
        topicSlug: "linear-programming",
        type: "MCQ",
        difficulty: "EASY",
        marks: 1,
        status: "DRAFT",
        stem: r`The feasible region of a linear programming problem has vertices $(0, 0)$, $(0, 6)$, $(4, 4)$ and $(6, 0)$. At which vertex is $P = 3x + 2y$ maximised?`,
        options: opts(r`$(0, 0)$`, r`$(0, 6)$`, r`$(4, 4)$`, r`$(6, 0)$`, "C"),
        markScheme: r`- **C** (1) — $P = 0, 12, 20, 18$ at the four vertices, so the maximum is 20 at $(4, 4)$.`,
        explanation: r`The optimum of a linear objective lies at a vertex of the feasible region; test each vertex (or slide an objective line) rather than picking the largest coordinate.`,
    },
    {
        seedKey: "mat-wdm11-linear-programming-002",
        unitCode: "WDM11",
        topicSlug: "linear-programming",
        type: "CALCULATION",
        difficulty: "MEDIUM",
        marks: 6,
        status: "DRAFT",
        stem: r`A bakery makes $x$ trays of muffins and $y$ trays of cookies each day.

- Each tray of muffins uses 2 kg of flour and 4 kg of sugar; each tray of cookies uses 3 kg of flour and 2 kg of sugar.
- At most 120 kg of flour and 160 kg of sugar are available each day.
- At least 10 trays of cookies must be made.
- Profit is \$5 per tray of muffins and \$4 per tray of cookies.

(a) Formulate this as a linear programming problem.

(b) The vertices of the feasible region are $(0, 10)$, $(0, 40)$, $(30, 20)$ and $(35, 10)$. Find the number of trays of each type that maximises profit, and the maximum profit.`,
        markScheme: r`- (a) Flour: $2x + 3y \le 120$ (1)
- Sugar: $4x + 2y \le 160$, i.e. $2x + y \le 80$ (1)
- $y \ge 10$, $x \ge 0$, maximise $P = 5x + 4y$ (1)
- (b) **M1** $(30, 20)$ is the intersection of $2x + 3y = 120$ and $2x + y = 80$ (1)
- **M1** Evaluate $P$: $40$, $160$, $230$, $215$ (1)
- **A1** 30 trays of muffins and 20 trays of cookies, profit \$230 (1)`,
        explanation: r`Translate each sentence into one inequality, and state the objective with "maximise". Evaluating the objective at each vertex is a valid alternative to the objective-line method.`,
    },
    {
        seedKey: "mat-wdm11-linear-programming-003",
        unitCode: "WDM11",
        topicSlug: "linear-programming",
        type: "MCQ",
        difficulty: "MEDIUM",
        marks: 1,
        status: "DRAFT",
        stem: r`A shop sells $x$ phones and $y$ tablets. The manager requires that **at least 40%** of the items sold are phones. Which constraint models this?`,
        options: opts(r`$x \ge 0.4y$`, r`$3x \ge 2y$`, r`$2x \ge 3y$`, r`$5x \ge 2y$`, "B"),
        markScheme: r`- **B** (1) — $x \ge 0.4(x + y)$ gives $0.6x \ge 0.4y$, i.e. $3x \ge 2y$.`,
        explanation: r`"40% of the items" means 40% of the **total** $x + y$, not of $y$ alone — the trap behind option A.`,
    },
];

export const mathematicsAppliedQuestions: SeedQuestion[] = [...wme01, ...wme02, ...wst01, ...wst02, ...wdm11];
