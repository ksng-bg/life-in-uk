import Link from 'next/link'
import AboutFlap from './components/AboutFlap'

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Life in the UK Test
        </h1>

        <p className="text-xl text-gray-600 mb-6 max-w-2xl mx-auto">
          Practice for your British citizenship test with authentic questions.
          Test your knowledge of UK history, culture, and government.
        </p>

        <div className="mb-12">
          <AboutFlap />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div className="bg-white p-8 rounded-xl shadow-md">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              📚 Practice Mode
            </h2>
            <p className="text-gray-600 mb-6">
              Practice with all available questions. No time limit, instant feedback.
            </p>
            <Link 
              href="/practice"
              className="inline-block bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors"
            >
              Start Practice
            </Link>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-md">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              ⏱️ Test Mode
            </h2>
            <p className="text-gray-600 mb-6">
              Take the official test format: 24 questions, 45 minutes, pass with 75%.
            </p>
            <Link 
              href="/test"
              className="inline-block bg-success-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-success-700 transition-colors"
            >
              Take Test
            </Link>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-md">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              📋 Individual Tests
            </h2>
            <p className="text-gray-600 mb-6">
              Practice specific exam sets. Choose from available individual tests.
            </p>
            <Link
              href="/individual"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Select Exam
            </Link>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-md">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              🎯 Focus Mode
            </h2>
            <p className="text-gray-600 mb-6">
              Enter one word or a year to drill every question that mentions it. Great for
              strengthening memory on a topic.
            </p>
            <Link
              href="/focus"
              className="inline-block bg-yellow-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-yellow-600 transition-colors"
            >
              Start Focus
            </Link>
          </div>
        </div>

        <div className="bg-blue-50 p-6 rounded-xl">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            About the Life in the UK Test
          </h3>
          <p className="text-blue-800">
            This test is required for anyone applying for British citizenship or settlement. 
            You need to score 75% (18 out of 24 questions) to pass.
          </p>
        </div>
      </div>
    </main>
  )
}
