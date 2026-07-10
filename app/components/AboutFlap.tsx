'use client'

import { useEffect, useState } from 'react'
import { getAssetUrl } from '../utils/assets'

const FEEDBACK_EMAIL = 'ksisbuilding@gmail.com'

// Buy Me a Coffee — confirm this handle points at your real page.
const COFFEE_URL = 'https://buymeacoffee.com/ksisbuilding'

// The project this fork is built on. Credit stays visible in the About panel.
const ORIGINAL_REPO_URL = 'https://github.com/domicch/life-in-uk'

// Pre-filled email so a tap opens the user's mail app ready to send.
const mailtoHref = () => {
  const subject = encodeURIComponent('Feedback — Life in the UK Test')
  const body = encodeURIComponent(
    "Hi KS,\n\nHere's my feedback on the Life in the UK Test site:\n\n" +
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
      <div className="min-w-0 flex-1">
        <h4 className="text-sm font-semibold text-gray-900">{title}</h4>
        <div className="mt-0.5 text-sm leading-relaxed text-gray-600">{children}</div>
      </div>
    </div>
  )
}

// A "what's new" item: title, one-line description, and a demo GIF of the feature in action.
function FeatureDemo({
  title,
  src,
  alt,
  children,
}: {
  title: string
  src: string
  alt: string
  children: React.ReactNode
}) {
  return (
    <div>
      <h5 className="text-sm font-semibold text-gray-900">{title}</h5>
      <p className="mt-0.5 text-sm leading-relaxed text-gray-600">{children}</p>
      <img
        src={getAssetUrl(src)}
        alt={alt}
        loading="lazy"
        className="mt-2 w-full rounded-lg border border-gray-200 shadow-sm"
      />
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
            className="aboutflap-panel relative w-full max-w-[720px] overflow-hidden rounded-2xl bg-white shadow-2xl"
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
            <div className="max-h-[68vh] space-y-5 overflow-y-auto px-5 py-5">
              <Section icon="📖" title="What this is">
                A free, ad-free practice tool covering the official Life in the UK test — full
                24-question mock exams, individual test sets, and instant feedback. No sign-up,
                no paywall.
              </Section>

              <Section icon="👋" title="Who&rsquo;s behind it">
                Built and maintained by{' '}
                <a
                  href={COFFEE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-primary-600 underline decoration-primary-300 underline-offset-2 hover:text-primary-700"
                >
                  KS is Building
                </a>{' '}
                — a small solo project. <span className="font-medium text-gray-800">KS</span> is my
                initials (the GitHub name reads &ldquo;KSIS Building&rdquo;, but it&rsquo;s just
                &ldquo;KS is Building&rdquo;). Questions are drawn from the official Life in the UK
                handbook material.
              </Section>

              <Section icon="🌱" title="Built on open source">
                This site started as a fork of the excellent{' '}
                <a
                  href={ORIGINAL_REPO_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-primary-600 underline decoration-primary-300 underline-offset-2 hover:text-primary-700"
                >
                  domicch/life-in-uk
                </a>{' '}
                project. Huge thanks to the original author — I&rsquo;ve rebuilt the practice flow
                on top of their groundwork.
              </Section>

              <div className="flex gap-3">
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-base">
                  ✨
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-sm font-semibold text-gray-900">What&rsquo;s new in this version</h4>
                  <div className="mt-3 space-y-5">
                    <FeatureDemo
                      title="Collapsible Question Status"
                      src="/demos/collapsible-status.gif"
                      alt="The Question Status grid is collapsed by default so the question and Next button stay in view; tap to expand it, jump to any question, then collapse again."
                    >
                      The jump-to grid is tucked away by default, so you just answer and hit{' '}
                      <span className="font-medium text-gray-800">Next</span> — no scrolling. Over
                      hundreds of questions that saves a lot of time versus the original layout; tap
                      it open whenever you want to jump around.
                    </FeatureDemo>

                    <FeatureDemo
                      title="Focus Mode"
                      src="/demos/focus-mode.gif"
                      alt="Typing the keyword Parliament and starting Focus Mode builds a mini-test from every question mentioning it, with the keyword highlighted in the questions, answers and explanations."
                    >
                      Type <span className="font-medium text-gray-800">one word or a year</span> and
                      get a mini-test built from every question that mentions it — with the keyword
                      highlighted throughout. Great for drilling a single topic.
                    </FeatureDemo>

                    <FeatureDemo
                      title="Adapts to your screen"
                      src="/demos/responsive.gif"
                      alt="The quiz layout reflowing from a two-column desktop view down to a single column as the screen narrows to phone width."
                    >
                      The layout reflows from a two-column desktop view down to a single column on
                      phones and short laptops — the question and controls always stay in view.
                    </FeatureDemo>
                  </div>
                </div>
              </div>

              <Section icon="🎯" title="Why I built it">
                Citizenship prep is stressful and often costs money. I wanted a clean, honest,
                genuinely free way to practise — no ads, no data selling.
              </Section>

              {/* Buy Me a Coffee — invitation, never an obligation */}
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                <div className="flex gap-3">
                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-base">
                    ☕
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-sm font-semibold text-gray-900">Enjoying it?</h4>
                    <p className="mt-0.5 text-sm leading-relaxed text-gray-600">
                      This stays free, always. If it helped your prep and you feel like saying
                      thanks, you&rsquo;re welcome to buy me a coffee — completely optional, and
                      absolutely no pressure either way.
                    </p>
                    <a
                      href={COFFEE_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-flex items-center gap-2 rounded-lg bg-amber-400 px-3.5 py-2 text-sm font-semibold text-amber-950 shadow-sm transition-colors hover:bg-amber-300"
                    >
                      <span aria-hidden="true">☕</span>
                      Buy me a coffee
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Feedback footer */}
            <div className="border-t border-gray-100 bg-gray-50 px-5 py-4">
              <p className="text-sm text-gray-600">
                Spotted something, or have an idea? I&rsquo;d love to hear it.
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
