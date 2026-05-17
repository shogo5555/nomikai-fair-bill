type Props = {
  current: number
  total: number
}

export function StepIndicator({ current, total }: Props) {
  return (
    <div className="flex items-center justify-center gap-2 py-4">
      {Array.from({ length: total }, (_, i) => i + 1).map((step) => (
        <div
          key={step}
          className={`h-2 w-8 rounded-full transition-colors ${
            step <= current ? 'bg-indigo-600' : 'bg-gray-200'
          }`}
        />
      ))}
    </div>
  )
}
