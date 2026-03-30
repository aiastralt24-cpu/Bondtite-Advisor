export type AppLanguage = 'en' | 'hi' | 'hinglish' | 'gu' | 'rj'

type LocalizedText = Record<AppLanguage, string>

export type ProductProfile = {
  product: string
  imageUrl: string
  pageUrl: string | null
  productType: LocalizedText
  heroNote: LocalizedText
  why: Record<AppLanguage, string[]>
  howToApply: Record<AppLanguage, string[]>
  waitTime: LocalizedText
  clampNeed: LocalizedText
  surfaceWarning: LocalizedText
  avoid: Record<AppLanguage, string[]>
  supportNote: LocalizedText
}

const allProducts = [
  'Bondtite Edge D3',
  'Bondtite Super Strength',
  'Bondtite Wood',
  'Bondtite Acrylic Fix',
  'Bondtite WPC Fix',
  'Bondtite Hydra+',
  'Bondtite Multifix',
  'Zesta All Rounder',
  'Bondtite Heatbond',
  'Bondtite Aqua',
  'Bondtite Foambond SR',
  'Bondtite Multibond SR',
  'Bondgrip Quickgrip SP',
  'Bondtite Standard SR',
  'Bondtite Quik Spray',
  'Bondtite Fast & Clear',
  'Bondtite Uniweld',
  'Bondtite Pro',
  'Bondtite Strong & Clear',
  'VTRORES 605',
  'Vetra LV-401',
  'Resibond Zero Nail',
  'Resibond Hybrid 2 in 1 Xtra Strength',
  'Resibond Saves Nails',
  'Resibond Neutral 3010',
  'Resibond Premium GP 1010',
  'Resibond General Purpose GP 100',
  'Resibond Bathmate',
  'Resibond Weather 5010',
  'Solvobond PVC 501',
  'Solvobond PVC 503',
  'Plastiweld',
  'Solvobond UPVC 606',
  'Amrow',
  'Solvobond CPVC 707',
  'Truzo',
  'Resimet TL 944',
  'Resimet TL 922',
  'Resimet BR 844',
  'Resimet BR 822',
  'Ezy Drain',
  'Bondgrip XR',
  'Resigrip XR',
  'Resibond SL tube',
  'Resibond Thermoseal 7010',
  'Resitape PTFE Tape',
  'Bondfit White',
] as const

const imageOverrides: Record<string, string> = {
  'Bondtite WPC Fix':
    'https://www.astraladhesives.com/media/catalog/product/cache/b2d07047b5be2087dedad4f172bb71a5/w/p/wpc_fix_490x490px.png',
  'Bondtite Super Strength':
    'https://www.astraladhesives.com/media/catalog/product/cache/b2d07047b5be2087dedad4f172bb71a5/b/o/bondtite-super-strength.png',
  'Bondtite Fast & Clear':
    'https://www.astraladhesives.com/media/catalog/product/cache/b2d07047b5be2087dedad4f172bb71a5/f/a/fast-and-clear.png',
  'Bondtite Pro':
    'https://www.astraladhesives.com/media/catalog/product/cache/b2d07047b5be2087dedad4f172bb71a5/b/o/bondtite-pro.png',
  'Bondtite Hydra+':
    'https://www.astraladhesives.com/media/catalog/product/cache/b2d07047b5be2087dedad4f172bb71a5/h/y/hydra__490x490px.png',
  'Bondtite Deluxe':
    'https://www.astraladhesives.com/media/catalog/product/cache/b2d07047b5be2087dedad4f172bb71a5/d/e/deluxe_490x490px.png',
  'Bondtite Multifix':
    'https://www.astraladhesives.com/media/catalog/product/cache/b2d07047b5be2087dedad4f172bb71a5/b/o/bondtite-multifix.jpg',
}

const pageOverrides: Record<string, string> = {
  'Bondtite Edge D3': 'https://www.astraladhesives.com/bondtite-edge-d3.html',
  'Bondtite Super Strength': 'https://www.astraladhesives.com/bondtite-super-strength.html',
  'Bondtite Acrylic Fix': 'https://www.astraladhesives.com/bondtite-acrylic-fix.html',
  'Bondtite WPC Fix': 'https://www.astraladhesives.com/bondtite-wpc-fix.html',
  'Bondtite Hydra+': 'https://www.astraladhesives.com/bondtite-hydra.html',
  'Bondtite Multifix': 'https://www.astraladhesives.com/bondtite-multifix.html',
  'Bondtite Heatbond': 'https://www.astraladhesives.com/bondtite-heatbond.html',
  'Bondtite Aqua': 'https://www.astraladhesives.com/bondtite-aqua.html',
  'Bondtite Foambond SR': 'https://www.astraladhesives.com/bondtite-foambond-sr.html',
  'Bondtite Multibond SR': 'https://www.astraladhesives.com/bondtite-multibond-sr.html',
  'Bondtite Quik Spray': 'https://www.astraladhesives.com/bondtite-quik-spray.html',
  'Bondtite Fast & Clear': 'https://www.astraladhesives.com/bondtite-fast-and-clear.html',
  'Bondtite Uniweld': 'https://www.astraladhesives.com/bondtite-uniweld.html',
  'Bondtite Pro': 'https://www.astraladhesives.com/bondite-pro.html',
  'Bondtite Strong & Clear': 'https://www.astraladhesives.com/bondtite-strong-and-clear.html',
}

function buildFallbackImage(product: string) {
  const safe = encodeURIComponent(product)
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="640" height="640" viewBox="0 0 640 640">
      <defs>
        <linearGradient id="bg" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stop-color="#fffaf3"/>
          <stop offset="100%" stop-color="#f4e1c7"/>
        </linearGradient>
        <linearGradient id="pack" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stop-color="#ffe36d"/>
          <stop offset="100%" stop-color="#ffc928"/>
        </linearGradient>
      </defs>
      <rect width="640" height="640" rx="48" fill="url(#bg)"/>
      <rect x="126" y="84" width="388" height="472" rx="34" fill="#f5ebdc" opacity="0.92"/>
      <rect x="144" y="104" width="352" height="432" rx="28" fill="url(#pack)"/>
      <rect x="144" y="104" width="352" height="432" rx="28" fill="none" stroke="#d3a122" stroke-width="2"/>
      <rect x="178" y="220" width="180" height="122" rx="16" fill="#1b4fa3"/>
      <text x="268" y="272" font-size="42" font-family="Arial, sans-serif" text-anchor="middle" fill="#ffffff" font-weight="700">ASTRAL</text>
      <text x="268" y="316" font-size="42" font-family="Arial, sans-serif" text-anchor="middle" fill="#ffffff" font-weight="700">BONDTITE</text>
      <text x="178" y="178" font-size="28" font-family="Arial, sans-serif" fill="#3c2f22" font-weight="700">Recommended</text>
      <text x="178" y="206" font-size="28" font-family="Arial, sans-serif" fill="#3c2f22" font-weight="700">Product</text>
      <foreignObject x="386" y="192" width="88" height="196">
        <div xmlns="http://www.w3.org/1999/xhtml" style="font-family:Arial,sans-serif;font-size:26px;line-height:1.2;color:#3e2f21;font-weight:700;display:flex;align-items:center;height:100%;">
          ${safe}
        </div>
      </foreignObject>
    </svg>
  `
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`
}

function makeLocalized(en: string, hi: string, hinglish = hi, gu = hi, rj = hinglish): LocalizedText {
  return { en, hi, hinglish, gu, rj }
}

function makeBullets(en: string[], hi: string[], hinglish = hi, gu = hi, rj = hinglish) {
  return { en, hi, hinglish, gu, rj }
}

function byFamily(product: string) {
  const lower = product.toLowerCase()

  if (lower.includes('edge d3') || lower.includes('wood') || lower.includes('hydra') || lower.includes('aqua')) {
    return {
      productType: makeLocalized('Wood adhesive', 'वुड adhesive', 'Wood adhesive'),
      heroNote: makeLocalized(
        `${product} is best suited to wood, board, plywood, and laminate work.`,
        `${product} लकड़ी, बोर्ड, प्लाईवुड और लैमिनेट वाले काम के लिए बेहतर रहता है।`,
        `${product} lakdi, board, plywood aur laminate side wale kaam ke liye zyada relevant hota hai.`,
      ),
      why: makeBullets(
        [
          'Suited to woodworking and panel-based jobs.',
          'Works better when the surface pair includes porous sheet materials.',
          'Best suited when the selected job is centered on wood, board, or laminate work.',
        ],
        [
          'वुडवर्क और पैनल वाले काम में यह अच्छा मेल बैठता है।',
          'जब चुनी हुई सतहों में लकड़ी, बोर्ड या लैमिनेट हो, तब यह ज्यादा उपयोगी रहता है।',
          'ऐसे काम में इसे पहली पसंद माना जा सकता है।',
        ],
      ),
      howToApply: makeBullets(
        [
          'Clean both faces and remove dust, polish, and oil.',
          'Apply an even layer and press both sides properly.',
          'Keep the joint under pressure till the bond settles.',
        ],
        [
          'दोनों faces को साफ करें और dust, polish, oil हटाएं।',
          'एक समान layer लगाकर दोनों surfaces को अच्छे से दबाएं।',
          'Bond settle होने तक joint पर pressure रखें।',
        ],
      ),
      waitTime: makeLocalized(
        'Give the bond enough setting time before cutting or loading.',
        'Cutting या load देने से पहले bond को set होने का समय दें।',
      ),
      clampNeed: makeLocalized(
        'Clamping or steady pressure gives a cleaner wood joint.',
        'वुड joint के लिए clamp या steady pressure बेहतर रहता है।',
      ),
      surfaceWarning: makeLocalized(
        'Do not use over wet wood, loose laminate back, or dusty board edges.',
        'गीली लकड़ी, loose laminate back, या dusty board edge पर use न करें।',
      ),
      avoid: makeBullets(
        [
          'Do not skip surface cleaning.',
          'Do not move the panel too early.',
        ],
        [
          'Surface cleaning skip न करें।',
          'Panel को जल्दी हिलाएं नहीं।',
        ],
      ),
      supportNote: makeLocalized(
        'If the board is coated, oily, or load-bearing, confirm once with support.',
        'अगर board coated, oily, या load-bearing हो, तो support से एक बार confirm कर लें।',
      ),
    }
  }

  if (lower.includes('acrylic') || lower.includes('glass') || lower.includes('clear') || lower.includes('super strength') || lower.includes('pro')) {
    return {
      productType: makeLocalized('Repair and hard-surface adhesive', 'हार्ड-surface adhesive', 'Hard-surface adhesive'),
      heroNote: makeLocalized(
        `${product} is a strong fit for glass, acrylic, metal, tile, stone, and mixed hard-surface fixing.`,
        `${product} glass, acrylic, metal, tile, stone और mixed hard-surface fixing के लिए अच्छा विकल्प है।`,
        `${product} glass, acrylic, metal, tile, stone aur mixed hard-surface fixing ke liye zyada use hota hai.`,
      ),
      why: makeBullets(
        [
          'Fits repair and fixing jobs across hard surfaces.',
          'Useful where a cleaner, more controlled bond is needed.',
          'Works better where the job involves hard or mixed surfaces.',
        ],
        [
          'हार्ड सतहों की मरम्मत और फिक्सिंग में यह अच्छा मेल देता है।',
          'जहाँ साफ़ और नियंत्रित जोड़ चाहिए, वहाँ यह बेहतर रहता है।',
          'मिश्रित या सख्त सतहों वाले काम में इसे चुना जा सकता है।',
        ],
      ),
      howToApply: makeBullets(
        [
          'Keep the surface dry, dust-free, and grease-free.',
          'Prepare the quantity as needed and apply carefully on the contact zone.',
          'Keep the part steady till the bond fully grips.',
        ],
        [
          'Surface को dry, dust-free और grease-free रखें।',
          'जितनी जरूरत हो उतना material तैयार करके contact zone पर carefully लगाएं।',
          'Bond पकड़ने तक part को steady रखें।',
        ],
      ),
      waitTime: makeLocalized(
        'Let the bonded part stay undisturbed till the product finishes setting.',
        'Product set होने तक bonded part को disturb न करें।',
      ),
      clampNeed: makeLocalized(
        'Usually light support is enough; some jobs may need temporary holding.',
        'हल्का support काफी रहता है; कुछ jobs में temporary holding चाहिए हो सकती है।',
      ),
      surfaceWarning: makeLocalized(
        'Avoid soap layer, wet tile, oily metal, or dusty acrylic.',
        'Soap layer, गीली tile, oily metal, या dusty acrylic पर use न करें।',
      ),
      avoid: makeBullets(
        [
          'Do not apply on dirty or damp surfaces.',
          'Do not rush the setting window.',
        ],
        [
          'गंदी या damp surface पर apply न करें।',
          'Setting window के दौरान जल्दीबाज़ी न करें।',
        ],
      ),
      supportNote: makeLocalized(
        'If this is a vertical fixing or transparent finish job, confirm once before final use.',
        'अगर यह vertical fixing या transparent finish वाला काम है, तो final use से पहले confirm कर लें।',
      ),
    }
  }

  if (lower.includes('spray') || lower.includes('sr') || lower.includes('quickgrip') || lower.includes('all rounder')) {
    return {
      productType: makeLocalized('Contact adhesive', 'कॉन्टैक्ट adhesive', 'Contact adhesive'),
      heroNote: makeLocalized(
        `${product} works well for foam, laminate, rexine, louvers, and quick sheet pasting jobs.`,
        `${product} foam, laminate, rexine, louvers और तेज sheet pasting वाले काम में उपयोगी है।`,
        `${product} foam, laminate, rexine, louvers aur sheet pasting jaisi fast site jobs ke liye useful hota hai.`,
      ),
      why: makeBullets(
        [
          'Useful in sheet bonding and quick site fitting jobs.',
          'A good fit where large contact areas need even adhesion.',
          'Works well when the job needs a faster sheet-bonding approach.',
        ],
        [
          'शीट बॉन्डिंग और तेज साइट फिक्सिंग में यह उपयोगी है।',
          'जहाँ बड़े संपर्क क्षेत्र पर एकसमान पकड़ चाहिए, वहाँ यह अच्छा रहता है।',
          'तेज़ शीट-आधारित काम में इसे चुना जा सकता है।',
        ],
      ),
      howToApply: makeBullets(
        [
          'Spread or spray as per product format on the intended surface.',
          'Allow the coat to reach the right tack stage if needed.',
          'Bring both faces together carefully in one alignment.',
        ],
        [
          'Product format के हिसाब से spread या spray करें।',
          'जहां जरूरत हो, coat को सही tack stage तक आने दें।',
          'फिर दोनों faces को एक सही alignment में मिलाएं।',
        ],
      ),
      waitTime: makeLocalized(
        'Initial hold may come fast, but final strength still needs settling time.',
        'पहली पकड़ जल्दी आ सकती है, पर final strength के लिए settling time फिर भी चाहिए।',
      ),
      clampNeed: makeLocalized(
        'Normally hand pressure or roller pressure is enough for the first hold.',
        'पहली पकड़ के लिए सामान्यतः hand pressure या roller pressure काफी रहता है।',
      ),
      surfaceWarning: makeLocalized(
        'Avoid moisture, trapped dust, and poor alignment on large sheet areas.',
        'Large sheet area पर moisture, trapped dust और poor alignment से बचें।',
      ),
      avoid: makeBullets(
        [
          'Do not close the surfaces before they are aligned properly.',
          'Do not leave pockets of air in sheet applications.',
        ],
        [
          'सही alignment से पहले surfaces को close न करें।',
          'Sheet application में air pocket न छोड़ें।',
        ],
      ),
      supportNote: makeLocalized(
        'If the sheet is decorative or heat-prone, confirm the method before purchase.',
        'अगर sheet decorative या heat-prone है, तो खरीदने से पहले method confirm करें।',
      ),
    }
  }

  if (lower.includes('uniweld') || lower.includes('solvobond') || lower.includes('plastiweld')) {
    return {
      productType: makeLocalized('Pipe joint solvent cement', 'पाइप joint cement', 'Pipe joint cement'),
      heroNote: makeLocalized(
        `${product} is made for PVC, uPVC, and CPVC socket joining jobs.`,
        `${product} PVC, uPVC और CPVC socket joining के काम के लिए बनाया गया है।`,
        `${product} PVC, uPVC aur CPVC socket joining ke liye category sheet mein aata hai.`,
      ),
      why: makeBullets(
        [
          'Made for pipe and socket joining work.',
          'Useful where leak-proof fitting matters more than decorative finish.',
          'Best suited for pipe-joint work rather than furniture-style bonding.',
        ],
        [
          'यह पाइप और सॉकेट जोड़ने के काम के लिए बना है।',
          'जहाँ लीकेज-रहित फिटिंग ज़्यादा जरूरी हो, वहाँ यह बेहतर रहता है।',
          'फर्नीचर-जैसे बॉन्डिंग काम के बजाय पाइप-जॉइंट काम में इसे चुनें।',
        ],
      ),
      howToApply: makeBullets(
        [
          'Make sure the pipe end and socket are clean and dry.',
          'Apply around the joint area and fit immediately as required.',
          'Keep the joint straight and undisturbed till it locks.',
        ],
        [
          'Pipe end और socket को clean और dry रखें।',
          'Joint area पर product लगाकर तुरंत fitting करें।',
          'Joint lock होने तक इसे सीधा और steady रखें।',
        ],
      ),
      waitTime: makeLocalized(
        'Allow the plumbing joint to lock before pressure or flow testing.',
        'Pressure या flow test से पहले joint को lock होने का समय दें।',
      ),
      clampNeed: makeLocalized(
        'Clamp is not typical; straight seating and hold is more important.',
        'Clamp सामान्यतः नहीं चाहिए; सही seating और hold ज्यादा जरूरी है।',
      ),
      surfaceWarning: makeLocalized(
        'Do not use on dirty socket edges or a wet pipe end.',
        'Dirty socket edge या wet pipe end पर use न करें।',
      ),
      avoid: makeBullets(
        [
          'Do not rotate the joint after it starts seating.',
          'Do not pressure-test too early.',
        ],
        [
          'Joint seat होने के बाद उसे घुमाएं नहीं।',
          'बहुत जल्दी pressure-test न करें।',
        ],
      ),
      supportNote: makeLocalized(
        'Confirm pipe material once if there is any doubt between PVC, uPVC, and CPVC.',
        'अगर PVC, uPVC और CPVC में doubt हो, तो एक बार material confirm कर लें।',
      ),
    }
  }

  if (lower.includes('thread') || lower.includes('retainer') || lower.includes('ptfe') || lower.includes('seal') || lower.includes('drain')) {
    return {
      productType: makeLocalized('Special application product', 'स्पेशल application product', 'Special application product'),
      heroNote: makeLocalized(
        `${product} is meant for a specific maintenance or sealing application rather than general bonding.`,
        `${product} सामान्य bonding के बजाय एक खास maintenance या sealing काम के लिए बना है।`,
        `${product} bonding ke normal use se alag ek specific maintenance ya sealing application ke liye aata hai.`,
      ),
      why: makeBullets(
        [
          'This is used in a more specific technical application.',
          'It is chosen by application need, not by a general surface-pair job.',
          'Correct use case confirmation matters more here than generic adhesive selection.',
        ],
        [
          'यह एक खास तकनीकी काम में उपयोग होता है।',
          'इसे सामान्य सतह-जोड़ काम की तरह नहीं, बल्कि उसके काम के आधार पर चुना जाता है।',
          'यहाँ साधारण adhesive चुनने से ज्यादा सही उपयोग की पुष्टि जरूरी है।',
        ],
      ),
      howToApply: makeBullets(
        [
          'Match the product to the exact maintenance or sealing job first.',
          'Apply only after confirming the intended application and surface condition.',
          'Follow the pack direction for the exact function.',
        ],
        [
          'सबसे पहले exact maintenance या sealing job confirm करें।',
          'Intended application और surface condition confirm करने के बाद ही use करें।',
          'Exact function के लिए pack direction follow करें।',
        ],
      ),
      waitTime: makeLocalized(
        'Let the function-specific seal or hold settle before use.',
        'Use से पहले function-specific seal या hold को settle होने दें।',
      ),
      clampNeed: makeLocalized(
        'Clamp usually does not apply here; correct application method matters more.',
        'यहां clamp सामान्यतः matter नहीं करता; सही application method ज्यादा जरूरी है।',
      ),
      surfaceWarning: makeLocalized(
        'Use only for the intended job. A wrong application can fail even if the brand is right.',
        'सिर्फ intended job में use करें। गलत application में सही brand भी fail हो सकता है।',
      ),
      avoid: makeBullets(
        [
          'Do not use this as a general bonding adhesive.',
          'Do not skip use-case confirmation.',
        ],
        [
          'इसे general bonding adhesive की तरह use न करें।',
          'Use-case confirmation skip न करें।',
        ],
      ),
      supportNote: makeLocalized(
        'This is the kind of job where one quick support confirmation is always worth it.',
        'इस तरह के काम में support से एक बार confirm करना हमेशा सही रहता है।',
      ),
    }
  }

  return {
    productType: makeLocalized('Adhesive recommendation', 'adhesive recommendation', 'adhesive recommendation'),
    heroNote: makeLocalized(
      `${product} is a relevant option for the selected job.`,
      `${product} चुने हुए काम के लिए एक उपयुक्त विकल्प है।`,
      `${product} category team ki mapping ke hisaab se is kaam ke liye aaya hai.`,
    ),
    why: makeBullets(
      ['This product is relevant for the selected job.', 'Use-case confirmation still matters for unusual surface condition.'],
      ['यह उत्पाद चुने हुए काम के लिए उपयुक्त हो सकता है।', 'अगर सतह असामान्य हो तो उपयोग से पहले पुष्टि करना ज़रूरी है।'],
    ),
    howToApply: makeBullets(
      ['Clean the surface well.', 'Apply only after confirming the exact fit for the job.'],
      ['Surface को अच्छी तरह साफ करें।', 'काम के सही fit की पुष्टि के बाद ही apply करें।'],
    ),
    waitTime: makeLocalized('Follow the pack direction for setting and final curing.', 'Setting और final curing के लिए pack direction follow करें।'),
    clampNeed: makeLocalized('Use support only if the fitting needs it.', 'जहां जरूरत हो, वहीं support दें।'),
    surfaceWarning: makeLocalized('If the surface is coated, oily, wet, or weak, confirm once before use.', 'अगर surface coated, oily, wet या weak हो, तो use से पहले confirm करें।'),
    avoid: makeBullets(['Do not force-fit a product into the wrong application.'], ['गलत application में product को force-fit न करें।']),
    supportNote: makeLocalized('If the job condition is unclear, speak to support before buying.', 'अगर job condition clear न हो, तो खरीदने से पहले support से बात करें।'),
  }
}

function buildProfile(product: string): ProductProfile {
  const family = byFamily(product)

  return {
    product,
    imageUrl: imageOverrides[product] ?? buildFallbackImage(product),
    pageUrl: pageOverrides[product] ?? null,
    ...family,
  }
}

export const productCatalog = Object.fromEntries(
  allProducts.map((product) => [product, buildProfile(product)]),
) as Record<string, ProductProfile>
