import type { SeedFlashcard } from "../types";

// Original IAL Biology flashcards (written for this app, not taken from Pearson materials). Four recall cards per
// topic: definitions, structure and function, processes in order, and key comparisons.

// String.raw keeps LaTeX backslashes intact (e.g. \text, \times) inside template literals.
const r = String.raw;

/** Builds a topic's cards with stable keys: bio-<unit>-<topic>-fc-01, -02, ... */
function deck(unitCode: string, topicSlug: string, cards: [front: string, back: string][]): SeedFlashcard[] {
    return cards.map(([front, back], i) => ({
        seedKey: `bio-${unitCode.toLowerCase()}-${topicSlug}-fc-${String(i + 1).padStart(2, "0")}`,
        unitCode,
        topicSlug,
        front,
        back,
    }));
}

// ---------------------------------------------------------------------------------------------------------------
// WBI11 — Molecules, Diet, Transport and Health
// ---------------------------------------------------------------------------------------------------------------
const wbi11: SeedFlashcard[] = [
    ...deck("WBI11", "biological-molecules", [
        [
            "Why is water a good solvent in living organisms?",
            "Water is **polar** (slightly negative O, slightly positive H), so it attracts charged ions and other polar molecules, which dissolve. Dissolved substances can then be transported and take part in reactions.",
        ],
        [
            "Name the monosaccharides that make up sucrose, lactose and maltose.",
            "- **Sucrose** = glucose + fructose\n- **Lactose** = glucose + galactose\n- **Maltose** = glucose + glucose",
        ],
        [
            "Compare amylose and amylopectin.",
            r`Both are made of $\alpha$-glucose and found in starch. **Amylose**: unbranched, $\alpha$-1,4 bonds only, coils into a compact helix. **Amylopectin**: branched, $\alpha$-1,4 and $\alpha$-1,6 bonds, so it has many ends for faster hydrolysis.`,
        ],
        [
            "How does a phospholipid differ from a triglyceride?",
            "In a phospholipid, one of the three fatty acids is replaced by a **phosphate group**. The phosphate head is hydrophilic and the two fatty acid tails are hydrophobic, so phospholipids form bilayers in water.",
        ],
    ]),
    ...deck("WBI11", "heart-circulation", [
        [
            "Why do large multicellular organisms need a mass transport system?",
            "They have a **small surface area to volume ratio** and large diffusion distances, so diffusion alone is too slow to supply all cells. Mass flow moves substances quickly over long distances.",
        ],
        [
            "Put the stages of the cardiac cycle in order.",
            "1. **Atrial systole**: atria contract, blood pushed into ventricles.\n2. **Ventricular systole**: ventricles contract, AV valves close, semilunar valves open, blood enters arteries.\n3. **Diastole**: heart muscle relaxes, semilunar valves close, chambers refill.",
        ],
        [
            "Compare the walls of arteries, veins and capillaries.",
            "- **Arteries**: thick, elastic and muscular walls, narrow lumen.\n- **Veins**: thin walls, little elastic tissue, wide lumen, valves.\n- **Capillaries**: wall is one cell thick (endothelium only), very narrow lumen.",
        ],
        [
            "Describe how an atheroma forms.",
            "1. The endothelium is damaged (e.g. by high blood pressure).\n2. An inflammatory response: white blood cells move into the artery wall.\n3. Cholesterol builds up, forming a fatty deposit (atheroma).\n4. Calcium salts and fibrous tissue harden it into a plaque, narrowing the lumen.",
        ],
    ]),
    ...deck("WBI11", "cardiovascular-disease", [
        [
            "List six risk factors for cardiovascular disease.",
            "Genetics (family history), age, male sex, high blood pressure, smoking, inactivity, obesity, high blood cholesterol / diet high in saturated fat or salt. Some cannot be changed (genes, age, sex); others are lifestyle factors.",
        ],
        [
            "Compare LDLs and HDLs.",
            "- **LDLs**: more lipid, less protein; carry cholesterol **to** body cells; high levels linked to atheroma.\n- **HDLs**: more protein; carry cholesterol from tissues **to the liver** for removal; high levels lower CVD risk.",
        ],
        [
            "State how each treatment lowers CVD risk: antihypertensives, statins, anticoagulants, platelet inhibitors.",
            "- **Antihypertensives**: lower blood pressure.\n- **Statins**: reduce cholesterol synthesis in the liver, lowering LDL.\n- **Anticoagulants** (e.g. warfarin): reduce blood clotting.\n- **Platelet inhibitors** (e.g. aspirin): make platelets less sticky.",
        ],
        [
            "What is the difference between risk and the perception of risk?",
            "**Risk** is the measured probability of an event, based on data. **Perceived risk** is how likely people *think* it is: often overestimated for rare, dramatic events and underestimated for familiar habits like poor diet.",
        ],
    ]),
    ...deck("WBI11", "membranes-transport", [
        [
            "Define osmosis.",
            "The net movement of **water** molecules from a region of higher water potential to a region of lower water potential through a **partially permeable membrane**.",
        ],
        [
            "Compare facilitated diffusion and active transport.",
            "Both use membrane proteins. **Facilitated diffusion**: passive, down a concentration gradient, through channel or carrier proteins, no ATP. **Active transport**: against a concentration gradient, carrier proteins only, needs ATP.",
        ],
        [
            "What are endocytosis and exocytosis?",
            "Bulk transport using vesicles and ATP. **Endocytosis**: the membrane surrounds material and pinches off to bring it into the cell. **Exocytosis**: vesicles fuse with the cell membrane to release contents (e.g. enzymes, hormones) out of the cell.",
        ],
        [
            "State Fick's law of diffusion.",
            r`$$\text{rate of diffusion} \propto \frac{\text{surface area} \times \text{difference in concentration}}{\text{thickness of surface}}$$`,
        ],
    ]),
    ...deck("WBI11", "proteins-enzymes", [
        [
            "Draw (describe) the general structure of an amino acid.",
            r`A central carbon bonded to an **amine group** ($-\text{NH}_2$), a **carboxyl group** ($-\text{COOH}$), a hydrogen atom and a variable **R group**. Twenty different R groups give the different amino acids.`,
        ],
        [
            "Describe the four levels of protein structure.",
            "1. **Primary**: sequence of amino acids (peptide bonds).\n2. **Secondary**: α-helix or β-pleated sheet (hydrogen bonds).\n3. **Tertiary**: 3D folding (hydrogen, ionic, disulfide bonds, hydrophobic interactions).\n4. **Quaternary**: two or more polypeptide chains together.",
        ],
        [
            "How do enzymes speed up reactions?",
            "They **lower the activation energy**. The substrate binds to the complementary active site, forming an enzyme–substrate complex; the induced fit puts strain on bonds or brings molecules close together, so the reaction happens more easily.",
        ],
        [
            "Compare intracellular and extracellular enzymes, with an example of each.",
            "**Intracellular** enzymes act inside cells (e.g. catalase breaking down hydrogen peroxide). **Extracellular** enzymes are secreted and act outside cells (e.g. amylase in the digestive system).",
        ],
    ]),
    ...deck("WBI11", "dna-protein-synthesis", [
        [
            "Compare the structure of DNA and RNA.",
            "- **DNA**: double-stranded, deoxyribose sugar, bases A, T, C, G, very long.\n- **RNA**: single-stranded, ribose sugar, bases A, **U**, C, G, shorter.",
        ],
        [
            "Describe semi-conservative replication.",
            "1. DNA helicase breaks hydrogen bonds; the double helix unwinds.\n2. Each strand acts as a template.\n3. Free nucleotides pair with complementary bases.\n4. DNA polymerase joins them with phosphodiester bonds.\n5. Each new molecule has one original and one new strand.",
        ],
        [
            "What are the features of the genetic code?",
            "- **Triplet**: three bases code for one amino acid.\n- **Degenerate**: most amino acids have more than one codon.\n- **Non-overlapping**: each base is read in only one triplet.\n- **Universal**: the same codons code for the same amino acids in almost all organisms.",
        ],
        [
            "Describe translation.",
            "1. mRNA attaches to a ribosome.\n2. tRNA molecules with complementary **anticodons** bring specific amino acids.\n3. Two tRNAs bind at a time; a peptide bond forms between their amino acids.\n4. The ribosome moves along one codon; this repeats until a stop codon.",
        ],
    ]),
    ...deck("WBI11", "inheritance-genetic-disorders", [
        [
            "Define gene, allele, genotype and phenotype.",
            "- **Gene**: a sequence of DNA bases coding for a polypeptide.\n- **Allele**: an alternative form of a gene.\n- **Genotype**: the alleles an organism has.\n- **Phenotype**: the observable characteristics, from genotype and environment.",
        ],
        [
            "What is a point mutation? Name two types.",
            "A change in a single base in the DNA sequence. **Substitution**: one base is swapped for another (may change one amino acid). **Insertion / deletion**: a base is added or lost, causing a **frameshift** that changes every following codon.",
        ],
        [
            "Name three body systems affected by cystic fibrosis and the effect on each.",
            "- **Respiratory**: sticky mucus blocks airways, infections, poor gas exchange.\n- **Digestive**: pancreatic duct blocked, fewer enzymes reach the intestine, poor absorption.\n- **Reproductive**: thick mucus blocks sperm ducts or cervix, reducing fertility.",
        ],
        [
            "What is preimplantation genetic diagnosis (PGD)?",
            "In IVF, one cell is removed from an early embryo and its DNA is tested for a genetic disorder. Only embryos without the disorder are implanted. Ethical concerns include destroying embryos and possible selection for non-medical traits.",
        ],
    ]),
];

// ---------------------------------------------------------------------------------------------------------------
// WBI12 — Cells, Development, Biodiversity and Conservation
// ---------------------------------------------------------------------------------------------------------------
const wbi12: SeedFlashcard[] = [
    ...deck("WBI12", "cell-structure", [
        [
            "Give the function of: rough ER, smooth ER, Golgi apparatus, lysosome.",
            "- **Rough ER**: protein synthesis (ribosomes) and transport.\n- **Smooth ER**: lipid and steroid synthesis.\n- **Golgi apparatus**: modifies and packages proteins into vesicles.\n- **Lysosome**: contains digestive enzymes to break down old organelles and pathogens.",
        ],
        [
            "List four differences between prokaryotic and eukaryotic cells.",
            "Prokaryotes have: no nucleus (circular DNA free in cytoplasm), no membrane-bound organelles, smaller 70S ribosomes, a murein (peptidoglycan) cell wall, and often plasmids, flagella and a capsule. They are much smaller.",
        ],
        [
            "Compare magnification and resolution.",
            "**Magnification**: how many times bigger the image is than the real object. **Resolution**: the ability to distinguish two points close together as separate. Electron microscopes have higher resolution because electrons have a shorter wavelength than light.",
        ],
        [
            "How is a light microscope calibrated with an eyepiece graticule?",
            "Line up the eyepiece graticule with a **stage micrometer** (known divisions, e.g. 10 µm). Count how many graticule divisions equal a known length, and calculate the length of one graticule division at that objective. Recalibrate for each objective lens.",
        ],
    ]),
    ...deck("WBI12", "cell-cycle-reproduction", [
        [
            "Put the stages of the cell cycle in order.",
            "**Interphase** (G1: growth; S: DNA replication; G2: further growth and checks) → **mitosis** (prophase, metaphase, anaphase, telophase) → **cytokinesis** (cytoplasm divides).",
        ],
        [
            "Compare mitosis and meiosis.",
            "- **Mitosis**: one division, 2 daughter cells, diploid, genetically identical; for growth, repair and asexual reproduction.\n- **Meiosis**: two divisions, 4 cells, haploid, genetically different; produces gametes.",
        ],
        [
            "Describe the acrosome reaction and what happens next in mammalian fertilisation.",
            "The sperm reaches the zona pellucida; the **acrosome** releases enzymes that digest it. The sperm and egg membranes fuse, and the **cortical reaction** hardens the zona pellucida to prevent more sperm entering. The nuclei fuse to form a diploid zygote.",
        ],
        [
            "What is a chiasma?",
            "The point where **non-sister chromatids** of a homologous pair cross over and exchange sections during prophase I of meiosis, producing new combinations of alleles.",
        ],
    ]),
    ...deck("WBI12", "development-gene-expression", [
        [
            "Define stem cell, totipotent and pluripotent.",
            "- **Stem cell**: an undifferentiated cell that can divide and differentiate into specialised cells.\n- **Totipotent**: can form any cell, including placental cells.\n- **Pluripotent**: can form any body cell but not placental cells.",
        ],
        [
            "Give two arguments for and two against using embryonic stem cells in medicine.",
            "**For**: could treat many diseases (e.g. diabetes, Parkinson's); embryos used are often spare from IVF. **Against**: the embryo is destroyed, which some see as destroying a potential life; risk of rejection or tumour formation.",
        ],
        [
            "How does histone acetylation affect gene expression?",
            "Adding acetyl groups to histones makes the chromatin **less condensed**, so transcription factors and RNA polymerase can reach the DNA and the gene is **expressed** more. Removing acetyl groups has the opposite effect.",
        ],
        [
            "Why do phenotypes show continuous variation?",
            "The characteristic is **polygenic** (controlled by many genes, each with a small effect) and also influenced by the **environment**, so there is a range of values with no distinct categories, e.g. height or leaf length.",
        ],
    ]),
    ...deck("WBI12", "plant-structure-function", [
        [
            "Name three structures found in plant cells but not animal cells, with their functions.",
            "- **Cellulose cell wall**: support, resists osmotic bursting.\n- **Chloroplasts**: photosynthesis.\n- **Large permanent vacuole** (with tonoplast): stores cell sap, keeps the cell turgid.\n- Also **plasmodesmata**, which link neighbouring cells.",
        ],
        [
            "Compare starch and cellulose.",
            r`- **Starch**: $\alpha$-glucose, coiled / branched chains, energy store, insoluble.
- **Cellulose**: $\beta$-glucose, straight unbranched chains, hydrogen bonds between chains form microfibrils with high tensile strength, structural.`,
        ],
        [
            "Compare xylem vessels and sclerenchyma fibres.",
            "Both are dead cells with walls thickened by lignin. **Xylem vessels**: hollow tubes without end walls, transport water and minerals, have pits. **Sclerenchyma fibres**: have end walls, provide support only.",
        ],
        [
            "Why are plant fibres useful to humans?",
            "They are strong because of cellulose microfibrils and lignin, so they are used for rope, fabric and paper. They are **renewable** and **biodegradable**, so they can replace oil-based plastics and textiles.",
        ],
    ]),
    ...deck("WBI12", "plants-drugs", [
        [
            "How can you investigate the antimicrobial properties of plant extracts?",
            "Crush the plant in ethanol to make an extract. Soak sterile paper discs in each extract (and a control disc in ethanol only). Place on agar spread with bacteria, incubate at 25 °C, then measure the **clear zones of inhibition**.",
        ],
        [
            "Who was William Withering and why is he important?",
            "An 18th-century doctor who found that foxglove extract (digitalis) treated dropsy (oedema). He tested different doses on patients and recorded the effects, an early example of systematic drug testing, though by modern standards it was unsafe and uncontrolled.",
        ],
        [
            "What is a placebo and why is it used?",
            "A treatment with no active drug, given to a control group. It shows whether any improvement is caused by the drug itself and not by the **placebo effect** (patients improving because they expect to).",
        ],
        [
            "Why use aseptic technique when culturing bacteria?",
            "To prevent contamination of the culture by other microorganisms (which would affect results) and to prevent harmful microorganisms escaping. Examples: flame the loop, work near a Bunsen flame, briefly lift lids, tape lids shut without sealing completely.",
        ],
    ]),
    ...deck("WBI12", "biodiversity-classification", [
        [
            "Define species richness, endemism and genetic diversity.",
            "- **Species richness**: the number of different species in an area.\n- **Endemism**: a species found only in one geographical area.\n- **Genetic diversity**: the variety of alleles in a population's gene pool.",
        ],
        [
            "What is a niche?",
            "The role of a species in its habitat: how it uses biotic and abiotic resources and interacts with other organisms. No two species can occupy exactly the same niche in a habitat for long.",
        ],
        [
            "Name and give examples of the three types of adaptation.",
            "- **Anatomical** (structural): e.g. thick blubber in seals.\n- **Physiological** (body processes): e.g. hibernation, concentrated urine in desert mammals.\n- **Behavioural**: e.g. migration, courtship displays.",
        ],
        [
            "How is a new classification accepted by the scientific community?",
            "Scientists publish findings in **peer-reviewed** journals and present at conferences. Other scientists check and repeat the work. New evidence, e.g. DNA or protein sequence comparisons, can lead to species being reclassified.",
        ],
    ]),
    ...deck("WBI12", "conservation", [
        [
            "Give four roles of zoos in conservation.",
            "Captive breeding programmes, reintroduction to the wild, research (e.g. diet, reproduction, disease) and educating the public. Studbooks are used to avoid inbreeding.",
        ],
        [
            "Give four roles of seed banks.",
            "Store seeds of endangered and useful plants to preserve genetic diversity; supply seeds for reintroduction or habitat restoration; allow research (e.g. germination conditions); act as insurance against extinction from disease or climate change.",
        ],
        [
            "Why is inbreeding a problem in small captive populations?",
            "It reduces **genetic diversity** and increases the chance of offspring being homozygous for harmful recessive alleles, reducing fitness and the population's ability to adapt to change.",
        ],
        [
            "How do seed banks check that stored seeds are still viable?",
            "A sample of seeds is taken out at intervals and germinated under suitable conditions. If the germination rate falls, fresh seeds are grown and collected from plants to replace the stock.",
        ],
    ]),
];

// ---------------------------------------------------------------------------------------------------------------
// WBI13 — Practical Skills in Biology I
// ---------------------------------------------------------------------------------------------------------------
const wbi13: SeedFlashcard[] = [
    ...deck("WBI13", "practical-techniques", [
        [
            "How do you prepare a root tip squash to observe mitosis?",
            "1. Cut the tip (1–2 cm) of a root.\n2. Warm in hydrochloric acid to separate cells.\n3. Rinse, then stain (e.g. toluidine blue).\n4. Place on a slide, cover and squash gently to make one layer of cells.\n5. Observe at high power and count cells in each stage.",
        ],
        [
            "How do you use beetroot to investigate membrane permeability?",
            "Cut equal-sized discs with a cork borer, rinse to remove pigment from damaged cells, place in water at different temperatures (or ethanol concentrations) for a fixed time, then measure the absorbance of the water with a colorimeter.",
        ],
        [
            "How does temperature affect the heart rate of *Daphnia*, and how is it measured?",
            "Place one *Daphnia* in a cavity slide with a little water, view at low power, and count heartbeats for a fixed time (e.g. 20 s, then scale to beats per minute). Heart rate rises with temperature within a tolerable range because metabolic reactions speed up.",
        ],
        [
            "How do you measure the tensile strength of a plant fibre?",
            "Clamp one end of a fibre and hang a mass carrier from the other. Add masses one at a time until the fibre breaks; record the breaking mass. Use fibres of the same length, and wear eye protection and keep feet clear of falling masses.",
        ],
    ]),
    ...deck("WBI13", "experimental-design", [
        [
            "Define independent, dependent and control variables.",
            "- **Independent**: the variable you change.\n- **Dependent**: the variable you measure.\n- **Control**: variables kept the same so they do not affect the dependent variable.",
        ],
        [
            "What is the difference between accuracy and precision?",
            "**Accuracy**: how close a measurement is to the true value. **Precision**: how close repeated measurements are to each other (small spread). Results can be precise but not accurate if there is a systematic error.",
        ],
        [
            "What makes an investigation valid?",
            "It measures what it claims to measure: the independent variable is the only thing that affects the dependent variable, because all other variables are controlled, and suitable controls are included.",
        ],
        [
            "Why choose an appropriate range and interval for the independent variable?",
            "A wide enough **range** shows the full pattern (e.g. both sides of an optimum). Small enough **intervals** (at least five values) let you locate key points such as the optimum accurately.",
        ],
    ]),
    ...deck("WBI13", "data-analysis-evaluation", [
        [
            "What is an anomalous result and how should you deal with it?",
            "A result that does not fit the pattern of the other data. Identify it, exclude it from the mean (stating this), and if possible repeat that measurement.",
        ],
        [
            "How do you calculate percentage change?",
            r`$$\text{percentage change} = \frac{\text{final value} - \text{initial value}}{\text{initial value}} \times 100$$ A negative answer is a percentage decrease.`,
        ],
        [
            "When should you draw a bar chart, a histogram or a line graph?",
            "- **Bar chart**: categoric (discontinuous) independent variable.\n- **Histogram**: frequency of a continuous variable in classes.\n- **Line graph**: continuous independent and dependent variables; plot the independent variable on the x-axis.",
        ],
        [
            "What does standard deviation tell you?",
            "The **spread** of data around the mean. A small SD means values are close to the mean (precise). If mean ± SD ranges of two groups overlap a lot, the difference between them is unlikely to be significant.",
        ],
    ]),
];

// ---------------------------------------------------------------------------------------------------------------
// WBI14 — Energy, Environment, Microbiology and Immunity
// ---------------------------------------------------------------------------------------------------------------
const wbi14: SeedFlashcard[] = [
    ...deck("WBI14", "photosynthesis", [
        [
            "Where do the two stages of photosynthesis take place in the chloroplast?",
            "- **Light-dependent reactions**: thylakoid membranes (grana).\n- **Light-independent reactions (Calvin cycle)**: stroma.",
        ],
        [
            "What is photolysis?",
            r`The splitting of water by light energy in the light-dependent reactions: $2\text{H}_2\text{O} \rightarrow 4\text{H}^+ + 4e^- + \text{O}_2$. Electrons replace those lost from chlorophyll, H⁺ reduce NADP, and O₂ is a by-product.`,
        ],
        [
            "Compare cyclic and non-cyclic photophosphorylation.",
            "**Non-cyclic**: involves photosystems I and II, photolysis, makes ATP and reduced NADP, releases O₂. **Cyclic**: photosystem I only, electrons return to PSI, makes ATP only, no reduced NADP or O₂.",
        ],
        [
            "Why do plants have several photosynthetic pigments?",
            "Each pigment (chlorophyll a, chlorophyll b, carotenoids) absorbs different wavelengths of light, so together they absorb a wider range of wavelengths for photosynthesis.",
        ],
    ]),
    ...deck("WBI14", "ecosystems-energy-transfer", [
        [
            "Define gross and net primary productivity.",
            "- **GPP**: the rate at which plants convert light energy into chemical energy in organic molecules.\n- **NPP**: the rate at which energy is stored in plant biomass after respiratory losses: NPP = GPP − R.",
        ],
        [
            "Define population, community, habitat and ecosystem.",
            "- **Population**: all organisms of one species in a habitat.\n- **Community**: all populations of different species in a habitat.\n- **Habitat**: where an organism lives.\n- **Ecosystem**: a community and its non-living environment interacting.",
        ],
        [
            "What is succession?",
            "The change in a community over time. Pioneer species colonise bare ground and change the conditions (e.g. form soil), allowing other species to replace them, until a stable **climax community** forms.",
        ],
        [
            "Give two biotic and two abiotic factors that affect population size.",
            "**Biotic**: predation, competition, disease, food availability. **Abiotic**: temperature, light intensity, water availability, pH, soil mineral content.",
        ],
    ]),
    ...deck("WBI14", "climate-change-evolution", [
        [
            "Name three sources of evidence for past climate change.",
            "- **Ice cores**: trapped air bubbles (CO₂) and isotope ratios (temperature).\n- **Pollen in peat bogs**: vegetation types reflect past climate.\n- **Dendrochronology**: tree ring widths reflect growing conditions.",
        ],
        [
            "How does the greenhouse effect lead to global warming?",
            "Greenhouse gases (CO₂, methane, water vapour) absorb infrared radiation emitted from the Earth's surface and re-radiate it, keeping heat in the atmosphere. Increasing their concentration (e.g. burning fossil fuels, deforestation) raises mean global temperature.",
        ],
        [
            "Give three possible effects of climate change on organisms.",
            "Changes in species' **distribution** (moving towards the poles or higher altitudes), changes in the timing of **life cycles** (e.g. earlier flowering), and changes in enzyme activity and development rates. Coral bleaching from warmer seas is a local example.",
        ],
        [
            "Compare allopatric and sympatric speciation.",
            "**Allopatric**: populations are separated by a geographical barrier. **Sympatric**: populations live in the same area but become reproductively isolated by other means (e.g. behaviour, breeding season, polyploidy).",
        ],
    ]),
    ...deck("WBI14", "microbiology", [
        [
            "Name the four phases of a bacterial growth curve.",
            "1. **Lag**: adapting, little division.\n2. **Exponential (log)**: rapid division, plenty of resources.\n3. **Stationary**: division rate = death rate.\n4. **Death (decline)**: nutrients run out, toxic waste builds up.",
        ],
        [
            "Compare counting bacteria with a haemocytometer and by dilution plating.",
            "**Haemocytometer**: counts cells directly under a microscope; total count (living and dead). **Dilution plating**: counts colonies after incubation; **viable** count only, assumes one colony grows from one cell.",
        ],
        [
            "How is tuberculosis spread and how does it cause disease?",
            "*Mycobacterium tuberculosis* spreads in airborne droplets. Macrophages engulf it but it survives inside them; it can stay dormant in tubercles, then become active, destroying lung tissue. It causes coughing, weight loss and fever.",
        ],
        [
            "Describe the structure of HIV.",
            "An RNA genome and the enzyme **reverse transcriptase** inside a protein capsid, surrounded by a lipid envelope with glycoprotein (gp120) that binds CD4 receptors on T helper cells.",
        ],
    ]),
    ...deck("WBI14", "immunity", [
        [
            "Name four non-specific defences against pathogens.",
            "Skin (physical barrier), mucus and cilia in airways, stomach acid, lysozyme (in tears and saliva), inflammation and phagocytosis.",
        ],
        [
            "Describe phagocytosis.",
            "1. The phagocyte is attracted to the pathogen and engulfs it in a vesicle (phagosome).\n2. Lysosomes fuse with the phagosome and release digestive enzymes (lysozymes).\n3. The pathogen is digested; macrophages then present its antigens.",
        ],
        [
            "Compare primary and secondary immune responses.",
            "The **secondary** response is faster, larger and lasts longer because **memory cells** from the first exposure divide quickly into plasma cells, so antibodies are produced before symptoms develop.",
        ],
        [
            "Compare bactericidal and bacteriostatic antibiotics.",
            "**Bactericidal** antibiotics kill bacteria (e.g. penicillin, which weakens cell walls). **Bacteriostatic** antibiotics stop bacteria growing and dividing (e.g. tetracycline, which inhibits protein synthesis), so the immune system can then destroy them.",
        ],
    ]),
    ...deck("WBI14", "forensics", [
        [
            "Put the steps of DNA profiling in order.",
            "1. Extract DNA from a sample.\n2. Amplify it using PCR.\n3. Cut with restriction enzymes (or amplify specific STRs).\n4. Separate fragments by gel electrophoresis.\n5. Label with probes / dye and compare band patterns.",
        ],
        [
            "Why are short tandem repeats (STRs) used in DNA profiling?",
            "STRs are short base sequences repeated many times in non-coding DNA. The **number of repeats varies greatly** between individuals, so comparing several STR loci gives a profile that is very unlikely to match by chance.",
        ],
        [
            "List four methods for estimating time of death.",
            "Body temperature (cooling), degree of rigor mortis, extent of decomposition, forensic entomology (stage of insect larvae) and stomach contents.",
        ],
        [
            "How does forensic entomology help estimate time of death?",
            "Insects such as blowflies lay eggs on a body soon after death. The species present and the stage of development of their larvae indicate how long the body has been there, adjusted for temperature, which affects development rate.",
        ],
    ]),
];

// ---------------------------------------------------------------------------------------------------------------
// WBI15 — Respiration, Internal Environment, Coordination and Gene Technology
// ---------------------------------------------------------------------------------------------------------------
const wbi15: SeedFlashcard[] = [
    ...deck("WBI15", "respiration", [
        [
            "Summarise glycolysis.",
            "In the cytoplasm: glucose is phosphorylated (using 2 ATP) and split into two triose phosphates, which are oxidised to **2 pyruvate**. Net yield: **2 ATP** and **2 reduced NAD** per glucose.",
        ],
        [
            "What happens in the link reaction?",
            "In the mitochondrial matrix, pyruvate is decarboxylated (loses CO₂) and dehydrogenated (reduces NAD), and the acetyl group combines with coenzyme A to form **acetyl CoA**.",
        ],
        [
            "What are the products of one turn of the Krebs cycle?",
            "Per acetyl CoA: 2 CO₂, 3 reduced NAD, 1 reduced FAD and 1 ATP (by substrate-level phosphorylation). Oxaloacetate is regenerated to accept the next acetyl group.",
        ],
        [
            "How is RQ calculated and what values indicate each substrate?",
            r`$$\text{RQ} = \frac{\text{CO}_2 \text{ produced}}{\text{O}_2 \text{ consumed}}$$ Carbohydrate ≈ 1.0, protein ≈ 0.9, lipid ≈ 0.7. Values above 1 suggest some anaerobic respiration.`,
        ],
    ]),
    ...deck("WBI15", "muscles-exercise", [
        [
            "Compare slow-twitch and fast-twitch muscle fibres.",
            "**Slow-twitch**: many mitochondria, much myoglobin, many capillaries, aerobic, fatigue-resistant (endurance). **Fast-twitch**: few mitochondria, little myoglobin, rely on anaerobic respiration, contract quickly but tire fast (sprinting).",
        ],
        [
            "Describe the sequence of electrical activity in the heart.",
            "1. The **SAN** initiates a wave of excitation across the atria; they contract.\n2. Non-conducting tissue delays it; the **AVN** passes it on after a short delay.\n3. It travels down the **bundle of His** and **Purkyne fibres** to the ventricle apex.\n4. Ventricles contract from the apex up.",
        ],
        [
            "How is breathing rate controlled during exercise?",
            "Chemoreceptors detect rising CO₂ (lower pH) in the blood and send impulses to the **ventilation centre** in the medulla, which sends more impulses to the intercostal muscles and diaphragm, increasing the rate and depth of breathing.",
        ],
        [
            "Define tidal volume and vital capacity.",
            "**Tidal volume**: the volume of air breathed in or out in one normal breath (about 0.5 dm³ at rest). **Vital capacity**: the maximum volume that can be breathed out after the deepest possible breath in.",
        ],
    ]),
    ...deck("WBI15", "homeostasis", [
        [
            "Define homeostasis and negative feedback.",
            "**Homeostasis**: maintaining a stable internal environment within narrow limits. **Negative feedback**: a change from the norm triggers a response that reverses the change, returning the factor to its set point.",
        ],
        [
            "How does the body respond to a fall in core temperature?",
            "Detected by the hypothalamus. Vasoconstriction of skin arterioles (less heat loss), shivering (heat from respiration), hairs raised by erector muscles (trapped air), less sweating, and increased metabolic rate.",
        ],
        [
            "Put the regions of a nephron in the order filtrate passes through them.",
            "Glomerulus / Bowman's capsule (ultrafiltration) → proximal convoluted tubule (selective reabsorption) → loop of Henle → distal convoluted tubule → collecting duct (water reabsorption).",
        ],
        [
            "How do steroid hormones control gene expression?",
            "Lipid-soluble steroid hormones (e.g. oestrogen) diffuse through the cell membrane and bind to a receptor in the cytoplasm or nucleus. The hormone–receptor complex acts as a **transcription factor**, binding DNA and switching genes on or off.",
        ],
    ]),
    ...deck("WBI15", "nervous-system", [
        [
            "How is the resting potential maintained?",
            "The **sodium–potassium pump** actively moves 3 Na⁺ out for every 2 K⁺ in. The membrane is more permeable to K⁺, which diffuses back out. The inside is about **−70 mV** relative to the outside.",
        ],
        [
            "Put the stages of an action potential in order.",
            "1. Stimulus: Na⁺ channels open, Na⁺ diffuses in (**depolarisation**).\n2. At about +40 mV, Na⁺ channels close and K⁺ channels open; K⁺ diffuses out (**repolarisation**).\n3. **Hyperpolarisation**: overshoot below resting potential.\n4. Pump restores resting potential (refractory period).",
        ],
        [
            "How does myelination increase the speed of an impulse?",
            "The myelin sheath (Schwann cells) insulates the axon, so depolarisation happens only at the **nodes of Ranvier**. The impulse jumps from node to node (**saltatory conduction**), which is much faster.",
        ],
        [
            "Compare rods and cones.",
            "**Rods**: rhodopsin, very sensitive to dim light, black and white vision, many rods share one bipolar cell (low acuity). **Cones**: iodopsin, three types for colour vision, need bright light, one per bipolar cell (high acuity).",
        ],
    ]),
    ...deck("WBI15", "plant-responses-brain", [
        [
            "How does phytochrome control flowering?",
            "Red light converts **Pr → Pfr**; far-red light and darkness convert Pfr → Pr. Night length affects how much Pfr is present. Pfr promotes flowering in long-day plants and inhibits it in short-day plants.",
        ],
        [
            "Give one effect each of auxins, gibberellins and abscisic acid.",
            "- **Auxins (IAA)**: cell elongation in shoots, apical dominance.\n- **Gibberellins**: stem elongation, seed germination.\n- **Abscisic acid**: stomatal closure in drought, seed dormancy.",
        ],
        [
            "Give a function of each: cerebrum, cerebellum, medulla oblongata, hypothalamus.",
            "- **Cerebrum**: conscious thought, memory, vision, language, voluntary movement.\n- **Cerebellum**: balance and coordination of movement.\n- **Medulla oblongata**: heart rate and breathing.\n- **Hypothalamus**: thermoregulation, osmoregulation.",
        ],
        [
            "What is the critical window in the development of the visual cortex?",
            "A period early in life when the visual cortex must receive stimulation from the eyes to develop normally. Evidence from kittens with one eye covered showed that neurones from the covered eye lost connections that were not regained later.",
        ],
    ]),
    ...deck("WBI15", "gene-technology", [
        [
            "What are restriction enzymes and sticky ends?",
            "Restriction enzymes (endonucleases) cut DNA at specific **recognition sequences**. Many make staggered cuts leaving short single-stranded overhangs (**sticky ends**) that can pair with complementary sticky ends from DNA cut by the same enzyme.",
        ],
        [
            "Name four ways of getting a gene into a cell.",
            "Plasmid vectors (taken up after heat shock), viral vectors, *Agrobacterium tumefaciens* (Ti plasmid, for plants), gene guns (DNA-coated gold particles), microinjection and liposomes.",
        ],
        [
            "Give two arguments for and two against GM crops.",
            "**For**: higher yields, pest or herbicide resistance, extra nutrients (e.g. Golden Rice with β-carotene). **Against**: transgenes may spread to wild relatives, reduced biodiversity, possible resistance in pests, farmers dependent on seed companies.",
        ],
        [
            "What is bioinformatics?",
            "The use of computer software to store, organise and analyse large amounts of biological data, such as genome or protein sequences, e.g. to compare DNA sequences between species or identify genes.",
        ],
    ]),
];

// ---------------------------------------------------------------------------------------------------------------
// WBI16 — Practical Skills in Biology II
// ---------------------------------------------------------------------------------------------------------------
const wbi16: SeedFlashcard[] = [
    ...deck("WBI16", "planning-investigations", [
        [
            "What should a plan for a biology investigation include?",
            "A hypothesis; independent variable and its range; how the dependent variable is measured; how each control variable is controlled; a control experiment; repeats; risk assessment and ethical issues; how data will be analysed (e.g. a statistical test).",
        ],
        [
            "What is a null hypothesis?",
            "A statement that there is **no** difference, association or correlation between the variables being tested (any difference is due to chance). A statistical test decides whether it can be rejected.",
        ],
        [
            "How can you carry out a pilot study and why?",
            "Run a small trial of the method before the main investigation to check it works, choose a suitable range and intervals for the independent variable, and find how long to run each test.",
        ],
        [
            "How is random sampling done in a field study?",
            "Divide the area into a grid and use random number generators to choose coordinates for each quadrat. This avoids bias in choosing sampling sites.",
        ],
    ]),
    ...deck("WBI16", "statistical-tests", [
        [
            "When do you use a $t$-test, chi-squared test and Spearman's rank?",
            "- **$t$-test**: compare the means of two groups of continuous data.\n- **Chi-squared**: compare observed and expected frequencies in categories.\n- **Spearman's rank**: test for a correlation between two variables.",
        ],
        [
            "What does $p < 0.05$ mean?",
            "There is less than a 5% probability that the result (difference or correlation) is due to chance. The result is **significant** and the null hypothesis is rejected.",
        ],
        [
            "How do you use a critical value table?",
            r`Calculate the test statistic and degrees of freedom (or $n$). Find the critical value at $p = 0.05$. For $t$, $\chi^2$ and $r_s$: if the calculated value (ignoring sign for $t$ and $r_s$) is **greater than or equal to** the critical value, reject the null hypothesis.`,
        ],
        [
            "How do you calculate degrees of freedom for a $t$-test and a chi-squared test?",
            r`- Unpaired $t$-test: $n_1 + n_2 - 2$
- Chi-squared: number of categories $- 1$`,
        ],
    ]),
    ...deck("WBI16", "evaluation", [
        [
            "Compare random and systematic errors.",
            "**Random errors** vary unpredictably between readings and are reduced by repeats and a mean. **Systematic errors** shift every reading by the same amount or proportion (e.g. zero error) and are not reduced by repeating.",
        ],
        [
            "How do you calculate percentage error (uncertainty) of a measurement?",
            r`$$\text{percentage error} = \frac{\text{uncertainty}}{\text{measured value}} \times 100$$ The uncertainty is usually half the smallest division of the instrument.`,
        ],
        [
            "What makes a conclusion valid?",
            "It is supported by the data, refers to the data (with figures), is limited to the range tested, takes account of statistical significance, and does not claim cause from correlation alone.",
        ],
        [
            "Give four common limitations to look for when evaluating a method.",
            "Too few repeats; uncontrolled variables (e.g. temperature); subjective end points (e.g. colour change); small sample or range; inappropriate measuring apparatus with low resolution.",
        ],
    ]),
];

export const biologyFlashcards: SeedFlashcard[] = [...wbi11, ...wbi12, ...wbi13, ...wbi14, ...wbi15, ...wbi16];
