import { useEffect, useState } from 'react'
import type { CoefficientPreset, Member } from '../types'
import { CUSTOM_PRESET_ID } from '../types'
import {
  COEFFICIENT_PRESETS,
  MAX_WEIGHT,
  MIN_WEIGHT,
  WEIGHT_STEP,
  clampWeight,
  parseWeightInput,
  round1,
} from '../utils/presets'

type Props = {
  member: Member
  index: number
  onRemove: (id: string) => void
  onChangeName: (id: string, name: string) => void
  /** プリセットボタン押下時。weight と selectedPresetId を同時にセット */
  onSelectPreset: (id: string, preset: CoefficientPreset) => void
  /** +/-/手入力時。weight を更新しつつ selectedPresetId を 'custom' にする */
  onChangeCustomWeight: (id: string, weight: number) => void
}

export function MemberCard({
  member: m,
  index,
  onRemove,
  onChangeName,
  onSelectPreset,
  onChangeCustomWeight,
}: Props) {
  // 入力中の文字列を保持する。親の weight が外部変更（プリセット選択や +/-）された場合は同期する
  const [weightInput, setWeightInput] = useState<string>(
    String(round1(m.weight)),
  )

  useEffect(() => {
    setWeightInput(String(round1(m.weight)))
  }, [m.weight])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value
    setWeightInput(raw)
    // 即時に有効な数値が読み取れた場合のみ計算に反映する
    const parsed = parseWeightInput(raw)
    if (parsed === null) return
    onChangeCustomWeight(m.id, parsed)
  }

  const handleInputBlur = () => {
    // 確定時は必ず有効な値に正規化する
    const parsed = parseWeightInput(weightInput)
    if (parsed === null) {
      // 空欄や無効入力なら現在の weight に戻す
      setWeightInput(String(round1(m.weight)))
      return
    }
    setWeightInput(String(parsed))
    if (parsed !== round1(m.weight)) {
      onChangeCustomWeight(m.id, parsed)
    }
  }

  const handleDecrement = () => {
    const next = clampWeight(round1(m.weight) - WEIGHT_STEP)
    onChangeCustomWeight(m.id, next)
  }

  const handleIncrement = () => {
    const next = clampWeight(round1(m.weight) + WEIGHT_STEP)
    onChangeCustomWeight(m.id, next)
  }

  return (
    <li className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
      <div className="flex items-center gap-2">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-700">
          {index + 1}
        </span>
        <input
          type="text"
          value={m.name}
          onChange={(e) => onChangeName(m.id, e.target.value)}
          placeholder={`参加者${index + 1}`}
          className="min-w-0 flex-1 rounded-lg border border-gray-200 px-3 py-2 text-base focus:border-indigo-600 focus:outline-none"
        />
        <button
          type="button"
          onClick={() => onRemove(m.id)}
          aria-label="削除"
          className="shrink-0 rounded-lg px-3 py-2 text-sm text-gray-400 hover:text-red-500"
        >
          ✕
        </button>
      </div>

      <div className="grid grid-cols-3 gap-1.5">
        {COEFFICIENT_PRESETS.map((preset) => {
          // プリセットを明示的に押した場合のみハイライト。手入力で値が一致してもハイライトしない
          const selected = m.selectedPresetId === preset.id
          return (
            <button
              key={preset.id}
              type="button"
              onClick={() => onSelectPreset(m.id, preset)}
              className={`flex flex-col items-center justify-center rounded-lg px-1 py-2 text-xs transition-colors ${
                selected
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span className="font-bold">{preset.label}</span>
              <span className="mt-0.5 opacity-80">×{preset.value}</span>
            </button>
          )
        })}
      </div>

      <div className="flex items-center justify-between gap-2 border-t border-gray-100 pt-2">
        <span className="text-xs text-gray-500">
          係数を調整
          {m.selectedPresetId === CUSTOM_PRESET_ID && (
            <span className="ml-1 rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold text-amber-700">
              カスタム
            </span>
          )}
        </span>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            aria-label="係数を減らす"
            onClick={handleDecrement}
            disabled={round1(m.weight) <= MIN_WEIGHT}
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-lg font-bold text-gray-700 hover:bg-gray-200 disabled:opacity-40"
          >
            −
          </button>
          <input
            type="text"
            inputMode="decimal"
            value={weightInput}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            aria-label="係数を入力"
            className="w-16 rounded-lg border border-gray-200 px-2 py-1.5 text-center text-base font-bold tabular-nums focus:border-indigo-600 focus:outline-none"
          />
          <button
            type="button"
            aria-label="係数を増やす"
            onClick={handleIncrement}
            disabled={round1(m.weight) >= MAX_WEIGHT}
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-lg font-bold text-gray-700 hover:bg-gray-200 disabled:opacity-40"
          >
            ＋
          </button>
        </div>
      </div>
    </li>
  )
}
