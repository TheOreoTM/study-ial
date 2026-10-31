import type { SeedQuestion } from "../types";

// Original IAL-style Biology practice questions (written for this app, not taken from Pearson papers).
// Every question is a DRAFT: an admin reviews and publishes it. Statistical critical values are given in the stems
// so that answers do not depend on a particular table.

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
// WBI11 — Molecules, Diet, Transport and Health
// ---------------------------------------------------------------------------------------------------------------
const wbi11: SeedQuestion[] = [
    // --- biological-molecules ---
    {
        seedKey: "bio-wbi11-biological-molecules-001",
        unitCode: "WBI11",
        topicSlug: "biological-molecules",
        type: "MCQ",
        difficulty: "EASY",
        marks: 1,
        status: "DRAFT",
        stem: r`Two $\alpha$-glucose molecules join to form maltose. Which bond is formed?`,
        options: opts(
            r`$\alpha$-1,4 glycosidic bond`,
            r`$\beta$-1,4 glycosidic bond`,
            r`ester bond`,
            r`$\alpha$-1,6 glycosidic bond`,
            "A",
        ),
        markScheme: r`- **A** (1) — a condensation reaction between carbon 1 of one $\alpha$-glucose and carbon 4 of the other.`,
        explanation: r`$\beta$-1,4 bonds join $\beta$-glucose (cellulose), ester bonds join fatty acids to glycerol, and $\alpha$-1,6 bonds form the **branch points** in amylopectin and glycogen, not the link in maltose.`,
    },
    {
        seedKey: "bio-wbi11-biological-molecules-002",
        unitCode: "WBI11",
        topicSlug: "biological-molecules",
        type: "SHORT",
        difficulty: "MEDIUM",
        marks: 4,
        status: "DRAFT",
        stem: r`Glycogen is the main carbohydrate store in mammalian liver and muscle cells.

Explain how the structure of glycogen makes it suitable as an energy store.`,
        markScheme: r`- Highly branched with many $\alpha$-1,6 bonds, so there are many ends where enzymes can hydrolyse it (1)
- So glucose can be released rapidly when it is needed for respiration (1)
- Insoluble, so it does not lower the water potential of the cell / has no osmotic effect (1)
- Compact / coiled, so a lot of glucose is stored in a small space (1)`,
        explanation: r`Link each feature to its consequence ("branched **so** rapid hydrolysis"). Simply listing "branched, insoluble, compact" gains little. Glycogen is more branched than amylopectin, which suits the higher metabolic rate of animals.`,
    },
    {
        seedKey: "bio-wbi11-biological-molecules-003",
        unitCode: "WBI11",
        topicSlug: "biological-molecules",
        type: "SHORT",
        difficulty: "EASY",
        marks: 3,
        status: "DRAFT",
        stem: r`Describe how a triglyceride molecule is formed.`,
        markScheme: r`- One glycerol molecule and three fatty acid molecules (1)
- Joined by condensation reactions, releasing three molecules of water (1)
- Forming three ester bonds (1)`,
        explanation: r`The bond is an **ester** bond, not a glycosidic or peptide bond. Each of the three condensation reactions releases one water molecule, so three water molecules are released in total.`,
    },

    // --- heart-circulation ---
    {
        seedKey: "bio-wbi11-heart-circulation-001",
        unitCode: "WBI11",
        topicSlug: "heart-circulation",
        type: "MCQ",
        difficulty: "MEDIUM",
        marks: 1,
        status: "DRAFT",
        stem: r`Which row describes the valves of the heart while blood is being forced out of the ventricles into the arteries (ventricular systole)?`,
        options: opts(
            "Atrioventricular valves open; semilunar valves open",
            "Atrioventricular valves open; semilunar valves closed",
            "Atrioventricular valves closed; semilunar valves closed",
            "Atrioventricular valves closed; semilunar valves open",
            "D",
        ),
        markScheme: r`- **D** (1) — ventricular pressure is above atrial pressure (AV valves shut) and above arterial pressure (semilunar valves open).`,
        explanation: r`Valves open and close because of **pressure differences**. Both sets are closed only briefly at the start of systole (before ventricular pressure exceeds arterial pressure), but blood cannot leave then.`,
    },
    {
        seedKey: "bio-wbi11-heart-circulation-002",
        unitCode: "WBI11",
        topicSlug: "heart-circulation",
        type: "SHORT",
        difficulty: "MEDIUM",
        marks: 4,
        status: "DRAFT",
        stem: r`Explain how the structure of an artery is related to its function.`,
        markScheme: r`- Thick layer of elastic fibres, so the wall can stretch when blood is pumped in at high pressure (1)
- Elastic recoil smooths the flow / maintains pressure between heartbeats (1)
- Thick layer of smooth muscle, which contracts to alter the diameter of the lumen / control blood flow (1)
- Collagen in the outer layer gives strength so the wall does not burst under high pressure (1)`,
        explanation: r`A common error is saying arteries "pump" blood: the smooth muscle constricts or dilates the vessel but does not pump. The smooth endothelium also reduces friction, which could be credited as an alternative point.`,
    },
    {
        seedKey: "bio-wbi11-heart-circulation-003",
        unitCode: "WBI11",
        topicSlug: "heart-circulation",
        type: "SHORT",
        difficulty: "HARD",
        marks: 4,
        status: "DRAFT",
        stem: r`Describe the sequence of events that leads to the formation of a blood clot after a blood vessel is damaged.`,
        markScheme: r`- Platelets / damaged tissue release thromboplastin (1)
- Thromboplastin catalyses the conversion of prothrombin into thrombin (in the presence of calcium ions) (1)
- Thrombin catalyses the conversion of soluble fibrinogen into insoluble fibrin (1)
- Fibrin forms a mesh of fibres that traps platelets and red blood cells (1)`,
        explanation: r`Keep the cascade in order and name the soluble and insoluble forms. A frequent slip is writing that thromboplastin converts fibrinogen directly; it acts on prothrombin.`,
    },

    // --- cardiovascular-disease ---
    {
        seedKey: "bio-wbi11-cardiovascular-disease-001",
        unitCode: "WBI11",
        topicSlug: "cardiovascular-disease",
        type: "MCQ",
        difficulty: "EASY",
        marks: 1,
        status: "DRAFT",
        stem: r`A man has a mass of $81\,\text{kg}$ and a height of $1.80\,\text{m}$. What is his body mass index (BMI)?`,
        options: opts(
            r`$45.0\,\text{kg m}^{-2}$`,
            r`$25.0\,\text{kg m}^{-2}$`,
            r`$22.5\,\text{kg m}^{-2}$`,
            r`$2.5\,\text{kg m}^{-2}$`,
            "B",
        ),
        markScheme: r`- **B** (1) — $81 \div 1.80^2 = 81 \div 3.24 = 25.0$.`,
        explanation: r`BMI = mass ÷ height **squared**. Dividing by the height without squaring gives 45.0 (option A).`,
    },
    {
        seedKey: "bio-wbi11-cardiovascular-disease-002",
        unitCode: "WBI11",
        topicSlug: "cardiovascular-disease",
        type: "CALCULATION",
        difficulty: "MEDIUM",
        marks: 3,
        status: "DRAFT",
        stem: r`A student records her energy budget for a typical day.

| | Energy / kJ |
| --- | --- |
| Energy intake from food | 10 500 |
| Basal metabolic rate | 7 200 |
| Energy used in physical activity | 2 900 |

Assume 1 g of body fat stores $37\,\text{kJ}$ of energy. Calculate the mass of fat she would gain over 30 days if her energy budget stayed the same. Give your answer to 3 significant figures.`,
        markScheme: r`- Daily energy surplus $= 10\,500 - (7\,200 + 2\,900) = 400\,\text{kJ}$ (1)
- Surplus over 30 days $= 400 \times 30 = 12\,000\,\text{kJ}$ (1)
- Mass of fat $= 12\,000 \div 37 = 324\,\text{g}$ (1)`,
        explanation: r`Energy output is BMR **plus** activity. A positive energy budget (intake > output) leads to mass gain; a negative one to mass loss.`,
    },
    {
        seedKey: "bio-wbi11-cardiovascular-disease-003",
        unitCode: "WBI11",
        topicSlug: "cardiovascular-disease",
        type: "SHORT",
        difficulty: "MEDIUM",
        marks: 3,
        status: "DRAFT",
        stem: r`Statins are prescribed to many people at high risk of cardiovascular disease (CVD).

Explain how statins reduce the risk of CVD and give **one** possible side effect.`,
        markScheme: r`- Statins inhibit an enzyme in the liver that is needed to make cholesterol (1)
- So blood LDL (cholesterol) concentration falls, so less atheroma forms in artery walls (1)
- Side effect: e.g. muscle pain / liver damage / digestive problems / headaches (1)`,
        explanation: r`Statins lower **LDL**, the lipoprotein linked to atheroma formation. Avoid saying they "remove" existing plaques. When weighing up treatments, compare benefits against side effects and the need to take the drug long term.`,
    },

    // --- membranes-transport ---
    {
        seedKey: "bio-wbi11-membranes-transport-001",
        unitCode: "WBI11",
        topicSlug: "membranes-transport",
        type: "MCQ",
        difficulty: "EASY",
        marks: 1,
        status: "DRAFT",
        stem: r`Which process requires energy from ATP?`,
        options: opts(
            "Facilitated diffusion of glucose through a channel protein",
            "Osmosis of water into a root hair cell",
            "Diffusion of oxygen into an alveolar capillary",
            "Uptake of mineral ions against their concentration gradient",
            "D",
        ),
        markScheme: r`- **D** (1) — moving ions against a concentration gradient is active transport, which uses ATP and carrier proteins.`,
        explanation: r`Facilitated diffusion uses membrane proteins but is still **passive**: substances move down their concentration gradient, so no ATP is needed.`,
    },
    {
        seedKey: "bio-wbi11-membranes-transport-002",
        unitCode: "WBI11",
        topicSlug: "membranes-transport",
        type: "SHORT",
        difficulty: "MEDIUM",
        marks: 4,
        status: "DRAFT",
        stem: r`Explain how the alveoli of the mammalian lung are adapted for rapid gas exchange. Refer to Fick's law in your answer.`,
        markScheme: r`- Many alveoli give a large surface area (1)
- Alveolar wall and capillary wall are each one cell thick / squamous, giving a short diffusion distance (1)
- Blood flow and ventilation maintain a steep concentration gradient (1)
- Fick's law: rate of diffusion is proportional to surface area × concentration difference ÷ thickness of the surface (1)`,
        explanation: r`Fick's law is: rate $\propto \dfrac{\text{surface area} \times \text{difference in concentration}}{\text{thickness of surface}}$. Each adaptation should be linked to one of these three terms.`,
    },
    {
        seedKey: "bio-wbi11-membranes-transport-003",
        unitCode: "WBI11",
        topicSlug: "membranes-transport",
        type: "SHORT",
        difficulty: "EASY",
        marks: 3,
        status: "DRAFT",
        stem: r`Describe the fluid mosaic model of membrane structure.`,
        markScheme: r`- A bilayer of phospholipids with hydrophilic heads facing outwards and hydrophobic tails facing inwards (1)
- Proteins (intrinsic and extrinsic) scattered through the bilayer like a mosaic (1)
- Phospholipids and proteins can move sideways, so the membrane is fluid (1)`,
        explanation: r`"Fluid" refers to the movement of molecules within the layer and "mosaic" to the scattered proteins. Cholesterol, glycoproteins and glycolipids are also part of the model.`,
    },

    // --- proteins-enzymes ---
    {
        seedKey: "bio-wbi11-proteins-enzymes-001",
        unitCode: "WBI11",
        topicSlug: "proteins-enzymes",
        type: "MCQ",
        difficulty: "MEDIUM",
        marks: 1,
        status: "DRAFT",
        stem: r`An enzyme solution is heated to $80\,^\circ\text{C}$ and the enzyme is denatured. Which bonds in the enzyme are **least** likely to have been broken?`,
        options: opts("Hydrogen bonds", "Ionic bonds", "Peptide bonds", "Hydrophobic interactions", "C"),
        markScheme: r`- **C** (1) — peptide bonds are strong covalent bonds; heating breaks the weaker bonds holding the tertiary structure.`,
        explanation: r`Denaturation changes the shape (tertiary structure) of the active site, but the primary structure (sequence of amino acids joined by peptide bonds) stays intact.`,
    },
    {
        seedKey: "bio-wbi11-proteins-enzymes-002",
        unitCode: "WBI11",
        topicSlug: "proteins-enzymes",
        type: "SHORT",
        difficulty: "MEDIUM",
        marks: 4,
        status: "DRAFT",
        stem: r`Explain why the rate of an enzyme-catalysed reaction decreases when the temperature is raised above the optimum.`,
        markScheme: r`- Increased kinetic energy makes the enzyme molecule vibrate more (1)
- Hydrogen bonds / ionic bonds holding the tertiary structure break (1)
- The shape of the active site changes, so it is no longer complementary to the substrate (1)
- Fewer enzyme–substrate complexes form (1)`,
        explanation: r`Below the optimum, extra kinetic energy increases collisions. Above it, denaturation wins. Do not write that the enzyme is "killed": enzymes are proteins, not living things.`,
    },
    {
        seedKey: "bio-wbi11-proteins-enzymes-003",
        unitCode: "WBI11",
        topicSlug: "proteins-enzymes",
        type: "SHORT",
        difficulty: "HARD",
        marks: 4,
        status: "DRAFT",
        stem: r`Compare the structure of collagen with the structure of haemoglobin.`,
        markScheme: r`- Both are proteins made of polypeptide chains joined by peptide bonds / both have quaternary structure (1)
- Collagen is fibrous, whereas haemoglobin is globular (1)
- Collagen has a repetitive amino acid sequence (every third amino acid is glycine), whereas haemoglobin does not (1)
- Haemoglobin has a prosthetic (haem) group containing iron, whereas collagen has none (1)`,
        explanation: r`"Compare" needs both similarities and differences, each stated for **both** molecules. Collagen is three chains wound into a triple helix and is insoluble; haemoglobin is four chains folded into a soluble, roughly spherical molecule.`,
    },

    // --- dna-protein-synthesis ---
    {
        seedKey: "bio-wbi11-dna-protein-synthesis-001",
        unitCode: "WBI11",
        topicSlug: "dna-protein-synthesis",
        type: "MCQ",
        difficulty: "EASY",
        marks: 1,
        status: "DRAFT",
        stem: r`In a sample of double-stranded DNA, 30% of the bases are adenine. What percentage of the bases are cytosine?`,
        options: opts("20%", "30%", "40%", "70%", "A"),
        markScheme: r`- **A** (1) — A = T = 30%, so C + G = 40% and C = 20%.`,
        explanation: r`Complementary base pairing means A = T and C = G. Option C (40%) forgets to halve the C + G total.`,
    },
    {
        seedKey: "bio-wbi11-dna-protein-synthesis-002",
        unitCode: "WBI11",
        topicSlug: "dna-protein-synthesis",
        type: "SHORT",
        difficulty: "MEDIUM",
        marks: 5,
        status: "DRAFT",
        stem: r`Describe the process of transcription.`,
        markScheme: r`- Hydrogen bonds between bases break and the DNA unwinds / separates at the gene (1)
- One strand is used as the template (antisense strand) (1)
- Free RNA nucleotides pair with complementary bases on the template, with uracil pairing with adenine (1)
- RNA polymerase joins the nucleotides with phosphodiester bonds (1)
- The mRNA leaves the nucleus through a nuclear pore (1)`,
        explanation: r`Transcription makes mRNA in the nucleus; translation happens at ribosomes. Do not mention DNA polymerase or tRNA here, and remember RNA has uracil instead of thymine.`,
    },
    {
        seedKey: "bio-wbi11-dna-protein-synthesis-003",
        unitCode: "WBI11",
        topicSlug: "dna-protein-synthesis",
        type: "SHORT",
        difficulty: "HARD",
        marks: 3,
        status: "DRAFT",
        stem: r`Bacteria were grown for many generations in a medium containing only heavy nitrogen ($^{15}\text{N}$). They were then transferred to a medium containing only light nitrogen ($^{14}\text{N}$) and allowed to divide once. Their DNA was extracted and centrifuged.

Explain how the result after one division supports semi-conservative replication and not conservative replication.`,
        markScheme: r`- All the DNA formed a single band at an intermediate density (1)
- Because each molecule contains one original ($^{15}\text{N}$) strand and one new ($^{14}\text{N}$) strand (1)
- Conservative replication would give two bands, one heavy and one light (1)`,
        explanation: r`After one generation, the intermediate band alone rules out conservative replication. A second generation (half intermediate, half light) is needed to rule out dispersive replication too.`,
    },

    // --- inheritance-genetic-disorders ---
    {
        seedKey: "bio-wbi11-inheritance-genetic-disorders-001",
        unitCode: "WBI11",
        topicSlug: "inheritance-genetic-disorders",
        type: "MCQ",
        difficulty: "EASY",
        marks: 1,
        status: "DRAFT",
        stem: r`Two parents are both carriers of cystic fibrosis. What is the probability that their next child will have cystic fibrosis?`,
        options: opts("0.25", "0", "0.5", "0.75", "A"),
        markScheme: r`- **A** (1) — $Ff \times Ff$ gives $FF : Ff : ff$ in the ratio $1 : 2 : 1$, so P(ff) = 0.25.`,
        explanation: r`0.75 is the probability of **not** having CF, and 0.5 is the probability of being a carrier. Each pregnancy is independent, so previous children do not change the probability.`,
    },
    {
        seedKey: "bio-wbi11-inheritance-genetic-disorders-002",
        unitCode: "WBI11",
        topicSlug: "inheritance-genetic-disorders",
        type: "SHORT",
        difficulty: "MEDIUM",
        marks: 4,
        status: "DRAFT",
        stem: r`Explain how a mutation in the CFTR gene can lead to frequent lung infections in a person with cystic fibrosis.`,
        markScheme: r`- The CFTR protein (chloride ion channel) is faulty / absent, so chloride ions are not secreted out of the epithelial cells (1)
- Less water leaves the cells by osmosis (and more sodium ions are absorbed into the cells) (1)
- So the mucus is thick / sticky and cilia cannot move it out of the airways (1)
- Bacteria trapped in the mucus are not removed, so they multiply and cause infection (1)`,
        explanation: r`The chain is: faulty channel → fewer Cl⁻ out → less water out by osmosis → dehydrated, sticky mucus → mucus not cleared → infection. Missing the osmosis step is the most common way to lose a mark.`,
    },
    {
        seedKey: "bio-wbi11-inheritance-genetic-disorders-003",
        unitCode: "WBI11",
        topicSlug: "inheritance-genetic-disorders",
        type: "SHORT",
        difficulty: "HARD",
        marks: 3,
        status: "DRAFT",
        stem: r`A couple who are both carriers of a recessive genetic disorder are offered either chorionic villus sampling (CVS) or amniocentesis during a pregnancy.

Compare these two methods of prenatal testing.`,
        markScheme: r`- CVS can be carried out earlier in pregnancy (about 10–13 weeks) than amniocentesis (about 15–20 weeks) (1)
- CVS samples cells from the placenta, whereas amniocentesis samples fetal cells from the amniotic fluid (1)
- Both carry a small risk of miscarriage, which is slightly higher for CVS (1)`,
        explanation: r`Earlier results from CVS give the parents more time to decide, but the procedure carries a slightly higher miscarriage risk. Ethical points (e.g. termination, false results) are relevant when asked to discuss screening.`,
    },
];

// ---------------------------------------------------------------------------------------------------------------
// WBI12 — Cells, Development, Biodiversity and Conservation
// ---------------------------------------------------------------------------------------------------------------
const wbi12: SeedQuestion[] = [
    // --- cell-structure ---
    {
        seedKey: "bio-wbi12-cell-structure-001",
        unitCode: "WBI12",
        topicSlug: "cell-structure",
        type: "MCQ",
        difficulty: "EASY",
        marks: 1,
        status: "DRAFT",
        stem: r`Which structure is found in **both** prokaryotic and eukaryotic cells?`,
        options: opts("Nucleus", "Mitochondrion", "Rough endoplasmic reticulum", "Ribosome", "D"),
        markScheme: r`- **D** (1) — all cells make proteins on ribosomes (70S in prokaryotes, 80S in the eukaryotic cytoplasm).`,
        explanation: r`Prokaryotes have no membrane-bound organelles, so they lack a nucleus, mitochondria and endoplasmic reticulum. Their DNA lies free in the cytoplasm.`,
    },
    {
        seedKey: "bio-wbi12-cell-structure-002",
        unitCode: "WBI12",
        topicSlug: "cell-structure",
        type: "CALCULATION",
        difficulty: "EASY",
        marks: 3,
        status: "DRAFT",
        stem: r`On an electron micrograph with a magnification of $\times 15\,000$, a mitochondrion measures $36\,\text{mm}$ long.

Calculate the actual length of the mitochondrion. Give your answer in nanometres (nm).`,
        markScheme: r`- Converts the image length to consistent units, e.g. $36\,\text{mm} = 36\,000\,\mu\text{m}$ (1)
- Actual length $= 36\,000 \div 15\,000 = 2.4\,\mu\text{m}$ (1)
- $= 2400\,\text{nm}$ (1)`,
        explanation: r`Actual size = image size ÷ magnification. Remember $1\,\text{mm} = 1000\,\mu\text{m}$ and $1\,\mu\text{m} = 1000\,\text{nm}$.`,
    },
    {
        seedKey: "bio-wbi12-cell-structure-003",
        unitCode: "WBI12",
        topicSlug: "cell-structure",
        type: "SHORT",
        difficulty: "MEDIUM",
        marks: 4,
        status: "DRAFT",
        stem: r`Cells in the pancreas make and secrete digestive enzymes.

Describe the roles of organelles in the production and secretion of an extracellular enzyme.`,
        markScheme: r`- The enzyme (polypeptide) is synthesised on ribosomes on the rough endoplasmic reticulum (1)
- It is transported through the RER and moves to the Golgi apparatus in vesicles (1)
- The Golgi apparatus modifies the protein (e.g. adds carbohydrate) and packages it into secretory vesicles (1)
- Vesicles move to and fuse with the cell surface membrane, releasing the enzyme by exocytosis (1)`,
        explanation: r`Follow the protein from start to finish: ribosome → RER → vesicle → Golgi → vesicle → membrane. Mitochondria supplying ATP for vesicle movement is a valid extra point but not the core sequence.`,
    },

    // --- cell-cycle-reproduction ---
    {
        seedKey: "bio-wbi12-cell-cycle-reproduction-001",
        unitCode: "WBI12",
        topicSlug: "cell-cycle-reproduction",
        type: "MCQ",
        difficulty: "EASY",
        marks: 1,
        status: "DRAFT",
        stem: r`During which stage of mitosis are sister chromatids pulled to opposite poles of the cell?`,
        options: opts("Prophase", "Metaphase", "Anaphase", "Telophase", "C"),
        markScheme: r`- **C** (1) — the centromeres divide and spindle fibres shorten, pulling chromatids apart.`,
        explanation: r`In metaphase the chromosomes line up at the equator; in telophase nuclear envelopes re-form around the separated chromatids (now chromosomes).`,
    },
    {
        seedKey: "bio-wbi12-cell-cycle-reproduction-002",
        unitCode: "WBI12",
        topicSlug: "cell-cycle-reproduction",
        type: "SHORT",
        difficulty: "MEDIUM",
        marks: 4,
        status: "DRAFT",
        stem: r`Explain how meiosis produces genetically different gametes.`,
        markScheme: r`- Homologous chromosomes pair up in meiosis I (1)
- Crossing over: non-sister chromatids exchange sections at chiasmata, producing new combinations of alleles (1)
- Independent assortment: homologous pairs line up randomly at the equator, so maternal and paternal chromosomes are distributed in different combinations (1)
- Chromosome number is halved, so each gamete has a different combination of one chromosome from each pair (1)`,
        explanation: r`Random fertilisation adds further variation but happens **after** meiosis, so it does not answer "how meiosis produces" variation. Crossing over is between **non-sister** chromatids.`,
    },
    {
        seedKey: "bio-wbi12-cell-cycle-reproduction-003",
        unitCode: "WBI12",
        topicSlug: "cell-cycle-reproduction",
        type: "SHORT",
        difficulty: "HARD",
        marks: 4,
        status: "DRAFT",
        stem: r`Describe the events of double fertilisation in a flowering plant, from the time a pollen grain lands on the stigma.`,
        markScheme: r`- A pollen tube grows down the style, secreting digestive enzymes (1)
- The tube nucleus leads, and the generative nucleus divides by mitosis to form two male nuclei (1)
- One male nucleus fuses with the egg cell nucleus to form a diploid zygote (1)
- The other male nucleus fuses with the two polar nuclei to form a triploid endosperm nucleus (1)`,
        explanation: r`"Double" fertilisation means **two** fusions. The pollen tube enters the ovule through the micropyle. Students often forget that the endosperm nucleus is triploid (3n).`,
    },

    // --- development-gene-expression ---
    {
        seedKey: "bio-wbi12-development-gene-expression-001",
        unitCode: "WBI12",
        topicSlug: "development-gene-expression",
        type: "MCQ",
        difficulty: "EASY",
        marks: 1,
        status: "DRAFT",
        stem: r`Which type of stem cell can differentiate into **any** cell type, including the cells of the placenta?`,
        options: opts("Multipotent", "Pluripotent", "Unipotent", "Totipotent", "D"),
        markScheme: r`- **D** (1) — totipotent cells (e.g. the zygote and early embryo cells) can form every cell type, including extra-embryonic tissue.`,
        explanation: r`Pluripotent cells (e.g. from the blastocyst inner cell mass) can form any body cell but **not** placental cells. Multipotent cells, such as those in bone marrow, form a limited range.`,
    },
    {
        seedKey: "bio-wbi12-development-gene-expression-002",
        unitCode: "WBI12",
        topicSlug: "development-gene-expression",
        type: "SHORT",
        difficulty: "MEDIUM",
        marks: 4,
        status: "DRAFT",
        stem: r`All the cells in an organism contain the same genes, yet a red blood cell precursor and a muscle cell have very different structures.

Explain how differential gene expression leads to cell specialisation.`,
        markScheme: r`- Some genes are switched on (activated) and others switched off in each cell type (1)
- Transcription factors bind to DNA and control which genes are transcribed (1)
- Only the active genes are transcribed into mRNA and translated (1)
- So only certain proteins are made, and these determine the structure and function of the cell (1)`,
        explanation: r`The key idea is that cells **keep** all their genes but **use** only some of them. Signals (e.g. chemicals) trigger changes in which genes are expressed.`,
    },
    {
        seedKey: "bio-wbi12-development-gene-expression-003",
        unitCode: "WBI12",
        topicSlug: "development-gene-expression",
        type: "SHORT",
        difficulty: "HARD",
        marks: 3,
        status: "DRAFT",
        stem: r`Explain how DNA methylation can prevent a gene from being expressed.`,
        markScheme: r`- Methyl groups are added to cytosine bases in the DNA (often in the promoter region) (1)
- This prevents transcription factors / RNA polymerase from binding (1)
- So the gene is not transcribed and no mRNA (or protein) is produced (1)`,
        explanation: r`Methylation is an **epigenetic** change: it alters gene expression without changing the base sequence. Methylated DNA also tends to be wound more tightly around histones, which further reduces transcription.`,
    },

    // --- plant-structure-function ---
    {
        seedKey: "bio-wbi12-plant-structure-function-001",
        unitCode: "WBI12",
        topicSlug: "plant-structure-function",
        type: "MCQ",
        difficulty: "MEDIUM",
        marks: 1,
        status: "DRAFT",
        stem: r`Which statement correctly describes cellulose?`,
        options: opts(
            r`Branched chains of $\alpha$-glucose joined by 1,4 and 1,6 glycosidic bonds`,
            r`Straight chains of $\beta$-glucose, with hydrogen bonds between neighbouring chains`,
            r`Coiled chains of $\alpha$-glucose held in a helix by hydrogen bonds`,
            r`Straight chains of $\beta$-glucose joined by 1,6 glycosidic bonds`,
            "B",
        ),
        markScheme: r`- **B** (1) — $\beta$-1,4 links make straight chains; hydrogen bonds between parallel chains form microfibrils.`,
        explanation: r`A describes amylopectin/glycogen and C describes amylose. Alternate $\beta$-glucose units are inverted, which keeps the chain straight so many hydrogen bonds can form between chains.`,
    },
    {
        seedKey: "bio-wbi12-plant-structure-function-002",
        unitCode: "WBI12",
        topicSlug: "plant-structure-function",
        type: "SHORT",
        difficulty: "MEDIUM",
        marks: 4,
        status: "DRAFT",
        stem: r`Explain how the structure of xylem vessels is related to their function.`,
        markScheme: r`- Cells are dead with no cytoplasm and no end walls, forming a continuous hollow tube for water to flow through (1)
- Walls are thickened with lignin, which strengthens them so they do not collapse under tension (1)
- Lignin also makes the walls waterproof (1)
- Pits in the walls allow water and mineral ions to move sideways between vessels (1)`,
        explanation: r`Xylem also provides mechanical support. Do not confuse xylem with phloem sieve tubes, which are living and have sieve plates.`,
    },
    {
        seedKey: "bio-wbi12-plant-structure-function-003",
        unitCode: "WBI12",
        topicSlug: "plant-structure-function",
        type: "SHORT",
        difficulty: "EASY",
        marks: 3,
        status: "DRAFT",
        stem: r`Seedlings were grown in culture solutions each lacking one mineral ion.

Explain why seedlings lacking magnesium ions had yellow leaves, and state why plants need nitrate ions.`,
        markScheme: r`- Magnesium ions are needed to make chlorophyll (1)
- Without chlorophyll the leaves are yellow (chlorosis) (1)
- Nitrate ions are needed to make amino acids / proteins / nucleic acids (1)`,
        explanation: r`Calcium ions are needed for calcium pectate in the middle lamella. In the deficiency practical, all other ions must be supplied so that only the missing ion varies.`,
    },

    // --- plants-drugs ---
    {
        seedKey: "bio-wbi12-plants-drugs-001",
        unitCode: "WBI12",
        topicSlug: "plants-drugs",
        type: "MCQ",
        difficulty: "EASY",
        marks: 1,
        status: "DRAFT",
        stem: r`What is meant by a **double-blind** drug trial?`,
        options: opts(
            "Two groups of patients receive the drug",
            "Neither the patients nor the doctors know who receives the drug and who receives the placebo",
            "The patients do not know whether they receive the drug, but the doctors do",
            "The trial is repeated twice with different patients",
            "B",
        ),
        markScheme: r`- **B** (1) — this removes bias from both patients' and doctors' expectations.`,
        explanation: r`Option C describes a single-blind trial. Double-blinding stops doctors from unconsciously influencing patients or interpreting results with bias.`,
    },
    {
        seedKey: "bio-wbi12-plants-drugs-002",
        unitCode: "WBI12",
        topicSlug: "plants-drugs",
        type: "SHORT",
        difficulty: "MEDIUM",
        marks: 4,
        status: "DRAFT",
        stem: r`A new drug has passed pre-clinical testing. Describe the three phases of clinical trials it must go through before it can be approved.`,
        markScheme: r`- Phase 1: a small number of healthy volunteers, to test safety / side effects and dosage (1)
- Phase 2: a small number of patients with the disease, to test whether the drug works and find the best dose (1)
- Phase 3: a large number of patients (1)
- Phase 3 compares the drug with a placebo or the existing treatment in a randomised, double-blind trial (1)`,
        explanation: r`Each phase is larger than the one before. The aim moves from safety (phase 1) to effectiveness (phases 2 and 3).`,
    },
    {
        seedKey: "bio-wbi12-plants-drugs-003",
        unitCode: "WBI12",
        topicSlug: "plants-drugs",
        type: "CALCULATION",
        difficulty: "MEDIUM",
        marks: 3,
        status: "DRAFT",
        stem: r`Paper discs soaked in two plant extracts were placed on an agar plate spread with bacteria. After incubation, the clear zones around the discs had these diameters:

| Extract | Diameter of clear zone / mm |
| --- | --- |
| garlic | 18 |
| mint | 12 |

Calculate how much larger, as a percentage, the area of the clear zone for garlic is than for mint.`,
        markScheme: r`- Area for garlic $= \pi \times 9^2 = 254\,\text{mm}^2$ (1)
- Area for mint $= \pi \times 6^2 = 113\,\text{mm}^2$ (1)
- Percentage difference $= \dfrac{254 - 113}{113} \times 100 = 125\%$ (1)`,
        explanation: r`Use the **radius** (half the diameter) in $\pi r^2$. Because area depends on the square of the diameter, a 50% larger diameter gives a 125% larger area ($1.5^2 = 2.25$).`,
    },

    // --- biodiversity-classification ---
    {
        seedKey: "bio-wbi12-biodiversity-classification-001",
        unitCode: "WBI12",
        topicSlug: "biodiversity-classification",
        type: "MCQ",
        difficulty: "EASY",
        marks: 1,
        status: "DRAFT",
        stem: r`Which are the three domains in the three-domain system of classification?`,
        options: opts(
            "Prokaryotae, Protoctista, Eukarya",
            "Bacteria, Fungi, Eukarya",
            "Animals, Plants, Bacteria",
            "Bacteria, Archaea, Eukarya",
            "D",
        ),
        markScheme: r`- **D** (1) — molecular evidence (e.g. rRNA sequences) showed archaea differ from bacteria as much as from eukaryotes.`,
        explanation: r`Fungi, plants, animals and protoctists are kingdoms within the Eukarya. The three-domain system splits the old prokaryote kingdom into Bacteria and Archaea.`,
    },
    {
        seedKey: "bio-wbi12-biodiversity-classification-002",
        unitCode: "WBI12",
        topicSlug: "biodiversity-classification",
        type: "CALCULATION",
        difficulty: "MEDIUM",
        marks: 3,
        status: "DRAFT",
        stem: r`Students surveyed fish in a lagoon in the Maldives and recorded the number of individuals of each species.

| Species | Number of individuals, $n$ |
| --- | --- |
| A | 10 |
| B | 6 |
| C | 3 |
| D | 1 |

Calculate the index of diversity, $D$, using
$$D = \frac{N(N-1)}{\sum n(n-1)}$$
where $N$ is the total number of individuals.`,
        markScheme: r`- $N = 20$, so $N(N-1) = 380$ (1)
- $\sum n(n-1) = 90 + 30 + 6 + 0 = 126$ (1)
- $D = 380 \div 126 = 3.02$ (1)`,
        explanation: r`A species with one individual contributes $1 \times 0 = 0$ to the sum. A higher index means greater diversity; it takes account of both species richness and evenness.`,
    },
    {
        seedKey: "bio-wbi12-biodiversity-classification-003",
        unitCode: "WBI12",
        topicSlug: "biodiversity-classification",
        type: "SHORT",
        difficulty: "HARD",
        marks: 5,
        status: "DRAFT",
        stem: r`A population of crabs living on pale coral sand includes individuals with pale shells and individuals with dark shells. Shell colour is genetically determined. Birds feed on the crabs.

Explain how natural selection could lead to an increase in the proportion of pale-shelled crabs over many generations.`,
        markScheme: r`- Variation in shell colour exists in the population, caused by different alleles (originally from mutation) (1)
- Pale crabs are camouflaged against the sand, so they are less likely to be eaten by birds (selection pressure) (1)
- Pale crabs are more likely to survive and reproduce (1)
- They pass on the allele for pale shells to their offspring (1)
- So the frequency of the pale allele increases in the population over many generations (1)`,
        explanation: r`Individual crabs do not change colour to survive; the **allele frequency** of the population changes. Always name the selection pressure and finish with allele frequency.`,
    },

    // --- conservation ---
    {
        seedKey: "bio-wbi12-conservation-001",
        unitCode: "WBI12",
        topicSlug: "conservation",
        type: "MCQ",
        difficulty: "MEDIUM",
        marks: 1,
        status: "DRAFT",
        stem: r`Seeds are dried before being stored at about $-20\,^\circ\text{C}$ in a seed bank. What is the main reason for drying them?`,
        options: opts(
            "To stop ice crystals forming that would damage the cells",
            "To kill any fungi on the seed coat",
            "To make the seeds lighter for storage",
            "To break dormancy so the seeds germinate faster",
            "A",
        ),
        markScheme: r`- **A** (1) — ice crystals would rupture membranes; low water content also slows metabolism.`,
        explanation: r`Drying and freezing together keep seeds viable for decades. Seed banks still test samples by germinating some seeds periodically to check viability.`,
    },
    {
        seedKey: "bio-wbi12-conservation-002",
        unitCode: "WBI12",
        topicSlug: "conservation",
        type: "SHORT",
        difficulty: "MEDIUM",
        marks: 4,
        status: "DRAFT",
        stem: r`Explain how zoos can help to conserve an endangered animal species.`,
        markScheme: r`- Captive breeding programmes increase the number of individuals (1)
- Studbooks / exchange of animals between zoos avoid inbreeding and maintain genetic diversity (1)
- Animals can be reintroduced into their natural habitat (1)
- Zoos educate the public and carry out research on the species' biology and needs (1)`,
        explanation: r`Genetic diversity matters because a population with little variation is less able to adapt to change. Give each role a reason, not just a list.`,
    },
    {
        seedKey: "bio-wbi12-conservation-003",
        unitCode: "WBI12",
        topicSlug: "conservation",
        type: "SHORT",
        difficulty: "HARD",
        marks: 3,
        status: "DRAFT",
        stem: r`Suggest why animals bred in captivity may fail to survive when reintroduced into the wild.`,
        markScheme: r`- They may lack learned behaviours such as finding food or avoiding predators (1)
- They may have no immunity to diseases present in the wild (1)
- The original habitat may still be damaged or the original threat (e.g. hunting) may remain (1)`,
        explanation: r`Reintroduction programmes often include training, gradual release and habitat protection to address these problems.`,
    },
];

// ---------------------------------------------------------------------------------------------------------------
// WBI13 — Practical Skills in Biology I
// ---------------------------------------------------------------------------------------------------------------
const wbi13: SeedQuestion[] = [
    // --- practical-techniques ---
    {
        seedKey: "bio-wbi13-practical-techniques-001",
        unitCode: "WBI13",
        topicSlug: "practical-techniques",
        type: "MCQ",
        difficulty: "EASY",
        marks: 1,
        status: "DRAFT",
        stem: r`A student adds fruit juice drop by drop to $1.0\,\text{cm}^3$ of DCPIP solution to estimate its vitamin C content. What is the end point?`,
        options: opts(
            "The solution turns from colourless to blue",
            "The solution turns from blue to colourless",
            "A brick-red precipitate forms",
            "The solution turns from orange to blue-black",
            "B",
        ),
        markScheme: r`- **B** (1) — vitamin C reduces blue DCPIP to a colourless form.`,
        explanation: r`C is a positive Benedict's test and D is a positive iodine test for starch. With coloured juices the end point can be hard to see, so compare against a reference tube.`,
    },
    {
        seedKey: "bio-wbi13-practical-techniques-002",
        unitCode: "WBI13",
        topicSlug: "practical-techniques",
        type: "CALCULATION",
        difficulty: "MEDIUM",
        marks: 3,
        status: "DRAFT",
        stem: r`$1.0\,\text{cm}^3$ of DCPIP solution was decolourised by $0.50\,\text{cm}^3$ of a standard vitamin C solution with a concentration of $1.0\,\text{mg cm}^{-3}$.

$1.0\,\text{cm}^3$ of the same DCPIP solution was decolourised by $2.0\,\text{cm}^3$ of orange juice.

Calculate the concentration of vitamin C in the orange juice in $\text{mg cm}^{-3}$.`,
        markScheme: r`- Mass of vitamin C needed to decolourise $1.0\,\text{cm}^3$ DCPIP $= 0.50 \times 1.0 = 0.50\,\text{mg}$ (1)
- So $2.0\,\text{cm}^3$ of juice contains $0.50\,\text{mg}$ of vitamin C (1)
- Concentration $= 0.50 \div 2.0 = 0.25\,\text{mg cm}^{-3}$ (1)`,
        explanation: r`The **more** juice needed to decolourise the DCPIP, the **lower** its vitamin C concentration. Dividing the wrong way round gives $4.0\,\text{mg cm}^{-3}$, which is too high.`,
    },
    {
        seedKey: "bio-wbi13-practical-techniques-003",
        unitCode: "WBI13",
        topicSlug: "practical-techniques",
        type: "SHORT",
        difficulty: "MEDIUM",
        marks: 4,
        status: "DRAFT",
        stem: r`A student prepares a squash of a garlic root tip to observe mitosis. In one field of view she counts 250 cells, of which 40 are in a stage of mitosis.

(a) Explain why the root tip is placed in warm hydrochloric acid and then stained.

(b) Calculate the mitotic index.`,
        markScheme: r`- (a) Hydrochloric acid breaks down the middle lamella / bonds between cells, so the cells separate and can be squashed into a single layer (1)
- (a) Hydrochloric acid also stops mitosis / fixes the cells at their current stage (1)
- (a) The stain (e.g. toluidine blue or acetic orcein) binds to DNA so chromosomes become visible (1)
- (b) Mitotic index $= 40 \div 250 = 0.16$ (1)`,
        explanation: r`Mitotic index = cells in mitosis ÷ total cells counted. Only the root **tip** is used because that is where the meristem (dividing cells) is found.`,
    },

    // --- experimental-design ---
    {
        seedKey: "bio-wbi13-experimental-design-001",
        unitCode: "WBI13",
        topicSlug: "experimental-design",
        type: "MCQ",
        difficulty: "EASY",
        marks: 1,
        status: "DRAFT",
        stem: r`Beetroot discs were placed in water at different temperatures for 30 minutes. The absorbance of the surrounding water was then measured with a colorimeter. What is the **dependent** variable?`,
        options: opts(
            "Temperature of the water",
            "Size of the beetroot discs",
            "Time the discs were left in water",
            "Absorbance of the surrounding water",
            "D",
        ),
        markScheme: r`- **D** (1) — absorbance is measured, and depends on how much red pigment leaked from the cells.`,
        explanation: r`Temperature is the independent variable; disc size and time are control variables. Higher absorbance means more betalain pigment has leaked through damaged membranes.`,
    },
    {
        seedKey: "bio-wbi13-experimental-design-002",
        unitCode: "WBI13",
        topicSlug: "experimental-design",
        type: "SHORT",
        difficulty: "MEDIUM",
        marks: 4,
        status: "DRAFT",
        stem: r`A student investigates the effect of caffeine concentration on the heart rate of *Daphnia* (water fleas).

Describe **four** variables that should be controlled, and explain why one of them must be controlled.`,
        markScheme: r`- Temperature of the water (1)
- Size / age of the *Daphnia* (1)
- Time the *Daphnia* is left in the solution / acclimatisation time before counting (1)
- Temperature must be controlled because it affects the rate of metabolism / enzyme activity and so heart rate (1)`,
        explanation: r`Other acceptable control variables include the volume of solution and the light intensity (a lamp can heat the slide). The independent variable (caffeine concentration) is never a control variable.`,
    },
    {
        seedKey: "bio-wbi13-experimental-design-003",
        unitCode: "WBI13",
        topicSlug: "experimental-design",
        type: "SHORT",
        difficulty: "HARD",
        marks: 3,
        status: "DRAFT",
        stem: r`A student investigates how enzyme concentration affects the rate at which trypsin breaks down the protein in milk. She sets up an extra tube containing milk and boiled trypsin.

Explain the purpose of this tube and why she should carry out three repeats at each concentration.`,
        markScheme: r`- The boiled-enzyme tube is a control, showing that any change is caused by the active enzyme and not by another factor (1)
- Boiling denatures the trypsin, but keeps everything else the same as in the other tubes (1)
- Repeats allow anomalies to be identified and a mean calculated, making the results more reliable / precise (1)`,
        explanation: r`Repeating improves **reliability (repeatability)**, not accuracy. Accuracy is about how close a value is to the true value.`,
    },

    // --- data-analysis-evaluation ---
    {
        seedKey: "bio-wbi13-data-analysis-evaluation-001",
        unitCode: "WBI13",
        topicSlug: "data-analysis-evaluation",
        type: "MCQ",
        difficulty: "EASY",
        marks: 1,
        status: "DRAFT",
        stem: r`In an enzyme experiment, the time taken for a colour change was $25\,\text{s}$. The rate of reaction was calculated as $1/\text{time}$. What is the rate?`,
        options: opts(
            r`$0.04\,\text{s}^{-1}$`,
            r`$0.25\,\text{s}^{-1}$`,
            r`$25\,\text{s}^{-1}$`,
            r`$4.0\,\text{s}^{-1}$`,
            "A",
        ),
        markScheme: r`- **A** (1) — $1 \div 25 = 0.04\,\text{s}^{-1}$.`,
        explanation: r`Rate is inversely proportional to time: a shorter time means a faster rate. Remember the unit is $\text{s}^{-1}$.`,
    },
    {
        seedKey: "bio-wbi13-data-analysis-evaluation-002",
        unitCode: "WBI13",
        topicSlug: "data-analysis-evaluation",
        type: "CALCULATION",
        difficulty: "MEDIUM",
        marks: 3,
        status: "DRAFT",
        stem: r`Students measured the time for amylase to break down all the starch in a sample at pH 7.

| Repeat | 1 | 2 | 3 | 4 |
| --- | --- | --- | --- | --- |
| Time / s | 42 | 45 | 71 | 43 |

(a) Identify the anomalous result.

(b) Calculate the mean rate of reaction in $\text{s}^{-1}$, excluding the anomaly. Give your answer to 2 significant figures.`,
        markScheme: r`- (a) $71\,\text{s}$ (repeat 3) (1)
- (b) Mean time $= (42 + 45 + 43) \div 3 = 43.3\,\text{s}$ (1)
- (b) Rate $= 1 \div 43.3 = 0.023\,\text{s}^{-1}$ (1)`,
        explanation: r`An anomaly is a value that does not fit the pattern of the other repeats. Exclude it before calculating the mean, and say that you have done so.`,
    },
    {
        seedKey: "bio-wbi13-data-analysis-evaluation-003",
        unitCode: "WBI13",
        topicSlug: "data-analysis-evaluation",
        type: "SHORT",
        difficulty: "HARD",
        marks: 4,
        status: "DRAFT",
        stem: r`A student tested the tensile strength of fibres from two plants. She recorded the mass needed to break each fibre.

| Plant | Mean mass to break fibre / g | Standard deviation / g | Number of fibres |
| --- | --- | --- | --- |
| P | 312 | 85 | 5 |
| Q | 286 | 79 | 5 |

She concluded that fibres from plant P are stronger than fibres from plant Q. Evaluate her conclusion.`,
        markScheme: r`- The mean for P is higher than for Q, which supports the conclusion (1)
- But the standard deviations are large and the ranges of mean ± SD overlap a lot (1)
- So the difference may be due to chance / may not be significant (1)
- Only five fibres were tested, and fibre length or diameter may not have been controlled (1)`,
        explanation: r`"Evaluate" means weigh up evidence for and against. Large, overlapping standard deviations suggest the difference is not significant; a statistical test (e.g. a $t$-test) would be needed to be sure.`,
    },
];

// ---------------------------------------------------------------------------------------------------------------
// WBI14 — Energy, Environment, Microbiology and Immunity
// ---------------------------------------------------------------------------------------------------------------
const wbi14: SeedQuestion[] = [
    // --- photosynthesis ---
    {
        seedKey: "bio-wbi14-photosynthesis-001",
        unitCode: "WBI14",
        topicSlug: "photosynthesis",
        type: "MCQ",
        difficulty: "EASY",
        marks: 1,
        status: "DRAFT",
        stem: r`Which products of the light-dependent reactions are used in the light-independent reactions (Calvin cycle)?`,
        options: opts(
            "ATP and reduced NADP",
            "Oxygen and ATP",
            "Reduced NADP and oxygen",
            "Glucose and ATP",
            "A",
        ),
        markScheme: r`- **A** (1) — ATP provides energy and reduced NADP provides hydrogen to reduce GP to GALP.`,
        explanation: r`Oxygen is a by-product of photolysis and diffuses out of the leaf; it is not used in the Calvin cycle. Glucose is made **from** the Calvin cycle, not supplied to it.`,
    },
    {
        seedKey: "bio-wbi14-photosynthesis-002",
        unitCode: "WBI14",
        topicSlug: "photosynthesis",
        type: "SHORT",
        difficulty: "MEDIUM",
        marks: 5,
        status: "DRAFT",
        stem: r`Describe the light-independent reactions of photosynthesis.`,
        markScheme: r`- Carbon dioxide combines with ribulose bisphosphate (RuBP), catalysed by RUBISCO (1)
- Forming two molecules of glycerate 3-phosphate (GP) (1)
- GP is reduced to glyceraldehyde 3-phosphate (GALP) using reduced NADP (1)
- ATP from the light-dependent reactions provides the energy for this reduction (1)
- Most GALP is used to regenerate RuBP (using ATP), and some is used to make glucose / other organic molecules (1)`,
        explanation: r`The cycle takes place in the **stroma**. Five out of every six GALP molecules are recycled to regenerate RuBP, which is why the cycle can keep fixing carbon dioxide.`,
    },
    {
        seedKey: "bio-wbi14-photosynthesis-003",
        unitCode: "WBI14",
        topicSlug: "photosynthesis",
        type: "CALCULATION",
        difficulty: "EASY",
        marks: 2,
        status: "DRAFT",
        stem: r`Pigments from a leaf were separated by thin-layer chromatography. One pigment spot moved $4.2\,\text{cm}$ from the origin while the solvent front moved $9.6\,\text{cm}$.

| Pigment | $R_f$ in this solvent |
| --- | --- |
| carotene | 0.95 |
| xanthophyll | 0.71 |
| chlorophyll a | 0.44 |
| chlorophyll b | 0.32 |

Calculate the $R_f$ value of the spot and identify the pigment.`,
        markScheme: r`- $R_f = 4.2 \div 9.6 = 0.44$ (1)
- Chlorophyll a (1)`,
        explanation: r`$R_f$ = distance moved by the spot ÷ distance moved by the solvent front, both measured from the origin. It is always less than 1 and has no units.`,
    },

    // --- ecosystems-energy-transfer ---
    {
        seedKey: "bio-wbi14-ecosystems-energy-transfer-001",
        unitCode: "WBI14",
        topicSlug: "ecosystems-energy-transfer",
        type: "MCQ",
        difficulty: "EASY",
        marks: 1,
        status: "DRAFT",
        stem: r`Which equation correctly links gross primary productivity (GPP), net primary productivity (NPP) and respiratory losses (R) of plants?`,
        options: opts(r`NPP = GPP + R`, r`GPP = NPP − R`, r`NPP = GPP − R`, r`R = NPP + GPP`, "C"),
        markScheme: r`- **C** (1) — NPP is the energy left in plant biomass after respiration.`,
        explanation: r`GPP is the total rate at which energy is fixed by photosynthesis. Plants use part of it in respiration; what remains (NPP) is available to primary consumers.`,
    },
    {
        seedKey: "bio-wbi14-ecosystems-energy-transfer-002",
        unitCode: "WBI14",
        topicSlug: "ecosystems-energy-transfer",
        type: "CALCULATION",
        difficulty: "MEDIUM",
        marks: 2,
        status: "DRAFT",
        stem: r`In a seagrass ecosystem, the energy in primary consumers is $12\,000\,\text{kJ m}^{-2}\,\text{yr}^{-1}$ and the energy in secondary consumers is $1\,080\,\text{kJ m}^{-2}\,\text{yr}^{-1}$.

Calculate the percentage efficiency of energy transfer from primary to secondary consumers.`,
        markScheme: r`- Efficiency $= \dfrac{1\,080}{12\,000} \times 100$ (1)
- $= 9\%$ (1)`,
        explanation: r`Efficiency = energy at the higher trophic level ÷ energy at the lower level × 100. Values of about 10% are typical, which limits the length of food chains.`,
    },
    {
        seedKey: "bio-wbi14-ecosystems-energy-transfer-003",
        unitCode: "WBI14",
        topicSlug: "ecosystems-energy-transfer",
        type: "SHORT",
        difficulty: "MEDIUM",
        marks: 4,
        status: "DRAFT",
        stem: r`Explain why only a small proportion of the energy in plants is transferred to the primary consumers that feed on them.`,
        markScheme: r`- Not all parts of the plant are eaten (e.g. roots, woody tissue) (1)
- Some parts are indigestible (e.g. cellulose, lignin) and are lost in faeces (1)
- Energy is lost as heat in respiration / used for movement and other life processes (1)
- Energy is lost in excretory products such as urine (1)`,
        explanation: r`Energy is never "used up" or destroyed; it is transferred to the surroundings, mostly as heat, and so is not available to the next trophic level.`,
    },

    // --- climate-change-evolution ---
    {
        seedKey: "bio-wbi14-climate-change-evolution-001",
        unitCode: "WBI14",
        topicSlug: "climate-change-evolution",
        type: "MCQ",
        difficulty: "MEDIUM",
        marks: 1,
        status: "DRAFT",
        stem: r`Which of these is a **prezygotic** reproductive isolating mechanism?`,
        options: opts(
            "Hybrid offspring are sterile",
            "Hybrid embryos fail to develop",
            "Second-generation hybrids are weak and do not survive",
            "The two populations breed at different times of year",
            "D",
        ),
        markScheme: r`- **D** (1) — seasonal isolation prevents mating, so no zygote forms.`,
        explanation: r`Prezygotic mechanisms act **before** fertilisation (seasonal, behavioural, mechanical, gametic). The other options are postzygotic: a zygote forms but the hybrid fails.`,
    },
    {
        seedKey: "bio-wbi14-climate-change-evolution-002",
        unitCode: "WBI14",
        topicSlug: "climate-change-evolution",
        type: "SHORT",
        difficulty: "HARD",
        marks: 5,
        status: "DRAFT",
        stem: r`A population of lizards is split into two when rising sea levels separate one island into two smaller islands. The conditions on the two islands are different.

Explain how this could lead to the formation of two new species.`,
        markScheme: r`- The populations are geographically isolated, so there is no gene flow between them (1)
- Different mutations arise in each population (1)
- Different selection pressures act on each island, so different alleles are selected (1)
- Allele frequencies in the two gene pools change over many generations (1)
- Eventually the two populations can no longer interbreed to produce fertile offspring (reproductive isolation), so they are separate species (1)`,
        explanation: r`This is **allopatric** speciation. The final marking point is the definition of a species: the populations must be unable to produce fertile offspring together, not just look different.`,
    },
    {
        seedKey: "bio-wbi14-climate-change-evolution-003",
        unitCode: "WBI14",
        topicSlug: "climate-change-evolution",
        type: "SHORT",
        difficulty: "MEDIUM",
        marks: 3,
        status: "DRAFT",
        stem: r`Describe how ice cores provide evidence about past concentrations of carbon dioxide and past temperatures.`,
        markScheme: r`- Bubbles of air trapped in the ice can be analysed to measure the carbon dioxide concentration when the ice formed (1)
- The ratio of oxygen isotopes in the ice indicates the temperature when the snow fell (1)
- Ice forms in annual layers, so deeper layers are older and can be dated (1)`,
        explanation: r`Other sources of evidence include peat bog pollen (vegetation reflects climate), dendrochronology (tree ring width) and direct temperature and CO₂ records.`,
    },

    // --- microbiology ---
    {
        seedKey: "bio-wbi14-microbiology-001",
        unitCode: "WBI14",
        topicSlug: "microbiology",
        type: "MCQ",
        difficulty: "EASY",
        marks: 1,
        status: "DRAFT",
        stem: r`During which phase of a bacterial growth curve is the rate of cell division greatest?`,
        options: opts("Lag phase", "Exponential (log) phase", "Stationary phase", "Death (decline) phase", "B"),
        markScheme: r`- **B** (1) — nutrients are plentiful and waste products have not yet built up, so cells divide at the maximum rate.`,
        explanation: r`In the lag phase, bacteria are adapting (e.g. making enzymes). In the stationary phase the population is largest, but the birth rate equals the death rate.`,
    },
    {
        seedKey: "bio-wbi14-microbiology-002",
        unitCode: "WBI14",
        topicSlug: "microbiology",
        type: "CALCULATION",
        difficulty: "MEDIUM",
        marks: 3,
        status: "DRAFT",
        stem: r`A bacterial culture was diluted by a factor of $10^{5}$. Then $0.1\,\text{cm}^3$ of the diluted culture was spread on an agar plate. After incubation, 48 colonies grew.

Calculate the number of bacteria per $\text{cm}^3$ in the original culture. Give your answer in standard form.`,
        markScheme: r`- Bacteria per $\text{cm}^3$ of diluted culture $= 48 \div 0.1 = 480$ (1)
- Multiplies by the dilution factor: $480 \times 10^5$ (1)
- $= 4.8 \times 10^{7}$ bacteria per $\text{cm}^3$ (1)`,
        explanation: r`This assumes each colony grew from one bacterium, so it counts **viable** cells only. Plates with about 30–300 colonies are chosen so that colonies are separate and countable.`,
    },
    {
        seedKey: "bio-wbi14-microbiology-003",
        unitCode: "WBI14",
        topicSlug: "microbiology",
        type: "SHORT",
        difficulty: "MEDIUM",
        marks: 4,
        status: "DRAFT",
        stem: r`Explain how infection with HIV can lead to the development of AIDS.`,
        markScheme: r`- HIV infects T helper cells (by binding to CD4 receptors) (1)
- The virus replicates inside T helper cells and destroys them, so their number falls (1)
- With few T helper cells, B cells and T killer cells are not activated, so the immune response is weak (1)
- The person develops opportunistic infections (e.g. TB) that a healthy immune system would control: this is AIDS (1)`,
        explanation: r`HIV is a retrovirus: reverse transcriptase makes DNA from its RNA, which is inserted into the host cell's DNA. AIDS is a syndrome defined by the opportunistic infections, not by the virus itself.`,
    },

    // --- immunity ---
    {
        seedKey: "bio-wbi14-immunity-001",
        unitCode: "WBI14",
        topicSlug: "immunity",
        type: "MCQ",
        difficulty: "MEDIUM",
        marks: 1,
        status: "DRAFT",
        stem: r`A baby receives antibodies from its mother across the placenta. Which type of immunity is this?`,
        options: opts("Natural active", "Artificial active", "Natural passive", "Artificial passive", "C"),
        markScheme: r`- **C** (1) — antibodies are received, not made by the baby (passive), and this happens without medical intervention (natural).`,
        explanation: r`Passive immunity is short-lived because no memory cells are made. Vaccination is artificial **active** immunity; an injection of antibodies is artificial passive.`,
    },
    {
        seedKey: "bio-wbi14-immunity-002",
        unitCode: "WBI14",
        topicSlug: "immunity",
        type: "SHORT",
        difficulty: "HARD",
        marks: 5,
        status: "DRAFT",
        stem: r`Describe how B cells are activated and produce antibodies during a primary immune response.`,
        markScheme: r`- A macrophage engulfs the pathogen and presents its antigens on its surface (antigen-presenting cell) (1)
- A T helper cell with a complementary receptor binds to the presented antigen and is activated (1)
- The T helper cell releases cytokines that activate a B cell with a complementary antibody receptor (that has bound the antigen) (1)
- The B cell divides by mitosis (clonal expansion) and differentiates into plasma cells (1)
- Plasma cells secrete antibodies specific to the antigen; some B cells become memory cells (1)`,
        explanation: r`The key word is **complementary**: only B and T cells whose receptors fit the antigen are selected (clonal selection). Memory cells explain why the secondary response is faster and larger.`,
    },
    {
        seedKey: "bio-wbi14-immunity-003",
        unitCode: "WBI14",
        topicSlug: "immunity",
        type: "SHORT",
        difficulty: "MEDIUM",
        marks: 4,
        status: "DRAFT",
        stem: r`Explain how a population of bacteria can become resistant to an antibiotic.`,
        markScheme: r`- A random mutation gives some bacteria an allele for resistance (1)
- When the antibiotic is used, susceptible bacteria are killed but resistant bacteria survive (1)
- Resistant bacteria reproduce and pass on the resistance allele (including by horizontal transfer on plasmids) (1)
- So the frequency of the resistance allele increases in the population (1)`,
        explanation: r`The antibiotic does **not** cause the mutation; it acts as the selection pressure. Completing courses and avoiding unnecessary prescriptions reduce the spread of resistance.`,
    },

    // --- forensics ---
    {
        seedKey: "bio-wbi14-forensics-001",
        unitCode: "WBI14",
        topicSlug: "forensics",
        type: "MCQ",
        difficulty: "EASY",
        marks: 1,
        status: "DRAFT",
        stem: r`During gel electrophoresis, why do DNA fragments move towards the positive electrode?`,
        options: opts(
            "The phosphate groups are negatively charged",
            "The bases are positively charged",
            "The deoxyribose sugars are negatively charged",
            "The hydrogen bonds between bases are charged",
            "A",
        ),
        markScheme: r`- **A** (1) — the phosphate groups in the sugar–phosphate backbone carry a negative charge.`,
        explanation: r`Smaller fragments move further through the gel in a given time because they pass through the pores of the gel more easily.`,
    },
    {
        seedKey: "bio-wbi14-forensics-002",
        unitCode: "WBI14",
        topicSlug: "forensics",
        type: "SHORT",
        difficulty: "MEDIUM",
        marks: 4,
        status: "DRAFT",
        stem: r`Describe how the polymerase chain reaction (PCR) is used to produce many copies of a DNA sample.`,
        markScheme: r`- The DNA is heated to about $95\,^\circ\text{C}$ to break the hydrogen bonds and separate the strands (1)
- The mixture is cooled to about $55\,^\circ\text{C}$ so primers bind (anneal) to complementary sequences at the ends of the target DNA (1)
- At about $72\,^\circ\text{C}$, Taq polymerase adds free nucleotides to build new complementary strands (1)
- The cycle is repeated many times, doubling the amount of DNA each cycle (1)`,
        explanation: r`Taq polymerase comes from a thermophilic bacterium, so it is not denatured at $95\,^\circ\text{C}$. After $n$ cycles one molecule gives up to $2^n$ copies.`,
    },
    {
        seedKey: "bio-wbi14-forensics-003",
        unitCode: "WBI14",
        topicSlug: "forensics",
        type: "SHORT",
        difficulty: "HARD",
        marks: 3,
        status: "DRAFT",
        stem: r`A body is found in a room. Its core temperature is $31\,^\circ\text{C}$ and rigor mortis is present in the face and jaw but not in the legs.

Explain how these observations can be used to estimate the time of death, and suggest **one** factor that would make the estimate less reliable.`,
        markScheme: r`- After death, the body cools towards the temperature of its surroundings at a roughly predictable rate, so the temperature drop from about $37\,^\circ\text{C}$ indicates time since death (1)
- Rigor mortis develops first in small muscles (e.g. face) and later in larger muscles, so its partial spread suggests death occurred only a few hours earlier (1)
- Factor: e.g. air temperature / clothing / body mass / humidity affect the rate of cooling (1)`,
        explanation: r`Rigor mortis happens because ATP runs out in muscle cells, so actin and myosin stay bound. It develops over several hours and then wears off as proteins break down.`,
    },
];

// ---------------------------------------------------------------------------------------------------------------
// WBI15 — Respiration, Internal Environment, Coordination and Gene Technology
// ---------------------------------------------------------------------------------------------------------------
const wbi15: SeedQuestion[] = [
    // --- respiration ---
    {
        seedKey: "bio-wbi15-respiration-001",
        unitCode: "WBI15",
        topicSlug: "respiration",
        type: "MCQ",
        difficulty: "EASY",
        marks: 1,
        status: "DRAFT",
        stem: r`Where in a eukaryotic cell does the Krebs cycle take place?`,
        options: opts(
            "Cytoplasm",
            "Inner mitochondrial membrane",
            "Intermembrane space",
            "Mitochondrial matrix",
            "D",
        ),
        markScheme: r`- **D** (1) — the link reaction and Krebs cycle enzymes are in the matrix.`,
        explanation: r`Glycolysis happens in the cytoplasm; the electron transport chain and ATP synthase are on the inner membrane (cristae).`,
    },
    {
        seedKey: "bio-wbi15-respiration-002",
        unitCode: "WBI15",
        topicSlug: "respiration",
        type: "CALCULATION",
        difficulty: "MEDIUM",
        marks: 2,
        status: "DRAFT",
        stem: r`The equation shows the complete aerobic respiration of a triglyceride, tripalmitin.

$$2\,\text{C}_{51}\text{H}_{98}\text{O}_{6} + 145\,\text{O}_2 \rightarrow 102\,\text{CO}_2 + 98\,\text{H}_2\text{O}$$

Calculate the respiratory quotient (RQ) for tripalmitin and explain what an RQ of this value suggests about the substrate an organism is respiring.`,
        markScheme: r`- RQ $= 102 \div 145 = 0.70$ (1)
- An RQ of about 0.7 suggests the organism is respiring lipids (rather than carbohydrate, RQ = 1.0) (1)`,
        explanation: r`RQ = CO₂ produced ÷ O₂ consumed. Lipids contain proportionally less oxygen than carbohydrates, so more O₂ is needed to oxidise them and the RQ is lower.`,
    },
    {
        seedKey: "bio-wbi15-respiration-003",
        unitCode: "WBI15",
        topicSlug: "respiration",
        type: "SHORT",
        difficulty: "HARD",
        marks: 5,
        status: "DRAFT",
        stem: r`Explain how ATP is produced during oxidative phosphorylation.`,
        markScheme: r`- Reduced NAD and reduced FAD deliver hydrogen atoms to the electron transport chain on the inner mitochondrial membrane, where they split into protons and electrons (1)
- Electrons pass along a series of carriers in redox reactions, releasing energy (1)
- This energy is used to pump protons (H⁺) from the matrix into the intermembrane space, creating a proton gradient (1)
- Protons diffuse back into the matrix through ATP synthase, which catalyses ADP + Pᵢ → ATP (chemiosmosis) (1)
- Oxygen is the final electron acceptor, combining with electrons and protons to form water (1)`,
        explanation: r`Without oxygen to accept electrons, the chain stops, reduced NAD cannot be reoxidised, and only glycolysis can continue (anaerobic respiration).`,
    },

    // --- muscles-exercise ---
    {
        seedKey: "bio-wbi15-muscles-exercise-001",
        unitCode: "WBI15",
        topicSlug: "muscles-exercise",
        type: "MCQ",
        difficulty: "MEDIUM",
        marks: 1,
        status: "DRAFT",
        stem: r`When a sarcomere contracts, which part stays the **same** length?`,
        options: opts("I band", "H zone", "A band", "Sarcomere (Z line to Z line)", "C"),
        markScheme: r`- **C** (1) — the A band is the length of the myosin filaments, which do not change length.`,
        explanation: r`In the sliding filament theory, actin slides over myosin. The I band and H zone shorten because the filaments overlap more; neither filament itself shortens.`,
    },
    {
        seedKey: "bio-wbi15-muscles-exercise-002",
        unitCode: "WBI15",
        topicSlug: "muscles-exercise",
        type: "SHORT",
        difficulty: "HARD",
        marks: 5,
        status: "DRAFT",
        stem: r`Describe the roles of calcium ions and ATP in the contraction of a skeletal muscle fibre.`,
        markScheme: r`- Calcium ions are released from the sarcoplasmic reticulum when an impulse arrives (1)
- Calcium ions bind to troponin, which moves tropomyosin away from the myosin-binding sites on actin (1)
- Myosin heads bind to actin, forming cross-bridges, and the power stroke pulls actin towards the centre of the sarcomere (1)
- ATP binds to the myosin head, causing it to detach from actin (1)
- Hydrolysis of ATP (by ATPase) re-cocks the myosin head so it can bind further along the actin (1)`,
        explanation: r`Students often forget that ATP is needed to **detach** the myosin head from actin; its hydrolysis then re-cocks the head ready for the next power stroke. Without ATP the cross-bridges stay locked, which is why rigor mortis occurs after death.`,
    },
    {
        seedKey: "bio-wbi15-muscles-exercise-003",
        unitCode: "WBI15",
        topicSlug: "muscles-exercise",
        type: "SHORT",
        difficulty: "MEDIUM",
        marks: 4,
        status: "DRAFT",
        stem: r`Explain how heart rate increases at the start of exercise.`,
        markScheme: r`- Increased respiration raises the carbon dioxide concentration / lowers the pH of the blood (1)
- This is detected by chemoreceptors (in the medulla, aortic and carotid bodies) (1)
- Impulses are sent to the cardiovascular control centre in the medulla oblongata (1)
- More impulses travel along sympathetic nerves to the SAN, increasing its rate of discharge (1)`,
        explanation: r`Adrenaline and signals from stretch receptors in muscles also increase heart rate. The parasympathetic (vagus) nerve slows the heart; the sympathetic nerve speeds it up.`,
    },
    {
        seedKey: "bio-wbi15-muscles-exercise-004",
        unitCode: "WBI15",
        topicSlug: "muscles-exercise",
        type: "CALCULATION",
        difficulty: "MEDIUM",
        marks: 3,
        status: "DRAFT",
        stem: r`At rest, an athlete has a cardiac output of $5.6\,\text{dm}^3\,\text{min}^{-1}$ and a heart rate of 64 beats per minute. During exercise her heart rate is 160 beats per minute and her stroke volume is $120\,\text{cm}^3$.

(a) Calculate her stroke volume at rest.

(b) Calculate the percentage increase in cardiac output during exercise.`,
        markScheme: r`- (a) Stroke volume $= 5600 \div 64 = 87.5\,\text{cm}^3$ (1)
- (b) Cardiac output during exercise $= 160 \times 120 = 19\,200\,\text{cm}^3\,\text{min}^{-1}$ (1)
- (b) Percentage increase $= \dfrac{19\,200 - 5\,600}{5\,600} \times 100 = 243\%$ (1)`,
        explanation: r`Cardiac output = stroke volume × heart rate. Convert $\text{dm}^3$ to $\text{cm}^3$ ($\times 1000$) before mixing units.`,
    },

    // --- homeostasis ---
    {
        seedKey: "bio-wbi15-homeostasis-001",
        unitCode: "WBI15",
        topicSlug: "homeostasis",
        type: "MCQ",
        difficulty: "EASY",
        marks: 1,
        status: "DRAFT",
        stem: r`What is the effect of antidiuretic hormone (ADH) on the kidney?`,
        options: opts(
            "It increases the permeability of the collecting duct to water",
            "It decreases the permeability of the collecting duct to water",
            "It increases the rate of ultrafiltration in the glomerulus",
            "It increases the reabsorption of glucose in the proximal tubule",
            "A",
        ),
        markScheme: r`- **A** (1) — ADH causes aquaporins to be inserted into the collecting duct membranes.`,
        explanation: r`More water is reabsorbed by osmosis, so a smaller volume of more concentrated urine is produced. Glucose is reabsorbed in the proximal convoluted tubule regardless of ADH.`,
    },
    {
        seedKey: "bio-wbi15-homeostasis-002",
        unitCode: "WBI15",
        topicSlug: "homeostasis",
        type: "SHORT",
        difficulty: "MEDIUM",
        marks: 5,
        status: "DRAFT",
        stem: r`After a long football match on a hot day, a player's blood water potential falls.

Explain how the body responds to return blood water potential to normal.`,
        markScheme: r`- Osmoreceptors in the hypothalamus detect the fall in water potential (1)
- The posterior pituitary releases more ADH into the blood (1)
- ADH binds to receptors on cells of the collecting duct (and distal convoluted tubule) (1)
- Vesicles containing aquaporins fuse with the cell membrane, so the walls become more permeable to water (1)
- More water is reabsorbed by osmosis into the blood, producing a small volume of concentrated urine (1)`,
        explanation: r`ADH is made in the hypothalamus but **released** from the posterior pituitary. This is negative feedback: as water potential returns to normal, ADH release falls.`,
    },
    {
        seedKey: "bio-wbi15-homeostasis-003",
        unitCode: "WBI15",
        topicSlug: "homeostasis",
        type: "SHORT",
        difficulty: "HARD",
        marks: 4,
        status: "DRAFT",
        stem: r`Explain how the loop of Henle produces a low water potential in the medulla of the kidney.`,
        markScheme: r`- Sodium and chloride ions are actively transported out of the ascending limb into the medulla (1)
- The ascending limb is impermeable to water, so water cannot follow the ions (1)
- This lowers the water potential of the medulla tissue fluid, so water leaves the descending limb by osmosis (1)
- The countercurrent multiplier makes the water potential lowest at the tip of the loop / deep in the medulla (1)`,
        explanation: r`The low water potential in the medulla lets water be reabsorbed by osmosis from the collecting duct as it passes through. Animals in dry habitats have longer loops of Henle.`,
    },

    // --- nervous-system ---
    {
        seedKey: "bio-wbi15-nervous-system-001",
        unitCode: "WBI15",
        topicSlug: "nervous-system",
        type: "MCQ",
        difficulty: "MEDIUM",
        marks: 1,
        status: "DRAFT",
        stem: r`What causes the **depolarisation** of an axon membrane during an action potential?`,
        options: opts(
            "Voltage-gated potassium ion channels open and potassium ions diffuse out",
            "The sodium–potassium pump moves sodium ions into the axon",
            "Voltage-gated sodium ion channels open and sodium ions diffuse in",
            "Chloride ions diffuse out of the axon",
            "C",
        ),
        markScheme: r`- **C** (1) — Na⁺ rushes in down its electrochemical gradient, making the inside positive (about +40 mV).`,
        explanation: r`Potassium channels opening causes **repolarisation**. The sodium–potassium pump moves Na⁺ **out** and K⁺ in; it maintains the resting potential rather than causing depolarisation.`,
    },
    {
        seedKey: "bio-wbi15-nervous-system-002",
        unitCode: "WBI15",
        topicSlug: "nervous-system",
        type: "SHORT",
        difficulty: "MEDIUM",
        marks: 5,
        status: "DRAFT",
        stem: r`Describe how an impulse is passed across a cholinergic synapse.`,
        markScheme: r`- An action potential arrives at the presynaptic membrane and voltage-gated calcium ion channels open, so Ca²⁺ diffuses in (1)
- Vesicles containing acetylcholine move to and fuse with the presynaptic membrane, releasing acetylcholine by exocytosis (1)
- Acetylcholine diffuses across the synaptic cleft and binds to receptors on the postsynaptic membrane (1)
- Sodium ion channels open, Na⁺ enters and the postsynaptic membrane depolarises; if threshold is reached an action potential is generated (1)
- Acetylcholinesterase breaks down acetylcholine, so the channels close and the signal stops (1)`,
        explanation: r`Synapses make transmission one-way because only the presynaptic side releases neurotransmitter and only the postsynaptic side has receptors.`,
    },
    {
        seedKey: "bio-wbi15-nervous-system-003",
        unitCode: "WBI15",
        topicSlug: "nervous-system",
        type: "SHORT",
        difficulty: "HARD",
        marks: 4,
        status: "DRAFT",
        stem: r`Explain how light falling on a rod cell leads to an action potential in a neurone of the optic nerve.`,
        markScheme: r`- Light breaks down rhodopsin into retinal and opsin (bleaching) (1)
- Opsin triggers the closing of sodium ion channels, so the rod cell hyperpolarises (1)
- The rod cell stops releasing its inhibitory neurotransmitter (glutamate) onto the bipolar cell (1)
- So the bipolar cell depolarises and stimulates an action potential in the optic nerve (ganglion) neurone (1)`,
        explanation: r`Rod cells are unusual: in the dark they are depolarised and continually release glutamate, which **inhibits** the bipolar cell. Light removes this inhibition.`,
    },

    // --- plant-responses-brain ---
    {
        seedKey: "bio-wbi15-plant-responses-brain-001",
        unitCode: "WBI15",
        topicSlug: "plant-responses-brain",
        type: "MCQ",
        difficulty: "MEDIUM",
        marks: 1,
        status: "DRAFT",
        stem: r`Which form of phytochrome builds up in a plant during daylight, and why?`,
        options: opts(
            "Pr, because far-red light converts Pfr to Pr",
            "Pfr, because sunlight contains more red light than far-red light",
            "Pr, because Pfr breaks down slowly in the light",
            "Pfr, because Pr is converted to Pfr in the dark",
            "B",
        ),
        markScheme: r`- **B** (1) — red light (about 660 nm) converts Pr to Pfr faster than far-red light converts it back.`,
        explanation: r`In the dark, Pfr slowly converts back to Pr, so long nights lower the amount of Pfr. Pfr is the active form that affects processes such as flowering and germination.`,
    },
    {
        seedKey: "bio-wbi15-plant-responses-brain-002",
        unitCode: "WBI15",
        topicSlug: "plant-responses-brain",
        type: "SHORT",
        difficulty: "MEDIUM",
        marks: 4,
        status: "DRAFT",
        stem: r`Explain how a plant shoot bends towards light coming from one side.`,
        markScheme: r`- Auxin (IAA) is produced in the shoot tip (1)
- Auxin moves to / accumulates on the shaded side of the shoot (1)
- Auxin stimulates cell elongation on the shaded side (by causing H⁺ to be pumped into cell walls, loosening them) (1)
- Cells on the shaded side elongate more than on the lit side, so the shoot bends towards the light (1)`,
        explanation: r`In shoots auxin **promotes** elongation, so the shaded side grows faster. Saying the lit side "shrinks" or that auxin is destroyed by light misses the redistribution idea.`,
    },
    {
        seedKey: "bio-wbi15-plant-responses-brain-003",
        unitCode: "WBI15",
        topicSlug: "plant-responses-brain",
        type: "SHORT",
        difficulty: "HARD",
        marks: 3,
        status: "DRAFT",
        stem: r`A doctor wants to find out which regions of a patient's brain are active while the patient speaks.

Explain why functional magnetic resonance imaging (fMRI) is more suitable than computed tomography (CT) for this purpose.`,
        markScheme: r`- fMRI detects changes in blood flow / oxygenated haemoglobin to active brain regions (1)
- So it shows brain activity in real time while the patient carries out a task (1)
- CT only shows structure from a single image (and exposes the patient to X-rays), not activity (1)`,
        explanation: r`CT and MRI scans show **structure** (e.g. tumours, damage after a stroke). fMRI shows **function**, because active neurones need more oxygen and blood flow increases to those areas.`,
    },

    // --- gene-technology ---
    {
        seedKey: "bio-wbi15-gene-technology-001",
        unitCode: "WBI15",
        topicSlug: "gene-technology",
        type: "MCQ",
        difficulty: "EASY",
        marks: 1,
        status: "DRAFT",
        stem: r`What is the role of DNA ligase in producing recombinant DNA?`,
        options: opts(
            "It cuts DNA at specific base sequences",
            "It makes DNA copies from mRNA",
            "It forms phosphodiester bonds between the sugar–phosphate backbones of DNA fragments",
            "It forms hydrogen bonds between complementary sticky ends",
            "C",
        ),
        markScheme: r`- **C** (1) — ligase seals the gene into the vector by joining the backbones.`,
        explanation: r`Restriction enzymes cut DNA (A) and reverse transcriptase makes cDNA from mRNA (B). Sticky ends pair by hydrogen bonding on their own; ligase is needed to form the covalent bonds.`,
    },
    {
        seedKey: "bio-wbi15-gene-technology-002",
        unitCode: "WBI15",
        topicSlug: "gene-technology",
        type: "SHORT",
        difficulty: "MEDIUM",
        marks: 5,
        status: "DRAFT",
        stem: r`Describe how bacteria can be genetically modified to produce human insulin.`,
        markScheme: r`- The insulin gene is obtained, e.g. by cutting it out of DNA with a restriction enzyme or by making cDNA from mRNA with reverse transcriptase (1)
- A plasmid is cut with the same restriction enzyme, giving complementary sticky ends (1)
- The gene and plasmid are joined by DNA ligase to form recombinant DNA (1)
- The recombinant plasmids are taken up by bacteria (e.g. after heat shock with calcium ions) (1)
- Bacteria that have taken up the plasmid are identified using marker genes (e.g. antibiotic resistance) and then cultured (1)`,
        explanation: r`Using cDNA from mRNA avoids introns, which bacteria cannot remove. Only a small proportion of bacteria take up the plasmid, so a marker gene is needed to select them.`,
    },
    {
        seedKey: "bio-wbi15-gene-technology-003",
        unitCode: "WBI15",
        topicSlug: "gene-technology",
        type: "SHORT",
        difficulty: "HARD",
        marks: 3,
        status: "DRAFT",
        stem: r`Explain how a DNA microarray can be used to find out which genes are being expressed in a tumour cell.`,
        markScheme: r`- mRNA is extracted from the cell and used to make (fluorescently) labelled cDNA (1)
- The labelled cDNA is washed over the microarray and hybridises with complementary DNA probes for known genes (1)
- Spots that fluoresce show which genes were being transcribed; brighter spots indicate higher expression (1)`,
        explanation: r`Using mRNA (not genomic DNA) is what makes this a test of **expression**. Comparing the pattern with that of a healthy cell shows which genes are switched on or off in the tumour.`,
    },
];

// ---------------------------------------------------------------------------------------------------------------
// WBI16 — Practical Skills in Biology II
// ---------------------------------------------------------------------------------------------------------------
const wbi16: SeedQuestion[] = [
    // --- planning-investigations ---
    {
        seedKey: "bio-wbi16-planning-investigations-001",
        unitCode: "WBI16",
        topicSlug: "planning-investigations",
        type: "MCQ",
        difficulty: "EASY",
        marks: 1,
        status: "DRAFT",
        stem: r`A student uses a respirometer to investigate the effect of temperature on the rate of respiration of germinating mung beans. Which is the most suitable control?`,
        options: opts(
            "A respirometer with no soda lime",
            "A respirometer with the same mass of glass beads instead of germinating beans",
            "A respirometer with twice the mass of germinating beans",
            "A respirometer kept at room temperature",
            "B",
        ),
        markScheme: r`- **B** (1) — glass beads occupy the same volume, so any change shows the effect of temperature and pressure on the apparatus alone.`,
        explanation: r`Removing soda lime would stop CO₂ being absorbed, so oxygen uptake could not be measured. Boiled (dead) beans of the same mass are another acceptable control.`,
    },
    {
        seedKey: "bio-wbi16-planning-investigations-002",
        unitCode: "WBI16",
        topicSlug: "planning-investigations",
        type: "SHORT",
        difficulty: "HARD",
        marks: 6,
        status: "DRAFT",
        stem: r`Plan an investigation to find out how light intensity affects the rate of photosynthesis of a freshwater pondweed. Use only standard school laboratory equipment.`,
        markScheme: r`- Vary light intensity by placing a lamp at different distances (at least five, e.g. 10–50 cm) from the pondweed, using light intensity $\propto 1/d^2$ (1)
- Measure the rate by collecting the oxygen produced in a fixed time using a gas syringe / photosynthometer, or by counting bubbles per minute (1)
- Control temperature using a water bath or a heat shield (e.g. a beaker of water) between the lamp and the plant (1)
- Control carbon dioxide by adding the same concentration of sodium hydrogencarbonate solution to the water (1)
- Use the same piece of pondweed and leave it to acclimatise at each new distance for a few minutes before measuring (1)
- Carry out at least three repeats at each distance and calculate a mean, in a darkened room with no other light sources (1)`,
        explanation: r`A good plan names the independent, dependent and control variables, explains **how** each is controlled, and includes repeats. Measuring volume of gas is more accurate than counting bubbles, which can vary in size.`,
    },
    {
        seedKey: "bio-wbi16-planning-investigations-003",
        unitCode: "WBI16",
        topicSlug: "planning-investigations",
        type: "SHORT",
        difficulty: "MEDIUM",
        marks: 3,
        status: "DRAFT",
        stem: r`Students plan to investigate the effect of an energy drink on the reaction time of volunteers from their class.

Describe **three** ethical issues they should consider and how they would address them.`,
        markScheme: r`- Obtain informed consent: tell volunteers what is involved and that they can withdraw at any time (1)
- Exclude people for whom caffeine could be harmful, e.g. with heart conditions or caffeine sensitivity, and keep the dose low (1)
- Keep results anonymous / confidential (1)`,
        explanation: r`Ethics questions need practical actions, not just "make it ethical". With animals (e.g. *Daphnia*), consider using invertebrates, minimising numbers and returning them to their habitat.`,
    },

    // --- statistical-tests ---
    {
        seedKey: "bio-wbi16-statistical-tests-001",
        unitCode: "WBI16",
        topicSlug: "statistical-tests",
        type: "MCQ",
        difficulty: "MEDIUM",
        marks: 1,
        status: "DRAFT",
        stem: r`A student measured the distance of 10 quadrats from the edge of a mangrove and counted the number of crab burrows in each quadrat. Which statistical test should she use to find out whether there is a correlation?`,
        options: opts("$t$-test", "Chi-squared test", "Spearman's rank correlation", "Standard deviation", "C"),
        markScheme: r`- **C** (1) — Spearman's rank tests for a correlation between two variables measured on the same samples.`,
        explanation: r`A $t$-test compares the means of two groups; chi-squared compares observed and expected frequencies in categories. Standard deviation describes spread, it is not a test.`,
    },
    {
        seedKey: "bio-wbi16-statistical-tests-002",
        unitCode: "WBI16",
        topicSlug: "statistical-tests",
        type: "CALCULATION",
        difficulty: "HARD",
        marks: 4,
        status: "DRAFT",
        stem: r`Students counted crab burrows in quadrats at increasing distances from the high-tide line on a beach.

| Distance from high-tide line / m | 2 | 4 | 6 | 8 | 10 | 12 | 14 | 16 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Number of burrows | 31 | 27 | 29 | 22 | 18 | 20 | 12 | 9 |

Calculate Spearman's rank correlation coefficient using
$$r_s = 1 - \frac{6\sum d^2}{n(n^2 - 1)}$$
and interpret the result. The critical value for $n = 8$ at the 5% significance level is 0.738.`,
        markScheme: r`- Ranks both variables correctly, e.g. distance 1 to 8 and burrows 8, 6, 7, 5, 3, 4, 2, 1 (1)
- $\sum d^2 = 164$ (1)
- $r_s = 1 - \dfrac{6 \times 164}{8 \times 63} = -0.95$ (1)
- $|r_s| = 0.95$ is greater than 0.738, so there is a significant negative correlation (reject the null hypothesis) (1)`,
        explanation: r`Rank both variables in the **same direction** (e.g. smallest = 1). Compare the size of $r_s$, ignoring its sign, with the critical value. A correlation does not prove that distance causes the change.`,
    },
    {
        seedKey: "bio-wbi16-statistical-tests-003",
        unitCode: "WBI16",
        topicSlug: "statistical-tests",
        type: "CALCULATION",
        difficulty: "HARD",
        marks: 4,
        status: "DRAFT",
        stem: r`In a dihybrid cross the expected ratio of phenotypes is $9 : 3 : 3 : 1$. A student counted 160 offspring.

| Phenotype | 1 | 2 | 3 | 4 |
| --- | --- | --- | --- | --- |
| Observed | 98 | 28 | 25 | 9 |

Calculate $\chi^2$ using $\chi^2 = \sum \dfrac{(O - E)^2}{E}$ and state whether the results support the expected ratio. The critical value at the 5% significance level for 3 degrees of freedom is 7.82.`,
        markScheme: r`- Expected values are 90, 30, 30 and 10 (1)
- Values of $(O-E)^2/E$ are 0.711, 0.133, 0.833 and 0.100 (1)
- $\chi^2 = 1.78$ (1)
- 1.78 is less than 7.82, so the difference is not significant / due to chance, and the results support the $9 : 3 : 3 : 1$ ratio (accept the null hypothesis) (1)`,
        explanation: r`Degrees of freedom = number of categories − 1 = 3. A **small** $\chi^2$ means the observed values are close to the expected ones.`,
    },
    {
        seedKey: "bio-wbi16-statistical-tests-004",
        unitCode: "WBI16",
        topicSlug: "statistical-tests",
        type: "CALCULATION",
        difficulty: "HARD",
        marks: 4,
        status: "DRAFT",
        stem: r`The lengths of leaves were measured for 10 leaves from the sunny side and 10 leaves from the shaded side of a tree.

| | Sunny side | Shaded side |
| --- | --- | --- |
| Mean length / mm | 20.8 | 24.6 |
| Standard deviation / mm | 2.7 | 3.1 |
| Number of leaves | 10 | 10 |

Calculate $t$ using
$$t = \frac{\bar{x}_1 - \bar{x}_2}{\sqrt{\dfrac{s_1^2}{n_1} + \dfrac{s_2^2}{n_2}}}$$
and state a conclusion. The critical value for 18 degrees of freedom at the 5% significance level is 2.10.`,
        markScheme: r`- $\dfrac{s_1^2}{n_1} + \dfrac{s_2^2}{n_2} = 0.729 + 0.961 = 1.69$ (1)
- $\sqrt{1.69} = 1.3$, so $t = 3.8 \div 1.3$ (1)
- $t = 2.92$ (ignore sign) (1)
- 2.92 is greater than 2.10, so there is a significant difference in mean leaf length between the two sides (reject the null hypothesis) (1)`,
        explanation: r`Degrees of freedom for this $t$-test are $n_1 + n_2 - 2 = 18$. A significant result means there is less than a 5% probability that the difference is due to chance.`,
    },

    // --- evaluation ---
    {
        seedKey: "bio-wbi16-evaluation-001",
        unitCode: "WBI16",
        topicSlug: "evaluation",
        type: "MCQ",
        difficulty: "MEDIUM",
        marks: 1,
        status: "DRAFT",
        stem: r`A balance reads $0.20\,\text{g}$ when nothing is on it. A student does not notice and uses it to weigh all her samples. What type of error is this?`,
        options: opts("Random error", "Systematic error", "Human reaction-time error", "Anomalous result", "B"),
        markScheme: r`- **B** (1) — every reading is too high by the same amount (a zero error).`,
        explanation: r`Systematic errors shift all readings in the same direction and are **not** reduced by repeating. Random errors vary unpredictably and are reduced by taking a mean of repeats.`,
    },
    {
        seedKey: "bio-wbi16-evaluation-002",
        unitCode: "WBI16",
        topicSlug: "evaluation",
        type: "SHORT",
        difficulty: "HARD",
        marks: 4,
        status: "DRAFT",
        stem: r`A student investigated the effect of temperature on the respiration rate of maggots using a simple respirometer. She measured the distance the coloured liquid moved in 5 minutes.

| Temperature / °C | 15 | 20 | 25 | 30 | 35 |
| --- | --- | --- | --- | --- | --- |
| Distance moved / mm (single reading) | 6 | 9 | 14 | 13 | 22 |

She concluded that respiration rate increases with temperature. Evaluate her method and conclusion, and suggest **two** improvements.`,
        markScheme: r`- The general trend supports the conclusion, but 30 °C does not fit the pattern (possible anomaly) (1)
- Only one reading at each temperature, so anomalies cannot be identified and the results may not be reliable (1)
- Improvement: carry out at least three repeats at each temperature and calculate a mean (1)
- Improvement: use a control tube with glass beads / leave to equilibrate before measuring, to allow for temperature and pressure changes (1)`,
        explanation: r`An evaluation should refer to the data given and suggest improvements that tackle the specific weaknesses. Using the same mass of maggots of similar age would also improve validity.`,
    },
    {
        seedKey: "bio-wbi16-evaluation-003",
        unitCode: "WBI16",
        topicSlug: "evaluation",
        type: "SHORT",
        difficulty: "MEDIUM",
        marks: 3,
        status: "DRAFT",
        stem: r`A survey found a significant positive correlation between the number of fast-food outlets in a town and the number of people with heart disease. A newspaper concluded that fast food causes heart disease.

Explain why this conclusion may not be valid.`,
        markScheme: r`- A correlation does not show a causal relationship (1)
- Other factors may be involved, e.g. larger towns have both more outlets and more people / differences in age, smoking or exercise (1)
- These variables were not controlled in a survey, so their effect cannot be separated from the effect of fast food (1)`,
        explanation: r`To show cause, scientists need a controlled experiment or a biological mechanism that explains the link, as well as the correlation.`,
    },
];

export const biologyQuestions: SeedQuestion[] = [...wbi11, ...wbi12, ...wbi13, ...wbi14, ...wbi15, ...wbi16];
