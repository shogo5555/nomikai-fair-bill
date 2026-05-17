type Props = {
  total: number
  onChange: (value: number) => void
  onNext: () => void
}

export function Step1Total({ total, onChange, onNext }: Props) {
  const canProceed = total > 0

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">合計金額</h2>
        <p className="mt-1 text-sm text-gray-500">
          お会計の合計金額を入力してください
        </p>
      </div>

      <div className="relative">
        <input
          type="number"
          inputMode="numeric"
          pattern="[0-9]*"
          value={total === 0 ? '' : total}
          onChange={(e) => onChange(Number(e.target.value) || 0)}
          placeholder="0"
          className="w-full rounded-xl border-2 border-gray-200 bg-white py-4 pl-4 pr-12 text-right text-3xl font-bold text-gray-900 focus:border-indigo-600 focus:outline-none"
        />
        <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xl font-bold text-gray-500">
          円
        </span>
      </div>

      <button
        type="button"
        disabled={!canProceed}
        onClick={onNext}
        className="mt-2 w-full rounded-xl bg-indigo-600 py-4 text-base font-bold text-white shadow-sm transition-colors hover:bg-indigo-700 disabled:bg-gray-300"
      >
        次へ
      </button>
    </div>
  )
}
