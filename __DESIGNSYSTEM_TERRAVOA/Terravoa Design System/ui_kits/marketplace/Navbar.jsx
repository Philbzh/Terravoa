// Navbar — three-column desktop nav matching MyTerraVera/src/components/layout/Navbar.tsx
function TvNavbar({ active = 'shop', onNav, signedIn = false, cartCount = 0 }) {
  const links = [
    { key: 'shop', label: 'Shop', screen: 'collection' },
    { key: 'producers', label: 'Producers', screen: 'producer' },
    { key: 'journal', label: 'Journal', screen: 'home' },
    { key: 'about', label: 'About', screen: 'home' },
  ];
  return (
    <header style={{ position:'sticky', top:0, zIndex:50, background:'#faf9f6', borderBottom:'1px solid rgba(195,200,192,.2)', boxShadow:'0 1px 2px rgba(26,28,26,.04)' }}>
      <div style={{ display:'grid', gridTemplateColumns:'1fr auto 1fr', alignItems:'center', padding:'8px 40px' }}>
        <nav style={{ display:'flex', alignItems:'center', gap:32 }}>
          {links.map(l => (
            <a key={l.key} onClick={() => onNav && onNav(l.screen)} style={{ color: active===l.key ? '#182a1b' : 'rgba(24,42,27,.7)', fontFamily:'Manrope, sans-serif', fontSize:11, textTransform:'uppercase', letterSpacing:'.15em', fontWeight:500, cursor:'pointer', textDecoration:'none' }}>{l.label}</a>
          ))}
        </nav>
        <a onClick={() => onNav && onNav('home')} style={{ display:'flex', justifyContent:'center', padding:'4px 32px', cursor:'pointer' }}>
          <img src="../../assets/logos/terravoa-wordmark.png" alt="Terravoa" style={{ height:90, maxWidth:220, objectFit:'contain', mixBlendMode:'multiply' }} />
        </a>
        <div style={{ display:'flex', justifyContent:'flex-end', alignItems:'center', gap:12 }}>
          {signedIn ? (
            <a style={{ display:'inline-flex', alignItems:'center', gap:6, fontFamily:'Manrope, sans-serif', fontSize:11, textTransform:'uppercase', letterSpacing:'.15em', fontWeight:600, color:'#182a1b', border:'1px solid rgba(24,42,27,.25)', padding:'6px 12px', borderRadius:9999, cursor:'pointer' }}>
              <TvIcon.UserCircle /> My account
            </a>
          ) : (
            <>
              <a style={{ fontFamily:'Manrope, sans-serif', fontSize:11, textTransform:'uppercase', letterSpacing:'.15em', fontWeight:500, color:'rgba(24,42,27,.6)', cursor:'pointer' }}>Register</a>
              <a style={{ fontFamily:'Manrope, sans-serif', fontSize:11, textTransform:'uppercase', letterSpacing:'.15em', fontWeight:600, color:'#182a1b', border:'1px solid rgba(24,42,27,.25)', padding:'6px 12px', borderRadius:9999, cursor:'pointer' }}>Sign in</a>
            </>
          )}
          <a style={{ color:'#182a1b', position:'relative', cursor:'pointer' }}>
            <TvIcon.ShoppingBag />
            {cartCount > 0 && <span style={{ position:'absolute', top:-6, right:-6, minWidth:16, height:16, padding:'0 2px', background:'#944925', color:'#fff', fontSize:10, borderRadius:9999, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, fontFamily:'Manrope, sans-serif' }}>{cartCount > 9 ? '9+' : cartCount}</span>}
          </a>
          <span style={{ height:16, width:1, background:'rgba(195,200,192,.5)', margin:'0 4px' }} />
          <a style={{ color:'#944925', fontFamily:'Manrope, sans-serif', fontSize:11, textTransform:'uppercase', letterSpacing:'.12em', fontWeight:600, cursor:'pointer' }}>Become a producer</a>
        </div>
      </div>
    </header>
  );
}

window.TvNavbar = TvNavbar;
