import { useEffect, useMemo, useRef, useState } from 'react'
import {
  buildComparisonRows,
  getApplicationAreaOptions,
  getBondStrengthOptions,
  getDetectedSignals,
  getFollowUpPrompt,
  getJobTypeOptions,
  getJobShortcuts,
  getNextMissingStep,
  getRecommendationOptions,
  getSurfaceOptions,
  parseJobInput,
  type AppLanguage,
  type AdvisorAnswers,
  type LocalizedOption,
  type ParseResult,
  type Recommendation,
  type StepKey,
} from './data/advisor'

type StepId = StepKey

type SpeechRecognitionConstructor = new () => SpeechRecognition

interface SpeechRecognition extends EventTarget {
  continuous: boolean
  interimResults: boolean
  lang: string
  onend: (() => void) | null
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null
  onresult: ((event: SpeechRecognitionEvent) => void) | null
  start(): void
  stop(): void
}

interface SpeechRecognitionEvent {
  results: {
    [index: number]: {
      [index: number]: {
        transcript: string
      }
    }
    length: number
  }
}

interface SpeechRecognitionErrorEvent {
  error: string
}

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor
    webkitSpeechRecognition?: SpeechRecognitionConstructor
  }
}

const initialAnswers: AdvisorAnswers = {
  jobType: null,
  surfaceA: null,
  surfaceB: null,
  applicationArea: null,
  bondStrength: null,
}

const translationsBase = {
  en: {
    appName: 'Bondtite Advisor',
    appSub: 'Dr. Bondtite',
    heroTitle: 'Find the right Bondtite.',
    heroText:
      'Describe the job simply and the advisor will narrow it down without technical confusion.',
    languageGateEyebrow: 'Choose language',
    languageGateTitle: 'Which language should I use?',
    languageGateText: 'Pick one language. I will ask, guide, and recommend only in that language.',
    languages: {
      en: 'English',
      hi: 'Hindi',
      hinglish: 'Hinglish',
      gu: 'Gujarati',
      rj: 'Rajasthani',
    },
    continueLabel: 'Continue',
    headerEyebrow: 'Bondtite Advisor',
    reset: 'Start again',
    stepCounter: 'Step',
    of: 'of',
    quickPhraseLabel: 'Try a sample',
    quickPhrases: [
      'I want to join wood with laminate',
      'I need to fix tile in the bathroom',
      'Metal has to bond with wood',
      'I need quick initial hold',
    ],
    heroGlance: [
      ['How it works', 'One step at a time. No product confusion.'],
      ['Language', 'The tool stays in the language you choose.'],
      ['If unsure', 'Support details appear right away.'],
    ],
    stepEyebrows: ['Step 1', 'Step 2', 'Step 3'],
    stepTitles: {
      'job-type': 'What kind of job is this?',
      'surface-a': 'What is the first surface?',
      'surface-b': 'What does it need to bond with?',
      area: 'Where will this be used?',
      priority: 'What matters most?',
      result: 'This looks right for your job',
    },
    helper: 'Choose the closest option. You do not need technical product language.',
    inputEyebrow: 'Describe the job',
    inputTitle: 'Describe your job',
    inputHelper: 'Example: “I want to join wood with laminate” or “I need tile fixing in the bathroom”.',
    inputPlaceholder: 'Type your job here...',
    inputButton: 'Find the right product',
    voiceButton: 'Speak instead',
    voiceListening: 'Listening...',
    voiceUnsupported: 'Voice input is not available in this browser. You can type instead.',
    voiceError: 'I could not catch that clearly. Please try again or type it.',
    voiceReady: 'You can speak in your selected language. I will fill the text for you.',
    emptyPrompt: 'Tell me in one line what you want to join. I will take it from there.',
    detectedTitle: 'Detected from your description',
    detectedInterpretation: 'What the advisor understands',
    summaryEmpty: 'Your selections will appear here.',
    summaryEyebrow: 'What you selected',
    summaryTitle: 'Your job',
    summaryLabels: {
      jobType: 'Job type',
      surfaceA: 'First surface',
      surfaceB: 'Second surface',
      area: 'Use area',
      priority: 'Main need',
    },
    notSelected: 'Not selected yet',
    simpleRuleText: 'If the job is not clear, the tool pauses and points you to support instead of guessing.',
    supportEyebrow: 'Bondtite support',
    supportTitle: 'Want to confirm by speaking to someone?',
    supportLabels: {
      care: 'Customer Care',
      mumbai: 'Mumbai Office',
      email: 'Email',
    },
    supportActions: {
      call: 'Call now',
      email: 'Send email',
      share: 'Share recommendation',
    },
    back: 'Go back',
    recommendationEyebrow: 'Recommended Bondtite',
    confidence: {
      high: 'Strong match',
      medium: 'Need quick support check',
      low: 'Need more detail',
    },
    resultTitles: {
      source: 'Why this matches your job',
      basis: 'Matched for',
      alternates: 'Other suggestions',
      resultHeader: 'Best fit for your job',
      viewProduct: 'View product',
      switchLabel: 'View this option',
      compareLabel: 'Compare',
      compareReady: 'Compare selected products',
      compareTitle: 'Compare suggested products',
      compareHelper: 'See the most useful differences before you decide.',
      bestFit: 'Best for this job',
      alternateFit: 'When to choose this instead',
      nextAction: 'Next step',
      nextActionCopy: 'Open the product page, share this recommendation, or compare it with another suitable option.',
      summaryLine: 'Selected for',
      why: 'Why this fits',
      apply: 'How to apply',
      practical: 'Practical guidance',
      practicalToggle: 'View practical guidance',
      wait: 'Wait time',
      clamp: 'Clamp need',
      warning: 'Surface warning',
      avoid: 'Avoid these mistakes',
      unsure: 'If still unsure',
    },
  },
  hi: {
    appName: 'Bondtite Advisor',
    appSub: 'Dr. Bondtite',
    heroTitle: 'सही Bondtite चुनिए.',
    heroText:
      'काम को आसान भाषा में बताइए और advisor बिना उलझन के सही दिशा देगा।',
    languageGateEyebrow: 'भाषा चुनें',
    languageGateTitle: 'आप किस भाषा में बात करना चाहते हैं?',
    languageGateText: 'एक भाषा चुनिए। उसके बाद सवाल, मार्गदर्शन और पूरा सुझाव उसी भाषा में होगा।',
    languages: {
      en: 'English',
      hi: 'हिंदी',
      hinglish: 'हिंग्लिश',
      gu: 'ગુજરાતી',
      rj: 'राजस्थानी',
    },
    continueLabel: 'आगे बढ़ें',
    headerEyebrow: 'Bondtite Advisor',
    reset: 'फिर से शुरू करें',
    stepCounter: 'स्टेप',
    of: 'में से',
    quickPhraseLabel: 'उदाहरण आज़माएँ',
    quickPhrases: [
      'मुझे लकड़ी को लैमिनेट से जोड़ना है',
      'मुझे बाथरूम में टाइल लगानी है',
      'मुझे मेटल को लकड़ी से जोड़ना है',
      'मुझे जल्दी पकड़ चाहिए',
    ],
    heroGlance: [
      ['कैसे काम करता है', 'एक बार में एक सवाल। बिना product confusion के।'],
      ['भाषा', 'आप जो भाषा चुनेंगे, tool उसी में रहेगा।'],
      ['अगर doubt हो', 'Support details तुरंत मिल जाएँगी।'],
    ],
    stepEyebrows: ['स्टेप 1', 'स्टेप 2', 'स्टेप 3'],
    stepTitles: {
      'job-type': 'यह किस तरह का काम है?',
      'surface-a': 'पहला surface क्या है?',
      'surface-b': 'इसे किससे जोड़ना है?',
      area: 'यह काम कहाँ होगा?',
      priority: 'सबसे ज़रूरी क्या है?',
      result: 'यह आपके काम के लिए सही लग रहा है',
    },
    helper: 'जो option सबसे सही लगे, वही चुनिए। Technical product language जानना जरूरी नहीं है।',
    inputEyebrow: 'काम बताइए',
    inputTitle: 'अपने काम को लिखिए',
    inputHelper: 'जैसे: “मुझे लकड़ी को लैमिनेट से जोड़ना है” या “मुझे बाथरूम में टाइल लगानी है”।',
    inputPlaceholder: 'यहाँ अपना काम लिखिए...',
    inputButton: 'सही product खोजें',
    voiceButton: 'बोलकर बताइए',
    voiceListening: 'सुन रहा हूँ...',
    voiceUnsupported: 'इस browser में voice input उपलब्ध नहीं है। आप लिखकर बता सकते हैं।',
    voiceError: 'आवाज़ साफ़ नहीं समझ आई। एक बार फिर बोलिए या लिखिए।',
    voiceReady: 'आप चुनी हुई भाषा में बोल सकते हैं। मैं उसे लिख दूँगा।',
    emptyPrompt: 'एक लाइन में बताइए कि आपको क्या जोड़ना है। मैं वहीं से आगे बढ़ाऊँगा।',
    detectedTitle: 'लिखे हुए से समझा गया',
    detectedConfidence: 'स्थिति',
    detectedInterpretation: 'सलाहकार को यह समझ आया',
    summaryEmpty: 'आपकी चुनी हुई बातें यहां दिखेंगी।',
    summaryEyebrow: 'आपने क्या चुना',
    summaryTitle: 'आपका काम',
    summaryLabels: {
      jobType: 'काम का प्रकार',
      surfaceA: 'पहली सतह',
      surfaceB: 'दूसरी सतह',
      area: 'जगह',
      priority: 'सबसे ज़रूरी बात',
    },
    notSelected: 'अभी चुना नहीं गया',
    simpleRuleText: 'जब काम साफ नहीं होता, तब tool अंदाज़ा लगाने के बजाय support तक ले जाता है।',
    supportEyebrow: 'Bondtite support',
    supportTitle: 'अगर बात करके confirm करना हो',
    supportLabels: {
      care: 'ग्राहक सेवा',
      mumbai: 'मुंबई कार्यालय',
      email: 'ईमेल',
    },
    supportActions: {
      call: 'अभी कॉल करें',
      email: 'ईमेल भेजें',
      share: 'सुझाव साझा करें',
    },
    back: 'पीछे जाएँ',
    recommendationEyebrow: 'Suggested Bondtite',
    confidence: {
      high: 'मज़बूत match',
      medium: 'एक बार support से पुष्टि करें',
      low: 'थोड़ी और जानकारी चाहिए',
    },
    resultTitles: {
      source: 'यह आपके काम से क्यों मेल खाता है',
      basis: 'किस आधार पर मिला',
      alternates: 'और क्या options हैं',
      resultHeader: 'इस काम के लिए सबसे सही product',
      viewProduct: 'product देखें',
      switchLabel: 'यह option देखें',
      compareLabel: 'तुलना करें',
      compareReady: 'चुने हुए उत्पादों की तुलना करें',
      compareTitle: 'सुझाए गए उत्पादों की तुलना',
      compareHelper: 'फैसला करने से पहले सबसे ज़रूरी फर्क एक साथ देखिए।',
      bestFit: 'इस काम के लिए सबसे सही',
      alternateFit: 'यह कब चुनें',
      nextAction: 'अगला कदम',
      nextActionCopy: 'product पेज खोलें, इस सुझाव को साझा करें, या किसी दूसरे उपयुक्त option से तुलना करें।',
      summaryLine: 'चुना गया काम',
      why: 'यह क्यों सही है',
      apply: 'इसे कैसे लगाएँ',
      practical: 'काम की ज़रूरी बातें',
      practicalToggle: 'काम की ज़रूरी बातें देखें',
      wait: 'कितना रुकना है',
      clamp: 'Clamp चाहिए या नहीं',
      warning: 'सतह पर ध्यान',
      avoid: 'इन बातों से बचें',
      unsure: 'अगर अभी भी doubt हो',
    },
  },
  hinglish: {
    appName: 'Bondtite Advisor',
    appSub: 'Dr. Bondtite',
    heroTitle: 'Sahi Bondtite chuniye.',
    heroText:
      'Kaam ko simple language mein bataiye aur advisor bina technical confusion ke sahi direction dega.',
    languageGateEyebrow: 'Language choose karein',
    languageGateTitle: 'Aap kis language mein baat karna chahte hain?',
    languageGateText: 'Ek language choose kijiye. Uske baad sawaal, guidance aur recommendation sab usi language mein honge.',
    languages: {
      en: 'English',
      hi: 'Hindi',
      hinglish: 'Hinglish',
      gu: 'Gujarati',
      rj: 'Rajasthani',
    },
    continueLabel: 'Aage badhein',
    headerEyebrow: 'Bondtite Advisor',
    reset: 'Phir se shuru karein',
    stepCounter: 'Step',
    of: 'of',
    quickPhraseLabel: 'Example try karein',
    quickPhrases: [
      'Mujhe lakdi ko laminate se jodna hai',
      'Mujhe bathroom mein tile lagani hai',
      'Mujhe metal ko wood se jodna hai',
      'Mujhe jaldi pakad chahiye',
    ],
    heroGlance: [
      ['Kaise kaam karta hai', 'Ek time pe ek sawaal. Bina product confusion.'],
      ['Language', 'Aap jo language choose karenge, tool usi mein rahega.'],
      ['Agar doubt ho', 'Support details turant mil jayengi.'],
    ],
    stepEyebrows: ['Step 1', 'Step 2', 'Step 3'],
    stepTitles: {
      'job-type': 'Yeh kis type ka kaam hai?',
      'surface-a': 'Pehla surface kya hai?',
      'surface-b': 'Ise kis se jodna hai?',
      area: 'Yeh kaam kahan hoga?',
      priority: 'Sabse zaroori kya hai?',
      result: 'Yeh aapke kaam ke liye sahi lag raha hai',
    },
    helper: 'Jo option sabse sahi lage, wahi choose kijiye. Technical product language aana zaroori nahi hai.',
    inputEyebrow: 'Kaam batayein',
    inputTitle: 'Apna kaam likhiye',
    inputHelper: 'Jaise: “Mujhe lakdi ko laminate se jodna hai” ya “Mujhe bathroom mein tile lagani hai”.',
    inputPlaceholder: 'Yahan apna kaam likhiye...',
    inputButton: 'Sahi product dhoondo',
    voiceButton: 'Bolkar batayein',
    voiceListening: 'Sun raha hoon...',
    voiceUnsupported: 'Is browser mein voice input nahi chal raha hai. Aap likhkar bata sakte hain.',
    voiceError: 'Awaaz saaf samajh nahi aayi. Ek baar phir boliye ya likhiye.',
    voiceReady: 'Aap chuni hui language mein bol sakte hain. Main use likh dunga.',
    nextQuestion: 'Agla sawaal',
    emptyPrompt: 'Ek line mein batayein ki aapko kya jodna hai. Main wahin se aage badhaunga.',
    detectedTitle: 'Likhe hue se samjha gaya',
    detectedEmpty: 'Ek baar likhiye, advisor wahin se aapka kaam samajhna shuru karega.',
    detectedConfidence: 'Advisor confidence',
    detectedInterpretation: 'Advisor ko kya samajh aaya',
    refinementTitle: 'Ab kya batana help karega',
    summaryEmpty: 'Aapki chosen details yahan dikhengi.',
    summaryEyebrow: 'Aapne kya choose kiya',
    summaryTitle: 'Kaam ka short summary',
    summaryLabels: {
      jobType: 'Kaam ka type',
      surfaceA: 'Pehla surface',
      surfaceB: 'Doosra surface',
      area: 'Jagah',
      priority: 'Sabse zaroori baat',
    },
    notSelected: 'Abhi choose nahi hua',
    simpleRule: 'Simple rule',
    simpleRuleText: 'Jab kaam clear nahi hota, tab tool andaza lagane ke bajaye support tak le jaata hai.',
    textRead: 'Likhe hue se kya samjha',
    textReadEmpty: 'Abhi likhe hue se kuch clear nahi hua. Aap phir likh sakte hain ya neeche se choose kar sakte hain.',
    textReadMap: {
      'surface-b': 'Main kaam ka kuch hissa samajh gaya hoon. Ab doosra surface chahiye.',
      result: 'Itni jankari mil gayi hai ki ab product suggest kiya ja sakta hai.',
    },
    supportEyebrow: 'Bondtite support',
    supportTitle: 'Agar baat karke confirm karna ho',
    supportLabels: {
      care: 'Customer Care',
      mumbai: 'Mumbai Office',
      email: 'Email',
    },
    supportActions: {
      call: 'Abhi call karein',
      email: 'Email bhejein',
      share: 'Recommendation share karein',
    },
    back: 'Peeche jao',
    recommendationEyebrow: 'Suggested Bondtite',
    confidence: {
      high: 'Clear match',
      medium: 'Ek baar support se confirm karein',
      low: 'Thodi aur detail chahiye',
    },
    resultTitles: {
      source: 'Yeh product kyu aaya',
      basis: 'Kaunse pair par aaya',
      alternates: 'Aur options',
      resultHeader: 'Aapke kaam ke liye sujhav',
      viewProduct: 'Product dekhein',
      switchLabel: 'Yeh option dekhein',
      compareLabel: 'Compare',
      compareReady: 'Selected products compare karein',
      compareTitle: 'Suggested products compare karein',
      compareHelper: 'Decision lene se pehle useful differences ek saath dekhein.',
      bestFit: 'Is kaam ke liye best fit',
      alternateFit: 'Yeh kab choose karein',
      nextAction: 'Agla step',
      nextActionCopy: 'Product page kholo, recommendation share karo, ya doosre suitable option se compare karo.',
      summaryLine: 'Selected for',
      why: 'Yeh kyu sahi hai',
      apply: 'Kaise lagana hai',
      practical: 'Kaam ki zaroori baatein',
      practicalToggle: 'Practical guidance dekho',
      wait: 'Kitna rukna hai',
      clamp: 'Clamp chahiye ya nahi',
      warning: 'Surface warning',
      avoid: 'In baaton se bachna hai',
      unsure: 'Agar abhi bhi doubt ho',
    },
  },
} as const

const translations = {
  ...translationsBase,
  gu: {
    ...translationsBase.hi,
    languages: {
      ...translationsBase.hi.languages,
      gu: 'ગુજરાતી',
      rj: 'राजस्थानी',
    },
  },
  rj: {
    ...translationsBase.hinglish,
    languages: {
      ...translationsBase.hinglish.languages,
      gu: 'Gujarati',
      rj: 'Rajasthani',
    },
  },
} as const

const supportValues = {
  care: '+91-7311103331',
  mumbai: '+91-22-69224600',
  email: 'customercare@astraladhesives.com',
} as const

function renderBasisParts(basisLabel: string) {
  const parts = basisLabel.split('+').map((part) => part.trim()).filter(Boolean)
  return parts
}

function needsSurfacePair(jobType: AdvisorAnswers['jobType']) {
  return Boolean(jobType && !['Drain Cleaning', 'Gasket Making and Sealing', 'Thread sealing'].includes(jobType))
}

function needsArea(jobType: AdvisorAnswers['jobType']) {
  return jobType === 'Bonding'
}

function needsPriority(jobType: AdvisorAnswers['jobType']) {
  return jobType === 'Bonding'
}

function App() {
  const [language, setLanguage] = useState<AppLanguage | null>(null)
  const [answers, setAnswers] = useState<AdvisorAnswers>(initialAnswers)
  const [currentStep, setCurrentStep] = useState<StepId>('job-type')
  const [jobInput, setJobInput] = useState('')
  const [isListening, setIsListening] = useState(false)
  const [voiceStatus, setVoiceStatus] = useState('')
  const [lastParsed, setLastParsed] = useState<ParseResult | null>(null)
  const [selectedRecommendationId, setSelectedRecommendationId] = useState<string | null>(null)
  const [compareSelection, setCompareSelection] = useState<string[]>([])
  const [showComparison, setShowComparison] = useState(false)
  const [showPracticalGuide, setShowPracticalGuide] = useState(false)
  const recognitionRef = useRef<SpeechRecognition | null>(null)

  const activeLanguage = language === 'hi' ? 'hi' : 'en'
  const t = translations[activeLanguage]
  const jobTypeOptions = useMemo(() => getJobTypeOptions(activeLanguage), [activeLanguage])
  const surfaceOptions = useMemo(() => getSurfaceOptions(activeLanguage), [activeLanguage])
  const applicationAreaOptions = useMemo(() => getApplicationAreaOptions(activeLanguage), [activeLanguage])
  const bondStrengthOptions = useMemo(() => getBondStrengthOptions(activeLanguage), [activeLanguage])
  const jobShortcuts = useMemo(() => getJobShortcuts(activeLanguage), [activeLanguage])
  const recommendationOptions = useMemo(() => getRecommendationOptions(answers, activeLanguage), [answers, activeLanguage])
  const [languagePrompt, setLanguagePrompt] = useState<string>(translations.en.emptyPrompt)
  const visibleFlow = useMemo(() => {
    const steps: StepId[] = ['job-type']
    if (!answers.jobType || needsSurfacePair(answers.jobType)) {
      steps.push('surface-a', 'surface-b')
    }
    if (!answers.jobType || needsArea(answers.jobType)) {
      steps.push('area')
    }
    if (!answers.jobType || needsPriority(answers.jobType)) {
      steps.push('priority')
    }
    steps.push('result')
    return steps
  }, [answers.jobType])

  const currentFlowIndex = Math.max(visibleFlow.indexOf(currentStep), 0)
  const totalInteractiveSteps = Math.max(visibleFlow.length - 1, 1)
  const currentStepNumber = Math.min(currentFlowIndex + 1, totalInteractiveSteps)
  const progress = currentStep === 'result' ? 100 : (currentFlowIndex / totalInteractiveSteps) * 100

  const selectedJobType = jobTypeOptions.find((item) => item.id === answers.jobType)

  const selectedSurfaceA = surfaceOptions.find((item) => item.id === answers.surfaceA)
  const selectedSurfaceB = surfaceOptions.find((item) => item.id === answers.surfaceB)
  const selectedArea = applicationAreaOptions.find((item) => item.id === answers.applicationArea)
  const selectedPriority = bondStrengthOptions.find((item) => item.id === answers.bondStrength)
  const summaryItems = [
    selectedJobType ? { key: 'job-type' as StepId, label: t.summaryLabels.jobType, value: selectedJobType.label } : null,
    selectedSurfaceA ? { key: 'surface-a' as StepId, label: t.summaryLabels.surfaceA, value: selectedSurfaceA.label } : null,
    selectedSurfaceB ? { key: 'surface-b' as StepId, label: t.summaryLabels.surfaceB, value: selectedSurfaceB.label } : null,
    selectedArea ? { key: 'area' as StepId, label: t.summaryLabels.area, value: selectedArea.label } : null,
    selectedPriority ? { key: 'priority' as StepId, label: t.summaryLabels.priority, value: selectedPriority.label } : null,
  ].filter(Boolean) as Array<{ key: StepId; label: string; value: string }>
  const showTextInput = currentStep === 'job-type'
  const showDetectedPanel = !showTextInput && currentStep !== 'result' && Boolean(lastParsed)
  const recommendation =
    recommendationOptions.find((item) => item.id === selectedRecommendationId) ??
    recommendationOptions[0] ??
    null
  const isFallbackRecommendation = recommendation?.id === 'support-check'
  const detectedSignals = lastParsed ? getDetectedSignals(lastParsed.answers, activeLanguage) : []
  const refinementSuggestions = lastParsed?.refinementSuggestions ?? []
  const showVoiceStatus = Boolean(voiceStatus && voiceStatus !== t.voiceReady)
  const showSupportCard = lastParsed?.confidence === 'low' || (currentStep === 'result' && isFallbackRecommendation)
  const resultHeading =
    currentStep === 'result' && recommendation
      ? activeLanguage === 'hi'
        ? 'आपके काम के लिए सुझाव तैयार है'
        : 'Your recommendation is ready'
      : currentStep === 'job-type'
        ? t.heroTitle
        : t.stepTitles[currentStep]
  const currentSubtitle =
    currentStep === 'job-type'
      ? t.heroText
      : currentStep === 'result'
        ? recommendation?.heroNote ?? t.simpleRuleText
        : languagePrompt
  const comparisonProducts = recommendationOptions.filter((item) => compareSelection.includes(item.id))
  const comparisonRows = recommendation ? buildComparisonRows(comparisonProducts, answers, activeLanguage) : []
  const shareMessage = recommendation
    ? activeLanguage === 'hi'
      ? `${recommendation.product} इस काम के लिए सुझाया गया है: ${summaryItems.map((item) => item.value).join(' • ')}`
      : `${recommendation.product} was suggested for this job: ${summaryItems.map((item) => item.value).join(' • ')}`
    : ''
  const shareUrl = `https://wa.me/?text=${encodeURIComponent(shareMessage)}`

  const resetFlow = () => {
    setAnswers(initialAnswers)
    setCurrentStep('job-type')
    setJobInput('')
    setLastParsed(null)
    setSelectedRecommendationId(null)
    setCompareSelection([])
    setShowComparison(false)
    setShowPracticalGuide(false)
    setLanguagePrompt(t.emptyPrompt)
    setVoiceStatus(t.voiceReady)
  }

  const getPreviousStep = () => {
    const currentIndex = visibleFlow.indexOf(currentStep)
    if (currentIndex <= 0) return 'job-type'
    return visibleFlow[currentIndex - 1]
  }

  useEffect(() => {
    if (language) {
      setVoiceStatus(translations[activeLanguage].voiceReady)
    }
  }, [activeLanguage, language])

  useEffect(() => {
    if (recommendationOptions.length === 0) {
      setSelectedRecommendationId(null)
      setCompareSelection([])
      setShowComparison(false)
      setShowPracticalGuide(false)
      return
    }

    setSelectedRecommendationId((current) => {
      if (current && recommendationOptions.some((item) => item.id === current)) {
        return current
      }
      return recommendationOptions[0].id
    })

    setCompareSelection((current) => {
      const filtered = current.filter((id) => recommendationOptions.some((item) => item.id === id))
      if (filtered.length > 0) return filtered
      return recommendationOptions.slice(0, Math.min(2, recommendationOptions.length)).map((item) => item.id)
    })
  }, [recommendationOptions])

  useEffect(() => {
    if (!recommendation) return
    setCompareSelection((current) => {
      const withoutMissing = current.filter((id) => recommendationOptions.some((item) => item.id === id))
      const anchored = withoutMissing.includes(recommendation.id)
        ? withoutMissing
        : [recommendation.id, ...withoutMissing]
      return anchored.slice(0, 3)
    })
  }, [recommendation, recommendationOptions])

  useEffect(() => {
    return () => {
      recognitionRef.current?.stop()
    }
  }, [])

  const applyParsedInput = (input: string) => {
    if (!language) {
      return
    }
    const parsed = parseJobInput(input, activeLanguage)
    setLastParsed(parsed)
    setAnswers(parsed.answers)
    setCurrentStep(parsed.missingStep)
    setLanguagePrompt(parsed.prompt)
  }

  const toggleCompareSelection = (recommendationId: string) => {
    setCompareSelection((current) => {
      if (current.includes(recommendationId)) {
        if (recommendationId === recommendation?.id) {
          return current
        }
        return current.filter((id) => id !== recommendationId)
      }
      return [...current, recommendationId].slice(0, 3)
    })
  }

  const getSpeechLanguage = (selectedLanguage: AppLanguage) => {
    if (selectedLanguage === 'hi') return 'hi-IN'
    return 'en-IN'
  }

  const startVoiceInput = () => {
    if (!language) {
      return
    }

    const SpeechRecognitionApi =
      window.SpeechRecognition ?? window.webkitSpeechRecognition

    if (!SpeechRecognitionApi) {
      setVoiceStatus(t.voiceUnsupported)
      return
    }

    recognitionRef.current?.stop()

    const recognition = new SpeechRecognitionApi()
    recognition.continuous = false
    recognition.interimResults = false
    recognition.lang = getSpeechLanguage(language)

    recognition.onresult = (event) => {
      const transcript = event.results[0]?.[0]?.transcript?.trim() ?? ''
      if (!transcript) {
        setVoiceStatus(t.voiceError)
        setIsListening(false)
        return
      }
      setJobInput(transcript)
      setVoiceStatus(transcript)
      setIsListening(false)
      applyParsedInput(transcript)
    }

    recognition.onerror = () => {
      setVoiceStatus(t.voiceError)
      setIsListening(false)
    }

    recognition.onend = () => {
      setIsListening(false)
    }

    recognitionRef.current = recognition
    setVoiceStatus(t.voiceListening)
    setIsListening(true)
    recognition.start()
  }

  if (!language) {
    return (
      <main className="language-shell">
        <section className="language-gate">
          <div className="gate-top">
            <p className="eyebrow gate-eyebrow">{t.languageGateEyebrow}</p>
            <h1>{t.languageGateTitle}</h1>
            <p className="hero-text gate-text">{t.languageGateText}</p>
          </div>
          <div className="gate-body">
            <p className="gate-label">{t.languageGateEyebrow}</p>
            <div className="language-choice-grid">
              {(['en', 'hi'] as AppLanguage[]).map((option) => (
                <button
                  key={option}
                  className="language-card"
                  onClick={() => {
                    setLanguage(option)
                    setLanguagePrompt(translations[option].emptyPrompt)
                  }}
                  type="button"
                >
                  <span className="language-card-badge">{option === 'en' ? 'EN' : 'हि'}</span>
                  <span className="language-card-copy">
                    <strong>{translations[option].languages[option]}</strong>
                    <small>{option === 'en' ? 'Use English throughout the advisor' : 'पूरा advisor हिंदी में चलेगा'}</small>
                  </span>
                </button>
              ))}
            </div>
          </div>
        </section>
      </main>
    )
  }

  return (
    <main className="app-shell">
      <section className="workspace workspace-full">
        <header className="workspace-header">
          <div className="app-brand">
            <div className="brand-mark">+</div>
              <div className="workspace-header-copy">
                <div className="header-meta-row">
                  <p className="eyebrow">{t.appSub}</p>
                <span className="step-counter">
                  {currentStep === 'result'
                    ? activeLanguage === 'hi'
                      ? 'सिफारिश तैयार'
                      : 'Recommendation ready'
                    : `${t.stepCounter} ${currentStepNumber} ${t.of} ${totalInteractiveSteps}`}
                </span>
              </div>
              <h2>{resultHeading}</h2>
              <p className="workspace-subtitle">{currentSubtitle}</p>
            </div>
          </div>
          <button className="ghost-button ghost-button-subtle" onClick={resetFlow} type="button">
            {t.reset}
          </button>
        </header>

        <div className="progress-track" aria-hidden="true">
          <span className="progress-fill" style={{ width: `${progress}%` }} />
        </div>

        <div className="workspace-grid">
          <section className="question-panel" aria-live="polite">
            {currentStep !== 'result' && currentStep !== 'job-type' && (
              <div className="step-header">
                <p className="eyebrow">{t.stepCounter} {currentStepNumber}</p>
                <h3>{t.stepTitles[currentStep]}</h3>
                <p className="helper-copy">{languagePrompt}</p>
              </div>
            )}

            {currentStep === 'job-type' && (
              <>
                <div className="step-header step-header-tight">
                  <p className="eyebrow">{t.stepCounter} 1</p>
                  <h3>{t.stepTitles['job-type']}</h3>
                  <p className="helper-copy">{t.helper}</p>
                </div>
                <OptionGrid
                  options={jobTypeOptions}
                  value={answers.jobType}
                  onSelect={(id) => {
                    const nextAnswers = {
                      ...answers,
                      jobType: id as AdvisorAnswers['jobType'],
                      surfaceA: null,
                      surfaceB: null,
                      applicationArea: null,
                      bondStrength: null,
                    }
                    setAnswers(nextAnswers)
                    setLastParsed(null)
                    setCurrentStep(getNextMissingStep(nextAnswers))
                    setLanguagePrompt(getFollowUpPrompt(nextAnswers, activeLanguage))
                  }}
                  showNotes
                />
              </>
            )}

            {showTextInput ? (
              <div className={`language-panel ${currentStep === 'job-type' ? 'is-secondary' : ''}`}>
                <p className="eyebrow">{t.inputEyebrow}</p>
                <h3>{t.inputTitle}</h3>
                <p className="helper-copy">{t.inputHelper}</p>
                <div className="phrase-ribbon compact" aria-label={t.quickPhraseLabel}>
                  {jobShortcuts.map((shortcut) => (
                    <button
                      key={shortcut.id}
                      className="phrase-chip"
                      onClick={() => {
                        setJobInput(shortcut.example)
                        applyParsedInput(shortcut.example)
                      }}
                      type="button"
                    >
                      {shortcut.label}
                    </button>
                  ))}
                </div>
                <form
                  className="language-form"
                  onSubmit={(event) => {
                    event.preventDefault()
                    if (!jobInput.trim()) {
                      setLanguagePrompt(t.emptyPrompt)
                      return
                    }
                    applyParsedInput(jobInput)
                  }}
                >
                  <textarea
                    className="language-input"
                    onChange={(event) => setJobInput(event.target.value)}
                    placeholder={t.inputPlaceholder}
                    rows={4}
                    value={jobInput}
                  />
                  <div className="action-row">
                    <button className="primary-button" type="submit">
                      {t.inputButton}
                    </button>
                    <button
                      className={`voice-button ${isListening ? 'is-listening' : ''}`}
                      onClick={startVoiceInput}
                      type="button"
                    >
                      {isListening ? t.voiceListening : t.voiceButton}
                    </button>
                  </div>
                </form>
              </div>
            ) : showDetectedPanel ? (
              <div className="detected-panel">
                <div className="detected-panel-head">
                  <span className="glance-label">{t.detectedTitle}</span>
                  {lastParsed ? (
                    <span className={`confidence-pill confidence-${lastParsed.confidence}`}>
                      {t.confidence[lastParsed.confidence]}
                    </span>
                  ) : null}
                </div>
                {detectedSignals.length > 0 ? (
                  <div className="detected-chip-row">
                    {detectedSignals.map((signal) => (
                      <span className="detected-chip" key={`${signal.key}-${signal.value}`}>
                        {signal.value}
                      </span>
                    ))}
                  </div>
                ) : null}
                {lastParsed ? (
                  <div className="detected-interpretation">
                    <span className="glance-label">{t.detectedInterpretation}</span>
                    <p className="detected-copy">{lastParsed.interpretation}</p>
                  </div>
                ) : null}
                <p className="detected-copy">{languagePrompt}</p>
                {refinementSuggestions.length > 0 ? (
                  <div className="refinement-panel">
                    <ul className="refinement-list">
                      {refinementSuggestions.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}
                {showVoiceStatus ? <p className="voice-status">{voiceStatus}</p> : null}
              </div>
            ) : null}

            {currentStep === 'surface-a' && (
              <OptionGrid
                options={surfaceOptions}
                value={answers.surfaceA}
                onSelect={(id) => {
                  const nextAnswers = { ...answers, surfaceA: id }
                  setAnswers(nextAnswers)
                  setLastParsed(null)
                  setCurrentStep(getNextMissingStep(nextAnswers))
                  setLanguagePrompt(getFollowUpPrompt(nextAnswers, activeLanguage))
                }}
              />
            )}

            {currentStep === 'surface-b' && (
              <OptionGrid
                options={surfaceOptions}
                value={answers.surfaceB}
                onSelect={(id) => {
                  const nextAnswers = { ...answers, surfaceB: id }
                  setAnswers(nextAnswers)
                  setLastParsed(null)
                  setCurrentStep(getNextMissingStep(nextAnswers))
                  setLanguagePrompt(getFollowUpPrompt(nextAnswers, activeLanguage))
                }}
              />
            )}

            {currentStep === 'area' && (
              <OptionGrid
                options={applicationAreaOptions}
                value={answers.applicationArea}
                onSelect={(id) => {
                  const nextAnswers = { ...answers, applicationArea: id as AdvisorAnswers['applicationArea'] }
                  setAnswers(nextAnswers)
                  setLastParsed(null)
                  setCurrentStep(getNextMissingStep(nextAnswers))
                  setLanguagePrompt(getFollowUpPrompt(nextAnswers, activeLanguage))
                }}
              />
            )}

            {currentStep === 'priority' && (
              <OptionGrid
                options={bondStrengthOptions}
                value={answers.bondStrength}
                onSelect={(id) => {
                  const nextAnswers = { ...answers, bondStrength: id as AdvisorAnswers['bondStrength'] }
                  setAnswers(nextAnswers)
                  setLastParsed(null)
                  setCurrentStep(getNextMissingStep(nextAnswers))
                  setLanguagePrompt(getFollowUpPrompt(nextAnswers, activeLanguage))
                }}
              />
            )}

            {currentStep === 'result' && recommendation && (
              <div className="result-panel">
                <div className="result-hero">
                  <div className="result-hero-header">
                    <div>
                      <p className="eyebrow result-eyebrow">{t.recommendationEyebrow}</p>
                      <h3 className="result-hero-heading">{recommendation.sourceLabel}</h3>
                    </div>
                    <span className={`confidence-pill confidence-${recommendation.confidence}`}>
                      {t.confidence[recommendation.confidence]}
                    </span>
                  </div>
                  <div className="result-hero-grid">
                    <div className="result-title-block">
                      <h4 className="result-product-name">{recommendation.product}</h4>
                      <p className="result-subtitle">{recommendation.productType}</p>
                      {summaryItems.length > 0 ? (
                        <div className="hero-summary-line">
                          <span className="decision-label">{t.resultTitles.summaryLine}</span>
                          <strong className="decision-value">{summaryItems.map((item) => item.value).join(' • ')}</strong>
                        </div>
                      ) : null}
                      <p className="hero-note">{recommendation.heroNote}</p>
                      {recommendation.basisLabel ? (
                        <div className="basis-tags basis-tags-hero">
                          {renderBasisParts(recommendation.basisLabel).map((part) => (
                            <span className="basis-tag" key={part}>{part}</span>
                          ))}
                        </div>
                      ) : null}
                      {recommendation.pageUrl ? (
                        <a className="result-link" href={recommendation.pageUrl} rel="noreferrer" target="_blank">
                          {t.resultTitles.viewProduct}
                        </a>
                      ) : null}
                      {recommendationOptions.length > 1 ? (
                        <button
                          className="compare-toggle"
                          onClick={() => setShowComparison((current) => !current)}
                          type="button"
                        >
                          {showComparison ? t.resultTitles.switchLabel : t.resultTitles.compareLabel}
                        </button>
                      ) : null}
                    </div>
                    {recommendation.imageUrl ? (
                      <div className="product-packshot-frame">
                        <img
                          alt={recommendation.product}
                          className="product-packshot"
                          src={recommendation.imageUrl}
                        />
                      </div>
                    ) : null}
                  </div>
                </div>

                <section className="result-section">
                  <h4>{t.resultTitles.source}</h4>
                  <div className="decision-proof">
                    <ul className="proof-list">
                      {recommendation.why.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </section>

                {!isFallbackRecommendation && recommendation.alternateProducts.length > 0 && (
                  <section className="result-section">
                    <h4>{t.resultTitles.alternates}</h4>
                    <p className="result-section-copy">{t.resultTitles.compareHelper}</p>
                    <div className="alternate-option-list">
                      {recommendationOptions
                        .filter((item) => item.id !== recommendation.id)
                        .map((item) => (
                          <div
                            key={item.id}
                            className={`alternate-option-card ${selectedRecommendationId === item.id ? 'is-selected' : ''}`}
                          >
                            <div className="alternate-option-copy">
                              <span className="alternate-option-name">{item.product}</span>
                              <span className="alternate-option-reason">{item.heroNote}</span>
                              {item.alternateReason ? (
                                <span className="alternate-option-context">{t.resultTitles.alternateFit}</span>
                              ) : null}
                              {item.alternateReason ? (
                                <span className="alternate-option-note">{item.alternateReason}</span>
                              ) : null}
                            </div>
                            <div className="alternate-option-actions">
                              <button
                                className="alternate-view-link"
                                onClick={() => setSelectedRecommendationId(item.id)}
                                type="button"
                              >
                                {t.resultTitles.switchLabel}
                              </button>
                              <button
                                className={`compare-toggle compare-toggle-small ${compareSelection.includes(item.id) ? 'is-active' : ''}`}
                                onClick={() => toggleCompareSelection(item.id)}
                                type="button"
                              >
                                {t.resultTitles.compareLabel}
                              </button>
                            </div>
                          </div>
                        ))}
                    </div>
                    {compareSelection.length >= 2 && !showComparison ? (
                      <button
                        className="ghost-button compare-launch"
                        onClick={() => setShowComparison(true)}
                        type="button"
                      >
                        {t.resultTitles.compareReady}
                      </button>
                    ) : null}
                  </section>
                )}

                {showComparison && comparisonProducts.length >= 2 ? (
                  <ComparisonSection
                    activeRecommendationId={recommendation.id}
                    products={comparisonProducts}
                    rows={comparisonRows}
                    title={t.resultTitles.compareTitle}
                    bestFitLabel={t.resultTitles.bestFit}
                  />
                ) : null}

                {!isFallbackRecommendation ? (
                  <>
                    <PracticalGuideCard
                      title={t.resultTitles.practical}
                      toggleLabel={t.resultTitles.practicalToggle}
                      applyTitle={t.resultTitles.apply}
                      steps={recommendation.howToApply}
                      waitLabel={t.resultTitles.wait}
                      waitValue={recommendation.waitTime}
                      clampLabel={t.resultTitles.clamp}
                      clampValue={recommendation.clampNeed}
                      warningLabel={t.resultTitles.warning}
                      warningValue={recommendation.surfaceWarning}
                      avoidTitle={t.resultTitles.avoid}
                      avoidItems={recommendation.avoid}
                      open={showPracticalGuide}
                      onToggle={() => setShowPracticalGuide((current) => !current)}
                    />
                  </>
                ) : null}

                <section className="result-section next-action-section">
                  <h4>{t.resultTitles.nextAction}</h4>
                  <p className="result-section-copy">{t.resultTitles.nextActionCopy}</p>
                  <div className="next-action-row">
                    <a className="ghost-button next-action-link" href={shareUrl} rel="noreferrer" target="_blank">
                      {t.supportActions.share}
                    </a>
                    {isFallbackRecommendation ? (
                      <a className="support-action" href={`tel:${supportValues.care.replace(/[^+\d]/g, '')}`}>
                        {t.supportActions.call}
                      </a>
                    ) : compareSelection.length >= 2 ? (
                      <button className="ghost-button compare-secondary" onClick={() => setShowComparison(true)} type="button">
                        {t.resultTitles.compareReady}
                      </button>
                    ) : null}
                  </div>
                </section>
              </div>
            )}
          </section>

          <aside className="summary-panel">
            <p className="eyebrow">{t.summaryEyebrow}</p>
            <h3>{t.summaryTitle}</h3>

            {summaryItems.length > 0 ? (
              <div className="summary-chip-list summary-chip-list-structured">
                {summaryItems.map((item) => (
                  <button
                    className={`summary-chip ${currentStep === 'result' ? 'is-link' : ''}`}
                    key={item.label}
                    onClick={() => {
                      if (currentStep === 'result') {
                        setShowComparison(false)
                        setCurrentStep(item.key)
                      }
                    }}
                    type="button"
                  >
                    <span>{item.label}</span>
                    <strong>{item.value}</strong>
                  </button>
                ))}
              </div>
            ) : (
              <p className="summary-empty-text">{t.summaryEmpty}</p>
            )}

            {lastParsed && currentStep !== 'result' ? (
              <div className="summary-note summary-note-inline">
                <span className="glance-label">{t.detectedInterpretation}</span>
                <p>{lastParsed.interpretation}</p>
              </div>
            ) : null}

            {showSupportCard ? (
            <div className={`support-card ${currentStep === 'result' ? 'is-secondary' : ''}`}>
              <p className="eyebrow">{t.supportEyebrow}</p>
              <h4>{t.supportTitle}</h4>
              <ul className="contact-list">
                <li>
                  <span className="contact-label">{t.supportLabels.care}</span>
                  <strong className="contact-value">{supportValues.care}</strong>
                </li>
                <li>
                  <span className="contact-label">{t.supportLabels.mumbai}</span>
                  <strong className="contact-value">{supportValues.mumbai}</strong>
                </li>
                <li>
                  <span className="contact-label">{t.supportLabels.email}</span>
                  <strong className="contact-value">{supportValues.email}</strong>
                </li>
              </ul>
              <div className="support-actions">
                <a className="support-action" href={`tel:${supportValues.care.replace(/[^+\d]/g, '')}`}>
                  {t.supportActions.call}
                </a>
                <a className="support-action" href={`mailto:${supportValues.email}`}>
                  {t.supportActions.email}
                </a>
              </div>
            </div>
            ) : null}

            {currentStep !== 'job-type' && (
              <div className="summary-footer">
                <button
                  className="ghost-button summary-back"
                  onClick={() => setCurrentStep(getPreviousStep())}
                  type="button"
                >
                  {t.back}
                </button>
              </div>
            )}
          </aside>
        </div>
      </section>
    </main>
  )
}

function OptionGrid({
  onSelect,
  options,
  showNotes = false,
  value,
}: {
  onSelect: (id: string) => void
  options: LocalizedOption[]
  showNotes?: boolean
  value: string | null
}) {
  return (
    <div className="option-grid">
      {options.map((option) => (
        <button
          key={option.id}
          className={`option-tile ${value === option.id ? 'is-active' : ''} ${showNotes ? 'has-note' : ''}`}
          onClick={() => onSelect(option.id)}
          type="button"
        >
          <span className="option-title">{option.label}</span>
          {showNotes && option.note ? <small className="option-note">{option.note}</small> : null}
        </button>
      ))}
    </div>
  )
}

function ComparisonSection({
  activeRecommendationId,
  bestFitLabel,
  products,
  rows,
  title,
}: {
  activeRecommendationId: string
  bestFitLabel: string
  products: Recommendation[]
  rows: Array<{ label: string; values: string[] }>
  title: string
}) {
  return (
    <section className="result-section">
      <h4>{title}</h4>
      <div className="comparison-table" style={{ ['--comparison-columns' as string]: String(products.length) }}>
        <div className="comparison-head comparison-row">
          <div className="comparison-label-cell" />
          {products.map((product) => (
            <div className="comparison-value-cell comparison-product-head" key={product.id}>
              <strong>{product.product}</strong>
              {product.id === activeRecommendationId ? <span className="comparison-badge">{bestFitLabel}</span> : null}
            </div>
          ))}
        </div>
        {rows.map((row) => (
          <div className="comparison-row" key={row.label}>
            <div className="comparison-label-cell">{row.label}</div>
            {row.values.map((value, index) => (
              <div className="comparison-value-cell" key={`${row.label}-${products[index]?.id ?? index}`}>
                {value}
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  )
}

function PracticalGuideCard({
  applyTitle,
  avoidItems,
  avoidTitle,
  clampLabel,
  clampValue,
  onToggle,
  open,
  steps,
  toggleLabel,
  title,
  waitLabel,
  waitValue,
  warningLabel,
  warningValue,
}: {
  applyTitle: string
  avoidItems: string[]
  avoidTitle: string
  clampLabel: string
  clampValue: string
  onToggle: () => void
  open: boolean
  steps: string[]
  toggleLabel: string
  title: string
  waitLabel: string
  waitValue: string
  warningLabel: string
  warningValue: string
}) {
  return (
    <section className="result-section">
      <div className="practical-header">
        <h4>{title}</h4>
        <button className="ghost-button practical-toggle" onClick={onToggle} type="button">
          {toggleLabel}
        </button>
      </div>
      {open ? (
        <div className="practical-stack">
          <div className="practical-subsection">
            <span className="decision-label">{applyTitle}</span>
            <ol className="result-steps">
              {steps.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ol>
          </div>
          <div className="practical-subsection">
            <dl className="practical-guide">
              <div>
                <dt>{waitLabel}</dt>
                <dd>{waitValue}</dd>
              </div>
              <div>
                <dt>{clampLabel}</dt>
                <dd>{clampValue}</dd>
              </div>
              <div>
                <dt>{warningLabel}</dt>
                <dd>{warningValue}</dd>
              </div>
            </dl>
          </div>
          <div className="practical-subsection">
            <span className="decision-label">{avoidTitle}</span>
            <ul className="proof-list">
              {avoidItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}
    </section>
  )
}

export default App
