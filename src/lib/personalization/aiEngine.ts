import type { Language } from '@/lib/i18n/config';
import { supabase } from '@/lib/supabase/client';

export type Tones = 'soft' | 'emotional' | 'urgent' | 'empowering';

export interface AIUIConfig {
  heroHeadline: string;
  heroSubheadline: string;
  ctaPrimary: string;
  ctaSecondary: string;
  showUrgency: boolean;
  showTestimonial: boolean;
  showPremiumBadge: boolean;
  tone: Tones;
  paywallStrength: 'soft' | 'medium' | 'strong';
  readingPrefillQuestions: string[];
  chatWelcomeMessage: string;
  chatAfterReadingMessage: string;
}

interface UserData {
  userId?: string;
  readingsCount?: number;
  sessionsCount?: number;
  totalSpent?: number;
  lastActiveAt?: string;
  daysSinceLastActive?: number;
  lastQuestion?: string;
  conversionStage?: string;
  engagementLevel?: string;
  isHighIntent?: boolean;
  dominantIntent?: string;
  memoryContext?: string;
}

const TONE_PROMPTS: Record<Tones, Record<Language, string>> = {
  soft: {
    en: "Warm, gentle, inviting. Like a wise friend.",
    hi: "गर्म, कोमल, आमंत्रित करने वाला। जैसे कोई बुद्धिमान मित्र।",
    hinglish: "Warm, gentle, inviting. Jaise koi wise friend.",
    ar: "دافئ، لطيف، invitating. مثل صديق حكيم.",
    he: "חמים, עדין, מזמין. כמו חבר חכם.",
  },
  emotional: {
    en: "Deep, empathetic, emotionally connected.",
    hi: "गहरा, सहानुभूतिपूर्ण, भावनात्मक रूप से जुड़ा हुआ।",
    hinglish: "Deep, empathetic, emotionally connected.",
    ar: "عميق، متعاطف، مرتبط عاطفياً.",
    he: "עמוק, אמפתי, קשור רגשית.",
  },
  urgent: {
    en: "Direct, compelling, action-oriented.",
    hi: "सीधा, प्रेरक, कार्य-उन्मुख।",
    hinglish: "Direct, compelling, action-oriented.",
    ar: "مباشر، مقنع، orienté vers l'action.",
    he: "ישיר, משכנע, מוכוון פעולה.",
  },
  empowering: {
    en: "Confident, strong, motivational.",
    hi: "आत्मविश्वासी, मजबूत, प्रेरणादायक।",
    hinglish: "Confident, strong, motivational.",
    ar: "واثق، قوي، محفز.",
    he: "בטוח, חזק, מעורר השראה.",
  },
};

const INTENT_HEADLINES: Record<string, Record<Language, string>> = {
  default: {
    en: "Confused about what's happening in your life?",
    hi: "आपके जीवन में क्या हो रहा है इसको लेकर कंफ्यूज़ हैं?",
    hinglish: "Tumhare life mein kya ho rha hai, confuse ho?",
    ar: "مرتبك بشأن ما يحدث في حياتك؟",
    he: "מבולבל לגבי מה שקורה בחייך?",
  },
  love: {
    en: "Something about your relationship needs clarity...",
    hi: "आपके रिलेशनशिप के बारे में कुछ स्पष्टता की जरूरत है...",
    hinglish: "Tumhare relationship mein kuch clarity chahiye...",
    ar: "شيء ما في علاقتك يحتاج إلى وضوح...",
    he: "משהו במערכת היחסים שלך צריך בהירות...",
  },
  career: {
    en: "You've been thinking about your next move...",
    hi: "आप अपने अगले कदम के बारे में सोच रहे हैं...",
    hinglish: "Tum apni next move ke baare mein soch rahe ho...",
    ar: "لقد كنت تفكر في خطوتك التالية...",
    he: "חשבת על הצעד הבא שלך...",
  },
  confusion: {
    en: "You're feeling lost, but answers are closer than you think...",
    hi: "आप खोए हुए महसूस कर रहे हैं, लेकिन जवाब कहीं पास हैं...",
    hinglish: "Tum khoye hue feel kar rahe ho, but answers paas hi hain...",
    ar: "تشعر بالضياع، لكن الإجابات أقرب مما thinks...",
    he: "אתה מרגיש אבוד, אבל התשובות קרובות יותר משאתה חושב...",
  },
};

const CTA_TEXTS: Record<string, Record<Language, string>> = {
  startReading: {
    en: "Start Your Reading",
    hi: "अपना रीडिंग शुरू करें",
    hinglish: "Reading start karo",
    ar: "ابدأ قراءتك",
    he: "התחל את הקריאה שלך",
  },
  continueJourney: {
    en: "Continue Your Journey",
    hi: "अपनी यात्रा जारी रखें",
    hinglish: "Journey continue karo",
    ar: "اصلح رحلتك",
    he: "המשך את המסע שלך",
  },
  unlockClarity: {
    en: "Unlock Full Clarity",
    hi: "पूरी स्पष्टता पाएं",
    hinglish: "Full clarity paao",
    ar: "احصل على الوضوح الكامل",
    he: "קבל בהירות מלאה",
  },
  continueReading: {
    en: "Continue Your Reading",
    hi: "अपना रीडिंग जारी रखें",
    hinglish: "Reading continue karo",
    ar: "اصلح قراءتك",
    he: "המשך את הקריאה שלך",
  },
  talkToGinni: {
    en: "Talk to Ginni",
    hi: "गिनी से बात करें",
    hinglish: "Ginni se baat karo",
    ar: "تحدث مع جيني",
    he: "דבר עם ג\'יני",
  },
};

const PREFILL_QUESTIONS: Record<string, Record<Language, string[]>> = {
  love: {
    en: [
      "What does my partner truly feel about me?",
      "Is this relationship meant to last?",
      "What's holding us back from being together?",
    ],
    hi: [
      "मेरा साथी मेरे बारे में क्या सोचता है?",
      "क्या यह रिलेशनशिप स्थायी है?",
      "हम���ं एक साथ रहने में क्या रोक रहा है?",
    ],
    hinglish: [
      "Mera partner mere baare mein kya feel karta hai?",
      "Is relationship ka future kaisa hai?",
      "Kya humein ek saath rakh raha hai?",
    ],
    ar: [
      "ما الذي يشعر به شوكي حقًا تجاهي؟",
      "هل هذه العلاقة meant لـ last؟",
      "ما الذي يمنعنا من быть zusammen؟",
    ],
    he: [
      "מה ה partner שלי באמת מרגיש לגביי?",
      "האם המערכת הזו מיועדת להימשך?",
      "מה מונע מאיתנו להיות ביחד?",
    ],
  },
  career: {
    en: [
      "What career path aligns with my purpose?",
      "Should I make this career change now?",
      "What's blocking my professional success?",
    ],
    hi: [
      "मेरा कौन सा करियर पथ मेरे उद्देश्य के अनुसार है?",
      "क्या मुझे अभी करियर बदलना चाहिए?",
      "मेरी पेशेवर सफलता में क्या रुकावट है?",
    ],
    hinglish: [
      "Konsa career path mera purpose se match karta hai?",
      "Ab career change karna chahiye?",
      "Professional success mein kya block kar raha hai?",
    ],
    ar: [
      "أي مسار مهني يتوافق مع purpose؟",
      "هل يجب أن أقوم بتغيير المهنة الآن؟",
      "ما الذي ي blocking نجاحي المهني؟",
    ],
    he: [
      "איזה מסלול קריירה מתאימ לי?",
      "האם לבצע את שינוי הקריירה עכשיו?",
      "מה מונע ממני הצלחה מקצועית?",
    ],
  },
  confusion: {
    en: [
      "What should I do next?",
      "What direction should I take?",
      "What's the best choice for me right now?",
    ],
    hi: [
      "मुझे अगला क्या करना चाहिए?",
      "मुझे किस दिशा में जाना चाहिए?",
      "मेरे लिए अभी सबसे अच्छा विकल्प क्या है?",
    ],
    hinglish: [
      "Ab kya karna chahiye?",
      "Kis direction mein jaana chahiye?",
      "Ab konsa choice best hai mere liye?",
    ],
    ar: [
      "ماذا يجب أن أفعل بعد ذلك؟",
      "أي اتجاه يجب أن أسلكه؟",
      "ما هو الخيار الأفضل لي الآن؟",
    ],
    he: [
      "מה עליי לעשות אחרי זה?",
      "לאן עליי ללכת?",
      "מה הבחירה הטובה ביותר בשבילי עכשיו?",
    ],
  },
  general: {
    en: [
      "What message does the universe have for me?",
      "What energy is surrounding me right now?",
      "What should I focus on moving forward?",
    ],
    hi: [
      "ब्रह्मांड का मेरे लिए क्या संदेश है?",
      "मेरे आसपास कौन सी ऊर्जा है?",
      "मुझे आगे किस पर ध्यान देना चाहिए?",
    ],
    hinglish: [
      "Universe ka message kya hai mere liye?",
      "Kis energy mein main abhi hoon?",
      "Aage kya focus karna chahiye?",
    ],
    ar: [
      "ما الرسالة التي يحملها الكون لي؟",
      "ما الطاقة التي تحيط بي الآن؟",
      "ما الذي يجب أن أركز عليه في المستقبل؟",
    ],
    he: [
      "איזו הודעה יש ליקום בשבילי?",
      "איזו אנרגיה מקיפה אותי עכשיו?",
      "על מה עליי להתמקד בהמשך?",
    ],
  },
};

const CHAT_MESSAGES: Record<string, Record<Language, string>> = {
  welcome: {
    en: "Namaste! I'm Ginni, your spiritual guide. How can I help you today?",
    hi: "नमस्ते! मैं गिनी हूं, आपकी आध्यात्मिक मार्गदर्शक। आज मैं आपकी कैसे मदद कर सकती हूं?",
    hinglish: "Namaste! Main Ginni hoon, tumhari spiritual guide. Aaj kaise help kar sakti hoon?",
    ar: "السلام! أنا جيني، مرشدك الروحي. كيف يمكنني مساعدتك اليوم؟",
    he: "שלום! אני ג\'יני, המדריך הרוחני שלך. איך אוכל לעזור לך היום?",
  },
  afterReading: {
    en: "There's more to this… talk to me",
    hi: "इसमें और है... मुझसे बात करो",
    hinglish: "Isme aur hai... mujhse baat karo",
    ar: "هناك المزيد من ذلك... تحدث معي",
    he: "יש עוד לזה... דבר איתי",
  },
};

export async function generateUIConfig(
  userData: UserData,
  language: Language = 'en'
): Promise<AIUIConfig> {
  const { 
    userId, 
    conversionStage = 'new', 
    engagementLevel = 'low', 
    isHighIntent = false,
    dominantIntent = 'general',
    readingsCount = 0,
    daysSinceLastActive = 0,
  } = userData;

  const headline = INTENT_HEADLINES[dominantIntent]?.[language] || INTENT_HEADLINES.default[language];
  const subheadline = getSubheadline(dominantIntent, language);
  
  const ctaKey = getCTAKey(conversionStage, isHighIntent);
  const ctaPrimary = CTA_TEXTS[ctaKey]?.[language] || CTA_TEXTS.startReading[language];
  const ctaSecondary = CTA_TEXTS.talkToGinni[language];

  const tone = determineTone(conversionStage, isHighIntent, engagementLevel);
  const showUrgency = isHighIntent && conversionStage === 'high_intent';
  const showTestimonial = conversionStage !== 'new' || engagementLevel === 'high';
  const showPremiumBadge = conversionStage === 'paid';
  const paywallStrength = determinePaywallStrength(conversionStage, isHighIntent);
  
  const questions = PREFILL_QUESTIONS[dominantIntent]?.[language] || PREFILL_QUESTIONS.general[language];
  
  const chatWelcome = CHAT_MESSAGES.welcome[language];
  const chatAfterReading = CHAT_MESSAGES.afterReading[language];

  if (userId) {
    trackAIConfigGeneration(userId, {
      conversionStage,
      engagementLevel,
      isHighIntent,
      dominantIntent,
      language,
    });
  }

  return {
    heroHeadline: headline,
    heroSubheadline: subheadline,
    ctaPrimary,
    ctaSecondary,
    showUrgency,
    showTestimonial,
    showPremiumBadge,
    tone,
    paywallStrength,
    readingPrefillQuestions: questions,
    chatWelcomeMessage: chatWelcome,
    chatAfterReadingMessage: chatAfterReading,
  };
}

function getSubheadline(intent: string, language: Language): string {
  const subheadlines: Record<string, Record<Language, string>> = {
    default: {
      en: "Get answers from the universe in seconds. Experience mystical readings that feel made just for you.",
      hi: "ब्रह्मांड से सेकंडों में जवाब पाएं। ऐसे रहस्यमय रीडिंग का अनुभव करें जो आपके लिए बनाए गए हों।",
      hinglish: "Universe se seconds mein answer paao. Mystical readings jo bilkul tumhare liye bani hain.",
      ar: "احصل على إجابات من الكون في ثوانٍ. جرب قراءات بطيئة تبدو مصنوعة من أجلك.",
      he: "קבל תשובות מהיקום בשניות. חווה קריאות מיסטיות שנראות עשויות במיוחד בשבילך.",
    },
    love: {
      en: "The cards see what your heart has been wondering about.",
      hi: "ताश के पत्ते देखते हैं कि आपके दिल में क्या है।",
      hinglish: "Cards dekhte hain ki tumhare dil mein kya chal raha hai.",
      ar: "ترى البطاقات ما يتساءل عنه قلبك.",
      he: "הקלפים רואים מה הלב שלך תוהה עליו.",
    },
    career: {
      en: "Let the universe guide your path forward.",
      hi: "ब्रह्मांड आपके रास्ते का मार्गदर्शन करता है।",
      hinglish: "Universe tumhe guide karega.",
      ar: "دع الكون يوجهك في الطريق إلى الأمام.",
      he: "תן ליקום להנחות אותך בדרך קדימה.",
    },
    confusion: {
      en: "The tarot sees the way forward.",
      hi: "तरबूत आगे का रास्ता देखता है।",
      hinglish: "Tarot aage ka raasta dekhta hai.",
      ar: " TAROT يرى الطريق إلى الأمام.",
      he: "הטארוט רואה את הדרך קדימה.",
    },
  };
  return subheadlines[intent]?.[language] || subheadlines.default[language];
}

function getCTAKey(conversionStage: string, isHighIntent: boolean): string {
  if (conversionStage === 'paid') return 'continueReading';
  if (isHighIntent) return 'unlockClarity';
  if (conversionStage === 'exploring' || conversionStage === 'high_intent') return 'continueJourney';
  return 'startReading';
}

function determineTone(
  conversionStage: string, 
  isHighIntent: boolean, 
  engagementLevel: string
): Tones {
  if (isHighIntent) return 'urgent';
  if (conversionStage === 'paid') return 'empowering';
  if (conversionStage === 'new') return 'soft';
  if (engagementLevel === 'high') return 'emotional';
  return 'soft';
}

function determinePaywallStrength(conversionStage: string, isHighIntent: boolean): 'soft' | 'medium' | 'strong' {
  if (conversionStage === 'paid') return 'soft';
  if (isHighIntent) return 'strong';
  if (conversionStage === 'high_intent') return 'medium';
  return 'soft';
}

function trackAIConfigGeneration(
  userId: string,
  params: {
    conversionStage: string;
    engagementLevel: string;
    isHighIntent: boolean;
    dominantIntent: string;
    language: Language;
  }
): void {
  // Avoid strict insert typing issues during build by casting to `any`.
  // (The schema may not be reflected in Supabase client types in this repo.)
  void (supabase as any)
    .from('events')
    .insert({
      user_id: userId,
      event_name: 'ai_ui_config_generated',
      metadata: {
        ...params,
        timestamp: new Date().toISOString(),
      },
    })
    .then(({ error }: { error: unknown }) => {
      if (error) console.error(error);
    })
    .catch((e: unknown) => console.error(e));
}

export function getTonePrompt(tone: Tones, language: Language): string {
  return TONE_PROMPTS[tone]?.[language] || TONE_PROMPTS.soft[language];
}

export function adaptMessageForLanguage(
  message: string,
  targetLanguage: Language,
  tone: Tones = 'soft'
): string {
  const tonePrompt = getTonePrompt(tone, targetLanguage);
  
  return message;
}