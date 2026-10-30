var e=`# real_estate_listings — app files

## base44/entities/Inquiry.jsonc
\`\`\`json
{"name":"Inquiry","type":"object","properties":{"name":{"type":"string"},"email":{"type":"string","format":"email"},"message":{"type":"string"},"listingId":{"type":"string"},"createdAt":{"type":"string","format":"date-time"}},"required":["name","email","message","listingId"],"rls":{"create":{},"read":{"$or":[{"created_by_id":"{{user.id}}"},{"user_condition":{"role":"admin"}}]},"update":{"user_condition":{"role":"admin"}},"delete":{"user_condition":{"role":"admin"}}}}
\`\`\`

## base44/entities/Listing.jsonc
\`\`\`json
{"name":"Listing","type":"object","properties":{"price":{"type":"number"},"address":{"type":"string"},"neighbourhood":{"type":"string"},"locality":{"type":"string","description":"Second line of the detail heading, e.g. Pacific Palisades, LA"},"bedrooms":{"type":"number"},"bathrooms":{"type":"number"},"sqft":{"type":"number"},"description":{"type":"string"},"heroImage":{"type":"string","format":"uri"},"gallery":{"type":"array","items":{"type":"string","format":"uri"},"maxItems":4},"sort_order":{"type":"number"},"sample":{"type":"boolean","description":"A sample row the app added on its first load"}},"required":["price","address","neighbourhood","bedrooms","bathrooms","sqft"],"rls":{"read":{},"create":{"user_condition":{"role":"admin"}},"update":{"user_condition":{"role":"admin"}},"delete":{"user_condition":{"role":"admin"}}}}
\`\`\`

## base44/entities/SiteSetup.jsonc
\`\`\`json
{"name":"SiteSetup","type":"object","properties":{"set_up":{"type":"boolean","default":true}},"required":["set_up"],"rls":{"read":{},"create":{"user_condition":{"role":"admin"}},"update":{"user_condition":{"role":"admin"}},"delete":{"user_condition":{"role":"admin"}}}}
\`\`\`

## src/components/real-estate/data.js
\`\`\`js
import { IMAGES } from './images';

// [price, address, neighbourhood, bedrooms, bathrooms, sqft, description]
const SEED = [
  [2450000, '142 Willow Street', 'Brooklyn Heights', 3, 2, 2140, 'An 1840s brick townhouse on a quiet, tree-lined block, with original mouldings, a planted garden and a parlour floor that runs front to back.'],
  [1875000, '88 Cranberry Street, #4', 'Brooklyn Heights', 2, 2, 1460, 'A light-filled top-floor apartment a block from the Promenade, with oak floors, an open kitchen and views over the rooftops to the harbour.'],
  [2780000, '7 Garden Place', 'Brooklyn Heights', 3, 3, 2420, 'A carriage house on one of the neighbourhood\\'s prettiest lanes, rebuilt in 2022 with a double-height living room and a private courtyard.'],
  [3200000, '271 Carlton Avenue', 'Fort Greene', 4, 3, 3010, 'A brownstone across from the park, restored with a glass-and-stone extension, a chef\\'s kitchen and a terrace on every level.'],
  [1295000, '19 South Oxford Street, #2B', 'Fort Greene', 2, 1, 1120, 'A bright corner apartment in a converted mansion, with tall windows, a wood-burning fireplace and the farmers\\' market around the corner.'],
  [1650000, '33 Adelphi Street, #7', 'Fort Greene', 2, 2, 1340, 'A loft-style duplex with exposed brick, a sleeping mezzanine and a shared roof deck looking toward the Manhattan skyline.'],
  [4150000, '512 3rd Street', 'Park Slope', 5, 4, 3860, 'A wide limestone house steps from Prospect Park, with five bedrooms, a finished garden level and a south-facing back garden.'],
  [2095000, '741 President Street', 'Park Slope', 3, 2, 1980, 'A floor-through apartment in a classic brownstone, with a renovated kitchen, a bay-windowed living room and use of the garden.'],
];

export const seedListings = () => SEED.map(([price, address, neighbourhood, bedrooms, bathrooms, sqft, description], i) => ({
  price, address, neighbourhood, bedrooms, bathrooms, sqft,
  locality: \`\${neighbourhood}, Brooklyn\`,
  description,
  heroImage: IMAGES[\`listing\${i + 1}\`],
  gallery: [1, 2, 3, 4].map((n) => IMAGES[\`listing\${i + 1}Gallery\${n}\`]),
  sort_order: i + 1,
}));

export const PRICE_RANGES = [
  { label: 'Any price', min: 0, max: Infinity },
  { label: '$1,000,000 – $2,000,000', min: 1000000, max: 2000000 },
  { label: '$2,000,000 – $3,000,000', min: 2000000, max: 3000000 },
  { label: '$1,000,000 – $4,500,000', min: 1000000, max: 4500000 },
  { label: '$3,000,000+', min: 3000000, max: Infinity },
];
export const DEFAULT_RANGE = 3;

// The staggered grid, card by card (cycling): offset and width as % of its column, top margin and image height in px.
export const LAYOUT = [
  { x: 4.17, w: 85.42, mt: 0, h: 373 },
  { x: 8.33, w: 72.92, mt: 173, h: 313 },
  { x: 25, w: 64.58, mt: 15, h: 280 },
  { x: 4.17, w: 91.67, mt: 0, h: 400 },
  { x: 4.17, w: 66.67, mt: 187, h: 287 },
  { x: 26.04, w: 68.75, mt: 61, h: 307 },
  { x: 14.58, w: 75, mt: 0, h: 440 },
  { x: 10.42, w: 77.08, mt: 160, h: 347 },
];

export const money = (value) => '$' + value.toLocaleString('en-US');
export const specsLine = (l) => \`\${l.bedrooms} bd · \${l.bathrooms} ba · \${l.sqft.toLocaleString('en-US')} sq ft\`;
export const photoAlt = (l) => \`\${l.address}, \${l.neighbourhood}\`;

/** Neighbourhoods in listing order, with their home counts. */
export const neighbourhoodsOf = (listings) => [...new Set(listings.map((l) => l.neighbourhood))]
  .map((name) => ({ name, count: listings.filter((l) => l.neighbourhood === name).length }));
\`\`\`

## src/components/real-estate/Detail.jsx
\`\`\`jsx
import { motion } from 'framer-motion';
import Photo from './Photo';
import InquiryForm from './InquiryForm';
import { money, photoAlt, specsLine } from './data';

export default function Detail({ listing, onBack, onSend }) {
  return (
    <>
      <section className="relative h-screen overflow-hidden text-[var(--ui-on-photo)] max-[899px]:h-[520px]">
        <motion.div initial={{ scale: 1.03 }} animate={{ scale: 1.08 }} transition={{ duration: 3, ease: 'linear' }} className="absolute inset-0">
          <Photo src={listing.heroImage} alt={photoAlt(listing)} />
        </motion.div>
        <div className="absolute inset-0 bg-[var(--ui-veil-detail)]" />
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }} className="absolute inset-x-[max(13px,1.015625vw)] top-[max(12px,0.9375vw)] flex justify-between text-[max(13.5px,1.0546875vw)] max-[899px]:inset-x-[20px] max-[899px]:top-[8px] max-[899px]:items-center max-[899px]:text-[15px]">
          <button type="button" onClick={onBack} className="max-[899px]:h-[44px]">← Back<span className="max-[899px]:hidden"> to listings</span></button>
          <span>{listing.neighbourhood}</span>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }} className="absolute bottom-[max(21px,1.640625vw)] left-[max(12px,0.9375vw)] max-[899px]:inset-x-[20px] max-[899px]:bottom-[24px]">
          <h1 className="whitespace-nowrap text-[12.25vw] font-bold leading-[0.9] tracking-[-0.07em] max-[899px]:text-[clamp(44px,18.5vw,110px)]">{money(listing.price)}</h1>
          <p className="mt-[max(25px,1.953125vw)] text-[max(20px,1.5625vw)] leading-[1.2] opacity-85 max-[899px]:mt-[12px] max-[899px]:text-[15px]">{listing.address} · {specsLine(listing)}</p>
        </motion.div>
      </section>

      <section className="grid grid-cols-[1fr_auto] px-[max(13px,1.015625vw)] pb-[max(20px,1.5625vw)] pt-[max(44px,3.4375vw)] max-[899px]:grid-cols-1 max-[899px]:px-[20px] max-[899px]:pt-[32px]">
        <h2 className="whitespace-nowrap text-[max(69px,5.390625vw)] leading-[1.06] max-[899px]:whitespace-normal max-[899px]:text-[clamp(34px,8.7vw,69px)] max-[899px]:leading-[1.1]">
          → {listing.address}<span className="block text-[var(--ui-label)]">{listing.locality || listing.neighbourhood}</span>
        </h2>
        <p className="mr-[max(14px,1.09375vw)] mt-[max(3px,0.234375vw)] w-[max(373px,29.140625vw)] text-[max(13.5px,1.0546875vw)] leading-[1.5] text-[var(--ui-desc)] max-[899px]:mr-0 max-[899px]:mt-[20px] max-[899px]:w-auto max-[899px]:text-[15px]">{listing.description}</p>
      </section>

      <section className="px-[max(13px,1.015625vw)] pb-[max(27px,2.109375vw)] pt-[max(30px,2.34375vw)] max-[899px]:px-0">
        <p className="mb-[max(16px,1.25vw)] text-[max(12px,0.9375vw)] text-[var(--ui-muted)] max-[899px]:px-[20px]">[Gallery]</p>
        <div className="grid grid-cols-4 gap-[max(13px,1.015625vw)] max-[899px]:flex max-[899px]:gap-[10px] max-[899px]:overflow-x-auto max-[899px]:px-[20px] max-[899px]:[scrollbar-width:none]">
          {(listing.gallery ?? []).map((src, i) => (
            <div key={i} className="h-[max(373px,29.140625vw)] max-[899px]:h-[190px] max-[899px]:w-[150px] max-[899px]:flex-none"><Photo src={src} alt={\`\${photoAlt(listing)}, photo \${i + 1}\`} /></div>
          ))}
        </div>
      </section>

      <InquiryForm key={listing.id} listing={listing} onSend={onSend} />
    </>
  );
}
\`\`\`

## src/components/real-estate/Flight.jsx
\`\`\`jsx
import { motion } from 'framer-motion';
import Photo from './Photo';
import { photoAlt } from './data';
import { MOBILE } from './useMobile';

/** The clicked card's photo growing to fill the screen, handing over to the detail hero. */
export default function Flight({ listing, rect, onDone }) {
  return (
    <motion.div initial={rect} animate={{ top: 0, left: 0, width: window.innerWidth, height: window.matchMedia?.(MOBILE).matches ? 520 : window.innerHeight }}
      transition={{ duration: 0.6, ease: [0.65, 0, 0.35, 1] }} onAnimationComplete={onDone} className="fixed z-50 overflow-hidden">
      <motion.div animate={{ scale: 1.03 }} transition={{ duration: 0.6 }} className="h-full w-full">
        <Photo src={listing.heroImage} alt={photoAlt(listing)} />
      </motion.div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }} className="absolute inset-0 bg-[var(--ui-veil-detail)]" />
    </motion.div>
  );
}
\`\`\`

## src/components/real-estate/Footer.jsx
\`\`\`jsx
import { motion } from 'framer-motion';

const COLUMN = 'flex flex-col gap-[max(8px,0.625vw)] text-[max(13.5px,1.0546875vw)] leading-[1.5]';
const LABEL = 'text-[max(12px,0.9375vw)] text-[var(--ui-muted)]';

export default function Footer() {
  return (
    <footer className="overflow-hidden px-[max(13px,1.015625vw)] pt-[max(52px,4.0625vw)] max-[899px]:px-[20px]">
      <div className="grid grid-cols-[1fr_auto] gap-[max(40px,3.125vw)] pb-[max(40px,3.125vw)] max-[899px]:grid-cols-1">
        <div id="about" className={\`\${COLUMN} max-w-[max(420px,32.8125vw)] text-[var(--ui-desc)]\`}>
          <span className={LABEL}>[About]</span>
          Iris Marlow sells homes across Brooklyn's brownstone neighbourhoods. Twelve years, one client at a time: every listing is walked, priced and photographed in person.
        </div>
        <div id="contact" className={COLUMN}>
          <span className={LABEL}>[Contact]</span>
          <a href="mailto:hello@irismarlow.com" className="underline-offset-4 hover:underline">hello@irismarlow.com</a>
          <a href="tel:+17185550142" className="underline-offset-4 hover:underline">+1 718 555 0142</a>
          <span className="text-[var(--ui-desc)]">214 Dekalb Avenue, Brooklyn, NY</span>
        </div>
      </div>
      <div className="flex justify-between border-b max-[899px]:flex-col max-[899px]:gap-[12px] border-[var(--ui-line)] pb-[max(13px,1.015625vw)] text-[max(13.5px,1.0546875vw)]">
        <span>Iris Marlow, Licensed Real Estate Broker. All rights reserved ©2026</span>
        <span className="flex gap-[max(40px,3.125vw)]"><span>Privacy Policy</span><a href="mailto:hello@irismarlow.com">Contact</a></span>
      </div>
      <motion.p initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, ease: 'easeOut' }}
        className="-ml-[max(5px,0.390625vw)] mt-[max(17px,1.328125vw)] whitespace-nowrap text-[17vw] leading-[0.9] tracking-[-0.02em]">
        Iris Marlow
      </motion.p>
    </footer>
  );
}
\`\`\`

## src/components/real-estate/Hero.jsx
\`\`\`jsx
import Photo from './Photo';
import { IMAGES } from './images';
import MobileNav from './MobileNav';

const NAV = ['Home', 'Listings', 'Neighbourhoods', 'About', 'Contact'];
const WORD = 'absolute whitespace-nowrap text-[16.5vw] leading-[0.9] tracking-[-0.03em] max-[899px]:text-[clamp(56px,21.5vw,148px)]';

export default function Hero({ onNav, children }) {
  return (
    <section className="relative h-screen overflow-hidden text-[var(--ui-on-photo)] max-[899px]:min-h-[640px]">
      <div className="absolute inset-0"><Photo src={IMAGES.hero} alt="Glass-and-stone house above an infinity pool" /></div>
      <div className="absolute inset-0 bg-[var(--ui-veil)]" />
      <nav className="absolute inset-x-[max(13px,1.015625vw)] top-0 flex h-[max(45px,3.515625vw)] items-end justify-between border-b border-[color-mix(in_srgb,var(--ui-on-photo)_50%,transparent)] pb-[max(9px,0.703125vw)] text-[max(13.5px,1.0546875vw)] max-[899px]:hidden">
        {NAV.map((item, i) => (
          <button key={item} type="button" onClick={() => onNav(item)} className="flex items-center">
            {i === 0 && <span className="mr-[max(4px,0.3125vw)] h-[max(5px,0.390625vw)] w-[max(5px,0.390625vw)] rounded-full bg-current" />}{item}
          </button>
        ))}
      </nav>
      <div className="min-[900px]:hidden"><MobileNav items={NAV} onNav={onNav} /></div>
      <h1 aria-label="Iris Marlow">
        <span aria-hidden="true" className={\`\${WORD} left-[max(14px,1.09375vw)] top-[max(62px,4.84375vw)] max-[899px]:left-[16px] max-[899px]:top-[118px]\`}>Iris</span>
        <span aria-hidden="true" className={\`\${WORD} bottom-[max(11px,0.859375vw)] right-[max(17px,1.328125vw)] max-[899px]:bottom-[40px] max-[899px]:right-[16px]\`}>Marlow</span>
      </h1>
      {children}
    </section>
  );
}
\`\`\`

## src/components/real-estate/Home.jsx
\`\`\`jsx
import { useEffect, useState } from 'react';
import { motion, useTransform } from 'framer-motion';
import Hero from './Hero';
import SearchBar from './SearchBar';
import MobileSearch from './MobileSearch';
import Listings from './Listings';
import { DEFAULT_RANGE, PRICE_RANGES, neighbourhoodsOf } from './data';
import { glide, offsetIn } from './scroll';
import { useMobile } from './useMobile';

// The bar shows the clip's range, but nothing is filtered until a visitor presses Search.
export const NEW_SEARCH = { location: null, rangeIdx: DEFAULT_RANGE, applied: 0, place: null, searched: false };

/** The search lives with the page (\`search\`, \`onSearchChange\`), so Back to listings returns to the same results. */
export default function Home({ listings, status, onRetry, scrollRef, scrollY, onOpen, search: { location, rangeIdx, applied, place, searched }, onSearchChange }) {
  const [pending, setPending] = useState(null);
  const Search = useMobile() ? MobileSearch : SearchBar;
  const range = PRICE_RANGES[applied];
  const labelOpacity = useTransform(scrollY, [80, 200], [0, 1]);
  const neighbourhoods = neighbourhoodsOf(listings);
  const matches = (l) => l.price >= range.min && l.price <= range.max && (!place || l.neighbourhood === place);
  // A search with no match gets a notice instead of the groups.
  const empty = status === 'ready' && listings.length > 0 && !listings.some(matches);

  // \`at\`: where the target's top lands, as a share of the viewport height.
  const goTo = (selector, at = 0, options) => {
    const el = scrollRef.current;
    const target = el.querySelector(selector);
    if (target) glide(el, offsetIn(el, target) - el.clientHeight * at, options);
  };
  // Measured once the new results have rendered; the pressed pill reads for a beat before the page moves.
  useEffect(() => {
    if (!pending) return;
    setPending(null);
    const target = empty ? '#listings-notice' : pending.location ? \`[data-group="\${pending.location}"]\` : '#listings';
    goTo(target, pending.location ? 0.12 : 0, { delay: 0.7 });
  }, [pending]);
  const runSearch = () => {
    onSearchChange((s) => ({ ...s, applied: s.rangeIdx, place: s.location, searched: true }));
    setPending({ location });
  };
  const nav = (item) => {
    if (item === 'Home') goTo('section');
    else if (item === 'About' || item === 'Contact') goTo(\`#\${item.toLowerCase()}\`, 0.2);
    else goTo('#listings');
  };
  const edit = (field) => (value) => onSearchChange((s) => ({ ...s, [field]: value, searched: false }));

  return (
    <>
      <div className="pointer-events-none sticky top-0 z-30 h-0">
        <motion.span style={{ opacity: labelOpacity }} className="absolute right-[max(14px,1.09375vw)] top-[max(26px,2.03125vw)] bg-[var(--ui-chip)] px-[max(5px,0.390625vw)] py-[max(2px,0.15625vw)] text-[max(12px,0.9375vw)] text-[var(--ui-muted)]">
          [Listings] {listings.length} homes · {neighbourhoods.length} neighbourhoods
        </motion.span>
      </div>
      <Hero onNav={nav}>
        <Search neighbourhoods={neighbourhoods} location={location} onLocation={edit('location')} rangeIdx={rangeIdx} onRange={edit('rangeIdx')} searched={searched} onSearch={runSearch} />
      </Hero>
      <Listings listings={listings} matches={matches} neighbourhoods={neighbourhoods} status={status} onRetry={onRetry}
        notice={empty && \`No homes\${place ? \` in \${place}\` : ''} in this price range.\`} scrollY={scrollY} onOpen={onOpen} />
    </>
  );
}
\`\`\`

## src/components/real-estate/images.js
\`\`\`js
// Photo URLs; an empty one renders a placeholder block.
const PHOTOS = 'https://media.base44.com/images/public/builder-assets/gallery/real-estate-listings';
const photo = (file) => \`\${PHOTOS}/\${file}.webp\`;

// Modern stone-and-timber homes with Mediterranean planting, shot outdoors in warm late-afternoon sun.
export const IMAGES = {
  hero: photo('hero'),
  listing1: photo('listing1'),
  listing2: photo('listing2'),
  listing3: photo('listing4'),
  listing4: photo('listing3'),
  listing5: photo('listing5'),
  listing6: photo('listing6'),
  listing7: photo('listing7'),
  listing8: photo('listing8'),
  // Each house's four interiors; listing 3 keeps the original set.
  listing1Gallery1: photo('listing1-gallery1'),
  listing1Gallery2: photo('listing1-gallery2'),
  listing1Gallery3: photo('listing1-gallery3'),
  listing1Gallery4: photo('listing1-gallery4'),
  listing2Gallery1: photo('listing2-gallery1'),
  listing2Gallery2: photo('listing2-gallery2'),
  listing2Gallery3: photo('listing2-gallery3'),
  listing2Gallery4: photo('listing2-gallery4'),
  listing3Gallery1: photo('gallery1'),
  listing3Gallery2: photo('gallery2'),
  listing3Gallery3: photo('gallery3'),
  listing3Gallery4: photo('gallery4'),
  listing4Gallery1: photo('listing4-gallery1'),
  listing4Gallery2: photo('listing4-gallery2'),
  listing4Gallery3: photo('listing4-gallery3'),
  listing4Gallery4: photo('listing4-gallery4'),
  listing5Gallery1: photo('listing5-gallery1'),
  listing5Gallery2: photo('listing5-gallery2'),
  listing5Gallery3: photo('listing5-gallery3'),
  listing5Gallery4: photo('listing5-gallery4'),
  listing6Gallery1: photo('listing6-gallery1'),
  listing6Gallery2: photo('listing6-gallery2'),
  listing6Gallery3: photo('listing6-gallery3'),
  listing6Gallery4: photo('listing6-gallery4'),
  listing7Gallery1: photo('listing7-gallery1'),
  listing7Gallery2: photo('listing7-gallery2'),
  listing7Gallery3: photo('listing7-gallery3'),
  listing7Gallery4: photo('listing7-gallery4'),
  listing8Gallery1: photo('listing8-gallery1'),
  listing8Gallery2: photo('listing8-gallery2'),
  listing8Gallery3: photo('listing8-gallery3'),
  listing8Gallery4: photo('listing8-gallery4'),
};
\`\`\`

## src/components/real-estate/InquiryForm.jsx
\`\`\`jsx
import { useState } from 'react';

const Field = ({ label, as: Input = 'input', ...input }) => (
  <label className="block">
    <span className="block text-[max(10px,0.78125vw)] uppercase leading-[max(12px,0.9375vw)] tracking-[0.05em] text-[var(--ui-field-label)]">{label}</span>
    <Input {...input} className={\`mt-[max(7px,0.546875vw)] \${Input === 'input' ? 'h-[max(38px,2.96875vw)]' : 'resize-none'} w-full border-b border-[var(--ui-field-line)] bg-transparent pb-[max(6px,0.46875vw)] text-[max(27px,2.109375vw)] leading-[max(32px,2.5vw)] max-[899px]:text-[24px] outline-none transition-colors placeholder:text-[var(--ui-placeholder)] focus:border-[var(--swatch-2)]\`} />
  </label>
);

export default function InquiryForm({ listing, onSend }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('idle');
  const suggested = \`I'd like to arrange a viewing of \${listing.address}.\`;
  const sent = status === 'sent';

  const submit = async (e) => {
    e.preventDefault();
    if (status === 'sending' || sent) return;
    setStatus('sending');
    try {
      await onSend({ name: name.trim(), email: email.trim(), message: message.trim() || suggested, listingId: listing.id });
      setStatus('sent');
    } catch {
      setStatus('failed');
    }
  };

  return (
    <section className="grid grid-cols-[1fr_max(720px,56.25vw)] pb-[max(53px,4.140625vw)] pl-[max(13px,1.015625vw)] pr-[max(27px,2.109375vw)] pt-[max(40px,3.125vw)] max-[899px]:grid-cols-1 max-[899px]:px-[20px]">
      <p className="mt-[max(12px,0.9375vw)] text-[max(12px,0.9375vw)] text-[var(--ui-muted)] max-[899px]:mb-[16px] max-[899px]:mt-0">[Inquiry]</p>
      <form onSubmit={submit}>
        <h2 data-inquiry className="text-[max(43px,3.359375vw)] leading-[0.9] max-[899px]:text-[40px]">Ask about this home</h2>
        <div className="mt-[max(63px,4.921875vw)] space-y-[max(29px,2.265625vw)] max-[899px]:mt-[48px] max-[899px]:space-y-[33px]">
          <Field label="Name" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" autoComplete="name" />
          <Field label="Email" required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" autoComplete="email" />
          <Field label="Message" as="textarea" rows={3} value={message} onChange={(e) => setMessage(e.target.value)} placeholder={suggested} />
        </div>
        <button type="submit" disabled={status === 'sending'}
          className={\`mt-[max(50px,3.90625vw)] h-[max(55px,4.296875vw)] w-full max-[899px]:h-[64px] border border-[var(--swatch-2)] text-[max(17px,1.328125vw)] transition-colors duration-300 \${sent ? 'bg-[var(--swatch-2)] text-[var(--swatch-1)]' : ''}\`}>
          <span aria-live="polite">{sent ? 'Inquiry sent — Iris will reply within a day' : 'Send inquiry →'}</span>
        </button>
        {status === 'failed' && (
          <p role="alert" className="mt-[max(14px,1.09375vw)] text-[max(15px,1.171875vw)] text-[var(--ui-muted)] max-[899px]:text-[15px]">We couldn’t send your inquiry. Check your connection and try again.</p>
        )}
      </form>
    </section>
  );
}
\`\`\`

## src/components/real-estate/ListingCard.jsx
\`\`\`jsx
import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import Photo from './Photo';
import { money, photoAlt, specsLine } from './data';

// Above 1280px the grid's px sizes grow with the window, like its % widths.
const wide = (px) => \`max(\${px}px, \${px / 12.8}vw)\`;

/** \`mobile\`: a full-width 4:3 card with no hover lift; otherwise placed by \`layout\` in the staggered grid. */
export default function ListingCard({ listing, layout, right, mobile, onOpen }) {
  const [hover, setHover] = useState(false);
  const lifted = hover && !mobile;
  const image = useRef(null);
  const open = () => {
    const { top, left, width, height } = image.current.getBoundingClientRect();
    onOpen(listing, { top, left, width, height });
  };

  return (
    <motion.div initial={{ opacity: 0, y: 53 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, ease: 'easeOut' }}
      style={mobile ? undefined : { marginLeft: \`\${layout.x}%\`, width: \`\${layout.w}%\`, marginTop: wide(layout.mt) }}>
      <motion.button type="button" onClick={open} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
        animate={{ y: lifted ? -12 : 0 }} transition={{ duration: 0.35, ease: 'easeOut' }} className="block w-full text-left">
        <div ref={image} className={\`overflow-hidden \${mobile ? 'aspect-[4/3]' : ''}\`} style={mobile ? undefined : { height: wide(layout.h) }}>
          <motion.div animate={{ scale: lifted ? 1.04 : 1 }} transition={{ duration: 0.5, ease: 'easeOut' }} className="h-full w-full">
            <Photo src={listing.heroImage} alt={photoAlt(listing)} />
          </motion.div>
        </div>
        <div className={\`mt-[max(10px,0.78125vw)] flex items-baseline justify-between max-[899px]:mt-[12px] max-[899px]:gap-[12px] \${right ? 'flex-row-reverse' : ''}\`}>
          <span className="flex-none text-[max(29px,2.265625vw)] font-bold leading-none tracking-[-0.07em] max-[899px]:text-[28px]">{money(listing.price)}</span>
          <span className="text-[max(12px,0.9375vw)] text-[var(--ui-muted)] max-[899px]:text-right max-[899px]:text-[14px]">{listing.address}</span>
        </div>
        <div className={\`mt-[max(7px,0.546875vw)] text-[max(13.5px,1.0546875vw)] text-[var(--ui-muted)] max-[899px]:text-[15px] \${right ? 'text-right' : ''}\`}>{specsLine(listing)}</div>
      </motion.button>
    </motion.div>
  );
}
\`\`\`

## src/components/real-estate/Listings.jsx
\`\`\`jsx
import { motion, useTransform } from 'framer-motion';
import ListingCard from './ListingCard';
import { LAYOUT } from './data';
import { useMobile } from './useMobile';

const NOTE = 'mb-[max(40px,3.125vw)] text-center text-[max(20px,1.5625vw)] text-[var(--ui-muted)] max-[899px]:text-left max-[899px]:text-[17px]';

/** Every listing keeps its place in the staggered grid (\`i\`); a search only hides the ones that don't match. */
export default function Listings({ listings, matches, neighbourhoods, status, onRetry, notice, scrollY, onOpen }) {
  const mobile = useMobile();
  const rotate = useTransform(scrollY, (y) => y / 8);
  const placed = listings.map((listing, i) => ({ listing, i, right: i % 2 === 1 })).filter((c) => matches(c.listing));
  const state = status === 'loading' ? 'Loading homes…' : status === 'error' ? 'We couldn’t load the listings.' : !listings.length ? 'No homes are listed yet.' : null;

  return (
    <section id="listings" className="relative pb-[max(67px,5.234375vw)] pt-[max(76px,5.9375vw)] max-[899px]:px-[20px] max-[899px]:pt-[56px]">
      {!mobile && (
        <div className="pointer-events-none absolute inset-y-0 left-1/2 w-px bg-[var(--ui-line)]">
          <motion.span style={{ rotate }} className="sticky top-[calc(50%-max(4.5px,0.3515625vw))] -ml-[max(4px,0.3125vw)] block h-[max(9px,0.703125vw)] w-[max(9px,0.703125vw)] bg-[var(--swatch-2)]" />
        </div>
      )}
      {(state || notice) && <p id="listings-notice" role={status === 'error' ? 'alert' : 'status'} className={NOTE}>{state || notice}</p>}
      {status === 'error' && (
        <div className="text-center max-[899px]:text-left">
          <button type="button" onClick={onRetry} className="h-[max(44px,3.4375vw)] border border-[var(--swatch-2)] px-[max(24px,1.875vw)] text-[max(16px,1.25vw)]">Try again</button>
        </div>
      )}
      {neighbourhoods.map(({ name }, g) => {
        const cards = placed.filter((c) => c.listing.neighbourhood === name);
        if (!cards.length) return null;
        return (
          <div key={name} className={g ? 'mt-[max(10px,0.78125vw)] max-[899px]:mt-[56px]' : ''}>
            <motion.h2 data-group={name} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
              className="relative text-center text-[max(43px,3.359375vw)] leading-[0.9] max-[899px]:text-left max-[899px]:text-[40px]">
              <span className="bg-[var(--swatch-1)] px-[max(13px,1.015625vw)] max-[899px]:px-0">{name}</span>
            </motion.h2>
            {mobile ? (
              <div className="mt-[24px] flex flex-col gap-[28px]">
                {cards.map(({ listing }) => <ListingCard key={listing.id} listing={listing} mobile onOpen={onOpen} />)}
              </div>
            ) : (
              <div className="mt-[max(34px,2.65625vw)] flex items-start">
                {[false, true].map((right) => (
                  <div key={String(right)} className="w-1/2">
                    {cards.filter((c) => c.right === right).map(({ listing, i }) => (
                      <ListingCard key={listing.id} listing={listing} layout={LAYOUT[i % LAYOUT.length]} right={right} onOpen={onOpen} />
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </section>
  );
}
\`\`\`

## src/components/real-estate/MobileNav.jsx
\`\`\`jsx
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';

export default function MobileNav({ items, onNav }) {
  const [open, setOpen] = useState(false);
  const go = (item) => { setOpen(false); onNav(item); };

  return (
    <>
      <button type="button" aria-label="Open menu" aria-expanded={open} onClick={() => setOpen(true)}
        className="absolute right-[10px] top-[16px] z-20 flex h-[44px] w-[44px] flex-col items-center justify-center gap-[6px]">
        <span className="h-[1.5px] w-[24px] bg-current" /><span className="h-[1.5px] w-[24px] bg-current" />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 flex flex-col justify-center bg-[var(--swatch-1)] px-[20px] text-[var(--swatch-2)]">
            <button type="button" aria-label="Close menu" onClick={() => setOpen(false)} className="absolute right-[10px] top-[16px] flex h-[44px] w-[44px] items-center justify-center">
              <X size={26} strokeWidth={1.5} />
            </button>
            <nav className="flex flex-col items-start">
              {items.map((item) => (
                <button key={item} type="button" onClick={() => go(item)} className="py-[6px] text-[40px] leading-[1.1] tracking-[-0.02em]">{item}</button>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
\`\`\`

## src/components/real-estate/MobileSearch.jsx
\`\`\`jsx
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Home as HouseIcon } from 'lucide-react';
import { PRICE_RANGES } from './data';

function Sheet({ title, rows, onPick, onClose }) {
  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 z-40 bg-[var(--ui-veil)]" />
      <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ duration: 0.3, ease: 'easeOut' }}
        className="fixed inset-x-0 bottom-0 z-50 rounded-t-[24px] border-t border-[var(--ui-ring)] bg-[var(--swatch-3)] pb-[max(16px,env(safe-area-inset-bottom))] pt-[8px] text-[var(--swatch-2)]">
        <p className="px-[24px] py-[12px] text-[11px] uppercase tracking-[0.05em] text-[var(--ui-label)]">{title}</p>
        {rows.map((row, i) => (
          <button key={row.label} type="button" onClick={() => onPick(row.value)}
            className={\`flex h-[56px] w-full items-center justify-between px-[24px] text-[17px] active:bg-[var(--ui-hover)] \${i ? 'border-t border-[var(--ui-hover)]' : ''}\`}>
            {row.label}{row.note && <span className="opacity-50">{row.note}</span>}
          </button>
        ))}
      </motion.div>
    </>
  );
}

const Pill = ({ label, value, dim, onClick }) => (
  <button type="button" onClick={onClick} className="flex h-[64px] w-full flex-col justify-center rounded-[32px] border border-[var(--ui-ring)] bg-[var(--swatch-3)] pl-[24px] text-left">
    <span className="text-[11px] uppercase leading-[13px] tracking-[0.05em] text-[var(--ui-label)]">{label}</span>
    <span className={\`mt-[2px] text-[17px] leading-[22px] \${dim ? 'text-[var(--ui-label)]' : ''}\`}>{value}</span>
  </button>
);

/** The search bar as a stack of pills; the pickers open as bottom sheets. */
export default function MobileSearch({ neighbourhoods, location, onLocation, rangeIdx, onRange, searched, onSearch }) {
  const [open, setOpen] = useState(null);
  const pick = (set) => (value) => { set(value); setOpen(null); };

  return (
    <div className="pointer-events-none absolute inset-0 mx-auto flex max-w-[600px] flex-col justify-center gap-[10px] px-[20px] text-[var(--swatch-2)] [&>*]:pointer-events-auto">
      <span className="relative z-10 mx-auto -mb-[34px] flex h-[72px] w-[72px] items-center justify-center rounded-full bg-[var(--swatch-3)]">
        <span className="flex h-[52px] w-[52px] items-center justify-center rounded-full bg-[var(--swatch-2)] text-[var(--swatch-1)]"><HouseIcon size={22} strokeWidth={2} /></span>
      </span>
      <Pill label="Location" value={location ?? 'Any neighbourhood'} dim={!location} onClick={() => setOpen('location')} />
      <Pill label="Price range" value={PRICE_RANGES[rangeIdx].label} onClick={() => setOpen('price')} />
      <button type="button" onClick={onSearch}
        className={\`h-[64px] w-full rounded-[32px] border text-[18px] font-medium transition-colors duration-200 \${searched ? 'border-transparent bg-[var(--swatch-2)] text-[var(--swatch-1)]' : 'border-[var(--swatch-2)] bg-[var(--swatch-3)]'}\`}>
        Search →
      </button>
      <AnimatePresence>
        {open === 'location' && (
          <Sheet key="location" title="Location" onClose={() => setOpen(null)} onPick={pick(onLocation)}
            rows={[{ label: 'Any neighbourhood', value: null }, ...neighbourhoods.map((n) => ({ label: n.name, note: \`\${n.count} homes\`, value: n.name }))]} />
        )}
        {open === 'price' && (
          <Sheet key="price" title="Price range" onClose={() => setOpen(null)} onPick={pick(onRange)} rows={PRICE_RANGES.map((r, i) => ({ label: r.label, value: i }))} />
        )}
      </AnimatePresence>
    </div>
  );
}
\`\`\`

## src/components/real-estate/Photo.jsx
\`\`\`jsx
export default function Photo({ src, alt }) {
  return src
    ? <img src={src} alt={alt} className="block h-full w-full object-cover" />
    : <div role="img" aria-label={alt} className="h-full w-full bg-[var(--ui-photo)]" />;
}
\`\`\`

## src/components/real-estate/real-estate.css
\`\`\`css
@font-face{font-family:"Neue Haas Grotesk";font-weight:400;font-display:block;src:url(https://media.base44.com/files/public/builder-assets/wix-fonts/neue-haas-grotesk-400-normal.woff2) format("woff2")}
@font-face{font-family:"Neue Haas Grotesk";font-weight:500;font-display:block;src:url(https://media.base44.com/files/public/builder-assets/wix-fonts/neue-haas-grotesk-500-normal.woff2) format("woff2")}
@font-face{font-family:"Neue Haas Grotesk";font-weight:700;font-display:block;src:url(https://media.base44.com/files/public/builder-assets/wix-fonts/neue-haas-grotesk-700-normal.woff2) format("woff2")}

/* The look: ground, type and panel (--swatch-1..3); every tint is mixed from them. Type on a photo is the look's own: a light look keeps it light. */
:root{
  --swatch-1:#0A0A0A;--swatch-1-ink:#FFFFFF;
  --swatch-2:#EFE7DD;--swatch-2-ink:#111111;
  --swatch-3:#1C1C1C;--swatch-3-ink:#FFFFFF;
  --ui-veil:#00000066;--ui-veil-detail:#0000004D;--ui-on-photo:var(--swatch-2);
  --ui-meta:color-mix(in srgb,var(--swatch-2) 85%,transparent);
  --ui-desc:color-mix(in srgb,var(--swatch-2) 80%,transparent);
  --ui-muted:color-mix(in srgb,var(--swatch-2) 70%,transparent);
  --ui-field-label:color-mix(in srgb,var(--swatch-2) 60%,transparent);
  --ui-label:color-mix(in srgb,var(--swatch-2) 55%,transparent);
  --ui-line:color-mix(in srgb,var(--swatch-2) 50%,transparent);
  --ui-placeholder:color-mix(in srgb,var(--swatch-2) 45%,transparent);
  --ui-field-line:color-mix(in srgb,var(--swatch-2) 35%,transparent);
  --ui-ring:color-mix(in srgb,var(--swatch-2) 28%,transparent);
  --ui-hover:color-mix(in srgb,var(--swatch-2) 12%,transparent);
  --ui-chip:color-mix(in srgb,var(--swatch-3) 85%,transparent);
  --ui-photo:color-mix(in srgb,var(--swatch-2) 14%,var(--swatch-3));
}
/* gallery-look */

.re{font-family:"Neue Haas Grotesk","Helvetica Neue",Helvetica,Arial,sans-serif;color:var(--swatch-2);background:var(--swatch-1);-webkit-font-smoothing:antialiased;scrollbar-width:none}
.re::-webkit-scrollbar{display:none}
.re :focus-visible{outline:1px solid var(--swatch-2);outline-offset:3px}
\`\`\`

## src/components/real-estate/scroll.js
\`\`\`js
import { animate } from 'framer-motion';

// A visitor's own scroll, tap or key ends a glide instead of fighting it.
const interrupts = ['wheel', 'touchstart', 'pointerdown', 'keydown'];

/** Scrolls \`el\` to \`top\` on a fixed curve (native smooth scrolling has no set duration). */
export const glide = (el, top, { duration = 1.2, delay = 0 } = {}) => {
  const stop = (event) => {
    if (event && !event.isTrusted) return;
    controls.stop();
    interrupts.forEach((type) => window.removeEventListener(type, stop, true));
  };
  interrupts.forEach((type) => window.addEventListener(type, stop, { capture: true, passive: true }));
  const controls = animate(el.scrollTop, Math.max(0, Math.min(top, el.scrollHeight - el.clientHeight)), {
    duration, delay, ease: [0.45, 0, 0.35, 1], onUpdate: (v) => { el.scrollTop = v; }, onComplete: () => stop(),
  });
  return controls;
};

/** \`target\`'s top within the scroll container \`el\`. */
export const offsetIn = (el, target) => el.scrollTop + target.getBoundingClientRect().top - el.getBoundingClientRect().top;
\`\`\`

## src/components/real-estate/SearchBar.jsx
\`\`\`jsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Home as HouseIcon } from 'lucide-react';
import { PRICE_RANGES } from './data';

// Below the bar, which sits at 46.5% of the one-screen hero: a short, wide window scrolls the menu instead of clipping it.
function Menu({ rows, left, onPick }) {
  const [hover, setHover] = useState(null);
  return (
    <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.18 }} style={{ left: \`max(\${left}px, \${left / 12.8}vw)\` }}
      className="absolute top-[max(85px,6.640625vw)] z-20 max-h-[calc(53.5vh-max(85px,6.640625vw)-12px)] w-[max(263px,20.546875vw)] overflow-y-auto rounded-[max(19px,1.484375vw)] border border-[var(--ui-ring)] bg-[var(--swatch-3)]">
      {rows.map((row, i) => (
        <button key={row.label} type="button" onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)} onClick={() => onPick(row.value)}
          className={\`flex h-[max(47px,3.671875vw)] w-full items-center justify-between px-[max(19px,1.484375vw)] text-[max(16px,1.25vw)] \${i ? 'border-t border-[var(--ui-hover)]' : ''} \${hover === i ? 'bg-[var(--ui-hover)]' : ''}\`}>
          {row.label}{row.note && <span className="opacity-50">{row.note}</span>}
        </button>
      ))}
    </motion.div>
  );
}

const Column = ({ label, value, dim, onClick, className }) => (
  <button type="button" onClick={onClick} className={\`flex h-full flex-col justify-center pl-[max(27px,2.109375vw)] text-left \${className}\`}>
    <span className="text-[max(9px,0.703125vw)] uppercase leading-[max(11px,0.859375vw)] tracking-[0.05em] text-[var(--ui-label)]">{label}</span>
    <span className={\`mt-[max(2px,0.15625vw)] text-[max(16px,1.25vw)] leading-[max(20px,1.5625vw)] \${dim ? 'text-[var(--ui-label)]' : ''}\`}>{value}</span>
  </button>
);

export default function SearchBar({ neighbourhoods, location, onLocation, rangeIdx, onRange, searched, onSearch }) {
  const [open, setOpen] = useState(null);
  const toggle = (menu) => setOpen((current) => (current === menu ? null : menu));
  const pick = (set) => (value) => { set(value); setOpen(null); };

  return (
    <div className="absolute left-1/2 top-[46.5%] z-10 flex h-[max(80px,6.25vw)] w-[max(866px,67.65625vw)] max-w-[calc(100%-26px)] -translate-x-1/2 items-center text-[var(--swatch-2)]">
      <span className="flex h-[max(80px,6.25vw)] w-[max(80px,6.25vw)] flex-none items-center justify-center rounded-full bg-[var(--swatch-3)]">
        <span className="flex h-[max(61px,4.765625vw)] w-[max(61px,4.765625vw)] items-center justify-center rounded-full bg-[var(--swatch-2)] text-[var(--swatch-1)]"><HouseIcon size={24} strokeWidth={2} className="h-[max(24px,1.875vw)] w-[max(24px,1.875vw)]" /></span>
      </span>
      <div className="h-[max(80px,6.25vw)] w-[max(540px,42.1875vw)] flex-none rounded-full bg-[var(--swatch-3)] p-[max(6px,0.46875vw)]">
        <div className="flex h-full items-center rounded-full border border-[var(--ui-ring)]">
          <Column label="Location" value={location ?? 'Any neighbourhood'} dim={!location} onClick={() => toggle('location')} className="w-[max(263px,20.546875vw)] flex-none" />
          <span className="h-[max(31px,2.421875vw)] w-px flex-none bg-[var(--ui-ring)]" />
          <Column label="Price range" value={PRICE_RANGES[rangeIdx].label} onClick={() => toggle('price')} className="flex-1" />
        </div>
      </div>
      <div className="ml-[max(13px,1.015625vw)] h-[max(80px,6.25vw)] w-[max(233px,18.203125vw)] flex-none rounded-full bg-[var(--swatch-3)] p-[max(5px,0.390625vw)]">
        <button type="button" onClick={() => { setOpen(null); onSearch(); }}
          className={\`h-full w-full rounded-full border text-[max(16px,1.25vw)] font-medium transition-colors duration-200 \${searched ? 'border-transparent bg-[var(--swatch-2)] text-[var(--swatch-1)]' : 'border-[var(--swatch-2)]'}\`}>
          Search →
        </button>
      </div>
      {open === 'location' && (
        <Menu left={85} onPick={pick(onLocation)} rows={[{ label: 'Any neighbourhood', value: null }, ...neighbourhoods.map((n) => ({ label: n.name, note: \`\${n.count} homes\`, value: n.name }))]} />
      )}
      {open === 'price' && <Menu left={349} onPick={pick(onRange)} rows={PRICE_RANGES.map((r, i) => ({ label: r.label, value: i }))} />}
    </div>
  );
}
\`\`\`

## src/components/real-estate/seed.js
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

## src/components/real-estate/useListings.js
\`\`\`js
import { useCallback, useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { seedListings } from './data';
import { loadSeeded } from './seed';

export function useListings() {
  const [listings, setListings] = useState([]);
  const [status, setStatus] = useState('loading');

  const load = useCallback(async () => {
    setStatus('loading');
    try {
      const { Listing } = await loadSeeded({ Listing: { samples: seedListings(), key: 'address', sort: 'sort_order' } });
      setListings([...Listing].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)));
      setStatus('ready');
    } catch {
      setStatus('error');
    }
  }, []);
  useEffect(() => { load(); }, [load]);

  return {
    listings,
    status,
    reload: load,
    sendInquiry: (inquiry) => base44.entities.Inquiry.create({ ...inquiry, createdAt: new Date().toISOString() }),
  };
}
\`\`\`

## src/components/real-estate/useMobile.js
\`\`\`js
import { useEffect, useState } from 'react';

export const MOBILE = '(max-width: 899px)';

/** Phones and small tablets get the stacked layout. */
export function useMobile() {
  const [mobile, setMobile] = useState(() => typeof window !== 'undefined' && Boolean(window.matchMedia?.(MOBILE).matches));
  useEffect(() => {
    const mq = window.matchMedia?.(MOBILE);
    if (!mq) return undefined;
    const on = () => setMobile(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return mobile;
}
\`\`\`

## src/components/real-estate/useUrlParam.js
\`\`\`js
import { useEffect, useMemo, useRef, useState } from 'react';

const read = (name) => (typeof window === 'undefined' ? null : new URLSearchParams(window.location.search).get(name));

/** A query parameter as state: setting it adds a history entry, so Back (and a shared link) returns to it. */
export function useUrlParam(name) {
  const [value, setValue] = useState(() => read(name));
  useEffect(() => {
    const sync = () => setValue(read(name));
    window.addEventListener('popstate', sync);
    return () => window.removeEventListener('popstate', sync);
  }, [name]);

  /** \`replace\`: swap the open item (Next project) without adding a step to go back through. */
  const set = (next, replace = false) => {
    setValue(next);
    // Closing what this page opened: step back rather than stack another entry.
    if (next == null && window.history.state?.param === name) return window.history.back();
    if (next === read(name)) return;
    // The gallery's preview frame shares the homepage's history, so it never writes to it.
    if ('__galleryPlaying' in window) return;
    const url = new URL(window.location.href);
    if (next == null) url.searchParams.delete(name);
    else url.searchParams.set(name, next);
    try {
      if (next == null) window.history.replaceState(null, '', url);
      else window.history[replace ? 'replaceState' : 'pushState']({ param: name }, '', url);
    } catch { /* a sandboxed frame without a real URL */ }
  };
  return [value, set];
}

/** A new id for the page's scroll container whenever \`value\` changes. TanStack's router treats the
 *  pushState above as a navigation and restores every scrolled element by this id, so a fresh one
 *  keeps it off the container and the page sets its own scroll. */
export function useScrollKey(value) {
  const n = useRef(0);
  return useMemo(() => n.current++, [value]); // eslint-disable-line react-hooks/exhaustive-deps
}
\`\`\`

## src/pages/RealEstateListings.jsx
\`\`\`jsx
import { useLayoutEffect, useRef, useState } from 'react';
import { useScroll } from 'framer-motion';
import '@/components/real-estate/real-estate.css';
import Home, { NEW_SEARCH } from '@/components/real-estate/Home';
import Detail from '@/components/real-estate/Detail';
import Flight from '@/components/real-estate/Flight';
import Footer from '@/components/real-estate/Footer';
import { useListings } from '@/components/real-estate/useListings';
import { useScrollKey, useUrlParam } from '@/components/real-estate/useUrlParam';

export default function RealEstateListings() {
  const scrollRef = useRef(null);
  const { listings, status, reload, sendInquiry } = useListings();
  const [openId, setOpenId] = useUrlParam('listing');
  const [flight, setFlight] = useState(null);
  const [search, setSearch] = useState(NEW_SEARCH);
  const homeTop = useRef(0);
  const scrollKey = useScrollKey(openId);
  const { scrollY } = useScroll({ container: scrollRef });
  const listing = listings.find((l) => l.id === openId);

  useLayoutEffect(() => {
    scrollRef.current.scrollTop = openId ? 0 : homeTop.current;
  }, [openId]);

  const open = (picked, rect) => {
    homeTop.current = scrollRef.current.scrollTop;
    setFlight({ listing: picked, rect });
  };

  return (
    <div ref={scrollRef} data-scroll data-scroll-restoration-id={\`re-\${scrollKey}\`} className="re relative h-screen overflow-y-auto overflow-x-hidden">
      {listing
        ? <Detail listing={listing} onBack={() => setOpenId(null)} onSend={sendInquiry} />
        : <Home listings={listings} status={status} onRetry={reload} scrollRef={scrollRef} scrollY={scrollY} onOpen={open} search={search} onSearchChange={setSearch} />}
      <Footer />
      {flight && <Flight {...flight} onDone={() => { setOpenId(flight.listing.id); setFlight(null); }} />}
    </div>
  );
}
\`\`\`
`;export{e as default};