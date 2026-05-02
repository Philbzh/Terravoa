interface StarRatingProps {
  rating: number
  size?: 'sm' | 'md'
}

export function StarRating({ rating, size = 'md' }: StarRatingProps) {
  const px = size === 'sm' ? 14 : 18

  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => {
        const filled = rating >= i + 1
        const half = !filled && rating >= i + 0.5

        return (
          <svg
            key={i}
            width={px}
            height={px}
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id={`half-${i}`}>
                <stop offset="50%" stopColor="currentColor" />
                <stop offset="50%" stopColor="transparent" />
              </linearGradient>
            </defs>
            <path
              d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
              fill={
                filled
                  ? 'currentColor'
                  : half
                  ? `url(#half-${i})`
                  : 'none'
              }
              stroke="currentColor"
              strokeWidth={filled || half ? 0 : 1.5}
              className="text-secondary"
            />
          </svg>
        )
      })}
    </span>
  )
}
