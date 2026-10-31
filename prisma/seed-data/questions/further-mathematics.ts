import type { SeedQuestion } from "../types";

// Original IAL-style Further Mathematics practice questions (written for this app, not taken from Pearson papers).
// Units: WFM01, WFM02, WFM03 (Further Pure 1–3), WME03 (Mechanics 3), WST03 (Statistics 3).
// Mechanics uses g = 9.8 m s^-2. Every answer was checked numerically/symbolically before seeding.
// All questions are DRAFT until an admin reviews and publishes them.

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
// WFM01 — Further Pure Mathematics 1
// ---------------------------------------------------------------------------------------------------------------
const wfm01: SeedQuestion[] = [
    // --- complex-numbers ---
    {
        seedKey: "fma-wfm01-complex-numbers-001",
        unitCode: "WFM01",
        topicSlug: "complex-numbers",
        type: "MCQ",
        difficulty: "EASY",
        marks: 1,
        status: "DRAFT",
        stem: r`Express $\dfrac{3 + 2i}{1 - i}$ in the form $a + bi$.`,
        options: opts(r`$\tfrac{5}{2} - \tfrac{1}{2}i$`, r`$\tfrac{1}{2} + \tfrac{5}{2}i$`, r`$3 - 2i$`, r`$\tfrac{1}{2} + \tfrac{1}{2}i$`, "B"),
        markScheme: r`- **B** (1) — multiply top and bottom by $1 + i$: $\dfrac{(3+2i)(1+i)}{2} = \dfrac{1 + 5i}{2}$.`,
        explanation: r`Multiply numerator and denominator by the conjugate of the denominator, $1 + i$. The denominator becomes $1^2 + 1^2 = 2$. Option A comes from multiplying by $1 - i$ instead of its conjugate.`,
    },
    {
        seedKey: "fma-wfm01-complex-numbers-002",
        unitCode: "WFM01",
        topicSlug: "complex-numbers",
        type: "CALCULATION",
        difficulty: "EASY",
        marks: 4,
        status: "DRAFT",
        stem: r`The complex number $z = 2 - 2\sqrt{3}\,i$.

(a) Find $|z|$.

(b) Find $\arg z$, giving your answer in radians in the interval $(-\pi, \pi]$.

(c) Write $z^2$ in the form $a + bi$, where $a$ and $b$ are exact, and state $\arg(z^2)$.`,
        markScheme: r`- **B1** $|z| = \sqrt{4 + 12} = 4$ (1)
- **B1** $\arg z = -\dfrac{\pi}{3}$ (1)
- **B1** $z^2 = 4 - 8\sqrt{3}\,i - 12 = -8 - 8\sqrt{3}\,i$ (1)
- **B1** $\arg(z^2) = -\dfrac{2\pi}{3}$ (1)`,
        explanation: r`$z$ lies in the fourth quadrant, so the argument is negative: $\arctan(2\sqrt{3}/2) = \pi/3$ gives $\arg z = -\pi/3$. Squaring doubles the argument and squares the modulus, which is a useful check: $|z^2| = 16$ and $\arg(z^2) = -2\pi/3$.`,
    },
    {
        seedKey: "fma-wfm01-complex-numbers-003",
        unitCode: "WFM01",
        topicSlug: "complex-numbers",
        type: "CALCULATION",
        difficulty: "HARD",
        marks: 5,
        status: "DRAFT",
        stem: r`$$f(z) = z^3 - 4z^2 + 9z - 10$$

(a) Show that $z = 1 + 2i$ is a root of $f(z) = 0$.

(b) Hence find the other two roots of $f(z) = 0$.`,
        markScheme: r`- **M1** Finds $(1+2i)^2 = -3 + 4i$ and $(1+2i)^3 = -11 - 2i$ (1)
- **A1** Substitutes to get $-11 - 2i + 12 - 16i + 9 + 18i - 10 = 0$ (1)
- **B1** $1 - 2i$ is a root since the coefficients are real (1)
- **M1** Quadratic factor $(z - 1 - 2i)(z - 1 + 2i) = z^2 - 2z + 5$, then divides or compares coefficients (1)
- **A1** $f(z) = (z^2 - 2z + 5)(z - 2)$, so the third root is $z = 2$ (1)`,
        explanation: r`Complex roots of a real polynomial come in conjugate pairs. A quick check on the real root: the product of the roots is $10$ and $(1+2i)(1-2i) = 5$, so the real root is $2$.`,
    },
    // --- roots-of-quadratics ---
    {
        seedKey: "fma-wfm01-roots-of-quadratics-001",
        unitCode: "WFM01",
        topicSlug: "roots-of-quadratics",
        type: "MCQ",
        difficulty: "EASY",
        marks: 1,
        status: "DRAFT",
        stem: r`The roots of $2x^2 - 3x + 5 = 0$ are $\alpha$ and $\beta$. Find the value of $\alpha^2 + \beta^2$.`,
        options: opts(r`$\tfrac{29}{4}$`, r`$-\tfrac{1}{4}$`, r`$-\tfrac{11}{4}$`, r`$\tfrac{19}{4}$`, "C"),
        markScheme: r`- **C** (1) — $(\alpha+\beta)^2 - 2\alpha\beta = \tfrac{9}{4} - 5 = -\tfrac{11}{4}$.`,
        explanation: r`$\alpha + \beta = \tfrac{3}{2}$ and $\alpha\beta = \tfrac{5}{2}$. A negative value is fine — the roots are complex. Common slips: adding $2\alpha\beta$ (gives $\tfrac{29}{4}$) or forgetting the factor 2 (gives $-\tfrac{1}{4}$).`,
    },
    {
        seedKey: "fma-wfm01-roots-of-quadratics-002",
        unitCode: "WFM01",
        topicSlug: "roots-of-quadratics",
        type: "CALCULATION",
        difficulty: "MEDIUM",
        marks: 5,
        status: "DRAFT",
        stem: r`The roots of $x^2 - 4x + 7 = 0$ are $\alpha$ and $\beta$.

(a) Without solving the equation, find the value of $\alpha^3 + \beta^3$.

(b) Find a quadratic equation with integer coefficients whose roots are $\dfrac{\alpha}{\beta}$ and $\dfrac{\beta}{\alpha}$.`,
        markScheme: r`- **B1** $\alpha + \beta = 4$, $\alpha\beta = 7$ (1)
- **A1** $\alpha^3 + \beta^3 = (\alpha+\beta)^3 - 3\alpha\beta(\alpha+\beta) = 64 - 84 = -20$ (1)
- **M1** Sum of new roots $= \dfrac{\alpha^2 + \beta^2}{\alpha\beta}$ with $\alpha^2 + \beta^2 = 16 - 14 = 2$ (1)
- **A1** Sum $= \tfrac{2}{7}$ and product $= 1$ (1)
- **A1** $7x^2 - 2x + 7 = 0$ (1)`,
        explanation: r`Form the new equation as $x^2 - (\text{sum})x + (\text{product}) = 0$, then clear fractions. The product $\tfrac{\alpha}{\beta}\cdot\tfrac{\beta}{\alpha} = 1$ needs no working — spotting it saves time.`,
    },
    // --- numerical-solutions ---
    {
        seedKey: "fma-wfm01-numerical-solutions-001",
        unitCode: "WFM01",
        topicSlug: "numerical-solutions",
        type: "MCQ",
        difficulty: "EASY",
        marks: 1,
        status: "DRAFT",
        stem: r`Newton–Raphson is applied to $f(x) = x^3 - 2x - 5$ with $x_0 = 2$. What is $x_1$?`,
        options: opts("$1.9$", "$2.05$", "$2.1$", "$2.5$", "C"),
        markScheme: r`- **C** (1) — $x_1 = 2 - \dfrac{f(2)}{f'(2)} = 2 - \dfrac{-1}{10} = 2.1$.`,
        explanation: r`$f(2) = 8 - 4 - 5 = -1$ and $f'(x) = 3x^2 - 2$ gives $f'(2) = 10$. Subtracting a negative value moves $x$ up; using $+$ instead of $-$ in the formula gives $1.9$.`,
    },
    {
        seedKey: "fma-wfm01-numerical-solutions-002",
        unitCode: "WFM01",
        topicSlug: "numerical-solutions",
        type: "CALCULATION",
        difficulty: "MEDIUM",
        marks: 6,
        status: "DRAFT",
        stem: r`$$f(x) = x^3 + x - 3$$

(a) Show that $f(x) = 0$ has a root $\alpha$ in the interval $[1, 2]$.

(b) Use linear interpolation once on the interval $[1, 2]$ to find an approximation to $\alpha$.

(c) Taking $x_0 = 1.2$, apply the Newton–Raphson procedure once to find a second approximation to $\alpha$, giving your answer to 4 decimal places.`,
        markScheme: r`- **M1** $f(1) = -1$ and $f(2) = 7$ (1)
- **A1** Sign change and $f$ continuous, so a root lies in $[1, 2]$ (1)
- **M1** $\dfrac{\alpha - 1}{1} = \dfrac{0 - (-1)}{7 - (-1)}$ or equivalent similar-triangles method (1)
- **A1** $\alpha \approx 1.125$ (1)
- **M1** $f'(x) = 3x^2 + 1$; $f(1.2) = -0.072$, $f'(1.2) = 5.32$ (1)
- **A1** $x_1 = 1.2 + \dfrac{0.072}{5.32} = 1.2135$ (1)`,
        explanation: r`Always mention continuity with a sign change. Linear interpolation uses the straight line between $(1, -1)$ and $(2, 7)$; it is not the midpoint (that is interval bisection, which would give $1.5$).`,
    },
    // --- coordinate-systems ---
    {
        seedKey: "fma-wfm01-coordinate-systems-001",
        unitCode: "WFM01",
        topicSlug: "coordinate-systems",
        type: "MCQ",
        difficulty: "EASY",
        marks: 1,
        status: "DRAFT",
        stem: r`The parabola $C$ has equation $y^2 = 12x$. Which of these gives the focus and directrix of $C$?`,
        options: opts(
            r`focus $(3, 0)$, directrix $x = -3$`,
            r`focus $(12, 0)$, directrix $x = -12$`,
            r`focus $(0, 3)$, directrix $y = -3$`,
            r`focus $(6, 0)$, directrix $x = -6$`,
            "A",
        ),
        markScheme: r`- **A** (1) — compare with $y^2 = 4ax$: $4a = 12$ so $a = 3$.`,
        explanation: r`For $y^2 = 4ax$ the focus is $(a, 0)$ and the directrix is $x = -a$. Don't read $a$ straight off as $12$ — the coefficient is $4a$.`,
    },
    {
        seedKey: "fma-wfm01-coordinate-systems-002",
        unitCode: "WFM01",
        topicSlug: "coordinate-systems",
        type: "CALCULATION",
        difficulty: "HARD",
        marks: 6,
        status: "DRAFT",
        stem: r`The rectangular hyperbola $H$ has equation $xy = 16$. The point $P(8, 2)$ lies on $H$.

(a) Show that the normal to $H$ at $P$ has equation $y = 4x - 30$.

(b) The normal meets $H$ again at the point $Q$. Find the coordinates of $Q$.`,
        markScheme: r`- **M1** $y = 16x^{-1} \Rightarrow \dfrac{dy}{dx} = -\dfrac{16}{x^2}$ (1)
- **A1** At $x = 8$ the tangent gradient is $-\tfrac{1}{4}$, so the normal gradient is $4$ (1)
- **A1** $y - 2 = 4(x - 8) \Rightarrow y = 4x - 30$ (1)
- **M1** Substitutes into $H$: $x(4x - 30) = 16$ (1)
- **A1** $2x^2 - 15x - 8 = 0 \Rightarrow (2x + 1)(x - 8) = 0$ (1)
- **A1** $Q\left(-\tfrac{1}{2}, -32\right)$ (1)`,
        explanation: r`You already know $x = 8$ is a root (that's $P$), which makes factorising quick. Parametric form works too: $P$ is $t = 2$ on $(4t, 4/t)$.`,
    },
    // --- matrix-algebra ---
    {
        seedKey: "fma-wfm01-matrix-algebra-001",
        unitCode: "WFM01",
        topicSlug: "matrix-algebra",
        type: "MCQ",
        difficulty: "EASY",
        marks: 1,
        status: "DRAFT",
        stem: r`Find the determinant of $\begin{pmatrix} 3 & -2 \\ 5 & 4 \end{pmatrix}$.`,
        options: opts("$2$", "$-22$", "$-2$", "$22$", "D"),
        markScheme: r`- **D** (1) — $(3)(4) - (-2)(5) = 12 + 10 = 22$.`,
        explanation: r`$\det\begin{pmatrix} a & b \\ c & d \end{pmatrix} = ad - bc$. The most common slip is losing the sign of $b$, giving $12 - 10 = 2$.`,
    },
    {
        seedKey: "fma-wfm01-matrix-algebra-002",
        unitCode: "WFM01",
        topicSlug: "matrix-algebra",
        type: "CALCULATION",
        difficulty: "MEDIUM",
        marks: 5,
        status: "DRAFT",
        stem: r`$$\mathbf{A} = \begin{pmatrix} k & 3 \\ 2 & k - 1 \end{pmatrix}$$ where $k$ is a constant.

(a) Find the values of $k$ for which $\mathbf{A}$ is singular.

(b) Given that $k = 1$, find $\mathbf{A}^{-1}$.`,
        markScheme: r`- **M1** $\det \mathbf{A} = k(k - 1) - 6$ set equal to $0$ (1)
- **M1** $k^2 - k - 6 = 0 \Rightarrow (k - 3)(k + 2) = 0$ (1)
- **A1** $k = 3$ or $k = -2$ (1)
- **B1** With $k = 1$, $\det \mathbf{A} = -6$ (1)
- **A1** $\mathbf{A}^{-1} = -\dfrac{1}{6}\begin{pmatrix} 0 & -3 \\ -2 & 1 \end{pmatrix} = \begin{pmatrix} 0 & \tfrac{1}{2} \\ \tfrac{1}{3} & -\tfrac{1}{6} \end{pmatrix}$ (1)`,
        explanation: r`A matrix is singular when its determinant is zero. For the inverse, swap the leading diagonal, change the signs of the other two entries, then divide by the determinant. Check: $\mathbf{A}\mathbf{A}^{-1} = \mathbf{I}$.`,
    },
    // --- matrix-transformations ---
    {
        seedKey: "fma-wfm01-matrix-transformations-001",
        unitCode: "WFM01",
        topicSlug: "matrix-transformations",
        type: "MCQ",
        difficulty: "EASY",
        marks: 1,
        status: "DRAFT",
        stem: r`Which matrix represents a rotation of $90^\circ$ **anticlockwise** about the origin?`,
        options: opts(
            r`$\begin{pmatrix} 0 & 1 \\ -1 & 0 \end{pmatrix}$`,
            r`$\begin{pmatrix} 0 & 1 \\ 1 & 0 \end{pmatrix}$`,
            r`$\begin{pmatrix} -1 & 0 \\ 0 & -1 \end{pmatrix}$`,
            r`$\begin{pmatrix} 0 & -1 \\ 1 & 0 \end{pmatrix}$`,
            "D",
        ),
        markScheme: r`- **D** (1) — the columns are the images of $\mathbf{i}$ and $\mathbf{j}$: $(1,0) \mapsto (0,1)$ and $(0,1) \mapsto (-1,0)$.`,
        explanation: r`Find where the unit vectors go and write them as columns. A is the clockwise rotation, B is reflection in $y = x$ and C is a rotation through $180^\circ$.`,
    },
    {
        seedKey: "fma-wfm01-matrix-transformations-002",
        unitCode: "WFM01",
        topicSlug: "matrix-transformations",
        type: "CALCULATION",
        difficulty: "MEDIUM",
        marks: 4,
        status: "DRAFT",
        stem: r`The transformation $T$ is represented by $\mathbf{M} = \begin{pmatrix} 3 & 1 \\ 2 & 4 \end{pmatrix}$.

(a) A triangle $R$ has area $5$ square units. Find the area of the image of $R$ under $T$.

(b) Find the coordinates of the point that $T$ maps to $(7, 8)$.`,
        markScheme: r`- **B1** $\det \mathbf{M} = 12 - 2 = 10$ (1)
- **A1** Image area $= 10 \times 5 = 50$ square units (1)
- **M1** Uses $\mathbf{M}^{-1} = \dfrac{1}{10}\begin{pmatrix} 4 & -1 \\ -2 & 3 \end{pmatrix}$ or solves $3x + y = 7$, $2x + 4y = 8$ (1)
- **A1** $(2, 1)$ (1)`,
        explanation: r`Area scale factor $= |\det \mathbf{M}|$. To reverse a transformation, use the inverse matrix — and check by applying $\mathbf{M}$ to your answer: $\mathbf{M}\begin{pmatrix} 2 \\ 1 \end{pmatrix} = \begin{pmatrix} 7 \\ 8 \end{pmatrix}$.`,
    },
    // --- series ---
    {
        seedKey: "fma-wfm01-series-001",
        unitCode: "WFM01",
        topicSlug: "series",
        type: "MCQ",
        difficulty: "EASY",
        marks: 1,
        status: "DRAFT",
        stem: r`Find the value of $\displaystyle\sum_{r=1}^{20} r^2$.`,
        options: opts("$2870$", "$2470$", "$44\\,100$", "$210$", "A"),
        markScheme: r`- **A** (1) — $\tfrac{1}{6}(20)(21)(41) = 2870$.`,
        explanation: r`$\sum r^2 = \tfrac{1}{6}n(n+1)(2n+1)$. $2470$ is the sum to $19$ terms, $44\,100$ is $\sum r^3$ and $210$ is $\sum r$.`,
    },
    {
        seedKey: "fma-wfm01-series-002",
        unitCode: "WFM01",
        topicSlug: "series",
        type: "CALCULATION",
        difficulty: "MEDIUM",
        marks: 6,
        status: "DRAFT",
        stem: r`(a) Use the standard results for $\sum r$ and $\sum r^2$ to show that
$$\sum_{r=1}^{n} r(r + 2) = \frac{1}{6}n(n + 1)(2n + 7)$$

(b) Hence find the value of $\displaystyle\sum_{r=11}^{20} r(r + 2)$.`,
        markScheme: r`- **M1** Expands to $\sum r^2 + 2\sum r$ (1)
- **M1** Substitutes $\tfrac{1}{6}n(n+1)(2n+1) + n(n+1)$ (1)
- **M1** Takes out the factor $\tfrac{1}{6}n(n+1)$ (1)
- **A1** $\tfrac{1}{6}n(n+1)(2n + 1 + 6) = \tfrac{1}{6}n(n+1)(2n+7)$ (1)
- **M1** Uses $f(20) - f(10)$ (1)
- **A1** $3290 - 495 = 2795$ (1)`,
        explanation: r`To sum from $r = 11$ you subtract the sum up to $r = 10$, **not** up to $11$. Factorising early (rather than expanding everything) keeps the algebra short.`,
    },
    // --- proof-by-induction ---
    {
        seedKey: "fma-wfm01-proof-by-induction-001",
        unitCode: "WFM01",
        topicSlug: "proof-by-induction",
        type: "MCQ",
        difficulty: "MEDIUM",
        marks: 1,
        status: "DRAFT",
        stem: r`To prove that $f(n) = 5^n + 3$ is divisible by $4$ for all $n \in \mathbb{Z}^+$, a student considers $f(k+1) - f(k)$. Which expression is equal to $f(k+1) - f(k)$?`,
        options: opts(r`$5^k$`, r`$4 \times 5^k$`, r`$5^{k+1} + 3$`, r`$4 \times 5^k + 3$`, "B"),
        markScheme: r`- **B** (1) — $5^{k+1} + 3 - 5^k - 3 = 5^k(5 - 1) = 4 \times 5^k$.`,
        explanation: r`Since $f(k+1) = f(k) + 4 \times 5^k$ and both terms are divisible by $4$ when $f(k)$ is, the inductive step follows. The constants cancel — forgetting this gives option D.`,
    },
    {
        seedKey: "fma-wfm01-proof-by-induction-002",
        unitCode: "WFM01",
        topicSlug: "proof-by-induction",
        type: "SHORT",
        difficulty: "MEDIUM",
        marks: 5,
        status: "DRAFT",
        stem: r`Prove by induction that, for all $n \in \mathbb{Z}^+$,
$$\begin{pmatrix} 2 & 1 \\ 0 & 1 \end{pmatrix}^n = \begin{pmatrix} 2^n & 2^n - 1 \\ 0 & 1 \end{pmatrix}$$`,
        markScheme: r`- **B1** $n = 1$: right-hand side is $\begin{pmatrix} 2 & 1 \\ 0 & 1 \end{pmatrix}$, so true for $n = 1$ (1)
- **M1** Assumes true for $n = k$ and writes $\mathbf{M}^{k+1} = \begin{pmatrix} 2^k & 2^k - 1 \\ 0 & 1 \end{pmatrix}\begin{pmatrix} 2 & 1 \\ 0 & 1 \end{pmatrix}$ (or $\mathbf{M}\mathbf{M}^k$) (1)
- **A1** $= \begin{pmatrix} 2^{k+1} & 2^k + 2^k - 1 \\ 0 & 1 \end{pmatrix}$ (1)
- **A1** $= \begin{pmatrix} 2^{k+1} & 2^{k+1} - 1 \\ 0 & 1 \end{pmatrix}$, the result with $n = k + 1$ (1)
- **A1** Conclusion: true for $n = 1$, and true for $n = k$ implies true for $n = k+1$, so true for all $n \in \mathbb{Z}^+$ (1)`,
        explanation: r`The final mark needs a full conclusion that mentions the base case **and** the implication. Writing $2^k + 2^k = 2^{k+1}$ explicitly shows the examiner the target form.`,
    },
    {
        seedKey: "fma-wfm01-proof-by-induction-003",
        unitCode: "WFM01",
        topicSlug: "proof-by-induction",
        type: "SHORT",
        difficulty: "HARD",
        marks: 5,
        status: "DRAFT",
        stem: r`Prove by induction that $f(n) = 3^{2n} + 7$ is divisible by $8$ for all $n \in \mathbb{Z}^+$.`,
        markScheme: r`- **B1** $f(1) = 9 + 7 = 16 = 2 \times 8$, so true for $n = 1$ (1)
- **M1** Assumes $f(k)$ divisible by $8$ and considers $f(k+1) = 3^{2k+2} + 7 = 9 \times 3^{2k} + 7$ (1)
- **M1** Writes $f(k+1)$ in terms of $f(k)$, e.g. $f(k+1) = 9f(k) - 56$ (1)
- **A1** $9f(k)$ and $56 = 7 \times 8$ are both divisible by $8$, so $f(k+1)$ is divisible by $8$ (1)
- **A1** Full conclusion: true for $n = 1$ and true for $n = k$ implies true for $n = k + 1$, hence true for all $n \in \mathbb{Z}^+$ (1)`,
        explanation: r`Aim to write $f(k+1)$ as a multiple of $f(k)$ plus a multiple of $8$. Using $f(k+1) - f(k) = 8 \times 3^{2k}$ is an equally valid route.`,
    },
];

// ---------------------------------------------------------------------------------------------------------------
// WFM02 — Further Pure Mathematics 2
// ---------------------------------------------------------------------------------------------------------------
const wfm02: SeedQuestion[] = [
    // --- inequalities ---
    {
        seedKey: "fma-wfm02-inequalities-001",
        unitCode: "WFM02",
        topicSlug: "inequalities",
        type: "MCQ",
        difficulty: "MEDIUM",
        marks: 1,
        status: "DRAFT",
        stem: r`Find the set of values of $x$ for which $|x - 3| < 2x$.`,
        options: opts("$x > 3$", "$1 < x < 3$", "$x > -3$", "$x > 1$", "D"),
        markScheme: r`- **D** (1) — the critical value is where $3 - x = 2x$, i.e. $x = 1$; for $x \geq 3$ the inequality always holds.`,
        explanation: r`Sketch $y = |x - 3|$ and $y = 2x$: they cross once, at $x = 1$ (on the reflected branch). The other branch gives $x - 3 = 2x \Rightarrow x = -3$, which is not a real intersection because $2x < 0$ there.`,
    },
    {
        seedKey: "fma-wfm02-inequalities-002",
        unitCode: "WFM02",
        topicSlug: "inequalities",
        type: "CALCULATION",
        difficulty: "HARD",
        marks: 6,
        status: "DRAFT",
        stem: r`Use algebra to find the set of values of $x$ for which
$$\frac{3x}{x - 1} > x + 1$$
Give your answer using exact values.`,
        markScheme: r`- **M1** Collects on one side over a common denominator: $\dfrac{3x - (x + 1)(x - 1)}{x - 1} > 0$ (1)
- **A1** $\dfrac{-x^2 + 3x + 1}{x - 1} > 0$, or equivalently $\dfrac{x^2 - 3x - 1}{x - 1} < 0$ (1)
- **M1** Finds critical values from $x^2 - 3x - 1 = 0$ (1)
- **A1** Critical values $x = 1$ and $x = \dfrac{3 \pm \sqrt{13}}{2}$ (1)
- **M1** Uses a sign diagram or sketch to choose the correct regions (1)
- **A1** $x < \dfrac{3 - \sqrt{13}}{2}$ or $1 < x < \dfrac{3 + \sqrt{13}}{2}$ (1)`,
        explanation: r`Never multiply both sides by $x - 1$ — its sign is unknown. Either collect terms over a common denominator, or multiply by $(x - 1)^2$, which is always positive. Remember $x = 1$ is a critical value too.`,
    },
    // --- series ---
    {
        seedKey: "fma-wfm02-series-001",
        unitCode: "WFM02",
        topicSlug: "series",
        type: "MCQ",
        difficulty: "EASY",
        marks: 1,
        status: "DRAFT",
        stem: r`Using $\dfrac{1}{r(r+1)} = \dfrac{1}{r} - \dfrac{1}{r+1}$, find $\displaystyle\sum_{r=1}^{n} \frac{1}{r(r+1)}$.`,
        options: opts(r`$\dfrac{n}{n+1}$`, r`$\dfrac{1}{n+1}$`, r`$1 + \dfrac{1}{n+1}$`, r`$\dfrac{n+1}{n}$`, "A"),
        markScheme: r`- **A** (1) — every term cancels except $1 - \dfrac{1}{n+1} = \dfrac{n}{n+1}$.`,
        explanation: r`Write out the first few and last few rows of the method of differences: $\left(1 - \tfrac{1}{2}\right) + \left(\tfrac{1}{2} - \tfrac{1}{3}\right) + \dots + \left(\tfrac{1}{n} - \tfrac{1}{n+1}\right)$. Only the first and last terms survive.`,
    },
    {
        seedKey: "fma-wfm02-series-002",
        unitCode: "WFM02",
        topicSlug: "series",
        type: "CALCULATION",
        difficulty: "HARD",
        marks: 6,
        status: "DRAFT",
        stem: r`(a) Express $\dfrac{2}{(r + 1)(r + 3)}$ in partial fractions.

(b) Hence show that
$$\sum_{r=1}^{n} \frac{2}{(r+1)(r+3)} = \frac{n(5n + 13)}{6(n + 2)(n + 3)}$$`,
        markScheme: r`- **B1** $\dfrac{1}{r + 1} - \dfrac{1}{r + 3}$ (1)
- **M1** Writes out terms for $r = 1, 2, 3, \dots$ and $r = n - 1, n$ to show cancellation (1)
- **A1** Remaining terms identified: $\tfrac{1}{2} + \tfrac{1}{3} - \dfrac{1}{n + 2} - \dfrac{1}{n + 3}$ (1)
- **M1** Combines over the common denominator $6(n + 2)(n + 3)$ (1)
- **A1** Numerator $5(n + 2)(n + 3) - 6(2n + 5) = 5n^2 + 13n$ (1)
- **A1** $= \dfrac{n(5n + 13)}{6(n + 2)(n + 3)}$ convincingly shown (1)`,
        explanation: r`Because the fractions are two steps apart ($r+1$ and $r+3$), **two** terms survive at each end. Check with $n = 1$: the sum is $\tfrac{2}{8} = \tfrac{1}{4}$ and the formula gives $\tfrac{18}{72} = \tfrac{1}{4}$.`,
    },
    // --- further-complex-numbers ---
    {
        seedKey: "fma-wfm02-further-complex-numbers-001",
        unitCode: "WFM02",
        topicSlug: "further-complex-numbers",
        type: "MCQ",
        difficulty: "EASY",
        marks: 1,
        status: "DRAFT",
        stem: r`Simplify $\left(\cos\dfrac{\pi}{6} + i\sin\dfrac{\pi}{6}\right)^9$.`,
        options: opts("$1$", "$-1$", "$i$", "$-i$", "D"),
        markScheme: r`- **D** (1) — by de Moivre, $\cos\dfrac{3\pi}{2} + i\sin\dfrac{3\pi}{2} = -i$.`,
        explanation: r`De Moivre's theorem multiplies the argument by the power: $9 \times \tfrac{\pi}{6} = \tfrac{3\pi}{2}$. On the Argand diagram that is straight down the imaginary axis.`,
    },
    {
        seedKey: "fma-wfm02-further-complex-numbers-002",
        unitCode: "WFM02",
        topicSlug: "further-complex-numbers",
        type: "CALCULATION",
        difficulty: "MEDIUM",
        marks: 5,
        status: "DRAFT",
        stem: r`Solve the equation $z^3 = 8i$, giving your answers in the form $a + bi$ where $a$ and $b$ are exact.`,
        markScheme: r`- **B1** $8i = 8\left(\cos\dfrac{\pi}{2} + i\sin\dfrac{\pi}{2}\right)$ (1)
- **M1** $z = 2\left(\cos\theta + i\sin\theta\right)$ with $\theta = \dfrac{\pi}{6} + \dfrac{2k\pi}{3}$ (1)
- **A1** $\theta = \dfrac{\pi}{6}, \dfrac{5\pi}{6}, -\dfrac{\pi}{2}$ (1)
- **A1** $z = \sqrt{3} + i$ and $z = -\sqrt{3} + i$ (1)
- **A1** $z = -2i$ (1)`,
        explanation: r`Take the cube root of the modulus and divide the argument by 3, then add multiples of $\tfrac{2\pi}{3}$. The three roots are equally spaced on a circle of radius 2 — a quick sanity check.`,
    },
    {
        seedKey: "fma-wfm02-further-complex-numbers-003",
        unitCode: "WFM02",
        topicSlug: "further-complex-numbers",
        type: "CALCULATION",
        difficulty: "HARD",
        marks: 5,
        status: "DRAFT",
        stem: r`The point $P$ represents $z$ on an Argand diagram, where
$$|z - 3| = 2|z + 3i|$$
Show that the locus of $P$ is a circle, and find its centre and its radius.`,
        markScheme: r`- **M1** Sets $z = x + iy$: $(x - 3)^2 + y^2 = 4\left[x^2 + (y + 3)^2\right]$ (1)
- **A1** $3x^2 + 3y^2 + 6x + 24y + 27 = 0$, i.e. $x^2 + y^2 + 2x + 8y + 9 = 0$ (1)
- **M1** Completes the square: $(x + 1)^2 + (y + 4)^2 = 8$ (1)
- **A1** Centre $(-1, -4)$, i.e. $-1 - 4i$ (1)
- **A1** Radius $2\sqrt{2}$ (1)`,
        explanation: r`Square both sides **before** expanding — the factor $2$ becomes $4$. $|z + 3i|$ is the distance from $-3i$, so the $y$ term is $(y + 3)^2$, not $(y - 3)^2$.`,
    },
    // --- first-order-differential-equations ---
    {
        seedKey: "fma-wfm02-first-order-differential-equations-001",
        unitCode: "WFM02",
        topicSlug: "first-order-differential-equations",
        type: "MCQ",
        difficulty: "EASY",
        marks: 1,
        status: "DRAFT",
        stem: r`Find an integrating factor for $\dfrac{dy}{dx} + \dfrac{2}{x}y = x$, where $x > 0$.`,
        options: opts(r`$2\ln x$`, r`$x^2$`, r`$\dfrac{1}{x^2}$`, r`$e^{2x}$`, "B"),
        markScheme: r`- **B** (1) — $e^{\int 2/x\,dx} = e^{2\ln x} = x^2$.`,
        explanation: r`The integrating factor is $e^{\int P\,dx}$, not $\int P\,dx$ itself (option A). Simplify $e^{2\ln x}$ to $x^2$ before multiplying through.`,
    },
    {
        seedKey: "fma-wfm02-first-order-differential-equations-002",
        unitCode: "WFM02",
        topicSlug: "first-order-differential-equations",
        type: "CALCULATION",
        difficulty: "MEDIUM",
        marks: 6,
        status: "DRAFT",
        stem: r`Find the solution of the differential equation
$$\frac{dy}{dx} + y\tan x = \cos^2 x, \qquad -\frac{\pi}{2} < x < \frac{\pi}{2}$$
for which $y = 2$ when $x = 0$. Give your answer in the form $y = f(x)$.`,
        markScheme: r`- **M1** Integrating factor $e^{\int \tan x\,dx} = e^{\ln \sec x}$ (1)
- **A1** $= \sec x$ (1)
- **M1** $\dfrac{d}{dx}(y\sec x) = \cos^2 x \sec x = \cos x$ (1)
- **A1** $y\sec x = \sin x + c$ (1)
- **M1** Uses $x = 0$, $y = 2$ to find $c = 2$ (1)
- **A1** $y = \sin x\cos x + 2\cos x$ (1)`,
        explanation: r`$\int \tan x\,dx = \ln|\sec x|$, so the integrating factor is $\sec x$. Don't forget the constant before dividing by $\sec x$ — it becomes $c\cos x$, not just $c$.`,
    },
    // --- second-order-differential-equations ---
    {
        seedKey: "fma-wfm02-second-order-differential-equations-001",
        unitCode: "WFM02",
        topicSlug: "second-order-differential-equations",
        type: "MCQ",
        difficulty: "EASY",
        marks: 1,
        status: "DRAFT",
        stem: r`Which is the general solution of $\dfrac{d^2y}{dx^2} - 6\dfrac{dy}{dx} + 9y = 0$?`,
        options: opts(
            r`$y = Ae^{3x} + Be^{-3x}$`,
            r`$y = (A + Bx)e^{3x}$`,
            r`$y = (A + Bx)e^{-3x}$`,
            r`$y = A\cos 3x + B\sin 3x$`,
            "B",
        ),
        markScheme: r`- **B** (1) — auxiliary equation $m^2 - 6m + 9 = 0$ has the repeated root $m = 3$.`,
        explanation: r`A repeated root $m$ gives $(A + Bx)e^{mx}$. Watch the sign: $(m - 3)^2 = 0$ gives $m = +3$, so option C is a sign error.`,
    },
    {
        seedKey: "fma-wfm02-second-order-differential-equations-002",
        unitCode: "WFM02",
        topicSlug: "second-order-differential-equations",
        type: "CALCULATION",
        difficulty: "MEDIUM",
        marks: 7,
        status: "DRAFT",
        stem: r`(a) Find the general solution of
$$\frac{d^2y}{dx^2} + 2\frac{dy}{dx} - 3y = 6x - 1$$

(b) Find the particular solution for which $y = 0$ and $\dfrac{dy}{dx} = 0$ when $x = 0$.`,
        markScheme: r`- **M1** Auxiliary equation $m^2 + 2m - 3 = 0 \Rightarrow m = 1, -3$ (1)
- **A1** Complementary function $y = Ae^{x} + Be^{-3x}$ (1)
- **M1** Tries $y = px + q$ and substitutes: $2p - 3(px + q) = 6x - 1$ (1)
- **A1** $p = -2$, $q = -1$, so $y = Ae^{x} + Be^{-3x} - 2x - 1$ (1)
- **M1** Uses $y(0) = 0$: $A + B - 1 = 0$ (1)
- **M1** Differentiates and uses $y'(0) = 0$: $A - 3B - 2 = 0$ (1)
- **A1** $A = \tfrac{5}{4}$, $B = -\tfrac{1}{4}$: $y = \tfrac{5}{4}e^{x} - \tfrac{1}{4}e^{-3x} - 2x - 1$ (1)`,
        explanation: r`Apply the boundary conditions to the **general** solution (CF + PI), never to the complementary function alone. Remember the PI contributes to $y'$ too: $\tfrac{d}{dx}(-2x - 1) = -2$.`,
    },
    {
        seedKey: "fma-wfm02-second-order-differential-equations-003",
        unitCode: "WFM02",
        topicSlug: "second-order-differential-equations",
        type: "CALCULATION",
        difficulty: "HARD",
        marks: 4,
        status: "DRAFT",
        stem: r`Find the general solution of
$$\frac{d^2y}{dx^2} + 4y = 8\sin 2x$$`,
        markScheme: r`- **B1** Complementary function $y = A\cos 2x + B\sin 2x$ (1)
- **B1** Since $\sin 2x$ is in the CF, tries $y = \lambda x\cos 2x + \mu x\sin 2x$ (1)
- **M1** Differentiates twice and substitutes: $-4\lambda\sin 2x + 4\mu\cos 2x = 8\sin 2x$ (1)
- **A1** $\lambda = -2$, $\mu = 0$: $y = A\cos 2x + B\sin 2x - 2x\cos 2x$ (1)`,
        explanation: r`If the right-hand side already appears in the complementary function, the usual trial $\lambda\cos 2x + \mu\sin 2x$ gives $0 = 8\sin 2x$. Multiply the trial function by $x$.`,
    },
    // --- maclaurin-taylor ---
    {
        seedKey: "fma-wfm02-maclaurin-taylor-001",
        unitCode: "WFM02",
        topicSlug: "maclaurin-taylor",
        type: "MCQ",
        difficulty: "EASY",
        marks: 1,
        status: "DRAFT",
        stem: r`What is the coefficient of $x^3$ in the Maclaurin series of $e^{2x}$?`,
        options: opts(r`$\tfrac{1}{6}$`, r`$\tfrac{2}{3}$`, r`$\tfrac{4}{3}$`, r`$\tfrac{8}{3}$`, "C"),
        markScheme: r`- **C** (1) — $\dfrac{(2x)^3}{3!} = \dfrac{8x^3}{6} = \dfrac{4}{3}x^3$.`,
        explanation: r`Replace $x$ by $2x$ in $e^x = 1 + x + \tfrac{x^2}{2!} + \tfrac{x^3}{3!} + \dots$ and cube the **whole** $2x$. Option A forgets the $2^3$; option D divides by $3$ instead of $3! = 6$.`,
    },
    {
        seedKey: "fma-wfm02-maclaurin-taylor-002",
        unitCode: "WFM02",
        topicSlug: "maclaurin-taylor",
        type: "CALCULATION",
        difficulty: "MEDIUM",
        marks: 6,
        status: "DRAFT",
        stem: r`$f(x) = \ln(1 + \sin x)$, $-\dfrac{\pi}{2} < x < \dfrac{\pi}{2}$.

(a) Show that $f''(x) = -\dfrac{1}{1 + \sin x}$.

(b) Hence find the Maclaurin series of $f(x)$ up to and including the term in $x^3$.`,
        markScheme: r`- **B1** $f'(x) = \dfrac{\cos x}{1 + \sin x}$ (1)
- **M1** Quotient rule: $f''(x) = \dfrac{-\sin x(1 + \sin x) - \cos^2 x}{(1 + \sin x)^2}$ (1)
- **A1** Uses $\sin^2 x + \cos^2 x = 1$ to get $\dfrac{-(1 + \sin x)}{(1 + \sin x)^2} = -\dfrac{1}{1 + \sin x}$ (1)
- **B1** $f'''(x) = \dfrac{\cos x}{(1 + \sin x)^2}$ (1)
- **M1** $f(0) = 0$, $f'(0) = 1$, $f''(0) = -1$, $f'''(0) = 1$ (1)
- **A1** $f(x) \approx x - \dfrac{x^2}{2} + \dfrac{x^3}{6}$ (1)`,
        explanation: r`Maclaurin series: $f(0) + f'(0)x + \tfrac{f''(0)}{2!}x^2 + \tfrac{f'''(0)}{3!}x^3$. Divide by the factorials. You can check by composing series: $\ln(1 + u)$ with $u = x - \tfrac{x^3}{6}$.`,
    },
    {
        seedKey: "fma-wfm02-maclaurin-taylor-003",
        unitCode: "WFM02",
        topicSlug: "maclaurin-taylor",
        type: "CALCULATION",
        difficulty: "HARD",
        marks: 5,
        status: "DRAFT",
        stem: r`$y$ satisfies the differential equation
$$\frac{dy}{dx} = x + y^2, \qquad y = 1 \text{ at } x = 0$$
Use the Taylor series method to find a series solution for $y$ in ascending powers of $x$, up to and including the term in $x^3$.`,
        markScheme: r`- **B1** $\left(\dfrac{dy}{dx}\right)_0 = 0 + 1 = 1$ (1)
- **M1** Differentiates implicitly: $\dfrac{d^2y}{dx^2} = 1 + 2y\dfrac{dy}{dx}$, so $\left(\dfrac{d^2y}{dx^2}\right)_0 = 3$ (1)
- **M1** $\dfrac{d^3y}{dx^3} = 2\left(\dfrac{dy}{dx}\right)^2 + 2y\dfrac{d^2y}{dx^2}$ (1)
- **A1** $\left(\dfrac{d^3y}{dx^3}\right)_0 = 2 + 6 = 8$ (1)
- **A1** $y = 1 + x + \dfrac{3}{2}x^2 + \dfrac{4}{3}x^3 + \dots$ (1)`,
        explanation: r`Differentiating $y^2$ needs the chain rule ($2y\,y'$), and the second derivative of $y^2$ needs the product rule. Remember to divide by $2!$ and $3!$ at the end.`,
    },
    // --- polar-coordinates ---
    {
        seedKey: "fma-wfm02-polar-coordinates-001",
        unitCode: "WFM02",
        topicSlug: "polar-coordinates",
        type: "MCQ",
        difficulty: "EASY",
        marks: 1,
        status: "DRAFT",
        stem: r`Which is a Cartesian equation of the curve with polar equation $r = 4\cos\theta$?`,
        options: opts(r`$x^2 + y^2 = 4x$`, r`$x^2 + y^2 = 16$`, r`$x = 4$`, r`$x^2 + y^2 = 4y$`, "A"),
        markScheme: r`- **A** (1) — multiply by $r$: $r^2 = 4r\cos\theta \Rightarrow x^2 + y^2 = 4x$.`,
        explanation: r`Use $r^2 = x^2 + y^2$ and $x = r\cos\theta$. The curve is a circle with centre $(2, 0)$ and radius $2$, passing through the pole.`,
    },
    {
        seedKey: "fma-wfm02-polar-coordinates-002",
        unitCode: "WFM02",
        topicSlug: "polar-coordinates",
        type: "CALCULATION",
        difficulty: "MEDIUM",
        marks: 5,
        status: "DRAFT",
        stem: r`Find the exact area enclosed by the curve with polar equation $r = 2 + \cos\theta$, $0 \leq \theta < 2\pi$.`,
        markScheme: r`- **M1** Area $= \dfrac{1}{2}\displaystyle\int_0^{2\pi} (2 + \cos\theta)^2\,d\theta$ (1)
- **A1** Integrand $4 + 4\cos\theta + \cos^2\theta$ (1)
- **M1** Uses $\cos^2\theta = \tfrac{1}{2}(1 + \cos 2\theta)$ (1)
- **A1** $\dfrac{1}{2}\left[\dfrac{9}{2}\theta + 4\sin\theta + \dfrac{1}{4}\sin 2\theta\right]_0^{2\pi}$ (1)
- **A1** $\dfrac{9\pi}{2}$ (1)`,
        explanation: r`Area in polar coordinates is $\tfrac{1}{2}\int r^2\,d\theta$ — don't forget either the $\tfrac{1}{2}$ or the square. Over a full turn the sine terms vanish.`,
    },
    {
        seedKey: "fma-wfm02-polar-coordinates-003",
        unitCode: "WFM02",
        topicSlug: "polar-coordinates",
        type: "CALCULATION",
        difficulty: "HARD",
        marks: 5,
        status: "DRAFT",
        stem: r`The curve $C$ has polar equation $r = 1 + \cos\theta$, $-\pi < \theta \leq \pi$.

Find the polar coordinates of the points on $C$, other than the pole, where the tangent is parallel to the initial line.`,
        markScheme: r`- **M1** $y = r\sin\theta = \sin\theta + \sin\theta\cos\theta$ (1)
- **M1** $\dfrac{dy}{d\theta} = \cos\theta + \cos^2\theta - \sin^2\theta$ (1)
- **A1** Sets to zero: $2\cos^2\theta + \cos\theta - 1 = 0$ (1)
- **A1** $(2\cos\theta - 1)(\cos\theta + 1) = 0$; $\cos\theta = -1$ gives the pole, so $\cos\theta = \tfrac{1}{2}$ (1)
- **A1** $\left(\tfrac{3}{2}, \tfrac{\pi}{3}\right)$ and $\left(\tfrac{3}{2}, -\tfrac{\pi}{3}\right)$ (1)`,
        explanation: r`Parallel to the initial line means $\tfrac{dy}{d\theta} = 0$ (perpendicular would be $\tfrac{dx}{d\theta} = 0$). Differentiating $r$ itself is a common wrong start.`,
    },
];

// ---------------------------------------------------------------------------------------------------------------
// WFM03 — Further Pure Mathematics 3
// ---------------------------------------------------------------------------------------------------------------
const wfm03: SeedQuestion[] = [
    // --- hyperbolic-functions ---
    {
        seedKey: "fma-wfm03-hyperbolic-functions-001",
        unitCode: "WFM03",
        topicSlug: "hyperbolic-functions",
        type: "MCQ",
        difficulty: "EASY",
        marks: 1,
        status: "DRAFT",
        stem: r`Which of these identities is correct for all real $x$?`,
        options: opts(
            r`$\cosh^2 x + \sinh^2 x = 1$`,
            r`$\cosh 2x = 1 - 2\sinh^2 x$`,
            r`$\cosh 2x = 1 + 2\sinh^2 x$`,
            r`$\cosh 2x = 2\cosh^2 x + 1$`,
            "C",
        ),
        markScheme: r`- **C** (1) — from $\cosh 2x = \cosh^2 x + \sinh^2 x$ and $\cosh^2 x - \sinh^2 x = 1$.`,
        explanation: r`Osborn's rule: replace $\cos$ by $\cosh$, $\sin$ by $\sinh$, and change the sign of any product of two sines. So $\cos 2x = 1 - 2\sin^2 x$ becomes $\cosh 2x = 1 + 2\sinh^2 x$.`,
    },
    {
        seedKey: "fma-wfm03-hyperbolic-functions-002",
        unitCode: "WFM03",
        topicSlug: "hyperbolic-functions",
        type: "CALCULATION",
        difficulty: "MEDIUM",
        marks: 5,
        status: "DRAFT",
        stem: r`Solve the equation
$$3\cosh x - \sinh x = 3$$
giving your answers as exact values.`,
        markScheme: r`- **M1** Uses exponential definitions: $\dfrac{3(e^x + e^{-x})}{2} - \dfrac{e^x - e^{-x}}{2} = 3$ (1)
- **A1** $e^x + 2e^{-x} = 3$ (1)
- **M1** Multiplies by $e^x$: $e^{2x} - 3e^x + 2 = 0$ (1)
- **A1** $(e^x - 1)(e^x - 2) = 0$ (1)
- **A1** $x = 0$ or $x = \ln 2$ (1)`,
        explanation: r`Hyperbolic equations that mix $\cosh$ and $\sinh$ linearly are best solved by converting to exponentials, which gives a quadratic in $e^x$. Reject any solution with $e^x \leq 0$.`,
    },
    {
        seedKey: "fma-wfm03-hyperbolic-functions-003",
        unitCode: "WFM03",
        topicSlug: "hyperbolic-functions",
        type: "SHORT",
        difficulty: "MEDIUM",
        marks: 4,
        status: "DRAFT",
        stem: r`Starting from the definition of $\tanh y$ in terms of exponentials, show that
$$\operatorname{artanh} x = \frac{1}{2}\ln\left(\frac{1 + x}{1 - x}\right), \qquad -1 < x < 1$$`,
        markScheme: r`- **M1** Lets $y = \operatorname{artanh} x$ so $x = \tanh y = \dfrac{e^{y} - e^{-y}}{e^{y} + e^{-y}}$ (1)
- **M1** Multiplies by $e^y$: $x = \dfrac{e^{2y} - 1}{e^{2y} + 1}$ (1)
- **A1** Rearranges: $e^{2y}(1 - x) = 1 + x \Rightarrow e^{2y} = \dfrac{1 + x}{1 - x}$ (1)
- **A1** $y = \dfrac{1}{2}\ln\left(\dfrac{1 + x}{1 - x}\right)$ (1)`,
        explanation: r`Make $e^{2y}$ the subject, then take logs. The domain $-1 < x < 1$ keeps $\tfrac{1+x}{1-x}$ positive so the logarithm is defined.`,
    },
    // --- further-coordinate-systems ---
    {
        seedKey: "fma-wfm03-further-coordinate-systems-001",
        unitCode: "WFM03",
        topicSlug: "further-coordinate-systems",
        type: "MCQ",
        difficulty: "EASY",
        marks: 1,
        status: "DRAFT",
        stem: r`The ellipse $E$ has equation $\dfrac{x^2}{25} + \dfrac{y^2}{9} = 1$. What are the coordinates of the foci of $E$?`,
        options: opts(r`$(\pm 5, 0)$`, r`$(\pm 3, 0)$`, r`$(\pm 4, 0)$`, r`$(\pm\sqrt{34}, 0)$`, "C"),
        markScheme: r`- **C** (1) — $b^2 = a^2(1 - e^2)$ gives $e = \tfrac{4}{5}$, so foci $(\pm ae, 0) = (\pm 4, 0)$.`,
        explanation: r`For an ellipse, $a^2e^2 = a^2 - b^2 = 25 - 9 = 16$. Using $a^2 + b^2$ (the hyperbola relationship) gives $\sqrt{34}$.`,
    },
    {
        seedKey: "fma-wfm03-further-coordinate-systems-002",
        unitCode: "WFM03",
        topicSlug: "further-coordinate-systems",
        type: "CALCULATION",
        difficulty: "MEDIUM",
        marks: 4,
        status: "DRAFT",
        stem: r`The hyperbola $H$ has equation $\dfrac{x^2}{16} - \dfrac{y^2}{9} = 1$.

Find (a) the eccentricity of $H$, (b) the coordinates of the foci, and (c) the equations of the directrices.`,
        markScheme: r`- **M1** Uses $b^2 = a^2(e^2 - 1)$: $9 = 16(e^2 - 1)$ (1)
- **A1** $e = \dfrac{5}{4}$ (1)
- **A1** Foci $(\pm ae, 0) = (\pm 5, 0)$ (1)
- **A1** Directrices $x = \pm\dfrac{a}{e} = \pm\dfrac{16}{5}$ (1)`,
        explanation: r`For a hyperbola $e > 1$ and $b^2 = a^2(e^2 - 1)$. The directrices lie **between** the vertices and the centre: $\tfrac{16}{5} < 4$.`,
    },
    {
        seedKey: "fma-wfm03-further-coordinate-systems-003",
        unitCode: "WFM03",
        topicSlug: "further-coordinate-systems",
        type: "CALCULATION",
        difficulty: "HARD",
        marks: 6,
        status: "DRAFT",
        stem: r`The ellipse $E$ has equation $\dfrac{x^2}{9} + \dfrac{y^2}{4} = 1$. The point $P(3\cos\theta, 2\sin\theta)$, $0 < \theta < \dfrac{\pi}{2}$, lies on $E$.

(a) Show that the tangent to $E$ at $P$ has equation $2x\cos\theta + 3y\sin\theta = 6$.

(b) The tangent meets the $x$-axis at $A$ and the $y$-axis at $B$. Find the minimum area of triangle $OAB$, where $O$ is the origin.`,
        markScheme: r`- **M1** $\dfrac{dy}{dx} = \dfrac{dy/d\theta}{dx/d\theta} = \dfrac{2\cos\theta}{-3\sin\theta}$ (1)
- **M1** $y - 2\sin\theta = -\dfrac{2\cos\theta}{3\sin\theta}(x - 3\cos\theta)$ (1)
- **A1** Uses $\sin^2\theta + \cos^2\theta = 1$ to reach $2x\cos\theta + 3y\sin\theta = 6$ (1)
- **B1** $A\left(\dfrac{3}{\cos\theta}, 0\right)$ and $B\left(0, \dfrac{2}{\sin\theta}\right)$ (1)
- **M1** Area $= \dfrac{1}{2} \cdot \dfrac{3}{\cos\theta} \cdot \dfrac{2}{\sin\theta} = \dfrac{6}{\sin 2\theta}$ (1)
- **A1** Minimum when $\sin 2\theta = 1$: minimum area $= 6$ (1)`,
        explanation: r`Writing the area in terms of $\sin 2\theta$ avoids calculus: $\sin 2\theta \leq 1$, so the area is at least $6$, reached at $\theta = \tfrac{\pi}{4}$.`,
    },
    // --- differentiation ---
    {
        seedKey: "fma-wfm03-differentiation-001",
        unitCode: "WFM03",
        topicSlug: "differentiation",
        type: "MCQ",
        difficulty: "EASY",
        marks: 1,
        status: "DRAFT",
        stem: r`Find $\dfrac{d}{dx}\left(\operatorname{arsinh} 2x\right)$.`,
        options: opts(
            r`$\dfrac{1}{\sqrt{1 + 4x^2}}$`,
            r`$\dfrac{2}{\sqrt{1 + 4x^2}}$`,
            r`$\dfrac{2}{\sqrt{4x^2 - 1}}$`,
            r`$\dfrac{2}{1 + 4x^2}$`,
            "B",
        ),
        markScheme: r`- **B** (1) — chain rule: $\dfrac{1}{\sqrt{1 + (2x)^2}} \times 2$.`,
        explanation: r`$\tfrac{d}{dx}\operatorname{arsinh} x = \tfrac{1}{\sqrt{1 + x^2}}$. Option A forgets the chain rule, C is the $\operatorname{arcosh}$ form and D is the $\arctan$ form.`,
    },
    {
        seedKey: "fma-wfm03-differentiation-002",
        unitCode: "WFM03",
        topicSlug: "differentiation",
        type: "SHORT",
        difficulty: "MEDIUM",
        marks: 4,
        status: "DRAFT",
        stem: r`Given that $y = \arctan(\sinh x)$, show that $\dfrac{dy}{dx} = \operatorname{sech} x$.`,
        markScheme: r`- **M1** Uses $\dfrac{d}{du}\arctan u = \dfrac{1}{1 + u^2}$ with the chain rule (1)
- **A1** $\dfrac{dy}{dx} = \dfrac{\cosh x}{1 + \sinh^2 x}$ (1)
- **M1** Uses $1 + \sinh^2 x = \cosh^2 x$ (1)
- **A1** $\dfrac{\cosh x}{\cosh^2 x} = \dfrac{1}{\cosh x} = \operatorname{sech} x$ (1)`,
        explanation: r`The key step is the hyperbolic identity $\cosh^2 x - \sinh^2 x = 1$. "Show that" questions need every step written out, including the identity used.`,
    },
    {
        seedKey: "fma-wfm03-differentiation-003",
        unitCode: "WFM03",
        topicSlug: "differentiation",
        type: "SHORT",
        difficulty: "HARD",
        marks: 4,
        status: "DRAFT",
        stem: r`Given that $y = \operatorname{arsinh} x$, show that
$$(1 + x^2)\frac{d^2y}{dx^2} + x\frac{dy}{dx} = 0$$`,
        markScheme: r`- **B1** $\dfrac{dy}{dx} = (1 + x^2)^{-1/2}$ (1)
- **M1** Differentiates again: $\dfrac{d^2y}{dx^2} = -\tfrac{1}{2}(1 + x^2)^{-3/2} \cdot 2x$ (1)
- **A1** $\dfrac{d^2y}{dx^2} = -x(1 + x^2)^{-3/2}$ (1)
- **A1** $(1 + x^2)\left(-x(1 + x^2)^{-3/2}\right) + x(1 + x^2)^{-1/2} = -x(1 + x^2)^{-1/2} + x(1 + x^2)^{-1/2} = 0$ (1)`,
        explanation: r`Alternatively write $\sqrt{1 + x^2}\,\tfrac{dy}{dx} = 1$ and differentiate implicitly with the product rule — this avoids negative fractional powers.`,
    },
    // --- integration ---
    {
        seedKey: "fma-wfm03-integration-001",
        unitCode: "WFM03",
        topicSlug: "integration",
        type: "MCQ",
        difficulty: "EASY",
        marks: 1,
        status: "DRAFT",
        stem: r`Find $\displaystyle\int \frac{1}{\sqrt{x^2 + 9}}\,dx$.`,
        options: opts(
            r`$\operatorname{arsinh}\dfrac{x}{3} + c$`,
            r`$\dfrac{1}{3}\operatorname{arsinh}\dfrac{x}{3} + c$`,
            r`$\operatorname{arcosh}\dfrac{x}{3} + c$`,
            r`$\dfrac{1}{3}\arctan\dfrac{x}{3} + c$`,
            "A",
        ),
        markScheme: r`- **A** (1) — standard result $\displaystyle\int \frac{dx}{\sqrt{x^2 + a^2}} = \operatorname{arsinh}\frac{x}{a} + c$.`,
        explanation: r`Unlike $\int \tfrac{dx}{x^2 + a^2} = \tfrac{1}{a}\arctan\tfrac{x}{a}$, the arsinh result has **no** $\tfrac{1}{a}$ factor. Option C is for $\sqrt{x^2 - 9}$.`,
    },
    {
        seedKey: "fma-wfm03-integration-002",
        unitCode: "WFM03",
        topicSlug: "integration",
        type: "CALCULATION",
        difficulty: "HARD",
        marks: 6,
        status: "DRAFT",
        stem: r`$$I_n = \int_0^1 x^n e^x\,dx, \qquad n \geq 0$$

(a) Show that $I_n = e - nI_{n-1}$ for $n \geq 1$.

(b) Hence find the exact value of $I_3$.`,
        markScheme: r`- **M1** Integrates by parts with $u = x^n$, $dv = e^x\,dx$ (1)
- **A1** $I_n = \left[x^n e^x\right]_0^1 - n\displaystyle\int_0^1 x^{n-1}e^x\,dx$ (1)
- **A1** $= e - nI_{n-1}$ (1)
- **B1** $I_0 = e - 1$ (1)
- **M1** $I_1 = 1$, $I_2 = e - 2$ (1)
- **A1** $I_3 = e - 3(e - 2) = 6 - 2e$ (1)`,
        explanation: r`At the lower limit $x^n e^x = 0$ for $n \geq 1$. A sanity check: $6 - 2e \approx 0.563$, positive and less than $I_2 \approx 0.718$, as expected since $x^3 < x^2$ on $(0, 1)$.`,
    },
    {
        seedKey: "fma-wfm03-integration-003",
        unitCode: "WFM03",
        topicSlug: "integration",
        type: "CALCULATION",
        difficulty: "MEDIUM",
        marks: 4,
        status: "DRAFT",
        stem: r`Find the exact length of the arc of the curve $y = \cosh x$ from $x = 0$ to $x = \ln 2$.`,
        markScheme: r`- **M1** $s = \displaystyle\int_0^{\ln 2} \sqrt{1 + \left(\frac{dy}{dx}\right)^2}\,dx$ with $\dfrac{dy}{dx} = \sinh x$ (1)
- **A1** $\sqrt{1 + \sinh^2 x} = \cosh x$ (1)
- **M1** $s = \left[\sinh x\right]_0^{\ln 2} = \sinh(\ln 2)$ (1)
- **A1** $= \dfrac{2 - \tfrac{1}{2}}{2} = \dfrac{3}{4}$ (1)`,
        explanation: r`Use $\sinh(\ln a) = \tfrac{1}{2}\left(a - \tfrac{1}{a}\right)$ to evaluate exactly. The catenary is the classic case where the arc-length integrand simplifies perfectly.`,
    },
    // --- vectors ---
    {
        seedKey: "fma-wfm03-vectors-001",
        unitCode: "WFM03",
        topicSlug: "vectors",
        type: "MCQ",
        difficulty: "EASY",
        marks: 1,
        status: "DRAFT",
        stem: r`Find $(\mathbf{i} + 2\mathbf{j} + 3\mathbf{k}) \times (\mathbf{j} - \mathbf{k})$.`,
        options: opts(
            r`$5\mathbf{i} - \mathbf{j} - \mathbf{k}$`,
            r`$-5\mathbf{i} + \mathbf{j} + \mathbf{k}$`,
            r`$-\mathbf{i} + \mathbf{j} + 5\mathbf{k}$`,
            r`$-\mathbf{k}$`,
            "B",
        ),
        markScheme: r`- **B** (1) — $\big((2)(-1) - (3)(1),\ (3)(0) - (1)(-1),\ (1)(1) - (2)(0)\big) = (-5, 1, 1)$.`,
        explanation: r`Option A is $\mathbf{b} \times \mathbf{a}$ — the cross product is anti-commutative. Check your answer is perpendicular to both vectors: $(-5)(1) + (1)(2) + (1)(3) = 0$.`,
    },
    {
        seedKey: "fma-wfm03-vectors-002",
        unitCode: "WFM03",
        topicSlug: "vectors",
        type: "CALCULATION",
        difficulty: "MEDIUM",
        marks: 6,
        status: "DRAFT",
        stem: r`The points $A(1, 0, 2)$, $B(2, 1, 0)$ and $C(0, 3, 1)$ lie in the plane $\Pi$.

(a) Find a Cartesian equation of $\Pi$.

(b) Find the exact perpendicular distance from the point $P(3, 3, 3)$ to $\Pi$.`,
        markScheme: r`- **M1** $\overrightarrow{AB} = (1, 1, -2)$ and $\overrightarrow{AC} = (-1, 3, -1)$ (1)
- **M1** Normal $\mathbf{n} = \overrightarrow{AB} \times \overrightarrow{AC}$ (1)
- **A1** $\mathbf{n} = (5, 3, 4)$ (1)
- **A1** $5x + 3y + 4z = 13$ (1)
- **M1** Distance $= \dfrac{|5(3) + 3(3) + 4(3) - 13|}{\sqrt{25 + 9 + 16}}$ (1)
- **A1** $= \dfrac{23}{\sqrt{50}} = \dfrac{23\sqrt{2}}{10}$ (1)`,
        explanation: r`Check the plane equation using all three points (each gives 13). The distance formula $\tfrac{|ax_1 + by_1 + cz_1 - d|}{\sqrt{a^2 + b^2 + c^2}}$ is in the formula booklet.`,
    },
    {
        seedKey: "fma-wfm03-vectors-003",
        unitCode: "WFM03",
        topicSlug: "vectors",
        type: "CALCULATION",
        difficulty: "MEDIUM",
        marks: 3,
        status: "DRAFT",
        stem: r`Find the volume of the tetrahedron with vertices $O(0, 0, 0)$, $A(1, 0, 2)$, $B(2, 1, 0)$ and $C(0, 3, 1)$.`,
        markScheme: r`- **M1** $\mathbf{b} \times \mathbf{c} = (1, -2, 6)$ (1)
- **A1** $\mathbf{a} \cdot (\mathbf{b} \times \mathbf{c}) = 1 + 0 + 12 = 13$ (1)
- **A1** Volume $= \dfrac{1}{6} \times 13 = \dfrac{13}{6}$ (1)`,
        explanation: r`The triple scalar product gives the volume of the parallelepiped; a tetrahedron is $\tfrac{1}{6}$ of it. Take the modulus if the triple product comes out negative.`,
    },
    // --- further-matrix-algebra ---
    {
        seedKey: "fma-wfm03-further-matrix-algebra-001",
        unitCode: "WFM03",
        topicSlug: "further-matrix-algebra",
        type: "MCQ",
        difficulty: "EASY",
        marks: 1,
        status: "DRAFT",
        stem: r`Find the determinant of $\begin{pmatrix} 2 & 1 & 0 \\ 1 & 3 & 1 \\ 0 & 1 & 2 \end{pmatrix}$.`,
        options: opts("$8$", "$6$", "$10$", "$12$", "A"),
        markScheme: r`- **A** (1) — $2(6 - 1) - 1(2 - 0) + 0 = 8$.`,
        explanation: r`Expand along the first row with alternating signs $+, -, +$. Forgetting the minus sign on the middle term gives $10 + 2 = 12$.`,
    },
    {
        seedKey: "fma-wfm03-further-matrix-algebra-002",
        unitCode: "WFM03",
        topicSlug: "further-matrix-algebra",
        type: "CALCULATION",
        difficulty: "MEDIUM",
        marks: 5,
        status: "DRAFT",
        stem: r`$$\mathbf{A} = \begin{pmatrix} 2 & 1 & 0 \\ 1 & 3 & 1 \\ 0 & 1 & 2 \end{pmatrix}$$
Find $\mathbf{A}^{-1}$.`,
        markScheme: r`- **B1** $\det \mathbf{A} = 8$ (1)
- **M1** Finds the matrix of minors or cofactors (at least 4 correct entries) (1)
- **A1** Cofactor matrix $\begin{pmatrix} 5 & -2 & 1 \\ -2 & 4 & -2 \\ 1 & -2 & 5 \end{pmatrix}$ (1)
- **M1** Transposes and divides by the determinant (1)
- **A1** $\mathbf{A}^{-1} = \dfrac{1}{8}\begin{pmatrix} 5 & -2 & 1 \\ -2 & 4 & -2 \\ 1 & -2 & 5 \end{pmatrix}$ (1)`,
        explanation: r`Because $\mathbf{A}$ is symmetric its cofactor matrix is symmetric too, so the transpose step changes nothing here — but don't skip it in general. Check one entry of $\mathbf{A}\mathbf{A}^{-1}$.`,
    },
    {
        seedKey: "fma-wfm03-further-matrix-algebra-003",
        unitCode: "WFM03",
        topicSlug: "further-matrix-algebra",
        type: "CALCULATION",
        difficulty: "HARD",
        marks: 7,
        status: "DRAFT",
        stem: r`$$\mathbf{A} = \begin{pmatrix} 2 & 1 & 0 \\ 1 & 3 & 1 \\ 0 & 1 & 2 \end{pmatrix}$$

(a) Show that $4$ is an eigenvalue of $\mathbf{A}$ and find a corresponding eigenvector.

(b) Given that the other eigenvalues are $1$ and $2$, with eigenvectors $\begin{pmatrix} 1 \\ -1 \\ 1 \end{pmatrix}$ and $\begin{pmatrix} 1 \\ 0 \\ -1 \end{pmatrix}$ respectively, find an orthogonal matrix $\mathbf{P}$ and a diagonal matrix $\mathbf{D}$ such that $\mathbf{P}^{\mathrm{T}}\mathbf{A}\mathbf{P} = \mathbf{D}$.`,
        markScheme: r`- **M1** $\det(\mathbf{A} - 4\mathbf{I}) = -2(2 - 1) - 1(-2 - 0) = 0$, so $4$ is an eigenvalue (1)
- **M1** Solves $(\mathbf{A} - 4\mathbf{I})\mathbf{x} = \mathbf{0}$: $-2x + y = 0$, $x - y + z = 0$ (1)
- **A1** Eigenvector $\begin{pmatrix} 1 \\ 2 \\ 1 \end{pmatrix}$ (or any non-zero multiple) (1)
- **M1** Normalises each eigenvector (divides by its magnitude) (1)
- **A1** Unit vectors $\tfrac{1}{\sqrt{3}}(1, -1, 1)$, $\tfrac{1}{\sqrt{2}}(1, 0, -1)$, $\tfrac{1}{\sqrt{6}}(1, 2, 1)$ (1)
- **A1** $\mathbf{P} = \begin{pmatrix} \frac{1}{\sqrt{3}} & \frac{1}{\sqrt{2}} & \frac{1}{\sqrt{6}} \\ -\frac{1}{\sqrt{3}} & 0 & \frac{2}{\sqrt{6}} \\ \frac{1}{\sqrt{3}} & -\frac{1}{\sqrt{2}} & \frac{1}{\sqrt{6}} \end{pmatrix}$ (1)
- **A1** $\mathbf{D} = \begin{pmatrix} 1 & 0 & 0 \\ 0 & 2 & 0 \\ 0 & 0 & 4 \end{pmatrix}$, with columns of $\mathbf{P}$ and $\mathbf{D}$ in matching order (1)`,
        explanation: r`Eigenvectors of a symmetric matrix for distinct eigenvalues are orthogonal, so you only need to normalise them. The order of the columns of $\mathbf{P}$ must match the order of the eigenvalues in $\mathbf{D}$. Check: trace $= 7 = 1 + 2 + 4$ and $\det = 8 = 1 \times 2 \times 4$.`,
    },
];

// ---------------------------------------------------------------------------------------------------------------
// WME03 — Mechanics 3 (g = 9.8 m s^-2)
// ---------------------------------------------------------------------------------------------------------------
const wme03: SeedQuestion[] = [
    // --- further-kinematics ---
    {
        seedKey: "fma-wme03-further-kinematics-001",
        unitCode: "WME03",
        topicSlug: "further-kinematics",
        type: "MCQ",
        difficulty: "EASY",
        marks: 1,
        status: "DRAFT",
        stem: r`A particle moves in a straight line with acceleration $a = 6t\,\text{m s}^{-2}$ at time $t$ seconds. When $t = 0$ its velocity is $2\,\text{m s}^{-1}$. What is its velocity when $t = 2$?`,
        options: opts(r`$14\,\text{m s}^{-1}$`, r`$12\,\text{m s}^{-1}$`, r`$8\,\text{m s}^{-1}$`, r`$26\,\text{m s}^{-1}$`, "A"),
        markScheme: r`- **A** (1) — $v = 3t^2 + 2$, so $v(2) = 14$.`,
        explanation: r`Integrate acceleration with respect to time and use the initial velocity to fix the constant. Forgetting the constant gives $12$.`,
    },
    {
        seedKey: "fma-wme03-further-kinematics-002",
        unitCode: "WME03",
        topicSlug: "further-kinematics",
        type: "CALCULATION",
        difficulty: "MEDIUM",
        marks: 4,
        status: "DRAFT",
        stem: r`A particle $P$ moves along the positive $x$-axis. When its displacement from $O$ is $x$ metres, its acceleration is $(2x + 3)\,\text{m s}^{-2}$ in the direction of increasing $x$. When $x = 0$, $P$ has speed $2\,\text{m s}^{-1}$.

Find the speed of $P$ when $x = 3$.`,
        markScheme: r`- **M1** Uses $a = v\dfrac{dv}{dx}$: $\displaystyle\int v\,dv = \int (2x + 3)\,dx$ (1)
- **A1** $\tfrac{1}{2}v^2 = x^2 + 3x + c$ (1)
- **M1** Uses $v = 2$ at $x = 0$: $c = 2$, so $v^2 = 2x^2 + 6x + 4$ (1)
- **A1** $v^2 = 40$, $v = 2\sqrt{10} \approx 6.32\,\text{m s}^{-1}$ (1)`,
        explanation: r`When acceleration is given as a function of displacement, use $a = v\tfrac{dv}{dx}$ (or $\tfrac{d}{dx}\left(\tfrac{1}{2}v^2\right)$), not $\tfrac{dv}{dt}$.`,
    },
    {
        seedKey: "fma-wme03-further-kinematics-003",
        unitCode: "WME03",
        topicSlug: "further-kinematics",
        type: "CALCULATION",
        difficulty: "HARD",
        marks: 5,
        status: "DRAFT",
        stem: r`A particle of mass $2\,\text{kg}$ moves along a smooth horizontal surface. The only horizontal force on it is a resistance of magnitude $4v\,\text{N}$, where $v\,\text{m s}^{-1}$ is its speed. Initially its speed is $10\,\text{m s}^{-1}$.

(a) Find the time taken for its speed to fall to $5\,\text{m s}^{-1}$.

(b) Find the distance travelled in that time.`,
        markScheme: r`- **M1** $2\dfrac{dv}{dt} = -4v$, separates: $\displaystyle\int \frac{dv}{v} = \int -2\,dt$ (1)
- **A1** $\ln v = -2t + \ln 10$, i.e. $v = 10e^{-2t}$ (1)
- **A1** $5 = 10e^{-2t} \Rightarrow t = \tfrac{1}{2}\ln 2 \approx 0.347\,\text{s}$ (1)
- **M1** $2v\dfrac{dv}{dx} = -4v \Rightarrow \dfrac{dv}{dx} = -2$, so $v = 10 - 2x$ (1)
- **A1** $5 = 10 - 2x \Rightarrow x = 2.5\,\text{m}$ (1)`,
        explanation: r`For distance, $a = v\tfrac{dv}{dx}$ is quicker than integrating $v = 10e^{-2t}$ with respect to $t$ — though both give $2.5\,\text{m}$. Remember the resistance acts against the motion, so the sign is negative.`,
    },
    // --- elastic-strings-springs ---
    {
        seedKey: "fma-wme03-elastic-strings-springs-001",
        unitCode: "WME03",
        topicSlug: "elastic-strings-springs",
        type: "MCQ",
        difficulty: "EASY",
        marks: 1,
        status: "DRAFT",
        stem: r`A light elastic string has natural length $0.5\,\text{m}$ and modulus of elasticity $20\,\text{N}$. How much elastic potential energy is stored when it is stretched by $0.1\,\text{m}$?`,
        options: opts(r`$0.1\,\text{J}$`, r`$0.2\,\text{J}$`, r`$0.4\,\text{J}$`, r`$4\,\text{J}$`, "B"),
        markScheme: r`- **B** (1) — $\text{EPE} = \dfrac{\lambda x^2}{2l} = \dfrac{20 \times 0.1^2}{2 \times 0.5} = 0.2\,\text{J}$.`,
        explanation: r`Option C misses the $\tfrac{1}{2}$, and $4$ is the **tension** $\tfrac{\lambda x}{l}$, not an energy.`,
    },
    {
        seedKey: "fma-wme03-elastic-strings-springs-002",
        unitCode: "WME03",
        topicSlug: "elastic-strings-springs",
        type: "CALCULATION",
        difficulty: "HARD",
        marks: 6,
        status: "DRAFT",
        stem: r`A particle $P$ of mass $0.4\,\text{kg}$ is attached to one end of a light elastic string of natural length $1\,\text{m}$ and modulus of elasticity $19.6\,\text{N}$. The other end is attached to a fixed point $O$. $P$ is held at $O$ and released from rest, and falls vertically.

Find the greatest extension of the string in the subsequent motion.`,
        markScheme: r`- **M1** Energy method from release to lowest point, with $P$ at rest at both positions (1)
- **B1** Loss of GPE $= 0.4 \times 9.8 \times (1 + x)$ (1)
- **B1** Gain in EPE $= \dfrac{19.6x^2}{2 \times 1} = 9.8x^2$ (1)
- **A1** $3.92(1 + x) = 9.8x^2$, i.e. $5x^2 - 2x - 2 = 0$ (1)
- **M1** Solves the quadratic, taking the positive root (1)
- **A1** $x = \dfrac{1 + \sqrt{11}}{5} \approx 0.863\,\text{m}$ (1)`,
        explanation: r`The particle falls the natural length $1\,\text{m}$ **before** the string becomes taut, so the GPE lost is over $(1 + x)$, not just $x$ — the most common error here.`,
    },
    // --- further-dynamics ---
    {
        seedKey: "fma-wme03-further-dynamics-001",
        unitCode: "WME03",
        topicSlug: "further-dynamics",
        type: "MCQ",
        difficulty: "EASY",
        marks: 1,
        status: "DRAFT",
        stem: r`A particle moves with simple harmonic motion of amplitude $0.5\,\text{m}$ and period $\pi\,\text{s}$. What is its maximum speed?`,
        options: opts(r`$0.25\,\text{m s}^{-1}$`, r`$0.5\,\text{m s}^{-1}$`, r`$1\,\text{m s}^{-1}$`, r`$2\,\text{m s}^{-1}$`, "C"),
        markScheme: r`- **C** (1) — $\omega = \dfrac{2\pi}{T} = 2$, so $v_{\max} = a\omega = 0.5 \times 2 = 1\,\text{m s}^{-1}$.`,
        explanation: r`Find $\omega$ from the period first: $T = \tfrac{2\pi}{\omega}$. Maximum speed occurs at the centre of the oscillation.`,
    },
    {
        seedKey: "fma-wme03-further-dynamics-002",
        unitCode: "WME03",
        topicSlug: "further-dynamics",
        type: "CALCULATION",
        difficulty: "MEDIUM",
        marks: 6,
        status: "DRAFT",
        stem: r`A particle $P$ moves with simple harmonic motion about a centre $O$. The amplitude is $3\,\text{m}$ and the maximum speed of $P$ is $6\,\text{m s}^{-1}$.

(a) Find the speed of $P$ when it is $2\,\text{m}$ from $O$.

(b) Find the time taken for $P$ to move directly from $O$ to a point $1.5\,\text{m}$ from $O$.`,
        markScheme: r`- **M1** $a\omega = 6$ with $a = 3$ (1)
- **A1** $\omega = 2$ (1)
- **M1** $v^2 = \omega^2(a^2 - x^2) = 4(9 - 4)$ (1)
- **A1** $v = 2\sqrt{5} \approx 4.47\,\text{m s}^{-1}$ (1)
- **M1** Uses $x = 3\sin 2t$ (starting at $O$) with $x = 1.5$ (1)
- **A1** $\sin 2t = \tfrac{1}{2} \Rightarrow t = \dfrac{\pi}{12} \approx 0.262\,\text{s}$ (1)`,
        explanation: r`Choose $x = a\sin\omega t$ when timing from the centre and $x = a\cos\omega t$ when timing from an end point. Your calculator must be in radians.`,
    },
    {
        seedKey: "fma-wme03-further-dynamics-003",
        unitCode: "WME03",
        topicSlug: "further-dynamics",
        type: "SHORT",
        difficulty: "HARD",
        marks: 5,
        status: "DRAFT",
        stem: r`The Earth is modelled as a fixed sphere of radius $R$. At a distance $x \geq R$ from the centre of the Earth, the gravitational force on a particle of mass $m$ has magnitude $\dfrac{mgR^2}{x^2}$.

A particle is projected vertically upwards from the surface with speed $u$ and comes to instantaneous rest at a height $R$ above the surface. Ignoring air resistance, show that $u^2 = gR$.`,
        markScheme: r`- **B1** Equation of motion: $mv\dfrac{dv}{dx} = -\dfrac{mgR^2}{x^2}$ (1)
- **M1** Separates and integrates: $\tfrac{1}{2}v^2 = \dfrac{gR^2}{x} + c$ (1)
- **A1** $v = u$ at $x = R$ gives $c = \tfrac{1}{2}u^2 - gR$ (1)
- **M1** Sets $v = 0$ at $x = 2R$: $0 = \dfrac{gR}{2} + \tfrac{1}{2}u^2 - gR$ (1)
- **A1** $u^2 = gR$ convincingly shown (1)`,
        explanation: r`$x$ is measured from the **centre** of the Earth, so a height $R$ above the surface means $x = 2R$. Using $x = R$ for the top point is the classic error.`,
    },
    // --- circular-motion ---
    {
        seedKey: "fma-wme03-circular-motion-001",
        unitCode: "WME03",
        topicSlug: "circular-motion",
        type: "MCQ",
        difficulty: "EASY",
        marks: 1,
        status: "DRAFT",
        stem: r`A particle moves in a horizontal circle of radius $0.5\,\text{m}$ with constant angular speed $4\,\text{rad s}^{-1}$. What is the magnitude of its acceleration?`,
        options: opts(r`$2\,\text{m s}^{-2}$`, r`$4\,\text{m s}^{-2}$`, r`$8\,\text{m s}^{-2}$`, r`$32\,\text{m s}^{-2}$`, "C"),
        markScheme: r`- **C** (1) — $a = r\omega^2 = 0.5 \times 16 = 8\,\text{m s}^{-2}$, towards the centre.`,
        explanation: r`Even at constant speed a particle moving in a circle accelerates towards the centre. Option A is $r\omega$ (the speed), and D uses $\omega^2 / r$.`,
    },
    {
        seedKey: "fma-wme03-circular-motion-002",
        unitCode: "WME03",
        topicSlug: "circular-motion",
        type: "CALCULATION",
        difficulty: "MEDIUM",
        marks: 5,
        status: "DRAFT",
        stem: r`A particle of mass $0.3\,\text{kg}$ is attached to one end of a light inextensible string of length $1.2\,\text{m}$. The other end is fixed. The particle moves in a horizontal circle with the string making a constant angle of $30^\circ$ with the vertical.

Find (a) the tension in the string and (b) the angular speed of the particle.`,
        markScheme: r`- **M1** Resolves vertically: $T\cos 30^\circ = 0.3 \times 9.8$ (1)
- **A1** $T = 3.39\,\text{N}$ (3 s.f.) (1)
- **B1** Radius $r = 1.2\sin 30^\circ = 0.6\,\text{m}$ (1)
- **M1** Horizontally: $T\sin 30^\circ = 0.3 \times 0.6\,\omega^2$ (1)
- **A1** $\omega = 3.07\,\text{rad s}^{-1}$ (3 s.f.) (1)`,
        explanation: r`The radius of the circle is $l\sin\theta$, not the string length. Combining the two equations gives the neat result $\omega^2 = \tfrac{g}{l\cos\theta}$ — independent of the mass.`,
    },
    {
        seedKey: "fma-wme03-circular-motion-003",
        unitCode: "WME03",
        topicSlug: "circular-motion",
        type: "CALCULATION",
        difficulty: "HARD",
        marks: 6,
        status: "DRAFT",
        stem: r`A particle of mass $0.5\,\text{kg}$ is attached to one end of a light inextensible string of length $0.8\,\text{m}$, the other end of which is attached to a fixed point $O$. The particle is at its lowest point, moving horizontally with speed $7\,\text{m s}^{-1}$, and then moves in a vertical circle about $O$.

(a) Find the tension in the string when the string is horizontal.

(b) Find the tension in the string when the particle is at the top of the circle, and hence explain why the particle completes the circle.`,
        markScheme: r`- **M1** Energy: $v^2 = 49 - 2 \times 9.8 \times 0.8 = 33.32$ when the string is horizontal (1)
- **A1** $T = \dfrac{0.5 \times 33.32}{0.8} = 20.8\,\text{N}$ (3 s.f.) (1)
- **M1** Energy to the top: $v^2 = 49 - 2 \times 9.8 \times 1.6 = 17.64$ (1)
- **M1** At the top: $T + 0.5 \times 9.8 = \dfrac{0.5 \times 17.64}{0.8}$ (1)
- **A1** $T = 6.125\,\text{N}$ (accept $6.13\,\text{N}$) (1)
- **B1** $T > 0$ at the top (the point of minimum tension), so the string stays taut and the circle is completed (1)`,
        explanation: r`When the string is horizontal, weight is perpendicular to the string so it does not appear in the radial equation. At the top, weight and tension both point towards the centre.`,
    },
    // --- statics-rigid-bodies ---
    {
        seedKey: "fma-wme03-statics-rigid-bodies-001",
        unitCode: "WME03",
        topicSlug: "statics-rigid-bodies",
        type: "MCQ",
        difficulty: "EASY",
        marks: 1,
        status: "DRAFT",
        stem: r`How far is the centre of mass of a uniform **solid** hemisphere of radius $r$ from its plane face?`,
        options: opts(r`$\dfrac{r}{2}$`, r`$\dfrac{3r}{4}$`, r`$\dfrac{4r}{3\pi}$`, r`$\dfrac{3r}{8}$`, "D"),
        markScheme: r`- **D** (1) — standard result for a uniform solid hemisphere: $\tfrac{3}{8}r$ from the centre of the plane face.`,
        explanation: r`Don't confuse with a **hollow** hemispherical shell ($\tfrac{r}{2}$) or a semicircular lamina ($\tfrac{4r}{3\pi}$).`,
    },
    {
        seedKey: "fma-wme03-statics-rigid-bodies-002",
        unitCode: "WME03",
        topicSlug: "statics-rigid-bodies",
        type: "CALCULATION",
        difficulty: "MEDIUM",
        marks: 6,
        status: "DRAFT",
        stem: r`A uniform lamina occupies the region bounded by the curve $y = x^2$, the $x$-axis and the line $x = 2$.

Find the coordinates of the centre of mass of the lamina.`,
        markScheme: r`- **B1** Area $= \displaystyle\int_0^2 x^2\,dx = \dfrac{8}{3}$ (1)
- **M1** $\bar{x} = \dfrac{\int_0^2 x \cdot x^2\,dx}{\text{area}}$ (1)
- **A1** $\bar{x} = \dfrac{4}{8/3} = \dfrac{3}{2}$ (1)
- **M1** $\bar{y} = \dfrac{\int_0^2 \tfrac{1}{2}y^2\,dx}{\text{area}} = \dfrac{\tfrac{1}{2}\int_0^2 x^4\,dx}{8/3}$ (1)
- **A1** $\tfrac{1}{2}\displaystyle\int_0^2 x^4\,dx = \dfrac{16}{5}$ (1)
- **A1** $\bar{y} = \dfrac{6}{5}$, so the centre of mass is $\left(\tfrac{3}{2}, \tfrac{6}{5}\right)$ (1)`,
        explanation: r`For a vertical strip, its own centre of mass is at height $\tfrac{y}{2}$, which is where the $\tfrac{1}{2}y^2$ comes from. Forgetting the $\tfrac{1}{2}$ doubles $\bar{y}$.`,
    },
    {
        seedKey: "fma-wme03-statics-rigid-bodies-003",
        unitCode: "WME03",
        topicSlug: "statics-rigid-bodies",
        type: "CALCULATION",
        difficulty: "MEDIUM",
        marks: 4,
        status: "DRAFT",
        stem: r`A uniform solid right circular cone has base radius $3\,\text{cm}$ and height $8\,\text{cm}$. It rests with its base on a rough plane. The plane is slowly tilted, and the cone does not slip.

(a) Find, to the nearest degree, the angle of the plane to the horizontal at which the cone is about to topple.

(b) State a condition on the coefficient of friction $\mu$ for the cone to topple before it slides.`,
        markScheme: r`- **B1** Centre of mass is $\tfrac{8}{4} = 2\,\text{cm}$ above the base along the axis (1)
- **M1** Topples when the centre of mass is vertically above the lowest point of the base: $\tan\alpha = \dfrac{3}{2}$ (1)
- **A1** $\alpha = 56^\circ$ (1)
- **B1** Slides when $\tan\alpha = \mu$, so it topples first if $\mu > 1.5$ (1)`,
        explanation: r`The centre of mass of a solid cone is a quarter of the height above the base (three-quarters from the vertex). Sliding happens when $\tan\alpha$ reaches $\mu$, so compare $\mu$ with the toppling value of $\tan\alpha$.`,
    },
];

// ---------------------------------------------------------------------------------------------------------------
// WST03 — Statistics 3
// ---------------------------------------------------------------------------------------------------------------
const wst03: SeedQuestion[] = [
    // --- combinations-of-random-variables ---
    {
        seedKey: "fma-wst03-combinations-of-random-variables-001",
        unitCode: "WST03",
        topicSlug: "combinations-of-random-variables",
        type: "MCQ",
        difficulty: "EASY",
        marks: 1,
        status: "DRAFT",
        stem: r`$X \sim \mathrm{N}(10, 4)$ and $Y \sim \mathrm{N}(6, 9)$ are independent. Find $\operatorname{Var}(2X - Y)$.`,
        options: opts("$7$", "$13$", "$17$", "$25$", "D"),
        markScheme: r`- **D** (1) — $\operatorname{Var}(2X - Y) = 2^2 \times 4 + 9 = 25$.`,
        explanation: r`Variances of independent variables always **add**, even for a difference, and constants are squared. $7$ subtracts the variances; $17$ forgets to square the $2$.`,
    },
    {
        seedKey: "fma-wst03-combinations-of-random-variables-002",
        unitCode: "WST03",
        topicSlug: "combinations-of-random-variables",
        type: "CALCULATION",
        difficulty: "MEDIUM",
        marks: 6,
        status: "DRAFT",
        stem: r`The mass of an apple, $A$ grams, is modelled as $A \sim \mathrm{N}(150, 10^2)$ and the mass of an orange, $B$ grams, as $B \sim \mathrm{N}(80, 6^2)$. All masses are independent.

(a) Find the probability that the total mass of 6 randomly chosen apples exceeds $930\,\text{g}$.

(b) Find the probability that the total mass of 2 randomly chosen oranges is greater than the mass of 1 randomly chosen apple.`,
        markScheme: r`- **M1** $T = A_1 + \dots + A_6 \sim \mathrm{N}(900, 600)$ (1)
- **M1** Standardises: $z = \dfrac{930 - 900}{\sqrt{600}} = 1.22$ (1)
- **A1** $P(T > 930) = 0.110$ (awrt $0.11$) (1)
- **M1** $D = B_1 + B_2 - A$ with mean $160 - 150 = 10$ (1)
- **A1** $\operatorname{Var}(D) = 36 + 36 + 100 = 172$ (1)
- **A1** $P(D > 0) = P\left(Z > -\dfrac{10}{\sqrt{172}}\right) = P(Z < 0.762) = 0.777$ (awrt $0.777$) (1)`,
        explanation: r`Two oranges is $B_1 + B_2$ (variance $2 \times 36$), not $2B$ (variance $4 \times 36$). Read carefully whether the question means separate items or one item doubled.`,
    },
    // --- sampling ---
    {
        seedKey: "fma-wst03-sampling-001",
        unitCode: "WST03",
        topicSlug: "sampling",
        type: "MCQ",
        difficulty: "EASY",
        marks: 1,
        status: "DRAFT",
        stem: r`Which of these sampling methods is **not** a random sampling method?`,
        options: opts("simple random sampling", "systematic sampling", "stratified sampling", "quota sampling", "D"),
        markScheme: r`- **D** (1) — in quota sampling the interviewer chooses who fills each quota, so selection is not random.`,
        explanation: r`Quota sampling fixes the numbers in each group like stratified sampling, but the individuals are chosen by the interviewer, which can introduce bias.`,
    },
    {
        seedKey: "fma-wst03-sampling-002",
        unitCode: "WST03",
        topicSlug: "sampling",
        type: "SHORT",
        difficulty: "MEDIUM",
        marks: 4,
        status: "DRAFT",
        stem: r`A college has 360 students in Year 12 and 240 students in Year 13. The principal wants a sample of 50 students to complete a survey.

(a) Explain how a stratified sample of size 50 could be taken.

(b) Give one advantage of stratified sampling over simple random sampling in this situation.`,
        markScheme: r`- **M1** Sample in proportion to the size of each year group (1)
- **A1** $\tfrac{360}{600} \times 50 = 30$ from Year 12 and $\tfrac{240}{600} \times 50 = 20$ from Year 13 (1)
- **B1** Number the students in each year group (separate lists) and use random numbers to select within each group (1)
- **B1** Advantage: both year groups are guaranteed to be represented in proportion, so the sample better reflects the population (1)`,
        explanation: r`Stratified sampling is random **within** each stratum. Say exactly how the individuals are selected (numbered list plus random numbers) — "pick 30 Year 12 students" alone does not earn the method mark.`,
    },
    // --- estimation-confidence-intervals ---
    {
        seedKey: "fma-wst03-estimation-confidence-intervals-001",
        unitCode: "WST03",
        topicSlug: "estimation-confidence-intervals",
        type: "MCQ",
        difficulty: "EASY",
        marks: 1,
        status: "DRAFT",
        stem: r`A random sample of size 36 from a population with standard deviation $6$ has mean $52.4$. Which is a 95% confidence interval for the population mean?`,
        options: opts(
            r`$(50.44,\ 54.36)$`,
            r`$(40.64,\ 64.16)$`,
            r`$(50.76,\ 54.04)$`,
            r`$(52.07,\ 52.73)$`,
            "A",
        ),
        markScheme: r`- **A** (1) — $52.4 \pm 1.96 \times \dfrac{6}{\sqrt{36}} = 52.4 \pm 1.96$.`,
        explanation: r`The interval uses the **standard error** $\tfrac{\sigma}{\sqrt{n}}$, not $\sigma$ (option B). Option C uses $z = 1.6449$ (a 90% interval).`,
    },
    {
        seedKey: "fma-wst03-estimation-confidence-intervals-002",
        unitCode: "WST03",
        topicSlug: "estimation-confidence-intervals",
        type: "CALCULATION",
        difficulty: "MEDIUM",
        marks: 5,
        status: "DRAFT",
        stem: r`The times, $x$ minutes, taken by a random sample of 40 students to finish a puzzle are summarised by
$$\sum x = 1720, \qquad \sum x^2 = 74\,840$$

(a) Find unbiased estimates of the mean and variance of the times.

(b) Find an approximate 95% confidence interval for the mean time, giving the limits to 2 decimal places.`,
        markScheme: r`- **B1** $\bar{x} = 43$ (1)
- **M1** $s^2 = \dfrac{74\,840 - 40 \times 43^2}{39}$ (1)
- **A1** $s^2 = \dfrac{880}{39} = 22.6$ (3 s.f.) (1)
- **M1** $43 \pm 1.96 \times \sqrt{\dfrac{22.56\ldots}{40}}$ (1)
- **A1** $(41.53,\ 44.47)$ (1)`,
        explanation: r`The unbiased variance estimate divides by $n - 1$. The sample is large, so the Central Limit Theorem justifies a Normal-based interval even though the distribution of times is unknown.`,
    },
    {
        seedKey: "fma-wst03-estimation-confidence-intervals-003",
        unitCode: "WST03",
        topicSlug: "estimation-confidence-intervals",
        type: "CALCULATION",
        difficulty: "HARD",
        marks: 6,
        status: "DRAFT",
        stem: r`A random sample of 50 batteries of brand A had mean lifetime $23.1$ hours and unbiased variance estimate $16$. A random sample of 60 batteries of brand B had mean lifetime $21.6$ hours and unbiased variance estimate $25$.

Test, at the 5% level of significance, whether brand A batteries last longer on average than brand B batteries. State your hypotheses clearly.`,
        markScheme: r`- **B1** $H_0: \mu_A = \mu_B$, $H_1: \mu_A > \mu_B$ (1)
- **M1** Standard error $\sqrt{\dfrac{16}{50} + \dfrac{25}{60}}$ (1)
- **M1** $z = \dfrac{23.1 - 21.6}{\sqrt{0.7367}}$ (1)
- **A1** $z = 1.75$ (awrt) (1)
- **B1** Critical value $1.6449$ (or $p = 0.040 < 0.05$) (1)
- **A1** Reject $H_0$: there is evidence that brand A batteries last longer on average (1)`,
        explanation: r`For large samples, the CLT means the difference of sample means is approximately Normal and the sample variances can be used for the population variances. Always finish with a conclusion in context.`,
    },
    // --- goodness-of-fit ---
    {
        seedKey: "fma-wst03-goodness-of-fit-001",
        unitCode: "WST03",
        topicSlug: "goodness-of-fit",
        type: "MCQ",
        difficulty: "EASY",
        marks: 1,
        status: "DRAFT",
        stem: r`A $\chi^2$ test of independence is carried out on a contingency table with 4 rows and 3 columns, and no cells are combined. How many degrees of freedom does the test have?`,
        options: opts("$5$", "$12$", "$11$", "$6$", "D"),
        markScheme: r`- **D** (1) — $\nu = (4 - 1)(3 - 1) = 6$.`,
        explanation: r`For an $h \times k$ contingency table, $\nu = (h - 1)(k - 1)$. Using the number of cells minus 1 gives $11$.`,
    },
    {
        seedKey: "fma-wst03-goodness-of-fit-002",
        unitCode: "WST03",
        topicSlug: "goodness-of-fit",
        type: "CALCULATION",
        difficulty: "MEDIUM",
        marks: 5,
        status: "DRAFT",
        stem: r`A six-sided die is rolled 120 times with these results:

| Score | 1 | 2 | 3 | 4 | 5 | 6 |
|---|---|---|---|---|---|---|
| Frequency | 15 | 22 | 18 | 26 | 17 | 22 |

Test, at the 5% level of significance, whether the die is fair.`,
        markScheme: r`- **B1** $H_0$: the die is fair (scores uniformly distributed); $H_1$: the die is not fair (1)
- **B1** Expected frequency 20 for each score (1)
- **M1** $\chi^2 = \sum \dfrac{(O - E)^2}{E} = \dfrac{25 + 4 + 4 + 36 + 9 + 4}{20}$ (1)
- **A1** $\chi^2 = 4.1$ (1)
- **A1** $\nu = 5$, critical value $11.070$; $4.1 < 11.070$ so do not reject $H_0$ — no evidence the die is unfair (1)`,
        explanation: r`Degrees of freedom $= $ number of classes $- 1$ when no parameters are estimated. All expected frequencies are at least 5, so no classes need combining.`,
    },
    {
        seedKey: "fma-wst03-goodness-of-fit-003",
        unitCode: "WST03",
        topicSlug: "goodness-of-fit",
        type: "CALCULATION",
        difficulty: "HARD",
        marks: 6,
        status: "DRAFT",
        stem: r`150 students were asked which of three clubs, A, B or C, they preferred. The results, split by the stream each student studies, were:

| | A | B | C |
|---|---|---|---|
| Science | 30 | 20 | 10 |
| Arts | 20 | 30 | 40 |

Test, at the 5% level of significance, whether club preference is independent of stream.`,
        markScheme: r`- **B1** $H_0$: club preference and stream are independent; $H_1$: they are not independent (1)
- **M1** Expected frequency $= \dfrac{\text{row total} \times \text{column total}}{150}$ (1)
- **A1** Expected frequencies $20, 20, 20$ (Science) and $30, 30, 30$ (Arts) (1)
- **A1** $\chi^2 = 5 + 0 + 5 + 3.33 + 0 + 3.33 = 16.7$ (3 s.f.) (1)
- **B1** $\nu = (2 - 1)(3 - 1) = 2$, critical value $5.991$ (1)
- **A1** $16.7 > 5.991$, so reject $H_0$: there is evidence that club preference depends on stream (1)`,
        explanation: r`Each expected frequency comes from the row and column totals ($60$, $90$ and $50, 50, 50$). Compare with the upper-tail critical value — $\chi^2$ tests are always one-tailed.`,
    },
    // --- regression-correlation ---
    {
        seedKey: "fma-wst03-regression-correlation-001",
        unitCode: "WST03",
        topicSlug: "regression-correlation",
        type: "MCQ",
        difficulty: "EASY",
        marks: 1,
        status: "DRAFT",
        stem: r`Two judges rank 6 entries. The sum of the squared differences in ranks is $\sum d^2 = 10$. Find Spearman's rank correlation coefficient.`,
        options: opts("$0.286$", "$0.714$", "$0.943$", "$-0.714$", "B"),
        markScheme: r`- **B** (1) — $r_s = 1 - \dfrac{6 \times 10}{6(36 - 1)} = 1 - \dfrac{60}{210} = 0.714$.`,
        explanation: r`$r_s = 1 - \dfrac{6\sum d^2}{n(n^2 - 1)}$. Option A forgets to subtract from 1; the sign of $r_s$ is set by the formula, not chosen.`,
    },
    {
        seedKey: "fma-wst03-regression-correlation-002",
        unitCode: "WST03",
        topicSlug: "regression-correlation",
        type: "CALCULATION",
        difficulty: "MEDIUM",
        marks: 6,
        status: "DRAFT",
        stem: r`Two judges, P and Q, rank 8 contestants in a debating competition:

| Contestant | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |
|---|---|---|---|---|---|---|---|---|
| Judge P | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |
| Judge Q | 3 | 1 | 4 | 2 | 7 | 5 | 8 | 6 |

(a) Calculate Spearman's rank correlation coefficient between the two judges' rankings.

(b) Test, at the 5% level of significance, whether there is positive agreement between the judges. The critical value for a one-tailed test with $n = 8$ at the 5% level is $0.6429$.`,
        markScheme: r`- **M1** Finds differences $d$ and $d^2$: $4, 1, 1, 4, 4, 1, 1, 4$ (1)
- **A1** $\sum d^2 = 20$ (1)
- **M1** $r_s = 1 - \dfrac{6 \times 20}{8 \times 63}$ (1)
- **A1** $r_s = 0.762$ (3 s.f.) (1)
- **B1** $H_0: \rho = 0$, $H_1: \rho > 0$ (1)
- **A1** $0.762 > 0.6429$, so reject $H_0$: there is evidence of positive agreement between the judges (1)`,
        explanation: r`Spearman's coefficient is the right tool for ranked data. Write hypotheses in terms of $\rho$ (the population coefficient), not $r_s$.`,
    },
];

export const furtherMathematicsQuestions: SeedQuestion[] = [...wfm01, ...wfm02, ...wfm03, ...wme03, ...wst03];
