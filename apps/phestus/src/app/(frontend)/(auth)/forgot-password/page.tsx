'use client'

import Link from 'next/link'
import { useState } from 'react'
import { ForgotPassword } from '@/lib/ops/accounts'

export default function ForgotPasswordPage() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [submitted, setSubmitted] = useState(false)

    async function handleSubmit(formData: FormData) {
        setError('')
        setLoading(true)

        const result = await ForgotPassword({
            email: String(formData.get('email')),
        })

        setLoading(false)

        if (!result.success) {
            setError(
                result.error ||
                'There was a problem requesting a password reset.',
            )
            return
        }

        setSubmitted(true)
    }

    return (
        <div>
            <div className="mb-8">
                <p className="mb-3 text-[12px] font-medium uppercase tracking-[0.08em] text-[var(--theme-accent-600)]">
                    Account
                </p>

                <h1 className="m-0 font-[var(--font-body)] text-[36px] font-semibold leading-[1.05] tracking-[-0.04em] text-[var(--theme-elevation-950)]">
                    Reset your password.
                </h1>

                <p className="mt-4 text-[14px] leading-[1.6] text-[var(--theme-elevation-550)]">
                    Enter your email address and we'll send you a link to
                    reset your password.
                </p>
            </div>

            {submitted ? (
                <div className="rounded-[var(--style-radius-s)] border border-[var(--color-success-200)] bg-[var(--color-success-50)] px-4 py-4">
                    <p className="m-0 text-[13px] leading-[1.6] text-[var(--color-success-700)]">
                        If an account exists with that email address, we've
                        sent a password reset link.
                    </p>
                </div>
            ) : (
                <form
                    className="space-y-5"
                    action={handleSubmit}
                >
                    <div>
                        <label
                            htmlFor="email"
                            className="mb-2 block text-[12px] font-medium text-[var(--theme-elevation-700)]"
                        >
                            Email
                        </label>

                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            className="h-11 w-full rounded-[var(--style-radius-s)] border border-[var(--theme-elevation-200)] bg-[var(--theme-elevation-0)] px-3.5 text-[14px] text-[var(--theme-elevation-900)] outline-none transition-all placeholder:text-[var(--theme-elevation-400)] focus:border-[var(--theme-accent-500)] focus:ring-2 focus:ring-[var(--theme-accent-100)]"
                            placeholder="you@example.com"
                        />
                    </div>

                    {error && (
                        <div className="rounded-[var(--style-radius-s)] border border-[var(--color-error-200)] bg-[var(--color-error-50)] px-3.5 py-3 text-[13px] text-[var(--color-error-700)]">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="h-11 w-full rounded-[var(--style-radius-s)] bg-[var(--theme-accent-600)] px-4 text-[13px] font-medium text-white transition-colors hover:bg-[var(--theme-accent-700)] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {loading ? 'Sending...' : 'Send reset link'}
                    </button>
                </form>
            )}

            <div className="mt-8 border-t border-[var(--theme-elevation-150)] pt-6 text-center">
                <Link
                    href="/login"
                    className="inline-flex items-center gap-2 text-[13px] font-medium text-[var(--theme-accent-600)] no-underline hover:text-[var(--theme-accent-700)]"
                >
                    <svg
                        className="h-3.5 w-3.5"
                        viewBox="0 0 16 16"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        aria-hidden="true"
                    >
                        <path d="M13 8H3" />
                        <path d="m7 4-4 4 4 4" />
                    </svg>
                    Back to login
                </Link>
            </div>
        </div>
    )
}