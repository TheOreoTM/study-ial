import type { SeedQuestion } from "../types";

// Extra original questions for the two practical-skills papers (WPH13, WPH16), which had six questions each: too few
// to practise properly or to fill a timed paper. Written for Study-IAL in the style of the papers, not copied from
// them. Every number was re-derived when writing. Seeded as DRAFT so an admin checks them before students see them.

// String.raw keeps LaTeX backslashes intact (e.g. \text, \times) inside template literals.
const r = String.raw;

type Label = "A" | "B" | "C" | "D";
function opts(a: string, b: string, c: string, d: string, correct: Label): NonNullable<SeedQuestion["options"]> {
    return (["A", "B", "C", "D"] as const).map((label, i) => ({ label, text: [a, b, c, d][i], isCorrect: label === correct }));
}

const wph13: SeedQuestion[] = [
    {
        seedKey: "phy-wph13-measurement-uncertainty-003",
        unitCode: "WPH13",
        topicSlug: "measurement-uncertainty",
        type: "MCQ",
        difficulty: "EASY",
        marks: 1,
        stem: r`A student times 10 complete swings of a pendulum with a stopwatch that reads to $0.01\,\text{s}$. The total time is $15.6\,\text{s}$, and her reaction time is about $0.2\,\text{s}$.

What is the best estimate of the uncertainty in the time for **one** swing?`,
        options: opts(r`$0.01\,\text{s}$`, r`$0.02\,\text{s}$`, r`$0.2\,\text{s}$`, r`$1.56\,\text{s}$`, "B"),
        markScheme: r`- **B** (1) — reaction time dominates the stopwatch's resolution; $0.2\,\text{s} \div 10 = 0.02\,\text{s}$.`,
        explanation: r`Human reaction time, not the display, limits hand timing. Timing many swings and dividing shares that uncertainty between them, which is why the period is never timed from one swing.`,
        status: "DRAFT",
    },
    {
        seedKey: "phy-wph13-measurement-uncertainty-004",
        unitCode: "WPH13",
        topicSlug: "measurement-uncertainty",
        type: "CALCULATION",
        difficulty: "MEDIUM",
        marks: 3,
        stem: r`A student measures the diameter of a wire at five places along its length with a micrometer:

| Reading | 1 | 2 | 3 | 4 | 5 |
| --- | --- | --- | --- | --- | --- |
| Diameter / mm | 0.52 | 0.50 | 0.53 | 0.51 | 0.49 |

Calculate the mean diameter, its uncertainty, and the percentage uncertainty.`,
        markScheme: r`- Mean $= 2.55/5 = 0.51\,\text{mm}$ (1)
- Uncertainty $=$ half the range $= (0.53 - 0.49)/2 = 0.02\,\text{mm}$ (1)
- Percentage uncertainty $= (0.02/0.51) \times 100\% = 3.9\%$ (1)`,
        explanation: r`With repeated readings, half the range is a quick, accepted estimate of the uncertainty in the mean. Measuring at different places and orientations also averages out a wire that isn't perfectly round.`,
        status: "DRAFT",
    },
    {
        seedKey: "phy-wph13-measurement-uncertainty-005",
        unitCode: "WPH13",
        topicSlug: "measurement-uncertainty",
        type: "MCQ",
        difficulty: "EASY",
        marks: 1,
        stem: r`A student measures a rectangle as $2.4\,\text{cm}$ by $1.35\,\text{cm}$ and multiplies the two to find its area.

How should the area be recorded?`,
        options: opts(r`$3.24\,\text{cm}^2$`, r`$3\,\text{cm}^2$`, r`$3.2\,\text{cm}^2$`, r`$3.240\,\text{cm}^2$`, "C"),
        markScheme: r`- **C** (1) — $2.4 \times 1.35 = 3.24$; the least precise measurement has 2 significant figures, so the answer has 2.`,
        explanation: r`Give a calculated value to the same number of significant figures as the least precise data it came from. Extra figures claim a precision the measurements don't have.`,
        status: "DRAFT",
    },
    {
        seedKey: "phy-wph13-experimental-design-003",
        unitCode: "WPH13",
        topicSlug: "experimental-design",
        type: "SHORT",
        difficulty: "EASY",
        marks: 3,
        stem: r`A student investigates how the time period of a mass oscillating on a spring depends on the mass.

Identify the independent variable, the dependent variable and **one** variable that must be controlled.`,
        markScheme: r`- Independent variable: the mass on the spring (1)
- Dependent variable: the time period of the oscillation (1)
- Control variable: the same spring (spring constant), or keeping the amplitude small (1)`,
        explanation: r`The independent variable is the one you change, the dependent variable is the one you measure, and control variables are kept the same so that only the independent variable can cause the change.`,
        status: "DRAFT",
    },
    {
        seedKey: "phy-wph13-experimental-design-004",
        unitCode: "WPH13",
        topicSlug: "experimental-design",
        type: "MCQ",
        difficulty: "EASY",
        marks: 1,
        stem: r`A student reads the position of a pointer against a vertical metre rule to find the extension of a spring.

What should the student do to reduce **parallax** error?`,
        options: opts(
            "repeat each reading three times and find the mean",
            "use a longer spring",
            "measure from the top of the spring instead of the bottom",
            "read the scale with the eye level with the pointer, perpendicular to the rule",
            "D",
        ),
        markScheme: r`- **D** (1) — parallax comes from viewing the scale at an angle; looking straight on removes it.`,
        explanation: r`Repeating readings reduces random error but not parallax, which shifts every reading taken from the same eye position. A set square against the rule helps line up the pointer too.`,
        status: "DRAFT",
    },
    {
        seedKey: "phy-wph13-data-analysis-graphs-003",
        unitCode: "WPH13",
        topicSlug: "data-analysis-graphs",
        type: "MCQ",
        difficulty: "MEDIUM",
        marks: 1,
        stem: r`On a graph with error bars, a student's best-fit line has a gradient of $2.50$. The steepest line that still passes through all the error bars has a gradient of $2.65$.

What is the percentage uncertainty in the gradient?`,
        options: opts("6%", "0.15%", "3%", "15%", "A"),
        markScheme: r`- **A** (1) — $(2.65 - 2.50)/2.50 \times 100\% = 6\%$.`,
        explanation: r`The worst acceptable line through the error bars shows how far the gradient could reasonably be from the best-fit value. Compare the difference with the best-fit gradient to get a percentage.`,
        status: "DRAFT",
    },
    {
        seedKey: "phy-wph13-data-analysis-graphs-004",
        unitCode: "WPH13",
        topicSlug: "data-analysis-graphs",
        type: "CALCULATION",
        difficulty: "MEDIUM",
        marks: 3,
        stem: r`A student measures the potential difference $V$ across a resistor for different currents $I$:

| $I$ / A | 0.10 | 0.20 | 0.30 | 0.40 | 0.50 |
| --- | --- | --- | --- | --- | --- |
| $V$ / V | 0.52 | 1.01 | 1.85 | 2.03 | 2.49 |

(a) Identify the anomalous result.

(b) Use the other results to determine the resistance of the resistor.`,
        markScheme: r`- (a) The reading at $0.30\,\text{A}$ ($1.85\,\text{V}$): it should be about $1.5\,\text{V}$ (1)
- (b) Gradient of a $V$–$I$ graph (best-fit line ignoring the anomaly), e.g. $(2.49 - 0.52)/(0.50 - 0.10)$ (1)
- $R = 5.0\,\Omega$ (accept $4.9$–$5.1\,\Omega$) (1)`,
        explanation: r`An anomalous point lies well away from the trend set by the others; leave it out of the best-fit line (and ideally repeat it). Using the gradient rather than a single $V/I$ makes the result less sensitive to any one reading.`,
        status: "DRAFT",
    },
    {
        seedKey: "phy-wph13-data-analysis-graphs-005",
        unitCode: "WPH13",
        topicSlug: "data-analysis-graphs",
        type: "SHORT",
        difficulty: "EASY",
        marks: 2,
        stem: r`Explain why a value found from the gradient of a graph of several results is usually more reliable than one calculated from a single pair of readings.`,
        markScheme: r`- A best-fit line averages out random errors across all the readings (1)
- Anomalous results are easy to spot and leave out, and a systematic offset (such as a zero error) shows as an intercept instead of changing the gradient (1)`,
        explanation: r`This is the reason most practical write-ups ask for a graph: the gradient uses every reading, and the intercept exposes systematic errors that a single calculation would hide.`,
        status: "DRAFT",
    },
    {
        seedKey: "phy-wph13-experimental-design-005",
        unitCode: "WPH13",
        topicSlug: "experimental-design",
        type: "SHORT",
        difficulty: "MEDIUM",
        marks: 2,
        stem: r`In an experiment to find the resistivity of a wire, a student uses a high current, and the readings drift while the circuit is switched on.

Explain why the readings drift and how the student should change the method.`,
        markScheme: r`- The current heats the wire, and the resistance of a metal increases with temperature (1)
- Use a small current and switch off between readings, so the wire stays at room temperature (1)`,
        explanation: r`Heating is a hidden variable in many electrical experiments. Small currents, short readings and letting the wire cool keep temperature effectively controlled.`,
        status: "DRAFT",
    },
];

const wph16: SeedQuestion[] = [
    {
        seedKey: "phy-wph16-advanced-uncertainty-003",
        unitCode: "WPH16",
        topicSlug: "advanced-uncertainty",
        type: "MCQ",
        difficulty: "EASY",
        marks: 1,
        stem: r`The radius of a ball bearing is measured with a percentage uncertainty of $2\%$. Its volume is calculated from $V = \tfrac{4}{3}\pi r^3$.

What is the percentage uncertainty in the volume?`,
        options: opts("2%", "4%", "6%", "8%", "C"),
        markScheme: r`- **C** (1) — a quantity cubed contributes three times its percentage uncertainty: $3 \times 2\% = 6\%$.`,
        explanation: r`The constants $\tfrac{4}{3}$ and $\pi$ are exact, so they add no uncertainty. Powers multiply percentage uncertainties, which is why the radius must be measured as precisely as possible.`,
        status: "DRAFT",
    },
    {
        seedKey: "phy-wph16-advanced-uncertainty-004",
        unitCode: "WPH16",
        topicSlug: "advanced-uncertainty",
        type: "CALCULATION",
        difficulty: "HARD",
        marks: 3,
        stem: r`A student finds the acceleration of free fall with a simple pendulum, using $g = \dfrac{4\pi^2 l}{T^2}$. The results are:

- length $l = 1.000 \pm 0.002\,\text{m}$
- period $T = 2.01 \pm 0.02\,\text{s}$

Calculate $g$ and its absolute uncertainty.`,
        markScheme: r`- $g = 4\pi^2 \times 1.000 / 2.01^2 = 9.77\,\text{m s}^{-2}$ (1)
- Percentage uncertainty $= 0.2\% + 2 \times 1.0\% = 2.2\%$ (the period is squared) (1)
- Absolute uncertainty $\approx 0.2\,\text{m s}^{-2}$, so $g = (9.8 \pm 0.2)\,\text{m s}^{-2}$ (1)`,
        explanation: r`The period dominates the uncertainty because it is squared. Timing many oscillations is the usual way to bring it down.`,
        status: "DRAFT",
    },
    {
        seedKey: "phy-wph16-logarithmic-graphs-003",
        unitCode: "WPH16",
        topicSlug: "logarithmic-graphs",
        type: "MCQ",
        difficulty: "MEDIUM",
        marks: 1,
        stem: r`Two quantities are thought to be related by $y = kx^n$, where $k$ and $n$ are constants.

A graph of $\ln y$ against $\ln x$ is a straight line. What is its gradient?`,
        options: opts(r`$\ln k$`, r`$k$`, r`$1/n$`, r`$n$`, "D"),
        markScheme: r`- **D** (1) — $\ln y = n \ln x + \ln k$, so the gradient is $n$ and the intercept is $\ln k$.`,
        explanation: r`Taking logs turns a power law into a straight line. Read the power from the gradient and find $k$ as $e^{\text{intercept}}$.`,
        status: "DRAFT",
    },
    {
        seedKey: "phy-wph16-logarithmic-graphs-004",
        unitCode: "WPH16",
        topicSlug: "logarithmic-graphs",
        type: "CALCULATION",
        difficulty: "MEDIUM",
        marks: 3,
        stem: r`A capacitor discharges through a $50\,\text{k}\Omega$ resistor. A graph of $\ln(V/\text{V})$ against time $t$ is a straight line with a gradient of $-0.040\,\text{s}^{-1}$.

Calculate the capacitance.`,
        markScheme: r`- $V = V_0 e^{-t/RC}$, so $\ln V = \ln V_0 - t/RC$ and the gradient is $-1/RC$ (1)
- $RC = 1/0.040 = 25\,\text{s}$ (1)
- $C = 25 / (50 \times 10^3) = 5.0 \times 10^{-4}\,\text{F}$ ($500\,\mu\text{F}$) (1)`,
        explanation: r`Exponential decay becomes a straight line when you plot the log of the decaying quantity against time; the gradient is minus one over the time constant.`,
        status: "DRAFT",
    },
    {
        seedKey: "phy-wph16-logarithmic-graphs-005",
        unitCode: "WPH16",
        topicSlug: "logarithmic-graphs",
        type: "SHORT",
        difficulty: "MEDIUM",
        marks: 2,
        stem: r`Explain why a graph of $\log y$ against $\log x$ is useful when you suspect $y = kx^n$ but don't know $n$.`,
        markScheme: r`- $\log y = n\log x + \log k$, which is a straight line whatever the value of $n$ (1)
- The gradient gives $n$ and the intercept gives $\log k$, so both constants can be found from one graph (1)`,
        explanation: r`Without logs you would have to guess $n$ and try plotting $y$ against $x^n$ for each guess. The log–log graph finds it in one go, and a straight line also confirms the power-law form.`,
        status: "DRAFT",
    },
    {
        seedKey: "phy-wph16-core-practicals-003",
        unitCode: "WPH16",
        topicSlug: "core-practicals",
        type: "MCQ",
        difficulty: "MEDIUM",
        marks: 1,
        stem: r`A student finds the specific heat capacity of an aluminium block by heating it with an electric heater for 10 minutes and measuring its temperature rise.

Which change would most reduce the largest source of error?`,
        options: opts(
            "wrapping the block in insulation",
            "using a heater with a lower power",
            "measuring the mass of the block several times",
            "starting the timer before switching the heater on",
            "A",
        ),
        markScheme: r`- **A** (1) — energy lost to the surroundings is the largest error; insulation reduces it.`,
        explanation: r`Heat loss makes the measured temperature rise too small, so the calculated specific heat capacity is too large. A lower-power heater would make the losses relatively worse, because the experiment takes longer.`,
        status: "DRAFT",
    },
    {
        seedKey: "phy-wph16-core-practicals-004",
        unitCode: "WPH16",
        topicSlug: "core-practicals",
        type: "MCQ",
        difficulty: "MEDIUM",
        marks: 1,
        stem: r`In an investigation of a mass oscillating on a spring, a student plots $T^2$ against the mass $m$ and gets a straight line through the origin.

What does the gradient equal? ($k$ is the spring constant.)`,
        options: opts(r`$2\pi/k$`, r`$4\pi^2/k$`, r`$k/4\pi^2$`, r`$4\pi^2 k$`, "B"),
        markScheme: r`- **B** (1) — $T = 2\pi\sqrt{m/k}$, so $T^2 = (4\pi^2/k)\,m$.`,
        explanation: r`Square the equation so the variable you control appears to the first power. The spring constant is then $k = 4\pi^2/\text{gradient}$.`,
        status: "DRAFT",
    },
    {
        seedKey: "phy-wph16-core-practicals-005",
        unitCode: "WPH16",
        topicSlug: "core-practicals",
        type: "LONG",
        difficulty: "HARD",
        marks: 4,
        stem: r`Describe how a student could use a voltage sensor and data logger to investigate the discharge of a capacitor through a resistor, and use the results to find the time constant.`,
        markScheme: r`- Charge the capacitor to a known p.d. from a d.c. supply, then use a switch to disconnect the supply and discharge it through the resistor (1)
- Record the p.d. across the capacitor against time with the data logger, at a sampling rate suited to the time constant (1)
- Plot $\ln V$ against $t$; it should be a straight line (1)
- Time constant $RC = -1/\text{gradient}$ (or the time for $V$ to fall to $0.37V_0$) (1)`,
        explanation: r`A data logger avoids reaction-time errors and records many points quickly, which matters for short time constants. The straight log graph also checks that the discharge really is exponential.`,
        status: "DRAFT",
    },
];

export const physicsPracticalQuestions: SeedQuestion[] = [...wph13, ...wph16];
