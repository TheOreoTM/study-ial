import type { SeedFlashcard } from "../types";

// Original Further Mathematics flashcards for every WFM01–WFM03, WME03 and WST03 topic (written for this app, not taken
// from Pearson material). Mechanics uses g = 9.8 m s^-2. Seed keys are generated from position:
// fma-<unit>-<topic>-fc-01, -02, ... so append new cards to the end of a topic's list rather than inserting them, or
// existing keys will shift.

// String.raw keeps LaTeX backslashes intact (e.g. \text, \times) inside template literals.
const r = String.raw;

function deck(unitCode: string, topicSlug: string, cards: [front: string, back: string][]): SeedFlashcard[] {
    return cards.map(([front, back], i) => ({
        seedKey: `fma-${unitCode.toLowerCase()}-${topicSlug}-fc-${String(i + 1).padStart(2, "0")}`,
        unitCode,
        topicSlug,
        front,
        back,
    }));
}

// ---------------------------------------------------------------------------------------------------------------
// WFM01 — Further Pure Mathematics 1
// ---------------------------------------------------------------------------------------------------------------

const complexNumbers = deck("WFM01", "complex-numbers", [
    [
        r`How do you divide one complex number by another, e.g. $\dfrac{a + bi}{c + di}$?`,
        r`Multiply top and bottom by the **conjugate** of the denominator, $c - di$. The denominator becomes the real number $c^2 + d^2$.`,
    ],
    [
        r`Define the modulus and argument of $z = x + iy$.`,
        r`- $|z| = \sqrt{x^2 + y^2}$
- $\arg z = \theta$ with $\tan\theta = \dfrac{y}{x}$, $-\pi < \theta \leq \pi$

Sketch $z$ on an Argand diagram to get the quadrant right.`,
    ],
    [
        r`What happens to moduli and arguments when you multiply or divide complex numbers?`,
        r`- $|z_1 z_2| = |z_1||z_2|$, $\arg(z_1 z_2) = \arg z_1 + \arg z_2$
- $\left|\dfrac{z_1}{z_2}\right| = \dfrac{|z_1|}{|z_2|}$, $\arg\dfrac{z_1}{z_2} = \arg z_1 - \arg z_2$`,
    ],
    [
        r`A polynomial with **real** coefficients has a root $a + bi$ ($b \neq 0$). What else do you know?`,
        r`$a - bi$ is also a root, and $(z - a)^2 + b^2 = z^2 - 2az + (a^2 + b^2)$ is a real quadratic factor.`,
    ],
]);

const rootsOfQuadratics = deck("WFM01", "roots-of-quadratics", [
    [
        r`For $ax^2 + bx + c = 0$ with roots $\alpha, \beta$, state $\alpha + \beta$ and $\alpha\beta$.`,
        r`$$\alpha + \beta = -\frac{b}{a}, \qquad \alpha\beta = \frac{c}{a}$$`,
    ],
    [r`Express $\alpha^2 + \beta^2$ using $\alpha + \beta$ and $\alpha\beta$.`, r`$$\alpha^2 + \beta^2 = (\alpha + \beta)^2 - 2\alpha\beta$$`],
    [
        r`Express $\alpha^3 + \beta^3$ using $\alpha + \beta$ and $\alpha\beta$.`,
        r`$$\alpha^3 + \beta^3 = (\alpha + \beta)^3 - 3\alpha\beta(\alpha + \beta)$$`,
    ],
    [
        r`How do you form an equation whose roots are related to $\alpha$ and $\beta$?`,
        r`Find the **sum** $S$ and **product** $P$ of the new roots, then write $x^2 - Sx + P = 0$. Multiply through to get integer coefficients if asked.`,
    ],
]);

const numericalSolutions = deck("WFM01", "numerical-solutions", [
    [
        r`How do you show that $f(x) = 0$ has a root in $[a, b]$?`,
        r`Evaluate $f(a)$ and $f(b)$. If they have **opposite signs** and $f$ is **continuous** on $[a, b]$, there is a root in the interval.`,
    ],
    [r`State the Newton–Raphson formula.`, r`$$x_{n+1} = x_n - \frac{f(x_n)}{f'(x_n)}$$ It fails (or behaves badly) if $f'(x_n)$ is zero or close to zero.`],
    [
        r`What is linear interpolation on $[a, b]$?`,
        r`Join $(a, f(a))$ and $(b, f(b))$ with a straight line and find where it crosses the $x$-axis:
$$x = a + \frac{(b - a)\,|f(a)|}{|f(a)| + |f(b)|}$$`,
    ],
    [
        r`How does interval bisection work?`,
        r`Evaluate $f$ at the midpoint of the interval, keep the half where the sign change is, and repeat. Each step halves the interval width.`,
    ],
]);

const coordinateSystems = deck("WFM01", "coordinate-systems", [
    [
        r`Parabola $y^2 = 4ax$: parametric form, focus and directrix?`,
        r`- Parametric: $(at^2, 2at)$
- Focus: $(a, 0)$
- Directrix: $x = -a$

Every point is equidistant from the focus and the directrix.`,
    ],
    [r`Rectangular hyperbola $xy = c^2$: parametric form and asymptotes?`, r`- Parametric: $\left(ct, \dfrac{c}{t}\right)$
- Asymptotes: the coordinate axes $x = 0$ and $y = 0$`],
    [
        r`Gradient of $y^2 = 4ax$ at the point with parameter $t$?`,
        r`$\dfrac{dy}{dx} = \dfrac{2a}{2at} = \dfrac{1}{t}$, so the tangent is $ty = x + at^2$.`,
    ],
    [
        r`How do you find the normal to a curve at a point?`,
        r`Find the tangent gradient $m$, then the normal gradient is $-\dfrac{1}{m}$. Use $y - y_1 = -\dfrac{1}{m}(x - x_1)$.`,
    ],
]);

const matrixAlgebra = deck("WFM01", "matrix-algebra", [
    [
        r`Determinant and inverse of $\begin{pmatrix} a & b \\ c & d \end{pmatrix}$?`,
        r`$\det = ad - bc$, and if it is non-zero
$$\mathbf{M}^{-1} = \frac{1}{ad - bc}\begin{pmatrix} d & -b \\ -c & a \end{pmatrix}$$`,
    ],
    [r`When is a square matrix singular?`, r`When its determinant is **zero**. A singular matrix has no inverse.`],
    [r`What is $(\mathbf{AB})^{-1}$?`, r`$(\mathbf{AB})^{-1} = \mathbf{B}^{-1}\mathbf{A}^{-1}$ — the order reverses.`],
    [
        r`When can you multiply matrices $\mathbf{A}$ ($m \times n$) and $\mathbf{B}$ ($p \times q$)?`,
        r`$\mathbf{AB}$ exists only if $n = p$, and it is $m \times q$. In general $\mathbf{AB} \neq \mathbf{BA}$.`,
    ],
]);

const matrixTransformations = deck("WFM01", "matrix-transformations", [
    [
        r`How do you write down the matrix of a linear transformation?`,
        r`The columns are the images of $\begin{pmatrix} 1 \\ 0 \end{pmatrix}$ and $\begin{pmatrix} 0 \\ 1 \end{pmatrix}$.`,
    ],
    [
        r`Matrix for an anticlockwise rotation through $\theta$ about $O$?`,
        r`$$\begin{pmatrix} \cos\theta & -\sin\theta \\ \sin\theta & \cos\theta \end{pmatrix}$$`,
    ],
    [
        r`What does $\det \mathbf{M}$ tell you about the transformation?`,
        r`$|\det \mathbf{M}|$ is the **area scale factor**. A negative determinant means orientation is reversed (e.g. a reflection).`,
    ],
    [
        r`Transformation $\mathbf{P}$ followed by $\mathbf{Q}$ — which matrix?`,
        r`$\mathbf{QP}$ — the first transformation goes on the **right**, next to the vector.`,
    ],
]);

const seriesFp1 = deck("WFM01", "series", [
    [r`Standard result for $\displaystyle\sum_{r=1}^{n} r$?`, r`$$\sum_{r=1}^{n} r = \frac{1}{2}n(n + 1)$$`],
    [r`Standard result for $\displaystyle\sum_{r=1}^{n} r^2$?`, r`$$\sum_{r=1}^{n} r^2 = \frac{1}{6}n(n + 1)(2n + 1)$$`],
    [r`Standard result for $\displaystyle\sum_{r=1}^{n} r^3$?`, r`$$\sum_{r=1}^{n} r^3 = \frac{1}{4}n^2(n + 1)^2 = \left(\sum_{r=1}^n r\right)^2$$`],
    [
        r`How do you find $\displaystyle\sum_{r=k}^{n} f(r)$ when $k > 1$?`,
        r`$$\sum_{r=k}^{n} f(r) = \sum_{r=1}^{n} f(r) - \sum_{r=1}^{k-1} f(r)$$ Subtract up to $k - 1$, **not** $k$. Also remember $\sum_{r=1}^{n} 1 = n$.`,
    ],
]);

const proofByInduction = deck("WFM01", "proof-by-induction", [
    [
        r`What are the four parts of a proof by induction?`,
        r`1. **Basis**: show true for $n = 1$.
2. **Assumption**: assume true for $n = k$.
3. **Inductive step**: show it is then true for $n = k + 1$.
4. **Conclusion**: true for $n = 1$ and $k \Rightarrow k + 1$, so true for all $n \in \mathbb{Z}^+$.`,
    ],
    [
        r`Induction for a series $\sum_{r=1}^n f(r) = S(n)$: the inductive step?`,
        r`$\sum_{r=1}^{k+1} f(r) = S(k) + f(k + 1)$; simplify this into $S(k + 1)$.`,
    ],
    [
        r`Induction for divisibility of $f(n)$ by $m$: the trick?`,
        r`Write $f(k + 1)$ in terms of $f(k)$, e.g. $f(k+1) = a f(k) + (\text{multiple of } m)$, or show $f(k + 1) - f(k)$ is a multiple of $m$.`,
    ],
    [
        r`Induction for matrix powers $\mathbf{M}^n$: the inductive step?`,
        r`Write $\mathbf{M}^{k+1} = \mathbf{M}^k\mathbf{M}$ (or $\mathbf{M}\mathbf{M}^k$), substitute the assumed form of $\mathbf{M}^k$, multiply out and match the formula with $n = k + 1$.`,
    ],
]);

// ---------------------------------------------------------------------------------------------------------------
// WFM02 — Further Pure Mathematics 2
// ---------------------------------------------------------------------------------------------------------------

const inequalities = deck("WFM02", "inequalities", [
    [
        r`Why can't you multiply both sides of $\dfrac{f(x)}{g(x)} > h(x)$ by $g(x)$?`,
        r`The sign of $g(x)$ is unknown — if negative, the inequality reverses. Instead multiply by $g(x)^2$ (always positive) or collect everything over a common denominator.`,
    ],
    [
        r`What are the critical values of a rational inequality?`,
        r`The values where the numerator is zero **and** where the denominator is zero. Test the sign in each region between them.`,
    ],
    [
        r`How do you handle $|f(x)| < g(x)$?`,
        r`Sketch both graphs. Solve $f(x) = g(x)$ and $-f(x) = g(x)$, and check each solution is a genuine intersection on the sketch.`,
    ],
    [r`When can you square both sides of $|f(x)| < |g(x)|$?`, r`Always — both sides are non-negative, so $|f(x)| < |g(x)| \iff f(x)^2 < g(x)^2$.`],
]);

const seriesFp2 = deck("WFM02", "series", [
    [
        r`What is the method of differences?`,
        r`If $u_r = f(r) - f(r + 1)$, then $\displaystyle\sum_{r=1}^{n} u_r = f(1) - f(n + 1)$: the middle terms cancel in pairs.`,
    ],
    [
        r`Partial fractions for $\dfrac{1}{r(r + 1)}$?`,
        r`$$\frac{1}{r(r+1)} = \frac{1}{r} - \frac{1}{r + 1}$$`,
    ],
    [
        r`With fractions $\dfrac{1}{r} - \dfrac{1}{r + 2}$, how many terms survive the cancellation?`,
        r`**Two** at the start and **two** at the end: $1 + \tfrac{1}{2} - \tfrac{1}{n + 1} - \tfrac{1}{n + 2}$. Write out the first three and last three rows to see it.`,
    ],
    [
        r`How do you check a method-of-differences answer?`,
        r`Substitute $n = 1$ (and $n = 2$) into your formula and compare with adding the first term(s) by hand.`,
    ],
]);

const furtherComplexNumbers = deck("WFM02", "further-complex-numbers", [
    [r`State Euler's relation.`, r`$$e^{i\theta} = \cos\theta + i\sin\theta$$ So $z = re^{i\theta}$ is the exponential form of a complex number.`],
    [r`State de Moivre's theorem.`, r`$$(\cos\theta + i\sin\theta)^n = \cos n\theta + i\sin n\theta$$ for integer $n$.`],
    [
        r`How do you solve $z^n = re^{i\theta}$?`,
        r`$$z = r^{1/n}e^{i(\theta + 2k\pi)/n}, \quad k = 0, 1, \dots, n - 1$$ The $n$ roots are equally spaced around a circle of radius $r^{1/n}$.`,
    ],
    [
        r`Loci: what do $|z - a| = r$, $|z - a| = |z - b|$ and $\arg(z - a) = \theta$ represent?`,
        r`- Circle, centre $a$, radius $r$
- Perpendicular bisector of the line joining $a$ and $b$
- Half-line from $a$ (not including $a$) at angle $\theta$ to the positive real direction`,
    ],
]);

const firstOrderDe = deck("WFM02", "first-order-differential-equations", [
    [
        r`How do you solve $\dfrac{dy}{dx} + P(x)y = Q(x)$?`,
        r`Integrating factor $I = e^{\int P\,dx}$. Then $\dfrac{d}{dx}(Iy) = IQ$, so $Iy = \int IQ\,dx + c$.`,
    ],
    [r`Integrating factor for $P(x) = \tan x$?`, r`$e^{\int \tan x\,dx} = e^{\ln \sec x} = \sec x$.`],
    [
        r`An equation has $\dfrac{dy}{dx}$ multiplied by a function of $x$, e.g. $x\dfrac{dy}{dx} + 2y = x^3$. First step?`,
        r`Divide through by the coefficient of $\dfrac{dy}{dx}$ to reach standard form $\dfrac{dy}{dx} + \dfrac{2}{x}y = x^2$.`,
    ],
    [
        r`What is the difference between a general and a particular solution?`,
        r`The **general** solution contains an arbitrary constant. A **particular** solution uses a given condition (e.g. $y = 2$ when $x = 0$) to fix it.`,
    ],
]);

const secondOrderDe = deck("WFM02", "second-order-differential-equations", [
    [
        r`Complementary function for $ay'' + by' + cy = 0$: the three cases?`,
        r`Auxiliary equation $am^2 + bm + c = 0$:
- Distinct real $\alpha, \beta$: $Ae^{\alpha x} + Be^{\beta x}$
- Repeated $\alpha$: $(A + Bx)e^{\alpha x}$
- Complex $p \pm qi$: $e^{px}(A\cos qx + B\sin qx)$`,
    ],
    [
        r`Trial particular integrals for $f(x) = $ polynomial, $ke^{px}$, $k\cos qx$?`,
        r`- Polynomial of degree $n$: general polynomial of degree $n$
- $ke^{px}$: $\lambda e^{px}$
- $k\cos qx$ or $k\sin qx$: $\lambda\cos qx + \mu\sin qx$`,
    ],
    [
        r`What if the trial PI already appears in the complementary function?`,
        r`Multiply the trial function by $x$ (by $x^2$ if the auxiliary equation has a repeated root equal to it).`,
    ],
    [
        r`When do you apply boundary conditions?`,
        r`Only to the **general solution** $y = \text{CF} + \text{PI}$ — never to the CF alone.`,
    ],
]);

const maclaurinTaylor = deck("WFM02", "maclaurin-taylor", [
    [r`State the Maclaurin series of $f(x)$.`, r`$$f(x) = f(0) + f'(0)x + \frac{f''(0)}{2!}x^2 + \dots + \frac{f^{(r)}(0)}{r!}x^r + \dots$$`],
    [
        r`Maclaurin series for $e^x$, $\sin x$ and $\cos x$?`,
        r`- $e^x = 1 + x + \dfrac{x^2}{2!} + \dfrac{x^3}{3!} + \dots$ (all $x$)
- $\sin x = x - \dfrac{x^3}{3!} + \dfrac{x^5}{5!} - \dots$ (all $x$)
- $\cos x = 1 - \dfrac{x^2}{2!} + \dfrac{x^4}{4!} - \dots$ (all $x$)`,
    ],
    [r`Maclaurin series for $\ln(1 + x)$, and its validity?`, r`$$\ln(1 + x) = x - \frac{x^2}{2} + \frac{x^3}{3} - \dots, \qquad -1 < x \leq 1$$`],
    [
        r`State the Taylor series of $f(x)$ about $x = a$.`,
        r`$$f(x) = f(a) + f'(a)(x - a) + \frac{f''(a)}{2!}(x - a)^2 + \dots$$ Useful for approximating near $a$ or for series solutions of differential equations.`,
    ],
]);

const polarCoordinates = deck("WFM02", "polar-coordinates", [
    [r`Conversions between polar and Cartesian coordinates?`, r`- $x = r\cos\theta$, $y = r\sin\theta$
- $r^2 = x^2 + y^2$, $\tan\theta = \dfrac{y}{x}$`],
    [r`Area enclosed by a polar curve between $\theta = \alpha$ and $\theta = \beta$?`, r`$$A = \frac{1}{2}\int_\alpha^\beta r^2\,d\theta$$`],
    [
        r`Tangent **parallel** to the initial line — what condition?`,
        r`$\dfrac{dy}{d\theta} = 0$, where $y = r\sin\theta$.`,
    ],
    [
        r`Tangent **perpendicular** to the initial line — what condition?`,
        r`$\dfrac{dx}{d\theta} = 0$, where $x = r\cos\theta$.`,
    ],
]);

// ---------------------------------------------------------------------------------------------------------------
// WFM03 — Further Pure Mathematics 3
// ---------------------------------------------------------------------------------------------------------------

const hyperbolicFunctions = deck("WFM03", "hyperbolic-functions", [
    [r`Define $\sinh x$, $\cosh x$ and $\tanh x$.`, r`- $\sinh x = \dfrac{e^x - e^{-x}}{2}$
- $\cosh x = \dfrac{e^x + e^{-x}}{2}$
- $\tanh x = \dfrac{\sinh x}{\cosh x} = \dfrac{e^{2x} - 1}{e^{2x} + 1}$`],
    [
        r`What is Osborn's rule?`,
        r`To turn a trig identity into a hyperbolic one, replace $\cos$ with $\cosh$ and $\sin$ with $\sinh$, and change the sign of any term containing a product of two sines (e.g. $\sin^2$, $\tan^2$).`,
    ],
    [
        r`Logarithmic forms of $\operatorname{arsinh} x$ and $\operatorname{arcosh} x$?`,
        r`- $\operatorname{arsinh} x = \ln\left(x + \sqrt{x^2 + 1}\right)$
- $\operatorname{arcosh} x = \ln\left(x + \sqrt{x^2 - 1}\right)$, $x \geq 1$`,
    ],
    [r`Logarithmic form of $\operatorname{artanh} x$?`, r`$$\operatorname{artanh} x = \frac{1}{2}\ln\left(\frac{1 + x}{1 - x}\right), \qquad |x| < 1$$`],
]);

const furtherCoordinateSystems = deck("WFM03", "further-coordinate-systems", [
    [
        r`Ellipse $\dfrac{x^2}{a^2} + \dfrac{y^2}{b^2} = 1$ ($a > b$): eccentricity, foci and directrices?`,
        r`- $b^2 = a^2(1 - e^2)$, $0 < e < 1$
- Foci $(\pm ae, 0)$
- Directrices $x = \pm\dfrac{a}{e}$`,
    ],
    [
        r`Hyperbola $\dfrac{x^2}{a^2} - \dfrac{y^2}{b^2} = 1$: eccentricity, foci, directrices, asymptotes?`,
        r`- $b^2 = a^2(e^2 - 1)$, $e > 1$
- Foci $(\pm ae, 0)$, directrices $x = \pm\dfrac{a}{e}$
- Asymptotes $y = \pm\dfrac{b}{a}x$`,
    ],
    [
        r`Parametric forms of the ellipse and the hyperbola?`,
        r`- Ellipse: $(a\cos\theta, b\sin\theta)$
- Hyperbola: $(a\cosh t, b\sinh t)$ or $(a\sec\theta, b\tan\theta)$`,
    ],
    [
        r`What is the focus–directrix property of a conic?`,
        r`For any point $P$ on the curve, $PS = e \times PM$, where $S$ is a focus and $PM$ is the distance to the corresponding directrix.`,
    ],
]);

const differentiation = deck("WFM03", "differentiation", [
    [r`Derivatives of $\sinh x$, $\cosh x$, $\tanh x$?`, r`- $\dfrac{d}{dx}\sinh x = \cosh x$
- $\dfrac{d}{dx}\cosh x = \sinh x$ (no minus sign)
- $\dfrac{d}{dx}\tanh x = \operatorname{sech}^2 x$`],
    [r`Derivatives of $\arcsin x$, $\arccos x$, $\arctan x$?`, r`- $\dfrac{1}{\sqrt{1 - x^2}}$
- $-\dfrac{1}{\sqrt{1 - x^2}}$
- $\dfrac{1}{1 + x^2}$`],
    [r`Derivatives of $\operatorname{arsinh} x$, $\operatorname{arcosh} x$, $\operatorname{artanh} x$?`, r`- $\dfrac{1}{\sqrt{x^2 + 1}}$
- $\dfrac{1}{\sqrt{x^2 - 1}}$, $x > 1$
- $\dfrac{1}{1 - x^2}$, $|x| < 1$`],
    [
        r`How do you differentiate an inverse function such as $y = \operatorname{arcosh} x$ from first principles?`,
        r`Write $x = \cosh y$, differentiate: $\dfrac{dx}{dy} = \sinh y = \sqrt{\cosh^2 y - 1} = \sqrt{x^2 - 1}$, then take the reciprocal.`,
    ],
]);

const integration = deck("WFM03", "integration", [
    [
        r`$\displaystyle\int \frac{dx}{\sqrt{x^2 + a^2}}$ and $\displaystyle\int \frac{dx}{\sqrt{x^2 - a^2}}$?`,
        r`- $\operatorname{arsinh}\dfrac{x}{a} + c$
- $\operatorname{arcosh}\dfrac{x}{a} + c$, $x > a$

No $\tfrac{1}{a}$ factor in either.`,
    ],
    [
        r`$\displaystyle\int \frac{dx}{a^2 + x^2}$ and $\displaystyle\int \frac{dx}{\sqrt{a^2 - x^2}}$?`,
        r`- $\dfrac{1}{a}\arctan\dfrac{x}{a} + c$
- $\arcsin\dfrac{x}{a} + c$, $|x| < a$`,
    ],
    [
        r`What is a reduction formula and how is one usually derived?`,
        r`A relation between $I_n$ and $I_{n-1}$ (or $I_{n-2}$) for an integral depending on $n$. Usually derived by **integration by parts**, sometimes with a trig or hyperbolic identity.`,
    ],
    [
        r`Formulae for arc length and surface area of revolution (about the $x$-axis)?`,
        r`- Arc length: $s = \displaystyle\int \sqrt{1 + \left(\frac{dy}{dx}\right)^2}\,dx$
- Surface area: $S = 2\pi\displaystyle\int y\sqrt{1 + \left(\frac{dy}{dx}\right)^2}\,dx$

Parametric: replace the root by $\sqrt{\dot{x}^2 + \dot{y}^2}$ and integrate with respect to $t$.`,
    ],
]);

const vectors = deck("WFM03", "vectors", [
    [
        r`Vector product $\mathbf{a} \times \mathbf{b}$: magnitude and direction?`,
        r`$|\mathbf{a} \times \mathbf{b}| = |\mathbf{a}||\mathbf{b}|\sin\theta$, perpendicular to both $\mathbf{a}$ and $\mathbf{b}$ (right-hand rule). $\mathbf{b} \times \mathbf{a} = -\mathbf{a} \times \mathbf{b}$.`,
    ],
    [
        r`Areas and volumes from vector products?`,
        r`- Triangle area $= \tfrac{1}{2}|\mathbf{a} \times \mathbf{b}|$
- Parallelepiped volume $= |\mathbf{a} \cdot (\mathbf{b} \times \mathbf{c})|$
- Tetrahedron volume $= \tfrac{1}{6}|\mathbf{a} \cdot (\mathbf{b} \times \mathbf{c})|$`,
    ],
    [
        r`Forms of the equation of a plane?`,
        r`- Vector: $\mathbf{r} = \mathbf{a} + \lambda\mathbf{b} + \mu\mathbf{c}$
- Scalar product: $\mathbf{r} \cdot \mathbf{n} = \mathbf{a} \cdot \mathbf{n}$
- Cartesian: $n_1x + n_2y + n_3z = d$`,
    ],
    [
        r`Equation of a line in vector-product form, and the perpendicular distance from a point to a plane?`,
        r`- Line: $(\mathbf{r} - \mathbf{a}) \times \mathbf{b} = \mathbf{0}$
- Distance from $(x_1, y_1, z_1)$ to $n_1x + n_2y + n_3z = d$: $\dfrac{|n_1x_1 + n_2y_1 + n_3z_1 - d|}{\sqrt{n_1^2 + n_2^2 + n_3^2}}$`,
    ],
]);

const furtherMatrixAlgebra = deck("WFM03", "further-matrix-algebra", [
    [
        r`How do you find the inverse of a $3 \times 3$ matrix?`,
        r`1. Find $\det \mathbf{A}$ (non-zero).
2. Matrix of cofactors.
3. Transpose to get the adjugate.
4. $\mathbf{A}^{-1} = \dfrac{1}{\det \mathbf{A}}\operatorname{adj}\mathbf{A}$.`,
    ],
    [
        r`Definition of an eigenvalue and eigenvector, and how to find eigenvalues?`,
        r`$\mathbf{Ax} = \lambda\mathbf{x}$ with $\mathbf{x} \neq \mathbf{0}$. Eigenvalues solve the characteristic equation $\det(\mathbf{A} - \lambda\mathbf{I}) = 0$.`,
    ],
    [
        r`What is an orthogonal matrix?`,
        r`A square matrix with $\mathbf{P}^{\mathrm{T}}\mathbf{P} = \mathbf{I}$, so $\mathbf{P}^{-1} = \mathbf{P}^{\mathrm{T}}$. Its columns are mutually perpendicular **unit** vectors.`,
    ],
    [
        r`How do you diagonalise a symmetric matrix $\mathbf{A}$?`,
        r`Find the eigenvalues and eigenvectors, normalise the eigenvectors and use them as the columns of $\mathbf{P}$. Then $\mathbf{P}^{\mathrm{T}}\mathbf{AP} = \mathbf{D}$, with the eigenvalues on the diagonal of $\mathbf{D}$ in the same order.`,
    ],
]);

// ---------------------------------------------------------------------------------------------------------------
// WME03 — Mechanics 3
// ---------------------------------------------------------------------------------------------------------------

const furtherKinematics = deck("WME03", "further-kinematics", [
    [r`Acceleration given as a function of $t$: how do you find $v$?`, r`$v = \displaystyle\int a\,dt$, then use an initial condition to find the constant.`],
    [
        r`Acceleration given as a function of displacement $x$: which form of acceleration?`,
        r`$$a = v\frac{dv}{dx} = \frac{d}{dx}\left(\tfrac{1}{2}v^2\right)$$ Separate variables: $\int v\,dv = \int a(x)\,dx$.`,
    ],
    [
        r`Acceleration given as a function of velocity $v$: options?`,
        r`- To find $t$: $\dfrac{dv}{dt} = f(v) \Rightarrow \displaystyle\int \frac{dv}{f(v)} = \int dt$
- To find $x$: $v\dfrac{dv}{dx} = f(v) \Rightarrow \displaystyle\int \frac{v\,dv}{f(v)} = \int dx$`,
    ],
    [
        r`Resistance acting on a moving particle — what sign does it take?`,
        r`It opposes the motion, so in the direction of motion it is **negative**, e.g. $m\dfrac{dv}{dt} = -kv$.`,
    ],
]);

const elasticStrings = deck("WME03", "elastic-strings-springs", [
    [r`State Hooke's law for an elastic string or spring.`, r`$$T = \frac{\lambda x}{l}$$ $\lambda$ = modulus of elasticity (N), $x$ = extension, $l$ = natural length.`],
    [r`Elastic potential energy stored in a stretched string?`, r`$$\text{EPE} = \frac{\lambda x^2}{2l}$$`],
    [
        r`How does a spring differ from a string?`,
        r`A spring can also be **compressed** (Hooke's law and EPE apply with $x$ as the compression); a string goes slack and has zero tension when shorter than its natural length.`,
    ],
    [
        r`Energy method for a particle on an elastic string — what to include?`,
        r`KE, GPE and EPE at the start and end positions. Remember the particle may fall the **natural length** before the string becomes taut.`,
    ],
]);

const furtherDynamics = deck("WME03", "further-dynamics", [
    [
        r`Defining equation of simple harmonic motion and its period?`,
        r`$\ddot{x} = -\omega^2 x$ (acceleration towards a fixed point, proportional to distance). Period $T = \dfrac{2\pi}{\omega}$.`,
    ],
    [r`SHM: speed at displacement $x$ and maximum speed?`, r`- $v^2 = \omega^2(a^2 - x^2)$
- $v_{\max} = a\omega$ (at the centre)
- Max acceleration $= a\omega^2$ (at the ends)`],
    [
        r`SHM: which displacement–time equation should you use?`,
        r`- Timing from the **centre**: $x = a\sin\omega t$
- Timing from an **end point**: $x = a\cos\omega t$`,
    ],
    [
        r`Newton's law of gravitation in M3 form (Earth radius $R$)?`,
        r`At distance $x \geq R$ from the centre, the force has magnitude $\dfrac{mgR^2}{x^2}$ towards the centre, since $\dfrac{GMm}{R^2} = mg$ at the surface.`,
    ],
]);

const circularMotion = deck("WME03", "circular-motion", [
    [
        r`Acceleration of a particle in uniform circular motion?`,
        r`Towards the centre, of magnitude $r\omega^2 = \dfrac{v^2}{r}$, where $v = r\omega$.`,
    ],
    [
        r`Conical pendulum (string length $l$ at angle $\theta$ to the vertical): key equations?`,
        r`- Vertically: $T\cos\theta = mg$
- Horizontally: $T\sin\theta = mr\omega^2$, $r = l\sin\theta$

Together: $T = ml\omega^2$ and $\omega^2 = \dfrac{g}{l\cos\theta}$.`,
    ],
    [
        r`Vertical circle: how do you find speed at a general point?`,
        r`Use **conservation of energy** (speed is not constant), then resolve towards the centre for the tension or reaction.`,
    ],
    [
        r`Particle on a string vs on a rod: condition to complete a vertical circle?`,
        r`- **String**: tension must stay $\geq 0$ at the top, i.e. $v_{\text{top}}^2 \geq ga$
- **Rod** (or bead on a wire): only need the speed at the top to be greater than $0$`,
    ],
]);

const staticsRigidBodies = deck("WME03", "statics-rigid-bodies", [
    [
        r`Centre of mass of a uniform lamina under $y = f(x)$ from $a$ to $b$?`,
        r`$$\bar{x} = \frac{\int xy\,dx}{\int y\,dx}, \qquad \bar{y} = \frac{\int \tfrac{1}{2}y^2\,dx}{\int y\,dx}$$`,
    ],
    [
        r`Centre of mass of a uniform solid of revolution about the $x$-axis?`,
        r`$$\bar{x} = \frac{\int \pi x y^2\,dx}{\int \pi y^2\,dx}$$ ($\bar{y} = 0$ by symmetry.)`,
    ],
    [r`Standard centres of mass: solid hemisphere, hemispherical shell, solid cone?`, r`- Solid hemisphere: $\tfrac{3}{8}r$ from the plane face
- Hollow hemispherical shell: $\tfrac{1}{2}r$ from the centre of its rim
- Solid cone: $\tfrac{1}{4}h$ from the base`],
    [
        r`Toppling vs sliding on an inclined plane?`,
        r`- **Topples** when the centre of mass passes vertically outside the lowest edge of the base.
- **Slides** when $\tan\alpha > \mu$.

Whichever angle is smaller happens first.`,
    ],
]);

// ---------------------------------------------------------------------------------------------------------------
// WST03 — Statistics 3
// ---------------------------------------------------------------------------------------------------------------

const combinationsOfRv = deck("WST03", "combinations-of-random-variables", [
    [r`Mean and variance of $aX \pm bY$ for independent $X$, $Y$?`, r`- $E(aX \pm bY) = aE(X) \pm bE(Y)$
- $\operatorname{Var}(aX \pm bY) = a^2\operatorname{Var}(X) + b^2\operatorname{Var}(Y)$

Variances always **add**.`],
    [
        r`What distribution does a linear combination of independent Normal variables have?`,
        r`It is also **Normal**, with mean and variance from the rules for $E$ and $\operatorname{Var}$.`,
    ],
    [
        r`What is the difference between $X_1 + X_2$ and $2X$?`,
        r`Both have mean $2\mu$, but $\operatorname{Var}(X_1 + X_2) = 2\sigma^2$ (two independent items) while $\operatorname{Var}(2X) = 4\sigma^2$ (one item doubled).`,
    ],
    [
        r`How do you find $P(X > Y)$ for independent Normal $X$ and $Y$?`,
        r`Let $D = X - Y \sim \mathrm{N}(\mu_X - \mu_Y,\ \sigma_X^2 + \sigma_Y^2)$ and find $P(D > 0)$.`,
    ],
]);

const sampling = deck("WST03", "sampling", [
    [
        r`Describe systematic sampling.`,
        r`From an ordered list of $N$ items, choose every $k$th item where $k = \tfrac{N}{n}$, starting from a **randomly** chosen item among the first $k$.`,
    ],
    [
        r`Describe stratified sampling.`,
        r`Split the population into groups (strata), then take a simple random sample from each stratum in proportion to its size.`,
    ],
    [
        r`Describe quota sampling, with one advantage and one disadvantage.`,
        r`The interviewer selects people to fill a quota for each group. Advantage: quick, no sampling frame needed. Disadvantage: not random, so may be biased.`,
    ],
    [
        r`What is a sampling frame?`,
        r`A list of all the sampling units in the population, from which a sample can be chosen (e.g. a numbered list of students).`,
    ],
]);

const estimationCi = deck("WST03", "estimation-confidence-intervals", [
    [r`Unbiased estimators of the population mean and variance?`, r`- $\bar{x} = \dfrac{\sum x}{n}$
- $s^2 = \dfrac{\sum x^2 - n\bar{x}^2}{n - 1}$ (divide by $n - 1$)`],
    [
        r`State the Central Limit Theorem.`,
        r`For a large random sample from **any** distribution with mean $\mu$ and variance $\sigma^2$, $\bar{X}$ is approximately $\mathrm{N}\left(\mu, \dfrac{\sigma^2}{n}\right)$.`,
    ],
    [r`95% confidence interval for $\mu$ (known $\sigma$ or large sample)?`, r`$$\bar{x} \pm 1.96\frac{\sigma}{\sqrt{n}}$$ Use $z = 1.6449$ for 90% and $2.5758$ for 99%.`],
    [
        r`Test statistic for the difference between two means (large samples)?`,
        r`$$z = \frac{(\bar{x}_1 - \bar{x}_2) - (\mu_1 - \mu_2)}{\sqrt{\dfrac{\sigma_1^2}{n_1} + \dfrac{\sigma_2^2}{n_2}}}$$ Use $s_1^2$, $s_2^2$ if the population variances are unknown.`,
    ],
]);

const goodnessOfFit = deck("WST03", "goodness-of-fit", [
    [r`Formula for the $\chi^2$ test statistic?`, r`$$\chi^2 = \sum \frac{(O - E)^2}{E} = \sum \frac{O^2}{E} - N$$`],
    [
        r`Degrees of freedom for a goodness-of-fit test?`,
        r`$\nu = $ number of classes (after combining) $- 1 -$ number of parameters estimated from the data.`,
    ],
    [
        r`Degrees of freedom and expected frequencies for an $h \times k$ contingency table?`,
        r`- $E = \dfrac{\text{row total} \times \text{column total}}{\text{grand total}}$
- $\nu = (h - 1)(k - 1)$`,
    ],
    [
        r`What do you do if an expected frequency is less than 5?`,
        r`Combine that class with an adjacent one (or combine rows/columns in a table), then recompute the degrees of freedom.`,
    ],
]);

const regressionCorrelation = deck("WST03", "regression-correlation", [
    [r`Formula for Spearman's rank correlation coefficient?`, r`$$r_s = 1 - \frac{6\sum d^2}{n(n^2 - 1)}$$ where $d$ is the difference in ranks for each pair.`],
    [
        r`When should you use Spearman's rather than the PMCC?`,
        r`When the data are ranks, when the relationship may be non-linear but monotonic, or when the data are not from a bivariate Normal distribution.`,
    ],
    [
        r`Hypotheses for a one-tailed test for positive correlation?`,
        r`$H_0: \rho = 0$, $H_1: \rho > 0$. Compare the test statistic with the critical value from the appropriate table (Spearman or PMCC).`,
    ],
    [
        r`How are tied ranks handled?`,
        r`Give each tied value the **mean** of the ranks they would occupy, e.g. two values tied for 3rd and 4th both get rank $3.5$.`,
    ],
]);

export const furtherMathematicsFlashcards: SeedFlashcard[] = [
    ...complexNumbers,
    ...rootsOfQuadratics,
    ...numericalSolutions,
    ...coordinateSystems,
    ...matrixAlgebra,
    ...matrixTransformations,
    ...seriesFp1,
    ...proofByInduction,
    ...inequalities,
    ...seriesFp2,
    ...furtherComplexNumbers,
    ...firstOrderDe,
    ...secondOrderDe,
    ...maclaurinTaylor,
    ...polarCoordinates,
    ...hyperbolicFunctions,
    ...furtherCoordinateSystems,
    ...differentiation,
    ...integration,
    ...vectors,
    ...furtherMatrixAlgebra,
    ...furtherKinematics,
    ...elasticStrings,
    ...furtherDynamics,
    ...circularMotion,
    ...staticsRigidBodies,
    ...combinationsOfRv,
    ...sampling,
    ...estimationCi,
    ...goodnessOfFit,
    ...regressionCorrelation,
];
