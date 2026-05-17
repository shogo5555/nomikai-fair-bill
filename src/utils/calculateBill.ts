import type {
  BillResult,
  Member,
  RoundedBillResult,
  RoundingUnit,
} from '../types'

/** コピー文面に挿入するサービスURL。ドメイン変更時はここを更新する */
const SERVICE_URL = 'https://nomikai-fair-bill-production.up.railway.app/'

/**
 * 倍率ベースで負担額を計算する純粋関数。
 * - 各人の負担額 = total × (weight / weight合計)
 * - 1円単位で四捨五入
 * - 端数調整: 丸めの差額は立替者に集約する
 */
export function calculateBill(
  total: number,
  members: Member[],
  payerId: string,
): BillResult {
  const payer = members.find((m) => m.id === payerId)
  const payerName = payer?.name ?? ''

  if (members.length === 0 || total <= 0) {
    return { perMember: [], total, payerId, payerName }
  }

  const sumWeights = members.reduce((sum, m) => sum + m.weight, 0)

  if (sumWeights <= 0) {
    return { perMember: [], total, payerId, payerName }
  }

  const rawAmounts = members.map((m) => (total * m.weight) / sumWeights)
  const roundedAmounts = rawAmounts.map((a) => Math.round(a))

  const roundedTotal = roundedAmounts.reduce((sum, a) => sum + a, 0)
  const diff = total - roundedTotal

  const payerIndex = members.findIndex((m) => m.id === payerId)
  const adjustIndex = payerIndex >= 0 ? payerIndex : roundedAmounts.length - 1
  roundedAmounts[adjustIndex] += diff

  return {
    perMember: members.map((m, i) => ({
      id: m.id,
      name: m.name,
      amount: roundedAmounts[i],
      payTo: m.id === payerId ? 0 : roundedAmounts[i],
    })),
    total,
    payerId,
    payerName,
  }
}

/** unit 単位で四捨五入。負値は 0 にクランプ。 */
function roundToUnit(amount: number, unit: number): number {
  const rounded = Math.round(amount / unit) * unit
  return Math.max(0, rounded)
}

/**
 * きっちり精算結果を丸め単位に変換する純粋関数。
 * - 立替者以外の支払いを unit 単位で四捨五入
 * - 丸めによる差額は立替者の実質負担額が吸収する
 */
export function applyRounding(
  result: BillResult,
  unit: RoundingUnit,
): RoundedBillResult {
  const others = result.perMember
    .filter((p) => p.id !== result.payerId)
    .map((p) => ({
      id: p.id,
      name: p.name,
      exactAmount: p.payTo,
      roundedAmount: roundToUnit(p.payTo, unit),
    }))

  const payerExact =
    result.perMember.find((p) => p.id === result.payerId)?.amount ?? 0
  const sumOthersRounded = others.reduce((sum, o) => sum + o.roundedAmount, 0)
  const payerEffective = result.total - sumOthersRounded
  const payerDiff = payerEffective - payerExact

  return {
    unit,
    total: result.total,
    payerId: result.payerId,
    payerName: result.payerName,
    others,
    payerExactAmount: payerExact,
    payerEffectiveAmount: payerEffective,
    payerDiff,
  }
}

/** LINE に貼りやすい丸め精算のテキスト */
export function formatRoundedResultForCopy(result: RoundedBillResult): string {
  if (result.others.length === 0 && result.payerExactAmount === 0) return ''

  const unitLabel = `${result.unit.toLocaleString()}円単位`
  const lines: string[] = []
  lines.push('【飲み会の精算】')
  lines.push(`合計 ${result.total.toLocaleString()}円`)
  lines.push(`立替: ${result.payerName}さん`)
  lines.push(`（${unitLabel}で丸めています）`)
  lines.push('')
  lines.push(`▼ ${result.payerName}さんへの支払い`)

  if (result.others.length === 0) {
    lines.push('（他の参加者なし）')
  } else {
    result.others.forEach((o) => {
      lines.push(`・${o.name}: ${o.roundedAmount.toLocaleString()}円`)
    })
  }

  lines.push('')
  const diffSign =
    result.payerDiff === 0 ? '±' : result.payerDiff > 0 ? '+' : '−'
  const diffAbs = Math.abs(result.payerDiff)
  lines.push(
    `${result.payerName}さんの負担: ${result.payerEffectiveAmount.toLocaleString()}円` +
      (result.payerDiff === 0
        ? ''
        : `（丸めにより ${diffSign}${diffAbs.toLocaleString()}円）`),
  )

  lines.push('')
  lines.push(`（計算: ${SERVICE_URL}）`)

  return lines.join('\n')
}
