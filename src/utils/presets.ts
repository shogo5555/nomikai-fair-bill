import type { CoefficientPreset, Member, RoundingUnit } from '../types'

export const COEFFICIENT_PRESETS: readonly CoefficientPreset[] = [
  { id: 'half', label: '途中参加', value: 0.5 },
  { id: 'no-alcohol', label: 'お酒なし', value: 0.8 },
  { id: 'normal', label: 'ふつう', value: 1.0 },
  { id: 'a-bit-more', label: '少し多め', value: 1.2 },
  { id: 'more', label: '多め', value: 1.5 },
  { id: 'treat', label: 'ごちそう寄り', value: 2.0 },
] as const

export const DEFAULT_PRESET_ID = 'normal'
export const DEFAULT_WEIGHT = 1.0

export const MIN_WEIGHT = 0.1
export const MAX_WEIGHT = 5.0
export const WEIGHT_STEP = 0.1

export const ROUNDING_UNITS: readonly RoundingUnit[] = [10, 100, 500, 1000] as const
export const DEFAULT_ROUNDING_UNIT: RoundingUnit = 100

/** 小数第1位に丸める（0.1+0.2 等の浮動小数誤差を吸収） */
export function round1(value: number): number {
  return Math.round(value * 10) / 10
}

/** 範囲外・NaN を最小値〜最大値にクランプし、小数第1位に整える */
export function clampWeight(value: number): number {
  if (!Number.isFinite(value)) return MIN_WEIGHT
  const clamped = Math.min(MAX_WEIGHT, Math.max(MIN_WEIGHT, value))
  return round1(clamped)
}

/**
 * ユーザー入力文字列を解釈して数値化する。
 * - カンマ「,」はドット「.」として扱う（日本語環境対応）
 * - 空欄や数値化できない場合は null を返す
 * - 値が出ても範囲外はクランプして返す（呼び出し側で扱いやすいよう必ず有効値）
 */
export function parseWeightInput(raw: string): number | null {
  const normalized = raw.replace(/,/g, '.').trim()
  if (normalized === '') return null
  const parsed = Number(normalized)
  if (!Number.isFinite(parsed)) return null
  return clampWeight(parsed)
}

/**
 * 支払い割合ラベルを生成する。
 * - プリセット選択時:  `多め ×1.5` のように「ラベル + 倍率」
 * - カスタム入力時:    `×1.4` のように倍率のみ
 */
export function formatWeightLabel(member: Member): string {
  const preset = COEFFICIENT_PRESETS.find(
    (p) => p.id === member.selectedPresetId,
  )
  const value = round1(member.weight)
  return preset ? `${preset.label} ×${value}` : `×${value}`
}
