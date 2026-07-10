'use client'

import { useState } from 'react'
import Link from 'next/link'
import { QuizContainer } from '../components/quiz'
import { isValidKeyword } from '../utils/keyword'

const EXAMPLES = ['Parliament', 'Churchill', '1918', 'Shakespeare', 'Wales', '1066']

export default function FocusPage() {
  const [input, setInput] = useState('')
  const [keyword, setKeyword] = useState<string | null>(null)
  const [error, setError] = useState('')

  const startFocus = (raw: string) => {
    const k = raw.trim()
    if (!k) {
      setError('Please enter a word or a year to focus on.')
      return
    }
    if (!isValidKeyword(k)) {
      setError('Please enter only ONE word (or a single year) — no spaces.')
      return
    }
    setError('')
    setKeyword(k)
  }

  // Once a keyword is chosen, run the quiz built from every matching question.
  if (keyword) {
    const config = {
      mode: 'focus' as const,
      keyword,
      shuffleQuestions: true,
      shuffleAnswers: true,
      showInstantFeedback: true,
      allowReview: true,
      showProgress: true,
    }
    return (
      <QuizContainer
        config={config}
        onBackToSelection={() => setKeyword(null)}
      />
    )
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">🎯 Focus Mode</h1>
          <p className="text-lg text-gray-600 mb-8">
            Type <strong>one word</strong> or <strong>one year</strong>, and we&apos;ll build a
            mini-test from every question, answer and explanation that mentions it — a great way
            to drill a single topic and strengthen your memory.
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault()
              startFocus(input)
            }}
            className="bg-white rounded-xl shadow-md p-6"
          >
            <label htmlFor="focus-keyword" className="sr-only">
              Keyword or year
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                id="focus-keyword"
                type="text"
                value={input}
                onChange={(e) => {
                  setInput(e.target.value)
                  if (error) setError('')
                }}
                placeholder="e.g. Parliament or 1918"
                autoFocus
                autoComplete="off"
                className="flex-1 px-4 py-3 rounded-lg border-2 border-gray-300 text-gray-900 focus:border-primary-500 focus:outline-none"
              />
              <button
                type="submit"
                className="bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors"
              >
                Start Focus
              </button>
            </div>

            {error && (
              <p className="mt-3 text-sm text-danger-600 text-left">{error}</p>
            )}

            <div className="mt-5 text-left">
              <p className="text-sm text-gray-500 mb-2">Try one of these:</p>
              <div className="flex flex-wrap gap-2">
                {EXAMPLES.map((ex) => (
                  <button
                    key={ex}
                    type="button"
                    onClick={() => {
                      setInput(ex)
                      startFocus(ex)
                    }}
                    className="px-3 py-1.5 rounded-full bg-gray-100 text-gray-700 text-sm hover:bg-primary-100 hover:text-primary-700 transition-colors"
                  >
                    {ex}
                  </button>
                ))}
              </div>
            </div>
          </form>

          <div className="mt-8">
            <Link href="/" className="text-primary-600 hover:text-primary-700 font-medium">
              ← Back to Main Menu
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
