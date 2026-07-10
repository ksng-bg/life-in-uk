'use client'

import { useEffect, useState } from 'react'

const FEEDBACK_EMAIL = 'ksisbuilding@gmail.com'

// Pre-filled email so a tap opens the user's mail app ready to send.
const mailtoHref = () => {
  const subject = encodeURIComponent('Feedback — Life in the UK Test')
  const body = encodeURIComponent(
    "Hi KSIS Building team,\n\nHere's my feedback on the Life in the UK Test site:\n\n" +
      '\n\n— Sent from the About panel'
  )
  return `mailto:${FEEDBACK_EMAIL}?subject=${subject}&body=${body}`
}

function Section({
  icon,
  title,
  children,
}: {
  icon: string
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="flex gap-3">
      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-base">
        {icon}
      </div>
      <div className="min-w-0">
        <h4 className="text-sm font-semibold text-gray-900">{title}</h4>
        <div className="mt-0.5 text-sm leading-relaxed text-gray-600">{children}</div>
      </div>
    </div>
  )
}

export default function AboutFlap() {
  const [open, setOpen] = useState(false)

  // Close on Escape and lock body scroll while the panel is open.
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [open])

  return (
    <>
      {/* The flap — a slim pill floating at the bottom centre */}
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="About this page"
          className="fixed bottom-4 left-1/2 z-40 -translate-x-1/2 flex items-center gap-2 rounded-full border border-gray-200/80 bg-white/90 px-4 py-2 text-sm font-medium text-gray-700 shadow-lg backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:text-gray-900 active:translate-y-0"
        >
          <span
            className="inline-block h-2 w-2 rounded-full bg-primary-500"
            aria-hidden="true"
          />
          About this page
        </button>
      )}

      {/* Expanded panel */}
      {open && (
        <div
          className="aboutflap-backdrop fixed inset-0 z-50 flex items-end justify-center bg-gray-900/40 p-3 backdrop-blur-sm sm:items-center"
          onClick={() => setOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="About this page"
        >
          <div
            className="aboutflap-panel relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="relative bg-gradient-to-br from-primary-600 to-primary-800 px-5 py-5 text-white">
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full text-white/80 transition-colors hover:bg-white/15 hover:text-white"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path
                    d="M4 4l8 8M12 4l-8 8"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
              <h3 className="text-lg font-bold">Life in the UK Test</h3>
              <p className="mt-1 text-sm text-white/80">
                Free practice for the British citizenship test.
              </p>
            </div>

            {/* Body */}
            <div className="max-h-[55vh] space-y-4 overflow-y-auto px-5 py-5">
              <Section icon="📖" title="What this is">
                A free, ad-free practice tool covering the official Life in the UK test — full
                24-question mock exams, individual test sets, and instant feedback. No sign-up,
                no paywall.
              </Section>

              <Section icon="🏗️" title="Where it comes from">
                Built and maintained by <span className="font-medium text-gray-800">KSIS Building</span>,
                with questions drawn from the official Life in the UK handbook material.
              </Section>

              <Section icon="✨" title="What&rsquo;s improved recently">
                <ul className="mt-1 list-disc space-y-1 pl-4">
                  <li><span className="font-medium text-gray-800">Focus Mode</span> — drill every question mentioning a word or year.</li>
                  <li>Individual test sets alongside the full mock exam.</li>
                  <li>Instant answer feedback while you practise.</li>
                  <li>Layout that adapts to short laptops and phones.</li>
                </ul>
              </Section>

              <Section icon="🎯" title="Why we built it">
                Citizenship prep is stressful and often costs money. We wanted a clean, honest,
                genuinely free way to practise — no ads, no data selling.
              </Section>
            </div>

            {/* Feedback footer */}
            <div className="border-t border-gray-100 bg-gray-50 px-5 py-4">
              <p className="text-sm text-gray-600">
                Spotted something, or have an idea? We&rsquo;d love to hear it.
              </p>
              <a
                href={mailtoHref()}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-primary-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-700"
              >
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                  <path
                    d="M2.5 5.5A1.5 1.5 0 014 4h12a1.5 1.5 0 011.5 1.5v9A1.5 1.5 0 0116 16H4a1.5 1.5 0 01-1.5-1.5v-9z"
                    stroke="currentColor"
                    strokeWidth="1.4"
                  />
                  <path d="M3 5.5l7 5 7-5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Send feedback
              </a>
              <p className="mt-2 text-center text-xs text-gray-400">{FEEDBACK_EMAIL}</p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
