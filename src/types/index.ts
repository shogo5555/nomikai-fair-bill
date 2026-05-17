/** カスタム入力（プリセット未選択）を示す識別子 */
export const CUSTOM_PRESET_ID = 'custom' as const
export type CustomPresetId = typeof CUSTOM_PRESET_ID
export type PresetId = string
/** 現在ハイライト中のプリセットID。'custom' はどのプリセットもハイライトしないことを示す */
export type SelectedPresetId = PresetId | CustomPresetId

export type Member = {
  id: string
  name: string
  /** 計算に使う実係数（0.1〜5.0、小数第1位） */
  weight: number
  /** ハイライト用の状態。プリセットボタンを押した場合のみそのID、+/-/手入力時は 'custom' */
  selectedPresetId: SelectedPresetId
}

export type CoefficientPreset = {
  id: PresetId
  label: string
  value: number
}

export type PerMemberResult = {
  id: string
  name: string
  amount: number
  payTo: number
}

export type BillResult = {
  perMember: PerMemberResult[]
  total: number
  payerId: string
  payerName: string
}

export type RoundingUnit = 10 | 100 | 500 | 1000

export type RoundedOtherEntry = {
  id: string
  name: string
  exactAmount: number
  roundedAmount: number
}

export type RoundedBillResult = {
  unit: RoundingUnit
  total: number
  payerId: string
  payerName: string
  others: RoundedOtherEntry[]
  payerExactAmount: number
  payerEffectiveAmount: number
  payerDiff: number
}
