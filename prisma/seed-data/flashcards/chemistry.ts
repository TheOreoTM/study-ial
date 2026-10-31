import type { SeedFlashcard } from "../types";

// Original IAL Chemistry flashcards (written for this app): four recall prompts per topic.
// Keys are generated as "che-<unit>-<topic>-fc-NN" in the order the cards are listed.

// String.raw keeps LaTeX backslashes intact (e.g. \text, \times) inside template literals.
const r = String.raw;

function cards(unitCode: string, topicSlug: string, items: [front: string, back: string][]): SeedFlashcard[] {
    return items.map(([front, back], i) => ({
        seedKey: `che-${unitCode.toLowerCase()}-${topicSlug}-fc-${String(i + 1).padStart(2, "0")}`,
        unitCode,
        topicSlug,
        front,
        back,
    }));
}

// ---------------------------------------------------------------------------------------------------------------
// WCH11 — Structure, Bonding and Introduction to Organic Chemistry
// ---------------------------------------------------------------------------------------------------------------
const wch11: SeedFlashcard[] = [
    ...cards("WCH11", "amount-of-substance", [
        [
            r`Define the **mole**.`,
            r`The amount of substance that contains $6.02 \times 10^{23}$ particles (atoms, molecules, ions or electrons) — the Avogadro constant, $N_A$. One mole of $^{12}\text{C}$ has a mass of $12.0\,\text{g}$.`,
        ],
        [
            r`Three equations linking amount $n$ (mol) to mass, solution concentration and gas volume at RTP.`,
            r`$n = \dfrac{m}{M}$, $\quad n = c \times V(\text{dm}^3)$, $\quad n = \dfrac{V(\text{dm}^3)}{24.0}$`,
        ],
        [r`How do you calculate **percentage yield**?`, r`$\dfrac{\text{actual mass of product}}{\text{theoretical mass of product}} \times 100$`],
        [
            r`How do you calculate **atom economy**?`,
            r`$\dfrac{M_r \text{ of desired product}}{\text{sum of } M_r \text{ of all products}} \times 100$ (using the balanced equation). Addition reactions have 100% atom economy.`,
        ],
    ]),
    ...cards("WCH11", "atomic-structure-periodic-table", [
        [
            r`Define **first ionisation energy**.`,
            r`The energy needed to remove one electron from each atom in one mole of gaseous atoms, forming one mole of gaseous $1+$ ions: $\text{X}(\text{g}) \rightarrow \text{X}^+(\text{g}) + \text{e}^-$`,
        ],
        [
            r`Three factors that affect the size of an ionisation energy.`,
            r`- Nuclear charge (number of protons)
- Distance of the outer electron from the nucleus (atomic radius)
- Shielding by inner electrons`,
        ],
        [
            r`Why does first ionisation energy dip from **phosphorus to sulfur**?`,
            r`In sulfur the electron removed is from a 3p orbital that holds a **pair** of electrons; repulsion between the paired electrons makes it easier to remove.`,
        ],
        [
            r`Electronic configuration of chromium and copper atoms.`,
            r`Cr: $[\text{Ar}]\,3\text{d}^5\,4\text{s}^1$ $\quad$ Cu: $[\text{Ar}]\,3\text{d}^{10}\,4\text{s}^1$ — a half-full or full 3d sub-shell is more stable.`,
        ],
    ]),
    ...cards("WCH11", "bonding-structure", [
        [
            r`Shapes and bond angles for 2, 3, 4, 5 and 6 bonding pairs (no lone pairs).`,
            r`2: linear $180^\circ$; 3: trigonal planar $120^\circ$; 4: tetrahedral $109.5^\circ$; 5: trigonal bipyramidal $90^\circ$ and $120^\circ$; 6: octahedral $90^\circ$`,
        ],
        [
            r`Define **electronegativity**.`,
            r`The ability of an atom to attract the bonding pair of electrons in a covalent bond. It increases across a period and decreases down a group (fluorine is the most electronegative element).`,
        ],
        [
            r`What is a **dative covalent** (coordinate) bond? Give an example.`,
            r`A shared pair of electrons in which both electrons come from the same atom, e.g. the N–H bond formed when $\text{NH}_3$ donates its lone pair to $\text{H}^+$ to make $\text{NH}_4^{\;+}$.`,
        ],
        [
            r`Why does graphite conduct electricity but diamond does not?`,
            r`In graphite each carbon forms 3 covalent bonds, leaving one delocalised electron per atom that can move between the layers. In diamond all 4 outer electrons are in covalent bonds.`,
        ],
    ]),
    ...cards("WCH11", "organic-alkanes", [
        [
            r`Define **structural isomers**.`,
            r`Compounds with the same molecular formula but different structural formulae (different chain, position of functional group, or functional group).`,
        ],
        [
            r`Conditions for the reaction of methane with chlorine, and the mechanism type.`,
            r`Ultraviolet light; **free-radical substitution** (initiation, propagation, termination).`,
        ],
        [
            r`What is **homolytic fission**?`,
            r`Breaking a covalent bond so that each atom keeps one electron of the bonding pair, forming two free radicals.`,
        ],
        [
            r`Why are cracking and reforming used in the oil industry?`,
            r`**Cracking** breaks long-chain alkanes into shorter, more useful alkanes and alkenes. **Reforming** turns straight-chain alkanes into branched and cyclic hydrocarbons, which burn more smoothly in engines.`,
        ],
    ]),
    ...cards("WCH11", "alkenes", [
        [
            r`Describe the bonding in a C=C double bond.`,
            r`One $\sigma$ bond (head-on overlap of orbitals between the nuclei) and one $\pi$ bond (sideways overlap of p orbitals above and below the bond axis). The $\pi$ bond prevents rotation.`,
        ],
        [
            r`Define an **electrophile**.`,
            r`A species that accepts a pair of electrons to form a new covalent bond (e.g. $\text{H}^+$, $\text{Br}^{\delta+}$ in a polarised $\text{Br}_2$).`,
        ],
        [
            r`Conditions to hydrogenate an alkene.`,
            r`Hydrogen gas with a nickel catalyst at about $150\,^\circ\text{C}$ (used to harden vegetable oils into margarine).`,
        ],
        [
            r`Product of an alkene with **acidified potassium manganate(VII)**, and the observation.`,
            r`A diol, e.g. ethene gives ethane-1,2-diol. The solution changes from purple to colourless.`,
        ],
    ]),
];

// ---------------------------------------------------------------------------------------------------------------
// WCH12 — Energetics, Group Chemistry, Halogenoalkanes and Alcohols
// ---------------------------------------------------------------------------------------------------------------
const wch12: SeedFlashcard[] = [
    ...cards("WCH12", "energetics", [
        [
            r`Standard conditions for enthalpy changes.`,
            r`A pressure of $100\,\text{kPa}$ (1 bar), a stated temperature (usually $298\,\text{K}$), solutions at $1\,\text{mol dm}^{-3}$, and substances in their standard states.`,
        ],
        [
            r`Define **standard enthalpy change of combustion**, $\Delta_c H^\ominus$.`,
            r`The enthalpy change when one mole of a substance is burned completely in oxygen under standard conditions, all substances in their standard states.`,
        ],
        [r`State **Hess's law**.`, r`The total enthalpy change for a reaction is independent of the route taken, provided the initial and final conditions are the same.`],
        [
            r`Calculate $\Delta H$ from enthalpies of formation, and from mean bond enthalpies.`,
            r`$\Delta H = \sum \Delta_f H(\text{products}) - \sum \Delta_f H(\text{reactants})$

$\Delta H = \sum(\text{bonds broken}) - \sum(\text{bonds made})$`,
        ],
    ]),
    ...cards("WCH12", "intermolecular-forces", [
        [
            r`How do **London forces** arise?`,
            r`Electron density fluctuates, creating an instantaneous dipole in one molecule, which induces a dipole in a neighbouring molecule; the two attract. They are stronger with more electrons and greater surface contact.`,
        ],
        [
            r`Conditions for **hydrogen bonding** between molecules.`,
            r`A hydrogen atom bonded to N, O or F in one molecule, attracted to a lone pair on an N, O or F atom in another molecule. Bond angle about the H is $180^\circ$.`,
        ],
        [
            r`Why is ice less dense than liquid water?`,
            r`In ice each molecule hydrogen bonds to four others in an open tetrahedral lattice, holding the molecules further apart than in the liquid.`,
        ],
        [
            r`Why is ethanol miscible with water but hexane is not?`,
            r`Ethanol forms hydrogen bonds with water molecules. Hexane cannot, and the energy released by London forces with water would not compensate for breaking the water–water hydrogen bonds.`,
        ],
    ]),
    ...cards("WCH12", "redox-groups-1-2-7", [
        [r`Define **oxidation** and **reduction** in terms of electrons and oxidation number.`, r`Oxidation: loss of electrons, oxidation number increases. Reduction: gain of electrons, oxidation number decreases. (OIL RIG)`],
        [
            r`Flame test colours: $\text{Li}^+$, $\text{Na}^+$, $\text{K}^+$, $\text{Ca}^{2+}$, $\text{Sr}^{2+}$, $\text{Ba}^{2+}$.`,
            r`Li red (crimson); Na yellow-orange; K lilac; Ca orange-red (brick red); Sr red (crimson); Ba pale green.`,
        ],
        [
            r`Trends down Group 2: reactivity with water, solubility of hydroxides, solubility of sulfates.`,
            r`Reactivity increases; hydroxides become **more** soluble; sulfates become **less** soluble ($\text{BaSO}_4$ is insoluble).`,
        ],
        [
            r`Products when solid NaCl, NaBr and NaI react with concentrated sulfuric acid.`,
            r`NaCl: HCl only (steamy fumes). NaBr: HBr, plus $\text{Br}_2$ (brown fumes) and $\text{SO}_2$. NaI: HI, plus $\text{I}_2$ (purple/black solid), $\text{SO}_2$, S and $\text{H}_2\text{S}$ (bad-egg smell). Reducing power of halides increases down the group.`,
        ],
    ]),
    ...cards("WCH12", "kinetics-equilibria-intro", [
        [
            r`Define **activation energy**.`,
            r`The minimum energy that colliding particles must have for a reaction to occur.`,
        ],
        [
            r`Key features of a Maxwell–Boltzmann distribution curve.`,
            r`Starts at the origin (no molecules with zero energy); has a single peak (most probable energy); is asymmetric and never meets the energy axis; the area under it equals the total number of molecules.`,
        ],
        [
            r`What is a **dynamic equilibrium**?`,
            r`In a closed system, the forward and reverse reactions occur at the same rate, so the concentrations of reactants and products stay constant.`,
        ],
        [
            r`State **Le Chatelier's principle**.`,
            r`If a system at equilibrium is subjected to a change, the position of equilibrium shifts to oppose the change.`,
        ],
    ]),
    ...cards("WCH12", "halogenoalkanes-alcohols-spectra", [
        [
            r`Reagent and conditions: halogenoalkane $\rightarrow$ alcohol, and halogenoalkane $\rightarrow$ amine.`,
            r`Alcohol: aqueous NaOH or KOH, heat under reflux. Amine: excess concentrated ammonia in ethanol, heated in a sealed tube.`,
        ],
        [
            r`Reagent and conditions: halogenoalkane $\rightarrow$ alkene.`,
            r`Ethanolic (alcoholic) potassium hydroxide, heat under reflux — an **elimination** reaction.`,
        ],
        [
            r`Which alcohols are oxidised by acidified dichromate(VI), and to what?`,
            r`Primary: to an aldehyde, then a carboxylic acid. Secondary: to a ketone. Tertiary: not oxidised (stays orange).`,
        ],
        [
            r`Key infrared absorptions: alcohol O–H, carboxylic acid O–H, C=O, C–H.`,
            r`Alcohol O–H: $3200$–$3550\,\text{cm}^{-1}$ (broad). Acid O–H: $2500$–$3300\,\text{cm}^{-1}$ (very broad). C=O: about $1680$–$1750\,\text{cm}^{-1}$ (strong). C–H: $2850$–$3000\,\text{cm}^{-1}$.`,
        ],
    ]),
];

// ---------------------------------------------------------------------------------------------------------------
// WCH13 — Practical Skills in Chemistry I
// ---------------------------------------------------------------------------------------------------------------
const wch13: SeedFlashcard[] = [
    ...cards("WCH13", "practical-techniques", [
        [
            r`Why is a titration conical flask rinsed only with **distilled water**, not the solution?`,
            r`The pipette delivers a fixed amount of reactant; extra water doesn't change that amount. Rinsing with solution would add extra reactant.`,
        ],
        [
            r`How should a pipette be filled and emptied?`,
            r`Rinse with the solution, fill with a pipette filler until the bottom of the meniscus is on the line at eye level, let it drain under gravity and touch the tip on the surface — do **not** blow out the last drop.`,
        ],
        [
            r`Why is **distillation** used rather than reflux to make an aldehyde from a primary alcohol?`,
            r`The aldehyde has a lower boiling temperature than the alcohol and is removed as it forms, so it is not oxidised further to the carboxylic acid.`,
        ],
        [
            r`How do you collect a gas to measure its volume, and which method suits a soluble gas?`,
            r`Gas syringe, or an inverted measuring cylinder/burette over water. Use a gas syringe for gases that dissolve in water (e.g. $\text{CO}_2$ dissolves slightly; $\text{NH}_3$, HCl are very soluble).`,
        ],
    ]),
    ...cards("WCH13", "measurement-uncertainty", [
        [
            r`Uncertainty of a single reading on an analogue scale (e.g. thermometer, burette).`,
            r`Half the smallest division. For a burette graduated in $0.1\,\text{cm}^3$, $\pm 0.05\,\text{cm}^3$ per reading.`,
        ],
        [
            r`Formula for **percentage uncertainty**.`,
            r`$\dfrac{\text{uncertainty}}{\text{measured value}} \times 100$ — double the uncertainty when the value is a difference of two readings (titre, temperature change, mass by difference).`,
        ],
        [
            r`How can the percentage uncertainty of a measurement be reduced?`,
            r`Measure a larger quantity (bigger mass, larger titre, bigger temperature change) or use apparatus with a smaller uncertainty (e.g. a 3 d.p. balance, a $0.1\,^\circ\text{C}$ thermometer).`,
        ],
        [
            r`How many significant figures should a calculated answer have?`,
            r`The same as the **least** precise piece of data used in the calculation. Don't round intermediate values.`,
        ],
    ]),
    ...cards("WCH13", "data-analysis-evaluation", [
        [
            r`What are **concordant** titres?`,
            r`Titres that agree within $0.10\,\text{cm}^3$ (or $0.20\,\text{cm}^3$, as stated). Only these are averaged; the rough titre is excluded.`,
        ],
        [
            r`Difference between **accuracy** and **precision**.`,
            r`Accuracy: how close a result is to the true value. Precision: how close repeated results are to each other.`,
        ],
        [
            r`Systematic vs random errors.`,
            r`**Systematic** errors shift every result in the same direction (e.g. heat loss, an uncalibrated balance) and are not reduced by repeats. **Random** errors scatter results either side of the true value and are reduced by repeating and averaging.`,
        ],
        [
            r`How do you find the initial rate from a concentration–time graph?`,
            r`Draw a tangent to the curve at $t = 0$ and calculate its gradient (change in concentration ÷ change in time).`,
        ],
    ]),
];

// ---------------------------------------------------------------------------------------------------------------
// WCH14 — Rates, Equilibria and Further Organic Chemistry
// ---------------------------------------------------------------------------------------------------------------
const wch14: SeedFlashcard[] = [
    ...cards("WCH14", "kinetics", [
        [
            r`Shape of a **concentration–time** graph for zero-, first- and second-order reactants.`,
            r`Zero order: straight line with negative gradient. First order: curve with a constant half-life. Second order: curve with a half-life that increases as concentration falls.`,
        ],
        [
            r`Shape of a **rate–concentration** graph for zero-, first- and second-order reactants.`,
            r`Zero order: horizontal line. First order: straight line through the origin. Second order: upward curve through the origin (rate $\propto [\text{X}]^2$).`,
        ],
        [
            r`What is the **rate-determining step**?`,
            r`The slowest step in a mechanism. Species in the rate equation take part in (or before) this step; the orders show how many of each.`,
        ],
        [
            r`Arrhenius equation and how to use the graph.`,
            r`$k = Ae^{-E_a/RT}$, or $\ln k = -\dfrac{E_a}{R}\cdot\dfrac{1}{T} + \ln A$. Plot $\ln k$ against $1/T$: gradient $= -E_a/R$.`,
        ],
    ]),
    ...cards("WCH14", "entropy-energetics", [
        [
            r`Define **lattice energy** (as used in IAL).`,
            r`The enthalpy change when one mole of an ionic solid is formed from its gaseous ions: e.g. $\text{Na}^+(\text{g}) + \text{Cl}^-(\text{g}) \rightarrow \text{NaCl}(\text{s})$. Always exothermic.`,
        ],
        [
            r`Why might an experimental (Born–Haber) lattice energy be more exothermic than the theoretical value?`,
            r`The theoretical value assumes a purely ionic model. If the cation polarises the anion, the bonding has some covalent character, which strengthens the lattice.`,
        ],
        [
            r`Equations for $\Delta S_\text{surroundings}$ and $\Delta S_\text{total}$.`,
            r`$\Delta S_\text{surroundings} = -\dfrac{\Delta H}{T}$ ($\Delta H$ in J mol$^{-1}$)

$\Delta S_\text{total} = \Delta S_\text{system} + \Delta S_\text{surroundings}$; feasible if $\Delta S_\text{total} > 0$.`,
        ],
        [
            r`Gibbs free energy equation and the feasibility condition.`,
            r`$\Delta G = \Delta H - T\Delta S_\text{system}$. A reaction is thermodynamically feasible when $\Delta G \leq 0$ (it may still be slow because of a high activation energy).`,
        ],
    ]),
    ...cards("WCH14", "chemical-equilibria", [
        [
            r`Write $K_c$ for $a\text{A} + b\text{B} \rightleftharpoons c\text{C} + d\text{D}$.`,
            r`$K_c = \dfrac{[\text{C}]^c[\text{D}]^d}{[\text{A}]^a[\text{B}]^b}$, using equilibrium concentrations.`,
        ],
        [
            r`How is partial pressure calculated?`,
            r`Partial pressure = mole fraction $\times$ total pressure, where mole fraction = moles of the gas ÷ total moles of gas.`,
        ],
        [
            r`What is a **heterogeneous** equilibrium, and how is it treated in $K_c$ / $K_p$?`,
            r`An equilibrium with species in different phases. Solids (and pure liquids) are left out of the expression, e.g. for $\text{CaCO}_3(\text{s}) \rightleftharpoons \text{CaO}(\text{s}) + \text{CO}_2(\text{g})$, $K_p = p(\text{CO}_2)$.`,
        ],
        [
            r`How is the value of $K$ related to $\Delta S_\text{total}$?`,
            r`$\Delta S_\text{total} = R\ln K$. A large $K$ means a large positive $\Delta S_\text{total}$, so the equilibrium lies well to the right.`,
        ],
    ]),
    ...cards("WCH14", "acid-base-equilibria", [
        [
            r`Define a **Brønsted–Lowry** acid and base.`,
            r`Acid: proton ($\text{H}^+$) donor. Base: proton acceptor.`,
        ],
        [
            r`Definitions of pH, $K_w$ and $\text{p}K_a$.`,
            r`$\text{pH} = -\log[\text{H}^+]$; $K_w = [\text{H}^+][\text{OH}^-] = 1.00 \times 10^{-14}\,\text{mol}^2\,\text{dm}^{-6}$ at $298\,\text{K}$; $\text{p}K_a = -\log K_a$.`,
        ],
        [
            r`What is a **buffer** solution, and how does an acidic buffer work?`,
            r`A solution that resists changes in pH when small amounts of acid or alkali are added. E.g. $\text{CH}_3\text{COOH}/\text{CH}_3\text{COO}^-$: added $\text{H}^+$ reacts with $\text{CH}_3\text{COO}^-$; added $\text{OH}^-$ reacts with $\text{CH}_3\text{COOH}$. Both are present in large amounts, so the ratio barely changes.`,
        ],
        [
            r`How do you choose an indicator for a titration?`,
            r`Its colour-change range must lie within the vertical part of the titration curve. Strong acid–weak base: methyl orange. Weak acid–strong base: phenolphthalein. Weak acid–weak base: no suitable indicator.`,
        ],
    ]),
    ...cards("WCH14", "carbonyls-carboxylic-acids-chirality", [
        [
            r`What is a **chiral centre**, and what are **enantiomers**?`,
            r`A carbon atom bonded to four different groups. Enantiomers are non-superimposable mirror images; they rotate plane-polarised light by equal amounts in opposite directions.`,
        ],
        [
            r`Reducing agent for aldehydes/ketones and the products.`,
            r`Lithium tetrahydridoaluminate(III), $\text{LiAlH}_4$, in dry ether. Aldehydes give primary alcohols; ketones give secondary alcohols.`,
        ],
        [
            r`Tests to distinguish an aldehyde from a ketone, with results.`,
            r`Tollens' reagent, warm: silver mirror with an aldehyde. Fehling's (or Benedict's) solution, warm: blue to red-brown precipitate with an aldehyde. Ketones give no change.`,
        ],
        [
            r`Products of hydrolysing an ester with acid, and with sodium hydroxide.`,
            r`Acid (reflux, reversible): carboxylic acid + alcohol. NaOH (reflux, goes to completion): sodium carboxylate salt + alcohol.`,
        ],
    ]),
];

// ---------------------------------------------------------------------------------------------------------------
// WCH15 — Transition Metals and Organic Nitrogen Chemistry
// ---------------------------------------------------------------------------------------------------------------
const wch15: SeedFlashcard[] = [
    ...cards("WCH15", "redox-equilibria", [
        [
            r`Define **standard electrode potential**, $E^\ominus$.`,
            r`The potential difference of a half-cell connected to a standard hydrogen electrode, under standard conditions ($298\,\text{K}$, $100\,\text{kPa}$, $1\,\text{mol dm}^{-3}$ solutions).`,
        ],
        [
            r`Components of the **standard hydrogen electrode**.`,
            r`Hydrogen gas at $100\,\text{kPa}$ bubbled over a platinum electrode coated in platinum black, dipping into $1.00\,\text{mol dm}^{-3}$ $\text{H}^+(\text{aq})$ at $298\,\text{K}$. Its $E^\ominus$ is defined as $0.00\,\text{V}$.`,
        ],
        [
            r`How do you use $E^\ominus_\text{cell}$ to decide if a reaction is feasible?`,
            r`$E^\ominus_\text{cell} = E^\ominus(\text{reduced species' half-cell}) - E^\ominus(\text{oxidised species' half-cell})$. If $E^\ominus_\text{cell}$ is positive, the reaction is thermodynamically feasible.`,
        ],
        [
            r`Iodine–thiosulfate titration: equation, indicator and end-point colour change.`,
            r`$2\text{S}_2\text{O}_3^{\;2-} + \text{I}_2 \rightarrow \text{S}_4\text{O}_6^{\;2-} + 2\text{I}^-$. Add starch near the end point (when the solution is pale yellow); end point: blue-black to colourless.`,
        ],
    ]),
    ...cards("WCH15", "transition-metals", [
        [
            r`Define a **transition metal** (IAL definition).`,
            r`A d-block element that forms one or more stable ions with an incomplete d sub-shell. So Sc ($\text{Sc}^{3+}$ is $3\text{d}^0$) and Zn ($\text{Zn}^{2+}$ is $3\text{d}^{10}$) are not transition metals.`,
        ],
        [
            r`Define **ligand** and **coordination number**.`,
            r`A ligand is a species that uses a lone pair to form a dative bond to a metal ion. The coordination number is the number of dative bonds to the central metal ion.`,
        ],
        [
            r`$[\text{Cu}(\text{H}_2\text{O})_6]^{2+}$ with a little, then excess, aqueous ammonia.`,
            r`A little: pale blue precipitate of $[\text{Cu}(\text{OH})_2(\text{H}_2\text{O})_4]$. Excess: dissolves to a deep blue solution of $[\text{Cu}(\text{NH}_3)_4(\text{H}_2\text{O})_2]^{2+}$.`,
        ],
        [
            r`Why do transition metals make good catalysts?`,
            r`They have variable oxidation states, so they can transfer electrons; and they can adsorb reactants onto their surface (heterogeneous). Examples: Fe in the Haber process, $\text{V}_2\text{O}_5$ in the Contact process.`,
        ],
    ]),
    ...cards("WCH15", "arenes", [
        [
            r`Reagents and conditions for the nitration of benzene.`,
            r`Concentrated nitric acid and concentrated sulfuric acid, below $55\,^\circ\text{C}$ (to avoid multiple substitution). Product: nitrobenzene.`,
        ],
        [
            r`Reagents for **Friedel–Crafts** alkylation and acylation of benzene.`,
            r`A halogenoalkane (alkylation) or an acyl chloride (acylation) with an anhydrous aluminium chloride, $\text{AlCl}_3$, catalyst (halogen carrier), heated under reflux.`,
        ],
        [
            r`Why does benzene undergo **substitution** rather than addition?`,
            r`Substitution keeps the stable delocalised $\pi$ system intact. Addition would destroy the delocalisation, which is energetically unfavourable.`,
        ],
        [
            r`Why is phenol a weaker acid than carboxylic acids but stronger than ethanol?`,
            r`In the phenoxide ion the negative charge is partly delocalised into the ring, stabilising it (unlike ethoxide). Delocalisation over two oxygens in a carboxylate ion stabilises it even more. Phenol does not react with carbonates.`,
        ],
    ]),
    ...cards("WCH15", "organic-nitrogen-compounds", [
        [
            r`How is phenylamine made from nitrobenzene?`,
            r`Reduce with tin and concentrated hydrochloric acid, heated under reflux, then add excess sodium hydroxide to release the free amine from its salt.`,
        ],
        [
            r`Why are amines bases?`,
            r`The nitrogen atom has a lone pair of electrons that can accept a proton: $\text{RNH}_2 + \text{H}^+ \rightarrow \text{RNH}_3^{\;+}$.`,
        ],
        [
            r`How is an azo dye made from phenylamine?`,
            r`React phenylamine with nitrous acid ($\text{NaNO}_2$ + HCl) **below $10\,^\circ\text{C}$** to form a diazonium salt, then couple it with phenol in alkaline solution to give a coloured azo compound.`,
        ],
        [
            r`What is a **peptide (amide) link**, and how are peptides hydrolysed?`,
            r`$-\text{CONH}-$, formed by condensation between amino acids. Hydrolysed by heating under reflux with $6\,\text{mol dm}^{-3}$ hydrochloric acid, breaking the protein into amino acids.`,
        ],
    ]),
    ...cards("WCH15", "organic-synthesis", [
        [
            r`How is a **Grignard reagent** made, and why must conditions be dry?`,
            r`React a halogenoalkane with magnesium in dry ether: $\text{RBr} + \text{Mg} \rightarrow \text{RMgBr}$. Water would react with (protonate) the Grignard reagent, forming an alkane.`,
        ],
        [
            r`Products of a Grignard reagent with methanal, other aldehydes, ketones and $\text{CO}_2$ (then acid).`,
            r`Methanal: primary alcohol. Other aldehydes: secondary alcohol. Ketones: tertiary alcohol. $\text{CO}_2$: carboxylic acid. Each adds the R group to the carbon chain.`,
        ],
        [
            r`Steps in **recrystallisation**.`,
            r`Dissolve in the minimum volume of hot solvent; filter hot to remove insoluble impurities; cool to crystallise; filter under reduced pressure; wash with a little cold solvent; dry.`,
        ],
        [
            r`In $^{13}\text{C}$ and $^1\text{H}$ NMR, what do the number of peaks and the splitting tell you?`,
            r`Number of peaks = number of different environments. In $^1\text{H}$ NMR the relative peak areas give the ratio of H atoms, and a peak is split into $n + 1$ lines by $n$ H atoms on adjacent carbon atoms.`,
        ],
    ]),
];

// ---------------------------------------------------------------------------------------------------------------
// WCH16 — Practical Skills in Chemistry II
// ---------------------------------------------------------------------------------------------------------------
const wch16: SeedFlashcard[] = [
    ...cards("WCH16", "planning-experiments", [
        [
            r`First step when choosing quantities for a planned experiment.`,
            r`Use the balanced equation to estimate the expected amount of product (gas volume, titre, temperature change), then pick quantities and apparatus that give a measurable value within the range of the apparatus.`,
        ],
        [
            r`How do you control temperature in a rate experiment?`,
            r`Use a thermostatically controlled water bath, and let the reactants reach the bath temperature before mixing.`,
        ],
        [
            r`Safe way to heat a flammable organic liquid.`,
            r`Use a water bath or electric heating mantle — no naked flames — and work in a fume cupboard if the vapour is harmful.`,
        ],
        [
            r`How do you identify the variables in a plan?`,
            r`**Independent**: the one you change. **Dependent**: the one you measure. **Control**: those kept constant (e.g. temperature, volumes, concentrations of other reactants).`,
        ],
    ]),
    ...cards("WCH16", "quantitative-analysis", [
        [
            r`How do you combine uncertainties when values are multiplied or divided?`,
            r`Add the percentage uncertainties of each measurement to get the percentage uncertainty in the result.`,
        ],
        [
            r`What is a **back titration** and when is it used?`,
            r`An excess of a reagent of known amount is added to the sample; the excess left over is then titrated. Used when the sample is insoluble or reacts slowly (e.g. finding $\text{CaCO}_3$ in limestone).`,
        ],
        [
            r`End-point colours: methyl orange and phenolphthalein in an alkali-into-acid titration.`,
            r`Methyl orange: red to orange (yellow in alkali). Phenolphthalein: colourless to pale pink.`,
        ],
        [
            r`How do you find the order of reaction from a "clock" experiment?`,
            r`Use $1/t$ as a measure of the initial rate. Vary one concentration at a time and plot $1/t$ against concentration: a horizontal line means zero order, a straight line through the origin means first order.`,
        ],
    ]),
    ...cards("WCH16", "qualitative-analysis-synthesis", [
        [
            r`Tests for: carbonate, sulfate and ammonium ions.`,
            r`Carbonate: add dilute acid; gas turns limewater cloudy. Sulfate: add dilute HCl then barium chloride; white precipitate. Ammonium: warm with NaOH; gas turns damp red litmus blue.`,
        ],
        [
            r`Precipitate colours with NaOH(aq): $\text{Cu}^{2+}$, $\text{Fe}^{2+}$, $\text{Fe}^{3+}$, $\text{Cr}^{3+}$.`,
            r`$\text{Cu}^{2+}$: blue. $\text{Fe}^{2+}$: green (turns brown in air). $\text{Fe}^{3+}$: orange-brown. $\text{Cr}^{3+}$: grey-green, dissolves in excess to give a dark green solution.`,
        ],
        [
            r`Tests for an alcohol (–OH) and a carboxylic acid (–COOH).`,
            r`–OH: add $\text{PCl}_5$; steamy fumes of HCl (also given by acids). –COOH: add sodium hydrogencarbonate or carbonate; effervescence, gas turns limewater cloudy.`,
        ],
        [
            r`How can you check the purity of a solid organic product?`,
            r`Measure its melting temperature: a pure solid melts sharply at the data-book value; impurities lower the melting temperature and widen the range.`,
        ],
    ]),
];

export const chemistryFlashcards: SeedFlashcard[] = [...wch11, ...wch12, ...wch13, ...wch14, ...wch15, ...wch16];
