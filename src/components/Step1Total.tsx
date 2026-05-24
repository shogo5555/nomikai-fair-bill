import { track } from '../utils/analytics'

type Props = {
  total: number
  onChange: (value: number) => void
  onNext: () => void
}

export function Step1Total({ total, onChange, onNext }: Props) {
  const canProceed = total > 0

  return (
    <div className="flex flex-col gap-6">
      <section className="rounded-xl bg-indigo-50 p-4 text-xs leading-relaxed text-gray-700">
        <p className="font-bold text-indigo-900">幹事の会計を30秒で</p>
        <ul className="mt-1 list-disc space-y-0.5 pl-4">
          <li>役職・お酒の量・途中参加で支払い割合を調整</li>
          <li>100円単位など丸めて支払いやすい金額に</li>
          <li>LINE 用テキストをワンタップでコピー</li>
        </ul>
        <p className="mt-3 font-bold text-indigo-900">つかい方</p>
        <ol className="mt-1 list-decimal space-y-0.5 pl-4">
          <li>合計金額を入力</li>
          <li>メンバーと支払い割合を選ぶ</li>
          <li>立替者を選んで完了</li>
        </ol>
      </section>

      <div>
        <p className="mb-2 text-[11px] font-bold uppercase tracking-wide text-gray-500">
          幹事向けガイド
        </p>
        <div className="flex flex-col gap-2">
          <a
            href="/guides/company-party-fee.html"
            onClick={() =>
              track({
                name: 'guide_link_click',
                guide_id: 'company-party-fee',
              })
            }
            className="block rounded-xl border border-gray-200 bg-white p-3 transition-colors hover:border-indigo-300 hover:bg-indigo-50"
          >
            <p className="text-xs font-bold text-indigo-700">
              会社の飲み会で役職別・年齢別に会費を分ける方法 →
            </p>
            <p className="mt-1 text-[11px] leading-relaxed text-gray-500">
              役職・年齢・途中参加を考慮した会費設定の考え方をまとめています。
            </p>
          </a>
          <a
            href="/guides/line-payment-message.html"
            onClick={() =>
              track({
                name: 'guide_link_click',
                guide_id: 'line-payment-message',
              })
            }
            className="block rounded-xl border border-gray-200 bg-white p-3 transition-colors hover:border-indigo-300 hover:bg-indigo-50"
          >
            <p className="text-xs font-bold text-indigo-700">
              飲み会幹事がLINE・メールで送る会計報告文テンプレ →
            </p>
            <p className="mt-1 text-[11px] leading-relaxed text-gray-500">
              LINE・メールそれぞれの文面例、角が立たない言い回しのコツをまとめています。
            </p>
          </a>
        </div>
      </div>

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
