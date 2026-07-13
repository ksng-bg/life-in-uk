'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

interface TestResult {
  questionIndex: number
  examNumber: number
  questionNumber: number
  question: string
  reference: string
  selectedAnswers: number[]
  correctAnswers: number[]
  isCorrect: boolean
  wasAnswered?: boolean // absent on legacy results → treat as answered
  userAnswerTexts: string[]
  correctAnswerTexts: string[]
}

export default function ResultsPage() {
  const searchParams = useSearchParams()
  const [results, setResults] = useState<TestResult[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const resultsData = searchParams.get('data')
    const resultsId = searchParams.get('id')
    const mode = searchParams.get('mode')
    
    if (resultsData) {
      // Legacy method: data in URL (for backward compatibility)
      try {
        const parsedResults = JSON.parse(decodeURIComponent(resultsData))
        setResults(parsedResults)
      } catch (error) {
        console.error('Error parsing results data from URL:', error)
      }
    } else if (resultsId) {
      // New method: data in sessionStorage
      try {
        let storageKey
        if (mode === 'individual') {
          storageKey = `individual-results-${resultsId}`
        } else if (mode === 'practice') {
          storageKey = `practice-results-${resultsId}`
        } else if (mode === 'focus') {
          storageKey = `focus-results-${resultsId}`
        } else {
          storageKey = `test-results-${resultsId}`
        }
        const storedData = sessionStorage.getItem(storageKey)
        
        if (storedData) {
          const parsedResults = JSON.parse(storedData)
          setResults(parsedResults)
          
          // Clean up the stored data after loading
          sessionStorage.removeItem(storageKey)
        } else {
          console.error('No results data found in sessionStorage')
        }
      } catch (error) {
        console.error('Error parsing results data from sessionStorage:', error)
      }
    }
    
    setLoading(false)
  }, [searchParams])

  // Get additional parameters for individual tests
  const mode = searchParams.get('mode')
  const examNumber = searchParams.get('exam')
  const originalMode = searchParams.get('originalMode')

  // Determine the test type for display
  const getTestTitle = () => {
    if (mode === 'individual') {
      return `Exam ${examNumber} Results ${originalMode === 'practice' ? '(Practice)' : '(Test)'}`
    } else if (mode === 'practice') {
      return 'Practice Results'
    } else if (mode === 'focus') {
      return 'Focus Results'
    } else {
      return 'Test Results'
    }
  }

  // Practice/focus are "do a subset" modes: the score is based only on questions you
  // actually answered, and skipped questions are reviewed in their own section.
  // Test/individual are exam-style: unanswered questions count as incorrect.
  const practiceLike = mode === 'practice' || mode === 'focus'
  const answeredResults = results.filter(r => r.wasAnswered !== false)
  const skippedResults = practiceLike ? results.filter(r => r.wasAnswered === false) : []

  const scoredResults = practiceLike ? answeredResults : results
  const correctCount = scoredResults.filter(r => r.isCorrect).length
  const incorrectResults = scoredResults.filter(r => !r.isCorrect)
  const incorrectCount = incorrectResults.length
  const skippedCount = skippedResults.length
  const percentage = scoredResults.length > 0 ? Math.round((correctCount / scoredResults.length) * 100) : 0
  const passed = percentage >= 75

  const exportForReview = () => {
    const rows = [
      ...incorrectResults.map(r => ({ r, status: 'Wrong' })),
      ...skippedResults.map(r => ({ r, status: 'Skipped' })),
    ]

    const csvHeaders = [
      'Question Number',
      'Result',
      'Question',
      'Your Answer(s)',
      'Correct Answer(s)',
      'Explanation'
    ]

    const csvRows = rows.map(({ r, status }) => [
      `Question ${r.questionIndex + 1}`,
      status,
      `"${r.question.replace(/"/g, '""')}"`,
      `"${(r.userAnswerTexts.join('; ') || '(not answered)').replace(/"/g, '""')}"`,
      `"${r.correctAnswerTexts.join('; ').replace(/"/g, '""')}"`,
      `"${(r.reference || '').replace(/"/g, '""')}"`
    ])

    const csvContent = [csvHeaders, ...csvRows]
      .map(row => row.join(','))
      .join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')

    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', `life-in-uk-review-${new Date().toISOString().split('T')[0]}.csv`)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {getTestTitle()}
            </h1>
            <div className={`text-6xl font-bold mb-4 ${passed ? 'text-success-600' : 'text-danger-600'}`}>
              {percentage}%
            </div>
            <div className={`text-2xl font-semibold ${passed ? 'text-success-800' : 'text-danger-800'}`}>
              {passed ? '🎉 PASSED!' : '❌ FAILED'}
            </div>
            {passed ? (
              <p className="text-lg text-success-700 mt-2">
                Congratulations! You passed the Life in the UK test.
              </p>
            ) : (
              <p className="text-lg text-danger-700 mt-2">
                You need 75% (18 out of 24) to pass. Keep studying and try again!
              </p>
            )}
          </div>

          {/* Score Summary */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="text-3xl font-bold text-success-600 mb-2">
                {correctCount}
              </div>
              <div className="text-gray-600">Correct Answers</div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="text-3xl font-bold text-danger-600 mb-2">
                {incorrectCount}
              </div>
              <div className="text-gray-600">Incorrect Answers</div>
            </div>
            
            {practiceLike ? (
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <div className="text-3xl font-bold text-warning-600 mb-2">
                  {skippedCount}
                </div>
                <div className="text-gray-600">Skipped</div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <div className="text-3xl font-bold text-primary-600 mb-2">
                  {results.length}
                </div>
                <div className="text-gray-600">Total Questions</div>
              </div>
            )}
          </div>

          {/* Export and Actions */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Actions
            </h2>
            <div className="flex flex-wrap gap-4">
              {(incorrectCount > 0 || skippedCount > 0) && (
                <button
                  onClick={exportForReview}
                  className="bg-warning-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-warning-700 transition-colors flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  {incorrectCount > 0 && skippedCount > 0
                    ? 'Export Wrong + Skipped (CSV)'
                    : skippedCount > 0
                    ? 'Export Skipped (CSV)'
                    : 'Export Incorrect Answers (CSV)'}
                </button>
              )}
              
              <Link
                href={mode === 'individual' ? '/individual' : mode === 'focus' ? '/focus' : mode === 'practice' ? '/practice' : '/test'}
                className="bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors"
              >
                {mode === 'individual' ? 'Take Another Individual Test' : mode === 'focus' ? 'Focus on Another Keyword' : mode === 'practice' ? 'Practice Again' : 'Take Another Test'}
              </Link>
              
              <Link
                href="/"
                className="bg-gray-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors"
              >
                Back to Home
              </Link>
            </div>
          </div>

          {/* Incorrect Answers Details */}
          {incorrectCount > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                Questions You Got Wrong ({incorrectCount})
              </h2>

              <div className="space-y-6">
                {incorrectResults.map((result, index) => (
                  <div key={index} className="border-l-4 border-danger-500 pl-4 py-2">
                    <div className="font-medium text-gray-900 mb-2">
                      Question {result.questionIndex + 1}: {result.question}
                    </div>

                    <div className="mb-2">
                      <span className="text-danger-600 font-medium">Your answer: </span>
                      <span className="text-danger-700">{result.userAnswerTexts.join(', ')}</span>
                    </div>

                    <div className="mb-2">
                      <span className="text-success-600 font-medium">Correct answer: </span>
                      <span className="text-success-700">{result.correctAnswerTexts.join(', ')}</span>
                    </div>

                    {result.reference && (
                      <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                        <strong>Explanation:</strong> {result.reference}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skipped / Not Answered (practice & focus only) */}
          {skippedCount > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-1">
                Skipped / Not Answered ({skippedCount})
              </h2>
              <p className="text-sm text-gray-500 mb-6">
                Questions you didn&rsquo;t answer this round — here are the correct answers so you can review them.
              </p>

              <div className="space-y-6">
                {skippedResults.map((result, index) => (
                  <div key={index} className="border-l-4 border-warning-500 pl-4 py-2">
                    <div className="font-medium text-gray-900 mb-2">
                      Question {result.questionIndex + 1}: {result.question}
                    </div>

                    <div className="mb-2">
                      <span className="text-success-600 font-medium">Correct answer: </span>
                      <span className="text-success-700">{result.correctAnswerTexts.join(', ')}</span>
                    </div>

                    {result.reference && (
                      <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                        <strong>Explanation:</strong> {result.reference}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Perfect Score Message — only when everything answered was correct AND nothing skipped */}
          {incorrectCount === 0 && skippedCount === 0 && scoredResults.length > 0 && (
            <div className="bg-success-50 border border-success-200 rounded-lg p-6 text-center">
              <div className="text-success-700 text-xl font-medium mb-2">
                🌟 Perfect Score! 🌟
              </div>
              <p className="text-success-600">
                Excellent work! You answered all questions correctly.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
