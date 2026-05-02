// Shared atoms for the Terravoa marketplace UI kit
const { useState } = React;

// Country → ISO mapping for flagcdn
const tvCountryISO = {
  Italy: 'it', France: 'fr', Spain: 'es', Portugal: 'pt', Germany: 'de',
  Austria: 'at', Greece: 'gr', Switzerland: 'ch', Netherlands: 'nl', Belgium: 'be',
};
function tvFlagSrc(origin) {
  for (const [c, iso] of Object.entries(tvCountryISO)) {
    if (origin && origin.includes(c)) return `https://flagcdn.com/w20/${iso}.png`;
  }
  // also accept region names → country fallback
  const map = { Tuscany: 'it', 'Black Forest': 'de', Andalusia: 'es', Alentejo: 'pt', Provence: 'fr', Brittany: 'fr', Alsace: 'fr' };
  for (const [r, iso] of Object.entries(map)) if (origin && origin.includes(r)) return `https://flagcdn.com/w20/${iso}.png`;
  return null;
}

function TvFlag({ origin }) {
  const src = tvFlagSrc(origin);
  if (!src) return <span style={{fontSize:12}}>🌍</span>;
  return <img src={src} alt="" width={18} height={13} style={{ borderRadius:2, objectFit:'cover', display:'inline-block' }} />;
}

// Lucide-style minimal SVG icons (stroke 1.5, matching codebase)
const TvIcon = {
  ArrowRight: (p) => <svg width={p.size||16} height={p.size||16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>,
  ShoppingBag: (p) => <svg width={p.size||19} height={p.size||19} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>,
  UserCircle: (p) => <svg width={p.size||15} height={p.size||15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="10" r="3"/><path d="M7 20.66a8 8 0 0 1 10 0"/></svg>,
  Heart: (p) => <svg width={p.size||16} height={p.size||16} viewBox="0 0 24 24" fill={p.filled?"currentColor":"none"} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l7 7Z"/></svg>,
  Truck: (p) => <svg width={p.size||11} height={p.size||11} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/></svg>,
  BookOpen: (p) => <svg width={p.size||16} height={p.size||16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>,
  Search: (p) => <svg width={p.size||16} height={p.size||16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>,
  ChevronDown: (p) => <svg width={p.size||14} height={p.size||14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>,
  Plus: (p) => <svg width={p.size||16} height={p.size||16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>,
  Minus: (p) => <svg width={p.size||16} height={p.size||16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/></svg>,
};

const tvBadgeStyle = (variant) => {
  switch (variant) {
    case 'producer': return { bg: '#feddb3', fg: '#342306', border: 'transparent' };
    case 'bestseller': return { bg: '#182a1b', fg: '#ffffff', border: 'transparent' };
    case 'new': return { bg: 'rgba(193,68,14,.12)', fg: '#c1440e', border: 'rgba(193,68,14,.25)' };
    case 'limited': return { bg: 'rgba(92,45,110,.12)', fg: '#5c2d6e', border: 'rgba(92,45,110,.25)' };
    case 'seasonal': return { bg: 'rgba(90,122,82,.12)', fg: '#5a7a52', border: 'rgba(90,122,82,.25)' };
    case 'sale': return { bg: 'rgba(184,50,50,.12)', fg: '#b83232', border: 'rgba(184,50,50,.25)' };
    default: return { bg: '#feddb3', fg: '#342306', border: 'transparent' };
  }
};

function TvBadge({ label, variant = 'producer' }) {
  const s = tvBadgeStyle(variant);
  return <span style={{ display:'inline-block', padding:'6px 12px', borderRadius:9999, background:s.bg, color:s.fg, border:`1px solid ${s.border}`, fontSize:10, textTransform:'uppercase', letterSpacing:'.1em', fontWeight:500, fontFamily:'Manrope, sans-serif' }}>{label}</span>;
}

function TvButton({ kind = 'primary', children, onClick, icon }) {
  const base = { display:'inline-flex', alignItems:'center', justifyContent:'center', gap:8, fontFamily:'Manrope, sans-serif', fontWeight:500, fontSize:13, letterSpacing:'.02em', padding:'14px 28px', borderRadius:9999, border:'none', cursor:'pointer', transition:'all .3s', minWidth:180 };
  const styles = {
    primary: { ...base, background:'linear-gradient(180deg,#182a1b,#2d4030)', color:'#fff' },
    secondary: { ...base, background:'#e9e8e5', color:'#1a1c1a' },
    outlineLight: { ...base, background:'transparent', color:'#fff', border:'1px solid rgba(255,255,255,.6)' },
    outlineDark: { ...base, background:'transparent', color:'#182a1b', border:'1px solid rgba(24,42,27,.25)', minWidth:0, padding:'8px 16px', fontSize:11, textTransform:'uppercase', letterSpacing:'.15em', fontWeight:600 },
  };
  return <button style={styles[kind]} onClick={onClick}>{children}{icon}</button>;
}

function TvEyebrow({ children, color='#944925', tracking='.15em', size=11 }) {
  return <span style={{ fontFamily:'Manrope, sans-serif', fontSize:size, textTransform:'uppercase', letterSpacing:tracking, color, fontWeight:500 }}>{children}</span>;
}

Object.assign(window, { TvFlag, TvIcon, TvBadge, TvButton, TvEyebrow });
