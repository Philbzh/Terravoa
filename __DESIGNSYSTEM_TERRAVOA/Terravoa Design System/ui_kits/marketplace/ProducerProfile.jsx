// Producer profile screen
function TvProducerProfile({ producer, onProduct }) {
  const productsBy = TV_PRODUCTS.filter(p => p.producerSlug === producer.slug);
  return (
    <>
      <section style={{ position:'relative', height:420, overflow:'hidden' }}>
        <img src={producer.heroImageSrc} alt="" style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover' }} />
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(180deg, rgba(24,42,27,.3), rgba(24,42,27,.7))' }} />
        <div style={{ position:'relative', zIndex:2, color:'#fff', maxWidth:1200, margin:'0 auto', padding:'80px 64px 48px', display:'flex', alignItems:'flex-end', height:'100%', boxSizing:'border-box' }}>
          <div>
            <p style={{ fontFamily:'Manrope, sans-serif', fontSize:10, textTransform:'uppercase', letterSpacing:'.3em', color:'rgba(255,255,255,.7)', marginBottom:12 }}>Producer · Established {producer.established}</p>
            <h1 style={{ fontFamily:'"Noto Serif", serif', fontSize:60, color:'#fff', fontWeight:400, margin:'0 0 12px', letterSpacing:'-.01em', lineHeight:1.05 }}>{producer.name}</h1>
            <p style={{ fontFamily:'"Noto Serif", serif', fontStyle:'italic', fontSize:18, color:'rgba(255,255,255,.85)', margin:0 }}>{producer.tagline}</p>
            <div style={{ display:'flex', gap:8, marginTop:16 }}>
              {producer.badges?.map(b => <TvBadge key={b} label={b} variant="producer" />)}
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding:'96px 64px', background:'#faf9f6' }}>
        <div style={{ maxWidth:1120, margin:'0 auto', display:'grid', gridTemplateColumns:'5fr 7fr', gap:80, alignItems:'flex-start' }}>
          <div style={{ position:'relative' }}>
            <div style={{ aspectRatio:'3/4', borderRadius:16, overflow:'hidden', boxShadow:'0 30px 60px rgba(26,28,26,.12)' }}>
              <img src={producer.imageSrc} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
            </div>
            <div style={{ background:'#feddb3', padding:'24px', borderRadius:16, marginTop:24 }}>
              <p style={{ fontFamily:'Manrope, sans-serif', fontSize:10, textTransform:'uppercase', letterSpacing:'.2em', color:'#944925', margin:'0 0 8px', fontWeight:600 }}>{producer.region} · {producer.country}</p>
              <p style={{ fontFamily:'Manrope, sans-serif', fontSize:13, color:'#342306', margin:0, lineHeight:1.6 }}>Specialty: {producer.specialty}</p>
            </div>
          </div>
          <div>
            <p style={{ fontFamily:'Manrope, sans-serif', fontSize:11, textTransform:'uppercase', letterSpacing:'.25em', color:'#944925', marginBottom:24 }}>The story</p>
            <h2 style={{ fontFamily:'"Noto Serif", serif', fontSize:36, color:'#182a1b', fontWeight:400, margin:'0 0 32px', lineHeight:1.2 }}>{producer.storyHeadline}</h2>
            <p style={{ fontFamily:'Manrope, sans-serif', fontSize:15, color:'#434842', lineHeight:1.8, marginBottom:32 }}>For four generations, the Rossi family has tended to the silver-leaved groves that line the ridge of the Maremma. Matteo Rossi, the current custodian, views himself less as a producer and more as a temporary guardian of a landscape that has remained unchanged since the Renaissance.</p>
            <blockquote style={{ borderLeft:'2px solid #944925', paddingLeft:24, margin:'32px 0', fontFamily:'"Noto Serif", serif', fontStyle:'italic', fontSize:22, color:'#182a1b', lineHeight:1.4 }}>"{producer.quote}"</blockquote>
          </div>
        </div>
      </section>

      {producer.savoirFaire && (
        <section style={{ padding:'96px 64px', background:'#f4f3f1' }}>
          <div style={{ maxWidth:1120, margin:'0 auto' }}>
            <p style={{ fontFamily:'Manrope, sans-serif', fontSize:11, textTransform:'uppercase', letterSpacing:'.25em', color:'#944925', marginBottom:16, textAlign:'center' }}>Savoir-faire</p>
            <h2 style={{ fontFamily:'"Noto Serif", serif', fontSize:36, color:'#182a1b', fontWeight:400, margin:'0 0 64px', textAlign:'center' }}>How it's made</h2>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:48 }}>
              {producer.savoirFaire.map((step, i) => (
                <div key={step.title}>
                  <p style={{ fontFamily:'"Noto Serif", serif', fontSize:48, color:'#944925', margin:'0 0 16px', fontFeatureSettings:'"tnum"' }}>0{i+1}</p>
                  <h3 style={{ fontFamily:'"Noto Serif", serif', fontSize:22, color:'#182a1b', fontWeight:400, margin:'0 0 12px' }}>{step.title}</h3>
                  <p style={{ fontFamily:'Manrope, sans-serif', fontSize:14, color:'#434842', lineHeight:1.7, margin:0 }}>{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {productsBy.length > 0 && (
        <section style={{ padding:'96px 64px', background:'#faf9f6' }}>
          <div style={{ maxWidth:1280, margin:'0 auto' }}>
            <h2 style={{ fontFamily:'"Noto Serif", serif', fontSize:32, color:'#182a1b', fontWeight:400, margin:'0 0 48px', textAlign:'center' }}>From this producer</h2>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', columnGap:32, rowGap:48 }}>
              {productsBy.map(p => <TvProductCard key={p.slug} product={p} onClick={()=>onProduct(p)} />)}
            </div>
          </div>
        </section>
      )}
    </>
  );
}

window.TvProducerProfile = TvProducerProfile;
