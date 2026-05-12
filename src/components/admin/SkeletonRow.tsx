export function SkeletonRow({ columns = 5 }: { columns?: number }) {
  return (
    <tr className="animate-pulse">
      {Array.from({ length: columns }, (_, i) => (
        <td key={i} className="px-4 py-3">
          <div className="h-3 rounded-full bg-surface-container-high/60 w-3/4" />
        </td>
      ))}
    </tr>
  )
}

export function SkeletonRows({ rows = 5, columns = 5 }: { rows?: number; columns?: number }) {
  return (
    <>
      {Array.from({ length: rows }, (_, i) => (
        <SkeletonRow key={i} columns={columns} />
      ))}
    </>
  )
}
