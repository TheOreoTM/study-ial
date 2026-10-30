import type { SeedSubject } from "./types";

// Pearson Edexcel International AS/A Level Physics (YPH11 / XPH11), spec first teaching 2018.
// Topic slugs are a stable contract: questions reference them by [unitCode, slug].
export const physics: SeedSubject = {
    slug: "physics",
    code: "YPH11",
    name: "Physics",
    description: "Mechanics, waves, electricity, fields, nuclear physics and astrophysics.",
    color: "teal",
    units: [
        {
            code: "WPH11",
            number: 1,
            name: "Mechanics and Materials",
            topics: [
                { slug: "motion", code: "1.1", name: "Motion and kinematics" },
                { slug: "forces", code: "1.2", name: "Forces, moments and equilibrium" },
                { slug: "momentum", code: "1.3", name: "Momentum" },
                { slug: "work-energy-power", code: "1.4", name: "Work, energy and power" },
                { slug: "fluids", code: "1.5", name: "Density, upthrust and viscosity" },
                { slug: "solid-materials", code: "1.6", name: "Solid materials: Hooke's law, stress and strain" },
            ],
        },
        {
            code: "WPH12",
            number: 2,
            name: "Waves and Electricity",
            topics: [
                { slug: "progressive-waves", code: "2.1", name: "Progressive waves" },
                { slug: "superposition-stationary-waves", code: "2.2", name: "Superposition and stationary waves" },
                { slug: "refraction-optics", code: "2.3", name: "Refraction, lenses and polarisation" },
                { slug: "diffraction-interference", code: "2.4", name: "Diffraction and interference" },
                { slug: "quantum-physics", code: "2.5", name: "Wave–particle duality and the photoelectric effect" },
                { slug: "current-charge", code: "2.6", name: "Charge, current and potential difference" },
                { slug: "resistance-circuits", code: "2.7", name: "Resistance, resistivity and circuits" },
                { slug: "emf-internal-resistance", code: "2.8", name: "EMF, internal resistance and potential dividers" },
            ],
        },
        {
            code: "WPH13",
            number: 3,
            name: "Practical Skills in Physics I",
            topics: [
                { slug: "measurement-uncertainty", code: "3.1", name: "Measurement, uncertainty and precision" },
                { slug: "experimental-design", code: "3.2", name: "Planning and experimental design" },
                { slug: "data-analysis-graphs", code: "3.3", name: "Data analysis and graphs" },
            ],
        },
        {
            code: "WPH14",
            number: 4,
            name: "Further Mechanics, Fields and Particles",
            topics: [
                { slug: "further-momentum", code: "4.1", name: "Further momentum and collisions" },
                { slug: "circular-motion", code: "4.2", name: "Circular motion" },
                { slug: "electric-fields", code: "4.3", name: "Electric fields" },
                { slug: "capacitors", code: "4.4", name: "Capacitors" },
                { slug: "magnetic-fields", code: "4.5", name: "Magnetic fields and forces" },
                { slug: "electromagnetic-induction", code: "4.6", name: "Electromagnetic induction" },
                { slug: "particle-physics", code: "4.7", name: "Nuclear and particle physics" },
            ],
        },
        {
            code: "WPH15",
            number: 5,
            name: "Thermodynamics, Radiation, Oscillations and Cosmology",
            topics: [
                { slug: "thermodynamics", code: "5.1", name: "Thermal energy and specific heat capacity" },
                { slug: "ideal-gases", code: "5.2", name: "Ideal gases and kinetic theory" },
                { slug: "nuclear-decay", code: "5.3", name: "Nuclear decay and half-life" },
                { slug: "binding-energy", code: "5.4", name: "Binding energy, fission and fusion" },
                { slug: "oscillations", code: "5.5", name: "Simple harmonic motion and resonance" },
                { slug: "gravitational-fields", code: "5.6", name: "Gravitational fields" },
                { slug: "astrophysics-cosmology", code: "5.7", name: "Space: stars, distances and cosmology" },
            ],
        },
        {
            code: "WPH16",
            number: 6,
            name: "Practical Skills in Physics II",
            topics: [
                { slug: "advanced-uncertainty", code: "6.1", name: "Combining uncertainties" },
                { slug: "logarithmic-graphs", code: "6.2", name: "Logarithmic and linearised graphs" },
                { slug: "core-practicals", code: "6.3", name: "Core practicals review" },
            ],
        },
    ],
};
