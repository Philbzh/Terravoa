interface PageContainerProps {
  children: React.ReactNode
  className?: string
}

export function PageContainer({ children, className }: PageContainerProps) {
  return (
    <div className={`pt-32 pb-24 px-6 md:px-16 max-w-7xl mx-auto ${className ?? ''}`}>
      {children}
    </div>
  )
}
