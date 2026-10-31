import type { SeedFlashcard } from "../types";

// Original flashcards for the applied Mathematics units (WME01, WME02, WST01, WST02, WDM11), written for this app,
// not taken from Pearson material. Mechanics uses g = 9.8 m s^-2. Seed keys are generated from position:
// mat-<unit>-<topic>-fc-01, -02, ... so append new cards to the end of a topic's list rather than inserting them,
// or existing keys will shift.

// String.raw keeps LaTeX backslashes intact (e.g. \text, \times) inside template literals.
const r = String.raw;

function deck(unitCode: string, topicSlug: string, cards: [front: string, back: string][]): SeedFlashcard[] {
    return cards.map(([front, back], i) => ({
        seedKey: `mat-${unitCode.toLowerCase()}-${topicSlug}-fc-${String(i + 1).padStart(2, "0")}`,
        unitCode,
        topicSlug,
        front,
        back,
    }));
}

// ---------------------------------------------------------------------------------------------------------------
// WME01 — Mechanics 1
// ---------------------------------------------------------------------------------------------------------------

// --- WME01 mathematical-models ---
const me1Models = deck("WME01", "mathematical-models", [
    [
        r`What does it mean to model an object as a **particle**?`,
        r`Its size is negligible, so all its mass acts at a single point. Consequences: it does not rotate, and air resistance and the object's shape can be ignored.`,
    ],
    [
        r`What do the words **light** and **inextensible** tell you about a string?`,
        r`- **Light**: negligible mass, so the tension is the same throughout the string.
- **Inextensible**: it does not stretch, so connected particles have the same speed and the same magnitude of acceleration.`,
    ],
    [
        r`What does modelling a surface or pulley as **smooth** mean?`,
        r`There is no friction. A smooth pulley also means the tension is the same on both sides of the pulley.`,
    ],
    [
        r`What is a **rigid body** / **uniform rod**, and a **lamina**?`,
        r`- **Rod**: one-dimensional, does not bend; if **uniform**, its weight acts at its midpoint.
- **Lamina**: a flat object whose thickness is negligible.`,
    ],
]);

// --- WME01 vectors-in-mechanics ---
const me1Vectors = deck("WME01", "vectors-in-mechanics", [
    [
        r`How do you find the magnitude and direction of $a\mathbf{i} + b\mathbf{j}$?`,
        r`- Magnitude: $\sqrt{a^2 + b^2}$
- Angle with $\mathbf{i}$: $\tan\theta = \dfrac{b}{a}$ (draw a sketch to get the correct quadrant)`,
    ],
    [
        r`Position of a particle moving with constant velocity $\mathbf{v}$ from initial position $\mathbf{r}_0$?`,
        r`$$\mathbf{r} = \mathbf{r}_0 + t\mathbf{v}$$`,
    ],
    [
        r`Constant-acceleration (suvat) equations in vector form.`,
        r`- $\mathbf{v} = \mathbf{u} + \mathbf{a}t$
- $\mathbf{r} = \mathbf{u}t + \tfrac{1}{2}\mathbf{a}t^2$ (displacement)`,
    ],
    [
        r`A particle moves parallel to the vector $p\mathbf{i} + q\mathbf{j}$. What does this tell you about its velocity $x\mathbf{i} + y\mathbf{j}$?`,
        r`The velocity is a scalar multiple of $p\mathbf{i} + q\mathbf{j}$, so $\dfrac{x}{p} = \dfrac{y}{q}$ (i.e. $qx = py$).`,
    ],
]);

// --- WME01 kinematics ---
const me1Kinematics = deck("WME01", "kinematics", [
    [
        r`List the five suvat equations.`,
        r`- $v = u + at$
- $s = \tfrac{1}{2}(u + v)t$
- $s = ut + \tfrac{1}{2}at^2$
- $s = vt - \tfrac{1}{2}at^2$
- $v^2 = u^2 + 2as$

Constant acceleration only.`,
    ],
    [
        r`On a velocity–time graph, what are the gradient and the area?`,
        r`- Gradient = acceleration
- Area between the graph and the time axis = displacement (area below the axis counts as negative)`,
    ],
    [
        r`Vertical motion under gravity: what values of $a$ and sign convention should you use?`,
        r`Choose a positive direction (usually up). Then $a = -9.8\,\text{m s}^{-2}$, and a point below the start has negative displacement. At the highest point $v = 0$.`,
    ],
    [
        r`On a displacement–time graph, what does the gradient represent?`,
        r`The velocity. A horizontal section means the object is at rest.`,
    ],
]);

// --- WME01 dynamics ---
const me1Dynamics = deck("WME01", "dynamics", [
    [
        r`State Newton's second law and how to use it for connected particles.`,
        r`$F = ma$, where $F$ is the **resultant** force. For connected particles, write a separate $F = ma$ for each particle (tension appears in both), or treat the whole system as one body to find $a$ quickly.`,
    ],
    [
        r`Friction on a rough surface: limiting value and direction.`,
        r`$F \le \mu R$, with $F = \mu R$ when moving or about to move. Friction acts parallel to the surface, opposing the (possible) motion.`,
    ],
    [
        r`Define momentum and impulse.`,
        r`- Momentum $= mv$ (vector, units N s or kg m s$^{-1}$)
- Impulse $= Ft = mv - mu$ (change in momentum)`,
    ],
    [
        r`State the principle of conservation of momentum.`,
        r`If no external impulse acts, total momentum before = total momentum after:
$$m_1u_1 + m_2u_2 = m_1v_1 + m_2v_2$$
Use a consistent positive direction.`,
    ],
]);

// --- WME01 statics ---
const me1Statics = deck("WME01", "statics", [
    [
        r`What is the condition for a particle to be in equilibrium?`,
        r`The resultant force is zero: forces balance when resolved in **any** two perpendicular directions.`,
    ],
    [
        r`Weight $mg$ on a plane inclined at $\alpha$: components?`,
        r`- Down the slope: $mg\sin\alpha$
- Into the plane: $mg\cos\alpha$`,
    ],
    [
        r`What does **limiting equilibrium** mean?`,
        r`The particle is on the point of moving, so friction has reached its maximum value: $F = \mu R$.`,
    ],
    [
        r`A particle rests on a rough slope at angle $\alpha$ under its own weight only and is about to slip. What is $\mu$?`,
        r`$\mu = \tan\alpha$ (from $mg\sin\alpha = \mu mg\cos\alpha$).`,
    ],
]);

// --- WME01 moments ---
const me1Moments = deck("WME01", "moments", [
    [
        r`Define the moment of a force about a point.`,
        r`Moment = force × **perpendicular** distance from the point to the line of action of the force. Units: N m.`,
    ],
    [
        r`Conditions for a rigid body to be in equilibrium.`,
        r`1. Resultant force is zero (resolve vertically/horizontally).
2. Total clockwise moment = total anticlockwise moment about **any** point.`,
    ],
    [
        r`A plank rests on two supports and is "about to tilt" about one support. What does this tell you?`,
        r`The reaction at the **other** support is zero. Take moments about the support it tilts about.`,
    ],
    [
        r`Where does the weight of a **non-uniform** rod act?`,
        r`At its centre of mass, which is not at the midpoint; its position is usually an unknown to find from a moments equation.`,
    ],
]);

// ---------------------------------------------------------------------------------------------------------------
// WME02 — Mechanics 2
// ---------------------------------------------------------------------------------------------------------------

// --- WME02 kinematics ---
const me2Kinematics = deck("WME02", "kinematics", [
    [
        r`Link displacement, velocity and acceleration with calculus.`,
        r`- $v = \dfrac{dx}{dt}$, $a = \dfrac{dv}{dt}$
- $x = \displaystyle\int v\,dt$, $v = \displaystyle\int a\,dt$ (use initial conditions for the constant)`,
    ],
    [
        r`Projectile launched at speed $U$ at angle $\alpha$: initial components?`,
        r`- Horizontal: $U\cos\alpha$ (constant throughout)
- Vertical: $U\sin\alpha$, with acceleration $-g$`,
    ],
    [
        r`Projectile from level ground: time of flight and greatest height?`,
        r`- Time of flight $T = \dfrac{2U\sin\alpha}{g}$
- Greatest height $H = \dfrac{U^2\sin^2\alpha}{2g}$`,
    ],
    [
        r`How do you find **distance** travelled when the velocity changes sign?`,
        r`Find when $v = 0$, integrate separately over each interval, and add the **magnitudes** of the displacements.`,
    ],
]);

// --- WME02 centres-of-mass ---
const me2Com = deck("WME02", "centres-of-mass", [
    [
        r`Centre of mass of particles $m_i$ at $(x_i, y_i)$.`,
        r`$$\bar{x} = \frac{\sum m_i x_i}{\sum m_i}, \qquad \bar{y} = \frac{\sum m_i y_i}{\sum m_i}$$`,
    ],
    [
        r`Centres of mass of a uniform triangle and of a sector of radius $r$, angle $2\alpha$.`,
        r`- Triangle: mean of the vertices, $\tfrac{2}{3}$ of the way along each median from the vertex.
- Sector: $\dfrac{2r\sin\alpha}{3\alpha}$ from the centre along the axis of symmetry ($\alpha$ in radians).`,
    ],
    [
        r`How do you handle a lamina with a piece removed?`,
        r`Treat the removed piece as a **negative** mass (area):
$$\bar{x} = \frac{A_1x_1 - A_2x_2}{A_1 - A_2}$$`,
    ],
    [
        r`A body is freely suspended from a point $P$. What is its equilibrium position?`,
        r`The centre of mass lies **vertically below** $P$. Use a right-angled triangle involving the centre of mass to find the angle a given edge makes with the vertical.`,
    ],
]);

// --- WME02 work-energy ---
const me2WorkEnergy = deck("WME02", "work-energy", [
    [
        r`Formulae for work done, KE and GPE.`,
        r`- Work done by a force $= F \times$ distance moved in the direction of the force
- $\text{KE} = \tfrac{1}{2}mv^2$
- $\text{GPE} = mgh$`,
    ],
    [
        r`State the work–energy principle.`,
        r`Change in total mechanical energy (KE + PE) = work done by forces other than gravity (e.g. driving force minus work against friction/resistance).`,
    ],
    [
        r`Power: definition and formula for a vehicle.`,
        r`Power = rate of doing work (W). For a vehicle with driving force $F$ at speed $v$: $P = Fv$.`,
    ],
    [
        r`What happens at a vehicle's **maximum speed**?`,
        r`Acceleration is zero, so driving force $\dfrac{P}{v}$ = total resistance (+ $mg\sin\theta$ when going uphill).`,
    ],
]);

// --- WME02 collisions ---
const me2Collisions = deck("WME02", "collisions", [
    [
        r`State Newton's law of restitution.`,
        r`$$\text{speed of separation} = e \times \text{speed of approach}$$
with $0 \le e \le 1$.`,
    ],
    [
        r`What do $e = 0$ and $e = 1$ mean?`,
        r`- $e = 0$: perfectly inelastic — the bodies coalesce/move together.
- $e = 1$: perfectly elastic — no kinetic energy is lost.`,
    ],
    [
        r`Particle hits a fixed smooth wall at right angles with speed $u$, coefficient $e$. Rebound speed?`,
        r`$v = eu$, in the opposite direction. Impulse on the particle $= m(eu + u)$.`,
    ],
    [
        r`Strategy for successive collisions.`,
        r`Solve each collision with CLM + restitution. Then compare velocities: a further collision happens only if the bodies are moving towards each other (or the one behind is faster).`,
    ],
]);

// --- WME02 statics-rigid-bodies ---
const me2RigidBodies = deck("WME02", "statics-rigid-bodies", [
    [
        r`Forces on a ladder against a smooth wall on rough ground.`,
        r`- Weight at the centre of mass
- Ground: normal reaction $R$ (up) and friction $F$ (towards the wall)
- Wall: normal reaction $S$ only (horizontal)`,
    ],
    [
        r`Why take moments about the foot of a ladder?`,
        r`Two unknown forces (ground reaction and friction) act there, so they both disappear from the moments equation.`,
    ],
    [
        r`A rod is hinged to a wall. What force acts at the hinge?`,
        r`A reaction of unknown magnitude and direction — model it as two components (horizontal and vertical) and find each by resolving.`,
    ],
    [
        r`How do you find the moment of a force at an angle to a rod?`,
        r`Either multiply the force by the perpendicular distance to its line of action, or resolve the force into components along and perpendicular to the rod (only the perpendicular part has a moment about a point on the rod).`,
    ],
]);

// ---------------------------------------------------------------------------------------------------------------
// WST01 — Statistics 1
// ---------------------------------------------------------------------------------------------------------------

// --- WST01 mathematical-models ---
const st1Models = deck("WST01", "mathematical-models", [
    [
        r`What is a statistical model?`,
        r`A simplified mathematical description of a real-world situation, used to make predictions and improve understanding.`,
    ],
    [
        r`Steps in the statistical modelling cycle.`,
        r`1. Observe a real-world problem
2. Devise a model (with assumptions)
3. Make predictions
4. Collect experimental data
5. Compare predictions with data
6. Refine the model and repeat`,
    ],
    [
        r`Advantages of statistical models.`,
        r`Quick and cheap; help understand the world; allow predictions; can show how changing conditions affects outcomes.`,
    ],
    [
        r`Disadvantages of statistical models.`,
        r`They simplify reality, so predictions are not exact; they may only work for a limited range of values; they rely on assumptions which may be wrong.`,
    ],
]);

// --- WST01 data-representation ---
const st1Data = deck("WST01", "data-representation", [
    [
        r`Histogram: frequency density formula.`,
        r`$$\text{frequency density} = \frac{\text{frequency}}{\text{class width}}$$
Area of each bar is proportional to frequency.`,
    ],
    [
        r`Mean and variance from summary statistics.`,
        r`- $\bar{x} = \dfrac{\sum x}{n}$
- $\sigma^2 = \dfrac{\sum x^2}{n} - \bar{x}^2$ (standard deviation is its square root)`,
    ],
    [
        r`Effect of coding $y = \dfrac{x - a}{b}$ on mean and standard deviation.`,
        r`- $\bar{y} = \dfrac{\bar{x} - a}{b}$
- $\sigma_y = \dfrac{\sigma_x}{b}$ (adding/subtracting does not change spread)`,
    ],
    [
        r`Common rule for an outlier, and how a box plot shows it.`,
        r`A value below $Q_1 - 1.5 \times \text{IQR}$ or above $Q_3 + 1.5 \times \text{IQR}$ (the rule in a question may differ). Plot it as a cross; the whisker stops at the most extreme non-outlier.`,
    ],
]);

// --- WST01 probability ---
const st1Probability = deck("WST01", "probability", [
    [
        r`Addition rule for two events.`,
        r`$$P(A \cup B) = P(A) + P(B) - P(A \cap B)$$`,
    ],
    [
        r`Conditional probability formula.`,
        r`$$P(A \mid B) = \frac{P(A \cap B)}{P(B)}$$`,
    ],
    [
        r`Test for **independence**.`,
        r`$A$ and $B$ are independent if $P(A \cap B) = P(A) \times P(B)$, equivalently $P(A \mid B) = P(A)$.`,
    ],
    [
        r`What are **mutually exclusive** events?`,
        r`Events that cannot happen together: $P(A \cap B) = 0$, so $P(A \cup B) = P(A) + P(B)$. (Mutually exclusive events with non-zero probabilities are **not** independent.)`,
    ],
]);

// --- WST01 correlation-regression ---
const st1Correlation = deck("WST01", "correlation-regression", [
    [
        r`Formulae for $S_{xx}$ and $S_{xy}$.`,
        r`- $S_{xx} = \sum x^2 - \dfrac{(\sum x)^2}{n}$
- $S_{xy} = \sum xy - \dfrac{\sum x \sum y}{n}$`,
    ],
    [
        r`Product moment correlation coefficient.`,
        r`$$r = \frac{S_{xy}}{\sqrt{S_{xx}S_{yy}}}, \qquad -1 \le r \le 1$$
It measures the strength of **linear** association.`,
    ],
    [
        r`Regression line of $y$ on $x$.`,
        r`$y = a + bx$ with $b = \dfrac{S_{xy}}{S_{xx}}$ and $a = \bar{y} - b\bar{x}$. The line passes through $(\bar{x}, \bar{y})$.`,
    ],
    [
        r`What is **extrapolation**, and why is it unreliable?`,
        r`Using the regression line to predict outside the range of the data. The linear relationship may not continue beyond the observed values.`,
    ],
]);

// --- WST01 discrete-random-variables ---
const st1Drv = deck("WST01", "discrete-random-variables", [
    [
        r`Expectation and variance of a discrete random variable.`,
        r`- $E(X) = \sum x\,P(X = x)$
- $\text{Var}(X) = E(X^2) - [E(X)]^2$`,
    ],
    [
        r`$E(aX + b)$ and $\text{Var}(aX + b)$.`,
        r`- $E(aX + b) = aE(X) + b$
- $\text{Var}(aX + b) = a^2\,\text{Var}(X)$`,
    ],
    [
        r`Discrete uniform distribution on $1, 2, \ldots, n$: mean and variance.`,
        r`- $E(X) = \dfrac{n + 1}{2}$
- $\text{Var}(X) = \dfrac{(n + 1)(n - 1)}{12}$`,
    ],
    [
        r`What is the cumulative distribution function $F(x)$ of a discrete random variable?`,
        r`$F(x) = P(X \le x)$, the running total of probabilities. $P(X = x) = F(x) - F(x - 1)$ for integer values.`,
    ],
]);

// --- WST01 normal-distribution ---
const st1Normal = deck("WST01", "normal-distribution", [
    [
        r`Key properties of $X \sim N(\mu, \sigma^2)$.`,
        r`Continuous, bell-shaped, symmetric about $\mu$; mean = median = mode. About 68% of values lie within $\mu \pm \sigma$ and 95% within $\mu \pm 2\sigma$.`,
    ],
    [
        r`How do you standardise a normal variable?`,
        r`$$Z = \frac{X - \mu}{\sigma} \sim N(0, 1)$$
Note $\sigma$ is the square root of the second parameter.`,
    ],
    [
        r`How do you find $\Phi(-z)$ from tables?`,
        r`By symmetry: $\Phi(-z) = 1 - \Phi(z)$.`,
    ],
    [
        r`How do you find unknown $\mu$ or $\sigma$ from given percentages?`,
        r`Use the inverse normal table to get $z$ for each percentage (negative below the mean), write $\dfrac{x - \mu}{\sigma} = z$ for each, and solve simultaneously.`,
    ],
]);

// ---------------------------------------------------------------------------------------------------------------
// WST02 — Statistics 2
// ---------------------------------------------------------------------------------------------------------------

// --- WST02 binomial-poisson ---
const st2BinPois = deck("WST02", "binomial-poisson", [
    [
        r`Conditions for a binomial model $B(n, p)$.`,
        r`Fixed number of trials $n$; each trial has two outcomes; constant probability of success $p$; trials are independent.`,
    ],
    [
        r`Binomial: probability formula, mean and variance.`,
        r`- $P(X = r) = \dbinom{n}{r}p^r(1 - p)^{n - r}$
- $E(X) = np$, $\text{Var}(X) = np(1 - p)$`,
    ],
    [
        r`Conditions for a Poisson model $\text{Po}(\lambda)$, and its mean/variance.`,
        r`Events occur singly, independently, at random and at a constant average rate. $P(X = r) = \dfrac{e^{-\lambda}\lambda^r}{r!}$; mean = variance = $\lambda$.`,
    ],
    [
        r`When can $B(n, p)$ be approximated by a Poisson distribution?`,
        r`When $n$ is large and $p$ is small; use $\text{Po}(np)$.`,
    ],
]);

// --- WST02 continuous-random-variables ---
const st2Crv = deck("WST02", "continuous-random-variables", [
    [
        r`Properties of a probability density function $f(x)$.`,
        r`$f(x) \ge 0$ for all $x$, and $\displaystyle\int_{-\infty}^{\infty} f(x)\,dx = 1$. Probabilities are areas: $P(a < X < b) = \displaystyle\int_a^b f(x)\,dx$.`,
    ],
    [
        r`Mean and variance of a continuous random variable.`,
        r`- $E(X) = \displaystyle\int x f(x)\,dx$
- $\text{Var}(X) = \displaystyle\int x^2 f(x)\,dx - [E(X)]^2$`,
    ],
    [
        r`Link between the pdf $f(x)$ and the cdf $F(x)$.`,
        r`$F(x) = \displaystyle\int_{-\infty}^{x} f(t)\,dt$ and $f(x) = F'(x)$.`,
    ],
    [
        r`How do you find the median, quartiles and mode of a continuous random variable?`,
        r`- Median: solve $F(m) = 0.5$ (quartiles: $0.25$, $0.75$)
- Mode: the value of $x$ where $f(x)$ is greatest (differentiate, or check endpoints)`,
    ],
]);

// --- WST02 continuous-distributions ---
const st2ContDist = deck("WST02", "continuous-distributions", [
    [
        r`Continuous uniform $X \sim U[a, b]$: pdf, mean and variance.`,
        r`- $f(x) = \dfrac{1}{b - a}$ for $a \le x \le b$
- $E(X) = \dfrac{a + b}{2}$
- $\text{Var}(X) = \dfrac{(b - a)^2}{12}$`,
    ],
    [
        r`Normal approximation to the binomial $B(n, p)$: conditions and parameters.`,
        r`$n$ large and $p$ close to 0.5. Use $N(np,\ np(1 - p))$ with a continuity correction.`,
    ],
    [
        r`Normal approximation to $\text{Po}(\lambda)$.`,
        r`When $\lambda$ is large (roughly $> 10$): use $N(\lambda, \lambda)$ with a continuity correction.`,
    ],
    [
        r`Continuity corrections for $P(X \ge 36)$, $P(X < 36)$, $P(X = 36)$.`,
        r`- $P(X \ge 36) \approx P(Y > 35.5)$
- $P(X < 36) \approx P(Y < 35.5)$
- $P(X = 36) \approx P(35.5 < Y < 36.5)$`,
    ],
]);

// --- WST02 hypothesis-tests ---
const st2Hypothesis = deck("WST02", "hypothesis-tests", [
    [
        r`Define **population**, **sample**, **census** and **sampling frame**.`,
        r`- Population: the whole set of items of interest
- Sample: a subset of the population
- Census: observes every member of the population
- Sampling frame: a list of the sampling units from which the sample is chosen`,
    ],
    [
        r`Define **critical region** and **actual significance level**.`,
        r`- Critical region: values of the test statistic that lead to rejecting $H_0$
- Actual significance level: the probability of the test statistic falling in the critical region when $H_0$ is true`,
    ],
    [
        r`One-tailed vs two-tailed test.`,
        r`- One-tailed: $H_1$ is $p > p_0$ or $p < p_0$ — whole significance level in one tail
- Two-tailed: $H_1$ is $p \ne p_0$ — split the level equally between the two tails`,
    ],
    [
        r`How should you write a hypothesis-test conclusion?`,
        r`Compare the probability (or critical region) with the significance level, say whether to reject $H_0$, then state the conclusion **in context** with non-definite language ("there is evidence that...").`,
    ],
]);

// ---------------------------------------------------------------------------------------------------------------
// WDM11 — Decision Mathematics 1
// ---------------------------------------------------------------------------------------------------------------

// --- WDM11 algorithms ---
const d1Algorithms = deck("WDM11", "algorithms", [
    [
        r`Describe one pass of a **bubble sort** (ascending).`,
        r`Compare adjacent items from left to right, swapping any pair that is out of order. After each pass the largest remaining item is in its final place. Stop after a pass with no swaps.`,
    ],
    [
        r`Steps of a **binary search** in an ordered list.`,
        r`1. Pivot = middle item, at position $\left\lceil\tfrac{\text{first} + \text{last}}{2}\right\rceil$
2. If it is the target, stop
3. Otherwise discard the half (with the pivot) that cannot contain the target
4. Repeat until found or the list is empty`,
    ],
    [
        r`Lower bound for bin packing.`,
        r`$$\left\lceil \frac{\text{total size of items}}{\text{bin capacity}} \right\rceil$$
Always round **up**.`,
    ],
    [
        r`Compare first-fit, first-fit decreasing and full-bin packing.`,
        r`- First-fit: quick, but usually not optimal
- First-fit decreasing: sort largest first, then first-fit; usually better
- Full-bin: look for combinations that fill bins exactly; often optimal but hard for large problems`,
    ],
]);

// --- WDM11 graphs-networks ---
const d1Graphs = deck("WDM11", "graphs-networks", [
    [
        r`Define **tree**, **spanning tree** and **minimum spanning tree**.`,
        r`- Tree: a connected graph with no cycles
- Spanning tree: a tree containing every vertex of the graph ($n - 1$ arcs)
- MST: a spanning tree of minimum total weight`,
    ],
    [
        r`Steps of **Kruskal's** algorithm.`,
        r`1. Sort arcs in ascending order of weight
2. Add the shortest arc not yet used, unless it forms a cycle (reject it)
3. Repeat until all vertices are connected ($n - 1$ arcs)`,
    ],
    [
        r`Steps of **Prim's** algorithm (network or matrix).`,
        r`1. Start at any vertex
2. Add the shortest arc joining a connected vertex to an unconnected one
3. Repeat until every vertex is connected

On a matrix: cross out rows of chosen vertices, search only the columns of connected vertices.`,
    ],
    [
        r`Key steps of **Dijkstra's** algorithm.`,
        r`Label the start 0 (permanent). From the latest permanent vertex, update working values of neighbours (keep the smaller). Make the smallest working value permanent. Repeat. Trace back: arc $XY$ is on the route if $\text{final}(Y) - \text{final}(X) = $ weight of $XY$.`,
    ],
]);

// --- WDM11 graphs-networks-2 ---
const d1Graphs2 = deck("WDM11", "graphs-networks-2", [
    [
        r`What are Eulerian and semi-Eulerian graphs?`,
        r`- Eulerian: all vertices have even degree; a closed route traverses every arc exactly once
- Semi-Eulerian: exactly two odd vertices; a route exists that starts at one odd vertex and ends at the other`,
    ],
    [
        r`Steps of the **route inspection** (Chinese postman) algorithm.`,
        r`1. Identify the odd vertices
2. List every pairing of them and find the shortest path for each pair
3. Choose the pairing with the least total
4. Route length = total weight of the network + that least total`,
    ],
    [
        r`TSP upper bound using the **nearest neighbour** algorithm.`,
        r`From the start, repeatedly go to the nearest unvisited vertex; when all are visited, return to the start. The tour length is an upper bound. Try different starts and keep the smallest.`,
    ],
    [
        r`TSP lower bound using the **deleted vertex** method.`,
        r`Remove one vertex and find an MST of the rest. Add the two shortest arcs from the deleted vertex. The best (largest) lower bound over different deleted vertices is most useful.`,
    ],
]);

// --- WDM11 critical-path-analysis ---
const d1Cpa = deck("WDM11", "critical-path-analysis", [
    [
        r`How are early and late event times found?`,
        r`- **Forward pass**: early time = largest (early time + duration) over arcs entering the event
- **Backward pass**: late time = smallest (late time − duration) over arcs leaving the event`,
    ],
    [
        r`Formula for **total float**, and what a critical activity is.`,
        r`Total float = late time at end − early time at start − duration. A **critical** activity has zero float; any delay to it delays the whole project.`,
    ],
    [
        r`Why are **dummy** activities used in activity networks?`,
        r`To show dependencies correctly when two activities share some but not all predecessors, and so that each activity is uniquely defined by its start and end events. Dummies have zero duration.`,
    ],
    [
        r`Lower bound for the number of workers.`,
        r`$$\left\lceil \frac{\text{sum of all activity durations}}{\text{critical path length}} \right\rceil$$`,
    ],
]);

// --- WDM11 linear-programming ---
const d1Lp = deck("WDM11", "linear-programming", [
    [
        r`Three parts of a linear programming formulation.`,
        r`1. **Decision variables** — define them precisely (e.g. $x$ = number of trays of muffins)
2. **Objective function** — maximise or minimise
3. **Constraints** — inequalities, including non-negativity $x, y \ge 0$`,
    ],
    [
        r`Where is the optimal point of a linear programming problem?`,
        r`At a vertex of the feasible region (or along an edge if the objective line is parallel to it). Find it with an objective line or by testing every vertex.`,
    ],
    [
        r`Objective line method.`,
        r`Draw a line $ax + by = k$ for the objective. Slide it parallel across the feasible region; the last vertex it touches is optimal (furthest for a maximum, first for a minimum).`,
    ],
    [
        r`What if the solution must be integers?`,
        r`Test integer points near the optimal vertex that lie inside the feasible region and pick the best value of the objective.`,
    ],
]);

export const mathematicsAppliedFlashcards: SeedFlashcard[] = [
    ...me1Models,
    ...me1Vectors,
    ...me1Kinematics,
    ...me1Dynamics,
    ...me1Statics,
    ...me1Moments,
    ...me2Kinematics,
    ...me2Com,
    ...me2WorkEnergy,
    ...me2Collisions,
    ...me2RigidBodies,
    ...st1Models,
    ...st1Data,
    ...st1Probability,
    ...st1Correlation,
    ...st1Drv,
    ...st1Normal,
    ...st2BinPois,
    ...st2Crv,
    ...st2ContDist,
    ...st2Hypothesis,
    ...d1Algorithms,
    ...d1Graphs,
    ...d1Graphs2,
    ...d1Cpa,
    ...d1Lp,
];
