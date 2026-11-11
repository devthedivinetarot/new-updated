// Site copy that has to switch with the EN / हिंदी / Hinglish toggle.
//
// Checked FIRST by getTranslationSync (src/lib/i18n/loader.ts), so anything
// here wins over the older translation files. Two kinds of entries:
//   1. Text that used to be hard-coded English inside components (Why
//      section, testimonials, footer form, Kundli Milan page, …).
//   2. Hindi for keys where src/i18n/hi.ts only spread the English file,
//      so हिंदी mode was still showing English.
// A language that's missing for a key just falls through to the old chain.

type Copy = { en?: string; hi?: string; hinglish?: string };

export const siteCopy: Record<string, Copy> = {
  // ── Header / nav ──────────────────────────────────────────────
  'brand.tagline': { en: 'Premium Tarot Guidance', hi: 'प्रीमियम टैरो मार्गदर्शन', hinglish: 'Premium Tarot Guidance' },
  'nav.personalReading': { en: 'Personal Reading', hi: 'पर्सनल रीडिंग', hinglish: 'Personal Reading' },
  'nav.course': { hi: 'कोर्स' },
  'nav.premium': { hi: 'प्रीमियम' },
  'nav.bookReading': { hi: 'रीडिंग बुक करें' },
  'nav.blog': { hi: 'ब्लॉग' },
  'nav.yesno': { hi: 'हाँ / ना' },
  'nav.menu': { en: 'Menu', hi: 'मेनू', hinglish: 'Menu' },
  'nav.reports': { en: 'Reports', hi: 'रिपोर्ट्स', hinglish: 'Reports' },

  // ── Home: problem strip / how it works ───────────────────────
  'landing.problems.stuck.title': { hi: 'क्या ज़िंदगी में अटका हुआ महसूस कर रहे हैं?' },
  'landing.problems.stuck.description': { hi: 'जब सब कुछ थमा हुआ लगे' },
  'landing.problems.love.title': { hi: 'प्यार या रिश्तों में उलझन है?' },
  'landing.problems.love.description': { hi: 'आपका दिल सच्चे जवाबों का हक़दार है' },
  'landing.problems.direction.title': { hi: 'अगला कदम क्या हो, तय नहीं कर पा रहे?' },
  'landing.problems.direction.description': { hi: 'ब्रह्मांड के पास आपके लिए मार्गदर्शन है' },
  'landing.howItWorks.title': { hi: 'यह कैसे काम करता है' },
  'landing.howItWorks.subtitle': { hi: 'स्पष्टता पाने के तीन आसान कदम' },
  'landing.howItWorks.ask.title': { hi: 'अपना सवाल पूछें' },
  'landing.howItWorks.ask.description': { hi: 'उस बात पर ध्यान दें जो सच में आपके दिल को परेशान कर रही है' },
  'landing.howItWorks.pick.title': { hi: 'अपने कार्ड चुनें' },
  'landing.howItWorks.pick.description': { hi: 'रहस्यमयी डेक से तीन कार्ड चुनें' },
  'landing.howItWorks.reveal.title': { hi: 'अपने जवाब देखें' },
  'landing.howItWorks.reveal.description': { hi: 'तुरंत अपनी व्यक्तिगत रीडिंग पाएँ' },

  // ── Home: preview ─────────────────────────────────────────────
  'landing.preview.title': { hi: 'आपकी यात्रा की एक झलक' },
  'landing.preview.subtitle': { hi: 'कार्ड आपके लिए क्या बता सकते हैं' },
  'landing.preview.cardTitle': { hi: 'आपकी रीडिंग की झलक' },
  'landing.preview.personalOpening': {
    hi: 'सुनो {name}… इन कार्ड्स के ज़रिए मैं आपकी ऊर्जा महसूस कर पा रही हूँ। 💖\n\nआपके दिल में काफ़ी उलझन और भावनाओं की खींचतान है…\n\nचलो देखते हैं ब्रह्मांड आपके लिए क्या संदेश लाया है। ✨',
  },
  'landing.preview.messageOfCards': { hi: 'कार्ड्स का संदेश' },
  'landing.preview.card1.name': { hi: 'द फ़ूल' },
  'landing.preview.card1.interpretation': {
    hi: 'यह कार्ड एक गहरे भावनात्मक मोड़ को दिखाता है। आप एक नई यात्रा शुरू कर रहे हैं, पर पहले कदम पर अनिश्चितता है। ब्रह्मांड कह रहा है — डर के बावजूद भरोसा रखो।',
  },
  'landing.preview.card2.name': { hi: 'द लवर्स' },
  'landing.preview.card2.interpretation': {
    hi: 'आपकी स्थिति में एक मज़बूत जुड़ाव ऊर्जा भर रहा है। यह सिर्फ़ प्यार की बात नहीं — यह उस चीज़ (या इंसान) से जुड़ने की बात है जो सच में आपकी आत्मा से मेल खाती है।',
  },
  'landing.preview.card3.name': { hi: 'द स्टार' },
  'landing.preview.card3.interpretation': {
    hi: 'उम्मीद और हीलिंग पास है। हाल की मुश्किलों के बाद स्पष्टता और नया विश्वास लौट रहा है। ब्रह्मांड आपको बेहतर दिनों पर फिर से भरोसा दिला रहा है।',
  },
  'landing.preview.guidanceBlock.text': {
    hi: 'ब्रह्मांड आपसे एक साफ़ बात कह रहा है — प्रक्रिया पर भरोसा रखो। 💫\n\nजो रिश्ते और मौके आप महसूस कर रहे हैं, वे संयोग नहीं हैं। ब्रह्मांड धीरे-धीरे आपको सही दिशा में ले जा रहा है।',
  },
  'landing.preview.guidanceText': {
    hi: 'ब्रह्मांड आपसे एक साफ़ बात कह रहा है — प्रक्रिया पर भरोसा रखो। 💫\n\nजो रिश्ते और मौके आप महसूस कर रहे हैं, वे संयोग नहीं हैं। ब्रह्मांड धीरे-धीरे आपको सही दिशा में ले जा रहा है।',
  },
  'landing.preview.previewLock': { hi: 'कार्ड्स के पास बताने को अभी बहुत कुछ है… आपका भविष्य, अगले कदम और छिपी भावनाएँ अभी पर्दे में हैं। 🌙' },
  'landing.preview.ctaButton': { hi: 'मेरी पूरी रीडिंग खोलें ✨' },
  'landing.preview.ctaSubtext': { hi: 'पूरा मार्गदर्शन आपका इंतज़ार कर रहा है 💖' },
  'landing.preview.pastLabel': { hi: 'अतीत:' },
  'landing.preview.pastText': { hi: 'आप एक दोराहे पर रहे हैं, समझ नहीं आ रहा था कि कौन-सा रास्ता चुनें।' },
  'landing.preview.presentLabel': { hi: 'वर्तमान:' },
  'landing.preview.presentText': { hi: 'एक नया मौका पास आ रहा है। ब्रह्मांड सब कुछ जोड़ रहा है…' },
  'landing.preview.guidanceLabel': { hi: 'मार्गदर्शन:' },
  'landing.preview.ctaText': { hi: 'यह सिर्फ़ एक झलक है। आपकी पूरी रीडिंग इंतज़ार कर रही है…' },

  // ── Home: testimonials ────────────────────────────────────────
  'testimonials.title': { hi: 'साधक क्या कहते हैं' },
  'testimonials.subtitle': { hi: 'साधक अपनी यात्रा के बारे में क्या कह रहे हैं' },
  'testimonials.role': { hi: 'सत्यापित पाठक' },
  'testimonials.items.0': {
    en: "The reading was eerily accurate. It helped me see my situation clearly and make peace with what I couldn't change.",
    hi: 'रीडिंग हैरान कर देने जितनी सटीक थी। इससे मुझे अपनी स्थिति साफ़ दिखी और जो मैं बदल नहीं सकती थी, उससे शांति मिली।',
    hinglish: 'Reading itni accurate thi ki hairaan reh gayi. Apni situation clearly dikhi aur jo change nahi kar sakti thi usse peace mil gaya.',
  },
  'testimonials.items.1': {
    en: "I was skeptical at first, but the insights were profound. This isn't just random cards - there's real depth here.",
    hi: 'शुरू में मुझे शक था, पर बातें बहुत गहरी निकलीं। ये सिर्फ़ रैंडम कार्ड्स नहीं — इसमें सच में गहराई है।',
    hinglish: 'Pehle doubt tha, par insights bahut deep the. Yeh random cards nahi hai — isme sach mein depth hai.',
  },
  'testimonials.items.2': {
    en: "Beautiful experience. The cards revealed what I needed to hear, not what I wanted to hear. That's the real gift.",
    hi: 'बहुत सुंदर अनुभव। कार्ड्स ने वो बताया जो मुझे सुनना ज़रूरी था, न कि जो मैं सुनना चाहती थी। यही असली तोहफ़ा है।',
    hinglish: 'Beautiful experience. Cards ne woh bataya jo sunna zaroori tha, jo sunna chahti thi woh nahi. Yahi asli gift hai.',
  },
  'testimonials.items.3': {
    en: 'Got clarity on a career decision that had me stuck for months. The guidance was specific and actionable.',
    hi: 'महीनों से अटके करियर के फ़ैसले पर स्पष्टता मिली। मार्गदर्शन साफ़ और अमल करने लायक था।',
    hinglish: 'Mahino se atke career decision pe clarity mili. Guidance specific aur actionable thi.',
  },
  'testimonials.items.4': {
    en: "This felt too accurate... I didn't expect this level of insight from an online reading. Still gives me chills thinking about it.",
    hi: 'ये ज़रूरत से ज़्यादा सटीक लगा… ऑनलाइन रीडिंग से इतनी गहराई की उम्मीद नहीं थी। सोचकर आज भी रोंगटे खड़े हो जाते हैं।',
    hinglish: 'Itna accurate laga… online reading se itni insight expect nahi ki thi. Sochke abhi bhi goosebumps aate hain.',
  },

  // ── Home: why section ─────────────────────────────────────────
  'whySection.title': { hi: 'द डिवाइन टैरो ही क्यों?' },
  'whySection.description': { hi: 'हम प्राचीन टैरो ज्ञान से कुछ अनोखा रचते हैं — ऐसी रीडिंग जो निजी, गहरी और सिर्फ़ आपके लिए बनी लगे।' },
  'whySection.extra': {
    en: 'Unlike generic fortune tellers, we understand context, recognize emotional patterns, and provide guidance that resonates with your specific journey.',
    hi: 'आम भविष्य बताने वालों से अलग, हम आपकी स्थिति को समझते हैं, भावनाओं के पैटर्न पहचानते हैं और ऐसा मार्गदर्शन देते हैं जो आपकी अपनी यात्रा से जुड़ा हो।',
    hinglish: 'Generic fortune tellers se alag, hum context samajhte hain, emotional patterns pehchante hain aur aisi guidance dete hain jo tumhari apni journey se judi ho.',
  },
  'whySection.readings': { hi: '10,000+ रीडिंग', hinglish: '10,000+ readings' },
  'whySection.rating': { hi: '4.9 रेटिंग', hinglish: '4.9 rating' },
  'whySection.speed': { hi: '60 सेकंड से कम' },
  'whySection.featureTitles.personalized': { en: 'Reading That Feels You', hi: 'रीडिंग जो आपको समझे', hinglish: 'Reading jo tumhe feel kare' },
  'whySection.featureTitles.ai': { en: 'Personalized Insights', hi: 'व्यक्तिगत अंतर्दृष्टि', hinglish: 'Personalized Insights' },
  'whySection.featureTitles.privacy': { en: 'Instant Clarity', hi: 'तुरंत स्पष्टता', hinglish: 'Instant Clarity' },
  'whySection.featureTitles.instant': { en: 'Deep Emotional Connection', hi: 'गहरा भावनात्मक जुड़ाव', hinglish: 'Deep Emotional Connection' },
  'whySection.features.personalized': { hi: 'आपकी ऊर्जा के अनुसार व्यक्तिगत रीडिंग' },
  'whySection.features.ai': { hi: 'इंसानी गर्मजोशी के साथ गहरी अंतर्दृष्टि' },
  'whySection.features.privacy': { hi: '100% निजी और सुरक्षित' },
  'whySection.features.instant': { hi: 'तुरंत जवाब, कभी भी' },

  // ── Home: final CTA (हिंदी mode was showing Hinglish here) ───
  'home.finalCta.title': { hi: 'आपके जवाब इंतज़ार कर रहे हैं…' },
  'home.finalCta.subtitle': { hi: 'कार्ड तैयार हैं। आपका मार्गदर्शन तैयार है। स्पष्टता की ओर पहला कदम बढ़ाइए।' },
  'home.finalCta.description': { hi: 'कार्ड तैयार हैं। आपका मार्गदर्शन तैयार है। स्पष्टता की ओर पहला कदम बढ़ाइए।' },
  'home.finalCta.button': { hi: 'आगे बढ़ें' },
  'home.finalCta.subtext': { hi: '60 सेकंड से कम लगेंगे' },
  'home.about.title': { hi: 'रीडर के बारे में' },
  'home.about.description': { hi: 'आपका अंतर्मन सच पहले से जानता है। यह जगह आपको उसे साफ़ सुनने में मदद करती है।' },
  'home.about.bio': {
    hi: 'भारती सिंह 10 साल से ज़्यादा अनुभव वाली टैरो रीडर हैं, जो लोगों को ज़िंदगी की अनिश्चितताओं में राह दिखाती हैं। उनका तरीका प्राचीन ज्ञान और अंतर्ज्ञान को जोड़ता है, ताकि ज़रूरत के समय आपको स्पष्टता और दिशा मिले।',
  },
  'home.about.linkText': { hi: 'हमारे बारे में और जानें' },

  // ── Footer ────────────────────────────────────────────────────
  'footer.quickLinks.support': { en: 'Support', hi: 'सहायता', hinglish: 'Support' },
  'footer.connect.title': { en: 'Connect With Us', hi: 'हमसे जुड़ें', hinglish: 'Humse Judo' },
  'footer.cta.title': { en: 'Get Daily Divine Insights', hi: 'रोज़ का दिव्य संदेश पाएँ', hinglish: 'Roz ka Divine Message Pao' },
  'footer.form.email': { en: 'Your email', hi: 'आपका ईमेल', hinglish: 'Tumhara email' },
  'footer.form.whatsapp': { en: 'WhatsApp number (optional)', hi: 'व्हाट्सऐप नंबर (वैकल्पिक)', hinglish: 'WhatsApp number (optional)' },
  'footer.form.subscribe': { en: 'Subscribe', hi: 'सब्सक्राइब करें', hinglish: 'Subscribe karo' },
  'footer.form.subscribing': { en: 'Subscribing...', hi: 'सब्सक्राइब हो रहा है...', hinglish: 'Subscribe ho raha hai...' },
  'footer.form.subscribed': { en: 'Subscribed!', hi: 'सब्सक्राइब हो गया!', hinglish: 'Subscribe ho gaya!' },
  'footer.trust.secure': { en: 'Secure & Private Readings', hi: 'सुरक्षित और निजी रीडिंग', hinglish: 'Secure & Private Readings' },
  'footer.trust.seekers': { en: 'Trusted by 7L+ Seekers', hi: '7 लाख+ साधकों का भरोसा', hinglish: '7L+ Seekers ka bharosa' },
  'footer.trust.authentic': { en: 'Authentic Spiritual Guidance', hi: 'प्रामाणिक आध्यात्मिक मार्गदर्शन', hinglish: 'Authentic Spiritual Guidance' },
  'footer.designedBy': { en: 'Designed by', hi: 'डिज़ाइन:', hinglish: 'Designed by' },
  'footer.rights': { en: 'The Divine Tarot. All rights reserved.', hi: 'द डिवाइन टैरो। सर्वाधिकार सुरक्षित।', hinglish: 'The Divine Tarot. All rights reserved.' },
  'footer.privacy': { hi: 'गोपनीयता' },
  'footer.navigation': { hi: 'नेविगेशन' },
  'footer.support': { hi: 'सहायता' },
  'footer.tagline': { hi: 'स्पष्टता भीतर से शुरू होती है' },
  'footer.madeWith': { hi: 'ब्रह्मांडीय ऊर्जा से बना' },
  'footer.copyright': { hi: '© Sitelytc Digital Media. सर्वाधिकार सुरक्षित।' },
  'footer.disclaimer': { hi: 'यह किसी पेशेवर सलाह का विकल्प नहीं है। यह आपको स्पष्टता और दिशा देने के लिए है।' },

  // ── About page: fix two badly machine-translated Hindi lines ─
  'about.redesigned.hero.title': { hi: 'द डिवाइन टैरो के बारे में' },
  'about.redesigned.intro': {
    hi: 'मैं भारती सिंह हूँ। एक दशक से ज़्यादा समय से मुझे हज़ारों साधकों को ज़िंदगी के सबसे उलझन भरे पलों में राह दिखाने का सौभाग्य मिला है। जो एक निजी पुकार से शुरू हुआ, वह एक मिशन बन गया — टैरो के प्राचीन ज्ञान को हर उस आत्मा के लिए सरल, अपना और गहराई से बदलने वाला बनाना जो रोशनी ढूँढ रही है।',
  },
  'about.redesigned.authority.badge1.title': { hi: 'भारत की नंबर 1 साइकिक टैरो रीडर' },
  'about.redesigned.authority.badge2.desc': { hi: 'एक परिवार जो हर दिन बढ़ रहा है' },

  // ── Kundli Milan page ─────────────────────────────────────────
  'kundli.eyebrow': { en: 'Vedic Match Engine', hi: 'वैदिक मिलान', hinglish: 'Vedic Match Engine' },
  'kundli.title': { en: 'Kundli Milan', hi: 'कुंडली मिलान', hinglish: 'Kundli Milan' },
  'kundli.subtitle': {
    en: 'Two birth charts, one verdict. Get your Ashtakoota Guna Milan score out of 36 — and see exactly how each factor shapes your life together.',
    hi: 'दो जन्म कुंडलियाँ, एक नतीजा। 36 में से अपना अष्टकूट गुण मिलान स्कोर पाएँ — और देखें कि हर पहलू आपकी साथ की ज़िंदगी को कैसे प्रभावित करता है।',
    hinglish: 'Do birth charts, ek verdict. 36 mein se apna Ashtakoota Guna Milan score pao — aur dekho har factor tumhari life together ko kaise shape karta hai.',
  },
  'kundli.person1': { en: 'Person 1', hi: 'व्यक्ति 1', hinglish: 'Person 1' },
  'kundli.person1Sub': { en: 'groom / self', hi: 'वर / स्वयं', hinglish: 'groom / self' },
  'kundli.person2': { en: 'Person 2', hi: 'व्यक्ति 2', hinglish: 'Person 2' },
  'kundli.person2Sub': { en: 'bride / partner', hi: 'वधू / साथी', hinglish: 'bride / partner' },
  'kundli.name': { en: 'Name', hi: 'नाम', hinglish: 'Naam' },
  'kundli.nameHelper': { en: 'So we can personalise your report', hi: 'ताकि आपकी रिपोर्ट व्यक्तिगत बने', hinglish: 'Taaki report personal bane' },
  'kundli.namePlaceholder': { en: 'Full name', hi: 'पूरा नाम', hinglish: 'Poora naam' },
  'kundli.dob': { en: 'Date of birth', hi: 'जन्म तिथि', hinglish: 'Date of birth' },
  'kundli.time': { en: 'Time', hi: 'जन्म समय', hinglish: 'Time' },
  'kundli.timeHelper': { en: '12:00 if unknown', hi: 'पता न हो तो 12:00 रखें', hinglish: 'Pata na ho to 12:00 rakho' },
  'kundli.tz': { en: 'Birth timezone', hi: 'जन्म का टाइमज़ोन', hinglish: 'Birth timezone' },
  'kundli.calculate': { en: 'Calculate Match', hi: 'मिलान देखें', hinglish: 'Match Calculate Karo' },
  'kundli.timeNote': {
    en: 'If exact birth time is unknown, keep 12:00 — the Moon sign is correct on most days but may shift near a transition.',
    hi: 'अगर सही जन्म समय पता न हो तो 12:00 रखें — ज़्यादातर दिनों में चंद्र राशि सही आती है, पर राशि बदलने वाले दिन फ़र्क़ आ सकता है।',
    hinglish: 'Exact birth time pata na ho to 12:00 rakho — zyada tar din Moon sign sahi aata hai, par transition wale din shift ho sakta hai.',
  },
  'kundli.readyTitle': { en: 'Your Kundli Milan is ready', hi: 'आपका कुंडली मिलान तैयार है', hinglish: 'Tumhara Kundli Milan ready hai' },
  'kundli.readyText': {
    en: 'Unlock your full compatibility result for just ₹99 — the score out of 36, the 8-koota breakdown, dosha analysis and a detailed report emailed to you.',
    hi: 'सिर्फ़ ₹99 में अपना पूरा मिलान नतीजा खोलें — 36 में से स्कोर, आठों कूट का विवरण, दोष विश्लेषण और ईमेल पर विस्तृत रिपोर्ट।',
    hinglish: 'Sirf ₹99 mein poora compatibility result unlock karo — 36 mein se score, 8 koota breakdown, dosha analysis aur email pe detailed report.',
  },
  'kundli.f1': { en: 'Full 36-guna Ashtakoota compatibility score', hi: 'पूरा 36 गुण अष्टकूट मिलान स्कोर', hinglish: 'Poora 36-guna Ashtakoota score' },
  'kundli.f2': { en: 'All 8 kootas — and what they mean for your life together', hi: 'आठों कूट — और आपकी साथ की ज़िंदगी के लिए उनका मतलब', hinglish: 'Saare 8 koota — aur tumhari life together ke liye unka matlab' },
  'kundli.f3': { en: 'Nadi & Bhakoot dosha analysis with remedies', hi: 'नाड़ी और भकूट दोष विश्लेषण, उपायों के साथ', hinglish: 'Nadi & Bhakoot dosha analysis, remedies ke saath' },
  'kundli.f4': { en: 'Detailed report emailed to your inbox', hi: 'विस्तृत रिपोर्ट आपके ईमेल पर', hinglish: 'Detailed report tumhare email pe' },
  'kundli.pay': { en: 'Pay ₹99 & Reveal Result', hi: '₹99 दें और नतीजा देखें', hinglish: '₹99 Pay Karo & Result Dekho' },
  'kundli.secure': { en: 'Secure payment via Razorpay · Instant delivery', hi: 'Razorpay से सुरक्षित भुगतान · तुरंत डिलीवरी', hinglish: 'Razorpay se secure payment · Instant delivery' },
  'kundli.sentTitle': { en: 'Your report is on its way ✨', hi: 'आपकी रिपोर्ट रास्ते में है ✨', hinglish: 'Tumhari report aa rahi hai ✨' },
  'kundli.sentText': {
    en: "We've emailed your detailed Kundli Milan report to {email}. Check your inbox (and spam) in a minute.",
    hi: 'हमने आपकी विस्तृत कुंडली मिलान रिपोर्ट {email} पर भेज दी है। एक मिनट में इनबॉक्स (और स्पैम) देखें।',
    hinglish: 'Humne tumhari detailed Kundli Milan report {email} pe bhej di hai. Ek minute mein inbox (aur spam) check karo.',
  },
  'kundli.disclaimer': {
    en: 'Ashtakoota computed from approximate Moon positions (Lahiri ayanamsa). A guide to reflect clearly — not a substitute for a professional jyotishi or your own judgement.',
    hi: 'अष्टकूट अनुमानित चंद्र स्थिति (लाहिड़ी अयनांश) से निकाला गया है। यह सोचने में मदद के लिए है — किसी अनुभवी ज्योतिषी या आपके अपने विवेक का विकल्प नहीं।',
    hinglish: 'Ashtakoota approximate Moon position (Lahiri ayanamsa) se nikala gaya hai. Yeh sochne mein madad ke liye hai — kisi professional jyotishi ya tumhare apne judgement ka replacement nahi.',
  },

  // ── Misc keys where हिंदी was identical to English ────────────
  'countdown.untilNext': { hi: 'अगले संदेश तक' },
  'yesno.decode': { hi: 'मेरा जवाब बताओ' },
  'chat.contextNotice': { hi: 'आपकी रीडिंग में और भी है… बातचीत शुरू हो रही है' },
  'chat.footerPowered': { hi: 'Divine Tarot द्वारा • आध्यात्मिक मार्गदर्शन' },
  'urgency.timeSensitive': { hi: 'सीमित समय' },
  'urgency.limitedSpots': { hi: 'सिर्फ़ 2 जगह बाकी' },
  'urgency.endsTonight': { hi: 'आज रात खत्म' },
  'urgency.lastChance': { hi: 'आख़िरी मौका' },
  'paywall.messages.deep_engagement.title': { hi: 'यहाँ गहराई है जिसे मैं आपके साथ खोल सकती हूँ' },
  'paywall.messages.deep_engagement.desc': { hi: 'आप ज़रूरी सवाल पूछ रहे हैं। मैं पूरी रीडिंग में आपका साथ दूँगी और हर बात विस्तार से बताऊँगी।' },
  'paywall.messages.hesitation.title': { hi: 'आप सच्ची स्पष्टता ढूँढ रहे हैं' },
  'paywall.messages.hesitation.desc': { hi: 'मैं देख रही हूँ आप इस पर गहराई से सोच रहे हैं। पूरी तस्वीर देखिए ताकि भरोसे से फ़ैसला ले सकें।' },
  'paywall.messages.recurring_theme.title': { hi: 'यह पैटर्न आपके लिए बार-बार आ रहा है' },
  'paywall.messages.recurring_theme.desc': { hi: 'कुछ ऊर्जाएँ तब तक लौटती हैं जब तक हम उन्हें सुलझा न लें। पूरा मार्गदर्शन लीजिए और आगे बढ़िए।' },
  'booking.selectDate': { hi: 'तारीख चुनें' },
  'booking.availableTimes': { hi: 'उपलब्ध समय' },
  'booking.chooseSessionLength': { hi: 'सेशन की अवधि चुनें' },
  'booking.bookingSummary': { hi: 'बुकिंग सारांश' },
  'booking.topic': { hi: 'विषय' },
  'booking.date': { hi: 'तारीख' },
  'booking.duration': { hi: 'अवधि' },
  'booking.name': { hi: 'नाम' },
  'booking.total': { hi: 'कुल' },
  'booking.readingBooked': { hi: 'आपकी रीडिंग बुक हो गई' },
  'booking.bookingId': { hi: 'बुकिंग आईडी' },
  'readingForm.title': { hi: 'थोड़ा और बताइए…' },
  'readingForm.subtitle': { hi: 'ताकि हम साफ़ देख सकें' },
  'readingForm.name': { hi: 'आपका नाम' },
  'readingForm.namePlaceholder': { hi: 'आपका नाम…' },
  'readingForm.nameError': { hi: 'अपना नाम भी बताइए… इससे जुड़ाव बनता है' },
  'readingForm.question': { hi: 'आपका सवाल' },
  'readingForm.questionPlaceholder': { hi: 'आप क्या जानना चाहते हैं?' },
  'readingForm.questionError': { hi: 'साफ़ सवाल → साफ़ जवाब' },
  'readingForm.processing': { hi: 'रीडिंग तैयार हो रही है…' },
  'readingForm.patience': { hi: 'थोड़ा धैर्य रखिए…' },
  'readingForm.guidance': { hi: 'मार्गदर्शन' },
  'readingForm.tryAgain': { hi: 'नई रीडिंग' },
  'readingForm.unlockFull': { hi: 'पूरा एक्सेस पाएँ' },
  'contact.heading': { hi: 'संपर्क करें' },
  'contact.subtitle': { hi: 'कोई सवाल है? हमें आपसे सुनकर खुशी होगी।' },
  'contact.name': { hi: 'नाम' },
  'contact.namePlaceholder': { hi: 'अपना नाम लिखें' },
  'contact.nameHelper': { hi: 'ताकि हम आपको नाम से संबोधित कर सकें' },
  'contact.email': { hi: 'ईमेल' },
  'contact.emailHelper': { hi: 'जवाब हम इसी ईमेल पर भेजेंगे' },
  'contact.message': { hi: 'संदेश' },
  'contact.messagePlaceholder': { hi: 'आप क्या जानना चाहते हैं?' },
  'contact.messageHelper': { hi: 'साफ़ सवाल से साफ़ जवाब मिलता है' },
  'contact.submit': { hi: 'संदेश भेजें' },
  'contact.success.title': { hi: 'संदेश भेज दिया गया' },
  'contact.success.message': { hi: 'हम जल्द ही आपसे संपर्क करेंगे।' },
  'footer.quickLinks.app': { en: 'Download Android App', hi: 'Android ऐप डाउनलोड करें', hinglish: 'Android App Download Karo' },
};

export function getSiteCopy(key: string, lang: string): string | undefined {
  const entry = siteCopy[key];
  if (!entry) return undefined;
  return entry[lang as keyof Copy];
}
