import type { SeedSubject } from "./types";

// Pearson Edexcel International AS/A Level Physics (YPH11 / XPH11), spec first teaching 2018 (Issue 3, 2021).
// Topic slugs are a stable contract: questions reference them by [unitCode, slug].
// specPoints follow the wording of the official specification learning outcomes (numbered 1–171 in the spec).
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
                {
                    slug: "motion",
                    code: "1.1",
                    name: "Motion and kinematics",
                    summary:
                        "Uniformly accelerated motion, motion graphs, scalars and vectors, and projectile motion.",
                    specPoints: [
                        "Be able to use the equations for uniformly accelerated motion in one dimension: $v = u + at$, $s = \\frac{(u + v)t}{2}$, $s = ut + \\frac{1}{2}at^2$, $v^2 = u^2 + 2as$",
                        "Be able to draw and interpret displacement-time, velocity-time and acceleration-time graphs",
                        "Know the physical quantities derived from the slopes and areas of displacement-time, velocity-time and acceleration-time graphs, including cases of non-uniform acceleration, and understand how to use the quantities",
                        "Understand scalar and vector quantities and know examples of each type of quantity and recognise vector notation",
                        "Be able to resolve a vector into two components at right angles to each other by drawing and by calculation",
                        "Be able to find the resultant of two coplanar vectors at any angle to each other by drawing, and at right angles to each other by calculation",
                        "Understand how to make use of the independence of vertical and horizontal motion of a projectile moving freely under gravity",
                        "CORE PRACTICAL 1: Determine the acceleration of a freely-falling object",
                    ],
                },
                {
                    slug: "forces",
                    code: "1.2",
                    name: "Forces, moments and equilibrium",
                    summary: "Free-body diagrams, Newton's laws of motion, weight, and moments acting on bodies in equilibrium.",
                    specPoints: [
                        "Be able to draw and interpret free-body force diagrams to represent forces on a particle or on an extended but rigid body, using the concept of centre of gravity of an extended body",
                        "Be able to use the equation $\\Sigma F = ma$, and understand how to use this equation in situations where $m$ is constant (Newton's second law of motion), including Newton's first law of motion where $a = 0$, objects at rest or travelling at constant velocity (use of the term terminal velocity is expected)",
                        "Be able to use the equations for gravitational field strength $g = \\frac{F}{m}$ and weight $W = mg$",
                        "Know and understand Newton's third law of motion and know the properties of pairs of forces in an interaction between two bodies",
                        "Be able to use the equation for the moment of a force, moment of force $= Fx$, where $x$ is the perpendicular distance between the line of action of the force and the axis of rotation",
                        "Be able to use the concept of centre of gravity of an extended body and apply the principle of moments to an extended body in equilibrium",
                    ],
                },
                {
                    slug: "momentum",
                    code: "1.3",
                    name: "Momentum",
                    summary: "Momentum as $p = mv$ and the conservation of linear momentum in one dimension.",
                    specPoints: [
                        "Understand that momentum is defined as $p = mv$",
                        "Know the principle of conservation of linear momentum, understand how to relate this to Newton's laws of motion and understand how to apply this to problems in one dimension",
                    ],
                },
                {
                    slug: "work-energy-power",
                    code: "1.4",
                    name: "Work, energy and power",
                    summary: "Work done, kinetic and gravitational potential energy, conservation of energy, power and efficiency.",
                    specPoints: [
                        "Be able to use the equation for work $\\Delta W = F\\Delta s$, including calculations when the force is not along the line of motion",
                        "Be able to use the equation $E_k = \\frac{1}{2}mv^2$",
                        "Be able to use the equation $\\Delta E_{grav} = mg\\Delta h$ for the difference in gravitational potential energy near the Earth's surface",
                        "Know, and understand how to apply, the principle of conservation of energy including use of work done, gravitational potential energy and kinetic energy",
                        "Be able to use the equations relating power, time and energy transferred or work done: $P = \\frac{E}{t}$ and $P = \\frac{W}{t}$",
                        "Be able to use the equations efficiency $= \\frac{\\text{useful energy output}}{\\text{total energy input}}$ and efficiency $= \\frac{\\text{useful power output}}{\\text{total power input}}$",
                    ],
                },
                {
                    slug: "fluids",
                    code: "1.5",
                    name: "Density, upthrust and viscosity",
                    summary: "Density, upthrust on immersed objects, and viscous drag on spheres using Stokes' law.",
                    specPoints: [
                        "Be able to use the equation density $\\rho = \\frac{m}{V}$",
                        "Understand how to use the relationship upthrust = weight of fluid displaced",
                        "Be able to use the equation for viscous drag (Stokes' law), $F = 6\\pi\\eta rv$",
                        "Understand that Stokes' law applies only to small spherical objects moving at low speeds with laminar flow (or in the absence of turbulent flow), and that viscosity is temperature dependent",
                        "CORE PRACTICAL 2: Use a falling-ball method to determine the viscosity of a liquid",
                    ],
                },
                {
                    slug: "solid-materials",
                    code: "1.6",
                    name: "Solid materials: Hooke's law, stress and strain",
                    summary:
                        "Hooke's law, stress, strain and the Young modulus, force-extension and stress-strain graphs, and elastic strain energy.",
                    specPoints: [
                        "Be able to use the Hooke's law equation, $\\Delta F = k\\Delta x$, where $k$ is the stiffness of the object",
                        "Understand how to use the relationships (tensile or compressive) stress = force / cross-sectional area, (tensile or compressive) strain = change in length / original length, and Young modulus $E$ = stress / strain",
                        "Be able to draw and interpret force-extension and force-compression graphs",
                        "Understand the terms limit of proportionality, elastic limit, yield point, elastic deformation and plastic deformation and be able to apply them to force-extension and force-compression graphs",
                        "Be able to draw and interpret tensile or compressive stress-strain graphs, and understand the term breaking stress",
                        "CORE PRACTICAL 3: Determine the Young modulus of a material",
                        "Be able to calculate the elastic strain energy $E_{el}$ in a deformed material sample, using the equation $\\Delta E_{el} = \\frac{1}{2}F\\Delta x$, and from the area under the force-extension graph (including estimating the area for linear and non-linear graphs)",
                    ],
                },
            ],
        },
        {
            code: "WPH12",
            number: 2,
            name: "Waves and Electricity",
            topics: [
                {
                    slug: "progressive-waves",
                    code: "2.1",
                    name: "Progressive waves",
                    summary:
                        "Wave properties, the wave equation, longitudinal and transverse waves, and intensity of radiation.",
                    specPoints: [
                        "Understand the terms amplitude, frequency, period, speed and wavelength",
                        "Be able to use the wave equation $v = f\\lambda$",
                        "Be able to describe longitudinal waves in terms of pressure variation and the displacement of molecules",
                        "Be able to describe transverse waves",
                        "Be able to draw and interpret graphs representing transverse and longitudinal waves including standing/stationary waves",
                        "CORE PRACTICAL 4: Determine the speed of sound in air using a 2-beam oscilloscope, signal generator, speaker and microphone",
                        "Be able to use the equation for the intensity of radiation $I = \\frac{P}{A}$",
                    ],
                },
                {
                    slug: "superposition-stationary-waves",
                    code: "2.2",
                    name: "Superposition and stationary waves",
                    summary:
                        "Coherence, phase and path difference, superposition, and stationary waves on strings.",
                    specPoints: [
                        "Know and understand what is meant by wavefront, coherence, path difference, superposition, interference and phase",
                        "Be able to use the relationship between phase difference and path difference",
                        "Know what is meant by a standing/stationary wave and understand how such a wave is formed; know how to identify nodes and antinodes",
                        "Be able to use the equation for the speed of a transverse wave on a string $v = \\sqrt{\\frac{T}{\\mu}}$",
                        "CORE PRACTICAL 5: Investigate the effects of length, tension and mass per unit length on the frequency of a vibrating string or wire",
                    ],
                },
                {
                    slug: "refraction-optics",
                    code: "2.3",
                    name: "Refraction, total internal reflection and polarisation",
                    summary:
                        "Refractive index and Snell's law, critical angle and total internal reflection, plane polarisation and pulse-echo techniques.",
                    specPoints: [
                        "Know and understand that at the interface between medium 1 and medium 2, $n_1 \\sin\\theta_1 = n_2 \\sin\\theta_2$, where refractive index is $n = \\frac{c}{v}$",
                        "Be able to calculate the critical angle using $\\sin C = \\frac{1}{n}$",
                        "Be able to predict whether total internal reflection will occur at an interface",
                        "Understand how to measure the refractive index of a solid material",
                        "Understand what is meant by plane polarisation",
                        "Understand that waves can be transmitted and reflected at an interface between media",
                        "Understand how a pulse-echo technique can provide information about the position of an object and how the amount of information obtained may be limited by the wavelength of the radiation or by the duration of pulses",
                    ],
                },
                {
                    slug: "diffraction-interference",
                    code: "2.4",
                    name: "Diffraction and interference",
                    summary:
                        "Diffraction at slits and obstacles, Huygens' construction, and the diffraction grating equation.",
                    specPoints: [
                        "Understand what is meant by diffraction and use Huygens' construction to explain what happens to a wave when it meets a slit or an obstacle",
                        "Be able to use $n\\lambda = d\\sin\\theta$ for a diffraction grating",
                        "CORE PRACTICAL 6: Determine the wavelength of light from a laser or other light source using a diffraction grating",
                        "Understand how diffraction experiments provide evidence for the wave nature of electrons",
                    ],
                },
                {
                    slug: "quantum-physics",
                    code: "2.5",
                    name: "Wave–particle duality and the photoelectric effect",
                    summary:
                        "Electron diffraction and the de Broglie equation, photons, the photoelectric effect and atomic energy levels.",
                    specPoints: [
                        "Understand how diffraction experiments provide evidence for the wave nature of electrons",
                        "Be able to use the de Broglie equation $\\lambda = \\frac{h}{p}$",
                        "Understand how the behaviour of electromagnetic radiation can be described in terms of a wave model and a photon model, and how these models developed over time",
                        "Be able to use the equation $E = hf$, that relates the photon energy to the wave frequency",
                        "Understand that the absorption of a photon can result in the emission of a photoelectron",
                        "Understand the terms threshold frequency and work function and be able to use the equation $hf = \\phi + \\frac{1}{2}mv_{max}^2$",
                        "Be able to use the electronvolt (eV) to express small energies",
                        "Understand how the photoelectric effect provides evidence for the particle nature of electromagnetic radiation",
                        "Understand atomic line spectra in terms of transitions between discrete energy levels and understand how to calculate the frequency of radiation that could be emitted or absorbed in a transition between energy levels",
                    ],
                },
                {
                    slug: "current-charge",
                    code: "2.6",
                    name: "Charge, current and potential difference",
                    summary:
                        "Current as rate of flow of charge, potential difference as work done per unit charge, and charge carriers in conductors.",
                    specPoints: [
                        "Understand that electric current is the rate of flow of charged particles and be able to use the equation $I = \\frac{\\Delta Q}{\\Delta t}$",
                        "Understand how to use the equation $V = \\frac{W}{Q}$",
                        "Understand how the distribution of current in a circuit is a consequence of charge conservation",
                        "Understand how the distribution of potential differences in a circuit is a consequence of energy conservation",
                        "Be able to use $I = nqvA$ to explain the large range of resistivities of different materials",
                    ],
                },
                {
                    slug: "resistance-circuits",
                    code: "2.7",
                    name: "Resistance, resistivity and circuits",
                    summary:
                        "Resistance and Ohm's law, series and parallel combinations, electrical power, I-V characteristics, resistivity, and how temperature and light affect resistance.",
                    specPoints: [
                        "Understand that resistance is defined by $R = \\frac{V}{I}$ and that Ohm's law is a special case where $I \\propto V$ for constant temperature",
                        "Be able to derive the equations for combining resistances in series and parallel using the principles of charge and energy conservation, and be able to use these equations",
                        "Be able to use the equations $P = VI$, $W = VIt$ and be able to derive and use related equations, e.g. $P = I^2R$ and $P = \\frac{V^2}{R}$",
                        "Understand how to sketch, recognise and interpret current-potential difference graphs for components, including ohmic conductors, filament bulbs, thermistors and diodes",
                        "Be able to use the equation $R = \\frac{\\rho l}{A}$",
                        "CORE PRACTICAL 7: Determine the electrical resistivity of a material",
                        "Understand how changes of resistance with temperature may be modelled in terms of lattice vibrations and number of conduction electrons, and apply this model to metallic conductors and negative temperature coefficient thermistors",
                        "Understand how changes of resistance with illumination may be modelled in terms of the number of conduction electrons, and apply this model to LDRs",
                    ],
                },
                {
                    slug: "emf-internal-resistance",
                    code: "2.8",
                    name: "EMF, internal resistance and potential dividers",
                    summary:
                        "Potential along a uniform wire, potential divider circuits with thermistors and LDRs, and the e.m.f. and internal resistance of cells.",
                    specPoints: [
                        "Understand how the potential along a uniform current-carrying wire varies with the distance along it",
                        "Understand the principles of a potential divider circuit and understand how to calculate potential differences and resistances in such a circuit",
                        "Be able to analyse potential divider circuits where one resistance is variable, including thermistors and light dependent resistors (LDRs)",
                        "Know the definition of electromotive force (e.m.f.) and understand what is meant by internal resistance, and know how to distinguish between e.m.f. and terminal potential difference",
                        "CORE PRACTICAL 8: Determine the e.m.f. and internal resistance of an electrical cell",
                    ],
                },
            ],
        },
        {
            code: "WPH13",
            number: 3,
            name: "Practical Skills in Physics I",
            topics: [
                {
                    slug: "measurement-uncertainty",
                    code: "3.1",
                    name: "Measurement, uncertainty and precision",
                    summary:
                        "Choosing and reading instruments, significant figures, and estimating uncertainty in single and repeated readings.",
                    specPoints: [
                        "Identify the range and resolution of measuring instruments, including Vernier calipers (0.1 mm) and micrometer screw gauge (0.01 mm)",
                        "Discuss calibration of instruments, e.g. whether a meter reads zero before measurements are made",
                        "Comment on the number of readings taken and the range of measurements taken",
                        "Comment on significant figures, e.g. write down a micrometer reading of a wire's diameter to the correct number of significant figures",
                        "Check a reading that is inconsistent with other readings, e.g. a point that is not on the line of a graph",
                        "Discuss uncertainties, qualitatively and quantitatively",
                        "Determine the percentage uncertainty in measurements for a single reading using half the resolution of the instrument and from multiple readings using the half range (compounding percentage uncertainties is not required at IAS)",
                    ],
                },
                {
                    slug: "experimental-design",
                    code: "3.2",
                    name: "Planning and experimental design",
                    summary:
                        "Planning an experiment: apparatus, measurement technique, control variables, safety and sources of error.",
                    specPoints: [
                        "Plan an experiment and identify the apparatus required",
                        "Describe how to measure relevant variables using the most appropriate instrument and correct measuring techniques",
                        "Identify and state how to control all other relevant variables to make it a fair test",
                        "Discuss whether repeat readings are appropriate",
                        "Identify health and safety issues and discuss how these may be dealt with",
                        "Discuss how the data collected will be used",
                        "Identify possible sources of uncertainty and/or systematic error and explain how these may be reduced or eliminated",
                        "Comment on how the experiment may be improved, possibly by using additional apparatus (e.g. to reduce errors)",
                        "Comment on the implications of physics (e.g. benefits/risks) and on its context (e.g. social/environmental/historical)",
                    ],
                },
                {
                    slug: "data-analysis-graphs",
                    code: "3.3",
                    name: "Data analysis and graphs",
                    summary:
                        "Processing results: calculations, plotting graphs, finding gradients and relationships, and suggesting improvements.",
                    specPoints: [
                        "Perform calculations, using the correct number of significant figures",
                        "Plot results on a graph using an appropriate scale",
                        "Use the correct units throughout",
                        "Comment on the relationship obtained from the graph",
                        "Determine the relationship between two variables or determine a constant with the aid of a graph, e.g. by determining the gradient using a large triangle",
                        "Suggest realistic modifications to reduce errors",
                        "Suggest realistic modifications to improve the experiment",
                    ],
                },
            ],
        },
        {
            code: "WPH14",
            number: 4,
            name: "Further Mechanics, Fields and Particles",
            topics: [
                {
                    slug: "further-momentum",
                    code: "4.1",
                    name: "Further momentum and collisions",
                    summary:
                        "Impulse, conservation of momentum in two dimensions, and elastic and inelastic collisions.",
                    specPoints: [
                        "Understand how to use the equation impulse $= F\\Delta t = \\Delta p$ (Newton's second law of motion)",
                        "CORE PRACTICAL 9: Investigate the relationship between the force exerted on an object and its change of momentum",
                        "Understand how to apply conservation of linear momentum to problems in two dimensions",
                        "CORE PRACTICAL 10: Use ICT to analyse collisions between small spheres, e.g. ball bearings on a table top",
                        "Understand how to determine whether a collision is elastic or inelastic",
                        "Be able to derive and use the equation $E_k = \\frac{p^2}{2m}$",
                    ],
                },
                {
                    slug: "circular-motion",
                    code: "4.2",
                    name: "Circular motion",
                    summary: "Radians, angular velocity, centripetal acceleration and centripetal force.",
                    specPoints: [
                        "Be able to express angular displacement in radians and in degrees, and convert between these units",
                        "Understand what is meant by angular velocity and be able to use the equations $v = \\omega r$ and $T = \\frac{2\\pi}{\\omega}$",
                        "Be able to use vector diagrams to derive the equations for centripetal acceleration $a = \\frac{v^2}{r} = r\\omega^2$, and understand how to use these equations",
                        "Understand that a resultant force (centripetal force) is required to produce and maintain circular motion",
                        "Be able to use the equations for centripetal force $F = ma = \\frac{mv^2}{r} = mr\\omega^2$",
                    ],
                },
                {
                    slug: "electric-fields",
                    code: "4.3",
                    name: "Electric fields",
                    summary:
                        "Electric field strength, Coulomb's law, radial and uniform fields, electric potential and equipotentials.",
                    specPoints: [
                        "Understand that an electric field (force field) is defined as a region where a charged particle experiences a force",
                        "Understand that electric field strength is defined as $E = \\frac{F}{Q}$ and be able to use this equation",
                        "Be able to use the equation $F = \\frac{Q_1Q_2}{4\\pi\\varepsilon_0 r^2}$ for the force between two charges",
                        "Be able to use the equation $E = \\frac{Q}{4\\pi\\varepsilon_0 r^2}$ for the electric field due to a point charge",
                        "Know and understand the relation between electric field and electric potential",
                        "Be able to use the equation $E = \\frac{V}{d}$ for an electric field between parallel plates",
                        "Be able to use $V = \\frac{Q}{4\\pi\\varepsilon_0 r}$ for a radial field",
                        "Be able to draw and interpret diagrams using field lines and equipotentials to describe radial and uniform electric fields",
                    ],
                },
                {
                    slug: "capacitors",
                    code: "4.4",
                    name: "Capacitors",
                    summary:
                        "Capacitance, energy stored in a capacitor, and exponential charging and discharging through a resistor.",
                    specPoints: [
                        "Understand that capacitance is defined as $C = \\frac{Q}{V}$ and be able to use this equation",
                        "Be able to use the equations for the energy stored in a capacitor $W = \\frac{1}{2}QV$, $W = \\frac{1}{2}CV^2$ and $W = \\frac{Q^2}{2C}$",
                        "Be able to draw and interpret charge and discharge curves for resistor-capacitor circuits and understand the significance of the time constant $RC$",
                        "CORE PRACTICAL 11: Use an oscilloscope or data logger to display and analyse the potential difference (p.d.) across a capacitor as it charges and discharges through a resistor",
                        "Be able to use the equation $Q = Q_0 e^{-t/RC}$ and derive and use related equations for exponential discharge in a resistor-capacitor circuit, $I = I_0 e^{-t/RC}$ and $V = V_0 e^{-t/RC}$, and the corresponding log equations, e.g. $\\ln Q = \\ln Q_0 - \\frac{t}{RC}$",
                    ],
                },
                {
                    slug: "magnetic-fields",
                    code: "4.5",
                    name: "Magnetic fields and forces",
                    summary:
                        "Magnetic flux density, flux and flux linkage, and the forces on moving charges and current-carrying conductors.",
                    specPoints: [
                        "Understand and use the terms magnetic flux density $B$, flux $\\Phi$ and flux linkage $N\\Phi$",
                        "Be able to use the equation $F = Bqv\\sin\\theta$ and apply Fleming's left-hand rule to charged particles moving in a magnetic field",
                        "Be able to use the equation $F = BIl\\sin\\theta$ and apply Fleming's left-hand rule to current-carrying conductors in a magnetic field",
                    ],
                },
                {
                    slug: "electromagnetic-induction",
                    code: "4.6",
                    name: "Electromagnetic induction",
                    summary:
                        "Induced e.m.f. from relative motion of magnets and coils or changing currents, and Faraday's and Lenz's laws.",
                    specPoints: [
                        "Understand and use the terms magnetic flux density $B$, flux $\\Phi$ and flux linkage $N\\Phi$",
                        "Understand the factors affecting the e.m.f. induced in a coil when there is relative motion between the coil and a permanent magnet",
                        "Understand the factors affecting the e.m.f. induced in a coil when there is a change of current in another coil linked with this coil",
                        "Understand how to use Faraday's law to determine the magnitude of an induced e.m.f. and be able to use the equation that combines Faraday's and Lenz's laws, $\\varepsilon = -\\frac{d(N\\Phi)}{dt}$",
                    ],
                },
                {
                    slug: "particle-physics",
                    code: "4.7",
                    name: "Nuclear and particle physics",
                    summary:
                        "The nuclear atom, particle accelerators and detectors, mass-energy, and the standard quark-lepton model.",
                    specPoints: [
                        "Understand what is meant by nucleon number (mass number) and proton number (atomic number)",
                        "Understand how large-angle alpha particle scattering gives evidence for a nuclear model of the atom and how our understanding of atomic structure has changed over time",
                        "Understand that electrons are released in the process of thermionic emission and how they can be accelerated by electric and magnetic fields",
                        "Understand the role of electric and magnetic fields in particle accelerators (linac and cyclotron) and detectors (general principles of ionisation and deflection only)",
                        "Be able to derive and use the equation $r = \\frac{p}{BQ}$ for a charged particle in a magnetic field",
                        "Be able to apply conservation of charge, energy and momentum to interactions between particles and interpret particle tracks",
                        "Understand why high energies are required to investigate the structure of nucleons",
                        "Be able to use the equation $\\Delta E = c^2\\Delta m$ in situations involving the creation and annihilation of matter and antimatter particles",
                        "Be able to use MeV and GeV (energy) and MeV/$c^2$, GeV/$c^2$ (mass) and convert between these and SI units",
                        "Understand situations in which the relativistic increase in particle lifetime is significant (use of relativistic equations not required)",
                        "Know that in the standard quark-lepton model particles can be classified as baryons (made from three quarks), mesons (a quark and an antiquark), leptons (fundamental particles) and photons, and that the symmetry of the model predicted the top quark",
                        "Know that every particle has a corresponding antiparticle and be able to use the properties of a particle to deduce the properties of its antiparticle and vice versa",
                        "Understand how to use laws of conservation of charge, baryon number and lepton number to determine whether a particle interaction is possible",
                        "Be able to write and interpret particle equations given the relevant particle symbols",
                    ],
                },
            ],
        },
        {
            code: "WPH15",
            number: 5,
            name: "Thermodynamics, Radiation, Oscillations and Cosmology",
            topics: [
                {
                    slug: "thermodynamics",
                    code: "5.1",
                    name: "Thermal energy and specific heat capacity",
                    summary:
                        "Specific heat capacity, specific latent heat, internal energy, and calibrating a thermistor thermostat.",
                    specPoints: [
                        "Be able to use the equations $\\Delta E = mc\\Delta\\theta$ and $\\Delta E = L\\Delta m$",
                        "CORE PRACTICAL 12: Calibrate a thermistor in a potential divider circuit as a thermostat",
                        "CORE PRACTICAL 13: Determine the specific latent heat of a phase change",
                        "Understand the concept of internal energy as the random distribution of potential and kinetic energy amongst molecules",
                    ],
                },
                {
                    slug: "ideal-gases",
                    code: "5.2",
                    name: "Ideal gases and kinetic theory",
                    summary: "Absolute zero, the ideal gas equation, and the link between molecular kinetic energy and temperature.",
                    specPoints: [
                        "Understand the concept of absolute zero and how the average kinetic energy of molecules is related to the absolute temperature",
                        "Be able to use the equation $pV = NkT$ for an ideal gas",
                        "CORE PRACTICAL 14: Investigate the relationship between pressure and volume of a gas at fixed temperature",
                        "Be able to derive and use the equation $\\frac{1}{2}m\\langle c^2\\rangle = \\frac{3}{2}kT$",
                    ],
                },
                {
                    slug: "nuclear-decay",
                    code: "5.3",
                    name: "Nuclear decay and half-life",
                    summary:
                        "Background radiation, alpha, beta and gamma radiation, nuclear equations, and the exponential law of radioactive decay.",
                    specPoints: [
                        "Understand that there is background radiation and how to take appropriate account of it in calculations",
                        "Understand the relationships between the nature, penetration, ionising ability and range in different materials of nuclear radiations (alpha, beta and gamma)",
                        "Be able to write and interpret nuclear equations given the relevant particle symbols",
                        "CORE PRACTICAL 15: Investigate the absorption of gamma radiation by lead",
                        "Understand the spontaneous and random nature of nuclear decay",
                        "Be able to determine the half-lives of radioactive isotopes graphically and be able to use the equations for radioactive decay: activity $A = \\lambda N$, $\\frac{dN}{dt} = -\\lambda N$, $\\lambda = \\frac{\\ln 2}{t_{1/2}}$, $N = N_0 e^{-\\lambda t}$ and $A = A_0 e^{-\\lambda t}$, and derive and use the corresponding log equations",
                    ],
                },
                {
                    slug: "binding-energy",
                    code: "5.4",
                    name: "Binding energy, fission and fusion",
                    summary:
                        "Mass deficit and nuclear binding energy, the atomic mass unit, and nuclear fission and fusion.",
                    specPoints: [
                        "Understand the concept of nuclear binding energy and be able to use the equation $\\Delta E = c^2\\Delta m$ in calculations of nuclear mass (including mass deficit) and energy",
                        "Use the atomic mass unit (u) to express small masses and convert between this and SI units",
                        "Understand the processes of nuclear fusion and fission with reference to the binding energy per nucleon curve",
                        "Understand the mechanism of nuclear fusion and the need for very high densities of matter and very high temperatures to bring about and maintain nuclear fusion",
                    ],
                },
                {
                    slug: "oscillations",
                    code: "5.5",
                    name: "Simple harmonic motion and resonance",
                    summary:
                        "The conditions and equations for simple harmonic motion, oscillation graphs, energy, damping and resonance.",
                    specPoints: [
                        "Understand that the condition for simple harmonic motion is $F = -kx$, and hence understand how to identify situations in which simple harmonic motion will occur",
                        "Be able to use the equations $a = -\\omega^2 x$, $x = A\\cos\\omega t$, $v = -A\\omega\\sin\\omega t$, $a = -A\\omega^2\\cos\\omega t$, $T = \\frac{1}{f} = \\frac{2\\pi}{\\omega}$ and $\\omega = 2\\pi f$ as applied to a simple harmonic oscillator",
                        "Be able to use the equations for a simple harmonic oscillator $T = 2\\pi\\sqrt{\\frac{m}{k}}$ and a simple pendulum $T = 2\\pi\\sqrt{\\frac{l}{g}}$",
                        "Be able to draw and interpret a displacement-time graph for an oscillating object and know that the gradient at a point gives the velocity at that point",
                        "Be able to draw and interpret a velocity-time graph for an oscillating object and know that the gradient at a point gives the acceleration at that point",
                        "Understand what is meant by resonance",
                        "CORE PRACTICAL 16: Determine the value of an unknown mass using the resonant frequencies of the oscillation of known masses",
                        "Understand how to apply conservation of energy to damped and undamped oscillating systems",
                        "Understand the distinction between free and forced oscillations",
                        "Understand how the amplitude of a forced oscillation changes at and around the natural frequency of a system and know, qualitatively, how damping affects resonance",
                        "Understand how damping and the plastic deformation of ductile materials reduce the amplitude of oscillation",
                    ],
                },
                {
                    slug: "gravitational-fields",
                    code: "5.6",
                    name: "Gravitational fields",
                    summary:
                        "Gravitational field strength and potential, Newton's law of gravitation, and orbital motion.",
                    specPoints: [
                        "Understand that a gravitational field (force field) is defined as a region where a mass experiences a force",
                        "Understand that gravitational field strength is defined as $g = \\frac{F}{m}$ and be able to use this equation",
                        "Be able to use the equation $F = \\frac{Gm_1m_2}{r^2}$ (Newton's law of universal gravitation)",
                        "Be able to derive and use the equation $g = \\frac{Gm}{r^2}$ for the gravitational field due to a point mass",
                        "Be able to use the equation $V_{grav} = -\\frac{Gm}{r}$ for a radial gravitational field",
                        "Be able to compare electric fields with gravitational fields",
                        "Be able to apply Newton's laws of motion and universal gravitation to orbital motion",
                    ],
                },
                {
                    slug: "astrophysics-cosmology",
                    code: "5.7",
                    name: "Space: stars, distances and cosmology",
                    summary:
                        "Black-body radiation, stellar luminosity and distances, the Hertzsprung-Russell diagram, redshift and the fate of the universe.",
                    specPoints: [
                        "Understand what is meant by a black body radiator and be able to interpret radiation curves for such a radiator",
                        "Be able to use the Stefan-Boltzmann law equation $L = \\sigma AT^4$ for black body radiators",
                        "Be able to use Wien's law equation $\\lambda_{max}T = 2.898 \\times 10^{-3}\\ \\text{m K}$ for black body radiators",
                        "Be able to use the equation intensity $I = \\frac{L}{4\\pi d^2}$, where $L$ is luminosity and $d$ is distance from the source",
                        "Understand how astronomical distances can be determined using trigonometric parallax",
                        "Understand how astronomical distances can be determined using measurements of intensity received from standard candles (objects of known luminosity)",
                        "Be able to sketch and interpret a simple Hertzsprung-Russell diagram that relates stellar luminosity to surface temperature",
                        "Understand how to relate the Hertzsprung-Russell diagram to the life cycle of stars",
                        "Understand how the movement of a source of waves relative to an observer/detector gives rise to a shift in frequency (Doppler effect)",
                        "Be able to use the equations for redshift $z = \\frac{\\Delta\\lambda}{\\lambda} \\approx \\frac{\\Delta f}{f} \\approx \\frac{v}{c}$ for a source of electromagnetic radiation moving relative to an observer, and $v = H_0 d$ for objects at cosmological distances",
                        "Understand the controversy over the age and ultimate fate of the universe associated with the value of the Hubble constant and the possible existence of dark matter",
                    ],
                },
            ],
        },
        {
            code: "WPH16",
            number: 6,
            name: "Practical Skills in Physics II",
            topics: [
                {
                    slug: "advanced-uncertainty",
                    code: "6.1",
                    name: "Combining uncertainties",
                    summary:
                        "Precision, accuracy and sensitivity, and calculating and compounding percentage uncertainties.",
                    specPoints: [
                        "Use the terms precision, accuracy and sensitivity appropriately",
                        "Discuss uncertainties qualitatively and quantitatively",
                        "Determine the percentage uncertainty in measurements for a single reading using half the resolution of the instrument and from multiple readings using the half range",
                        "Compound percentage uncertainties correctly",
                        "Comment on significant figures, identifying and/or rounding any incorrect figures in a table of results",
                        "Identify and/or amend units that are incorrect",
                        "Identify and check a reading that is inconsistent with other readings, e.g. a point that is not on the line of a graph",
                    ],
                },
                {
                    slug: "logarithmic-graphs",
                    code: "6.2",
                    name: "Logarithmic and linearised graphs",
                    summary:
                        "Using log-linear and log-log graphs to test exponential and power-law relationships and determine constants.",
                    specPoints: [
                        "Plot results on a graph using an appropriate scale and units; the graph could be logarithmic in nature",
                        "Use logarithmic plots to test exponential and power law variations, e.g. plotting $\\ln y$ against $x$ for $y = Ae^{kx}$ and $\\ln y$ against $\\ln x$ for $y = Ax^n$",
                        "Comment on the trend/pattern obtained",
                        "Determine the relationship between two variables or determine a constant with the aid of the graph, e.g. by determining the gradient using a large triangle",
                        "Perform calculations, using the correct number of significant figures",
                        "Suggest realistic modifications to reduce errors and to improve the experiment",
                    ],
                },
                {
                    slug: "core-practicals",
                    code: "6.3",
                    name: "Core practicals review",
                    summary:
                        "Planning, carrying out and evaluating the A2 core practicals from Units 4 and 5.",
                    specPoints: [
                        "Plan an experiment: identify the most appropriate apparatus, giving details such as range and resolution of instruments and relevant dimensions of apparatus",
                        "Describe how to measure relevant variables using the most appropriate instrument(s) and techniques, and how to control all other relevant variables",
                        "Identify health and safety issues and discuss how these may be dealt with",
                        "CORE PRACTICAL 9: Investigate the relationship between the force exerted on an object and its change of momentum",
                        "CORE PRACTICAL 10: Use ICT to analyse collisions between small spheres, e.g. ball bearings on a table top",
                        "CORE PRACTICAL 11: Use an oscilloscope or data logger to display and analyse the potential difference across a capacitor as it charges and discharges through a resistor",
                        "CORE PRACTICAL 12: Calibrate a thermistor in a potential divider circuit as a thermostat",
                        "CORE PRACTICAL 13: Determine the specific latent heat of a phase change",
                        "CORE PRACTICAL 14: Investigate the relationship between pressure and volume of a gas at fixed temperature",
                        "CORE PRACTICAL 15: Investigate the absorption of gamma radiation by lead",
                        "CORE PRACTICAL 16: Determine the value of an unknown mass using the resonant frequencies of the oscillation of known masses",
                    ],
                },
            ],
        },
    ],
};
