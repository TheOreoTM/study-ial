// Key equations for each Physics unit, grouped by topic code. Original summaries of standard physics, written for
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
                { tex: "\\Delta E_{grav} = mg\\Delta h", meaning: "change in gravitational potential energy near the Earth" },
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
                { tex: "\\Delta E_{el} = \\tfrac{1}{2}F\\Delta x", meaning: "elastic strain energy: area under a force–extension line" },
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
                { tex: "hf = \\phi + \\tfrac{1}{2}mv_{max}^2", meaning: "photoelectric effect ($\\phi$ = work function)" },
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
                { tex: "V_{out} = \\dfrac{R_2}{R_1 + R_2}V_{in}", meaning: "potential divider output across $R_2$" },
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
                { tex: "v_{max} = \\omega A", meaning: "maximum speed, at the centre" },
                { tex: "T = 2\\pi\\sqrt{\\dfrac{m}{k}}", meaning: "period of a mass on a spring" },
                { tex: "T = 2\\pi\\sqrt{\\dfrac{l}{g}}", meaning: "period of a simple pendulum (small swings)" },
            ],
        },
        {
            topic: "5.6",
            equations: [
                { tex: "F = \\dfrac{Gm_1m_2}{r^2}", meaning: "Newton's law of gravitation" },
                { tex: "g = \\dfrac{GM}{r^2}", meaning: "gravitational field strength of a point mass" },
                { tex: "V_{grav} = -\\dfrac{GM}{r}", meaning: "gravitational potential (zero at infinity)" },
            ],
        },
        {
            topic: "5.7",
            equations: [
                { tex: "L = \\sigma AT^4", meaning: "Stefan–Boltzmann law: luminosity of a star" },
                { tex: "\\lambda_{max}T = 2.898\\times10^{-3}\\,\\text{m K}", meaning: "Wien's law: peak wavelength and temperature" },
                { tex: "I = \\dfrac{L}{4\\pi d^2}", meaning: "intensity (flux) at distance $d$: inverse square law" },
                { tex: "z = \\dfrac{\\Delta\\lambda}{\\lambda} \\approx \\dfrac{v}{c}", meaning: "red shift for $v \\ll c$" },
                { tex: "v = H_0d", meaning: "Hubble's law; $1/H_0$ estimates the age of the universe" },
            ],
        },
    ],
};
