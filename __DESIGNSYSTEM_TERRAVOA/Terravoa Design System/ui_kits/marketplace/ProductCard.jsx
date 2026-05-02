// ProductCard — matches MyTerraVera/src/components/ui/ProductCard.tsx
function TvProductCard({ product, onClick }) {
  const [hover, setHover] = useState(false);
  const [wish, setWish] = useState(false);
  return (
    <div style={{ cursor:'pointer', width:'100%' }} onClick={onClick} onMouseEnter={()=>setHover(true)} onMouseLeave={()=>setHover(false)}>
      <div style={{ background:'#ffffff', borderRadius:16, overflow:'hidden', position:'relative', aspectRatio:'1', marginBottom:24 }}>
        <img src={product.imageSrc} alt={product.imageAlt} style={{ width:'100%', height:'100%', objectFit:'cover', transform: hover?'scale(1.05)':'scale(1)', transition:'transform 500ms cubic-bezier(.4,0,.2,1)' }} />
        <div style={{ position:'absolute', top:12, right:12, display:'flex', flexDirection:'column', alignItems:'flex-end', gap:8 }}>
          {product.badge && <TvBadge label={product.badge.label} variant={product.badge.variant} />}
          <button onClick={(e)=>{e.stopPropagation(); setWish(!wish);}} style={{ width:32, height:32, borderRadius:9999, background:'rgba(250,249,246,.85)', backdropFilter:'blur(6px)', border:'none', display: hover||wish?'flex':'none', alignItems:'center', justifyContent:'center', cursor:'pointer', boxShadow:'0 2px 6px rgba(26,28,26,.04)', color: wish?'#e23'.replace('#e23','#dc2626'):'rgba(67,72,66,1)' }}>
            <TvIcon.Heart filled={wish} />
          </button>
        </div>
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:4 }}>
        <span style={{ color:'#944925', fontFamily:'Manrope, sans-serif', fontSize:10, textTransform:'uppercase', letterSpacing:'.15em', display:'flex', alignItems:'center', gap:6 }}>
          <TvFlag origin={product.origin} />
          {product.origin} • {product.producerName}
        </span>
        <h4 style={{ fontFamily:'"Noto Serif", serif', color:'#182a1b', fontSize:18, fontWeight:400, margin:0, lineHeight:1.3 }}>{product.name}</h4>
        <p style={{ color:'#434842', fontFamily:'Manrope, sans-serif', fontSize:14, margin:0 }}>€{(product.price/100).toFixed(2)}</p>
        <p style={{ display:'flex', alignItems:'center', gap:6, color:'rgba(67,72,66,.6)', fontFamily:'Manrope, sans-serif', fontSize:10, textTransform:'uppercase', letterSpacing:'.1em', paddingTop:4, margin:0 }}>
          <TvIcon.Truck /> Ships directly from producer
        </p>
      </div>
    </div>
  );
}

window.TvProductCard = TvProductCard;
