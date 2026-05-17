import type { Member } from '../types'

type Props = {
  members: Member[]
  payerId: string
  memo: string
  onSelect: (id: string) => void
  onChangeMemo: (memo: string) => void
  onBack: () => void
  onNext: () => void
}

const MEMO_MAX_LENGTH = 200

export function Step3Payer({
  members,
  payerId,
  memo,
  onSelect,
  onChangeMemo,
  onBack,
  onNext,
}: Props) {
  const canProceed = payerId !== ''

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="text-xl font-bold text-gray-900">立替えた人</h2>
        <p className="mt-1 text-sm text-gray-500">
          お会計を立替えた人を選んでください
        </p>
      </div>

      <ul className="flex flex-col gap-2">
        {members.map((m) => {
          const selected = m.id === payerId
          return (
            <li key={m.id}>
              <button
                type="button"
                onClick={() => onSelect(m.id)}
                className={`flex w-full items-center gap-3 rounded-xl border-2 px-4 py-4 text-left transition-colors ${
                  selected
                    ? 'border-indigo-600 bg-indigo-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <span
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 ${
                    selected
                      ? 'border-indigo-600 bg-indigo-600'
                      : 'border-gray-300'
                  }`}
                >
                  {selected && (
                    <span className="h-2 w-2 rounded-full bg-white" />
                  )}
                </span>
                <span className="text-base font-bold text-gray-900">
                  {m.name}
                </span>
              </button>
            </li>
          )
        })}
      </ul>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="payment-memo" className="text-sm font-bold text-gray-700">
          支払いメモ（任意）
        </label>
        <textarea
          id="payment-memo"
          value={memo}
          onChange={(e) => onChangeMemo(e.target.value.slice(0, MEMO_MAX_LENGTH))}
          placeholder="例: PayPayでお願いします / 現金でお願いします"
          rows={2}
          maxLength={MEMO_MAX_LENGTH}
          className="w-full resize-none rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-indigo-600 focus:outline-none"
        />
        <p className="text-right text-[10px] text-gray-400">
          {memo.length} / {MEMO_MAX_LENGTH}
        </p>
      </div>

      <div className="mt-2 flex gap-3">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 rounded-xl bg-gray-100 py-4 text-base font-bold text-gray-700 hover:bg-gray-200"
        >
          戻る
        </button>
        <button
          type="button"
          disabled={!canProceed}
          onClick={onNext}
          className="flex-[2] rounded-xl bg-indigo-600 py-4 text-base font-bold text-white shadow-sm hover:bg-indigo-700 disabled:bg-gray-300"
        >
          計算する
        </button>
      </div>
    </div>
  )
}
