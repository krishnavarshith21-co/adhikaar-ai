import { SCHEMES } from './catalog';
import { assess } from './eligibility';
import type { Assessment, Citation, Language, Profile, Scheme } from './model';

export interface AssistantResponse {
  responseText: string;
  language: Language;
  citations: Citation[];
  suggestedNextSteps: string[];
  verificationStatus: 'DEMO' | 'SOURCE_GROUNDED' | 'UNVERIFIED';
  eligibility?: Assessment;
  conditions: string[];
  documents: string[];
  schemeId?: string;
  isGreeting?: boolean;
}

export const ASSISTANT_COPY = {
  en: {
    requesting: 'Requesting microphone…', reviewing: 'Review transcript', retryRecording: 'Retry Recording', editTranscript: 'Edit Transcript', unclear: 'Speech was unclear. Please record again.', detectLanguages: 'Detect mixed languages automatically',
    title: 'A little guidance. A clearer next step.',
    intro: 'Ask about a programme, understand its conditions, or prepare your documents.',
    question: 'Ask a question in English, Hindi, or Telugu...',
    send: 'Send',
    cancel: 'Cancel',
    retry: 'Retry',
    mic: 'Record or speak your question',
    stop: 'Stop recording',
    play: 'Listen',
    pause: 'Pause',
    replay: 'Replay',
    resume: 'Resume',
    speed: 'Speed',
    autoPlay: 'Auto-play voice',
    speakingNow: 'Speaking response...',
    you: 'You',
    guide: 'ADHIKAAR Guide',
    sources: 'Official references',
    conditions: 'Key conditions to confirm',
    documents: 'Preparation checklist — confirm requirements',
    next: 'Recommended next step',
    demo: 'Demo — illustrative response',
    grounded: 'Source-grounded explanation · not official advice',
    unverified: 'Preliminary guidance · verify with official authority',
    record: 'Recording',
    listeningVoice: 'Listening... Speak your question now',
    review: 'Transcript ready. Review and edit before sending.',
    ready: 'Ready',
    listening: 'Listening',
    transcribing: 'Transcribing speech...',
    responding: 'Preparing guidance...',
    speaking: 'Speaking guidance',
    error: 'Notice',
    voiceNote: 'Select English, Hindi or Telugu as a speech hint. Review the recognized text before sending.',
    voiceUnavailable: 'Speech synthesis is not available on this device. Text response is displayed above.',
    unsupported: 'Speech recognition is not supported in this browser. Please type your query.',
    permission: 'Microphone access was denied. Please allow microphone permission in your browser or type your question.',
    missingMic: 'No microphone detected on your device. Please type your question.',
    interrupted: 'Recording was interrupted. Please try speaking again.',
    silent: 'No speech was detected. Please try recording again or type your question.',
    service: 'The guidance service could not complete this request. Please retry or type your query.',
    reviewHint: 'Microphone permission is requested on click. Recorded audio is sent for transcription after you stop; review before submitting.',
    fallback: "I couldn't identify a specific government scheme from your question. Could you clarify if you are asking about higher education loans (PM-Vidyalaxmi), agricultural support (Telangana Rythu Bharosa), or micro-enterprise loans (PM-MUDRA)?",
    greeting: "Namaste! I am your ADHIKAAR Guide, your civic companion for central and state welfare opportunities across India. I can help you understand preliminary eligibility, verify criteria, and prepare documents for education loans, farmer assistance, and enterprise credit. Which scheme would you like to explore?",
    disclaimer: 'Preliminary criteria only. The responsible authority or lender determines official eligibility and approval.',
    guestNote: 'Explore with a Demo account to start chatting with ADHIKAAR Guide.',
    exploreDemoCta: 'Explore with Demo Account',
    signInCta: 'Sign In',
    statuses: {
      POTENTIALLY_ELIGIBLE: 'Potentially eligible based on preliminary criteria',
      MORE_INFORMATION_NEEDED: 'Additional details needed to assess eligibility',
      NOT_ELIGIBLE_BASED_ON_KNOWN_RULES: 'Known preliminary criteria not met',
    },
    steps: [
      'Review the official scheme guidelines on the authorized government portal.',
      'Gather and cross-verify required documents before applying.',
      'Submit your application strictly through the official department or accredited bank.',
    ],
  },
  hi: {
    requesting: 'माइक्रोफ़ोन की अनुमति माँगी जा रही है…', reviewing: 'लिप्यंतरण की समीक्षा करें', retryRecording: 'फिर से रिकॉर्ड करें', editTranscript: 'लिप्यंतरण संपादित करें', unclear: 'आवाज़ स्पष्ट नहीं थी। कृपया फिर से रिकॉर्ड करें।', detectLanguages: 'मिश्रित भाषाएँ स्वतः पहचानें',
    title: 'सही जानकारी से अगला कदम आसान।',
    intro: 'योजना की शर्तें समझें और आवश्यक दस्तावेज़ों की तैयारी करें।',
    question: 'हिन्दी, अंग्रेज़ी या तेलुगु में प्रश्न पूछें...',
    send: 'भेजें',
    cancel: 'रद्द करें',
    retry: 'फिर कोशिश करें',
    mic: 'प्रश्न बोलें या रिकॉर्ड करें',
    stop: 'रिकॉर्डिंग रोकें',
    play: 'सुनें',
    pause: 'विराम दें',
    replay: 'फिर सुनें',
    resume: 'जारी रखें',
    speed: 'गति',
    autoPlay: 'आवाज़ स्वतः चलाएं',
    speakingNow: 'उत्तर सुनाया जा रहा है...',
    you: 'आप',
    guide: 'अधिकार मार्गदर्शक',
    sources: 'आधिकारिक स्रोत',
    conditions: 'पुष्टि योग्य मुख्य शर्तें',
    documents: 'तैयारी के आवश्यक दस्तावेज़',
    next: 'अनुशंसित अगला कदम',
    demo: 'डेमो — केवल उदाहरण',
    grounded: 'स्रोत आधारित व्याख्या · आधिकारिक सलाह नहीं',
    unverified: 'प्रारंभिक मार्गदर्शन · संबंधित प्राधिकरण से पुष्टि करें',
    record: 'रिकॉर्डिंग जारी',
    listeningVoice: 'सुन रहे हैं... अपना प्रश्न बोलें',
    review: 'लिप्यंतरण तैयार है। भेजने से पहले जाँचें और सुधारें।',
    ready: 'तैयार',
    listening: 'सुन रहा है',
    transcribing: 'आवाज़ का रूपांतरण हो रहा है...',
    responding: 'सत्यापित उत्तर तैयार हो रहा है...',
    speaking: 'उत्तर बोल रहा है',
    error: 'सूचना',
    voiceNote: 'वॉयस असिस्टेंट हिन्दी (hi-IN), अंग्रेज़ी (en-IN), और तेलुगु (te-IN) का समर्थन करता है।',
    voiceUnavailable: 'इस उपकरण पर आवाज़ उपलब्ध नहीं है। आप लिखित उत्तर पढ़ सकते हैं।',
    unsupported: 'इस ब्राउज़र में आवाज़ पहचान उपलब्ध नहीं है। कृपया लिखकर प्रश्न पूछें।',
    permission: 'माइक्रोफ़ोन की अनुमति नहीं मिली। कृपया ब्राउज़र सेटिंग्स में अनुमति दें या प्रश्न लिखें।',
    missingMic: 'कोई माइक्रोफ़ोन नहीं मिला। कृपया प्रश्न टाइप करें।',
    interrupted: 'रिकॉर्डिंग बाधित हुई। कृपया पुनः बोलें।',
    silent: 'कोई आवाज़ नहीं मिली। कृपया पुनः रिकॉर्ड करें या टाइप करें।',
    service: 'सेवा अनुरोध पूरा नहीं कर सकी। कृपया पुनः प्रयास करें।',
    reviewHint: 'क्लिक करने पर माइक्रोफ़ोन अनुमति माँगी जाएगी। भेजने से पहले पाठ की जाँच करें।',
    fallback: 'मैं आपके प्रश्न से किसी विशिष्ट योजना की पहचान नहीं कर सका। क्या आप उच्च शिक्षा ऋण (पीएम-विद्यालक्ष्मी), कृषि सहायता (तेलंगाना रैतु भरोसा), या सूक्ष्म उद्यम ऋण (पीएम-मुद्रा) के बारे में जानना चाहते हैं?',
    greeting: 'नमस्ते! मैं आपका अधिकार मार्गदर्शक हूँ। मैं आपको सरकारी व गैर-सरकारी कल्याणकारी योजनाओं — शिक्षा ऋण, किसान सहायता, और व्यापार ऋण — की पात्रता समझने और दस्तावेज़ तैयार करने में सहायता कर सकता हूँ। आप किस योजना के बारे में पूछना चाहते हैं?',
    disclaimer: 'यह केवल प्रारंभिक जाँच है। अंतिम पात्रता और मंज़ूरी का निर्णय संबंधित विभाग या बैंक करता है।',
    guestNote: 'अधिकार मार्गदर्शक से बातचीत शुरू करने के लिए डेमो खाते से अन्वेषण करें।',
    exploreDemoCta: 'डेमो खाते से अन्वेषण करें',
    signInCta: 'साइन इन करें',
    statuses: {
      POTENTIALLY_ELIGIBLE: 'प्रारंभिक मानदंडों के आधार पर संभावित रूप से पात्र',
      MORE_INFORMATION_NEEDED: 'पात्रता आकलन के लिए अतिरिक्त जानकारी आवश्यक',
      NOT_ELIGIBLE_BASED_ON_KNOWN_RULES: 'ज्ञात प्रारंभिक शर्तें पूरी नहीं होतीं',
    },
    steps: [
      'आधिकारिक सरकारी पोर्टल पर योजना की वर्तमान मार्गदर्शिका पढ़ें।',
      'आवेदन करने से पहले सभी आवश्यक दस्तावेज़ एकत्रित व सत्यापित करें।',
      'केवल अधिकृत विभाग या मान्यता प्राप्त बैंक के माध्यम से ही आवेदन करें।',
    ],
  },
  te: {
    requesting: 'మైక్రోఫోన్ అనుమతి కోరుతోంది…', reviewing: 'లిప్యంతరీకరణను పరిశీలించండి', retryRecording: 'మళ్లీ రికార్డ్ చేయండి', editTranscript: 'లిప్యంతరీకరణను సవరించండి', unclear: 'మాటలు స్పష్టంగా లేవు. దయచేసి మళ్లీ రికార్డ్ చేయండి.', detectLanguages: 'మిశ్రమ భాషలను స్వయంగా గుర్తించండి',
    title: 'స్పష్టమైన సమాచారంతో ముందడుగు.',
    intro: 'పథకం షరతులను తెలుసుకోండి, అవసరమైన పత్రాలను సిద్ధం చేసుకోండి.',
    question: 'తెలుగు, ఇంగ్లీష్ లేదా హిందీలో మీ ప్రశ్నను అడగండి...',
    send: 'పంపండి',
    cancel: 'రద్దు చేయండి',
    retry: 'మళ్లీ ప్రయత్నించండి',
    mic: 'ప్రశ్నను మాట్లాడండి లేదా రికార్డు చేయండి',
    stop: 'రికార్డింగ్ ఆపండి',
    play: 'వినండి',
    pause: 'విరామం',
    replay: 'మళ్లీ వినండి',
    resume: 'కొనసాగించండి',
    speed: 'వేగం',
    autoPlay: 'వాయిస్ ఆటో-ప్లే',
    speakingNow: 'సమాధానం వినిపిస్తోంది...',
    you: 'మీరు',
    guide: 'అధికార మార్గదర్శి',
    sources: 'అధికారిక మూలాలు',
    conditions: 'నిర్ధారించుకోవాల్సిన ముఖ్య షరతులు',
    documents: 'సిద్ధం చేసుకోవాల్సిన ముఖ్య పత్రాలు',
    next: 'తదుపరి సిఫార్సు దశ',
    demo: 'డెమో — ఉదాహరణ మాత్రమే',
    grounded: 'మూలాల ఆధారిత వివరణ · అధికారిక సలహా కాదు',
    unverified: 'ప్రాథమిక మార్గదర్శనం · అధికారిక విభాగంతో ధృవీకరించుకోండి',
    record: 'రికార్డింగ్ జరుగుతోంది',
    listeningVoice: 'వింటున్నాము... మీ ప్రశ్నను మాట్లాడండి',
    review: 'లిప్యంతరీకరణ సిద్ధమైంది. పంపే ముందు పరిశీలించి సరిదిద్దండి.',
    ready: 'సిద్ధం',
    listening: 'వింటోంది',
    transcribing: 'మాటలను వచనంగా మారుస్తోంది...',
    responding: 'సమాధానం సిద్ధమవుతోంది...',
    speaking: 'సమాధానం మాట్లాడుతోంది',
    error: 'గమనిక',
    voiceNote: 'వాయిస్ అసిస్టెంట్ తెలుగు (te-IN), ఇంగ్లీష్ (en-IN), మరియు హిందీ (hi-IN) లకు మద్దతు ఇస్తుంది.',
    voiceUnavailable: 'ఈ పరికరంలో వాయిస్ అందుబాటులో లేదు. వచన సమాధానాన్ని పైన చూడవచ్చు.',
    unsupported: 'ఈ బ్రౌజర్‌లో వాయిస్ గుర్తింపు అందుబాటులో లేదు. దయచేసి టైప్ చేయండి.',
    permission: 'మైక్రోఫోన్ అనుమతి నిరాకరించబడింది. దయచేసి బ్రౌజర్ సెట్టింగ్స్‌లో అనుమతించండి లేదా టైప్ చేయండి.',
    missingMic: 'మైక్రోఫోన్ గుర్తించబడలేదు. దయచేసి ప్రశ్నను టైప్ చేయండి.',
    interrupted: 'రికార్డింగ్ మధ్యలో ఆగింది. దయచేసి మళ్లీ మాట్లాడండి.',
    silent: 'మాటలు గుర్తించబడలేదు. దయచేసి మళ్లీ రికార్డు చేయండి లేదా టైప్ చేయండి.',
    service: 'సేవ అభ్యర్థనను పూర్తి చేయలేకపోయింది. దయచేసి మళ్లీ ప్రయత్నించండి.',
    reviewHint: 'క్లిక్ చేసినప్పుడు మైక్రోఫోన్ అనుమతి కోరబడుతుంది. పంపే ముందు వచనాన్ని పరిశీలించండి.',
    fallback: 'మీ ప్రశ్న నుండి నిర్దిష్ట సంక్షేమ పథకాన్ని గుర్తించలేకపోయాను. ఉన్నత విద్యా రుణాలు (పీఎం-విద్యాలక్ష్మి), వ్యవసాయ సహాయం (తెలంగాణ రైతు భరోసా), లేదా చిన్న వ్యాపార రుణాలు (పీఎం-ముద్ర) గురించి వివరాలు తెలుసుకోవాలనుకుంటున్నారా?',
    greeting: 'నమస్కారం! నేను మీ అధికార మార్గదర్శిని. కేంద్ర మరియు రాష్ట్ర సంక్షేమ పథకాలు, ప్రాథమిక అర్హతలు, మరియు పత్రాల తయారీలో మీకు సహాయం చేయడానికి ఇక్కడ ఉన్నాను. విద్యా రుణాలు, రైతు సాయం, లేదా వ్యాపార రుణాల గురించి మీరు ఏ పథకంపై సమాచారం కోరుకుంటున్నారు?',
    disclaimer: 'ఇది ప్రాథమిక పరిశీలన మాత్రమే. తుది అర్హత మరియు ఆమోదం సంబంధిత శాఖ లేదా బ్యాంకు నిర్ణయంపై ఆధారపడి ఉంటుంది.',
    guestNote: 'అధికార మార్గదర్శితో మాట్లాడటానికి డెమో ఖాతాతో ప్రారంభించండి.',
    exploreDemoCta: 'డెమో ఖాతాతో ప్రారంభించండి',
    signInCta: 'లాగిన్ అవ్వండి',
    statuses: {
      POTENTIALLY_ELIGIBLE: 'ప్రాథమిక నిబంధనల ప్రకారం అర్హత ఉండవచ్చు',
      MORE_INFORMATION_NEEDED: 'అర్హతను నిర్ధారించడానికి అదనపు వివరాలు అవసరం',
      NOT_ELIGIBLE_BASED_ON_KNOWN_RULES: 'తెలిసిన ప్రాథమిక షరతులు సరిపోలలేదు',
    },
    steps: [
      'అధికారిక ప్రభుత్వ పోర్టల్‌లో ప్రస్తుత పథక మార్గదర్శకాలను చదవండి.',
      'దరఖాస్తు చేయడానికి ముందు అవసరమైన అన్ని పత్రాలను సేకరించి పరిశీలించండి.',
      'అధికారిక విభాగం లేదా అధీకృత బ్యాంకు ద్వారా మాత్రమే దరఖాస్తును సమర్పించండి.',
    ],
  },
};

// Translations of the conservative catalogue, not additional eligibility or document mandates.
const localized: Record<string, Record<Language, { summary: string; conditions: string[]; documents: string[]; nextStep: string }>> = Object.fromEntries(SCHEMES.map(s => [s.id, {
  en: { summary: s.description, conditions: s.conditions, documents: s.documents.map(d => d.name), nextStep: s.documentNote },
  hi: s.id === 'pm-vidyalaxmi' ? {
    summary: 'वर्तमान QHEI सूची के संस्थान में मेरिट पर प्रवेश पाने वाले छात्रों के लिए शिक्षा ऋण। यह छात्रवृत्ति या अनुदान नहीं है; बैंक की जाँच लागू होती है।',
    conditions: ['वर्तमान QHEI सूची के संस्थान में मेरिट पर प्रवेश की पुष्टि करें।', 'बैंक और वर्तमान योजना के नियम लागू होते हैं।', 'ब्याज सहायता के लिए आय और अन्य लाभों की अलग जाँच आवश्यक है।'],
    documents: ['प्रवेश पत्र और संस्थान का विवरण', 'पाठ्यक्रम शुल्क विवरण', 'शैक्षणिक रिकॉर्ड', 'बैंक द्वारा माँगा गया पहचान प्रमाण', 'ब्याज सहायता के लिए पारिवारिक आय प्रमाण'],
    nextStep: 'यह तैयारी की प्रारंभिक सूची है। वर्तमान दस्तावेज़ आवश्यकताएँ संस्थान और बैंक से जाँचें।',
  } : s.id === 'ts-rythu-bharosa' ? {
    summary: 'तेलंगाना में कृषि निवेश सहायता, जिसने रैतु बंधु का स्थान लिया। भूमि रिकॉर्ड और वर्तमान प्रशासनिक शर्तों की आधिकारिक जाँच आवश्यक है।',
    conditions: ['तेलंगाना में निवास और कृषि गतिविधि।', 'पात्र कृषि योग्य भूमि या मान्य काश्तकारी श्रेणी की पुष्टि करें।', 'किरायेदार और विशेष मामलों के लिए संबंधित अधिकारी से पुष्टि करें।'],
    documents: ['तेलंगाना निवास का प्रमाण', 'लागू भूमि या मान्य काश्तकारी रिकॉर्ड', 'संबंधित अधिकारी द्वारा माँगा गया बैंक विवरण'],
    nextStep: 'अपने कृषि कार्यालय से काश्तकारी श्रेणी और वर्तमान दस्तावेज़ सूची की पुष्टि करें।',
  } : {
    summary: 'भागीदार ऋणदाताओं के माध्यम से सूक्ष्म उद्यमों के लिए ऋण। ऋणदाता की जाँच और पुनर्भुगतान की शर्तें लागू होती हैं।',
    conditions: ['पात्र आय-सृजक सूक्ष्म उद्यम गतिविधि।', 'ऋणदाता व्यवसाय, ऋण उद्देश्य और भुगतान क्षमता की जाँच करता है।', 'वर्तमान ऋण श्रेणियाँ और सीमाएँ बैंक से जाँचें; स्वीकृति की गारंटी नहीं है।'],
    documents: ['व्यवसाय और ऋण उद्देश्य का विवरण', 'ऋणदाता द्वारा माँगा गया पहचान और पता प्रमाण', 'ऋणदाता द्वारा माँगे गए बैंक रिकॉर्ड'],
    nextStep: 'ऋणदाता से वर्तमान आवेदन और दस्तावेज़ों की अंतिम सूची प्राप्त करें।',
  },
  te: s.id === 'pm-vidyalaxmi' ? {
    summary: 'ప్రస్తుత QHEI జాబితాలోని సంస్థలో మెరిట్ ఆధారంగా ప్రవేశం పొందిన విద్యార్థుల కోసం విద్యా రుణం. ఇది స్కాలర్‌షిప్ లేదా గ్రాంటు కాదు; బ్యాంకు పరిశీలన వర్తిస్తుంది.',
    conditions: ['ప్రస్తుత QHEI జాబితాలోని సంస్థలో మెరిట్ ప్రవేశాన్ని నిర్ధారించండి.', 'బ్యాంకు పరిశీలన మరియు ప్రస్తుత పథకం నిబంధనలు వర్తిస్తాయి.', 'వడ్డీ సహాయానికి ఆదాయం, ఇతర ప్రయోజనాలపై ప్రత్యేక పరిశీలన అవసరం.'],
    documents: ['ప్రవేశ పత్రం మరియు సంస్థ వివరాలు', 'కోర్సు ఫీజుల వివరాలు', 'విద్యా రికార్డులు', 'బ్యాంకు కోరిన గుర్తింపు పత్రం', 'వడ్డీ సహాయం కోసం కుటుంబ ఆదాయ ఆధారం'],
    nextStep: 'ఇది ప్రాథమిక సన్నద్ధత జాబితా. ప్రస్తుత పత్రాల అవసరాలను సంస్థ మరియు బ్యాంకుతో నిర్ధారించండి.',
  } : s.id === 'ts-rythu-bharosa' ? {
    summary: 'రైతు బంధు స్థానంలో తెలంగాణలో వ్యవసాయ పెట్టుబడి సహాయం. భూ రికార్డులు మరియు ప్రస్తుత నిబంధనలను సంబంధిత అధికారులు పరిశీలించాలి.',
    conditions: ['తెలంగాణ నివాసం మరియు వ్యవసాయ కార్యకలాపాలు.', 'అర్హమైన సాగుభూమి లేదా గుర్తింపు పొందిన కౌలు హోదాను నిర్ధారించండి.', 'కౌలు రైతులు మరియు ప్రత్యేక సందర్భాల్లో అధికారుల నిర్ధారణ అవసరం.'],
    documents: ['తెలంగాణ నివాస ఆధారం', 'వర్తించే భూమి లేదా గుర్తింపు పొందిన కౌలు రికార్డులు', 'అధికారులు కోరిన బ్యాంకు వివరాలు'],
    nextStep: 'మీ కౌలు హోదా మరియు ప్రస్తుత పత్రాల జాబితాను వ్యవసాయ కార్యాలయంతో నిర్ధారించండి.',
  } : {
    summary: 'భాగస్వామ్య రుణదాతల ద్వారా సూక్ష్మ వ్యాపారాలకు రుణం. రుణదాత పరిశీలన మరియు తిరిగి చెల్లింపు బాధ్యతలు వర్తిస్తాయి.',
    conditions: ['అర్హమైన ఆదాయాన్ని సమకూర్చే సూక్ష్మ వ్యాపారం.', 'వ్యాపారం, రుణ ఉద్దేశం మరియు చెల్లింపు సామర్థ్యాన్ని రుణదాత పరిశీలిస్తారు.', 'ప్రస్తుత రుణ విభాగాలు, పరిమితులను బ్యాంకుతో నిర్ధారించండి; ఆమోదానికి హామీ లేదు.'],
    documents: ['వ్యాపార కార్యకలాపం మరియు రుణ ఉద్దేశం వివరాలు', 'రుణదాత కోరిన గుర్తింపు మరియు చిరునామా ఆధారం', 'రుణదాత కోరిన బ్యాంకు రికార్డులు'],
    nextStep: 'ప్రస్తుత దరఖాస్తు మరియు తుది పత్రాల జాబితాను రుణదాత నుండి పొందండి.',
  },
}])) as Record<string, Record<Language, { summary: string; conditions: string[]; documents: string[]; nextStep: string }>>;

// Rich multilingual code-switching keywords mapping
const SCHEME_INTENTS: { id: string; keywords: string[] }[] = [
  {
    id: 'pm-vidyalaxmi',
    keywords: [
      'vidya', 'vidyalaxmi', 'vidyalakshmi', 'education', 'student', 'scholarship', 'fellowship',
      'college', 'university', 'degree', 'fees', 'tuition', 'study loan', 'higher education',
      'qhei', 'engineering', 'medical college', 'admission',
      // Hindi / Hinglish
      'विद्या', 'शिक्षा', 'छात्र', 'छात्रा', 'कॉलेज', 'पढ़ाई', 'फीस', 'शिक्षा ऋण', 'एडमिशन',
      'padhai', 'padhai ke liye', 'college fee', 'fee ke liye', 'higher study', 'shiksha',
      // Telugu / Tenglish
      'విద్య', 'చదువు', 'విద్యార్థి', 'ఫీజు', 'కాలేజీ', 'ఉన్నత చదువు', 'విద్యా రుణం',
      'chaduvu', 'chaduvukovadaniki', 'colleji', 'colleji fees', 'appu',
    ],
  },
  {
    id: 'ts-rythu-bharosa',
    keywords: [
      'rythu', 'bharosa', 'bandhu', 'farmer', 'farm', 'agriculture', 'cultivation', 'telangana',
      'pattadar', 'passbook', 'dharani', 'crop', 'kisan',
      // Hindi / Hinglish
      'रैतु', 'भरोसा', 'बंधु', 'किसान', 'खेती', 'कृषि', 'तेलंगाना', 'फसल', 'जमीन',
      'kheti', 'fasal', 'kisan sahayata', 'krishi',
      // Telugu / Tenglish
      'రైతు', 'భరోసా', 'బంధు', 'వ్యవసాయ', 'రైతులు', 'పంట', 'భూమి', 'సాగు', 'తెలంగాణ',
      'panta', 'vyavasayam', 'vyavasaya sahayam', 'bhoomi', 'rythu saayam',
    ],
  },
  {
    id: 'pm-mudra',
    keywords: [
      'mudra', 'pmmy', 'entrepreneur', 'business', 'artisan', 'enterprise', 'micro enterprise',
      'shop', 'store', 'startup', 'credit', 'shishu', 'kishore', 'tarun', 'trade', 'commercial loan',
      // Hindi / Hinglish
      'मुद्रा', 'व्यवसाय', 'उद्यम', 'दुकान', 'व्यापार', 'छोटा व्यवसाय', 'रोजगार',
      'dukaan', 'chota business', 'vyapar', 'apna kaam', 'business loan', 'kamai',
      // Telugu / Tenglish
      'ముద్ర', 'వ్యాపార', 'చిన్న వ్యాపారం', 'దుకాణం', 'స్వయం ఉపాధి', 'వ్యాపార రుణం',
      'vyaparam', 'vyaparam kosam', 'dukanam', 'chinnathanam', 'self employment',
    ],
  },
];

const GREETING_KEYWORDS = [
  'hello', 'hi', 'hey', 'namaste', 'namaskar', 'namaskaram', 'good morning', 'good afternoon',
  'good evening', 'help', 'who are you', 'what can you do', 'what is adhikaar',
  'नमस्ते', 'प्रणाम', 'सहायता', 'मदद', 'आप कौन हैं',
  'నమస్కారం', 'హలో', 'సహాయం', 'మీరు ఎవరు',
];

export function isGreetingMessage(message: string): boolean {
  const clean = message.trim().toLowerCase();
  if (clean.length < 2) return false;
  return GREETING_KEYWORDS.some(k => clean === k || clean.startsWith(k + ' ') || clean.endsWith(' ' + k));
}

export function relevantScheme(message: string, explicit?: string): Scheme | undefined {
  if (explicit) return SCHEMES.find((s) => s.id === explicit);
  const normalized = message.trim().toLowerCase();

  // Find all schemes that match keywords
  const matchedSchemes = SCHEMES.filter((s) => {
    const intent = SCHEME_INTENTS.find((i) => i.id === s.id);
    const allKeywords = intent ? [...s.keywords, ...intent.keywords] : s.keywords;
    return allKeywords.some((k) => normalized.includes(k.toLowerCase()));
  });

  // If exactly one scheme matches, return it. If multiple or none match, return undefined.
  return matchedSchemes.length === 1 ? matchedSchemes[0] : undefined;
}

export function baseAnswer(language: Language, profile: Profile, schemeId?: string, demo = false): AssistantResponse {
  const copy = ASSISTANT_COPY[language];
  const scheme = SCHEMES.find((s) => s.id === schemeId);
  const content = scheme && localized[scheme.id]?.[language];

  if (!scheme || !content) {
    return {
      responseText: copy.greeting,
      language,
      citations: [],
      suggestedNextSteps: copy.steps,
      verificationStatus: demo ? 'DEMO' : 'UNVERIFIED',
      conditions: [],
      documents: [],
      isGreeting: true,
    };
  }

  // Empathetic and structured civic specialist response
  const empathyIntro = {
    en: `I am here to guide you through ${scheme.name}. Let us look at what this programme covers, the key qualifying conditions, and the documents you need to prepare:`,
    hi: `मैं ${scheme.name} के बारे में आपका मार्गदर्शन करने के लिए उपस्थित हूँ। आइए समझें कि यह योजना क्या लाभ देती है, इसकी मुख्य शर्तें क्या हैं, और आपको कौन से दस्तावेज़ तैयार रखने चाहिए:`,
    te: `${scheme.name} గురించి మీకు స్పష్టమైన మార్గదర్శకత్వం అందించడానికి నేను ఇక్కడ ఉన్నాను. ఈ పథకం ఏ ప్రయోజనాలను అందిస్తుంది, ముఖ్యమైన అర్హత నిబంధనలు ఏమిటి, మరియు ఏయే పత్రాలు అవసరమో చూద్దాం:`,
  }[language];

  const formattedResponse = `${empathyIntro}\n\n${content.summary}\n\n${copy.disclaimer}`;

  return {
    responseText: formattedResponse,
    language,
    citations: [scheme.source],
    suggestedNextSteps: [content.nextStep, ...copy.steps],
    verificationStatus: demo ? 'DEMO' : 'UNVERIFIED',
    eligibility: assess(profile, scheme.id),
    conditions: content.conditions,
    documents: content.documents,
    schemeId: scheme.id,
  };
}

export function safeCitation(url: string) {
  try {
    const u = new URL(url);
    return u.protocol === 'https:' && SCHEMES.some(s => s.source.url === url || s.portal === url);
  } catch {
    return false;
  }
}

export function validateExplanation(value: unknown, evidence: string, language: Language): string | null {
  if (!value || typeof value !== 'object') return null;
  const v = value as Record<string, unknown>;
  if (
    typeof v.explanation !== 'string' ||
    typeof v.evidenceQuote !== 'string' ||
    v.language !== language ||
    v.explanation.length > 2400 ||
    v.evidenceQuote.length < 30 ||
    !evidence.includes(v.evidenceQuote)
  )
    return null;
  if (/https?:|www\.|api.?key|system prompt|guaranteed|officially approved|you are eligible|ignore (previous|all)|मंज़ूरी मिल गई|ఆమోదించబడింది/i.test(v.explanation))
    return null;
  if (/[0-9₹%\u0966-\u096f\u0c66-\u0c6f]/.test(v.explanation)) return null;
  if ((language === 'hi' && !/[\u0900-\u097f]/.test(v.explanation)) || (language === 'te' && !/[\u0c00-\u0c7f]/.test(v.explanation)))
    return null;
  return v.explanation;
}

/**
 * Phonetically normalizes Indian acronyms, scheme names, and symbols for natural TTS speech
 */
export function normalizeIndianSpeech(text: string, language: Language): string {
  let cleaned = text
    .replace(/₹\s*([0-9,]+)/g, `$1 ${language === 'hi' ? 'रुपये' : language === 'te' ? 'రూపాయలు' : 'rupees'}`)
    .replace(/Rs\.?\s*([0-9,]+)/gi, '$1 rupees')
    .replace(/PM-Vidyalaxmi/gi, 'P M Vidyalaxmi')
    .replace(/TS-Rythu-Bharosa/gi, 'Telangana Rythu Bharosa')
    .replace(/PM-MUDRA/gi, 'P M Mudra')
    .replace(/PMMY/gi, 'P M M Y')
    .replace(/QHEI/gi, 'Quality Higher Education Institution')
    .replace(/DBT/gi, 'D B T')
    .replace(/NGO/gi, 'N G O')
    .replace(/AEO/gi, 'Agriculture Extension Officer')
    .replace(/KYC/gi, 'K Y C')
    .replace(/Bonafide/gi, 'bona fide')
    .replace(/·/g, ',')
    .replace(/—/g, ', ')
    .replace(/[\n\r]+/g, '. ');

  if (language === 'hi') {
    cleaned = cleaned
      .replace(/₹\s*([0-9,]+)/g, '$1 रुपये')
      .replace(/डीबीटी/g, 'डी बी टी')
      .replace(/केवाईसी/g, 'के वाई सी');
  } else if (language === 'te') {
    cleaned = cleaned
      .replace(/₹\s*([0-9,]+)/g, '$1 రూపాయలు')
      .replace(/డిబిటి/g, 'డి బి టి');
  }

  return cleaned.trim();
}

export function conversationScheme(message: string, explicit?: string, previous?: string): Scheme | undefined {
  const named = relevantScheme(message);
  if (named) return named;
  if (isGreetingMessage(message)) return undefined;
  if (explicit) return SCHEMES.find(s => s.id === explicit);
  if (/this|that|eligible|document|certificate|prepare|application|explain|hindi|telugu|पात्र|दस्तावेज|हिन्दी|हिंदी|इसके|తెలుగు|పత్ర|అర్హత|వివరించ/i.test(message)) return SCHEMES.find(s => s.id === previous);
  return undefined;
}
