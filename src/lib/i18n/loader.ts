import type { Language } from './config';
import { langMap } from './config';
import { TRANSLATIONS } from './translations';
import { translations as flatTranslations } from '@/translations';

// In-memory cache for API-fetched translations
let translationCache: {
  data: Record<string, Record<string, string>>
  lastFetched: number
} | null = null

const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

// Emergency fallback translations - comprehensive
const FALLBACK: Record<string, Record<string, string>> = {
  en: {
    // Nav
    'nav.home': 'Home',
    'nav.about': 'About',
    'nav.reading': 'Reading',
    'nav.course': 'Course',
    'nav.kundli': 'Kundli Milan',
    'nav.askQuestion': 'Ask your question here',
    'nav.subscription': 'Subscription',
    'nav.booking': 'Booking',
    'nav.contact': 'Contact',
    // Footer
    'footer.tagline': 'Clarity starts from within. Sometimes, you just need a moment to pause, reflect, and understand what your heart already knows.',
    'footer.description': 'Clarity for your path. Guidance for your soul.',
    'footer.cta.title': 'Get Daily Divine Insights',
    'footer.cta.subtext': 'Receive intuitive guidance directly to your inbox.',
    'footer.cta.placeholder': 'Enter your email',
    'footer.cta.button': 'Unlock Daily Guidance',
    'footer.trust.secure': 'Secure & Private Readings',
    'footer.trust.seekers': 'Trusted by 7L+ Seekers',
    'footer.trust.authentic': 'Authentic Spiritual Guidance',
    'footer.quickLinks.about': 'About',
    'footer.quickLinks.readings': 'Readings',
    'footer.quickLinks.premium': 'Premium',
    'footer.quickLinks.contact': 'Contact',
    'footer.quickLinks.title': 'Quick Links',
    'footer.connect.title': 'Connect With Us',
    'footer.trust.title': 'Your Trust',
    'footer.navigation': 'Navigation',
    'footer.support': 'Support',
    'footer.connect': 'Connect',
    'footer.disclaimer': 'Not a replacement for professional advice. For guidance purposes only.',
    'footer.copyright': 'All rights reserved.',
    'footer.privacy': 'Privacy',
    // Home Hero
    'home.hero.sloganLine1': "This isn't just tarot...",
    'home.hero.sloganLine2': "This is clarity when life gets confusing...",
    'home.hero.quote': "The answer you're looking for... you already feel it",
    'home.hero.ctaButton': 'Know Your Fortune',
    'home.hero.ctaSubtext': "Maybe this is the answer you've been waiting for...",
    // Home Final CTA
    'home.finalCta.title': 'Your answers are waiting…',
    'home.finalCta.subtitle': 'The cards are ready. Your guidance is ready. Take the first step toward clarity.',
    'home.finalCta.button': "Let's Begin",
    'home.finalCta.subtext': 'Takes less than 60 seconds • Try it free',
    // Landing sections
    'landing.preview.title': 'A Glimpse Into Your Journey',
    'landing.preview.subtitle': 'What the cards might reveal for you',
    'landing.preview.cardTitle': 'Your Reading Preview',
    'landing.preview.pastLabel': 'The Past:',
    'landing.preview.presentLabel': 'The Present:',
    'landing.preview.guidanceLabel': 'The Guidance:',
    'landing.preview.pastText': "You've been at a crossroads...",
    'landing.preview.presentText': "There's a new opportunity approaching...",
    'landing.preview.guidanceText': 'The cards speak of hope and new beginnings...',
    'landing.preview.ctaText': 'This is just a glimpse. Your full reading awaits...',
    'landing.preview.ctaButton': "See What's Coming",
    'landing.preview.ctaSubtext': 'Takes less than 60 seconds',
    // How It Works
    'landing.howItWorks.title': 'How It Works',
    'landing.howItWorks.subtitle': 'Three simple steps to unlock your clarity',
    'landing.howItWorks.ask.title': 'Ask Your Question',
    'landing.howItWorks.ask.description': 'Focus on what truly troubles your heart',
    'landing.howItWorks.pick.title': 'Pick Your Cards',
    'landing.howItWorks.pick.description': 'Select three cards from the mystical deck',
    'landing.howItWorks.reveal.title': 'Reveal Your Answers',
    'landing.howItWorks.reveal.description': 'Receive personalized insights instantly',
    // Problems
    'landing.problems.stuck.title': 'Feeling stuck in your life?',
    'landing.problems.stuck.description': 'When everything feels motionless',
    'landing.problems.love.title': 'Confused in love or relationships?',
    'landing.problems.love.description': 'Your heart deserves honest answers',
    'landing.problems.direction.title': 'Unsure about your next move?',
    'landing.problems.direction.description': 'The universe has guidance for you',
    // About
    'landing.about.title': 'About The Journey',
    'landing.about.description': 'This platform was not created just for readings. It was created to provide clarity when life feels confusing.',
    'landing.about.bio': 'Bharti Singh is a seasoned tarot reader with over 10 years of experience guiding individuals.',
    'landing.about.linkText': 'Learn more about us',
    // Testimonials
    'testimonials.title': 'What Seekers Say',
    'testimonials.subtitle': 'What seekers are saying about their journey',
    'testimonials.role': 'Verified Reader',
    'testimonials.seeMore': 'See more reviews',
    // Why Section
    'whySection.title': 'Why The Divine Tarot?',
    'whySection.description': 'We combine ancient tarot wisdom with cutting-edge AI technology.',
    'whySection.features.personalized': 'Personalized readings based on your energy',
    'whySection.features.ai': 'AI-powered insights with human warmth',
    'whySection.features.privacy': '100% private and secure',
    'whySection.features.instant': 'Instant answers, anytime',
    // Common
    'common.loading': 'Loading...',
    'common.error': 'Something went wrong',
    'common.submit': 'Submit',
    'common.cancel': 'Cancel',
    'common.confirm': 'Confirm',
    'common.continue': 'Continue',
    'common.back': 'Back',
    'common.next': 'Next',
    // About page
    'about.hero.title': 'About The Journey',
    'about.hero.subtitle': 'This platform was not created just for readings. It was created to provide clarity when life feels confusing.',
    'about.founder.role': 'Founder & Lead Tarot Reader',
    'about.founder.bio': "Over 10 years of experience guiding seekers through life's most confusing moments. What started as a personal journey into tarot evolved into a mission — making spiritual guidance accessible to everyone, anytime.",
    'about.founder.philosophy': "This platform isn't about predictions. It's about helping you see what you already feel deep inside. The cards don't tell you what to do — they help you understand what you already know.",
    'about.stats.readings': '10,000+ Readings',
    'about.stats.since': 'Since 2014',
    'about.philosophy.title': 'The Philosophy',
    'about.philosophy.clarity.title': 'Clarity Over Prediction',
    'about.philosophy.clarity.desc': "We don't tell your future. We help you see your present more clearly.",
    'about.philosophy.personal.title': 'Personal Over Generic',
    'about.philosophy.personal.desc': 'Every reading is unique. No templates, no copy-paste responses.',
    'about.philosophy.guidance.title': 'Guidance Over Advice',
    'about.philosophy.guidance.desc': 'We guide you to your own answers. The power was always within you.',
    'about.why.title': 'Why This Platform?',
    'about.why.p1': "Traditional tarot readings require appointments, waiting, and often come with a premium price tag. But clarity shouldn't wait — and it shouldn't cost a fortune.",
    'about.why.p2': 'This platform combines ancient tarot wisdom with modern AI technology to create something truly unique: readings that feel personal, that understand your emotional context, and that give you insight when you need it most.',
    'about.why.p3': "Whether you're at 2 AM with a racing mind or need a quick perspective before a big decision — the answers are here, waiting for you.",
    'about.cta.text': 'Ready to find your clarity?',
    'cta.startReading': 'Start Reading',
    // Redesigned About content
    'about.redesigned.hero.title': 'About The Divine Tarot',
    'about.redesigned.hero.subtitle': 'A sacred space for clarity, healing, and transformation.',
    'about.redesigned.intro': "I'm Bharti Singh. For over a decade, I've been honored to guide thousands of seekers through life's most profound moments of uncertainty. What began as a personal calling evolved into a mission — to make the ancient wisdom of tarot accessible, relatable, and deeply transformative for every soul seeking light.",
    'about.redesigned.authority.title': 'Authority',
    'about.redesigned.authority.badge1.title': "India's No.1 Psychic Tarot Reader",
    'about.redesigned.authority.badge1.desc': 'Recognized nationally for intuitive accuracy',
    'about.redesigned.authority.badge2.title': '7 Lakh+ YouTube Community',
    'about.redesigned.authority.badge2.desc': 'A family of seekers growing together',
    'about.redesigned.philosophy.title': 'Why This Space Exists',
    'about.redesigned.philosophy.text': 'The cards don\'t predict your future — they help you remember what your soul already knows. This is a sanctuary where ancient symbolism meets modern intuition, where clarity emerges not from fortune-telling, but from deep inner knowing. Here, you\'re not just getting answers — you\'re reconnecting with your own wisdom.',
    'about.redesigned.expertise.title': 'The Paths I Walk',
    'about.redesigned.expertise.divination.title': 'Divination',
    'about.redesigned.expertise.divination.items': 'Hindi Tarot • Runes • Candle Wax • Dice • Tea Leaf Reading',
    'about.redesigned.expertise.astrology.title': 'Astrology',
    'about.redesigned.expertise.astrology.items': 'Vedic • Nadi • Prashanna • KP',
    'about.redesigned.expertise.transformation.title': 'Transformation',
    'about.redesigned.expertise.transformation.items': 'Manifestation Coaching • Life Alignment',
    'about.redesigned.expertise.esoteric.title': 'Esoteric Arts',
    'about.redesigned.expertise.esoteric.items': 'Numerology • Hoodoo • Tantra • Spells',
    'about.redesigned.differentiator.title': 'The Sacred Blend',
    'about.redesigned.differentiator.p1': 'Where ancient tradition meets intuitive innovation. I bridge the timeless wisdom of Eastern mysticism with a grounded, modern approach — creating a holistic experience that honors both spirit and practicality.',
    'about.redesigned.differentiator.p2': 'Every reading is a sacred conversation, not a template. Your energy is unique; your guidance should be too.',
    'about.redesigned.closing.text': 'The answers you seek already exist within you. Consider this space a mirror — reflecting back the clarity, the strength, and the divine wisdom that has always been your birthright. You are more powerful than you know.',
    'about.redesigned.cta.title': 'Step Into Your Power',
    'about.redesigned.cta.button': 'Start Your Reading',
    // About features
    'home.about.feature1': 'Deep insights',
    'home.about.feature2': 'Spiritual guidance',
    'home.about.feature3': 'Personalized clarity',
    // Reading page
    'reading.selectTopic': 'What area of your life needs clarity?',
    'reading.enterQuestion': 'What would you like to know?',
    'reading.inputPlaceholder': 'Ask your question…',
    'reading.selectCards': 'Select 3 cards',
    'reading.loading': "Let's see what comes through…",
    'reading.cardsSaying': "Your cards are saying:",
    // Contact page
    'contact.heading': 'Get in Touch',
    'contact.subtitle': "Have a question or need guidance? We'd love to hear from you.",
    'contact.name': 'Your Name',
    'contact.namePlaceholder': 'Enter your name',
    'contact.nameHelper': 'So we know who to address',
    'contact.email': 'Email Address',
    'contact.emailPlaceholder': 'you@example.com',
    'contact.emailHelper': "We'll reply to this address",
    'contact.message': 'Your Message',
    'contact.messagePlaceholder': 'Write your message here…',
    'contact.messageHelper': 'Share as much detail as you like',
    'contact.submit': 'Send Message',
    'contact.success.title': 'Message on its way!',
    'contact.success.message': "Thank you for reaching out. We'll get back to you soon. ✨",
  },
  hi: {
    // Nav
    'nav.home': 'होम',
    'nav.about': 'के बारे में',
    'nav.reading': 'रीडिंग',
    'nav.course': 'कोर्स',
    'nav.kundli': 'कुंडली मिलान',
    'nav.askQuestion': 'अपना सवाल यहाँ पूछें',
    'nav.subscription': 'सब्सक्रिप्शन',
    'nav.booking': 'बुकिंग',
    'nav.contact': 'संपर्क',
    // Footer
    'footer.tagline': 'स्पष्टता अंदर से शुरू होती है। कभी-कभी, आपको बस रुकने, सोचने और समझने की जरूरत है कि आपका दिल क्या जानता है।',
    'footer.description': 'अपने रास्ते की स्पष्टता। अपनी आत्मा के लिए मार्गदर्शन।',
    'footer.cta.title': 'दैनिक दिव्य अंतर्दृष्टि पाएँ',
    'footer.cta.subtext': 'अपने इनबॉक्स को प्रामाणिक मार्गदर्शन प्राप्त करें।',
    'footer.cta.placeholder': 'अपना ईमेल दर्ज करें',
    'footer.cta.button': 'दैनिक मार्गदर्शन अनलॉक करें',
    'footer.trust.secure': 'सुरक्षित और निजी रीडिंग्स',
    'footer.trust.seekers': '7 लाख+ शिकारियों द्वारा विश्वसनीय',
    'footer.trust.authentic': 'विश्वसनीय आध्यात्मिक मार्गदर्शन',
    'footer.quickLinks.about': 'के बारे में',
    'footer.quickLinks.readings': 'रीडिंग्स',
    'footer.quickLinks.premium': 'प्रीमियम',
    'footer.quickLinks.contact': 'सपर्ट',
    'footer.quickLinks.title': 'त्वरित लिंक',
    'footer.connect.title': 'हमसे जुड़ें',
    'footer.trust.title': 'आपका विश्वास',
    'footer.navigation': 'नेविगेशन',
    'footer.support': 'सहायता',
    'footer.connect': 'जुड़ें',
    'footer.disclaimer': 'यह पेशेवर सलाह का विकल्प नहीं है। केवल मार्गदर्शन के उद्देश्यों के लिए है।',
    'footer.copyright': 'सर्वाधिकार सुरक्षित।',
    'footer.privacy': 'गोपनीयता',
    // Home Hero
    'home.hero.sloganLine1': 'यह सिर्फ टैरो नहीं है...',
    'home.hero.sloganLine2': 'यह वो स्पष्टता है जब जिंदगी भ्रमित हो जाए...',
    'home.hero.quote': 'जो आप पूछना चाहते हैं... उसका उत्तर आप पहले से महसूस कर रहे हैं',
    'home.hero.ctaButton': 'अपना भविष्य जानें',
    'home.hero.ctaSubtext': 'शायद यही उत्तर है जिसका आप इंतज़ार कर रहे थे...',
    // Home Final CTA
    'home.finalCta.title': 'आपके उत्तर आपका इंतज़ार कर रहे हैं…',
    'home.finalCta.subtitle': 'कार्ड्स तैयार हैं। आपका मार्गदर्शन तैयार है। स्पष्टता की ओर पहला कदम बढ़ाएँ।',
    'home.finalCta.button': 'चलिए शुरू करें',
    'home.finalCta.subtext': '60 सेकंड से कम • मुफ़्त आज़माएँ',
    // Landing
    'landing.preview.title': 'आपकी यात्रा की एक झलक',
    'landing.preview.subtitle': 'पत्ते आपके लिए क्या प्रकट कर सकते हैं',
    'landing.preview.cardTitle': 'आपकी रीडिंग पूर्वावलोकन',
    'landing.preview.pastLabel': 'अतीत:',
    'landing.preview.presentLabel': 'वर्तमान:',
    'landing.preview.guidanceLabel': 'मार्गदर्शन:',
    'landing.preview.pastText': 'आप एक चौराहे पर थे...',
    'landing.preview.presentText': 'एक नया अवसर आ रहा है...',
    'landing.preview.guidanceText': 'पत्ते आशा और नई शुरुआत की बात करते हैं...',
    'landing.preview.ctaText': 'यह बस एक झलक है। आपकी पूरी रीडिंग इंतज़ार कर रही है...',
    'landing.preview.ctaButton': 'देखें क्या आ रहा है',
    'landing.preview.ctaSubtext': '60 सेकंड से कम समय लेता है',
    'landing.howItWorks.title': 'यह कैसे काम करता है',
    'landing.howItWorks.subtitle': 'अपनी स्पष्टता पाने के तीन आसान कदम',
    'landing.howItWorks.ask.title': 'अपना सवाल पूछें',
    'landing.howItWorks.ask.description': 'जो वाकई आपके दिल को परेशान करता है उस पर ध्यान दें',
    'landing.howItWorks.pick.title': 'अपने पत्ते चुनें',
    'landing.howItWorks.pick.description': 'रहस्यमय डेक से तीन पत्ते चुनें',
    'landing.howItWorks.reveal.title': 'अपने उत्तर जानें',
    'landing.howItWorks.reveal.description': 'तुरंत व्यक्तिगत अंतर्दृष्टि प्राप्त करें',
    'landing.problems.stuck.title': 'जीवन में अटके हुए महसूस करते हैं?',
    'landing.problems.stuck.description': 'जब सब कुछ स्थिर लगे',
    'landing.problems.love.title': 'प्यार या रिश्तों में कंफ्यूज़?',
    'landing.problems.love.description': 'आपके दिल को ईमानदार जवाब मिलने चाहिए',
    'landing.problems.direction.title': 'अपने अगले कदम के बारे में अनिश्चित?',
    'landing.problems.direction.description': 'ब्रह्मांड के पास आपके लिए मार्गदर्शन है',
    'landing.about.title': 'यात्रा के बारे में',
    'landing.about.description': 'यह प्लेटफॉर्म सिर्फ रीडिंग्स के लिए नहीं बना। जब जिंदगी कन्फ्यूजिंग लगती है तब स्पष्टता देने के लिए बना।',
    'landing.about.bio': 'भारती सिंह 10 से अधिक वर्षों के अनुभव वाली एक अनुभवी टैरो रीडर हैं।',
    'landing.about.linkText': 'हमारे बारे में और जानें',
    'testimonials.title': 'साधक क्या कहते हैं',
    'testimonials.subtitle': 'साधक अपनी यात्रा के बारे में क्या कह रहे हैं',
    'testimonials.role': 'सत्यापित पाठक',
    'testimonials.seeMore': 'और समीक्षाएं देखें',
    'whySection.title': 'क्यों द डिवाइन टैरो?',
    'whySection.description': 'हम प्राचीन टैरो ज्ञान को अत्याध���न���क AI तकनीक के साथ जोड़ते हैं।',
    'whySection.features.personalized': 'आपकी ऊर्जा के आधार पर व्यक्तिगत रीडिंग',
    'whySection.features.ai': 'मानवीय गर्माहट के साथ AI-संचालित अंतर्दृष्टि',
    'whySection.features.privacy': '100% निजी और सुरक्षित',
    'whySection.features.instant': 'तुरंत जवाब, कभी भी',
    'common.loading': 'लोड हो रहा है...',
    'common.error': 'कुछ गलत हो गया',
    'common.submit': 'जमा करें',
    'common.cancel': 'रद्द करें',
    'common.confirm': 'पुष्टि करें',
    'common.continue': 'जारी रखें',
    'common.back': 'वापस',
    'common.next': 'अगला',
    // About page
    'about.hero.title': 'यात्रा के बारे में',
    'about.hero.subtitle': 'यह प्लेटफॉर्म सिर्फ रीडिंग्स के लिए नहीं बना। जब जिंदगी कन्फ्यूजिंग लगती है तब स्पष्टता देने के लिए बना।',
    'about.founder.role': 'संस्थापक एवं प्रमुख टैरो रीडर',
    'about.founder.bio': '10 से अधिक वर्षों का अनुभव रखने वाली एक गहरी अंतर्ज्ञान वाली टैरो रीडर। जो एक व्यक्तिगत यात्रा से शुरू हुई, वह एक मिशन बन गया — सभी के लिए आध्यात्मिक मार्गदर्शन सुलभ बनाना।',
    'about.founder.philosophy': 'यह प्लेटफॉर्म भविष्यवाणी के बारे में नहीं है। यह आपको वह दिखाने के बारे में है जो आप पहले से अंदर से महसूस करते हैं। कार्ड्स आपको क्या करना है यह नहीं बताते — वे आपको समझने में मदद करते हैं।',
    'about.stats.readings': '10,000+ रीडिंग',
    'about.stats.since': '2014 से',
    'about.philosophy.title': 'दर्शन',
    'about.philosophy.clarity.title': 'भविष्यवाणी से पहले स्पष्टता',
    'about.philosophy.clarity.desc': 'हम आपका भविष्य नहीं बताते। हम आपको अपना वर्तमान स्पष्ट रूप से देखने में मदद करते हैं।',
    'about.philosophy.personal.title': 'जेनरिक से व्यक्तिगत',
    'about.philosophy.personal.desc': 'हर रीडिंग अलग है। कोई टेम्पलेट नहीं, कोई कॉपी-पेस्ट जवाब नहीं।',
    'about.philosophy.guidance.title': 'सलाह से मार्गदर्शन',
    'about.philosophy.guidance.desc': 'हम आपको अपने जवाबों तक पहुंचाते हैं। शक्ति हमेशा आपके अंदर थी।',
    'about.why.title': 'यह प्लेटफॉर्म क्यों?',
    'about.why.p1': 'पारंपरिक टैरो रीडिंग्स के लिए अपॉइंटमेंट, इंतज़ार, और अक्सर प्रीमियम कीमत चुकानी पड़ती है। लेकिन स्पष्टता को इंतज़ार नहीं करना चाहिए।',
    'about.why.p2': 'यह प्लेटफॉर्म प्राचीन टैरो ज्ञान को आधुनिक AI तकनीक के साथ जोड़ता है — ऐसी रीडिंग्स जो व्यक्तिगत हों, जो आपके भावनात्मक संदर्भ को समझें।',
    'about.why.p3': 'चाहे आप रात 2 बजे दिमाग घूम रहा हो या बड़े फैसले से ��हले त्वरित दृष्टिकोण चाहते हों — जवाब यहाँ हैं, आपका इंतज़ार कर रहे हैं।',
    'about.cta.text': 'अपनी स्पष्टता पाने के लिए तैयार?',
    'cta.startReading': 'रीडिंग शुरू करें',
    // Redesigned About content
    'about.redesigned.hero.title': 'अब द डिवाइन टैरो के बारे में',
    'about.redesigned.hero.subtitle': 'स्पष्टता, खोज और परिवर्तन के लिए एक पवित्र स्थान।',
    'about.redesigned.intro': 'मैं भारती सिंह। एक दशक से अधिक समय से, मैं हजारों शिकारियों के साथ जीवन के सबसे महत्वपूर्ण क्षणों में मार्गदर्शन करने का सम्मान करती हूँ। एक व्यक्तिगत फ़रमान से शुरू हुआ, जो एक मिशन में बदल गया — प्राचीन टैरो के ज्ञान को सभी के लिए सुलभ, संबंधित और गहन रूप से परिवर्तनकारी बनाना।',
    'about.redesigned.authority.title': 'प्रतिष्ठा',
    'about.redesigned.authority.badge1.title': "भारत का नंबर 1 मनोवैज्ञानिक टैरो रीडर",
    'about.redesigned.authority.badge1.desc': 'अंतर्ज्ञान की सटीकता के लिए राष्ट्रीय स्तर पर मान्य',
    'about.redesigned.authority.badge2.title': '7 लाख+ यूट्यूब कम्यूनिटी',
    'about.redesigned.authority.badge2.desc': 'एक परिवार जहाँ शिकारियों का विस्तार हो रहा है',
    'about.redesigned.philosophy.title': 'यह स्थान क्यों है',
    'about.redesigned.philosophy.text': 'कार्ड आपके भविष्य की भविष्यवाणी नहीं करते — वे आपको याद दिलाते हैं कि आपकी आत्मा पहले से क्या जानती है। यह एक संत स्थान है जहाँ प्राचीन प्रतीकवाद आधुनिक अंतर्ज्ञान से मिलता है, जहाँ स्पष्टता भविष्यवाणी से नहीं, बल्कि गहन आंतरिक ज्ञान से उभरती है। यहाँ, आप सिर्फ जवाब नहीं पा रहे हैं — आप अपने स्वयं के ज्ञान से फिर से जुड़ रहे हैं।',
    'about.redesigned.expertise.title': 'मेरे मार्ग',
    'about.redesigned.expertise.divination.title': 'भविष्यवाणी',
    'about.redesigned.expertise.divination.items': 'हिंदी टैरो • रून • मोमबत्ती वाला • पासा • चाय पत्ती रीडिंग',
    'about.redesigned.expertise.astrology.title': 'ज्योतिष',
    'about.redesigned.expertise.astrology.items': 'वैदिक • नडी • प्रश्ना • के पी',
    'about.redesigned.expertise.transformation.title': 'परिवर्तन',
    'about.redesigned.expertise.transformation.items': 'मैनिफेस्टेशन कोचिंग • जीवन संरेखण',
    'about.redesigned.expertise.esoteric.title': 'रहस्यमय कला',
    'about.redesigned.expertise.esoteric.items': 'अंक ज्योतिष • हुडू • तंत्र • तोते',
    'about.redesigned.differentiator.title': 'पवित्र मेल',
    'about.redesigned.differentiator.p1': 'जहाँ प्राचीन परंपरा अंतर्ज्ञान से मिलती है। मैं पूर्वी रहस्यवाद की सदा-बाली अखंडता को एक ठोस, आधुनिक दृष्टिकोण से जोड़ता हूँ — एक समग्र अनुभव बनाता हूँ जो आत्मा और व्यावहारिकता दोनों का सम्मान करता है।',
    'about.redesigned.differentiator.p2': 'हर रीडिंग एक पवित्र संवाद है, कोई टेम्पलेट नहीं। आपकी ऊर्जा अनोखी है; आपका मार्गदर्शन भी विशेष होना चाहिए।',
    'about.redesigned.closing.text': 'जिन उत्तरों की तुम खोज रहे हो, वे पहले से ही तुम्हारे अंदर मौजूद हैं। इस स्थान को एक दर्पण समझो — जो उस स्पष्टता, उस शक्ति और उस दिव्य ज्ञान को वापस दिखाता है, जो हमेशा से आपका जन्म सिद्ध हक् रहा है। तुम उससे कहीं अधिक शक्तिशाली हो।',
    'about.redesigned.cta.title': 'अपनी ताकत में कदम रखो',
    'about.redesigned.cta.button': 'अपनी रीडिंग शुरू करो',
    // About features
    'home.about.feature1': 'गहरी अंतर्दृष्टि',
    'home.about.feature2': 'आध्यात्मिक मार्गदर्शन',
    'home.about.feature3': 'व्यक्तिगत स्पष्टता',
    // Reading page
    'reading.selectTopic': 'आपके जीवन में किस क्षेत्र को स्पष्टता चाहिए?',
    'reading.enterQuestion': 'आप क्या जानना चाहते हैं?',
    'reading.inputPlaceholder': 'अपना सवाल लिखें…',
    'reading.selectCards': '3 पत्ते चुनें',
    'reading.loading': 'चलो देखते हैं क्या आता है…',
    'reading.cardsSaying': 'आपके पत्ते कह रहे हैं:',
    // Contact page
    'contact.heading': 'संपर्क करें',
    'contact.subtitle': 'कोई सवाल है या मार्गदर्शन चाहिए? हमें आपसे सुनकर खुशी होगी।',
    'contact.name': 'आपका नाम',
    'contact.namePlaceholder': 'अपना नाम लिखें',
    'contact.nameHelper': 'ताकि हम जानें किससे बात कर रहे हैं',
    'contact.email': 'ईमेल पता',
    'contact.emailPlaceholder': 'you@example.com',
    'contact.emailHelper': 'हम इसी पते पर जवाब देंगे',
    'contact.message': 'आपका संदेश',
    'contact.messagePlaceholder': 'अपना संदेश यहां लिखें…',
    'contact.messageHelper': 'जितना चाहें उतना विस्तार से लिखें',
    'contact.submit': 'संदेश भेजें',
    'contact.success.title': 'संदेश भेज दिया गया!',
    'contact.success.message': 'संपर्क करने के लिए धन्यवाद। हम जल्द ही आपसे संपर्क करेंगे। ✨',
  },
   hinglish: {
     // Nav
     'nav.home': 'Home',
     'nav.about': 'About',
     'nav.reading': 'Reading',
     'nav.course': 'Course',
     'nav.kundli': 'Kundli Milan',
     'nav.askQuestion': 'Apna sawaal yahan poochho',
     'nav.subscription': 'Subscription',
     'nav.booking': 'Booking',
     'nav.contact': 'Contact',
    // Footer
    'footer.tagline': 'Clarity starts from within. Kabhi-kabhi, tumhe bas ruki, socha aur samajhna padta hai ki tumhara dil kya jaanta hai.',
    'footer.description': 'Apne raaste ki clarity. Apni aatma ke liye guidance.',
    'footer.cta.title': 'Get Daily Divine Insights',
    'footer.cta.subtext': 'Apne inbox ko intuitive guidance receive karo.',
    'footer.cta.placeholder': 'Enter your email',
    'footer.cta.button': 'Unlock Daily Guidance',
    'footer.trust.secure': 'Secure & Private Readings',
    'footer.trust.seekers': 'Trusted by 7L+ Seekers',
    'footer.trust.authentic': 'Authentic Spiritual Guidance',
    'footer.quickLinks.about': 'About',
    'footer.quickLinks.readings': 'Readings',
    'footer.quickLinks.premium': 'Premium',
    'footer.quickLinks.contact': 'Contact',
    'footer.quickLinks.title': 'Quick Links',
    'footer.connect.title': 'Connect With Us',
    'footer.trust.title': 'Your Trust',
    'footer.navigation': 'Navigation',
     'footer.support': 'Support',
     'footer.connect': 'Connect',
     'footer.disclaimer': 'Yeh professional advice ka replace nahi hai. Sirf guidance ke liye hai.',
     'footer.copyright': 'All rights reserved.',
     'footer.privacy': 'Privacy',
     // Home Hero
     'home.hero.sloganLine1': "This sirf tarot nahi hai...",
     'home.hero.sloganLine2': "Yeh woh clarity hai jab life confusing ho jaati hai...",
     'home.hero.quote': "Jo aap poochhna chahte hain... uska jawaab aap pehle se feel kar rahe hain",
     'home.hero.ctaButton': "Apna bhavishya jaanein",
     'home.hero.ctaSubtext': "Shayad yehi jawaab hai jiska aap intezaar kar rahe the...",
     // Home Final CTA
     'home.finalCta.title': 'Tumhare answers wait kar rahe hain…',
     'home.finalCta.subtitle': 'Cards ready hain. Tumhara guidance ready hai. Clarity ke liye pehla step lo.',
     'home.finalCta.button': 'Aage Badhte Hain',
     'home.finalCta.subtext': '60 seconds se kam lagega • Free try karo',
     // Landing
     'landing.preview.title': 'Tumhare journey ki ek glimpse',
     'landing.preview.subtitle': 'Kya cards tumhare liye reveal kar sakte hain',
     'landing.preview.cardTitle': 'Tumhari Reading Preview',
     'landing.preview.pastLabel': 'Past:',
     'landing.preview.presentLabel': 'Present:',
     'landing.preview.guidanceLabel': 'Guidance:',
     'landing.preview.pastText': 'Tum ek crossroads par ho...',
     'landing.preview.presentText': 'Ek naya opportunity approaching hai...',
     'landing.preview.guidanceText': 'Cards hope aur new beginnings ki baat karte hain...',
     'landing.preview.ctaText': 'Yeh sirf glimpse hai. Full reading await kar rahi hai...',
     'landing.preview.ctaButton': 'Dekho kya aa raha hai',
     'landing.preview.ctaSubtext': '60 seconds se kam time lega',
     'landing.howItWorks.title': 'Yeh kaise kaam karta hai',
     'landing.howItWorks.subtitle': 'Clarity pane ke liye teen simple steps',
     'landing.howItWorks.ask.title': 'Apna sawaal poochho',
     'landing.howItWorks.ask.description': 'Jo sach mein tumhare dil ko trouble kar raha hai us par focus karo',
     'landing.howItWorks.pick.title': 'Apne cards choose karo',
     'landing.howItWorks.pick.description': 'Mystical deck se teen cards choose karo',
     'landing.howItWorks.reveal.title': 'Apne answers reveal karo',
     'landing.howItWorks.reveal.description': 'Instant personalized insights pao',
     'landing.problems.stuck.title': 'Life mein stuck feel kar rahe ho?',
     'landing.problems.stuck.description': 'Jab sab kuch stagnant lagta hai',
     'landing.problems.love.title': 'Love ya relationships mein confused?',
     'landing.problems.love.description': 'Tumhara dil honest answers deserve karta hai',
     'landing.problems.direction.title': 'Apni next move ke baare mein unsure?',
     'landing.problems.direction.description': 'Universe ke paas tumhare liye guidance hai',
     'landing.about.title': 'Journey ke baare mein',
     'landing.about.description': 'Yeh platform sirf readings ke liye nahi bana. Clarity dene ke liye bana hai jab life confusing lagti hai.',
     'landing.about.bio': 'Bharti Singh ek experienced tarot reader hain 10+ saal ke experience ke saath.',
     'landing.about.linkText': 'Humare baare mein aur jaano',
     'testimonials.title': 'Seekers kya kehte hain',
     'testimonials.subtitle': 'Seekers apni journey ke baare mein kya keh rahe hain',
     'testimonials.role': 'Verified Reader',
     'testimonials.seeMore': 'Aur reviews dekho',
     'whySection.title': 'Kyun The Divine Tarot?',
     'whySection.description': 'Hum ancient tarot wisdom ko AI tech ke saath mix karte hain.',
     'whySection.features.personalized': 'Tumhari energy ke according personalized readings',
     'whySection.features.ai': 'AI-powered insights with human touch',
     'whySection.features.privacy': '100% private aur secure',
     'whySection.features.instant': 'Instant answers, kabhi bhi',
     'common.loading': 'Loading...',
     'common.error': 'Kuch galat ho gaya',
     'common.submit': 'Submit',
     'common.cancel': 'Cancel',
     'common.confirm': 'Confirm',
     'common.continue': 'Continue',
     'common.back': 'Back',
     'common.next': 'Next',
     // About page
     'about.hero.title': 'About The Journey',
     'about.hero.subtitle': 'Yeh platform sirf readings ke liye nahi bana. Clarity dene ke liye bana hai jab life confusing lagti hai.',
     'about.founder.role': 'Founder & Lead Tarot Reader',
     'about.founder.bio': "Over 10 years of experience guiding seekers through life's most confusing moments. What started as a personal journey into tarot evolved into a mission.",
     'about.founder.philosophy': "Yeh platform predictions ke liye nahi hai. Yeh tumhe dikhane ke liye hai jo tum already feel kar rahe ho. Cards tumhe kya karna hai yeh nahi batate — woh samajhne mein help karte hain.",
     'about.stats.readings': '10,000+ Readings',
     'about.stats.since': 'Since 2014',
     'about.philosophy.title': 'The Philosophy',
     'about.philosophy.clarity.title': 'Clarity Over Prediction',
     'about.philosophy.clarity.desc': "Hum tumhara future nahi batate. Hum tumhe tumhara present clearly dikhane mein help karte hain.",
     'about.philosophy.personal.title': 'Personal Over Generic',
     'about.philosophy.personal.desc': 'Har reading unique hai. No templates, no copy-paste responses.',
     'about.philosophy.guidance.title': 'Guidance Over Advice',
     'about.philosophy.guidance.desc': 'Hum tumhe tumhare answers tak pahunchate hain. Power hamesha tumhare andar thi.',
     'about.why.title': 'Why This Platform?',
     'about.why.p1': 'Traditional tarot readings ke liye appointment, wait, aur premium price chahiye. But clarity wait nahi karni chahiye.',
     'about.why.p2': 'Yeh platform ancient tarot wisdom ko modern AI technology ke saath mix karta hai — readings jo personal hain, jo tumhari emotional context samajhte hain.',
     'about.why.p3': 'Chahe tum 2 AM par confused ho ya big decision se pehle quick perspective chahiye — answers yahan hain, tumhare liye wait kar rahe hain.',
     'about.cta.text': 'Ready to find your clarity?',
     'cta.startReading': 'Start Reading',
     // Redesigned About content (premium brand positioning)
     'about.redesigned.hero.title': 'About The Divine Tarot',
     'about.redesigned.hero.subtitle': 'A sacred space for clarity, healing, and transformation.',
     'about.redesigned.intro': "I'm Bharti Singh. For over a decade, I've been honored to guide thousands of seekers through life's most profound moments of uncertainty. What began as a personal calling evolved into a mission — to make the ancient wisdom of tarot accessible, relatable, and deeply transformative for every soul seeking light.",
     'about.redesigned.authority.title': 'Authority',
     'about.redesigned.authority.badge1.title': "India's No.1 Psychic Tarot Reader",
     'about.redesigned.authority.badge1.desc': 'Recognized nationally for intuitive accuracy',
     'about.redesigned.authority.badge2.title': '7 Lakh+ YouTube Community',
     'about.redesigned.authority.badge2.desc': 'A family of seekers growing together',
     'about.redesigned.philosophy.title': 'Why This Space Exists',
     'about.redesigned.philosophy.text': 'The cards don\'t predict your future — they help you remember what your soul already knows. This is a sanctuary where ancient symbolism meets modern intuition, where clarity emerges not from fortune-telling, but from deep inner knowing. Here, you\'re not just getting answers — you\'re reconnecting with your own wisdom.',
     'about.redesigned.expertise.title': 'The Paths I Walk',
     'about.redesigned.expertise.divination.title': 'Divination',
     'about.redesigned.expertise.divination.items': 'Hindi Tarot • Runes • Candle Wax • Dice • Tea Leaf Reading',
     'about.redesigned.expertise.astrology.title': 'Astrology',
     'about.redesigned.expertise.astrology.items': 'Vedic • Nadi • Prashanna • KP',
     'about.redesigned.expertise.transformation.title': 'Transformation',
     'about.redesigned.expertise.transformation.items': 'Manifestation Coaching • Life Alignment',
     'about.redesigned.expertise.esoteric.title': 'Esoteric Arts',
     'about.redesigned.expertise.esoteric.items': 'Numerology • Hoodoo • Tantra • Spells',
     'about.redesigned.differentiator.title': 'The Sacred Blend',
     'about.redesigned.differentiator.p1': 'Where ancient tradition meets intuitive innovation. I bridge the timeless wisdom of Eastern mysticism with a grounded, modern approach — creating a holistic experience that honors both spirit and practicality.',
     'about.redesigned.differentiator.p2': 'Every reading is a sacred conversation, not a template. Your energy is unique; your guidance should be too.',
     'about.redesigned.closing.text': 'The answers you seek already exist within you. Consider this space a mirror — reflecting back the clarity, the strength, and the divine wisdom that has always been your birthright. You are more powerful than you know.',
     'about.redesigned.cta.title': 'Step Into Your Power',
     'about.redesigned.cta.button': 'Start Your Reading',
     // About features
     'home.about.feature1': 'Deep insights',
     'home.about.feature2': 'Spiritual guidance',
     'home.about.feature3': 'Personalized clarity',
     // Reading page
    'reading.selectTopic': 'Kis area mein tumhe clarity chahiye?',
    'reading.enterQuestion': 'Tum kya jaanna chahte ho?',
    'reading.inputPlaceholder': 'Apna sawaal likho…',
    'reading.selectCards': '3 cards choose karo',
    'reading.loading': "Bas dekhte hain kya aa raha hai…",
    'reading.cardsSaying': "Tumhare cards keh rahe hain:",
    // Contact page
    'contact.heading': 'Humse Baat Karo',
    'contact.subtitle': 'Koi sawaal hai ya guidance chahiye? Hum sunne ke liye ready hain.',
    'contact.name': 'Tumhara Naam',
    'contact.namePlaceholder': 'Apna naam likho',
    'contact.nameHelper': 'Taaki hum jaanein kisse baat kar rahe hain',
    'contact.email': 'Email Address',
    'contact.emailPlaceholder': 'you@example.com',
    'contact.emailHelper': 'Hum isi address pe reply karenge',
    'contact.message': 'Tumhara Message',
    'contact.messagePlaceholder': 'Apna message yahan likho…',
    'contact.messageHelper': 'Jitna chaaho detail mein likho',
    'contact.submit': 'Message Bhejo',
    'contact.success.title': 'Message chala gaya!',
    'contact.success.message': 'Reach out karne ke liye shukriya. Hum jaldi reply karenge. ✨',
  },
}

/**
 * Get translation from nested structure (existing system)
 */
function getNestedTranslation(key: string, lang: Language): string {
  const keys = key.split('.')
  let value: unknown = TRANSLATIONS[lang]

  if (!value) {
    return key
  }

  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = (value as Record<string, unknown>)[k]
    } else {
      return key
    }
  }

  return typeof value === 'string' ? value : key
}

/**
 * Get translation from flat store (auto-generated keys)
 */
function getFlatTranslation(key: string, lang: Language): string | undefined {
  const mappedLang = langMap[lang] || lang
  const flatDicts: Record<string, Record<string, string>> = flatTranslations
  const langDict = flatDicts[mappedLang as keyof typeof flatDicts]
  if (langDict?.[key]) {
    return langDict[key]
  }
  // Fallback to English if available (prevents placeholder fallback)
  if (mappedLang !== 'english') {
    const englishDict = flatDicts.english
    if (englishDict?.[key]) {
      return englishDict[key]
    }
  }
  return undefined
}

/**
 * Sync translation getter (main export for useLanguage)
 * Merges nested and flat translation sources
 */
export function getTranslationSync(key: string, lang: Language): string {
  // 1. Try nested structure first (existing translations)
  const nested = getNestedTranslation(key, lang)
  // If nested returned something different from key, it's a valid translation
  if (nested !== key) return nested

  // 2. Try flat store (CMS-managed)
  const flat = getFlatTranslation(key, lang)
  if (flat) return flat

  // 3. Try emergency fallback
  const fallbackValue = FALLBACK[lang]?.[key]
  if (fallbackValue) {
    return fallbackValue
  }

  // 4. Return human-readable fallback - extract last part of key
  const parts = key.split('.')
  const readable = parts[parts.length - 1]
  if (readable && readable.length > 0) {
    return readable.charAt(0).toUpperCase() + readable.slice(1)
  }
  return key
}

/**
 * Load translations from API with caching
 */
export async function loadTranslations(lang: Language = 'en'): Promise<Record<string, string>> {
  // Check cache first
  if (translationCache && (Date.now() - translationCache.lastFetched) < CACHE_DURATION) {
    const cacheLang = lang as keyof typeof translationCache.data
    return translationCache.data[cacheLang] || {}
  }

  try {
    // Fetch from API (for dynamic CMS updates)
    const res = await fetch('/api/translations', {
      cache: 'no-store'
    })

    if (res.ok) {
      const data = await res.json()
      translationCache = {
        data,
        lastFetched: Date.now()
      }
      return data[lang] || data.english || {}
    }
  } catch (error) {
    console.warn('[i18n] Failed to fetch translations from API, using fallback:', error)
  }

  // Fallback: merge static sources (nested + flat)
  const result: Record<string, string> = {}

  // From nested (flatten all keys)
  const flattenNested = (obj: unknown, prefix = ''): void => {
    if (obj && typeof obj === 'object') {
      Object.entries(obj as Record<string, unknown>).forEach(([k, v]) => {
        const newPrefix = prefix ? `${prefix}.${k}` : k
        if (typeof v === 'string') {
          result[newPrefix] = v
        } else {
          flattenNested(v, newPrefix)
        }
      })
    }
  }
  flattenNested(TRANSLATIONS[lang] || {})

  // From flat store
  const flatDicts: Record<string, Record<string, string>> = flatTranslations
  const flatLangKey = lang as keyof typeof flatDicts
  Object.assign(result, flatDicts[flatLangKey] || {})

  return result
}

/**
 * Clear translation cache (call after CMS updates)
 */
export function clearTranslationCache(): void {
  translationCache = null
}

/**
 * Refresh translations (clear cache; next fetch will be fresh)
 */
export function refreshTranslations(): void {
  clearTranslationCache()
}