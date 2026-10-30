import type { SeedSubject } from "./types";

// Pearson Edexcel International AS/A Level subjects other than Physics, plus local Maldivian subjects.
// Unit codes and names are taken from the current Pearson specifications (Chemistry/Biology first teaching 2018,
// Mathematics/Further Mathematics first teaching 2018). Topic lists follow each specification's topic headings;
// where a spec topic is very broad it is split into smaller study topics. specPoints are left empty for now.

const chemistry: SeedSubject = {
    slug: "chemistry",
    code: "YCH11",
    name: "Chemistry",
    description: "Physical, inorganic and organic chemistry, from amount of substance to transition metals and synthesis.",
    color: "violet",
    units: [
        {
            code: "WCH11",
            number: 1,
            name: "Structure, Bonding and Introduction to Organic Chemistry",
            topics: [
                {
                    slug: "amount-of-substance",
                    code: "1.1",
                    name: "Formulae, equations and amount of substance",
                    summary: "Moles, empirical and molecular formulae, balanced equations, concentrations, gas volumes and yields.",
                },
                {
                    slug: "atomic-structure-periodic-table",
                    code: "1.2",
                    name: "Atomic structure and the Periodic Table",
                    summary: "Isotopes, mass spectrometry, ionisation energies, electron configurations and periodicity.",
                },
                {
                    slug: "bonding-structure",
                    code: "1.3",
                    name: "Bonding and structure",
                    summary: "Ionic, covalent and metallic bonding, shapes of molecules, electronegativity and giant structures.",
                },
                {
                    slug: "organic-alkanes",
                    code: "1.4",
                    name: "Introductory organic chemistry and alkanes",
                    summary: "Nomenclature, formulae and isomerism, fuels and free-radical substitution of alkanes.",
                },
                {
                    slug: "alkenes",
                    code: "1.5",
                    name: "Alkenes",
                    summary: "Bonding in alkenes, E/Z isomerism, electrophilic addition mechanisms and addition polymers.",
                },
            ],
        },
        {
            code: "WCH12",
            number: 2,
            name: "Energetics, Group Chemistry, Halogenoalkanes and Alcohols",
            topics: [
                {
                    slug: "energetics",
                    code: "2.1",
                    name: "Energetics",
                    summary: "Enthalpy changes, calorimetry, Hess's law and mean bond enthalpies.",
                },
                {
                    slug: "intermolecular-forces",
                    code: "2.2",
                    name: "Intermolecular forces",
                    summary: "London forces, permanent dipoles and hydrogen bonding, and their effect on physical properties.",
                },
                {
                    slug: "redox-groups-1-2-7",
                    code: "2.3",
                    name: "Redox chemistry and Groups 1, 2 and 7",
                    summary: "Oxidation numbers and redox equations, trends in Groups 1 and 2, and the halogens and halides.",
                },
                {
                    slug: "kinetics-equilibria-intro",
                    code: "2.4",
                    name: "Introduction to kinetics and equilibria",
                    summary: "Collision theory, Maxwell-Boltzmann distributions, catalysts and dynamic equilibrium.",
                },
                {
                    slug: "halogenoalkanes-alcohols-spectra",
                    code: "2.5",
                    name: "Halogenoalkanes, alcohols and spectra",
                    summary: "Reactions of halogenoalkanes and alcohols, mass spectra and infrared spectroscopy.",
                },
            ],
        },
        {
            code: "WCH13",
            number: 3,
            name: "Practical Skills in Chemistry I",
            topics: [
                {
                    slug: "practical-techniques",
                    code: "3.1",
                    name: "Practical techniques and safety",
                    summary: "Standard laboratory techniques, apparatus and hazards from the Units 1 and 2 core practicals.",
                },
                {
                    slug: "measurement-uncertainty",
                    code: "3.2",
                    name: "Measurements and uncertainty",
                    summary: "Reading apparatus, significant figures and measurement uncertainties.",
                },
                {
                    slug: "data-analysis-evaluation",
                    code: "3.3",
                    name: "Data analysis and evaluation",
                    summary: "Processing results, plotting graphs, drawing conclusions and suggesting improvements.",
                },
            ],
        },
        {
            code: "WCH14",
            number: 4,
            name: "Rates, Equilibria and Further Organic Chemistry",
            topics: [
                {
                    slug: "kinetics",
                    code: "4.1",
                    name: "Kinetics",
                    summary: "Rate equations, orders of reaction, rate-determining steps and activation energy.",
                },
                {
                    slug: "entropy-energetics",
                    code: "4.2",
                    name: "Entropy and energetics",
                    summary: "Lattice energy, Born-Haber cycles, enthalpies of solution, entropy and feasibility.",
                },
                {
                    slug: "chemical-equilibria",
                    code: "4.3",
                    name: "Chemical equilibria",
                    summary: "Equilibrium constants $K_c$ and $K_p$ and the effect of conditions on equilibria.",
                },
                {
                    slug: "acid-base-equilibria",
                    code: "4.4",
                    name: "Acid-base equilibria",
                    summary: "Brønsted-Lowry acids and bases, pH calculations, $K_a$, titration curves, indicators and buffers.",
                },
                {
                    slug: "carbonyls-carboxylic-acids-chirality",
                    code: "4.5",
                    name: "Carbonyls, carboxylic acids and chirality",
                    summary: "Optical isomerism, aldehydes and ketones, carboxylic acids, esters and acyl chlorides.",
                },
            ],
        },
        {
            code: "WCH15",
            number: 5,
            name: "Transition Metals and Organic Nitrogen Chemistry",
            topics: [
                {
                    slug: "redox-equilibria",
                    code: "5.1",
                    name: "Redox equilibria",
                    summary: "Standard electrode potentials, electrochemical cells, redox titrations and fuel cells.",
                },
                {
                    slug: "transition-metals",
                    code: "5.2",
                    name: "Transition metals and their chemistry",
                    summary: "Electronic configurations, complex ions, colour, ligand exchange and catalysis.",
                },
                {
                    slug: "arenes",
                    code: "5.3",
                    name: "Organic chemistry: arenes",
                    summary: "Structure of benzene and electrophilic substitution reactions of arenes and phenol.",
                },
                {
                    slug: "organic-nitrogen-compounds",
                    code: "5.4",
                    name: "Organic nitrogen compounds",
                    summary: "Amines, amides, amino acids, peptides, proteins and condensation polymers.",
                },
                {
                    slug: "organic-synthesis",
                    code: "5.5",
                    name: "Organic synthesis",
                    summary: "Multi-step synthetic routes, Grignard reagents, practical techniques and spectroscopic analysis.",
                },
            ],
        },
        {
            code: "WCH16",
            number: 6,
            name: "Practical Skills in Chemistry II",
            topics: [
                {
                    slug: "planning-experiments",
                    code: "6.1",
                    name: "Planning experiments",
                    summary: "Designing procedures, choosing apparatus and quantities, and identifying hazards.",
                },
                {
                    slug: "quantitative-analysis",
                    code: "6.2",
                    name: "Quantitative analysis and uncertainty",
                    summary: "Titration and rate data, calculations, and combining measurement uncertainties.",
                },
                {
                    slug: "qualitative-analysis-synthesis",
                    code: "6.3",
                    name: "Qualitative analysis and organic preparation",
                    summary: "Tests for ions and functional groups, and preparing and purifying organic products.",
                },
            ],
        },
    ],
};

const biology: SeedSubject = {
    slug: "biology",
    code: "YBI11",
    name: "Biology",
    description: "Molecules, cells, genetics, physiology, ecology and gene technology.",
    color: "emerald",
    units: [
        {
            code: "WBI11",
            number: 1,
            name: "Molecules, Diet, Transport and Health",
            topics: [
                {
                    slug: "biological-molecules",
                    code: "1.1",
                    name: "Water, carbohydrates and lipids",
                    summary: "Properties of water, monosaccharides to polysaccharides, and triglycerides and phospholipids.",
                },
                {
                    slug: "heart-circulation",
                    code: "1.2",
                    name: "The heart and circulation",
                    summary: "Mass transport, blood vessels, the cardiac cycle, atherosclerosis and blood clotting.",
                },
                {
                    slug: "cardiovascular-disease",
                    code: "1.3",
                    name: "Cardiovascular disease, diet and risk",
                    summary: "Risk factors for CVD, energy budgets, perception of risk, and treatments for CVD.",
                },
                {
                    slug: "membranes-transport",
                    code: "1.4",
                    name: "Cell membranes and transport",
                    summary: "The fluid mosaic model, diffusion, osmosis, active transport and gas exchange surfaces.",
                },
                {
                    slug: "proteins-enzymes",
                    code: "1.5",
                    name: "Proteins and enzymes",
                    summary: "Amino acids, protein structure, and how enzymes work as biological catalysts.",
                },
                {
                    slug: "dna-protein-synthesis",
                    code: "1.6",
                    name: "DNA, the genetic code and protein synthesis",
                    summary: "DNA and RNA structure, semi-conservative replication, transcription and translation.",
                },
                {
                    slug: "inheritance-genetic-disorders",
                    code: "1.7",
                    name: "Mutations, inheritance and genetic screening",
                    summary: "Gene mutations, cystic fibrosis, monohybrid inheritance and the ethics of genetic screening.",
                },
            ],
        },
        {
            code: "WBI12",
            number: 2,
            name: "Cells, Development, Biodiversity and Conservation",
            topics: [
                {
                    slug: "cell-structure",
                    code: "2.1",
                    name: "Cell structure and organisation",
                    summary: "Eukaryotic and prokaryotic cells, organelles, microscopy and the organisation of tissues.",
                },
                {
                    slug: "cell-cycle-reproduction",
                    code: "2.2",
                    name: "Mitosis, meiosis and fertilisation",
                    summary: "The cell cycle, mitosis, meiosis, gametes and fertilisation in mammals and flowering plants.",
                },
                {
                    slug: "development-gene-expression",
                    code: "2.3",
                    name: "Stem cells, differentiation and variation",
                    summary: "Stem cells, differential gene expression, epigenetics, and genetic and environmental variation.",
                },
                {
                    slug: "plant-structure-function",
                    code: "2.4",
                    name: "Plant structure and function",
                    summary: "Plant cells, starch and cellulose, xylem and sclerenchyma, plant fibres and mineral ions.",
                },
                {
                    slug: "plants-drugs",
                    code: "2.5",
                    name: "Plant-derived drugs and drug testing",
                    summary: "Antimicrobial properties of plant extracts and the development and testing of drugs.",
                },
                {
                    slug: "biodiversity-classification",
                    code: "2.6",
                    name: "Biodiversity, classification and evolution",
                    summary: "Measuring biodiversity, niches and adaptation, natural selection and classification.",
                },
                {
                    slug: "conservation",
                    code: "2.7",
                    name: "Conservation",
                    summary: "The roles of zoos and seed banks in conserving endangered species and genetic diversity.",
                },
            ],
        },
        {
            code: "WBI13",
            number: 3,
            name: "Practical Skills in Biology I",
            topics: [
                {
                    slug: "practical-techniques",
                    code: "3.1",
                    name: "Practical techniques and core practicals",
                    summary: "Methods, apparatus and safety from the Units 1 and 2 core practicals.",
                },
                {
                    slug: "experimental-design",
                    code: "3.2",
                    name: "Experimental design",
                    summary: "Variables, controls, sample sizes, reliability and validity of investigations.",
                },
                {
                    slug: "data-analysis-evaluation",
                    code: "3.3",
                    name: "Data analysis and evaluation",
                    summary: "Processing and presenting data, interpreting graphs and evaluating conclusions.",
                },
            ],
        },
        {
            code: "WBI14",
            number: 4,
            name: "Energy, Environment, Microbiology and Immunity",
            topics: [
                {
                    slug: "photosynthesis",
                    code: "4.1",
                    name: "Photosynthesis",
                    summary: "Light-dependent reactions, the Calvin cycle, chloroplast structure and photosynthetic pigments.",
                },
                {
                    slug: "ecosystems-energy-transfer",
                    code: "4.2",
                    name: "Ecosystems and energy transfer",
                    summary: "Productivity, energy transfer between trophic levels, and factors affecting populations.",
                },
                {
                    slug: "climate-change-evolution",
                    code: "4.3",
                    name: "Climate change, evolution and speciation",
                    summary: "Evidence and causes of climate change, its effects on organisms, and speciation.",
                },
                {
                    slug: "microbiology",
                    code: "4.4",
                    name: "Microbiology and pathogens",
                    summary: "Culturing microorganisms, bacterial growth curves, and how TB and HIV cause disease.",
                },
                {
                    slug: "immunity",
                    code: "4.5",
                    name: "Immunity and antibiotics",
                    summary: "Non-specific and specific immune responses, vaccination, and antibiotic action and resistance.",
                },
                {
                    slug: "forensics",
                    code: "4.6",
                    name: "Forensic biology",
                    summary: "PCR, gel electrophoresis, DNA profiling and determining time of death.",
                },
            ],
        },
        {
            code: "WBI15",
            number: 5,
            name: "Respiration, Internal Environment, Coordination and Gene Technology",
            topics: [
                {
                    slug: "respiration",
                    code: "5.1",
                    name: "Respiration",
                    summary: "Glycolysis, the Krebs cycle, oxidative phosphorylation, anaerobic respiration and RQ.",
                },
                {
                    slug: "muscles-exercise",
                    code: "5.2",
                    name: "Muscles, heart rate and ventilation",
                    summary: "Sliding filament theory, control of heart rate and ventilation, and the effects of exercise.",
                },
                {
                    slug: "homeostasis",
                    code: "5.3",
                    name: "Homeostasis and the kidney",
                    summary: "Thermoregulation, kidney structure, osmoregulation and control of gene expression by hormones.",
                },
                {
                    slug: "nervous-system",
                    code: "5.4",
                    name: "Nervous coordination",
                    summary: "Neurones, action potentials, synapses, reflex arcs, photoreceptors and the effects of drugs.",
                },
                {
                    slug: "plant-responses-brain",
                    code: "5.5",
                    name: "Plant responses and the brain",
                    summary: "Phytochrome and plant hormones, brain structure and medical imaging of the brain.",
                },
                {
                    slug: "gene-technology",
                    code: "5.6",
                    name: "Gene technology",
                    summary: "Recombinant DNA, genetically modified organisms, microarrays and bioinformatics.",
                },
            ],
        },
        {
            code: "WBI16",
            number: 6,
            name: "Practical Skills in Biology II",
            topics: [
                {
                    slug: "planning-investigations",
                    code: "6.1",
                    name: "Planning investigations",
                    summary: "Designing a valid investigation, including variables, controls, safety and ethics.",
                },
                {
                    slug: "statistical-tests",
                    code: "6.2",
                    name: "Statistical analysis",
                    summary: "Choosing and applying statistical tests and interpreting significance.",
                },
                {
                    slug: "evaluation",
                    code: "6.3",
                    name: "Evaluating methods and conclusions",
                    summary: "Limitations, sources of error and the validity of conclusions in experimental work.",
                },
            ],
        },
    ],
};

const mathematics: SeedSubject = {
    slug: "mathematics",
    code: "YMA01",
    name: "Mathematics",
    description: "Pure mathematics with mechanics, statistics and decision mathematics options.",
    color: "blue",
    units: [
        {
            code: "WMA11",
            number: 1,
            name: "Pure Mathematics 1",
            topics: [
                {
                    slug: "algebra-functions",
                    code: "1.1",
                    name: "Algebra and functions",
                    summary: "Indices, surds, quadratics, simultaneous equations, inequalities, curve sketching and transformations.",
                },
                {
                    slug: "coordinate-geometry",
                    code: "1.2",
                    name: "Coordinate geometry in the (x, y) plane",
                    summary: "Equations of straight lines, gradients, and parallel and perpendicular lines.",
                },
                {
                    slug: "trigonometry",
                    code: "1.3",
                    name: "Trigonometry",
                    summary: "Sine and cosine rules, radians, arc length, sector area and trigonometric graphs.",
                },
                {
                    slug: "differentiation",
                    code: "1.4",
                    name: "Differentiation",
                    summary: "Gradients of curves, differentiating powers of x, tangents and normals.",
                },
                {
                    slug: "integration",
                    code: "1.5",
                    name: "Integration",
                    summary: "Indefinite integration of powers of x as the reverse of differentiation.",
                },
            ],
        },
        {
            code: "WMA12",
            number: 2,
            name: "Pure Mathematics 2",
            topics: [
                { slug: "proof", code: "2.1", name: "Proof", summary: "Proof by deduction, exhaustion and disproof by counter-example." },
                {
                    slug: "algebra-functions",
                    code: "2.2",
                    name: "Algebra and functions",
                    summary: "Algebraic division, the factor theorem and the remainder theorem.",
                },
                {
                    slug: "coordinate-geometry",
                    code: "2.3",
                    name: "Coordinate geometry: circles",
                    summary: "Equations of circles and their properties, tangents and chords.",
                },
                {
                    slug: "sequences-series",
                    code: "2.4",
                    name: "Sequences and series",
                    summary: "Binomial expansion, arithmetic and geometric sequences and series, and sigma notation.",
                },
                {
                    slug: "exponentials-logarithms",
                    code: "2.5",
                    name: "Exponentials and logarithms",
                    summary: "Exponential graphs, laws of logarithms and solving equations of the form $a^x = b$.",
                },
                {
                    slug: "trigonometry",
                    code: "2.6",
                    name: "Trigonometry",
                    summary: "Trigonometric identities and solving trigonometric equations in a given interval.",
                },
                {
                    slug: "differentiation",
                    code: "2.7",
                    name: "Differentiation",
                    summary: "Increasing and decreasing functions, stationary points and optimisation.",
                },
                {
                    slug: "integration",
                    code: "2.8",
                    name: "Integration",
                    summary: "Definite integrals, areas under curves and the trapezium rule.",
                },
            ],
        },
        {
            code: "WMA13",
            number: 3,
            name: "Pure Mathematics 3",
            topics: [
                {
                    slug: "algebra-functions",
                    code: "3.1",
                    name: "Algebra and functions",
                    summary: "Rational expressions, functions, inverse and composite functions, and the modulus function.",
                },
                {
                    slug: "trigonometry",
                    code: "3.2",
                    name: "Trigonometry",
                    summary: "Reciprocal and inverse trig functions, compound and double angle formulae, and $R\\cos(\\theta \\pm \\alpha)$.",
                },
                {
                    slug: "exponentials-logarithms",
                    code: "3.3",
                    name: "Exponentials and logarithms",
                    summary: "The functions $e^x$ and $\\ln x$, and using logarithmic graphs to estimate parameters.",
                },
                {
                    slug: "differentiation",
                    code: "3.4",
                    name: "Differentiation",
                    summary: "Chain, product and quotient rules, and differentiating exponential, log and trig functions.",
                },
                {
                    slug: "integration",
                    code: "3.5",
                    name: "Integration",
                    summary: "Integrating $e^x$, $\\frac{1}{x}$ and trig functions, and integration by recognition.",
                },
                {
                    slug: "numerical-methods",
                    code: "3.6",
                    name: "Numerical methods",
                    summary: "Locating roots by change of sign, iteration and the Newton-Raphson method.",
                },
            ],
        },
        {
            code: "WMA14",
            number: 4,
            name: "Pure Mathematics 4",
            topics: [
                { slug: "proof", code: "4.1", name: "Proof", summary: "Proof by contradiction." },
                {
                    slug: "partial-fractions",
                    code: "4.2",
                    name: "Algebra and functions: partial fractions",
                    summary: "Decomposing rational functions into partial fractions.",
                },
                {
                    slug: "parametric-equations",
                    code: "4.3",
                    name: "Coordinate geometry: parametric equations",
                    summary: "Parametric equations of curves and converting between Cartesian and parametric forms.",
                },
                {
                    slug: "binomial-expansion",
                    code: "4.4",
                    name: "Binomial expansion",
                    summary: "Binomial expansion of $(a + bx)^n$ for any rational $n$ and its range of validity.",
                },
                {
                    slug: "differentiation",
                    code: "4.5",
                    name: "Differentiation",
                    summary: "Parametric and implicit differentiation, and forming differential equations from rates of change.",
                },
                {
                    slug: "integration",
                    code: "4.6",
                    name: "Integration",
                    summary: "Substitution, by parts, partial fractions, volumes of revolution and differential equations.",
                },
                {
                    slug: "vectors",
                    code: "4.7",
                    name: "Vectors",
                    summary: "Vectors in three dimensions, vector equations of lines and the scalar product.",
                },
            ],
        },
        {
            code: "WME01",
            number: 5,
            name: "Mechanics 1",
            topics: [
                {
                    slug: "mathematical-models",
                    code: "1.1",
                    name: "Mathematical models in mechanics",
                    summary: "Modelling assumptions such as particles, light inextensible strings and smooth surfaces.",
                },
                {
                    slug: "vectors-in-mechanics",
                    code: "1.2",
                    name: "Vectors in mechanics",
                    summary: "Using vectors for displacement, velocity, acceleration and force, and resultants.",
                },
                {
                    slug: "kinematics",
                    code: "1.3",
                    name: "Kinematics of a particle in a straight line",
                    summary: "Constant acceleration equations and speed-time and distance-time graphs.",
                },
                {
                    slug: "dynamics",
                    code: "1.4",
                    name: "Dynamics of a particle",
                    summary: "Newton's laws, connected particles, friction, momentum and impulse.",
                },
                {
                    slug: "statics",
                    code: "1.5",
                    name: "Statics of a particle",
                    summary: "Forces in equilibrium, resolving forces, and limiting friction.",
                },
                { slug: "moments", code: "1.6", name: "Moments", summary: "Moments of forces and rigid bodies in equilibrium." },
            ],
        },
        {
            code: "WME02",
            number: 6,
            name: "Mechanics 2",
            topics: [
                {
                    slug: "kinematics",
                    code: "2.1",
                    name: "Kinematics of a particle in a straight line or plane",
                    summary: "Projectiles and motion with variable acceleration using calculus and vectors.",
                },
                {
                    slug: "centres-of-mass",
                    code: "2.2",
                    name: "Centres of mass",
                    summary: "Centres of mass of particles, laminas and frameworks, including suspended bodies.",
                },
                {
                    slug: "work-energy",
                    code: "2.3",
                    name: "Work and energy",
                    summary: "Work done, kinetic and potential energy, the work-energy principle and power.",
                },
                {
                    slug: "collisions",
                    code: "2.4",
                    name: "Collisions",
                    summary: "Newton's law of restitution, direct impact and successive collisions.",
                },
                {
                    slug: "statics-rigid-bodies",
                    code: "2.5",
                    name: "Statics of rigid bodies",
                    summary: "Equilibrium of rigid bodies such as ladders and rods under coplanar forces.",
                },
            ],
        },
        {
            code: "WST01",
            number: 7,
            name: "Statistics 1",
            topics: [
                {
                    slug: "mathematical-models",
                    code: "1.1",
                    name: "Mathematical models in probability and statistics",
                    summary: "The modelling cycle and the use of statistical models.",
                },
                {
                    slug: "data-representation",
                    code: "1.2",
                    name: "Representation and summary of data",
                    summary: "Histograms, box plots, measures of location and spread, coding and outliers.",
                },
                {
                    slug: "probability",
                    code: "1.3",
                    name: "Probability",
                    summary: "Venn and tree diagrams, conditional probability, independence and mutual exclusivity.",
                },
                {
                    slug: "correlation-regression",
                    code: "1.4",
                    name: "Correlation and regression",
                    summary: "Scatter diagrams, product moment correlation coefficient and least squares regression lines.",
                },
                {
                    slug: "discrete-random-variables",
                    code: "1.5",
                    name: "Discrete random variables",
                    summary: "Probability distributions, expectation and variance, and the discrete uniform distribution.",
                },
                {
                    slug: "normal-distribution",
                    code: "1.6",
                    name: "The Normal distribution",
                    summary: "Properties of the Normal distribution and standardising using tables.",
                },
            ],
        },
        {
            code: "WST02",
            number: 8,
            name: "Statistics 2",
            topics: [
                {
                    slug: "binomial-poisson",
                    code: "2.1",
                    name: "The Binomial and Poisson distributions",
                    summary: "Modelling with Binomial and Poisson distributions and the Poisson approximation.",
                },
                {
                    slug: "continuous-random-variables",
                    code: "2.2",
                    name: "Continuous random variables",
                    summary: "Probability density and cumulative distribution functions, mean, variance, median and mode.",
                },
                {
                    slug: "continuous-distributions",
                    code: "2.3",
                    name: "Continuous distributions",
                    summary: "The continuous uniform distribution and Normal approximations to Binomial and Poisson.",
                },
                {
                    slug: "hypothesis-tests",
                    code: "2.4",
                    name: "Hypothesis tests",
                    summary: "Populations and sampling, critical regions, and tests for Binomial and Poisson parameters.",
                },
            ],
        },
        {
            code: "WDM11",
            number: 9,
            name: "Decision Mathematics 1",
            topics: [
                {
                    slug: "algorithms",
                    code: "1.1",
                    name: "Algorithms",
                    summary: "Flow charts, sorting algorithms, binary search and bin packing.",
                },
                {
                    slug: "graphs-networks",
                    code: "1.2",
                    name: "Algorithms on graphs",
                    summary: "Graph terminology, minimum spanning trees (Prim and Kruskal) and Dijkstra's algorithm.",
                },
                {
                    slug: "graphs-networks-2",
                    code: "1.3",
                    name: "Algorithms on graphs II",
                    summary: "The route inspection problem and the travelling salesperson problem.",
                },
                {
                    slug: "critical-path-analysis",
                    code: "1.4",
                    name: "Critical path analysis",
                    summary: "Activity networks, early and late times, critical paths, float, Gantt charts and scheduling.",
                },
                {
                    slug: "linear-programming",
                    code: "1.5",
                    name: "Linear programming",
                    summary: "Formulating linear programming problems and solving them graphically.",
                },
            ],
        },
    ],
};

const furtherMathematics: SeedSubject = {
    slug: "further-mathematics",
    code: "YFM01",
    name: "Further Mathematics",
    description: "Further pure mathematics with further mechanics and statistics options.",
    color: "amber",
    units: [
        {
            code: "WFM01",
            number: 1,
            name: "Further Pure Mathematics 1",
            topics: [
                {
                    slug: "complex-numbers",
                    code: "1.1",
                    name: "Complex numbers",
                    summary: "Arithmetic of complex numbers, Argand diagrams, modulus-argument form and roots of polynomials.",
                },
                {
                    slug: "roots-of-quadratics",
                    code: "1.2",
                    name: "Roots of quadratic equations",
                    summary: "Sums and products of roots and forming equations with related roots.",
                },
                {
                    slug: "numerical-solutions",
                    code: "1.3",
                    name: "Numerical solution of equations",
                    summary: "Interval bisection, linear interpolation and the Newton-Raphson method.",
                },
                {
                    slug: "coordinate-systems",
                    code: "1.4",
                    name: "Coordinate systems",
                    summary: "Parabolas and rectangular hyperbolas in Cartesian and parametric form, with tangents and normals.",
                },
                {
                    slug: "matrix-algebra",
                    code: "1.5",
                    name: "Matrix algebra",
                    summary: "Matrix arithmetic, determinants and inverses of 2×2 matrices.",
                },
                {
                    slug: "matrix-transformations",
                    code: "1.6",
                    name: "Transformations using matrices",
                    summary: "Linear transformations in two dimensions and their matrix representations.",
                },
                {
                    slug: "series",
                    code: "1.7",
                    name: "Series",
                    summary: "Summing series using standard results for $\\sum r$, $\\sum r^2$ and $\\sum r^3$.",
                },
                {
                    slug: "proof-by-induction",
                    code: "1.8",
                    name: "Proof by induction",
                    summary: "Proof by mathematical induction for series, divisibility, matrices and recurrence relations.",
                },
            ],
        },
        {
            code: "WFM02",
            number: 2,
            name: "Further Pure Mathematics 2",
            topics: [
                {
                    slug: "inequalities",
                    code: "2.1",
                    name: "Inequalities",
                    summary: "Algebraic inequalities involving rational functions and the modulus function.",
                },
                { slug: "series", code: "2.2", name: "Series", summary: "Summing finite series using the method of differences." },
                {
                    slug: "further-complex-numbers",
                    code: "2.3",
                    name: "Further complex numbers",
                    summary: "Euler's relation, de Moivre's theorem, nth roots, loci and transformations of the complex plane.",
                },
                {
                    slug: "first-order-differential-equations",
                    code: "2.4",
                    name: "First order differential equations",
                    summary: "Integrating factors and reducing equations to standard form by substitution.",
                },
                {
                    slug: "second-order-differential-equations",
                    code: "2.5",
                    name: "Second order differential equations",
                    summary: "Linear equations with constant coefficients using complementary functions and particular integrals.",
                },
                {
                    slug: "maclaurin-taylor",
                    code: "2.6",
                    name: "Maclaurin and Taylor series",
                    summary: "Series expansions of functions and their use in approximations and solving differential equations.",
                },
                {
                    slug: "polar-coordinates",
                    code: "2.7",
                    name: "Polar coordinates",
                    summary: "Polar curves, areas enclosed by polar curves, and tangents parallel or perpendicular to the initial line.",
                },
            ],
        },
        {
            code: "WFM03",
            number: 3,
            name: "Further Pure Mathematics 3",
            topics: [
                {
                    slug: "hyperbolic-functions",
                    code: "3.1",
                    name: "Hyperbolic functions",
                    summary: "Definitions, graphs, identities and inverse hyperbolic functions.",
                },
                {
                    slug: "further-coordinate-systems",
                    code: "3.2",
                    name: "Further coordinate systems",
                    summary: "Ellipses and hyperbolas in Cartesian and parametric form, with foci, directrices and loci.",
                },
                {
                    slug: "differentiation",
                    code: "3.3",
                    name: "Differentiation",
                    summary: "Differentiating hyperbolic and inverse trigonometric and hyperbolic functions.",
                },
                {
                    slug: "integration",
                    code: "3.4",
                    name: "Integration",
                    summary: "Standard integrals, reduction formulae, arc length and surface area of revolution.",
                },
                {
                    slug: "vectors",
                    code: "3.5",
                    name: "Vectors",
                    summary: "Vector product, triple scalar product, and equations of lines and planes.",
                },
                {
                    slug: "further-matrix-algebra",
                    code: "3.6",
                    name: "Further matrix algebra",
                    summary: "3×3 matrices, eigenvalues and eigenvectors, and diagonalisation of symmetric matrices.",
                },
            ],
        },
        {
            code: "WME03",
            number: 4,
            name: "Mechanics 3",
            topics: [
                {
                    slug: "further-kinematics",
                    code: "3.1",
                    name: "Further kinematics",
                    summary: "Motion in a straight line where acceleration depends on time, velocity or displacement.",
                },
                {
                    slug: "elastic-strings-springs",
                    code: "3.2",
                    name: "Elastic strings and springs",
                    summary: "Hooke's law and elastic potential energy in problems with strings and springs.",
                },
                {
                    slug: "further-dynamics",
                    code: "3.3",
                    name: "Further dynamics",
                    summary: "Variable forces, Newton's law of gravitation and simple harmonic motion.",
                },
                {
                    slug: "circular-motion",
                    code: "3.4",
                    name: "Motion in a circle",
                    summary: "Uniform motion in a horizontal circle and motion in a vertical circle.",
                },
                {
                    slug: "statics-rigid-bodies",
                    code: "3.5",
                    name: "Statics of rigid bodies",
                    summary: "Centres of mass of solids and laminas by integration, and toppling and sliding.",
                },
            ],
        },
        {
            code: "WST03",
            number: 5,
            name: "Statistics 3",
            topics: [
                {
                    slug: "combinations-of-random-variables",
                    code: "3.1",
                    name: "Combinations of random variables",
                    summary: "Distributions of linear combinations of independent Normal random variables.",
                },
                {
                    slug: "sampling",
                    code: "3.2",
                    name: "Sampling",
                    summary: "Sampling methods, including random, systematic, stratified and quota sampling.",
                },
                {
                    slug: "estimation-confidence-intervals",
                    code: "3.3",
                    name: "Estimation, confidence intervals and tests",
                    summary: "Unbiased estimators, the Central Limit Theorem, confidence intervals and tests for means.",
                },
                {
                    slug: "goodness-of-fit",
                    code: "3.4",
                    name: "Goodness of fit and contingency tables",
                    summary: "Chi-squared goodness of fit tests and tests of independence in contingency tables.",
                },
                {
                    slug: "regression-correlation",
                    code: "3.5",
                    name: "Regression and correlation",
                    summary: "Spearman's rank correlation coefficient and hypothesis tests for correlation.",
                },
            ],
        },
    ],
};

const islam: SeedSubject = {
    slug: "islam",
    code: "LOCAL-ISL",
    name: "Islam",
    description: "Islamic studies as taught in Maldivian schools.",
    color: "rose",
    isLocal: true,
    units: [{ code: "ISL01", number: 1, name: "Islam", description: "Topics coming soon.", topics: [] }],
};

const dhivehi: SeedSubject = {
    slug: "dhivehi",
    code: "LOCAL-DHI",
    name: "Dhivehi",
    description: "Dhivehi language as taught in Maldivian schools.",
    color: "orange",
    isLocal: true,
    units: [{ code: "DHI01", number: 1, name: "Dhivehi Language", description: "Topics coming soon.", topics: [] }],
};

export const otherSubjects: SeedSubject[] = [chemistry, biology, mathematics, furtherMathematics, islam, dhivehi];
