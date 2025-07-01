import React, { useState } from 'react'
import Header from './Header'
import StepInstructions from './Steps/StepInstructions'
import StepOverview from './Steps/StepOverview'
import StepTest from './Steps/StepTest'
import StepFinish from './Steps/StepFinish'

const Assesment = () => {
  const [step, setStep] = useState(0)
  const [timerStarted, setTimerStarted] = useState(false)

  const goToStep = (n) => setStep(n)
  const nextStep = () => setStep((prev) => prev + 1)
  const prevStep = () => setStep((prev) => prev - 1)

  const startTest = () => {
    if (!timerStarted) {
      localStorage.setItem('assessment_timer_seconds', 90 * 60)
      setTimerStarted(true)
    }
    goToStep(2)
  }

  const endTest = () => goToStep(3)

  const renderStep = () => {
    switch (step) {
      case 0: return <StepInstructions />
      case 1: return <StepOverview onStartTest={startTest} />
      case 2: return <StepTest />
      case 3: return <StepFinish />
      default: return null
    }
  }

  return (
    <div className="min-h-screen w-full bg-white text-gray-800">
     <Header onEndTest={endTest} start={step >= 2} />

      <main className="px-6 py-10 flex flex-col justify-between min-h-[calc(100vh-80px)]">
        <div className="flex-1">{renderStep()}</div>

        {step < 2 && (
          <div className="mt-6 flex justify-between">
            {step > 0 && (
              <button onClick={prevStep} className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded text-gray-800">Back</button>
            )}
            <button onClick={nextStep} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded ml-auto">Next</button>
          </div>
        )}
      </main>
    </div>
  )
}

export default Assesment
