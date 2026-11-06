// Key equations (Physics, Chemistry, Biology) and key formulae (Mathematics) for each unit, grouped by topic code. Original summaries of standard physics, written for
// Study-IAL (not copied from any data or formulae sheet). Shown on unit pages; tested in key-equations.test.ts so every
// topic code exists and every formula renders.

export type KeyEquation = {
    /** KaTeX, without $ delimiters */
    tex: string;
    /** What the symbols mean, in plain words (Markdown, may use $…$) */
    meaning: string;
};

export type KeyEquationGroup = { topic: string; equations: KeyEquation[] };

export const keyEquations: Record<string, KeyEquationGroup[]> = {
    WPH11: [
        {
            topic: "1.1",
            equations: [
                { tex: "v = u + at", meaning: "final velocity from initial velocity $u$, acceleration $a$ and time $t$" },
                { tex: "s = \\tfrac{1}{2}(u + v)t", meaning: "displacement from the average of the start and end velocities" },
                { tex: "s = ut + \\tfrac{1}{2}at^2", meaning: "displacement under constant acceleration" },
                { tex: "v^2 = u^2 + 2as", meaning: "links velocities and displacement without time" },
            ],
        },
        {
            topic: "1.2",
            equations: [
                { tex: "\\Sigma F = ma", meaning: "resultant force equals mass × acceleration (Newton's second law)" },
                { tex: "W = mg", meaning: "weight from mass and gravitational field strength $g$" },
                { tex: "\\text{moment} = Fx", meaning: "force × perpendicular distance from the pivot" },
            ],
        },
        {
            topic: "1.3",
            equations: [{ tex: "p = mv", meaning: "momentum; total momentum is conserved when no external force acts" }],
        },
        {
            topic: "1.4",
            equations: [
                { tex: "\\Delta W = F\\Delta s", meaning: "work done by a force along its line of action" },
                { tex: "E_k = \\tfrac{1}{2}mv^2", meaning: "kinetic energy" },
                { tex: "\\Delta E_{\\text{grav}} = mg\\Delta h", meaning: "change in gravitational potential energy near the Earth" },
                { tex: "P = \\dfrac{E}{t} = \\dfrac{W}{t}", meaning: "power is the rate of transferring energy or doing work" },
                {
                    tex: "\\text{efficiency} = \\dfrac{\\text{useful output}}{\\text{total input}}",
                    meaning: "for energy or power; never more than 1 (100%)",
                },
            ],
        },
        {
            topic: "1.5",
            equations: [
                { tex: "\\rho = \\dfrac{m}{V}", meaning: "density from mass and volume" },
                { tex: "\\text{upthrust} = \\text{weight of fluid displaced}", meaning: "Archimedes' principle" },
                { tex: "F = 6\\pi\\eta r v", meaning: "Stokes' law: drag on a small sphere in laminar flow ($\\eta$ = viscosity)" },
            ],
        },
        {
            topic: "1.6",
            equations: [
                { tex: "\\Delta F = k\\Delta x", meaning: "Hooke's law, up to the limit of proportionality" },
                { tex: "\\sigma = \\dfrac{F}{A}", meaning: "stress: force per cross-sectional area" },
                { tex: "\\varepsilon = \\dfrac{\\Delta x}{x}", meaning: "strain: extension over original length (no units)" },
                { tex: "E = \\dfrac{\\sigma}{\\varepsilon}", meaning: "Young modulus" },
                { tex: "\\Delta E_{\\text{el}} = \\tfrac{1}{2}F\\Delta x", meaning: "elastic strain energy: area under a force–extension line" },
            ],
        },
    ],
    WPH12: [
        {
            topic: "2.1",
            equations: [
                { tex: "v = f\\lambda", meaning: "wave speed from frequency and wavelength" },
                { tex: "T = \\dfrac{1}{f}", meaning: "period and frequency" },
                { tex: "I = \\dfrac{P}{A}", meaning: "intensity: power per area the wave passes through" },
            ],
        },
        {
            topic: "2.2",
            equations: [
                { tex: "v = \\sqrt{\\dfrac{T}{\\mu}}", meaning: "speed of a wave on a string ($T$ = tension, $\\mu$ = mass per unit length)" },
                { tex: "\\lambda = 2L", meaning: "fundamental mode of a string fixed at both ends (nodes $\\tfrac{\\lambda}{2}$ apart)" },
            ],
        },
        {
            topic: "2.3",
            equations: [
                { tex: "n_1 \\sin\\theta_1 = n_2 \\sin\\theta_2", meaning: "Snell's law at a boundary" },
                { tex: "n = \\dfrac{c}{v}", meaning: "refractive index from the speed of light in the material" },
                { tex: "\\sin C = \\dfrac{1}{n}", meaning: "critical angle, going from the material into air" },
                { tex: "P = \\dfrac{1}{f}", meaning: "power of a lens in dioptres ($f$ in metres)" },
                { tex: "\\dfrac{1}{u} + \\dfrac{1}{v} = \\dfrac{1}{f}", meaning: "thin lens equation (real-is-positive)" },
                { tex: "m = \\dfrac{v}{u}", meaning: "magnification from image and object distances" },
            ],
        },
        {
            topic: "2.4",
            equations: [
                { tex: "n\\lambda = d\\sin\\theta", meaning: "diffraction grating: order $n$, slit spacing $d$" },
            ],
        },
        {
            topic: "2.5",
            equations: [
                { tex: "E = hf", meaning: "energy of a photon ($h$ = Planck constant)" },
                { tex: "hf = \\phi + \\tfrac{1}{2}mv_{\\text{max}}^2", meaning: "photoelectric effect ($\\phi$ = work function)" },
                { tex: "\\lambda = \\dfrac{h}{p}", meaning: "de Broglie wavelength of a particle with momentum $p$" },
                { tex: "1\\,\\text{eV} = 1.6\\times10^{-19}\\,\\text{J}", meaning: "converting electronvolts to joules" },
            ],
        },
        {
            topic: "2.6",
            equations: [
                { tex: "I = \\dfrac{\\Delta Q}{\\Delta t}", meaning: "current is the rate of flow of charge" },
                { tex: "V = \\dfrac{W}{Q}", meaning: "potential difference: energy transferred per unit charge" },
                { tex: "I = nqvA", meaning: "drift velocity $v$ ($n$ = charge carriers per unit volume)" },
            ],
        },
        {
            topic: "2.7",
            equations: [
                { tex: "R = \\dfrac{V}{I}", meaning: "resistance (Ohm's law when $R$ is constant)" },
                { tex: "R = \\dfrac{\\rho l}{A}", meaning: "resistance of a wire from resistivity $\\rho$, length and area" },
                { tex: "P = VI = I^2R = \\dfrac{V^2}{R}", meaning: "electrical power" },
                { tex: "R = R_1 + R_2 + \\dots", meaning: "resistors in series" },
                { tex: "\\dfrac{1}{R} = \\dfrac{1}{R_1} + \\dfrac{1}{R_2} + \\dots", meaning: "resistors in parallel" },
            ],
        },
        {
            topic: "2.8",
            equations: [
                { tex: "\\varepsilon = I(R + r)", meaning: "e.m.f. with internal resistance $r$" },
                { tex: "V = \\varepsilon - Ir", meaning: "terminal p.d. drops as current rises" },
                { tex: "V_{\\text{out}} = \\dfrac{R_2}{R_1 + R_2}V_{\\text{in}}", meaning: "potential divider output across $R_2$" },
            ],
        },
    ],
    WPH14: [
        {
            topic: "4.1",
            equations: [
                { tex: "F = \\dfrac{\\Delta p}{\\Delta t}", meaning: "force is the rate of change of momentum" },
                { tex: "E_k = \\dfrac{p^2}{2m}", meaning: "kinetic energy from momentum (useful in collisions)" },
            ],
        },
        {
            topic: "4.2",
            equations: [
                { tex: "\\omega = \\dfrac{\\Delta\\theta}{\\Delta t} = \\dfrac{2\\pi}{T}", meaning: "angular velocity" },
                { tex: "v = \\omega r", meaning: "linear speed on a circle of radius $r$" },
                { tex: "a = \\dfrac{v^2}{r} = r\\omega^2", meaning: "centripetal acceleration, towards the centre" },
                { tex: "F = \\dfrac{mv^2}{r}", meaning: "resultant (centripetal) force needed" },
            ],
        },
        {
            topic: "4.3",
            equations: [
                { tex: "E = \\dfrac{F}{Q}", meaning: "electric field strength: force per unit charge" },
                { tex: "F = \\dfrac{Q_1Q_2}{4\\pi\\varepsilon_0 r^2}", meaning: "Coulomb's law between point charges" },
                { tex: "E = \\dfrac{Q}{4\\pi\\varepsilon_0 r^2}", meaning: "field of a point charge" },
                { tex: "E = \\dfrac{V}{d}", meaning: "uniform field between parallel plates" },
                { tex: "V = \\dfrac{Q}{4\\pi\\varepsilon_0 r}", meaning: "potential of a point charge" },
            ],
        },
        {
            topic: "4.4",
            equations: [
                { tex: "C = \\dfrac{Q}{V}", meaning: "capacitance" },
                { tex: "W = \\tfrac{1}{2}QV = \\tfrac{1}{2}CV^2", meaning: "energy stored: area under a $Q$–$V$ graph" },
                { tex: "Q = Q_0e^{-t/RC}", meaning: "discharge through a resistor; $RC$ is the time constant" },
            ],
        },
        {
            topic: "4.5",
            equations: [
                { tex: "F = BIl\\sin\\theta", meaning: "force on a current-carrying wire in a field $B$" },
                { tex: "F = Bqv\\sin\\theta", meaning: "force on a moving charge" },
                { tex: "r = \\dfrac{p}{BQ}", meaning: "radius of a charged particle's circle in a uniform field" },
            ],
        },
        {
            topic: "4.6",
            equations: [
                { tex: "\\Phi = BA\\cos\\theta", meaning: "magnetic flux through an area" },
                { tex: "\\varepsilon = -\\dfrac{d(N\\Phi)}{dt}", meaning: "Faraday's and Lenz's laws: induced e.m.f." },
            ],
        },
        {
            topic: "4.7",
            equations: [
                { tex: "\\Delta E = c^2\\Delta m", meaning: "mass–energy equivalence" },
                { tex: "1\\,\\text{u} \\approx 931.5\\,\\text{MeV}/c^2", meaning: "atomic mass unit as energy" },
            ],
        },
    ],
    WPH15: [
        {
            topic: "5.1",
            equations: [
                { tex: "\\Delta E = mc\\Delta\\theta", meaning: "heating with specific heat capacity $c$" },
                { tex: "\\Delta E = L\\Delta m", meaning: "changing state with specific latent heat $L$" },
            ],
        },
        {
            topic: "5.2",
            equations: [
                { tex: "pV = NkT", meaning: "ideal gas equation ($N$ molecules, $k$ = Boltzmann constant, $T$ in kelvin)" },
                { tex: "\\tfrac{1}{2}m\\langle c^2\\rangle = \\tfrac{3}{2}kT", meaning: "average kinetic energy of a molecule" },
                { tex: "T(\\text{K}) = \\theta(^\\circ\\text{C}) + 273", meaning: "celsius to kelvin" },
            ],
        },
        {
            topic: "5.3",
            equations: [
                { tex: "A = \\lambda N", meaning: "activity from decay constant $\\lambda$" },
                { tex: "N = N_0e^{-\\lambda t}", meaning: "nuclei left after time $t$" },
                { tex: "t_{1/2} = \\dfrac{\\ln 2}{\\lambda}", meaning: "half-life" },
            ],
        },
        {
            topic: "5.4",
            equations: [
                {
                    tex: "\\Delta E = c^2\\Delta m",
                    meaning: "binding energy from the mass defect; fission and fusion release energy when binding energy per nucleon rises",
                },
            ],
        },
        {
            topic: "5.5",
            equations: [
                { tex: "a = -\\omega^2x", meaning: "the definition of simple harmonic motion" },
                { tex: "x = A\\cos\\omega t", meaning: "displacement, starting from maximum displacement" },
                { tex: "v_{\\text{max}} = \\omega A", meaning: "maximum speed, at the centre" },
                { tex: "T = 2\\pi\\sqrt{\\dfrac{m}{k}}", meaning: "period of a mass on a spring" },
                { tex: "T = 2\\pi\\sqrt{\\dfrac{l}{g}}", meaning: "period of a simple pendulum (small swings)" },
            ],
        },
        {
            topic: "5.6",
            equations: [
                { tex: "F = \\dfrac{Gm_1m_2}{r^2}", meaning: "Newton's law of gravitation" },
                { tex: "g = \\dfrac{GM}{r^2}", meaning: "gravitational field strength of a point mass" },
                { tex: "V_{\\text{grav}} = -\\dfrac{GM}{r}", meaning: "gravitational potential (zero at infinity)" },
            ],
        },
        {
            topic: "5.7",
            equations: [
                { tex: "L = \\sigma AT^4", meaning: "Stefan–Boltzmann law: luminosity of a star" },
                { tex: "\\lambda_{\\text{max}}T = 2.898\\times10^{-3}\\,\\text{m K}", meaning: "Wien's law: peak wavelength and temperature" },
                { tex: "I = \\dfrac{L}{4\\pi d^2}", meaning: "intensity (flux) at distance $d$: inverse square law" },
                { tex: "z = \\dfrac{\\Delta\\lambda}{\\lambda} \\approx \\dfrac{v}{c}", meaning: "red shift for $v \\ll c$" },
                { tex: "v = H_0d", meaning: "Hubble's law; $1/H_0$ estimates the age of the universe" },
            ],
        },
    ],
    WCH11: [
        {
            topic: "1.1",
            equations: [
                { tex: "n = \\dfrac{m}{M}", meaning: "moles from mass and molar mass" },
                { tex: "c = \\dfrac{n}{V}", meaning: "concentration in mol dm$^{-3}$, with $V$ in dm$^3$" },
                { tex: "N = nL", meaning: "number of particles ($L = 6.02\\times10^{23}\\,\\text{mol}^{-1}$)" },
                { tex: "pV = nRT", meaning: "ideal gas equation: $p$ in Pa, $V$ in m$^3$, $T$ in K" },
                { tex: "V = n \\times 24.0\\,\\text{dm}^3", meaning: "gas volume at room temperature and pressure" },
                {
                    tex: "\\%\\,\\text{yield} = \\dfrac{\\text{actual}}{\\text{theoretical}} \\times 100",
                    meaning: "how much product you actually got",
                },
                {
                    tex: "\\text{atom economy} = \\dfrac{M(\\text{desired product})}{\\sum M(\\text{all products})} \\times 100",
                    meaning: "how much of the reactants ends up in the product you want",
                },
            ],
        },
        {
            topic: "1.2",
            equations: [
                {
                    tex: "A_r = \\dfrac{\\sum(\\text{isotope mass} \\times \\text{abundance})}{\\sum \\text{abundance}}",
                    meaning: "relative atomic mass from a mass spectrum",
                },
            ],
        },
    ],
    WCH12: [
        {
            topic: "2.1",
            equations: [
                { tex: "Q = mc\\Delta T", meaning: "energy transferred; $m$ is the mass of the solution or water heated" },
                { tex: "\\Delta H = -\\dfrac{Q}{n}", meaning: "per mole of the limiting reactant; negative when the mixture warms" },
                {
                    tex: "\\Delta_r H = \\sum \\Delta_f H(\\text{products}) - \\sum \\Delta_f H(\\text{reactants})",
                    meaning: "Hess's law with enthalpies of formation",
                },
                {
                    tex: "\\Delta H = \\sum(\\text{bonds broken}) - \\sum(\\text{bonds made})",
                    meaning: "estimate from mean bond enthalpies",
                },
            ],
        },
        {
            topic: "2.4",
            equations: [
                { tex: "\\text{rate} = \\dfrac{\\Delta[\\text{X}]}{\\Delta t}", meaning: "change in concentration over time" },
            ],
        },
    ],
    WCH14: [
        {
            topic: "4.1",
            equations: [
                { tex: "\\text{rate} = k[\\text{A}]^m[\\text{B}]^n", meaning: "rate equation; orders $m$, $n$ come from experiments" },
                { tex: "t_{1/2} = \\dfrac{\\ln 2}{k}", meaning: "first-order reactions have a constant half-life" },
                { tex: "\\ln k = -\\dfrac{E_a}{RT} + \\ln A", meaning: "Arrhenius: plot $\\ln k$ against $1/T$, gradient $-E_a/R$" },
            ],
        },
        {
            topic: "4.2",
            equations: [
                {
                    tex: "\\Delta S_{\\text{total}} = \\Delta S_{\\text{system}} + \\Delta S_{\\text{surroundings}}",
                    meaning: "feasible when $\\Delta S_{\\text{total}} > 0$",
                },
                { tex: "\\Delta S_{\\text{surroundings}} = -\\dfrac{\\Delta H}{T}", meaning: "with $\\Delta H$ in J mol$^{-1}$" },
                { tex: "\\Delta G = \\Delta H - T\\Delta S_{\\text{system}}", meaning: "feasible when $\\Delta G < 0$" },
                { tex: "\\Delta G = -RT\\ln K", meaning: "links free energy and the equilibrium constant" },
            ],
        },
        {
            topic: "4.3",
            equations: [
                {
                    tex: "K_c = \\dfrac{[\\text{C}]^c[\\text{D}]^d}{[\\text{A}]^a[\\text{B}]^b}",
                    meaning: "for $a\\text{A} + b\\text{B} \\rightleftharpoons c\\text{C} + d\\text{D}$; only temperature changes it",
                },
                { tex: "p_A = x_A \\times p_{\\text{total}}", meaning: "partial pressure from the mole fraction, for $K_p$" },
            ],
        },
        {
            topic: "4.4",
            equations: [
                { tex: "\\text{pH} = -\\log_{10}[\\text{H}^+]", meaning: "and $[\\text{H}^+] = 10^{-\\text{pH}}$" },
                {
                    tex: "K_w = [\\text{H}^+][\\text{OH}^-]",
                    meaning: "$1.00\\times10^{-14}\\,\\text{mol}^2\\,\\text{dm}^{-6}$ at 298 K",
                },
                { tex: "K_a = \\dfrac{[\\text{H}^+][\\text{A}^-]}{[\\text{HA}]}", meaning: "acid dissociation constant; $\\text{p}K_a = -\\log K_a$" },
                { tex: "[\\text{H}^+] \\approx \\sqrt{K_a[\\text{HA}]}", meaning: "weak acid, assuming little dissociates" },
            ],
        },
    ],
    WCH15: [
        {
            topic: "5.1",
            equations: [
                {
                    tex: "E^\\circ_{\\text{cell}} = E^\\circ_{(+)} - E^\\circ_{(-)}",
                    meaning: "positive electrode (reduction) minus negative electrode; feasible when positive",
                },
                { tex: "\\Delta S_{\\text{total}} \\propto E^\\circ_{\\text{cell}}", meaning: "and $\\ln K \\propto E^\\circ_{\\text{cell}}$: a bigger e.m.f. means a more complete reaction" },
            ],
        },
    ],
    WMA11: [
        {
            topic: "1.1",
            equations: [
                { tex: "x = \\dfrac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}", meaning: "roots of $ax^2 + bx + c = 0$" },
                { tex: "b^2 - 4ac", meaning: "the discriminant: $> 0$ two real roots, $= 0$ one repeated root, $< 0$ none" },
                {
                    tex: "x^2 + bx + c = \\left(x + \\tfrac{b}{2}\\right)^2 - \\tfrac{b^2}{4} + c",
                    meaning: "completing the square: the turning point is at $x = -\\tfrac{b}{2}$",
                },
            ],
        },
        {
            topic: "1.2",
            equations: [
                { tex: "m = \\dfrac{y_2 - y_1}{x_2 - x_1}", meaning: "gradient between two points" },
                { tex: "y - y_1 = m(x - x_1)", meaning: "line through $(x_1, y_1)$ with gradient $m$" },
                { tex: "m_1 m_2 = -1", meaning: "perpendicular lines" },
            ],
        },
        {
            topic: "1.3",
            equations: [
                { tex: "\\dfrac{a}{\\sin A} = \\dfrac{b}{\\sin B} = \\dfrac{c}{\\sin C}", meaning: "sine rule" },
                { tex: "a^2 = b^2 + c^2 - 2bc\\cos A", meaning: "cosine rule" },
                { tex: "\\text{Area} = \\tfrac{1}{2}ab\\sin C", meaning: "area of any triangle" },
                { tex: "s = r\\theta, \\quad A = \\tfrac{1}{2}r^2\\theta", meaning: "arc length and sector area, $\\theta$ in radians" },
            ],
        },
        {
            topic: "1.4",
            equations: [{ tex: "\\dfrac{d}{dx}\\left(x^n\\right) = nx^{n-1}", meaning: "differentiating powers of $x$" }],
        },
        {
            topic: "1.5",
            equations: [
                { tex: "\\int x^n\\,dx = \\dfrac{x^{n+1}}{n+1} + c", meaning: "for $n \\neq -1$; don't forget $+c$" },
            ],
        },
    ],
    WMA12: [
        {
            topic: "2.3",
            equations: [{ tex: "(x - a)^2 + (y - b)^2 = r^2", meaning: "circle with centre $(a, b)$ and radius $r$" }],
        },
        {
            topic: "2.4",
            equations: [
                { tex: "u_n = a + (n - 1)d", meaning: "arithmetic sequence" },
                { tex: "S_n = \\tfrac{n}{2}\\left[2a + (n - 1)d\\right]", meaning: "sum of an arithmetic series" },
                { tex: "u_n = ar^{n-1}, \\quad S_n = \\dfrac{a(1 - r^n)}{1 - r}", meaning: "geometric sequence and series" },
                { tex: "S_\\infty = \\dfrac{a}{1 - r}", meaning: "sum to infinity, only when $|r| < 1$" },
                {
                    tex: "(a + b)^n = \\sum_{r=0}^{n} \\binom{n}{r} a^{n-r} b^r",
                    meaning: "binomial expansion for a positive integer $n$",
                },
            ],
        },
        {
            topic: "2.5",
            equations: [
                { tex: "\\log_a x = y \\iff a^y = x", meaning: "what a logarithm means" },
                { tex: "\\log a + \\log b = \\log ab, \\quad \\log a^n = n\\log a", meaning: "laws of logarithms (same base)" },
            ],
        },
        {
            topic: "2.6",
            equations: [
                { tex: "\\sin^2\\theta + \\cos^2\\theta = 1", meaning: "the Pythagorean identity" },
                { tex: "\\tan\\theta = \\dfrac{\\sin\\theta}{\\cos\\theta}", meaning: "where $\\cos\\theta \\neq 0$" },
            ],
        },
        {
            topic: "2.8",
            equations: [
                {
                    tex: "\\int_a^b y\\,dx \\approx \\tfrac{h}{2}\\left[y_0 + y_n + 2(y_1 + \\dots + y_{n-1})\\right]",
                    meaning: "trapezium rule with $n$ strips of width $h = \\tfrac{b - a}{n}$",
                },
            ],
        },
    ],
    WMA13: [
        {
            topic: "3.2",
            equations: [
                { tex: "1 + \\tan^2\\theta = \\sec^2\\theta", meaning: "and $1 + \\cot^2\\theta = \\operatorname{cosec}^2\\theta$" },
                { tex: "\\sin 2A = 2\\sin A\\cos A", meaning: "double angle" },
                { tex: "\\cos 2A = \\cos^2 A - \\sin^2 A", meaning: "also $2\\cos^2 A - 1$ and $1 - 2\\sin^2 A$" },
                {
                    tex: "a\\cos\\theta + b\\sin\\theta = R\\cos(\\theta - \\alpha)",
                    meaning: "with $R = \\sqrt{a^2 + b^2}$ and $\\tan\\alpha = \\tfrac{b}{a}$",
                },
            ],
        },
        {
            topic: "3.3",
            equations: [
                { tex: "e^{\\ln x} = x, \\quad \\ln e^x = x", meaning: "$e^x$ and $\\ln x$ undo each other" },
            ],
        },
        {
            topic: "3.4",
            equations: [
                { tex: "\\dfrac{d}{dx}e^{kx} = ke^{kx}, \\quad \\dfrac{d}{dx}\\ln x = \\dfrac{1}{x}", meaning: "exponentials and logs" },
                { tex: "\\dfrac{dy}{dx} = \\dfrac{dy}{du}\\cdot\\dfrac{du}{dx}", meaning: "chain rule" },
                { tex: "\\dfrac{d}{dx}(uv) = u\\dfrac{dv}{dx} + v\\dfrac{du}{dx}", meaning: "product rule" },
                {
                    tex: "\\dfrac{d}{dx}\\left(\\dfrac{u}{v}\\right) = \\dfrac{v\\frac{du}{dx} - u\\frac{dv}{dx}}{v^2}",
                    meaning: "quotient rule",
                },
            ],
        },
        {
            topic: "3.6",
            equations: [
                { tex: "x_{n+1} = x_n - \\dfrac{f(x_n)}{f'(x_n)}", meaning: "Newton–Raphson" },
            ],
        },
    ],
    WMA14: [
        {
            topic: "4.3",
            equations: [
                { tex: "\\dfrac{dy}{dx} = \\dfrac{dy/dt}{dx/dt}", meaning: "gradient of a parametric curve" },
            ],
        },
        {
            topic: "4.4",
            equations: [
                {
                    tex: "(1 + x)^n = 1 + nx + \\dfrac{n(n-1)}{2!}x^2 + \\dots",
                    meaning: "any rational $n$, valid for $|x| < 1$",
                },
            ],
        },
        {
            topic: "4.6",
            equations: [
                {
                    tex: "\\int u\\dfrac{dv}{dx}\\,dx = uv - \\int v\\dfrac{du}{dx}\\,dx",
                    meaning: "integration by parts",
                },
                { tex: "V = \\pi\\int_a^b y^2\\,dx", meaning: "volume of revolution about the $x$-axis" },
            ],
        },
        {
            topic: "4.7",
            equations: [
                { tex: "|\\mathbf{a}| = \\sqrt{x^2 + y^2 + z^2}", meaning: "magnitude of a vector" },
                { tex: "\\mathbf{a}\\cdot\\mathbf{b} = |\\mathbf{a}||\\mathbf{b}|\\cos\\theta", meaning: "scalar product and the angle between vectors" },
                { tex: "\\mathbf{r} = \\mathbf{a} + \\lambda\\mathbf{b}", meaning: "line through $\\mathbf{a}$ in direction $\\mathbf{b}$" },
            ],
        },
    ],
    WME01: [
        {
            topic: "1.3",
            equations: [
                { tex: "v = u + at, \\quad s = ut + \\tfrac{1}{2}at^2", meaning: "constant acceleration" },
                { tex: "v^2 = u^2 + 2as, \\quad s = \\tfrac{1}{2}(u + v)t", meaning: "constant acceleration" },
            ],
        },
        {
            topic: "1.4",
            equations: [
                { tex: "F = ma", meaning: "Newton's second law, along the direction of motion" },
                { tex: "I = mv - mu", meaning: "impulse equals change in momentum" },
            ],
        },
        {
            topic: "1.5",
            equations: [{ tex: "F \\leq \\mu R", meaning: "friction; $F = \\mu R$ when limiting (about to slip)" }],
        },
        {
            topic: "1.6",
            equations: [{ tex: "\\text{moment} = Fd", meaning: "force × perpendicular distance from the pivot" }],
        },
    ],
    WST01: [
        {
            topic: "1.2",
            equations: [
                { tex: "\\bar{x} = \\dfrac{\\sum x}{n}", meaning: "mean of $n$ values" },
                { tex: "\\sigma^2 = \\dfrac{\\sum x^2}{n} - \\bar{x}^2", meaning: "variance; the standard deviation is its square root" },
            ],
        },
        {
            topic: "1.3",
            equations: [
                { tex: "P(A \\cup B) = P(A) + P(B) - P(A \\cap B)", meaning: "addition rule" },
                { tex: "P(A \\mid B) = \\dfrac{P(A \\cap B)}{P(B)}", meaning: "conditional probability" },
                { tex: "P(A \\cap B) = P(A)P(B)", meaning: "only when $A$ and $B$ are independent" },
            ],
        },
        {
            topic: "1.4",
            equations: [
                { tex: "S_{xy} = \\sum xy - \\dfrac{\\sum x \\sum y}{n}", meaning: "and $S_{xx} = \\sum x^2 - \\tfrac{(\\sum x)^2}{n}$" },
                { tex: "r = \\dfrac{S_{xy}}{\\sqrt{S_{xx}S_{yy}}}", meaning: "product moment correlation coefficient" },
                { tex: "y = a + bx, \\quad b = \\dfrac{S_{xy}}{S_{xx}}, \\quad a = \\bar{y} - b\\bar{x}", meaning: "least squares regression line" },
            ],
        },
        {
            topic: "1.5",
            equations: [
                { tex: "E(X) = \\sum x\\,P(X = x)", meaning: "expected value" },
                { tex: "\\operatorname{Var}(X) = E(X^2) - [E(X)]^2", meaning: "variance of a discrete random variable" },
                {
                    tex: "E(aX + b) = aE(X) + b, \\quad \\operatorname{Var}(aX + b) = a^2\\operatorname{Var}(X)",
                    meaning: "coding a random variable",
                },
            ],
        },
        {
            topic: "1.6",
            equations: [{ tex: "Z = \\dfrac{X - \\mu}{\\sigma}", meaning: "standardising a Normal variable" }],
        },
    ],
    WBI12: [
        {
            topic: "2.1",
            equations: [
                {
                    tex: "\\text{magnification} = \\dfrac{\\text{image size}}{\\text{actual size}}",
                    meaning: "use the same units for both sizes (1 mm = 1000 μm)",
                },
            ],
        },
        {
            topic: "2.6",
            equations: [
                {
                    tex: "D = \\dfrac{N(N - 1)}{\\sum n(n - 1)}",
                    meaning: "index of diversity: $N$ = total organisms, $n$ = organisms of each species",
                },
            ],
        },
    ],
    WBI14: [
        {
            topic: "4.2",
            equations: [
                { tex: "\\text{NPP} = \\text{GPP} - R", meaning: "net primary productivity: what's left after respiration" },
                {
                    tex: "\\text{efficiency} = \\dfrac{\\text{energy passed on}}{\\text{energy received}} \\times 100",
                    meaning: "energy transfer between trophic levels, as a percentage",
                },
            ],
        },
    ],
    WBI15: [
        {
            topic: "5.2",
            equations: [
                { tex: "\\text{cardiac output} = \\text{stroke volume} \\times \\text{heart rate}", meaning: "volume of blood pumped per minute" },
                {
                    tex: "\\text{ventilation rate} = \\text{tidal volume} \\times \\text{breathing rate}",
                    meaning: "volume of air breathed per minute",
                },
            ],
        },
    ],
};
