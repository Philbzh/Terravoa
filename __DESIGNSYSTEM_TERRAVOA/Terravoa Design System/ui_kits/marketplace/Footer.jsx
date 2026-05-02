// Footer — 4-column matching MyTerraVera/src/components/layout/Footer.tsx
function TvFooter() {
  const link = { color:'rgba(24,42,27,.6)', fontFamily:'Manrope, sans-serif', fontSize:14, textDecoration:'none', cursor:'pointer', display:'block', marginBottom:16 };
  const colTitle = { fontFamily:'"Noto Serif", serif', fontSize:20, color:'#182a1b', fontWeight:400, marginBottom:24 };
  return (
    <footer style={{ width:'100%', padding:'80px 48px 40px', background:'#f4f3f1', display:'grid', gridTemplateColumns:'1fr 1fr 1fr 1fr', gap:48 }}>
      <div>
        <img src="../../assets/logos/terravoa-wordmark.png" alt="Terravoa" style={{ height:100, maxWidth:260, objectFit:'contain', marginBottom:24, mixBlendMode:'multiply' }} />
        <p style={{ color:'rgba(24,42,27,.6)', fontFamily:'Manrope, sans-serif', fontSize:14, lineHeight:1.6, marginBottom:24 }}>Every product carries the handwriting of its heritage.</p>
      </div>
      <div>
        <h4 style={colTitle}>Discover</h4>
        {['Collection','Journal','Our story','Regional archives','Savoir-faire','Become a producer'].map(t=>(<a key={t} style={link}>{t}</a>))}
      </div>
      <div>
        <h4 style={colTitle}>Concierge</h4>
        {['Payment & delivery','Returns','Contact us'].map(t=>(<a key={t} style={link}>{t}</a>))}
      </div>
      <div>
        <h4 style={colTitle}>Newsletter</h4>
        <p style={{ color:'rgba(24,42,27,.6)', fontFamily:'Manrope, sans-serif', fontSize:14, marginBottom:16, lineHeight:1.5 }}>Receive monthly dispatches from our regional scouts.</p>
        <form style={{ display:'flex', borderBottom:'1px solid rgba(24,42,27,.2)', paddingBottom:8 }} onSubmit={(e)=>e.preventDefault()}>
          <input placeholder="Email Address" style={{ background:'transparent', border:'none', outline:'none', fontSize:14, width:'100%', fontFamily:'Manrope, sans-serif', color:'#182a1b' }} />
          <button type="submit" style={{ background:'transparent', border:'none', color:'#944925', fontSize:18, cursor:'pointer' }}>→</button>
        </form>
      </div>
      <div style={{ gridColumn:'1 / -1', borderTop:'1px solid rgba(24,42,27,.06)', paddingTop:40, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <p style={{ color:'rgba(24,42,27,.6)', fontFamily:'Manrope, sans-serif', fontSize:14, margin:0 }}>© 2026 Terravoa. Artistry in every detail.</p>
        <div style={{ display:'flex', gap:32 }}>
          {['Terms','Privacy','Cookies'].map(t=>(<a key={t} style={{ color:'rgba(24,42,27,.4)', fontFamily:'Manrope, sans-serif', fontSize:10, textTransform:'uppercase', letterSpacing:'.15em', cursor:'pointer' }}>{t}</a>))}
        </div>
      </div>
    </footer>
  );
}

window.TvFooter = TvFooter;
