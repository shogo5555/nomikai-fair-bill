import type { CoefficientPreset, Member } from '../types'
import { MemberCard } from './MemberCard'

type Props = {
  members: Member[]
  onAdd: () => void
  onRemove: (id: string) => void
  onChangeName: (id: string, name: string) => void
  onSelectPreset: (id: string, preset: CoefficientPreset) => void
  onChangeCustomWeight: (id: string, weight: number) => void
  onBack: () => void
  onNext: () => void
}

export function Step2Members({
  members,
  onAdd,
  onRemove,
  onChangeName,
  onSelectPreset,
  onChangeCustomWeight,
  onBack,
  onNext,
}: Props) {
  const canProceed = members.length >= 2

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="text-xl font-bold text-gray-900">参加メンバー</h2>
        <p className="mt-1 text-sm text-gray-500">
          名前と係数（飲み方の傾斜）を選んでください
        </p>
      </div>

      <ul className="flex flex-col gap-3">
        {members.map((m, i) => (
          <MemberCard
            key={m.id}
            member={m}
            index={i}
            onRemove={onRemove}
            onChangeName={onChangeName}
            onSelectPreset={onSelectPreset}
            onChangeCustomWeight={onChangeCustomWeight}
          />
        ))}
      </ul>

      <button
        type="button"
        onClick={onAdd}
        className="w-full rounded-xl border-2 border-dashed border-gray-300 py-3 text-sm font-bold text-gray-500 hover:border-indigo-400 hover:text-indigo-600"
      >
        ＋ メンバーを追加
      </button>

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
          次へ
        </button>
      </div>
      {!canProceed && (
        <p className="text-center text-xs text-gray-400">
          2人以上のメンバーが必要です
        </p>
      )}
    </div>
  )
}
