// English translations - THE BASE LANGUAGE (source of truth)
// All other languages MUST match this structure exactly.
// Missing keys = TypeScript error

import { TranslationSchema } from './schema';

export const en: TranslationSchema = {
  common: {
    loading: 'Loading...',
    error: 'Something went wrong',
    retry: 'Try Again',
    cancel: 'Cancel',
    confirm: 'Confirm',
    save: 'Save',
    close: 'Close',
    continue: 'Continue',
    back: 'Back',
    next: 'Next',
    submit: 'Submit',
    skip: 'Skip',
    language: 'Language',
    poweredBy: 'Powered by Sitelytc Digital Media',
    under60seconds: 'Under 60 seconds',
    connectingToGinni: 'Connecting to Ginni...',
    ginniIsThinking: 'Ginni is thinking...',
    yourSpiritualGuide: 'Your spiritual guide',
    ginni: 'Ginni',
    ginniTitle: 'Ginni ✨',
    yourPersonalTarotGuide: 'Your personal tarot guide',
    secureGuarantee: 'Secure payment • 30-day guarantee',
    instantDelivery: 'Instant delivery',
    unlimitedReadings: 'Unlimited readings',
    readingYourEnergy: 'Reading your energy...',
    recommendedForYou: 'Recommended for you',
    fromPreviousReading: 'From your previous reading',
    premiumAccessActive: 'Premium Access Active',
    enjoyUnlimited: 'Enjoy unlimited readings',
    maybeLater: 'Maybe later',
    noPressure: 'No pressure — this is your journey. But there\'s more here for you.',
  },

  nav: {
    home: 'Home',
    about: 'About',
    reading: 'Reading',
    subscription: 'Subscription',
    premium: 'Premium',
    bookReading: 'Book Reading',
    booking: 'Booking',
    blog: 'Blog',
    course: 'Course',
    contact: 'Contact',
    talkToGinni: 'Talk to Ginni',
    yesno: 'Yes/No',
  },

  countdown: {
    hours: 'h',
    minutes: 'm',
    seconds: 's',
    untilNext: 'until next insight',
  },

  watermark: {
    text: 'Divine Tarot • Private • User: {userId}',
  },

  home: {
    hero: {
      sloganLine1: "This isn't just tarot...",
      sloganLine2: "This is the clarity you already feel within…",
      quote: "The answer you're looking for… you already feel it.",
      ctaButton: "Know Your Fortune",
      ctaSubtext: "Maybe this is the answer you've been waiting for...",
    },
    about: {
      title: "About The Reader",
      description: "Your intuition already knows the truth. This space helps you hear it more clearly.",
      bio: "Bharti Singh is a seasoned tarot reader with over 10 years of experience guiding individuals through life's uncertainties. Her approach blends ancient wisdom with intuitive insight, offering clarity and direction when you need it most.",
      linkText: "Learn more about us",
    },
    finalCta: {
      title: "Tumhare answers wait kar rahe hain...",
      description: "Cards fail jaane hain. Tumhara guidance ready hai. Clarity ke liye pehla step lo.",
      button: "Aage Badhte Hain",
      subtext: "60 seconds se kam lagega • Free try karo",
    },
  },

   about: {
      hero: {
        title: 'About The Journey',
        subtitle: 'This platform was created to provide clarity when life feels confusing.',
      },
      founder: {
        role: 'Founder & Lead Tarot Reader',
        bio: "Over 10 years of experience guiding seekers through life's most confusing moments. What started as a personal journey into tarot evolved into a mission — making spiritual guidance accessible to everyone, anytime.",
        philosophy: "This platform isn't about predictions. It's about helping you see what you already feel deep inside. The cards don't tell you what to do — they help you understand what you already know.",
      },
    stats: {
      readings: '10,000+ Readings',
      since: 'Since 2014',
    },
    philosophy: {
      title: 'The Philosophy',
      clarity: {
        title: 'Clarity Over Prediction',
        desc: "We don't tell your future. We help you see your present more clearly.",
      },
      personal: {
        title: 'Personal Over Generic',
        desc: 'Every reading is unique. No templates, no copy-paste responses.',
      },
      guidance: {
        title: 'Guidance Over Advice',
        desc: 'We guide you to your own answers. The power was always within you.',
      },
    },
    why: {
      title: 'Why This Platform?',
      p1: "Traditional tarot readings require appointments, waiting, and often come with a premium price tag. But clarity shouldn't wait — and it shouldn't cost a fortune.",
      p2: 'This platform provides clarity through ancient tarot wisdom. Readings are crafted to feel personal and understand your emotional context.',
      p3: "Whether you're at 2 AM with a racing mind or need a quick perspective before a big decision — the answers are here, waiting for you.",
    },
    cta: {
      text: 'Ready to find your clarity?',
      startReading: 'Continue',
    },
  },

   landing: {
     problems: {
      stuck: {
        title: 'Feeling stuck in your life?',
        description: 'When everything feels motionless',
      },
      love: {
        title: 'Confused in love or relationships?',
        description: 'Your heart deserves honest answers',
      },
      direction: {
        title: 'Unsure about your next move?',
        description: 'The universe has guidance for you',
      },
    },
    howItWorks: {
      title: 'How It Works',
      subtitle: 'Three simple steps to unlock your clarity',
      ask: {
        title: 'Ask Your Question',
        description: 'Focus on what truly troubles your heart',
      },
      pick: {
        title: 'Pick Your Cards',
        description: 'Select three cards from the mystical deck',
      },
      reveal: {
        title: 'Reveal Your Answers',
        description: 'Receive personalized insights instantly',
      },
    },
    preview: {
      title: 'A Glimpse Into Your Journey',
      subtitle: 'What the cards might reveal for you',
      cardTitle: 'Your Reading Preview',
      // NEW: Personal opening with dynamic name
      personalOpening: 'Hey {name}… I can already feel your energy through these cards. 💖\n\nI sense a lot of confusion and emotional pull in your heart…\n\nLet’s see what message the universe has for you. ✨',
      // NEW: Section header
      messageOfCards: 'Message of the Cards',
      // NEW: Individual card interpretations
      card1: {
        name: 'The Fool',
        interpretation: 'This card reveals a deep emotional crossroads. You\'re beginning a new journey, but uncertainty clouds the first step. The universe is nudging you to trust despite the fear.',
      },
      card2: {
        name: 'The Lovers',
        interpretation: 'There\'s a powerful connection energizing your situation. This isn\'t just about romance — it\'s about aligning with what (or who) truly resonates with your soul.',
      },
      card3: {
        name: 'The Star',
        interpretation: 'Hope and healing are on the horizon. After recent challenges, clarity and renewed faith are appearing. The universe is restoring your belief in brighter days ahead.',
      },
      // NEW: Guidance block
      guidanceBlock: {
        text: "The universe is speaking one clear message to you — trust the process. 💫\n\nThe connections and opportunities you're feeling are not random. The universe is slowly pushing you in the right direction.",
      },
      // NEW: Cliffhanger preview lock
      previewLock: 'Cards have so much more to reveal… Your future, next actions, and hidden emotions are still veiled. 🌙',
// UPDATED: More emotional CTA
       ctaButton: "Unlock My Full Reading ✨",
       ctaSubtext: 'Complete Guidance Awaits 💖',
      // Keep old keys for compatibility
      pastLabel: 'The Past:',
      pastText: "You've been at a crossroads, feeling uncertain about which path to take.",
      presentLabel: 'The Present:',
      presentText: "There's a new opportunity approaching. The universe is aligning...",
      guidanceLabel: 'The Guidance:',
       guidanceText: "The universe is speaking one clear message to you — trust the process. 💫\n\nThe connections and opportunities you're feeling are not random. The universe is slowly pushing you in the right direction.",
       ctaText: 'This is just a glimpse. Your full reading awaits...',
     },
   },

   whySection: {
      title: 'Why The Divine Tarot?',
      description: 'We combine ancient tarot wisdom to create something truly unique - readings that feel personal, profound, and precisely tailored to you.',
      readings: '10,000+ readings',
      rating: '4.9 rating',
      speed: 'Under 60 seconds',
      features: {
        personalized: 'Personalized readings based on your energy',
        ai: 'Deep insights with human warmth',
        privacy: '100% private and secure',
        instant: 'Instant answers, anytime',
      },
    },

  testimonials: {
    title: 'What Seekers Say',
    seeMore: 'See more reviews',
  },

  reading: {
    title: 'Your Tarot Reading',
    selectTopic: 'What area calls to you?',
    love: 'Love & Relationships',
    career: 'Career & Work',
    confusion: 'Finding Clarity',
    finance: 'Finance',
    marriage: 'Marriage',
    noContact: 'No Contact',
    general: 'General Guidance',
    selectQuestion: 'What do you want to know?',
    askOwn: 'Ask your own question...',
    reveal: 'Reveal Your Answer',
    loading: 'Reading your energy...',
    yourCards: 'Your Cards',
     interpretation: 'What this card means for you',
    past: 'The Past',
    present: 'The Present',
    guidance: 'The Guidance',
    inputPlaceholder: "What do you want to ask?",
  },

  yesno: {
    title: 'Yes or No?',
    subtitle: 'A simple question, a clear answer',
    questionPlaceholder: 'Think of your question… What yes/no answer do you seek?',
    decode: 'Decode My Answer',
    result: {
      yes: 'YES',
      no: 'NO',
      maybe: 'THINK AGAIN',
    },
    share: 'This result seems meant for others too?',
    newReading: 'Try another',
  },

    footer: {
      tagline: 'Clarity begins within',
      copyright: '© Sitelytc Digital Media. All rights reserved.',
      madeWith: 'Made with cosmic energy',
      privacy: 'Privacy',
      navigation: 'Navigation',
      support: 'Support',
      disclaimer: 'This is not a replacement for professional advice. It is here to provide you clarity and direction.',
      description: 'Clarity for your path. Guidance for your soul.',
      cta: {
        title: 'Get Daily Divine Insights',
        subtext: 'Receive intuitive guidance directly to your inbox.',
        placeholder: 'Enter your email',
        button: 'Unlock Daily Guidance',
      },
      trust: {
        title: 'Your Trust',
        secure: 'Secure & Private Readings',
        seekers: 'Trusted by 7L+ Seekers',
        authentic: 'Authentic Spiritual Guidance',
      },
      quickLinks: {
        title: 'Quick Links',
        about: 'About',
        readings: 'Readings',
        premium: 'Premium',
        contact: 'Contact',
      },
      connect: {
        title: 'Connect With Us',
      },
    },

  chat: {
    button: 'Talk to Ginni',
    tooltip: 'Need guidance? Chat with Ginni',
    welcome: "Namaste! I'm Ginni, your spiritual guide",
    afterReading: "There's more to this… talk to me",
    placeholder: 'Type your message...',
    send: 'Send',
    contextNotice: "There's more to your reading... Starting conversation",
    footerPowered: "Powered by Divine Tarot • Spiritual guidance",
  },

  paywall: {
    title: {
      curious: "The cards are revealing something powerful...",
      urgent: "Your clarity is waiting...",
      soft: "A deeper perspective awaits",
    },
    description: {
      curious: "There's more depth to what you're seeing. Would you like to go deeper?",
      urgent: "This insight could change everything. Don't leave your path uncertain.",
      soft: "The universe has more to show you. Continue when you're ready.",
    },
    cta: {
      curious: "Continue Reading",
      urgent: "Unlock Now",
      soft: "Continue Journey",
    },
    timeLimited: 'Limited time offer',
    savings: 'Save 40% with bundle',
    securePayment: 'Secure payment • 30-day guarantee',
    messages: {
      deep_engagement: {
        title: "There's depth here I can explore with you",
        desc: "You're asking important questions. I can personally guide you through the complete reading and answer everything in detail.",
      },
      hesitation: {
        title: "You're searching for real clarity",
        desc: "I can see you're thinking hard about this. Let me give you the full picture so you can decide with confidence.",
      },
      recurring_theme: {
        title: "This pattern keeps showing up for you",
        desc: "Some energies repeat until we resolve them. Let me give you the complete guidance to finally move forward.",
      },
    },
  },

  urgency: {
    timeSensitive: 'Time-sensitive',
    limitedSpots: 'Only 2 spots left',
    endsTonight: 'Ends tonight',
    lastChance: 'Last chance',
  },

  booking: {
    selectDate: 'Select a Date',
    availableTimes: 'Available Times for',
    chooseSessionLength: 'Choose Session Length',
    bookingSummary: 'Booking Summary',
    topic: 'Topic',
    date: 'Date',
    duration: 'Duration',
    name: 'Name',
    total: 'Total',
    readingBooked: 'Your Reading is Booked',
    bookingId: 'Booking ID',
  },

  readingForm: {
    title: 'Tell us a bit more…',
    subtitle: 'So we can see clearly',
    name: 'Your name',
    namePlaceholder: 'Your name…',
    nameError: 'Also tell your name… creates personal connect',
    question: 'Your question',
    questionPlaceholder: 'What would you like to know?',
    questionError: 'Clear question → clear answer',
    processing: 'Reading is being generated…',
    patience: 'A little patience please…',
    guidance: 'Guidance',
    tryAgain: 'New reading',
    unlockFull: 'Get full access',
  },

  contact: {
    heading: 'Get In Touch',
    subtitle: 'Have a question? We would love to hear from you.',
    name: 'Name',
    namePlaceholder: 'Enter your name',
    nameHelper: 'Why? So we can address you personally',
    email: 'Email',
    emailPlaceholder: 'name@example.com',
    emailHelper: 'We\'ll send results to your email',
    message: 'Message',
    messagePlaceholder: 'What would you like to know?',
    messageHelper: 'Clear question leads to clear answer',
    submit: 'Send Message',
    success: {
      title: 'Message Sent',
      message: 'We will get back to you soon.',
    },
  },

   metadata: {
      title: "The Divine Tarot | Premium Tarot Readings",
      description: "Get answers from the universe in seconds. Experience mystical, emotionally intelligent tarot readings.",
    },
};
