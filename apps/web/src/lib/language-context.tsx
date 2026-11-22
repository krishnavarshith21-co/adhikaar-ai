"use client";

import React, { createContext, useContext, useSyncExternalStore, useEffect } from "react";

export type Language = "en" | "hi" | "te";

export interface Translations {
  // Navigation
  nav: {
    explore: string;
    howItWorks: string;
    resources: string;
    about: string;
    signIn: string;
    getStarted: string;
    menuOpen: string;
    menuClose: string;
  };
  // Hero
  hero: {
    eyebrow: string;
    h1Line1: string;
    h1Line2: string;
    h1Line3: string;
    subtitle: string;
    searchPlaceholder: string;
    findBenefits: string;
    noIdRequired: string;
    availableAcrossIndia1: string;
    availableAcrossIndia2: string;
    voiceActive: string;
    voiceUnsupported: string;
    voiceError: string;
  };
  // Preflight Card on Hero
  preflightCard: {
    title: string;
    incomeCert: string;
    studyRecords: string;
    nextStep: string;
    checkDate: string;
    ready: string;
    reviewChecklist: string;
  };
  // Three Steps
  steps: {
    sectionAria: string;
    step1Num: string;
    step1Title: string;
    step1Desc: string;
    step2Num: string;
    step2Title: string;
    step2Desc: string;
    step3Num: string;
    step3Title: string;
    step3Desc: string;
  };
  // Scheme Categories
  categories: {
    badge: string;
    heading: string;
    subtitle: string;
    tagLabel: string;
    exploreLink: string;
    viewAllCta: string;
    items: {
      id: string;
      title: string;
      desc: string;
      tag: string;
    }[];
  };
  // Explainable Rules Engine
  rulesEngine: {
    badge: string;
    heading: string;
    desc: string;
    points: string[];
    cta: string;
    cardBadge: string;
    cardTitle: string;
    scheme1Title: string;
    scheme1Dept: string;
    scheme1Status: string;
    scheme1Reason: string;
    scheme2Title: string;
    scheme2Dept: string;
    scheme2Status: string;
    scheme2Reason: string;
    illustrativeNote: string;
  };
  // Application Preflight Section
  preflightSection: {
    badge: string;
    heading: string;
    desc: string;
    cta: string;
    cardTitle: string;
    cardScheme: string;
    readinessScore: string;
    scoreStatus: string;
    items: {
      name: string;
      status: "ready" | "needs-attention" | "check-validity";
      statusLabel: string;
    }[];
  };
  // 3D Heritage Architecture
  heritage: {
    badge: string;
    heading: string;
    desc: string;
    featureTag: string;
  };
  // Voice AI
  voiceSection: {
    badge: string;
    heading: string;
    desc: string;
    talkCta: string;
    secondaryCta: string;
    listeningState: string;
    processingState: string;
    speakingState: string;
    readySpeech: string;
    howVoiceWorks: string;
    transcriptPreview: string;
    demoNote: string;
  };
  // FAQ
  faq: {
    badge: string;
    heading: string;
    items: {
      q: string;
      a: string;
    }[];
  };
  // Final CTA
  finalCta: {
    heading: string;
    desc: string;
    exploreBtn: string;
    getStartedBtn: string;
  };
  // Footer
  footer: {
    mission: string;
    platformTitle: string;
    legalTitle: string;
    aboutTitle: string;
    howItWorks: string;
    about: string;
    resources: string;
    helpCenter: string;
    privacy: string;
    terms: string;
    disclaimer: string;
    copyright: string;
  };
  // Authentication Pages
  auth: {
    backToHome: string;
    independentPlatform: string;
    taglineHeading1: string;
    taglineHeading2: string;
    taglineSupport: string;
    termsNotice: string;
    termsLink: string;
    andLabel: string;
    privacyLink: string;

    // Sign Up
    signUpSectionLabel: string;
    signUpHeading: string;
    signUpSubtitle: string;
    fullNameLabel: string;
    fullNamePlaceholder: string;
    emailLabel: string;
    emailPlaceholder: string;
    passwordLabel: string;
    passwordPlaceholder: string;
    confirmPasswordLabel: string;
    confirmPasswordPlaceholder: string;
    createAccountCta: string;
    creatingAccount: string;
    alreadyHaveAccount: string;
    signInLink: string;

    // Sign In
    signInSectionLabel: string;
    signInHeading: string;
    signInSubtitle: string;
    rememberDevice: string;
    forgotPasswordLink: string;
    signInCta: string;
    signingIn: string;
    dontHaveAccount: string;
    signUpLink: string;

    // Validation & Alerts
    nameRequired: string;
    validEmailRequired: string;
    passwordMinLength: string;
    passwordMismatch: string;
    credentialsRequired: string;
    signInFailed: string;
    signUpFailed: string;
    exploreWithDemo: string;
    exploringWithDemo: string;
    demoDividerOr: string;
  };
}

export const translations: Record<Language, Translations> = {
  en: {
    nav: {
      explore: "Explore schemes",
      howItWorks: "How it works",
      resources: "Resources",
      about: "About",
      signIn: "Sign in",
      getStarted: "Get started",
      menuOpen: "Open menu",
      menuClose: "Close menu",
    },
    hero: {
      eyebrow: "INDIA'S OPPORTUNITIES, MADE ACCESSIBLE",
      h1Line1: "The support you",
      h1Line2: "deserve.",
      h1Line3: "Within reach.",
      subtitle:
        "Discover government and NGO schemes across India. Check eligibility, prepare documents, and move forward with confidence.",
      searchPlaceholder: "Tell us about yourself or what you need...",
      findBenefits: "Find my benefits",
      noIdRequired: "No ID details required",
      availableAcrossIndia1: "AVAILABLE",
      availableAcrossIndia2: "ACROSS INDIA",
      voiceActive: "Listening for scheme search...",
      voiceUnsupported: "Voice search is not supported in this browser. Please type your query.",
      voiceError: "Voice search could not start. Please type your query.",
    },
    preflightCard: {
      title: "Application Preflight",
      incomeCert: "Income certificate",
      studyRecords: "Study records",
      nextStep: "Next step",
      checkDate: "— Check date",
      ready: "Ready",
      reviewChecklist: "— Review checklist",
    },
    steps: {
      sectionAria: "How it works",
      step1Num: "01",
      step1Title: "Discover",
      step1Desc: "Find relevant government and NGO schemes across India.",
      step2Num: "02",
      step2Title: "Prepare",
      step2Desc: "Check eligibility and get your documents ready.",
      step3Num: "03",
      step3Title: "Track",
      step3Desc: "Follow your application and next steps with ease.",
    },
    categories: {
      badge: "Pan-India Civic Catalog",
      heading: "Official programmes, with sources",
      subtitle:
        "Discover active central ministries and state welfare programs categorized to meet your family's educational, medical, and livelihood milestones.",
      tagLabel: "Official source linked",
      exploreLink: "Explore →",
      viewAllCta: "Explore the Programme Catalogue →",
      items: [
        {
          id: "EDUCATION",
          title: "Education & Research",
          desc: "Central scholarships, National Fellowship, tuition support, and skill apprenticeships.",
          tag: "Higher Studies & Grants",
        },
        {
          id: "HEALTHCARE",
          title: "Healthcare & Wellness",
          desc: "Ayushman Bharat PM-JAY, maternity benefits, and specialized critical illness funds.",
          tag: "Medical Assurance",
        },
        {
          id: "AGRICULTURE",
          title: "Agriculture & Rural",
          desc: "PM-Kisan, crop insurance (PMFBY), input subsidies, and rural infrastructure grants.",
          tag: "Farmer Assistance",
        },
        {
          id: "LIVELIHOOD",
          title: "Livelihoods & MSME",
          desc: "PMEGP credit subsidies, PM SVANidhi, Mudra loans, and youth skilling programs.",
          tag: "Enterprise & Loans",
        },
        {
          id: "HOUSING",
          title: "Housing & Amenities",
          desc: "Pradhan Mantri Awas Yojana (Urban & Gramin), clean water and sanitation missions.",
          tag: "Shelter & Utilities",
        },
        {
          id: "SOCIAL_SECURITY",
          title: "Social Security & Grants",
          desc: "Old age pensions, widow welfare, disability stipends, and direct DBT transfers.",
          tag: "Pensions & DBT",
        },
      ],
    },
    rulesEngine: {
      badge: "Explainable Rules Engine",
      heading: "Know Where You Stand — Transparently",
      desc:
        "Our deterministic checks compare your profile with a limited set of reviewed preliminary conditions. Missing information is shown explicitly, and official approval remains with the responsible authority.",
      points: [
        "Published criteria evaluated with strict version control (Rule Version preliminary-2026-11-22)",
        "Never claims guaranteed approval — explains every condition clearly",
        "Links to the reviewed official source for each programme",
      ],
      cta: "Try Interactive Eligibility Checker →",
      cardBadge: "Demo — illustrative",
      cardTitle: "Illustrative Eligibility Example",
      scheme1Title: "PM-Vidyalaxmi",
      scheme1Dept: "Ministry of Education",
      scheme1Status: "Potentially Eligible",
      scheme1Reason: "Illustrative student: merit admission to a listed QHEI is self-reported. Bank checks still apply.",
      scheme2Title: "Pradhan Mantri MUDRA Yojana",
      scheme2Dept: "Department of Financial Services",
      scheme2Status: "Additional Information Required",
      scheme2Reason: "Confirm the eligible business activity and credit purpose with the lender.",
      illustrativeNote:
        "Sample evaluation shown for illustrative purposes. No personal data stored.",
    },
    preflightSection: {
      badge: "Signature Innovation",
      heading: "Application Preflight: Catch Document Gaps Before You Apply",
      desc:
        "Use a programme-specific preparation checklist and mark the documents you have. Confirm the definitive requirements with the authority or lender; the app does not independently verify documents.",
      cta: "Audit Your Documents in Preflight →",
      cardTitle: "Preflight Checklist Readiness",
      cardScheme: "Education loan preparation",
      readinessScore: "Sample Readiness Score",
      scoreStatus: "60% (Illustrative Example)",
      items: [
        {
          name: "Lender-requested identity proof",
          status: "ready",
          statusLabel: "Ready",
        },
        {
          name: "College Admission Letter / Bonafide",
          status: "ready",
          statusLabel: "Ready",
        },
        {
          name: "Income proof for interest-support requests",
          status: "needs-attention",
          statusLabel: "Needs attention",
        },
        {
          name: "10th and 12th Academic Marksheets",
          status: "ready",
          statusLabel: "Ready",
        },
        {
          name: "Course fee schedule",
          status: "check-validity",
          statusLabel: "Check validity",
        },
      ],
    },
    heritage: {
      badge: "Indian Architectural Heritage",
      heading: "Designed with Classical Heritage and Purpose",
      desc:
        "ADHIKAAR AI draws structural inspiration from India's enduring civic architecture — arched stone courtyards, scalloped jharokhas, and timeless brass craftsmanship — engineered to serve every citizen.",
      featureTag: "Interactive 3D Heritage Showcase • Inspired by Indo-Islamic stone masonry",
    },
    voiceSection: {
      badge: "ADHIKAAR VOICE GUIDE",
      heading: "Ask Questions in English, Hindi, or Telugu",
      desc: "Ask in English, Hindi or Telugu. Live services require server configuration; voice needs device-specific validation.",
      talkCta: "Talk to ADHIKAAR Guide",
      secondaryCta: "Continue with Text Chat",
      listeningState: "Listening... speak now",
      processingState: "Analyzing eligibility requirements...",
      speakingState: "Speaking verified scheme guidance",
      readySpeech: "Ask in English, Hindi or Telugu. Live services require server configuration; voice needs device-specific validation.",
      howVoiceWorks: "How Voice Consultation Works",
      transcriptPreview: "Describe your family situation, education, or crop needs in spoken words.",
      demoNote: "Interactive voice guidance demo mode. Also available in direct chat.",
    },
    faq: {
      badge: "Common Inquiries",
      heading: "Frequently Asked Questions",
      items: [
        {
          q: "Is ADHIKAAR AI an official government service?",
          a: "ADHIKAAR AI is an independent civic preparation platform. Use the programme’s official portal to confirm current requirements and apply.",
        },
        {
          q: "Are schemes from all Indian states covered?",
          a: "The current catalogue contains selected central programmes and Telangana agricultural support. It is not an exhaustive list of Indian schemes.",
        },
        {
          q: "How does Application Preflight prevent rejection?",
          a: "Preflight is a self-reported preparation checklist. It does not inspect documents, verify government records, or guarantee acceptance.",
        },
        {
          q: "How are eligibility decisions calculated?",
          a: "A deterministic rules function evaluates a limited set of preliminary criteria. Missing information stays unknown. Final decisions belong to the issuing authority.",
        },
        {
          q: "What languages does the AI voice assistant support?",
          a: "Assistant text is available in English, Hindi and Telugu. Voice is experimental and still requires end-to-end language and device testing.",
        },
        {
          q: "Do I need to submit sensitive ID numbers to check eligibility?",
          a: "No. Do not enter Aadhaar numbers or upload identity documents. Demo profiles are synthetic.",
        },
      ],
    },
    finalCta: {
      heading: "The Support You Deserve Is Within Reach",
      desc:
        "Discover eligible central and state scholarships, medical assistance, and livelihood programs designed for your family.",
      exploreBtn: "Explore Programmes →",
      getStartedBtn: "Get Started Free",
    },
    footer: {
      mission:
        "Empowering Indian citizens to discover, understand, and access government and NGO opportunities with dignity and clarity.",
      platformTitle: "Platform",
      legalTitle: "Legal & Trust",
      aboutTitle: "About",
      howItWorks: "How It Works",
      about: "About ADHIKAAR",
      resources: "Civic Resources",
      helpCenter: "Help Center",
      privacy: "Privacy Policy",
      terms: "Terms of Service",
      disclaimer:
        "ADHIKAAR AI is an independent discovery and guidance platform, not an official government service or agency.",
      copyright: "© 2026 ADHIKAAR AI. Built for citizens across India.",
    },
    auth: {
      backToHome: "Back to home",
      independentPlatform: "An independent civic guidance platform",
      taglineHeading1: "Every opportunity.",
      taglineHeading2: "Within reach.",
      taglineSupport: "Your path to support begins here.",
      termsNotice: "By creating an account, you agree to our",
      termsLink: "Terms of Service",
      andLabel: "and",
      privacyLink: "Privacy Policy",
      signUpSectionLabel: "BEGIN YOUR JOURNEY",
      signUpHeading: "Create your account",
      signUpSubtitle: "A simpler way to find the support you deserve.",
      fullNameLabel: "Full name",
      fullNamePlaceholder: "K. Ravi Kumar",
      emailLabel: "Email address",
      emailPlaceholder: "citizen@example.com",
      passwordLabel: "Password",
      passwordPlaceholder: "At least 8 characters",
      confirmPasswordLabel: "Confirm password",
      confirmPasswordPlaceholder: "Re-enter your password",
      createAccountCta: "Create my account",
      creatingAccount: "Creating your account...",
      alreadyHaveAccount: "Already have an account?",
      signInLink: "Sign in",
      signInSectionLabel: "WELCOME BACK",
      signInHeading: "Welcome back.",
      signInSubtitle: "Continue discovering opportunities designed for you.",
      rememberDevice: "Remember this device",
      forgotPasswordLink: "Forgot password?",
      signInCta: "Sign in to ADHIKAAR",
      signingIn: "Signing in securely...",
      dontHaveAccount: "Don't have an account?",
      signUpLink: "Create an account",
      nameRequired: "Please enter your full name.",
      validEmailRequired: "Please enter a valid email address.",
      passwordMinLength: "Password must contain at least 8 characters.",
      passwordMismatch: "Passwords do not match. Please re-enter.",
      credentialsRequired: "Please enter both your email address and password.",
      signInFailed: "Sign in failed. Please verify your email and password.",
      signUpFailed: "Registration could not be completed. Please try again.",
      exploreWithDemo: "Sign in with Demo",
      exploringWithDemo: "Preparing demo session...",
      demoDividerOr: "or",
    },
  },
  hi: {
    nav: {
      explore: "योजनाएं खोजें",
      howItWorks: "यह कैसे काम करता है",
      resources: "संसाधन",
      about: "हमारे बारे में",
      signIn: "साइन इन",
      getStarted: "शुरू करें",
      menuOpen: "मेनू खोलें",
      menuClose: "मेनू बंद करें",
    },
    hero: {
      eyebrow: "भारत के नागरिक अवसर, अब हर नागरिक तक",
      h1Line1: "आपका अधिकार,",
      h1Line2: "आपका हक।",
      h1Line3: "आपकी पहुंच में।",
      subtitle:
        "पूरे भारत की सरकारी और गैर-सरकारी योजनाओं की खोज करें। पात्रता जांचें, दस्तावेज तैयार करें और आत्मविश्वास के साथ आगे बढ़ें।",
      searchPlaceholder: "अपने बारे में या अपनी आवश्यकता के बारे में बताएं...",
      findBenefits: "मेरे लाभ खोजें",
      noIdRequired: "आईडी विवरण की कोई आवश्यकता नहीं",
      availableAcrossIndia1: "उपलब्ध",
      availableAcrossIndia2: "पूरे भारत में",
      voiceActive: "योजना खोज के लिए सुन रहे हैं...",
      voiceUnsupported: "इस ब्राउज़र में आवाज़ खोज समर्थित नहीं है। कृपया टाइप करें।",
      voiceError: "आवाज़ खोज शुरू नहीं हो सकी। कृपया लिखकर खोजें।",
    },
    preflightCard: {
      title: "आवेदन प्रीफ़्लाइट",
      incomeCert: "आय प्रमाण पत्र",
      studyRecords: "शैक्षणिक अभिलेख",
      nextStep: "अगला चरण",
      checkDate: "— तारीख जांचें",
      ready: "तैयार",
      reviewChecklist: "— सूची जांचें",
    },
    steps: {
      sectionAria: "यह कैसे काम करता है",
      step1Num: "01",
      step1Title: "खोजें",
      step1Desc: "भारत भर की प्रासंगिक सरकारी और गैर-सरकारी योजनाओं को खोजें।",
      step2Num: "02",
      step2Title: "तैयार करें",
      step2Desc: "अपनी पात्रता जांचें और आवश्यक दस्तावेज तैयार करें।",
      step3Num: "03",
      step3Title: "ट्रैक करें",
      step3Desc: "अपने आवेदन और आगामी चरणों की सहजता से निगरानी करें।",
    },
    categories: {
      badge: "अखिल भारतीय नागरिक सूची",
      heading: "आधिकारिक कार्यक्रम और उनके स्रोत",
      subtitle:
        "अपने परिवार के शैक्षिक, चिकित्सीय और आजीविका लक्ष्यों को पूरा करने के लिए वर्गीकृत केंद्रीय और राज्य कल्याणकारी कार्यक्रमों की खोज करें।",
      tagLabel: "आधिकारिक स्रोत",
      exploreLink: "देखें →",
      viewAllCta: "सभी सत्यापित योजनाएं देखें →",
      items: [
        {
          id: "EDUCATION",
          title: "शिक्षा एवं अनुसंधान",
          desc: "केंद्रीय छात्रवृत्तियां, राष्ट्रीय फेलोशिप, ट्यूशन सहायता और कौशल प्रशिक्षुता।",
          tag: "उच्च शिक्षा एवं अनुदान",
        },
        {
          id: "HEALTHCARE",
          title: "स्वास्थ्य एवं कल्याण",
          desc: "आयुष्मान भारत पीएम-जय, मातृत्व लाभ और विशेष गंभीर बीमारी सहायता कोष।",
          tag: "चिकित्सा सुरक्षा",
        },
        {
          id: "AGRICULTURE",
          title: "कृषि एवं ग्रामीण विकास",
          desc: "पीएम-किसान, फसल बीमा (पीएमएफबीवाई), इनपुट सब्सिडी और ग्रामीण अवसंरचना अनुदान।",
          tag: "कृषक सहायता",
        },
        {
          id: "LIVELIHOOD",
          title: "आजीविका एवं एमएसएमई",
          desc: "पीएमईजीपी ऋण सब्सिडी, पीएम स्वनिधि, मुद्रा ऋण और युवा कौशल कार्यक्रम।",
          tag: "उद्यमिता एवं ऋण",
        },
        {
          id: "HOUSING",
          title: "आवास एवं बुनियादी सुविधाएं",
          desc: "प्रधानमंत्री आवास योजना (शहरी एवं ग्रामीण), स्वच्छ जल और स्वच्छता मिशन।",
          tag: "आवास एवं सुविधाएं",
        },
        {
          id: "SOCIAL_SECURITY",
          title: "सामाजिक सुरक्षा एवं पेंशन",
          desc: "वृद्धावस्था पेंशन, विधवा कल्याण, दिव्यांग वजीफा और प्रत्यक्ष डीबीटी अंतरण।",
          tag: "पेंशन एवं डीबीटी",
        },
      ],
    },
    rulesEngine: {
      badge: "पारदर्शी नियम इंजन",
      heading: "अपनी पात्रता जानें — स्पष्ट और पारदर्शी तरीके से",
      desc:
        "हमारा नियम इंजन प्रकाशित मानदंडों (आयु, निवास राज्य, व्यवसाय, आय सीमा और विशेष प्रावधानों) का निष्पक्ष मूल्यांकन करता है। कोई भ्रामक अनुमान नहीं।",
      points: [
        "कड़े संस्करण नियंत्रण के साथ प्रकाशित नियमों का सत्यापन (नियम संस्करण preliminary-2026-11-22)",
        "स्वीकृति की झूठी गारंटी नहीं — हर शर्त का स्पष्ट विवरण",
        "आधिकारिक राजपत्र अधिसूचनाओं और सरकारी परिपत्रों से सीधा संबंध",
      ],
      cta: "पात्रता चेकर आज़माएं →",
      cardBadge: "डेमो — केवल उदाहरण",
      cardTitle: "उदाहरणात्मक पात्रता उदाहरण",
      scheme1Title: "पीएम-विद्यालक्ष्मी",
      scheme1Dept: "शिक्षा मंत्रालय",
      scheme1Status: "संभावित पात्र",
      scheme1Reason: "उदाहरण छात्र: सूचीबद्ध QHEI में योग्यता के आधार पर प्रवेश स्वयं बताया गया है। बैंक की जाँच आवश्यक है।",
      scheme2Title: "प्रधानमंत्री मुद्रा योजना",
      scheme2Dept: "वित्तीय सेवाएँ विभाग",
      scheme2Status: "अतिरिक्त जानकारी आवश्यक",
      scheme2Reason: "पात्र व्यवसाय और ऋण के उद्देश्य की पुष्टि ऋणदाता से करें।",
      illustrativeNote:
        "उदाहरणात्मक उद्देश्य के लिए प्रस्तुत। कोई व्यक्तिगत जानकारी संग्रहीत नहीं होती।",
    },
    preflightSection: {
      badge: "विशिष्ट नवाचार",
      heading: "आवेदन प्रीफ़्लाइट: आवेदन करने से पहले दस्तावेजों की कमियां पकड़ें",
      desc:
        "आवेदन जमा करने से पहले अपने दस्तावेजों की आधिकारिक नियमों से जांच करें। अमान्य प्रमाण पत्र, समाप्त आय हलफनामे और असंबद्ध बैंक खाते पहले ही पहचानें।",
      cta: "प्रीफ़्लाइट में दस्तावेजों का ऑडिट करें →",
      cardTitle: "प्रीफ़्लाइट चेकलिस्ट तत्परता",
      cardScheme: "शिक्षा ऋण की तैयारी",
      readinessScore: "नमूना तत्परता स्कोर",
      scoreStatus: "60% (कार्रवाई आवश्यक)",
      items: [
        {
          name: "आधार कार्ड (बैंक एनपीसीआई से लिंक)",
          status: "ready",
          statusLabel: "तैयार",
        },
        {
          name: "कॉलेज प्रवेश पत्र / बोनाफाइड",
          status: "ready",
          statusLabel: "तैयार",
        },
        {
          name: "आय प्रमाण पत्र (वर्तमान वित्तीय वर्ष)",
          status: "needs-attention",
          statusLabel: "ध्यान दें",
        },
        {
          name: "10वीं और 12वीं की अंकतालिका",
          status: "ready",
          statusLabel: "तैयार",
        },
        {
          name: "पासपोर्ट आकार का फोटो (< 6 महीने)",
          status: "check-validity",
          statusLabel: "वैधता जांचें",
        },
      ],
    },
    heritage: {
      badge: "भारतीय स्थापत्य विरासत",
      heading: "शास्त्रीय विरासत और नागरिक उद्देश्य का संगम",
      desc:
        "अधिकार एआई भारत की भव्य ऐतिहासिक वास्तुकला — मेहराबदार दालान, तराशे गए झरोखे और पीतल शिल्प — की गरिमा को आधुनिक तकनीक के साथ प्रस्तुत करता है।",
      featureTag: "इंटरैक्टिव 3D विरासत मॉडल • भारतीय वास्तुकला से प्रेरित",
    },
    voiceSection: {
      badge: "अधिकार वॉयस गाइड",
      heading: "अंग्रेजी, हिंदी या तेलुगु में सवाल पूछें",
      desc: "अंग्रेज़ी, हिन्दी या तेलुगु में पूछें। लाइव सेवा के लिए सर्वर कॉन्फ़िगरेशन और आवाज़ के लिए उपकरण पर परीक्षण आवश्यक है।",
      talkCta: "अधिकार गाइड से बात करें",
      secondaryCta: "टेक्स्ट चैट से जारी रखें",
      listeningState: "सुन रहे हैं... कृपया बोलें",
      processingState: "पात्रता नियमों का विश्लेषण हो रहा है...",
      speakingState: "सत्यापित मार्गदर्शन सुनाया जा रहा है",
      readySpeech: "अंग्रेज़ी, हिन्दी या तेलुगु में पूछें। लाइव सेवा के लिए सर्वर कॉन्फ़िगरेशन और आवाज़ के लिए उपकरण पर परीक्षण आवश्यक है।",
      howVoiceWorks: "वॉयस परामर्श कैसे काम करता है",
      transcriptPreview: "अपनी पारिवारिक स्थिति, शिक्षा या कृषि संबंधी जरूरतें बोलकर बताएं।",
      demoNote: "इंटरैक्टिव वॉयस परामर्श डेमो। सीधे चैट में भी उपलब्ध।",
    },
    faq: {
      badge: "सामान्य जिज्ञासाएं",
      heading: "अक्सर पूछे जाने वाले प्रश्न",
      items: [
        {
          q: "क्या अधिकार एआई एक आधिकारिक सरकारी सेवा है?",
          a: "अधिकार एआई एक स्वतंत्र नागरिक तैयारी मंच है। वर्तमान शर्तों और आवेदन के लिए योजना का आधिकारिक पोर्टल देखें।",
        },
        {
          q: "क्या सभी भारतीय राज्यों की योजनाएं शामिल हैं?",
          a: "वर्तमान सूची में कुछ केंद्रीय कार्यक्रम और तेलंगाना की कृषि सहायता शामिल हैं। यह सभी भारतीय योजनाओं की पूरी सूची नहीं है।",
        },
        {
          q: "आवेदन प्रीफ़्लाइट अस्वीकृति को कैसे रोकता है?",
          a: "प्रीफ़्लाइट स्वयं बताई गई तैयारी की सूची है। यह दस्तावेज़ या सरकारी अभिलेख सत्यापित नहीं करता और स्वीकृति की गारंटी नहीं देता।",
        },
        {
          q: "पात्रता निर्णय कैसे निर्धारित होते हैं?",
          a: "निश्चित नियम सीमित प्रारंभिक शर्तों का मूल्यांकन करते हैं। जानकारी न होने पर परिणाम अनिश्चित रहता है। अंतिम निर्णय संबंधित प्राधिकरण करता है।",
        },
        {
          q: "एआई वॉयस असिस्टेंट किन भाषाओं का समर्थन करता है?",
          a: "सहायक का लिखित संवाद अंग्रेज़ी, हिन्दी और तेलुगु में उपलब्ध है। आवाज़ की सुविधा प्रायोगिक है और प्रत्येक भाषा तथा उपकरण पर पूरा परीक्षण आवश्यक है।",
        },
        {
          q: "क्या मुझे संवेदनशील आईडी नंबर दर्ज करने होंगे?",
          a: "नहीं। आधार नंबर या पहचान दस्तावेज़ न दें। डेमो प्रोफ़ाइल काल्पनिक हैं।",
        },
      ],
    },
    finalCta: {
      heading: "आपका अधिकार और सहयोग आपकी पहुंच में है",
      desc:
        "अपने और अपने परिवार के लिए पात्र छात्रवृत्तियों, चिकित्सा सहायता और आजीविका कार्यक्रमों की खोज करें।",
      exploreBtn: "सत्यापित योजनाएं देखें →",
      getStartedBtn: "निःशुल्क शुरू करें",
    },
    footer: {
      mission:
        "भारतीय नागरिकों को सरकारी एवं गैर-सरकारी अवसरों को गरिमा और स्पष्टता के साथ प्राप्त करने में सक्षम बनाना।",
      platformTitle: "प्लेटफ़ॉर्म",
      legalTitle: "कानूनी एवं विश्वास",
      aboutTitle: "परिचय",
      howItWorks: "यह कैसे काम करता है",
      about: "अधिकार के बारे में",
      resources: "नागरिक संसाधन",
      helpCenter: "सहायता केंद्र",
      privacy: "गोपनीयता नीति",
      terms: "सेवा की शर्तें",
      disclaimer:
        "अधिकार एआई एक स्वतंत्र खोज और मार्गदर्शन मंच है, कोई आधिकारिक सरकारी सेवा या एजेंसी नहीं।",
      copyright: "© 2026 अधिकार एआई। भारत के नागरिकों के लिए समर्पित।",
    },
    auth: {
      backToHome: "मुख्य पृष्ठ पर लौटें",
      independentPlatform: "एक स्वतंत्र नागरिक मार्गदर्शन मंच",
      taglineHeading1: "हर अवसर।",
      taglineHeading2: "आपकी पहुंच में।",
      taglineSupport: "आपके सहयोग की दिशा यहीं से शुरू होती है।",
      termsNotice: "खाता बनाकर, आप हमारी",
      termsLink: "सेवा की शर्तों",
      andLabel: "और",
      privacyLink: "गोपनीयता नीति",
      signUpSectionLabel: "अपनी यात्रा शुरू करें",
      signUpHeading: "अपना खाता बनाएं",
      signUpSubtitle: "अपने हक की सहायता खोजने का एक सरल और सम्मानजनक मार्ग।",
      fullNameLabel: "पूरा नाम",
      fullNamePlaceholder: "उदा. के. रवि कुमार",
      emailLabel: "ईमेल पता",
      emailPlaceholder: "citizen@example.com",
      passwordLabel: "पासवर्ड",
      passwordPlaceholder: "कम से कम 8 अक्षर",
      confirmPasswordLabel: "पासवर्ड की पुष्टि करें",
      confirmPasswordPlaceholder: "पुनः पासवर्ड दर्ज करें",
      createAccountCta: "मेरा खाता बनाएं",
      creatingAccount: "खाता बनाया जा रहा है...",
      alreadyHaveAccount: "पहले से खाता है?",
      signInLink: "साइन इन करें",
      signInSectionLabel: "वापसी पर स्वागत",
      signInHeading: "वापसी पर स्वागत है।",
      signInSubtitle: "आपके लिए विशेष रूप से बनाई गई योजनाओं को देखना जारी रखें।",
      rememberDevice: "इस डिवाइस को याद रखें",
      forgotPasswordLink: "पासवर्ड भूल गए?",
      signInCta: "अधिकार में साइन इन करें",
      signingIn: "सुरक्षित साइन इन हो रहा है...",
      dontHaveAccount: "खाता नहीं है?",
      signUpLink: "नया खाता बनाएं",
      nameRequired: "कृपया अपना पूरा नाम दर्ज करें।",
      validEmailRequired: "कृपया एक मान्य ईमेल पता दर्ज करें।",
      passwordMinLength: "पासवर्ड में कम से कम 8 अक्षर होने चाहिए।",
      passwordMismatch: "पासवर्ड मेल नहीं खाते। कृपया पुनः जांचें।",
      credentialsRequired: "कृपया अपना ईमेल और पासवर्ड दोनों दर्ज करें।",
      signInFailed: "साइन इन विफल रहा। कृपया अपने विवरण जांचें।",
      signUpFailed: "पंजीकरण पूरा नहीं हो सका। कृपया पुनः प्रयास करें।",
      exploreWithDemo: "डेमो खाते से अन्वेषण करें",
      exploringWithDemo: "डेमो सत्र तैयार किया जा रहा है...",
      demoDividerOr: "या",
    },
  },
  te: {
    nav: {
      explore: "పథకాలను అన్వేషించండి",
      howItWorks: "ఇది ఎలా పనిచేస్తుంది",
      resources: "వనరులు",
      about: "మా గురించి",
      signIn: "లాగిన్",
      getStarted: "ప్రారంభించండి",
      menuOpen: "మెనూ తెరవండి",
      menuClose: "మెనూ మూసివేయండి",
    },
    hero: {
      eyebrow: "భారతదేశ అవకాశాలు, ప్రతి పౌరుడికి సులభతరం",
      h1Line1: "మీకు తగిన మద్దతు,",
      h1Line2: "మీ హక్కు.",
      h1Line3: "మీ ముంగిటనే.",
      subtitle:
        "భారతదేశవ్యాప్తంగా ప్రభుత్వ మరియు స్వచ్ఛంద సంస్థల పథకాలను కనుగొనండి. అర్హతను తనిఖీ చేయండి, పత్రాలను సిద్ధం చేసుకోండి మరియు ఆత్మవిశ్వాసంతో ముందడుగు వేయండి.",
      searchPlaceholder: "మీ గురించి లేదా మీకు కావలసిన సహాయం గురించి చెప్పండి...",
      findBenefits: "నా ప్రయోజనాలను కనుగొనండి",
      noIdRequired: "గుర్తింపు వివరాలు అవసరం లేదు",
      availableAcrossIndia1: "అందుబాటులో ఉంది",
      availableAcrossIndia2: "భారతదేశమంతటా",
      voiceActive: "పథకాల శోధన కోసం వింటున్నాము...",
      voiceUnsupported: "ఈ బ్రౌజర్‌లో వాయిస్ శోధన మద్దతు లేదు. దయచేసి టైప్ చేయండి.",
      voiceError: "వాయిస్ శోధన ప్రారంభం కాలేదు. దయచేసి టైప్ చేయండి.",
    },
    preflightCard: {
      title: "దరఖాస్తు ప్రీఫ్లైట్",
      incomeCert: "ఆదాయ ధృవీకరణ పత్రం",
      studyRecords: "విద్యా రికార్డులు",
      nextStep: "తదుపరి అడుగు",
      checkDate: "— తేదీ తనిఖీ చేయండి",
      ready: "సిద్ధంగా ఉంది",
      reviewChecklist: "— చెక్‌లిస్ట్ చూడండి",
    },
    steps: {
      sectionAria: "ఇది ఎలా పనిచేస్తుంది",
      step1Num: "01",
      step1Title: "కనుగొనండి",
      step1Desc: "భారతదేశవ్యాప్తంగా మీకు వర్తించే ప్రభుత్వ మరియు ఎన్జీవో పథకాలను కనుగొనండి.",
      step2Num: "02",
      step2Title: "సిద్ధం చేసుకోండి",
      step2Desc: "మీ అర్హతను నిర్ధారించుకోండి మరియు అవసరమైన పత్రాలను సిద్ధం చేయండి.",
      step3Num: "03",
      step3Title: "ట్రాక్ చేయండి",
      step3Desc: "మీ దరఖాస్తు స్థితిని మరియు తదుపరి చర్యలను సులభంగా పర్యవేక్షించండి.",
    },
    categories: {
      badge: "అఖిల భారత పౌర జాబితా",
      heading: "అధికారిక కార్యక్రమాలు, మూలాలు",
      subtitle:
        "మీ కుటుంబ విద్యా, వైద్య మరియు జీవనోపాధి అవసరాలను తీర్చడానికి కేంద్ర మరియు రాష్ట్ర సంక్షేమ పథకాలను అన్వేషించండి.",
      tagLabel: "అధికారిక మూలం",
      exploreLink: "వీక్షించండి →",
      viewAllCta: "అన్ని పథకాలను చూడండి →",
      items: [
        {
          id: "EDUCATION",
          title: "విద్య & పరిశోధన",
          desc: "కేంద్ర ఉపకార వేతనాలు, జాతీయ ఫెలోషిప్, ఫీజు రీయింబర్స్‌మెంట్ మరియు నైపుణ్య శిక్షణ.",
          tag: "ఉన్నత విద్య & గ్రాంట్లు",
        },
        {
          id: "HEALTHCARE",
          title: "ఆరోగ్యం & సంక్షేమం",
          desc: "ఆయుష్మాన్ భారత్ పీఎం-జేఏవై, మాతృత్వ ప్రయోజనాలు మరియు ఆరోగ్య నిధులు.",
          tag: "వైద్య భరోసా",
        },
        {
          id: "AGRICULTURE",
          title: "వ్యవసాయం & గ్రామీణాభివృద్ధి",
          desc: "రైతు భరోసా, పీఎం-కిసాన్, పంటల బీమా (పీఎంఎఫ్‌బీవై) మరియు ఎరువుల సబ్సిడీ.",
          tag: "రైతు సహాయం",
        },
        {
          id: "LIVELIHOOD",
          title: "జీవనోపాధి & ఎంఎస్ఎంఈ",
          desc: "పీఎంఈజీపీ రుణాలు, పీఎం స్వనిధి, ముద్ర రుణాలు మరియు యువత ఉపాధి కార్యక్రమాలు.",
          tag: "స్వయం ఉపాధి & రుణాలు",
        },
        {
          id: "HOUSING",
          title: "గృహనిర్మాణం & వసతులు",
          desc: "ప్రధాన మంత్రి ఆవాస్ యోజన, పరిశుభ్రమైన తాగునీరు మరియు పారిశుద్ధ్య మిషన్లు.",
          tag: "గృహ వసతి & సౌకర్యాలు",
        },
        {
          id: "SOCIAL_SECURITY",
          title: "సామాజిక భద్రత & పింఛన్లు",
          desc: "వృద్ధాప్య పింఛన్లు, వితంతు సంక్షేమం, దివ్యాంగుల ఉపకార వేతనాలు మరియు ప్రత్యక్ష నగదు బదిలీ.",
          tag: "పింఛన్లు & డీబీటీ",
        },
      ],
    },
    rulesEngine: {
      badge: "పారదర్శక నిబంధనల వ్యవస్థ",
      heading: "మీ అర్హతను తెలుసుకోండి — స్పష్టంగా మరియు పారదర్శకంగా",
      desc:
        "మా నిబంధనల వ్యవస్థ వయస్సు, నివాస రాష్ట్రం, వృత్తి, ఆదాయ పరిమితి మరియు ప్రత్యేక నిబంధనలను ఆధారంగా చేసుకుని ఫలితాలను అందిస్తుంది. ఊహాజనిత సమాధానాలు ఉండవు.",
      points: [
        "ప్రభుత్వ గెజిట్ నిబంధనల ప్రకారం ఖచ్చితమైన విశ్లేషణ (రూల్ వెర్షన్ preliminary-2026-11-22)",
        "తప్పుడు హామీలు ఇవ్వదు — ప్రతి నిబంధనను స్పష్టంగా వివరిస్తుంది",
        "అధికారిక గెజిట్ నోటిఫికేషన్లు మరియు ప్రభుత్వ ఉత్తర్వులతో ప్రత్యక్ష లింకులు",
      ],
      cta: "అర్హతను తనిఖీ చేయండి →",
      cardBadge: "డెమో — ఉదాహరణ మాత్రమే",
      cardTitle: "అవగాహన కొరకు అర్హత ఉదాహరణ",
      scheme1Title: "పీఎం-విద్యాలక్ష్మి",
      scheme1Dept: "విద్యా మంత్రిత్వ శాఖ",
      scheme1Status: "అర్హత కలదు",
      scheme1Reason: "ఉదాహరణ విద్యార్థి: జాబితాలోని QHEIలో ప్రతిభ ఆధారిత ప్రవేశాన్ని స్వయంగా తెలిపారు. బ్యాంకు పరిశీలన అవసరం.",
      scheme2Title: "ప్రధాన మంత్రి ముద్ర యోజన",
      scheme2Dept: "ఆర్థిక సేవల శాఖ",
      scheme2Status: "మరింత సమాచారం అవసరం",
      scheme2Reason: "అర్హమైన వ్యాపారం, రుణ అవసరాన్ని రుణదాతతో నిర్ధారించండి.",
      illustrativeNote:
        "ఈ వివరాలు కేవలం అవగాహన కొరకు మాత్రమే. ఎలాంటి వ్యక్తిగత డేటా భద్రపరచబడదు.",
    },
    preflightSection: {
      badge: "ప్రత్యేక ఆవిష్కరణ",
      heading: "దరఖాస్తు ప్రీఫ్లైట్: దరఖాస్తుకు ముందే పత్రాల లోపాలను గుర్తించండి",
      desc:
        "దరఖాస్తు సమర్పించే ముందే అధికారిక నిబంధనలతో పత్రాలను సరిచూసుకోండి. గడువు ముగిసిన సర్టిఫికెట్లు, తప్పులు మరియు లింక్ కాని బ్యాంక్ ఖాతాలను ముందే సరిదిద్దుకోండి.",
      cta: "ప్రీఫ్లైట్‌లో పత్రాలను తనిఖీ చేయండి →",
      cardTitle: "ప్రీఫ్లైట్ చెక్‌లిస్ట్ సంసిద్ధత",
      cardScheme: "విద్యా రుణ సన్నద్ధత",
      readinessScore: "నమూనా సంసిద్ధత స్కోరు",
      scoreStatus: "60% (చర్యలు అవసరం)",
      items: [
        {
          name: "ఆధార్ కార్డు (బ్యాంక్ ఎన్‌పీసీఐతో లింక్ చేయబడింది)",
          status: "ready",
          statusLabel: "సిద్ధంగా ఉంది",
        },
        {
          name: "కాలేజ్ అడ్మిషన్ లెటర్ / బోనఫైడ్",
          status: "ready",
          statusLabel: "సిద్ధంగా ఉంది",
        },
        {
          name: "ఆదాయ ధృవీకరణ పత్రం (ప్రస్తుత ఆర్థిక సంవత్సరం)",
          status: "needs-attention",
          statusLabel: "శ్రద్ధ వహించండి",
        },
        {
          name: "10వ మరియు 12వ తరగతి మార్కుల జాబితా",
          status: "ready",
          statusLabel: "సిద్ధంగా ఉంది",
        },
        {
          name: "పాస్‌పోర్ట్ సైజ్ ఫోటో (< 6 నెలలు)",
          status: "check-validity",
          statusLabel: "చెల్లుబాటు తనిఖీ",
        },
      ],
    },
    heritage: {
      badge: "భారతీయ నిర్మాణ వారసత్వం",
      heading: "వారసత్వ కళానైపుణ్యం మరియు పౌర సేవా సంకల్పం",
      desc:
        "అధికార్ ఏఐ భారతదేశపు సాంప్రదాయ వాస్తుశిల్పం — తోరణాలు, రాతి మండపాలు మరియు ఇత్తడి హస్తకళల గొప్పదనాన్ని ఆధునిక సాంకేతికతతో పౌరుల సేవకు అందిస్తుంది.",
      featureTag: "ఇంటరాక్టివ్ 3D వారసత్వ రూపం • భారతీయ చారిత్రక శైలి ఆధారంగా",
    },
    voiceSection: {
      badge: "అధికార్ వాయిస్ గైడ్",
      heading: "తెలుగు, హిందీ లేదా ఇంగ్లీషులో మాట్లాడి అడగండి",
      desc: "ఇంగ్లీష్, హిందీ, తెలుగులో అడగండి. ప్రత్యక్ష సేవకు సర్వర్ అమరిక, వాయిస్‌కు పరికర పరీక్ష అవసరం.",
      talkCta: "అధికార్ గైడ్‌తో మాట్లాడండి",
      secondaryCta: "టెక్స్ట్ చాట్ ద్వారా సంభాషించండి",
      listeningState: "వింటున్నాము... దయచేసి మాట్లాడండి",
      processingState: "పథక నిబంధనలను విశ్లేషిస్తున్నాము...",
      speakingState: "ధృవీకరించబడిన సమాచారాన్ని వినిపిస్తున్నాము",
      readySpeech: "ఇంగ్లీష్, హిందీ, తెలుగులో అడగండి. ప్రత్యక్ష సేవకు సర్వర్ అమరిక, వాయిస్‌కు పరికర పరీక్ష అవసరం.",
      howVoiceWorks: "వాయిస్ సంభాషణ ఎలా పనిచేస్తుంది",
      transcriptPreview: "మీ కుటుంబ పరిస్థితి, చదువు లేదా వ్యవసాయ అవసరాలను మాట్లాడి చెప్పండి.",
      demoNote: "ఇంటరాక్టివ్ వాయిస్ డెమో మోడ్. నేరుగా చాట్‌లో కూడా అందుబాటులో ఉంది.",
    },
    faq: {
      badge: "తరచుగా అడిగే ప్రశ్నలు",
      heading: "ప్రశ్నలు & సమాధానాలు",
      items: [
        {
          q: "అధికార్ ఏఐ అధికారిక ప్రభుత్వ సేవా?",
          a: "అధికార్ ఏఐ స్వతంత్ర పౌర సన్నద్ధత వేదిక. ప్రస్తుత షరతులు, దరఖాస్తు కోసం పథకం అధికారిక పోర్టల్ చూడండి.",
        },
        {
          q: "అన్ని రాష్ట్రాల పథకాలు ఇందులో ఉంటాయా?",
          a: "ప్రస్తుత జాబితాలో కొన్ని కేంద్ర కార్యక్రమాలు, తెలంగాణ వ్యవసాయ సహాయం ఉన్నాయి. ఇది భారతదేశంలోని అన్ని పథకాల పూర్తి జాబితా కాదు.",
        },
        {
          q: "దరఖాస్తు ప్రీఫ్లైట్ తిరస్కరణను ఎలా నివారిస్తుంది?",
          a: "ప్రీఫ్లైట్ మీరు తెలిపిన పత్రాల సన్నద్ధత జాబితా. ఇది పత్రాలు లేదా ప్రభుత్వ రికార్డులను ధృవీకరించదు; ఆమోదానికి హామీ ఇవ్వదు.",
        },
        {
          q: "అర్హత ఎలా లెక్కించబడుతుంది?",
          a: "నిర్దిష్ట నిబంధనలు పరిమిత ప్రాథమిక షరతులను పరిశీలిస్తాయి. సమాచారం లేకపోతే ఫలితం అనిశ్చితంగా ఉంటుంది. తుది నిర్ణయం సంబంధిత అధికారులది.",
        },
        {
          q: "ఈ అసిస్టెంట్ ఏ భాషలకు మద్దతు ఇస్తుంది?",
          a: "ఇంగ్లీష్, హిందీ, తెలుగులో వచన సంభాషణ అందుబాటులో ఉంది. వాయిస్ ప్రయోగాత్మకం; ప్రతి భాష, పరికరంలో పూర్తి పరీక్ష అవసరం.",
        },
        {
          q: "నేను ఆధార్ వంటి వ్యక్తిగత వివరాలు ఇవ్వాలా?",
          a: "అవసరం లేదు. ఆధార్ సంఖ్యలు లేదా గుర్తింపు పత్రాలు ఇవ్వవద్దు. డెమో ప్రొఫైళ్లు కల్పితమైనవి.",
        },
      ],
    },
    finalCta: {
      heading: "మీకు రావలసిన సంక్షేమ ఫలాలు మీ ముంగిటనే",
      desc:
        "మీరు మరియు మీ కుటుంబం పొందగల ప్రభుత్వ మరియు స్వచ్ఛంద పథకాలను ధృవీకరించుకోండి.",
      exploreBtn: "పథకాలను అన్వేషించండి →",
      getStartedBtn: "ఉచితంగా ప్రారంభించండి",
    },
    footer: {
      mission:
        "భారతీయ పౌరులకు ప్రభుత్వ అవకాశాలను స్పష్టత మరియు గౌరవంతో చేరువ చేయడమే మా లక్ష్యం.",
      platformTitle: "ప్లాట్‌ఫారమ్",
      legalTitle: "చట్టపరమైన & భద్రత",
      aboutTitle: "వివరాలు",
      howItWorks: "ఇది ఎలా పనిచేస్తుంది",
      about: "మా గురించి",
      resources: "పౌర వనరులు",
      helpCenter: "సహాయ కేంద్రం",
      privacy: "గోపनीयత విధానం",
      terms: "సేవా నిబంధనలు",
      disclaimer:
        "అధికార్ ఏఐ ఒక స్వతంత్ర సహాయక వేదిక మాత్రమే, ప్రభుత్వ సంస్థ కాదు.",
      copyright: "© 2026 అధికార్ ఏఐ. భారతీయ పౌరుల సేవల కొరకు.",
    },
    auth: {
      backToHome: "హోమ్‌కి తిరిగి వెళ్లండి",
      independentPlatform: "స్వతంత్ర పౌర సహాయక వేదిక",
      taglineHeading1: "ప్రతి అవకాశం.",
      taglineHeading2: "మీ ముంగిటనే.",
      taglineSupport: "మీ సంక్షేమ పథకాల అన్వేషణ ఇక్కడి నుంచే ప్రారంభమవుతుంది.",
      termsNotice: "ఖాతా సృష్టించడం ద్వారా, మీరు మా",
      termsLink: "సేవా నిబంధనలు",
      andLabel: "మరియు",
      privacyLink: "గోప్యతా విధానం",
      signUpSectionLabel: "మీ ప్రయాణాన్ని ప్రారంభించండి",
      signUpHeading: "మీ ఖాతాను సృష్టించుకోండి",
      signUpSubtitle: "మీకు తగిన మద్దతును కనుగొనడానికి సులభమైన మరియు సురక్షితమైన మార్గం.",
      fullNameLabel: "పూర్తి పేరు",
      fullNamePlaceholder: "ఉదా. కె. రవి కుమార్",
      emailLabel: "ఈమెయిల్ చిరునామా",
      emailPlaceholder: "citizen@example.com",
      passwordLabel: "పాస్‌వర్డ్",
      passwordPlaceholder: "కనీసం 8 అక్షరాలు",
      confirmPasswordLabel: "పాస్‌వర్డ్ నిర్ధారించండి",
      confirmPasswordPlaceholder: "పాస్‌వర్డ్ మళ్లీ నమోదు చేయండి",
      createAccountCta: "నా ఖాతాను సృష్టించండి",
      creatingAccount: "ఖాతా సృష్టించబడుతోంది...",
      alreadyHaveAccount: "ఇప్పటికే ఖాతా ఉందా?",
      signInLink: "సైన్ ఇన్ అవ్వండి",
      signInSectionLabel: "తిరిగి స్వాగతం",
      signInHeading: "తిరిగి స్వాగతం.",
      signInSubtitle: "మీ అర్హత గల పథకాలను తెలుసుకోవడం కొనసాగించండి.",
      rememberDevice: "ఈ పరికరాన్ని గుర్తుంచుకోండి",
      forgotPasswordLink: "పాస్‌వర్డ్ మర్చిపోయారా?",
      signInCta: "అధికార్‌లో సైన్ ఇన్ చేయండి",
      signingIn: "సురక్షితంగా లాగిన్ అవుతోంది...",
      dontHaveAccount: "ఖాతా లేదా?",
      signUpLink: "కొత్త ఖాతా సృష్టించండి",
      nameRequired: "దయచేసి మీ పూర్తి పేరు నమోదు చేయండి.",
      validEmailRequired: "దయచేసి సరైన ఈమెయిల్ చిరునామాను నమోదు చేయండి.",
      passwordMinLength: "పాస్‌వర్డ్ కనీసం 8 అక్షరాలు ఉండాలి.",
      passwordMismatch: "పాస్‌వర్డ్‌లు సరిపోలడం లేదు. మళ్లీ ప్రయత్నించండి.",
      credentialsRequired: "దయచేసి మీ ఈమెయిల్ మరియు పాస్‌వర్డ్ రెండూ నమోదు చేయండి.",
      signInFailed: "లాగిన్ విఫలమైంది. మీ వివరాలను తనిఖీ చేయండి.",
      signUpFailed: "రిజిస్ట్రేషన్ పూర్తి కాలేదు. దయచేసి మళ్లీ ప్రయత్నించండి.",
      exploreWithDemo: "డెమో ఖాతాతో అన్వేషించండి",
      exploringWithDemo: "డెమో సెషన్ సిద్ధం అవుతోంది...",
      demoDividerOr: "లేదా",
    },
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  setLanguage: () => {},
  t: translations.en,
});

function readLanguage(): Language {
  try { const value = localStorage.getItem('adhikaar_language'); return value === 'hi' || value === 'te' ? value : 'en'; } catch { return 'en'; }
}
function subscribeLanguage(callback: () => void) {
  window.addEventListener('storage', callback); window.addEventListener('adhikaar-language', callback);
  return () => { window.removeEventListener('storage', callback); window.removeEventListener('adhikaar-language', callback); };
}
export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const language = useSyncExternalStore(subscribeLanguage, readLanguage, () => 'en' as Language);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = language;
    }
  }, [language]);

  const setLanguage = (lang: Language) => {
    try { localStorage.setItem('adhikaar_language', lang); window.dispatchEvent(new Event('adhikaar-language')); } catch { /* Storage unavailable. */ }
    try {
      document.documentElement.lang = lang;
    } catch {
      // ignore
    }
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t: translations[language] || translations.en,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
