var e=`# restaurant_website — app files

## base44/entities/MenuItem.jsonc
\`\`\`json
{"name":"MenuItem","type":"object","properties":{"name":{"type":"string"},"price":{"type":"number"},"description":{"type":"string"},"group":{"type":"string","enum":["Starters","Mains","Desserts"]},"image":{"type":"string"},"position":{"type":"number"},"sample":{"type":"boolean","description":"A sample row the app added on its first load"}},"required":["name","price","group"],"rls":{"read":{},"create":{"user_condition":{"role":"admin"}},"update":{"user_condition":{"role":"admin"}},"delete":{"user_condition":{"role":"admin"}}}}
\`\`\`

## base44/entities/Reservation.jsonc
\`\`\`json
{"name":"Reservation","type":"object","properties":{"name":{"type":"string"},"guests":{"type":"integer","minimum":1},"date":{"type":"string","format":"date"},"time":{"type":"string"},"phone":{"type":"string"}},"required":["name","guests","date","time","phone"],"rls":{"create":{"user_condition":{"role":"admin"}},"read":{"$or":[{"created_by_id":"{{user.id}}"},{"user_condition":{"role":"admin"}}]},"update":{"user_condition":{"role":"admin"}},"delete":{"user_condition":{"role":"admin"}}}}
\`\`\`

## base44/entities/SiteSetup.jsonc
\`\`\`json
{"name":"SiteSetup","type":"object","properties":{"set_up":{"type":"boolean","default":true}},"required":["set_up"],"rls":{"read":{},"create":{"user_condition":{"role":"admin"}},"update":{"user_condition":{"role":"admin"}},"delete":{"user_condition":{"role":"admin"}}}}
\`\`\`

## base44/functions/bookTable/entry.ts
\`\`\`ts
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.52';

// Books a table while its half-hour still has room. Guests can't read each other's bookings (rls), so the checks run here.
const SLOT_COVERS = 24; // guests seated per half-hour
const MAX_GUESTS = 20;
// Opening hours by weekday (0 = Sunday), as HOURS in src/components/osteria-lume/content.js; the last table sits an hour before closing.
const OPEN: ([string, string] | null)[] = [['12:00', '21:00'], null, ['17:30', '22:30'], ['17:30', '22:30'], ['17:30', '22:30'], ['17:30', '23:30'], ['12:00', '23:30']];
const LAST_SEATING = 60;
const minutes = (t: string) => Number(t.slice(0, 2)) * 60 + Number(t.slice(3));

/** Whether \`date\` at \`time\` is a bookable half-hour: an open day, inside its hours, and still ahead on Bologna's clock. */
function bookable(date: string, time: string) {
  const hours = OPEN[new Date(\`\${date}T00:00:00Z\`).getUTCDay()];
  const at = minutes(time);
  if (!hours || at % 30 || at < minutes(hours[0]) || at > minutes(hours[1]) - LAST_SEATING) return false;
  const now = new Date(new Date().toLocaleString('en-US', { timeZone: 'Europe/Rome' }));
  const today = \`\${now.getFullYear()}-\${String(now.getMonth() + 1).padStart(2, '0')}-\${String(now.getDate()).padStart(2, '0')}\`;
  return date > today || (date === today && at > now.getHours() * 60 + now.getMinutes());
}
const text = (v, max) => (typeof v === 'string' ? v.trim().slice(0, max) : '');

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();
    const name = text(body.name, 120);
    const phone = text(body.phone, 40);
    const date = text(body.date, 10);
    const time = text(body.time, 5);
    const guests = Number(body.guests);
    if (!name || !phone || !/^\\d{4}-\\d{2}-\\d{2}$/.test(date) || !/^\\d{2}:\\d{2}$/.test(time) || !Number.isInteger(guests) || guests < 1 || guests > MAX_GUESTS) {
      return Response.json({ error: 'A name, phone, date, time and 1 to 20 guests are required.' }, { status: 400 });
    }

    if (!bookable(date, time)) return Response.json({ status: 'closed' });

    const reservations = base44.asServiceRole.entities.Reservation;
    const slot = await reservations.filter({ date, time }, undefined, 200);
    if (slot.some((r) => r.phone === phone)) return Response.json({ status: 'duplicate' });
    if (slot.reduce((sum, r) => sum + r.guests, 0) + guests > SLOT_COVERS) return Response.json({ status: 'full' });
    await reservations.create({ name, phone, date, time, guests });
    return Response.json({ status: 'booked' });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});
\`\`\`

## src/components/osteria-lume/booking.js
\`\`\`js
import { addDays, format } from 'date-fns';
import { HOURS } from './content';

// Weekday (0 = Sunday) → its row in HOURS, so the booking form and the table read the same hours.
const ROW_OF_DAY = [4, 0, 1, 1, 1, 2, 3];
const STEP = 30;
// The kitchen closes 30 minutes before closing; the last table sits half an hour before that.
const LAST_SEATING = 60;

export const MAX_GUESTS = 20;
// The restaurant's clock, whatever the visitor's time zone: a Date whose local fields read Bologna time.
const TIME_ZONE = 'Europe/Rome';
export const restaurantNow = () => new Date(new Date().toLocaleString('en-US', { timeZone: TIME_ZONE }));

const minutes = (t) => { const [h, m] = t.split(':').map(Number); return h * 60 + m; };
const clock = (m) => \`\${String(Math.floor(m / 60)).padStart(2, '0')}:\${String(m % 60).padStart(2, '0')}\`;
export const isoDay = (d) => format(d, 'yyyy-MM-dd');
export const dayOf = (iso) => new Date(\`\${iso}T00:00:00\`);

/** The times a table can be booked on \`iso\` (YYYY-MM-DD): none on a closed or past day, only later ones today. */
export function slotsOn(iso, now = restaurantNow()) {
  const today = isoDay(now);
  if (!/^\\d{4}-\\d{2}-\\d{2}$/.test(iso) || iso < today) return [];
  const hours = HOURS[ROW_OF_DAY[dayOf(iso).getDay()]][1];
  if (!hours) return [];
  const [open, close] = hours.split(' – ').map(minutes);
  const after = iso === today ? now.getHours() * 60 + now.getMinutes() : -1;
  const slots = [];
  for (let m = open; m <= close - LAST_SEATING; m += STEP) if (m > after) slots.push(clock(m));
  return slots;
}

export const firstOpenDay = (now = restaurantNow()) =>
  [...Array(8).keys()].map((i) => isoDay(addDays(now, i))).find((iso) => slotsOn(iso, now).length);

/** Why \`iso\` has no tables, for the form's note. */
export function closedReason(iso, now = restaurantNow()) {
  if (!iso) return 'Pick a date.';
  if (iso < isoDay(now)) return 'That date has passed.';
  if (iso === isoDay(now)) return 'No more tables today. Please pick another day.';
  return \`We’re closed on \${format(dayOf(iso), 'EEEE')}s.\`;
}
\`\`\`

## src/components/osteria-lume/content.js
\`\`\`js
import { IMAGES } from './images';

export const ADDRESS = 'Via Ferrara 12, Bologna';
export const PHONE = '+39 051 234 5678';
export const DIRECTIONS_URL = 'https://www.google.com/maps/search/?api=1&query=Via+Ferrara+12+Bologna';

// h: the pill's length in the side rail.
export const NAV = [
  { label: 'Menu', id: 'menu', h: 64 },
  { label: 'Hours', id: 'hours', h: 69.3 },
  { label: 'Find us', id: 'find-us', h: 73.3 },
];

const dishes = (group, rows) => rows.map(([name, price, description, image]) => ({ group, name, price, description, image: IMAGES[image] }));

export const SEED_MENU = [
  ...dishes('Starters', [
    ['Burrata e Pomodorini', 14, 'Creamy Puglian Burrata, slow-roasted cherry tomatoes, basil oil, grilled sourdough.', 'burrata'],
    ['Arancini al Ragù', 11, 'Crisp saffron rice balls filled with beef ragù and Mozzarella, spiced tomato dip.', 'arancini'],
    ['Carpaccio di Manzo', 16, 'Thinly sliced raw beef, rocket, aged Parmigiano, capers and a squeeze of lemon.', 'carpaccio'],
    ['Polpo alla Griglia', 17, 'Charred octopus on smashed potatoes with olives, chilli and parsley.', 'polpo'],
    ['Zuppa di Fagioli', 10, 'Tuscan white bean and rosemary soup finished with peppery new-season oil.', 'zuppa'],
    ['Antipasto della Casa', 19, 'Cured meats, marinated vegetables, olives and Pecorino for the table.', 'antipasto'],
  ]),
  ...dishes('Mains', [
    ['Tagliatelle al Ragù', 21, 'Fresh egg pasta with our eight-hour beef and pork ragù, Parmigiano Reggiano.', 'tagliatelle'],
    ['Cacio e Pepe', 18, 'Tonnarelli tossed with Pecorino Romano and freshly cracked black pepper.', 'cacioEPepe'],
    ['Risotto ai Funghi', 22, 'Carnaroli rice, wild mushrooms, thyme butter and a shaving of black truffle.', 'risotto'],
    ['Branzino al Forno', 29, 'Whole roasted sea bass with fennel, lemon, capers and salsa verde.', 'branzino'],
    ['Pollo alla Cacciatora', 24, 'Braised free-range chicken with tomato, rosemary, black olives and wine.', 'pollo'],
    ['Bistecca Fiorentina', 42, 'Dry-aged T-bone grilled over wood, rosemary salt, roast potatoes. For two.', 'bistecca'],
    ['Melanzane alla Parmigiana', 19, 'Layers of fried aubergine, tomato sugo, Mozzarella and basil, baked golden.', 'melanzane'],
  ]),
  ...dishes('Desserts', [
    ['Tiramisù', 9, 'Espresso-soaked savoiardi, Mascarpone cream and a dusting of dark cocoa.', 'tiramisu'],
    ['Panna Cotta', 8, 'Vanilla-set cream with poached seasonal fruit and crushed amaretti.', 'pannaCotta'],
    ['Cannoli Siciliani', 9, 'Crisp pastry shells piped with sweet Ricotta, pistachio and candied orange.', 'cannoli'],
    ['Torta al Cioccolato', 10, 'Warm flourless chocolate cake with sea salt and crème fraîche.', 'torta'],
    ['Affogato', 7, 'A scoop of fior di latte gelato drowned in a shot of hot espresso.', 'affogato'],
  ]),
];

// [label, photo, width, top, gap to the next card]. The strip runs left to right, so each next card sits to the left.
const CARDS = [
  ['Primi', IMAGES.primi, 253, 41, 113], ['Dolci', IMAGES.dolci, 200, 445, 33], ['Antipasti', IMAGES.antipasti, 227, 227, 7],
  ['Dal forno', IMAGES.dalForno, 280, 41, 127], ['Al bar', IMAGES.alBar, 213, 428, 33], ['Secondi', IMAGES.secondi, 240, 218, 100],
  ['Aperitivo', IMAGES.aperitivo, 200, 445, -7], ['Dolci', IMAGES.dolciRosa, 267, 41, 40], ['Primi', IMAGES.primi, 227, 227, 80],
  ['Antipasti', IMAGES.antipasti, 253, 400, 20], ['Secondi', IMAGES.secondi, 213, 41, 60], ['Al bar', IMAGES.alBar, 240, 227, 13],
  ['Dal forno', IMAGES.dalForno, 200, 440, 93], ['Aperitivo', IMAGES.aperitivo, 267, 41, 53], ['Dolci', IMAGES.dolci, 227, 400, 380],
];
export const STRIP_WIDTH = CARDS.reduce((sum, [, , w, , gap]) => sum + w + gap, 0);
let right = STRIP_WIDTH;
export const GALLERY = CARDS.map(([label, image, w, top, gap]) => {
  const left = right - w;
  right = left - gap;
  return { label, image, w, top, left };
});

// [day, hours, the day's short label on phones].
export const HOURS = [
  ['Monday', null],
  ['Tuesday – Thursday', '17:30 – 22:30', 'Tue – Thu'],
  ['Friday', '17:30 – 23:30'],
  ['Saturday', '12:00 – 23:30'],
  ['Sunday', '12:00 – 21:00'],
];

export const FOOTER = [
  ['Visit', [['Via Ferrara 12'], ['40121 Bologna']]],
  ['Hours', [['Tue – Sun from 17:30'], ['Sat – Sun from 12:00']]],
  ['Contact', [[PHONE, 'tel:+390512345678'], ['ciao@osterialume.it', 'mailto:ciao@osterialume.it']]],
  ['Follow', [['Instagram', 'https://www.instagram.com/'], ['Facebook', 'https://www.facebook.com/']]],
];
\`\`\`

## src/components/osteria-lume/Footer.jsx
\`\`\`jsx
import { motion } from 'framer-motion';
import Pill from './Pill';
import Reveal from './Reveal';
import { FOOTER } from './content';
import { useFitText } from './useFitText';

const WORDMARK = 'Osteria Lume';
// An email may wrap after its @ in a narrow column.
const breakAt = (text) => (text.includes('@') ? <>{text.split('@')[0]}@<wbr />{text.split('@')[1]}</> : text);
const rise = { hidden: { y: '110%' }, shown: { y: 0, transition: { duration: 0.55, ease: [0.215, 0.61, 0.355, 1] } } };

export default function Footer({ onBook }) {
  const wordmark = useFitText();
  return (
    <footer id="find-us" className="relative h-screen overflow-hidden bg-[var(--ui-ink)] px-[max(80px,6.25vw)] pt-[max(80px,6.25vw)] text-[var(--ui-paper)] max-[768px]:h-auto max-[768px]:scroll-mt-[110px] max-[768px]:px-[20px] max-[768px]:pb-[40px] max-[768px]:pt-[64px]">
      <Reveal className="flex items-end justify-between max-[768px]:flex-col max-[768px]:items-start max-[768px]:gap-[28px]">
        <h2 className="ol-serif text-[max(73.3px,5.726vw)] leading-[0.9] max-[768px]:text-[58px]">A table is<br /><span className="pl-[max(58.7px,4.585vw)] max-[768px]:pl-[40px]">waiting.</span></h2>
        <Pill variant="inverse" onClick={onBook} className="h-[max(42.7px,3.335vw)] w-[max(150px,11.718vw)] text-[max(14.67px,1.146vw)] max-[768px]:h-[54px] max-[768px]:w-auto max-[768px]:px-[30px] max-[768px]:text-[18px]">Book a table</Pill>
      </Reveal>
      <div className="mt-[max(68px,5.312vw)] border-t border-dotted border-[var(--ui-paper)] opacity-60 max-[768px]:mt-[40px]" />
      <Reveal className="mt-[max(24px,1.875vw)] grid grid-cols-4 gap-x-[max(53.3px,4.164vw)] max-[768px]:mt-[28px] max-[768px]:grid-cols-2 max-[768px]:gap-x-[20px] max-[768px]:gap-y-[28px]">
        {FOOTER.map(([label, lines]) => (
          <div key={label} className="min-w-0">
            <div className="text-[max(10px,0.781vw)] leading-none tracking-[0.06em] opacity-75 max-[768px]:text-[12px] max-[768px]:tracking-[0.08em]">{label}</div>
            <div className="mt-[max(11px,0.859vw)] text-[max(16px,1.25vw)] leading-[1.35] max-[768px]:leading-[1.4] max-[768px]:[overflow-wrap:anywhere]">
              {lines.map(([text, href]) => (
                <div key={text}>{href ? <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noreferrer" className="hover:opacity-75">{breakAt(text)}</a> : text}</div>
              ))}
            </div>
          </div>
        ))}
      </Reveal>
      <motion.div ref={wordmark} aria-label={WORDMARK} initial="hidden" whileInView="shown" viewport={{ once: true, amount: 0.6 }} transition={{ staggerChildren: 0.03 }}
        className="ol-serif absolute inset-x-[max(80px,6.25vw)] top-[max(463px,36.171vw)] overflow-hidden whitespace-pre pb-[0.25em] pt-[0.12em] text-[min(max(153.3px,11.976vw),12vw)] leading-none max-[768px]:static max-[768px]:mt-[48px] max-[768px]:text-[min(62px,13vw)]">
        {[...WORDMARK].map((ch, i) => <motion.span key={i} aria-hidden="true" variants={rise} className="inline-block">{ch}</motion.span>)}
      </motion.div>
      <div className="absolute inset-x-[max(80px,6.25vw)] bottom-[max(28px,2.187vw)] flex justify-between text-[max(9px,0.703vw)] max-[768px]:static max-[768px]:mt-[16px] max-[768px]:text-[11px] leading-none tracking-[0.04em] opacity-75">
        <span>© {new Date().getFullYear()} Osteria Lume</span>
        <span>osterialume.it</span>
      </div>
    </footer>
  );
}
\`\`\`

## src/components/osteria-lume/Gallery.jsx
\`\`\`jsx
import { motion } from 'framer-motion';
import Photo from './Photo';
import { GALLERY, STRIP_WIDTH } from './content';

const SPEED = 700; // px per second at 1280px; the strip grows with the window above it, keeping its time
const s = (px) => \`max(\${px}px, \${Math.floor(px / 0.0128) / 1000}vw)\`; // never above px at 1280

export default function Gallery() {
  return (
    <section id="gallery" className="ol-strip relative h-[max(733px,57.265vw)] overflow-hidden border-t border-dotted border-[var(--ui-ink)] max-[768px]:h-auto max-[768px]:py-[48px]">
      <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, margin: '0px 0px -25% 0px' }} transition={{ duration: 0.5 }} className="absolute inset-0 max-[768px]:static">
        <div className="ol-marquee absolute inset-y-0 left-0 max-[768px]:hidden" style={{ width: s(STRIP_WIDTH * 2), animationDuration: \`\${STRIP_WIDTH / SPEED}s\`, animationDelay: '-2.85s' }}>
          {[0, STRIP_WIDTH].map((offset) => GALLERY.map((card, i) => (
            <figure key={\`\${offset}-\${i}\`} className="absolute overflow-hidden rounded-[4px]" style={{ left: s(offset + card.left), top: s(card.top), width: s(card.w), height: s(card.w * 1.25) }}>
              <Photo src={card.image} alt={card.label} className="h-full w-full" />
              <figcaption className="absolute bottom-[max(11px,0.859vw)] left-[max(11px,0.859vw)] flex h-[max(24.7px,1.929vw)] items-center rounded-full bg-[var(--ui-photo-ink)] px-[max(13px,1.015vw)] text-[max(9px,0.703vw)] leading-none text-[var(--ui-photo-pill-ink)]"><span className="translate-y-[0.1em]">{card.label}</span></figcaption>
            </figure>
          )))}
        </div>
        {/* Phones: one even row of cards. Each card carries its gap, so the two copies tile exactly. */}
        <div className="ol-marquee flex w-max min-[769px]:hidden" style={{ animationDuration: '60s' }}>
          {[0, 1].map((copy) => GALLERY.map((card, i) => (
            <figure key={\`\${copy}-\${i}\`} aria-hidden={copy === 1 || undefined} className="relative mr-[12px] h-[250px] w-[190px] flex-none overflow-hidden rounded-[6px]">
              <Photo src={card.image} alt={card.label} className="h-full w-full" />
              <figcaption className="absolute bottom-[10px] left-[10px] flex h-[30px] items-center rounded-full bg-[var(--ui-photo-ink)] px-[14px] text-[13px] leading-none text-[var(--ui-photo-pill-ink)]">
                <span className="translate-y-[0.1em]">{card.label}</span>
              </figcaption>
            </figure>
          )))}
        </div>
      </motion.div>
    </section>
  );
}
\`\`\`

## src/components/osteria-lume/Hero.jsx
\`\`\`jsx
import Photo from './Photo';
import Pill from './Pill';
import { NAV } from './content';
import { IMAGES } from './images';
import { useFitText } from './useFitText';

export default function Hero({ onNav, onBook }) {
  const title = useFitText();
  return (
    <section className="relative h-screen overflow-hidden max-[768px]:h-[100svh] text-[var(--ui-photo-ink)]">
      <Photo src={IMAGES.hero} eager alt="Seafood pasta on a white platter, seen from above" className="absolute inset-0 h-full w-full object-[50%_100%] max-[768px]:object-[46%_50%]" />
      {/* A look with its own hero photo (the tablecloth recoloured) sets it here. */}
      <div aria-hidden="true" className="absolute inset-0 bg-cover bg-[50%_100%] bg-no-repeat [background-image:var(--ui-hero-photo)] max-[768px]:bg-[46%_50%]" />
      <div className="ol-hero-shade absolute inset-0" />
      {/* From 1280px up the hero's chrome grows with the window, like its title. */}
      <header className="absolute inset-x-0 top-0 z-10 flex max-[768px]:hidden h-[max(58.7px,4.586vw)] items-center px-[max(44px,3.4375vw)]">
        <span className="ol-serif text-[max(21.3px,1.664vw)] leading-none">Osteria Lume</span>
        <nav className="flex flex-1 justify-center gap-[max(10px,0.78125vw)]">
          {NAV.map((n) => (
            <Pill key={n.id} variant="photoOutline" onClick={() => onNav(n.id)} className="h-[max(32px,2.5vw)] px-[max(16px,1.25vw)] text-[max(12px,0.9375vw)] tracking-[0.04em]">{n.label}</Pill>
          ))}
        </nav>
        <Pill variant="photo" onClick={onBook} className="h-[max(34px,2.656vw)] px-[max(20px,1.5625vw)] text-[max(12px,0.9375vw)] tracking-[0.04em]">Book a table</Pill>
      </header>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <h1 ref={title} className="ol-serif ol-photo-text max-w-[calc(100%-max(88px,6.875vw))] whitespace-nowrap text-[min(230px,12vw)] leading-[0.9] max-[768px]:max-w-[calc(100%-40px)] max-[768px]:text-[min(64px,14vw)]">Osteria Lume</h1>
        <Pill variant="photo" onClick={onBook} className="mt-[max(39.3px,3.07vw)] h-[max(36.7px,2.867vw)] w-[max(135.3px,10.57vw)] text-[max(13px,1.016vw)] tracking-[0.02em] max-[768px]:mt-[28px] max-[768px]:h-[52px] max-[768px]:w-auto max-[768px]:px-[28px] max-[768px]:text-[17px]">Book a table</Pill>
      </div>
    </section>
  );
}
\`\`\`

## src/components/osteria-lume/Hours.jsx
\`\`\`jsx
import Pill from './Pill';
import Reveal from './Reveal';
import { ADDRESS, DIRECTIONS_URL, HOURS, PHONE } from './content';

export default function Hours({ onBook }) {
  return (
    <section id="hours" className="grid h-[max(533px,41.64vw)] grid-cols-[347fr_653fr] gap-x-[max(53px,4.14vw)] border-t border-dotted border-[var(--ui-ink)] pl-[max(80px,6.25vw)] pr-[max(83px,6.484vw)] pt-[max(63px,4.921vw)] max-[768px]:flex max-[768px]:h-auto max-[768px]:scroll-mt-[110px] max-[768px]:flex-col max-[768px]:px-[20px] max-[768px]:py-[64px]">
      {/* Phones stack title, hours, then the address and buttons. */}
      <div className="max-[768px]:contents">
        <Reveal>
          <h2 className="ol-serif text-[max(80px,6.25vw)] leading-[0.95] max-[768px]:text-[58px]">Opening<br /><span className="pl-[max(44px,3.437vw)] max-[768px]:pl-[40px]">Hours</span></h2>
        </Reveal>
        <Reveal className="max-[768px]:order-last">
          <p className="mt-[max(25px,1.953vw)] text-[max(12px,0.937vw)] leading-[1.5] max-[768px]:mt-[28px] max-[768px]:text-[16px]">{ADDRESS}<br />{PHONE}</p>
          <div className="mt-[max(18px,1.406vw)] flex gap-[max(8px,0.625vw)]">
            <Pill onClick={onBook} className="h-[max(32px,2.5vw)] w-[max(112.7px,8.804vw)] text-[max(12px,0.937vw)] max-[768px]:h-[46px] max-[768px]:w-auto max-[768px]:flex-1 max-[768px]:text-[15px]">Book a table</Pill>
            <Pill variant="outline" href={DIRECTIONS_URL} className="h-[max(32px,2.5vw)] w-[max(101.3px,7.914vw)] text-[max(12px,0.937vw)] max-[768px]:h-[46px] max-[768px]:w-auto max-[768px]:flex-1 max-[768px]:text-[15px]">Directions</Pill>
          </div>
        </Reveal>
      </div>
      <div className="-mt-[max(4.3px,0.335vw)] max-[768px]:mt-[32px]">
        {HOURS.map(([day, time, short], i) => (
          <Reveal key={day} x={40} y={0} delay={i * 0.14} className="flex h-[max(76.67px,5.989vw)] flex-col justify-end border-b border-dotted border-[var(--ui-rule)] pb-[max(14px,1.093vw)] max-[768px]:h-auto max-[768px]:pt-[18px]">
            <div className="flex items-baseline justify-between">
              <span className="text-[max(17.33px,1.353vw)] leading-none max-[768px]:flex-1 max-[768px]:text-[15px]">
                {short ? <><span className="max-[768px]:hidden">{day}</span><span className="min-[769px]:hidden">{short}</span></> : day}
              </span>
              {time
                ? <span className="ol-serif whitespace-nowrap text-[max(41.33px,3.228vw)] leading-none max-[768px]:pr-[8px] max-[768px]:text-[26px]">{time}</span>
                : <span className="ol-serif whitespace-nowrap text-[max(33.33px,2.603vw)] leading-none text-[var(--ui-rule)] max-[768px]:pr-[8px] max-[768px]:text-[26px]">Closed</span>}
            </div>
          </Reveal>
        ))}
        <p className="mt-[max(15px,1.171vw)] text-[max(10px,0.781vw)] leading-none max-[768px]:mt-[16px] max-[768px]:text-[13px] max-[768px]:leading-[1.3]">Kitchen closes 30 minutes before closing</p>
      </div>
    </section>
  );
}
\`\`\`

## src/components/osteria-lume/images.js
\`\`\`js
// Every photo on the page; an empty string shows a placeholder of the same size.
const PHOTOS = 'https://media.base44.com/images/public/builder-assets/gallery/restaurant-website';
const photo = (file) => \`\${PHOTOS}/\${file}.webp\`;

// Dishes shot from directly above in hard sunlight with crisp shadows, on a white or bold flat-colour ground.
export const IMAGES = {
  hero: photo('hero'),
  primi: photo('primi'),
  dolci: photo('dolci-rosa'), // the pavlova, which the film shows first
  antipasti: photo('antipasti'),
  dalForno: photo('dal-forno'),
  alBar: photo('al-bar'),
  secondi: photo('secondi'),
  aperitivo: photo('aperitivo'),
  dolciRosa: photo('dolci'),
  // Menu hover photos, one per dish: three-quarter view on a tablecloth or marble, soft daylight.
  burrata: photo('burrata'),
  arancini: photo('arancini'),
  carpaccio: photo('carpaccio'),
  polpo: photo('polpo'),
  zuppa: photo('zuppa'),
  antipasto: photo('antipasto'),
  tagliatelle: photo('tagliatelle'),
  cacioEPepe: photo('cacio-e-pepe'),
  risotto: photo('risotto'),
  branzino: photo('branzino'),
  pollo: photo('pollo'),
  bistecca: photo('bistecca'),
  melanzane: photo('melanzane'),
  tiramisu: photo('tiramisu'),
  pannaCotta: photo('panna-cotta'),
  cannoli: photo('cannoli'),
  torta: photo('torta'),
  affogato: photo('affogato'),
};
\`\`\`

## src/components/osteria-lume/MenuGroup.jsx
\`\`\`jsx
import Reveal from './Reveal';

function MenuRow({ item, active, onHover }) {
  return (
    <div data-dish={item.name} onMouseOver={(e) => onHover(item, e)} className="h-[max(61.33px,4.791vw)] cursor-default max-[768px]:h-auto max-[768px]:border-b max-[768px]:border-dotted max-[768px]:border-[var(--ui-rule)] max-[768px]:pb-[14px] max-[768px]:pt-[16px]">
      <div className="flex h-[max(20px,1.562vw)] items-center text-[max(14.67px,1.146vw)] leading-none max-[768px]:h-auto max-[768px]:items-baseline max-[768px]:text-[17px]">
        <span className={\`relative -mx-[max(9px,0.703vw)] px-[max(9px,0.703vw)] py-[max(4.67px,0.364vw)] transition-colors duration-[250ms] \${active ? 'text-[var(--ui-paper)]' : ''}\`}>
          <span className={\`absolute inset-0 origin-left rounded-full bg-[var(--ui-ink)] transition-transform duration-[250ms] \${active ? 'scale-x-100' : 'scale-x-0'}\`} />
          <span className="relative">{item.name}</span>
        </span>
        <span className="mx-[max(8px,0.625vw)] h-0 min-w-[max(16px,1.25vw)] flex-1 translate-y-[1px] border-t border-dotted border-[var(--ui-rule)]" />
        <span className="w-[max(33px,2.578vw)] text-right">{item.price}</span>
      </div>
      <p className="mt-[max(4px,0.312vw)] max-w-[90%] text-[max(10.67px,0.833vw)] normal-case leading-[1.3] max-[768px]:mt-[6px] max-[768px]:max-w-none max-[768px]:text-[14px]">{item.description}</p>
    </div>
  );
}

export default function MenuGroup({ title, items, active, onHover, className = '' }) {
  return (
    <Reveal className={className}>
      <h3 className="ol-serif ol-m-sans mb-[max(22px,1.718vw)] text-[max(41.3px,3.226vw)] leading-none max-[768px]:mb-0 max-[768px]:border-b max-[768px]:border-dotted max-[768px]:border-[var(--ui-ink)] max-[768px]:pb-[10px] max-[768px]:text-[18px]">{title}</h3>
      {items.map((item) => <MenuRow key={item.id} item={item} active={active === item.id} onHover={onHover} />)}
    </Reveal>
  );
}
\`\`\`

## src/components/osteria-lume/MenuSection.jsx
\`\`\`jsx
import { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import MenuGroup from './MenuGroup';
import Pill from './Pill';
import Photo from './Photo';
import Reveal from './Reveal';
import { useIsPhone } from './useIsPhone';

export default function MenuSection({ items, status, onRetry }) {
  const ref = useRef(null);
  const [hover, setHover] = useState(null);
  const phone = useIsPhone();
  const k = typeof window === 'undefined' ? 1 : Math.max(1, window.innerWidth / 1280); // the photo grows with the window from 1280px
  const at = (e) => {
    const box = ref.current.getBoundingClientRect();
    return { x: e.clientX - box.left, y: e.clientY - box.top };
  };
  // Each dish's photo pops up where the pointer entered its row and stays put there; it tilts away from its column.
  const group = (title, tilt, className) => (
    <MenuGroup title={title} items={items.filter((i) => i.group === title)} active={hover?.item.id} className={className}
      onHover={(item, e) => !phone && setHover((h) => (h?.item.id === item.id ? h : { item, tilt, ...at(e) }))} />
  );

  const note = status === 'loading' ? 'Loading the menu…' : status === 'error' ? 'We couldn’t load the menu.' : !items.length && 'The menu is coming soon.';

  return (
    <section id="menu" ref={ref}
      className="relative border-t border-dotted border-[var(--ui-ink)] px-[max(80px,6.25vw)] pb-[max(125px,9.765vw)] pt-[max(70px,5.468vw)] max-[768px]:scroll-mt-[110px] max-[768px]:px-[20px] max-[768px]:py-[64px]">
      <Reveal className="flex items-baseline gap-[max(25px,1.953vw)] max-[768px]:flex-col max-[768px]:gap-[12px]">
        <h2 className="ol-serif text-[max(73.3px,5.726vw)] leading-none max-[768px]:text-[58px]">The Menu</h2>
        <span className="text-[max(10px,0.781vw)] leading-none max-[768px]:text-[13px]">Served daily · Prices in euro</span>
      </Reveal>
      {note && (
        <div role={status === 'error' ? 'alert' : 'status'} className="mt-[max(40px,3.125vw)] flex min-h-[max(240px,18.75vw)] flex-col items-start gap-[max(18px,1.406vw)] text-[max(14.67px,1.146vw)] max-[768px]:text-[17px]">
          {note}
          {status === 'error' && <Pill onClick={onRetry} className="h-[max(32px,2.5vw)] px-[max(20px,1.562vw)] text-[max(12px,0.937vw)] max-[768px]:h-[46px] max-[768px]:text-[15px]">Try again</Pill>}
        </div>
      )}
      <div className={\`mt-[max(20px,1.562vw)] grid grid-cols-[repeat(2,minmax(0,max(500px,39.062vw)))] gap-x-[max(53px,4.14vw)] max-[768px]:mt-[40px] max-[768px]:grid-cols-1 max-[768px]:gap-y-[48px] \${note ? 'hidden' : ''}\`} onMouseLeave={() => setHover(null)}>
        {/* Phones run one column: Starters, Mains, Desserts. */}
        <div className="max-[768px]:contents">
          {group('Starters', 3)}
          {group('Desserts', 3, 'mt-[max(30px,2.343vw)] max-[768px]:order-last max-[768px]:mt-0')}
        </div>
        {group('Mains', -3)}
      </div>
      <AnimatePresence>
        {hover && (
          <motion.div key={hover.item.id} initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1, rotate: hover.tilt }} exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.25 }} style={{ left: hover.x - 73 * k, top: hover.y - 92 * k }}
            className="ol-dish-shadow pointer-events-none absolute z-10 h-[max(183px,14.296vw)] w-[max(147px,11.484vw)] overflow-hidden rounded-[max(3px,0.234vw)] max-[768px]:hidden">
            <Photo src={hover.item.image} alt={hover.item.name} className="h-full w-full" />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
\`\`\`

## src/components/osteria-lume/MobileHeader.jsx
\`\`\`jsx
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import Pill from './Pill';
import { NAV } from './content';

/** The phone header: over the hero it is transparent; past it, paper with the book strip under it. */
export default function MobileHeader({ past, onNav, onBook }) {
  const [open, setOpen] = useState(false);
  const solid = past || open;
  const go = (id) => { setOpen(false); onNav(id); };

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <div className="fixed inset-x-0 top-0 z-20 min-[769px]:hidden">
      <header className={\`flex h-[calc(52px+env(safe-area-inset-top))] items-center justify-between pl-[20px] pr-[8px] pt-[env(safe-area-inset-top)] transition-colors duration-[240ms] \${solid ? 'border-b border-dotted border-[var(--ui-ink)] bg-[var(--ui-paper)] text-[var(--ui-ink)]' : 'text-[var(--ui-photo-ink)]'}\`}>
        <span className={\`ol-serif text-[22px] leading-none \${solid ? '' : 'ol-photo-text'}\`}>Osteria Lume</span>
        <button type="button" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} onClick={() => setOpen(!open)}
          className="flex h-[44px] w-[44px] items-center justify-center">
          <span className={\`flex h-[30px] w-[30px] items-center justify-center rounded-full border transition-colors duration-[240ms] \${solid ? 'border-[var(--ui-ink)]' : 'border-[var(--ui-photo-ink)] bg-[var(--ui-photo-scrim)]'}\`}>
            {open ? <X size={14} strokeWidth={1.5} /> : <Menu size={14} strokeWidth={1.5} />}
          </span>
        </button>
      </header>
      <AnimatePresence initial={false}>
        {open ? (
          <motion.nav key="nav" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.24 }}
            className="border-b border-dotted border-[var(--ui-ink)] bg-[var(--ui-paper)] px-[20px]">
            {NAV.map((n) => (
              <button key={n.id} type="button" onClick={() => go(n.id)}
                className="flex h-[52px] w-full items-center border-b border-dotted border-[var(--ui-rule)] text-left last:border-0 text-[15px] uppercase tracking-[0.06em]">{n.label}</button>
            ))}
          </motion.nav>
        ) : past && (
          <motion.div key="book" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.24 }}
            className="flex items-center justify-between gap-[12px] border-b border-dotted border-[var(--ui-ink)] bg-[var(--ui-paper)] px-[20px] py-[10px]">
            <span className="truncate text-[13px] leading-[1.3] tracking-[0.06em]">Tue – Sun · Via Ferrara 12</span>
            <Pill onClick={onBook} className="h-[38px] px-[18px] text-[14px]">Book a table</Pill>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
\`\`\`

## src/components/osteria-lume/osteria-lume.css
\`\`\`css
@font-face{font-family:"Ogg";font-style:italic;font-weight:400;font-display:swap;src:url(https://media.base44.com/files/public/builder-assets/wix-fonts/ogg-400-italic.woff2) format("woff2")}
@font-face{font-family:"Univers LT Std";font-weight:400;font-display:swap;src:url(https://media.base44.com/files/public/builder-assets/wix-fonts/univers-lt-std-400-normal.woff2) format("woff2")}
@font-face{font-family:"Univers LT Std";font-weight:700;font-display:swap;src:url(https://media.base44.com/files/public/builder-assets/wix-fonts/univers-lt-std-700-normal.woff2) format("woff2")}

/* The look: ink, deep, paper, rule, card (--swatch-1..5), plus the colours of text set on photos. */
:root{
  --swatch-1:#823513;--swatch-1-ink:#FFFFFF;
  --swatch-2:#281006;--swatch-2-ink:#FFFFFF;
  --swatch-3:#F3ECE1;--swatch-3-ink:#111111;
  --swatch-4:#B07A55;--swatch-4-ink:#111111;
  --swatch-5:#E8DCC9;--swatch-5-ink:#111111;
  --ui-ink:var(--swatch-1);--ui-deep:var(--swatch-2);--ui-paper:var(--swatch-3);--ui-rule:var(--swatch-4);--ui-ph:var(--swatch-5);
  --ui-photo-ink:#FFFFFF;--ui-photo-pill-ink:#1A120C;--ui-shadow:rgba(0,0,0,.45);--ui-photo-scrim:rgba(20,12,8,.45);--ui-hero-photo:none;
}
/* gallery-look */

.ol{font-family:"Univers LT Std","Arial Narrow",Arial,sans-serif;text-transform:uppercase;color:var(--ui-ink);background:var(--ui-paper);-webkit-font-smoothing:antialiased;scrollbar-width:none}
.ol::-webkit-scrollbar{display:none}
.ol :focus-visible{outline:2px solid var(--ui-ink);outline-offset:3px}
.ol-serif{font-family:"Ogg",Georgia,serif;font-style:italic;font-weight:400;letter-spacing:-0.015em;text-transform:none}
.ol-vertical{writing-mode:vertical-rl;transform:rotate(180deg)}
.ol-hero-shade{background:linear-gradient(180deg,color-mix(in srgb,var(--ui-deep) 35%,transparent) 0%,color-mix(in srgb,var(--ui-deep) 15%,transparent) 45%,color-mix(in srgb,var(--ui-deep) 50%,transparent) 100%)}
.ol-photo-text{text-shadow:0 2px 30px var(--ui-shadow)}
.ol-dish-shadow{box-shadow:0 20px 40px color-mix(in srgb,var(--ui-deep) 25%,transparent)}
.ol-backdrop{background:color-mix(in srgb,var(--ui-deep) 55%,transparent)}

.ol-marquee{animation:ol-marquee linear infinite}
.ol-strip:hover .ol-marquee{animation-play-state:paused}
@keyframes ol-marquee{from{transform:translate3d(-50%,0,0)}to{transform:translate3d(0,0,0)}}
@media (prefers-reduced-motion:reduce){.ol-marquee{animation:none}}

/* Phones (≤768px): group headings switch to the sans. */
@media (max-width:768px){
  .ol-serif.ol-m-sans{font-family:"Univers LT Std","Arial Narrow",Arial,sans-serif;font-style:normal;font-weight:700;letter-spacing:0;text-transform:uppercase}
}
\`\`\`

## src/components/osteria-lume/Photo.jsx
\`\`\`jsx
/** The photo, or a placeholder block of the same size until one is supplied. */
export default function Photo({ src, alt, eager = false, className = '' }) {
  return src
    ? <img src={src} alt={alt} loading={eager ? 'eager' : 'lazy'} className={\`object-cover \${className}\`} />
    : <div role="img" aria-label={alt} className={\`bg-[var(--ui-ph)] \${className}\`} />;
}
\`\`\`

## src/components/osteria-lume/Pill.jsx
\`\`\`jsx
const VARIANTS = {
  filled: 'bg-[var(--ui-ink)] text-[var(--ui-paper)] hover:opacity-90',
  outline: 'border border-[var(--ui-ink)] text-[var(--ui-ink)] hover:bg-[var(--ui-ink)] hover:text-[var(--ui-paper)]',
  inverse: 'bg-[var(--ui-paper)] text-[var(--ui-ink)] hover:opacity-90',
  photo: 'bg-[var(--ui-photo-ink)] text-[var(--ui-photo-pill-ink)] hover:opacity-90',
  photoOutline: 'border border-[var(--ui-photo-ink)] text-[var(--ui-photo-ink)] hover:bg-[var(--ui-photo-ink)] hover:text-[var(--ui-photo-pill-ink)]',
};

export default function Pill({ variant = 'filled', href, className = '', children, ...props }) {
  const cls = \`inline-flex flex-none items-center justify-center whitespace-nowrap rounded-full uppercase leading-none transition-[background-color,color,opacity] duration-[180ms] \${VARIANTS[variant]} \${className}\`;
  // The label drops 0.1em: Univers sits high in its line box.
  const label = <span className="translate-y-[0.1em]">{children}</span>;
  return href
    ? <a href={href} target="_blank" rel="noreferrer" className={cls} {...props}>{label}</a>
    : <button type="button" className={cls} {...props}>{label}</button>;
}
\`\`\`

## src/components/osteria-lume/Rail.jsx
\`\`\`jsx
import { motion } from 'framer-motion';
import Pill from './Pill';
import { NAV } from './content';

/** The header once the hero has scrolled away: a slim rail down the right edge. Above 1280×720 it grows with the
 *  smaller of width and height, so a wide, short screen can't push the nav into the Book button. */
export default function Rail({ shown, onNav, onBook }) {
  return (
    <motion.aside initial={false} animate={{ x: shown ? 0 : '100%' }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-y-0 right-0 z-20 w-[max(64px,min(5vw,8.888vh))] max-[768px]:hidden border-l border-dotted border-[var(--ui-ink)] bg-[var(--ui-paper)]">
      <span className="ol-serif ol-vertical absolute left-[max(20px,min(1.562vw,2.777vh))] top-[max(31px,min(2.421vw,4.305vh))] text-[max(24px,min(1.875vw,3.333vh))] leading-none">Osteria Lume</span>
      <nav className="absolute left-[max(16px,min(1.25vw,2.222vh))] top-[38.5%] flex flex-col gap-[max(6.7px,min(0.523vw,0.93vh))]">
        {NAV.map((n) => (
          <Pill key={n.id} variant="outline" onClick={() => onNav(n.id)} className="ol-vertical w-[max(30.7px,min(2.398vw,4.263vh))] text-[max(9.3px,min(0.726vw,1.291vh))]" style={{ height: \`max(\${n.h}px, min(\${n.h / 12.8}vw, \${Math.floor((n.h / 7.2) * 1000) / 1000}vh))\` }}>{n.label}</Pill>
        ))}
      </nav>
      <Pill onClick={onBook} className="ol-vertical absolute bottom-[max(32px,min(2.5vw,4.444vh))] left-[max(16px,min(1.25vw,2.222vh))] h-[max(108px,min(8.437vw,15.0vh))] w-[max(30.7px,min(2.398vw,4.263vh))] text-[max(9.3px,min(0.726vw,1.291vh))]">Book a table</Pill>
    </motion.aside>
  );
}
\`\`\`

## src/components/osteria-lume/ReservationModal.jsx
\`\`\`jsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import Pill from './Pill';
import { PHONE } from './content';
import { MAX_GUESTS, closedReason, firstOpenDay, isoDay, restaurantNow, slotsOn } from './booking';

const FIELDS = [['Name', 'name', 'text'], ['Guests', 'guests', 'number'], ['Date', 'date', 'date'], ['Time', 'time', 'time'], ['Phone', 'phone', 'tel']];
const INPUT = 'mt-[max(6px,0.468vw)] h-[max(40px,3.125vw)] w-full min-w-0 max-[768px]:h-11 border-b border-dotted border-[var(--ui-ink)] bg-transparent text-[max(16px,1.25vw)] normal-case text-[var(--ui-ink)] outline-none';
// Keeps the picked time when the new day offers it, else the evening slot nearest 19:30.
const REFUSED = { full: 'That time is fully booked. Please pick another.', duplicate: 'This phone number already has a table at that time.', closed: 'We can’t seat you at that time. Please pick another.' };
const timeFor = (slots, time) => (slots.includes(time) ? time : slots.find((t) => t >= '19:30') ?? slots.at(-1) ?? '');

export default function ReservationModal({ onClose, onSave }) {
  const [form, setForm] = useState(() => {
    const date = firstOpenDay() ?? isoDay(restaurantNow());
    return { name: '', guests: '2', date, time: timeFor(slotsOn(date), '19:30'), phone: '' };
  });
  const [saving, setSaving] = useState(false);
  const [booked, setBooked] = useState(null);
  const [failed, setFailed] = useState(false);
  const [refused, setRefused] = useState(null);
  const slots = slotsOn(form.date);
  const guests = Number(form.guests);
  const valid = form.name.trim() && Number.isInteger(guests) && guests >= 1 && guests <= MAX_GUESTS && slots.includes(form.time) && form.phone.trim();
  const set = (key, value) => {
    setRefused(null);
    setForm((f) => (key === 'date' ? { ...f, date: value, time: timeFor(slotsOn(value), f.time) } : { ...f, [key]: value }));
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!valid || saving) return;
    setSaving(true);
    setFailed(false);
    try {
      const request = { ...form, name: form.name.trim(), phone: form.phone.trim(), guests };
      const { status } = await onSave(request);
      if (status === 'booked') setBooked(request);
      else setRefused(status);
    } catch {
      setFailed(true);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="ol-backdrop fixed inset-0 z-30 flex items-center justify-center" onClick={onClose} onKeyDown={(e) => e.key === 'Escape' && onClose()}>
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} onClick={(e) => e.stopPropagation()}
        role="dialog" aria-modal="true" aria-label="Book a table" className="max-h-[calc(100dvh-32px)] w-[max(440px,34.375vw)] overflow-y-auto rounded-[6px] bg-[var(--ui-paper)] p-[max(32px,2.5vw)] max-[768px]:w-[calc(100vw-32px)] max-[768px]:max-w-[440px] max-[768px]:p-6">
        {booked ? (
          <>
            <h3 className="ol-serif text-[max(48px,3.75vw)] leading-none">Grazie.</h3>
            <p className="mt-[max(20px,1.562vw)] text-[max(14px,1.093vw)] leading-[1.4]">
              A table for {booked.guests} on {format(new Date(\`\${booked.date}T00:00:00\`), 'EEE d MMM')} at {booked.time}. We’ll call {booked.phone} if anything changes.
            </p>
            <Pill onClick={onClose} className="mt-[max(28px,2.187vw)] h-[max(38px,2.968vw)] px-[max(24px,1.875vw)] text-[max(14px,1.093vw)] max-[768px]:h-[46px]">Close</Pill>
          </>
        ) : (
          <form onSubmit={submit}>
            <h3 className="ol-serif text-[max(48px,3.75vw)] leading-none">Book a table</h3>
            <div className="mt-[max(24px,1.875vw)] grid grid-cols-2 gap-x-[max(20px,1.562vw)] gap-y-[max(16px,1.25vw)]">
              {FIELDS.map(([label, key, type]) => (
                <label key={key} className={\`block text-[max(11px,0.859vw)] tracking-[0.04em] \${key === 'name' || key === 'phone' ? 'col-span-2' : ''}\`}>{label}
                  {key === 'time' ? (
                    <select required value={form.time} disabled={!slots.length} onChange={(e) => set('time', e.target.value)} className={INPUT}>
                      {slots.length ? slots.map((t) => <option key={t} value={t}>{t}</option>) : <option value="">—</option>}
                    </select>
                  ) : (
                    <input type={type} min={type === 'number' ? 1 : type === 'date' ? isoDay(restaurantNow()) : undefined} max={type === 'number' ? MAX_GUESTS : undefined} step={type === 'number' ? 1 : undefined}
                      required value={form[key]} onChange={(e) => set(key, e.target.value)} className={INPUT} />
                  )}
                </label>
              ))}
            </div>
            {!slots.length && <p role="status" className="mt-[max(16px,1.25vw)] text-[max(13px,1.015vw)]">{closedReason(form.date)}</p>}
            {guests > MAX_GUESTS && <p role="status" className="mt-[max(16px,1.25vw)] text-[max(13px,1.015vw)]">For more than {MAX_GUESTS} guests, please call us on {PHONE}.</p>}
            {refused && <p role="alert" className="mt-[max(16px,1.25vw)] text-[max(13px,1.015vw)]">{REFUSED[refused]}</p>}
            {failed && <p role="alert" className="mt-[max(20px,1.562vw)] text-[max(13px,1.015vw)]">We couldn’t send your request. Please try again, or call us on {PHONE}.</p>}
            <div className="mt-[max(28px,2.187vw)] flex items-center justify-between">
              <button type="button" onClick={onClose} className="text-[max(13px,1.015vw)] uppercase max-[768px]:min-h-[44px] max-[768px]:pr-4">Cancel</button>
              <Pill type="submit" disabled={!valid || saving} className="h-[max(38px,2.968vw)] px-[max(24px,1.875vw)] text-[max(14px,1.093vw)] disabled:opacity-40 max-[768px]:h-[46px]">Request table</Pill>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
}
\`\`\`

## src/components/osteria-lume/Reveal.jsx
\`\`\`jsx
import { motion } from 'framer-motion';

/** Fades and slides its content in the first time it scrolls into view. */
export default function Reveal({ as = 'div', x = 0, y = 24, delay = 0, amount = 0.1, className = '', children }) {
  const Tag = motion[as];
  return (
    <Tag initial={{ opacity: 0, x, y }} whileInView={{ opacity: 1, x: 0, y: 0 }} viewport={{ once: true, amount }}
      transition={{ duration: 0.6, delay, ease: [0.215, 0.61, 0.355, 1] }} className={className}>
      {children}
    </Tag>
  );
}
\`\`\`

## src/components/osteria-lume/seed.js
\`\`\`js
import { base44 } from '@/api/base44Client';

const byAge = (a, b) => (a.created_date ?? '').localeCompare(b.created_date ?? '') || String(a.id).localeCompare(String(b.id));

/**
 * Loads each table, adding its samples once, for a new app. The SiteSetup row is written only after
 * every sample is saved: a reload mid-seed adds just the missing ones (matched on \`key\`), and a table
 * the user later empties stays empty.
 */
export async function loadSeeded(tables) {
  const [setup] = await base44.entities.SiteSetup.list();
  const loaded = {};
  for (const [name, { sort }] of Object.entries(tables)) loaded[name] = await base44.entities[name].list(sort, 1000);
  if (setup) return loaded;
  // Only an admin may write the samples: anyone else arriving before the owner's first visit sees them unsaved.
  const me = await base44.auth.me().catch(() => null);
  if (me?.role !== 'admin') {
    for (const [name, { samples }] of Object.entries(tables)) if (!loaded[name].length) loaded[name] = samples.map((s, i) => ({ id: \`sample-\${i + 1}\`, ...s }));
    return loaded;
  }
  try {
    for (const [name, { samples, key, sort }] of Object.entries(tables)) {
      const entity = base44.entities[name];
      // A table holding rows the app didn't mark was filled by the builder (or the user): it isn't ours to seed.
      const missing = loaded[name].some((r) => !r.sample) ? [] : samples.filter((s) => !loaded[name].some((r) => r[key] === s[key]));
      // One request per table: entity calls are rate-limited per app.
      if (missing.length) await entity.bulkCreate(missing.map((s) => ({ ...s, sample: true })));
      const rows = missing.length ? await entity.list(sort, 1000) : loaded[name];
      // Two first loads at once (a second tab) can both add the samples: the oldest copy of each stays. Only rows
      // marked \`sample\` are dropped, and every load before setup runs this, so a failed delete is retried.
      const seen = new Set();
      const extra = rows.filter((r) => r.sample).sort(byAge).filter((r) => seen.has(r[key]) || !seen.add(r[key]));
      if (extra.length) await entity.deleteMany({ id: { $in: extra.map((r) => r.id) } });
      loaded[name] = rows.filter((r) => !extra.includes(r));
    }
    await base44.entities.SiteSetup.create({ set_up: true });
  } catch {
    // A failed seed leaves the site unset: the next admin visit adds what's missing and drops the copies.
  }
  return loaded;
}
\`\`\`

## src/components/osteria-lume/useFitText.js
\`\`\`js
import { useLayoutEffect, useRef } from 'react';

/** A one-line name too long for its box shrinks until it fits: a built app can be called anything. */
export function useFitText() {
  const ref = useRef(null);
  useLayoutEffect(() => {
    const el = ref.current;
    const fit = () => {
      el.style.fontSize = '';
      const over = el.scrollWidth / el.clientWidth;
      if (over > 1) el.style.fontSize = \`\${parseFloat(getComputedStyle(el).fontSize) / over}px\`;
    };
    fit();
    document.fonts?.ready.then(fit);
    window.addEventListener('resize', fit);
    return () => window.removeEventListener('resize', fit);
  }, []);
  return ref;
}
\`\`\`

## src/components/osteria-lume/useIsPhone.js
\`\`\`js
import { useEffect, useState } from 'react';

const QUERY = '(max-width: 768px)';

/** True at phone widths, where the header stays on top instead of becoming the side rail. */
export function useIsPhone() {
  const [phone, setPhone] = useState(() => typeof window !== 'undefined' && window.matchMedia(QUERY).matches);
  useEffect(() => {
    const mq = window.matchMedia(QUERY);
    const on = () => setPhone(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return phone;
}
\`\`\`

## src/components/osteria-lume/useOsteria.js
\`\`\`js
import { useCallback, useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { SEED_MENU } from './content';
import { loadSeeded } from './seed';

export function useOsteria() {
  const [menu, setMenu] = useState([]);
  const [status, setStatus] = useState('loading');

  const load = useCallback(async () => {
    setStatus('loading');
    try {
      const samples = SEED_MENU.map((item, position) => ({ ...item, position }));
      const { MenuItem } = await loadSeeded({ MenuItem: { samples, key: 'name', sort: 'position' } });
      setMenu([...MenuItem].sort((a, b) => (a.position ?? 0) - (b.position ?? 0)));
      setStatus('ready');
    } catch {
      setStatus('error');
    }
  }, []);
  useEffect(() => { load(); }, [load]);

  return {
    menu,
    status,
    reload: load,
    // Bookings are private to each guest (rls), so the room check runs server-side.
    book: async (reservation) => (await base44.functions.invoke('bookTable', reservation)).data,
  };
}
\`\`\`

## src/pages/OsteriaLume.jsx
\`\`\`jsx
import { useEffect, useState } from 'react';
import { MotionConfig } from 'framer-motion';
import '@/components/osteria-lume/osteria-lume.css';
import Hero from '@/components/osteria-lume/Hero';
import Rail from '@/components/osteria-lume/Rail';
import MobileHeader from '@/components/osteria-lume/MobileHeader';
import MenuSection from '@/components/osteria-lume/MenuSection';
import Gallery from '@/components/osteria-lume/Gallery';
import Hours from '@/components/osteria-lume/Hours';
import Footer from '@/components/osteria-lume/Footer';
import ReservationModal from '@/components/osteria-lume/ReservationModal';
import { useOsteria } from '@/components/osteria-lume/useOsteria';

export default function OsteriaLume() {
  const { menu, status, reload, book } = useOsteria();
  const [rail, setRail] = useState(false);
  const [past, setPast] = useState(false);
  const [booking, setBooking] = useState(false);
  const go = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  const openBooking = () => setBooking(true);
  const onScroll = (e) => {
    const { scrollTop, clientHeight } = e.currentTarget;
    setRail(scrollTop > clientHeight / 2);
    setPast(scrollTop > clientHeight - 60); // the phone header's height: the hero has gone under it
  };

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && setBooking(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <div data-scroll onScroll={onScroll}
        className="ol relative h-screen overflow-y-auto max-[768px]:h-[100dvh] overflow-x-hidden">
        <Hero onNav={go} onBook={openBooking} />
        <div className="mr-[max(64px,min(5vw,8.888vh))] max-[768px]:mr-0">
          <MenuSection items={menu} status={status} onRetry={reload} />
          <Gallery />
          <Hours onBook={openBooking} />
          <Footer onBook={openBooking} />
        </div>
        <MobileHeader past={past} onNav={go} onBook={openBooking} />
        <Rail shown={rail} onNav={go} onBook={openBooking} />
        {booking && <ReservationModal onClose={() => setBooking(false)} onSave={book} />}
      </div>
    </MotionConfig>
  );
}
\`\`\`
`;export{e as default};