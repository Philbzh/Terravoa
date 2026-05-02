/**
 * Inline script that runs synchronously before first paint to apply the
 * stored theme preference — this prevents a flash of the wrong colour scheme
 * on initial page load.
 *
 * MED-1 note: this content is the *only* thing ever passed to
 * `dangerouslySetInnerHTML` in the application. It is a module-level string
 * literal with no interpolation, so there is no attack surface. Any future
 * change that introduces a templated value here would make the script
 * fragile; keep this file literal-only.
 *
 * Exported as a `const` with a frozen descriptor so import callers cannot
 * assign to it at runtime.
 */
export const THEME_INIT_SCRIPT =
  "(function(){try{var s=localStorage.getItem('tv-theme');var d=s?s==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;if(d)document.documentElement.classList.add('dark');}catch(e){}})();" as const
