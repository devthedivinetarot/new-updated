// Hinglish translations - MUST match schema.ts structure exactly
// TypeScript will error if any key is missing

import { TranslationSchema } from './schema';
import { en } from './en';

export const hinglish: TranslationSchema = {
  ...en,

  common: {
    ...en.common,
    loading: 'Loading...',
    error: 'Kuch galat ho gaya',
    retry: 'Try again',
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
    under60seconds: '60 seconds se kam',
    connectingToGinni: 'Ginni se connect ho raha hai...',
    ginniIsThinking: 'Ginni soch rahi hai...',
    yourSpiritualGuide: 'Tumhari spiritual guide',
    ginni: 'Ginni',
    ginniTitle: 'Ginni ✨',
    yourPersonalTarotGuide: 'Tumhara personal tarot guide',
    secureGuarantee: 'Secure payment • 30-day guarantee',
    instantDelivery: 'Instant delivery',
    unlimitedReadings: 'Unlimited readings',
    readingYourEnergy: 'Tumhari energy read kar rha hoon...',
    recommendedForYou: 'Tumhare liye recommended',
    fromPreviousReading: 'Tumhari previous reading se',
    premiumAccessActive: 'Premium Access Active',
    enjoyUnlimited: 'Unlimited readings enjoy karo',
    maybeLater: 'Maybe later',
    noPressure: 'No pressure — this is your journey. But there is more here for you.',
  },

  nav: {
    ...en.nav,
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
    talkToGinni: 'Ginni se baat karo',
    yesno: 'Yes/No',
  },

  home: {
    ...en.home,
    hero: {
      ...en.home.hero,
      sloganLine1: "This sirf tarot nahi hai...",
      sloganLine2: "Yeh woh clarity hai jab life confusing ho jaati hai...",
      quote: "Jo aap poochhna chahte hain... uska jawaab aap pehle se feel kar rahe hain",
      ctaButton: "Apna bhavishya jaanein",
      ctaSubtext: "Shayad yehi jawaab hai jiska aap intezaar kar rahe the...",
    },
  },

  about: {
    ...en.about,
    hero: {
      ...en.about.hero,
      title: 'About The Journey',
      subtitle: 'Yeh platform sirf readings ke liye nahi bana. Clarity dene ke liye bana hai jab life confusing lagti hai.',
    },
    founder: {
      ...en.about.founder,
      role: 'Founder & Lead Tarot Reader',
      bio: "Over 10 years of experience guiding seekers through life's most confusing moments. What started as a personal journey into tarot evolved into a mission — making spiritual guidance accessible to everyone, anytime.",
      philosophy: "Yeh platform predictions ke liye nahi hai. Yeh tumhe dikhane ke liye hai jo tum already feel kar rahe ho. Cards tumhe kya karna hai yeh nahi batate — woh samajhne mein help karte hain.",
    },
    stats: {
      ...en.about.stats,
      readings: '10,000+ Readings',
      since: 'Since 2014',
    },
    philosophy: {
      ...en.about.philosophy,
      title: 'The Philosophy',
      clarity: {
        ...en.about.philosophy.clarity,
        title: 'Clarity Over Prediction',
        desc: "Hum tumhara future nahi batate. Hum tumhe tumhara present clearly dikhane mein help karte hain.",
      },
      personal: {
        ...en.about.philosophy.personal,
        title: 'Personal Over Generic',
        desc: 'Har reading unique hai. No templates, no copy-paste responses.',
      },
      guidance: {
        ...en.about.philosophy.guidance,
        title: 'Guidance Over Advice',
        desc: 'Hum tumhe tumhare answers tak pahunchate hain. Power hamesha tumhare andar thi.',
      },
    },
     why: {
      ...en.about.why,
      title: 'Why This Platform?',
      p1: 'Traditional tarot readings ke liye appointment, wait, aur premium price chahiye. Lekin clarity wait nahi karni chahiye — aur iski badi keemat nahi honi chahiye.',
      p2: 'Yeh platform vyakti-gat aur gehri raedings dene ke liye prachin tarot gyan ka istemal karta hai — jo tumhe samajhne mein madad karti hain.',
      p3: 'Chahe tum 2 AM par uljhe ho ya kisi bade faisle se pehle turant drishtikon ki zarurat ho — jawaab yahan hain, tumhara intezaar kar rahe hain.',
    },
    cta: {
      ...en.about.cta,
      text: 'Ready to find your clarity?',
      startReading: 'Continue',
    },
  },

   landing: {
     ...en.landing,
     preview: {
       title: 'A Glimpse Into Your Journey',
       subtitle: 'What the cards might reveal for you',
       cardTitle: 'Your Reading Preview',
        // NEW: Personal opening with dynamic name
        personalOpening: 'Arey yaar {name}… cards tumhari energy bohot strongly feel kar rahe hain. 💖\n\nLagta hai tumhare dil mein kaafi confusion aur emotional pull chal raha hai…\n\nChalo dekhte hain universe tumhe kya message dena chahta hai. ✨',
       // NEW: Section header
       messageOfCards: 'Cards Ka Message',
       // NEW: Individual card interpretations
       card1: {
         name: 'The Fool',
         interpretation: 'Yeh card ek deep emotional aur soul-level crossroads dikha raha hai. Tum naya safar shuru kar rahe ho, lekin pehla kadam uthane mein uncertainty hai. Universe tumhe fear ke bawajood trust karne ke liye push kar raha hai.',
       },
       card2: {
         name: 'The Lovers',
         interpretation: 'Yeh card tumhare situation mein ek powerful connection ka energy dikha raha hai. Yeh sirf pyaar ke baare mein nahi hai — yeh tumhare soul se resonate karne wale cheez ya rishte ke saath align hone ke baare mein hai.',
       },
       card3: {
         name: 'The Star',
         interpretation: 'Umeed aur healing ka raasta khul raha hai. Recent challenges ke baad, clarity aur restored faith aa rahi hai. Universe tumhare andar ek brighter tomorrow par faith wapas kar raha hai.',
       },
       // NEW: Guidance block
       guidanceBlock: {
         text: "Universe tumhe ek hi cheez bol raha hai — trust the process. 💫\n\nJo connection tum feel kar rahe ho woh random nahi hain. Abhi bas apni energy ko positive rakhna zaroori hai.",
       },
       // NEW: Cliffhanger preview lock
       previewLock: 'Cards ke andar aur bhi bohot kuch reveal ho raha hai... Tumhare future, next actions, aur hidden emotions ka message abhi baaki hai. 🌙',
       // UPDATED: More emotional CTA
       ctaButton: "Mera Full Reading Dekho ✨",
       ctaSubtext: '60 seconds se kam',
       // Keep old keys for compatibility
       pastLabel: 'The Past:',
       pastText: "You've been at a crossroads, feeling uncertain about which path to take.",
       presentLabel: 'The Present:',
       presentText: "There's a new opportunity approaching. The universe is aligning...",
       guidanceLabel: 'The Guidance:',
       guidanceText: 'The cards speak of hope and new beginnings...',
       ctaText: 'This is just a glimpse. Your full reading awaits...',
     },
   },

  reading: {
    ...en.reading,
    title: 'Tumhara Tarot Reading',
    selectTopic: 'Kis area mein janna chaahoge?',
    love: 'Pyaar aur Rishte',
    career: 'Career aur Kaam',
    confusion: 'Clarity Paana',
    finance: 'Finance',
    marriage: 'Marriage',
    noContact: 'No Contact',
    general: 'General Guidance',
    selectQuestion: 'Kya jaanna chahte ho?',
    askOwn: 'Apna sawaal poochho...',
    reveal: 'Answer reveal karo',
    loading: 'Tumhari energy read kar rha hoon...',
    yourCards: 'Tumhare Cards',
     interpretation: 'इस कार्ड का अर्थ',
    past: 'Past',
    present: 'Present',
    guidance: 'Guidance',
    inputPlaceholder: "What do you want to ask?",
  },

  yesno: {
    ...en.yesno,
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

  paywall: {
    ...en.paywall,
    title: {
      curious: "Patte kuch shaktishali dikh rahe hain...",
      urgent: "Tumhari clarity intezaar kar rahi hai...",
      soft: "Ek ghera drishtikon se tumhara attention ab aur jyada hai...",
    },
    description: {
      curious: "Jo tum dekh rahe ho usme aur gehrai hai. Kahana chahte ho aage jaane mein?",
      urgent: "Yeh samajh sab kuch badal sakti hai. Apne raaste ko anishchit na chhodio.",
      soft: "Brahmand tumhe aur dikhana chahta hai. Taiyar hone par jaari rakho.",
    },
    cta: {
      curious: "Reading ko jaari rakho",
      urgent: "Abhi unlock karo",
      soft: "Yatra jaari rakho",
    },
    timeLimited: 'Limited time offer',
    savings: 'Save 40% with bundle',
    securePayment: 'Secure payment • 30-day guarantee',
  },

  chat: {
    ...en.chat,
    button: 'Ginni se baat karo',
    tooltip: 'Margsadhana chahiye? Ginni se chit chat karo',
    welcome: 'Namaste! Mein Ginni, tumhari spiritual guide',
    afterReading: 'Isme aur hai... Mujhse baat karo',
    placeholder: 'Apna message likho...',
    send: 'Bhejo',
  },

  testimonials: {
    ...en.testimonials,
    title: 'Seekers kya kehte hain',
    seeMore: 'Aur reviews dekho',
  },

   whySection: {
      ...en.whySection,
      title: 'Kyun The Divine Tarot?',
      description: 'Hum ancient tarot wisdom ko tumhari energy ke saath mix karte hain - readings jo personal, profound aur bilkul tumhare liye perfect hain.',
      readings: '10,000+ readings',
      rating: '4.9 rating',
      speed: '60 seconds se kam',
      features: {
        personalized: 'Tumhari energy ke according personalized readings',
        ai: 'Insights with human touch',
        privacy: '100% private aur secure',
        instant: 'Instant answers, kabhi bhi',
      },
    },

    readingForm: {
    title: 'Thoda aur batao…',
    subtitle: 'Taaki clear dekh sakein',
    name: 'Tumhara naam',
    namePlaceholder: 'Tumhara naam…',
    nameError: 'Naam bhi batao… thoda personal connect banta hai',
    question: 'Tumhara sawal',
    questionPlaceholder: 'Kya jaan na chahte ho?',
    questionError: 'Sawal clear hoga tabhi answer bhi clear aayega',
    processing: 'Reading generate ho raha hai…',
    patience: 'Thoda patience rakhho…',
    guidance: 'Guidance',
    tryAgain: 'Naya reading',
    unlockFull: 'Full access lo',
  },

  urgency: {
    ...en.urgency,
    timeSensitive: 'Samay-sensitive',
    limitedSpots: 'Sirf 2 jagah bachi hain',
    endsTonight: 'Aaj raat khatam hoga',
    lastChance: 'Aakhri mauka',
  },

  contact: {
    heading: 'Get In Touch',
    subtitle: 'Have a question? We would love to hear from you.',
    name: 'Name',
    namePlaceholder: 'Enter your name',
    nameHelper: 'Why? So we can address you personally',
    email: 'Email',
    emailPlaceholder: 'name@example.com',
    emailHelper: 'We will send results to your email',
    message: 'Message',
    messagePlaceholder: 'What would you like to know?',
    messageHelper: 'Clear question leads to clear answer',
    submit: 'Send Message',
    success: {
      title: 'Message Sent',
      message: 'We will get back to you soon.',
    },
  },

   booking: {
     ...en.booking,
   },

   footer: {
     ...en.footer,
     description: 'Apne raaste ki clarity. Apni aatma ke liye guidance.',
     cta: {
       title: 'Daily Divine Insights paein',
       subtext: 'Apne inbox ko intuitive guidance receive karo.',
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

   metadata: {
     ...en.metadata,
   },
 };
