'use client'

import { useEffect } from 'react'
import { useThemeStore } from '@/lib/store/theme-store'

/**
 * Initialises dark mode from localStorage (or OS preference) on first mount.
 * Must sit inside the client boundary — wrap it in layout.tsx.
 *
 * FOIT prevention: a tiny inline <script> in the layout root runs synchronously
 * before hydration to apply the .dark class before the first paint.
 * See layout.tsx for the companion <script dangerouslySetInnerHTML> block.
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const init = useThemeStore((s) => s.init)

  useEffect(() => {
    init()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <>{children}</>
}

/**
 * Paste this as a <script dangerouslySetInnerHTML> in the <head> of your root layout
 * to eliminate the flash of incorrect theme before React hydrates.
 */
export const themeInitScript = `
(function(){
  try {
    var s = localStorage.getItem('tv-theme');
    var dark = s ? s === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (dark) document.documentElement.classList.add('dark');
  } catch(e) {}
})();
`
