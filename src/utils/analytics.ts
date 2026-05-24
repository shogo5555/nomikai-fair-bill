/**
 * GA4 に送信するイベントの型安全ラッパー。
 *
 * 設計原則:
 * - PII（氏名・金額・支払いメモなど）を送信できないよう、各イベントの params を
 *   型レベルで限定する（string の自由入力フィールドを持たない）。
 * - gtag.js が未ロード／無効でもアプリの動作に影響しないよう、no-op + try/catch。
 * - 新規イベントを追加する場合は、必ず AnalyticsEvent に型を加えてから track() を呼ぶ。
 */

type GtagFunction = (
  command: 'event' | 'config' | 'js',
  ...args: unknown[]
) => void

declare global {
  interface Window {
    gtag?: GtagFunction
    dataLayer?: unknown[]
  }
}

export type AnalyticsEvent =
  | { name: 'start_calculation' }
  | { name: 'complete_calculation'; member_count: number }
  | { name: 'copy_result'; rounding_unit: 10 | 100 | 500 | 1000 }
  | { name: 'feedback_click'; from: 'top' | 'article' }
  | {
      name: 'guide_link_click'
      guide_id: 'company-party-fee' | 'line-payment-message'
    }
  /**
   * guide_cta_click は静的記事HTML（public/guides/*.html）から
   * 直接 gtag を呼ぶため React では使われないが、全イベントの
   * 単一の真実源として型に含めておく。
   */
  | {
      name: 'guide_cta_click'
      from: 'company-party-fee' | 'line-payment-message'
      placement: 'middle' | 'end'
    }

export function track(event: AnalyticsEvent): void {
  if (typeof window === 'undefined' || !window.gtag) return
  const { name, ...params } = event
  try {
    window.gtag('event', name, params)
  } catch {
    // 解析エラーはアプリの動作に影響させない
  }
}
