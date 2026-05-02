// Collection screen — filtered grid of products
function TvCollection({ onProduct }) {
  const [cat, setCat] = useState('All');
  const cats = ['All','Oils','Honey','Preserves','Body Care','Spices','Ceramics'];
  const filtered = cat==='All' ? TV_PRODUCTS : TV_PRODUCTS.filter(p => p.category===cat);
  return (
    <section style={{ padding:'80px 64px', background:'#faf9f6' }}>
      <div style={{ textAlign:'center', marginBottom:48 }}>
        <p style={{ fontFamily:'Manrope, sans-serif', fontSize:11, textTransform:'uppercase', letterSpacing:'.25em', color:'#944925', marginBottom:16 }}>The collection</p>
        <h1 style={{ fontFamily:'"Noto Serif", serif', fontSize:48, color:'#182a1b', fontWeight:400, margin:'0 0 16px', letterSpacing:'-.01em' }}>Curated goods, direct from the source</h1>
        <p style={{ fontFamily:'"Noto Serif", serif', fontStyle:'italic', color:'#434842', fontSize:16, maxWidth:560, margin:'0 auto' }}>— Every jar, bottle, and bar carries the handwriting of its maker. —</p>
      </div>
      <div style={{ display:'flex', justifyContent:'center', gap:8, marginBottom:48, flexWrap:'wrap' }}>
        {cats.map(c => (
          <button key={c} onClick={()=>setCat(c)} style={{ padding:'8px 18px', borderRadius:9999, border: cat===c?'1px solid #182a1b':'1px solid rgba(24,42,27,.2)', background: cat===c?'#182a1b':'transparent', color: cat===c?'#fff':'#182a1b', fontFamily:'Manrope, sans-serif', fontSize:11, textTransform:'uppercase', letterSpacing:'.15em', fontWeight:500, cursor:'pointer' }}>{c}</button>
        ))}
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', columnGap:32, rowGap:48, maxWidth:1280, margin:'0 auto' }}>
        {filtered.map(p => <TvProductCard key={p.slug} product={p} onClick={()=>onProduct(p)} />)}
      </div>
    </section>
  );
}

window.TvCollection = TvCollection;
