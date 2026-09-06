// Hindi translations - MUST match schema.ts structure exactly
// All keys provided via spread from en, with Hindi overrides

import { en } from './en';
import type { TranslationSchema } from './schema';

export const hi: TranslationSchema = {
  ...en,

  common: {
    ...en.common,
    loading: 'लोड हो रहा है...',
    error: 'कुछ गलत हो गया',
    retry: 'पुनः प्रयास करें',
    cancel: 'रद्द करें',
    confirm: 'पुष्टि करें',
    save: 'सहेजें',
    close: 'बंद करें',
    continue: 'जारी रखें',
    back: 'वापस',
    next: 'अगला',
    submit: 'जमा करें',
    skip: 'छोड़ें',
    language: 'भाषा',
    poweredBy: 'Sitelytc Digital Media द्वारा संचालित',
    under60seconds: '60 सेकंड से कम',
    connectingToGinni: 'गिनी से कनेक्ट हो रहे हैं...',
    ginniIsThinking: 'गिनी सोच रही है...',
    yourSpiritualGuide: 'आपकी आध्यात्मिक मार्गदर्शक',
    ginni: 'गिनी',
    ginniTitle: 'गिनी ✨',
    yourPersonalTarotGuide: 'आपका व्यक्तिगत टैरो गाइड',
    secureGuarantee: 'सुरक्षित भुगतान • 30-दिन की गारंटी',
    instantDelivery: 'तुरंत डिलीवरी',
    unlimitedReadings: 'असीमित रीडिंग',
    readingYourEnergy: 'आपकी ऊर्जा पढ़ रहे हैं...',
    recommendedForYou: 'आपके लिए अनुशंसित',
    fromPreviousReading: 'आपकी पिछली रीडिंग से',
    premiumAccessActive: 'प्रीमियम एक्सेस सक्रिय',
    enjoyUnlimited: 'असीमित रीडिंग का आनंद लें',
    maybeLater: 'शायद बाद में',
    noPressure: 'कोई दबाव नहीं — यह आपकी यात्रा है. लेकिन आपके लिए और भी कुछ है यहाँ.',
  },

  nav: {
    ...en.nav,
    home: 'होम',
    about: 'मेरे बारे में',
    reading: 'रीडिंग',
    subscription: 'सब्सक्रिप्शन',
    booking: 'बुकिंग',
    contact: 'संपर्क',
    talkToGinni: 'गिनी से बात करें',
  },

  home: {
    ...en.home,
    hero: {
      ...en.home.hero,
      sloganLine1: 'यह सिर्फ टैरो नहीं है...',
      sloganLine2: 'यह वो स्पष्टता है जब जिंदगी भ्रमित हो जाए...',
      quote: 'जो आप पूछना चाहते हैं... उसका उत्तर आप पहले से महसूस कर रहे हैं',
      ctaButton: 'अपना भविष्य जानें',
      ctaSubtext: 'शायद यही उत्तर है जिसका आप इंतज़ार कर रहे थे...',
    },
    // about, finalCta remain English for now
  },

  about: {
    ...en.about,
    hero: {
      ...en.about.hero,
      title: 'यात्रा के बारे में',
      subtitle: 'यह प्लेटफॉर्म सिर्फ रीडिंग्स के लिए नहीं बना… यह तब बना जब लाइफ कन्फ्यूजिंग लगती है।',
    },
    founder: {
      ...en.about.founder,
      role: 'संस्थापक और प्रमुख टैरो रीडर',
      bio: 'जीवन के सबसे कन्फ्यूजिंग पलों में सीकर्स का मार्गदर्शन करने का 10 से अधिक वर्षों का अनुभव। टैरो में व्यक्तिगत यात्रा से शुरू हुआ यह मिशन — आध्यात्मिक मार्गदर्शन सभी के लिए सुलभ बनाना।',
      philosophy: 'यह प्लेटफॉर्म भविष्यवाणी के बारे में नहीं है। यह आपको वह देखने में मदद करता है जो आप पहले से महसूस करते हैं। कार्ड्स आपको क्या करना है यह नहीं बताते — वे आपको समझने में मदद करते हैं कि आप पहले से क्या जानते हैं।',
    },
    stats: {
      ...en.about.stats,
      readings: '10,000+ रीडिंग्स',
      since: '2014 से',
    },
    philosophy: {
      ...en.about.philosophy,
      title: 'दर्शन',
      clarity: {
        ...en.about.philosophy.clarity,
        title: 'भविष्यवाणी से पहले स्पष्टता',
        desc: 'हम आपका भविष्य नहीं बताते। हम आपको अपना वर्तमान स्पष्ट रूप से देखने में मदद करते हैं।',
      },
      personal: {
        ...en.about.philosophy.personal,
        title: 'जेनरिक से व्यक्तिगत',
        desc: 'हर रीडिंग अलग है। कोई टेम्पलेट नहीं, कोई कॉपी-पेस्ट जवाब नहीं।',
      },
      guidance: {
        ...en.about.philosophy.guidance,
        title: 'सलाह से मार्गदर्शन',
        desc: 'हम आपको अपने जवाबों तक पहुंचाते हैं। शक्ति हमेशा आपके अंदर थी।',
      },
    },
     why: {
      ...en.about.why,
      title: 'यह प्लेटफॉर्म क्यों?',
      p1: 'पारंपरिक टैरो रीडिंग्स के लिए अपॉइंटमेंट, इंतज़ार, और अक्सर प्रीमियम कीमत चुकानी पड़ती है। लेकिन स्पष्टता को इंतज़ार नहीं करना चाहिए — और इसकी बड़ी कीमत नहीं होनी चाहिए।',
      p2: 'यह प्लेटफॉर्म व्यक्तिगत और गहन रीडिंग्स प्रदान करने के लिए प्राचीन टैरो ज्ञान का उपयोग करता है — जो आपको समझने में मदद करती हैं।',
      p3: 'आप रात 2 बजे उलझे हों या किसी बड़े फैसले से पहले त्वरित दृष्टिकोण चाहते हों — जवाब यहाँ हैं, आपका इंतज़ार कर रहे हैं।',
    },
    cta: {
      ...en.about.cta,
      text: 'अपनी स्पष्टता पाने के लिए तैयार?',
      startReading: 'जारी रखें',
    },
  },

  yesno: {
    ...en.yesno,
    title: 'Haan ya Nahin?',
    subtitle: 'Ek simple sawaal, ek seedha uttar',
    questionPlaceholder: 'Apna question socho… kya jaan na chahte ho?',
    decode: 'Decode My Answer',
    result: {
      yes: 'HAAN',
      no: 'NAHIN',
      maybe: 'SOCH DOBAARA',
    },
    share: 'Result sirf tumhare liye nahi lag raha?',
    newReading: 'Naya reading',
  },

  paywall: {
    ...en.paywall,
    title: {
      curious: "पत्ते कुछ शक्तिशाली दिखा रहे हैं...",
      urgent: "आपकी स्पष्टता इंतज़ार कर रही है...",
      soft: "एक गहरा दृष्टिकोण आपका इंतज़ार कर रहा है",
    },
    description: {
      curious: "आप जो देख रहे हैं उससे ज्यादा गहराई है। क्या आप और आगे जाना चाहते हैं?",
      urgent: "यह समझ सब कुछ बदल सकती है। अपने रास्ते को अनिश्चित न छोड़ें।",
      soft: "ब्रह्मांड आपको और दिखाना चाहता है। जब तैयार हों तब जारी रखें।",
    },
    cta: {
      curious: "रीडिंग जारी रखें",
      urgent: "अभी अनलॉक करें",
      soft: "यात्रा जारी रखें",
    },
    timeLimited: 'सीमित ऑफर',
    savings: 'बंडल से 40% बचत करें',
    securePayment: 'सुरक्षित भुगतान • 30-दिन की गारंटी',
  },

  chat: {
    ...en.chat,
    button: 'गिनी से बात करें',
    tooltip: 'मार्गदर्शन चाहिए? गिनी से चैट करें',
    welcome: 'नमस्ते! मैं गिनी हूं, आपकी आध्यात्मिक मार्गदर्शक',
    afterReading: 'इसमें और है... मुझसे बात करो',
    placeholder: 'अपना संदेश लिखें...',
    send: 'भेजें',
  },

  testimonials: {
    ...en.testimonials,
    title: 'सीकर क्या कहते हैं',
    seeMore: 'और समीक्षाएं देखें',
  },

  reading: {
    ...en.reading,
    title: 'तुम्हारा टैरो रीडिंग',
    selectTopic: 'किस क्षेत्र को समझना चाहते हो?',
    love: 'प्यार और रिश्ते',
    career: 'करियर और काम',
    confusion: 'स्पष्टता पाना',
    finance: 'वित्त',
    marriage: 'विवाह',
    noContact: 'कोई संपर्क नहीं',
    general: 'सामान्य मार्गदर्शन',
    selectQuestion: 'आप क्या जानना चाहते हैं?',
    askOwn: 'अपना सवाल पूछो...',
    reveal: 'अपना उत्तर प्रकट करो',
    loading: 'तुम्हारी एनर्जी पढ़ रहे हैं...',
    yourCards: 'तुम्हारे कार्ड',
    interpretation: 'व्याख्या',
    past: 'अतीत',
    present: 'वर्तमान',
    guidance: 'मार्गदर्शन',
     inputPlaceholder: "तुम क्या पूछना चाहते हो?",
   },

   footer: {
     ...en.footer,
     description: 'अपने रास्ते की स्पष्टता। अपनी आत्मा के लिए मार्गदर्शन।',
     cta: {
       title: 'दैनिक दिव्य अंतर्दृष्टि पाएँ',
       subtext: 'अपने इनबॉक्स को प्रामाणिक मार्गदर्शन प्राप्त करें।',
       placeholder: 'अपना ईमेल दर्ज करें',
       button: 'दैनिक मार्गदर्शन अनलॉक करें',
     },
     trust: {
       title: 'आपका विश्वास',
       secure: 'सुरक्षित और निजी रीडिंग्स',
       seekers: '7 लाख+ शिकारियों द्वारा विश्वसनीय',
       authentic: 'विश्वसनीय आध्यात्मिक मार्गदर्शन',
     },
     quickLinks: {
       title: 'त्वरित लिंक',
       about: 'के बारे में',
       readings: 'रीडिंग्स',
       premium: 'प्रीमियम',
       contact: 'संपर्क',
     },
     connect: {
       title: 'हमसे जुड़ें',
     },
   },
 };
