import { useState } from 'react'
import type {
  BillResult,
  Member,
  RoundedBillResult,
  RoundingUnit,
} from '../types'
import { formatRoundedResultForCopy } from '../utils/calculateBill'
import { ROUNDING_UNITS, formatWeightLabel } from '../utils/presets'

type Props = {
  result: BillResult
  rounded: RoundedBillResult
  roundingUnit: RoundingUnit
  members: Member[]
  memo: string
  onChangeRoundingUnit: (unit: RoundingUnit) => void
  onBack: () => void
  onReset: () => void
}

export function Step4Result({
  result,
  rounded,
  roundingUnit,
  members,
  memo,
  onChangeRoundingUnit,
  onBack,
  onReset,
}: Props) {
  const [copied, setCopied] = useState(false)
  const copyText = formatRoundedResultForCopy(rounded, members, memo)

  const memberMap = new Map(members.map((m) => [m.id, m]))
  const labelFor = (id: string): string => {
    const m = memberMap.get(id)
    return m ? formatWeightLabel(m) : ''
  }

  const exactOthers = result.perMember.filter((p) => p.id !== result.payerId)
  const payerExact = result.perMember.find((p) => p.id === result.payerId)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(copyText)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  const diffSign =
    rounded.payerDiff === 0 ? '±' : rounded.payerDiff > 0 ? '+' : '−'
  const diffAbs = Math.abs(rounded.payerDiff)
  const trimmedMemo = memo.trim()

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="text-xl font-bold text-gray-900">精算結果</h2>
        <p className="mt-1 text-sm text-gray-500">
          合計 {result.total.toLocaleString()}円 / 立替: {result.payerName}さん
        </p>
      </div>

      {/* 丸め単位選択 */}
      <div>
        <p className="mb-2 text-xs font-bold text-gray-500">丸めの単位</p>
        <div className="grid grid-cols-4 gap-1.5">
          {ROUNDING_UNITS.map((unit) => {
            const selected = roundingUnit === unit
            return (
              <button
                key={unit}
                type="button"
                onClick={() => onChangeRoundingUnit(unit)}
                className={`rounded-lg py-2 text-sm font-bold transition-colors ${
                  selected
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {unit.toLocaleString()}円
              </button>
            )
          })}
        </div>
      </div>

      {/* 丸め精算（メイン表示） */}
      <section className="rounded-2xl bg-indigo-600 p-5 text-white shadow-md">
        <div className="flex items-baseline justify-between">
          <p className="text-xs opacity-80">
            {result.payerName}さんに支払う金額
          </p>
          <p className="text-[10px] opacity-80">
            {rounded.unit.toLocaleString()}円単位で丸め
          </p>
        </div>
        <ul className="mt-3 flex flex-col gap-2">
          {rounded.others.length === 0 ? (
            <li className="text-sm opacity-80">他の参加者がいません</li>
          ) : (
            rounded.others.map((o) => (
              <li
                key={o.id}
                className="border-b border-white/20 pb-2 last:border-0"
              >
                <div className="flex items-baseline justify-between">
                  <span className="text-base font-bold">{o.name}</span>
                  <span className="text-xl font-bold tabular-nums">
                    {o.roundedAmount.toLocaleString()}
                    <span className="ml-0.5 text-sm font-normal">円</span>
                  </span>
                </div>
                <p className="mt-0.5 text-[11px] opacity-80">
                  {labelFor(o.id)}
                </p>
              </li>
            ))
          )}
        </ul>
      </section>

      {/* 立替者の実質負担 */}
      <section className="rounded-xl border border-gray-200 bg-white p-4">
        <p className="text-xs text-gray-500">
          {result.payerName}さんの負担分（自分のぶん）
        </p>
        <p className="mt-1 text-2xl font-bold text-gray-900 tabular-nums">
          {rounded.payerEffectiveAmount.toLocaleString()}
          <span className="ml-1 text-base font-normal text-gray-500">円</span>
        </p>
        <p className="mt-0.5 text-[11px] text-gray-500">
          {labelFor(result.payerId)}
        </p>
        {rounded.payerDiff !== 0 && (
          <p className="mt-1 text-xs text-gray-500">
            丸めにより、立替者の負担が {diffSign}
            {diffAbs.toLocaleString()}円 になります
          </p>
        )}
      </section>

      {/* 支払いメモ（あれば） */}
      {trimmedMemo && (
        <section className="rounded-xl border border-amber-200 bg-amber-50 p-4">
          <p className="text-xs font-bold text-amber-800">支払いメモ</p>
          <p className="mt-1 whitespace-pre-wrap text-sm text-gray-800">
            {trimmedMemo}
          </p>
        </section>
      )}

      <button
        type="button"
        onClick={handleCopy}
        className="w-full rounded-xl bg-emerald-600 py-4 text-base font-bold text-white shadow-sm hover:bg-emerald-700"
      >
        {copied ? '✓ コピーしました' : '📋 結果をコピー（LINE用）'}
      </button>

      <pre className="overflow-x-auto whitespace-pre-wrap rounded-xl border border-gray-200 bg-gray-50 p-3 text-xs text-gray-600">
        {copyText}
      </pre>

      {/* きっちり精算（参考表示） */}
      <details className="rounded-xl border border-gray-200 bg-white">
        <summary className="cursor-pointer list-none px-4 py-3 text-sm font-bold text-gray-700">
          きっちり精算（1円単位）を見る
        </summary>
        <div className="border-t border-gray-100 px-4 py-3">
          <ul className="flex flex-col gap-2">
            {exactOthers.map((p) => (
              <li
                key={p.id}
                className="flex items-baseline justify-between text-sm"
              >
                <span className="text-gray-700">
                  {p.name}
                  <span className="ml-1 text-[10px] text-gray-400">
                    {labelFor(p.id)}
                  </span>
                </span>
                <span className="font-bold tabular-nums text-gray-900">
                  {p.amount.toLocaleString()}円
                </span>
              </li>
            ))}
            {payerExact && (
              <li className="flex items-baseline justify-between border-t border-gray-100 pt-2 text-sm">
                <span className="text-gray-500">
                  {result.payerName}（立替者本人）
                  <span className="ml-1 text-[10px] text-gray-400">
                    {labelFor(result.payerId)}
                  </span>
                </span>
                <span className="font-bold tabular-nums text-gray-900">
                  {payerExact.amount.toLocaleString()}円
                </span>
              </li>
            )}
          </ul>
        </div>
      </details>

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
          onClick={onReset}
          className="flex-1 rounded-xl border-2 border-gray-300 py-4 text-base font-bold text-gray-700 hover:bg-gray-50"
        >
          最初から
        </button>
      </div>
    </div>
  )
}
