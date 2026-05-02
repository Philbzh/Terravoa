export function LogoEmblem({ size = 24, className }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Center leaf */}
      <path
        d="M32 8C32 8 28 16 28 22C28 26 30 28 32 28C34 28 36 26 36 22C36 16 32 8 32 8Z"
        fill="currentColor"
      />
      {/* Left leaf */}
      <path
        d="M30 27C30 27 20 18 14 16C14 16 16 26 26 30C28 30.5 30 29 30 27Z"
        fill="currentColor"
      />
      {/* Right leaf */}
      <path
        d="M34 27C34 27 44 18 50 16C50 16 48 26 38 30C36 30.5 34 29 34 27Z"
        fill="currentColor"
      />
      {/* Stem */}
      <path
        d="M32 28V38"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Terraced field lines */}
      <path
        d="M14 42C18 39 25 37 32 37C39 37 46 39 50 42"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M18 46C22 43.5 27 42 32 42C37 42 42 43.5 46 46"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M22 50C25 48 28 47 32 47C36 47 39 48 42 50"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  )
}
