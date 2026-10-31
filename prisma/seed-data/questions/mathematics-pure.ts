import type { SeedQuestion } from "../types";

// Original IAL-style Pure Mathematics practice questions for WMA11–WMA14 (written for this app, not taken from
// Pearson papers). Every question is a DRAFT until an admin reviews and publishes it.
// Angles are in degrees unless the question says radians; numerical answers are given to 3 s.f. unless stated.

// String.raw keeps LaTeX backslashes intact (e.g. \frac, \sqrt) inside template literals.
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
// WMA11 — Pure Mathematics 1
// ---------------------------------------------------------------------------------------------------------------
const wma11: SeedQuestion[] = [
    // --- algebra-functions ---
    {
        seedKey: "mat-wma11-algebra-functions-001",
        unitCode: "WMA11",
        topicSlug: "algebra-functions",
        type: "MCQ",
        difficulty: "EASY",
        marks: 1,
        stem: r`Which of the following is $\dfrac{6}{3 - \sqrt{5}}$ written with a rational denominator?`,
        options: opts(
            r`$\dfrac{9 - 3\sqrt{5}}{2}$`,
            r`$\dfrac{3(3 + \sqrt{5})}{7}$`,
            r`$\dfrac{9 + 3\sqrt{5}}{2}$`,
            r`$-\dfrac{9 + 3\sqrt{5}}{2}$`,
            "C",
        ),
        markScheme: r`- **C** (1) — multiply top and bottom by $3 + \sqrt{5}$: $\dfrac{6(3 + \sqrt{5})}{9 - 5} = \dfrac{9 + 3\sqrt{5}}{2}$.`,
        explanation: r`Multiply by the conjugate $3 + \sqrt{5}$, so the denominator becomes $3^2 - (\sqrt{5})^2 = 4$. Common slips: using $3 - \sqrt{5}$ again (A), adding the squares to get 14 (B), or working out $5 - 9$ instead of $9 - 5$ (D).`,
        status: "DRAFT",
    },
    {
        seedKey: "mat-wma11-algebra-functions-002",
        unitCode: "WMA11",
        topicSlug: "algebra-functions",
        type: "CALCULATION",
        difficulty: "MEDIUM",
        marks: 5,
        stem: r`The equation $x^2 + kx + (k + 3) = 0$, where $k$ is a constant, has no real roots.

Find the set of possible values of $k$.`,
        markScheme: r`- **M1** Uses $b^2 - 4ac < 0$ with $a = 1$, $b = k$, $c = k + 3$ (1)
- **A1** $k^2 - 4k - 12 < 0$ (1)
- **M1** Solves $k^2 - 4k - 12 = 0$ to find critical values, $(k - 6)(k + 2) = 0$ (1)
- **M1** Chooses the inside region between their critical values (1)
- **A1** $-2 < k < 6$ (1)`,
        explanation: r`"No real roots" means the discriminant is **negative**. The quadratic $k^2 - 4k - 12$ is a ∪-shaped parabola, so it is negative *between* its roots $-2$ and $6$.`,
        status: "DRAFT",
    },
    {
        seedKey: "mat-wma11-algebra-functions-003",
        unitCode: "WMA11",
        topicSlug: "algebra-functions",
        type: "CALCULATION",
        difficulty: "HARD",
        marks: 6,
        stem: r`Solve the simultaneous equations

$$x + 2y = 5$$
$$x^2 + 2y^2 = 11$$`,
        markScheme: r`- **M1** Rearranges the linear equation, e.g. $x = 5 - 2y$, and substitutes into the quadratic (1)
- **A1** Correct three-term quadratic, e.g. $6y^2 - 20y + 14 = 0$ or $3y^2 - 10y + 7 = 0$ (1)
- **M1** Solves their quadratic, e.g. $(3y - 7)(y - 1) = 0$ (1)
- **A1** $y = 1$ and $y = \tfrac{7}{3}$ (1)
- **M1** Substitutes their $y$ values back into the linear equation to find $x$ (1)
- **A1** $x = 3, y = 1$ and $x = \tfrac{1}{3}, y = \tfrac{7}{3}$ (1)`,
        explanation: r`Always substitute the **linear** equation into the quadratic one. Expanding $(5 - 2y)^2 = 25 - 20y + 4y^2$ is where most errors happen — check the middle term.`,
        status: "DRAFT",
    },

    // --- coordinate-geometry ---
    {
        seedKey: "mat-wma11-coordinate-geometry-001",
        unitCode: "WMA11",
        topicSlug: "coordinate-geometry",
        type: "MCQ",
        difficulty: "EASY",
        marks: 1,
        stem: r`The line $l$ passes through $(2, -1)$ and is perpendicular to the line $3x - 4y + 7 = 0$. Which is an equation of $l$?`,
        options: opts(r`$3x - 4y - 10 = 0$`, r`$4x - 3y - 11 = 0$`, r`$3x + 4y - 2 = 0$`, r`$4x + 3y - 5 = 0$`, "D"),
        markScheme: r`- **D** (1) — gradient of $3x - 4y + 7 = 0$ is $\tfrac{3}{4}$, so $l$ has gradient $-\tfrac{4}{3}$: $y + 1 = -\tfrac{4}{3}(x - 2)$.`,
        explanation: r`Rearrange to $y = \tfrac{3}{4}x + \tfrac{7}{4}$ first. A is the parallel line, B forgets the negative sign, and C only changes the sign without taking the reciprocal.`,
        status: "DRAFT",
    },
    {
        seedKey: "mat-wma11-coordinate-geometry-002",
        unitCode: "WMA11",
        topicSlug: "coordinate-geometry",
        type: "CALCULATION",
        difficulty: "MEDIUM",
        marks: 7,
        stem: r`The points $A$ and $B$ have coordinates $(-1, 4)$ and $(5, 2)$ respectively.

(a) Find an equation of the perpendicular bisector of $AB$, giving your answer in the form $ax + by + c = 0$, where $a$, $b$ and $c$ are integers.

The perpendicular bisector of $AB$ meets the $x$-axis at the point $C$.

(b) Find the area of triangle $ABC$.`,
        markScheme: r`- **M1** Midpoint of $AB$ is $(2, 3)$ (1)
- **B1** Gradient of $AB = \dfrac{2 - 4}{5 - (-1)} = -\tfrac{1}{3}$ (1)
- **M1** Uses perpendicular gradient $3$ with their midpoint to form a line, $y - 3 = 3(x - 2)$ (1)
- **A1** $3x - y - 3 = 0$ (or any integer multiple) (1)
- **B1** $C$ is $(1, 0)$ (1)
- **M1** Correct method for area, e.g. $\tfrac{1}{2} \times AB \times CM$ with $M(2, 3)$, or the shoelace formula (1)
- **A1** Area $= \tfrac{1}{2} \times \sqrt{40} \times \sqrt{10} = 10$ (1)`,
        explanation: r`Because $C$ lies on the perpendicular bisector, $CM$ is the perpendicular height of the triangle from base $AB$. $\sqrt{40} \times \sqrt{10} = \sqrt{400} = 20$.`,
        status: "DRAFT",
    },

    // --- trigonometry ---
    {
        seedKey: "mat-wma11-trigonometry-001",
        unitCode: "WMA11",
        topicSlug: "trigonometry",
        type: "MCQ",
        difficulty: "EASY",
        marks: 1,
        stem: r`A sector of a circle has radius $6\,\text{cm}$ and angle $1.2$ radians. What is the area of the sector?`,
        options: opts(r`$7.2\,\text{cm}^2$`, r`$21.6\,\text{cm}^2$`, r`$43.2\,\text{cm}^2$`, r`$0.377\,\text{cm}^2$`, "B"),
        markScheme: r`- **B** (1) — area $= \tfrac{1}{2}r^2\theta = \tfrac{1}{2} \times 36 \times 1.2 = 21.6\,\text{cm}^2$.`,
        explanation: r`With $\theta$ in radians, area $= \tfrac{1}{2}r^2\theta$ and arc length $= r\theta$ (A). C forgets the $\tfrac{1}{2}$; D treats $1.2$ as degrees.`,
        status: "DRAFT",
    },
    {
        seedKey: "mat-wma11-trigonometry-002",
        unitCode: "WMA11",
        topicSlug: "trigonometry",
        type: "CALCULATION",
        difficulty: "MEDIUM",
        marks: 5,
        stem: r`In triangle $ABC$, $AB = 7\,\text{cm}$, $AC = 5\,\text{cm}$ and angle $BAC = 120^\circ$.

(a) Find the exact length of $BC$.

(b) Find the size of angle $ABC$, giving your answer to 1 decimal place.`,
        markScheme: r`- **M1** Uses the cosine rule: $BC^2 = 7^2 + 5^2 - 2(7)(5)\cos 120^\circ$ (1)
- **A1** $BC = \sqrt{109}\,\text{cm}$ (1)
- **M1** Uses the sine rule with their $BC$: $\dfrac{\sin B}{5} = \dfrac{\sin 120^\circ}{\sqrt{109}}$ (1)
- **A1** $\sin B = 0.4147...$ (1)
- **A1** Angle $ABC = 24.5^\circ$ (1)`,
        explanation: r`$\cos 120^\circ = -\tfrac{1}{2}$, so the cosine rule **adds** 35: $BC^2 = 49 + 25 + 35 = 109$. Angle $B$ must be acute because angle $A$ is already obtuse.`,
        status: "DRAFT",
    },
    {
        seedKey: "mat-wma11-trigonometry-003",
        unitCode: "WMA11",
        topicSlug: "trigonometry",
        type: "CALCULATION",
        difficulty: "HARD",
        marks: 4,
        stem: r`A chord $PQ$ of a circle with centre $O$ and radius $8\,\text{cm}$ subtends an angle of $\dfrac{2\pi}{3}$ radians at $O$.

Find the exact area of the minor segment cut off by the chord $PQ$.`,
        markScheme: r`- **M1** Area of sector $= \tfrac{1}{2}(8^2)\left(\tfrac{2\pi}{3}\right) = \tfrac{64\pi}{3}$ (1)
- **M1** Area of triangle $OPQ = \tfrac{1}{2}(8^2)\sin\tfrac{2\pi}{3} = 16\sqrt{3}$ (1)
- **M1** Segment = sector − triangle (1)
- **A1** $\dfrac{64\pi}{3} - 16\sqrt{3}\,\text{cm}^2$ (1)`,
        explanation: r`Segment area $= \tfrac{1}{2}r^2(\theta - \sin\theta)$ with $\theta$ in radians. $\sin\tfrac{2\pi}{3} = \tfrac{\sqrt{3}}{2}$, so the triangle is $32 \times \tfrac{\sqrt{3}}{2} = 16\sqrt{3}$.`,
        status: "DRAFT",
    },

    // --- differentiation ---
    {
        seedKey: "mat-wma11-differentiation-001",
        unitCode: "WMA11",
        topicSlug: "differentiation",
        type: "MCQ",
        difficulty: "EASY",
        marks: 1,
        stem: r`Given $y = 4\sqrt{x} - \dfrac{3}{x^2}$, which of the following is $\dfrac{dy}{dx}$?`,
        options: opts(
            r`$2x^{-\frac{1}{2}} + 6x^{-3}$`,
            r`$2x^{-\frac{1}{2}} - 6x^{-3}$`,
            r`$8x^{-\frac{1}{2}} + 6x^{-3}$`,
            r`$2x^{-\frac{1}{2}} + 6x^{-1}$`,
            "A",
        ),
        markScheme: r`- **A** (1) — $y = 4x^{\frac{1}{2}} - 3x^{-2}$, so $\dfrac{dy}{dx} = 2x^{-\frac{1}{2}} + 6x^{-3}$.`,
        explanation: r`Write each term as a power of $x$ first. $-3x^{-2}$ differentiates to $(-2)(-3)x^{-3} = +6x^{-3}$; the power goes **down** by one, from $-2$ to $-3$.`,
        status: "DRAFT",
    },
    {
        seedKey: "mat-wma11-differentiation-002",
        unitCode: "WMA11",
        topicSlug: "differentiation",
        type: "CALCULATION",
        difficulty: "MEDIUM",
        marks: 6,
        stem: r`The curve $C$ has equation $y = x^3 - 4x^2 + 2x + 5$. The point $P$ on $C$ has $x$-coordinate 3.

Find an equation of the normal to $C$ at $P$, giving your answer in the form $ax + by + c = 0$, where $a$, $b$ and $c$ are integers.`,
        markScheme: r`- **M1** Differentiates, at least one power reduced correctly (1)
- **A1** $\dfrac{dy}{dx} = 3x^2 - 8x + 2$ (1)
- **M1** Substitutes $x = 3$ to get gradient of tangent $= 5$ (1)
- **B1** $y$-coordinate of $P$ is $2$ (1)
- **M1** Uses normal gradient $-\tfrac{1}{5}$ with $(3, 2)$ to form a line (1)
- **A1** $x + 5y - 13 = 0$ (1)`,
        explanation: r`The normal is perpendicular to the tangent, so its gradient is $-1 \div 5$. A frequent slip is to use the tangent gradient $5$ in the final line.`,
        status: "DRAFT",
    },

    // --- integration ---
    {
        seedKey: "mat-wma11-integration-001",
        unitCode: "WMA11",
        topicSlug: "integration",
        type: "MCQ",
        difficulty: "EASY",
        marks: 1,
        stem: r`Find $\displaystyle\int \left(6x^2 - \frac{4}{x^3}\right) dx$.`,
        options: opts(
            r`$2x^3 - 2x^{-2} + c$`,
            r`$12x + 12x^{-4} + c$`,
            r`$2x^3 + 2x^{-2} + c$`,
            r`$6x^3 + 2x^{-2} + c$`,
            "C",
        ),
        markScheme: r`- **C** (1) — $\int -4x^{-3}\,dx = \dfrac{-4x^{-2}}{-2} = 2x^{-2}$, and $\int 6x^2\,dx = 2x^3$.`,
        explanation: r`Raise the power by one and divide by the **new** power. Dividing by $-2$ flips the sign of the second term (A misses this); B differentiates instead; D forgets to divide by 3.`,
        status: "DRAFT",
    },
    {
        seedKey: "mat-wma11-integration-002",
        unitCode: "WMA11",
        topicSlug: "integration",
        type: "CALCULATION",
        difficulty: "MEDIUM",
        marks: 5,
        stem: r`A curve has gradient function $\dfrac{dy}{dx} = 3\sqrt{x} - 2x + 1$, $x > 0$.

The curve passes through the point $(4, 7)$. Find $y$ in terms of $x$.`,
        markScheme: r`- **M1** Integrates, raising at least one power by 1 (1)
- **A1** $2x^{\frac{3}{2}}$ (1)
- **A1** $-x^2 + x$ (1)
- **M1** Substitutes $x = 4$, $y = 7$ to find the constant (1)
- **A1** $y = 2x^{\frac{3}{2}} - x^2 + x + 3$ (1)`,
        explanation: r`$\int 3x^{\frac{1}{2}}\,dx = 3 \times \tfrac{2}{3}x^{\frac{3}{2}} = 2x^{\frac{3}{2}}$. At $x = 4$: $2(8) - 16 + 4 + c = 7$, so $c = 3$. Never drop the $+c$ — the point is there to find it.`,
        status: "DRAFT",
    },
];

// ---------------------------------------------------------------------------------------------------------------
// WMA12 — Pure Mathematics 2
// ---------------------------------------------------------------------------------------------------------------
const wma12: SeedQuestion[] = [
    // --- proof ---
    {
        seedKey: "mat-wma12-proof-001",
        unitCode: "WMA12",
        topicSlug: "proof",
        type: "MCQ",
        difficulty: "EASY",
        marks: 1,
        stem: r`A student claims that $n^2 + n + 11$ is prime for every positive integer $n$. Which value of $n$ is a counter-example to this claim?`,
        options: opts(r`$n = 1$`, r`$n = 4$`, r`$n = 5$`, r`$n = 10$`, "D"),
        markScheme: r`- **D** (1) — $10^2 + 10 + 11 = 121 = 11^2$, which is not prime.`,
        explanation: r`$n = 1, 4, 5$ give 13, 31 and 41, which are all prime. A single value where the statement fails is enough to disprove it — checking a few values that work never proves it.`,
        status: "DRAFT",
    },
    {
        seedKey: "mat-wma12-proof-002",
        unitCode: "WMA12",
        topicSlug: "proof",
        type: "SHORT",
        difficulty: "MEDIUM",
        marks: 4,
        stem: r`Prove that the sum of the squares of any two consecutive odd integers is always 2 more than a multiple of 8.`,
        markScheme: r`- **B1** Writes two consecutive odd integers as $2n + 1$ and $2n + 3$ for integer $n$ (1)
- **M1** Expands $(2n + 1)^2 + (2n + 3)^2$ (1)
- **A1** $= 8n^2 + 16n + 10$ (1)
- **A1** $= 8(n^2 + 2n + 1) + 2$, and $n^2 + 2n + 1$ is an integer, so the sum is 2 more than a multiple of 8 (1)`,
        explanation: r`A proof must work for **all** cases, so use algebra, not examples. The final line needs a conclusion: say why $8(n^2 + 2n + 1)$ is a multiple of 8.`,
        status: "DRAFT",
    },

    // --- algebra-functions ---
    {
        seedKey: "mat-wma12-algebra-functions-001",
        unitCode: "WMA12",
        topicSlug: "algebra-functions",
        type: "MCQ",
        difficulty: "EASY",
        marks: 1,
        stem: r`$f(x) = 2x^3 - 3x^2 + 4x - 5$. What is the remainder when $f(x)$ is divided by $(2x + 1)$?`,
        options: opts(r`$-\tfrac{7}{2}$`, r`$-8$`, r`$-14$`, r`$-2$`, "B"),
        markScheme: r`- **B** (1) — by the remainder theorem the remainder is $f\left(-\tfrac{1}{2}\right) = -\tfrac{1}{4} - \tfrac{3}{4} - 2 - 5 = -8$.`,
        explanation: r`Set the divisor equal to zero: $2x + 1 = 0$ gives $x = -\tfrac{1}{2}$. A uses $x = \tfrac{1}{2}$ (wrong sign); C uses $x = -1$; D uses $x = 1$.`,
        status: "DRAFT",
    },
    {
        seedKey: "mat-wma12-algebra-functions-002",
        unitCode: "WMA12",
        topicSlug: "algebra-functions",
        type: "CALCULATION",
        difficulty: "MEDIUM",
        marks: 6,
        stem: r`$f(x) = 2x^3 + ax^2 + bx - 6$, where $a$ and $b$ are constants.

Given that $(x - 2)$ is a factor of $f(x)$, and that the remainder when $f(x)$ is divided by $(x + 1)$ is 6,

(a) find the values of $a$ and $b$,

(b) hence factorise $f(x)$ completely.`,
        markScheme: r`- **M1** Sets $f(2) = 0$: $16 + 4a + 2b - 6 = 0$ (1)
- **M1** Sets $f(-1) = 6$: $-2 + a - b - 6 = 6$ (1)
- **M1** Solves their simultaneous equations $2a + b = -5$ and $a - b = 14$ (1)
- **A1** $a = 3$, $b = -11$ (1)
- **M1** Divides $f(x)$ by $(x - 2)$ to obtain a quadratic factor $2x^2 + 7x + 3$ (1)
- **A1** $f(x) = (x - 2)(2x + 1)(x + 3)$ (1)`,
        explanation: r`Factor theorem: $(x - 2)$ is a factor $\iff f(2) = 0$. Remainder theorem: dividing by $(x + 1)$ leaves $f(-1)$. Two conditions give two equations for the two unknowns.`,
        status: "DRAFT",
    },

    // --- coordinate-geometry ---
    {
        seedKey: "mat-wma12-coordinate-geometry-001",
        unitCode: "WMA12",
        topicSlug: "coordinate-geometry",
        type: "MCQ",
        difficulty: "EASY",
        marks: 1,
        stem: r`The circle $C$ has equation $x^2 + y^2 - 6x + 10y - 2 = 0$. Which gives the centre and radius of $C$?`,
        options: opts(
            r`centre $(-3, 5)$, radius $6$`,
            r`centre $(3, -5)$, radius $\sqrt{32}$`,
            r`centre $(3, -5)$, radius $6$`,
            r`centre $(3, -5)$, radius $36$`,
            "C",
        ),
        markScheme: r`- **C** (1) — $(x - 3)^2 + (y + 5)^2 = 2 + 9 + 25 = 36$, so centre $(3, -5)$ and radius $6$.`,
        explanation: r`Complete the square in $x$ and $y$. The centre has the **opposite** signs to the numbers in the brackets (A gets this wrong). The constant moves across as $+2$, not $-2$ (B), and the radius is $\sqrt{36}$ (D).`,
        status: "DRAFT",
    },
    {
        seedKey: "mat-wma12-coordinate-geometry-002",
        unitCode: "WMA12",
        topicSlug: "coordinate-geometry",
        type: "CALCULATION",
        difficulty: "MEDIUM",
        marks: 5,
        stem: r`The circle $C$ has centre $(2, -1)$ and passes through the point $P(5, 3)$.

(a) Find an equation for $C$.

(b) Find an equation of the tangent to $C$ at $P$, giving your answer in the form $ax + by + c = 0$, where $a$, $b$ and $c$ are integers.`,
        markScheme: r`- **M1** Finds $r^2 = (5 - 2)^2 + (3 + 1)^2$ (1)
- **A1** $(x - 2)^2 + (y + 1)^2 = 25$ (1)
- **M1** Gradient of radius $= \dfrac{3 - (-1)}{5 - 2} = \tfrac{4}{3}$ (1)
- **M1** Uses perpendicular gradient $-\tfrac{3}{4}$ through $(5, 3)$ (1)
- **A1** $3x + 4y - 27 = 0$ (1)`,
        explanation: r`A tangent to a circle is perpendicular to the radius at the point of contact. Find the radius gradient first, then take the negative reciprocal.`,
        status: "DRAFT",
    },
    {
        seedKey: "mat-wma12-coordinate-geometry-003",
        unitCode: "WMA12",
        topicSlug: "coordinate-geometry",
        type: "CALCULATION",
        difficulty: "HARD",
        marks: 4,
        stem: r`The line $y = x + k$, where $k$ is a constant, is a tangent to the circle $x^2 + y^2 = 8$.

Find the possible values of $k$.`,
        markScheme: r`- **M1** Substitutes $y = x + k$ into the circle equation (1)
- **A1** $2x^2 + 2kx + k^2 - 8 = 0$ (1)
- **M1** Uses discriminant $= 0$: $(2k)^2 - 4(2)(k^2 - 8) = 0$ (1)
- **A1** $k = 4$ or $k = -4$ (1)`,
        explanation: r`A tangent meets the circle exactly once, so the resulting quadratic has a repeated root: $b^2 - 4ac = 0$ gives $64 - 4k^2 = 0$.`,
        status: "DRAFT",
    },

    // --- sequences-series ---
    {
        seedKey: "mat-wma12-sequences-series-001",
        unitCode: "WMA12",
        topicSlug: "sequences-series",
        type: "MCQ",
        difficulty: "EASY",
        marks: 1,
        stem: r`A geometric series has first term 24 and sum to infinity 96. What is the common ratio?`,
        options: opts(r`$\tfrac{1}{4}$`, r`$\tfrac{3}{4}$`, r`$4$`, r`$-\tfrac{3}{4}$`, "B"),
        markScheme: r`- **B** (1) — $\dfrac{24}{1 - r} = 96 \Rightarrow 1 - r = \tfrac{1}{4} \Rightarrow r = \tfrac{3}{4}$.`,
        explanation: r`Use $S_\infty = \dfrac{a}{1 - r}$. A stops at $1 - r = \tfrac{1}{4}$ without solving for $r$; C divides 96 by 24. A sum to infinity only exists when $|r| < 1$, which rules out C.`,
        status: "DRAFT",
    },
    {
        seedKey: "mat-wma12-sequences-series-002",
        unitCode: "WMA12",
        topicSlug: "sequences-series",
        type: "CALCULATION",
        difficulty: "MEDIUM",
        marks: 6,
        stem: r`The 5th term of an arithmetic series is 23 and the sum of the first 10 terms is 245.

(a) Find the first term and the common difference.

(b) Find the least number of terms for which the sum of the series exceeds 1000.`,
        markScheme: r`- **M1** Forms $a + 4d = 23$ (1)
- **M1** Forms $\tfrac{10}{2}(2a + 9d) = 245$ (1)
- **A1** $a = 11$, $d = 3$ (1)
- **M1** Sets $\tfrac{n}{2}\left(22 + 3(n - 1)\right) > 1000$ (1)
- **A1** $3n^2 + 19n - 2000 > 0$ (1)
- **A1** Critical value $n = 22.8...$, so least $n = 23$ (1)`,
        explanation: r`$n$ must be a whole number, so round the critical value **up**. Check: $S_{22} = 935$ and $S_{23} = 1012$.`,
        status: "DRAFT",
    },
    {
        seedKey: "mat-wma12-sequences-series-003",
        unitCode: "WMA12",
        topicSlug: "sequences-series",
        type: "CALCULATION",
        difficulty: "HARD",
        marks: 6,
        stem: r`(a) Find the first 4 terms, in ascending powers of $x$, of the binomial expansion of $\left(2 - \dfrac{x}{4}\right)^8$, giving each term in its simplest form.

(b) Use your expansion with a suitable value of $x$ to find an estimate for $1.99^8$, giving your answer to 3 decimal places.`,
        markScheme: r`- **B1** First term $2^8 = 256$ (1)
- **M1** Correct structure for at least one later term, e.g. $\binom{8}{2}2^6\left(-\tfrac{x}{4}\right)^2$ (1)
- **A1** $-256x + 112x^2$ (1)
- **A1** $-28x^3$ (1)
- **M1** Uses $x = 0.04$ in their expansion (1)
- **A1** $245.937$ (1)`,
        explanation: r`Keep the minus sign inside the bracket: $\left(-\tfrac{x}{4}\right)^3 = -\tfrac{x^3}{64}$, so the $x^3$ term is $56 \times 32 \times \left(-\tfrac{1}{64}\right) = -28$. For (b) solve $2 - \tfrac{x}{4} = 1.99$.`,
        status: "DRAFT",
    },

    // --- exponentials-logarithms ---
    {
        seedKey: "mat-wma12-exponentials-logarithms-001",
        unitCode: "WMA12",
        topicSlug: "exponentials-logarithms",
        type: "MCQ",
        difficulty: "EASY",
        marks: 1,
        stem: r`Solve $3^x = 20$, giving your answer to 3 significant figures.`,
        options: opts(r`$x = 0.367$`, r`$x = 6.67$`, r`$x = 2.73$`, r`$x = 0.824$`, "C"),
        markScheme: r`- **C** (1) — $x = \dfrac{\log 20}{\log 3} = 2.73$.`,
        explanation: r`Take logs of both sides: $x\log 3 = \log 20$. A divides the wrong way round, B computes $20 \div 3$, and D computes $\log\left(\tfrac{20}{3}\right)$.`,
        status: "DRAFT",
    },
    {
        seedKey: "mat-wma12-exponentials-logarithms-002",
        unitCode: "WMA12",
        topicSlug: "exponentials-logarithms",
        type: "CALCULATION",
        difficulty: "MEDIUM",
        marks: 5,
        stem: r`Solve the equation $\log_3 x + \log_3(x - 8) = 2$.`,
        markScheme: r`- **M1** Uses the addition law: $\log_3\left(x(x - 8)\right) = 2$ (1)
- **M1** Removes logs correctly: $x(x - 8) = 3^2$ (1)
- **A1** $x^2 - 8x - 9 = 0$ (1)
- **M1** Solves their quadratic: $(x - 9)(x + 1) = 0$ (1)
- **A1** $x = 9$ only, rejecting $x = -1$ because $\log_3$ of a negative number is undefined (1)`,
        explanation: r`$\log_3(\text{something}) = 2$ means something $= 3^2 = 9$, not $2^3$ or $6$. Always check solutions in the original logs — both $x$ and $x - 8$ must be positive.`,
        status: "DRAFT",
    },
    {
        seedKey: "mat-wma12-exponentials-logarithms-003",
        unitCode: "WMA12",
        topicSlug: "exponentials-logarithms",
        type: "CALCULATION",
        difficulty: "HARD",
        marks: 4,
        stem: r`Solve $2^{2x} - 5(2^x) + 6 = 0$, giving any non-exact answer to 3 significant figures.`,
        markScheme: r`- **M1** Recognises a quadratic in $u = 2^x$: $u^2 - 5u + 6 = 0$ (1)
- **A1** $2^x = 2$ or $2^x = 3$ (1)
- **B1** $x = 1$ (1)
- **A1** $x = \dfrac{\log 3}{\log 2} = 1.58$ (1)`,
        explanation: r`$2^{2x} = (2^x)^2$, so substitute $u = 2^x$. A common error is writing $2^{2x}$ as $2 \times 2^x$.`,
        status: "DRAFT",
    },

    // --- trigonometry ---
    {
        seedKey: "mat-wma12-trigonometry-001",
        unitCode: "WMA12",
        topicSlug: "trigonometry",
        type: "MCQ",
        difficulty: "MEDIUM",
        marks: 1,
        stem: r`How many solutions does $\sin 2x = 0.5$ have in the interval $0 \leqslant x < 360^\circ$?`,
        options: opts("1", "2", "8", "4", "D"),
        markScheme: r`- **D** (1) — $2x$ runs over $0 \leqslant 2x < 720^\circ$, giving $2x = 30^\circ, 150^\circ, 390^\circ, 510^\circ$.`,
        explanation: r`Change the interval to match the argument: if $0 \leqslant x < 360^\circ$ then $0 \leqslant 2x < 720^\circ$, which covers two full cycles. Stopping at $360^\circ$ for $2x$ gives only 2 solutions.`,
        status: "DRAFT",
    },
    {
        seedKey: "mat-wma12-trigonometry-002",
        unitCode: "WMA12",
        topicSlug: "trigonometry",
        type: "CALCULATION",
        difficulty: "MEDIUM",
        marks: 6,
        stem: r`Solve, for $0 \leqslant \theta < 360^\circ$,

$$2\cos^2\theta + 3\sin\theta = 3$$`,
        markScheme: r`- **M1** Uses $\cos^2\theta = 1 - \sin^2\theta$ (1)
- **A1** $2\sin^2\theta - 3\sin\theta + 1 = 0$ (1)
- **M1** Solves the quadratic in $\sin\theta$: $(2\sin\theta - 1)(\sin\theta - 1) = 0$ (1)
- **A1** $\sin\theta = \tfrac{1}{2}$ or $\sin\theta = 1$ (1)
- **A1** $\theta = 30^\circ, 150^\circ$ (1)
- **B1** $\theta = 90^\circ$ (1)`,
        explanation: r`Turn everything into one trig function using $\sin^2\theta + \cos^2\theta = 1$, then solve as a quadratic. Don't forget the second angle $180^\circ - 30^\circ$ for sine.`,
        status: "DRAFT",
    },
    {
        seedKey: "mat-wma12-trigonometry-003",
        unitCode: "WMA12",
        topicSlug: "trigonometry",
        type: "SHORT",
        difficulty: "HARD",
        marks: 6,
        stem: r`(a) Show that $\dfrac{\sin^2\theta}{1 - \cos\theta} \equiv 1 + \cos\theta$, for $\cos\theta \neq 1$.

(b) Hence solve, for $0 < \theta < 2\pi$,
$$\frac{\sin^2\theta}{1 - \cos\theta} = 3\cos\theta$$
giving your answers in terms of $\pi$.`,
        markScheme: r`- **M1** Replaces $\sin^2\theta$ with $1 - \cos^2\theta$ (1)
- **M1** Factorises as a difference of two squares: $(1 - \cos\theta)(1 + \cos\theta)$ (1)
- **A1** Cancels $(1 - \cos\theta)$ to reach $1 + \cos\theta$ with no errors (1)
- **M1** Uses part (a) to get $1 + \cos\theta = 3\cos\theta$, so $\cos\theta = \tfrac{1}{2}$ (1)
- **A1** $\theta = \dfrac{\pi}{3}$ (1)
- **A1** $\theta = \dfrac{5\pi}{3}$ (1)`,
        explanation: r`"Hence" means use the identity just proved. The cosine graph is symmetric about $\pi$, so the second solution is $2\pi - \tfrac{\pi}{3}$.`,
        status: "DRAFT",
    },

    // --- differentiation ---
    {
        seedKey: "mat-wma12-differentiation-001",
        unitCode: "WMA12",
        topicSlug: "differentiation",
        type: "MCQ",
        difficulty: "EASY",
        marks: 1,
        stem: r`For which values of $x$ is $f(x) = x^3 - 12x + 1$ a decreasing function?`,
        options: opts(r`$x < -2$ or $x > 2$`, r`$-2 < x < 2$`, r`$x > 2$`, r`$-4 < x < 4$`, "B"),
        markScheme: r`- **B** (1) — $f'(x) = 3x^2 - 12 < 0 \Rightarrow x^2 < 4 \Rightarrow -2 < x < 2$.`,
        explanation: r`Decreasing means $f'(x) < 0$. A is where $f$ is increasing; D forgets to square-root ($x^2 < 4$, not $x < 4$).`,
        status: "DRAFT",
    },
    {
        seedKey: "mat-wma12-differentiation-002",
        unitCode: "WMA12",
        topicSlug: "differentiation",
        type: "CALCULATION",
        difficulty: "HARD",
        marks: 7,
        stem: r`An open-topped box has a square base of side $x\,\text{cm}$ and height $h\,\text{cm}$. Its volume is $500\,\text{cm}^3$.

(a) Show that the external surface area, $A\,\text{cm}^2$, of the box is given by $A = x^2 + \dfrac{2000}{x}$.

(b) Use calculus to find the minimum value of $A$, justifying that it is a minimum.`,
        markScheme: r`- **M1** Uses $x^2h = 500$ to write $h = \dfrac{500}{x^2}$ (1)
- **A1** $A = x^2 + 4xh = x^2 + \dfrac{2000}{x}$ shown (1)
- **M1** Differentiates: at least one term correct (1)
- **A1** $\dfrac{dA}{dx} = 2x - \dfrac{2000}{x^2}$ (1)
- **M1** Sets $\dfrac{dA}{dx} = 0$ and solves: $x^3 = 1000$, $x = 10$ (1)
- **A1** Minimum $A = 300\,\text{cm}^2$ (1)
- **B1** $\dfrac{d^2A}{dx^2} = 2 + \dfrac{4000}{x^3} = 6 > 0$, so minimum (1)`,
        explanation: r`Open-topped: one base plus four sides, so $A = x^2 + 4xh$. Always justify the nature of a stationary point — here the second derivative is positive.`,
        status: "DRAFT",
    },

    // --- integration ---
    {
        seedKey: "mat-wma12-integration-001",
        unitCode: "WMA12",
        topicSlug: "integration",
        type: "MCQ",
        difficulty: "EASY",
        marks: 1,
        stem: r`Find the value of $\displaystyle\int_1^4 3\sqrt{x}\,dx$.`,
        options: opts("14", "16", "31.5", "3", "A"),
        markScheme: r`- **A** (1) — $\left[2x^{\frac{3}{2}}\right]_1^4 = 16 - 2 = 14$.`,
        explanation: r`$\int 3x^{\frac{1}{2}}\,dx = 2x^{\frac{3}{2}}$. B forgets to subtract the lower limit; C multiplies by $\tfrac{3}{2}$ instead of dividing; D subtracts values of $3\sqrt{x}$ without integrating.`,
        status: "DRAFT",
    },
    {
        seedKey: "mat-wma12-integration-002",
        unitCode: "WMA12",
        topicSlug: "integration",
        type: "CALCULATION",
        difficulty: "MEDIUM",
        marks: 6,
        stem: r`The curve $C$ has equation $y = 6x - x^2$ and the line $l$ has equation $y = 2x$.

Find the exact area of the finite region bounded by $C$ and $l$.`,
        markScheme: r`- **M1** Sets $6x - x^2 = 2x$ (1)
- **A1** $x = 0$ and $x = 4$ (1)
- **M1** Integrates the difference, $\int (4x - x^2)\,dx$, or curve minus triangle (1)
- **A1** $2x^2 - \dfrac{x^3}{3}$ (1)
- **M1** Applies limits 0 and 4 (1)
- **A1** Area $= \dfrac{32}{3}$ (1)`,
        explanation: r`Area between curves $= \int (\text{top} - \text{bottom})\,dx$ between the intersection points. Alternatively, area under the curve ($\tfrac{80}{3}$) minus the triangle ($16$).`,
        status: "DRAFT",
    },
    {
        seedKey: "mat-wma12-integration-003",
        unitCode: "WMA12",
        topicSlug: "integration",
        type: "CALCULATION",
        difficulty: "MEDIUM",
        marks: 4,
        stem: r`Use the trapezium rule with 4 strips of equal width to estimate $\displaystyle\int_0^2 \sqrt{1 + x^3}\,dx$, giving your answer to 3 decimal places.`,
        markScheme: r`- **B1** Strip width $h = 0.5$ (1)
- **B1** $y$ values $1,\ 1.0607,\ 1.4142,\ 2.0917,\ 3$ (1)
- **M1** Uses $\tfrac{h}{2}\left[y_0 + y_4 + 2(y_1 + y_2 + y_3)\right]$ (1)
- **A1** $3.283$ (1)`,
        explanation: r`$\tfrac{0.5}{2}\left[1 + 3 + 2(1.0607 + 1.4142 + 2.0917)\right] = 3.283$. Common errors: using 4 ordinates instead of 5, or forgetting to double the middle values.`,
        status: "DRAFT",
    },
];

// ---------------------------------------------------------------------------------------------------------------
// WMA13 — Pure Mathematics 3
// ---------------------------------------------------------------------------------------------------------------
const wma13: SeedQuestion[] = [
    // --- algebra-functions ---
    {
        seedKey: "mat-wma13-algebra-functions-001",
        unitCode: "WMA13",
        topicSlug: "algebra-functions",
        type: "MCQ",
        difficulty: "EASY",
        marks: 1,
        stem: r`$f(x) = 3x - 1$ and $g(x) = x^2 + 2$. What is the value of $fg(2)$?`,
        options: opts("27", "30", "17", "11", "C"),
        markScheme: r`- **C** (1) — $g(2) = 6$, then $f(6) = 17$.`,
        explanation: r`$fg(x)$ means apply $g$ **first**, then $f$. A is $gf(2)$; B multiplies $f(2) \times g(2)$; D adds them.`,
        status: "DRAFT",
    },
    {
        seedKey: "mat-wma13-algebra-functions-002",
        unitCode: "WMA13",
        topicSlug: "algebra-functions",
        type: "CALCULATION",
        difficulty: "MEDIUM",
        marks: 4,
        stem: r`The function $f$ is defined by

$$f(x) = \frac{2x + 3}{x - 1}, \quad x > 1$$

Find $f^{-1}(x)$, stating its domain.`,
        markScheme: r`- **M1** Sets $y = \dfrac{2x + 3}{x - 1}$ and multiplies out: $xy - y = 2x + 3$ (1)
- **M1** Collects $x$ terms and factorises: $x(y - 2) = y + 3$ (1)
- **A1** $f^{-1}(x) = \dfrac{x + 3}{x - 2}$ (1)
- **B1** Domain $x > 2$ (1)`,
        explanation: r`The domain of $f^{-1}$ is the range of $f$. Writing $f(x) = 2 + \dfrac{5}{x - 1}$ shows that $f(x) > 2$ for $x > 1$.`,
        status: "DRAFT",
    },
    {
        seedKey: "mat-wma13-algebra-functions-003",
        unitCode: "WMA13",
        topicSlug: "algebra-functions",
        type: "CALCULATION",
        difficulty: "HARD",
        marks: 4,
        stem: r`Solve the equation $|x - 5| = 2x - 1$.`,
        markScheme: r`- **M1** Solves $x - 5 = 2x - 1$ to get $x = -4$ (1)
- **M1** Solves $-(x - 5) = 2x - 1$ to get $x = 2$ (1)
- **A1** $x = 2$ (1)
- **A1** Rejects $x = -4$ because it makes $2x - 1$ negative, which a modulus cannot equal (1)`,
        explanation: r`A modulus is never negative, so any solution must make the right-hand side $\geqslant 0$. Sketching $y = |x - 5|$ and $y = 2x - 1$ shows they meet only once.`,
        status: "DRAFT",
    },

    // --- trigonometry ---
    {
        seedKey: "mat-wma13-trigonometry-001",
        unitCode: "WMA13",
        topicSlug: "trigonometry",
        type: "MCQ",
        difficulty: "EASY",
        marks: 1,
        stem: r`What is the exact value of $\cos 75^\circ$?`,
        options: opts(
            r`$\dfrac{\sqrt{6} + \sqrt{2}}{4}$`,
            r`$\dfrac{\sqrt{6} - \sqrt{2}}{4}$`,
            r`$\dfrac{\sqrt{2} - \sqrt{6}}{4}$`,
            r`$\dfrac{\sqrt{6} - \sqrt{2}}{2}$`,
            "B",
        ),
        markScheme: r`- **B** (1) — $\cos(45^\circ + 30^\circ) = \cos 45^\circ\cos 30^\circ - \sin 45^\circ\sin 30^\circ = \dfrac{\sqrt{6} - \sqrt{2}}{4}$.`,
        explanation: r`$\cos(A + B) = \cos A\cos B - \sin A\sin B$ — the sign **changes**. A uses a plus (that is $\sin 75^\circ$); C swaps the order; D drops a factor of $\tfrac{1}{2}$.`,
        status: "DRAFT",
    },
    {
        seedKey: "mat-wma13-trigonometry-002",
        unitCode: "WMA13",
        topicSlug: "trigonometry",
        type: "CALCULATION",
        difficulty: "HARD",
        marks: 7,
        stem: r`(a) Express $3\cos\theta + 4\sin\theta$ in the form $R\cos(\theta - \alpha)$, where $R > 0$ and $0 < \alpha < \dfrac{\pi}{2}$. Give the value of $\alpha$ in radians to 3 decimal places.

(b) Hence solve, for $0 \leqslant \theta < 2\pi$, the equation $3\cos\theta + 4\sin\theta = 2$, giving your answers to 2 decimal places.`,
        markScheme: r`- **B1** $R = 5$ (1)
- **M1** $\tan\alpha = \tfrac{4}{3}$ (1)
- **A1** $\alpha = 0.927$ (1)
- **M1** $\cos(\theta - \alpha) = \tfrac{2}{5}$ (1)
- **A1** $\theta - \alpha = 1.159...$ (1)
- **M1** Finds a second value $\theta - \alpha = 2\pi - 1.159... = 5.123...$ (1)
- **A1** $\theta = 2.09$ and $\theta = 6.05$ (1)`,
        explanation: r`$R\cos(\theta - \alpha) = R\cos\theta\cos\alpha + R\sin\theta\sin\alpha$, so $R\cos\alpha = 3$ and $R\sin\alpha = 4$. Work in radians throughout and add $\alpha$ back on at the end.`,
        status: "DRAFT",
    },
    {
        seedKey: "mat-wma13-trigonometry-003",
        unitCode: "WMA13",
        topicSlug: "trigonometry",
        type: "CALCULATION",
        difficulty: "MEDIUM",
        marks: 5,
        stem: r`Solve, for $0 \leqslant x < 360^\circ$,

$$\cos 2x = 3\sin x - 1$$`,
        markScheme: r`- **M1** Uses $\cos 2x = 1 - 2\sin^2 x$ (1)
- **A1** $2\sin^2 x + 3\sin x - 2 = 0$ (1)
- **M1** Solves: $(2\sin x - 1)(\sin x + 2) = 0$ (1)
- **A1** $\sin x = \tfrac{1}{2}$, rejecting $\sin x = -2$ (1)
- **A1** $x = 30^\circ, 150^\circ$ (1)`,
        explanation: r`Pick the form of $\cos 2x$ that matches the other terms: with $\sin x$ in the equation, use $1 - 2\sin^2 x$. $\sin x = -2$ is impossible because $-1 \leqslant \sin x \leqslant 1$.`,
        status: "DRAFT",
    },

    // --- exponentials-logarithms ---
    {
        seedKey: "mat-wma13-exponentials-logarithms-001",
        unitCode: "WMA13",
        topicSlug: "exponentials-logarithms",
        type: "MCQ",
        difficulty: "EASY",
        marks: 1,
        stem: r`Solve $e^{2x} = 7$.`,
        options: opts(r`$x = \ln 3.5$`, r`$x = 2\ln 7$`, r`$x = \ln 7 - 2$`, r`$x = \tfrac{1}{2}\ln 7$`, "D"),
        markScheme: r`- **D** (1) — $2x = \ln 7$, so $x = \tfrac{1}{2}\ln 7$.`,
        explanation: r`Take $\ln$ of both sides first, **then** divide by 2. A divides 7 by 2 before taking logs, which is not the same thing.`,
        status: "DRAFT",
    },
    {
        seedKey: "mat-wma13-exponentials-logarithms-002",
        unitCode: "WMA13",
        topicSlug: "exponentials-logarithms",
        type: "CALCULATION",
        difficulty: "MEDIUM",
        marks: 6,
        stem: r`Two variables are believed to satisfy $y = ax^n$, where $a$ and $n$ are constants.

A graph of $\log_{10} y$ against $\log_{10} x$ is a straight line passing through the points $(0.5, 1.449)$ and $(2, 3.699)$.

(a) Find the values of $n$ and $a$, giving $a$ to the nearest integer.

(b) Hence estimate $y$ when $x = 4$.`,
        markScheme: r`- **B1** $\log_{10} y = \log_{10} a + n\log_{10} x$ (1)
- **M1** Gradient $= \dfrac{3.699 - 1.449}{2 - 0.5}$ (1)
- **A1** $n = 1.5$ (1)
- **M1** Finds intercept $\log_{10} a = 0.699$ and uses $a = 10^{0.699}$ (1)
- **A1** $a = 5$ (1)
- **B1** $y = 5 \times 4^{1.5} = 40$ (1)`,
        explanation: r`Taking logs turns $y = ax^n$ into the straight line $Y = nX + c$, with gradient $n$ and intercept $\log_{10} a$. Remember to undo the log: $a = 10^{c}$, not $c$.`,
        status: "DRAFT",
    },
    {
        seedKey: "mat-wma13-exponentials-logarithms-003",
        unitCode: "WMA13",
        topicSlug: "exponentials-logarithms",
        type: "CALCULATION",
        difficulty: "HARD",
        marks: 5,
        stem: r`The temperature, $T\,^\circ\text{C}$, of a cup of tea $t$ minutes after it is made is modelled by

$$T = 20 + 75e^{-kt}$$

where $k$ is a positive constant.

(a) State the temperature of the tea when it is made.

Ten minutes after it is made, the temperature of the tea is $50\,^\circ\text{C}$.

(b) Find the exact value of $k$.

(c) Find the time it takes for the tea to cool to $30\,^\circ\text{C}$, giving your answer to 1 decimal place.`,
        markScheme: r`- **B1** $95\,^\circ\text{C}$ (1)
- **M1** $50 = 20 + 75e^{-10k} \Rightarrow e^{-10k} = 0.4$ and takes $\ln$ (1)
- **A1** $k = \tfrac{1}{10}\ln\tfrac{5}{2}$ (1)
- **M1** $75e^{-kt} = 10 \Rightarrow t = \dfrac{\ln 7.5}{k}$ (1)
- **A1** $t = 22.0$ minutes (1)`,
        explanation: r`Isolate the exponential before taking logs: $\ln(75e^{-kt}) \neq \ln 75 \times (-kt)$. In (c), $t = \dfrac{10\ln 7.5}{\ln 2.5} = 21.99...$`,
        status: "DRAFT",
    },

    // --- differentiation ---
    {
        seedKey: "mat-wma13-differentiation-001",
        unitCode: "WMA13",
        topicSlug: "differentiation",
        type: "MCQ",
        difficulty: "EASY",
        marks: 1,
        stem: r`Given $y = \ln(3x^2 + 1)$, find $\dfrac{dy}{dx}$.`,
        options: opts(
            r`$\dfrac{6x}{3x^2 + 1}$`,
            r`$\dfrac{1}{3x^2 + 1}$`,
            r`$6x\ln(3x^2 + 1)$`,
            r`$\dfrac{1}{6x}$`,
            "A",
        ),
        markScheme: r`- **A** (1) — chain rule: $\dfrac{d}{dx}\ln f(x) = \dfrac{f'(x)}{f(x)} = \dfrac{6x}{3x^2 + 1}$.`,
        explanation: r`B forgets to multiply by the derivative of the inside. The pattern "derivative of the inside over the inside" also reverses in integration.`,
        status: "DRAFT",
    },
    {
        seedKey: "mat-wma13-differentiation-002",
        unitCode: "WMA13",
        topicSlug: "differentiation",
        type: "CALCULATION",
        difficulty: "MEDIUM",
        marks: 5,
        stem: r`The curve $C$ has equation $y = x^2e^{3x}$.

Find the exact coordinates of the stationary points of $C$.`,
        markScheme: r`- **M1** Uses the product rule (1)
- **A1** $\dfrac{dy}{dx} = 2xe^{3x} + 3x^2e^{3x}$ (1)
- **M1** Sets $\dfrac{dy}{dx} = 0$ and factorises: $xe^{3x}(2 + 3x) = 0$, noting $e^{3x} \neq 0$ (1)
- **A1** $x = 0$ and $x = -\tfrac{2}{3}$ (1)
- **A1** $(0, 0)$ and $\left(-\tfrac{2}{3}, \dfrac{4}{9e^2}\right)$ (1)`,
        explanation: r`Factorising out $xe^{3x}$ avoids losing a root. Never divide by $x$ — that throws away $x = 0$.`,
        status: "DRAFT",
    },
    {
        seedKey: "mat-wma13-differentiation-003",
        unitCode: "WMA13",
        topicSlug: "differentiation",
        type: "SHORT",
        difficulty: "HARD",
        marks: 5,
        stem: r`The curve $C$ has equation $y = \dfrac{\sin x}{2 + \cos x}$.

(a) Show that $\dfrac{dy}{dx} = \dfrac{2\cos x + 1}{(2 + \cos x)^2}$.

(b) Find the value of $x$ in the interval $0 < x < \pi$ at which $C$ has a stationary point.`,
        markScheme: r`- **M1** Uses the quotient rule (1)
- **A1** $\dfrac{(2 + \cos x)\cos x - \sin x(-\sin x)}{(2 + \cos x)^2}$ (1)
- **M1** Expands and uses $\sin^2 x + \cos^2 x = 1$ (1)
- **A1** Reaches $\dfrac{2\cos x + 1}{(2 + \cos x)^2}$ with no errors (1)
- **B1** $x = \dfrac{2\pi}{3}$ (1)`,
        explanation: r`The numerator becomes $2\cos x + \cos^2 x + \sin^2 x = 2\cos x + 1$. Stationary points need only the numerator to be zero: $\cos x = -\tfrac{1}{2}$.`,
        status: "DRAFT",
    },

    // --- integration ---
    {
        seedKey: "mat-wma13-integration-001",
        unitCode: "WMA13",
        topicSlug: "integration",
        type: "MCQ",
        difficulty: "EASY",
        marks: 1,
        stem: r`Find $\displaystyle\int \frac{1}{2x + 5}\,dx$.`,
        options: opts(
            r`$\ln|2x + 5| + c$`,
            r`$2\ln|2x + 5| + c$`,
            r`$-\dfrac{2}{(2x + 5)^2} + c$`,
            r`$\tfrac{1}{2}\ln|2x + 5| + c$`,
            "D",
        ),
        markScheme: r`- **D** (1) — $\int \dfrac{1}{ax + b}\,dx = \dfrac{1}{a}\ln|ax + b| + c$.`,
        explanation: r`Differentiate your answer to check: $\dfrac{d}{dx}\left(\tfrac{1}{2}\ln|2x + 5|\right) = \tfrac{1}{2} \times \dfrac{2}{2x + 5}$. B multiplies by 2 instead of dividing; C differentiates.`,
        status: "DRAFT",
    },
    {
        seedKey: "mat-wma13-integration-002",
        unitCode: "WMA13",
        topicSlug: "integration",
        type: "CALCULATION",
        difficulty: "MEDIUM",
        marks: 5,
        stem: r`Find the exact value of $\displaystyle\int_0^{\frac{\pi}{4}} \left(\sec^2 x + 4\sin 2x\right) dx$.`,
        markScheme: r`- **M1** $\int \sec^2 x\,dx = \tan x$ (1)
- **M1** $\int \sin 2x\,dx = k\cos 2x$ (1)
- **A1** $\tan x - 2\cos 2x$ (1)
- **M1** Substitutes both limits and subtracts (1)
- **A1** $(1 - 0) - (0 - 2) = 3$ (1)`,
        explanation: r`$\int \sin 2x\,dx = -\tfrac{1}{2}\cos 2x$, so $4\sin 2x$ integrates to $-2\cos 2x$. Watch the double negative at the lower limit: $-2\cos 0 = -2$.`,
        status: "DRAFT",
    },
    {
        seedKey: "mat-wma13-integration-003",
        unitCode: "WMA13",
        topicSlug: "integration",
        type: "CALCULATION",
        difficulty: "HARD",
        marks: 4,
        stem: r`Find the exact value of $\displaystyle\int_0^2 \frac{x}{x^2 + 4}\,dx$, giving your answer in the form $a\ln b$.`,
        markScheme: r`- **M1** Recognises the form $k\ln(x^2 + 4)$ (1)
- **A1** $\tfrac{1}{2}\ln(x^2 + 4)$ (1)
- **M1** Substitutes limits: $\tfrac{1}{2}\ln 8 - \tfrac{1}{2}\ln 4$ (1)
- **A1** $\tfrac{1}{2}\ln 2$ (1)`,
        explanation: r`The numerator $x$ is half the derivative of $x^2 + 4$, so this is "integration by recognition" of $\dfrac{f'(x)}{f(x)}$ with a factor of $\tfrac{1}{2}$.`,
        status: "DRAFT",
    },

    // --- numerical-methods ---
    {
        seedKey: "mat-wma13-numerical-methods-001",
        unitCode: "WMA13",
        topicSlug: "numerical-methods",
        type: "MCQ",
        difficulty: "EASY",
        marks: 1,
        stem: r`Using the iteration formula $x_{n+1} = \sqrt[3]{3x_n + 4}$ with $x_0 = 2$, what is $x_1$ to 3 decimal places?`,
        options: opts("10.000", "2.196", "3.333", "2.154", "D"),
        markScheme: r`- **D** (1) — $x_1 = \sqrt[3]{3(2) + 4} = \sqrt[3]{10} = 2.154$.`,
        explanation: r`$x_1$ is just one step. A forgets the cube root; B is the root the iteration converges to (after many steps), not $x_1$.`,
        status: "DRAFT",
    },
    {
        seedKey: "mat-wma13-numerical-methods-002",
        unitCode: "WMA13",
        topicSlug: "numerical-methods",
        type: "CALCULATION",
        difficulty: "MEDIUM",
        marks: 6,
        stem: r`$f(x) = x^3 - 2x - 5$

(a) Show that the equation $f(x) = 0$ has a root $\alpha$ in the interval $[2, 3]$.

(b) Taking $x_0 = 2$ as a first approximation, apply the Newton–Raphson method twice to find $x_2$, giving your answer to 4 decimal places.`,
        markScheme: r`- **M1** Evaluates $f(2) = -1$ and $f(3) = 16$ (1)
- **A1** States change of sign and $f$ continuous, so a root lies in $[2, 3]$ (1)
- **B1** $f'(x) = 3x^2 - 2$ (1)
- **M1** Uses $x_{n+1} = x_n - \dfrac{f(x_n)}{f'(x_n)}$ (1)
- **A1** $x_1 = 2.1$ (1)
- **A1** $x_2 = 2.0946$ (1)`,
        explanation: r`$x_2 = 2.1 - \dfrac{0.061}{11.23} = 2.09457...$. A change of sign only proves a root if the function is **continuous** on the interval — say so.`,
        status: "DRAFT",
    },
];

// ---------------------------------------------------------------------------------------------------------------
// WMA14 — Pure Mathematics 4
// ---------------------------------------------------------------------------------------------------------------
const wma14: SeedQuestion[] = [
    // --- proof ---
    {
        seedKey: "mat-wma14-proof-001",
        unitCode: "WMA14",
        topicSlug: "proof",
        type: "MCQ",
        difficulty: "EASY",
        marks: 1,
        stem: r`A student proves by contradiction that $\sqrt{2}$ is irrational. What should the first line of the proof assume?`,
        options: opts(
            r`$\sqrt{2} = \dfrac{a}{b}$ where $a$ and $b$ are integers with no common factors, $b \neq 0$`,
            r`$\sqrt{2}$ is irrational`,
            r`$a^2 = 2b^2$ for all integers $a$ and $b$`,
            r`$\sqrt{2} = \dfrac{a}{b}$ where $a$ and $b$ are both even`,
            "A",
        ),
        markScheme: r`- **A** (1) — assume the opposite of the statement: $\sqrt{2}$ is rational, written in its lowest terms.`,
        explanation: r`Proof by contradiction starts by assuming the statement is **false**. "No common factors" is essential: the contradiction comes from showing $a$ and $b$ are both even.`,
        status: "DRAFT",
    },
    {
        seedKey: "mat-wma14-proof-002",
        unitCode: "WMA14",
        topicSlug: "proof",
        type: "SHORT",
        difficulty: "HARD",
        marks: 5,
        stem: r`Use proof by contradiction to prove that there are no positive integers $x$ and $y$ such that $x^2 - y^2 = 10$.`,
        markScheme: r`- **B1** Assumes there exist positive integers $x$, $y$ with $x^2 - y^2 = 10$ (1)
- **M1** Factorises: $(x - y)(x + y) = 10$ (1)
- **M1** Considers the factor pairs, $x - y = 1, x + y = 10$ or $x - y = 2, x + y = 5$ (1)
- **M1** Shows each pair gives non-integer $x$ (e.g. $x = \tfrac{11}{2}$, $x = \tfrac{7}{2}$), or notes $x - y$ and $x + y$ must have the same parity (1)
- **A1** Contradiction stated, so no such positive integers exist (1)`,
        explanation: r`$(x + y) + (x - y) = 2x$ is even, so the two factors are both odd or both even. 10 cannot be written as a product of two odd numbers or of two even numbers.`,
        status: "DRAFT",
    },

    // --- partial-fractions ---
    {
        seedKey: "mat-wma14-partial-fractions-001",
        unitCode: "WMA14",
        topicSlug: "partial-fractions",
        type: "MCQ",
        difficulty: "EASY",
        marks: 1,
        stem: r`Express $\dfrac{5x + 1}{(x - 1)(x + 2)}$ in partial fractions.`,
        options: opts(
            r`$\dfrac{3}{x - 1} + \dfrac{2}{x + 2}$`,
            r`$\dfrac{2}{x - 1} - \dfrac{3}{x + 2}$`,
            r`$\dfrac{6}{x - 1} - \dfrac{9}{x + 2}$`,
            r`$\dfrac{2}{x - 1} + \dfrac{3}{x + 2}$`,
            "D",
        ),
        markScheme: r`- **D** (1) — $5x + 1 \equiv A(x + 2) + B(x - 1)$; $x = 1$ gives $A = 2$, $x = -2$ gives $B = 3$.`,
        explanation: r`Use the cover-up method or substitute the roots of each bracket. C forgets to divide by the value of the other bracket ($3$ and $-3$); option B has the wrong sign on the second fraction.`,
        status: "DRAFT",
    },
    {
        seedKey: "mat-wma14-partial-fractions-002",
        unitCode: "WMA14",
        topicSlug: "partial-fractions",
        type: "CALCULATION",
        difficulty: "MEDIUM",
        marks: 6,
        stem: r`Express $\dfrac{3x^2 - x + 4}{(x + 1)(x - 1)^2}$ in partial fractions.`,
        markScheme: r`- **B1** Correct form $\dfrac{A}{x + 1} + \dfrac{B}{x - 1} + \dfrac{C}{(x - 1)^2}$ (1)
- **M1** Writes $3x^2 - x + 4 \equiv A(x - 1)^2 + B(x + 1)(x - 1) + C(x + 1)$ and substitutes a root (1)
- **A1** $A = 2$ (1)
- **A1** $C = 3$ (1)
- **M1** Compares coefficients of $x^2$ (or substitutes another value) to find $B$ (1)
- **A1** $B = 1$ (1)`,
        explanation: r`A repeated factor $(x - 1)^2$ needs **two** fractions: one over $(x - 1)$ and one over $(x - 1)^2$. Comparing $x^2$ coefficients: $A + B = 3$.`,
        status: "DRAFT",
    },

    // --- parametric-equations ---
    {
        seedKey: "mat-wma14-parametric-equations-001",
        unitCode: "WMA14",
        topicSlug: "parametric-equations",
        type: "MCQ",
        difficulty: "EASY",
        marks: 1,
        stem: r`A curve has parametric equations $x = 2t$, $y = t^2 - 1$. Which is a Cartesian equation of the curve?`,
        options: opts(
            r`$y = \dfrac{x^2}{4} - 1$`,
            r`$y = 4x^2 - 1$`,
            r`$y = \dfrac{x^2}{2} - 1$`,
            r`$y = \dfrac{(x - 1)^2}{4}$`,
            "A",
        ),
        markScheme: r`- **A** (1) — $t = \dfrac{x}{2}$, so $y = \left(\dfrac{x}{2}\right)^2 - 1 = \dfrac{x^2}{4} - 1$.`,
        explanation: r`Make $t$ the subject of the simpler equation and substitute. B uses $t = 2x$; C forgets to square the 2 in the denominator.`,
        status: "DRAFT",
    },
    {
        seedKey: "mat-wma14-parametric-equations-002",
        unitCode: "WMA14",
        topicSlug: "parametric-equations",
        type: "CALCULATION",
        difficulty: "MEDIUM",
        marks: 5,
        stem: r`The curve $C$ has parametric equations

$$x = 1 + 2t, \quad y = \frac{4}{t}, \quad t \neq 0$$

(a) Find a Cartesian equation of $C$ in the form $y = f(x)$.

(b) Find the coordinates of the points where $C$ meets the line $y = x + 1$.`,
        markScheme: r`- **M1** Writes $t = \dfrac{x - 1}{2}$ and substitutes into $y$ (1)
- **A1** $y = \dfrac{8}{x - 1}$ (1)
- **M1** Sets $\dfrac{8}{x - 1} = x + 1$ and forms a quadratic, $x^2 - 1 = 8$ (1)
- **A1** $x = 3$ or $x = -3$ (1)
- **A1** $(3, 4)$ and $(-3, -2)$ (1)`,
        explanation: r`$\dfrac{4}{t} = \dfrac{4}{\frac{x-1}{2}} = \dfrac{8}{x - 1}$. Check with the parameter: $t = 1$ gives $(3, 4)$ and $t = -2$ gives $(-3, -2)$.`,
        status: "DRAFT",
    },

    // --- binomial-expansion ---
    {
        seedKey: "mat-wma14-binomial-expansion-001",
        unitCode: "WMA14",
        topicSlug: "binomial-expansion",
        type: "MCQ",
        difficulty: "EASY",
        marks: 1,
        stem: r`For which values of $x$ is the binomial expansion of $(1 - 4x)^{-\frac{1}{2}}$ valid?`,
        options: opts(r`$|x| < \tfrac{1}{4}$`, r`$|x| < 1$`, r`$|x| < 4$`, r`$|x| < \tfrac{1}{2}$`, "A"),
        markScheme: r`- **A** (1) — the expansion of $(1 + y)^n$ is valid for $|y| < 1$; here $|4x| < 1$, so $|x| < \tfrac{1}{4}$.`,
        explanation: r`The validity condition comes from the term inside the bracket, not the power. C inverts the 4; B ignores it; D confuses it with the power $-\tfrac{1}{2}$.`,
        status: "DRAFT",
    },
    {
        seedKey: "mat-wma14-binomial-expansion-002",
        unitCode: "WMA14",
        topicSlug: "binomial-expansion",
        type: "CALCULATION",
        difficulty: "HARD",
        marks: 6,
        stem: r`(a) Find the binomial expansion of $\sqrt{4 - x}$, in ascending powers of $x$, up to and including the term in $x^3$. State the range of values of $x$ for which the expansion is valid.

(b) Use your expansion with $x = 0.1$ to find an estimate of $\sqrt{3.9}$, giving your answer to 6 decimal places.`,
        markScheme: r`- **M1** Takes out a factor of $4^{\frac{1}{2}} = 2$: $2\left(1 - \tfrac{x}{4}\right)^{\frac{1}{2}}$ (1)
- **B1** Valid for $|x| < 4$ (1)
- **M1** Correct binomial structure, e.g. $\dfrac{\frac{1}{2}\left(-\frac{1}{2}\right)}{2!}\left(-\dfrac{x}{4}\right)^2$ (1)
- **A1** $2 - \dfrac{x}{4}$ (1)
- **A1** $-\dfrac{x^2}{64} - \dfrac{x^3}{512}$ (1)
- **A1** $\sqrt{3.9} \approx 1.974842$ (1)`,
        explanation: r`The factor outside is $4^{\frac{1}{2}} = 2$, not 4 — a very common error. The expansion of $(1 + y)^n$ needs $|y| < 1$, so $\left|\tfrac{x}{4}\right| < 1$.`,
        status: "DRAFT",
    },

    // --- differentiation ---
    {
        seedKey: "mat-wma14-differentiation-001",
        unitCode: "WMA14",
        topicSlug: "differentiation",
        type: "MCQ",
        difficulty: "EASY",
        marks: 1,
        stem: r`A curve has parametric equations $x = t^2$, $y = t^3 - 3t$. What is the gradient of the curve at the point where $t = 2$?`,
        options: opts(r`$\tfrac{4}{9}$`, "9", r`$\tfrac{9}{4}$`, "2", "C"),
        markScheme: r`- **C** (1) — $\dfrac{dy}{dx} = \dfrac{3t^2 - 3}{2t} = \dfrac{9}{4}$ at $t = 2$.`,
        explanation: r`$\dfrac{dy}{dx} = \dfrac{dy/dt}{dx/dt}$. A divides the wrong way; B gives only $\dfrac{dy}{dt}$; D is the $y$-coordinate.`,
        status: "DRAFT",
    },
    {
        seedKey: "mat-wma14-differentiation-002",
        unitCode: "WMA14",
        topicSlug: "differentiation",
        type: "CALCULATION",
        difficulty: "HARD",
        marks: 6,
        stem: r`The curve $C$ has equation $x^2 + 3xy + y^2 = 11$.

Find an equation of the tangent to $C$ at the point $(1, 2)$, giving your answer in the form $ax + by + c = 0$, where $a$, $b$ and $c$ are integers.`,
        markScheme: r`- **M1** Differentiates $y^2$ implicitly to $2y\dfrac{dy}{dx}$ (1)
- **M1** Uses the product rule on $3xy$: $3y + 3x\dfrac{dy}{dx}$ (1)
- **A1** $2x + 3y + 3x\dfrac{dy}{dx} + 2y\dfrac{dy}{dx} = 0$ (1)
- **M1** Substitutes $(1, 2)$ and solves for $\dfrac{dy}{dx}$ (1)
- **A1** $\dfrac{dy}{dx} = -\tfrac{8}{7}$ (1)
- **A1** $8x + 7y - 22 = 0$ (1)`,
        explanation: r`Every term involving $y$ picks up a factor of $\dfrac{dy}{dx}$. Substituting the point **before** rearranging keeps the algebra simple: $8 + 7\dfrac{dy}{dx} = 0$.`,
        status: "DRAFT",
    },
    {
        seedKey: "mat-wma14-differentiation-003",
        unitCode: "WMA14",
        topicSlug: "differentiation",
        type: "CALCULATION",
        difficulty: "MEDIUM",
        marks: 3,
        stem: r`A spherical balloon is being inflated so that its volume increases at a constant rate of $50\,\text{cm}^3\,\text{s}^{-1}$.

Find the rate at which the radius is increasing when the radius is $5\,\text{cm}$. Give your answer to 3 significant figures.

(Volume of a sphere $V = \tfrac{4}{3}\pi r^3$.)`,
        markScheme: r`- **B1** $\dfrac{dV}{dr} = 4\pi r^2$ (1)
- **M1** Uses $\dfrac{dr}{dt} = \dfrac{dV}{dt} \div \dfrac{dV}{dr} = \dfrac{50}{4\pi(5^2)}$ (1)
- **A1** $\dfrac{dr}{dt} = \dfrac{1}{2\pi} = 0.159\,\text{cm s}^{-1}$ (1)`,
        explanation: r`Connected rates of change: write the chain rule so that the unwanted variables cancel, $\dfrac{dr}{dt} = \dfrac{dr}{dV} \times \dfrac{dV}{dt}$.`,
        status: "DRAFT",
    },

    // --- integration ---
    {
        seedKey: "mat-wma14-integration-001",
        unitCode: "WMA14",
        topicSlug: "integration",
        type: "MCQ",
        difficulty: "EASY",
        marks: 1,
        stem: r`Find $\displaystyle\int xe^x\,dx$.`,
        options: opts(
            r`$\tfrac{1}{2}x^2e^x + c$`,
            r`$xe^x - e^x + c$`,
            r`$xe^x + e^x + c$`,
            r`$e^x + c$`,
            "B",
        ),
        markScheme: r`- **B** (1) — by parts with $u = x$, $\dfrac{dv}{dx} = e^x$: $xe^x - \int e^x\,dx = xe^x - e^x + c$.`,
        explanation: r`You cannot integrate a product term by term (A). In integration by parts the second term is **subtracted** (C has the wrong sign).`,
        status: "DRAFT",
    },
    {
        seedKey: "mat-wma14-integration-002",
        unitCode: "WMA14",
        topicSlug: "integration",
        type: "CALCULATION",
        difficulty: "MEDIUM",
        marks: 5,
        stem: r`Use integration by parts to find the exact value of $\displaystyle\int_0^1 xe^{2x}\,dx$.`,
        markScheme: r`- **M1** Uses parts with $u = x$, $\dfrac{dv}{dx} = e^{2x}$ in the correct direction (1)
- **A1** $\tfrac{1}{2}xe^{2x} - \int \tfrac{1}{2}e^{2x}\,dx$ (1)
- **A1** $\tfrac{1}{2}xe^{2x} - \tfrac{1}{4}e^{2x}$ (1)
- **M1** Substitutes limits 1 and 0 and subtracts (1)
- **A1** $\dfrac{e^2 + 1}{4}$ (1)`,
        explanation: r`At the lower limit, $-\tfrac{1}{4}e^0 = -\tfrac{1}{4}$, and subtracting it gives $+\tfrac{1}{4}$. Forgetting the lower limit is the usual source of the wrong answer $\tfrac{e^2}{4}$.`,
        status: "DRAFT",
    },
    {
        seedKey: "mat-wma14-integration-003",
        unitCode: "WMA14",
        topicSlug: "integration",
        type: "CALCULATION",
        difficulty: "HARD",
        marks: 5,
        stem: r`Given that $y = 4$ when $x = 0$, solve the differential equation

$$\frac{dy}{dx} = 6x\sqrt{y}, \quad y > 0$$

giving your answer in the form $y = f(x)$.`,
        markScheme: r`- **M1** Separates the variables: $\int y^{-\frac{1}{2}}\,dy = \int 6x\,dx$ (1)
- **A1** $2y^{\frac{1}{2}} = 3x^2 + c$ (1)
- **M1** Uses $x = 0$, $y = 4$ to find the constant (1)
- **A1** $c = 4$ (1)
- **A1** $y = \dfrac{(3x^2 + 4)^2}{4}$ (1)`,
        explanation: r`Find $c$ **before** rearranging, then square both sides of $\sqrt{y} = \dfrac{3x^2 + 4}{2}$. Squaring before adding $c$ is a common error.`,
        status: "DRAFT",
    },
    {
        seedKey: "mat-wma14-integration-004",
        unitCode: "WMA14",
        topicSlug: "integration",
        type: "CALCULATION",
        difficulty: "MEDIUM",
        marks: 4,
        stem: r`The region $R$ is bounded by the curve $y = 2\sqrt{x}$, the $x$-axis and the line $x = 3$.

$R$ is rotated through $2\pi$ radians about the $x$-axis. Find the exact volume of the solid generated.`,
        markScheme: r`- **M1** Uses $V = \pi\int y^2\,dx$ (1)
- **A1** $y^2 = 4x$ (1)
- **M1** Integrates and applies limits 0 and 3: $\pi\left[2x^2\right]_0^3$ (1)
- **A1** $V = 18\pi$ (1)`,
        explanation: r`Square $y$ before integrating: $(2\sqrt{x})^2 = 4x$. Forgetting the $\pi$ or integrating $y$ rather than $y^2$ are the two classic slips.`,
        status: "DRAFT",
    },

    // --- vectors ---
    {
        seedKey: "mat-wma14-vectors-001",
        unitCode: "WMA14",
        topicSlug: "vectors",
        type: "MCQ",
        difficulty: "MEDIUM",
        marks: 1,
        stem: r`Find the angle between the vectors $\mathbf{a} = 2\mathbf{i} - \mathbf{j} + 2\mathbf{k}$ and $\mathbf{b} = \mathbf{i} + 2\mathbf{j} + 2\mathbf{k}$, to 1 decimal place.`,
        options: opts(r`$26.4^\circ$`, r`$63.6^\circ$`, r`$116.4^\circ$`, r`$87.2^\circ$`, "B"),
        markScheme: r`- **B** (1) — $\mathbf{a} \cdot \mathbf{b} = 2 - 2 + 4 = 4$, $|\mathbf{a}| = |\mathbf{b}| = 3$, so $\cos\theta = \tfrac{4}{9}$ and $\theta = 63.6^\circ$.`,
        explanation: r`$\cos\theta = \dfrac{\mathbf{a} \cdot \mathbf{b}}{|\mathbf{a}||\mathbf{b}|}$. A uses inverse sine; C has the wrong sign; D divides by $9 \times 9$ instead of $3 \times 3$.`,
        status: "DRAFT",
    },
    {
        seedKey: "mat-wma14-vectors-002",
        unitCode: "WMA14",
        topicSlug: "vectors",
        type: "CALCULATION",
        difficulty: "HARD",
        marks: 7,
        stem: r`The lines $l_1$ and $l_2$ have vector equations

$$l_1: \mathbf{r} = \begin{pmatrix} 1 \\ 2 \\ -1 \end{pmatrix} + \lambda\begin{pmatrix} 2 \\ 1 \\ 1 \end{pmatrix}, \qquad l_2: \mathbf{r} = \begin{pmatrix} 6 \\ 3 \\ 4 \end{pmatrix} + \mu\begin{pmatrix} 1 \\ -1 \\ 3 \end{pmatrix}$$

(a) Show that $l_1$ and $l_2$ intersect, and find the coordinates of their point of intersection.

(b) Find the acute angle between $l_1$ and $l_2$, giving your answer to 1 decimal place.`,
        markScheme: r`- **M1** Equates two components, e.g. $1 + 2\lambda = 6 + \mu$ and $2 + \lambda = 3 - \mu$ (1)
- **M1** Solves the pair simultaneously (1)
- **A1** $\lambda = 2$, $\mu = -1$ (1)
- **B1** Checks the third component: $-1 + 2 = 1$ and $4 + 3(-1) = 1$, so the lines intersect (1)
- **A1** Point of intersection $(5, 4, 1)$ (1)
- **M1** Uses the scalar product of the direction vectors: $\cos\theta = \dfrac{4}{\sqrt{6}\sqrt{11}}$ (1)
- **A1** $\theta = 60.5^\circ$ (1)`,
        explanation: r`Two equations find $\lambda$ and $\mu$; the **third** must also be satisfied, otherwise the lines are skew. Use the direction vectors (not the position vectors) for the angle.`,
        status: "DRAFT",
    },
    {
        seedKey: "mat-wma14-vectors-003",
        unitCode: "WMA14",
        topicSlug: "vectors",
        type: "CALCULATION",
        difficulty: "EASY",
        marks: 4,
        stem: r`The points $A$ and $B$ have coordinates $(1, 0, 3)$ and $(4, -2, 9)$ respectively.

(a) Find $|\overrightarrow{AB}|$.

(b) Find the coordinates of the point $C$ such that $B$ is the midpoint of $AC$.`,
        markScheme: r`- **M1** $\overrightarrow{AB} = 3\mathbf{i} - 2\mathbf{j} + 6\mathbf{k}$ (1)
- **A1** $|\overrightarrow{AB}| = \sqrt{9 + 4 + 36} = 7$ (1)
- **M1** Uses $\overrightarrow{OC} = \overrightarrow{OA} + 2\overrightarrow{AB}$ (or $\overrightarrow{OB} + \overrightarrow{AB}$) (1)
- **A1** $C(7, -4, 15)$ (1)`,
        explanation: r`$\overrightarrow{AB} = \mathbf{b} - \mathbf{a}$ (end minus start). If $B$ is the midpoint of $AC$, then $\overrightarrow{BC} = \overrightarrow{AB}$.`,
        status: "DRAFT",
    },
];

export const mathematicsPureQuestions: SeedQuestion[] = [...wma11, ...wma12, ...wma13, ...wma14];
