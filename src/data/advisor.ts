import { categoryMatrix, type CategoryMatrixRow } from './categoryMatrix'
import { productCatalog, type AppLanguage, type ProductProfile } from './productCatalog'

export type { AppLanguage } from './productCatalog'

export type BondStrength = 'instant-hold' | 'durable-bond' | 'water-resistance'
export type ApplicationArea = 'indoor' | 'kitchen-bath' | 'outdoor'
export type JobType =
  | 'Bonding'
  | 'Gap filling - Interior'
  | 'Gap filling - Exterior'
  | 'Thread locking'
  | 'Bearing Retainer'
  | 'Drain Cleaning'
  | 'Gasket Making and Sealing'
  | 'Thread sealing'

export type StepKey = 'job-type' | 'surface-a' | 'surface-b' | 'area' | 'priority' | 'result'

export type AdvisorAnswers = {
  jobType: JobType | null
  surfaceA: string | null
  surfaceB: string | null
  applicationArea: ApplicationArea | null
  bondStrength: BondStrength | null
}

export type Recommendation = {
  id: string
  product: string
  imageUrl: string | null
  pageUrl: string | null
  productType: string
  heroNote: string
  why: string[]
  howToApply: string[]
  waitTime: string
  clampNeed: string
  surfaceWarning: string
  avoid: string[]
  supportNote: string
  confidence: 'high' | 'medium'
  sourceLabel: string
  basisLabel: string | null
  alternateProducts: string[]
  alternateReason: string | null
}

export type RecommendationComparisonRow = {
  label: string
  values: string[]
}

export type ParseResult = {
  answers: AdvisorAnswers
  missingStep: StepKey
  prompt: string
  matchedTerms: string[]
  confidence: 'low' | 'medium' | 'high'
  interpretation: string
  refinementSuggestions: string[]
}

export type JobShortcut = {
  id: string
  label: string
  example: string
}

export type LocalizedOption = {
  id: string
  label: string
  note?: string
}

export type DetectedSignal = {
  key: keyof AdvisorAnswers
  value: string
}

type LocalizedText = Record<AppLanguage, string>

type SurfaceStep = 'surface-a' | 'surface-b'

const matrixApplications = [
  'Bonding',
  'Gap filling - Interior',
  'Gap filling - Exterior',
  'Thread locking',
  'Bearing Retainer',
  'Drain Cleaning',
  'Gasket Making and Sealing',
  'Thread sealing',
] as const satisfies readonly JobType[]

const jobTypeLabels: Record<JobType, LocalizedText> = {
  Bonding: {
    en: 'Bonding',
    hi: 'जोड़ने का काम',
    hinglish: 'Jodne ka kaam',
    gu: 'જોડવાનું કામ',
    rj: 'Jodne ro kaam',
  },
  'Gap filling - Interior': {
    en: 'Interior gap filling',
    hi: 'अंदर की gap filling',
    hinglish: 'Andar ki gap filling',
    gu: 'અંદરની ગેપ ફિલિંગ',
    rj: 'Andar ri gap filling',
  },
  'Gap filling - Exterior': {
    en: 'Exterior gap filling',
    hi: 'बाहर की gap filling',
    hinglish: 'Bahar ki gap filling',
    gu: 'બહારની ગેપ ફિલિંગ',
    rj: 'Bahar ri gap filling',
  },
  'Thread locking': {
    en: 'Thread locking',
    hi: 'thread locking',
    hinglish: 'Thread locking',
    gu: 'થ્રેડ લોકિંગ',
    rj: 'Thread locking',
  },
  'Bearing Retainer': {
    en: 'Bearing retainer',
    hi: 'bearing retainer',
    hinglish: 'Bearing retainer',
    gu: 'બેરિંગ રિટેનર',
    rj: 'Bearing retainer',
  },
  'Drain Cleaning': {
    en: 'Drain cleaning',
    hi: 'drain cleaning',
    hinglish: 'Drain cleaning',
    gu: 'ડ્રેન ક્લીનિંગ',
    rj: 'Drain cleaning',
  },
  'Gasket Making and Sealing': {
    en: 'Gasket making and sealing',
    hi: 'gasket making and sealing',
    hinglish: 'Gasket making and sealing',
    gu: 'ગાસ્કેટ અને સીલિંગ',
    rj: 'Gasket making and sealing',
  },
  'Thread sealing': {
    en: 'Thread sealing',
    hi: 'thread sealing',
    hinglish: 'Thread sealing',
    gu: 'થ્રેડ સીલિંગ',
    rj: 'Thread sealing',
  },
}

const jobTypeNotes: Partial<Record<JobType, LocalizedText>> = {
  Bonding: {
    en: 'For joining one surface with another',
    hi: 'जब एक surface को दूसरे से जोड़ना हो',
    hinglish: 'Jab ek surface ko doosre se jodna ho',
    gu: 'જ્યારે એક surface ને બીજા સાથે જોડવું હોય',
    rj: 'Jad ek surface ne doosra se jodno ho',
  },
  'Gap filling - Interior': {
    en: 'For filling small inside gaps, joints, or uneven edges',
    hi: 'घर के अंदर छोटे gap, joint या edge भरने के लिए',
    hinglish: 'Ghar ke andar chhote gap, joint ya edge bharne ke liye',
    gu: 'ઘર અંદરના gap, joint કે edge ભરવા માટે',
    rj: 'Andar ra gap, joint ya edge bharva khatir',
  },
  'Gap filling - Exterior': {
    en: 'For outside joints and open-weather gap work',
    hi: 'बाहर के joint और खुली जगह की gap filling के लिए',
    hinglish: 'Bahar ke joint aur khuli jagah ki gap filling ke liye',
    gu: 'બહારના joint અને ખુલ્લી જગ્યાના gap માટે',
    rj: 'Bahar ra joint aur khuli jagah ri gap filling khatir',
  },
}

const surfaceDefinitions = [
  {
    id: 'wood',
    matrix: ['Wood'],
    label: { en: 'Wood', hi: 'लकड़ी', hinglish: 'Lakdi', gu: 'લાકડું', rj: 'Lakdi' },
    aliases: ['wood', 'lakdi', 'लकड़ी', 'लकडी', 'लक्डी', 'timber', 'wooden'],
  },
  {
    id: 'acrylic',
    matrix: ['Acrylic'],
    label: { en: 'Acrylic', hi: 'ऐक्रेलिक', hinglish: 'Acrylic', gu: 'એક્રિલિક', rj: 'Acrylic' },
    aliases: ['acrylic', 'acrylic sheet', 'ऐक्रेलिक'],
  },
  {
    id: 'mdf',
    matrix: ['MDF'],
    label: { en: 'MDF', hi: 'एमडीएफ', hinglish: 'MDF', gu: 'એમડીએફ', rj: 'MDF' },
    aliases: ['mdf', 'एमडीएफ'],
  },
  {
    id: 'plywood',
    matrix: ['Plywood'],
    label: { en: 'Plywood', hi: 'प्लाईवुड', hinglish: 'Plywood', gu: 'પ્લાયવુડ', rj: 'Plywood' },
    aliases: ['plywood', 'ply', 'प्लाईवुड'],
  },
  {
    id: 'hdhmr',
    matrix: ['HDHMR'],
    label: { en: 'HDHMR', hi: 'एचडीएचएमआर', hinglish: 'HDHMR', gu: 'HDHMR', rj: 'HDHMR' },
    aliases: ['hdhmr'],
  },
  {
    id: 'louvers',
    matrix: ['Louvers'],
    label: { en: 'Louvers', hi: 'लूवर्स', hinglish: 'Louvers', gu: 'લુવર્સ', rj: 'Louvers' },
    aliases: ['louvers', 'louver'],
  },
  {
    id: 'laminate',
    matrix: ['Laminate'],
    label: { en: 'Laminate', hi: 'लैमिनेट', hinglish: 'Laminate', gu: 'લેમિનેટ', rj: 'Laminate' },
    aliases: ['laminate', 'sunmica', 'mica', 'लैमिनेट', 'लेमिनेट', 'सनमाइका'],
  },
  {
    id: 'wpc',
    matrix: ['WPC'],
    label: { en: 'WPC', hi: 'डब्ल्यूपीसी', hinglish: 'WPC', gu: 'WPC', rj: 'WPC' },
    aliases: ['wpc'],
  },
  {
    id: 'stone',
    matrix: ['Stone'],
    label: { en: 'Stone', hi: 'पत्थर', hinglish: 'Stone', gu: 'પથ્થર', rj: 'Pathar' },
    aliases: ['stone', 'marble', 'granite', 'पत्थर', 'मार्बल', 'ग्रेनाइट'],
  },
  {
    id: 'concrete',
    matrix: ['Concrete'],
    label: { en: 'Concrete', hi: 'कंक्रीट', hinglish: 'Concrete', gu: 'કૉન્ક્રીટ', rj: 'Concrete' },
    aliases: ['concrete', 'cement', 'wall', 'कंक्रीट', 'दीवार'],
  },
  {
    id: 'ceramics',
    matrix: ['Ceramics'],
    label: { en: 'Ceramics', hi: 'सिरेमिक', hinglish: 'Ceramics', gu: 'સિરામિક', rj: 'Ceramic' },
    aliases: ['ceramic', 'ceramics', 'tile', 'tiles', 'सिरेमिक', 'टाइल', 'टाइल्स'],
  },
  {
    id: 'glass-coated',
    matrix: ['Glass- back coated'],
    label: { en: 'Coated glass', hi: 'coated glass', hinglish: 'Coated glass', gu: 'કોટેડ ગ્લાસ', rj: 'Coated glass' },
    aliases: ['back coated glass', 'coated glass'],
  },
  {
    id: 'glass',
    matrix: ['Glass'],
    label: { en: 'Glass', hi: 'कांच', hinglish: 'Glass', gu: 'કાચ', rj: 'Kaanch' },
    aliases: ['glass', 'mirror', 'sheesha', 'शीशा', 'कांच'],
  },
  {
    id: 'plastic',
    matrix: ['Plastics(exclude PE | PP | PTFE | Silicon)'],
    label: { en: 'Plastic', hi: 'प्लास्टिक', hinglish: 'Plastic', gu: 'પ્લાસ્ટિક', rj: 'Plastic' },
    aliases: ['plastic', 'pvc panel', 'pvc sheet', 'plास्टिक', 'प्लास्टिक', 'upvc panel'],
  },
  {
    id: 'foam',
    matrix: ['Foam'],
    label: { en: 'Foam', hi: 'फोम', hinglish: 'Foam', gu: 'ફોમ', rj: 'Foam' },
    aliases: ['foam', 'foam sheet', 'फोम'],
  },
  {
    id: 'rexine',
    matrix: ['Rexine'],
    label: { en: 'Rexine', hi: 'रेक्सीन', hinglish: 'Rexine', gu: 'રેક્સિન', rj: 'Rexine' },
    aliases: ['rexine', 'रेक्सीन'],
  },
  {
    id: 'metal',
    matrix: ['Metal'],
    label: { en: 'Metal', hi: 'मेटल', hinglish: 'Metal', gu: 'મેટલ', rj: 'Metal' },
    aliases: ['metal', 'steel', 'iron', 'aluminium', 'aluminum', 'मेटल', 'लोहा', 'लोहे'],
  },
  {
    id: 'pvc-pipe',
    matrix: ['PVC pipe and socket'],
    label: { en: 'PVC pipe and socket', hi: 'PVC pipe and socket', hinglish: 'PVC pipe and socket', gu: 'PVC pipe and socket', rj: 'PVC pipe and socket' },
    aliases: ['pvc pipe', 'pvc socket', 'pipe socket'],
  },
  {
    id: 'upvc-pipe',
    matrix: ['uPVC pipe and socket'],
    label: { en: 'uPVC pipe and socket', hi: 'uPVC pipe and socket', hinglish: 'uPVC pipe and socket', gu: 'uPVC pipe and socket', rj: 'uPVC pipe and socket' },
    aliases: ['upvc pipe', 'upvc socket'],
  },
  {
    id: 'cpvc-pipe',
    matrix: ['CPVC pipe and socket'],
    label: { en: 'CPVC pipe and socket', hi: 'CPVC pipe and socket', hinglish: 'CPVC pipe and socket', gu: 'CPVC pipe and socket', rj: 'CPVC pipe and socket' },
    aliases: ['cpvc pipe', 'cpvc socket'],
  },
] as const

const surfaceIdToDefinition = Object.fromEntries(
  surfaceDefinitions.map((surface) => [surface.id, surface]),
) as Record<string, (typeof surfaceDefinitions)[number]>

const applicationAreaCatalog = [
  {
    id: 'indoor',
    label: {
      en: 'Indoor furniture',
      hi: 'घर के अंदर',
      hinglish: 'Indoor',
      gu: 'ઇન્ડોર',
      rj: 'Andar ro kaam',
    },
    note: {
      en: 'General indoor use',
      hi: 'सामान्य अंदर का काम',
      hinglish: 'Normal indoor kaam',
      gu: 'સામાન્ય અંદરનું કામ',
      rj: 'Normal andar ro kaam',
    },
  },
  {
    id: 'kitchen-bath',
    label: {
      en: 'Kitchen or bathroom',
      hi: 'किचन या बाथरूम',
      hinglish: 'Kitchen ya bathroom',
      gu: 'કિચન કે બાથરૂમ',
      rj: 'Kitchen ya bathroom',
    },
    note: {
      en: 'More water and moisture exposure',
      hi: 'जहां पानी और नमी ज्यादा हो',
      hinglish: 'Jahan paani aur nami zyada ho',
      gu: 'જ્યાં પાણી અને ભેજ વધુ હોય',
      rj: 'Jahan paani aur nami jyaada ho',
    },
  },
  {
    id: 'outdoor',
    label: {
      en: 'Outdoor or exposed area',
      hi: 'बाहर का काम',
      hinglish: 'Outdoor',
      gu: 'આઉટડોર',
      rj: 'Bahar ro kaam',
    },
    note: {
      en: 'Open weather exposure',
      hi: 'जहां धूप, बारिश, मौसम लगे',
      hinglish: 'Jahan dhoop, baarish, mausam lage',
      gu: 'જ્યાં હવામાનનો સીધો અસર હોય',
      rj: 'Jahan dhoop, baarish, mausam lago',
    },
  },
] as const

const bondStrengthCatalog = [
  {
    id: 'instant-hold',
    label: {
      en: 'Fast hold',
      hi: 'जल्दी पकड़',
      hinglish: 'Jaldi pakad',
      gu: 'ઝડપી પકડ',
      rj: 'Jaldi pakad',
    },
    note: {
      en: 'Quick initial grip matters',
      hi: 'जब जल्दी पकड़ चाहिए',
      hinglish: 'Jab quick pakad chahiye',
      gu: 'જ્યારે ઝડપી પકડ જોઈએ',
      rj: 'Jad jaldi pakad chahiye',
    },
  },
  {
    id: 'durable-bond',
    label: {
      en: 'Strong long-term bond',
      hi: 'मज़बूत जोड़',
      hinglish: 'Mazboot jod',
      gu: 'મજબૂત જોડાણ',
      rj: 'Mazboot jod',
    },
    note: {
      en: 'Long-term hold matters more',
      hi: 'जब लंबे समय की पकड़ चाहिए',
      hinglish: 'Jab lambe time ki pakad chahiye',
      gu: 'જ્યારે લાંબા સમય સુધી પકડ જોઈએ',
      rj: 'Jad lambe time ri pakad chahiye',
    },
  },
  {
    id: 'water-resistance',
    label: {
      en: 'Moisture resistance',
      hi: 'पानी से बचाव',
      hinglish: 'Paani se bachav',
      gu: 'ભેજ સામે બચાવ',
      rj: 'Paani se bachav',
    },
    note: {
      en: 'Wet or moisture-prone use',
      hi: 'जब पानी या नमी लगे',
      hinglish: 'Jab paani ya nami lage',
      gu: 'જ્યારે પાણી કે ભેજ લાગે',
      rj: 'Jad paani ya nami lage',
    },
  },
] as const

const shortcutCatalog = [
  {
    id: 'wood-laminate',
    label: {
      en: 'Wood with laminate',
      hi: 'लकड़ी को लैमिनेट से जोड़ना',
      hinglish: 'Lakdi ko laminate se jodna',
      gu: 'લાકડું લેમિનેટ સાથે જોડવું',
      rj: 'Lakdi ne laminate se jodno',
    },
    example: {
      en: 'I want to join wood with laminate for indoor work',
      hi: 'मुझे लकड़ी को लैमिनेट से जोड़ना है',
      hinglish: 'Mujhe lakdi ko laminate se jodna hai',
      gu: 'મારે લાકડું લેમિનેટ સાથે જોડવું છે',
      rj: 'Mhane lakdi ne laminate se jodno hai',
    },
  },
  {
    id: 'gap-fill',
    label: {
      en: 'Gap filling',
      hi: 'gap filling',
      hinglish: 'Gap filling',
      gu: 'gap filling',
      rj: 'Gap filling',
    },
    example: {
      en: 'I need interior gap filling between concrete and tile',
      hi: 'मुझे अंदर की gap filling करनी है',
      hinglish: 'Mujhe andar ki gap filling karni hai',
      gu: 'મારે અંદર gap filling કરવી છે',
      rj: 'Mhane andar gap filling karni hai',
    },
  },
  {
    id: 'metal-metal',
    label: {
      en: 'Metal to metal',
      hi: 'मेटल को मेटल से जोड़ना',
      hinglish: 'Metal ko metal se jodna',
      gu: 'મેટલ ને મેટલ સાથે જોડવું',
      rj: 'Metal ne metal se jodno',
    },
    example: {
      en: 'I need to join metal with metal',
      hi: 'मुझे मेटल को मेटल से जोड़ना है',
      hinglish: 'Mujhe metal ko metal se jodna hai',
      gu: 'મારે મેટલ ને મેટલ સાથે જોડવું છે',
      rj: 'Mhane metal ne metal se jodno hai',
    },
  },
  {
    id: 'pipe',
    label: {
      en: 'Pipe joint',
      hi: 'pipe joint',
      hinglish: 'Pipe joint',
      gu: 'પાઇપ joint',
      rj: 'Pipe joint',
    },
    example: {
      en: 'I need PVC pipe and socket joining',
      hi: 'मुझे PVC pipe joint करना है',
      hinglish: 'Mujhe PVC pipe joint karna hai',
      gu: 'મારે PVC pipe joint કરવો છે',
      rj: 'Mhane PVC pipe joint karno hai',
    },
  },
] as const

const fallbackRecommendationText = {
  sourceLabel: {
    en: 'Confirm with Bondtite support',
    hi: 'Bondtite support से पुष्टि करें',
    hinglish: 'Support se confirm karein',
    gu: 'પહેલાં support થી confirm કરો',
    rj: 'Support se confirm karo',
  },
  basis: {
    en: 'No safe direct match yet',
    hi: 'अभी सुरक्षित सीधा मिलान नहीं मिला',
    hinglish: 'Abhi clear category-sheet match nahi mila',
    gu: 'હજુ clear category-sheet match મળ્યો નથી',
    rj: 'Abhi clear category-sheet match ni milyo',
  },
}

const sourceLabelText = {
  en: 'Matched to your selected job',
  hi: 'आपके चुने हुए काम के आधार पर चुना गया',
  hinglish: 'Suggested by Category Team',
  gu: 'Suggested by Category Team',
  rj: 'Suggested by Category Team',
}

const areaKeywords: Record<ApplicationArea, readonly string[]> = {
  indoor: ['indoor', 'inside', 'andar', 'घर', 'अंदर', 'living room', 'sofa', 'furniture'],
  'kitchen-bath': ['bathroom', 'washroom', 'kitchen', 'water', 'moisture', 'पानी', 'बाथरूम', 'किचन', 'seelan'],
  outdoor: ['outdoor', 'outside', 'bahar', 'बाहर', 'terrace', 'balcony', 'rain', 'weather'],
}

const priorityKeywords: Record<BondStrength, readonly string[]> = {
  'instant-hold': ['fast', 'quick', 'jaldi', 'instant', 'pakad', 'जल्दी', 'पकड़'],
  'durable-bond': ['strong', 'durable', 'mazboot', 'मज़बूत', 'heavy', 'long term'],
  'water-resistance': ['water', 'moisture', 'wet', 'paani', 'पानी', 'नमी', 'bathroom', 'kitchen'],
}

const appKeywords: Record<JobType, readonly string[]> = {
  Bonding: ['join', 'bond', 'jodna', 'jodhe', 'जोड़ना', 'lagana', 'chipkana', 'between', 'with'],
  'Gap filling - Interior': ['gap', 'filling', 'crack', 'दरार', 'fill', 'andar ki gap', 'interior gap'],
  'Gap filling - Exterior': ['exterior gap', 'bahar ki gap', 'outdoor gap', 'outside crack'],
  'Thread locking': ['thread lock', 'thread locking', 'nut bolt lock'],
  'Bearing Retainer': ['bearing retainer', 'bearing fit'],
  'Drain Cleaning': ['drain clean', 'drain cleaning', 'drain choke'],
  'Gasket Making and Sealing': ['gasket', 'sealing', 'sealant', 'seal banana'],
  'Thread sealing': ['thread sealing', 'ptfe', 'thread tape'],
}

const orderedAliases = surfaceDefinitions
  .flatMap((surface) => surface.aliases.map((alias) => ({ id: surface.id, alias })))
  .sort((a, b) => b.alias.length - a.alias.length)

function normalizeText(input: string) {
  return input
    .toLowerCase()
    .replace(/[^\p{L}\p{M}\p{N}\s/&+-]+/gu, ' ')
    .replace(/को/gu, ' ko ')
    .replace(/से/gu, ' se ')
    .replace(/पे|पर/gu, ' pe ')
    .replace(/में/gu, ' mein ')
    .replace(/के साथ/gu, ' ke saath ')
    .replace(/जोड़ना|जोड़ने|जोड़नी/gu, ' jodna ')
    .replace(/लगाना|लगानी|लगाने/gu, ' lagana ')
    .replace(/चिपकाना|चिपकानी|चिपकाने/gu, ' chipkana ')
    .replace(/\bispe\b/gu, ' is pe ')
    .replace(/\buspe\b/gu, ' us pe ')
    .replace(/\s+/gu, ' ')
    .trim()
}

function detectSurfaceIds(input: string): string[] {
  const matches = orderedAliases
    .map((item) => ({ ...item, index: input.indexOf(item.alias) }))
    .filter((item) => item.index >= 0)
    .sort((a, b) => (a.index === b.index ? b.alias.length - a.alias.length : a.index - b.index))

  const found: string[] = []
  for (const match of matches) {
    if (!found.includes(match.id)) {
      found.push(match.id)
    }
    if (found.length === 2) break
  }
  return found
}

function matchSurfaceInSegment(segment: string) {
  for (const alias of orderedAliases) {
    if (segment.includes(alias.alias)) return alias.id
  }
  return null
}

function detectRelatedSurfacePair(input: string): [string | null, string | null] {
  const patterns: Array<{ pattern: RegExp; map: (a: string, b: string) => [string | null, string | null] }> = [
    {
      pattern: /(.+?)\s+to\s+(.+?)(?:\s+for|\s+in|\s+and|$)/u,
      map: (a, b) => [matchSurfaceInSegment(a), matchSurfaceInSegment(b)],
    },
    {
      pattern: /between\s+(.+?)\s+and\s+(.+?)(?:\s+for|\s+in|\s+with|$)/u,
      map: (a, b) => [matchSurfaceInSegment(a), matchSurfaceInSegment(b)],
    },
    {
      pattern: /(.+?)\s+with\s+(.+?)(?:\s+for|\s+in|\s+and|$)/u,
      map: (a, b) => [matchSurfaceInSegment(a), matchSurfaceInSegment(b)],
    },
    {
      pattern: /(.+?)\s+ko\s+(.+?)\s+se(?:\s+hi)?\s+(?:jodna|chipkana|lagana)/u,
      map: (a, b) => [matchSurfaceInSegment(a), matchSurfaceInSegment(b)],
    },
    {
      pattern: /(.+?)\s+pe(?:\s+hi)?\s+(.+?)\s+(?:lagana|chipkana|jodna)/u,
      map: (a, b) => [matchSurfaceInSegment(a), matchSurfaceInSegment(b)],
    },
  ]

  for (const item of patterns) {
    const match = input.match(item.pattern)
    if (!match) continue
    const [, left, right] = match
    const pair = item.map(left.trim(), right.trim())
    if (pair[0] || pair[1]) return pair
  }
  return [null, null]
}

function detectJobType(input: string): JobType | null {
  for (const application of matrixApplications) {
    if (appKeywords[application].some((keyword) => input.includes(keyword))) {
      return application
    }
  }
  return null
}

function detectArea(input: string): ApplicationArea | null {
  for (const [id, keywords] of Object.entries(areaKeywords) as [ApplicationArea, readonly string[]][]) {
    if (keywords.some((keyword) => input.includes(keyword))) return id
  }
  return null
}

function detectPriority(input: string): BondStrength | null {
  for (const [id, keywords] of Object.entries(priorityKeywords) as [BondStrength, readonly string[]][]) {
    if (keywords.some((keyword) => input.includes(keyword))) return id
  }
  return null
}

function requiresSurfacePair(jobType: JobType | null) {
  return Boolean(jobType && !['Drain Cleaning', 'Gasket Making and Sealing', 'Thread sealing'].includes(jobType))
}

function requiresArea(jobType: JobType | null) {
  return jobType === 'Bonding'
}

function requiresPriority(jobType: JobType | null) {
  return jobType === 'Bonding'
}

function normalizeMatrixValue(value: string | null | undefined) {
  return value?.trim() ?? null
}

function normalizeMatrixRow(row: CategoryMatrixRow) {
  return {
    ...row,
    application: row.application.trim(),
    surfaceA: normalizeMatrixValue(row.surfaceA),
    surfaceB: normalizeMatrixValue(row.surfaceB),
  }
}

const normalizedCategoryMatrix = categoryMatrix.map(normalizeMatrixRow)

function findMatrixRow(jobType: JobType, surfaceA: string | null, surfaceB: string | null) {
  const surfaceARaw = surfaceA ? normalizeMatrixValue(surfaceIdToDefinition[surfaceA]?.matrix[0]) : null
  const surfaceBRaw = surfaceB ? normalizeMatrixValue(surfaceIdToDefinition[surfaceB]?.matrix[0]) : null

  return normalizedCategoryMatrix.find((row) => {
    if (row.application !== jobType) return false
    if (!requiresSurfacePair(jobType)) return !row.surfaceA && !row.surfaceB
    if (!surfaceARaw || !surfaceBRaw) return false
    return (
      (row.surfaceA === surfaceARaw && row.surfaceB === surfaceBRaw) ||
      (row.surfaceA === surfaceBRaw && row.surfaceB === surfaceARaw)
    )
  })
}

function getLocalizedSurfaceLabel(surfaceId: string, language: AppLanguage) {
  return surfaceIdToDefinition[surfaceId]?.label[language] ?? surfaceId
}

function getLocalizedJobTypeLabel(jobType: JobType, language: AppLanguage) {
  return jobTypeLabels[jobType][language]
}

function getLocalizedAreaLabel(area: ApplicationArea, language: AppLanguage) {
  return applicationAreaCatalog.find((item) => item.id === area)?.label[language] ?? area
}

function getLocalizedPriorityLabel(priority: BondStrength, language: AppLanguage) {
  return bondStrengthCatalog.find((item) => item.id === priority)?.label[language] ?? priority
}

function getFallbackRecommendation(language: AppLanguage): Recommendation {
  return {
    id: 'support-check',
    product: language === 'hi' ? 'Bondtite support' : 'Bondtite support',
    imageUrl: null,
    pageUrl: null,
    productType: language === 'hi' ? 'सुरक्षित अगला कदम' : 'Safer next step',
    heroNote:
      language === 'hi'
        ? 'इस काम के लिए अभी सुरक्षित सीधा मिलान नहीं मिला। गलत product बताने से बेहतर है पहले support से पुष्टि करना।'
        : language === 'hinglish'
          ? 'Is kaam ke liye category sheet se seedha match nahi mila. Galat product batane se better hai pehle support se confirm karna.'
          : language === 'gu'
            ? 'આ કામ માટે category sheetમાંથી સીધી match મળી નથી. ખોટો product કહેવા કરતાં support થી confirm કરવું વધુ સારું છે.'
            : language === 'rj'
              ? 'Is kaam khatir category sheet su seedho match ni milyo. Galat product batavan su pehla support se confirm karno better hai.'
              : 'I could not find a safe direct category-sheet match for this job. Better to confirm than suggest the wrong product.',
    why:
      language === 'hi'
        ? [
            'काम पूरी तरह साफ नहीं हुआ या सीधा मिलान नहीं मिला।',
            'गलत adhesive बताना जोखिम वाला होगा।',
            'एक बार support से पुष्टि करने पर सही दिशा मिल जाएगी।',
          ]
        : [
            'The job is still unclear or the exact pair is not mapped cleanly.',
            'Suggesting the wrong adhesive would be risky.',
            'A quick support check is the safer next move.',
          ],
    howToApply:
      language === 'hi'
        ? ['दोनों surfaces की एक फोटो तैयार रखें।', 'बताइए कि काम indoor, wet area या outdoor है।', 'Support को वही job line बताइए जिसमें आप सहज हों।']
        : ['Keep one photo of both surfaces ready.', 'Tell support whether this is indoor, wet-area, or outside work.', 'Describe the job in the language you are comfortable with.'],
    waitTime: language === 'hi' ? 'Support से सही product की पुष्टि होने तक रुकें।' : 'Wait until support confirms the right product.',
    clampNeed: language === 'hi' ? 'पुष्टि हुए बिना apply न करें।' : 'Do not apply until the job is confirmed.',
    surfaceWarning: language === 'hi' ? 'अगर surface coated, oily, painted, cracked या unusual हो, तो support check ज़रूरी है।' : 'If the surface is coated, oily, painted, cracked, or unusual, support confirmation matters.',
    avoid: language === 'hi' ? ['अंदाज़े से product मत चुनिए।', 'अधूरी जानकारी पर काम शुरू मत कीजिए।'] : ['Do not choose by guesswork.', 'Do not start the job on partial information.'],
    supportNote: language === 'hi' ? 'खरीदने या लगाने से पहले support से एक बार पुष्टि कर लें।' : 'Please confirm once with support before buying or applying.',
    confidence: 'medium',
    sourceLabel: fallbackRecommendationText.sourceLabel[language],
    basisLabel: fallbackRecommendationText.basis[language],
    alternateProducts: [],
    alternateReason: null,
  }
}

function profileToRecommendation(
  profile: ProductProfile,
  language: AppLanguage,
  basisLabel: string | null,
  alternateProducts: string[],
): Recommendation {
  return {
    id: profile.product.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    product: profile.product,
    imageUrl: profile.imageUrl,
    pageUrl: profile.pageUrl,
    productType: profile.productType[language],
    heroNote: profile.heroNote[language],
    why: profile.why[language],
    howToApply: profile.howToApply[language],
    waitTime: profile.waitTime[language],
    clampNeed: profile.clampNeed[language],
    surfaceWarning: profile.surfaceWarning[language],
    avoid: profile.avoid[language],
    supportNote: profile.supportNote[language],
    confidence: 'high',
    sourceLabel: sourceLabelText[language],
    basisLabel,
    alternateProducts,
    alternateReason: profile.why[language][1] ?? null,
  }
}

export function getJobTypeOptions(language: AppLanguage): LocalizedOption[] {
  return matrixApplications.map((jobType) => ({
    id: jobType,
    label: jobTypeLabels[jobType][language],
    note: jobTypeNotes[jobType]?.[language],
  }))
}

export function getSurfaceOptions(language: AppLanguage): LocalizedOption[] {
  return surfaceDefinitions.map((surface) => ({
    id: surface.id,
    label: surface.label[language],
  }))
}

function getSurfaceIdFromMatrixValue(value: string | null) {
  if (!value) return null
  const normalizedValue = normalizeMatrixValue(value)
  return surfaceDefinitions.find((surface) =>
    surface.matrix.some((matrixValue) => normalizeMatrixValue(matrixValue) === normalizedValue),
  )?.id ?? null
}

export function getSurfaceOptionsForStep(
  language: AppLanguage,
  answers: AdvisorAnswers,
  step: SurfaceStep,
): LocalizedOption[] {
  if (!answers.jobType || !requiresSurfacePair(answers.jobType)) return []

  const relevantRows = normalizedCategoryMatrix.filter((row) => row.application === answers.jobType)
  const availableSurfaceIds = new Set<string>()

  if (step === 'surface-a') {
    relevantRows.forEach((row) => {
      const surfaceAId = getSurfaceIdFromMatrixValue(row.surfaceA)
      const surfaceBId = getSurfaceIdFromMatrixValue(row.surfaceB)
      if (surfaceAId) availableSurfaceIds.add(surfaceAId)
      if (surfaceBId) availableSurfaceIds.add(surfaceBId)
    })
  } else if (answers.surfaceA) {
    const selectedMatrixValue = normalizeMatrixValue(surfaceIdToDefinition[answers.surfaceA]?.matrix[0])
    relevantRows.forEach((row) => {
      if (row.surfaceA === selectedMatrixValue && row.surfaceB) {
        const surfaceId = getSurfaceIdFromMatrixValue(row.surfaceB)
        if (surfaceId) availableSurfaceIds.add(surfaceId)
      }
      if (row.surfaceB === selectedMatrixValue && row.surfaceA) {
        const surfaceId = getSurfaceIdFromMatrixValue(row.surfaceA)
        if (surfaceId) availableSurfaceIds.add(surfaceId)
      }
    })
  }

  return surfaceDefinitions
    .filter((surface) => availableSurfaceIds.has(surface.id))
    .map((surface) => ({
      id: surface.id,
      label: surface.label[language],
    }))
}

export function getApplicationAreaOptions(language: AppLanguage): LocalizedOption[] {
  return applicationAreaCatalog.map((area) => ({
    id: area.id,
    label: area.label[language],
    note: area.note[language],
  }))
}

export function getBondStrengthOptions(language: AppLanguage): LocalizedOption[] {
  return bondStrengthCatalog.map((strength) => ({
    id: strength.id,
    label: strength.label[language],
    note: strength.note[language],
  }))
}

export function getJobShortcuts(language: AppLanguage): JobShortcut[] {
  return shortcutCatalog.map((shortcut) => ({
    id: shortcut.id,
    label: shortcut.label[language],
    example: shortcut.example[language],
  }))
}

export function getRecommendation(answers: AdvisorAnswers, language: AppLanguage): Recommendation | null {
  const options = getRecommendationOptions(answers, language)
  return options[0] ?? null
}

export function getRecommendationOptions(answers: AdvisorAnswers, language: AppLanguage): Recommendation[] {
  if (!answers.jobType) return []
  if (getNextMissingStep(answers) !== 'result') return []

  const row = findMatrixRow(answers.jobType, answers.surfaceA, answers.surfaceB)
  if (!row) return [getFallbackRecommendation(language)]

  const candidates = row.products.filter((product) => productCatalog[product])
  if (candidates.length === 0) return [getFallbackRecommendation(language)]

  const basisLabel =
    row.surfaceA && row.surfaceB
      ? `${row.surfaceA} + ${row.surfaceB}`
      : jobTypeLabels[answers.jobType][language]
  return candidates.slice(0, 4).map((productName) =>
    profileToRecommendation(
      productCatalog[productName],
      language,
      basisLabel,
      candidates.filter((candidate) => candidate !== productName).slice(0, 3),
    ),
  ).map((recommendation, index) => ({
    ...recommendation,
    confidence: index === 0 ? recommendation.confidence : 'medium',
  }))
}

export function getLocalizedAnswerSummary(answers: AdvisorAnswers, language: AppLanguage) {
  return {
    jobType: answers.jobType ? getLocalizedJobTypeLabel(answers.jobType, language) : null,
    surfaceA: answers.surfaceA ? getLocalizedSurfaceLabel(answers.surfaceA, language) : null,
    surfaceB: answers.surfaceB ? getLocalizedSurfaceLabel(answers.surfaceB, language) : null,
    applicationArea: answers.applicationArea ? getLocalizedAreaLabel(answers.applicationArea, language) : null,
    bondStrength: answers.bondStrength ? getLocalizedPriorityLabel(answers.bondStrength, language) : null,
  }
}

export function buildComparisonRows(
  recommendations: Recommendation[],
  answers: AdvisorAnswers,
  language: AppLanguage,
): RecommendationComparisonRow[] {
  const summary = getLocalizedAnswerSummary(answers, language)
  const useCase = [
    summary.jobType,
    summary.surfaceA,
    summary.surfaceB,
    summary.applicationArea,
  ].filter(Boolean).join(' • ')

  return [
    {
      label: language === 'hi' ? 'उत्पाद' : 'Product',
      values: recommendations.map((item) => item.product),
    },
    {
      label: language === 'hi' ? 'प्रकार' : 'Type',
      values: recommendations.map((item) => item.productType),
    },
    {
      label: language === 'hi' ? 'किस काम के लिए' : 'Best for',
      values: recommendations.map((item) => item.heroNote),
    },
    {
      label: language === 'hi' ? 'आपके काम से मेल' : 'Fit for your job',
      values: recommendations.map(() => useCase || (language === 'hi' ? 'चयनित काम' : 'Selected job')),
    },
    {
      label: language === 'hi' ? 'सेट होने का समय' : 'Setting time',
      values: recommendations.map((item) => item.waitTime),
    },
    {
      label: language === 'hi' ? 'Clamp / दबाव' : 'Clamp need',
      values: recommendations.map((item) => item.clampNeed),
    },
    {
      label: language === 'hi' ? 'तैयारी' : 'Preparation',
      values: recommendations.map((item) => item.howToApply[0] ?? (language === 'hi' ? 'पैक निर्देश देखें' : 'Check pack direction')),
    },
    {
      label: language === 'hi' ? 'सावधानी' : 'Caution',
      values: recommendations.map((item) => item.surfaceWarning),
    },
    {
      label: language === 'hi' ? 'कब चुनें' : 'Choose this instead',
      values: recommendations.map((item) => item.why[1] ?? item.supportNote),
    },
  ]
}

export function getNextMissingStep(answers: AdvisorAnswers): StepKey {
  if (!answers.jobType) return 'job-type'
  if (requiresSurfacePair(answers.jobType)) {
    if (!answers.surfaceA) return 'surface-a'
    if (!answers.surfaceB) return 'surface-b'
  }
  if (requiresArea(answers.jobType) && !answers.applicationArea) return 'area'
  if (requiresPriority(answers.jobType) && !answers.bondStrength) return 'priority'
  return 'result'
}

const promptByLanguage: Record<AppLanguage, Record<StepKey, string>> = {
  en: {
    'job-type': 'First tell me what kind of job this is.',
    'surface-a': 'Tell me the first surface.',
    'surface-b': 'Now tell me the second surface.',
    area: 'Where will it be used?',
    priority: 'What matters most?',
    result: 'I have enough to suggest a product now.',
  },
  hi: {
    'job-type': 'सबसे पहले बताइए, यह किस तरह का काम है?',
    'surface-a': 'पहली सतह बताइए।',
    'surface-b': 'अब दूसरी सतह बताइए।',
    area: 'यह काम कहाँ होगा?',
    priority: 'सबसे ज़रूरी क्या है?',
    result: 'अब सही product सुझाने लायक जानकारी मिल गई है।',
  },
  hinglish: {
    'job-type': 'Sabse pehle bataiye, yeh kis type ka kaam hai?',
    'surface-a': 'Pehla surface bataiye.',
    'surface-b': 'Ab doosra surface bataiye.',
    area: 'Yeh kahan use hoga?',
    priority: 'Sabse zaroori kya hai?',
    result: 'Ab mere paas product suggest karne layak jankari hai.',
  },
  gu: {
    'job-type': 'સૌ પહેલા કહો, આ કયા પ્રકારનું કામ છે?',
    'surface-a': 'પહેલું surface કહો.',
    'surface-b': 'હવે બીજું surface કહો.',
    area: 'આ ક્યાં વપરાશે?',
    priority: 'સૌથી મહત્વનું શું છે?',
    result: 'હવે મારા પાસે product બતાવવા જેટલી માહિતી છે.',
  },
  rj: {
    'job-type': 'Pehla batao, yo kiso kaam hai?',
    'surface-a': 'Pehlo surface batao.',
    'surface-b': 'Ab doosro surface batao.',
    area: 'Yo khaan use hogo?',
    priority: 'Sab te jaroori su hai?',
    result: 'Ab mhare paas product batavan layak jankari hai.',
  },
}

function buildFollowUpPrompt(answers: AdvisorAnswers, language: AppLanguage) {
  const base = promptByLanguage[language]
  if (!answers.jobType) return base['job-type']
  if (requiresSurfacePair(answers.jobType) && !answers.surfaceA) return base['surface-a']
  if (requiresSurfacePair(answers.jobType) && !answers.surfaceB) {
    if (answers.surfaceA) {
      const label = getLocalizedSurfaceLabel(answers.surfaceA, language)
      return language === 'hi'
        ? `${label} समझ आया। अब बताइए इसे किस दूसरी सतह से जोड़ना है?`
        : language === 'hinglish'
          ? `${label} samajh aaya. Ab bataiye ise kis se jodna hai?`
          : language === 'gu'
            ? `${label} સમજાયું. હવે કહો, તેને કયા surface સાથે જોડવું છે?`
            : language === 'rj'
              ? `${label} samajh aayo. Ab batao, ise kiso surface se jodno hai?`
              : `I understood ${label}. Now tell me what it needs to bond with.`
    }
    return base['surface-b']
  }
  if (requiresArea(answers.jobType) && !answers.applicationArea) return base.area
  if (requiresPriority(answers.jobType) && !answers.bondStrength) return base.priority
  return base.result
}

export function getFollowUpPrompt(answers: AdvisorAnswers, language: AppLanguage) {
  return buildFollowUpPrompt(answers, language)
}

function getParseConfidence(answers: AdvisorAnswers): 'low' | 'medium' | 'high' {
  const matchedCount = [
    answers.jobType,
    answers.surfaceA,
    answers.surfaceB,
    answers.applicationArea,
    answers.bondStrength,
  ].filter(Boolean).length
  const readyForRecommendation = getNextMissingStep(answers) === 'result'

  if (readyForRecommendation) return 'high'
  if (matchedCount >= 2) return 'medium'
  return 'low'
}

function buildInterpretation(answers: AdvisorAnswers, language: AppLanguage) {
  const parts: string[] = []

  if (answers.jobType) {
    parts.push(getLocalizedJobTypeLabel(answers.jobType, language))
  }
  if (answers.surfaceA && answers.surfaceB) {
    parts.push(
      language === 'hi'
        ? `${getLocalizedSurfaceLabel(answers.surfaceA, language)} से ${getLocalizedSurfaceLabel(answers.surfaceB, language)} का काम`
        : `${getLocalizedSurfaceLabel(answers.surfaceA, language)} + ${getLocalizedSurfaceLabel(answers.surfaceB, language)}`,
    )
  } else if (answers.surfaceA) {
    parts.push(getLocalizedSurfaceLabel(answers.surfaceA, language))
  }
  if (answers.applicationArea) {
    parts.push(getLocalizedAreaLabel(answers.applicationArea, language))
  }
  if (answers.bondStrength) {
    parts.push(getLocalizedPriorityLabel(answers.bondStrength, language))
  }

  if (parts.length === 0) {
    return language === 'hi'
      ? 'अभी काम की दिशा साफ़ नहीं हुई है। थोड़ी और जानकारी से मैं सही सुझाव दूँगा।'
      : 'The job is still not clear enough yet.'
  }

  if (language === 'hi') {
    return `अभी तक मुझे यह समझ आया है: ${parts.join(' • ')}`
  }

  return `Here is what I understand so far: ${parts.join(' • ')}`
}

function buildRefinementSuggestions(answers: AdvisorAnswers, language: AppLanguage): string[] {
  const suggestions: string[] = []
  const nextMissing = getNextMissingStep(answers)

  if (!answers.jobType) {
    suggestions.push(language === 'hi' ? 'बताइए यह जोड़ने का काम है, गैप भरने का है, या सील करने का।' : 'Tell me whether this is bonding, gap filling, or sealing.')
  }
  if (requiresSurfacePair(answers.jobType) && !answers.surfaceA) {
    suggestions.push(language === 'hi' ? 'पहली सतह साफ़ लिखिए, जैसे लकड़ी, टाइल, मेटल, या काँच।' : 'Name the first surface clearly, like wood, tile, metal, or glass.')
  }
  if (requiresSurfacePair(answers.jobType) && answers.surfaceA && !answers.surfaceB) {
    suggestions.push(
      language === 'hi'
        ? `अब बताइए ${getLocalizedSurfaceLabel(answers.surfaceA, language)} किस दूसरी सतह से जुड़ना है।`
        : `Now tell me what ${getLocalizedSurfaceLabel(answers.surfaceA, language)} needs to bond with.`,
    )
  }
  if (!answers.applicationArea && answers.jobType === 'Bonding') {
    suggestions.push(language === 'hi' ? 'अगर यह घर के अंदर, किचन-बाथरूम, या बाहर का काम है तो वह भी बताइए।' : 'If this is indoor, bathroom, or outdoor, mention that too.')
  }
  if (!answers.bondStrength && answers.jobType === 'Bonding') {
    suggestions.push(language === 'hi' ? 'अगर जल्दी पकड़, मज़बूत जोड़, या पानी से बचाव ज़रूरी है तो वह भी बताइए।' : 'If fast hold or moisture resistance matters, mention that too.')
  }

  if (nextMissing === 'area') {
    suggestions.unshift(language === 'hi' ? 'बताइए यह घर के अंदर है, किचन-बाथरूम वाला है, या बाहर का काम है।' : 'Tell me whether this is indoor, kitchen-bath, or outdoor.')
  }

  if (nextMissing === 'priority') {
    suggestions.unshift(language === 'hi' ? 'बताइए सबसे ज़रूरी क्या है: जल्दी पकड़, मज़बूत जोड़, या पानी से बचाव।' : 'Tell me what matters most: fast hold, durable bond, or moisture resistance.')
  }

  return suggestions.slice(0, 2)
}

export function getDetectedSignals(answers: AdvisorAnswers, language: AppLanguage): DetectedSignal[] {
  const signals: DetectedSignal[] = []

  if (answers.jobType) {
    signals.push({ key: 'jobType', value: getLocalizedJobTypeLabel(answers.jobType, language) })
  }
  if (answers.surfaceA) {
    signals.push({ key: 'surfaceA', value: getLocalizedSurfaceLabel(answers.surfaceA, language) })
  }
  if (answers.surfaceB) {
    signals.push({ key: 'surfaceB', value: getLocalizedSurfaceLabel(answers.surfaceB, language) })
  }
  if (answers.applicationArea) {
    signals.push({ key: 'applicationArea', value: getLocalizedAreaLabel(answers.applicationArea, language) })
  }
  if (answers.bondStrength) {
    signals.push({ key: 'bondStrength', value: getLocalizedPriorityLabel(answers.bondStrength, language) })
  }

  return signals
}

export function parseJobInput(input: string, language: AppLanguage): ParseResult {
  const normalized = normalizeText(input)
  const [pairA, pairB] = detectRelatedSurfacePair(normalized)
  const surfaces = detectSurfaceIds(normalized)
  const detectedJobType = detectJobType(normalized)
  const inferredBonding = pairA || pairB || surfaces.length >= 2 ? 'Bonding' : null
  const jobType = detectedJobType ?? inferredBonding

  const answers: AdvisorAnswers = {
    jobType,
    surfaceA: pairA ?? surfaces[0] ?? null,
    surfaceB: pairB ?? surfaces[1] ?? (requiresSurfacePair(jobType) ? null : null),
    applicationArea: detectArea(normalized),
    bondStrength: detectPriority(normalized),
  }

  return {
    answers,
    missingStep: getNextMissingStep(answers),
    prompt: buildFollowUpPrompt(answers, language),
    matchedTerms: [
      ...(answers.jobType ? [answers.jobType] : []),
      ...(answers.surfaceA ? [answers.surfaceA] : []),
      ...(answers.surfaceB ? [answers.surfaceB] : []),
      ...(answers.applicationArea ? [answers.applicationArea] : []),
      ...(answers.bondStrength ? [answers.bondStrength] : []),
    ],
    confidence: getParseConfidence(answers),
    interpretation: buildInterpretation(answers, language),
    refinementSuggestions: buildRefinementSuggestions(answers, language),
  }
}
