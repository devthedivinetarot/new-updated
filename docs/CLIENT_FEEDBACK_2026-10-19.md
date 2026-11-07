# Client feedback — 17 Oct 2026 (videos + screenshots) — fixed 19 Oct

| # | Feedback (client ke words) | Site / folder | Status |
|---|---|---|---|
| 1 | Page reload pe firse naam poochta hai; ek login = ek hi insaan hona chahiye (group ek purchase share na kare) | reading.thedivinetarotonline.com — D:\TDt-ginni-new | Fixed: naam account pe save, reload pe seedha chat; naam ek baar set hone ke baad change nahi hota; signup pe naam required |
| 2 | Sawaal poochne ke baad screen niche options pe rukti hai, upar scroll karna padta hai | reading app — D:\TDt-ginni-new | Fixed: reading aate hi screen aapke sawaal pe rukti hai, jawab niche padh sakte ho |
| 3 | Kundli Milan mein boxes bahar ja rahe hain | thedivinetarotonline.com/kundli-milan — D:\TDT-main-v1 | Fixed: date/time inputs card ke andar, phone pe ek ke niche ek |
| 4 | "Ask your question" wala button cut hai | booking.thedivinetarotonline.com — D:\TDT - personal booking | Fixed: phone pe "Ask now" chhota button, poora dikhta hai |
| 5 | Testimonial box right side se bahar ja raha hai | Home — D:\TDT-main-v1 | Fixed: carousel ab container width se size hota hai |
| 6 | 4.9 rating red hai, negative lagta hai | Home "Why" section | Fixed: gold colour + star icon |
| 7 | Last mein glitch (scroll karte waqt screen black) | Home bottom / footer | Fixed: heavy infinite blur animations hataye, header scroll handler halka kiya, phone pe CTA glow animation band |
| 8 | Hindi select karne pe sab Hindi nahi hota | Home, header, footer, Kundli page | Fixed: ~150 lines Hindi add; hardcoded English text ab language ke saath badalta hai |

Extra found while fixing:
- Footer.tsx in D:\TDT-main-v1 had a broken paste in the subscribe handler (would not compile) — replaced with the working GitHub version + translations.
- Footer copyright line was being overwritten to just the year by a script — fixed.

Not covered yet: Kundli result scorecard text (after payment) is still English; About page Hindi already existed (two wrong Hindi lines corrected).
