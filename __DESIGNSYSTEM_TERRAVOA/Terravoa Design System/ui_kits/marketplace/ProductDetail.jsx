// Product detail screen
function TvProductDetail({ product, onAdd, onProducer }) {
  const [qty, setQty] = useState(1);
  return (
    <section style={{ padding:'64px 64px 96px', background:'#faf9f6' }}>
      <div style={{ maxWidth:1200, margin:'0 auto' }}>
        <p style={{ fontFamily:'Manrope, sans-serif', fontSize:11, textTransform:'uppercase', letterSpacing:'.15em', color:'rgba(24,42,27,.5)', marginBottom:32 }}>Shop · {product.category} · {product.name}</p>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:80, alignItems:'flex-start' }}>
          <div style={{ background:'#ffffff', borderRadius:16, overflow:'hidden', aspectRatio:'1', boxShadow:'0 30px 60px rgba(26,28,26,.08)' }}>
            <img src={product.imageSrc} alt={product.imageAlt} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
          </div>
          <div>
            <span style={{ color:'#944925', fontFamily:'Manrope, sans-serif', fontSize:11, textTransform:'uppercase', letterSpacing:'.15em', display:'flex', alignItems:'center', gap:8, marginBottom:16 }}>
              <TvFlag origin={product.origin} />
              {product.origin} • <a onClick={onProducer} style={{ color:'#944925', cursor:'pointer', textDecoration:'underline', textUnderlineOffset:4, textDecorationColor:'rgba(148,73,37,.3)' }}>{product.producerName}</a>
            </span>
            <h1 style={{ fontFamily:'"Noto Serif", serif', fontSize:42, color:'#182a1b', fontWeight:400, margin:'0 0 20px', lineHeight:1.1, letterSpacing:'-.01em' }}>{product.name}</h1>
            <p style={{ fontSize:15, color:'#434842', lineHeight:1.7, marginBottom:32, fontFamily:'Manrope, sans-serif' }}>{product.description}</p>

            <div style={{ display:'flex', alignItems:'baseline', gap:12, marginBottom:32 }}>
              <p style={{ fontFamily:'"Noto Serif", serif', fontSize:32, color:'#182a1b', margin:0, fontWeight:400, fontFeatureSettings:'"tnum"' }}>€{(product.price/100).toFixed(2)}</p>
              {product.badge && <TvBadge {...product.badge} />}
            </div>

            <ul style={{ listStyle:'none', padding:0, margin:'0 0 40px', display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px 24px', borderTop:'1px solid rgba(24,42,27,.1)', borderBottom:'1px solid rgba(24,42,27,.1)', padding:'20px 0' }}>
              {product.details.map(d => (<li key={d} style={{ fontFamily:'Manrope, sans-serif', fontSize:13, color:'#434842', display:'flex', alignItems:'center', gap:8 }}><span style={{ width:4, height:4, borderRadius:9999, background:'#944925' }} />{d}</li>))}
            </ul>

            <div style={{ display:'flex', alignItems:'center', gap:16, marginBottom:24 }}>
              <div style={{ display:'flex', alignItems:'center', border:'1px solid rgba(24,42,27,.2)', borderRadius:9999, overflow:'hidden' }}>
                <button onClick={()=>setQty(Math.max(1,qty-1))} style={{ width:40, height:44, background:'transparent', border:'none', color:'#182a1b', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}><TvIcon.Minus size={14} /></button>
                <span style={{ width:36, textAlign:'center', fontFamily:'Manrope, sans-serif', fontSize:14, color:'#182a1b', fontWeight:500 }}>{qty}</span>
                <button onClick={()=>setQty(qty+1)} style={{ width:40, height:44, background:'transparent', border:'none', color:'#182a1b', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}><TvIcon.Plus size={14} /></button>
              </div>
              <TvButton kind="primary" onClick={()=>onAdd(product, qty)} icon={<TvIcon.ArrowRight size={14} />}>Add to bag</TvButton>
            </div>
            <p style={{ display:'flex', alignItems:'center', gap:8, color:'rgba(67,72,66,.7)', fontFamily:'Manrope, sans-serif', fontSize:11, textTransform:'uppercase', letterSpacing:'.12em' }}>
              <TvIcon.Truck size={12} /> Ships directly from producer · 3–5 working days
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

window.TvProductDetail = TvProductDetail;
