import type { SeedFlashcard } from "../types";

// Original Pure Mathematics flashcards for every WMA11–WMA14 topic (written for this app, not taken from Pearson
// material). Seed keys are generated from position: mat-<unit>-<topic>-fc-01, -02, ... so append new cards to the end
// of a topic's list rather than inserting them, or existing keys will shift.

// String.raw keeps LaTeX backslashes intact (e.g. \frac, \sqrt) inside template literals.
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
// WMA11 — Pure Mathematics 1
// ---------------------------------------------------------------------------------------------------------------

// --- WMA11 algebra-functions ---
const wma11Algebra = deck("WMA11", "algebra-functions", [
    [
        r`State the three laws of indices, and the meanings of $a^0$, $a^{-n}$ and $a^{\frac{m}{n}}$.`,
        r`- $a^m \times a^n = a^{m+n}$, $\;a^m \div a^n = a^{m-n}$, $\;(a^m)^n = a^{mn}$
- $a^0 = 1$
- $a^{-n} = \dfrac{1}{a^n}$
- $a^{\frac{m}{n}} = \left(\sqrt[n]{a}\right)^m$`,
    ],
    [
        r`How do you rationalise the denominator of $\dfrac{k}{a + \sqrt{b}}$?`,
        r`Multiply top and bottom by the **conjugate** $a - \sqrt{b}$:

$$\frac{k(a - \sqrt{b})}{a^2 - b}$$

The denominator becomes a difference of two squares, so the surd disappears.`,
    ],
    [
        r`What does the discriminant $b^2 - 4ac$ tell you about $ax^2 + bx + c = 0$?`,
        r`- $b^2 - 4ac > 0$: two distinct real roots
- $b^2 - 4ac = 0$: one repeated root (the graph touches the $x$-axis)
- $b^2 - 4ac < 0$: no real roots`,
    ],
    [
        r`Describe the transformations $y = f(x) + a$, $y = f(x + a)$, $y = af(x)$ and $y = f(ax)$.`,
        r`- $f(x) + a$: translation by $\begin{pmatrix} 0 \\ a \end{pmatrix}$
- $f(x + a)$: translation by $\begin{pmatrix} -a \\ 0 \end{pmatrix}$
- $af(x)$: stretch parallel to the $y$-axis, scale factor $a$
- $f(ax)$: stretch parallel to the $x$-axis, scale factor $\tfrac{1}{a}$

Changes **inside** the bracket act on $x$ and do the "opposite" of what you expect.`,
    ],
]);

// --- WMA11 coordinate-geometry ---
const wma11Coord = deck("WMA11", "coordinate-geometry", [
    [
        r`Give the gradient of the line through $(x_1, y_1)$ and $(x_2, y_2)$, and the equation of a line with gradient $m$ through $(x_1, y_1)$.`,
        r`$$m = \frac{y_2 - y_1}{x_2 - x_1}$$

$$y - y_1 = m(x - x_1)$$`,
    ],
    [
        r`How are the gradients of **parallel** and **perpendicular** lines related?`,
        r`- Parallel: equal gradients, $m_1 = m_2$
- Perpendicular: $m_1 m_2 = -1$, so $m_2 = -\dfrac{1}{m_1}$ (negative reciprocal)`,
    ],
    [
        r`How do you find the gradient of a line written as $ax + by + c = 0$?`,
        r`Rearrange to $y = -\dfrac{a}{b}x - \dfrac{c}{b}$. The gradient is $-\dfrac{a}{b}$.`,
    ],
    [
        r`What are the midpoint of $AB$ and the distance $AB$, for $A(x_1, y_1)$ and $B(x_2, y_2)$?`,
        r`- Midpoint: $\left(\dfrac{x_1 + x_2}{2}, \dfrac{y_1 + y_2}{2}\right)$
- Distance: $\sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}$`,
    ],
]);

// --- WMA11 trigonometry ---
const wma11Trig = deck("WMA11", "trigonometry", [
    [
        r`State the sine rule and the cosine rule.`,
        r`- Sine rule: $\dfrac{a}{\sin A} = \dfrac{b}{\sin B} = \dfrac{c}{\sin C}$
- Cosine rule: $a^2 = b^2 + c^2 - 2bc\cos A$

Use the cosine rule for SAS or SSS; the sine rule when you know a side and its opposite angle.`,
    ],
    [
        r`Give the area of a triangle using two sides and the included angle.`,
        r`$$\text{Area} = \tfrac{1}{2}ab\sin C$$

where $C$ is the angle **between** sides $a$ and $b$.`,
    ],
    [
        r`Give arc length and sector area for a circle of radius $r$ and angle $\theta$ radians.`,
        r`- Arc length $s = r\theta$
- Sector area $A = \tfrac{1}{2}r^2\theta$

$\theta$ **must** be in radians. $\pi$ rad $= 180^\circ$.`,
    ],
    [
        r`What is the ambiguous case of the sine rule?`,
        r`When you find an angle using the sine rule, $\sin\theta = k$ has two solutions in $0^\circ$ to $180^\circ$: $\theta$ and $180^\circ - \theta$. Both may give valid triangles, so check whether the obtuse angle fits with the other angles.`,
    ],
]);

// --- WMA11 differentiation ---
const wma11Diff = deck("WMA11", "differentiation", [
    [
        r`Differentiate $y = ax^n$.`,
        r`$$\frac{dy}{dx} = anx^{n-1}$$

Works for any rational $n$. Rewrite roots and fractions as powers first, e.g. $\dfrac{2}{\sqrt{x}} = 2x^{-\frac{1}{2}}$.`,
    ],
    [
        r`How do you find the equation of a **tangent** to $y = f(x)$ at $x = a$?`,
        r`1. Find $y = f(a)$.
2. Find the gradient $m = f'(a)$.
3. Use $y - f(a) = m(x - a)$.`,
    ],
    [
        r`How do you find the equation of a **normal** to a curve at a point?`,
        r`Find the tangent gradient $m$ at the point, then use the normal gradient $-\dfrac{1}{m}$ in $y - y_1 = -\dfrac{1}{m}(x - x_1)$.`,
    ],
    [
        r`What does $\dfrac{dy}{dx}$ represent, and how is it defined from first principles?`,
        r`The gradient of the curve (rate of change of $y$ with respect to $x$):

$$f'(x) = \lim_{h \to 0} \frac{f(x + h) - f(x)}{h}$$`,
    ],
]);

// --- WMA11 integration ---
const wma11Int = deck("WMA11", "integration", [
    [
        r`Integrate $ax^n$, for $n \neq -1$.`,
        r`$$\int ax^n\,dx = \frac{ax^{n+1}}{n + 1} + c$$

Raise the power by one, divide by the **new** power, and add $c$.`,
    ],
    [
        r`Why does an indefinite integral need $+c$?`,
        r`Integration reverses differentiation, and any constant differentiates to zero. So there is a whole family of curves with the same gradient function; $c$ picks one.`,
    ],
    [
        r`You know $\dfrac{dy}{dx}$ and one point on the curve. How do you find $y$?`,
        r`Integrate to get $y = \ldots + c$, then substitute the coordinates of the point to find $c$.`,
    ],
    [
        r`What must you do before integrating $\dfrac{(x + 2)^2}{\sqrt{x}}$?`,
        r`Expand and split into separate powers of $x$:

$$\frac{x^2 + 4x + 4}{x^{\frac{1}{2}}} = x^{\frac{3}{2}} + 4x^{\frac{1}{2}} + 4x^{-\frac{1}{2}}$$

You cannot integrate a product or quotient term by term.`,
    ],
]);

// ---------------------------------------------------------------------------------------------------------------
// WMA12 — Pure Mathematics 2
// ---------------------------------------------------------------------------------------------------------------

// --- WMA12 proof ---
const wma12Proof = deck("WMA12", "proof", [
    [
        r`What is proof by **deduction**?`,
        r`Starting from known facts or definitions and using logical steps to reach the conclusion for **all** cases — e.g. writing an even number as $2n$ and an odd number as $2n + 1$.`,
    ],
    [
        r`What is proof by **exhaustion**?`,
        r`Splitting the statement into a finite number of cases and proving each one — e.g. checking all integers from 1 to 10, or treating $n$ even and $n$ odd separately.`,
    ],
    [
        r`How do you disprove a statement?`,
        r`Give a single **counter-example**: one specific case where the statement is false, and show clearly why it fails.`,
    ],
    [
        r`How do you write general even, odd and consecutive integers in a proof?`,
        r`- Even: $2n$; odd: $2n + 1$ ($n \in \mathbb{Z}$)
- Consecutive integers: $n, n + 1, n + 2$
- Consecutive odd integers: $2n + 1, 2n + 3$`,
    ],
]);

// --- WMA12 algebra-functions ---
const wma12Algebra = deck("WMA12", "algebra-functions", [
    [
        r`State the **factor theorem**.`,
        r`For a polynomial $f(x)$: $(x - a)$ is a factor of $f(x)$ $\iff$ $f(a) = 0$.

More generally, $(ax - b)$ is a factor $\iff f\left(\tfrac{b}{a}\right) = 0$.`,
    ],
    [
        r`State the **remainder theorem**.`,
        r`When $f(x)$ is divided by $(ax - b)$, the remainder is $f\left(\dfrac{b}{a}\right)$.

E.g. dividing by $(x + 3)$ leaves remainder $f(-3)$.`,
    ],
    [
        r`How do you fully factorise a cubic $f(x)$?`,
        r`1. Use the factor theorem to find one root $a$ (try factors of the constant term).
2. Divide $f(x)$ by $(x - a)$ (long division or comparing coefficients).
3. Factorise the quadratic quotient.`,
    ],
    [
        r`In $f(x) \div (x - a)$, how are $f(x)$, the quotient $q(x)$ and remainder $R$ related?`,
        r`$$f(x) \equiv (x - a)\,q(x) + R$$

Substituting $x = a$ gives $f(a) = R$, which is why the remainder theorem works.`,
    ],
]);

// --- WMA12 coordinate-geometry ---
const wma12Coord = deck("WMA12", "coordinate-geometry", [
    [
        r`Write the equation of a circle with centre $(a, b)$ and radius $r$.`,
        r`$$(x - a)^2 + (y - b)^2 = r^2$$`,
    ],
    [
        r`How do you find the centre and radius of $x^2 + y^2 + 2fx + 2gy + c = 0$?`,
        r`Complete the square in $x$ and in $y$:

- centre $(-f, -g)$
- radius $\sqrt{f^2 + g^2 - c}$`,
    ],
    [
        r`State three circle properties that are useful in coordinate geometry.`,
        r`- A tangent is perpendicular to the radius at the point of contact.
- The perpendicular bisector of a chord passes through the centre.
- The angle in a semicircle is a right angle.`,
    ],
    [
        r`How can you tell whether a line meets a circle at 2, 1 or 0 points?`,
        r`Substitute the line into the circle to get a quadratic, then use the discriminant:

- $b^2 - 4ac > 0$: two points (chord)
- $= 0$: one point (tangent)
- $< 0$: no intersection`,
    ],
]);

// --- WMA12 sequences-series ---
const wma12Seq = deck("WMA12", "sequences-series", [
    [
        r`Arithmetic series: give the $n$th term and the sum of the first $n$ terms.`,
        r`- $u_n = a + (n - 1)d$
- $S_n = \dfrac{n}{2}\left[2a + (n - 1)d\right] = \dfrac{n}{2}(a + l)$, where $l$ is the last term`,
    ],
    [
        r`Geometric series: give the $n$th term, $S_n$ and $S_\infty$.`,
        r`- $u_n = ar^{n-1}$
- $S_n = \dfrac{a(1 - r^n)}{1 - r}$
- $S_\infty = \dfrac{a}{1 - r}$, valid only for $|r| < 1$`,
    ],
    [
        r`State the binomial expansion of $(a + b)^n$ for positive integer $n$.`,
        r`$$(a + b)^n = a^n + \binom{n}{1}a^{n-1}b + \binom{n}{2}a^{n-2}b^2 + \dots + b^n$$

where $\dbinom{n}{r} = \dfrac{n!}{r!(n - r)!}$.`,
    ],
    [
        r`What does $\displaystyle\sum_{r=1}^{n} u_r$ mean, and how many terms does $\displaystyle\sum_{r=5}^{20} u_r$ have?`,
        r`The sum $u_1 + u_2 + \dots + u_n$.

$\sum_{r=5}^{20}$ has $20 - 5 + 1 = 16$ terms. It equals $S_{20} - S_4$.`,
    ],
]);

// --- WMA12 exponentials-logarithms ---
const wma12Exp = deck("WMA12", "exponentials-logarithms", [
    [
        r`What does $\log_a b = c$ mean?`,
        r`$a^c = b$. A logarithm is the **power** you raise the base to. E.g. $\log_2 32 = 5$ because $2^5 = 32$.`,
    ],
    [
        r`State the three laws of logarithms.`,
        r`- $\log_a x + \log_a y = \log_a(xy)$
- $\log_a x - \log_a y = \log_a\left(\dfrac{x}{y}\right)$
- $k\log_a x = \log_a\left(x^k\right)$

Also $\log_a a = 1$ and $\log_a 1 = 0$.`,
    ],
    [
        r`How do you solve $a^x = b$?`,
        r`Take logs of both sides: $x\log a = \log b$, so

$$x = \frac{\log b}{\log a}$$`,
    ],
    [
        r`How do you solve an equation like $9^x - 4(3^x) + 3 = 0$?`,
        r`Spot the hidden quadratic: $9^x = (3^x)^2$. Let $u = 3^x$ to get $u^2 - 4u + 3 = 0$, solve for $u$, then solve $3^x = u$ for each **positive** $u$.`,
    ],
]);

// --- WMA12 trigonometry ---
const wma12Trig = deck("WMA12", "trigonometry", [
    [
        r`State the two basic trigonometric identities.`,
        r`- $\tan\theta \equiv \dfrac{\sin\theta}{\cos\theta}$
- $\sin^2\theta + \cos^2\theta \equiv 1$`,
    ],
    [
        r`Given one solution $\alpha$ (from the calculator), give the other solutions in $0^\circ$ to $360^\circ$ for sin, cos and tan.`,
        r`- $\sin\theta = k$: $\alpha$ and $180^\circ - \alpha$
- $\cos\theta = k$: $\alpha$ and $360^\circ - \alpha$
- $\tan\theta = k$: $\alpha$ and $180^\circ + \alpha$

Add or subtract $360^\circ$ to get into the required interval.`,
    ],
    [
        r`How do you solve $\sin(2x + 30^\circ) = 0.6$ for $0 \leqslant x < 360^\circ$?`,
        r`Adjust the interval first: $30^\circ \leqslant 2x + 30^\circ < 750^\circ$. Find all values of $2x + 30^\circ$ in that interval, **then** subtract $30^\circ$ and halve.`,
    ],
    [
        r`What should you never do when solving $\sin\theta\cos\theta = \sin\theta$?`,
        r`Never divide by $\sin\theta$ — you lose the solutions where $\sin\theta = 0$. Instead factorise: $\sin\theta(\cos\theta - 1) = 0$.`,
    ],
]);

// --- WMA12 differentiation ---
const wma12Diff = deck("WMA12", "differentiation", [
    [
        r`How do you tell if a function is increasing or decreasing?`,
        r`- Increasing: $f'(x) > 0$ (or $\geqslant 0$) on the interval
- Decreasing: $f'(x) < 0$ (or $\leqslant 0$) on the interval`,
    ],
    [
        r`How do you find and classify stationary points?`,
        r`Solve $\dfrac{dy}{dx} = 0$. Then:

- $\dfrac{d^2y}{dx^2} > 0$: minimum
- $\dfrac{d^2y}{dx^2} < 0$: maximum
- $= 0$: inconclusive — check the gradient either side.`,
    ],
    [
        r`What are the steps for an optimisation ("maximise/minimise") problem?`,
        r`1. Write the quantity in terms of **one** variable using the given constraint.
2. Differentiate and set equal to zero.
3. Solve, then justify max/min (second derivative).
4. Answer the question asked, with units.`,
    ],
    [
        r`What is the second derivative, and how is it written?`,
        r`The derivative of the derivative: $\dfrac{d^2y}{dx^2}$ or $f''(x)$. It measures how the gradient is changing.`,
    ],
]);

// --- WMA12 integration ---
const wma12Int = deck("WMA12", "integration", [
    [
        r`How do you evaluate a definite integral $\displaystyle\int_a^b f(x)\,dx$?`,
        r`Integrate to get $F(x)$ (no $+c$ needed), then calculate $F(b) - F(a)$.`,
    ],
    [
        r`What happens to a definite integral when the region is **below** the $x$-axis?`,
        r`The integral is **negative**. For total area, integrate each part separately and add the magnitudes — don't integrate straight across a root.`,
    ],
    [
        r`State the trapezium rule with $n$ strips of width $h$.`,
        r`$$\int_a^b y\,dx \approx \frac{h}{2}\left[y_0 + y_n + 2(y_1 + y_2 + \dots + y_{n-1})\right]$$

where $h = \dfrac{b - a}{n}$. Note: $n$ strips need $n + 1$ ordinates.`,
    ],
    [
        r`How do you find the area between a curve and a line?`,
        r`Find the $x$-coordinates of the intersections, then

$$\text{Area} = \int_a^b (\text{upper} - \text{lower})\,dx$$`,
    ],
]);

// ---------------------------------------------------------------------------------------------------------------
// WMA13 — Pure Mathematics 3
// ---------------------------------------------------------------------------------------------------------------

// --- WMA13 algebra-functions ---
const wma13Algebra = deck("WMA13", "algebra-functions", [
    [
        r`What does $fg(x)$ mean?`,
        r`Apply $g$ **first**, then $f$: $fg(x) = f(g(x))$. Usually $fg(x) \neq gf(x)$.`,
    ],
    [
        r`How do you find an inverse function $f^{-1}(x)$, and what are its domain and range?`,
        r`Write $y = f(x)$, rearrange to make $x$ the subject, then swap $x$ and $y$.

- Domain of $f^{-1}$ = range of $f$
- Range of $f^{-1}$ = domain of $f$

The graph of $f^{-1}$ is the reflection of $f$ in $y = x$. Only one-to-one functions have inverses.`,
    ],
    [
        r`How do you sketch $y = |f(x)|$ and $y = f(|x|)$?`,
        r`- $y = |f(x)|$: reflect any part **below** the $x$-axis up into it.
- $y = f(|x|)$: keep the part for $x \geqslant 0$ and reflect it in the $y$-axis.`,
    ],
    [
        r`How do you solve $|ax + b| = cx + d$?`,
        r`Solve both $ax + b = cx + d$ and $-(ax + b) = cx + d$. Reject any solution that makes $cx + d$ negative. A sketch confirms how many solutions there are.`,
    ],
]);

// --- WMA13 trigonometry ---
const wma13Trig = deck("WMA13", "trigonometry", [
    [
        r`Define $\sec$, $\operatorname{cosec}$ and $\cot$, and state the two "Pythagorean" identities they satisfy.`,
        r`$\sec\theta = \dfrac{1}{\cos\theta}$, $\operatorname{cosec}\theta = \dfrac{1}{\sin\theta}$, $\cot\theta = \dfrac{1}{\tan\theta}$

- $1 + \tan^2\theta \equiv \sec^2\theta$
- $1 + \cot^2\theta \equiv \operatorname{cosec}^2\theta$`,
    ],
    [
        r`State the compound angle formulae for $\sin(A \pm B)$, $\cos(A \pm B)$ and $\tan(A \pm B)$.`,
        r`- $\sin(A \pm B) = \sin A\cos B \pm \cos A\sin B$
- $\cos(A \pm B) = \cos A\cos B \mp \sin A\sin B$
- $\tan(A \pm B) = \dfrac{\tan A \pm \tan B}{1 \mp \tan A\tan B}$`,
    ],
    [
        r`State the double angle formulae.`,
        r`- $\sin 2A = 2\sin A\cos A$
- $\cos 2A = \cos^2 A - \sin^2 A = 2\cos^2 A - 1 = 1 - 2\sin^2 A$
- $\tan 2A = \dfrac{2\tan A}{1 - \tan^2 A}$`,
    ],
    [
        r`How do you write $a\sin\theta + b\cos\theta$ as $R\sin(\theta + \alpha)$?`,
        r`Expand: $R\sin\theta\cos\alpha + R\cos\theta\sin\alpha$, so $R\cos\alpha = a$ and $R\sin\alpha = b$.

- $R = \sqrt{a^2 + b^2}$
- $\tan\alpha = \dfrac{b}{a}$

Max value $R$, min value $-R$.`,
    ],
]);

// --- WMA13 exponentials-logarithms ---
const wma13Exp = deck("WMA13", "exponentials-logarithms", [
    [
        r`How are $e^x$ and $\ln x$ related?`,
        r`They are inverse functions: $e^{\ln x} = x$ (for $x > 0$) and $\ln(e^x) = x$. Their graphs are reflections in $y = x$.`,
    ],
    [
        r`Sketch-facts: give the intercept and asymptote of $y = e^x$ and $y = \ln x$.`,
        r`- $y = e^x$: passes through $(0, 1)$, asymptote $y = 0$, always positive
- $y = \ln x$: passes through $(1, 0)$, asymptote $x = 0$, defined only for $x > 0$`,
    ],
    [
        r`If $y = ax^n$, what straight-line graph do you plot, and what are its gradient and intercept?`,
        r`Plot $\log y$ against $\log x$:

$$\log y = n\log x + \log a$$

Gradient $= n$, vertical intercept $= \log a$.`,
    ],
    [
        r`If $y = kb^x$, what straight-line graph do you plot, and what are its gradient and intercept?`,
        r`Plot $\log y$ against $x$:

$$\log y = (\log b)x + \log k$$

Gradient $= \log b$, vertical intercept $= \log k$.`,
    ],
]);

// --- WMA13 differentiation ---
const wma13Diff = deck("WMA13", "differentiation", [
    [
        r`State the chain, product and quotient rules.`,
        r`- Chain: $\dfrac{dy}{dx} = \dfrac{dy}{du} \times \dfrac{du}{dx}$
- Product: $\dfrac{d}{dx}(uv) = u\dfrac{dv}{dx} + v\dfrac{du}{dx}$
- Quotient: $\dfrac{d}{dx}\left(\dfrac{u}{v}\right) = \dfrac{v\frac{du}{dx} - u\frac{dv}{dx}}{v^2}$`,
    ],
    [
        r`Differentiate $e^{kx}$, $\ln(kx)$, $\sin kx$, $\cos kx$ and $\tan kx$.`,
        r`- $e^{kx} \to ke^{kx}$
- $\ln(kx) \to \dfrac{1}{x}$
- $\sin kx \to k\cos kx$
- $\cos kx \to -k\sin kx$
- $\tan kx \to k\sec^2 kx$`,
    ],
    [
        r`How are $\dfrac{dy}{dx}$ and $\dfrac{dx}{dy}$ related?`,
        r`$$\frac{dy}{dx} = \frac{1}{\;\frac{dx}{dy}\;}$$

Useful when $x$ is given as a function of $y$, e.g. $x = \sin y$.`,
    ],
    [
        r`Differentiate $\sec x$, $\operatorname{cosec} x$ and $\cot x$.`,
        r`- $\sec x \to \sec x\tan x$
- $\operatorname{cosec} x \to -\operatorname{cosec} x\cot x$
- $\cot x \to -\operatorname{cosec}^2 x$`,
    ],
]);

// --- WMA13 integration ---
const wma13Int = deck("WMA13", "integration", [
    [
        r`Integrate $e^{ax + b}$ and $\dfrac{1}{ax + b}$.`,
        r`- $\int e^{ax + b}\,dx = \dfrac{1}{a}e^{ax + b} + c$
- $\int \dfrac{1}{ax + b}\,dx = \dfrac{1}{a}\ln|ax + b| + c$`,
    ],
    [
        r`Integrate $\sin(ax + b)$, $\cos(ax + b)$ and $\sec^2(ax + b)$.`,
        r`- $\int \sin(ax + b)\,dx = -\dfrac{1}{a}\cos(ax + b) + c$
- $\int \cos(ax + b)\,dx = \dfrac{1}{a}\sin(ax + b) + c$
- $\int \sec^2(ax + b)\,dx = \dfrac{1}{a}\tan(ax + b) + c$`,
    ],
    [
        r`What is $\displaystyle\int \frac{f'(x)}{f(x)}\,dx$? When do you use it?`,
        r`$$\int \frac{f'(x)}{f(x)}\,dx = \ln|f(x)| + c$$

Use it when the numerator is (a multiple of) the derivative of the denominator, e.g. $\int \dfrac{3x^2}{x^3 + 1}\,dx = \ln|x^3 + 1| + c$.`,
    ],
    [
        r`What is "integration by recognition" (reverse chain rule)?`,
        r`Guess the form of the answer, differentiate it, then adjust the constant. E.g. for $\int x(x^2 + 1)^4\,dx$, try $(x^2 + 1)^5$: its derivative is $10x(x^2 + 1)^4$, so the answer is $\tfrac{1}{10}(x^2 + 1)^5 + c$.`,
    ],
]);

// --- WMA13 numerical-methods ---
const wma13Num = deck("WMA13", "numerical-methods", [
    [
        r`How do you show that $f(x) = 0$ has a root between $a$ and $b$?`,
        r`Show that $f(a)$ and $f(b)$ have **opposite signs** and state that $f$ is **continuous** on $[a, b]$, so a root lies in the interval.`,
    ],
    [
        r`When can a change of sign fail to find (or wrongly suggest) a root?`,
        r`- Two roots (or any even number) in the interval: no sign change.
- A repeated root where the curve touches the axis: no sign change.
- A vertical asymptote, e.g. $\dfrac{1}{x}$: sign changes but no root.`,
    ],
    [
        r`State the Newton–Raphson formula.`,
        r`$$x_{n+1} = x_n - \frac{f(x_n)}{f'(x_n)}$$

It fails if $f'(x_n) = 0$ (tangent is horizontal) and may diverge if $x_0$ is near a turning point.`,
    ],
    [
        r`How do you use an iteration $x_{n+1} = g(x_n)$, and how do you show a root is correct to a given accuracy?`,
        r`Rearrange $f(x) = 0$ into $x = g(x)$ and repeatedly substitute. To show $\alpha = 1.47$ to 2 d.p., evaluate $f(1.465)$ and $f(1.475)$ and show there is a sign change.`,
    ],
]);

// ---------------------------------------------------------------------------------------------------------------
// WMA14 — Pure Mathematics 4
// ---------------------------------------------------------------------------------------------------------------

// --- WMA14 proof ---
const wma14Proof = deck("WMA14", "proof", [
    [
        r`What are the steps of proof by contradiction?`,
        r`1. Assume the statement is **false** (assume its negation).
2. Use logical steps to reach something impossible or contradictory.
3. Conclude the assumption was wrong, so the statement is true.`,
    ],
    [
        r`Outline the proof that $\sqrt{2}$ is irrational.`,
        r`Assume $\sqrt{2} = \dfrac{a}{b}$ in lowest terms. Then $a^2 = 2b^2$, so $a^2$ is even, so $a$ is even: $a = 2k$. Then $4k^2 = 2b^2$, so $b^2 = 2k^2$ and $b$ is even. Both even contradicts "lowest terms".`,
    ],
    [
        r`Outline the proof that there are infinitely many primes.`,
        r`Assume there are finitely many: $p_1, p_2, \dots, p_n$. Let $N = p_1p_2\cdots p_n + 1$. $N$ leaves remainder 1 when divided by every $p_i$, so either $N$ is prime or has a prime factor not in the list. Contradiction.`,
    ],
    [
        r`What is the negation of "for all $x$, $P(x)$" and of "there is no $x$ such that $P(x)$"?`,
        r`- Not "for all $x$, $P(x)$" = "there exists an $x$ for which $P(x)$ is false".
- Not "there is no $x$ with $P(x)$" = "there exists an $x$ with $P(x)$".`,
    ],
]);

// --- WMA14 partial-fractions ---
const wma14Partial = deck("WMA14", "partial-fractions", [
    [
        r`Give the partial fraction form for $\dfrac{px + q}{(x - a)(x - b)}$.`,
        r`$$\frac{A}{x - a} + \frac{B}{x - b}$$

Find $A$ and $B$ by substituting $x = a$ and $x = b$ into $px + q \equiv A(x - b) + B(x - a)$.`,
    ],
    [
        r`Give the partial fraction form when there is a repeated factor, e.g. $\dfrac{f(x)}{(x - a)(x - b)^2}$.`,
        r`$$\frac{A}{x - a} + \frac{B}{x - b} + \frac{C}{(x - b)^2}$$

You need **both** $(x - b)$ and $(x - b)^2$ denominators.`,
    ],
    [
        r`What must you do first if the fraction is **improper** (numerator degree ≥ denominator degree)?`,
        r`Divide first (algebraic division or comparing coefficients) to get a polynomial plus a proper fraction, e.g. $\dfrac{x^2 + 1}{(x - 1)(x + 2)} = 1 + \dfrac{\ldots}{(x - 1)(x + 2)}$, then split the proper fraction.`,
    ],
    [
        r`When do partial fractions appear later in the course?`,
        r`- Integrating rational functions: $\int \dfrac{A}{x - a}\,dx = A\ln|x - a|$
- Binomial expansions of rational functions
- Separating variables in differential equations`,
    ],
]);

// --- WMA14 parametric-equations ---
const wma14Param = deck("WMA14", "parametric-equations", [
    [
        r`How do you convert parametric equations to a Cartesian equation?`,
        r`Eliminate the parameter: make $t$ the subject of one equation and substitute into the other, or use an identity if the equations involve trig functions.`,
    ],
    [
        r`How do you eliminate $\theta$ from $x = a\cos\theta$, $y = b\sin\theta$?`,
        r`Use $\cos^2\theta + \sin^2\theta = 1$:

$$\frac{x^2}{a^2} + \frac{y^2}{b^2} = 1$$

(an ellipse; a circle when $a = b$).`,
    ],
    [
        r`How do you find where a parametric curve meets a line or an axis?`,
        r`Substitute the parametric expressions into the line's equation (or set $x = 0$ / $y = 0$), solve for $t$, then substitute each $t$ back to get the coordinates.`,
    ],
    [
        r`How do the domain and range of a parametric curve follow from the parameter's range?`,
        r`The possible $x$ values (domain of the Cartesian form) are the values $x(t)$ takes over the allowed $t$; similarly for $y$. E.g. $x = t^2$ means $x \geqslant 0$.`,
    ],
]);

// --- WMA14 binomial-expansion ---
const wma14Binom = deck("WMA14", "binomial-expansion", [
    [
        r`State the expansion of $(1 + x)^n$ for any rational $n$, and when it is valid.`,
        r`$$(1 + x)^n = 1 + nx + \frac{n(n - 1)}{2!}x^2 + \frac{n(n - 1)(n - 2)}{3!}x^3 + \dots$$

Valid for $|x| < 1$ when $n$ is negative or a fraction (it is an infinite series).`,
    ],
    [
        r`How do you expand $(a + bx)^n$ when $n$ is not a positive integer?`,
        r`Take out $a^n$ first:

$$(a + bx)^n = a^n\left(1 + \frac{b}{a}x\right)^n$$

Then expand, valid for $\left|\dfrac{bx}{a}\right| < 1$, i.e. $|x| < \left|\dfrac{a}{b}\right|$.`,
    ],
    [
        r`What is the validity condition for the expansion of $(1 - 3x)^{-2}$?`,
        r`$|-3x| < 1$, so $|x| < \tfrac{1}{3}$.`,
    ],
    [
        r`How do you expand a rational function like $\dfrac{4 + x}{(1 + x)(2 - x)}$?`,
        r`Split into partial fractions, expand each term binomially (as $A(1 + x)^{-1}$ and $B(2 - x)^{-1}$), then add. The expansion is valid where **both** are valid — the narrower range.`,
    ],
]);

// --- WMA14 differentiation ---
const wma14Diff = deck("WMA14", "differentiation", [
    [
        r`How do you find $\dfrac{dy}{dx}$ for a curve given parametrically, $x = f(t)$, $y = g(t)$?`,
        r`$$\frac{dy}{dx} = \frac{dy/dt}{dx/dt}$$

The answer is in terms of $t$; substitute the value of $t$ at the point.`,
    ],
    [
        r`How do you differentiate implicitly? Give the derivatives of $y^2$ and $xy$.`,
        r`Differentiate every term with respect to $x$; each term in $y$ gains a factor $\dfrac{dy}{dx}$.

- $\dfrac{d}{dx}(y^2) = 2y\dfrac{dy}{dx}$
- $\dfrac{d}{dx}(xy) = x\dfrac{dy}{dx} + y$ (product rule)`,
    ],
    [
        r`Differentiate $a^x$ with respect to $x$.`,
        r`$$\frac{d}{dx}\left(a^x\right) = a^x\ln a$$

Because $a^x = e^{x\ln a}$.`,
    ],
    [
        r`"The rate of decrease of $N$ is proportional to $N$." Write this as a differential equation.`,
        r`$$\frac{dN}{dt} = -kN, \quad k > 0$$

"Rate of change" means a derivative with respect to time $t$; "proportional to" introduces a constant $k$.`,
    ],
]);

// --- WMA14 integration ---
const wma14Int = deck("WMA14", "integration", [
    [
        r`State the integration by parts formula. How do you choose $u$?`,
        r`$$\int u\frac{dv}{dx}\,dx = uv - \int v\frac{du}{dx}\,dx$$

Choose $u$ to be the part that gets simpler when differentiated (usually a power of $x$) — except choose $u = \ln x$ whenever $\ln x$ appears.`,
    ],
    [
        r`What are the steps of integration by substitution?`,
        r`1. Choose $u = g(x)$ and find $\dfrac{du}{dx}$.
2. Replace $dx$ and every $x$ term with $u$ terms.
3. Change the limits to $u$ values (for a definite integral).
4. Integrate in $u$ (and substitute back if indefinite).`,
    ],
    [
        r`Give the formula for the volume of revolution about the $x$-axis.`,
        r`$$V = \pi\int_a^b y^2\,dx$$

For a rotation of $2\pi$ radians. For parametric curves: $V = \pi\int y^2\dfrac{dx}{dt}\,dt$.`,
    ],
    [
        r`How do you solve $\dfrac{dy}{dx} = f(x)g(y)$?`,
        r`Separate the variables:

$$\int \frac{1}{g(y)}\,dy = \int f(x)\,dx$$

Integrate both sides, add **one** constant, then use any given condition to find it.`,
    ],
]);

// --- WMA14 vectors ---
const wma14Vec = deck("WMA14", "vectors", [
    [
        r`Give the magnitude of $\mathbf{a} = x\mathbf{i} + y\mathbf{j} + z\mathbf{k}$ and the distance between points $A$ and $B$.`,
        r`- $|\mathbf{a}| = \sqrt{x^2 + y^2 + z^2}$
- $AB = |\mathbf{b} - \mathbf{a}|$, using $\overrightarrow{AB} = \mathbf{b} - \mathbf{a}$`,
    ],
    [
        r`Define the scalar product and give the angle between two vectors.`,
        r`$$\mathbf{a} \cdot \mathbf{b} = a_1b_1 + a_2b_2 + a_3b_3 = |\mathbf{a}||\mathbf{b}|\cos\theta$$

So $\cos\theta = \dfrac{\mathbf{a} \cdot \mathbf{b}}{|\mathbf{a}||\mathbf{b}|}$. Two non-zero vectors are perpendicular $\iff \mathbf{a} \cdot \mathbf{b} = 0$.`,
    ],
    [
        r`Write the vector equation of a line through point $A$ with direction $\mathbf{d}$, and through points $A$ and $B$.`,
        r`- $\mathbf{r} = \mathbf{a} + \lambda\mathbf{d}$
- $\mathbf{r} = \mathbf{a} + \lambda(\mathbf{b} - \mathbf{a})$`,
    ],
    [
        r`How do you decide whether two lines in 3D are parallel, intersecting or skew?`,
        r`- **Parallel**: direction vectors are multiples of each other.
- Otherwise equate the position vectors, solve two components for $\lambda$ and $\mu$, and check the third:
  - consistent: **intersecting**
  - inconsistent: **skew**`,
    ],
]);

export const mathematicsPureFlashcards: SeedFlashcard[] = [
    ...wma11Algebra,
    ...wma11Coord,
    ...wma11Trig,
    ...wma11Diff,
    ...wma11Int,
    ...wma12Proof,
    ...wma12Algebra,
    ...wma12Coord,
    ...wma12Seq,
    ...wma12Exp,
    ...wma12Trig,
    ...wma12Diff,
    ...wma12Int,
    ...wma13Algebra,
    ...wma13Trig,
    ...wma13Exp,
    ...wma13Diff,
    ...wma13Int,
    ...wma13Num,
    ...wma14Proof,
    ...wma14Partial,
    ...wma14Param,
    ...wma14Binom,
    ...wma14Diff,
    ...wma14Int,
    ...wma14Vec,
];
