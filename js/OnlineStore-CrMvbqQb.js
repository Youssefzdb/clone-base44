var e=`# online_store — app files

## base44/entities/JournalPost.jsonc
\`\`\`json
{"name":"JournalPost","type":"object","properties":{"title":{"type":"string"},"image":{"type":"string"},"body":{"type":"string"},"position":{"type":"number"},"sample":{"type":"boolean","description":"A sample row the app added on its first load"}},"required":["title"],"rls":{"read":{},"create":{"user_condition":{"role":"admin"}},"update":{"user_condition":{"role":"admin"}},"delete":{"user_condition":{"role":"admin"}}}}
\`\`\`

## base44/entities/Order.jsonc
\`\`\`json
{"name":"Order","type":"object","properties":{"lines":{"type":"array","items":{"type":"object","properties":{"name":{"type":"string"},"glaze":{"type":"string"},"size":{"type":"string"},"quantity":{"type":"number"},"price":{"type":"number"}}}},"customer_name":{"type":"string"},"email":{"type":"string","format":"email"},"address":{"type":"string"},"total":{"type":"number"},"status":{"type":"string","enum":["pending","paid"],"default":"pending"}},"required":["customer_name","email","address","lines","total"],"rls":{"create":{"$or":[{"data.status":"pending"},{"user_condition":{"role":"admin"}}]},"read":{"$or":[{"created_by_id":"{{user.id}}"},{"user_condition":{"role":"admin"}}]},"update":{"user_condition":{"role":"admin"}},"delete":{"user_condition":{"role":"admin"}}}}
\`\`\`

## base44/entities/Product.jsonc
\`\`\`json
{"name":"Product","type":"object","properties":{"name":{"type":"string"},"price":{"type":"number"},"category":{"type":"string","enum":["Tableware","Vessels"]},"tag":{"type":"string"},"description":{"type":"string"},"image":{"type":"string"},"position":{"type":"number"},"sample":{"type":"boolean","description":"A sample row the app added on its first load"}},"required":["name","price","category"],"rls":{"read":{},"create":{"user_condition":{"role":"admin"}},"update":{"user_condition":{"role":"admin"}},"delete":{"user_condition":{"role":"admin"}}}}
\`\`\`

## base44/entities/SiteSetup.jsonc
\`\`\`json
{"name":"SiteSetup","type":"object","properties":{"set_up":{"type":"boolean","default":true}},"required":["set_up"],"rls":{"read":{},"create":{"user_condition":{"role":"admin"}},"update":{"user_condition":{"role":"admin"}},"delete":{"user_condition":{"role":"admin"}}}}
\`\`\`

## base44/entities/Subscriber.jsonc
\`\`\`json
{"name":"Subscriber","type":"object","properties":{"email":{"type":"string","format":"email"}},"required":["email"],"rls":{"create":{},"read":{"$or":[{"created_by_id":"{{user.id}}"},{"user_condition":{"role":"admin"}}]},"update":{"user_condition":{"role":"admin"}},"delete":{"user_condition":{"role":"admin"}}}}
\`\`\`

## src/components/online-store/About.jsx
\`\`\`jsx
import FadeUp from './FadeUp';
import Photo from './Photo';
import { IMAGES } from './images';

export default function About() {
  return (
    <section data-section="about" className="px-[20px] pt-[80px] md:px-[max(57px,4.4531vw)] md:pt-[max(110px,8.5937vw)]">
      <FadeUp className="grid gap-[28px] md:grid-cols-2 md:items-center md:gap-[max(36px,2.8125vw)]">
        <Photo src={IMAGES.pinchPot} alt="A pinch pot drying on the studio shelf" className="h-[340px] w-full rounded-[4px] md:h-[max(440px,34.375vw)]" />
        <div className="text-[var(--swatch-3)]">
          <h2 className="os-serif text-[44px] uppercase leading-none md:text-[max(60.8px,4.75vw)]">About</h2>
          <p className="mt-[20px] text-[17px] leading-[1.5] text-[var(--swatch-1)] md:mt-[max(24px,1.875vw)] md:max-w-[34em] md:text-[max(17px,1.328vw)]">
            Terra Alba is a two-person studio making stoneware for the table. Every piece is thrown by hand, glazed in small tests and fired in our own kiln.
          </p>
          <p className="mt-[14px] text-[17px] leading-[1.5] text-[var(--swatch-1)] md:max-w-[34em] md:text-[max(17px,1.328vw)]">
            We release twelve pieces at a time. When a batch is gone, the next one brings new glazes, so no two collections are the same.
          </p>
        </div>
      </FadeUp>
    </section>
  );
}
\`\`\`

## src/components/online-store/Account.jsx
\`\`\`jsx
import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { euro } from './format';

const day = (iso) => new Date(iso).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });

/** The signed-in shopper's orders, with Sign out. */
export default function Account({ account }) {
  const { user, orders, open, close, logOut } = account;
  useEffect(() => {
    if (!open) return undefined;
    const esc = (e) => e.key === 'Escape' && close();
    window.addEventListener('keydown', esc);
    return () => window.removeEventListener('keydown', esc);
  }, [open, close]);

  return (
    <AnimatePresence>
      {open && user && (
        <motion.div key="account" className="fixed inset-0 z-50 flex items-center justify-center p-[16px]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
          <div className="absolute inset-0 bg-[var(--swatch-1)] opacity-40" onClick={close} />
          <motion.section role="dialog" aria-modal="true" aria-label="Your account" initial={{ y: 24 }} animate={{ y: 0 }} exit={{ y: 24 }} transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
            className="relative max-h-full w-full max-w-[560px] overflow-y-auto rounded-[3px] bg-[var(--swatch-2)] px-[24px] pb-[32px] pt-[28px] md:px-[40px]">
            <button type="button" onClick={close} aria-label="Close account" className="absolute right-[14px] top-[14px] flex h-[44px] w-[44px] items-center justify-center rounded-full bg-[var(--swatch-3)] text-[var(--swatch-2)]"><X size={18} /></button>
            <p className="os-mono text-[13px] tracking-[0.16em] text-[var(--swatch-3)]">{user.email}</p>
            <h3 className="os-serif mt-[12px] text-[34px] uppercase leading-[1.05] text-[var(--swatch-3)]">Your orders</h3>
            {!orders && <p className="os-mono mt-[20px] text-[13px] tracking-[0.16em]">LOADING…</p>}
            {orders?.length === 0 && <p className="mt-[20px] text-[17px]">No orders yet. Your next piece will show up here.</p>}
            <ul className="mt-[12px]">
              {orders?.map((order) => (
                <li key={order.id} className="border-b border-[var(--swatch-3)] py-[16px]">
                  <div className="os-mono flex justify-between text-[13px] tracking-[0.16em] text-[var(--swatch-3)]">
                    <span>{day(order.created_date)} · {order.status === 'paid' ? 'PAID' : 'RECEIVED'}</span>
                    <span>{euro(order.total)}</span>
                  </div>
                  <p className="mt-[6px] text-[16px]">{order.lines.map((l) => \`\${l.quantity} × \${l.name} (\${l.glaze}, \${l.size})\`).join(', ')}</p>
                </li>
              ))}
            </ul>
            <button type="button" onClick={logOut} className="os-mono mt-[24px] h-[44px] rounded-full border border-[var(--swatch-3)] px-[22px] text-[13px] tracking-[0.16em] text-[var(--swatch-3)]">SIGN OUT</button>
          </motion.section>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
\`\`\`

## src/components/online-store/CartPanel.jsx
\`\`\`jsx
import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Minus, Plus, X } from 'lucide-react';
import CheckoutForm from './CheckoutForm';
import Photo from './Photo';
import { confirmation } from './orderParts';
import { SHIPPING, euro } from './format';

const MONO = 'os-mono text-[13px] tracking-[0.16em]';
const STEP = 'flex h-[34px] w-[34px] items-center justify-center disabled:opacity-40';
const PILL = 'os-mono mt-[28px] h-[52px] w-full rounded-full bg-[var(--swatch-2)] text-[14px] tracking-[0.16em] text-[var(--swatch-3)]';

function Line({ line, onChange, onRemove }) {
  const { product, quantity } = line;
  return (
    <div className="flex gap-[14px] border-b-[1.5px] border-[var(--swatch-2)] py-[16px]">
      <Photo src={product.image} alt={product.name} className="h-[84px] w-[76px] flex-none rounded-[3px]" />
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-[12px]">
          <span className="os-serif text-[22px] leading-none">{product.name}</span>
          <span className="os-mono text-[16px]">{euro(product.price * quantity)}</span>
        </div>
        <p className={\`\${MONO} mt-[8px] uppercase\`}>{line.glaze} — {line.size}</p>
        <div className="mt-[10px] flex items-center justify-between">
          <div className="flex items-center rounded-full border-[1.5px] border-[var(--swatch-2)]">
            <button type="button" aria-label={\`One fewer \${product.name}\`} disabled={quantity <= 1} onClick={() => onChange(line, { quantity: quantity - 1 })} className={STEP}><Minus size={14} /></button>
            <span className="os-mono w-[22px] text-center text-[14px]">{quantity}</span>
            <button type="button" aria-label={\`One more \${product.name}\`} onClick={() => onChange(line, { quantity: quantity + 1 })} className={STEP}><Plus size={14} /></button>
          </div>
          <button type="button" onClick={() => onRemove(line)} className={\`\${MONO} underline-offset-4 hover:underline\`}>REMOVE</button>
        </div>
      </div>
    </div>
  );
}

const Row = ({ label, value, className = '' }) => (
  <p className={\`flex justify-between gap-[12px] \${className}\`}><span>{label}</span><span className="os-mono">{value}</span></p>
);

/** The cart drawer: every line, the totals, and checkout with the customer's details. */
export default function CartPanel({ open, store, onClose, onShop }) {
  const { lines, count, subtotal, total, placed } = store;
  useEffect(() => {
    if (!open) return undefined;
    const esc = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', esc);
    return () => window.removeEventListener('keydown', esc);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div key="cart" className="fixed inset-0 z-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
          <div className="absolute inset-0 bg-[var(--swatch-1)] opacity-40" onClick={onClose} />
          <motion.aside role="dialog" aria-modal="true" aria-label="Cart" initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
            className="absolute inset-y-0 right-0 w-full overflow-y-auto bg-[var(--swatch-3)] px-[24px] pb-[32px] pt-[22px] text-[var(--swatch-2)] md:w-[max(460px,35.9375vw)] md:px-[max(29px,2.2656vw)]">
            <div className="flex items-center justify-between">
              <p className="os-mono text-[15px] tracking-[0.16em]">{placed && !lines.length ? 'ORDER RECEIVED — THANK YOU' : \`YOUR CART — \${count} ITEM\${count === 1 ? '' : 'S'}\`}</p>
              <button type="button" onClick={onClose} aria-label="Close cart" className="flex h-[44px] w-[44px] items-center justify-center rounded-full border-[1.5px] border-[var(--swatch-2)]"><X size={18} /></button>
            </div>
            {!lines.length ? (
              <>
                <p className="mt-[28px] text-[18px] leading-[27px]">{placed ? confirmation(placed) : 'Your cart is empty.'}</p>
                <button type="button" onClick={onShop} className={PILL}>{placed ? 'CONTINUE SHOPPING' : 'SHOP THE COLLECTION'}</button>
              </>
            ) : (
              <>
                <div className="mt-[16px] border-t-[1.5px] border-[var(--swatch-2)]">
                  {lines.map((l) => <Line key={l.id} line={l} onChange={store.updateLine} onRemove={store.removeLine} />)}
                </div>
                <div className="mt-[16px] flex flex-col gap-[8px] text-[17px]">
                  <Row label="Subtotal" value={euro(subtotal)} />
                  <Row label="Shipping — Europe" value={euro(SHIPPING)} />
                </div>
                <div className="mt-[14px] h-[1.5px] bg-[var(--swatch-2)]" />
                <Row label={<span className="os-serif text-[28px] uppercase">Total</span>} value={<span className="text-[28px]">{euro(total)}</span>} className="mt-[14px] items-baseline leading-none" />
                <CheckoutForm total={total} onPlace={store.checkout} />
              </>
            )}
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
\`\`\`

## src/components/online-store/CheckoutForm.jsx
\`\`\`jsx
import { useState } from 'react';
import { usePay } from './orderParts';
import { euro } from './format';

const EMAIL = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
const FIELDS = [
  ['customer_name', 'NAME', 'ENTER YOUR NAME', (v) => v.length > 1],
  ['email', 'EMAIL', 'ENTER A VALID EMAIL', (v) => EMAIL.test(v)],
  ['address', 'SHIPPING ADDRESS', 'ENTER STREET, POSTCODE, CITY AND COUNTRY', (v) => v.length > 9],
];
const INPUT = 'mt-[8px] w-full border-[1.5px] border-[var(--swatch-2)] bg-transparent px-[20px] text-[16px] text-[var(--swatch-2)] outline-none';

/** Who the order goes to; nothing is saved until every field is valid. */
export default function CheckoutForm({ total, onPlace }) {
  const [form, setForm] = useState({ customer_name: '', email: '', address: '' });
  const [tried, setTried] = useState(false);
  const { paying, failed, pay } = usePay(onPlace);
  const values = Object.fromEntries(Object.entries(form).map(([k, v]) => [k, v.trim()]));
  const errors = FIELDS.filter(([key, , , valid]) => !valid(values[key])).map(([key]) => key);

  const submit = (e) => {
    e.preventDefault();
    setTried(true);
    if (!errors.length && !paying) pay(values);
  };

  return (
    <form onSubmit={submit} noValidate className="mt-[28px] flex flex-col gap-[16px]">
      {FIELDS.map(([key, label, message]) => {
        const Input = key === 'address' ? 'textarea' : 'input';
        const bad = tried && errors.includes(key);
        return (
          <label key={key} className="os-mono block text-[13px] tracking-[0.16em]">
            {label}
            <Input value={form[key]} onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))} aria-invalid={bad}
              type={key === 'email' ? 'email' : undefined} rows={key === 'address' ? 3 : undefined} autoComplete={key === 'customer_name' ? 'name' : key === 'email' ? 'email' : 'street-address'}
              className={\`\${INPUT} \${key === 'address' ? 'resize-none rounded-[22px] py-[12px] leading-[22px]' : 'h-[46px] rounded-full'}\`} />
            {bad && <span className="mt-[6px] block text-[12px]">{message}</span>}
          </label>
        );
      })}
      <button type="submit" disabled={paying}
        className="os-mono mt-[8px] h-[52px] w-full rounded-full bg-[var(--swatch-2)] text-[14px] tracking-[0.16em] text-[var(--swatch-3)] disabled:opacity-60">
        {paying ? 'PLACING YOUR ORDER…' : failed ? 'COULDN’T PLACE IT — TRY AGAIN' : \`PLACE ORDER — \${euro(total)}\`}
      </button>
    </form>
  );
}
\`\`\`

## src/components/online-store/CheckoutSheet.jsx
\`\`\`jsx
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { OrderLines, confirmation, orderHeading } from './orderParts';
import { euro } from './format';

const SLIDE = [0.32, 0.72, 0, 1];

/** Phones: the order docked to the bottom; tapping it slides the lines up, which fade in only near the end. */
export default function CheckoutSheet({ lines, count, total, placed, onCheckout }) {
  const [open, setOpen] = useState(false);
  const done = placed && !lines.length;
  useEffect(() => { if (placed) setOpen(true); }, [placed]);

  return (
    <div className="fixed inset-x-0 bottom-0 z-20 rounded-t-[18px] bg-[var(--swatch-3)] px-[20px] pb-[calc(16px+env(safe-area-inset-bottom))] text-[var(--swatch-2)]">
      <button type="button" aria-expanded={open} aria-label={open ? 'Hide order' : 'Show order'} onClick={() => setOpen((o) => !o)} className="block w-full text-left">
        <span className="flex h-[30px] items-center justify-center"><span className="h-[4px] w-[40px] rounded-full bg-[var(--swatch-2)]" /></span>
        <motion.span initial={false} animate={{ height: open ? 'auto' : 0 }} transition={{ duration: 0.4, ease: SLIDE, delay: open ? 0 : 0.12 }} className="block overflow-hidden">
          <motion.span initial={false} animate={{ opacity: open ? 1 : 0 }} transition={{ duration: open ? 0.2 : 0.12, delay: open ? 0.3 : 0 }} className="block pb-[16px] pt-[8px]">
            <span className="os-mono block text-[14px] leading-none tracking-[0.16em]">{orderHeading(placed, lines, count)}</span>
            <span className="mt-[8px] block text-[17px] leading-[30px]">{done ? confirmation(placed) : <OrderLines lines={lines} Row="span" />}</span>
            {!done && <span className="mt-[12px] block h-[1.5px] bg-[var(--swatch-2)]" />}
          </motion.span>
        </motion.span>
        {!done && (
          <span className="flex items-baseline justify-between pb-[4px] leading-none">
            <span className="os-serif text-[28px] uppercase">Total</span>
            <span className="os-mono text-[28px]">{euro(total)}</span>
          </span>
        )}
      </button>
      {!done && (
        <button type="button" disabled={!lines.length} onClick={onCheckout}
          className="os-mono mt-[14px] h-[52px] w-full rounded-full bg-[var(--swatch-2)] text-[14px] tracking-[0.16em] text-[var(--swatch-3)] disabled:opacity-60">
          CONTINUE TO PAYMENT
        </button>
      )}
    </div>
  );
}
\`\`\`

## src/components/online-store/FadeUp.jsx
\`\`\`jsx
import { motion } from 'framer-motion';

export default function FadeUp({ viewport, ...props }) {
  return (
    <motion.div initial={{ opacity: 0, y: 27 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.15, ...viewport }}
      transition={{ duration: 0.95, ease: 'easeOut' }} {...props} />
  );
}
\`\`\`

## src/components/online-store/Faq.jsx
\`\`\`jsx
import { useState } from 'react';
import { Plus } from 'lucide-react';
import FadeUp from './FadeUp';

const QUESTIONS = [
  ['Is every piece the same as the photo?', 'Each piece is thrown and glazed by hand, so the shape, glaze runs and size vary a little. That difference is the point.'],
  ['Can I put them in the dishwasher?', 'Yes. All our stoneware is dishwasher, oven and microwave safe. Pieces with a raw foot are best dried upside down.'],
  ['When will my order ship?', 'Orders leave the studio within 3 working days, packed in recycled paper. Delivery in Europe takes 2 to 5 days.'],
  ['Can I return a piece?', 'You can return any unused piece within 30 days. Write to us and we send a prepaid label.'],
  ['Will a sold-out piece come back?', 'Not in the same glaze. Sign up to the newsletter to hear about the next batch first.'],
];

export default function Faq() {
  const [open, setOpen] = useState(null);
  return (
    <section data-section="faq" className="px-[20px] py-[80px] md:px-[max(57px,4.4531vw)] md:py-[max(110px,8.5937vw)]">
      <FadeUp className="grid gap-[24px] md:grid-cols-[1fr_2fr] md:gap-[max(36px,2.8125vw)]">
        <h2 className="os-serif text-[44px] uppercase leading-none text-[var(--swatch-3)] md:text-[max(60.8px,4.75vw)]">FAQ</h2>
        <ul className="border-t border-[var(--swatch-3)]">
          {QUESTIONS.map(([question, answer], i) => (
            <li key={question} className="border-b border-[var(--swatch-3)]">
              <button type="button" aria-expanded={open === i} onClick={() => setOpen(open === i ? null : i)}
                className="os-serif flex w-full items-center justify-between gap-[16px] py-[18px] text-left text-[22px] leading-tight md:py-[max(20px,1.5625vw)] md:text-[max(24px,1.875vw)]">
                {question}
                <Plus size={20} strokeWidth={1.5} className={\`flex-none text-[var(--swatch-3)] transition-transform duration-300 \${open === i ? 'rotate-45' : ''}\`} />
              </button>
              {open === i && <p className="pb-[20px] text-[16px] leading-[1.5] md:max-w-[40em] md:text-[max(16px,1.25vw)]">{answer}</p>}
            </li>
          ))}
        </ul>
      </FadeUp>
    </section>
  );
}
\`\`\`

## src/components/online-store/format.js
\`\`\`js
export const euro = (value) => \`€\${value}\`;

export const GLAZES = [
  { name: 'Clay', color: 'var(--glaze-clay)' },
  { name: 'Chalk', color: 'var(--glaze-chalk)' },
  { name: 'Ash', color: 'var(--glaze-ash)' },
];
export const SIZES = ['0.8 L', '1.4 L'];
export const DEFAULT_VARIANT = { glaze: 'Clay', size: '1.4 L' };
export const SHIPPING = 9;
\`\`\`

## src/components/online-store/Header.jsx
\`\`\`jsx
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Jug } from './Shapes';

const NAV = [['SHOP', 'shop'], ['ABOUT', 'about'], ['JOURNAL', 'journal'], ['FAQ', 'faq']];
const PILL = 'h-[max(41.6px,3.25vw)] rounded-full px-[max(21px,1.6406vw)] transition-colors duration-300';

export default function Header({ onAccent, count, onNav, onCart, account }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const fill = onAccent ? 'var(--swatch-2)' : 'var(--swatch-3)';
  const ink = onAccent ? 'var(--swatch-3)' : 'var(--swatch-2)';
  const tone = { background: fill, color: ink };
  const go = (section) => { setMenuOpen(false); onNav(section); };
  // Signed in, the pill opens the shopper's orders; signed out, it sends them to sign in and back.
  const user = account.user;
  const accountLabel = user ? user.full_name?.split(' ')[0] || 'Account' : 'Log In';
  const onAccount = () => { setMenuOpen(false); if (user) account.show(); else account.logIn(); };

  return (
    <div className="sticky top-0 z-30 h-0">
      <button type="button" onClick={() => go(null)} style={tone} className={\`os-serif absolute left-[16px] top-[12px] text-[24px] font-medium max-xl:h-[52px] max-xl:px-[22px] xl:left-[max(19px,1.4843vw)] xl:top-[max(17px,1.3281vw)] xl:text-[max(21.6px,1.6875vw)] \${PILL}\`}>T.Alba</button>
      <nav className="absolute left-1/2 top-[max(17px,1.3281vw)] hidden -translate-x-1/2 gap-[max(8px,0.625vw)] md:flex xl:left-[max(435px,33.9843vw)] xl:translate-x-0">
        {NAV.map(([label, section]) => (
          <button key={label} type="button" onClick={() => go(section)} style={tone} className={\`os-mono text-[max(13.6px,1.0625vw)] tracking-[0.16em] \${PILL}\`}>{label}</button>
        ))}
      </nav>
      <button type="button" onClick={onAccount} style={tone} className={\`absolute right-[72px] top-[max(17px,1.3281vw)] hidden max-w-[max(84px,6.5625vw)] truncate text-[max(13px,1.0156vw)] font-medium md:block xl:left-[max(1133px,88.5156vw)] xl:right-auto \${PILL}\`}>{accountLabel}</button>
      <button type="button" onClick={onCart} aria-label={\`Cart, \${count} item\${count === 1 ? '' : 's'}\`} style={{ color: fill }} className="absolute right-[76px] top-[12px] h-[52px] w-[48px] md:right-[16px] transition-colors duration-300 xl:left-[max(1223px,95.5468vw)] xl:right-auto xl:top-[max(16px,1.25vw)] xl:h-[max(44px,3.4375vw)] xl:w-[max(35px,2.7343vw)]">
        <Jug className="h-full w-full" />
        <AnimatePresence initial={false}>
          <motion.span key={count} initial={{ scale: 0.2 }} animate={{ scale: 1 }} transition={{ type: 'spring', duration: 0.75, bounce: 0.55 }}
            style={{ color: ink }} className="absolute inset-x-0 top-[25px] text-center text-[14px] font-medium leading-none xl:top-[max(21px,1.6406vw)] xl:text-[max(10.5px,0.8203vw)]">{count}</motion.span>
        </AnimatePresence>
      </button>
      <button type="button" onClick={() => setMenuOpen(true)} aria-label="Menu" style={tone} className="absolute right-[16px] top-[12px] flex h-[52px] w-[52px] flex-col items-center justify-center gap-[5px] rounded-full md:hidden">
        {[0, 1, 2].map((i) => <span key={i} className="h-[1.5px] w-[20px] bg-current" />)}
      </button>
      {menuOpen && (
        <div className="fixed inset-0 z-40 flex flex-col gap-[18px] bg-[var(--swatch-3)] px-[20px] pt-[96px] text-[var(--swatch-2)] md:hidden">
          <button type="button" onClick={() => setMenuOpen(false)} aria-label="Close menu" className="absolute right-[16px] top-[12px] h-[52px] w-[52px] text-[28px]">×</button>
          {NAV.map(([label, section]) => <button key={label} type="button" onClick={() => go(section)} className="os-serif text-left text-[44px] uppercase leading-none">{label}</button>)}
          <button type="button" onClick={onAccount} className="os-serif text-left text-[44px] uppercase leading-none">{accountLabel}</button>
        </div>
      )}
    </div>
  );
}
\`\`\`

## src/components/online-store/Hero.jsx
\`\`\`jsx
import { BudVase } from './Shapes';
import { useMobile } from './useMobile';

// The aperture closes over the first 125px of scroll and the copy fades over the first 110px (at 1280px; wider, both grow with the window).
const CLOSE_PX = 125;
const FADE_PX = 110;
const ease = (t) => t * t * (3 - 2 * t);
const PANEL = 'absolute top-[max(89px,6.9531vw)] h-[max(592px,46.25vw)] w-[22.65625%] bg-[var(--swatch-2)]';
// Panel widths and lefts are fractions of the 1280px composition, so narrower desktops keep its shape.
const at = (px) => \`\${px / 12.8}%\`;

function Copy({ fade, onShop, mobile }) {
  return (
    <div className={\`absolute inset-x-0 flex flex-col items-center text-[var(--swatch-2)] \${mobile ? 'top-1/2 -translate-y-1/2' : 'top-[max(291px,22.7343vw)]'}\`} style={{ opacity: fade, visibility: fade ? 'visible' : 'hidden' }}>
      <h1 className={\`os-serif text-center uppercase \${mobile ? 'text-[min(44px,11.2vw)] leading-[1.09]' : 'text-[max(64px,5vw)] leading-[max(71px,5.5468vw)]'}\`}>Dinnerware<br />Collection</h1>
      {mobile ? (
        <button type="button" onClick={onShop} className="os-mono mt-[36px] flex h-[44px] items-end">
          <span className="border-b-2 border-[var(--swatch-2)] pb-[4px] text-[18px] leading-none tracking-[0.16em]">SHOP NOW</span>
        </button>
      ) : (
        <button type="button" onClick={onShop} className="os-mono mt-[max(73px,5.7031vw)] border-b-[max(2px,0.1562vw)] border-[var(--swatch-2)] pb-[max(4px,0.3125vw)] text-[max(19.2px,1.5vw)] leading-none tracking-[0.16em]">SHOP NOW</button>
      )}
    </div>
  );
}

// A tall ellipse just narrower than the blocks, closing to a circle; both scale down on narrow phones.
const OPEN_W = 'min(340px, (100vw - 76px) * 0.96)';
const SHUT_W = 'min(300px, (100vw - 76px) * 0.85)';

// Portrait: two cream blocks above and below a tall ellipse; on scroll they meet around a circle.
function PortraitAperture({ scrollY, onShop }) {
  const p = ease(Math.min(scrollY / 220, 1));
  return (
    <section data-accent className="relative h-screen overflow-hidden bg-[var(--swatch-3)]">
      <div data-cream className="absolute inset-x-[38px] bottom-[20px] top-[76px]">
        <div className="absolute inset-x-0 top-0 h-[calc(50%-34px)] bg-[var(--swatch-2)]" style={{ transform: \`translateY(\${34 * p}px)\` }} />
        <div className="absolute inset-x-0 bottom-0 h-[calc(50%-34px)] bg-[var(--swatch-2)]" style={{ transform: \`translateY(\${-34 * p}px)\` }}>
          <BudVase className="absolute bottom-[20px] left-[20px] h-[43px] w-[30px] text-[var(--swatch-3)]" />
        </div>
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-[50%] bg-[var(--swatch-3)]"
          style={{ width: \`calc(\${OPEN_W} * \${1 - p} + \${SHUT_W} * \${p})\`, height: \`min(100%, calc(640px * \${1 - p} + \${SHUT_W} * \${p}))\` }} />
      </div>
      <Copy fade={Math.max(0, 1 - scrollY / FADE_PX)} onShop={onShop} mobile />
    </section>
  );
}

export default function Hero({ scrollY, onShop }) {
  const mobile = useMobile();
  if (mobile) return <PortraitAperture scrollY={scrollY} onShop={onShop} />;
  const k = typeof window === 'undefined' ? 1 : Math.max(1, window.innerWidth / 1280);
  const p = ease(Math.min(scrollY / (CLOSE_PX * k), 1));

  // From 1280px up the composition grows with the width and sits centred in a screen-tall hero.
  return (
    <section data-accent className="flex h-[720px] items-center overflow-hidden bg-[var(--swatch-3)] xl:h-[max(100vh,56.25vw)]">
      <div className="relative h-[max(720px,56.25vw)] w-full flex-none">
        <div className={PANEL} style={{ left: at(82 + 259 * p) }}>
          <BudVase className="absolute bottom-[max(26px,2.0312vw)] left-[max(26px,2.0312vw)] h-[max(52px,4.0625vw)] w-[max(33px,2.5781vw)] text-[var(--swatch-3)]" />
        </div>
        <div className={PANEL} style={{ left: at(908 - 260 * p) }} />
        <div className="absolute left-1/2 top-[max(153px,11.9531vw)] h-[max(464px,36.25vw)] -translate-x-1/2 rounded-[50%] bg-[var(--swatch-3)]" style={{ width: at(985 - 520 * p) }} />
        <Copy fade={Math.max(0, 1 - scrollY / (FADE_PX * k))} onShop={onShop} />
      </div>
    </section>
  );
}
\`\`\`

## src/components/online-store/images.js
\`\`\`js
// Every photo of the store; an empty URL renders as a tile-colored placeholder of the same size.
const PHOTOS = 'https://media.base44.com/images/public/builder-assets/gallery/online-store';
const photo = (file) => \`\${PHOTOS}/\${file}.webp\`;

// Products: one handmade stoneware piece per shot, centred on a plain warm-sand ground, no props; \`vessel\` is a shelf still life.
export const IMAGES = {
  lipMug: photo('tumbler'),
  everydayBowl: photo('everyday-bowl'),
  dinnerPlate: photo('dinner-plate'),
  budVase: photo('carafe'),
  roundJug: photo('round-jug'),
  stemVase: photo('stem-vase'),
  footedCup: photo('footed-cup'),
  tripodBowl: photo('tripod-bowl'),
  pinchPot: photo('pinch-pot'),
  ringVase: photo('ring-vase'),
  bottleVase: photo('bottle-vase'),
  twistVase: photo('twist-vase'),
  journalAshGlaze: photo('pebble-vase'),
  journalBatches: photo('journal-batches'),
  journalWedging: photo('journal-wedging'),
  vessel: photo('vessel'),
};
\`\`\`

## src/components/online-store/Journal.jsx
\`\`\`jsx
import { useCallback, useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import FadeUp from './FadeUp';
import Note from './Note';
import Photo, { Tag } from './Photo';
import JournalArticle from './JournalArticle';

const ARROWS = [[-1, ArrowLeft, 'Previous story'], [1, ArrowRight, 'Next story']];

export default function Journal({ posts, status, onRetry }) {
  const [offset, setOffset] = useState(0);
  const [reading, setReading] = useState(null);
  const close = useCallback(() => setReading(null), []);
  const shown = [...posts.slice(offset), ...posts.slice(0, offset)];

  return (
    <section data-section="journal" className="px-[20px] pb-[64px] pt-[80px] md:px-[max(57px,4.4531vw)] md:pb-[max(87px,6.7968vw)] md:pt-[max(110px,8.5937vw)]">
      <FadeUp>
        <div className="flex items-end justify-between">
          <h2 className="os-serif text-[44px] uppercase leading-none md:text-[max(60.8px,4.75vw)] text-[var(--swatch-3)]">Journal</h2>
          <div className={\`flex gap-[max(8px,0.625vw)] max-md:hidden \${posts.length > 1 ? '' : 'invisible'}\`}>
            {ARROWS.map(([step, Icon, label]) => (
              <button key={label} type="button" aria-label={label} onClick={() => setOffset((o) => (o + step + posts.length) % posts.length)}
                className="flex h-[max(40px,3.125vw)] w-[max(40px,3.125vw)] items-center justify-center rounded-full border-[max(1.5px,0.1171vw)] border-[var(--swatch-3)] text-[var(--swatch-3)]">
                <Icon size={16} strokeWidth={1.5} className="h-[max(16px,1.25vw)] w-[max(16px,1.25vw)]" />
              </button>
            ))}
          </div>
        </div>
        {status === 'loading' && <Note className="text-[var(--swatch-3)]">LOADING THE JOURNAL…</Note>}
        {status === 'error' && <Note onRetry={onRetry} className="text-[var(--swatch-3)]">COULDN’T LOAD THE JOURNAL</Note>}
        {status === 'ready' && !posts.length && <Note className="text-[var(--swatch-3)]">NO STORIES YET</Note>}
        <div className="os-strip mt-[28px] flex snap-x snap-mandatory gap-[16px] overflow-x-auto max-md:-mx-[20px] max-md:scroll-px-[20px] max-md:px-[20px] md:mt-[max(33px,2.5781vw)] md:grid md:grid-cols-3 md:gap-x-[max(29px,2.2656vw)] md:overflow-visible">
          {shown.map((post) => (
            <button key={post.id} type="button" onClick={() => setReading(post)} className="w-[330px] max-w-[85vw] flex-none snap-start text-left md:w-auto md:max-w-none">
              <span className="relative block">
                <Photo src={post.image} alt={post.title} className="h-[max(240px,18.75vw)] w-full rounded-[3px]" />
                <Tag>Read</Tag>
              </span>
              <span className="os-serif mt-[16px] block text-[22px] leading-none md:mt-[max(19px,1.4843vw)] md:text-[max(25.6px,2vw)]">{post.title}</span>
            </button>
          ))}
        </div>
      </FadeUp>
      <JournalArticle post={reading} onClose={close} />
    </section>
  );
}
\`\`\`

## src/components/online-store/JournalArticle.jsx
\`\`\`jsx
import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import Photo from './Photo';

/** A journal story, opened from its card. */
export default function JournalArticle({ post, onClose }) {
  useEffect(() => {
    if (!post) return undefined;
    const esc = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', esc);
    return () => window.removeEventListener('keydown', esc);
  }, [post, onClose]);

  return (
    <AnimatePresence>
      {post && (
        <motion.div key="article" className="fixed inset-0 z-50 flex items-center justify-center p-[16px]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
          <div className="absolute inset-0 bg-[var(--swatch-1)] opacity-40" onClick={onClose} />
          <motion.article role="dialog" aria-modal="true" aria-label={post.title} initial={{ y: 24 }} animate={{ y: 0 }} exit={{ y: 24 }} transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
            className="relative max-h-full w-full max-w-[640px] overflow-y-auto rounded-[3px] bg-[var(--swatch-2)] pb-[32px]">
            <Photo src={post.image} alt={post.title} className="h-[260px] w-full md:h-[320px]" />
            <button type="button" onClick={onClose} aria-label="Close story" className="absolute right-[14px] top-[14px] flex h-[44px] w-[44px] items-center justify-center rounded-full bg-[var(--swatch-3)] text-[var(--swatch-2)]"><X size={18} /></button>
            <div className="px-[24px] md:px-[40px]">
              <p className="os-mono mt-[24px] text-[13px] tracking-[0.16em] text-[var(--swatch-3)]">JOURNAL</p>
              <h3 className="os-serif mt-[12px] text-[34px] uppercase leading-[1.05] text-[var(--swatch-3)]">{post.title}</h3>
              {(post.body || 'The full story is coming soon.').split('\\n\\n').map((para) => (
                <p key={para} className="mt-[16px] text-[17px] leading-[27px]">{para}</p>
              ))}
            </div>
          </motion.article>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
\`\`\`

## src/components/online-store/Newsletter.jsx
\`\`\`jsx
import { useState } from 'react';
import FadeUp from './FadeUp';

export default function Newsletter({ onJoin }) {
  const [email, setEmail] = useState('');
  const [joined, setJoined] = useState(false);
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);
  const [invalid, setInvalid] = useState(false);
  const join = async (e) => {
    e.preventDefault();
    if (busy) return;
    const ok = /^\\S+@\\S+\\.\\S+$/.test(email.trim());
    setInvalid(!ok);
    if (!ok) return;
    setBusy(true);
    setFailed(false);
    try {
      await onJoin(email.trim());
      setJoined(true);
    } catch {
      setFailed(true);
    } finally {
      setBusy(false);
    }
  };

  return (
    <section data-accent data-section="letter" className="bg-[var(--swatch-3)] px-[20px] pb-[72px] pt-[72px] text-[var(--swatch-2)] md:h-[max(429px,33.5156vw)] md:px-0 md:pb-0 md:pt-[max(87px,6.7968vw)]">
      <FadeUp className="flex flex-col items-center text-center">
        <p className="os-mono text-[14px] leading-none tracking-[0.16em] md:text-[max(14.4px,1.125vw)]">QUARTERLY LETTER</p>
        <h2 className="os-serif mt-[24px] text-[42px] uppercase leading-[44px] md:mt-[max(29px,2.2656vw)] md:text-[max(60.8px,4.75vw)] md:leading-[max(60.8px,4.75vw)]">New batches,<br />first.</h2>
        {joined ? (
          <p className="os-mono mt-[max(44px,3.4375vw)] flex h-[max(45px,3.5156vw)] items-center text-[max(14.4px,1.125vw)] tracking-[0.16em]">YOU’RE ON THE LIST</p>
        ) : (
          <form onSubmit={join} noValidate className="mt-[36px] flex gap-[max(10px,0.7812vw)] max-md:w-full max-md:flex-col md:mt-[max(44px,3.4375vw)]">
            <input type="email" required value={email} onChange={(e) => { setEmail(e.target.value); setInvalid(false); }} aria-invalid={invalid} placeholder="Email address" aria-label="Email address"
              className="h-[52px] w-full rounded-full border-[max(1.5px,0.1171vw)] border-[var(--swatch-2)] bg-transparent px-[max(22px,1.7187vw)] text-[17px] text-[var(--swatch-2)] md:h-[max(45px,3.5156vw)] md:w-[max(336px,26.25vw)] md:text-[max(15px,1.1718vw)] outline-none placeholder:text-[var(--swatch-2)]" />
            <button type="submit" disabled={busy} className="os-mono h-[52px] w-full rounded-full bg-[var(--swatch-2)] text-[14px] md:h-[max(45px,3.5156vw)] md:w-[max(91px,7.1093vw)] md:text-[max(14.4px,1.125vw)] tracking-[0.16em] text-[var(--swatch-3)] disabled:opacity-60">JOIN</button>
          </form>
        )}
        {invalid && <p role="alert" className="os-mono mt-[max(14px,1.09375vw)] text-[13px] tracking-[0.16em] md:text-[max(13px,1.015625vw)]">ENTER A VALID EMAIL ADDRESS</p>}
        {failed && <p role="alert" className="os-mono mt-[max(14px,1.09375vw)] text-[13px] tracking-[0.16em] md:text-[max(13px,1.015625vw)]">COULDN’T SIGN YOU UP — TRY AGAIN</p>}
      </FadeUp>
    </section>
  );
}
\`\`\`

## src/components/online-store/Note.jsx
\`\`\`jsx
/** A section's loading, empty or failed state, in place of its content. */
export default function Note({ children, onRetry, className = '' }) {
  return (
    <div role={onRetry ? 'alert' : 'status'} className={\`os-mono flex min-h-[240px] flex-col items-center justify-center gap-[20px] text-center text-[14px] tracking-[0.16em] md:text-[max(14.4px,1.125vw)] \${className}\`}>
      <p>{children}</p>
      {onRetry && (
        <button type="button" onClick={onRetry} className="h-[44px] rounded-full border-[1.5px] border-current px-[24px] md:h-[max(39px,3.0468vw)]">TRY AGAIN</button>
      )}
    </div>
  );
}
\`\`\`

## src/components/online-store/online-store.css
\`\`\`css
@font-face{font-family:"Playfair Display";font-weight:400 900;src:url(https://media.base44.com/files/public/builder-assets/google-fonts/playfair-display-variable-normal.woff2) format("woff2")}
@font-face{font-family:"Archivo";font-weight:100 900;src:url(https://media.base44.com/files/public/builder-assets/google-fonts/archivo-variable-normal.woff2) format("woff2")}
@font-face{font-family:"DM Mono";font-weight:400;src:url(https://media.base44.com/files/public/builder-assets/google-fonts/dm-mono-400-normal.woff2) format("woff2")}

/* The look: ink, cream page, the accent and its deep shade (--swatch-N), plus the UI colors. */
:root{
  --swatch-1:#161614;--swatch-1-ink:#FFFFFF;
  --swatch-2:#FBF9F5;--swatch-2-ink:#111111;
  --swatch-3:#B30009;--swatch-3-ink:#FFFFFF;
  --swatch-4:#7F0006;--swatch-4-ink:#FFFFFF;
  --ui-tile:#E7E5DF;
  --glaze-clay:#C9825E;--glaze-chalk:#DED7C8;--glaze-ash:#8B8579;
}
/* gallery-look */

.os{font-family:"Archivo",system-ui,-apple-system,sans-serif;color:var(--swatch-1);background:var(--swatch-2);-webkit-font-smoothing:antialiased}
.os-serif{font-family:"Playfair Display",Georgia,serif}
.os-mono{font-family:"DM Mono",ui-monospace,monospace}
.os-strip{scrollbar-width:none}
.os-strip::-webkit-scrollbar{display:none}
\`\`\`

## src/components/online-store/orderParts.jsx
\`\`\`jsx
import { useState } from 'react';
import { SHIPPING, euro } from './format';

export function usePay(onCheckout) {
  const [paying, setPaying] = useState(false);
  const [failed, setFailed] = useState(false);
  const pay = async (customer) => {
    setPaying(true);
    setFailed(false);
    try {
      await onCheckout(customer);
    } catch {
      setFailed(true);
    } finally {
      setPaying(false);
    }
  };
  return { paying, failed, pay };
}

export const orderHeading = (placed, lines, count) =>
  (placed && !lines.length ? 'ORDER RECEIVED — THANK YOU' : \`YOUR ORDER — \${count} ITEM\${count === 1 ? '' : 'S'}\`);

export const confirmation = (placed) => \`We’ve saved your order and will be in touch at \${placed.email}.\`;

/** The cart lines and shipping; \`Row\` is a span where the list sits inside a button. */
export function OrderLines({ lines, Row = 'p' }) {
  return (
    <>
      {lines.map((l) => (
        <Row key={l.id} className="flex justify-between gap-[12px]">
          <span>{l.product.name} — {l.glaze}, {l.size}{l.quantity > 1 && \` × \${l.quantity}\`}</span>
          <span>{euro(l.product.price * l.quantity)}</span>
        </Row>
      ))}
      {lines.length > 0 && <Row className="flex justify-between gap-[12px]"><span>Shipping — Europe</span><span>{euro(SHIPPING)}</span></Row>}
    </>
  );
}
\`\`\`

## src/components/online-store/OrderSummary.jsx
\`\`\`jsx
import FadeUp from './FadeUp';
import CheckoutSheet from './CheckoutSheet';
import { OrderLines, confirmation, orderHeading } from './orderParts';
import { euro } from './format';
import { useMobile } from './useMobile';

/** The order beside a product; checkout itself happens in the cart panel, which collects the customer. */
export default function OrderSummary({ lines, count, total, placed, onCheckout }) {
  const mobile = useMobile();
  const done = placed && !lines.length;
  if (mobile) return <CheckoutSheet lines={lines} count={count} total={total} placed={placed} onCheckout={onCheckout} />;

  return (
    <FadeUp viewport={{ amount: 'all' }} className="bg-[var(--swatch-3)] px-[max(29px,2.2656vw)] py-[max(28px,2.1875vw)] text-[var(--swatch-2)]">
      <p className="os-mono text-[max(16px,1.25vw)] leading-none tracking-[0.16em]">{orderHeading(placed, lines, count)}</p>
      {done ? (
        <p className="mt-[max(14px,1.0937vw)] text-[max(17.6px,1.375vw)] leading-[max(26.7px,2.0859vw)]">{confirmation(placed)}</p>
      ) : (
        <>
          <div className="mt-[max(6px,0.4687vw)] text-[max(17.6px,1.375vw)] leading-[max(34px,2.6562vw)]"><OrderLines lines={lines} /></div>
          <div className="mt-[max(13px,1.0156vw)] h-[max(1.5px,0.1171vw)] bg-[var(--swatch-2)]" />
          <div className="mt-[max(17px,1.3281vw)] flex items-baseline justify-between leading-none">
            <span className="os-serif text-[max(27.2px,2.125vw)] uppercase">Total</span>
            <span className="os-mono text-[max(27.2px,2.125vw)]">{euro(total)}</span>
          </div>
          <button type="button" disabled={!lines.length} onClick={onCheckout}
            className="os-mono mt-[max(24px,1.875vw)] h-[max(44px,3.4375vw)] w-full rounded-full bg-[var(--swatch-2)] text-[max(14.4px,1.125vw)] tracking-[0.16em] text-[var(--swatch-3)] disabled:opacity-60">
            CONTINUE TO PAYMENT
          </button>
        </>
      )}
    </FadeUp>
  );
}
\`\`\`

## src/components/online-store/Photo.jsx
\`\`\`jsx
export default function Photo({ src, alt, className = '' }) {
  return src
    ? <img src={src} alt={alt} className={\`object-cover \${className}\`} />
    : <div role="img" aria-label={alt} className={\`bg-[var(--ui-tile)] \${className}\`} />;
}

export function Tag({ children }) {
  return (
    <span className="os-mono absolute left-[max(13px,1.0156vw)] top-[max(13px,1.0156vw)] flex h-[max(29px,2.2656vw)] items-center rounded-full bg-[var(--swatch-3)] px-[max(13px,1.0156vw)] text-[14px] uppercase md:text-[max(13.6px,1.0625vw)] tracking-[0.16em] text-[var(--swatch-2)]">
      {children}
    </span>
  );
}
\`\`\`

## src/components/online-store/ProductDetail.jsx
\`\`\`jsx
import { useState } from 'react';
import Photo, { Tag } from './Photo';
import { DEFAULT_VARIANT, GLAZES, SIZES, euro } from './format';

const pad = (n) => String(n).padStart(2, '0');
const LABEL = 'os-mono text-[15px] leading-none tracking-[0.16em] md:text-[max(16px,1.25vw)]';

function Pill({ active, onClick, className, children }) {
  return (
    <button type="button" onClick={onClick}
      className={\`os-mono flex h-[44px] items-center rounded-full border-[max(1.5px,0.1171vw)] border-[var(--swatch-3)] text-[14px] md:h-[max(38px,2.9687vw)] md:text-[max(13.6px,1.0625vw)] uppercase tracking-[0.16em] transition-colors \${active ? 'bg-[var(--swatch-3)] text-[var(--swatch-2)]' : ''} \${className}\`}>
      {children}
    </button>
  );
}

/** A product with its variants; given the cart \`line\` just added, picking a variant changes that line. */
export default function ProductDetail({ product, position, total, line, onChange, onAdd, children }) {
  const [variant, setVariant] = useState(() => (line ? { glaze: line.glaze, size: line.size } : DEFAULT_VARIANT));
  const choose = (patch) => {
    setVariant((v) => ({ ...v, ...patch }));
    if (line) onChange(line, patch);
  };

  return (
    <section className="flex flex-col gap-[28px] px-[20px] pb-[200px] pt-[96px] md:px-[max(57px,4.4531vw)] md:pb-[max(120px,9.375vw)] md:pt-[max(88px,6.875vw)] lg:flex-row lg:gap-[max(51px,3.9843vw)]">
      <div className="relative aspect-[1/1.1] w-full flex-none md:max-w-[max(585px,45.7031vw)] lg:aspect-auto lg:h-[max(575px,44.9218vw)] lg:w-[min(max(585px,45.7031vw),calc(100%-max(480px,37.5vw)))]">
        <Photo src={product.image} alt={product.name} className="h-full w-full rounded-[3px]" />
        {product.tag && <Tag>{product.tag}</Tag>}
      </div>
      <div className="min-w-0 flex-1 text-[var(--swatch-3)]">
        <p className={\`\${LABEL} uppercase\`}>{product.category} — {pad(position)} / {pad(total)}</p>
        <h1 className="os-serif mt-[max(18px,1.4062vw)] text-[44px] uppercase leading-[44px] md:text-[max(61px,4.7656vw)] md:leading-[max(60px,4.6875vw)]">
          {product.name.split(' ').map((word) => <span key={word} className="block">{word}</span>)}
        </h1>
        <p className="os-mono mt-[max(23px,1.7968vw)] text-[26px] leading-none md:text-[max(24px,1.875vw)] text-[var(--swatch-1)]">{euro(product.price)}</p>
        <p className="mt-[max(20px,1.5625vw)] max-w-[max(440px,34.375vw)] text-[18px] leading-[27px] md:text-[max(17.6px,1.375vw)] md:leading-[max(26.7px,2.0859vw)] text-[var(--swatch-1)]">{product.description}</p>
        <p className={\`\${LABEL} mt-[max(31px,2.4218vw)]\`}>GLAZE</p>
        <div className="mt-[max(12px,0.9375vw)] flex flex-wrap gap-[max(9px,0.7031vw)]">
          {GLAZES.map((g) => (
            <Pill key={g.name} active={variant.glaze === g.name} onClick={() => choose({ glaze: g.name })} className="gap-[max(8px,0.625vw)] pl-[max(10px,0.7812vw)] pr-[max(17px,1.3281vw)]">
              <span className="h-[max(17px,1.3281vw)] w-[max(17px,1.3281vw)] rounded-full" style={{ background: g.color }} />{g.name}
            </Pill>
          ))}
        </div>
        <p className={\`\${LABEL} mt-[max(24px,1.875vw)]\`}>SIZE</p>
        <div className="mt-[max(10px,0.7812vw)] flex flex-wrap gap-[max(9px,0.7031vw)]">
          {SIZES.map((size) => (
            <Pill key={size} active={variant.size === size} onClick={() => choose({ size })} className="px-[max(20px,1.5625vw)]">{size}</Pill>
          ))}
        </div>
        <button type="button" onClick={() => onAdd(product, variant)} className="os-mono mt-[max(24px,1.875vw)] h-[max(44px,3.4375vw)] rounded-full bg-[var(--swatch-3)] px-[max(28px,2.1875vw)] text-[max(14.4px,1.125vw)] tracking-[0.16em] text-[var(--swatch-2)] hover:bg-[var(--swatch-4)]">
          {line ? 'ADD ANOTHER' : 'ADD TO CART'}
        </button>
        <div className="mt-[max(37px,2.8906vw)]">{children}</div>
      </div>
    </section>
  );
}
\`\`\`

## src/components/online-store/seed.js
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

## src/components/online-store/Shapes.jsx
\`\`\`jsx
const JUG = 'M158 0H282V67C360 70 394 100 394 150C394 163 392 173 390 182C425 205 440 235 440 268C440 330 380 420 277 556H163C60 420 0 330 0 268C0 235 15 205 50 182C48 173 46 163 46 150C46 100 80 70 158 67ZM75 128C85 108 118 96 158 95V112C125 113 97 120 75 128ZM365 128C355 108 322 96 282 95V112C315 113 343 120 365 128Z';
const BUD_VASE = 'M15 0H35V5H30V18C42 22 50 34 50 46C50 60 44 70 40 77H10C6 70 0 60 0 46C0 34 8 22 20 18V5H15Z';

/** The two-handled jug: the cart icon and the footer's vessel. */
export const Jug = ({ className }) => (
  <svg viewBox="0 0 440 556" className={className} aria-hidden="true"><path d={JUG} fill="currentColor" fillRule="evenodd" /></svg>
);

export const BudVase = ({ className }) => (
  <svg viewBox="0 0 50 77" className={className} aria-hidden="true"><path d={BUD_VASE} fill="currentColor" /></svg>
);
\`\`\`

## src/components/online-store/Shop.jsx
\`\`\`jsx
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import FadeUp from './FadeUp';
import Note from './Note';
import Photo, { Tag } from './Photo';
import { euro } from './format';
import { useMobile } from './useMobile';

const FILTERS = [['ALL', null], ['TABLEWARE', 'Tableware'], ['VESSELS', 'Vessels']];

export default function Shop({ products, status, onRetry, onAdd, onOpen }) {
  const [category, setCategory] = useState(null);
  const [hovered, setHovered] = useState(null);
  const [added, setAdded] = useState(null);
  const mobile = useMobile();
  const shown = category ? products.filter((p) => p.category === category) : products;
  const add = (p) => { setAdded(p.id); onAdd(p); };

  return (
    <section data-section="shop" className="px-[20px] pt-[64px] md:px-[max(57px,4.4531vw)] md:pt-[max(79px,6.1718vw)]">
      <FadeUp className="mb-[32px] flex flex-wrap items-end justify-between gap-y-[24px] max-md:flex-col max-md:items-stretch max-md:gap-y-[20px] md:mb-[max(49px,3.8281vw)]">
        <h2 className="os-serif text-[min(44px,10.5vw)] uppercase leading-[46px] text-[var(--swatch-3)] md:text-[max(60.8px,4.75vw)] md:leading-none">The <br className="md:hidden" />collection</h2>
        <div className="os-strip flex gap-[max(9px,0.7031vw)] pb-[3px] max-md:-mx-[20px] max-md:overflow-x-auto max-md:px-[20px]">
          {FILTERS.map(([label, value]) => (
            <button key={label} type="button" onClick={() => setCategory(value)}
              className={\`os-mono h-[44px] flex-none rounded-full border-[max(1.5px,0.1171vw)] border-[var(--swatch-3)] px-[max(24px,1.875vw)] text-[14px] tracking-[0.16em] transition-colors md:h-[max(39px,3.0468vw)] md:text-[max(13.6px,1.0625vw)] \${category === value ? 'bg-[var(--swatch-3)] text-[var(--swatch-2)]' : 'text-[var(--swatch-3)]'}\`}>
              {label}
            </button>
          ))}
        </div>
      </FadeUp>
      {status === 'loading' && <Note className="text-[var(--swatch-3)]">LOADING THE COLLECTION…</Note>}
      {status === 'error' && <Note onRetry={onRetry} className="text-[var(--swatch-3)]">COULDN’T LOAD THE COLLECTION</Note>}
      {status === 'ready' && !shown.length && <Note className="text-[var(--swatch-3)]">NOTHING HERE YET — NEW PIECES SOON</Note>}
      <div className="grid grid-cols-2 gap-x-[16px] gap-y-[28px] md:grid-cols-3 md:gap-x-[max(29px,2.2656vw)] md:gap-y-[max(44px,3.4375vw)]">
        {shown.map((p) => (
          <FadeUp key={p.id} data-product={p.name} onMouseEnter={() => setHovered(p.id)} onMouseLeave={() => setHovered(null)}>
            <div className="relative cursor-pointer" onClick={() => onOpen(p)}>
              <Photo src={p.image} alt={p.name} className="aspect-[1/1.04] w-full rounded-[3px]" />
              {p.tag && <Tag>{p.tag}</Tag>}
              <div className="pointer-events-none absolute inset-x-0 bottom-[max(16px,1.25vw)] flex justify-center max-md:hidden">
                <AnimatePresence>
                  {hovered === p.id && (
                    <motion.button type="button" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
                      onClick={(e) => { e.stopPropagation(); onAdd(p); }}
                      className="os-mono pointer-events-auto h-[max(37px,2.8906vw)] rounded-full bg-[var(--swatch-3)] px-[max(23px,1.7968vw)] text-[max(14.4px,1.125vw)] tracking-[0.16em] text-[var(--swatch-2)] hover:bg-[var(--swatch-4)]">
                      ADD TO CART
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>
            </div>
            <div className="mt-[14px] flex items-baseline justify-between leading-none max-md:flex-col max-md:items-start max-md:gap-[10px] md:mt-[max(19px,1.4843vw)]">
              <button type="button" onClick={() => onOpen(p)} className="os-serif text-left text-[22px] md:text-[max(25.6px,2vw)]">{p.name}</button>
              <span className="os-mono text-[20px] text-[var(--swatch-3)] md:text-[max(20.8px,1.625vw)]">{euro(p.price)}</span>
            </div>
            {mobile && (
              <button type="button" onClick={() => add(p)}
                className={\`os-mono mt-[14px] h-[44px] w-full rounded-full border-[1.5px] border-[var(--swatch-3)] text-[14px] tracking-[0.16em] transition-colors \${added === p.id ? 'bg-[var(--swatch-3)] text-[var(--swatch-2)]' : 'text-[var(--swatch-3)]'}\`}>
                {added === p.id ? 'ADDED' : 'ADD TO CART'}
              </button>
            )}
          </FadeUp>
        ))}
      </div>
    </section>
  );
}
\`\`\`

## src/components/online-store/useAccount.js
\`\`\`js
import { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';

/** The signed-in shopper and their orders; signed out, Log In sends them to sign in and back here. */
export function useAccount() {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState(null); // null until the account opens
  const [open, setOpen] = useState(false);

  useEffect(() => {
    base44.auth.me().then(setUser, () => setUser(null));
  }, []);

  const show = async () => {
    setOpen(true);
    setOrders(null);
    setOrders(await base44.entities.Order.filter({ created_by_id: user.id }, '-created_date', 50).catch(() => []));
  };

  return {
    user,
    orders,
    open,
    close: () => setOpen(false),
    logIn: () => base44.auth.redirectToLogin(window.location.href),
    logOut: () => base44.auth.logout(window.location.href),
    show,
  };
}
\`\`\`

## src/components/online-store/useMobile.js
\`\`\`js
import { useEffect, useState } from 'react';

const QUERY = '(max-width: 767px)';

/** Phones: the portrait aperture and the docked checkout sheet. */
export function useMobile() {
  const [mobile, setMobile] = useState(() => typeof window !== 'undefined' && Boolean(window.matchMedia?.(QUERY).matches));
  useEffect(() => {
    const mq = window.matchMedia?.(QUERY);
    if (!mq) return undefined;
    const on = () => setMobile(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return mobile;
}
\`\`\`

## src/components/online-store/useStore.js
\`\`\`js
import { useCallback, useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { IMAGES } from './images';
import { DEFAULT_VARIANT, SHIPPING } from './format';
import { loadSeeded } from './seed';

// Grid order: a tableware row, then a vessels row, twice (the Round Jug is 05 / 12).
const PRODUCTS = [
  ['Lip Mug', 38, 'Tableware', 'lipMug', 'A straight, sturdy mug with a soft rolled lip, sized for a long morning coffee.'],
  ['Everyday Bowl', 44, 'Tableware', 'everydayBowl', 'A deep, generous bowl for soup, salad or the fruit on the counter.'],
  ['Dinner Plate', 52, 'Tableware', 'dinnerPlate', 'A wide plate with a low rim, glazed in overlapping washes so no two match.', 'New'],
  ['Bud Vase', 42, 'Vessels', 'budVase', 'A small vase with a narrow neck, made to hold a single stem upright.'],
  ['Round Jug', 58, 'Vessels', 'roundJug', 'A low, wide jug for water or a handful of stems. Glazed over the lip, raw at the foot.', 'New'],
  ['Stem Vase', 68, 'Vessels', 'stemVase', 'A sculptural vase with a looping handle, for one branch or nothing at all.'],
  ['Footed Cup', 34, 'Tableware', 'footedCup', 'A wide cup on a raw-clay foot, for tea, berries or a single scoop.'],
  ['Tripod Bowl', 30, 'Tableware', 'tripodBowl', 'A small speckled bowl on three hand-rolled legs, for olives or nuts.'],
  ['Pinch Pot', 36, 'Tableware', 'pinchPot', 'A palm-sized pot shaped by hand, for salt, rings or keys.'],
  ['Ring Vase', 74, 'Vessels', 'ringVase', 'An upright vase pierced through the middle, glazed down one side.'],
  ['Bottle Vase', 62, 'Vessels', 'bottleVase', 'A soft-shouldered bottle with a narrow neck, for a single dried stem.'],
  ['Twist Vase', 88, 'Vessels', 'twistVase', 'A tall vessel turned by hand while still soft, in raw red clay and ash glaze.'],
].map(([name, price, category, image, description, tag = ''], i) => ({ name, price, category, description, tag, image: IMAGES[image], position: i + 1 }));

const POSTS = [
  ['Ash glaze, six firings', 'journalAshGlaze', 'Our ash glaze starts as the grate of the studio stove: sieved, washed three times and mixed with feldspar and a little clay.\\n\\nIt took six firings to stop it running off the foot. The answer was a thinner coat and a slower cool, which is why every Ash piece carries a faint river where the glaze pooled.'],
  ['Why we sell in batches', 'journalBatches', 'We throw, trim and fire twelve pieces at a time, then sell them until they are gone.\\n\\nWorking in batches keeps the kiln full and the glazes honest: each one is mixed for that firing, so no two batches match exactly. When a batch sells out, the next one is already drying on the shelves.'],
  ['Wedging clay by hand', 'journalWedging', 'Before anything reaches the wheel, every kilo of clay is wedged by hand: folded and pressed a hundred times to push the air out and even the moisture.\\n\\nIt is the quietest part of the day, and the one that decides whether a pot survives the kiln.'],
].map(([title, image, body], i) => ({ title, image: IMAGES[image], body, position: i + 1 }));

const byPosition = (rows) => [...rows].sort((a, b) => (a.position ?? 0) - (b.position ?? 0));

// The cart is this browser's own, like a shop's session cart; an order is saved only at checkout.
const CART_KEY = 'terra-alba-cart';
const lineId = () => Math.random().toString(36).slice(2);
const savedCart = () => {
  try {
    return (JSON.parse(localStorage.getItem(CART_KEY)) ?? []).map((line) => ({ id: lineId(), ...line }));
  } catch {
    return [];
  }
};
// One line per product and variant: a second glaze or size is its own line.
const sameItem = (a, b) => a.product_id === b.product_id && a.glaze === b.glaze && a.size === b.size;

export function useStore() {
  const [products, setProducts] = useState([]);
  const [posts, setPosts] = useState([]);
  const [cart, setCart] = useState(savedCart);
  const [status, setStatus] = useState('loading');
  const [placed, setPlaced] = useState(null);

  const load = useCallback(async () => {
    setStatus('loading');
    try {
      const { Product, JournalPost } = await loadSeeded({ Product: { samples: PRODUCTS, key: 'name' }, JournalPost: { samples: POSTS, key: 'title' } });
      setProducts(byPosition(Product));
      setPosts(byPosition(JournalPost));
      setStatus('ready');
    } catch {
      setStatus('error');
    }
  }, []);
  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
    } catch { /* storage unavailable: the cart lasts for this visit */ }
  }, [cart]);

  const lines = cart.map((line) => ({ ...line, product: products.find((p) => p.id === line.product_id) })).filter((line) => line.product);
  const subtotal = lines.reduce((sum, l) => sum + l.product.price * l.quantity, 0);
  const total = lines.length ? subtotal + SHIPPING : 0;

  // A variant change that matches another line merges into it.
  const updateLine = (line, patch) => setCart((rows) => {
    const next = { ...rows.find((r) => r.id === line.id), ...patch };
    const twin = rows.find((r) => r.id !== line.id && sameItem(r, next));
    if (!twin) return rows.map((r) => (r.id === line.id ? next : r));
    return rows.filter((r) => r.id !== twin.id).map((r) => (r.id === line.id ? { ...next, quantity: next.quantity + twin.quantity } : r));
  });

  return {
    products,
    posts,
    status,
    reload: load,
    placed,
    cart,
    lines,
    subtotal,
    total,
    count: lines.reduce((sum, l) => sum + l.quantity, 0),
    updateLine,
    removeLine: (line) => setCart((rows) => rows.filter((r) => r.id !== line.id)),
    /** Returns the id of the line it added to. */
    addToCart: (product, variant = DEFAULT_VARIANT) => {
      const item = { product_id: product.id, glaze: variant.glaze, size: variant.size };
      const id = cart.find((l) => sameItem(l, item))?.id ?? lineId();
      setCart((rows) => (rows.some((l) => l.id === id)
        ? rows.map((l) => (l.id === id ? { ...l, quantity: l.quantity + 1 } : l))
        : [...rows, { id, ...item, quantity: 1 }]));
      return id;
    },
    checkout: async (customer) => {
      const order = lines.map((l) => ({ name: l.product.name, glaze: l.glaze, size: l.size, quantity: l.quantity, price: l.product.price }));
      await base44.entities.Order.create({ ...customer, lines: order, total, status: 'pending' });
      setCart([]);
      setPlaced(customer);
    },
    subscribe: (email) => base44.entities.Subscriber.create({ email }),
  };
}
\`\`\`

## src/components/online-store/useStorefrontView.js
\`\`\`js
import { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useScrollKey, useUrlParam } from './useUrlParam';

// The middle of the header pills (at 1280px; wider, they grow with the window): they take the colors of whatever section sits under this line.
const PILL_MIDDLE = 38;

export function useStorefrontView(scrollRef) {
  // The open product lives in the URL (?product=…), so Back returns to the store and a product link can be shared.
  const [productId, setProductId] = useUrlParam('product');
  const view = useMemo(() => (productId ? { name: 'product', id: productId } : { name: 'store' }), [productId]);
  const [scrollY, setScrollY] = useState(0);
  const [onAccent, setOnAccent] = useState(true);
  const pending = useRef(null);
  const fresh = useRef(true);
  const scrollKey = useScrollKey(productId);

  const sync = useCallback(() => {
    const el = scrollRef.current;
    const line = el.getBoundingClientRect().top + PILL_MIDDLE * Math.max(1, window.innerWidth / 1280);
    setScrollY(el.scrollTop);
    const under = (s) => {
      const r = s.getBoundingClientRect();
      return r.top <= line && r.bottom > line;
    };
    // [data-cream] marks a cream block inside an accent section (the phone aperture).
    setOnAccent([...el.querySelectorAll('[data-accent]')].some(under) && ![...el.querySelectorAll('[data-cream]')].some(under));
  }, [scrollRef]);

  const sectionTop = (name) => (name && scrollRef.current.querySelector(\`[data-section="\${name}"]\`)?.offsetTop) || 0;

  // A new view opens at its top, or at the section a nav pill asked for.
  useLayoutEffect(() => {
    scrollRef.current.scrollTop = view.name === 'store' ? sectionTop(pending.current) : 0;
    pending.current = null;
    fresh.current = false;
    sync();
  }, [view]);

  return {
    view,
    scrollKey,
    scrollY,
    onAccent,
    sync,
    fresh: fresh.current,
    openProduct: (id) => setProductId(id),
    goTo: (section) => {
      if (view.name !== 'store') {
        pending.current = section;
        setProductId(null);
        return;
      }
      scrollRef.current.scrollTo({ top: sectionTop(section), behavior: 'smooth' });
    },
  };
}
\`\`\`

## src/components/online-store/useUrlParam.js
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

## src/components/online-store/VesselFooter.jsx
\`\`\`jsx
import FadeUp from './FadeUp';
import Photo from './Photo';
import { Jug } from './Shapes';
import { IMAGES } from './images';

export default function VesselFooter() {
  return (
    <footer className="relative h-[420px] overflow-hidden md:h-[max(496px,38.75vw)]">
      <Photo src={IMAGES.vessel} alt="Stoneware cups and bowls in the studio" className="absolute inset-0 h-full w-full scale-105 blur-[5px]" />
      <FadeUp className="absolute left-[calc(50%-133px)] top-[42px] h-[336px] w-[266px] text-[var(--swatch-3)] md:left-[calc(50%-max(147px,11.4843vw))] md:top-[max(58px,4.5312vw)] md:h-[max(371px,28.9843vw)] md:w-[max(293px,22.8906vw)]">
        <Jug className="h-full w-full" />
        <div className="absolute inset-x-0 top-[112px] text-center md:top-[max(124px,9.6875vw)] text-[var(--swatch-2)]">
          <p className="os-serif text-[26px] uppercase leading-[28px] md:text-[max(35.2px,2.75vw)] md:leading-[max(36.3px,2.8359vw)]">Twelve<br />pieces.<br />None twice.</p>
          <p className="os-mono mx-auto mt-[22px] max-w-[190px] text-[14px] leading-[18px] tracking-[0.16em] md:mt-[max(33px,2.5781vw)] md:max-w-none md:text-[max(10.4px,0.8125vw)] md:leading-none">NEW BATCH — AUTUMN GLAZES</p>
        </div>
      </FadeUp>
    </footer>
  );
}
\`\`\`

## src/pages/OnlineStore.jsx
\`\`\`jsx
import { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import '@/components/online-store/online-store.css';
import Header from '@/components/online-store/Header';
import Hero from '@/components/online-store/Hero';
import Shop from '@/components/online-store/Shop';
import About from '@/components/online-store/About';
import Journal from '@/components/online-store/Journal';
import Faq from '@/components/online-store/Faq';
import Newsletter from '@/components/online-store/Newsletter';
import VesselFooter from '@/components/online-store/VesselFooter';
import ProductDetail from '@/components/online-store/ProductDetail';
import OrderSummary from '@/components/online-store/OrderSummary';
import CartPanel from '@/components/online-store/CartPanel';
import Account from '@/components/online-store/Account';
import { useStore } from '@/components/online-store/useStore';
import { useAccount } from '@/components/online-store/useAccount';
import { useStorefrontView } from '@/components/online-store/useStorefrontView';

export default function OnlineStore() {
  const scrollRef = useRef(null);
  const store = useStore();
  const nav = useStorefrontView(scrollRef);
  const account = useAccount();
  const product = nav.view.name === 'product' && store.products.find((p) => p.id === nav.view.id);

  // A grid add opens the product with that cart line to refine (glaze, size); its own ADD TO CART adds another.
  const [editing, setEditing] = useState(null);
  const later = useRef(null);
  const cancelLater = () => clearTimeout(later.current);
  useEffect(() => cancelLater, [nav.view]); // any view change (another product, Back) drops a pending open
  const add = (p) => {
    setEditing(store.addToCart(p));
    // Let the cart count's bounce read before the order page opens.
    cancelLater();
    later.current = setTimeout(() => nav.openProduct(p.id), 700);
  };
  const open = (p) => { setEditing(null); nav.openProduct(p.id); };
  const goTo = (section) => { cancelLater(); nav.goTo(section); };
  const [cartOpen, setCartOpen] = useState(false);
  const openCart = () => { cancelLater(); setCartOpen(true); };
  const closeCart = useCallback(() => setCartOpen(false), []);

  return (
    <div ref={scrollRef} data-scroll data-scroll-restoration-id={\`os-\${nav.scrollKey}\`} onScroll={nav.sync} className="os relative h-screen overflow-y-auto overflow-x-hidden">
      <Header onAccent={nav.onAccent} count={store.count} onNav={goTo} onCart={openCart} account={{ ...account, show: () => { cancelLater(); account.show(); } }} />
      <motion.main key={product ? product.id : 'store'} initial={nav.fresh ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.35 }}>
        {product ? (
          <ProductDetail product={product} position={store.products.indexOf(product) + 1} total={store.products.length}
            line={store.cart.find((l) => l.id === editing && l.product_id === product.id)} onChange={store.updateLine}
            onAdd={(p, variant) => { setEditing(null); store.addToCart(p, variant); }}>
            <OrderSummary lines={store.lines} count={store.count} total={store.total} placed={store.placed} onCheckout={openCart} />
          </ProductDetail>
        ) : (
          <>
            <Hero scrollY={nav.scrollY} onShop={() => goTo('shop')} />
            <Shop products={store.products} status={store.status} onRetry={store.reload} onAdd={add} onOpen={open} />
            <About />
            <Journal posts={store.posts} status={store.status} onRetry={store.reload} />
            <Newsletter onJoin={store.subscribe} />
            <VesselFooter />
            <Faq />
          </>
        )}
      </motion.main>
      <Account account={account} />
      <CartPanel open={cartOpen} store={store} onClose={closeCart} onShop={() => { closeCart(); nav.goTo('shop'); }} />
    </div>
  );
}
\`\`\`
`;export{e as default};