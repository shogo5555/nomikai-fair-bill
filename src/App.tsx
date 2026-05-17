import { useMemo, useState } from 'react'
import type { CoefficientPreset, Member, RoundingUnit } from './types'
import { CUSTOM_PRESET_ID } from './types'
import { applyRounding, calculateBill } from './utils/calculateBill'
import {
  DEFAULT_PRESET_ID,
  DEFAULT_ROUNDING_UNIT,
  DEFAULT_WEIGHT,
  clampWeight,
} from './utils/presets'
import { StepIndicator } from './components/StepIndicator'
import { Step1Total } from './components/Step1Total'
import { Step2Members } from './components/Step2Members'
import { Step3Payer } from './components/Step3Payer'
import { Step4Result } from './components/Step4Result'

const TOTAL_STEPS = 4

function createMember(index: number): Member {
  return {
    id:
      typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? crypto.randomUUID()
        : `m-${Date.now()}-${Math.random()}`,
    name: `参加者${index}`,
    weight: DEFAULT_WEIGHT,
    selectedPresetId: DEFAULT_PRESET_ID,
  }
}

function App() {
  const [step, setStep] = useState(1)
  const [total, setTotal] = useState(0)
  const [members, setMembers] = useState<Member[]>([
    createMember(1),
    createMember(2),
  ])
  const [payerId, setPayerId] = useState('')
  const [paymentMemo, setPaymentMemo] = useState('')
  const [roundingUnit, setRoundingUnit] =
    useState<RoundingUnit>(DEFAULT_ROUNDING_UNIT)

  const result = useMemo(
    () => calculateBill(total, members, payerId),
    [total, members, payerId],
  )

  const rounded = useMemo(
    () => applyRounding(result, roundingUnit),
    [result, roundingUnit],
  )

  const addMember = () => {
    setMembers((prev) => [...prev, createMember(prev.length + 1)])
  }

  const removeMember = (id: string) => {
    setMembers((prev) => prev.filter((m) => m.id !== id))
    if (payerId === id) setPayerId('')
  }

  const changeName = (id: string, name: string) => {
    setMembers((prev) => prev.map((m) => (m.id === id ? { ...m, name } : m)))
  }

  /** プリセットボタン押下: weight と selectedPresetId を同時に更新 */
  const selectPreset = (id: string, preset: CoefficientPreset) => {
    setMembers((prev) =>
      prev.map((m) =>
        m.id === id
          ? { ...m, weight: preset.value, selectedPresetId: preset.id }
          : m,
      ),
    )
  }

  /** +/-/手入力: weight を更新し selectedPresetId は 'custom' にする */
  const changeCustomWeight = (id: string, weight: number) => {
    const safeWeight = clampWeight(weight)
    setMembers((prev) =>
      prev.map((m) =>
        m.id === id
          ? { ...m, weight: safeWeight, selectedPresetId: CUSTOM_PRESET_ID }
          : m,
      ),
    )
  }

  const reset = () => {
    setStep(1)
    setTotal(0)
    setMembers([createMember(1), createMember(2)])
    setPayerId('')
    setPaymentMemo('')
    setRoundingUnit(DEFAULT_ROUNDING_UNIT)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto flex min-h-screen max-w-[390px] flex-col bg-white shadow-sm">
        <header className="px-5 pt-6">
          <h1 className="text-center text-lg font-bold text-gray-900">
            飲み会幹事会計
          </h1>
          <StepIndicator current={step} total={TOTAL_STEPS} />
        </header>

        <main className="flex-1 px-5 pb-8">
          {step === 1 && (
            <Step1Total
              total={total}
              onChange={setTotal}
              onNext={() => setStep(2)}
            />
          )}
          {step === 2 && (
            <Step2Members
              members={members}
              onAdd={addMember}
              onRemove={removeMember}
              onChangeName={changeName}
              onSelectPreset={selectPreset}
              onChangeCustomWeight={changeCustomWeight}
              onBack={() => setStep(1)}
              onNext={() => setStep(3)}
            />
          )}
          {step === 3 && (
            <Step3Payer
              members={members}
              payerId={payerId}
              memo={paymentMemo}
              onSelect={setPayerId}
              onChangeMemo={setPaymentMemo}
              onBack={() => setStep(2)}
              onNext={() => setStep(4)}
            />
          )}
          {step === 4 && (
            <Step4Result
              result={result}
              rounded={rounded}
              roundingUnit={roundingUnit}
              members={members}
              memo={paymentMemo}
              onChangeRoundingUnit={setRoundingUnit}
              onBack={() => setStep(3)}
              onReset={reset}
            />
          )}
        </main>

        <footer className="px-5 pb-5 pt-2 text-center text-[10px] text-gray-400">
          <a
            href="https://forms.gle/6YtDK887Z1z8M5Mn8"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-gray-600"
          >
            フィードバックを送る
          </a>
        </footer>
      </div>
    </div>
  )
}

export default App
