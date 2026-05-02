// Hero, EuropeStrip, RegionCards, StoryOfTheWeek, ProducerCTA — homepage modules
function TvHero({ onShopClick, onProducersClick }) {
  return (
    <section style={{ position:'relative', minHeight:600, display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden', textAlign:'center' }}>
      <div style={{ position:'absolute', inset:0, zIndex:0 }}>
        <img src="../../assets/hero/hero-landscape.png" alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(180deg, rgba(24,42,27,.4) 0%, rgba(24,42,27,.2) 50%, rgba(24,42,27,.6) 100%)' }} />
        <div style={{ position:'absolute', inset:0, background:'rgba(24,42,27,.15)' }} />
      </div>
      <div style={{ position:'relative', zIndex:10, maxWidth:768, padding:'120px 24px' }}>
        <span style={{ display:'inline-block', fontFamily:'Manrope, sans-serif', fontSize:10, textTransform:'uppercase', letterSpacing:'.35em', color:'rgba(255,255,255,.7)', marginBottom:24 }}>Established 2024</span>
        <h1 style={{ fontFamily:'"Noto Serif", serif', fontSize:72, color:'#fff', lineHeight:1.05, fontWeight:400, margin:'0 0 24px', letterSpacing:'-.01em' }}>Taste the Origin</h1>
        <p style={{ fontSize:18, color:'rgba(255,255,255,.9)', maxWidth:520, margin:'0 auto 12px', lineHeight:1.6, fontFamily:'Manrope, sans-serif', fontWeight:300 }}>Discover exceptional foods from Europe's finest producers — carefully selected and delivered directly from their source.</p>
        <p style={{ fontFamily:'"Noto Serif", serif', fontStyle:'italic', color:'rgba(255,255,255,.6)', fontSize:14, marginBottom:40, letterSpacing:'.02em' }}>— From Brittany's salt marshes to the Black Forest, from the Alps to the Atlantic coast. —</p>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:16, flexWrap:'wrap' }}>
          <TvButton kind="primary" onClick={onShopClick}>Shop products</TvButton>
          <TvButton kind="outlineLight" onClick={onProducersClick}>Discover producers</TvButton>
        </div>
      </div>
    </section>
  );
}

const tvOrigins = [
  { region: 'Brittany', products: 'Fleur de sel, salted caramel, butter biscuits' },
  { region: 'Alsace', products: 'Mustard, charcuterie, Christmas spices' },
  { region: 'Provence', products: 'Lavender, cold-process savon, herbs de Provence' },
  { region: 'Black Forest', products: 'Wildflower honey, smoked ham, spiced cakes' },
  { region: 'Tuscany', products: 'Cold-pressed olive oil, truffles, pecorino' },
  { region: 'Andalusia', products: 'Paprika, saffron, sun-dried preserves' },
  { region: 'Alentejo', products: 'Sheep cheese, cork, single-estate wine' },
  { region: 'Basque Country', products: "Txakoli, piment d'Espelette, anchovies" },
];

function TvEuropeStrip() {
  return (
    <section style={{ padding:'64px 64px', background:'#f4f3f1', borderTop:'1px solid rgba(195,200,192,.1)', borderBottom:'1px solid rgba(195,200,192,.1)' }}>
      <div style={{ maxWidth:960, margin:'0 auto' }}>
        <p style={{ fontFamily:'Manrope, sans-serif', fontSize:10, textTransform:'uppercase', letterSpacing:'.25em', color:'#944925', marginBottom:24, textAlign:'center' }}>From every corner of Europe</p>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:1, background:'rgba(195,200,192,.1)' }}>
          {tvOrigins.map(o => (
            <div key={o.region} style={{ background:'#f4f3f1', padding:'20px' }}>
              <p style={{ fontFamily:'"Noto Serif", serif', fontSize:14, color:'#182a1b', margin:'0 0 4px' }}>{o.region}</p>
              <p style={{ fontFamily:'Manrope, sans-serif', fontSize:11, color:'#434842', lineHeight:1.6, margin:0 }}>{o.products}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TvRegionCard({ name, specialty, imageSrc, onClick }) {
  const [hover, setHover] = useState(false);
  return (
    <div onClick={onClick} onMouseEnter={()=>setHover(true)} onMouseLeave={()=>setHover(false)} style={{ position:'relative', height:260, borderRadius:24, overflow:'hidden', color:'#fff', cursor:'pointer' }}>
      <img src={imageSrc} alt={name} style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover', transform: hover?'scale(1.10)':'scale(1)', transition:'transform 700ms cubic-bezier(.4,0,.2,1)' }} />
      <div style={{ position:'absolute', inset:0, background:'rgba(0,0,0,.3)' }} />
      <div style={{ position:'absolute', inset:'auto auto 24px 24px', zIndex:2 }}>
        <h3 style={{ fontFamily:'"Noto Serif", serif', fontSize:28, color:'#fff', margin:'0 0 4px', fontWeight:400 }}>{name}</h3>
        <p style={{ fontFamily:'Manrope, sans-serif', fontSize:10, textTransform:'uppercase', letterSpacing:'.15em', color:'rgba(255,255,255,.85)', margin:0 }}>{specialty}</p>
      </div>
    </div>
  );
}

function TvRegionalArchives({ onRegion }) {
  const regions = [
    { name:'Tuscany', specialty:'Olive Oil · Truffles · Pasta', imageSrc:'../../assets/regions/italy.jpg' },
    { name:'Black Forest', specialty:'Wildflower Honey · Smoked Ham', imageSrc:'../../assets/regions/germany.jpg' },
    { name:'Andalusia', specialty:'Paprika · Saffron · Preserves', imageSrc:'../../assets/regions/spain-seville.jpg' },
    { name:'Alentejo', specialty:'Cork · Wine · Sheep Cheese', imageSrc:'../../assets/regions/portugal.jpg' },
    { name:'Provence', specialty:'Lavender · Olive Oil · Herbs', imageSrc:'../../assets/regions/france-lavender.jpg' },
    { name:'Brittany', specialty:'Fleur de Sel · Salted Caramel', imageSrc:'https://picsum.photos/seed/brittany-coast/800/600' },
  ];
  return (
    <section style={{ padding:'96px 64px', background:'#faf9f6' }}>
      <div style={{ textAlign:'center', marginBottom:64 }}>
        <h2 style={{ fontFamily:'"Noto Serif", serif', fontSize:36, color:'#182a1b', fontWeight:400, margin:'0 0 16px' }}>Regional archives</h2>
        <p style={{ fontFamily:'Manrope, sans-serif', color:'#434842', maxWidth:560, margin:'0 auto', textTransform:'uppercase', letterSpacing:'.15em', fontSize:11 }}>One thousand years of know-how, one search away</p>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:16 }}>
        {regions.map(r => <TvRegionCard key={r.name} {...r} onClick={()=>onRegion && onRegion(r)} />)}
      </div>
    </section>
  );
}

function TvStoryOfTheWeek({ story, onRead }) {
  return (
    <section style={{ padding:'96px 64px', background:'#f4f3f1', overflow:'hidden' }}>
      <div style={{ maxWidth:1120, margin:'0 auto', display:'grid', gridTemplateColumns:'5fr 7fr', gap:64, alignItems:'center' }}>
        <div style={{ position:'relative' }}>
          <div style={{ aspectRatio:'3/4', borderRadius:16, overflow:'hidden', boxShadow:'0 30px 60px rgba(26,28,26,.12)', position:'relative', zIndex:10, transform:'rotate(-2deg)' }}>
            <img src={story.imageSrc} alt={story.imageAlt} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
          </div>
          <div style={{ position:'absolute', bottom:-32, right:-32, width:192, height:192, background:'rgba(254,158,114,.1)', borderRadius:9999, filter:'blur(48px)', zIndex:0 }} />
        </div>
        <div style={{ display:'flex', flexDirection:'column', justifyContent:'center' }}>
          <div style={{ display:'flex', alignItems:'center', gap:16, marginBottom:24 }}>
            <div style={{ height:1, width:48, background:'#944925' }} />
            <span style={{ fontFamily:'Manrope, sans-serif', fontSize:11, textTransform:'uppercase', letterSpacing:'.15em', color:'#944925', fontWeight:700 }}>Story of the week</span>
          </div>
          <h2 style={{ fontFamily:'"Noto Serif", serif', fontSize:44, color:'#182a1b', margin:'0 0 24px', lineHeight:1.1, fontWeight:400 }}>{story.title}</h2>
          <p style={{ fontSize:20, fontFamily:'"Noto Serif", serif', fontStyle:'italic', color:'#434842', margin:'0 0 24px', lineHeight:1.5 }}>{story.subtitle}</p>
          <p style={{ color:'rgba(26,28,26,.8)', lineHeight:1.6, marginBottom:40, fontFamily:'Manrope, sans-serif' }}>{story.excerpt}</p>
          <a onClick={onRead} style={{ display:'inline-flex', alignItems:'center', gap:12, fontFamily:'Manrope, sans-serif', fontWeight:500, color:'#182a1b', borderBottom:'1px solid rgba(24,42,27,.2)', paddingBottom:4, width:'fit-content', cursor:'pointer' }}>Read the guide <TvIcon.BookOpen size={16} /></a>
        </div>
      </div>
    </section>
  );
}

function TvProducerCTA() {
  return (
    <section style={{ padding:'96px 64px', background:'#faf9f6' }}>
      <div style={{ background:'#182a1b', borderRadius:24, padding:'64px', maxWidth:896, margin:'0 auto', textAlign:'center' }}>
        <span style={{ fontFamily:'Manrope, sans-serif', fontSize:11, textTransform:'uppercase', letterSpacing:'.3em', color:'rgba(255,255,255,.6)', marginBottom:24, display:'inline-block' }}>For artisan producers</span>
        <h2 style={{ fontFamily:'"Noto Serif", serif', fontSize:38, color:'#fff', margin:'0 0 24px', lineHeight:1.2, fontWeight:400 }}>Share your craft with discerning customers across Europe</h2>
        <p style={{ color:'rgba(255,255,255,.8)', fontFamily:'Manrope, sans-serif', maxWidth:512, margin:'0 auto 40px', lineHeight:1.6 }}>We work with a small, curated network of producers who put quality before scale. If that's you, we'd like to talk.</p>
        <button style={{ display:'inline-flex', alignItems:'center', gap:8, background:'#fe9e72', color:'#773310', padding:'16px 32px', borderRadius:9999, fontFamily:'Manrope, sans-serif', fontWeight:500, fontSize:14, border:'none', cursor:'pointer' }}>Become a producer <TvIcon.ArrowRight size={16} /></button>
      </div>
    </section>
  );
}

Object.assign(window, { TvHero, TvEuropeStrip, TvRegionCard, TvRegionalArchives, TvStoryOfTheWeek, TvProducerCTA });
