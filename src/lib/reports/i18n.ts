// Report copy in English, Hindi and Hinglish.
import type { Tone } from './cardInsights';

import { TOPICS, LANGS, type Lang, type Topic } from './topics';
export { TOPICS, LANGS };
export type { Lang, Topic };

export const MONTHS: Record<Lang, string[]> = {
  en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  hinglish: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  hi: ['जनवरी', 'फ़रवरी', 'मार्च', 'अप्रैल', 'मई', 'जून', 'जुलाई', 'अगस्त', 'सितंबर', 'अक्टूबर', 'नवंबर', 'दिसंबर'],
};

export const L: Record<Lang, Record<string, string>> = {
  en: {
    brand: 'The Divine Tarot', report: 'Tarot Report', preparedFor: 'Prepared for', partner: 'About', year: 'Year',
    topic: 'Topic', luckyColor: 'Lucky Colour', luckyNumber: 'Lucky Number', glance: 'Year at a Glance', month: 'Month',
    card: 'Tarot Card', theme: 'Theme', no: 'No.', overall: 'Overall Guidance', howToRead: 'How to Read This Report',
    guidelines: 'Guidelines', disclaimer: 'Tarot offers guidance and self-reflection. It is not a fixed prediction and not a substitute for medical, legal or financial advice.',
    overallReading: 'Overall Reading', monthlyGuidance: 'Monthly Guidance',
    hisFeelings: 'His Feelings', hisActions: 'His Possible Actions', guidanceFor: 'Guidance for {name}',
    contents: 'Your 12-month reading with one tarot card for each month',
  },
  hi: {
    brand: 'द डिवाइन टैरो', report: 'टैरो रिपोर्ट', preparedFor: 'किसके लिए', partner: 'किनके बारे में', year: 'वर्ष',
    topic: 'विषय', luckyColor: 'शुभ रंग', luckyNumber: 'शुभ अंक', glance: 'वर्ष एक नज़र में', month: 'महीना',
    card: 'टैरो कार्ड', theme: 'विषय-वस्तु', no: 'अंक', overall: 'वर्ष का समग्र मार्गदर्शन', howToRead: 'इस रिपोर्ट को कैसे पढ़ें',
    guidelines: 'दिशानिर्देश', disclaimer: 'टैरो मार्गदर्शन और आत्मचिंतन के लिए है। यह निश्चित भविष्यवाणी नहीं है और चिकित्सा, क़ानूनी या आर्थिक सलाह का विकल्प नहीं है।',
    overallReading: 'समग्र रीडिंग', monthlyGuidance: 'मासिक मार्गदर्शन',
    hisFeelings: 'उनकी भावनाएँ', hisActions: 'उनके संभावित कदम', guidanceFor: '{name} के लिए मार्गदर्शन',
    contents: 'हर महीने के एक टैरो कार्ड के साथ आपकी 12 महीने की रीडिंग',
  },
  hinglish: {
    brand: 'The Divine Tarot', report: 'Tarot Report', preparedFor: 'Client', partner: 'Partner', year: 'Year',
    topic: 'Topic', luckyColor: 'Lucky Color', luckyNumber: 'Lucky Number', glance: 'Year at a Glance', month: 'Month',
    card: 'Tarot Card', theme: 'Theme', no: 'No.', overall: 'Overall Guidance', howToRead: 'Report kaise padhein',
    guidelines: 'Guidelines', disclaimer: 'Tarot reading guidance aur self-reflection ke liye hai; ise fixed prediction ke bajay intuitive direction ke roop mein dekhein. Yeh medical, legal ya financial advice nahi hai.',
    overallReading: 'Overall Reading', monthlyGuidance: 'Monthly Guidance',
    hisFeelings: '{partner} kya feel kar sakte hain?', hisActions: 'Possible Action', guidanceFor: '{name} ke liye Guidance',
    contents: 'Har month ke ek tarot card ke saath aapki 12 mahine ki reading',
  },
};

// ── Topic copy ─────────────────────────────────────────────────────
type ToneLines = Record<Tone, string[]>;
interface TopicCopy {
  intro: string;
  tagline: string;
  closing: string;
  feelings?: ToneLines;
  actions?: ToneLines;
  guide?: ToneLines;
  year?: ToneLines;
  feelLead?: string;  // "{month}: {partner}'s energy through {card} points to {hint}."
  yearLead?: string;  // "{month}: {card} brings ... {career} ... {love}."
}

export const TOPIC_COPY: Record<Lang, Record<Topic, TopicCopy>> = {
  en: {
    yearly: {
      intro: 'This report highlights the overall tarot energy of each month of {year}, its themes, guidance, and lucky colour and number. Read it as intuitive direction rather than fixed prediction.',
      tagline: 'A year of movement, growth, choices and completion.',
      closing: 'Key message for {name}: keep your direction clear, stay flexible with opportunities, and close completed cycles with confidence to make room for the next chapter.',
      yearLead: 'In {month}, {name} will feel the energy of {card}. {core} At work it points to {career}, and in personal life to {love}.',
      year: {
        p: ['Overall this month looks supportive and encouraging.', 'Staying active will help you make the most of this energy.', 'Chances of positive results are strong.'],
        m: ['A mixed month: patience and awareness will bring a good outcome.', 'Move thoughtfully rather than in a hurry.'],
        c: ['This month may feel challenging, but it brings important lessons.', 'Difficult moments will pass; staying calm will be your biggest support.'],
      },
    },
    'no-contact': {
      intro: 'This reading is made for your current no-contact situation. For each month, the card\'s energy is read for {partner}\'s possible feelings and actions. Tarot cannot confirm anyone\'s exact thoughts, so treat this as intuitive guidance, not certainty.',
      tagline: 'A year of reflection, realisation, movement and clarity.',
      closing: 'Key message for {name}: do not let your peace depend on someone else\'s actions. Respect the silence, focus on your healing, and if the connection is genuine it will find its way naturally.',
      feelLead: 'In {month}, {partner}\'s energy through {card} points to {love}.',
      feelings: { p: ['He is likely missing the connection and thinking of you with softness.'], m: ['He may think of you, but feelings and hesitation will pull him in two directions.'], c: ['He is likely guarded right now, protecting himself and keeping distance.'] },
      actions: { p: ['A soft message, call or reaching out is quite possible.', 'A positive signal or conversation may start.'], m: ['Quiet checking (your profile, status, through friends) is likely; direct contact is uncertain.', 'He may think about contacting you, but hesitate to act.'], c: ['Immediate contact looks unlikely; distance may continue.', 'This month silence is more likely than contact.'] },
      guide: { p: ['If he reaches out, respond calmly and genuinely; do not rush or pressure.'], m: ['Be patient; avoid repeated messages or indirect chasing.'], c: ['Focus on your own healing and self-respect; respecting the silence is your strongest move.'] },
    },
    affair: {
      intro: 'This reading looks at {partner}\'s possible feelings and actions in your affair situation, month by month. Tarot reflects energies, not certainties; use it to see the situation more clearly and protect your peace.',
      tagline: 'A year of truth, choices and self-worth.',
      closing: 'Key message for {name}: watch actions more than promises, keep your self-respect at the centre, and choose the path that gives you peace in the open, not only in secret.',
      feelLead: 'In {month}, {partner}\'s energy through {card} points to {love}.',
      feelings: { p: ['His attraction and emotional pull towards you are strong this month.'], m: ['He may feel torn between his feelings for you and his existing commitments.'], c: ['Guilt, fear of exposure or pressure from the other side may weigh on him.'] },
      actions: { p: ['He may make time for you and show more open care.'], m: ['Expect mixed actions: closeness one moment, distance the next.'], c: ['He may pull back, become secretive or avoid clear answers.'] },
      guide: { p: ['Enjoy the warmth, but stay clear about what you truly want in the long term.'], m: ['Do not build your plans on promises alone; watch his actions.'], c: ['Protect your peace and self-worth; you deserve a love that does not keep you hidden.'] },
    },
    crush: {
      intro: 'This reading explores {partner}\'s possible feelings and actions towards you, month by month, for a crush or one-sided situation. Tarot shows energies, not guarantees; let it guide your choices, not control them.',
      tagline: 'A year of hope, clarity and self-love.',
      closing: 'Key message for {name}: let the connection grow naturally, notice consistent actions rather than small signs, and keep investing in your own happiness either way.',
      feelLead: 'In {month}, {partner}\'s energy through {card} points to {love}.',
      feelings: { p: ['He may notice you more and feel a genuine spark of interest.'], m: ['He may be curious about you, but his feelings are not fully clear yet, even to him.'], c: ['His focus may be elsewhere right now; feelings from his side look limited.'] },
      actions: { p: ['A conversation, a friendly gesture or more frequent contact is possible.'], m: ['Small signs such as likes, glances or casual talk may appear, but no clear move yet.'], c: ['A clear move from his side is unlikely this month.'] },
      guide: { p: ['Be yourself and let things grow naturally; a gentle first step is fine.'], m: ['Keep it light and give it time instead of overthinking every sign.'], c: ['Do not pour all your energy into waiting; invest in yourself and your own joy.'] },
    },
    separation: {
      intro: 'This reading looks at {partner}\'s possible feelings and actions during your marriage separation, month by month. Tarot offers direction, not legal outcomes; use it alongside proper family and legal guidance.',
      tagline: 'A year of healing, decisions and dignity.',
      closing: 'Key message for {name}: take no big decision in anger, communicate with dignity, and protect your emotional and practical wellbeing whatever the outcome.',
      feelLead: 'In {month}, {partner}\'s energy through {card} points to {love}.',
      feelings: { p: ['He may be softening and remembering the good parts of the marriage.'], m: ['He may be confused: part of him wants to fix things, part of him wants space.'], c: ['Hurt, ego or anger may be strong in him right now.'] },
      actions: { p: ['Steps towards talking, meeting or reconciling are possible.'], m: ['Talks may begin but stall; family or ego may slow decisions.'], c: ['He may keep his distance, and formal or legal steps may move forward.'] },
      guide: { p: ['Communicate honestly and calmly; involve a trusted elder or counsellor if needed.'], m: ['Do not take major decisions in anger; give the process time and keep your dignity.'], c: ['Protect yourself emotionally and practically; seek proper legal and family guidance.'] },
    },
  },

  hi: {
    yearly: {
      intro: 'यह रिपोर्ट {year} के हर महीने की समग्र टैरो ऊर्जा, संभावित विषय, मार्गदर्शन तथा शुभ रंग और अंक बताती है। इसे निश्चित भविष्यवाणी के बजाय अंतर्ज्ञान से मिली दिशा के रूप में पढ़ें।',
      tagline: 'गति, विकास, चुनाव और पूर्णता का वर्ष।',
      closing: '{name} के लिए मुख्य संदेश: अपनी दिशा स्पष्ट रखें, अवसरों के साथ लचीले रहें, और जो चक्र पूरा हो चुका है उसे आत्मविश्वास से समाप्त कर अगले अध्याय के लिए जगह बनाएँ।',
      yearLead: '{month} में {name} के लिए {card} की ऊर्जा रहेगी। {core} काम में यह {career} की ओर इशारा करता है, और निजी जीवन में {love} की ऊर्जा महसूस हो सकती है।',
      year: {
        p: ['यह महीना कुल मिलाकर सहयोगी और उत्साहवर्धक रहेगा।', 'सक्रिय रहकर इस ऊर्जा का पूरा लाभ उठा सकते हैं।', 'सकारात्मक परिणामों की संभावना प्रबल है।'],
        m: ['महीना मिला-जुला रहेगा — धैर्य और सजगता से अच्छा परिणाम निकल सकता है।', 'जल्दबाज़ी के बजाय सोच-समझकर चलना बेहतर रहेगा।'],
        c: ['यह महीना थोड़ा चुनौतीपूर्ण लग सकता है, लेकिन यह महत्वपूर्ण सबक लेकर आएगा।', 'कठिन पल अस्थायी होंगे; शांत रहना ही सबसे बड़ा सहारा होगा।'],
      },
    },
    'no-contact': {
      intro: 'यह रीडिंग आपकी वर्तमान नो-कॉन्टैक्ट स्थिति को ध्यान में रखकर बनाई गई है। हर महीने कार्ड की ऊर्जा के आधार पर {partner} की संभावित भावनाओं और कदमों को समझा गया है। टैरो किसी के सटीक विचारों की पुष्टि नहीं करता, इसलिए इसे निश्चितता नहीं, अंतर्ज्ञान आधारित मार्गदर्शन समझें।',
      tagline: 'आत्मचिंतन, अहसास, गति और स्पष्टता का वर्ष।',
      closing: '{name} के लिए मुख्य संदेश: अपनी शांति को किसी और के कदमों पर निर्भर न रखें। मौन का सम्मान करें, अपने उपचार पर ध्यान दें, और यदि रिश्ता सच्चा है तो वह स्वाभाविक रूप से अपना रास्ता खोज लेगा।',
      feelLead: '{month} में {card} के माध्यम से {partner} की ऊर्जा {love} की ओर इशारा करती है।',
      feelings: { p: ['वे आपकी कमी महसूस कर रहे हो सकते हैं और आपको कोमलता से याद कर सकते हैं।'], m: ['वे आपके बारे में सोच सकते हैं, लेकिन भावनाओं और झिझक के बीच उलझे रह सकते हैं।'], c: ['वे अभी स्वयं को बचाने और दूरी बनाए रखने की स्थिति में हो सकते हैं।'] },
      actions: { p: ['कोई कोमल संदेश, कॉल या संपर्क की पहल की अच्छी संभावना है।', 'कोई सकारात्मक संकेत या बातचीत शुरू हो सकती है।'], m: ['चुपचाप आपकी प्रोफ़ाइल या स्टेटस देखना संभव है; सीधा संपर्क अनिश्चित है।', 'संपर्क का विचार आ सकता है, लेकिन कदम उठाने में झिझक रहेगी।'], c: ['तुरंत संपर्क की संभावना कम है; दूरी बनी रह सकती है।', 'इस महीने संपर्क के बजाय मौन की संभावना अधिक है।'] },
      guide: { p: ['यदि वे संपर्क करें, तो शांत और सच्चे मन से उत्तर दें — दबाव न बनाएँ।'], m: ['धैर्य रखें; बार-बार संदेश भेजने या परोक्ष रूप से पीछा करने से बचें।'], c: ['अपने उपचार और आत्म-सम्मान पर ध्यान दें; मौन का सम्मान करना ही सबसे मज़बूत कदम है।'] },
    },
    affair: {
      intro: 'यह रीडिंग आपकी अफ़ेयर की स्थिति में हर महीने {partner} की संभावित भावनाओं और कदमों को देखती है। टैरो ऊर्जा दिखाता है, निश्चितता नहीं; इसका उपयोग स्थिति को साफ़ देखने और अपनी शांति की रक्षा के लिए करें।',
      tagline: 'सच, चुनाव और आत्म-सम्मान का वर्ष।',
      closing: '{name} के लिए मुख्य संदेश: वादों से ज़्यादा कर्मों को देखें, आत्म-सम्मान को केंद्र में रखें, और वह राह चुनें जो आपको खुले में भी शांति दे, केवल छिपकर नहीं।',
      feelLead: '{month} में {card} के माध्यम से {partner} की ऊर्जा {love} की ओर इशारा करती है।',
      feelings: { p: ['इस महीने आपके प्रति उनका आकर्षण और भावनात्मक खिंचाव प्रबल है।'], m: ['वे आपके प्रति भावनाओं और अपनी मौजूदा प्रतिबद्धताओं के बीच बँटे हुए महसूस कर सकते हैं।'], c: ['अपराध-बोध, बात खुलने का डर या दूसरी ओर का दबाव उन पर भारी पड़ सकता है।'] },
      actions: { p: ['वे आपके लिए समय निकाल सकते हैं और खुलकर परवाह दिखा सकते हैं।'], m: ['मिले-जुले व्यवहार की अपेक्षा रखें — कभी नज़दीकी, कभी दूरी।'], c: ['वे पीछे हट सकते हैं, बातें छिपा सकते हैं या स्पष्ट उत्तर देने से बच सकते हैं।'] },
      guide: { p: ['इस गर्मजोशी का आनंद लें, लेकिन दीर्घकाल में आप क्या चाहती हैं, इस पर स्पष्ट रहें।'], m: ['केवल वादों पर अपनी योजनाएँ न बनाएँ; उनके कर्मों पर ध्यान दें।'], c: ['अपनी शांति और आत्म-सम्मान की रक्षा करें; आप ऐसे प्रेम की हक़दार हैं जो आपको छिपाकर न रखे।'] },
    },
    crush: {
      intro: 'यह रीडिंग क्रश या एकतरफ़ा स्थिति में हर महीने आपके प्रति {partner} की संभावित भावनाओं और कदमों को देखती है। टैरो ऊर्जा दिखाता है, गारंटी नहीं; इसे अपने निर्णयों का मार्गदर्शक बनाएँ, नियंत्रक नहीं।',
      tagline: 'आशा, स्पष्टता और आत्म-प्रेम का वर्ष।',
      closing: '{name} के लिए मुख्य संदेश: रिश्ते को स्वाभाविक रूप से बढ़ने दें, छोटे संकेतों के बजाय लगातार कर्मों पर ध्यान दें, और हर हाल में अपनी ख़ुशी में निवेश करती रहें।',
      feelLead: '{month} में {card} के माध्यम से {partner} की ऊर्जा {love} की ओर इशारा करती है।',
      feelings: { p: ['वे आप पर अधिक ध्यान दे सकते हैं और उनमें सच्ची रुचि जाग सकती है।'], m: ['वे आपके बारे में जिज्ञासु हो सकते हैं, लेकिन उनकी भावनाएँ अभी उन्हें भी पूरी तरह स्पष्ट नहीं हैं।'], c: ['अभी उनका ध्यान कहीं और हो सकता है; उनकी ओर से भावनाएँ सीमित दिखती हैं।'] },
      actions: { p: ['बातचीत, कोई मित्रवत पहल या अधिक संपर्क संभव है।'], m: ['लाइक, नज़रें या हल्की बातचीत जैसे छोटे संकेत दिख सकते हैं, पर अभी कोई स्पष्ट कदम नहीं।'], c: ['इस महीने उनकी ओर से कोई स्पष्ट कदम की संभावना कम है।'] },
      guide: { p: ['स्वयं जैसी हैं वैसी रहें और बात को स्वाभाविक रूप से बढ़ने दें; एक कोमल पहल ठीक है।'], m: ['बात को हल्का रखें और हर संकेत पर ज़्यादा सोचने के बजाय समय दें।'], c: ['अपनी पूरी ऊर्जा प्रतीक्षा में न लगाएँ; स्वयं और अपनी ख़ुशी में निवेश करें।'] },
    },
    separation: {
      intro: 'यह रीडिंग आपके वैवाहिक अलगाव के दौरान हर महीने {partner} की संभावित भावनाओं और कदमों को देखती है। टैरो दिशा देता है, क़ानूनी परिणाम नहीं; इसका उपयोग उचित पारिवारिक और क़ानूनी सलाह के साथ करें।',
      tagline: 'उपचार, निर्णय और गरिमा का वर्ष।',
      closing: '{name} के लिए मुख्य संदेश: गुस्से में कोई बड़ा निर्णय न लें, गरिमा के साथ बात करें, और परिणाम जो भी हो, अपनी भावनात्मक और व्यावहारिक भलाई की रक्षा करें।',
      feelLead: '{month} में {card} के माध्यम से {partner} की ऊर्जा {love} की ओर इशारा करती है।',
      feelings: { p: ['वे नरम पड़ रहे हो सकते हैं और विवाह के अच्छे पलों को याद कर सकते हैं।'], m: ['वे उलझन में हो सकते हैं — मन का एक हिस्सा चीज़ें ठीक करना चाहता है, दूसरा दूरी चाहता है।'], c: ['अभी उनमें दुख, अहंकार या गुस्सा प्रबल हो सकता है।'] },
      actions: { p: ['बातचीत, मिलने या सुलह की ओर कदम संभव हैं।'], m: ['बातचीत शुरू होकर रुक सकती है; परिवार या अहंकार निर्णयों को धीमा कर सकते हैं।'], c: ['वे दूरी बनाए रख सकते हैं, और औपचारिक या क़ानूनी प्रक्रिया आगे बढ़ सकती है।'] },
      guide: { p: ['ईमानदारी और शांति से बात करें; ज़रूरत हो तो किसी भरोसेमंद बड़े या परामर्शदाता को शामिल करें।'], m: ['गुस्से में बड़े निर्णय न लें; प्रक्रिया को समय दें और अपनी गरिमा बनाए रखें।'], c: ['भावनात्मक और व्यावहारिक रूप से स्वयं की रक्षा करें; उचित क़ानूनी और पारिवारिक मार्गदर्शन लें।'] },
    },
  },

  hinglish: {
    yearly: {
      intro: 'Yeh report {year} ke har month ki overall tarot energy, possible themes, guidance aur lucky color & number ko highlight karti hai. Ise fixed prediction ke bajay intuitive direction ke roop mein dekhein.',
      tagline: 'A year of movement, growth, choices and completion.',
      closing: '{name} ke liye key message: apni direction clear rakho, opportunities ke saath flexible raho aur jo cycle complete ho chuki hai use confidently close karke next chapter ke liye space banao.',
      yearLead: '{month} mein {name} ke liye {card} ki energy rahegi. {core} Career mein {career} ka indication hai, aur personal life mein {love} ki energy feel ho sakti hai.',
      year: {
        p: ['Yeh month overall supportive aur encouraging rahega.', 'Is energy ka faayda uthane ke liye active rehna faydemand hoga.', 'Positive results ki sambhavna strong hai.'],
        m: ['Month mixed rahega — patience aur awareness se achha outcome nikal sakta hai.', 'Jaldbaazi ke bajay soch-samajhkar chalna better rahega.'],
        c: ['Month thoda challenging feel ho sakta hai, lekin yeh important lessons lekar aayega.', 'Mushkil moments temporary honge; calm rehna sabse bada support hoga.'],
      },
    },
    'no-contact': {
      intro: 'Yeh reading current no-contact situation ko dhyan mein rakhkar banayi gayi hai. Har month card ki energy ke basis par {partner} ki possible feelings aur actions ko interpret kiya gaya hai. Tarot kisi ke exact thoughts confirm nahi karta, isliye ise intuitive guidance samjhein, certainty nahi.',
      tagline: 'A year of reflection, realisation, movement and clarity.',
      closing: '{name} ke liye key message: kisi doosre ke action par apni peace depend mat karo. Silence ko respect karo, apni healing par focus rakho, aur agar connection genuine hai toh woh natural tarike se raasta dhoondh lega.',
      feelLead: '{month} mein {partner} ki energy {card} ke through {love} ki taraf ishara karti hai.',
      feelings: { p: ['Unhe connection ki kami zyada feel ho sakti hai; mann mein softness aur positive yaadein rahengi.'], m: ['Woh aapke baare mein soch sakte hain, lekin feelings aur hesitation ke beech confused reh sakte hain.'], c: ['Woh abhi khud ko protect karne aur distance banaye rakhne ke mode mein ho sakte hain.'] },
      actions: { p: ['Soft contact, message ya reaching out ka chance strong hai.', 'Koi positive signal ya conversation start ho sakti hai.'], m: ['Subtle checking (profile, status) possible; direct contact uncertain.', 'Contact ka thought aa sakta hai, lekin action mein hesitation rahegi.'], c: ['Immediate outreach unlikely; distance zyada rahega.', 'Is month contact ke bajay silence ki sambhavna zyada hai.'] },
      guide: { p: ['Agar contact aaye toh calm aur genuine response do — pressure mat banao.'], m: ['Patience rakho; repeated messages ya indirect chasing avoid karo.'], c: ['Apni healing aur self-respect par focus karo. Silence ko respect karna sabse strong approach rahega.'] },
    },
    affair: {
      intro: 'Yeh reading aapki affair situation mein har month {partner} ki possible feelings aur actions ko dekhti hai. Tarot energy dikhata hai, certainty nahi; ise situation ko clearly dekhne aur apni peace protect karne ke liye use karein.',
      tagline: 'A year of truth, choices and self-worth.',
      closing: '{name} ke liye key message: promises se zyada actions dekho, self-respect ko center mein rakho, aur woh raasta chuno jo aapko khule mein bhi peace de, sirf chhupkar nahi.',
      feelLead: '{month} mein {partner} ki energy {card} ke through {love} ki taraf ishara karti hai.',
      feelings: { p: ['Is month aapke liye unka attraction aur emotional pull strong hai.'], m: ['Woh aapke liye feelings aur apni existing commitments ke beech bante hue feel kar sakte hain.'], c: ['Guilt, baat khulne ka darr ya doosri side ka pressure un par bhaari pad sakta hai.'] },
      actions: { p: ['Woh aapke liye time nikaal sakte hain aur openly care dikha sakte hain.'], m: ['Mixed behaviour expect karo — kabhi closeness, kabhi distance.'], c: ['Woh peeche hat sakte hain, baatein chhupa sakte hain ya clear answer avoid kar sakte hain.'] },
      guide: { p: ['Warmth enjoy karo, lekin long term mein aap kya chahti hain us par clear raho.'], m: ['Sirf promises par plans mat banao; unke actions dekho.'], c: ['Apni peace aur self-worth protect karo; aap aise pyaar ki haqdaar hain jo aapko chhupakar na rakhe.'] },
    },
    crush: {
      intro: 'Yeh reading crush ya one-sided situation mein har month aapke liye {partner} ki possible feelings aur actions ko dekhti hai. Tarot energy dikhata hai, guarantee nahi; ise apne decisions ka guide banao, controller nahi.',
      tagline: 'A year of hope, clarity and self-love.',
      closing: '{name} ke liye key message: connection ko naturally grow hone do, chhote signs ke bajay consistent actions dekho, aur har haal mein apni khushi mein invest karti raho.',
      feelLead: '{month} mein {partner} ki energy {card} ke through {love} ki taraf ishara karti hai.',
      feelings: { p: ['Woh aapko zyada notice kar sakte hain aur unme genuine interest jaag sakta hai.'], m: ['Woh aapke baare mein curious ho sakte hain, lekin unki feelings abhi unhe bhi poori tarah clear nahi.'], c: ['Abhi unka focus kahin aur ho sakta hai; unki side se feelings limited dikhti hain.'] },
      actions: { p: ['Conversation, friendly gesture ya zyada contact possible hai.'], m: ['Likes, glances ya casual baat jaise chhote signs dikh sakte hain, lekin abhi koi clear move nahi.'], c: ['Is month unki side se clear move ki sambhavna kam hai.'] },
      guide: { p: ['Khud jaisi ho waisi raho aur baat ko naturally badhne do; ek gentle first step theek hai.'], m: ['Baat light rakho aur har sign par overthink karne ke bajay time do.'], c: ['Apni saari energy wait karne mein mat lagao; khud mein aur apni khushi mein invest karo.'] },
    },
    separation: {
      intro: 'Yeh reading aapke marriage separation ke dauraan har month {partner} ki possible feelings aur actions ko dekhti hai. Tarot direction deta hai, legal outcome nahi; ise proper family aur legal guidance ke saath use karein.',
      tagline: 'A year of healing, decisions and dignity.',
      closing: '{name} ke liye key message: gusse mein koi bada decision mat lo, dignity ke saath baat karo, aur outcome jo bhi ho, apni emotional aur practical wellbeing protect karo.',
      feelLead: '{month} mein {partner} ki energy {card} ke through {love} ki taraf ishara karti hai.',
      feelings: { p: ['Woh naram pad rahe ho sakte hain aur marriage ke achhe pal yaad kar sakte hain.'], m: ['Woh confused ho sakte hain — mann ka ek hissa cheezein theek karna chahta hai, doosra space chahta hai.'], c: ['Abhi unme hurt, ego ya gussa strong ho sakta hai.'] },
      actions: { p: ['Baat karne, milne ya reconcile karne ki taraf steps possible hain.'], m: ['Baatcheet shuru hokar ruk sakti hai; family ya ego decisions slow kar sakte hain.'], c: ['Woh distance rakh sakte hain, aur formal ya legal steps aage badh sakte hain.'] },
      guide: { p: ['Honestly aur calmly baat karo; zarurat ho toh kisi trusted elder ya counsellor ko involve karo.'], m: ['Gusse mein bade decisions mat lo; process ko time do aur apni dignity banaye rakho.'], c: ['Emotionally aur practically khud ko protect karo; proper legal aur family guidance lo.'] },
    },
  },
};

export const PHASE: Record<Lang, (score: number) => string> = {
  en: (s) => s >= 3 ? 'strong momentum and opportunities' : s >= 1 ? 'positive but steady energy' : s >= -1 ? 'mixed, learning-rich energy' : 'challenges and inner work',
  hi: (s) => s >= 3 ? 'मज़बूत गति और अवसरों' : s >= 1 ? 'सकारात्मक लेकिन स्थिर ऊर्जा' : s >= -1 ? 'मिली-जुली और सीख से भरी ऊर्जा' : 'चुनौतियों और भीतरी काम',
  hinglish: (s) => s >= 3 ? 'strong momentum aur opportunities' : s >= 1 ? 'positive lekin steady energy' : s >= -1 ? 'mixed aur learning-rich energy' : 'challenges aur inner work',
};

export const SUMMARY: Record<Lang, {
  flow: (y: number, a: string, b: string) => string; same: (y: number, a: string) => string;
  best: (m: string) => string; careful: (m: string) => string; majors: (n: number) => string; join: string;
}> = {
  en: {
    flow: (y, a, b) => `${y} starts with ${a} and moves towards ${b}.`,
    same: (y, a) => `Through ${y}, ${a} will continue.`,
    best: (m) => `${m} look like the most supportive months.`,
    careful: (m) => `In ${m}, extra patience and awareness will help.`,
    majors: (n) => `This spread has ${n} Major Arcana cards, showing a year of big life lessons and turning points.`,
    join: ', ',
  },
  hi: {
    flow: (y, a, b) => `${y} की शुरुआत ${a} से होकर ${b} की ओर बढ़ती है।`,
    same: (y, a) => `पूरे ${y} में ${a} बनी रहेगी।`,
    best: (m) => `${m} सबसे सहयोगी महीने दिख रहे हैं।`,
    careful: (m) => `${m} में अतिरिक्त धैर्य और सजगता रखना बेहतर रहेगा।`,
    majors: (n) => `इस स्प्रेड में ${n} मेजर आर्काना कार्ड हैं, जो बताता है कि यह वर्ष जीवन के बड़े सबक और मोड़ों वाला है।`,
    join: ', ',
  },
  hinglish: {
    flow: (y, a, b) => `${y} ka overall flow ${a} se start hokar ${b} ki taraf move karta hai.`,
    same: (y, a) => `Poore ${y} mein ${a} bani rahegi.`,
    best: (m) => `${m} sabse supportive months dikh rahe hain.`,
    careful: (m) => `${m} mein extra patience aur awareness rakhna better rahega.`,
    majors: (n) => `Is spread mein ${n} Major Arcana cards hain, jo dikhata hai ki yeh saal life ke bade lessons aur turning points wala hai.`,
    join: ', ',
  },
};

export const HOW_TO_READ: Record<Lang, string[]> = {
  en: [
    'Each month has one card. Read the month as a whole: the card, its theme, the reading and the guidance together.',
    'Read the month before it begins, and once more mid-month to notice what is unfolding.',
    'Your actions can shift the energy. Use the guidance as a gentle direction, not a fixed outcome.',
    'Lucky colour and number are small supports: wear the colour or use the number on important days.',
  ],
  hi: [
    'हर महीने का एक कार्ड है। महीने को पूरा पढ़ें — कार्ड, उसका विषय, रीडिंग और मार्गदर्शन एक साथ।',
    'महीना शुरू होने से पहले पढ़ें, और महीने के बीच एक बार फिर पढ़कर देखें कि क्या घट रहा है।',
    'आपके कर्म ऊर्जा को बदल सकते हैं। मार्गदर्शन को कोमल दिशा समझें, निश्चित परिणाम नहीं।',
    'शुभ रंग और अंक छोटे सहायक हैं — महत्वपूर्ण दिनों में वह रंग पहनें या अंक का उपयोग करें।',
  ],
  hinglish: [
    'Har month ka ek card hai. Month ko poora padhein — card, theme, reading aur guidance ek saath.',
    'Month shuru hone se pehle padhein, aur beech mein ek baar phir padhkar dekhein kya unfold ho raha hai.',
    'Aapke actions energy ko badal sakte hain. Guidance ko gentle direction samjhein, fixed outcome nahi.',
    'Lucky color aur number chhote supports hain — important din par woh color pehnein ya number use karein.',
  ],
};

export const GUIDELINES: Record<Lang, string[]> = {
  en: [
    'This report is for your personal guidance only. Please do not share or resell it.',
    'Tarot shows possibilities and energies; free will and your choices always matter.',
    'Do not make major legal, medical or financial decisions based only on this reading.',
    'Avoid asking the same question again and again; give the energy time to unfold.',
    'Stay calm and positive. A peaceful mind receives guidance more clearly.',
    'All payments are final. No refunds once the order is placed.',
    'For a detailed personal session, book a Personal Reading at thedivinetarotonline.com.',
  ],
  hi: [
    'यह रिपोर्ट केवल आपके निजी मार्गदर्शन के लिए है। कृपया इसे साझा या दोबारा न बेचें।',
    'टैरो संभावनाएँ और ऊर्जा दिखाता है; आपकी स्वतंत्र इच्छा और आपके चुनाव हमेशा महत्वपूर्ण हैं।',
    'केवल इस रीडिंग के आधार पर बड़े क़ानूनी, चिकित्सा या आर्थिक निर्णय न लें।',
    'एक ही प्रश्न बार-बार न पूछें; ऊर्जा को सामने आने का समय दें।',
    'शांत और सकारात्मक रहें। शांत मन मार्गदर्शन को अधिक स्पष्ट रूप से ग्रहण करता है।',
    'सभी भुगतान अंतिम हैं। ऑर्डर देने के बाद कोई रिफ़ंड नहीं।',
    'विस्तृत व्यक्तिगत सत्र के लिए thedivinetarotonline.com पर पर्सनल रीडिंग बुक करें।',
  ],
  hinglish: [
    'Yeh report sirf aapki personal guidance ke liye hai. Ise share ya resell na karein.',
    'Tarot possibilities aur energies dikhata hai; aapki free will aur choices hamesha matter karti hain.',
    'Sirf is reading ke basis par bade legal, medical ya financial decisions na lein.',
    'Ek hi sawaal baar-baar na poochein; energy ko unfold hone ka time dein.',
    'Calm aur positive rahein. Shaant mann guidance ko zyada clearly receive karta hai.',
    'Saare payments final hain. Order ke baad koi refund nahi.',
    'Detailed personal session ke liye thedivinetarotonline.com par Personal Reading book karein.',
  ],
};

const HI_COLORS: Record<string, string> = {
  White: 'सफ़ेद', 'Royal Blue': 'रॉयल नीला', Silver: 'चाँदी', 'Emerald Green': 'पन्ना हरा', Maroon: 'मैरून', Saffron: 'केसरिया',
  Pink: 'गुलाबी', Red: 'लाल', 'Golden Yellow': 'सुनहरा पीला', 'Deep Purple': 'गहरा बैंगनी', Purple: 'बैंगनी', 'Sea Green': 'समुद्री हरा',
  Black: 'काला', 'Light Blue': 'हल्का नीला', 'Dark Red': 'गहरा लाल', Orange: 'नारंगी', 'Sky Blue': 'आसमानी', 'Silver Grey': 'सिल्वर ग्रे',
  Yellow: 'पीला', Lavender: 'लैवेंडर', 'Deep Blue': 'गहरा नीला', 'Pearl White': 'मोती सफ़ेद', 'Rose Pink': 'गुलाबी', Peach: 'पीच',
  Teal: 'टील', 'Navy Blue': 'नेवी ब्लू', 'Soft Pink': 'हल्का गुलाबी', Lilac: 'लाइलैक', Indigo: 'नील', 'Rose Gold': 'रोज़ गोल्ड',
  Aqua: 'एक्वा', Turquoise: 'फ़िरोज़ी', 'Sea Blue': 'समुद्री नीला', 'Ocean Blue': 'सागर नीला', Gold: 'सुनहरा', 'Olive Green': 'जैतूनी हरा',
  Brown: 'भूरा', 'Dark Green': 'गहरा हरा', Grey: 'स्लेटी', 'Mint Green': 'पुदीना हरा', 'Forest Green': 'गहरा हरा', Green: 'हरा',
  'Champagne Gold': 'शैम्पेन गोल्ड', 'Golden Brown': 'सुनहरा भूरा', 'Light Green': 'हल्का हरा', 'Earth Brown': 'मिट्टी जैसा भूरा',
  'Jade Green': 'जेड हरा', Bronze: 'काँसा', 'Bright White': 'चमकीला सफ़ेद', 'Steel Grey': 'स्टील ग्रे', 'Pale Blue': 'फीका नीला',
  'Slate Grey': 'स्लेट ग्रे', 'Powder Blue': 'पाउडर ब्लू', 'Smoky Grey': 'धुएँ जैसा स्लेटी', Ivory: 'हाथीदाँत सफ़ेद', 'Midnight Blue': 'गहरा रात्रि नीला',
  Charcoal: 'चारकोल', 'Light Yellow': 'हल्का पीला', 'Electric Blue': 'इलेक्ट्रिक ब्लू', 'Ice Blue': 'बर्फ़ीला नीला', Terracotta: 'टेराकोटा',
  Amber: 'अंबर', Marigold: 'गेंदा पीला', Crimson: 'गहरा लाल', Scarlet: 'सुर्ख़ लाल', 'Flame Orange': 'ज्वाला नारंगी', Rust: 'ज़ंग जैसा लाल',
  Coral: 'कोरल', 'Fiery Red': 'तेज़ लाल', 'Sunflower Yellow': 'सूरजमुखी पीला', Copper: 'ताँबा',
};

export function colorName(color: string, lang: Lang): string {
  return lang === 'hi' ? HI_COLORS[color] || color : color;
}

export const fill = (s: string, v: Record<string, string | number>) =>
  s.replace(/\{(\w+)\}/g, (_, k) => (v[k] !== undefined ? String(v[k]) : `{${k}}`));
