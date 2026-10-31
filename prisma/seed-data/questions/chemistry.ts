import type { SeedQuestion } from "../types";

// Original IAL-style Chemistry practice questions (written for this app, not taken from Pearson papers).
// Data follow the IAL data booklet: relative atomic masses to 1 d.p. (H 1.0, C 12.0, N 14.0, O 16.0, Mg 24.3,
// Ca 40.1, Fe 55.8), N_A = 6.02e23 mol^-1, molar gas volume 24.0 dm^3 at RTP, c(water) = 4.18 J g^-1 K^-1,
// R = 8.31 J K^-1 mol^-1, K_w = 1.00e-14 mol^2 dm^-6 at 298 K.
// Every question is a DRAFT: an admin checks and publishes it.

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
// WCH11 — Structure, Bonding and Introduction to Organic Chemistry
// ---------------------------------------------------------------------------------------------------------------
const wch11: SeedQuestion[] = [
    // --- amount-of-substance ---
    {
        seedKey: "che-wch11-amount-of-substance-001",
        unitCode: "WCH11",
        topicSlug: "amount-of-substance",
        type: "MCQ",
        difficulty: "EASY",
        marks: 1,
        status: "DRAFT",
        stem: r`Which sample contains the greatest total number of **atoms**?`,
        options: opts(
            r`$0.10\,\text{mol}$ of ethane, $\text{C}_2\text{H}_6$`,
            r`$0.25\,\text{mol}$ of carbon dioxide, $\text{CO}_2$`,
            r`$0.35\,\text{mol}$ of oxygen, $\text{O}_2$`,
            r`$0.15\,\text{mol}$ of ammonia, $\text{NH}_3$`,
            "A",
        ),
        markScheme: r`- **A** (1) — $0.10 \times 8 = 0.80\,\text{mol}$ of atoms, more than B (0.75), C (0.70) or D (0.60).`,
        explanation: r`Multiply the amount of molecules by the number of atoms in each molecule. C has the most **molecules**, but each $\text{O}_2$ molecule only has 2 atoms.`,
    },
    {
        seedKey: "che-wch11-amount-of-substance-002",
        unitCode: "WCH11",
        topicSlug: "amount-of-substance",
        type: "CALCULATION",
        difficulty: "MEDIUM",
        marks: 4,
        status: "DRAFT",
        stem: r`A student adds $2.50\,\text{g}$ of calcium carbonate to $50.0\,\text{cm}^3$ of $2.00\,\text{mol dm}^{-3}$ hydrochloric acid.

$$\text{CaCO}_3(\text{s}) + 2\text{HCl}(\text{aq}) \rightarrow \text{CaCl}_2(\text{aq}) + \text{H}_2\text{O}(\text{l}) + \text{CO}_2(\text{g})$$

(a) Show by calculation that the hydrochloric acid is in excess.

(b) Calculate the volume of carbon dioxide produced, in $\text{dm}^3$, at room temperature and pressure.

[$M_r$ of $\text{CaCO}_3 = 100.1$; molar volume of a gas at RTP $= 24.0\,\text{dm}^3\,\text{mol}^{-1}$]`,
        markScheme: r`- $n(\text{CaCO}_3) = 2.50 \div 100.1 = 0.0250\,\text{mol}$ (1)
- $n(\text{HCl}) = 0.0500 \times 2.00 = 0.100\,\text{mol}$, which is more than the $2 \times 0.0250 = 0.0500\,\text{mol}$ needed, so HCl is in excess (1)
- $n(\text{CO}_2) = n(\text{CaCO}_3) = 0.0250\,\text{mol}$ (1)
- $V = 0.0250 \times 24.0 = 0.600\,\text{dm}^3$ (1)`,
        explanation: r`Convert the acid volume to $\text{dm}^3$ first ($50.0\,\text{cm}^3 = 0.0500\,\text{dm}^3$). The limiting reagent (calcium carbonate) decides how much gas forms; remember the 1 : 2 ratio when checking the acid.`,
    },
    {
        seedKey: "che-wch11-amount-of-substance-003",
        unitCode: "WCH11",
        topicSlug: "amount-of-substance",
        type: "CALCULATION",
        difficulty: "HARD",
        marks: 4,
        status: "DRAFT",
        stem: r`A compound contains only carbon, hydrogen and oxygen. By mass it is $54.5\%$ carbon and $9.1\%$ hydrogen. Its relative molecular mass is $88.0$.

Calculate the empirical formula and hence deduce the molecular formula of the compound.`,
        markScheme: r`- Percentage of oxygen $= 36.4\%$ and each percentage divided by $A_r$: C $54.5/12.0 = 4.54$, H $9.1/1.0 = 9.1$, O $36.4/16.0 = 2.28$ (1)
- Divides by the smallest ($2.28$) to give the ratio $2 : 4 : 1$, so the empirical formula is $\text{C}_2\text{H}_4\text{O}$ (1)
- Empirical formula mass $= 44.0$ and $88.0 \div 44.0 = 2$ (1)
- Molecular formula $\text{C}_4\text{H}_8\text{O}_2$ (1)`,
        explanation: r`Find the oxygen percentage by difference before dividing by $A_r$. Don't round the mole ratios too early — $1.99 : 4.0 : 1$ is clearly $2 : 4 : 1$.`,
    },

    // --- atomic-structure-periodic-table ---
    {
        seedKey: "che-wch11-atomic-structure-periodic-table-001",
        unitCode: "WCH11",
        topicSlug: "atomic-structure-periodic-table",
        type: "MCQ",
        difficulty: "MEDIUM",
        marks: 1,
        status: "DRAFT",
        stem: r`The first ionisation energy of aluminium is **lower** than that of magnesium. Which statement best explains this?`,
        options: opts(
            r`The electron removed from aluminium is in a 3p sub-shell, which is higher in energy than the 3s sub-shell.`,
            r`Aluminium has a greater nuclear charge than magnesium.`,
            r`The electron removed from aluminium is in a pair, so it experiences extra repulsion.`,
            r`Aluminium has one more occupied electron shell than magnesium.`,
            "A",
        ),
        markScheme: r`- **A** (1) — the 3p electron is higher in energy and partly shielded by the 3s electrons, so less energy is needed to remove it.`,
        explanation: r`B is true but would make the ionisation energy *higher*. C explains the dip from phosphorus to sulfur, not magnesium to aluminium. Both atoms have three occupied shells, so D is false.`,
    },
    {
        seedKey: "che-wch11-atomic-structure-periodic-table-002",
        unitCode: "WCH11",
        topicSlug: "atomic-structure-periodic-table",
        type: "CALCULATION",
        difficulty: "EASY",
        marks: 3,
        status: "DRAFT",
        stem: r`The mass spectrum of a sample of an element shows two peaks:

| $m/z$ | relative abundance |
| --- | --- |
| 69 | 15.2 |
| 71 | 10.1 |

Calculate the relative atomic mass of the element to 1 decimal place and use the Periodic Table to identify it.`,
        markScheme: r`- Multiplies each $m/z$ by its abundance and adds: $(69 \times 15.2) + (71 \times 10.1) = 1765.9$ (1)
- Divides by the total abundance: $1765.9 \div 25.3$ (1)
- $A_r = 69.8$, so the element is gallium (Ga) (1)`,
        explanation: r`The abundances here are not percentages, so divide by their total ($25.3$), not by 100.`,
    },
    {
        seedKey: "che-wch11-atomic-structure-periodic-table-003",
        unitCode: "WCH11",
        topicSlug: "atomic-structure-periodic-table",
        type: "SHORT",
        difficulty: "HARD",
        marks: 3,
        status: "DRAFT",
        stem: r`The first four successive ionisation energies of element **X**, in $\text{kJ mol}^{-1}$, are:

$$738 \qquad 1451 \qquad 7733 \qquad 10\,541$$

Deduce the group of the Periodic Table that contains **X**. Explain your reasoning.`,
        markScheme: r`- There is a large jump between the second and third ionisation energies (1)
- So X has two electrons in its outer shell and is in Group 2 (1)
- The third electron is removed from a shell closer to the nucleus, with less shielding, so it is held much more strongly (1)`,
        explanation: r`Look for the biggest *jump*, not the biggest value. Each ionisation energy is larger than the last because the ion becomes more positive, but a sudden large rise means a new, inner shell has been reached.`,
    },

    // --- bonding-structure ---
    {
        seedKey: "che-wch11-bonding-structure-001",
        unitCode: "WCH11",
        topicSlug: "bonding-structure",
        type: "MCQ",
        difficulty: "MEDIUM",
        marks: 1,
        status: "DRAFT",
        stem: r`Which species has a **pyramidal** shape?`,
        options: opts(
            r`$\text{BF}_3$`,
            r`$\text{NH}_4^{\;+}$`,
            r`$\text{H}_3\text{O}^+$`,
            r`$\text{CH}_3^{\;+}$`,
            "C",
        ),
        markScheme: r`- **C** (1) — oxygen has three bonding pairs and one lone pair, giving a pyramidal shape (about $107^\circ$).`,
        explanation: r`Count all electron pairs round the central atom. $\text{BF}_3$ and $\text{CH}_3^{\;+}$ have three bonding pairs and no lone pair (trigonal planar); $\text{NH}_4^{\;+}$ has four bonding pairs (tetrahedral).`,
    },
    {
        seedKey: "che-wch11-bonding-structure-002",
        unitCode: "WCH11",
        topicSlug: "bonding-structure",
        type: "SHORT",
        difficulty: "MEDIUM",
        marks: 4,
        status: "DRAFT",
        stem: r`State the shape of a water molecule and its $\text{H}{-}\text{O}{-}\text{H}$ bond angle. Explain your answer using electron-pair repulsion theory.`,
        markScheme: r`- Oxygen has two bonding pairs and two lone pairs of electrons (1)
- Electron pairs repel each other and move as far apart as possible to minimise repulsion (1)
- Lone pairs repel more strongly than bonding pairs, so the bond angle is reduced below $109.5^\circ$ (1)
- Bent (V-shaped), bond angle $104.5^\circ$ (accept $104$–$105^\circ$) (1)`,
        explanation: r`Each lone pair reduces the angle by roughly $2.5^\circ$ from the tetrahedral $109.5^\circ$: $\text{NH}_3$ (one lone pair) is $107^\circ$, $\text{H}_2\text{O}$ (two lone pairs) is $104.5^\circ$.`,
    },
    {
        seedKey: "che-wch11-bonding-structure-003",
        unitCode: "WCH11",
        topicSlug: "bonding-structure",
        type: "SHORT",
        difficulty: "HARD",
        marks: 3,
        status: "DRAFT",
        stem: r`Explain why magnesium has a much higher melting temperature than sodium.`,
        markScheme: r`- Magnesium ions are $\text{Mg}^{2+}$ and each atom contributes two delocalised electrons, compared with $\text{Na}^+$ and one electron (1)
- $\text{Mg}^{2+}$ ions are smaller, so have a greater charge density (1)
- So the electrostatic attraction between the metal ions and the delocalised electrons is stronger and more energy is needed to overcome it (1)`,
        explanation: r`Metallic bond strength depends on the charge and size of the cations and the number of delocalised electrons. Avoid talking about "molecules" or "intermolecular forces" — metals are giant lattices.`,
    },

    // --- organic-alkanes ---
    {
        seedKey: "che-wch11-organic-alkanes-001",
        unitCode: "WCH11",
        topicSlug: "organic-alkanes",
        type: "MCQ",
        difficulty: "EASY",
        marks: 1,
        status: "DRAFT",
        stem: r`How many structural isomers have the molecular formula $\text{C}_5\text{H}_{12}$?`,
        options: opts("2", "3", "4", "5", "B"),
        markScheme: r`- **B** (1) — pentane, 2-methylbutane and 2,2-dimethylpropane.`,
        explanation: r`A common mistake is to count "3-methylbutane" as different from 2-methylbutane — it is the same molecule numbered from the other end.`,
    },
    {
        seedKey: "che-wch11-organic-alkanes-002",
        unitCode: "WCH11",
        topicSlug: "organic-alkanes",
        type: "SHORT",
        difficulty: "MEDIUM",
        marks: 4,
        status: "DRAFT",
        stem: r`Methane reacts with chlorine in the presence of ultraviolet light to form chloromethane.

Give equations for the initiation step, the **two** propagation steps and **one** termination step of this free-radical substitution.`,
        markScheme: r`- Initiation: $\text{Cl}_2 \rightarrow 2\text{Cl}\bullet$ (1)
- Propagation: $\text{CH}_4 + \text{Cl}\bullet \rightarrow \text{CH}_3\bullet + \text{HCl}$ (1)
- Propagation: $\text{CH}_3\bullet + \text{Cl}_2 \rightarrow \text{CH}_3\text{Cl} + \text{Cl}\bullet$ (1)
- Termination, e.g. $\text{CH}_3\bullet + \text{Cl}\bullet \rightarrow \text{CH}_3\text{Cl}$ or $2\text{CH}_3\bullet \rightarrow \text{C}_2\text{H}_6$ or $2\text{Cl}\bullet \rightarrow \text{Cl}_2$ (1)`,
        explanation: r`UV light breaks the weaker $\text{Cl}{-}\text{Cl}$ bond homolytically. In propagation, a radical is used and another is made, so the chain continues; termination removes two radicals.`,
    },
    {
        seedKey: "che-wch11-organic-alkanes-003",
        unitCode: "WCH11",
        topicSlug: "organic-alkanes",
        type: "SHORT",
        difficulty: "MEDIUM",
        marks: 3,
        status: "DRAFT",
        stem: r`Propane, $\text{C}_3\text{H}_8$, is used as a fuel in portable gas stoves.

(a) Write a balanced equation for the incomplete combustion of propane to form carbon monoxide and water.

(b) Explain why carbon monoxide is toxic.

(c) Nitrogen monoxide is also found in the exhaust from car engines that burn hydrocarbons. Explain how it forms.`,
        markScheme: r`- (a) $\text{C}_3\text{H}_8 + 3\tfrac{1}{2}\text{O}_2 \rightarrow 3\text{CO} + 4\text{H}_2\text{O}$ (or doubled) (1)
- (b) CO binds to haemoglobin (more strongly than oxygen), reducing the blood's ability to carry oxygen (1)
- (c) Nitrogen and oxygen from the air react at the high temperature in the engine (1)`,
        explanation: r`The nitrogen in NO does not come from the fuel — hydrocarbons contain no nitrogen. It comes from air drawn into the engine.`,
    },

    // --- alkenes ---
    {
        seedKey: "che-wch11-alkenes-001",
        unitCode: "WCH11",
        topicSlug: "alkenes",
        type: "MCQ",
        difficulty: "MEDIUM",
        marks: 1,
        status: "DRAFT",
        stem: r`Which compound shows E/Z isomerism?`,
        options: opts("but-1-ene", "2-methylbut-2-ene", "pent-2-ene", "1,1-dichloroethene", "C"),
        markScheme: r`- **C** (1) — each carbon of the C=C in $\text{CH}_3\text{CH}{=}\text{CHCH}_2\text{CH}_3$ has two different groups attached.`,
        explanation: r`E/Z isomerism needs restricted rotation **and** two different groups on *each* carbon of the double bond. In the other three compounds one carbon of the C=C carries two identical groups (H, H or $\text{CH}_3$, $\text{CH}_3$ or Cl, Cl).`,
    },
    {
        seedKey: "che-wch11-alkenes-002",
        unitCode: "WCH11",
        topicSlug: "alkenes",
        type: "SHORT",
        difficulty: "HARD",
        marks: 4,
        status: "DRAFT",
        stem: r`Propene reacts with hydrogen bromide to form 2-bromopropane as the major product.

Describe the mechanism of this reaction, stating where each curly arrow starts and ends, and explain why 2-bromopropane rather than 1-bromopropane is the major product.`,
        markScheme: r`- Curly arrow from the C=C double bond to the H of HBr, and curly arrow from the $\text{H}{-}\text{Br}$ bond to the Br (with $\text{H}^{\delta+}{-}\text{Br}^{\delta-}$ dipole) (1)
- Secondary carbocation intermediate $\text{CH}_3\text{C}^+\text{HCH}_3$ and $\text{Br}^-$ formed (1)
- Curly arrow from a lone pair on $\text{Br}^-$ to the positive carbon (1)
- The secondary carbocation is more stable than the primary one because it has more electron-releasing alkyl groups, so it forms in preference (1)`,
        explanation: r`This is electrophilic addition. The product depends on which carbocation forms: alkyl groups push electron density towards the positive carbon, stabilising it, so the more substituted carbocation wins.`,
    },
    {
        seedKey: "che-wch11-alkenes-003",
        unitCode: "WCH11",
        topicSlug: "alkenes",
        type: "SHORT",
        difficulty: "EASY",
        marks: 2,
        status: "DRAFT",
        stem: r`Describe a chemical test to show that a liquid hydrocarbon is an alkene rather than an alkane. Give the reagent and the result.`,
        markScheme: r`- Add bromine water (1)
- Colour changes from orange (or yellow/brown) to colourless with the alkene; no change with the alkane (1)`,
        explanation: r`Say "colourless", not "clear" — a clear solution can still be coloured. Alkanes do not decolourise bromine water in the dark because they cannot undergo addition.`,
    },
];

// ---------------------------------------------------------------------------------------------------------------
// WCH12 — Energetics, Group Chemistry, Halogenoalkanes and Alcohols
// ---------------------------------------------------------------------------------------------------------------
const wch12: SeedQuestion[] = [
    // --- energetics ---
    {
        seedKey: "che-wch12-energetics-001",
        unitCode: "WCH12",
        topicSlug: "energetics",
        type: "MCQ",
        difficulty: "EASY",
        marks: 1,
        status: "DRAFT",
        stem: r`Which equation represents the standard enthalpy change of formation of ethanol?`,
        options: opts(
            r`$2\text{C}(\text{s}) + 3\text{H}_2(\text{g}) + \tfrac{1}{2}\text{O}_2(\text{g}) \rightarrow \text{C}_2\text{H}_5\text{OH}(\text{l})$`,
            r`$2\text{C}(\text{g}) + 6\text{H}(\text{g}) + \text{O}(\text{g}) \rightarrow \text{C}_2\text{H}_5\text{OH}(\text{l})$`,
            r`$4\text{C}(\text{s}) + 6\text{H}_2(\text{g}) + \text{O}_2(\text{g}) \rightarrow 2\text{C}_2\text{H}_5\text{OH}(\text{l})$`,
            r`$\text{C}_2\text{H}_4(\text{g}) + \text{H}_2\text{O}(\text{g}) \rightarrow \text{C}_2\text{H}_5\text{OH}(\text{l})$`,
            "A",
        ),
        markScheme: r`- **A** (1) — one mole of product formed from its elements in their standard states.`,
        explanation: r`B uses gaseous atoms (not standard states), C forms two moles, and D starts from compounds rather than elements.`,
    },
    {
        seedKey: "che-wch12-energetics-002",
        unitCode: "WCH12",
        topicSlug: "energetics",
        type: "CALCULATION",
        difficulty: "MEDIUM",
        marks: 5,
        status: "DRAFT",
        stem: r`A spirit burner containing propan-1-ol, $\text{C}_3\text{H}_7\text{OH}$, was used to heat $200\,\text{g}$ of water in a copper can. Burning $0.580\,\text{g}$ of propan-1-ol raised the temperature of the water by $15.4\,^\circ\text{C}$.

Calculate the enthalpy change of combustion of propan-1-ol, in $\text{kJ mol}^{-1}$. Give your answer to 3 significant figures.

[Specific heat capacity of water $= 4.18\,\text{J g}^{-1}\,^\circ\text{C}^{-1}$]`,
        markScheme: r`- $Q = mc\Delta T = 200 \times 4.18 \times 15.4$ (1)
- $Q = 12\,874\,\text{J} = 12.9\,\text{kJ}$ (1)
- $n(\text{C}_3\text{H}_7\text{OH}) = 0.580 \div 60.0 = 9.67 \times 10^{-3}\,\text{mol}$ (1)
- $\Delta_c H = -12.874 \div (9.67 \times 10^{-3})$ (1)
- $\Delta_c H = -1330\,\text{kJ mol}^{-1}$ (negative sign and 3 s.f. required) (1)`,
        explanation: r`Use the mass of **water** in $Q = mc\Delta T$, not the mass of fuel. The value is far less exothermic than the data-book value (about $-2021\,\text{kJ mol}^{-1}$) mainly because of heat loss to the surroundings and incomplete combustion.`,
    },
    {
        seedKey: "che-wch12-energetics-003",
        unitCode: "WCH12",
        topicSlug: "energetics",
        type: "CALCULATION",
        difficulty: "HARD",
        marks: 4,
        status: "DRAFT",
        stem: r`Use the mean bond enthalpies below to calculate the enthalpy change for the hydrogenation of ethene:

$$\text{C}_2\text{H}_4(\text{g}) + \text{H}_2(\text{g}) \rightarrow \text{C}_2\text{H}_6(\text{g})$$

| bond | mean bond enthalpy / $\text{kJ mol}^{-1}$ |
| --- | --- |
| C=C | 612 |
| C–C | 347 |
| C–H | 413 |
| H–H | 436 |

The data-book value is $-137\,\text{kJ mol}^{-1}$. Suggest why your answer differs from this.`,
        markScheme: r`- Bonds broken: $\text{C{=}C} + \text{H{-}H} = 612 + 436 = 1048\,\text{kJ mol}^{-1}$ (1)
- Bonds made: $\text{C{-}C} + 2(\text{C{-}H}) = 347 + 826 = 1173\,\text{kJ mol}^{-1}$ (1)
- $\Delta H = 1048 - 1173 = -125\,\text{kJ mol}^{-1}$ (1)
- Mean bond enthalpies are averages over many compounds, so they differ from the actual bond enthalpies in ethene and ethane (1)`,
        explanation: r`Only count bonds that actually change. The four C–H bonds in ethene stay intact, so only the two **new** C–H bonds in ethane are "made". $\Delta H = \sum(\text{broken}) - \sum(\text{made})$.`,
    },

    // --- intermolecular-forces ---
    {
        seedKey: "che-wch12-intermolecular-forces-001",
        unitCode: "WCH12",
        topicSlug: "intermolecular-forces",
        type: "MCQ",
        difficulty: "EASY",
        marks: 1,
        status: "DRAFT",
        stem: r`The four compounds below have similar relative molecular masses. Which has the **highest** boiling temperature?`,
        options: opts(
            r`butane, $\text{CH}_3\text{CH}_2\text{CH}_2\text{CH}_3$`,
            r`propanone, $\text{CH}_3\text{COCH}_3$`,
            r`methoxyethane, $\text{CH}_3\text{OCH}_2\text{CH}_3$`,
            r`propan-1-ol, $\text{CH}_3\text{CH}_2\text{CH}_2\text{OH}$`,
            "D",
        ),
        markScheme: r`- **D** (1) — only propan-1-ol has an $\text{O{-}H}$ group, so it forms hydrogen bonds between molecules.`,
        explanation: r`Propanone and methoxyethane contain oxygen but no hydrogen bonded to it, so they cannot hydrogen bond with each other — only permanent dipole and London forces.`,
    },
    {
        seedKey: "che-wch12-intermolecular-forces-002",
        unitCode: "WCH12",
        topicSlug: "intermolecular-forces",
        type: "SHORT",
        difficulty: "MEDIUM",
        marks: 3,
        status: "DRAFT",
        stem: r`Pentane (boiling temperature $36\,^\circ\text{C}$) and 2,2-dimethylpropane (boiling temperature $10\,^\circ\text{C}$) are isomers.

Explain the difference in their boiling temperatures.`,
        markScheme: r`- Both have only London forces between molecules and the same number of electrons (1)
- Pentane molecules are unbranched so have a larger surface area of contact between molecules (1)
- So pentane has stronger London forces, needing more energy to separate the molecules (1)`,
        explanation: r`Boiling separates molecules; it does not break covalent bonds. Branched molecules are more spherical and cannot pack closely, so they have fewer points of contact.`,
    },
    {
        seedKey: "che-wch12-intermolecular-forces-003",
        unitCode: "WCH12",
        topicSlug: "intermolecular-forces",
        type: "SHORT",
        difficulty: "HARD",
        marks: 3,
        status: "DRAFT",
        stem: r`Water, $\text{H}_2\text{O}$, boils at $100\,^\circ\text{C}$, whereas hydrogen sulfide, $\text{H}_2\text{S}$, boils at $-60\,^\circ\text{C}$, even though $\text{H}_2\text{S}$ has more electrons.

Explain this difference.`,
        markScheme: r`- Water forms hydrogen bonds between molecules because oxygen is highly electronegative and has lone pairs (1)
- Hydrogen sulfide has only London forces and permanent dipole–dipole forces, as sulfur is not electronegative enough to form hydrogen bonds (1)
- Hydrogen bonds are much stronger, so more energy is needed to separate water molecules (1)`,
        explanation: r`$\text{H}_2\text{S}$ does have *stronger London forces* than water (more electrons), which is why the hydrogen-bonding argument is needed to explain the trend.`,
    },

    // --- redox-groups-1-2-7 ---
    {
        seedKey: "che-wch12-redox-groups-1-2-7-001",
        unitCode: "WCH12",
        topicSlug: "redox-groups-1-2-7",
        type: "MCQ",
        difficulty: "EASY",
        marks: 1,
        status: "DRAFT",
        stem: r`What is the oxidation number of chlorine in sodium chlorate, $\text{NaClO}_3$?`,
        options: opts("+1", "+3", "+5", "+7", "C"),
        markScheme: r`- **C** (1) — $+1 + x + 3(-2) = 0$, so $x = +5$.`,
        explanation: r`Sodium is always +1 and oxygen is −2 here. The oxidation numbers in a neutral compound sum to zero.`,
    },
    {
        seedKey: "che-wch12-redox-groups-1-2-7-002",
        unitCode: "WCH12",
        topicSlug: "redox-groups-1-2-7",
        type: "SHORT",
        difficulty: "MEDIUM",
        marks: 4,
        status: "DRAFT",
        stem: r`Chlorine water is added to aqueous potassium iodide. The mixture is then shaken with cyclohexane and left to separate.

(a) State what is seen in the aqueous solution and in the cyclohexane layer.

(b) Write the ionic equation for the reaction.

(c) Explain, in terms of atomic structure, why chlorine is a stronger oxidising agent than iodine.`,
        markScheme: r`- (a) Aqueous solution turns from colourless to brown (1)
- (a) Cyclohexane (upper) layer turns purple/violet (1)
- (b) $\text{Cl}_2 + 2\text{I}^- \rightarrow 2\text{Cl}^- + \text{I}_2$ (1)
- (c) Chlorine atoms are smaller with less shielding, so the incoming electron is more strongly attracted to the nucleus (1)`,
        explanation: r`Iodine is brown in water but purple in non-polar solvents — a useful way to tell it apart from bromine (orange in cyclohexane). Potassium ions are spectators, so leave them out of the ionic equation.`,
    },
    {
        seedKey: "che-wch12-redox-groups-1-2-7-003",
        unitCode: "WCH12",
        topicSlug: "redox-groups-1-2-7",
        type: "SHORT",
        difficulty: "HARD",
        marks: 3,
        status: "DRAFT",
        stem: r`Describe and explain the trend in thermal stability of the Group 2 carbonates from magnesium carbonate to barium carbonate.`,
        markScheme: r`- Thermal stability increases down the group (decomposition needs higher temperatures) (1)
- The cation radius increases (same charge), so the charge density of the cation decreases (1)
- So the cation polarises (distorts) the carbonate ion's electron cloud less, weakening its $\text{C{-}O}$ bonds less (1)`,
        explanation: r`Small, highly charged cations such as $\text{Mg}^{2+}$ pull electron density from the carbonate ion, making it easier to break into $\text{CO}_2$ and the oxide ion.`,
    },

    // --- kinetics-equilibria-intro ---
    {
        seedKey: "che-wch12-kinetics-equilibria-intro-001",
        unitCode: "WCH12",
        topicSlug: "kinetics-equilibria-intro",
        type: "MCQ",
        difficulty: "EASY",
        marks: 1,
        status: "DRAFT",
        stem: r`How does a catalyst increase the rate of a reaction?`,
        options: opts(
            "It increases the kinetic energy of the reacting particles.",
            "It makes the enthalpy change of the reaction more negative.",
            "It provides an alternative reaction pathway with a lower activation energy.",
            "It shifts the position of equilibrium towards the products.",
            "C",
        ),
        markScheme: r`- **C** (1) — more particles now have energy at least equal to the (lower) activation energy.`,
        explanation: r`A catalyst does not change the energy of the particles, the enthalpy change, or the equilibrium position; it speeds up forward and reverse reactions equally.`,
    },
    {
        seedKey: "che-wch12-kinetics-equilibria-intro-002",
        unitCode: "WCH12",
        topicSlug: "kinetics-equilibria-intro",
        type: "SHORT",
        difficulty: "MEDIUM",
        marks: 4,
        status: "DRAFT",
        stem: r`Use the Maxwell–Boltzmann distribution to explain why a small increase in temperature causes a large increase in the rate of a reaction.`,
        markScheme: r`- At higher temperature the distribution curve flattens and its peak moves to higher energy (the area under the curve is unchanged) (1)
- The area under the curve beyond $E_a$ increases, so a much greater proportion of molecules have energy $\geq E_a$ (1)
- Molecules also move faster, so collide more frequently (1)
- So there are many more successful collisions per unit time (1)`,
        explanation: r`The main effect is the increase in the fraction of molecules with enough energy, not the extra collisions. The total number of molecules does not change, so the area under the curve stays the same.`,
    },
    {
        seedKey: "che-wch12-kinetics-equilibria-intro-003",
        unitCode: "WCH12",
        topicSlug: "kinetics-equilibria-intro",
        type: "SHORT",
        difficulty: "MEDIUM",
        marks: 3,
        status: "DRAFT",
        stem: r`Dinitrogen tetroxide (colourless) and nitrogen dioxide (brown) are in dynamic equilibrium in a sealed syringe:

$$\text{N}_2\text{O}_4(\text{g}) \rightleftharpoons 2\text{NO}_2(\text{g}) \qquad \Delta H = +58\,\text{kJ mol}^{-1}$$

(a) State and explain the effect on the equilibrium yield of $\text{NO}_2$ of increasing the pressure at constant temperature.

(b) State the effect on the equilibrium position of increasing the temperature, giving a reason.`,
        markScheme: r`- (a) The yield of $\text{NO}_2$ decreases / equilibrium shifts to the left (1)
- (a) Because the left-hand side has fewer moles of gas (1 mol compared with 2 mol) (1)
- (b) Shifts to the right, because the forward reaction is endothermic (1)`,
        explanation: r`On compression the mixture first looks darker (the same $\text{NO}_2$ in a smaller volume) before fading slightly as the equilibrium moves left — don't confuse the concentration effect with the shift.`,
    },

    // --- halogenoalkanes-alcohols-spectra ---
    {
        seedKey: "che-wch12-halogenoalkanes-alcohols-spectra-001",
        unitCode: "WCH12",
        topicSlug: "halogenoalkanes-alcohols-spectra",
        type: "MCQ",
        difficulty: "MEDIUM",
        marks: 1,
        status: "DRAFT",
        stem: r`The infrared spectrum of an organic compound has a very broad absorption from $2500$ to $3300\,\text{cm}^{-1}$ and a strong absorption at $1710\,\text{cm}^{-1}$. Which type of compound is it?`,
        options: opts("an alcohol", "an aldehyde", "a carboxylic acid", "an ester", "C"),
        markScheme: r`- **C** (1) — very broad O–H (hydrogen-bonded, acid) together with C=O.`,
        explanation: r`An alcohol O–H is broad but centred higher (about $3200$–$3550\,\text{cm}^{-1}$) and there is no C=O. Aldehydes and esters show C=O but no O–H.`,
    },
    {
        seedKey: "che-wch12-halogenoalkanes-alcohols-spectra-002",
        unitCode: "WCH12",
        topicSlug: "halogenoalkanes-alcohols-spectra",
        type: "SHORT",
        difficulty: "MEDIUM",
        marks: 4,
        status: "DRAFT",
        stem: r`Propan-1-ol can be oxidised to either propanal or propanoic acid.

(a) Name the oxidising agent and state the colour change seen.

(b) State the conditions needed to obtain mainly propanal, and those needed to obtain mainly propanoic acid.`,
        markScheme: r`- (a) Potassium dichromate(VI) acidified with dilute sulfuric acid (1)
- (a) Orange to green (1)
- (b) Propanal: heat gently and distil off the aldehyde as it forms (1)
- (b) Propanoic acid: heat under reflux with excess oxidising agent (1)`,
        explanation: r`The aldehyde has the lowest boiling temperature in the mixture (no hydrogen bonding between its molecules), so distilling removes it before it can be oxidised further.`,
    },
    {
        seedKey: "che-wch12-halogenoalkanes-alcohols-spectra-003",
        unitCode: "WCH12",
        topicSlug: "halogenoalkanes-alcohols-spectra",
        type: "SHORT",
        difficulty: "HARD",
        marks: 3,
        status: "DRAFT",
        stem: r`Equal amounts of 1-chlorobutane, 1-bromobutane and 1-iodobutane are added to separate tubes of aqueous silver nitrate in ethanol at $50\,^\circ\text{C}$.

State the order in which precipitates appear, the colour of each precipitate, and explain the order.`,
        markScheme: r`- Order: 1-iodobutane first, then 1-bromobutane, then 1-chlorobutane (1)
- Precipitates: yellow (AgI), cream (AgBr), white (AgCl) (1)
- The $\text{C{-}I}$ bond has the lowest bond enthalpy, so it is broken most easily during hydrolysis (1)`,
        explanation: r`Bond polarity predicts the opposite order (C–Cl is most polar). Bond enthalpy is the deciding factor for the rate of hydrolysis.`,
    },
];

// ---------------------------------------------------------------------------------------------------------------
// WCH13 — Practical Skills in Chemistry I
// ---------------------------------------------------------------------------------------------------------------
const wch13: SeedQuestion[] = [
    // --- practical-techniques ---
    {
        seedKey: "che-wch13-practical-techniques-001",
        unitCode: "WCH13",
        topicSlug: "practical-techniques",
        type: "MCQ",
        difficulty: "EASY",
        marks: 1,
        status: "DRAFT",
        stem: r`Before filling a burette with sodium hydroxide solution for a titration, a student rinses it with a little of the sodium hydroxide solution. Why?`,
        options: opts(
            "To remove any water that would dilute the solution.",
            "To calibrate the burette scale.",
            "To remove air bubbles from below the tap.",
            "To neutralise any acid left in the burette.",
            "A",
        ),
        markScheme: r`- **A** (1) — water droplets would lower the concentration, so the titre would be too large.`,
        explanation: r`Air bubbles are removed by running some solution through the tap after filling. The conical flask, by contrast, is rinsed only with distilled water — extra water there does not change the amount of reactant.`,
    },
    {
        seedKey: "che-wch13-practical-techniques-002",
        unitCode: "WCH13",
        topicSlug: "practical-techniques",
        type: "SHORT",
        difficulty: "MEDIUM",
        marks: 4,
        status: "DRAFT",
        stem: r`A technician needs to make $250.0\,\text{cm}^3$ of a standard solution of sodium carbonate from the anhydrous solid.

Describe how this should be done so that the concentration is known accurately.`,
        markScheme: r`- Weigh the solid in a weighing bottle and record the mass transferred by difference (reweigh the bottle after emptying) (1)
- Dissolve the solid in a small volume of distilled water in a beaker (1)
- Transfer the solution to a $250\,\text{cm}^3$ volumetric flask, including all washings from the beaker and glass rod (1)
- Make up to the mark with distilled water so the bottom of the meniscus is on the line at eye level, then stopper and invert several times to mix (1)`,
        explanation: r`Weighing by difference accounts for solid left in the weighing bottle. Dissolving in a beaker first (not in the flask) makes sure all the solid dissolves before making up to the mark.`,
    },
    {
        seedKey: "che-wch13-practical-techniques-003",
        unitCode: "WCH13",
        topicSlug: "practical-techniques",
        type: "SHORT",
        difficulty: "EASY",
        marks: 3,
        status: "DRAFT",
        stem: r`A student heats a mixture of butan-1-ol, sodium bromide and sulfuric acid under reflux.

(a) Why are anti-bumping granules added to the flask?

(b) Why must the top of the condenser **not** be stoppered?

(c) Why does the cooling water enter the condenser at the bottom?`,
        markScheme: r`- (a) To give smooth boiling / prevent large bubbles forming violently (1)
- (b) Pressure would build up in the apparatus, which could explode (1)
- (c) So that the condenser fills completely with water, giving more efficient cooling (1)`,
        explanation: r`Reflux lets you heat a volatile mixture for a long time: vapour condenses and drips back, so nothing is lost — but the system must stay open to the air.`,
    },

    // --- measurement-uncertainty ---
    {
        seedKey: "che-wch13-measurement-uncertainty-001",
        unitCode: "WCH13",
        topicSlug: "measurement-uncertainty",
        type: "MCQ",
        difficulty: "MEDIUM",
        marks: 1,
        status: "DRAFT",
        stem: r`Each burette reading has an uncertainty of $\pm 0.05\,\text{cm}^3$. A student's titre is $12.50\,\text{cm}^3$. What is the percentage uncertainty in the titre?`,
        options: opts(r`$0.40\%$`, r`$0.80\%$`, r`$0.08\%$`, r`$4.0\%$`, "B"),
        markScheme: r`- **B** (1) — two readings give $\pm 0.10\,\text{cm}^3$; $0.10 \div 12.50 \times 100 = 0.80\%$.`,
        explanation: r`A titre is the difference of two readings (initial and final), so the uncertainty is doubled. Answer A forgets this.`,
    },
    {
        seedKey: "che-wch13-measurement-uncertainty-002",
        unitCode: "WCH13",
        topicSlug: "measurement-uncertainty",
        type: "CALCULATION",
        difficulty: "MEDIUM",
        marks: 4,
        status: "DRAFT",
        stem: r`In an experiment to find the enthalpy change of solution of ammonium nitrate, a student finds by difference that $1.24\,\text{g}$ of solid was added to water. The balance reads to 2 decimal places ($\pm 0.005\,\text{g}$ per reading). The temperature fell by $6.0\,^\circ\text{C}$, measured with a thermometer with an uncertainty of $\pm 0.5\,^\circ\text{C}$ per reading.

(a) Calculate the percentage uncertainty in the mass and in the temperature change.

(b) Identify the larger source of uncertainty and suggest **one** improvement to reduce it.`,
        markScheme: r`- (a) Mass: $2 \times 0.005 = 0.01\,\text{g}$; $0.01 \div 1.24 \times 100 = 0.81\%$ (1)
- (a) Temperature change: $2 \times 0.5 = 1.0\,^\circ\text{C}$; $1.0 \div 6.0 \times 100 = 17\%$ (1)
- (b) The temperature change has the much larger percentage uncertainty (1)
- (b) Use a thermometer with a smaller uncertainty (e.g. $\pm 0.1\,^\circ\text{C}$), or use a larger mass of solid in the same volume of water to give a larger temperature change (1)`,
        explanation: r`Both the mass and the temperature change are differences between two readings, so double the uncertainty of one reading. Improvements should target the largest percentage uncertainty.`,
    },
    {
        seedKey: "che-wch13-measurement-uncertainty-003",
        unitCode: "WCH13",
        topicSlug: "measurement-uncertainty",
        type: "MCQ",
        difficulty: "EASY",
        marks: 1,
        status: "DRAFT",
        stem: r`A student reads a burette and the bottom of the meniscus sits exactly on the $24.3\,\text{cm}^3$ graduation. How should this reading be recorded?`,
        options: opts(
            r`$24\,\text{cm}^3$`,
            r`$24.3\,\text{cm}^3$`,
            r`$24.30\,\text{cm}^3$`,
            r`$24.300\,\text{cm}^3$`,
            "C",
        ),
        markScheme: r`- **C** (1) — burette readings are recorded to the nearest $0.05\,\text{cm}^3$, i.e. to 2 decimal places.`,
        explanation: r`Writing "24.3" throws away the precision of the burette, which can be read to $\pm 0.05\,\text{cm}^3$. Burette readings are always given to 2 decimal places, ending in 0 or 5.`,
    },

    // --- data-analysis-evaluation ---
    {
        seedKey: "che-wch13-data-analysis-evaluation-001",
        unitCode: "WCH13",
        topicSlug: "data-analysis-evaluation",
        type: "MCQ",
        difficulty: "MEDIUM",
        marks: 1,
        status: "DRAFT",
        stem: r`A student's titres, in $\text{cm}^3$, were: rough $25.40$, then $24.95$, $24.70$, $24.80$ and $24.75$. Concordant titres agree within $0.10\,\text{cm}^3$. What mean titre should be used?`,
        options: opts(
            r`$24.92\,\text{cm}^3$`,
            r`$24.80\,\text{cm}^3$`,
            r`$24.75\,\text{cm}^3$`,
            r`$24.78\,\text{cm}^3$`,
            "C",
        ),
        markScheme: r`- **C** (1) — mean of the concordant titres $24.70$, $24.80$ and $24.75$.`,
        explanation: r`A includes the rough titre; B includes every accurate titre, including $24.95$, which is not concordant; D averages only two of the three concordant values.`,
    },
    {
        seedKey: "che-wch13-data-analysis-evaluation-002",
        unitCode: "WCH13",
        topicSlug: "data-analysis-evaluation",
        type: "SHORT",
        difficulty: "MEDIUM",
        marks: 4,
        status: "DRAFT",
        stem: r`To find the enthalpy change of neutralisation, a student measures the temperature of $25.0\,\text{cm}^3$ of sodium hydroxide solution in a polystyrene cup every 30 seconds for 3 minutes. At 3 minutes, $25.0\,\text{cm}^3$ of hydrochloric acid (measured with a measuring cylinder) is added, and the temperature is recorded every 30 seconds for a further 5 minutes.

(a) Explain why the temperature change is found by extrapolating a graph rather than from the highest temperature recorded, and describe how the extrapolation is done.

(b) Suggest **two** improvements to the procedure.`,
        markScheme: r`- (a) Heat is lost to the surroundings while the mixture warms up, so the highest recorded temperature is lower than the true maximum (1)
- (a) Draw a line of best fit through the cooling points after mixing and extrapolate it back to the time of mixing (3 minutes); read the temperature change from the line before mixing to this point (1)
- (b) Use a lid on the polystyrene cup to reduce heat loss (1)
- (b) Measure the volumes with a pipette or burette rather than a measuring cylinder (1)`,
        explanation: r`Extrapolating corrects for heat loss that happened during the reaction. Insulation and more accurate volume measurement are the improvements examiners expect; "repeat the experiment" alone improves reliability, not accuracy.`,
    },
    {
        seedKey: "che-wch13-data-analysis-evaluation-003",
        unitCode: "WCH13",
        topicSlug: "data-analysis-evaluation",
        type: "CALCULATION",
        difficulty: "HARD",
        marks: 3,
        status: "DRAFT",
        stem: r`A student's experimental value for the enthalpy change of neutralisation is $-48.2\,\text{kJ mol}^{-1}$. The data-book value is $-57.1\,\text{kJ mol}^{-1}$. The student calculated that the total measurement uncertainty in the experiment was $4.5\%$.

Calculate the percentage difference between the experimental and data-book values, and use it to comment on the main source of error in the experiment.`,
        markScheme: r`- Percentage difference $= (57.1 - 48.2) \div 57.1 \times 100 = 15.6\%$ (1)
- This is larger than the $4.5\%$ measurement uncertainty, so measurement uncertainty cannot explain the difference (1)
- So there is a systematic error in the procedure, such as heat loss to the surroundings (1)`,
        explanation: r`Compare the percentage difference with the total percentage uncertainty: if the difference is larger, the method itself (not the apparatus) is the main problem.`,
    },
];

// ---------------------------------------------------------------------------------------------------------------
// WCH14 — Rates, Equilibria and Further Organic Chemistry
// ---------------------------------------------------------------------------------------------------------------
const wch14: SeedQuestion[] = [
    // --- kinetics ---
    {
        seedKey: "che-wch14-kinetics-001",
        unitCode: "WCH14",
        topicSlug: "kinetics",
        type: "MCQ",
        difficulty: "EASY",
        marks: 1,
        status: "DRAFT",
        stem: r`The rate equation for a reaction is $\text{rate} = k[\text{A}][\text{B}]^2$. What are the units of the rate constant, $k$?`,
        options: opts(
            r`$\text{mol dm}^{-3}\,\text{s}^{-1}$`,
            r`$\text{dm}^3\,\text{mol}^{-1}\,\text{s}^{-1}$`,
            r`$\text{dm}^6\,\text{mol}^{-2}\,\text{s}^{-1}$`,
            r`$\text{s}^{-1}$`,
            "C",
        ),
        markScheme: r`- **C** (1) — $k = \dfrac{\text{mol dm}^{-3}\,\text{s}^{-1}}{(\text{mol dm}^{-3})^3}$.`,
        explanation: r`The overall order is 3, so divide the rate units by concentration cubed. B is for a second-order reaction and D for first order.`,
    },
    {
        seedKey: "che-wch14-kinetics-002",
        unitCode: "WCH14",
        topicSlug: "kinetics",
        type: "CALCULATION",
        difficulty: "MEDIUM",
        marks: 4,
        status: "DRAFT",
        stem: r`The initial rate of the reaction between **P** and **Q** was measured at constant temperature.

| experiment | $[\text{P}]$ / $\text{mol dm}^{-3}$ | $[\text{Q}]$ / $\text{mol dm}^{-3}$ | initial rate / $\text{mol dm}^{-3}\,\text{s}^{-1}$ |
| --- | --- | --- | --- |
| 1 | 0.10 | 0.10 | $2.0 \times 10^{-4}$ |
| 2 | 0.20 | 0.10 | $4.0 \times 10^{-4}$ |
| 3 | 0.10 | 0.30 | $1.8 \times 10^{-3}$ |

Deduce the order with respect to each reactant, write the rate equation, and calculate the rate constant with its units.`,
        markScheme: r`- First order with respect to P: doubling [P] (expts 1 and 2) doubles the rate (1)
- Second order with respect to Q: tripling [Q] (expts 1 and 3) increases the rate nine times (1)
- $\text{rate} = k[\text{P}][\text{Q}]^2$ (1)
- $k = \dfrac{2.0 \times 10^{-4}}{0.10 \times 0.10^2} = 0.20\,\text{dm}^6\,\text{mol}^{-2}\,\text{s}^{-1}$ (1)`,
        explanation: r`Compare two experiments in which only one concentration changes. A factor of 3 in concentration giving a factor of 9 in rate means $3^n = 9$, so $n = 2$.`,
    },
    {
        seedKey: "che-wch14-kinetics-003",
        unitCode: "WCH14",
        topicSlug: "kinetics",
        type: "SHORT",
        difficulty: "HARD",
        marks: 3,
        status: "DRAFT",
        stem: r`The hydrolysis of 2-bromo-2-methylpropane by aqueous hydroxide ions has the rate equation:

$$\text{rate} = k[(\text{CH}_3)_3\text{CBr}]$$

Explain what this rate equation shows about the mechanism of the reaction.`,
        markScheme: r`- Only the halogenoalkane appears in the rate equation, so only it takes part in the rate-determining step (1)
- The rate-determining step is the heterolytic fission of the $\text{C{-}Br}$ bond to form a (tertiary) carbocation and $\text{Br}^-$ (1)
- $\text{OH}^-$ reacts with the carbocation in a later, fast step, so the mechanism is $\text{S}_\text{N}1$ (1)`,
        explanation: r`A species that is zero order is involved only after the rate-determining step. Tertiary halogenoalkanes favour $\text{S}_\text{N}1$ because the tertiary carbocation is stabilised by three alkyl groups.`,
    },
    {
        seedKey: "che-wch14-kinetics-004",
        unitCode: "WCH14",
        topicSlug: "kinetics",
        type: "CALCULATION",
        difficulty: "HARD",
        marks: 2,
        status: "DRAFT",
        stem: r`A student measured the rate constant $k$ of a reaction at several temperatures and plotted $\ln k$ against $1/T$. The line of best fit had a gradient of $-6250\,\text{K}$.

Calculate the activation energy of the reaction in $\text{kJ mol}^{-1}$.

[The Arrhenius equation is $\ln k = -\dfrac{E_a}{RT} + \ln A$; $R = 8.31\,\text{J K}^{-1}\,\text{mol}^{-1}$]`,
        markScheme: r`- Gradient $= -E_a/R$, so $E_a = 6250 \times 8.31 = 51\,900\,\text{J mol}^{-1}$ (1)
- $E_a = 51.9\,\text{kJ mol}^{-1}$ (1)`,
        explanation: r`The negative sign of the gradient cancels with the minus in $-E_a/R$; activation energies are always positive. Remember to convert J to kJ.`,
    },

    // --- entropy-energetics ---
    {
        seedKey: "che-wch14-entropy-energetics-001",
        unitCode: "WCH14",
        topicSlug: "entropy-energetics",
        type: "MCQ",
        difficulty: "EASY",
        marks: 1,
        status: "DRAFT",
        stem: r`Which compound has the **most exothermic** lattice energy?`,
        options: opts("NaCl", "KCl", "MgO", "CaO", "C"),
        markScheme: r`- **C** (1) — $\text{Mg}^{2+}$ and $\text{O}^{2-}$ are doubly charged and $\text{Mg}^{2+}$ is smaller than $\text{Ca}^{2+}$.`,
        explanation: r`Lattice energy becomes more exothermic as ionic charges increase and ionic radii decrease. Charge has the bigger effect, so the Group 2 oxides beat the Group 1 chlorides.`,
    },
    {
        seedKey: "che-wch14-entropy-energetics-002",
        unitCode: "WCH14",
        topicSlug: "entropy-energetics",
        type: "CALCULATION",
        difficulty: "HARD",
        marks: 4,
        status: "DRAFT",
        stem: r`Use the data below to calculate the lattice energy of calcium chloride, $\text{CaCl}_2$.

| process | $\Delta H$ / $\text{kJ mol}^{-1}$ |
| --- | --- |
| enthalpy change of formation of $\text{CaCl}_2(\text{s})$ | $-796$ |
| enthalpy change of atomisation of calcium | $+178$ |
| first ionisation energy of calcium | $+590$ |
| second ionisation energy of calcium | $+1145$ |
| enthalpy change of atomisation of chlorine ($\tfrac{1}{2}\text{Cl}_2 \rightarrow \text{Cl}$) | $+122$ |
| electron affinity of chlorine | $-349$ |`,
        markScheme: r`- Uses $2 \times (+122) = +244$ and $2 \times (-349) = -698$ for chlorine (1)
- Includes both the first and second ionisation energies of calcium (1)
- $\Delta_\text{latt}H = -796 - (178 + 590 + 1145 + 244 - 698)$ (1)
- $\Delta_\text{latt}H = -2255\,\text{kJ mol}^{-1}$ (1)`,
        explanation: r`The cycle needs two chloride ions, so both the atomisation and electron affinity of chlorine are doubled. The most common error is forgetting one of these doublings.`,
    },
    {
        seedKey: "che-wch14-entropy-energetics-003",
        unitCode: "WCH14",
        topicSlug: "entropy-energetics",
        type: "CALCULATION",
        difficulty: "MEDIUM",
        marks: 4,
        status: "DRAFT",
        stem: r`For the thermal decomposition of calcium carbonate,

$$\text{CaCO}_3(\text{s}) \rightarrow \text{CaO}(\text{s}) + \text{CO}_2(\text{g})$$

$\Delta H = +178\,\text{kJ mol}^{-1}$ and $\Delta S_\text{system} = +161\,\text{J K}^{-1}\,\text{mol}^{-1}$.

Calculate the minimum temperature, in K, at which this reaction becomes thermodynamically feasible.`,
        markScheme: r`- The reaction is feasible when $\Delta S_\text{total} = \Delta S_\text{system} - \dfrac{\Delta H}{T} \geq 0$ (or $\Delta G \leq 0$) (1)
- Converts $\Delta H$ to $+178\,000\,\text{J mol}^{-1}$ (1)
- $T = \dfrac{178\,000}{161}$ (1)
- $T = 1110\,\text{K}$ (accept $1106\,\text{K}$) (1)`,
        explanation: r`Mixing kJ and J is the classic error — it gives $1.1\,\text{K}$! At the minimum temperature $\Delta S_\text{surroundings}$ exactly cancels $\Delta S_\text{system}$.`,
    },

    // --- chemical-equilibria ---
    {
        seedKey: "che-wch14-chemical-equilibria-001",
        unitCode: "WCH14",
        topicSlug: "chemical-equilibria",
        type: "MCQ",
        difficulty: "MEDIUM",
        marks: 1,
        status: "DRAFT",
        stem: r`For a reaction whose forward reaction is **exothermic**, which change increases the value of the equilibrium constant $K_c$?`,
        options: opts(
            "increasing the pressure",
            "decreasing the temperature",
            "adding a catalyst",
            "increasing the concentration of a reactant",
            "B",
        ),
        markScheme: r`- **B** (1) — only temperature changes $K_c$; lowering it favours the exothermic direction.`,
        explanation: r`Pressure and concentration changes shift the equilibrium position, but the new equilibrium mixture has the **same** $K_c$. A catalyst changes neither.`,
    },
    {
        seedKey: "che-wch14-chemical-equilibria-002",
        unitCode: "WCH14",
        topicSlug: "chemical-equilibria",
        type: "CALCULATION",
        difficulty: "HARD",
        marks: 5,
        status: "DRAFT",
        stem: r`A mixture of $0.500\,\text{mol}$ ethanoic acid and $0.800\,\text{mol}$ ethanol was left with a few drops of acid catalyst until equilibrium was reached. The equilibrium mixture contained $0.380\,\text{mol}$ of ethyl ethanoate.

$$\text{CH}_3\text{COOH} + \text{C}_2\text{H}_5\text{OH} \rightleftharpoons \text{CH}_3\text{COOC}_2\text{H}_5 + \text{H}_2\text{O}$$

Calculate $K_c$ for this reaction. Ignore any water added with the catalyst.`,
        markScheme: r`- Equilibrium amounts: ethanoic acid $0.120\,\text{mol}$ and ethanol $0.420\,\text{mol}$ (1)
- Equilibrium amount of water $= 0.380\,\text{mol}$ (1)
- $K_c = \dfrac{[\text{CH}_3\text{COOC}_2\text{H}_5][\text{H}_2\text{O}]}{[\text{CH}_3\text{COOH}][\text{C}_2\text{H}_5\text{OH}]}$ (1)
- The volume cancels because there are equal numbers of moles on each side, so amounts can be used directly (1)
- $K_c = \dfrac{0.380 \times 0.380}{0.120 \times 0.420} = 2.87$ (no units) (1)`,
        explanation: r`Subtract the amount reacted ($0.380\,\text{mol}$) from **both** reactants. $K_c$ has no units here because the concentration terms cancel.`,
    },
    {
        seedKey: "che-wch14-chemical-equilibria-003",
        unitCode: "WCH14",
        topicSlug: "chemical-equilibria",
        type: "CALCULATION",
        difficulty: "MEDIUM",
        marks: 4,
        status: "DRAFT",
        stem: r`At a certain temperature, an equilibrium mixture of $\text{N}_2\text{O}_4$ and $\text{NO}_2$ has a total pressure of $2.00\,\text{atm}$. The mole fraction of $\text{NO}_2$ is $0.400$.

$$\text{N}_2\text{O}_4(\text{g}) \rightleftharpoons 2\text{NO}_2(\text{g})$$

Calculate $K_p$, giving its units.`,
        markScheme: r`- Partial pressure = mole fraction $\times$ total pressure (1)
- $p(\text{NO}_2) = 0.800\,\text{atm}$ and $p(\text{N}_2\text{O}_4) = 0.600 \times 2.00 = 1.20\,\text{atm}$ (1)
- $K_p = \dfrac{p(\text{NO}_2)^2}{p(\text{N}_2\text{O}_4)}$ (1)
- $K_p = \dfrac{0.800^2}{1.20} = 0.533\,\text{atm}$ (1)`,
        explanation: r`The mole fractions add up to 1, so the mole fraction of $\text{N}_2\text{O}_4$ is $0.600$. Don't forget to square the $\text{NO}_2$ partial pressure.`,
    },

    // --- acid-base-equilibria ---
    {
        seedKey: "che-wch14-acid-base-equilibria-001",
        unitCode: "WCH14",
        topicSlug: "acid-base-equilibria",
        type: "MCQ",
        difficulty: "MEDIUM",
        marks: 1,
        status: "DRAFT",
        stem: r`What is the pH of $0.020\,\text{mol dm}^{-3}$ barium hydroxide solution, $\text{Ba(OH)}_2$, at $298\,\text{K}$? [$K_w = 1.00 \times 10^{-14}\,\text{mol}^2\,\text{dm}^{-6}$]`,
        options: opts("1.40", "12.30", "12.60", "13.30", "C"),
        markScheme: r`- **C** (1) — $[\text{OH}^-] = 0.040\,\text{mol dm}^{-3}$, $[\text{H}^+] = 2.5 \times 10^{-13}$, pH $= 12.60$.`,
        explanation: r`Each formula unit releases **two** hydroxide ions. B forgets this, and A is $-\log[\text{OH}^-]$ (the pOH), not the pH.`,
    },
    {
        seedKey: "che-wch14-acid-base-equilibria-002",
        unitCode: "WCH14",
        topicSlug: "acid-base-equilibria",
        type: "CALCULATION",
        difficulty: "MEDIUM",
        marks: 4,
        status: "DRAFT",
        stem: r`Calculate the pH of $0.150\,\text{mol dm}^{-3}$ propanoic acid. State **one** assumption you make.

[$K_a$ of propanoic acid $= 1.35 \times 10^{-5}\,\text{mol dm}^{-3}$]`,
        markScheme: r`- $K_a = \dfrac{[\text{H}^+]^2}{[\text{CH}_3\text{CH}_2\text{COOH}]}$ (1)
- Assumption: $[\text{H}^+] = [\text{CH}_3\text{CH}_2\text{COO}^-]$ (ionisation of water negligible), or the equilibrium concentration of acid equals the initial concentration (ionisation is very small) (1)
- $[\text{H}^+] = \sqrt{1.35 \times 10^{-5} \times 0.150} = 1.42 \times 10^{-3}\,\text{mol dm}^{-3}$ (1)
- pH $= 2.85$ (1)`,
        explanation: r`For a weak acid you cannot take $[\text{H}^+]$ as equal to the acid concentration. Square-rooting $K_a \times [\text{HA}]$ is the step most often forgotten.`,
    },
    {
        seedKey: "che-wch14-acid-base-equilibria-003",
        unitCode: "WCH14",
        topicSlug: "acid-base-equilibria",
        type: "CALCULATION",
        difficulty: "HARD",
        marks: 5,
        status: "DRAFT",
        stem: r`$20.0\,\text{cm}^3$ of $0.200\,\text{mol dm}^{-3}$ sodium hydroxide is added to $50.0\,\text{cm}^3$ of $0.200\,\text{mol dm}^{-3}$ ethanoic acid to make a buffer solution.

Calculate the pH of the buffer. [$K_a$ of ethanoic acid $= 1.74 \times 10^{-5}\,\text{mol dm}^{-3}$]`,
        markScheme: r`- $n(\text{CH}_3\text{COOH})$ initially $= 0.0100\,\text{mol}$ and $n(\text{OH}^-) = 4.00 \times 10^{-3}\,\text{mol}$ (1)
- After reaction: $n(\text{CH}_3\text{COOH}) = 6.00 \times 10^{-3}\,\text{mol}$ and $n(\text{CH}_3\text{COO}^-) = 4.00 \times 10^{-3}\,\text{mol}$ (1)
- $[\text{H}^+] = K_a \times \dfrac{[\text{CH}_3\text{COOH}]}{[\text{CH}_3\text{COO}^-]}$ (1)
- $[\text{H}^+] = 1.74 \times 10^{-5} \times \dfrac{6.00}{4.00} = 2.61 \times 10^{-5}\,\text{mol dm}^{-3}$ (1)
- pH $= 4.58$ (1)`,
        explanation: r`The hydroxide ions convert some acid into its salt. Both species are in the same total volume, so the ratio of amounts equals the ratio of concentrations — no need to divide by $0.0700\,\text{dm}^3$.`,
    },

    // --- carbonyls-carboxylic-acids-chirality ---
    {
        seedKey: "che-wch14-carbonyls-carboxylic-acids-chirality-001",
        unitCode: "WCH14",
        topicSlug: "carbonyls-carboxylic-acids-chirality",
        type: "MCQ",
        difficulty: "EASY",
        marks: 1,
        status: "DRAFT",
        stem: r`Which reagent gives a positive result with propanal but **not** with propanone?`,
        options: opts(
            "2,4-dinitrophenylhydrazine",
            "Tollens' reagent",
            "sodium carbonate solution",
            "phosphorus(V) chloride",
            "B",
        ),
        markScheme: r`- **B** (1) — aldehydes are oxidised by Tollens' reagent, giving a silver mirror; ketones are not.`,
        explanation: r`2,4-DNPH gives an orange precipitate with **both** aldehydes and ketones, so it only confirms a carbonyl group. Sodium carbonate tests for acids and $\text{PCl}_5$ for O–H groups.`,
    },
    {
        seedKey: "che-wch14-carbonyls-carboxylic-acids-chirality-002",
        unitCode: "WCH14",
        topicSlug: "carbonyls-carboxylic-acids-chirality",
        type: "SHORT",
        difficulty: "HARD",
        marks: 4,
        status: "DRAFT",
        stem: r`Propanal reacts with hydrogen cyanide (in the presence of cyanide ions) to form 2-hydroxybutanenitrile, $\text{CH}_3\text{CH}_2\text{CH(OH)CN}$.

Explain why the product has a chiral centre but the product mixture does **not** rotate the plane of plane-polarised light.`,
        markScheme: r`- The carbon bonded to OH has four different groups attached ($\text{H}$, $\text{OH}$, $\text{CN}$, $\text{C}_2\text{H}_5$), so it is a chiral centre (1)
- The $\text{C{=}O}$ group in propanal is planar (trigonal planar) (1)
- The $\text{CN}^-$ nucleophile is equally likely to attack from either side of the plane (1)
- So equal amounts of the two enantiomers form (a racemic mixture), and their opposite rotations cancel (1)`,
        explanation: r`Chirality is a property of each molecule; optical activity is a property of the mixture. A racemic mixture contains chiral molecules but has no overall effect on polarised light.`,
    },
    {
        seedKey: "che-wch14-carbonyls-carboxylic-acids-chirality-003",
        unitCode: "WCH14",
        topicSlug: "carbonyls-carboxylic-acids-chirality",
        type: "SHORT",
        difficulty: "MEDIUM",
        marks: 3,
        status: "DRAFT",
        stem: r`Ethanoyl chloride, $\text{CH}_3\text{COCl}$, reacts readily at room temperature.

(a) Write an equation for its reaction with water.

(b) Write an equation for its reaction with ethanol.

(c) Give **one** advantage of using ethanoyl chloride rather than ethanoic acid to make ethyl ethanoate.`,
        markScheme: r`- (a) $\text{CH}_3\text{COCl} + \text{H}_2\text{O} \rightarrow \text{CH}_3\text{COOH} + \text{HCl}$ (1)
- (b) $\text{CH}_3\text{COCl} + \text{C}_2\text{H}_5\text{OH} \rightarrow \text{CH}_3\text{COOC}_2\text{H}_5 + \text{HCl}$ (1)
- (c) The reaction is not reversible so gives a higher yield / is fast at room temperature without a catalyst (1)`,
        explanation: r`Acyl chlorides react vigorously, producing steamy fumes of HCl. Esterification of a carboxylic acid is an equilibrium that needs an acid catalyst and heating.`,
    },
];

// ---------------------------------------------------------------------------------------------------------------
// WCH15 — Transition Metals and Organic Nitrogen Chemistry
// ---------------------------------------------------------------------------------------------------------------
const wch15: SeedQuestion[] = [
    // --- redox-equilibria ---
    {
        seedKey: "che-wch15-redox-equilibria-001",
        unitCode: "WCH15",
        topicSlug: "redox-equilibria",
        type: "MCQ",
        difficulty: "EASY",
        marks: 1,
        status: "DRAFT",
        stem: r`Use the standard electrode potentials to find the standard emf of a cell made from these two half-cells.

$$\text{Zn}^{2+}(\text{aq}) + 2\text{e}^- \rightleftharpoons \text{Zn}(\text{s}) \qquad E^\ominus = -0.76\,\text{V}$$
$$\text{Ag}^+(\text{aq}) + \text{e}^- \rightleftharpoons \text{Ag}(\text{s}) \qquad E^\ominus = +0.80\,\text{V}$$`,
        options: opts(r`$+0.04\,\text{V}$`, r`$+1.56\,\text{V}$`, r`$+2.36\,\text{V}$`, r`$-1.56\,\text{V}$`, "B"),
        markScheme: r`- **B** (1) — $E^\ominus_\text{cell} = E^\ominus_\text{right} - E^\ominus_\text{left} = 0.80 - (-0.76) = +1.56\,\text{V}$.`,
        explanation: r`Electrode potentials are **not** multiplied when a half-equation is doubled to balance electrons (answer C does this). A cell emf for a working cell is quoted as positive.`,
    },
    {
        seedKey: "che-wch15-redox-equilibria-002",
        unitCode: "WCH15",
        topicSlug: "redox-equilibria",
        type: "CALCULATION",
        difficulty: "HARD",
        marks: 5,
        status: "DRAFT",
        stem: r`A $0.250\,\text{g}$ sample of crushed iron tablets was dissolved in dilute sulfuric acid, so that all the iron was present as $\text{Fe}^{2+}$. The solution was titrated with $0.0100\,\text{mol dm}^{-3}$ potassium manganate(VII); $18.40\,\text{cm}^3$ was needed.

$$\text{MnO}_4^{\;-} + 8\text{H}^+ + 5\text{Fe}^{2+} \rightarrow \text{Mn}^{2+} + 5\text{Fe}^{3+} + 4\text{H}_2\text{O}$$

Calculate the percentage by mass of iron in the tablets. [$A_r$ Fe $= 55.8$]`,
        markScheme: r`- $n(\text{MnO}_4^{\;-}) = 0.01840 \times 0.0100 = 1.84 \times 10^{-4}\,\text{mol}$ (1)
- $n(\text{Fe}^{2+}) = 5 \times 1.84 \times 10^{-4} = 9.20 \times 10^{-4}\,\text{mol}$ (1)
- Mass of iron $= 9.20 \times 10^{-4} \times 55.8 = 0.0513\,\text{g}$ (1)
- Percentage $= 0.0513 \div 0.250 \times 100$ (1)
- $= 20.5\%$ (1)`,
        explanation: r`Use the 1 : 5 ratio from the equation. No indicator is needed — the end point is the first permanent pale pink colour from excess manganate(VII).`,
    },
    {
        seedKey: "che-wch15-redox-equilibria-003",
        unitCode: "WCH15",
        topicSlug: "redox-equilibria",
        type: "SHORT",
        difficulty: "MEDIUM",
        marks: 3,
        status: "DRAFT",
        stem: r`A hydrogen–oxygen fuel cell uses an alkaline electrolyte.

Write the half-equation for the reaction at each electrode and the overall equation for the cell.`,
        markScheme: r`- Negative electrode: $\text{H}_2 + 2\text{OH}^- \rightarrow 2\text{H}_2\text{O} + 2\text{e}^-$ (1)
- Positive electrode: $\text{O}_2 + 2\text{H}_2\text{O} + 4\text{e}^- \rightarrow 4\text{OH}^-$ (1)
- Overall: $2\text{H}_2 + \text{O}_2 \rightarrow 2\text{H}_2\text{O}$ (1)`,
        explanation: r`Double the hydrogen half-equation so the electrons cancel before adding; the hydroxide ions also cancel, leaving just water.`,
    },

    // --- transition-metals ---
    {
        seedKey: "che-wch15-transition-metals-001",
        unitCode: "WCH15",
        topicSlug: "transition-metals",
        type: "MCQ",
        difficulty: "EASY",
        marks: 1,
        status: "DRAFT",
        stem: r`What is the electronic configuration of the $\text{Fe}^{3+}$ ion?`,
        options: opts(
            r`$[\text{Ar}]\,3\text{d}^6\,4\text{s}^2$`,
            r`$[\text{Ar}]\,3\text{d}^3\,4\text{s}^2$`,
            r`$[\text{Ar}]\,3\text{d}^5$`,
            r`$[\text{Ar}]\,3\text{d}^6$`,
            "C",
        ),
        markScheme: r`- **C** (1) — iron is $[\text{Ar}]\,3\text{d}^6\,4\text{s}^2$; the two 4s electrons are lost first, then one 3d electron.`,
        explanation: r`Although 4s fills before 3d, it is also emptied first when the ion forms. A is the atom, D is $\text{Fe}^{2+}$, and B removes 3d electrons first.`,
    },
    {
        seedKey: "che-wch15-transition-metals-002",
        unitCode: "WCH15",
        topicSlug: "transition-metals",
        type: "SHORT",
        difficulty: "MEDIUM",
        marks: 4,
        status: "DRAFT",
        stem: r`Explain why aqueous solutions of transition metal complex ions such as $[\text{Cu}(\text{H}_2\text{O})_6]^{2+}$ are coloured.`,
        markScheme: r`- The ligands cause the 3d orbitals to split into two groups at different energies (1)
- An electron absorbs energy from visible light and is promoted to a higher-energy d orbital (1)
- The frequency absorbed is given by $\Delta E = hf$ (1)
- The remaining frequencies are transmitted (or reflected), and these give the colour seen (1)`,
        explanation: r`Colour comes from what is **not** absorbed. Ions with empty ($\text{Sc}^{3+}$) or full ($\text{Zn}^{2+}$) d sub-shells cannot have d–d transitions and are colourless.`,
    },
    {
        seedKey: "che-wch15-transition-metals-003",
        unitCode: "WCH15",
        topicSlug: "transition-metals",
        type: "SHORT",
        difficulty: "HARD",
        marks: 4,
        status: "DRAFT",
        stem: r`Concentrated hydrochloric acid is added to aqueous copper(II) sulfate until no further change occurs.

Give the formula of the copper-containing product and state the colour change. Describe and explain the change in shape of the complex ion.`,
        markScheme: r`- $[\text{CuCl}_4]^{2-}$ (1)
- Blue to yellow (accept yellow-green, as an intermediate green may be seen) (1)
- Shape changes from octahedral to tetrahedral (1)
- Chloride ions are larger than water molecules, so only four fit around the $\text{Cu}^{2+}$ ion (1)`,
        explanation: r`This ligand exchange also changes the coordination number (6 to 4) and the overall charge (2+ to 2−). With ammonia, by contrast, the ligands are similar in size and the complex stays octahedral.`,
    },

    // --- arenes ---
    {
        seedKey: "che-wch15-arenes-001",
        unitCode: "WCH15",
        topicSlug: "arenes",
        type: "MCQ",
        difficulty: "EASY",
        marks: 1,
        status: "DRAFT",
        stem: r`Benzene is nitrated using a mixture of concentrated nitric acid and concentrated sulfuric acid. What is the electrophile?`,
        options: opts(
            r`$\text{NO}_2^{\;-}$`,
            r`$\text{NO}_3^{\;-}$`,
            r`$\text{NO}_2^{\;+}$`,
            r`$\text{HNO}_3$`,
            "C",
        ),
        markScheme: r`- **C** (1) — the nitronium ion forms from $\text{HNO}_3 + 2\text{H}_2\text{SO}_4 \rightarrow \text{NO}_2^{\;+} + \text{H}_3\text{O}^+ + 2\text{HSO}_4^{\;-}$.`,
        explanation: r`An electrophile accepts a pair of electrons, so it must be electron-deficient — negative ions cannot be the electrophile here.`,
    },
    {
        seedKey: "che-wch15-arenes-002",
        unitCode: "WCH15",
        topicSlug: "arenes",
        type: "SHORT",
        difficulty: "MEDIUM",
        marks: 4,
        status: "DRAFT",
        stem: r`The enthalpy change of hydrogenation of cyclohexene is $-120\,\text{kJ mol}^{-1}$. The enthalpy change of hydrogenation of benzene to cyclohexane is $-208\,\text{kJ mol}^{-1}$.

Use these data to show that benzene does not have the Kekulé structure with three separate C=C bonds, and explain its greater stability.`,
        markScheme: r`- Expected value for the Kekulé structure $= 3 \times (-120) = -360\,\text{kJ mol}^{-1}$ (1)
- The actual value is $152\,\text{kJ mol}^{-1}$ less exothermic than expected (1)
- So benzene is more stable (lower in energy) than the Kekulé structure (1)
- Because the p electrons are delocalised in a ring of $\pi$ bonding above and below the plane of the carbon atoms (1)`,
        explanation: r`The $152\,\text{kJ mol}^{-1}$ is often called the delocalisation (or stabilisation) energy. Other evidence: all C–C bond lengths in benzene are equal, and benzene resists addition reactions.`,
    },
    {
        seedKey: "che-wch15-arenes-003",
        unitCode: "WCH15",
        topicSlug: "arenes",
        type: "SHORT",
        difficulty: "HARD",
        marks: 3,
        status: "DRAFT",
        stem: r`Phenol decolourises bromine water at room temperature, forming a white precipitate, whereas benzene needs a halogen carrier to react with bromine.

Explain this difference and name the white precipitate.`,
        markScheme: r`- A lone pair of electrons on the oxygen atom of OH overlaps with (is delocalised into) the ring (1)
- This increases the electron density of the ring, so it polarises bromine molecules and attracts electrophiles more strongly (1)
- The precipitate is 2,4,6-tribromophenol (1)`,
        explanation: r`Benzene's ring is not electron-rich enough to polarise $\text{Br}_2$, so a halogen carrier such as $\text{FeBr}_3$ is needed to generate a stronger electrophile ($\text{Br}^+$).`,
    },

    // --- organic-nitrogen-compounds ---
    {
        seedKey: "che-wch15-organic-nitrogen-compounds-001",
        unitCode: "WCH15",
        topicSlug: "organic-nitrogen-compounds",
        type: "MCQ",
        difficulty: "MEDIUM",
        marks: 1,
        status: "DRAFT",
        stem: r`Which list shows the three bases in order of **increasing** base strength?`,
        options: opts(
            "ethylamine, ammonia, phenylamine",
            "phenylamine, ammonia, ethylamine",
            "ammonia, phenylamine, ethylamine",
            "phenylamine, ethylamine, ammonia",
            "B",
        ),
        markScheme: r`- **B** (1) — the N lone pair is least available in phenylamine and most available in ethylamine.`,
        explanation: r`In phenylamine the nitrogen lone pair is delocalised into the benzene ring, so it accepts protons less readily. In ethylamine the electron-releasing ethyl group increases the electron density on nitrogen.`,
    },
    {
        seedKey: "che-wch15-organic-nitrogen-compounds-002",
        unitCode: "WCH15",
        topicSlug: "organic-nitrogen-compounds",
        type: "SHORT",
        difficulty: "MEDIUM",
        marks: 4,
        status: "DRAFT",
        stem: r`Glycine, $\text{H}_2\text{NCH}_2\text{COOH}$, is the simplest amino acid. It melts (with decomposition) at about $233\,^\circ\text{C}$.

(a) Give the structure of the zwitterion of glycine and use it to explain the high melting temperature.

(b) Give the structure of the main glycine species in a solution of pH 1 and in a solution of pH 13.`,
        markScheme: r`- (a) Zwitterion $^+\text{H}_3\text{NCH}_2\text{COO}^-$ (1)
- (a) Strong ionic attractions between zwitterions in the solid need a lot of energy to overcome (1)
- (b) pH 1: $^+\text{H}_3\text{NCH}_2\text{COOH}$ (1)
- (b) pH 13: $\text{H}_2\text{NCH}_2\text{COO}^-$ (1)`,
        explanation: r`In strong acid the carboxylate group is protonated; in strong alkali the ammonium group loses a proton. Treating solid glycine as simple molecules with hydrogen bonds underestimates its melting point.`,
    },
    {
        seedKey: "che-wch15-organic-nitrogen-compounds-003",
        unitCode: "WCH15",
        topicSlug: "organic-nitrogen-compounds",
        type: "SHORT",
        difficulty: "HARD",
        marks: 3,
        status: "DRAFT",
        stem: r`A polyamide is made from hexanedioyl dichloride, $\text{ClOC}(\text{CH}_2)_4\text{COCl}$, and 1,6-diaminohexane, $\text{H}_2\text{N}(\text{CH}_2)_6\text{NH}_2$.

(a) Give the repeat unit of the polymer.

(b) Name the type of polymerisation and identify the small molecule eliminated.`,
        markScheme: r`- (a) $-\text{CO}(\text{CH}_2)_4\text{CONH}(\text{CH}_2)_6\text{NH}-$ with the amide links shown (1)
- (b) Condensation polymerisation (1)
- (b) Hydrogen chloride, HCl (1)`,
        explanation: r`With a dicarboxylic acid the small molecule would be water; with a diacyl dichloride it is HCl. The amide link $-\text{CONH}-$ is the same either way.`,
    },

    // --- organic-synthesis ---
    {
        seedKey: "che-wch15-organic-synthesis-001",
        unitCode: "WCH15",
        topicSlug: "organic-synthesis",
        type: "MCQ",
        difficulty: "MEDIUM",
        marks: 1,
        status: "DRAFT",
        stem: r`The Grignard reagent $\text{CH}_3\text{CH}_2\text{MgBr}$ is reacted with solid carbon dioxide in dry ether, and the product is then treated with dilute acid. What is the organic product?`,
        options: opts("ethanoic acid", "propanoic acid", "propan-1-ol", "propanal", "B"),
        markScheme: r`- **B** (1) — the ethyl group adds to the carbon of $\text{CO}_2$, giving $\text{CH}_3\text{CH}_2\text{COOH}$ after acidification.`,
        explanation: r`Reacting a Grignard reagent with $\text{CO}_2$ adds one carbon to the chain and makes a carboxylic acid. A forgets the extra carbon.`,
    },
    {
        seedKey: "che-wch15-organic-synthesis-002",
        unitCode: "WCH15",
        topicSlug: "organic-synthesis",
        type: "SHORT",
        difficulty: "HARD",
        marks: 4,
        status: "DRAFT",
        stem: r`Outline a two-step synthesis of butanoic acid, $\text{CH}_3\text{CH}_2\text{CH}_2\text{COOH}$, from 1-bromopropane. Give the reagents and conditions for each step and name the intermediate.`,
        markScheme: r`- Step 1 reagent: potassium cyanide (or sodium cyanide) in ethanol (1)
- Step 1 conditions: heat under reflux (1)
- Intermediate: butanenitrile, $\text{CH}_3\text{CH}_2\text{CH}_2\text{CN}$ (1)
- Step 2: heat under reflux with dilute hydrochloric (or sulfuric) acid to hydrolyse the nitrile (1)`,
        explanation: r`Nucleophilic substitution by cyanide is the standard way to add one carbon atom to a chain. Count carbons: 3 in 1-bromopropane + 1 from CN = 4 in butanoic acid.`,
    },
    {
        seedKey: "che-wch15-organic-synthesis-003",
        unitCode: "WCH15",
        topicSlug: "organic-synthesis",
        type: "SHORT",
        difficulty: "MEDIUM",
        marks: 4,
        status: "DRAFT",
        stem: r`Compound **Y**, $\text{C}_3\text{H}_6\text{O}$, has a strong infrared absorption at $1715\,\text{cm}^{-1}$ and no absorption between $3200$ and $3600\,\text{cm}^{-1}$. Its proton NMR spectrum shows a **single** peak.

Use this evidence to identify **Y**, explaining each deduction.`,
        markScheme: r`- The absorption at $1715\,\text{cm}^{-1}$ shows a $\text{C{=}O}$ group (1)
- No absorption at $3200$–$3600\,\text{cm}^{-1}$ means there is no $\text{O{-}H}$ group (1)
- A single NMR peak means all six hydrogen atoms are in the same environment (1)
- Y is propanone, $\text{CH}_3\text{COCH}_3$ (1)`,
        explanation: r`Propanal ($\text{CH}_3\text{CH}_2\text{CHO}$) has the same formula and a C=O, but it has three hydrogen environments, including the aldehyde proton at about $\delta = 9.5$–$10\,\text{ppm}$.`,
    },
];

// ---------------------------------------------------------------------------------------------------------------
// WCH16 — Practical Skills in Chemistry II
// ---------------------------------------------------------------------------------------------------------------
const wch16: SeedQuestion[] = [
    // --- planning-experiments ---
    {
        seedKey: "che-wch16-planning-experiments-001",
        unitCode: "WCH16",
        topicSlug: "planning-experiments",
        type: "MCQ",
        difficulty: "MEDIUM",
        marks: 1,
        status: "DRAFT",
        stem: r`A student plans to react $0.090\,\text{g}$ of magnesium ribbon with excess dilute hydrochloric acid at room temperature and pressure and collect all the hydrogen formed. Which is the most suitable apparatus to collect the gas?

[$A_r$ Mg $= 24.3$; molar volume of a gas at RTP $= 24.0\,\text{dm}^3\,\text{mol}^{-1}$]`,
        options: opts(
            r`a $50\,\text{cm}^3$ gas syringe`,
            r`a $100\,\text{cm}^3$ gas syringe`,
            r`a $250\,\text{cm}^3$ measuring cylinder over water`,
            r`a $1\,\text{dm}^3$ measuring cylinder over water`,
            "B",
        ),
        markScheme: r`- **B** (1) — $n(\text{H}_2) = 0.090 \div 24.3 = 3.7 \times 10^{-3}\,\text{mol}$, about $89\,\text{cm}^3$, which fits a $100\,\text{cm}^3$ syringe.`,
        explanation: r`Always estimate the expected quantity when choosing apparatus. A would overflow; C and D would work but measure a small volume with a larger percentage uncertainty.`,
    },
    {
        seedKey: "che-wch16-planning-experiments-002",
        unitCode: "WCH16",
        topicSlug: "planning-experiments",
        type: "SHORT",
        difficulty: "HARD",
        marks: 4,
        status: "DRAFT",
        stem: r`A brand of vinegar contains ethanoic acid at a concentration of about $1.0\,\text{mol dm}^{-3}$. A student plans to find its exact concentration by titrating $25.0\,\text{cm}^3$ portions against $0.100\,\text{mol dm}^{-3}$ sodium hydroxide, aiming for a titre of about $25\,\text{cm}^3$.

(a) Show that the vinegar must be diluted, and by what factor.

(b) Describe how to carry out the dilution accurately.

(c) Choose a suitable indicator, giving a reason.`,
        markScheme: r`- (a) A $25\,\text{cm}^3$ titre contains $2.50 \times 10^{-3}\,\text{mol}$ NaOH, so the diluted acid must be about $0.100\,\text{mol dm}^{-3}$ — a dilution factor of 10 (1)
- (b) Pipette $25.0\,\text{cm}^3$ of vinegar into a $250.0\,\text{cm}^3$ volumetric flask (1)
- (b) Make up to the mark with distilled water and invert to mix (1)
- (c) Phenolphthalein, because the end point of a weak acid–strong base titration is above pH 7 (in the range 8–10) (1)`,
        explanation: r`Undiluted vinegar would need about $250\,\text{cm}^3$ of alkali — more than five burettes. Methyl orange changes colour at too low a pH for a weak acid titration.`,
    },
    {
        seedKey: "che-wch16-planning-experiments-003",
        unitCode: "WCH16",
        topicSlug: "planning-experiments",
        type: "SHORT",
        difficulty: "MEDIUM",
        marks: 3,
        status: "DRAFT",
        stem: r`A student plans to oxidise ethanol by heating it with potassium dichromate(VI) and concentrated sulfuric acid.

Identify **three** hazards in this procedure and give a precaution to control each one.`,
        markScheme: r`- Ethanol is flammable — heat with a water bath or electric heating mantle, with no naked flames (1)
- Potassium dichromate(VI) is toxic / carcinogenic — wear gloves (and avoid skin contact) (1)
- Concentrated sulfuric acid is corrosive — wear eye protection and gloves; add it slowly with cooling (1)`,
        explanation: r`Each marking point needs a specific hazard **and** a matching precaution. "Wear goggles" on its own, without naming the hazard it controls, does not score.`,
    },

    // --- quantitative-analysis ---
    {
        seedKey: "che-wch16-quantitative-analysis-001",
        unitCode: "WCH16",
        topicSlug: "quantitative-analysis",
        type: "MCQ",
        difficulty: "EASY",
        marks: 1,
        status: "DRAFT",
        stem: r`In a titration, the percentage uncertainties are: pipette $0.24\%$, burette (titre) $0.40\%$ and volumetric flask $0.10\%$. What is the total percentage uncertainty in the calculated concentration?`,
        options: opts(r`$0.40\%$`, r`$0.24\%$`, r`$0.74\%$`, r`$0.25\%$`, "C"),
        markScheme: r`- **C** (1) — percentage uncertainties are added when quantities are multiplied or divided: $0.24 + 0.40 + 0.10 = 0.74\%$.`,
        explanation: r`Quoting just the largest value (A) underestimates the overall uncertainty; averaging the values (D) has no basis.`,
    },
    {
        seedKey: "che-wch16-quantitative-analysis-002",
        unitCode: "WCH16",
        topicSlug: "quantitative-analysis",
        type: "CALCULATION",
        difficulty: "HARD",
        marks: 6,
        status: "DRAFT",
        stem: r`To find the purity of a sample of limestone, $1.25\,\text{g}$ of the powdered rock was added to $50.0\,\text{cm}^3$ of $1.00\,\text{mol dm}^{-3}$ hydrochloric acid (an excess). When the fizzing stopped, the mixture was made up to $250.0\,\text{cm}^3$ with distilled water. $25.0\,\text{cm}^3$ portions of this solution were titrated with $0.100\,\text{mol dm}^{-3}$ sodium hydroxide; the mean titre was $26.40\,\text{cm}^3$.

$$\text{CaCO}_3 + 2\text{HCl} \rightarrow \text{CaCl}_2 + \text{H}_2\text{O} + \text{CO}_2$$

Calculate the percentage by mass of calcium carbonate in the limestone. Assume no other substance in the rock reacts with the acid. [$M_r$ of $\text{CaCO}_3 = 100.1$]`,
        markScheme: r`- $n(\text{NaOH}) = 0.02640 \times 0.100 = 2.64 \times 10^{-3}\,\text{mol}$, equal to $n(\text{HCl})$ in $25.0\,\text{cm}^3$ (1)
- $n(\text{HCl})$ remaining in $250.0\,\text{cm}^3 = 0.0264\,\text{mol}$ (1)
- $n(\text{HCl})$ added at the start $= 0.0500 \times 1.00 = 0.0500\,\text{mol}$ (1)
- $n(\text{HCl})$ reacted $= 0.0236\,\text{mol}$, so $n(\text{CaCO}_3) = 0.0118\,\text{mol}$ (1)
- Mass of $\text{CaCO}_3 = 0.0118 \times 100.1 = 1.18\,\text{g}$ (1)
- Percentage $= 1.18 \div 1.25 \times 100 = 94.5\%$ (1)`,
        explanation: r`This is a back titration: you measure the acid **left over**, then subtract it from the acid added. Remember to scale up by 10 for the $25.0\,\text{cm}^3$ portion and to halve the acid that reacted.`,
    },
    {
        seedKey: "che-wch16-quantitative-analysis-003",
        unitCode: "WCH16",
        topicSlug: "quantitative-analysis",
        type: "CALCULATION",
        difficulty: "MEDIUM",
        marks: 3,
        status: "DRAFT",
        stem: r`A student investigates the effect of temperature on the rate of reaction between sodium thiosulfate and hydrochloric acid by timing how long it takes for a cross under the flask to disappear. At $25\,^\circ\text{C}$ the time was $64\,\text{s}$; at $35\,^\circ\text{C}$ it was $30\,\text{s}$.

(a) Calculate the relative rate ($1/t$) at each temperature and the factor by which the rate increased.

(b) Suggest **one** reason why the times may be inaccurate, other than a timing reaction-time error.`,
        markScheme: r`- (a) $1/t = 0.0156\,\text{s}^{-1}$ at $25\,^\circ\text{C}$ and $0.0333\,\text{s}^{-1}$ at $35\,^\circ\text{C}$ (1)
- (a) The rate increases by a factor of $64 \div 30 = 2.1$ (1)
- (b) Judging when the cross disappears is subjective / the temperature of the mixture falls during the reaction / the depth of solution differs between runs (1)`,
        explanation: r`$1/t$ is proportional to the rate because the same amount of sulfur precipitate must form each time to hide the cross.`,
    },

    // --- qualitative-analysis-synthesis ---
    {
        seedKey: "che-wch16-qualitative-analysis-synthesis-001",
        unitCode: "WCH16",
        topicSlug: "qualitative-analysis-synthesis",
        type: "MCQ",
        difficulty: "EASY",
        marks: 1,
        status: "DRAFT",
        stem: r`A solution gives a cream precipitate with dilute nitric acid and silver nitrate solution. The precipitate dissolves in concentrated ammonia solution but not in dilute ammonia solution. Which ion is present?`,
        options: opts("chloride", "bromide", "iodide", "sulfate", "B"),
        markScheme: r`- **B** (1) — silver bromide is cream and soluble only in concentrated ammonia.`,
        explanation: r`Silver chloride is white and dissolves in dilute ammonia; silver iodide is yellow and insoluble even in concentrated ammonia. Sulfate gives no precipitate with silver nitrate at these concentrations.`,
    },
    {
        seedKey: "che-wch16-qualitative-analysis-synthesis-002",
        unitCode: "WCH16",
        topicSlug: "qualitative-analysis-synthesis",
        type: "SHORT",
        difficulty: "MEDIUM",
        marks: 4,
        status: "DRAFT",
        stem: r`A student prepares ethyl ethanoate (boiling temperature $77\,^\circ\text{C}$) by heating ethanol and ethanoic acid with a little concentrated sulfuric acid. The impure distillate contains some ethanoic acid and water.

Describe how the student should purify the ester.`,
        markScheme: r`- Shake the distillate with sodium hydrogencarbonate (or sodium carbonate) solution in a separating funnel to remove acids (1)
- Release the pressure frequently by opening the tap, as carbon dioxide is produced; run off and discard the aqueous layer (1)
- Dry the ester by adding anhydrous calcium chloride (or anhydrous sodium sulfate) and filter or decant (1)
- Redistil and collect the fraction boiling at about $75$–$79\,^\circ\text{C}$ (1)`,
        explanation: r`The drying agent is added until the liquid turns clear and the solid no longer clumps. Collecting a narrow boiling range around the known boiling temperature separates the ester from remaining ethanol.`,
    },
    {
        seedKey: "che-wch16-qualitative-analysis-synthesis-003",
        unitCode: "WCH16",
        topicSlug: "qualitative-analysis-synthesis",
        type: "SHORT",
        difficulty: "HARD",
        marks: 4,
        status: "DRAFT",
        stem: r`Compound **Z** has the formula $\text{C}_4\text{H}_8\text{O}$. The results of three tests are shown.

| test | result |
| --- | --- |
| 2,4-dinitrophenylhydrazine | orange precipitate |
| warm with Fehling's solution | stays blue |
| warm with iodine and sodium hydroxide | pale yellow precipitate |

Identify **Z**, explaining what each test shows.`,
        markScheme: r`- The orange precipitate with 2,4-DNPH shows a carbonyl group, C=O (1)
- No change with Fehling's solution shows Z is not an aldehyde, so it is a ketone (1)
- The yellow precipitate (iodoform, $\text{CHI}_3$) shows a $\text{CH}_3\text{CO}-$ group (1)
- Z is butanone, $\text{CH}_3\text{COCH}_2\text{CH}_3$ (1)`,
        explanation: r`Butanal would turn Fehling's solution from blue to a red-brown precipitate. Butanone is the only $\text{C}_4$ ketone, and it is a methyl ketone, consistent with the iodoform test.`,
    },
];

export const chemistryQuestions: SeedQuestion[] = [...wch11, ...wch12, ...wch13, ...wch14, ...wch15, ...wch16];
