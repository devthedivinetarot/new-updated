// 22 Major Arcana cards in Hinglish, used by the automatic newsletter.
// Edit the text freely. Keep each line short: these are emails people read on their phones.

export type Card = {
  name: string;
  emoji: string;
  keyword: string;
  message: string;     // Monday: general energy of the week
  love: string;        // Wednesday: love & relationships
  career: string;      // Friday: career & money
  affirmation: string;
};

export const CARDS: Card[] = [
  {
    name: 'The Fool', emoji: '🃏', keyword: 'Nayi Shuruaat',
    message: 'The Fool ek naye chapter ka card hai. Jo cheez aap kab se shuru karna chahte the, uske liye universe aapko hari jhandi de raha hai. Perfect time ka wait mat kijiye, pehla kadam hi kaafi hai.',
    love: 'Rishton mein thoda halkapan laaiye. Agar aap single hain, toh naye logon se milne mein jhijhak mat kijiye. Agar relationship mein hain, toh saath mein kuch naya try kijiye.',
    career: 'Naya project, naya course ya side business, jo bhi idea aapke mann mein hai usse chhote level pe start kijiye. Risk lijiye, par aankhen khuli rakhiye.',
    affirmation: 'Main har naye safar ka swagat khule dil se karti/karta hoon.',
  },
  {
    name: 'The Magician', emoji: '✨', keyword: 'Aapki Shakti',
    message: 'The Magician keh raha hai ki jo kuch aapko chahiye, wo sab already aapke paas hai: skill, samay aur himmat. Bas focus ek jagah lagaiye aur apni energy bikharne mat dijiye.',
    love: 'Apni feelings clearly express kijiye. Jo aap mehsoos karte hain, wo shabdon mein kahiye. Is hafte aapki baaton mein khaas asar hai.',
    career: 'Ye time apna talent dikhane ka hai. Presentation, interview ya naya client, aap jahan bhi jaayenge, apni baat se impress karenge.',
    affirmation: 'Mere paas apne sapne poore karne ki poori shakti hai.',
  },
  {
    name: 'The High Priestess', emoji: '🌙', keyword: 'Intuition',
    message: 'The High Priestess aapko andar ki awaaz sunne ko keh rahi hai. Har sawaal ka jawab bahar nahi milta. Thoda shaant baithiye, aapka dil pehle se jaanta hai.',
    love: 'Kisi ke baare mein aapki gut feeling sahi ho sakti hai. Jaldbaazi mein faisla mat lijiye, dekhiye aur samjhiye.',
    career: 'Office ya business mein abhi har baat sabko batane ka time nahi hai. Apne plans thode private rakhiye aur sahi waqt ka intezaar kijiye.',
    affirmation: 'Main apni intuition pe bharosa karti/karta hoon.',
  },
  {
    name: 'The Empress', emoji: '🌸', keyword: 'Abundance',
    message: 'The Empress growth aur abundance ka card hai. Jo beej aapne pehle boye the, wo ab phal dene lage hain. Apna aur apne ghar ka khayal rakhiye, khud ko pamper kijiye.',
    love: 'Pyaar aur care ka time hai. Apne partner ya family ke saath quality time bitaiye. Single hain toh khud se pyaar kijiye, sahi insaan khud kheecha chala aayega.',
    career: 'Creative kaam mein barkat hai. Paisa dheere dheere badh raha hai, bas patience rakhiye aur consistency banaye rakhiye.',
    affirmation: 'Mere jeevan mein prem aur samriddhi bharpoor hai.',
  },
  {
    name: 'The Emperor', emoji: '👑', keyword: 'Discipline',
    message: 'The Emperor structure aur discipline ka card hai. Is hafte apni routine set kijiye aur apni boundaries clear rakhiye. Control apne haath mein lijiye.',
    love: 'Rishte mein stability chahiye. Clear baat kijiye ki aapko kya chahiye aur kya nahi. Respect dono taraf se zaroori hai.',
    career: 'Leadership ka mauka aa sakta hai. Planning ke saath kaam kijiye. Seniors aapki maturity notice karenge.',
    affirmation: 'Main apne jeevan ki disha khud tay karti/karta hoon.',
  },
  {
    name: 'The Hierophant', emoji: '📿', keyword: 'Margdarshan',
    message: 'The Hierophant guru aur sahi margdarshan ka card hai. Kisi anubhavi insaan se salah lijiye. Seekhne ka ye bahut achha samay hai.',
    love: 'Family ki raay aur traditions rishte mein role play kar sakti hain. Commitment ki baat aage badh sakti hai.',
    career: 'Course, certification ya mentor, kuch bhi naya seekhne mein invest kijiye. Ye aage chal kar bahut kaam aayega.',
    affirmation: 'Main seekhne ke liye hamesha khula/khuli hoon.',
  },
  {
    name: 'The Lovers', emoji: '💞', keyword: 'Choices',
    message: 'The Lovers sirf pyaar ka nahi, sahi choice ka bhi card hai. Is hafte koi faisla aapke saamne aa sakta hai. Wo chuniye jo aapke values ke saath match kare.',
    love: 'Gehra connection ban raha hai. Dil ki baat kehne ka achha samay hai. Rishte mein honesty sabse badi taakat hai.',
    career: 'Partnership ya collaboration se fayda ho sakta hai. Do options ho toh dil aur dimaag dono se sochiye.',
    affirmation: 'Main wahi chunti/chunta hoon jo meri aatma ke liye sahi hai.',
  },
  {
    name: 'The Chariot', emoji: '🏇', keyword: 'Jeet',
    message: 'The Chariot jeet aur determination ka card hai. Raaste mein rukawatein aayengi, par aapka focus aapko aage le jaayega. Haar mat maniye.',
    love: 'Rishte mein kisi baat pe aage badhne ka time hai. Confusion chhodiye aur clear direction lijiye.',
    career: 'Mehnat ka result milne wala hai. Target pe nazar rakhiye. Travel ya naya mauka bhi aa sakta hai.',
    affirmation: 'Main har rukawat ko paar karke aage badhti/badhta hoon.',
  },
  {
    name: 'Strength', emoji: '🦁', keyword: 'Andar ki Taakat',
    message: 'Strength card keh raha hai ki asli taakat gusse mein nahi, sabr mein hai. Mushkil logon aur halaat ko pyaar aur patience se handle kijiye.',
    love: 'Rishte mein thodi narmi dikhaiye. Ek kadam peeche lena kamzori nahi, samajhdaari hai.',
    career: 'Pressure mein bhi aap shaant rahenge aur yahi aapki pehchaan banegi. Long-term pe dhyaan rakhiye.',
    affirmation: 'Mere andar har mushkil se ladne ki himmat hai.',
  },
  {
    name: 'The Hermit', emoji: '🕯️', keyword: 'Aatm-Chintan',
    message: 'The Hermit thoda ruk kar khud se milne ko keh raha hai. Bheed se door, apne liye samay nikaliye. Meditation ya journaling bahut madad karegi.',
    love: 'Kabhi kabhi space lena rishte ke liye achha hota hai. Pehle samjhiye ki aapko asal mein kya chahiye.',
    career: 'Akele focus karke kaam karne ka time hai. Research aur planning se aage ka raasta saaf hoga.',
    affirmation: 'Shaanti mein mujhe apne jawab milte hain.',
  },
  {
    name: 'Wheel of Fortune', emoji: '🎡', keyword: 'Badlaav',
    message: 'Wheel of Fortune keh raha hai ki waqt badal raha hai. Jo phase mushkil tha wo guzar raha hai. Badlaav ko rokiye mat, uske saath behiye.',
    love: 'Achanak koi purana ya naya insaan zindagi mein aa sakta hai. Kismat aapke saath hai.',
    career: 'Lucky break mil sakta hai. Opportunities pe nazar rakhiye aur turant action lijiye.',
    affirmation: 'Har badlaav mere achhe ke liye ho raha hai.',
  },
  {
    name: 'Justice', emoji: '⚖️', keyword: 'Sach aur Karma',
    message: 'Justice sach aur balance ka card hai. Jo aapne diya hai, wahi laut kar aayega. Is hafte imaandaari se faisle lijiye.',
    love: 'Rishte mein barabari zaroori hai. Agar kuch unfair lag raha hai toh shaanti se baat kijiye.',
    career: 'Legal kaam, documents ya agreements mein dhyaan dijiye. Sahi faisla aapke favour mein aayega.',
    affirmation: 'Main sach ke saath khadi/khada hoon aur universe mere saath hai.',
  },
  {
    name: 'The Hanged Man', emoji: '🙃', keyword: 'Naya Nazariya',
    message: 'The Hanged Man kehta hai ki kabhi kabhi rukna hi aage badhna hota hai. Kisi situation ko ek naye angle se dekhiye, jawab wahin chhupa hai.',
    love: 'Rishte mein zabardasti mat kijiye. Thoda samay dijiye, cheezein apne aap sahi hongi.',
    career: 'Delay se pareshan mat hoiye. Ye waqt planning aur skills sudhaarne ka hai.',
    affirmation: 'Main sabr rakhti/rakhta hoon, sahi samay aa raha hai.',
  },
  {
    name: 'Death', emoji: '🦋', keyword: 'Transformation',
    message: 'Ghabraiye mat, Death card ka matlab ant nahi, badlaav hai. Kuch purana khatam ho raha hai taaki kuch naya aur behtar aa sake. Jo kaam ka nahi, use jaane dijiye.',
    love: 'Purani baaton ko chhodne ka time hai. Ek naya, healthy rishta ya naya phase shuru ho sakta hai.',
    career: 'Job ya kaam mein bada badlaav aa sakta hai. Darr ki jagah curiosity se dekhiye, ye growth ka raasta hai.',
    affirmation: 'Main purane ko jaane deti/deta hoon aur naye ka swagat karti/karta hoon.',
  },
  {
    name: 'Temperance', emoji: '🌊', keyword: 'Balance',
    message: 'Temperance balance ka card hai. Kaam aur aaram, dena aur lena, sab mein santulan rakhiye. Jaldbaazi se zyada consistency kaam aayegi.',
    love: 'Rishte mein beech ka raasta nikaliye. Thoda aap jhukiye, thoda wo, aur rishta mazboot hoga.',
    career: 'Dheere aur steady kaam kijiye. Kharche aur bachat mein balance zaroori hai.',
    affirmation: 'Mera jeevan santulan aur shaanti se bhara hai.',
  },
  {
    name: 'The Devil', emoji: '⛓️', keyword: 'Bandhan se Mukti',
    message: 'The Devil un aadaton aur sochon ki taraf ishara karta hai jo aapko rok rahi hain. Pehchaaniye ki kya cheez aapko baandh rahi hai. Jaagrukta hi mukti ki pehli seedhi hai.',
    love: 'Toxic pattern ya zaroorat se zyada attachment ko pehchaaniye. Pyaar aazaadi deta hai, qaid nahi.',
    career: 'Sirf paise ke peeche bhaagne se thakaan hogi. Overspending aur shortcuts se bachiye.',
    affirmation: 'Main har us cheez se mukt hoon jo mujhe peeche kheenchti hai.',
  },
  {
    name: 'The Tower', emoji: '⚡', keyword: 'Breakthrough',
    message: 'The Tower achanak badlaav ka card hai. Jo cheez kamzor neev pe khadi thi, wo hil sakti hai, par uske baad hi mazboot cheez banti hai. Ye breakthrough ka samay hai.',
    love: 'Koi sach saamne aa sakta hai. Thoda mushkil lagega, par clarity aapko aazaad karegi.',
    career: 'Plan B tayyar rakhiye. Achanak aaya badlaav aage chal kar blessing sabit hoga.',
    affirmation: 'Har toofan ke baad main aur mazboot ban kar nikalti/nikalta hoon.',
  },
  {
    name: 'The Star', emoji: '⭐', keyword: 'Ummeed',
    message: 'The Star healing aur ummeed ka card hai. Mushkil phase khatam ho raha hai. Khud pe bharosa rakhiye, aapki duayein suni ja rahi hain.',
    love: 'Dil ke zakhm bhar rahe hain. Pyaar mein phir se vishwas karne ka time aa gaya hai.',
    career: 'Aapke sapne realistic hain. Apne goal ko roz thoda thoda paani dijiye, wo zaroor khilega.',
    affirmation: 'Mera bhavishya ujjwal hai aur main healing ki taraf badh rahi/raha hoon.',
  },
  {
    name: 'The Moon', emoji: '🌕', keyword: 'Bhram aur Sach',
    message: 'The Moon kehta hai ki har cheez waisi nahi jaisi dikhti hai. Confusion ho toh bade faisle thoda rok lijiye. Apne darr ko pehchaaniye, wo aksar sach nahi hote.',
    love: 'Overthinking se bachiye. Andaaze lagane ki jagah seedha baat kijiye.',
    career: 'Kisi deal ya offer ki poori jaankari lijiye. Fine print padhiye, jaldbaazi mat kijiye.',
    affirmation: 'Main darr se upar uth kar sach ko dekhti/dekhta hoon.',
  },
  {
    name: 'The Sun', emoji: '☀️', keyword: 'Khushi aur Safalta',
    message: 'The Sun tarot ka sabse positive card hai! Khushi, safalta aur positivity aapki taraf aa rahi hai. Muskuraiye, ye aapka waqt hai.',
    love: 'Rishte mein garmahat aur khushi hai. Celebration ya achhi khabar mil sakti hai.',
    career: 'Recognition aur success ka samay hai. Aapki mehnat sabko dikhegi.',
    affirmation: 'Main roshni, khushi aur safalta ko apni taraf kheenchti/kheenchta hoon.',
  },
  {
    name: 'Judgement', emoji: '📯', keyword: 'Jaagran',
    message: 'Judgement ek wake-up call hai. Apne past se seekhiye, khud ko maaf kijiye aur apne asli calling ki taraf badhiye.',
    love: 'Purana rishta wapas aa sakta hai ya purani baat ka closure mil sakta hai. Dil se faisla lijiye.',
    career: 'Aapko apna asli kaam pukaar raha hai. Wo career ya skill jo aap hamesha chahte the, uski taraf kadam badhaiye.',
    affirmation: 'Main apne jeevan ke uddeshya ke prati jaagrook hoon.',
  },
  {
    name: 'The World', emoji: '🌍', keyword: 'Poornata',
    message: 'The World ek chakra poora hone ka card hai. Aapne bahut kuch paaya hai, khud ko credit dijiye. Ek naya, bada chapter aapka intezaar kar raha hai.',
    love: 'Rishta ek naye level pe ja sakta hai. Poornata aur santushti ka ehsaas hoga.',
    career: 'Project complete hoga ya bada milestone milega. International ya door ke mauke bhi khul sakte hain.',
    affirmation: 'Main poorn hoon aur mera jeevan safal hai.',
  },
];

// Optional: a course or offer to promote in the Friday email.
// Set to null when there's nothing to promote. It stops showing automatically after `showUntil`.
export const PROMO: null | {
  title: string;
  text: string;
  ctaLabel: string;
  ctaUrl: string;
  showUntil: string; // YYYY-MM-DD (IST)
} = null;

// Example:
// export const PROMO = {
//   title: '📚 Heal WITHIN — 15 Nov se shuru',
//   text: 'Booking start date se 2 din pehle band ho jaati hai. Apni seat abhi book kijiye.',
//   ctaLabel: 'Seat book karein →',
//   ctaUrl: 'https://learn.thedivinetarotonline.com/',
//   showUntil: '2026-11-13',
// };
