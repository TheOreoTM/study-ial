import type { SeedSubject, SeedTopic } from "./types";

// HSC Islam (Islamic Tarbiyah) as taught in Maldivian schools. Units are the two grades and topics are the lessons of
// the National Institute of Education student books, numbered strand.lesson. Each `summary` is the book's own title.
type Lesson = [slug: string, name: string, title: string];

function lessons(strands: Lesson[][]): SeedTopic[] {
    return strands.flatMap((strand, s) =>
        strand.map(([slug, name, summary], l) => ({ slug, code: `${s + 1}.${l + 1}`, name, summary })),
    );
}

const STRANDS =
    "Strands: 1 Islamic belief (aqidah), 2 Hadith, 3 Islamic law (fiqh), 4 Islamic history and civilisation, " +
    "5 Islamic thaqafa, 6 Islamic ethics (akhlaq).";

const grade11 = lessons([
    [
        ["ahl-al-sunnah-wal-jamaah", "Ahl al-Sunnah wal-Jama'ah", "އަހްލުއްސުންނާ ވަލްޖަމާޢާ"],
        ["awliya", "The awliya", "ވަލީވެރިން"],
        ["qada-and-qadar-1", "Qada and qadar (1)", "ޤަޟާއާއި ޤަދަރު"],
        ["qada-and-qadar-2", "Qada and qadar (2)", "ޤަޟާއާއި ޤަދަރު (2)"],
        ["deviant-sects-shia", "Deviant sects 1: Shia", "ބާޠިލު ބައެއް ފިރުޤާތައް 1: ޝީޢީން"],
        ["deviant-sects-shia-sects", "Deviant sects 2: Shia sects", "ބާޠިލު ބައެއް ފިރުޤާތައް 2: ޝީޢީންގެ ފިރުޤާތައް"],
    ],
    [
        ["hadith-science", "The science of hadith", "ޙަދީޘް ޢިލްމު"],
        [
            "accepting-and-rejecting-hadith",
            "Standards for accepting and rejecting hadith",
            "ޙަދީޘް ޤަބޫލުކުރުމާއި ރައްދު ކުރުމުގެ މިންގަނޑު",
        ],
        [
            "preserving-hadith-science",
            "Scholars' work to preserve the science of hadith",
            "ޙަދީޘް ޢިލްމު ރައްކާތެރިކުރުމަށް ޢިލްމުވެރިން ކުރެއްވި މަސައްކަތް",
        ],
        ["al-jarh-wa-al-tadil", "Al-jarh wa al-ta'dil", "އަލްޖަރްޙު ވައްތަޢުދީލު"],
        ["hearing-and-transmitting-hadith", "Hearing and transmitting hadith", "ޙަދީޘް އަޑުއެހުމާއި ޙަދީޘް ފޯރުކޮށްދިނުން"],
        [
            "famous-hadith-scholars-and-books-1",
            "Famous hadith scholars and books (1)",
            "ޙަދީޘް ޢިލްމުގައި މަޝްހޫރު ބޭކަލުންނާއި ފޮތްތައް (1)",
        ],
        [
            "famous-hadith-scholars-and-books-2",
            "Famous hadith scholars and books (2)",
            "ޙަދީޘް ޢިލްމުގައި މަޝްހޫރު ބޭކަލުންނާއި ފޮތްތައް (2)",
        ],
        ["hadith-caring-for-the-needy", "Hadith 1: Caring for the needy", "ޙަދީޘް (1) ނިކަމެތިންނަށް ކަމޭހިތުން"],
        ["hadith-good-character", "Hadith 2: Good character", "ޙަދީޘް (2) ރިވެތި އަޚުލާޤު"],
        [
            "hadith-everyone-has-responsibility",
            "Hadith 3: Everyone has a responsibility",
            "ޙަދީޘް (3) ކޮންމެ މީހެއްގެވެސް މަސްއޫލިއްޔަތެއް ވާކަން",
        ],
        ["hadith-virtue-of-spending", "Hadith 4: The virtue of spending", "ޙަދީޘް (4) ހޭދަކުރުމުގެ މަތިވެރިކަން"],
    ],
    [
        ["islamic-economics", "Islamic economics", "އިސްލާމީ އިޤުތިޞާދު"],
        ["contracts", "Contracts", "ޢަޤުދު"],
        ["debts-and-loans", "Debts and loans", "ދަރަންޏާއި ލޯނު"],
        ["riba", "Riba", "ރިބާ"],
        ["collateral", "Collateral (rahn)", "ރަހުނު"],
        ["company-business-1", "Company business (1)", "ކުންފުނި ވިޔަފާރި (1)"],
        ["company-business-2", "Company business (2)", "ކުންފުނި ވިޔަފާރި (2)"],
        ["insurance", "Insurance", "އިންޝުއަރެންސް (التَّأْمِين)"],
        ["instalment-trade", "Instalment trade", "އިންސްޓޯލްމަންޓް ވިޔަފާރި"],
        [
            "permissible-instalment-principles",
            "Principles of a permissible instalment",
            "ހުއްދަ އިންސްޓޯލްމަންޓެއްގައި ހުންނާނެ އުޞޫލުތައް",
        ],
        ["banking", "Banking", "ބޭންކިންގ"],
        ["islamic-banking-transactions-1", "Islamic banking transactions 1", "އިސްލާމިކް ބޭންކިންގގައި ކުރެވޭ މުޢާމަލާތްތައް 1"],
        ["islamic-banking-transactions-2", "Islamic banking transactions 2", "އިސްލާމިކް ބޭންކިންގގައި ކުރެވޭ މުޢާމަލާތްތައް 2"],
        ["financial-markets-1", "Financial markets 1", "މާލީ ބާޒާރުތައް 1"],
        ["financial-markets-2", "Financial markets 2", "މާލީ ބާޒާރުތައް 2"],
        ["competitions", "Competitions (musabaqah)", "މުސާބަޤާ"],
        ["gambling", "Gambling", "ބާޖުމެރުން"],
        ["corruption", "Corruption", "ކޮރަޕްޝަން"],
    ],
    [
        ["jihad-in-islam", "Jihad in Islam", "އިސްލާމްދީނުގައި ޖިހާދު"],
        ["the-caliphate", "The caliphate", "ޚަލީފާވެރިކަން"],
        ["caliphate-of-abu-bakr", "The caliphate of Abu Bakr", "أَبُو بَكْرٍ الصِّدِّيقُ رَضِيَ اللهُ عَنْهُ ގެ ޚިލާފަތު"],
        ["caliphate-of-umar", "The caliphate of Umar", "عُمَرُ ابْنُ الْخَطَّابِ رَضِيَ اللهُ عَنْهُ ގެ ޚިލާފަތު"],
        ["caliphate-of-uthman", "The caliphate of Uthman", "عُثْمَانُ ابْنُ عَفَّانَ رَضِيَ اللهُ عَنْهُ ގެ ޚިލާފަތު"],
        ["caliphate-of-ali", "The caliphate of Ali", "عَلِيُّ بْنُ أَبِي طَالِبٍ رَضِيَ اللهُ عَنْهُ ގެ ޚިލާފަތު"],
        ["the-crusades", "The Crusades", "ޞަލީބީ ހަނގުރާމަ"],
    ],
    [
        ["secularism", "Secular thought", "ޢަލްމާނީ ފިކުރު"],
        ["globalisation", "Globalisation", "ބަވަނަވުން"],
        ["human-rights-and-islam", "Human rights and Islam", "އިންސާނީ ޙައްޤުތަކާއި އިސްލާމްދީން"],
        ["modern-progress-and-islam", "Modern progress and Islam", "ޒަމާނީ ކުރިއެރުމާއި އިސްލާމްދީން"],
        ["palestine", "Palestine", "ފަލަސްޠީނު"],
    ],
    [
        ["human-dignity", "Human dignity", "އިންސާނީ ކަރާމާތްތެރިކަން"],
        [
            "dealing-with-non-muslims",
            "How to deal with non-Muslims",
            "ޣައިރު މުސްލިމުންނާ މެދު މުޢާމަލާތް ކުރަންވީ ގޮތް",
        ],
        ["rights-of-parents", "The rights of parents", "މައިންބަފައިންގެ ޙައްޤުތައް"],
        ["rights-of-children", "The rights of children", "ދަރިންގެ ޙައްޤުތައް"],
        ["rights-of-neighbours", "The rights of neighbours", "އަވައްޓެރިންގެ ޙައްޤުތައް"],
        ["chastity", "Chastity (iffah)", "ޢިއްފަތްތެރިކަން"],
        ["living-with-dignity", "Living with dignity", "އަބުރުވެރިކަން"],
        ["ghayrah", "Protective honour (ghayrah)", "ޣީރަތްތެރިކަން"],
        ["individual-responsibility", "Individual responsibility", "ފަރުދީ ޒިންމާ"],
    ],
]);

const grade12 = lessons([
    [
        ["two-shahadas", "The importance of the two shahadas", "شَهَادَة ގެ ދެ كَلِمَة ގެ މުހިންމުކަން"],
        ["kufr", "Kufr", "ކުފުރުވުން (اَلْكُفْرُ)"],
        ["takfir", "Takfir", "ކާފިރުކުރުން (اَلتَّكْفِيرُ)"],
        [
            "al-wala-wal-bara",
            "Al-wala wal-bara",
            "މާތް ﷲ އަށްޓަކައި ލޯބިވުމާއި މާތް ﷲ އަށްޓަކައި ނަފްރަތުކުރުން (اَلْوَلَاءُ وَالْبَرَاءُ)",
        ],
        [
            "practices-conflicting-with-belief",
            "Practices among Maldivians that conflict with Islamic belief",
            "ދިވެހިންގެ ތެރޭގައި ހުރި އިސްލާމީ ޢަޤީދާއާ ފުށުއަރާ ކަންތައްތައް",
        ],
        ["ruqyah", "Shar'i ruqyah", "ޝަރުޢީ ރުޤްޔާ"],
        ["belief-about-the-companions", "Sunni belief about the Companions", "އަޞްޙާބު ބޭކަލުންނާމެދު ސުންނަތް ޖަމާޢަތުގެ ޢަޤީދާ"],
        ["deviant-sects-mutazila", "Deviant sects 1: Mu'tazila", "ބާޠިލު ބައެއް ފިރުޤާތައް 1: މުޢުތަޒިލާއިން"],
        [
            "deviant-sects-murjia-and-zindiqs",
            "Deviant sects 2: Murji'a and zindiqs",
            "ބާޠިލު ބައެއް ފިރުޤާތައް 2: މުރުޖިއާއިންނާއި ޒިންދީޤުން",
        ],
        ["ilhad", "Ilhad (atheism)", "އިލްޙާދު"],
        ["ilhadi-movements", "Ilhadi movements", "އިލްޙާދީ ޙަރަކާތް"],
    ],
    [
        [
            "scholars-preserving-hadith",
            "Scholars' work to preserve the science of hadith",
            "ޙަދީޘް ޢިލްމު ރައްކާތެރި ކުރުމަށް ޢިލްމުވެރިން ކުރެއްވި މަސައްކަތްޕުޅު",
        ],
        ["denial-of-the-sunnah", "Denial of the Sunnah", "ސުންނަތަށް އިންކާރުކުރުން"],
        ["mustalah-al-hadith", "Hadith terminology", "މުޞްޠަލަޙުލް ޙަދީޘް"],
        ["famous-hadith-scholars-and-books", "Famous hadith scholars and books", "ޙަދީޘް ޢިލްމުގައި މަޝްހޫރު ބޭކަލުންނާއި ފޮތްތައް"],
        ["hadith-etiquette-of-eating", "Hadith 1: The etiquette of eating", "ޙަދީޘް 1: ކެއުމުގެ އަދަބުތައް"],
        ["hadith-good-deeds-and-speech", "Hadith 2: Good deeds and good speech", "ޙަދީޘް 2: ހެޔޮ ޢަމަލުކުރުމާއި ހެޔޮބަސް ބުނުން"],
        ["hadith-deeds-of-paradise", "Hadith 3: The deeds of the people of Paradise", "ޙަދީޘް 3: ސުވަރުގެވަންތަވެރިޔާގެ ޢަމަލުތައް"],
        ["hadith-earning-your-own-income", "Hadith 4: Earning through your own work", "ޙަދީޘް 4: އަމިއްލަ މަސައްކަތުން އާމްދަނީ ހޯދުން"],
    ],
    [
        ["sources-of-shariah-1", "Sources of the Shariah 1", "އިސްލާމީ ޝަރީޢަތުގެ މަޞްދަރުތައް 1"],
        ["sources-of-shariah-2", "Sources of the Shariah 2", "އިސްލާމީ ޝަރީޢަތުގެ މަޞްދަރުތައް 2"],
        ["zakat", "Zakat", "ޒަކާތް"],
        ["hadanah", "Child custody (hadanah)", "ޙަޟާނާ"],
        ["nafaqah", "Maintenance (nafaqah)", "ނަފަޤާ ދިނުން"],
        ["vows", "Vows (nadhr)", "ނަދުރުބުނުން"],
        ["oaths", "Oaths", "ހުވާކުރުން"],
        ["rebellion", "Rebellion (baghy)", "ބަޣާވާތް (اَلْبَغْيُ)"],
        ["apostasy", "Apostasy (riddah)", "މުރުތައްދުވުން (اَلرِّدَّة)"],
        ["sihr", "Sihr", "ސިޙުރު"],
        ["fiqh-maxims-1", "Fiqh maxims 1", "ފިޤުހީ ޤަވާޢިދު: 1"],
        ["fiqh-maxims-2", "Fiqh maxims 2", "ފިޤުހީ ޤަވާޢިދު: 2"],
        ["differences-among-jurists", "How differences arose among jurists", "ފިޤުހުވެރިންގެ މެދުގައި ޚިލާފު އުފެދުން"],
        [
            "disputed-issues-among-maldivians",
            "Issues of disagreement among Maldivians",
            "ދިވެހިންގެ ތެރޭގައި އިޚްތިލާފު އުފެދިފައިވާ ބައެއް މައްސަލަތައް",
        ],
        ["contemporary-fiqh-issues-1", "Contemporary fiqh issues 1", "ޒަމާނީ ފިޤުހީ މައްސަލަތައް: 1"],
        ["contemporary-fiqh-issues-2", "Contemporary fiqh issues 2", "ޒަމާނީ ފިޤުހީ މައްސަލަތައް: 2"],
        ["contemporary-fiqh-issues-3", "Contemporary fiqh issues 3", "ޒަމާނީ ފިޤުހީ މައްސަލަތައް: 3"],
        ["dress-and-awrah", "Dress and covering the awrah", "ހެދުން އެޅުމާއި ޢައުރަ ނިވާކުރުން"],
        ["adornment", "Adornment", "ޒީނަތްތެރިވުން"],
    ],
    [
        ["isra-and-miraj-1", "Isra and Mi'raj 1", "އިސްރާއާއި މިޢުރާޖު 1"],
        ["isra-and-miraj-2", "Isra and Mi'raj 2", "އިސްރާއާއި މިޢުރާޖު 2"],
        ["marital-life-of-the-prophet", "The Prophet's married life", "ރަސޫލާ ޞައްލަﷲ ޢަލައިހި ވަސައްލަމަގެ ޒަވާޖީ ޙަޔާތްޕުޅު"],
        ["islamic-system-of-government", "The Islamic system of government", "އިސްލާމީ ވެރިކަމުގެ ނިޒާމް"],
        ["islamic-government-and-democracy", "The Islamic system of government and democracy", "އިސްލާމީ ވެރިކަމުގެ ނިޒާމާއި ޑިމޮކްރަސީ"],
        ["umayyad-and-abbasid-states", "Islamic states 1: Umayyad and Abbasid", "އިސްލާމީ ދައުލަތްތައް 1: އުމަވީ ދައުލަތާއި ޢައްބާސީ ދައުލަތް"],
        ["fatimid-and-ottoman-states", "Islamic states 2: Fatimid and Ottoman", "އިސްލާމީ ދައުލަތްތައް 2: ފާޠިމީ ދައުލަތާއި ޢުޘްމާނީ ދައުލަތް"],
    ],
    [
        ["tolerance-of-islam", "The tolerance of Islam", "އިސްލާމްދީނުގެ ސަމާޙަތްތެރިކަން"],
        ["killing-without-right", "Killing a person without right", "ޙައްޤަކާ ނުލައި މީހަކު މެރުން"],
        ["status-of-women", "The status of women in Islam", "އިސްލާމްދީނުގައި އަންހެނުންގެ ދަރަޖަ"],
        ["religion-and-politics", "Religion and politics", "ދީނާއި ސިޔާސަތު"],
    ],
    [
        ["speaking-the-truth", "Speaking what is right", "ޙައްޤުބަސް ބުނުން"],
        ["guarding-the-tongue", "Guarding the tongue", "ދޫ ރައްކާތެރިކުރުން"],
        ["zuhd", "Zuhd", "ޒުހުދުވެރިކަން"],
        [
            "respecting-differences-of-opinion",
            "Respecting others where opinions differ",
            "ޚިޔާލު ތަފާތުވާ ކަންކަމުގައި އަނެކުންނަށް އިޙްތިރާމްކުރުން",
        ],
        ["evil-of-spying", "Deeds against Islamic ethics 1: Spying", "އިސްލާމީ އަޚްލާޤާއި ފުށުއަރާ ބައެއް ޢަމަލުތައް 1: ފާރަލުމުގެ ނުބައިކަން"],
        ["evil-of-bribery", "Deeds against Islamic ethics 2: Bribery", "އިސްލާމީ އަޚްލާޤާއި ފުށުއަރާ ބައެއް ޢަމަލުތައް 2: ރިޝްވަތުގެ ނުބައިކަން"],
        [
            "false-testimony-and-oaths",
            "Deeds against Islamic ethics 3: False testimony and false oaths",
            "އިސްލާމީ އަޚްލާޤާއި ފުށުއަރާ ބައެއް ޢަމަލުތައް 3: ދޮގު ހެކިދިނުމާއި ދޮގު ހުވާކުރުން",
        ],
    ],
]);

export const islam: SeedSubject = {
    slug: "islam",
    code: "LOCAL-ISL",
    name: "Islam",
    description: "Islamic Tarbiyah for HSC students in Maldivian schools, following the Grade 11 and 12 student books.",
    color: "rose",
    isLocal: true,
    units: [
        { code: "ISL11", number: 1, name: "Grade 11", description: STRANDS, topics: grade11 },
        { code: "ISL12", number: 2, name: "Grade 12", description: STRANDS, topics: grade12 },
    ],
};
